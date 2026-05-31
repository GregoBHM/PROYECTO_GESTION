import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import LoginPage from '../pages/Login/LoginPage'

const DashboardLayout  = React.lazy(() => import('../layouts/DashboardLayout'))
const DashboardPage    = React.lazy(() => import('../pages/Dashboard/DashboardPage'))
const TicketListPage   = React.lazy(() => import('../pages/Tickets/TicketListPage'))
const NewTicketPage    = React.lazy(() => import('../pages/Tickets/NewTicketPage'))
const TicketDetailPage = React.lazy(() => import('../pages/Tickets/TicketDetailPage'))
const AdminPanel       = React.lazy(() => import('../pages/Admin/AdminPanel'))

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />
}

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={
        <div className="min-h-screen bg-aurora flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute><DashboardLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"   element={<DashboardPage />} />
            <Route path="tickets"     element={<TicketListPage />} />
            <Route path="tickets/new" element={<NewTicketPage />} />
            <Route path="tickets/:id" element={<TicketDetailPage />} />
            <Route path="admin"       element={<AdminPanel />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
