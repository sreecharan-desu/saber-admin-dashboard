import { useState } from 'react';
import { api } from '../lib/api';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import clsx from 'clsx';
import { UserCircle, Briefcase, ChevronRight } from 'lucide-react';

type Step = 'role' | 'candidate-intent' | 'candidate-constraints' | 'recruiter-company' | 'recruiter-job';

export default function Onboarding() {
  // const { user, login } = useAuth(); 
  // const navigate = useNavigate();
  const [step, setStep] = useState<Step>('role');
  const [loading, setLoading] = useState(false);

  // Form States
  const [intentData, setIntentData] = useState({ intent_text: '', why_text: '' });
  const [constraints, setConstraints] = useState({ min_salary: 100000, remote: false });
  const [companyData, setCompanyData] = useState({ name: '', website: '' });
  const [jobData, setJobData] = useState({ company_id: '', problem_statement: '', skills: '' });

  // Step 1: Role Selection
  const handleRoleSelect = async (role: 'recruiter') => {
    if (role === 'recruiter') {
      try {
        setLoading(true);
        // We explicitly switch role. If candidate, we just proceed.
        await api.put('/user/role', { role: 'recruiter' });
        // In a real app we'd refresh the auth context here. 
        // For now, assume backend state is updated and we proceed locally.
        setStep('recruiter-company');
      } catch (err) {
        console.error('Failed to switch role', err);
        alert('Failed to update role. Please try again.');
        setLoading(false);
      }
    } else {
      // Stay candidate
      setStep('candidate-intent');
    }
  };

  // Candidate Flow
  const submitIntent = async () => {
    try {
      setLoading(true);
      await api.post('/user/intent', intentData);
      setStep('candidate-constraints');
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const submitConstraints = async () => {
    try {
      setLoading(true);
      await api.post('/user/constraints', constraints);
      // Done
      window.location.href = '/'; 
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // Recruiter Flow
  const submitCompany = async () => {
    try {
        setLoading(true);
        const res = await api.post('/company', companyData);
        // Save company ID for job post
        setJobData(prev => ({...prev, company_id: res.data.id}));
        setStep('recruiter-job');
    } catch (e) {
        console.error("Failed to create company", e);
        // Hack: if company already exists or fail, maybe skip?
        // simple alert for now
        alert("Failed to create company. Check if it exists.");
    } finally { setLoading(false); }
  };

  const submitJob = async () => {
      try {
          setLoading(true);
          await api.post('/job', {
             company_id: jobData.company_id,
             problem_statement: jobData.problem_statement,
             skills_required: jobData.skills.split(',').map(s => s.trim()),
             constraints_json: { remote_only: true } // Simplified constraint for onboarding
          });
          window.location.href = '/';
      } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="w-full max-w-[440px] mb-12 text-center text-balance">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                {step === 'role' && "Welcome to Saber"}
                {step === 'candidate-intent' && "What do you want to build?"}
                {step === 'candidate-constraints' && "Non-negotiables"}
                {step === 'recruiter-company' && "Setup your Company"}
                {step === 'recruiter-job' && "Post your first role"}
            </h2>
             <p className="mt-2 text-sm text-gray-500 font-normal">
                {step === 'role' && "Choose your path to get started with the platform."}
                {step === 'candidate-intent' && "Share your technical ambitions and problem-solving passion."}
                {step === 'candidate-constraints' && "Define your core requirements for a successful match."}
            </p>
        </div>

        <div className="w-full max-w-[440px]">
            <div className="space-y-4">
                
                {/* ROLE SELECTION */}
                {step === 'role' && (
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleRoleSelect('recruiter')}
                            className="group relative w-full flex items-center p-5 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all text-left"
                            disabled={loading}
                        >
                            <div className="h-10 w-10 flex-shrink-0 border border-gray-200 rounded-lg flex items-center justify-center bg-white group-hover:border-black transition-colors">
                                <Briefcase size={18} className="text-gray-900" />
                            </div>
                            <div className="ml-4">
                                <p className="text-[14px] font-medium text-gray-900">I'm hiring talent</p>
                                <p className="text-[13px] text-gray-500 font-normal">Manage jobs and candidates.</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-300 group-hover:text-black transition-all" size={14} />
                        </button>

                        <button 
                             onClick={() => setStep('candidate-intent')}
                             className="group relative w-full flex items-center p-5 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all text-left"
                        >
                            <div className="h-10 w-10 flex-shrink-0 border border-gray-200 rounded-lg flex items-center justify-center bg-white group-hover:border-black transition-colors">
                                <UserCircle size={18} className="text-gray-900" />
                            </div>
                            <div className="ml-4">
                                <p className="text-[14px] font-medium text-gray-900">I'm looking for a job</p>
                                <p className="text-[13px] text-gray-500 font-normal">Find your next engineering challenge.</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-300 group-hover:text-black transition-all" size={14} />
                        </button>
                    </div>
                )}

                {/* CANDIDATE FLOW */}
                {step === 'candidate-intent' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Dream Role</label>
                            <textarea 
                                className="input-base min-h-[120px] py-3 text-balance leading-relaxed"
                                placeholder={"Describe the problems you want to solve, e.g. \"Building highly available distributed systems...\""}
                                value={intentData.intent_text}
                                onChange={e => setIntentData({...intentData, intent_text: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">The Spark</label>
                            <textarea 
                                className="input-base min-h-[100px] py-3 text-balance leading-relaxed"
                                placeholder="Why does this specific domain or tech excite you?"
                                value={intentData.why_text}
                                onChange={e => setIntentData({...intentData, why_text: e.target.value})}
                            />
                        </div>
                        <button onClick={submitIntent} disabled={loading} className="btn-primary w-full h-11 text-[14px]">Continue</button>
                    </div>
                )}

                {step === 'candidate-constraints' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Annual Salary Baseline (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    className="input-base pl-7"
                                    placeholder="140,000"
                                    value={constraints.min_salary}
                                    onChange={e => setConstraints({...constraints, min_salary: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                            <input
                                id="remote"
                                type="checkbox"
                                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-0 accent-black"
                                checked={constraints.remote}
                                onChange={e => setConstraints({...constraints, remote: e.target.checked})}
                            />
                            <label htmlFor="remote" className="text-[14px] text-gray-900 font-medium">
                                Preferred Remote Work
                            </label>
                        </div>
                        <button onClick={submitConstraints} disabled={loading} className="btn-primary w-full h-11 text-[14px]">Finish Orientation</button>
                    </div>
                )}

                {/* RECRUITER FLOW */}
                {step === 'recruiter-company' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                            <input 
                                type="text"
                                className="input-base"
                                placeholder="Acme Inc."
                                value={companyData.name}
                                onChange={e => setCompanyData({...companyData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Website</label>
                            <input 
                                type="url"
                                className="input-base"
                                placeholder="https://acme.com"
                                value={companyData.website}
                                onChange={e => setCompanyData({...companyData, website: e.target.value})}
                            />
                        </div>
                        <button onClick={submitCompany} disabled={loading} className="btn-primary w-full h-11 text-[14px]">Create Workspace</button>
                    </div>
                )}

                 {step === 'recruiter-job' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Problem Statement</label>
                            <textarea 
                                className="input-base min-h-[120px] py-3 text-balance leading-relaxed"
                                placeholder="Describe a technical challenge the candidate will solve..."
                                value={jobData.problem_statement}
                                onChange={e => setJobData({...jobData, problem_statement: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Key Skills</label>
                            <input 
                                type="text"
                                className="input-base"
                                placeholder="Go, React, Distributed Systems"
                                value={jobData.skills}
                                onChange={e => setJobData({...jobData, skills: e.target.value})}
                            />
                        </div>
                        <button onClick={submitJob} disabled={loading} className="btn-primary w-full h-11 text-[14px]">Publish Job</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
