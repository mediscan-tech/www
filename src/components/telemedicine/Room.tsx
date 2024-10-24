import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";
import { useUser } from "@clerk/clerk-react";

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
  const { user } = useUser();
  const profilePicture = user?.imageUrl || "";

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
      <div className="fixed right-4 top-4 z-30">
        <div className="h-96 w-96">
          <video
            ref={videoRef2}
            autoPlay
            muted
            playsInline
            className="w-full rounded-2xl border-2 border-bg-extralight"
          />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 top-0 flex h-screen w-screen items-start">
        <video
          autoPlay
          playsInline
          ref={(el) => {
            if (Object.entries(peers)[0]) {
              const [userId, stream] = Object.entries(peers)[0];
              if (el) el.srcObject = stream;
            }
          }}
          className="absolute -z-10 h-full w-full bg-transparent"
        />
        <video
          autoPlay
          playsInline
          ref={(el) => {
            if (Object.entries(peers)[0]) {
              const [userId, stream] = Object.entries(peers)[0];
              if (el) el.srcObject = stream;
            }
          }}
          className="absolute -z-20 h-full w-full scale-150 bg-transparent opacity-50 blur-xl"
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex h-20 w-full justify-between space-x-4 border-t-2 border-bg-extralight bg-bg/80 p-4 backdrop-blur-3xl">
        <button
          onClick={onLeaveRoom}
          className="flex h-full w-48 items-center justify-center rounded-lg border border-red-500/80 bg-red-500/10 p-2 px-8 font-bold text-red-500"
        >
          Leave Room
        </button>

        <div className="space-x-4">
          <button
            onClick={toggleVideo}
            className={`aspect-square h-full rounded-lg border p-1 ${
              isVideoEnabled
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
            className={`aspect-square h-full rounded-lg border p-1 ${
              isAudioEnabled
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
