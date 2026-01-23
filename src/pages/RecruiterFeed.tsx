import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, User as UserIcon, Sparkles } from 'lucide-react';

import type { Candidate } from '../types';

export default function RecruiterFeed() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [mutualMatch, setMutualMatch] = useState<any>(null); // State for the reveal overlay
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeed();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
      try {
          const res = await api.get('/recruiters/jobs');
          setActiveJobs(res.data.jobs || res.data || []);
      } catch (err) {
          console.error("Failed to fetch jobs", err);
      }
  };

  const fetchFeed = async () => {
    try {
      const res = await api.get('/recruiters/recruiter/feed');
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right', candidateId: string, jobId: string) => {
    // Optimistic UI: save current state for potential snapback
    const candidateToSwipe = candidates.find(c => c.candidate_id === candidateId && c.relevant_job_id === jobId);
    if (!candidateToSwipe) return;

    setCandidates(prev => prev.filter(c => c.candidate_id !== candidateId || c.relevant_job_id !== jobId));
    
    try {
      const res = await api.post('/recruiters/recruiter/swipe', {
        job_id: jobId,
        target_user_id: candidateId,
        direction
      });

      // Handle Mutual Match Materialization
      if (direction === 'right' && res.data.is_mutual) {
        setMutualMatch(res.data.match || { candidate: candidateToSwipe });
      }
    } catch (err) {
      console.error('Swipe failed', err);
      // Snapback Logic: Re-insert the candidate at the top if swipe failed
      setCandidates(prev => [candidateToSwipe, ...prev]);
      // Optional: Trigger a shake effect via state/ref if needed
    }
  };

  const generateSignalHash = (id: string) => `SABER-SIG-${id.slice(0, 4).toUpperCase()}`;

  // Spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  if (loading) return (
      <div className="max-w-xl mx-auto py-4 space-y-8">
          <div className="flex justify-between items-end mb-10">
              <div className="space-y-2">
                  <div className="h-8 w-40 skeleton" />
                  <div className="h-4 w-64 skeleton" />
              </div>
          </div>
          <div className="h-[600px] w-full card-base skeleton opacity-50 transition-opacity duration-500" />
      </div>
  );

  if (candidates.length === 0) {
    return (
        <div className="max-w-xl mx-auto py-4">
             <div className="flex justify-between items-end mb-10">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white">Discover</h1>
                    <p className="text-sm text-gray-500 font-normal">Candidate recommendations for your active roles.</p>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center h-[50vh] text-center card-base py-12 px-8">
                <div className="w-16 h-16 bg-gray-900 rounded-full border border-gray-800 flex items-center justify-center mb-6">
                    <UserIcon className="text-gray-500" size={32} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">All caught up</h2>
                <p className="text-sm text-gray-400 mt-2 max-w-xs font-normal leading-relaxed">
                    There are no more candidates matching your active job criteria. Try checking back later or adjusting your job filters.
                </p>
                <button onClick={fetchFeed} className="btn-secondary mt-8 h-10 px-8">Refresh Feed</button>
            </div>
        </div>
    );
  }

  const filteredCandidates = selectedJobId === 'all' 
    ? candidates 
    : candidates.filter(c => c.relevant_job_id === selectedJobId);

  if (filteredCandidates.length === 0 && candidates.length > 0) {
      return (
        <div className="max-w-xl mx-auto py-4">
             <div className="flex justify-between items-end mb-10">
                <div>
                     <h1 className="text-3xl font-bold tracking-tighter text-white">Discover</h1>
                    <p className="text-sm text-gray-500 font-normal">Candidate recommendations for your active roles.</p>
                </div>
                <select 
                    value={selectedJobId} 
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="input-base w-48 h-9 py-0 text-xs font-medium border-gray-800 bg-black"
                >
                    <option value="all">All Challenges</option>
                    {activeJobs.map(job => (
                        <option key={job.id} value={job.id}>{job.problem_statement?.slice(0, 30)}...</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col items-center justify-center h-[50vh] text-center card-base py-12 px-8">
                <h2 className="text-xl font-bold text-white tracking-tight">No matches for this job</h2>
                <p className="text-sm text-gray-400 mt-2 max-w-xs font-normal">Try clearing the filter or checking another active role.</p>
                <button onClick={() => setSelectedJobId('all')} className="btn-secondary mt-8 h-10 px-8 text-sm">Clear Filter</button>
            </div>
        </div>
      );
  }

  const card = filteredCandidates[0];

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="flex justify-between items-end mb-10">
        <div>
           <h1 className="text-3xl font-bold tracking-tighter text-white">Discover</h1>
           <p className="text-sm text-gray-500 font-normal">Candidate recommendations for your active roles.</p>
        </div>
        <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="input-base w-40 md:w-56 h-9 py-0 text-xs font-medium border-gray-800 bg-black hover:border-gray-700 transition-colors"
        >
            <option value="all">All Challenges</option>
            {activeJobs.map(job => (
                <option key={job.id} value={job.id}>{job.problem_statement?.slice(0, 35)}...</option>
            ))}
        </select>
      </div>
      
      <AnimatePresence>
        {mutualMatch && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-lg w-full card-base p-10 bg-[#050505] border-vercel-blue/50 border-2 shadow-[0_0_50px_-12px_rgba(0,112,243,0.5)] text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,112,243,0.15)_0%,transparent_70%)]" />
                    
                    <div className="relative z-10 space-y-8">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-vercel-blue/10 border border-vercel-blue/30 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(0,112,243,0.4)]">
                                <Sparkles className="text-vercel-blue" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter text-white">Identity Materialized</h2>
                            <p className="text-gray-400 mt-2 font-normal">A mutual match has occurred. Communications are now active.</p>
                        </div>

                        <div className="py-8 border-y border-gray-800">
                             <div className="flex items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full border-2 border-vercel-blue p-1">
                                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                                        {mutualMatch.candidate?.photo_url ? (
                                            <img src={mutualMatch.candidate.photo_url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <span className="text-xl font-bold text-white uppercase">{mutualMatch.candidate?.name?.charAt(0) || 'C'}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white">{mutualMatch.candidate?.name || 'Technical Candidate'}</h3>
                                    <div className="flex gap-2 mt-1">
                                         {mutualMatch.candidate?.github_url && <Github size={14} className="text-gray-500" />}
                                         {mutualMatch.candidate?.linkedin_url && <Linkedin size={14} className="text-gray-500" />}
                                         <span className="text-[10px] text-gray-500 font-mono">ID: {mutualMatch.candidate?.candidate_id.slice(0, 8)}</span>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setMutualMatch(null)}
                                className="btn-secondary flex-1 h-12 text-sm font-bold"
                            >
                                Continue Discovery
                            </button>
                            <Link 
                                to={`/matches?id=${mutualMatch.id}`}
                                className="btn-accent flex-1 h-12 text-sm font-bold flex items-center justify-center"
                            >
                                Open Signal Chat
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-[650px] w-full">
        <AnimatePresence mode="wait">
            <motion.div
                key={card.candidate_id + '-' + card.relevant_job_id}
                ref={cardRef}
                onMouseMove={handleMouseMove}
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 card-base flex flex-col overflow-hidden group/card"
                style={{
                    backgroundColor: '#111',
                    borderColor: '#333',
                    // Spotlight logic
                    background: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)',
                } as any}
            >
                {/* Spotlight Overlay Border */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 40%)',
                        maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
                        maskClip: 'content-box, border-box',
                        maskComposite: 'exclude',
                        padding: '1px'
                    } as any}
                />

                {/* Header (Anonymized) */}
                <div className="p-8 border-b border-gray-800 bg-[#161616]/50">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1 text-left">
                            <h2 className="text-xl font-bold tracking-tight text-white">Candidate Reveal</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                Matching Job: <span className="text-vercel-blue">{card.relevant_job_id.slice(0, 8)}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2 py-1 rounded border border-gray-800 bg-black">
                                {generateSignalHash(card.candidate_id)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-10 flex-1 overflow-y-auto space-y-12 no-scrollbar text-left relative z-10">
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                             Intent Summary
                        </h3>
                        <p className="text-[17px] text-white font-medium leading-relaxed text-balance">
                           "{card.intent_text}"
                        </p>
                        {card.last_verified_at && (
                            <div className="flex items-center gap-2 mt-2">
                                <div className="dot dot-active scale-75" />
                                <span className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter">
                                    Signals synchronized {new Date(card.last_verified_at).toLocaleTimeString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {card.why && (
                      <div className="space-y-4">
                           <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                             Saber Analysis
                           </h3>
                           <div className="relative border-l-2 border-vercel-blue pl-6 py-1">
                               <p className="text-[15px] text-gray-400 font-normal leading-relaxed italic">
                                 "{card.why}"
                               </p>
                           </div>
                      </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">Extracted Signals</h3>
                        <div className="flex flex-wrap gap-2.5">
                            {card.skills?.slice(0, 15).map((skill, i) => (
                                <div key={i} className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-black border border-gray-800 text-white hover:bg-white hover:text-black transition-all cursor-default shadow-sm active:scale-95">
                                    <div className="opacity-60">
                                        {skill.source === 'github' && <Github size={12} />}
                                        {skill.source === 'linkedin' && <Linkedin size={12} />}
                                        {skill.source === 'manual' && <UserIcon size={12} />}
                                    </div>
                                    <span>{skill.name}</span>
                                    <span className="text-[10px] font-mono opacity-50 border-l border-gray-800 pl-2">
                                        {Math.round(skill.confidence_score * 100)}%
                                    </span>
                                </div>
                            ))}
                            {(!card.skills || card.skills.length === 0) && (
                                <p className="text-xs text-gray-500 italic">No technical core identified.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-800 flex items-center gap-4 bg-black relative z-20">
                    <button
                        onClick={() => handleSwipe('left', card.candidate_id, card.relevant_job_id)}
                        className="btn-secondary flex-1 h-12 text-[14px] font-bold tracking-tight hover:bg-gray-900 border-gray-800 text-gray-400 hover:text-white transition-all shadow-none"
                    >
                        Pass
                    </button>
                    <button
                        onClick={() => handleSwipe('right', card.candidate_id, card.relevant_job_id)}
                        className="btn-accent flex-1 h-12 text-[14px] font-bold tracking-tight transition-all shadow-none relative overflow-hidden group/btn"
                    >
                        <span className="relative z-10">Connect</span>
                        <motion.div 
                            className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"
                        />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
