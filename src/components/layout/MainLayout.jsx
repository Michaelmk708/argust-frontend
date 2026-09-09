import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx' 
import Footer from './Footer.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col text-ink-light dark:text-ink-dark bg-base-50 dark:bg-base-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}