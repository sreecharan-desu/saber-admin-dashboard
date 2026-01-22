
export default function DashboardHome() {
  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back. Here's what's happening today.</p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
                { label: 'Active Jobs', value: '12', color: 'bg-blue-500' },
                { label: 'New Candidates', value: '48', color: 'bg-green-500' },
                { label: 'Pending Matches', value: '5', color: 'bg-indigo-500' }
            ].map((stat) => (
                <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`rounded-md p-3 ${stat.color}`}>
                                    {/* Icon placeholder */}
                                    <div className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a href="/feed" className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <div className="flex-1 min-w-0">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">Review Candidates</p>
                        <p className="text-sm text-gray-500 truncate">Swipe through your daily feed</p>
                    </div>
                </a>
                <a href="/jobs/new" className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <div className="flex-1 min-w-0">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">Post a Job</p>
                        <p className="text-sm text-gray-500 truncate">Create a new opening</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
  );
}
