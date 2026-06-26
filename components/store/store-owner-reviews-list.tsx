import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Star, Store, MapPin } from "lucide-react"
import { Button } from "@/components/ui/forms/button"
import Link from "next/link"

interface StoreOwnerReviewsListProps {
  ownerId: number
}

export async function StoreOwnerReviewsList({ ownerId }: StoreOwnerReviewsListProps) {
  const reviews = await prisma.rating.findMany({
    where: {
      store: {
        ownerId,
      },
    },
    include: {
      store: {
        select: { id: true, name: true, slug: true, address: true, image: true },
      },
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
    ))
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <Store className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Reviews Yet</h3>
        <p className="text-slate-500">Your stores haven't received any reviews yet. Check back later!</p>
      </div>
    )
  }

  const reviewsByStore = reviews.reduce(
    (acc, review) => {
      const storeId = review.store.id.toString()
      if (!acc[storeId]) {
        acc[storeId] = {
          store: review.store,
          reviews: []
        }
      }
      acc[storeId].reviews.push(review)
      return acc
    },
    {} as Record<string, { store: any, reviews: typeof reviews }>,
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Object.values(reviewsByStore).map(({ store, reviews: storeReviews }) => (
        <Card key={store.id} className="flex flex-col rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                {store.image ? (
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{store.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {storeReviews.length} {storeReviews.length === 1 ? 'Review' : 'Reviews'}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{store.address}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="shrink-0 h-10 rounded-xl font-semibold border-slate-200 text-slate-700 hover:bg-slate-50" asChild>
              <Link href={`/stores/${store.slug || store.id}`}>View Details</Link>
            </Button>
          </div>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              {storeReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs">
                        {review.user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{review.user.name}</div>
                        <div className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      </div>
                    </div>
                    <div className="flex bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {review.review && (
                    <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3 ml-2">
                      "{review.review}"
                    </p>
                  )}
                </div>
              ))}
              
              {storeReviews.length > 3 && (
                <div className="p-4 bg-slate-50/80 text-center border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-500">
                    + {storeReviews.length - 3} more {storeReviews.length - 3 === 1 ? 'review' : 'reviews'}. <Link href={`/stores/${store.slug || store.id}`} className="text-blue-600 hover:underline">View all</Link>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
