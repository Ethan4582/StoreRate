import { AdminDashboard } from "@/components/analytics/admin-dashboard"
import { AdminUsersList } from "@/components/admin-users-list"

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-foreground mb-2">System Administration</h1>
        <p className="text-muted-foreground">Manage users, stores, and platform analytics</p>
      </div>

      <AdminDashboard />

      <div className="pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">User Overview</h2>
          <p className="text-sm text-muted-foreground">All platform users</p>
        </div>
        <AdminUsersList />
      </div>
    </div>
  )
}
