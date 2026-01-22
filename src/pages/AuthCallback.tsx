
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // In prod we check state for CSRF
    
    // We infer provider from state or URL path if we had multiple routes.
    // For now, let's assume Google if typical flow, or pass provider in state.
    // Let's assume we set state='google' in the link.
    const provider = state || 'google'; 

    if (code && !processed.current) {
        processed.current = true;
        handleCallback(provider, code);
    } else if (!code) {
        navigate('/login');
    }
  }, []);

  const handleCallback = async (provider: string, code: string) => {
    try {
        const res = await api.post('/auth/oauth/callback', {
            provider,
            code
        });
        
        if (res.data.token) {
            login(res.data.token);
            navigate('/');
        }
    } catch (err) {
        console.error('OAuth callback failed', err);
        navigate('/login?error=auth_failed');
    }
  };

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
