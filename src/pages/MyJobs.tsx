import { api } from '../lib/api';
import { Briefcase, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function MyJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading: loading, refetch, isRefetching } = useQuery({
    queryKey: ['my_jobs'],
    queryFn: async () => {
        const res = await api.get('/recruiters/jobs');
        return res.data.jobs || res.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
        await api.delete(`/recruiters/job/${id}`);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my_jobs'] });
    },
    onError: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete job');
    }
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this job? It will no longer appear to candidates.')) {
        deleteMutation.mutate(id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <div className="h-8 w-40 skeleton bg-gray-200" />
            <div className="h-4 w-64 skeleton bg-gray-100" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[200px] card-base bg-white border-dashed border-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground">Jobs</h2>
          <p className="text-sm text-gray-500 mt-1 font-normal">Active jobs published by your organization.</p>
        </div>
        <div className="flex gap-4 items-center">
            <button 
                onClick={() => refetch()}
                className="btn-secondary h-11 w-11 p-0 flex items-center justify-center"
                title="Refresh Jobs"
                disabled={isRefetching}
            >
                <RefreshCw size={16} className={isRefetching ? 'animate-spin' : 'text-gray-500'} />
            </button>
            <Link to="/jobs/new" className="btn-primary h-11 px-6 flex items-center gap-2 text-[13px] font-bold tracking-tight">
              <Plus size={16} />
              Post Job
            </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center card-base py-12 px-8 border-dashed shadow-none">
          <div className="w-16 h-16 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center mb-6">
            <Briefcase className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">No jobs yet</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs font-normal leading-relaxed">
            Post your first job to start receiving applications.
          </p>
          <Link to="/jobs/new" className="btn-secondary mt-8 h-10 px-8">Post First Job</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job: any, idx: number) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-base p-8 hover:border-black hover:shadow-md transition-all group bg-white"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <div className="dot dot-active bg-black" />
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest">Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">
                  {job.problem_statement}
                </h3>
                
                <p className="text-xs text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                  {job.expectations}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-[10px] text-gray-500 font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.skills_required.length > 3 && (
                      <span className="text-[10px] text-gray-400 font-medium">+{job.skills_required.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                        <Link to={`/jobs/edit/${job.id}`} className="p-2 rounded-md hover:bg-gray-50 text-gray-400 hover:text-black transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </Link>
                        <button 
                            onClick={() => handleDelete(job.id)}
                            className="p-2 rounded-md hover:bg-gray-50 text-gray-400 hover:text-black transition-all"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>
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
