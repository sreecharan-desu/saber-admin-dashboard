import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';
import DashboardHome from './pages/DashboardHome';
import CompanyProfile from './pages/CompanyProfile';
import CreateJob from './pages/CreateJob';
import RecruiterFeed from './pages/RecruiterFeed';
import Matches from './pages/Matches';
import AdminSettings from './pages/AdminSettings';

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { token, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!token) return <Navigate to="/login" replace />;

  // Force onboarding if:
  // 1. User does not have a company_id yet
  // 2. AND (Backend flag onboarding is true OR Role is candidate OR Recruiter has no companies array)
  // Re-evaluating needsOnboarding with full documentation logic for robustness
  const isCandidate = (user?.role as string) === 'candidate';
  const noCompany = !user?.company_id && (!user?.companies || user.companies.length === 0);
  const needsConnections = user?.onboarding === true;

  const needsOnboarding = needsConnections || isCandidate || noCompany;

  // Allow access to /onboarding itself if onboarding is needed
  if (needsOnboarding && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If they don't need onboarding but are trying to hit /onboarding, send them home
  if (!needsOnboarding && window.location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }
  
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (token) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">You don't have permission to access this resource. If you believe this is an error, please contact your administrator.</p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-700 transition-all shadow-lg active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <DashboardHome />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/company" element={
        <ProtectedRoute roles={['recruiter', 'admin']}>
          <Layout>
            <CompanyProfile />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/jobs/new" element={
        <ProtectedRoute roles={['recruiter', 'admin']}>
          <Layout>
            <CreateJob />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/feed" element={
        <ProtectedRoute roles={['recruiter', 'admin']}>
          <Layout>
            <RecruiterFeed />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/matches" element={
        <ProtectedRoute roles={['recruiter', 'admin']}>
          <Layout>
            <Matches />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/settings" element={
        <ProtectedRoute roles={['admin']}>
          <Layout>
            <AdminSettings />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
