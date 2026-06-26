"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Store, Star, UserPlus, PlusSquare, ShieldAlert } from "lucide-react"

interface AdminSidebarLayoutProps {
  children: React.ReactNode
}

export function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const pathname = usePathname()

  const mainLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Stores", href: "/admin/stores", icon: Store },
    { name: "Ratings", href: "/admin/ratings", icon: Star },
  ]

  const managementLinks = [
    { name: "Add User", href: "/admin/users/create", icon: UserPlus },
    { name: "Add Store", href: "/admin/stores/create", icon: PlusSquare },
    { name: "Admin Users", href: "/admin/admin-users", icon: ShieldAlert },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full mx-auto">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] shrink-0 border-r border-border bg-card">
        <div className="sticky top-0 p-6 space-y-8">
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Main</h2>
            <nav className="space-y-1">
              {mainLinks.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-muted-foreground hover:bg-slate-100/80 hover:text-foreground"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-muted-foreground"}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Management</h2>
            <nav className="space-y-1">
              {managementLinks.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-muted-foreground hover:bg-slate-100/80 hover:text-foreground"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-muted-foreground"}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
