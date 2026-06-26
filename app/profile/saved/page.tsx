import { SavedStoresList } from "@/components/store/saved-stores-list"
import { Navbar } from "@/components/navbar"
import { SidebarLayout } from "@/components/store/sidebar-layout"
import { getCurrentUser } from "@/lib/get-user"
import { redirect } from "next/navigation"

export default async function SavedStoresPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <SidebarLayout userRole={user.role}>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Saved Stores</h1>
          <p className="text-slate-500">View the stores you have bookmarked for quick access</p>
        </div>

        <SavedStoresList />
      </SidebarLayout>
    </div>
  )
}
