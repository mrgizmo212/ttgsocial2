import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_CONFIGURED } from "../../constants/env.ts";
import LoadingIcon from "../common/icons/LoadingIcon.tsx";

type DM = {
  id: number;
  fromUserId: number;
  toUserId: number;
  text: string;
  createdAt: string;
};

function useMockMessages() {
  return useQuery<DM[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!BACKEND_CONFIGURED) {
        const res = await fetch(`/mock/messages.json`);
        if (!res.ok) throw new Error("Failed to fetch mock messages");
        return res.json();
      }
      // TODO: replace with real backend endpoint when ready
      return [];
    },
    staleTime: 60_000,
  });
}

export default function MessagesPage() {
  const { data, isLoading } = useMockMessages();

  useEffect(() => {
    document.title = "Messages";
  }, []);

  return (
    <div className="h-full w-full flex flex-col xl:border-x border-twitterBorder overflow-hidden">
      <div className="p-4 border-b border-twitterBorder">
        <p className="text-lg font-bold">Messages</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6"><LoadingIcon /></div>
        ) : (
          <ul className="divide-y divide-twitterBorder">
            {data?.map((m) => (
              <li key={m.id} className="p-4">
                <p className="text-sm text-twitterTextAlt">{new Date(m.createdAt).toLocaleString()}</p>
                <p className="text-white">{m.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


