import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Check, X, Briefcase, MapPin, DollarSign, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Candidate {
  candidate_id: string;
  name: string; // Often hidden, but API might return strict subset
  intent: string;
  why: string;
  skills: { name: string; confidence: number }[];
  match_score?: number;
  relevant_job_id: string; // The job this candidate matched against constraints for
}

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

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div></div>;

  if (candidates.length === 0) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900">All caught up!</h2>
            <p className="text-gray-500 mt-2">No more candidates match your criteria right now.</p>
            <button onClick={fetchFeed} className="mt-4 text-primary-600 hover:underline">Refresh Feed</button>
        </div>
    );
  }

  // Show top card only
  const card = candidates[0];

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Candidate Recommendations</h1>
      
      <div className="relative h-[600px] w-full">
        <AnimatePresence>
            <motion.div
                key={card.candidate_id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }} // Simple exit animation for now
                className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col"
            >
                {/* Header (Anonymized or Real) */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white h-32 flex flex-col justify-end">
                    <h2 className="text-2xl font-bold">Candidate</h2> 
                    <p className="text-blue-100 text-sm">Matches Job ID: ...{card.relevant_job_id?.slice(-6)}</p>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Intent</h3>
                        <p className="text-lg text-gray-900 leading-relaxed font-medium">"{card.intent}"</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">The "Why"</h3>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg italic">"{card.why}"</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Brain size={16} /> Top Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {card.skills?.slice(0, 6).map((skill, i) => (
                                <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleSwipe('left')}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-100 text-red-600 hover:bg-red-50 transition-colors font-bold text-lg"
                    >
                        <X size={24} /> Pass
                    </button>
                    <button
                        onClick={() => handleSwipe('right')}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors font-bold text-lg shadow-lg shadow-primary-200"
                    >
                        <Check size={24} /> Connect
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
