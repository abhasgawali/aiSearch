import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../utils/supabase';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import History from '../components/History';
import ChatInterface from '../components/ChatInterface';
import { SearchIcon } from '../components/svgs/AuthIcons';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
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
      <div className="min-h-screen bg-warm-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-sm bg-warm-800 border border-warm-700 flex items-center justify-center mb-8">
            <SearchIcon />
          </div>
          <h1 className="text-warm-50 text-2xl font-bold tracking-tight mb-1">Access Required</h1>
          <p className="text-warm-400 text-lg tracking-widest uppercase mb-10">Please sign in to continue</p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-3 rounded-sm bg-warm-800 hover:bg-warm-700 text-warm-50 font-bold tracking-widest uppercase transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-warm-950 text-warm-50 font-serif">
      {/* Sidebar */}
      <Sidebar
        items={[
          {
            label: 'New Thread',
            value: 'new',
            icon: <span>+</span>,
            onClick: () => setActiveConversationId(undefined)
          },
        ]}
        activeItem={activeConversationId ? 'chat' : 'new'}
        footer={
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-warm-800 border border-warm-700 flex items-center justify-center text-xs font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <span className="text-xs font-medium truncate text-warm-400">{user.email}</span>
          </div>
        }
      >
        <History
          activeId={activeConversationId}
          onSelect={(id) => setActiveConversationId(id)}
        />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          title="AI Search"
          logo={<SearchIcon />}
          user={{
            name: user.user_metadata?.full_name || 'User',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url
          }}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto relative">
          <ChatInterface
            conversationId={activeConversationId}
            onConversationStarted={(id) => setActiveConversationId(id)}
          />
        </main>
      </div>
    </div>
  );
}