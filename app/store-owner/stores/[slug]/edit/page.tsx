import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { StoreForm } from "@/components/store/store-form"
import { prisma } from "@/lib/db"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface EditStorePageProps {
  params: Promise<{ slug: string }>
}

export default async function EditStorePage({ params }: EditStorePageProps) {
  const { slug } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "store_owner") {
    redirect("/dashboard")
  }

  const store = await prisma.store.findFirst({
    where: {
      slug: slug,
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

        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 font-medium">
          <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <Home className="w-4 h-4 mb-0.5" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-border" />
          <Link href="/store-owner/stores" className="hover:text-foreground transition-colors">
            My Stores
          </Link>
          <ChevronRight className="w-4 h-4 text-border" />
          <span className="text-foreground font-semibold">{store.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Store</h1>
          <p className="text-muted-foreground">Update your store information</p>
        </div>

        <StoreForm store={store} />
      </main>
    </div>
  )
}
