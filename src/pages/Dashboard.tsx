import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Briefcase, Eye, Users, CheckCircle2, TrendingUp } from 'lucide-react';

interface RecruiterAnalytics {
    active_jobs: number;
    total_applications: number;
    total_matches: number;
    total_views: number;
    pipeline: Array<{
        status: string;
        count: number;
    }>;
}

const Dashboard = () => {
    const [analytics, setAnalytics] = useState<RecruiterAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get<RecruiterAnalytics>('/analytics/recruiter');
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-8 animate-pulse max-w-7xl mx-auto">
                <div className="h-8 w-48 bg-gray-100 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-2xl border border-gray-200/50"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-gray-100 rounded-2xl border border-gray-200/50"></div>
                    <div className="h-96 bg-gray-100 rounded-2xl border border-gray-200/50"></div>
                </div>
            </div>
        );
    }

    if (!analytics) return (
        <div className="p-8 text-center text-gray-500">Failed to load data.</div>
    );

    const conversionRate = analytics.total_views > 0
        ? ((analytics.total_applications / analytics.total_views) * 100).toFixed(1)
        : '0';

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your recruitment performance</p>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Jobs"
                    value={analytics.active_jobs}
                    icon={Briefcase}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Total Views"
                    value={analytics.total_views}
                    icon={Eye}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatCard
                    title="Applications"
                    value={analytics.total_applications}
                    icon={Users}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <StatCard
                    title="Matches"
                    value={analytics.total_matches}
                    icon={CheckCircle2}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hiring Funnel Chart */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Hiring Funnel</h3>
                            <p className="text-sm text-gray-500">Candidate status distribution</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.pipeline} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                <XAxis
                                    dataKey="status"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }}
                                    dy={16}
                                    tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={60}>
                                    {analytics.pipeline.map((entry, index) => {
                                        let fill = '#3B82F6';
                                        if (entry.status === 'pending') fill = '#9CA3AF'; // Gray
                                        if (entry.status === 'reviewing') fill = '#3B82F6'; // Blue
                                        if (entry.status === 'interview') fill = '#8B5CF6'; // Purple
                                        if (entry.status === 'accepted') fill = '#10B981'; // Green
                                        return <Cell key={`cell-${index}`} fill={fill} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Rate Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Conversion Rate</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">Percentage of viewers who applied to your active jobs.</p>
                    </div>

                    <div className="py-8 text-center relative">
                        <span className="text-6xl font-black text-gray-900 tracking-tighter">
                            {conversionRate}
                            <span className="text-2xl text-gray-400 ml-1 font-bold">%</span>
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(parseFloat(conversionRate), 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs font-medium text-gray-400">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex items-start justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-black text-gray-900">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${bg} ${color} border border-transparent`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

export default Dashboard;
