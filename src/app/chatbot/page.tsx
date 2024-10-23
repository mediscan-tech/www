"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function DiagnosisFromSymptoms() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex min-h-screen w-screen flex-col items-center pt-48">
      {messages.map((m) => (
        <div key={m.id} className="w-full max-w-4xl px-4">
          {m.role == "user" ? "User: " : "AI: "}
          <ReactMarkdown>{m.content}</ReactMarkdown>
        </div>
      ))}
      <div className="h-48"></div>
      <div ref={messagesEndRef} />

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 flex w-full justify-center pb-12"
      >
        <input
          className="mx-32 h-16 w-full max-w-7xl rounded-full border border-bg-extralight bg-bg-light px-8 outline-none placeholder:text-text/60"
          value={input}
          placeholder="Send a Message"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
