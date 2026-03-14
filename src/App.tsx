import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import DashboardLayout from './components/layouts/DashboardLayout'
import Index from './pages/Index'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import ProductNew from './pages/ProductNew'
import Maintenance from './pages/Maintenance'
import Warranties from './pages/Warranties'
import History from './pages/History'
import Settings from './pages/Settings'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/products/new" element={<ProductNew />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/warranties" element={<Warranties />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
