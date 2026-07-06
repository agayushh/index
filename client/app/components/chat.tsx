"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! Ask me anything about the documents you've uploaded.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    setInput("");
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(userMessageText)}`
      );
      if (!response.ok) throw new Error("Failed to fetch response");
      
      const data = await response.json();
      console.log(data)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.result || "No response received.",
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please make sure the server is running and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-100 font-sans border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Glow effect at the top */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/40 border-b border-zinc-900 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-200 text-sm flex items-center gap-1.5">
              AI Document Assistant
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            </h2>
            <p className="text-[10px] text-zinc-500">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-75 max-h-[60vh] md:max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`p-2 rounded-lg border shrink-0 ${
                  isUser
                    ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-violet-600 text-white rounded-tr-none shadow-[0_4px_12px_rgba(139,92,246,0.15)]"
                    : "bg-zinc-900/60 text-zinc-300 border border-zinc-900 rounded-tl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-start gap-3 mr-auto max-w-[85%]">
            <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-900 rounded-tl-none flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              <span className="text-xs text-zinc-500">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-zinc-900/20 border-t border-zinc-900 backdrop-blur-md flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the document..."
          className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
