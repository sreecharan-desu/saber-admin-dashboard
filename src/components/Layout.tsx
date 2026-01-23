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

const BrandMark = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2L4.5 9L12 16L19.5 9L12 2Z" 
      fill="currentColor" 
      className="text-black"
    />
    <path 
      d="M12 22L4.5 15L12 8L19.5 15L12 22Z" 
      fill="currentColor" 
      fillOpacity="0.3"
      className="text-black"
    />
  </svg>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const navTabs = [
    { label: 'Jobs', href: '/jobs' },
    { label: 'Applications', href: '/applications' },
    { label: 'Company', href: '/company' },
  ];

  if (user.role === 'admin') {
    navTabs.push({ label: 'Settings', href: '/admin/settings' });
  }

  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200 selection:text-black">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-5" />
      
      <header className="sticky top-0 z-50 glass-panel border-b border-gray-100">
        <div className="wrapper h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <BrandMark className="w-8 h-8 text-black" />
              <h1 className="font-extrabold text-xl tracking-tighter uppercase italic text-black">saber</h1>
            </Link>

            <span className="text-gray-200 text-xl font-thin select-none">/</span>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] font-bold overflow-hidden text-black">
                {user.photo_url ? <img src={user.photo_url} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
              </div>
              <span className="font-bold text-xs text-gray-500 tracking-tight">{user.name}</span>
              <span className="bg-gray-50 border border-gray-100 text-[9px] px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase tracking-widest">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-50">
              <Bell size={18} />
            </button>
            <button 
              onClick={logout}
              className="hidden sm:flex text-gray-400 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-50"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 overflow-hidden">
                  {user.photo_url ? (
                    <img src={user.photo_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <ChevronDown size={14} className={clsx("text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-bottom-2">
                  <div className="px-4 py-4 border-b border-gray-50">
                    <p className="text-sm font-bold text-black tracking-tight">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate font-mono mt-1">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-all">
                      <UserIcon size={14} />
                      Technical Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-all">
                        <Menu size={14} />
                        Core Parameters
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-50 pt-2">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all opacity-70 hover:opacity-100"
                    >
                      <LogOut size={14} />
                      Terminate Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="wrapper overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1 h-12 text-sm">
            {navTabs.map((tab) => {
              const isActive = currentPath === tab.href || (tab.href !== '/dashboard' && currentPath.startsWith(tab.href));
              
              return (
                <Link
                  key={tab.href}
                  to={tab.href === '/dashboard' ? '/' : tab.href}
                  className={clsx(
                    'px-4 h-full flex items-center transition-all text-[11px] border-b-2 font-bold uppercase tracking-[0.2em]',
                    isActive 
                      ? 'text-black border-black bg-gray-50' 
                      : 'text-gray-400 border-transparent hover:text-black'
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="wrapper py-10 relative z-10">
        {children}
      </main>
      
      <footer className="wrapper border-t border-gray-100 mt-32 py-16 text-xs text-gray-400 font-bold flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <BrandMark className="w-5 h-5 text-black" />
            <span className="uppercase tracking-[0.2em] text-black">SABER <span className="text-[10px] font-normal tracking-normal lowercase italic text-gray-400">v1.2.0</span></span>
        </div>
        <div className="flex items-center gap-10 tracking-widest uppercase text-[9px] text-gray-400">
          <a href="#" className="hover:text-black transition-colors">Infra Protocol</a>
          <a href="#" className="hover:text-black transition-colors">Neural Telemetry</a>
          <a href="#" className="hover:text-black transition-colors">Support Matrix</a>
        </div>
      </footer>
    </div>
  );
}
