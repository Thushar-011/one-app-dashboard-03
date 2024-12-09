import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Message = {
  id?: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      console.log('Loading chat history...');
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      console.log('Loaded messages:', messages);
      if (messages) {
        const formattedMessages = messages.map((msg) => ([
          { sender: 'user' as const, text: msg.message },
          { sender: 'bot' as const, text: msg.response }
        ])).flat();
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      console.log('Sending message:', message);
      
      const userMessage: Message = { sender: 'user', text: message };
      setMessages(prev => [...prev, userMessage]);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message }
      });

      console.log('Edge function response:', data);

      if (error) {
        console.error('Edge function error:', error);
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (data?.isQuotaError) {
        toast.error('The AI service is temporarily unavailable. Please try again later.');
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (!data?.response) {
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      const botMessage: Message = { 
        sender: 'bot', 
        text: data.response
      };

      setMessages(prev => [...prev, botMessage]);

      await supabase
        .from('chat_messages')
        .insert({
          message: message,
          response: botMessage.text
        });

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}