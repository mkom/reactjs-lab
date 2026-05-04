import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useLogout } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

import {
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Search,
  Sparkles,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: <User className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

export const SidebarLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const logout = useLogout()
  const user = useAuthStore((state) => state.user)

  const handleLogout = async () => {
    await logout.mutateAsync()
    window.location.href = '/login'
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-lg shadow-sm lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-slate-600" />
        ) : (
          <Menu className="h-5 w-5 text-slate-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-3 transition-opacity duration-200',
              isCollapsed && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
            )}
          >
            <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-slate-900 whitespace-nowrap">
              Starter
            </span>
          </Link>
          
          {/* Collapse Toggle - Desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                isActive(item.path)
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <span className={cn(
                'transition-colors',
                isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
              )}>
                {item.icon}
              </span>
              <span
                className={cn(
                  'font-medium whitespace-nowrap transition-all duration-200',
                  isCollapsed && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200',
              isCollapsed && 'lg:justify-center'
            )}
          >
            <LogOut className="h-5 w-5" />
            <span
              className={cn(
                'font-medium whitespace-nowrap transition-all duration-200',
                isCollapsed && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
              )}
            >
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out min-h-screen flex flex-col',
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Left - Breadcrumb/Search */}
            <div className="flex items-center gap-4 ml-12 lg:ml-0">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                <span className="hover:text-slate-700 cursor-pointer">Home</span>
                <span>/</span>
                <span className="text-slate-900 font-medium capitalize">
                  {location.pathname.split('/')[1] || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
