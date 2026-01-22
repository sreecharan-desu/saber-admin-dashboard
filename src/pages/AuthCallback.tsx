
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI;

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    const checkOnboardingStatus = async (token: string) => {
        try {
            // Need to set the token manually for this immediate request since context might be slow to update
            const meRes = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = meRes.data;

            const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
            // Strict Admin check OR Email Override
            if (user.role === 'admin' || user.email === adminEmail) {
                navigate('/');
                return;
            }

            // 0. If company_id already exists, they are done with onboarding (Master Toggle)
            if (user.company_id) {
                navigate('/');
                return;
            }

            // Otherwise, send to onboarding
            navigate('/onboarding');

        } catch (err) {
            console.error("Failed to check onboarding status", err);
            // Fallback to dashboard, let the protected routes handle it or user navigate manually
            navigate('/');
        }
    };

    const handleCallback = async (provider: string, code: string) => {
      try {
          const res = await api.post('/auth/oauth/callback', {
              provider,
              code,
              redirect_uri: REDIRECT_URI
          });
          
          if (res.data.token) {
              login(res.data.token);
              // Instead of direct navigate, we check onboarding
              checkOnboardingStatus(res.data.token);
          }
      } catch (err) {
          console.error('OAuth callback failed', err);
          navigate('/login?error=auth_failed');
      }
    };

    const code = searchParams.get('code');
    const token = searchParams.get('token');
    const state = searchParams.get('state');
    
    // If backend already handled exchange and gave us a token
    if (token && !processed.current) {
        processed.current = true;
        login(token);
        checkOnboardingStatus(token);
        return;
    }

    // Traditional flow: we have a code, send it to backend
    const provider = state || 'google'; 

    if (code && !processed.current) {
        processed.current = true;
        handleCallback(provider, code);
    } else if (!code && !token) {
        navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Authenticating...</h2>
            <p className="text-gray-500">Please wait while we verify your credentials.</p>
        </div>
    </div>
  );
}
