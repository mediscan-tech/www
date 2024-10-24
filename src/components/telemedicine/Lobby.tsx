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
      <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex items-start">
        <video ref={videoRef} autoPlay muted playsInline className="absolute w-full h-full -z-10 bg-transparent" />
        <video ref={videoRef2} autoPlay muted playsInline className="absolute w-full h-full -z-20 bg-transparent scale-150 blur-xl opacity-50" />
      </div>
      <div className="fixed bottom-0 right-0 left-0 h-20 w-full backdrop-blur-3xl flex bg-bg/80 border-t-2 border-bg-extralight p-4 justify-between space-x-4">
        <div className="w-[400px]">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="w-32 text-center h-full"
          />
        </div>

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

        <div className="space-x-4 flex">
          <button
            onClick={onLeaveLobby}
            className="w-48 px-8 h-full flex items-center justify-center border font-bold text-red-500 bg-red-500/10 border-red-500/80 rounded-lg p-2"
          >
            Leave Lobby
          </button>
          <button
            onClick={onJoinRoom}
            className="w-48 px-8 h-full flex items-center justify-center border font-bold text-primary bg-primary/10 border-primary/80 rounded-lg p-2"
          >
            Join Room
          </button>
        </div>
      </div>

    </div>
  );
};

export default Lobby;
