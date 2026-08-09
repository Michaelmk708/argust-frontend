import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedAdminRoute() {
  const adminToken = localStorage.getItem('argust_admin_token')

  // If no token exists, redirect straight to the admin login page
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}