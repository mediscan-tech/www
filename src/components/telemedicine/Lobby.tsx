import React, { useRef, useEffect } from "react";

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

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-2xl font-bold">Video Preview</h1>
      <video ref={videoRef} autoPlay muted playsInline className="mb-4 w-1/2 rounded-2xl" />
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
        className="mb-2 w-1/2 border p-2"
      />
      <div className="mb-2 flex space-x-2">
        <button
          onClick={toggleVideo}
          className={`rounded p-2 ${isVideoEnabled ? "bg-blue-500" : "bg-red-500"
            } text-white`}
        >
          {isVideoEnabled ? "Disable Video" : "Enable Video"}
        </button>
        <button
          onClick={toggleAudio}
          className={`rounded p-2 ${isAudioEnabled ? "bg-blue-500" : "bg-red-500"
            } text-white`}
        >
          {isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
        </button>
      </div>
      <button
        onClick={onJoinRoom}
        className="w-1/2 rounded bg-green-500 p-2 text-white"
      >
        Join Room
      </button>
      <button
        onClick={onLeaveLobby}
        className="mt-2 w-1/2 rounded bg-red-500 p-2 text-white"
      >
        Leave Lobby
      </button>
    </div>
  );
};

export default Lobby;
