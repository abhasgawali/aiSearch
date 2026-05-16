import { useEffect, useState } from "react";
import { api } from "../api/config";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

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
    <div className="flex flex-col gap-2 mt-4">
      <p className="px-4 text-[10px] font-bold tracking-widest uppercase text-warm-500 mb-2">
        Recent Searches
      </p>
      {loading ? (
        <div className="px-4 py-2 text-xs text-warm-600 animate-pulse">
          Loading history...
        </div>
      ) : conversations.length === 0 ? (
        <div className="px-4 py-2 text-xs text-warm-600 italic">
          No recent searches
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                onSelect(conv.id);
                navigate(`/ask/${conv.id}`);
              }}
              className={[
                'w-full px-4 py-2 rounded-sm text-left transition-colors duration-150',
                'text-xs font-medium tracking-wide truncate',
                activeId === conv.id
                  ? 'bg-warm-800 text-warm-50'
                  : 'text-warm-400 hover:bg-warm-850 hover:text-warm-300',
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