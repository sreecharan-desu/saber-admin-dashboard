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
    { label: 'Jobs', href: '/jobs' },
    { label: 'Company', href: '/company' },
  ];

  if (user.role === 'admin') {
    navTabs.push({ label: 'Settings', href: '/admin/settings' });
  }

  // Map root path to Overview
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-vercel-blue selection:text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-50" />
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 relative z-50">
        <div className="wrapper h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo area */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg 
                className="w-[28px] h-[28px]" 
                viewBox="0 0 116 100" 
                fill="#FFF" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0Z" />
              </svg>
              <h1 className="font-bold text-lg tracking-tight">saber</h1>
            </Link>

            {/* Breadcrumb / Context Separator (Slash) */}
            <span className="text-gray-700 text-xl font-light select-none">/</span>

            {/* User/Org Context */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                {user.photo_url ? <img src={user.photo_url} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
              </div>
              <span className="font-medium text-sm text-gray-300">{user.name}</span>
              <span className="bg-gray-800 border border-gray-700 text-[9px] px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase tracking-widest">
                {user.role}
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-gray-900 border border-transparent hover:border-gray-800">
              <Bell size={18} />
            </button>
            <button 
              onClick={logout}
              className="hidden sm:flex text-gray-500 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-800"
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden">
                  {user.photo_url ? (
                    <img src={user.photo_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <ChevronDown size={14} className={clsx("text-gray-500 transition-transform", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-black border border-gray-800 rounded-lg shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-bottom-2">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-900 transition-colors">
                      <UserIcon size={14} />
                      View Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-900 transition-colors">
                        <Menu size={14} />
                        Admin Settings
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-800 pt-1">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-white transition-colors"
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
              const isActive = currentPath === tab.href || (tab.href !== '/dashboard' && currentPath.startsWith(tab.href));
              
              return (
                <Link
                  key={tab.href}
                  to={tab.href === '/dashboard' ? '/' : tab.href}
                  className={clsx(
                    'px-3 h-full flex items-center transition-all text-[13px] border-b-2 font-medium',
                    isActive 
                      ? 'text-white border-white' 
                      : 'text-gray-500 border-transparent hover:text-gray-300'
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
      <main className="wrapper py-8 relative z-10">
        {children}
      </main>
      
      {/* Vercel-style Footer */}
      <footer className="wrapper border-t border-gray-800 mt-24 py-12 text-sm text-gray-500 font-normal flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex items-center gap-2">
            <svg 
                className="w-5 h-5" 
                viewBox="0 0 116 100" 
                fill="#444" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0Z" />
            </svg>
            <span>Powered by <span className="text-gray-300 font-semibold tracking-tight">SABER</span></span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
          <a href="#" className="hover:text-white transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
}
