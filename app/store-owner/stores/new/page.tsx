import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { StoreForm } from "@/components/store-form"

export default async function NewStorePage() {
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Store</h1>
          <p className="text-muted-foreground">Create a new store listing on the platform</p>
        </div>

        <StoreForm />
      </main>
    </div>
  )
}
