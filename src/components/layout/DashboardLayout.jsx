import { useState } from 'react'
import { Outlet, Navigate, NavLink } from 'react-router-dom'
import { KeyRound, ShieldCheck, LogOut, FileText, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import logoImg from '../../assets/brand/logo1.jpeg'
import Seal from '../ui/Seal.jsx'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-black/10 dark:border-white/10">
          <img src={logoImg} alt="Argust Logo" className="h-8 w-8 rounded-xl object-cover" />
          <div className="flex items-center gap-1.5">
            <Seal size={22} state="verified" />
            <span className="font-display font-semibold tracking-tight text-lg">Portal</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <SidebarLink to="/developer/dashboard" icon={KeyRound} label="API Keys" onClick={() => setMobileOpen(false)} />
          <SidebarLink to="/developer/docs" icon={FileText} label="Documentation" onClick={() => setMobileOpen(false)} />

          {user.role === 'admin' && (
            <>
              <div className="my-4 border-t border-black/10 dark:border-white/10" />
              <SidebarLink to="/admin" icon={ShieldCheck} label="Admin Approvals" onClick={() => setMobileOpen(false)} />
            </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-black/10 dark:border-white/10">
        <div className="mb-3 px-2 text-xs text-ink-light/50 dark:text-ink-dark/50 truncate font-mono">
          {user.email}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-brand-rose hover:bg-brand-rose/10 rounded-xl transition-colors font-medium"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-base-50 dark:bg-base-950 text-ink-light dark:text-ink-dark">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-black/10 dark:border-white/10 glass-nav flex-col">
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 glass-nav">
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="Argust" className="h-7 w-7 rounded-lg" />
            <span className="font-display font-semibold text-base">Argust Portal</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl border border-black/10 dark:border-white/15"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Slide Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-base-950 border-r border-white/10 lg:hidden shadow-2xl"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-violet/15 text-brand-violet font-semibold border border-brand-violet/20'
            : 'text-ink-light/70 dark:text-ink-dark/70 hover:bg-black/5 dark:hover:bg-white/5'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  )
}