"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import { useRouter } from "next/navigation";
import { useMediaStream } from "@/hooks/useMediaStream";
import Lobby from "@/components/telemedicine/Lobby";
import Room from "@/components/telemedicine/Room";

export default function TempVideoCall() {
  const [isLobby, setIsLobby] = useState(true);
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const socketRef = useRef<any>(null);
  const peerRef = useRef<Peer | null>(null);
  const router = useRouter();
  const { stream, isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo } =
    useMediaStream();

  useEffect(() => {
    const initializeConnection = async () => {
      socketRef.current = io("https://video.mediscan.care/");

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socketRef.current.on("connect_error", (error: Error) => {
        console.error("Socket.IO connection error:", error);
      });

      peerRef.current = new Peer();

      peerRef.current.on("open", (id) => {
        console.log("PeerJS connection opened with ID:", id);
      });
    };

    initializeConnection();

    return () => {
      socketRef.current?.disconnect();
      peerRef.current?.destroy();
    };
  }, []);

  const handleJoinRoom = () => {
    if (!roomId || !peerRef.current || !socketRef.current || !stream) return;

    setIsLobby(false);
    socketRef.current.emit("room:join", {
      roomId,
      user: { id: peerRef.current.id, name: "User" }, // Replace with actual user name
    });
  };

  const joinRoom = () => {
    setInRoom(true);
  };

  const leaveLobby = () => {
    router.push("/schedule");
  };

  const leaveRoom = () => {
    router.push("/schedule");
  };

  return (
    <div className="p-4 pb-16 pt-32">
      {isLobby ? (
        <Lobby
          stream={stream}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          onJoinRoom={handleJoinRoom}
          roomId={roomId}
          setRoomId={setRoomId}
          onLeaveLobby={leaveLobby}
        />
      ) : (
        <Room
          stream={stream}
          socket={socketRef.current}
          peer={peerRef.current}
          roomId={roomId}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          onLeaveRoom={leaveRoom}
        />
      )}
    </div>
  );
}
