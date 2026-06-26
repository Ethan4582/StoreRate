"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User as UserIcon, Store, Star, Settings, ShieldQuestion } from "lucide-react"

interface SidebarLayoutProps {
  children: React.ReactNode
  userRole: string
}

export function SidebarLayout({ children, userRole }: SidebarLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "My Profile", href: "/profile", icon: UserIcon },
    { name: "Account Settings", href: "/settings", icon: Settings },
    ...(userRole === "store_owner" || userRole === "system_admin"
      ? [{ name: "My Stores", href: "/my-stores", icon: Store }]
      : []),
    { name: "My Reviews", href: "/my-reviews", icon: Star },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] shrink-0 space-y-6 md:sticky md:top-24 md:self-start">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Need Help Card */}
        <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
              <ShieldQuestion className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-900">Need help?</h4>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Visit our Help Center for account and security help.
          </p>
          <button className="w-full bg-white border border-blue-200 text-blue-600 font-medium py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors">
            Go to Help Center
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
