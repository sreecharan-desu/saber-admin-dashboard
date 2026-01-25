import { Github, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const REDIRECT_URI_PATH = '/auth/oauth/callback';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token');

    if (code || token) {
      navigate({
        pathname: '/auth/callback',
        search: searchParams.toString()
      }, { replace: true });
    }
  }, [searchParams, navigate]);

  const initiateOAuth = (provider: 'google' | 'github' | 'linkedin') => {
    const rootUrl = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
    }[provider];

    const redirect_uri = `${import.meta.env.VITE_API_BASE_URL}${REDIRECT_URI_PATH}`;

    const options = {
      client_id: import.meta.env[`VITE_${provider.toUpperCase()}_CLIENT_ID`],
      redirect_uri,
      response_type: 'code',
      scope: {
        google: 'openid email profile',
        github: 'read:user user:email',
        linkedin: 'openid profile email',
      }[provider],
      state: provider,
    };

    const qs = new URLSearchParams(options).toString();
    window.location.href = `${rootUrl}?${qs}`;
  };

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

          <div className="space-y-3">
            <button
              onClick={() => initiateOAuth('github')}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-black text-white text-sm font-semibold transition-all hover:bg-gray-800 active:scale-[0.98] shadow-sm"
            >
              <Github size={19} strokeWidth={2.5} />
              Continue with GitHub
            </button>

            <button
              onClick={() => initiateOAuth('google')}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c3.12 0 5.73-1.03 7.64-2.77l-3.57-2.77c-1.04.74-2.31 1.14-4.07 1.14-3.13 0-5.78-2.12-6.73-4.96H1.14v2.86C3.04 20.25 7.19 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.27 13.64c-.25-.74-.4-1.54-.4-2.36s.15-1.62.4-2.36V6.06H1.14C.41 7.59 0 9.29 0 11s.41 3.41 1.14 4.94l4.13-3.3z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.75c1.7 0 3.22.58 4.42 1.73l3.31-3.31C17.72 1.25 15.11 0 12 0 7.19 0 3.04 2.75 1.14 7.06l4.13 3.3c.96-2.84 3.61-4.96 6.73-4.96z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => initiateOAuth('linkedin')}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <svg className="h-5 w-5" fill="#0077b5" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              We take your security seriously with enterprise-grade encryption.
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
