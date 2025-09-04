import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { RatingForm } from "@/components/rating-form"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

interface RateStorePageProps {
  params: Promise<{ id: string }>
}

export default async function RateStorePage({ params }: RateStorePageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "normal_user") {
    redirect("/dashboard")
  }

  const store = await prisma.store.findUnique({
    where: { id: Number.parseInt(id) },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      image: true, 
    },
  })

  if (!store) {
    notFound()
  }

  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId: user.id,
        storeId: Number.parseInt(id),
      },
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {existingRating ? "Update Your Rating" : "Rate Store"}
          </h1>
          <p className="text-muted-foreground">Share your experience with {store.name}</p>
        </div>

        <RatingForm store={store} existingRating={existingRating} />
      </main>
    </div>
  )
}
