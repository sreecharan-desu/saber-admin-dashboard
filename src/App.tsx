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
import Dashboard from "./pages/Dashboard";

import Landing from "./pages/Landing";
import AdminSettings from "./pages/AdminSettings";

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-white">
      {/* Skeleton Header */}
      <header className="h-20 border-b border-gray-50 flex items-center justify-between px-8 md:px-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl animate-pulse" />
          <div className="h-6 w-24 bg-gray-50 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-full animate-pulse" />
          <div className="w-20 h-4 bg-gray-50 rounded-lg animate-pulse hidden md:block" />
        </div>
      </header>

      {/* Skeleton Content */}
      <main className="max-w-[1400px] mx-auto py-12 px-8 md:px-20 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <div className="h-10 w-48 bg-gray-50 rounded-xl animate-pulse" />
            <div className="h-4 w-72 bg-gray-50 rounded-lg animate-pulse" />
          </div>
          <div className="h-12 w-32 bg-gray-50 rounded-2xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[300px] rounded-[40px] border border-gray-50 bg-white p-8 space-y-6">
              <div className="flex justify-between">
                <div className="h-6 w-20 bg-gray-50 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-50 rounded-full animate-pulse" />
              </div>
              <div className="h-8 w-full bg-gray-50 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-50 rounded-lg animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-50 rounded-lg animate-pulse" />
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-between">
                <div className="h-4 w-24 bg-gray-50 rounded-lg animate-pulse" />
                <div className="h-10 w-10 bg-gray-50 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <SkeletonLoader />;
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
    return <SkeletonLoader />;
  }

  if (token) return <Navigate to="/dashboard" replace />;

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

import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["recruiter", "admin"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Landing Page Route */}
      <Route
        path="/"
        element={
          <GuestRoute>
            <Landing />
          </GuestRoute>
        }
      />

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
