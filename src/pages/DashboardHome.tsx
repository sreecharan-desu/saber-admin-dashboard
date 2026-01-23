import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { SystemMetrics } from '../types';
import { Activity, Users, Briefcase, MessageSquare, ChevronRight, Zap, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recruiterStats, setRecruiterStats] = useState({
      activeJobs: 0,
      totalMatches: 0,
      workspaces: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminMetrics();
    } else if (user?.role === 'recruiter') {
      fetchRecruiterData();
    }
  }, [user]);

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to fetch admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiterData = async () => {
      setLoading(true);
      try {
          const matchesRes = await api.get('/matches');
          const matches = matchesRes.data.matches || matchesRes.data || [];
          
          let activeJobsCount = 0;
          try {
              const jobsRes = await api.get('/recruiters/jobs');
              activeJobsCount = (jobsRes.data.jobs || jobsRes.data || []).length;
          } catch (e) {
              activeJobsCount = (user?.company_id || (user?.companies && user.companies.length > 0)) ? 1 : 0;
          }
          
          setRecruiterStats({
              activeJobs: activeJobsCount,
              totalMatches: matches.length,
              workspaces: (user?.company_id || (user?.companies && user.companies.length > 0)) ? 1 : 0
          });
      } catch (err) {
          console.error('Failed to fetch recruiter data', err);
      } finally {
          setLoading(false);
      }
  };

  const getStats = () => {
    if (user?.role === 'admin' && metrics) {
      return [
        { label: 'Total Swipes', value: metrics.overview.total_swipes.toString(), icon: Zap },
        { label: 'Total Matches', value: metrics.overview.total_matches.toString(), icon: Users },
        { label: 'Match Rate', value: metrics.overview.match_rate, icon: Activity },
        { label: 'Active Jobs', value: metrics.overview.active_jobs.toString(), icon: Briefcase },
        { label: 'Active Candidates', value: metrics.overview.active_candidates.toString(), icon: Users },
      ];
    }
    
    return [
        { label: 'Workspaces', value: recruiterStats.workspaces.toString(), icon: Briefcase },
        { label: 'Total Matches', value: recruiterStats.totalMatches.toString(), icon: Users },
        { label: 'Active Jobs', value: recruiterStats.activeJobs.toString(), icon: Briefcase }
    ];
  };

  const stats = getStats();

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold tracking-tighter text-white">Overview</h2>
            <p className="text-sm text-gray-500 mt-1 font-normal">System performance and recruiter metrics.</p>
        </div>
        <button 
            onClick={user?.role === 'admin' ? fetchAdminMetrics : fetchRecruiterData} 
            disabled={loading}
            className="btn-secondary h-10 w-10 p-0 flex items-center justify-center border-gray-800"
        >
            <Activity size={18} className={loading ? 'animate-spin' : 'text-gray-400'} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card-base p-8 hover:border-gray-600 transition-all group overflow-hidden relative">
            <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">{stat.label}</dt>
            <dd className="text-5xl font-bold text-white tracking-tighter font-sans flex items-baseline gap-2">
                {stat.value}
            </dd>
            <div className="absolute right-4 bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {stat.icon && <stat.icon size={80} />}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Next Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                      { title: 'My Challenges', desc: 'Manage your active job postings.', href: '/jobs', icon: Briefcase },
                      { title: 'Create Job Challenge', desc: 'Define a new technical problem statement.', href: '/jobs/new', icon: Plus },
                      { title: 'Discovery Feed', desc: 'Review AI-matched candidates.', href: '/feed', icon: Zap },
                      { title: 'Active Matches', desc: 'Continue candidate discussions.', href: '/matches', icon: MessageSquare },
                  ].map((action) => (
                      <Link key={action.href} to={action.href} className="card-base p-6 hover:bg-[#111] transition-all group flex items-start gap-4">
                          <div className="p-3 bg-black border border-gray-800 rounded-lg group-hover:border-gray-600 transition-all text-gray-400 group-hover:text-white">
                              <action.icon size={20} />
                          </div>
                          <div className="flex-1">
                              <h4 className="text-sm font-bold text-white mb-1">{action.title}</h4>
                              <p className="text-xs text-gray-500 font-normal leading-relaxed">{action.desc}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-700 mt-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                  ))}
              </div>
          </div>

          <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">System Status</h3>
              <div className="card-base p-6 space-y-6">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="dot dot-active" />
                          <span className="text-sm font-medium text-gray-300">Backend API</span>
                      </div>
                      <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">OPERATIONAL</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="dot dot-active" />
                          <span className="text-sm font-medium text-gray-300">AI Match Engine</span>
                      </div>
                      <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">OPERATIONAL</span>
                  </div>
                  <div className="border-t border-gray-800 pt-6">
                      <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
                          All systems are functional. Real-time candidate analysis is active across all workspaces.
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
