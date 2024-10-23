import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface RoomProps {
  stream: MediaStream | null;
  socket: Socket;
  peer: Peer | null;
  roomId: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  onLeaveRoom: () => void;
}

const Room: React.FC<RoomProps> = ({
  stream,
  socket,
  peer,
  roomId,
  isAudioEnabled,
  isVideoEnabled,
  toggleAudio,
  toggleVideo,
  onLeaveRoom,
}) => {
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
            <h2 className="mb-2 text-xl font-semibold">Peer Video</h2>
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
      {/* Control buttons for audio and video */}
      <div className="mb-2 flex space-x-2 pt-12">
        <button
          onClick={toggleVideo}
          className={`flex items-center rounded p-2 ${
            isVideoEnabled ? "bg-blue-500" : "bg-red-500"
          } text-white`}
        >
          {isVideoEnabled ? (
            <Video className="mr-2 h-5 w-5" />
          ) : (
            <VideoOff className="mr-2 h-5 w-5" />
          )}
          {isVideoEnabled ? "Disable Video" : "Enable Video"}
        </button>
        <button
          onClick={toggleAudio}
          className={`flex items-center rounded p-2 ${
            isAudioEnabled ? "bg-blue-500" : "bg-red-500"
          } text-white`}
        >
          {isAudioEnabled ? (
            <Mic className="mr-2 h-5 w-5" />
          ) : (
            <MicOff className="mr-2 h-5 w-5" />
          )}
          {isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
        </button>
      </div>
      <button
        onClick={onLeaveRoom} // Leave room button
        className="mt-4 w-1/2 rounded bg-red-500 p-2 text-white"
      >
        Leave Room
      </button>
    </div>
  );
};

export default Room;
