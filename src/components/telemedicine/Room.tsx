// components/telemedicine/Room.tsx
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";

interface RoomProps {
  stream: MediaStream | null;
  socket: Socket;
  peer: Peer | null;
  roomId: string;
}

const Room: React.FC<RoomProps> = ({ stream, socket, peer, roomId }) => {
  const [peers, setPeers] = useState<Record<string, MediaStream>>({});
  const userVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!stream || !peer || !socket) return;

    if (userVideoRef.current) {
      userVideoRef.current.srcObject = stream;
    }

    socket.on("user:joined", ({ id, name }) => {
      console.log("New user joined:", name);
      const call = peer.call(id, stream);
      call.on("stream", (userVideoStream) => {
        setPeers((prevPeers) => ({
          ...prevPeers,
          [id]: userVideoStream,
        }));
      });
    });

    peer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        setPeers((prevPeers) => ({
          ...prevPeers,
          [call.peer]: userVideoStream,
        }));
      });
    });

    socket.on("user:disconnected", (userId) => {
      console.log("User disconnected:", userId);
      setPeers((prevPeers) => {
        const newPeers = { ...prevPeers };
        delete newPeers[userId];
        return newPeers;
      });
    });

    return () => {
      socket.off("user:joined");
      socket.off("user:disconnected");
    };
  }, [stream, peer, socket]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-2xl font-bold">Room: {roomId}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Your Video</h2>
          <video
            ref={userVideoRef}
            muted
            autoPlay
            playsInline
            className="w-full"
          />
        </div>
        {Object.entries(peers).map(([userId, stream]) => (
          <div key={userId}>
            <h2 className="mb-2 text-xl font-semibold">
              Peer Video ({userId})
            </h2>
            <video
              autoPlay
              playsInline
              ref={(el) => {
                if (el) el.srcObject = stream;
              }}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
