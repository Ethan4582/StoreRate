import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { AdminAnalytics } from "@/components/admin-analytics"

export default async function AdminAnalyticsPage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Platform Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and platform statistics</p>
        </div>

        <AdminAnalytics />
      </main>
    </div>
  )
}
