"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function DiagnosisFromSymptoms() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <>
      <div className="w-screen pt-48 min-h-screen flex flex-col items-center">
        {messages.map(m => (
          <div key={m.id} className="w-full max-w-4xl px-4">
            {m.role == "user" ? "User: " : "AI: "}
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="w-full sticky flex justify-center bottom-0 pb-12">
        <input
          className="w-full max-w-xl placeholder:text-center placeholder:text-text/60 mx-4 h-16 bg-bg-light/80 border border-bg-extralight rounded-full px-8 outline-none"
          value={input}
          placeholder="Send a Message"
          onChange={handleInputChange}
        />
      </form>
    </>
  )
}