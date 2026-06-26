import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Edit, Store, MapPin, Calendar } from "lucide-react"

interface RatingWithStore {
  id: number
  rating: number
  review: string | null
  createdAt: Date
  storeId: number
  store: {
    name: string
    address: string
    image?: string | null
  }
}

interface UserRatingsClientProps {
  ratings: RatingWithStore[]
}

export function UserRatingsClient({ ratings }: UserRatingsClientProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Very Good"
      case 5:
        return "Excellent"
      default:
        return ""
    }
  }

  if (ratings.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm bg-white border border-slate-200">
        <CardContent className="py-8 text-center">
          <p className="text-slate-500 mb-4">You haven't rated any stores yet.</p>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg" asChild>
            <Link href="/stores">Browse Stores to Rate</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Reviews</h1>
          <p className="text-slate-500 text-sm sm:text-base">View and manage your store ratings and reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {ratings.map((rating) => (
          <Card key={rating.id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white border border-slate-200 p-0 flex flex-col sm:flex-row overflow-hidden">
            
            {/* Image Section */}
            <div className="w-full sm:w-2/5 md:w-1/3 shrink-0 bg-slate-100 flex items-center justify-center min-h-[160px]">
              {rating.store.image ? (
                <img src={rating.store.image} alt={rating.store.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-12 w-12 text-slate-300" />
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-5 flex flex-col gap-4 w-full">
              {/* Top Row: Store Info */}
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-start">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl flex-shrink-0">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">{rating.store.name}</h3>
                    <div className="flex items-center text-slate-500 text-xs sm:text-sm mt-0.5">
                      <MapPin className="h-3 w-3 mr-1" />
                      {rating.store.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-0.5">{renderStars(rating.rating)}</div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-medium px-2.5 py-0.5 rounded-full border-none text-xs">
                    {getRatingLabel(rating.rating)}
                  </Badge>
                  <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50 hidden md:flex h-8 px-2.5" size="sm" asChild>
                    <Link href={`/stores/${rating.storeId}/rate`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Mobile Stars and Edit button fallback */}
              <div className="flex justify-between items-center sm:hidden">
                  <div className="flex items-center gap-0.5">{renderStars(rating.rating)}</div>
                  <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50 h-8 px-2.5" size="sm" asChild>
                    <Link href={`/stores/${rating.storeId}/rate`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>
              </div>

              {/* Middle Row: Review Text */}
              <div className="border-t border-slate-100 pt-3 flex-grow">
                <h4 className="font-semibold text-slate-900 text-sm mb-1.5">Your Review</h4>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                  {rating.review || "No written review."}
                </p>
              </div>

              {/* Bottom Row: Metadata & Action */}
              <div className="flex justify-between items-center pt-2 mt-auto">
                <div className="flex items-center text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Rated on {new Date(rating.createdAt).toLocaleDateString()}
                </div>
                <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50 h-8 px-3 text-xs" size="sm" asChild>
                  <Link href={`/stores/${rating.storeId}`}>View Store</Link>
                </Button>
              </div>
            </div>

          </Card>
        ))}
      </div>
    </div>
  )
}
