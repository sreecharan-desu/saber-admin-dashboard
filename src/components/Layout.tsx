import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { 
  Bell, 
  Menu,
  LogOut,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const navTabs = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Activity', href: '/feed' }, // Was Recruiter Feed
    { label: 'Matches', href: '/matches' },
    { label: 'Jobs', href: '/jobs/new' }, // Temporary mapping
    { label: 'Company', href: '/company' },
  ];

  if (user.role === 'admin') {
    navTabs.push({ label: 'Settings', href: '/admin/settings' });
  }

  // Map root path to Overview
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="wrapper h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <svg 
                className="w-[28px] h-[28px]" 
                viewBox="0 0 116 100" 
                fill="#000" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0Z" />
              </svg>
              <h1 className="font-bold text-lg tracking-tight">saber</h1>
            </div>

            {/* Breadcrumb / Context Separator (Slash) */}
            <span className="text-gray-200 text-2xl font-light transform -rotate-12 select-none">/</span>

            {/* User/Org Context */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-gray-100 to-gray-300 border border-gray-200">
                {user.photo_url && <img src={user.photo_url} className="w-full h-full rounded-full object-cover" alt="" />}
              </div>
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="bg-gray-100 border border-gray-200 text-[10px] px-1.5 py-0.5 rounded text-gray-500 font-medium uppercase tracking-wide">
                {user.role}
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-black transition-colors p-1.5 rounded-full hover:bg-gray-100">
              <Bell size={18} />
            </button>
            <button 
              onClick={logout}
              className="hidden sm:flex text-gray-500 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-300 border border-gray-200 overflow-hidden">
                  {user.photo_url ? (
                    <img src={user.photo_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-medium uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <ChevronDown size={14} className={clsx("text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <UserIcon size={14} />
                      View Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Menu size={14} />
                        Admin Settings
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-1">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Sub-nav) */}
        <div className="wrapper overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1 h-12 text-sm">
            {navTabs.map((tab) => {
              // Exact match or sub-path match logic can be refined
              const isActive = currentPath === tab.href || (tab.href !== '/dashboard' && currentPath.startsWith(tab.href));
              
              return (
                <Link
                  key={tab.href}
                  to={tab.href === '/dashboard' ? '/' : tab.href}
                  className={clsx(
                    'px-3 py-2 rounded-md transition-colors text-[13px]',
                    isActive 
                      ? 'text-gray-900 font-medium bg-gray-100/50' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="wrapper py-8">
        {children}
      </main>
      
      {/* Vercel-style Footer */}
      <footer className="wrapper border-t border-gray-200 mt-12 py-8 text-sm text-gray-400 font-normal flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          Powered by <span className="text-black font-medium">SABER</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-black transition-colors">Documentation</a>
          <a href="#" className="hover:text-black transition-colors">Support</a>
          <a href="#" className="hover:text-black transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
}
