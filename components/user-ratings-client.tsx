"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Edit, Store, MapPin, Calendar, LayoutList, LayoutGrid } from "lucide-react"

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
  const [layout, setLayout] = useState<"list" | "grid">("grid")

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
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Layout</span>
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setLayout("list")}
              className={`p-2 rounded-md transition-colors ${layout === "list" ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-md transition-colors ${layout === "grid" ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={layout === "list" ? "flex flex-col gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
        {ratings.map((rating) => (
          <Card key={rating.id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white border border-slate-200 p-0 flex flex-col overflow-hidden">
            
            {/* Image Section */}
            {rating.store.image ? (
              <div className="w-full h-48 bg-slate-100 overflow-hidden shrink-0">
                <img src={rating.store.image} alt={rating.store.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-48 bg-slate-100 flex items-center justify-center shrink-0">
                <Store className="h-12 w-12 text-slate-300" />
              </div>
            )}

            <div className="p-6 flex flex-col gap-6 h-full">
              {/* Top Row: Store Info */}
              <div className="flex items-start justify-between">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex-shrink-0">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{rating.store.name}</h3>
                    <div className="flex items-center text-slate-500 text-sm mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {rating.store.address}
                    </div>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1">{renderStars(rating.rating)}</div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full border-none">
                  {getRatingLabel(rating.rating)}
                </Badge>
                <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50 hidden sm:flex" size="sm" asChild>
                  <Link href={`/stores/${rating.storeId}/rate`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile Stars and Edit button fallback */}
            <div className="flex justify-between items-center sm:hidden">
                <div className="flex items-center gap-1">{renderStars(rating.rating)}</div>
                <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50" size="sm" asChild>
                  <Link href={`/stores/${rating.storeId}/rate`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
            </div>

            {/* Middle Row: Review Text */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-semibold text-slate-900 mb-2">Your Review</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {rating.review || "No written review."}
              </p>
            </div>

              {/* Bottom Row: Metadata & Action */}
              <div className="flex justify-between items-center pt-2 mt-auto">
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Rated on {new Date(rating.createdAt).toLocaleDateString()}
                </div>
                <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50" size="sm" asChild>
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
