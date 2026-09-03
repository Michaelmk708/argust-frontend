import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, Code2, LayoutDashboard, MessageSquare, Tag } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import logoImg from '../../assets/brand/logo1.jpeg'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/status', label: 'Verify a Business' },
  { to: '/register', label: 'Register Business' },
  { to: '/request-audit', label: 'Request an Audit' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/pricing', label: 'Pricing' }
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10 transition-colors duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand & Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Argust Logo"
            className="h-9 w-9 rounded-xl object-cover border border-black/10 dark:border-white/15"
          />
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold tracking-tight">
              Argust <span className="gradient-text">Trust</span>
            </span>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-violet font-semibold'
                    : 'text-ink-light/70 hover:text-ink-light dark:text-ink-dark/70 dark:hover:text-ink-dark'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-violet"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Dev Docs Link */}
          <NavLink
            to="/docs"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-light/70 hover:text-brand-violet dark:text-ink-dark/70 dark:hover:text-brand-violet transition-colors"
          >
            <Code2 className="h-4 w-4" />
            Dev Docs
          </NavLink>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-brand-amber" />
            ) : (
              <Moon className="h-4 w-4 text-brand-violet" />
            )}
          </button>

          <NavLink
            to={user ? "/developer/dashboard" : "/login"}
            className="flex items-center gap-1.5 rounded-xl border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-all"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Developer Dashboard
          </NavLink>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 dark:border-white/15"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-brand-amber" /> : <Moon className="h-4 w-4 text-brand-violet" />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 dark:border-white/15"
            aria-label="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-over Drawer — rendered in a PORTAL directly on document.body.
          This is REQUIRED: the header above has backdrop-blur-xl, which is a CSS
          filter. Any element with a filter becomes the containing block for its
          position:fixed descendants. Without the portal, the drawer's inset-y-0
          sizes itself against the header's small height (not the viewport),
          which is why it was rendering as a thin strip with everything else
          overflowing unstyled below it. */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
              />

              {/* Solid dark glassmorphism side panel */}
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[101] w-72 h-screen backdrop-blur-3xl saturate-200 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl shadow-black/50 lg:hidden text-slate-100"
                style={{ backgroundColor: 'rgba(2, 6, 23, 0.98)' }}
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <img src={logoImg} alt="Argust Logo" className="h-8 w-8 rounded-lg object-cover" />
                      <span className="font-display font-semibold text-lg text-white">Argust</span>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-1.5">
                    {publicLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30 font-semibold'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}

                    <NavLink
                      to="/docs"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Code2 className="h-4 w-4" />
                      Developer Docs
                    </NavLink>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <NavLink
                    to={user ? "/developer/dashboard" : "/login"}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/20 bg-white/5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Developer Dashboard
                  </NavLink>
                  <NavLink
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/20 bg-white/5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Us
                  </NavLink>
                  <NavLink
                    to="/pricing"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/20 bg-white/5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    <Tag className="h-4 w-4" />
                    Pricing
                  </NavLink>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  )
}