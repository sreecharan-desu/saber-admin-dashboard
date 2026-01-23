import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Zap, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type Step = 'recruiter-company' | 'recruiter-job';

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState<Step>('recruiter-company');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.company_id) {
      window.location.href = '/';
    }
  }, [user]);

  const [companyData, setCompanyData] = useState({ name: '', website: '' });
  const [jobData, setJobData] = useState({ 
    company_id: '', 
    problem_statement: '', 
    expectations: '',
    non_negotiables: '',
    deal_breakers: '',
    skills: '' 
  });

  const submitCompany = async () => {
    try {
        setLoading(true);
        await api.put('/user/role', { role: 'recruiter' });
        const res = await api.post('/recruiters/company', companyData);
        const newCompanyId = res.data.company?.id || res.data.user?.company_id;
        
        if (!newCompanyId) throw new Error("Failed to retrieve company ID");

        setJobData(prev => ({...prev, company_id: newCompanyId}));
        await refreshUser();
        setStep('recruiter-job');
    } catch (e: any) {
        console.error("Onboarding failed", e);
        alert(e.response?.data?.error || "Failed to complete step.");
    } finally { setLoading(false); }
  };

  const submitJob = async () => {
      try {
          setLoading(true);
          await api.post('/recruiters/job', {
             company_id: jobData.company_id,
             problem_statement: jobData.problem_statement,
             expectations: jobData.expectations,
             non_negotiables: jobData.non_negotiables,
             deal_breakers: jobData.deal_breakers,
             skills_required: jobData.skills.split(',').map(s => s.trim()),
             constraints_json: { 
                 remote_only: true,
                 salary_range: [0, 0],
                 experience_years: 0,
                 location: 'Remote',
                 equity: 'N/A'
             }
          });
          window.location.href = '/';
      } catch (e: any) { 
          console.error(e); 
          alert(e.response?.data?.error || "Failed to post job.");
      } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-vercel-blue selection:text-white">
        {/* Background Grid */}
        <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-40" />

        <div className="w-full max-w-[480px] text-center mb-12 relative z-10">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black mb-8 shadow-2xl shadow-white/10"
            >
                <Sparkles size={24} />
            </motion.div>
            <h2 className="text-4xl font-bold tracking-tighter mb-3">
                {step === 'recruiter-company' && "Establish Workspace"}
                {step === 'recruiter-job' && "Define The Challenge"}
            </h2>
             <p className="text-gray-500 font-normal text-sm max-w-sm mx-auto leading-relaxed">
                {step === 'recruiter-company' && "Create your company identity to begin analyzing technical signals."}
                {step === 'recruiter-job' && "Describe a core technical problem your team is solving. We'll find the right talent."}
            </p>
        </div>

        <div className="w-full max-w-[480px] relative z-10">
            <AnimatePresence mode="wait">
                {step === 'recruiter-company' && (
                    <motion.div 
                        key="company"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 card-base p-10 bg-[#050505]"
                    >
                        <div className="space-y-6 text-left">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Company Name</label>
                                <div className="relative">
                                     <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                     <input 
                                        type="text"
                                        className="input-base pl-10"
                                        placeholder="Acme Engineering"
                                        value={companyData.name}
                                        onChange={e => setCompanyData({...companyData, name: e.target.value})}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Website</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input 
                                        type="url"
                                        className="input-base pl-10"
                                        placeholder="https://acme.org"
                                        value={companyData.website}
                                        onChange={e => setCompanyData({...companyData, website: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={submitCompany} disabled={loading} className="btn-primary w-full h-12 text-[14px] font-bold tracking-tight">
                            {loading ? 'Initializing...' : 'Complete Workspace Setup'}
                        </button>
                    </motion.div>
                )}

                {step === 'recruiter-job' && (
                    <motion.div 
                        key="job"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8 card-base p-10 bg-[#050505]"
                    >
                        <div className="space-y-6 text-left">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">The Problem Statement</label>
                                <textarea 
                                    className="input-base min-h-[100px] py-4 text-balance leading-relaxed resize-none"
                                    placeholder="e.g. Scaling real-time notifications to 10k items/sec..."
                                    value={jobData.problem_statement}
                                    onChange={e => setJobData({...jobData, problem_statement: e.target.value})}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Key Technical Signals</label>
                                <div className="relative">
                                    <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input 
                                        type="text"
                                        className="input-base pl-10"
                                        placeholder="Go, Redis, Distributed Systems"
                                        value={jobData.skills}
                                        onChange={e => setJobData({...jobData, skills: e.target.value})}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 mt-2">Separate skills with commas.</p>
                            </div>
                        </div>
                        <button onClick={submitJob} disabled={loading} className="btn-primary w-full h-12 text-[14px] font-bold tracking-tight">
                            {loading ? 'Publishing...' : 'Launch First Challenge'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="mt-12 flex justify-center items-center gap-2">
                <div className={clsx("w-2 h-2 rounded-full", step === 'recruiter-company' ? "bg-white" : "bg-gray-800")} />
                <div className={clsx("w-2 h-2 rounded-full", step === 'recruiter-job' ? "bg-white" : "bg-gray-800")} />
            </div>
        </div>
    </div>
  );
}
