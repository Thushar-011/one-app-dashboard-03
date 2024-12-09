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
        throw error;
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
      toast.error('Failed to load chat history');
    }
  };

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      console.log('Sending message:', message);
      
      // Add user message to UI immediately
      const userMessage: Message = { sender: 'user', text: message };
      setMessages(prev => [...prev, userMessage]);

      // Call Supabase Edge Function for AI response
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message }
      });

      console.log('Edge function response:', data);

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      // Handle quota exceeded error
      if (data?.isQuotaError) {
        toast.error('The AI service is temporarily unavailable. Please try again later.');
        setMessages(prev => prev.slice(0, -1)); // Remove user message
        return;
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      const botMessage: Message = { 
        sender: 'bot', 
        text: data.response
      };

      // Add bot message to UI
      setMessages(prev => [...prev, botMessage]);

      // Save to database
      const { error: dbError } = await supabase
        .from('chat_messages')
        .insert({
          message: message,
          response: botMessage.text
        });

      if (dbError) {
        console.error('Database error:', dbError);
        toast.error('Failed to save message to history');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('quota')) {
        toast.error('The AI service is temporarily unavailable. Please try again later.');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
      
      // Remove the user message if the AI response failed
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