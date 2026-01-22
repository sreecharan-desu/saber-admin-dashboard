import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MessageSquare, User, Briefcase } from 'lucide-react';
import clsx from 'clsx';

interface Message {
  content: string;
  sender_id: string;
  created_at: string | Date;
}

interface Match {
  id: string;
  candidate?: { name: string };
  explainability_json?: { score: number; reason: string };
  job?: { skills_required: string[] };
  messages?: Message[];
  created_at: string;
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      setMatches(res.data.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      // Done
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !selectedMatch) return;

    try {
      await api.post('/messages', {
        match_id: selectedMatch.id,
        content: message
      });
      setMessage('');
      // Optimistic update
      setSelectedMatch((prev: Match | null) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), { content: message, sender_id: 'me', created_at: new Date().toISOString() }]
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      
      {/* List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Inbox</h2>
            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{matches.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
            {matches.length === 0 ? (
                <div className="p-12 text-center">
                   <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                     <MessageSquare size={16} className="text-gray-400" />
                   </div>
                   <p className="text-sm text-gray-500">No matches yet</p>
                </div>
            ) : (
                matches.map(match => (
                    <button
                        key={match.id}
                        onClick={() => setSelectedMatch(match)}
                        className={clsx(
                            "w-full text-left p-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 group",
                            selectedMatch?.id === match.id && "bg-gray-50"
                        )}
                    >
                        <div className="flex justify-between items-start mb-1">
                             <h3 className="text-sm font-medium text-gray-900">{match.candidate?.name || 'Anonymous Candidate'}</h3>
                             <span className="text-[10px] text-gray-500 font-mono">{(match.explainability_json?.score || 0) * 100}%</span>
                        </div>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {match.job?.skills_required?.[0]} Role
                        </p>
                        <p className="text-[12px] text-gray-400 truncate group-hover:text-gray-600 transition-colors font-normal">
                            {match.messages?.[match.messages.length -1]?.content || "Start the conversation..."}
                        </p>
                    </button>
                ))
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedMatch ? (
            <>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center h-[57px]">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {selectedMatch.candidate?.name || "Candidate"}
                        </h2>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                        ID: {selectedMatch.id.slice(0, 8)}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Explainability Card */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 mb-8">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mb-1">AI Insight</span>
                        {selectedMatch.explainability_json?.reason}
                    </div>

                    {selectedMatch.messages?.map((msg, i) => {
                        const isMe = msg.sender_id === 'me';
                        return (
                            <div key={i} className={clsx("flex", isMe && "justify-end")}>
                                <div className={clsx(
                                    "max-w-[70%] rounded-lg px-4 py-2.5 text-sm shadow-sm border",
                                    isMe 
                                      ? "bg-black text-white border-black" 
                                      : "bg-white text-gray-900 border-gray-200"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <form onSubmit={sendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 input-base h-10 rounded-full px-5 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all font-normal"
                            placeholder="Type a message..."
                        />
                        <button 
                            type="submit"
                            className="btn-primary h-10 w-10 p-0 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <MessageSquare size={16} />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>Select a match to start chatting</p>
            </div>
        )}
      </div>
    </div>
  );
}
