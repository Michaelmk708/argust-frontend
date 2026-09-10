import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute.jsx'
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
import UserDashboard from './pages/Developer/Dashboard.jsx'
import Docs from './pages/Developer/Docs.jsx'

function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

// Import the Legal Pages
import PrivacyPolicy from './pages/Public/Legal/PrivacyPolicy.jsx'
import RiskDisclosure from './pages/Public/Legal/RiskDisclosure.jsx'
import ContactPolicy from './pages/Public/Legal/ContactPolicy.jsx'
import CompanyDisclosure from './pages/Public/Legal/CompanyDisclosure.jsx'
import RefundPolicy from './pages/Public/Legal/RefundPolicy.jsx'

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
            <Route path="/contact" element={<Contact />} />

            {/* Legal Routes */}
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />
            <Route path="/legal/risk-disclosure" element={<RiskDisclosure />} />
            <Route path="/legal/company-disclosure" element={<CompanyDisclosure />} />
            <Route path="/legal/refunds" element={<RefundPolicy />} />
            <Route path="/legal/complaints" element={<ContactPolicy />} />
            
            <Route path="/register" element={<RequireAuth><Register /></RequireAuth>} />
            <Route path="/request-audit" element={<RequireAuth><RequestAudit /></RequireAuth>} />
          </Route>
          
          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
            
            {/* Map old /admin route safely to the new dashboard */}
            <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
            
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
