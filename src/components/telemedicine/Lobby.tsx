import React, { useRef, useEffect } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";

interface LobbyProps {
  stream: MediaStream | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  onJoinRoom: () => void;
  roomId: string;
  setRoomId: (id: string) => void;
  onLeaveLobby: () => void;
}

const Lobby: React.FC<LobbyProps> = ({
  stream,
  isAudioEnabled,
  isVideoEnabled,
  toggleAudio,
  toggleVideo,
  onJoinRoom,
  roomId,
  setRoomId,
  onLeaveLobby,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    if (videoRef2.current && stream) {
      videoRef2.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center">
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
        <div className="w-[400px]">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="h-full w-32 text-center"
          />
        </div>

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

        <div className="flex space-x-4">
          <button
            onClick={onLeaveLobby}
            className="flex h-full w-48 items-center justify-center rounded-lg border border-red-500/80 bg-red-500/10 p-2 px-8 font-bold text-red-500"
          >
            Leave Lobby
          </button>
          <button
            onClick={onJoinRoom}
            className="flex h-full w-48 items-center justify-center rounded-lg border border-primary/80 bg-primary/10 p-2 px-8 font-bold text-primary"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
