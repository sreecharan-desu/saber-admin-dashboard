import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Building2, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Users 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Company Profile', href: '/company', icon: Building2 },
    { label: 'Post Job', href: '/jobs/new', icon: Briefcase },
    { label: 'Candidate Feed', href: '/feed', icon: Users },
    { label: 'Matches & Chat', href: '/matches', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-lg">S</div>
            SABER
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Recruiter Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
               {user.photo_url ? <img src={user.photo_url} alt={user.name} /> : <span>{user.name.charAt(0)}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
