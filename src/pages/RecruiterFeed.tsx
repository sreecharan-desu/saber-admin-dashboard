import { useState, useEffect } from 'react';
import { api } from '../lib/api';
// No unused lucide-react icons here now
import { motion, AnimatePresence } from 'framer-motion';

import type { Candidate } from '../types';

export default function RecruiterFeed() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/recruiter/feed');
      // Fix: API returns { candidates: [...] } or just array? 
      // Based on docs: { candidates: [...] }
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (candidates.length === 0) return;
    const current = candidates[0];

    // Optimistic UI update
    setCandidates(prev => prev.slice(1));

    try {
      await api.post('/recruiter/swipe', {
        job_id: current.relevant_job_id,
        target_user_id: current.candidate_id,
        direction
      });
    } catch (err) {
      console.error('Swipe failed', err);
      // Ideally revert state or show toast
    }
  };

  if (loading) return (
      <div className="flex justify-center items-center h-[50vh]">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
  );

  if (candidates.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center mb-4">
               <div className="w-6 h-6 border-2 border-gray-200 rounded-full"></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">All caught up</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xs font-normal">There are no more candidates matching your active job criteria.</p>
            <button onClick={fetchFeed} className="btn-secondary mt-6 h-9 text-xs">Refresh Feed</button>
        </div>
    );
  }

  // Show top card only
  const card = candidates[0];

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="flex justify-between items-end mb-10">
        <div>
           <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Discover</h1>
           <p className="text-sm text-gray-500 font-normal">Candidate recommendations for your active roles.</p>
        </div>
      </div>
      
      <div className="relative h-[650px] w-full">
        <AnimatePresence mode="wait">
            <motion.div
                key={card.candidate_id}
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 card-base flex flex-col overflow-hidden"
            >
                {/* Header (Anonymized) */}
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-gray-900">Candidate</h2>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-gray-100">
                             id: {card.candidate_id.slice(0, 8)}
                        </span>
                    </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto space-y-8 no-scrollbar">
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Saber Intent</h3>
                        <p className="text-[15px] text-gray-900 font-normal leading-relaxed text-balance">
                           "{card.intent_text}"
                        </p>
                    </div>

                    {card.why && (
                      <div className="space-y-3">
                           <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             Analysis
                           </h3>
                           <div className="relative">
                               <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-black" />
                               <p className="text-[14px] text-gray-600 font-normal pl-6 leading-relaxed italic">
                                 "{card.why}"
                               </p>
                           </div>
                      </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Technical Core</h3>
                        <div className="flex flex-wrap gap-2">
                            {card.skills?.slice(0, 8).map((skill, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-black text-white">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 flex items-center gap-4 bg-white">
                    <button
                        onClick={() => handleSwipe('left')}
                        className="btn-secondary flex-1 h-12 text-[14px] font-semibold hover:bg-gray-50 transition-all border-gray-200"
                    >
                        Decline
                    </button>
                    <button
                        onClick={() => handleSwipe('right')}
                        className="btn-primary flex-1 h-12 text-[14px] font-semibold transition-all shadow-none"
                    >
                        Connect
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
