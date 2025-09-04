import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { StoreForm } from "@/components/store-form"
import { prisma } from "@/lib/db"

interface EditStorePageProps {
  params: Promise<{ id: string }>
}

export default async function EditStorePage({ params }: EditStorePageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "store_owner") {
    redirect("/dashboard")
  }

  const store = await prisma.store.findFirst({
    where: {
      id: Number.parseInt(id),
      ownerId: user.id,
    },
  })

  if (!store) {
    redirect("/store-owner/stores")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Store</h1>
          <p className="text-muted-foreground">Update your store information</p>
        </div>

        <StoreForm store={store} />
      </main>
    </div>
  )
}
