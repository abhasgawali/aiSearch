import { useEffect, useState } from "react";
import { api } from "../api/config";

interface Conversation {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

export default function History({
  activeId,
  onSelect
}: {
  activeId?: string,
  onSelect: (id: string) => void
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const response = await api.get("/conversations");
        setConversations(response.data.conversations || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col gap-2 mt-4 font-mono">
      {loading ? (
        <div className="px-4 py-2 text-xs text-cyber-600 animate-pulse">
          Loading...
        </div>
      ) : conversations.length === 0 ? (
        <div className="px-4 py-2 text-xs text-cyber-600 italic">
          No history
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                onSelect(conv.id);
              }}
              className={[
                'w-full px-4 py-2 rounded-lg text-left transition-colors duration-150',
                'text-xs font-medium tracking-wide truncate border',
                activeId === conv.id
                  ? 'bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30'
                  : 'text-cyber-400 hover:bg-cyber-800/50 hover:text-cyber-200 border-transparent',
              ].join(' ')}
            >
              {conv.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}