import { useState, useEffect, useRef } from 'react';
import { api } from '../api/config';
import { supabase } from '../utils/supabase';

interface Message {
  role: 'User' | 'Assistant';
  content: string;
}

interface Source {
  title: string;
  url: string;
}

interface ParsedAssistantContent {
  title: string;
  answer: string;
  followUps: string[];
}

function parseAssistantContent(content: string): ParsedAssistantContent {
  const titleMatch = content.match(/<TITLE>([\s\S]*?)<\/TITLE>/i);
  const answerMatch = content.match(/<ANSWER>([\s\S]*?)<\/ANSWER>/i);
  const followUpsMatch = content.match(/<FOLLOW_UPS>([\s\S]*?)<\/FOLLOW_UPS>/i);

  const followUps = followUpsMatch
    ? Array.from(followUpsMatch[1].matchAll(/<question>([\s\S]*?)<\/question>/gi)).map(
        (match) => match[1].trim()
      ).filter(Boolean)
    : [];

  let title = '';
  let answer = content.replace(/<FOLLOW_UPS>[\s\S]*?<\/FOLLOW_UPS>/i, '').trim();

  if (titleMatch || answerMatch) {
    title = titleMatch?.[1].trim() ?? '';

    if (answerMatch) {
      answer = answerMatch[1].trim();
    } else if (titleMatch) {
      const parts = content.split(/<\/TITLE>/i);
      if (parts.length > 1) {
        answer = parts[1].replace(/<ANSWER>/i, '').replace(/<FOLLOW_UPS>[\s\S]*?<\/FOLLOW_UPS>/i, '').trim();
      }
    }
  }

  return { title, answer, followUps };
}

function FormattedMessage({ content }: { content: string }) {
  const { title, answer } = parseAssistantContent(content);

  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-cyber-primary">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-xl md:text-2xl font-bold text-white border-l-2 border-cyber-primary pl-4 py-1">
          {formatText(title)}
        </h3>
      )}
      <div className="text-[15px] md:text-base leading-relaxed text-cyber-200 whitespace-pre-wrap font-mono">
        {formatText(answer)}
      </div>
    </div>
  );
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
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const normalizeSourceItem = (item: Source | string): Source => {
    if (typeof item === 'string') {
      try {
        const url = new URL(item);
        return { title: url.hostname, url: item };
      } catch {
        return { title: item, url: item };
      }
    }
    return item;
  };

  const getSourceHostname = (sourceUrl: string) => {
    try {
      return new URL(sourceUrl).hostname;
    } catch {
      return sourceUrl;
    }
  };

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setSources([]);
      setFollowUps([]);
      return;
    }

    const loadConversation = async () => {
      setMessages([]);
      setSources([]);
      setFollowUps([]);

      try {
        const response = await api.get(`/conversation/${conversationId}`);
        const conversation = response.data;
        setMessages(conversation.messages || []);
        setSources((conversation.sources || []).map(normalizeSourceItem));

        const assistantWithSources = conversation.messages?.find((m: Message) => 
          m.role === 'Assistant' && m.content.includes('------SOURCES------')
        );

        if (assistantWithSources) {
          const parts = assistantWithSources.content.split('------SOURCES------');
          try {
            setSources(JSON.parse(parts[1]).map(normalizeSourceItem));
          } catch (e) {
            console.error("Failed to parse historical sources:", e);
          }
        }

        const latestAssistant = conversation.messages?.slice().reverse().find((m: Message) => m.role === 'Assistant');
        if (latestAssistant) {
          setFollowUps(parseAssistantContent(latestAssistant.content).followUps);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      
      // Show scroll-to-bottom button when user scrolls up from bottom
      setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 400);
      lastScrollTop.current = scrollTop;
    };

    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', handleScroll);
    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current && !showScrollBottom) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showScrollBottom]);

  async function handleSend(forcedQuery?: string) {
    const userQuery = forcedQuery || query;
    if (!userQuery.trim()) return;

    if (!forcedQuery) setQuery('');
    setIsLoading(true);
    setSources([]);
    setFollowUps([]);

    try {
      const endpoint = conversationId ? '/ask/follow_up' : '/ask';
      const url = `http://localhost:3000${endpoint}`;
      const payload = conversationId
        ? { conversationId, query: userQuery }
        : { query: userQuery };

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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is not a stream');

      const decoder = new TextDecoder();
      let aiContent = '';
      let sourcesPart = '';
      let isReadingSources = false;
      let isReadingId = false;
      let newConvId = '';

      setMessages((prev) => [...prev, { role: 'Assistant' as const, content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes('------ID------')) {
          isReadingId = true;
          isReadingSources = false;
          newConvId += chunk.split('------ID------')[1];
          continue;
        }

        if (chunk.includes('------SOURCES------')) {
          isReadingSources = true;
          sourcesPart += chunk.split('------SOURCES------')[1];
          continue;
        }

        if (isReadingId) {
           newConvId += chunk;
        } else if (isReadingSources) {
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
          setSources(parsedSources.map(normalizeSourceItem));
        } catch (e) {
          console.error("Failed to parse sources:", e);
        }
      }

      const { followUps: parsedFollowUps } = parseAssistantContent(aiContent);
      setFollowUps(parsedFollowUps);

      if (newConvId && !conversationId) {
        onConversationStarted(newConvId.trim());
      }

    } catch (error) {
      console.error("Error sending query:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderUserQuery = (content: string) => (
    <div className="w-full mb-12">
      <div className="max-w-3xl mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 shadow-sm">
         <p className="text-white text-[16px] md:text-[20px] font-mono leading-relaxed">
            {content}
         </p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0a] font-mono">
      {/* Messages Container */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 pt-16 scroll-smooth flex flex-col items-center"
      >
        <div className="w-full max-w-5xl">
          {messages.length === 0 ? (
            <div className="h-[75vh] flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-cyber-900 border border-cyber-800 flex items-center justify-center mb-10 shadow-elevated transition-transform hover:scale-105 duration-300">
                 <svg className="w-12 h-12 text-cyber-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">aiSearch Console</h1>
              <p className="text-cyber-500 text-base max-w-md text-center font-medium">Quantum search initialized. Enter query to begin analysis.</p>
            </div>
          ) : (
            <div className="animate-fadeIn w-full pb-8">
              {messages[0].role === 'User' && renderUserQuery(messages[0].content)}

              {sources.length > 0 && (
                <div className="mb-16 animate-fadeIn">
                   <div className="flex items-center gap-3 mb-6">
                      <svg className="w-5 h-5 text-cyber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                      <span className="text-[13px] font-bold tracking-[0.2em] text-cyber-400 uppercase">Contextual Sources</span>
                   </div>
                   <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-5 overflow-x-auto sm:overflow-x-visible pb-6 sm:pb-0 snap-x snap-mandatory hide-scrollbar">
                      {sources.map((source, i) => (
                        <a
                          key={i}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 w-[280px] sm:w-auto p-6 rounded-xl bg-[#111] border border-[#222] hover:border-cyber-primary/60 transition-all group flex flex-col justify-between snap-center hover:bg-[#151515]"
                        >
                           <div className="flex justify-between items-start mb-8">
                              <svg className="w-6 h-6 text-cyber-600 group-hover:text-cyber-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              <span className="text-xs text-cyber-600 font-bold tracking-widest">0{i+1}</span>
                           </div>
                           <div>
                              <h4 className="text-[16px] font-bold text-cyber-100 mb-2 truncate group-hover:text-white transition-colors">{source.title}</h4>
                              <p className="text-[13px] text-cyber-500 font-medium truncate">{getSourceHostname(source.url)}</p>
                           </div>
                        </a>
                      ))}
                   </div>
                </div>
              )}

              <div className="space-y-16">
                {messages.map((msg, i) => {
                  if (i === 0 && msg.role === 'User') return null;

                  return (
                    <div key={i} className={`flex flex-col animate-fadeIn`}>
                      {msg.role === 'Assistant' && (
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-cyber-primary text-2xl">✨</span>
                          <span className="text-[13px] font-bold text-cyber-400 tracking-[0.2em] uppercase">AI Assistant Reply</span>
                        </div>
                      )}
                      
                      {msg.role === 'User' ? (
                         renderUserQuery(msg.content)
                      ) : (
                         <div className="bg-transparent text-white">
                           <FormattedMessage content={msg.content} />

                           {i === messages.reduce((latestIndex, curr, idx) => curr.role === 'Assistant' ? idx : latestIndex, -1) && followUps.length > 0 && (
                             <div className="mt-8 grid gap-3 sm:grid-cols-2">
                               {followUps.map((question, qIndex) => (
                                 <button
                                   key={qIndex}
                                   onClick={() => handleSend(question)}
                                   className="px-5 py-3 rounded-2xl bg-[#111] border border-[#222] hover:border-cyber-primary/60 text-cyber-300 hover:text-white text-sm font-semibold transition-all shadow-sm hover:bg-[#151515] text-left"
                                 >
                                   {question}
                                 </button>
                               ))}
                             </div>
                           )}

                           <div className="flex flex-wrap items-center gap-4 mt-10">
                              <button className="px-5 py-2.5 rounded-xl bg-[#111] border border-[#222] hover:bg-[#1a1a1a] text-cyber-400 hover:text-cyber-100 text-sm transition-all flex items-center gap-3 active:scale-95 shadow-sm">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                 Copy Content
                              </button>
                              <button className="px-5 py-2.5 rounded-xl bg-[#111] border border-[#222] hover:bg-[#1a1a1a] text-cyber-400 hover:text-cyber-100 text-sm transition-all flex items-center gap-3 active:scale-95 shadow-sm">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                 Regenerate
                              </button>
                           </div>
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input Section - Inside scrollable area at bottom */}
        <div className="w-full max-w-5xl mt-12 mb-8">
          <div className="bg-[#0c0c0c] border border-[#2a2a2a] rounded-2xl p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group focus-within:border-cyber-primary/40 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a follow-up prompt..."
              className="w-full bg-transparent border-none text-white placeholder-cyber-700 focus:ring-0 focus:outline-none resize-none py-4 px-4 min-h-[72px] max-h-[250px] text-lg font-mono"
              rows={1}
            />
            <div className="absolute bottom-5 right-5 flex items-center gap-5">
               <span className="text-[11px] text-cyber-600 font-bold hidden sm:block tracking-[0.2em] uppercase">Module v3.7</span>
               <button
                 onClick={() => handleSend()}
                 disabled={isLoading || !query.trim()}
                 className="w-12 h-12 rounded-xl bg-cyber-primary text-white flex items-center justify-center hover:bg-cyber-primary-hover disabled:bg-cyber-900 disabled:text-cyber-800 transition-all shadow-lg active:scale-90"
               >
                 {isLoading ? (
                   <div className="w-6 h-6 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                 ) : (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                 )}
               </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-5 px-1">
             {['Suggest linear alternative?', 'Apply O(n) logic', 'Export Schema'].map((suggestion, idx) => (
               <button
                 key={idx}
                 onClick={() => handleSend(suggestion)}
                 className="px-5 py-2 rounded-full bg-[#111] border border-[#222] hover:border-cyber-primary/40 text-[13px] text-cyber-500 hover:text-cyber-primary transition-all cursor-pointer font-bold tracking-tight shadow-sm hover:bg-[#151515]"
               >
                 {suggestion}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Scroll-to-bottom button - Arrow icon with translucent background */}
      {showScrollBottom && (
        <button 
          onClick={() => {
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            setShowScrollBottom(false);
          }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 p-2 rounded-lg bg-cyber-primary/20 backdrop-blur-md text-cyber-primary hover:bg-cyber-primary/30 transition-all hover:scale-110 duration-200 shadow-lg border border-cyber-primary/40 animate-bounce"
          title="Scroll to new message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </button>
      )}
    </div>
  );
}