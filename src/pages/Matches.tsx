import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MessageSquare, User, Briefcase } from 'lucide-react';
import clsx from 'clsx';

export default function Matches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
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
      setLoading(false);
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
      setSelectedMatch((prev: any) => ({
        ...prev,
        messages: [...(prev.messages || []), { content: message, sender_id: 'me', created_at: new Date() }]
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      
      {/* List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Your Matches</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
            {matches.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No matches yet. Keep swiping!</div>
            ) : (
                matches.map(match => (
                    <button
                        key={match.id}
                        onClick={() => setSelectedMatch(match)}
                        className={clsx(
                            "w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0",
                            selectedMatch?.id === match.id && "bg-blue-50 hover:bg-blue-50"
                        )}
                    >
                        <div className="flex justify-between items-start">
                             <h3 className="font-medium text-gray-900">{match.candidate?.name || 'Anonymous Candidate'}</h3>
                             <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">{(match.explainability_json?.score * 100).toFixed(0)}% Match</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Briefcase size={12} /> {match.job?.skills_required?.[0]} role
                        </p>
                        <p className="text-xs text-gray-400 mt-2 truncate">
                            {match.messages?.[match.messages.length -1]?.content || "Start the conversation..."}
                        </p>
                    </button>
                ))
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedMatch ? (
            <>
                <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <User size={20} className="text-gray-400" />
                            {selectedMatch.candidate?.name || "Candidate"}
                        </h2>
                        <p className="text-xs text-gray-500">Matched on {new Date(selectedMatch.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Explainability Card */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mb-6">
                        <strong>Why we matched you:</strong> {selectedMatch.explainability_json?.reason}
                    </div>

                    {selectedMatch.messages?.map((msg: any, i: number) => {
                        const isMe = msg.sender_id === 'me'; // In real app, check ID
                        return (
                            <div key={i} className={clsx("flex", isMe && "justify-end")}>
                                <div className={clsx(
                                    "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                    isMe ? "bg-primary-600 text-white" : "bg-white text-gray-900"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 border-gray-300 rounded-full shadow-sm focus:ring-primary-500 focus:border-primary-500 px-4 py-2 border"
                            placeholder="Type a message..."
                        />
                        <button 
                            type="submit"
                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                        >
                            <MessageSquare size={20} />
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
