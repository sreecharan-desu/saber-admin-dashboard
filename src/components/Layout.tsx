import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  Menu,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { NavigationDock } from "./NavigationDock";



export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200 selection:text-black flex flex-col">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-5" />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="wrapper h-[72px] flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-3 group transition-all"
            >
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)] p-2">
                <img src="/saber-logo.png" alt="Saber Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="font-outfit font-bold text-xl tracking-tight text-slate-900">
                SABER
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 outline-none group"
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
              >
                <div className="w-9 h-9 rounded-[14px] bg-slate-900 border border-slate-900 overflow-hidden shadow-sm flex items-center justify-center transition-transform group-active:scale-95 text-white">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="text-xs font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <ChevronDown
                  size={14}
                  strokeWidth={3}
                  className={clsx(
                    "text-gray-400 transition-all duration-300",
                    userMenuOpen ? "rotate-180 text-black" : "group-hover:text-gray-600"
                  )}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50">
                    <p className="text-[14px] font-bold text-gray-900 tracking-tight">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate font-mono mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-2 px-2">
                    <Link
                      to="/company"
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <UserIcon size={16} />
                      Organization Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                      >
                        <Menu size={16} />
                        Platform Parameters
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-50 p-2 mt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <LogOut size={16} />
                      Terminate Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="ml-30 mr-10 max-w-[1600px] py-10 relative z-10 flex-1">{children}</main>

      <footer className="wrapper border-t border-gray-100 mt-auto py-12 text-xs text-gray-400 font-bold flex flex-col justify-center items-center gap-4 relative z-10">
        <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
          <img src="/saber-logo.png" className="w-5 h-5 object-contain" alt="Saber Mark" />
          <span className="uppercase tracking-[0.2em] text-black">
            SABER{" "}
            <span className="text-[10px] font-normal tracking-normal lowercase italic text-gray-400">
              v1.2.0
            </span>
          </span>
        </div>
        <span className="text-gray-400">Made with <span className="text-red-500">❤️</span> by Stark Protocol S4</span>
      </footer>
      <NavigationDock />
    </div>
  );
}
