// ... imports
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '942388377321-su1u7ofm0ck76pvkiv07ksl8k9esfls6.apps.googleusercontent.com';
// Frontend URL where we handle the callback
const REDIRECT_URI = `${window.location.origin}/auth/callback`; 

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      login(token);
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state: 'google', // Pass provider name as state
      access_type: 'offline',
      prompt: 'consent'
    });
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleLinkedInLogin = () => {
      // Placeholder until we have LinkedIn Client ID in frontend env
      alert("LinkedIn Login requires configured Client ID in .env");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold uppercase">S</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to SABER Recruiter
        </h2>
        
        {/* ... */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Dev Access Block */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
             {/* ... */}
             <div className="flex">
               <div className="flex-shrink-0"><ShieldCheck className="h-5 w-5 text-blue-400" /></div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-blue-800">Dev Access</h3>
                 <div className="mt-2 text-sm text-blue-700">
                   <p>Run <code>npx ts-node scripts/generate-test-tokens.ts</code> in backend</p>
                 </div>
               </div>
             </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
             {/* Token Input ... */}
             <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">Access Token (JWT)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" 
                  value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJ..." required />
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
              Sign in
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                 <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.0003 20.45c4.7431 0 8.3508-3.4111 8.3508-8.2407 0-.7407-.0661-1.2721-.1946-1.7821h-8.1562v3.3444h4.7554c-.234.9922-.8431 2.3733-1.8904 3.12l-.0049.0711 2.6568 2.0621.1843.0184c1.6496-1.5173 2.6006-3.7506 2.6006-6.2716 0-.6163-.1056-1.2173-.2631-1.7821-1.3969.0435-8.2215.0232-9.6262.0232l-.1167.0051-.0052.1166c-.0273.6152-.0419 1.233-.0419 1.854 0 4.6705 3.7915 8.4619 8.4619 8.4619z" fill="#4285F4"/><path d="M12.0001 20.4501c-2.43 0-4.6621-1.0772-6.2307-2.7937l3.0583-2.3787c.7506.5165 1.8385.9526 3.1724.9526 2.2985 0 4.244-1.5541 4.9385-3.6457h3.2929l.0298.1408 2.756 2.1386-.0359.1176c-1.5976 3.1844-4.8878 5.4685-8.9813 5.4685z" fill="#34A853"/><path d="M5.7694 17.6565c-.4125-.8246-.6492-1.7589-.6492-2.7365 0-.968.2323-1.8936.6369-2.7119l-3.08-2.3966-.1127.0526c-.8452 1.5833-1.3242 3.3934-1.3242 5.3059 0 1.9576.4988 3.8066 1.3789 5.4182l3.1503-2.9317z" fill="#FBBC05"/><path d="M11.9999 7.3701c1.6373 0 3.1091.5644 4.2673 1.6706l2.4277-2.4277c-1.7552-1.6358-4.0489-2.613-6.695-2.613-4.0934 0-7.3835 2.284-8.981 5.4684l3.0798 2.3963c.6946-2.0916 2.64-3.6457 4.9385-3.6457z" fill="#EA4335"/></svg>
                 Google
              </button>
              <button onClick={handleLinkedInLogin} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                 LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
