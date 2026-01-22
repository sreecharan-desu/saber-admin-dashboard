import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function CreateJob() {
  const { user } = useAuth(); // We might use this to verify company state
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
    // We need to fetch the company ID associated with the user first
    // Since there's no direct "get my company" endpoint documented for simple CRUD,
    // we'll fetch /auth/me include companies? The backend User model has companies[].
    // Let's assume we can fetch it or we prompt relevant error.
    
    // For MVP, Recruiter MUST know their company ID, or we fetch it via a helper?
    // Actually, createJob requires `company_id`.
    // Let's stick a "Fetch My Company" logic or just hardcode for the first company found?
    
    // Better: GET /auth/me sends full user object. If `companies` are included implicitly
    // via Prisma relation. The current /auth/me implementation fetches user by ID.
    // We might need to check if it includes companies.
    // If not, we will ask the user to input Company ID or handle it gracefully.
    // Let's try to infer it from context if possible, otherwise we ask.
  }, []);

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
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a New Job</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3 text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow rounded-lg p-8">
        
        {/* Helper for Company ID */}
        <div>
           <label className="block text-sm font-medium text-gray-700">Company ID</label>
           <input 
             type="text" 
             value={companyId || ''} 
             onChange={(e) => setCompanyId(e.target.value)}
             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
             placeholder="Paste UUID if known, or we will prompt"
           />
           <p className="text-xs text-gray-500 mt-1">If you just created a company, check the response or database.</p>
        </div>

        <div className="space-y-6 border-b border-gray-200 pb-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Core Requirements</h3>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Problem Statement</label>
                    <textarea
                        rows={3}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="What needs to be solved?"
                        value={formData.problem_statement}
                        onChange={e => setFormData({...formData, problem_statement: e.target.value})}
                        required
                    />
                </div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Expectations</label>
                    <textarea
                        rows={3}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="What will the candidate do day-to-day?"
                        value={formData.expectations}
                        onChange={e => setFormData({...formData, expectations: e.target.value})}
                        required
                    />
                </div>
            </div>
        </div>

        <div className="space-y-6 border-b border-gray-200 pb-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Skills & Constraints</h3>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                <div className="mt-1 flex gap-2">
                    <input
                        type="text"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Add a skill (e.g. React)"
                        value={formData.newSkill}
                        onChange={e => setFormData({...formData, newSkill: e.target.value})}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button type="button" onClick={addSkill} className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills_required.map(skill => (
                        <span key={skill} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-primary-100 text-primary-700">
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                            >
                                <span className="sr-only">Remove {skill}</span>
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Min Salary ($)</label>
                    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={formData.min_salary} onChange={e => setFormData({...formData, min_salary: Number(e.target.value)})} />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Max Salary ($)</label>
                    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={formData.max_salary} onChange={e => setFormData({...formData, max_salary: Number(e.target.value)})} />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: Number(e.target.value)})} />
                </div>
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                     <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Remote / City"
                        value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
            </div>
        </div>

        <div className="pt-5">
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={clsx(
                        "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                        loading && "opacity-75 cursor-wait"
                    )}
                >
                    {loading ? 'Publishing...' : 'Publish Job'}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
}
