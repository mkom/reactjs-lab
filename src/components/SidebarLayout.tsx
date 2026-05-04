import { useState, useEffect, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate, useNavigate } from 'react-router-dom'
import { useLogout } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

import {
  Package,
  LogOut,
  ArrowLeftRight,
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Command, CommandInput, CommandList, CommandItem, CommandSeparator, CommandGroup, CommandShortcut, CommandEmpty } from '@/components/ui/command'

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
    label: 'Products',
    path: '/products',
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: <ArrowLeftRight className="h-5 w-5" />,
  },
]

export const SidebarLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useLogout()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

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

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  const handleCommandSelect = (path: string) => {
    setIsCommandOpen(false)
    navigate(path)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-gray-50 font-outfit">
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
            isCollapsed ? 'w-16' : 'w-64',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Logo Section */}
          <div className={cn(
            "h-16 flex items-center border-b border-slate-100",
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center gap-3 transition-all duration-200",
                    isCollapsed ? "justify-center w-full" : ""
                  )}
                >
                  <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  {!isCollapsed && (
                    <span className="font-semibold text-lg text-slate-900 whitespace-nowrap">
                      Inventory
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  Starter
                </TooltipContent>
              )}
            </Tooltip>

            {/* Collapse Toggle - Desktop only */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>
            )}
          </div>

          {/* Logo Section - Collapsed State (show collapse button) */}
          {isCollapsed && (
            <div className="p-2 border-b border-slate-100">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex w-full p-2 hover:bg-slate-100 rounded-lg transition-colors items-center justify-center"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Expand
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Navigation */}
          <nav className={cn(
            "p-2 space-y-1",
            isCollapsed ? "px-2" : "px-3"
          )}>
            {navItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center gap-3 rounded-xl transition-all duration-200 group",
                      isActive(item.path)
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100",
                      isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                    )}
                  >
                    <span className={cn(
                      "transition-colors flex-shrink-0",
                      isActive(item.path) ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                    )}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-100 space-y-2">
            {/* Command Palette Trigger */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsCommandOpen(true)}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-xl text-slate-500 hover:bg-slate-100 transition-all duration-200",
                    isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                  )}
                >
                  <Search className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium whitespace-nowrap flex-1 text-left">Search...</span>
                      <CommandShortcut>⌘K</CommandShortcut>
                    </>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  Search ⌘K
                </TooltipContent>
              )}
            </Tooltip>

            {/* Separator */}
            <div className="h-px bg-slate-100" />

            {/* User Profile */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex items-center gap-3 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer",
                  isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                )}>
                  <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {user?.name || 'User'}
                </TooltipContent>
              )}
            </Tooltip>

            {/* Logout */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200",
                    isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                  )}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap">
                      {logout.isPending ? 'Logging out...' : 'Logout'}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {logout.isPending ? 'Logging out...' : 'Logout'}
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>

        {/* Main Content Area */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out min-h-screen flex flex-col",
            isCollapsed ? "lg:ml-16" : "lg:ml-64"
          )}
        >
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-30">
            <div className="h-full px-6 flex items-center justify-between">
              {/* Left - Breadcrumb */}
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
                {/* Search Button - Triggers Command Palette */}
                <button 
                  onClick={() => setIsCommandOpen(true)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Notifications */}
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gray-50/50">
            <Outlet />
          </main>
        </div>

        {/* Command Palette Dialog */}
        <Dialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
          <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
            <Command>
              <CommandInput placeholder="Search commands..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                  {navItems.map((item) => (
                    <CommandItem
                      key={item.path}
                      onSelect={() => handleCommandSelect(item.path)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                  <CommandItem
                    onSelect={() => {
                      setIsCommandOpen(false)
                      handleLogout()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}