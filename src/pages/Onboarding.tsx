import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

type Step = 'recruiter-company' | 'recruiter-job';

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  // Start directly at creating a company.
  const [step, setStep] = useState<Step>('recruiter-company');
  const [loading, setLoading] = useState(false);

  // Auto-upgrade if candidate
    useEffect(() => {
      
        if(user?.company_id){
            //forcefully navigate to dashboard 
            window.location.href = '/dashboard';
        }
    const checkUpgrade = async () => {
      if ((user?.role as string) === 'candidate') {
        try {
          await api.put('/user/role', { role: 'recruiter' });
          await refreshUser();
        } catch (err) {
          console.error("Auto-upgrade failed", err);
        }
      }
    };
    checkUpgrade();
  }, [user, refreshUser]);

  // Form States
  const [companyData, setCompanyData] = useState({ name: '', website: '' });
  const [jobData, setJobData] = useState({ 
    company_id: '', 
    problem_statement: '', 
    expectations: '',
    non_negotiables: '',
    deal_breakers: '',
    skills: '' 
  });

  // Recruiter Flow
  const submitCompany = async () => {
    try {
        setLoading(true);
        
        // 1. Explicitly update role to recruiter first
        await api.put('/user/role', { role: 'recruiter' });
        // NOTE: refreshUser is good, but the next POST will return the updated user too.
        
        // 2. Then create the company
        // Backend now returns { company: { id, ... }, user: { company_id, ... } }
        const res = await api.post('/recruiters/company', companyData);
        
        const newCompanyId = res.data.company?.id || res.data.user?.company_id;
        
        if (!newCompanyId) {
            throw new Error("Failed to retrieve company ID from response");
        }

        // Save company ID for job post
        setJobData(prev => ({...prev, company_id: newCompanyId}));
        
        // Optionally refresh user context with the returned user object to keep frontend in sync
        // if (res.data.user) { setUser(res.data.user); } // If we had setUser access, but we have refreshUser
        await refreshUser();
        
        setStep('recruiter-job');
    } catch (e: any) {
        console.error("Onboarding submission failed", e);
        alert(e.response?.data?.error || e.message || "Failed to complete step. Please try again.");
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
                 location: 'Remote'
             }
          });
          // Force a hard reload or navigate to root to ensure Context updates with new company/job info
          window.location.href = '/';
      } catch (e: any) { 
          console.error(e); 
          const errorMsg = e.response?.data?.error || "Failed to post job. Please try again.";
          alert(errorMsg);
      } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="w-full max-w-[440px] mb-12 text-center text-balance">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                {step === 'recruiter-company' && "Welcome to Saber"}
                {step === 'recruiter-job' && "Post your first role"}
            </h2>
             <p className="mt-2 text-sm text-gray-500 font-normal">
                {step === 'recruiter-company' && "Set up your workspace to start hiring top talent."}
                {step === 'recruiter-job' && "Describe the challenge. We'll find the match."}
            </p>
        </div>

        <div className="w-full max-w-[440px]">
            <div className="space-y-4">
                
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
                                autoFocus
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
                        <button onClick={submitCompany} disabled={loading} className="btn-primary w-full h-11 text-[14px] flex items-center justify-center gap-2">
                            {loading ? 'Creating...' : (
                                <>
                                    <Briefcase size={16} /> Create Workspace
                                </>
                            )}
                        </button>
                    </div>
                )}

                  {step === 'recruiter-job' && (
                     <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div>
                             <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Problem Statement</label>
                             <textarea 
                                 className="input-base min-h-[80px] py-3 text-balance leading-relaxed"
                                 placeholder="Describe a technical challenge the candidate will solve..."
                                 value={jobData.problem_statement}
                                 onChange={e => setJobData({...jobData, problem_statement: e.target.value})}
                                 autoFocus
                             />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Day-to-day Expectations</label>
                            <textarea 
                                className="input-base min-h-[80px] py-3 text-balance leading-relaxed"
                                placeholder="What will their typical day look like?"
                                value={jobData.expectations}
                                onChange={e => setJobData({...jobData, expectations: e.target.value})}
                            />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Non-Negotiables</label>
                                <textarea 
                                    className="input-base min-h-[80px] py-3 text-balance leading-relaxed"
                                    placeholder="Must-have skills/traits..."
                                    value={jobData.non_negotiables}
                                    onChange={e => setJobData({...jobData, non_negotiables: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Deal-Breakers</label>
                                <textarea 
                                    className="input-base min-h-[80px] py-3 text-balance leading-relaxed"
                                    placeholder="What would disqualify them?"
                                    value={jobData.deal_breakers}
                                    onChange={e => setJobData({...jobData, deal_breakers: e.target.value})}
                                />
                            </div>
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
                         <button onClick={submitJob} disabled={loading} className="btn-primary w-full h-11 text-[14px]">
                             {loading ? 'Publishing...' : 'Publish Job & Finish'}
                         </button>
                     </div>
                 )}
            </div>
        </div>
    </div>
  );
}
