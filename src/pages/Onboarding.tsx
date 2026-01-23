import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Zap, Globe, Sparkles, Check, ChevronRight } from 'lucide-react';
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
        if (!companyData.name || !companyData.website) {
            alert("Please fill in all company details.");
            return;
        }
        try {
            setLoading(true);
            await api.put('/user/role', { role: 'recruiter' });
            const res = await api.post('/recruiters/company', companyData);
            const newCompanyId = res.data.company?.id || res.data.user?.company_id;

            if (!newCompanyId) throw new Error("Failed to retrieve company ID");

            setJobData(prev => ({ ...prev, company_id: newCompanyId }));
            await refreshUser();
            setStep('recruiter-job');
        } catch (e: any) {
            console.error("Onboarding failed", e);
            alert(e.response?.data?.error || "Failed to complete step.");
        } finally { setLoading(false); }
    };

    const submitJob = async () => {
        if (!jobData.problem_statement || !jobData.skills) {
            alert("Please fill in the job details.");
            return;
        }
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
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-[0.03]" />
            <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-gray-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-gray-50 rounded-full blur-[120px] opacity-60" />

            <div className="w-full max-w-[540px] relative z-10">
                <header className="text-center mb-10 md:mb-12">
                    <div className="flex justify-center mb-10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 p-2">
                            <img src="/logo.png" alt="Saber Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-6">
                        <Sparkles size={12} className="text-black" />
                        <span>Onboarding Experience</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4 font-outfit">
                        {step === 'recruiter-company' ? "Set up your workspace" : "Post your first challenge"}
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-[400px] mx-auto leading-relaxed">
                        {step === 'recruiter-company'
                            ? "Welcome to Saber. Let's start by establishing your company's professional profile."
                            : "Describe the technical hurdles your team is facing. We'll find candidates who can clear them."}
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {step === 'recruiter-company' && (
                        <motion.div
                            key="company"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
                        >
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-[12px] font-semibold text-gray-900 mb-2.5 ml-1 transition-colors group-focus-within:text-black">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-black" />
                                        <input
                                            type="text"
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-sm placeholder:text-gray-400"
                                            placeholder="e.g. Acme Tech Solutions"
                                            value={companyData.name}
                                            onChange={e => setCompanyData({ ...companyData, name: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[12px] font-semibold text-gray-900 mb-2.5 ml-1 transition-colors group-focus-within:text-black">
                                        Company Website
                                    </label>
                                    <div className="relative">
                                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-black" />
                                        <input
                                            type="url"
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-sm placeholder:text-gray-400"
                                            placeholder="https://acme.tech"
                                            value={companyData.website}
                                            onChange={e => setCompanyData({ ...companyData, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={submitCompany}
                                disabled={loading || !companyData.name || !companyData.website}
                                className="mt-10 w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-black/5"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Continue to Job Setup
                                        <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}

                    {step === 'recruiter-job' && (
                        <motion.div
                            key="job"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
                        >
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-[12px] font-semibold text-gray-900 mb-2.5 ml-1 transition-colors group-focus-within:text-black">
                                        The Problem Statement
                                    </label>
                                    <textarea
                                        className="w-full min-h-[140px] p-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-sm placeholder:text-gray-400 resize-none leading-relaxed"
                                        placeholder="e.g. We're looking for an engineer to help optimize our distributed database clusters for sub-10ms latency..."
                                        value={jobData.problem_statement}
                                        onChange={e => setJobData({ ...jobData, problem_statement: e.target.value })}
                                        autoFocus
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-[12px] font-semibold text-gray-900 mb-2.5 ml-1 transition-colors group-focus-within:text-black">
                                        Core Technical Requirements
                                    </label>
                                    <div className="relative">
                                        <Zap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-black" />
                                        <input
                                            type="text"
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-sm placeholder:text-gray-400"
                                            placeholder="Go, Kubernetes, PostgreSQL, Prometheus"
                                            value={jobData.skills}
                                            onChange={e => setJobData({ ...jobData, skills: e.target.value })}
                                        />
                                    </div>
                                    <p className="mt-3 text-[11px] text-gray-400 ml-1">
                                        Enter specific technologies or infrastructure patterns, separated by commas.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={submitJob}
                                disabled={loading || !jobData.problem_statement || !jobData.skills}
                                className="mt-10 w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-black/5"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Finish & Publish Job
                                        <Check size={18} />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <footer className="mt-12 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div
                            className={clsx(
                                "h-1.5 transition-all duration-500 rounded-full",
                                step === 'recruiter-company' ? "w-8 bg-black" : "w-1.5 bg-gray-200"
                            )}
                        />
                        <div
                            className={clsx(
                                "h-1.5 transition-all duration-500 rounded-full",
                                step === 'recruiter-job' ? "w-8 bg-black" : "w-1.5 bg-gray-200"
                            )}
                        />
                    </div>

                    <p className="text-[11px] text-gray-400 text-center tracking-wide uppercase font-bold">
                        Professional Recruitment Experience
                    </p>
                </footer>
            </div>
        </div>
    );
}
