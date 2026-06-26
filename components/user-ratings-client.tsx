import { Card, CardContent } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
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
    slug: string
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

      <div className="grid grid-cols-1 gap-6">
        {ratings.map((rating) => (
          <Card key={rating.id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white border border-slate-200 p-0 flex flex-col sm:flex-row overflow-hidden">
            
        
            <div className="w-full sm:w-64 shrink-0 bg-slate-100 flex items-center justify-center min-h-[200px] sm:min-h-full">
              {rating.store.image ? (
                <img src={rating.store.image} alt={rating.store.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-12 w-12 text-slate-300" />
              )}
            </div>

       
            <div className="p-5 sm:p-6 flex flex-col gap-4 w-full">
            
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex-shrink-0">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight mb-1">{rating.store.name}</h3>
                    <div className="flex items-center text-slate-500 text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span className="line-clamp-1">{rating.store.address}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5">{renderStars(rating.rating)}</div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-medium px-2.5 py-0.5 rounded-full border-none text-xs">
                    {getRatingLabel(rating.rating)}
                  </Badge>
                </div>
              </div>

           
              <div className="border-t border-slate-100 pt-4 flex-grow">
                <h4 className="font-semibold text-slate-900 text-sm mb-2">Your Review</h4>
                <p className="text-slate-600 text-base leading-relaxed">
                  {rating.review || "No written review."}
                </p>
              </div>

           
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 mt-auto border-t border-slate-50 gap-4">
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Rated on {new Date(rating.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50" asChild>
                    <Link href={`/stores/${rating.store.slug}`}>
                      View Review
                    </Link>
                  </Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700" asChild>
                    <Link href={`/stores/${rating.store.slug}/rate`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Review
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

          </Card>
        ))}
      </div>
    </div>
  )
}
