import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/config';
import { supabase } from '../utils/supabase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { SearchIcon } from './svgs/AuthIcons';

interface Message {
  role: 'User' | 'Assistant';
  content: string;
}

interface Source {
  title: string;
  url: string;
}

export default function ChatInterface({
  conversationId,
  onConversationStarted
}: {
  conversationId?: string,
  onConversationStarted: (id: string) => void
}) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    } else {
      setMessages([]);
      setSources([]);
    }
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchConversation() {
    try {
      const response = await api.get(`/conversation/${conversationId}`);
      const conversation = response.data;
      setMessages(conversation.messages || []);
      // Sources are stored in the first assistant message or we'd need a better backend schema.
      // For now, let's just show the messages.
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  }

  async function handleSend() {
    if (!query.trim()) return;

    const userQuery = query;
    setQuery('');
    setIsLoading(true);

    try {
      const endpoint = conversationId ? '/ask/follow_up' : '/ask';
      const url = `http://localhost:3000${endpoint}`;
      const payload = conversationId
        ? { conversationId, query: userQuery }
        : { query: userQuery };

      // Add user message to UI immediately
      setMessages((prev) => [...prev, { role: 'User' as const, content: userQuery }]);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is not a stream');

      const decoder = new TextDecoder();
      let aiContent = '';
      let sourcesPart = '';
      let isReadingSources = false;

      setMessages((prev) => [...prev, { role: 'Assistant' as const, content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes('------SOURCES------')) {
          isReadingSources = true;
          sourcesPart += chunk.split('------SOURCES------')[1];
          continue;
        }

        if (isReadingSources) {
          sourcesPart += chunk;
        } else {
          aiContent += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'Assistant') {
              return [...prev.slice(0, -1), { ...last, content: aiContent }];
            }
            return prev;
          });
        }
      }

      if (sourcesPart) {
        try {
          const parsedSources = JSON.parse(sourcesPart);
          setSources(parsedSources);
        } catch (e) {
          console.error("Failed to parse sources:", e);
        }
      }

    } catch (error) {
      console.error("Error sending query:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-warm-800 border border-warm-700 flex items-center justify-center mb-6">
            <SearchIcon />
          </div>
          <h1 className="text-3xl font-bold text-warm-50 mb-8 tracking-tight">What do you want to know?</h1>

          <div className="w-full relative group">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="w-full py-6 pl-5 pr-16 rounded-xl bg-warm-900 border-warm-800 text-warm-50 focus:border-warm-600 transition-all shadow-elevated"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-warm-50 text-warm-950 hover:bg-warm-100 disabled:bg-warm-800 disabled:text-warm-600 transition-colors"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-warm-950 border-t-transparent animate-spin rounded-full" /> : 'Search'}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['Quantum Computing', 'Latest AI Trends', 'Healthy Recipes', 'Space Exploration'].map(tag => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); }}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-warm-400 bg-warm-900 border border-warm-800 hover:border-warm-600 hover:text-warm-200 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-24 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'User' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'Assistant' && (
                  <div className="w-8 h-8 rounded-full bg-warm-800 border border-warm-700 flex items-center justify-center flex-shrink-0">
                    <SearchIcon />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'User'
                    ? 'bg-warm-800 text-warm-50 rounded-tr-sm'
                    : 'bg-transparent text-warm-50 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {sources.length > 0 && (
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-warm-900/50 border border-warm-800/50 animate-slideIn">
                <p className="text-[10px] font-bold tracking-widest uppercase text-warm-500">Sources</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md bg-warm-800/50 border border-warm-700/50 hover:border-warm-500 transition-colors flex items-center gap-3 group"
                    >
                      <span className="text-xs font-bold text-warm-600 group-hover:text-warm-400">{i+1}</span>
                      <span className="text-xs font-medium truncate text-warm-300">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-warm-950 via-warm-950 to-transparent">
            <div className="max-w-3xl mx-auto relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a follow up..."
                className="w-full py-4 pl-5 pr-16 rounded-xl bg-warm-900 border-warm-800 text-warm-50 focus:border-warm-600 transition-all shadow-elevated"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-warm-50 text-warm-950 hover:bg-warm-100 disabled:bg-warm-800 disabled:text-warm-600 transition-colors"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-warm-950 border-t-transparent animate-spin rounded-full" /> : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}