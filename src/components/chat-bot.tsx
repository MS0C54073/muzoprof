
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Bot, Loader2, Send, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chatWithMuzo, type ChatInput } from '@/ai/flows/chat-flow';
import { MuzoInTechLogo } from './icons';
import TranslatedText from '@/app/components/translated-text';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setIsLoading(true);
        setTimeout(() => {
            setMessages([
                { role: 'model', content: "Hi! I'm Muzo, an AI assistant. How can I help you learn more about Musonda Salimu today?" }
            ]);
            setIsLoading(false);
        }, 1000);
    }
  }, [isOpen, messages.length]);


  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
        const chatInput: ChatInput = {
            message: input,
            history: messages,
        };
        const { response } = await chatWithMuzo(chatInput);
        
        setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
        console.error("Chatbot error:", error);
        setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
        setIsLoading(false);
    }
  };
  

  return (
    <>
      <div className={cn(
        "fixed bottom-6 z-50 transition-all duration-300 ease-in-out group",
        isOpen ? 'right-[-200px] lg:right-[-250px]' : 'right-6',
        'lg:bottom-28 lg:right-8'
      )}>
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className={cn(
            'h-14 rounded-full shadow-xl overflow-hidden',
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            'hover:shadow-2xl active:scale-95',
            'transition-all duration-300 ease-in-out',
            'w-14 group-hover:w-52' // Expand width on hover
          )}
          aria-label="Open chatbot"
        >
          <div className="flex items-center justify-start pl-0.5">
            <Bot className="h-7 w-7 flex-shrink-0" />
            <span className="whitespace-nowrap pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150">
                <TranslatedText text="Chat with Muzo" />
            </span>
          </div>
        </Button>
      </div>

      <div
        className={cn(
          'fixed bottom-0 right-0 z-50 m-4 h-[70vh] w-[90vw] max-w-sm transform transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+2rem)] opacity-0',
          'flex flex-col rounded-lg border bg-card text-card-foreground shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MuzoInTechLogo className="h-8 w-8" />
            <h3 className="text-lg font-semibold">Muzo AI Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5"/>
                  </div>
                )}
                 <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5"/>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 justify-start">
                 <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5"/>
                  </div>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my skills..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
