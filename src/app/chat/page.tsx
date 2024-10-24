"use client";

import Logo from "@/components/ui/logo";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { IoPerson } from "react-icons/io5";
import { useSearchParams } from "next/navigation";

export default function DiagnosisFromSymptoms() {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat();

  const messagesEndRef = useRef(null);
  const params = useSearchParams();

  const [hasSentInitialMessage, setHasSentInitialMessage] = useState(false);

  useEffect(() => {
    let dataString = "";
    params.keys().forEach((key) => {
      dataString += `${key}: ${params.get(key)}. `;
    });
    setInput(dataString);
  }, []);

  useEffect(() => {
    console.log(input);
    if (hasSentInitialMessage != true) {
      handleSubmit();
    }
    if (input != "") {
      setHasSentInitialMessage(true);
    }
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="relative h-screen w-screen py-[88px]">
        <div className="fixed left-0 right-0 top-0 z-20 h-20 bg-bg"></div>
        <div className="fixed bottom-0 left-0 right-0 z-10 h-20 bg-bg"></div>
        <div className="flex w-full flex-col items-center space-y-8 py-12 pb-32">
          {messages.slice(1).map((m) => (
            <div
              key={m.id}
              className="flex w-full flex-col items-center  px-4 pl-[72px] "
            >
              <div className="relative w-full max-w-6xl ">
                <div className="absolute -translate-x-[56px] ">
                  {m.role == "user" ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-bg-extralight bg-bg-light p-2">
                      <IoPerson className="h-full w-full" color="#14616e" />
                    </div>
                  ) : (
                    <Logo
                      backgroundColor="transparent"
                      className="flex w-10 items-center justify-center rounded-full border border-bg-extralight bg-bg-light p-1"
                    />
                  )}
                </div>
                <ReactMarkdown
                  className="
              py-auto prose flex h-full min-h-10 w-full flex-col justify-center space-y-4 prose-strong:text-text-light prose-ol:before:text-white prose-li:marker:text-text
              "
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 z-50 flex w-full justify-center pb-10"
      >
        <input
          className="mx-4 h-12 w-full max-w-7xl rounded-full border border-bg-extralight bg-bg-light/80 px-8 outline-none placeholder:text-text/60"
          value={input}
          placeholder="Send a Message"
          onChange={handleInputChange}
        />
      </form>
    </>
  );
}
