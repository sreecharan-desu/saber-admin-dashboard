import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Plus, X, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function CreateJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    problem_statement: '',
    expectations: '',
    non_negotiables: '',
    deal_breakers: '',
    skills_required: [] as string[],
    newSkill: '',
    min_salary: 0,
    max_salary: 0,
    experience_years: 0,
    location: '',
    equity: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchJobToEdit();
    }

    if (user?.company_id) {
      setCompanyId(user.company_id);
    } else if (user?.companies && user.companies.length > 0) {
      setCompanyId(user.companies[0].id);
    } else if (user) {
      fetchCompany();
    }
  }, [id, user]);

  const fetchCompany = async () => {
    try {
      const res = await api.get('/recruiters/company');
      const company = res.data.company;
      if (company && company.id) {
        setCompanyId(company.id);
      } else if (!isEdit) {
        const confirmCreate = window.confirm(
          "You need to create a company profile before posting a job. Would you like to create one now?"
        );
        if (confirmCreate) {
          navigate('/company');
        }
      }
    } catch (err) {
      console.error("Failed to fetch company", err);
    }
  };

  const fetchJobToEdit = async () => {
    try {
      const res = await api.get('/recruiters/jobs');
      const allJobs = res.data.jobs || res.data || [];
      const job = allJobs.find((j: any) => j.id === id);
      
      if (job) {
        setFormData({
          problem_statement: job.problem_statement,
          expectations: job.expectations,
          non_negotiables: job.non_negotiables,
          deal_breakers: job.deal_breakers,
          skills_required: job.skills_required,
          newSkill: '',
          min_salary: job.constraints_json?.salary_range?.[0] || 0,
          max_salary: job.constraints_json?.salary_range?.[1] || 0,
          experience_years: job.constraints_json?.experience_years || 0,
          location: job.constraints_json?.location || '',
          equity: job.constraints_json?.equity || ''
        });
        setCompanyId(job.company_id);
      }
    } catch (err) {
      console.error("Failed to fetch job for editing", err);
    }
  };

  const addSkill = () => {
    if (formData.newSkill && !formData.skills_required.includes(formData.newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, prev.newSkill],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const activeCompanyId = companyId || prompt("Please enter your Company ID:");
    
    if (!activeCompanyId) {
      setError("Company ID is required.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        company_id: activeCompanyId,
        problem_statement: formData.problem_statement,
        expectations: formData.expectations,
        non_negotiables: formData.non_negotiables,
        deal_breakers: formData.deal_breakers,
        skills_required: formData.skills_required,
        constraints_json: {
          salary_range: [Number(formData.min_salary), Number(formData.max_salary)],
          experience_years: Number(formData.experience_years),
          location: formData.location,
          equity: formData.equity
        }
      };

      if (isEdit) {
        await api.put(`/recruiters/job/${id}`, payload);
      } else {
        await api.post('/recruiters/job', payload);
      }
      navigate('/jobs'); 
    } catch (err) {
      const errorMsg = (err as ApiError).response?.data?.error || "Failed to save job";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-12">
           <h1 className="text-3xl font-bold tracking-tighter text-foreground">
             {isEdit ? 'Refine Challenge' : 'Create Challenge'}
           </h1>
           <p className="text-sm text-gray-500 mt-2 font-normal">
             {isEdit ? 'Updating technical specifications for high-fidelity discovery.' : 'Define a technical problem, not a job description.'}
           </p>
      </div>

      {error && (
        <div className="rounded-md bg-gray-50 border border-black/10 p-4 mb-8 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="h-5 w-5 text-black mt-0.5" />
            <div className="text-sm text-black font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {!companyId && (
            <div className="bg-gray-50 rounded-md p-6 border border-black/10 flex flex-col gap-3">
               <label className="text-sm font-bold text-black uppercase tracking-widest">Workspace Context Required</label>
               <input 
                 type="text" 
                 value={companyId || ''} 
                 onChange={(e) => setCompanyId(e.target.value)}
                 className="input-base"
                 placeholder="Enter Company UUID manually"
                 autoFocus
               />
               <p className="text-xs text-gray-500">Workspace ID could not be auto-detected. Please provide it to continue.</p>
            </div>
        )}

        <div className="card-base p-10 space-y-12">
            <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">The Scope</h3>
                
                <div className="space-y-8 text-left">
                    <div className="relative">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Technical Problem Statement</label>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Signal Strength</span>
                                <div className="flex gap-1 h-1.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div 
                                            key={i} 
                                            className={clsx(
                                                "w-4 rounded-full transition-all duration-500",
                                                formData.problem_statement.length > i * 40 
                                                    ? "bg-black shadow-sm" 
                                                    : "bg-gray-200"
                                            )} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <textarea
                            rows={3}
                            className="input-base min-h-[140px] py-5 text-balance font-mono leading-relaxed resize-none focus:border-black transition-all text-lg"
                            placeholder="e.g. Scaling our distributed key-value store to handle 1M writes/sec with <5ms p99 latency."
                            value={formData.problem_statement}
                            onChange={e => setFormData({...formData, problem_statement: e.target.value})}
                            required
                        />
                        {formData.problem_statement.length > 0 && formData.problem_statement.length < 50 && (
                            <div className="absolute bottom-4 right-4 animate-in fade-in slide-in-from-right-4">
                                <p className="text-[10px] text-black font-bold uppercase tracking-tight flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-black/10">
                                    <AlertCircle size={10} />
                                    Low-signal alerts. Add more technical depth.
                                </p>
                            </div>
                        )}
                        {formData.problem_statement.length >= 150 && (
                            <div className="absolute bottom-4 right-4 animate-in fade-in slide-in-from-right-4">
                                <p className="text-[10px] text-black font-bold uppercase tracking-tight flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-black/10">
                                    <Sparkles size={10} />
                                    High-Signal Achieved
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Day-to-Day Expectations</label>
                        <textarea
                            rows={4}
                            className="input-base min-h-[140px] py-4 text-balance leading-relaxed resize-none"
                            placeholder="What technical decisions and implementations will they own?"
                            value={formData.expectations}
                            onChange={e => setFormData({...formData, expectations: e.target.value})}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Non-Negotiables</label>
                            <textarea
                                rows={3}
                                className="input-base min-h-[100px] py-4 text-balance leading-relaxed resize-none"
                                placeholder="Core technical requirements..."
                                value={formData.non_negotiables}
                                onChange={e => setFormData({...formData, non_negotiables: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Deal-Breakers</label>
                            <textarea
                                rows={3}
                                className="input-base min-h-[100px] py-4 text-balance leading-relaxed resize-none"
                                placeholder="Signals that indicate a poor fit..."
                                value={formData.deal_breakers}
                                onChange={e => setFormData({...formData, deal_breakers: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-10 space-y-8">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Hard Signals</h3>
                
                <div className="text-left">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Required Technical Core</label>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            className="input-base flex-1"
                            placeholder="e.g. Rust, K8s, Distributed Systems"
                            value={formData.newSkill}
                            onChange={e => setFormData({...formData, newSkill: e.target.value})}
                            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <button type="button" onClick={addSkill} className="btn-primary w-12 h-10 p-0">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {formData.skills_required.map(skill => (
                            <span key={skill} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold bg-gray-100 text-black">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="hover:opacity-70"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4 text-left">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Salary Floor</label>
                        <input type="number" className="input-base"
                            value={formData.min_salary} onChange={e => setFormData({...formData, min_salary: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Salary Ceiling</label>
                        <input type="number" className="input-base"
                            value={formData.max_salary} onChange={e => setFormData({...formData, max_salary: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Equity Range</label>
                         <input type="text" className="input-base"
                            placeholder="0.1% - 0.5%"
                            value={formData.equity} onChange={e => setFormData({...formData, equity: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Exp Level (Yrs)</label>
                        <input type="number" className="input-base"
                            value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: Number(e.target.value)})} />
                    </div>
                    <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Location Context</label>
                         <input type="text" className="input-base"
                            placeholder="Remote / San Francisco"
                            value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary h-12 px-8 font-bold"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={loading}
                className={clsx(
                    "btn-primary h-12 px-12 font-bold min-w-[160px]",
                    loading && "opacity-50 cursor-not-allowed"
                )}
            >
                {loading ? 'Saving...' : (isEdit ? 'Update Challenge' : 'Publish Challenge')}
            </button>
        </div>
      </form>
    </div>
  );
}
