import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { motion } from 'framer-motion';
import { FileText, User, Mail, Calendar, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';
  cover_note?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    photo_url?: string;
    intent_text?: string;
    skills: Array<{
      name: string;
      source: string;
      confidence_score: number;
    }>;
  };
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-500 border-gray-200', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'bg-black text-white border-black', icon: FileText },
  interview: { label: 'Interview', color: 'bg-white text-black border-black', icon: User },
  accepted: { label: 'Accepted', color: 'bg-white text-black border-black border-2', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-gray-50 text-gray-400 border-gray-100', icon: XCircle },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-50 text-gray-300 border-gray-100', icon: XCircle }
};

export default function Applications() {
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/recruiters/jobs');
      setJobs(res.data.jobs || res.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    if (selectedJobId && selectedJobId !== 'all') {
      fetchApplications();
    } else {
      setApplications([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJobId]);

  const fetchApplications = async () => {
    if (!selectedJobId || selectedJobId === 'all') return;

    setLoading(true);
    try {
      const res = await api.get(`/candidates/jobs/${selectedJobId}/applications`);
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/candidates/applications/${applicationId}/status`, { status });
      await fetchApplications(); // Refresh list
      setSelectedApplication(null);
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStats = () => {
    const stats = {
      pending: applications.filter(a => a.status === 'pending').length,
      reviewing: applications.filter(a => a.status === 'reviewing').length,
      interview: applications.filter(a => a.status === 'interview').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground">Applications</h2>
          <p className="text-sm text-gray-500 mt-1 font-normal">Manage candidate applications for your jobs.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={fetchApplications}
            disabled={!selectedJobId || selectedJobId === 'all'}
            className="h-11 cursor-pointer w-15 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-black hover:border-gray-300 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Applications"
          >
            <RefreshCw size={18} strokeWidth={2.5} className={loading ? 'animate-spin text-black' : ''} />
          </button>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="input-base w-64 h-11 py-0 text-sm font-medium border-gray-200 bg-white"
          >
            <option value="all">Select a job...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.problem_statement?.slice(0, 50)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedJobId === 'all' ? (
        <div className="card-base p-20 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">Select a Job</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Choose a job from the dropdown above to view and manage applications.
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats).map(([status, count]) => {
              const config = statusConfig[status as keyof typeof statusConfig];
              const Icon = config.icon;
              return (
                <div key={status} className="card-base p-6 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {config.label}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-foreground tracking-tighter">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="card-base p-12 text-center">
              <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="card-base p-20 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">No Applications Yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                This job hasn't received any applications yet. Check back later or promote your job listing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((application) => {
                const config = statusConfig[application.status];
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-base p-6 hover:border-black transition-all cursor-pointer bg-white"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex items-start gap-6">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {application.user.photo_url ? (
                          <img src={application.user.photo_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-300">
                            {application.user.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
                              {application.user.name}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Mail size={12} />
                                {application.user.email}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                {formatDate(application.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} text-xs font-bold`}>
                            <StatusIcon size={12} />
                            {config.label}
                          </div>
                        </div>

                        {application.user.intent_text && (
                          <p className="text-sm text-gray-500 mb-3 italic">
                            "{application.user.intent_text}"
                          </p>
                        )}

                        {application.user.skills && application.user.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {application.user.skills.slice(0, 6).map((skill, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-gray-50 border border-gray-200 text-[10px] text-gray-500 font-medium">
                                {skill.name}
                              </span>
                            ))}
                            {application.user.skills.length > 6 && (
                              <span className="text-[10px] text-gray-400 self-center">
                                +{application.user.skills.length - 6} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-6"
          onClick={() => setSelectedApplication(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full card-base p-8 bg-white max-h-[90vh] overflow-y-auto shadow-2xl border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                {selectedApplication.user.photo_url ? (
                  <img src={selectedApplication.user.photo_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-3xl font-bold text-gray-300">
                    {selectedApplication.user.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                  {selectedApplication.user.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">{selectedApplication.user.email}</p>
                <p className="text-xs text-gray-400">
                  Applied {formatDate(selectedApplication.created_at)}
                </p>
              </div>
            </div>

            {selectedApplication.cover_note && (
              <div className="mb-8 p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <h3 className="text-[10px] font-bold text-black uppercase tracking-widest mb-3">
                  Cover Note
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{selectedApplication.cover_note}"
                </p>
              </div>
            )}

            {selectedApplication.user.intent_text && (
              <div className="mb-8 p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <h3 className="text-[10px] font-bold text-black uppercase tracking-widest mb-3">
                  Career Intent
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedApplication.user.intent_text}
                </p>
              </div>
            )}

            {selectedApplication.user.skills && selectedApplication.user.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.user.skills.map((skill, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600">
                      {skill.name}
                      <span className="ml-2 text-[10px] text-gray-400">
                        {Math.round(skill.confidence_score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Update Status
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['reviewing', 'interview', 'accepted', 'rejected'].map((status) => {
                  const config = statusConfig[status as keyof typeof statusConfig];
                  const Icon = config.icon;
                  const isCurrentStatus = selectedApplication.status === status;

                  return (
                    <button
                      key={status}
                      onClick={() => updateApplicationStatus(selectedApplication.id, status)}
                      disabled={updatingStatus || isCurrentStatus}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border font-bold text-sm transition-all ${isCurrentStatus
                        ? config.color + ' opacity-50 cursor-not-allowed shadow-inner'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-black hover:text-black'
                        }`}
                    >
                      <Icon size={16} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setSelectedApplication(null)}
              className="w-full mt-6 btn-secondary h-12"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
