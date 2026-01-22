import { Github } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
    
    // Using the guide's recommendation: VITE_API_BASE_URL/auth/oauth/callback
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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="flex justify-center mb-8">
            <svg 
              className="w-[40px] h-[40px]" 
              viewBox="0 0 116 100" 
              fill="#000" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0Z" />
            </svg>
        </div>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900">
          Log in to Saber
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white py-8 px-4 sm:px-10">
          <div className="space-y-4">
            <button
              onClick={() => initiateOAuth('github')}
              className="btn-primary w-full h-10 text-[14px] flex items-center justify-center gap-2"
            >
              <Github size={18} />
              Continue with GitHub
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={() => initiateOAuth('google')}
              className="btn-secondary w-full h-10 text-[14px] flex items-center justify-center gap-2 text-gray-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M12.0003 20.45c4.7431 0 8.3508-3.4111 8.3508-8.2407 0-.7407-.0661-1.2721-.1946-1.7821h-8.1562v3.3444h4.7554c-.234.9922-.8431 2.3733-1.8904 3.12l-.0049.0711 2.6568 2.0621.1843.0184c1.6496-1.5173 2.6006-3.7506 2.6006-6.2716 0-.6163-.1056-1.2173-.2631-1.7821-1.3969.0435-8.2215.0232-9.6262.0232l-.1167.0051-.0052.1166c-.0273.6152-.0419 1.233-.0419 1.854 0 4.6705 3.7915 8.4619 8.4619 8.4619z" fill="currentColor"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => initiateOAuth('linkedin')}
              className="btn-secondary w-full h-10 text-[14px] flex items-center justify-center gap-2 text-gray-600"
            >
               <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
               </svg>
               Continue with LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
