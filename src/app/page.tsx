'use client'
import React, { useRef, useEffect, useState } from 'react';
import '@/styles/global.css';
import CommonLayout from './commonLayout';
import { ChatMessages, ChatInput } from '@/components/chatComponents';
import { useSession } from '@/hooks/sessionHook';

interface ChatResponse {
  message: any;
}

function App() {
  const { sessionId, messages, setMessages, resetSession } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  
  // New state for provider selection
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, []);

  // Fetch available providers for dropdown
  useEffect(() => {
    fetch('/api/modelProviders')
      .then(res => res.json())
      .then(data => {
        setProviders(data);
        if(data.length > 0){
          setSelectedProvider(data[0].id);
        }
      });
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  };

  const sendMessage = async (message: string) => {
    try {
      const response = await fetch(`/api/coffeechat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId
        },
        body: JSON.stringify({ message, provider: selectedProvider })
      });
      const data = await response.json();
      console.log('Response:', data);
      return data;
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleSendMessage = (input: string) => {
    const newMessage = {
      role: "user",
      provider: selectedProvider, // include provider in message object
      content: [
        {
          text: input
        }
      ]
    };
    setMessages([...messages, newMessage]);
    scrollToBottom();
    setIsLoading(true);

    sendMessage(input).then((response:ChatResponse ) => {
      const botMessage = {
        ...response.message,
        provider: selectedProvider // Ensure bot response includes provider
      };
      setMessages([...messages, newMessage, botMessage]);
      setIsLoading(false);
      scrollToBottom();
    });
  };

  return (
    <CommonLayout 
      title="Coffee Chatbot"
      navLink={{ text: "View Telemetry", href: "/s3" }}
      mainClassName="h-screen overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between mb-4">
          {/* Dropdown for model provider selection */}
          <select 
            value={selectedProvider} 
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 border border-gray-300 
              rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={resetSession}
            title="Clear chat history"
            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-red-600 
              border border-gray-300 hover:border-red-300 rounded-md transition-colors
              bg-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Clear Chat
          </button>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} isLoading={isLoading} currentProvider={selectedProvider}/>
            <div ref={messagesEndRef} />
          </div>
          <ChatInput 
            onSendMessage={handleSendMessage} 
            ref={inputFieldRef}
            autoFocus={true}
            className="focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          />
        </div>
      </div>
    </CommonLayout>
  );
}

export default App;