import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { SidebarLayout } from "@/components/sidebar-layout"
import { SettingsForm } from "@/components/profile-form"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <SidebarLayout userRole={user.role}>
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-500">Manage your account preferences, personal information, and security</p>
          </div>

          <SettingsForm user={user} />
        </div>
      </SidebarLayout>
    </div>
  )
}
