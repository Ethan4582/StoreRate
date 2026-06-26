import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { SidebarLayout } from "@/components/store/sidebar-layout"
import { UserRatingsList } from "@/components/user-ratings-list"

export default async function MyReviewsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "normal_user") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <SidebarLayout userRole={user.role}>
        <UserRatingsList userId={user.id} />
      </SidebarLayout>
    </div>
  )
}
