import { api } from "../lib/api";
import { Briefcase, Plus, RefreshCw, Pencil, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

export default function MyJobs() {
  const queryClient = useQueryClient();

  const {
    data: jobs = [],
    isLoading: loading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["my_jobs"],
    queryFn: async () => {
      const res = await api.get("/recruiters/jobs");
      return res.data.jobs || res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recruiters/job/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_jobs"] });
    },
    onError: (err) => {
      console.error("Delete failed", err);
      alert("Failed to delete job");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await api.put(`/recruiters/job/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_jobs"] });
    },
  });

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    toggleActiveMutation.mutate({ id, active: !currentStatus });
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this job? This action cannot be undone.")
    ) {
      deleteMutation.mutate(id);
    }
  };

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-3">
            <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-4 w-72 bg-gray-50 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[280px] rounded-[32px] border border-gray-100 bg-white shadow-sm animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-outfit">
            Job Board
          </h2>
          <p className="text-gray-500 mt-2 font-medium max-w-md leading-relaxed">
            Manage your organization's active challenges and technical signals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-gray-200 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            title="Refresh database"
            disabled={isRefetching}
          >
            <RefreshCw
              size={18}
              strokeWidth={2.5}
              className={isRefetching ? "animate-spin" : ""}
            />
          </button>

          <Link
            to="/jobs/new"
            className="h-12 px-6 rounded-2xl bg-black text-white text-[13px] font-bold flex items-center gap-2.5 transition-all hover:bg-gray-800 hover:shadow-lg active:scale-[0.98] shadow-sm shadow-black/5"
          >
            <Plus size={18} strokeWidth={3} />
            Post New Job
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-white border border-gray-100 rounded-[40px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center justify-center mb-8 shadow-sm">
            <Briefcase className="text-gray-300" size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
            Your board is empty
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed mb-10">
            Start scouting for top-tier talent by publishing your first technical challenge.
          </p>
          <Link to="/jobs/new" className="h-12 px-10 rounded-2xl bg-black text-white font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
            Launch First Challenge
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job: any, idx: number) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={clsx(
                "group relative bg-white border border-gray-200 rounded-[20px] p-6 transition-all hover:border-black/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                !job.active && "opacity-80 bg-gray-50/50"
              )}
            >
              <div className="flex flex-col h-full">
                <header className="flex justify-between items-start mb-4">
                  <button
                    onClick={() => handleToggleActive(job.id, job.active)}
                    className={clsx(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all",
                      job.active
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        job.active ? "bg-emerald-500" : "bg-gray-400"
                      )}
                    />
                    {job.active ? "Active" : "Paused"}
                  </button>

                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    <Calendar size={12} strokeWidth={2.5} />
                    {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </header>

                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-black transition-colors font-outfit">
                    {job.problem_statement}
                  </h3>

                  {(job.constraints_json?.location || job.constraints_json?.salary_range) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
                      {job.constraints_json?.location && (
                        <span>{job.constraints_json.location}</span>
                      )}
                      {job.constraints_json?.location && job.constraints_json.salary_range && (
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      )}
                      {job.constraints_json?.salary_range && (
                        <span>
                          {typeof job.constraints_json.salary_range[0] === 'number'
                            ? `$${(job.constraints_json.salary_range[0] / 1000).toFixed(0)}k - $${(job.constraints_json.salary_range[1] / 1000).toFixed(0)}k`
                            : 'Salary N/A'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills_required.slice(0, 3).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] text-gray-600 font-bold tracking-tight"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills_required.length > 3 && (
                    <span className="px-2 py-1 text-[10px] text-gray-400 font-bold">
                      +{job.skills_required.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-[10px] font-semibold text-gray-400">
                    {/* Placeholder for application count if available */}
                    View Details
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/jobs/edit/${job.id}`}
                      className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                      title="Edit"
                    >
                      <Pencil size={14} strokeWidth={2.5} />
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
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
