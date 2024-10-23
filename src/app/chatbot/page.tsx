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
    <>
      <div className="h-screen w-screen py-[88px]">
        <div className="w-full h-full overflow-scroll flex flex-col items-center py-16">
          {messages.map(m => (
            <div key={m.id} className="w-full max-w-4xl px-4">
              {m.role == "user" ? "User: " : "AI: "}
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full fixed flex justify-center bottom-0 pb-10">
        <input
          className="w-full max-w-7xl placeholder:text-text/60 h-12 mx-32 bg-bg-light border border-bg-extralight rounded-full px-8 outline-none"
          value={input}
          placeholder="Send a Message"
          onChange={handleInputChange}
        />
      </form>
    </>
  )
}
