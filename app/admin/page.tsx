import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "system_admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">System Administration</h1>
          <p className="text-muted-foreground">Manage users, stores, and platform analytics</p>
        </div>

        <AdminDashboard />
      </main>
    </div>
  )
}
