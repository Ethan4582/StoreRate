import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { StoreOwnerReviewsList } from "@/components/store-owner-reviews-list"

export default async function StoreOwnerReviewsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "store_owner") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Customer Reviews</h1>
          <p className="text-muted-foreground">View customer feedback for your stores</p>
        </div>

        <StoreOwnerReviewsList ownerId={user.id} />
      </main>
    </div>
  )
}
