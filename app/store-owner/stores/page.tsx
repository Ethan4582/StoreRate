import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { StoreList } from "@/components/store-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function StoreOwnerStoresPage() {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Stores</h1>
            <p className="text-muted-foreground">Manage your store listings and information</p>
          </div>
          <Button asChild>
            <Link href="/store-owner/stores/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Store
            </Link>
          </Button>
        </div>

        <StoreList ownerId={user.id} />
      </main>
    </div>
  )
}
