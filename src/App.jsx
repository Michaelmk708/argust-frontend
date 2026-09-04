import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute'
// Layouts
import MainLayout from './components/layout/MainLayout.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Contact from './pages/Public/Contact.jsx'
// Public Pages
import Landing from './pages/Public/Landing.jsx'
import Status from './pages/Public/Status.jsx'
import RequestAudit from './pages/Public/RequestAudit.jsx'
import Register from './pages/Public/Register.jsx'
import Pricing from './pages/Public/Pricing.jsx'
// Auth Pages
import Login from './pages/Auth/Login.jsx'

// Protected Pages
// We rename the import since it's now a unified Dashboard
import UserDashboard from './pages/Developer/Dashboard.jsx'
import Docs from './pages/Developer/Docs.jsx'
import AdminPortal from './pages/Admin/Admin.jsx'

function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
// ... (imports remain the same) ...

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ className: 'glass-panel' }} />
        
        <Routes>
          {/* MainLayout contains the Navbar - ALL public pages must go inside here */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/status" element={<Status />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* FIXED: Moved Contact inside the MainLayout so it gets the Navbar! */}
            <Route path="/contact" element={<Contact />} />

            <Route path="/register" element={<RequireAuth><Register /></RequireAuth>} />
            <Route path="/request-audit" element={<RequireAuth><RequestAudit /></RequireAuth>} />
          </Route>
          
          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
            <Route path="/admin" element={<AdminPortal />} />
            
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}