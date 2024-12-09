import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "./ui/scroll-area";

export const Chatbot = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const message = input.trim();
      setInput('');
      await sendMessage(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white/50 backdrop-blur-sm rounded-lg relative">
      <div className="flex-1 overflow-hidden pt-8"> {/* Added pt-8 to prevent overlap with close button */}
        <ScrollArea className="h-[calc(100vh-8rem)]"> {/* Adjusted height to account for input area */}
          <div className="space-y-4 px-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-lg font-medium">Welcome to AI Assistant</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  msg.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg shadow-sm",
                    msg.sender === 'user' 
                      ? "bg-[#8B5CF6] text-white rounded-br-none" 
                      : "bg-[#F3F4F6] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-[#E5E7EB] dark:border-zinc-700"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm mt-auto w-full">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="px-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}