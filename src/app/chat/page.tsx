"use client";

import Logo from "@/components/ui/logo";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { IoPerson } from "react-icons/io5";
import { useSearchParams } from "next/navigation";

export default function DiagnosisFromSymptoms() {
  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat();

  const messagesEndRef = useRef(null);
  const params = useSearchParams();

  const [hasSentInitialMessage, setHasSentInitialMessage] = useState(false);

  useEffect(() => {
    let dataString = "";
    params.keys().forEach(key => {
      dataString += `${key}: ${params.get(key)}. `
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
      <div className="h-screen w-screen py-[88px] relative">
        <div className="fixed top-0 right-0 left-0 h-20 bg-bg z-20"></div>
        <div className="fixed bottom-0 right-0 left-0 h-20 bg-bg z-10"></div>
        <div className="w-full flex flex-col space-y-8 items-center py-12 pb-32">
          {messages.slice(1).map(m => (
            <div key={m.id} className="w-full flex flex-col items-center  px-4 pl-[72px] ">
              <div className="w-full max-w-6xl relative ">
                <div className="absolute -translate-x-[56px] ">{
                  m.role == "user" ?
                    <div className="border border-bg-extralight bg-bg-light rounded-full flex items-center justify-center p-2 w-10 h-10"><IoPerson className="w-full h-full" color="#14616e" /></div> :
                    <Logo backgroundColor="transparent" className="w-10 p-1 border border-bg-extralight bg-bg-light rounded-full flex items-center justify-center" />
                }</div>
                <ReactMarkdown className="
              prose min-h-10 h-full flex flex-col justify-center space-y-4 py-auto w-full prose-strong:text-text-light prose-ol:before:text-white prose-li:marker:text-text
              ">{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full fixed flex justify-center bottom-0 pb-10 z-50">
        <input
          className="w-full max-w-7xl placeholder:text-text/60 h-12 mx-4 bg-bg-light/80 border border-bg-extralight rounded-full px-8 outline-none"
          value={input}
          placeholder="Send a Message"
          onChange={handleInputChange}
        />
      </form>
    </>
  )
}
