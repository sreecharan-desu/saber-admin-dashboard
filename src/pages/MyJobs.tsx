import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Briefcase, Plus, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Job {
  id: string;
  problem_statement: string;
  expectations: string;
  non_negotiables: string;
  deal_breakers: string;
  skills_required: string[];
  active: boolean;
  created_at: string;
  company: {
    name: string;
  };
  constraints_json: {
    location?: string;
    salary_range?: [number, number];
    experience_years?: number;
  };
}

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiters/jobs');
      setJobs(res.data.jobs || res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <div className="h-8 w-40 skeleton" />
            <div className="h-4 w-64 skeleton" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[200px] card-base skeleton opacity-50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white">Challenges</h2>
          <p className="text-sm text-gray-500 mt-1 font-normal">Active technical challenges published by your organization.</p>
        </div>
        <Link to="/jobs/new" className="btn-primary h-11 px-6 flex items-center gap-2 text-[13px] font-bold tracking-tight">
          <Plus size={16} />
          Publish Challenge
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center card-base py-12 px-8 border-dashed">
          <div className="w-16 h-16 bg-gray-900 rounded-full border border-gray-800 flex items-center justify-center mb-6">
            <Briefcase className="text-gray-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">No challenges yet</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-xs font-normal leading-relaxed">
            Publish your first technical challenge to start matching with top tier engineering talent.
          </p>
          <Link to="/jobs/new" className="btn-secondary mt-8 h-10 px-8">Create First Job</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-base p-8 hover:bg-[#050505] group transition-all"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <div className="dot dot-active" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-600">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-vercel-blue transition-colors">
                  {job.problem_statement}
                </h3>
                
                <p className="text-xs text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                  {job.expectations}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-400 font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.skills_required.length > 3 && (
                      <span className="text-[10px] text-gray-600 font-medium">+{job.skills_required.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">Budget</span>
                        <span className="text-xs font-medium text-gray-300">
                            {job.constraints_json.salary_range ? 
                                `$${(job.constraints_json.salary_range[0]/1000).toFixed(0)}k - $${(job.constraints_json.salary_range[1]/1000).toFixed(0)}k` : 
                                'N/A'}
                        </span>
                    </div>
                    <Link to={`/feed?jobId=${job.id}`} className="p-2 rounded-md hover:bg-gray-800 text-gray-500 hover:text-white transition-all">
                        <Activity size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
