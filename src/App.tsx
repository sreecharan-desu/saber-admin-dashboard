import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import DashboardHome from './pages/DashboardHome';
import CompanyProfile from './pages/CompanyProfile';
import CreateJob from './pages/CreateJob';
import RecruiterFeed from './pages/RecruiterFeed';
import Matches from './pages/Matches';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <DashboardHome />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/company" element={
        <ProtectedRoute>
          <Layout>
            <CompanyProfile />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/jobs/new" element={
        <ProtectedRoute>
          <Layout>
            <CreateJob />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/feed" element={
        <ProtectedRoute>
          <Layout>
            <RecruiterFeed />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/matches" element={
        <ProtectedRoute>
          <Layout>
            <Matches />
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
