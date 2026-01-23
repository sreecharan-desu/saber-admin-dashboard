import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import CompanyProfile from "./pages/CompanyProfile";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import Applications from "./pages/Applications";
import Signals from "./pages/Signals";
import AdminSettings from "./pages/AdminSettings";

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saber-purple"></div>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  const needsOnboarding = !user?.company_id;

  if (needsOnboarding && window.location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (!needsOnboarding && window.location.pathname === "/onboarding") {
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saber-purple"></div>
      </div>
    );
  }

  if (token) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full text-center card-base p-10">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-10 font-normal">
          You don't have permission to access this resource.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full btn-avatar-blue h-12 font-bold shadow-lg active:scale-95 bg-saber-purple text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Default redirect to jobs */}
      <Route path="/" element={<Navigate to="/jobs" replace />} />

      <Route
        path="/company"
        element={
          <ProtectedRoute roles={["recruiter", "admin"]}>
            <Layout>
              <CompanyProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute roles={["recruiter", "admin"]}>
            <Layout>
              <MyJobs />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/new"
        element={
          <ProtectedRoute roles={["recruiter", "admin"]}>
            <Layout>
              <CreateJob />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/edit/:id"
        element={
          <ProtectedRoute roles={["recruiter", "admin"]}>
            <Layout>
              <CreateJob />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute roles={["recruiter", "admin"]}>
            <Layout>
              <Applications />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/signals"
        element={
          <ProtectedRoute roles={["recruiter", "admin"]}>
            <Layout>
              <Signals />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Layout>
              <AdminSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
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
