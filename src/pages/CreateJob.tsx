import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Plus, X } from 'lucide-react';
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
    location: ''
  });

  useEffect(() => {
    // 1. Try to get company from user context
    if (user?.companies && user.companies.length > 0) {
      setCompanyId(user.companies[0].id);
      return;
    }

    // 2. If not in context, try to fetch it
    const fetchCompany = async () => {
      try {
        const res = await api.get('/company');
        // Assuming the API returns a list of companies or a single company object
        // Adjust based on actual API response structure
        const companies = Array.isArray(res.data) ? res.data : [res.data];
        
        if (companies.length > 0 && companies[0]?.id) {
          setCompanyId(companies[0].id);
        } else {
          // No company found, prompt user to create one
          const confirmCreate = window.confirm(
            "You need to create a company profile before posting a job. Would you like to create one now?"
          );
          if (confirmCreate) {
            navigate('/company');
          }
        }
      } catch (err) {
        console.error("Failed to fetch company", err);
        // Fallback: stay on page, maybe they know the ID or will fetch it later
      }
    };

    if (user) {
      fetchCompany();
    }
  }, [user, navigate]);

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

    // Prompt for company ID if we don't have it (Simple UX fix for now)
    const activeCompanyId = companyId || prompt("Please enter your Company ID (check console from previous step if unsure):");
    
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
          location: formData.location
        }
      };

      await api.post('/job', payload);
      navigate('/'); // Back to dashboard
    } catch (err) {
      const errorMsg = (err as ApiError).response?.data?.error || "Failed to post job";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="mb-8">
           <h1 className="text-2xl font-semibold tracking-tight text-gray-900">New Role</h1>
           <p className="text-sm text-gray-500 font-normal">Define the requirements for your next hire.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800 font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Helper for Company ID */}
        {/* Hidden Company ID Logic (or minimal display if needed) */}
        {!companyId && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex flex-col gap-2">
               <label className="text-sm font-medium text-amber-900">Missing Company Context</label>
               <input 
                 type="text" 
                 value={companyId || ''} 
                 onChange={(e) => setCompanyId(e.target.value)}
                 className="input-base bg-white"
                 placeholder="Enter Company UUID manually"
                 autoFocus
               />
               <p className="text-xs text-amber-700">We couldn't detect your active company. Please enter ID manually.</p>
            </div>
        )}

        <div className="card-base p-8 space-y-8">
            <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">Core Scope</h3>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Problem Statement</label>
                        <textarea
                            rows={3}
                            className="input-base min-h-[100px] py-3 text-balance leading-relaxed"
                            placeholder="What fundamental problem will this role solve?"
                            value={formData.problem_statement}
                            onChange={e => setFormData({...formData, problem_statement: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Day-to-Day Expectations</label>
                        <textarea
                            rows={4}
                            className="input-base min-h-[120px] py-3 text-balance leading-relaxed"
                            placeholder="Describe the routine and key responsibilities..."
                            value={formData.expectations}
                            onChange={e => setFormData({...formData, expectations: e.target.value})}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-4">
                 <h3 className="text-base font-semibold text-gray-900">Skills & Parameters</h3>
                
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Required Skills</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            className="input-base flex-1"
                            placeholder="Add a skill (e.g. TypeScript)"
                            value={formData.newSkill}
                            onChange={e => setFormData({...formData, newSkill: e.target.value})}
                            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <button type="button" onClick={addSkill} className="btn-secondary h-9 w-9 p-0 flex items-center justify-center">
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills_required.map(skill => (
                            <span key={skill} className="inline-flex items-center pl-2.5 pr-1 py-0.5 rounded-md text-xs font-medium bg-black text-white">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="ml-1.5 hover:text-gray-300"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Salary Floor ($)</label>
                        <input type="number" className="input-base"
                            value={formData.min_salary} onChange={e => setFormData({...formData, min_salary: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Salary Ceiling ($)</label>
                        <input type="number" className="input-base"
                            value={formData.max_salary} onChange={e => setFormData({...formData, max_salary: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Experience (Yrs)</label>
                        <input type="number" className="input-base"
                            value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Location</label>
                         <input type="text" className="input-base"
                            placeholder="Remote"
                            value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3">
            <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={loading}
                className={clsx(
                    "btn-primary w-32",
                    loading && "opacity-75 cursor-wait"
                )}
            >
                {loading ? 'Publishing...' : 'Publish'}
            </button>
        </div>
      </form>
    </div>
  );
}
