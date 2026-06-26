import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import Link from "next/link"
import { MapPin, Phone, Globe, Star, ShieldCheck, Bookmark, Store, Tag, User as UserIcon, Languages, Clock, ShieldAlert, ChevronRight, Home } from "lucide-react"
import { notFound } from "next/navigation"
import { CustomerReviews } from "@/components/customer-reviews"
import { RecommendedStores } from "@/components/recommended-stores"
import { BookmarkButton } from "@/components/bookmark-button"

interface StoreDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { slug } = await params
  const user = await getCurrentUser()

  const store = await prisma.store.findUnique({
    where: { slug: slug },
    include: {
      owner: {
        select: { name: true, createdAt: true },
      },
      ratings: {
        include: {
          user: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" }
      },
    },
  })

  if (!store) {
    notFound()
  }

  const allRatings = store.ratings
  const totalReviews = allRatings.length
  const avgRating = totalReviews > 0 ? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0

  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  allRatings.forEach((r) => {
    const rounded = Math.round(r.rating)
    if (rounded >= 1 && rounded <= 5) {
      ratingCounts[rounded] += 1
    }
  })

  // Feature tags mimicking the design
  const featureTags = [
    { icon: UserIcon, label: "Expert Staff" },
    { icon: ShieldCheck, label: "Quality Products" },
    { icon: Phone, label: "After Sales Support" },
    { icon: Store, label: "Wide Range" },
    { icon: Bookmark, label: "Secure Payments" },
    { icon: ShieldAlert, label: "Easy Returns" },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar user={user} />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        
     
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <Home className="w-4 h-4 mb-0.5" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <Link href="/stores" className="hover:text-blue-600 transition-colors">
            Stores
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-900 font-semibold">{store.name}</span>
        </nav>

       
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row gap-8">
          
       
          <div className="lg:w-[450px] shrink-0 flex flex-col gap-6">
            <div className="relative h-[300px] bg-slate-100 rounded-2xl overflow-hidden">
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-black/60 hover:bg-black/60 text-white border-none rounded-full px-3 py-1 backdrop-blur-md font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Verified Store
                </Badge>
              </div>
              {store.image ? (
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
            </div>

            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
              <h2 className="text-lg font-bold text-[#0F172A] mb-2">About {store.name}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {store.description}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">{store.name}</h1>
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none font-bold px-2 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                    Mountain bikes, road bikes, helmets, and cycling gear for every rider. 
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="h-11 px-4 flex items-center justify-center border border-slate-200 rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <BookmarkButton storeId={store.id} />
                      <span className="font-semibold text-sm text-slate-700">Save</span>
                    </div>
                  </div>
                  
                  {(!user || user.role === "normal_user") && (
                    <Button asChild className="h-11 px-6 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-sm">
                      <Link href={`/stores/${store.slug}/rate`}>Write a Review</Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex">{renderStars(avgRating)}</div>
                  <span className="font-bold text-slate-700 ml-1">{avgRating.toFixed(1)}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <Link href="#reviews" className="text-blue-600 font-semibold text-sm hover:underline">
                  {totalReviews} reviews
                </Link>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-500 mb-8">
                <UserIcon className="w-4 h-4" />
                <span>Member since {new Date(store.owner?.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none px-2 rounded-md font-bold text-[10px] tracking-wider uppercase">
                  Active Member
                </Badge>
              </div>
            </div>

            <div>
             
              <div className="flex flex-col sm:flex-row gap-6 py-5 border-y border-slate-100 mb-6">
                <div className="flex items-start gap-3 flex-1">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-slate-600 leading-tight">{store.address}</span>
                </div>
                {store.phone && (
                  <div className="flex items-center gap-3 flex-1">
                    <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-600">{store.phone}</span>
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center gap-3 flex-1">
                    <Globe className="w-5 h-5 text-slate-400 shrink-0" />
                    <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 hover:text-blue-600 hover:underline truncate">
                      {store.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

             
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featureTags.map((tag, i) => {
                  const Icon = tag.icon
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">{tag.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          
          <div className="space-y-8">
            <div id="reviews">
              <CustomerReviews 
                reviews={allRatings} 
                avgRating={avgRating} 
                totalReviews={totalReviews} 
                ratingCounts={ratingCounts} 
              />
            </div>
          </div>

          <div className="space-y-8">
          
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200 sticky top-24 self-start space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Store Type</h4>
                  <p className="text-sm font-medium text-slate-900">Retail Store</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</h4>
                  <p className="text-sm font-medium text-slate-900">Sports & Outdoors</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Owner</h4>
                  <p className="text-sm font-medium text-slate-900 uppercase">{store.owner?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Languages className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Languages</h4>
                  <p className="text-sm font-medium text-slate-900">English, Hindi</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Response Time</h4>
                  <p className="text-sm font-medium text-slate-900">Usually responds within a few hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Store Policies</h4>
                  <p className="text-sm font-medium text-slate-900">Returns accepted within 7 days.</p>
                  <button className="text-blue-600 font-semibold text-xs mt-1 hover:underline flex items-center gap-1">
                    View Details <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <RecommendedStores currentStoreId={store.id} />
        
      </main>
    </div>
  )
}
