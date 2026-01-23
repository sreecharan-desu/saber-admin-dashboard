import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MessageSquare, Github, Linkedin, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { Match } from '../types';

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [message, setMessage] = useState('');

  const location = useLocation();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      const fetchedMatches = res.data.matches || res.data || [];
      setMatches(fetchedMatches);
      
      // Auto-select match from query param
      const matchId = new URLSearchParams(location.search).get('id');
      if (matchId) {
          const match = fetchedMatches.find((m: any) => m.id === matchId);
          if (match) setSelectedMatch(match);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !selectedMatch) return;

    try {
      await api.post('/matches/messages', {
        match_id: selectedMatch.id,
        content: message
      });
      setMessage('');
      setSelectedMatch((prev: Match | null) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), { 
            content: message, 
            sender_id: 'me', 
            created_at: new Date().toISOString() 
          }]
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-800">
      
      {/* Sidebar / Inbox */}
      <div className="w-1/3 border-r border-gray-800 flex flex-col bg-[#050505]">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase opacity-80">Inbox</h2>
            <span className="text-[10px] text-gray-500 font-mono bg-gray-900 px-2 py-0.5 rounded border border-gray-800">{matches.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
            {matches.length === 0 ? (
                <div className="p-12 text-center">
                   <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-800">
                     <MessageSquare size={20} className="text-gray-600" />
                   </div>
                   <p className="text-sm text-gray-500 font-medium tracking-tight">No active threads</p>
                </div>
            ) : (
                matches.map(match => (
                    <button
                        key={match.id}
                        onClick={() => setSelectedMatch(match)}
                        className={clsx(
                            "w-full text-left p-6 hover:bg-[#111] transition-all border-b border-gray-900 group relative",
                            selectedMatch?.id === match.id && "bg-[#111]"
                        )}
                    >
                        {selectedMatch?.id === match.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
                        )}
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="text-sm font-bold text-white tracking-tight">{match.candidate?.name || 'Candidate Reveal'}</h3>
                             <span className="text-[10px] text-gray-500 font-mono bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
                                {Math.round((match.explainability_json?.score || 0) * 100)}%
                             </span>
                        </div>
                        <p className="text-[11px] text-gray-500 flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            {match.job?.problem_statement?.slice(0, 30) || 'Active Match'}...
                        </p>
                        <p className="text-[12px] text-gray-400 truncate group-hover:text-gray-200 transition-colors font-normal leading-relaxed">
                            {match.messages?.[match.messages.length -1]?.content || "Mutual signal detected..."}
                        </p>
                    </button>
                ))
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black relative">
        <AnimatePresence mode="wait">
          {selectedMatch ? (
            <motion.div 
              key={selectedMatch.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 flex flex-col h-full"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50 backdrop-blur-sm relative z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden">
                           {selectedMatch.candidate?.photo_url ? (
                               <img src={selectedMatch.candidate.photo_url} className="w-full h-full object-cover" alt="" />
                           ) : <span className="text-gray-500 font-bold text-sm">{selectedMatch.candidate?.name?.charAt(0) || '?'}</span>}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white leading-none mb-1">
                                {selectedMatch.candidate?.name || "Candidate"}
                                <span className="ml-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                                    Trusted via GitHub
                                </span>
                            </h2>
                            <div className="flex items-center gap-3">
                                 {selectedMatch.candidate?.github_url && (
                                    <a href={selectedMatch.candidate.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-white transition-colors">
                                        <Github size={12} /> github.com
                                    </a>
                                 )}
                                 {selectedMatch.candidate?.linkedin_url && (
                                    <a href={selectedMatch.candidate.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-white transition-colors">
                                        <Linkedin size={12} /> linkedin.com
                                    </a>
                                 )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-600 font-mono">MATCH_ID: {selectedMatch.id.slice(0, 12)}</span>
                    </div>
                </div>

                {/* Messages & Reveal Details */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar relative z-10">
                    {/* Vercel Metric Style Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMatch.explainability_json && (
                            <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800 selection:bg-vercel-blue relative overflow-hidden group">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4 block">Match Analysis</span>
                                <div className="text-3xl font-bold text-white tracking-tighter mb-2">
                                    {Math.round((selectedMatch.explainability_json?.score || 0) * 100)}%
                                    <span className="text-sm font-medium text-gray-500 ml-2 tracking-normal">Technical Fit</span>
                                </div>
                                <p className="text-[13px] text-gray-400 font-normal leading-relaxed italic border-l border-gray-700 pl-4 mt-4">
                                    "{selectedMatch.explainability_json.reason}"
                                </p>
                            </div>
                        )}

                        {selectedMatch.candidate?.skills && (
                            <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4 block">Extracted Signals</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedMatch.candidate.skills.slice(0, 8).map((skill, i) => (
                                        <div key={i} className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-black border border-gray-800 text-gray-300 hover:border-gray-600 transition-colors">
                                            {skill.name}
                                        </div>
                                    ))}
                                    {selectedMatch.candidate.skills.length > 8 && (
                                        <div className="text-[10px] font-bold text-gray-600 self-center">+{selectedMatch.candidate.skills.length - 8} more</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Bubbles */}
                    <div className="space-y-6 pt-6">
                        {selectedMatch.messages?.map((msg, i) => {
                            const isMe = msg.sender_id === 'me';
                            return (
                                <div key={i} className={clsx("flex", isMe && "justify-end")}>
                                    <div className={clsx(
                                        "max-w-[75%] rounded-lg px-4 py-2.5 text-sm shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2",
                                        isMe 
                                          ? "bg-white text-black font-medium border border-white" 
                                          : "bg-[#111] text-gray-200 border border-gray-800"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
                    <form onSubmit={sendMessage} className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                             <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full input-base focus:ring-0 rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-gray-800 focus:border-white px-0 bg-transparent"
                                placeholder="Type your message..."
                            />
                        </div>
                        <button 
                            type="submit"
                            className="bg-white text-black h-10 w-10 flex items-center justify-center rounded-sm hover:opacity-80 transition-all font-bold group"
                        >
                            <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </form>
                </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-12 text-center">
                <div className="p-6 rounded-full border border-gray-800 mb-6 border-dashed">
                    <MessageSquare size={40} className="opacity-20 translate-y-1" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-400 mb-2">Message Center</h3>
                <p className="max-w-xs text-sm text-gray-500 font-normal leading-relaxed">
                    Select a revealed candidate from the sidebar to start a technical discussion or schedule an interview.
                </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
