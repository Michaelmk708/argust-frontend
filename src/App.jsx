import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute'
// Layouts
import MainLayout from './components/layout/MainLayout.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'

// Public Pages
import Landing from './pages/Public/Landing.jsx'
import Status from './pages/Public/Status.jsx'
import RequestAudit from './pages/Public/RequestAudit.jsx'
import Register from './pages/Public/Register.jsx'

// Auth Pages
import Login from './pages/Auth/Login.jsx'

// Protected Pages
import DeveloperDashboard from './pages/Developer/Dashboard.jsx'
import Docs from './pages/Developer/Docs.jsx'
import AdminPortal from './pages/Admin/Admin.jsx'

// Smart Route Guard
function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  
  if (!user) {
    // Redirect them to login, but remember where they were trying to go!
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ className: 'glass-panel' }} />
        
        <Routes>
          {/* Public Marketing Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/status" element={<Status />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* NEW: Docs are now completely public! */}
            <Route path="/docs" element={<Docs />} />

            {/* Gated Behind Account Login */}
            <Route path="/register" element={<RequireAuth><Register /></RequireAuth>} />
            <Route path="/request-audit" element={<RequireAuth><RequestAudit /></RequireAuth>} />
          </Route>

          {/* Protected Developer Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}