import { useEffect, useState } from "react";
import { getConversations } from "../services/conversation";

export function useConversations(token: string | null) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;

    try {
      const data = await getConversations(token);
      setConversations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  return {
    conversations,
    loading,
    reload: load,
  };
}
