import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { AdminSidebarLayout } from "@/components/analytics/admin-sidebar-layout"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "system_admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />
      <AdminSidebarLayout>
        {children}
      </AdminSidebarLayout>
    </div>
  )
}
