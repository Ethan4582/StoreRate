import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { RatingForm } from "@/components/rating-form"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Store as StoreIcon, Calendar, Star, MessageSquare, MapPin, ChevronRight, Home } from "lucide-react"

interface RateStorePageProps {
  params: Promise<{ slug: string }>
}

export default async function RateStorePage({ params }: RateStorePageProps) {
  const { slug } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "normal_user") {
    redirect("/dashboard")
  }

  const store = await prisma.store.findUnique({
    where: { slug: slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      address: true,
      image: true,
      _count: {
        select: {
          ratings: true
        }
      }
    },
  })

  if (!store) {
    notFound()
  }

  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId: user.id,
        storeId: store.id,
      },
    },
  })

  const category = "Grocery" // Hardcoded for visual consistency
  const totalReviews = store._count.ratings
  const ratedOnDate = existingRating ? new Date(existingRating.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
            {existingRating ? "Update Your Rating" : "Rate Store"}
          </h1>
          <p className="text-muted-foreground">Share your experience and help others discover great places.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
     
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
            <div className="relative w-full h-48 md:h-64 bg-muted">
              {store.image ? (
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image available</div>
              )}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary fill-primary text-white" />
                <span className="text-xs font-medium text-white">Verified Store</span>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <StoreIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">{store.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {store.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <div className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                    <StoreIcon className="h-3 w-3 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Store Category</span>
                  <span className="text-sm font-medium text-foreground">{category}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <div className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                    <Calendar className="h-3 w-3 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Last Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">{existingRating ? `${existingRating.rating} / 5` : "None"}</span>
                    {existingRating && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <div className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                    <Calendar className="h-3 w-3 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Rated on</span>
                  <span className="text-sm font-medium text-foreground">{ratedOnDate || "N/A"}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <div className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                    <MessageSquare className="h-3 w-3 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Reviews</span>
                  <span className="text-sm font-medium text-foreground">{totalReviews} Reviews</span>
                </div>
              </div>
            </div>
          </div>

       
          <div className="w-full">
            <RatingForm store={store} existingRating={existingRating} />
          </div>
        </div>
      </main>
    </div>
  )
}
