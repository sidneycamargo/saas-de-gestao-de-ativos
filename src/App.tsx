import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import DashboardLayout from './components/layouts/DashboardLayout'
import { AuthProvider } from './hooks/use-auth'
import { CompanyProvider } from './stores/useCompanyStore'

import Index from './pages/Index'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Assets from './pages/Assets'
import AssetNew from './pages/AssetNew'
import Brands from './pages/Brands'
import Maintenance from './pages/Maintenance'
import Technicians from './pages/Technicians'
import Suppliers from './pages/Suppliers'
import Contracts from './pages/Contracts'
import Warranties from './pages/Warranties'
import History from './pages/History'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Reports from './pages/Reports'

import AdminCompanies from './pages/admin/Companies'
import AdminSubscriptions from './pages/admin/Subscriptions'
import AdminUsers from './pages/admin/Users'
import AdminRoles from './pages/admin/Roles'

const App = () => (
  <AuthProvider>
    <CompanyProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/assets/new" element={<AssetNew />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/technicians" element={<Technicians />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/warranties" element={<Warranties />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reports" element={<Reports />} />

              <Route path="/admin/companies" element={<AdminCompanies />} />
              <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </CompanyProvider>
  </AuthProvider>
)

export default App
