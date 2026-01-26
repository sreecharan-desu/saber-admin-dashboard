import { ChevronLeft, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-50 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-50 rounded-full blur-[120px] opacity-50" />

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all z-10"
      >
        <ChevronLeft size={24} />
      </Link>

      <div className="relative w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-2">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 transform transition-transform hover:scale-105 overflow-hidden p-2">
              <img
                src="/logo1.png"
                alt="Saber App Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Welcome back to Saber
            </h1>
            <p className="text-gray-500 text-sm mb-10">
              The professional edge for recruiters and builders.
            </p>
          </div>

          {/* Login Disabled Notice */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-3 duration-700">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 mb-4 shadow-sm border border-slate-100">
              <Rocket size={22} className="ml-1" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              We're Scaling Up
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed px-2">
              Saber was built for a hackathon and is strictly being
              re-engineered for large-scale operations. Logins are disabled
              while we prepare for launch.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              By continuing, you acknowledge the current maintenance status.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} Saber Recruiting. All rights reserved.
        </div>
      </div>
    </div>
  );
}
