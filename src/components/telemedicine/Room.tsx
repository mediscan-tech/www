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
      <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex items-start">
        <video ref={videoRef} autoPlay muted playsInline className="absolute w-full h-full -z-10 bg-transparent" />
        <video ref={videoRef2} autoPlay muted playsInline className="absolute w-full h-full -z-20 bg-transparent scale-150 blur-xl opacity-50" />
      </div>
      <div className="fixed bottom-0 right-0 left-0 h-20 w-full backdrop-blur-3xl flex bg-bg/80 border-t-2 border-bg-extralight p-4 justify-between space-x-4">
        <button
          onClick={onLeaveRoom}
          className="w-48 px-8 h-full flex items-center justify-center border font-bold text-red-500 bg-red-500/10 border-red-500/80 rounded-lg p-2"
        >
          Leave Lobby
        </button>

        <div className="space-x-4">
          <button onClick={toggleVideo} className={`h-full aspect-square border rounded-lg p-1 ${isVideoEnabled ? "border-primary bg-primary/10" : "border-red-500 bg-red-500/10"}`}>
            {isVideoEnabled ?
              <IoVideocamOutline className="w-full h-full text-primary" /> :
              <IoVideocamOffOutline className="w-full h-full text-red-500" />
            }
          </button>

          <button onClick={toggleAudio} className={`h-full aspect-square border rounded-lg p-1 ${isAudioEnabled ? "border-primary bg-primary/10" : "border-red-500 bg-red-500/10"}`}>
            {isAudioEnabled ?
              <AiOutlineAudio className="w-full h-full text-primary" /> :
              <AiOutlineAudioMuted className="w-full h-full text-red-500" />
            }
          </button>
        </div>
      </div>

    </div>
  );
};

export default Room;
