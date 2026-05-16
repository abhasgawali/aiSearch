import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Sidebar } from '../components/layout/Sidebar';
import History from '../components/History';
import ChatInterface from '../components/ChatInterface';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const { id: activeConversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    async function getInfo() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getInfo();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/auth');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cyber-950 flex items-center justify-center px-4 font-mono">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-cyber-900 border border-cyber-800 flex items-center justify-center mb-8 shadow-elevated">
            <span className="text-cyber-primary font-bold text-xl">{'>_'}</span>
          </div>
          <h1 className="text-cyber-50 text-2xl font-bold tracking-tight mb-1">Access Required</h1>
          <p className="text-cyber-400 text-sm tracking-widest uppercase mb-10">Please sign in to continue</p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-3.5 rounded-md bg-cyber-primary hover:bg-cyber-primary-hover text-white font-bold tracking-widest uppercase transition-colors shadow-elevated"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-cyber-950 text-cyber-50 font-mono">
      {/* Sidebar */}
      <Sidebar
        onNewChat={() => navigate('/ask')}
        items={[
          {
            label: 'Query',
            value: 'chat',
            icon: <span>◩</span>,
            onClick: () => navigate('/ask')
          },
          {
            label: 'Threads',
            value: 'threads',
            icon: <span>💬</span>,
          },
          {
            label: 'Vault',
            value: 'vault',
            icon: <span>🗄️</span>,
          }
        ]}
        activeItem={activeConversationId ? 'history' : 'chat'}
        footer={
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogout}>
            <div className="w-10 h-10 rounded-full bg-cyber-primary flex items-center justify-center text-sm font-bold text-white shadow-md">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-sm font-bold text-white truncate">{user.user_metadata?.full_name || 'John Doe'}</div>
               <div className="text-xs text-cyber-400 truncate">Pro Plan</div>
            </div>
          </div>
        }
      >
        <History
          activeId={activeConversationId}
          onSelect={(id) => navigate(`/ask/${id}`)}
        />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0a0a0a] lg:ml-64">
        <main className="flex-1 overflow-hidden relative">
          <ChatInterface
            conversationId={activeConversationId}
            onConversationStarted={(id) => navigate(`/ask/${id}`)}
          />
        </main>

        {/* Global Footer */}
        <footer className="h-10 border-t border-[#222] bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-between px-6 text-[10px] text-cyber-500 tracking-wider">
           <div className="flex gap-4">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success block"></span> System: Operational</span>
              <span>Latency: 42ms</span>
           </div>
           <div className="flex gap-4 hidden sm:flex">
              <span className="hover:text-cyber-300 cursor-pointer">Keyboard Shortcuts</span>
              <span className="hover:text-cyber-300 cursor-pointer">API Docs</span>
           </div>
        </footer>
      </div>
    </div>
  );
}