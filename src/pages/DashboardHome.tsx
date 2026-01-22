import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { SystemMetrics } from '../types';
import { Activity, Users, Briefcase } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMetrics();
    }
  }, [user]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to fetch metrics', err);
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
    
    // Default recruiter stats or placeholders (Mock Data)
    return [
        { label: 'Active Jobs', value: '12' },
        { label: 'New Candidates', value: '48' },
        { label: 'Pending Matches', value: '5' }
    ];
  };

  const stats = getStats();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Overview</h2>
        {user?.role === 'admin' && (
             <button 
                onClick={fetchMetrics} 
                disabled={loading}
                className="btn-secondary h-8 w-8 p-0"
            >
                <Activity size={14} className={loading ? 'animate-spin' : ''} />
            </button>
        )}
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
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.2em] mb-6">Recent Events</h3>
        <div className="card-base divide-y divide-gray-100">
           {/* Placeholder for activity feed */}
           <div className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="text-gray-400">
                    <Briefcase size={16} />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-gray-900">New Job Posted</p>
                    <p className="text-xs text-gray-500 font-normal">Frontend Engineer at Acme Corp</p>
                 </div>
              </div>
              <span className="text-[11px] font-mono text-gray-400 uppercase">2h ago</span>
           </div>
           
           <div className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="text-gray-400">
                    <Users size={16} />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-gray-900">Candidate Matched</p>
                    <p className="text-xs text-gray-500 font-normal">John Doe matched with Backend Role</p>
                 </div>
              </div>
              <span className="text-[11px] font-mono text-gray-400 uppercase">5h ago</span>
           </div>
        </div>
      </div>
      
      {/* Quick Actions as a simple link list or grid if needed, but keeping it minimal for now */}
       <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="card-base p-6">
               <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
               <div className="space-y-2">
                   <a href="/jobs/new" className="block text-sm text-gray-600 hover:text-black hover:underline decoration-gray-300 underline-offset-4">Post a new job opportunity &rarr;</a>
                   <a href="/feed" className="block text-sm text-gray-600 hover:text-black hover:underline decoration-gray-300 underline-offset-4">Review daily candidate feed &rarr;</a>
               </div>
           </div>
       </div>
    </div>
  );
}
