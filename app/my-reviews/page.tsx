import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
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
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Reviews</h1>
          <p className="text-muted-foreground">View and manage your store ratings and reviews</p>
        </div>

        <UserRatingsList userId={user.id} />
      </main>
    </div>
  )
}
