import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  Bell,
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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200 selection:text-black">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-5" />

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="wrapper h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-3.5 group transition-all"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm transition-transform group-hover:scale-105 p-1.5 overflow-hidden">
                <img src="/saber-logo.png" alt="Saber Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="font-outfit font-extrabold text-2xl tracking-tighter text-gray-900 group-hover:text-black transition-colors">
                SABER
              </h1>
            </Link>

            <div className="h-6 w-[1px] bg-gray-100" />

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold overflow-hidden text-black shadow-sm">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[13px] text-gray-900 leading-none mb-1">
                  {user.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100/50">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-black transition-all p-2.5 rounded-xl hover:bg-gray-50 relative">
              <Bell size={20} strokeWidth={2} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-black rounded-full border border-white" />
            </button>

            <div className="h-6 w-[1px] bg-gray-100 mx-2" />

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={clsx(
                  "flex items-center gap-2 p-1.5 rounded-2xl transition-all",
                  userMenuOpen ? "bg-gray-50 text-black" : "text-gray-400 hover:text-black hover:bg-gray-50"
                )}
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
              >
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={clsx(
                    "transition-transform mr-1",
                    userMenuOpen && "rotate-180",
                  )}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/30">
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

      <main className="wrapper py-10 relative z-10">{children}</main>

      <footer className="wrapper border-t border-gray-100 mt-32 py-16 text-xs text-gray-400 font-bold flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
          <img src="/saber-logo.png" className="w-5 h-5 object-contain" alt="Saber Mark" />
          <span className="uppercase tracking-[0.2em] text-black">
            SABER{" "}
            <span className="text-[10px] font-normal tracking-normal lowercase italic text-gray-400">
              v1.2.0
            </span>
          </span>
        </div>
        <div className="flex items-center gap-10 tracking-widest uppercase text-[9px] text-gray-400">
          <a href="#" className="hover:text-black transition-colors">
            Infra Protocol
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Neural Telemetry
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Support Matrix
          </a>
        </div>
      </footer>
      <NavigationDock />
    </div>
  );
}
