import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Briefcase, Eye, Users, CheckCircle2 } from 'lucide-react';

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

const ORDERED_STATUSES = ['pending', 'reviewing', 'interview', 'accepted', 'rejected'];

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
    pending: { color: '#71717a', label: 'Pending' }, // zinc-500
    reviewing: { color: '#3b82f6', label: 'Reviewing' }, // blue-500
    interview: { color: '#a855f7', label: 'Interview' }, // purple-500
    accepted: { color: '#10b981', label: 'Accepted' }, // emerald-500
    rejected: { color: '#ef4444', label: 'Rejected' }, // red-500
};

const Dashboard = () => {
    const [analytics, setAnalytics] = useState<RecruiterAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get<RecruiterAnalytics>('/analytics/recruiter');

            // Sort pipeline data logically
            const sortedPipeline = [...data.pipeline].sort((a, b) => {
                return ORDERED_STATUSES.indexOf(a.status) - ORDERED_STATUSES.indexOf(b.status);
            });

            setAnalytics({ ...data, pipeline: sortedPipeline });
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
                <div className="h-96 bg-gray-100 rounded-2xl border border-gray-200/50"></div>
            </div>
        );
    }

    if (!analytics) return (
        <div className="p-8 text-center text-gray-500">Failed to load data.</div>
    );

    // Calculate total for header
    const totalPipeline = analytics.pipeline.reduce((acc, curr) => acc + curr.count, 0);

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
                    title="Total Applications"
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

            {/* Pipeline Pie Chart */}
            <div className="w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <div className="flex items-center justify-between mb-2 relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Application Pipeline</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Breakdown by current status</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">
                            {totalPipeline} Candidates
                        </span>
                    </div>
                </div>

                <div className="h-[400px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={analytics.pipeline}
                                cx="50%"
                                cy="50%"
                                innerRadius={100}
                                outerRadius={140}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="status"
                                stroke="none"
                            >
                                {analytics.pipeline.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={STATUS_CONFIG[entry.status]?.color || '#3b82f6'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    color: '#000',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: '#000' }}
                                formatter={(value: any, name: any, props: any) => {
                                    return [value, STATUS_CONFIG[props.payload.status]?.label || name];
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => (
                                    <span className="text-gray-600 font-medium ml-1">
                                        {STATUS_CONFIG[value]?.label || value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
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
