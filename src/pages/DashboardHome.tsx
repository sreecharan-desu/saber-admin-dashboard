import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { SystemMetrics } from '../types';
import { Activity, Users, Briefcase, MessageSquare } from 'lucide-react';

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
          // Fetch matches to get a count
          const matchesRes = await api.get('/matches');
          const matches = matchesRes.data.matches || matchesRes.data || [];
          
          // Count active jobs if possible (approximating from companies/user context)
          const hasCompany = !!user?.company_id || (user?.companies && user.companies.length > 0);
          const companiesCount = hasCompany ? 1 : 0;
          
          setRecruiterStats({
              activeJobs: companiesCount, // Fallback to company count if jobs API isn't direct
              totalMatches: matches.length,
              workspaces: companiesCount
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
        { label: 'Total Swipes', value: metrics.overview.total_swipes.toString() },
        { label: 'Total Matches', value: metrics.overview.total_matches.toString() },
        { label: 'Match Rate', value: metrics.overview.match_rate },
        { label: 'Active Jobs', value: metrics.overview.active_jobs.toString() },
        { label: 'Active Candidates', value: metrics.overview.active_candidates.toString() },
      ];
    }
    
    return [
        { label: 'Workspaces', value: recruiterStats.workspaces.toString() },
        { label: 'Total Matches', value: recruiterStats.totalMatches.toString() },
        { label: 'Active Jobs', value: recruiterStats.activeJobs.toString() }
    ];
  };

  const stats = getStats();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Overview</h2>
        <button 
            onClick={user?.role === 'admin' ? fetchAdminMetrics : fetchRecruiterData} 
            disabled={loading}
            className="btn-secondary h-8 w-8 p-0"
        >
            <Activity size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card-base p-6 hover:border-black transition-colors group">
            <dt className="text-[12px] font-medium text-gray-400 uppercase tracking-widest">{stat.label}</dt>
            <dd className="mt-2 text-4xl font-semibold text-gray-900 tracking-tighter font-mono">{stat.value}</dd>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.2em] mb-6">System Status</h3>
        <div className="card-base p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="text-green-500">
                   <Activity size={16} />
                </div>
                <div>
                   <p className="text-sm font-medium text-gray-900">Backend API</p>
                   <p className="text-xs text-gray-500 font-normal">Connected to saber-api-backend.vercel.app</p>
                </div>
            </div>
            <span className="text-[11px] font-mono text-green-500 uppercase font-bold text-xs tracking-widest">Operational</span>
        </div>
      </div>
      
       <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="card-base p-6">
               <h3 className="font-medium text-gray-900 mb-2">Next Steps</h3>
               <div className="space-y-4">
                   <a href="/jobs/new" className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors">
                       <Briefcase size={16} />
                       Post a new job opportunity
                   </a>
                   <a href="/feed" className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors">
                       <Users size={16} />
                       Review daily candidate feed
                   </a>
                   <a href="/matches" className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors">
                       <MessageSquare size={16} />
                       Manage message threads
                   </a>
               </div>
           </div>
       </div>
    </div>
  );
}
