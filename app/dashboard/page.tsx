import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { getDashboardData } from "@/lib/dashboard-data"
import { AdminStats } from "@/components/analytics/admin-stats"
import { AdminChart } from "@/components/analytics/admin-chart"
import { AdminStoresTable } from "@/components/analytics/admin-stores-table"
import { AdminRecentActivity } from "@/components/analytics/admin-recent-activity"
import { StoreOwnerStats, StoreOwnerStores } from "@/components/store/store-owner-dashboard-sections"

import { AdminSidebarLayout } from "@/components/analytics/admin-sidebar-layout"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role === "normal_user") {
    redirect("/stores")
  }

  const roleTitle = user.role === "system_admin"
    ? "System Administrator Dashboard"
    : "Store Owner Dashboard"

  if (user.role === "system_admin") {
    const dashboardData = await getDashboardData()
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar user={user} />
        <div className="flex-1">
          <AdminSidebarLayout>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">{roleTitle}</p>
            </div>
            <div className="space-y-8">
              <AdminStats stats={dashboardData.stats} />
              <AdminChart chartData={dashboardData.chartData} />
              <AdminStoresTable stores={dashboardData.stores} totalStores={dashboardData.stats.totalStores} />
              <AdminRecentActivity recentActivity={dashboardData.recentActivity} />
            </div>
          </AdminSidebarLayout>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">{roleTitle}</p>
        </div>

        <div className="space-y-8">
          <StoreOwnerStats />
          <StoreOwnerStores />
        </div>
      </main>
    </div>
  )
}