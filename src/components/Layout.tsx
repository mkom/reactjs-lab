import { Outlet, Link } from 'react-router-dom'
import { useLogout } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Package, LogOut, ArrowLeftRight } from 'lucide-react'

export const Layout = () => {
  const logout = useLogout()

  const handleLogout = async () => {
    await logout.mutateAsync()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Package className="h-6 w-6 text-slate-900" />
                <span className="font-semibold text-slate-900">Inventory</span>
              </Link>
              <nav className="flex gap-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/products"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Products
                </Link>
                <Link
                  to="/transactions"
                  className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Transactions
                </Link>
              </nav>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
