import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './pages/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import VehiclesPage from './pages/VehiclesPage'
import EmployeesPage from './pages/EmployeesPage'
import ShiftsPage from './pages/ShiftsPage'
import WashTypesPage from './pages/WashTypesPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="shifts" element={<ShiftsPage />} />
            <Route path="wash-types" element={<WashTypesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
