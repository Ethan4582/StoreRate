import { prisma } from "@/lib/db"
import Link from "next/link"
import { Star, MapPin, ChevronRight, ChevronLeft } from "lucide-react"

interface RecommendedStoresProps {
  currentStoreId: number
}

export async function RecommendedStores({ currentStoreId }: RecommendedStoresProps) {
  const stores = await prisma.store.findMany({
    where: {
      id: { not: currentStoreId }
    },
    include: {
      ratings: {
        select: { rating: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  })

  if (stores.length === 0) return null

  return (
    <div className="mt-12 mb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">Recommended Stores</h2>
          <p className="text-sm text-slate-500">You might also like these stores</p>
        </div>
        <Link href="/stores" className="px-4 py-2 bg-white border border-slate-200 text-blue-600 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-sm inline-block">
          View All Stores
        </Link>
      </div>

      {/* 
        Horizontal scrollable container. 
        Using a simple native scroll container with snap for best accessibility and touch support. 
      */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {stores.map((store) => {
          const avgRating = store.ratings.length > 0 
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length 
            : 0

          const renderStars = (rating: number) => {
            return Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
            ))
          }

          return (
            <div key={store.id} className="snap-start shrink-0 w-[260px] sm:w-[280px] bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
              <div className="h-36 bg-slate-100 relative">
                {store.image ? (
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[#0F172A] text-base mb-1 truncate">{store.name}</h3>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-500 truncate">{store.address}</span>
                </div>
                
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">{renderStars(avgRating)}</div>
                  <span className="text-[11px] font-semibold text-slate-700">{avgRating.toFixed(1)}</span>
                  <span className="text-[11px] text-slate-400">({store.ratings.length})</span>
                </div>
                
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                  "{store.description}"
                </p>

                <Link href={`/stores/${store.slug || store.id}`} className="block w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center rounded-xl transition-colors mt-auto">
                  View Store
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Invisible style to hide scrollbar for webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  )
}
