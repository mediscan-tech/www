import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!stream || !peer || !socket) return;

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    if (videoRef2.current && stream) {
      videoRef2.current.srcObject = stream;
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
      <div className="fixed top-0 right-0 z-30">
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
      <div className="fixed bottom-0 left-0 right-0 top-0 flex h-screen w-screen items-start">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute -z-10 h-full w-full bg-transparent"
        />
        <video
          ref={videoRef2}
          autoPlay
          muted
          playsInline
          className="absolute -z-20 h-full w-full scale-150 bg-transparent opacity-50 blur-xl"
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex h-20 w-full justify-between space-x-4 border-t-2 border-bg-extralight bg-bg/80 p-4 backdrop-blur-3xl">
        <button
          onClick={onLeaveRoom}
          className="flex h-full w-48 items-center justify-center rounded-lg border border-red-500/80 bg-red-500/10 p-2 px-8 font-bold text-red-500"
        >
          Leave Lobby
        </button>

        <div className="space-x-4">
          <button
            onClick={toggleVideo}
            className={`aspect-square h-full rounded-lg border p-1 ${isVideoEnabled
              ? "border-primary bg-primary/10"
              : "border-red-500 bg-red-500/10"
              }`}
          >
            {isVideoEnabled ? (
              <IoVideocamOutline className="h-full w-full text-primary" />
            ) : (
              <IoVideocamOffOutline className="h-full w-full text-red-500" />
            )}
          </button>

          <button
            onClick={toggleAudio}
            className={`aspect-square h-full rounded-lg border p-1 ${isAudioEnabled
              ? "border-primary bg-primary/10"
              : "border-red-500 bg-red-500/10"
              }`}
          >
            {isAudioEnabled ? (
              <AiOutlineAudio className="h-full w-full text-primary" />
            ) : (
              <AiOutlineAudioMuted className="h-full w-full text-red-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
