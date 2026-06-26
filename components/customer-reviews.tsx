"use client"

import { useState } from "react"
import { Star, MoreVertical, ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface CustomerReviewsProps {
  reviews: any[]
  avgRating: number
  totalReviews: number
  ratingCounts: Record<number, number>
}

export function CustomerReviews({ reviews, avgRating, totalReviews, ratingCounts }: CustomerReviewsProps) {
  const [showAll, setShowAll] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
    ))
  }

  const getInitials = (name: string) => name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4)

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-8">
        <div className="md:w-1/3">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-10 h-10 fill-amber-400 text-amber-400" />
            <span className="text-5xl font-bold text-[#0F172A]">{avgRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-slate-500">Based on {totalReviews} reviews</p>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
            >
              {showAll ? "View Less" : "View All Reviews"}
            </button>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star] || 0
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8 shrink-0">
                    <span className="text-sm font-medium text-slate-600">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  <Progress value={percentage} className="h-2 bg-slate-100 flex-1 [&>div]:bg-amber-400" />
                  <span className="text-xs text-slate-500 w-6 text-right shrink-0">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-slate-100">
        {reviews.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No reviews yet</p>
        ) : (
          displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0 relative">
              <button className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                <MoreVertical className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {getInitials(review.user.name)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A]">{review.user.name}</span>
                      <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none px-2 rounded-md text-[10px] font-bold">
                        Verified Buyer
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 sm:mt-0 mr-8">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-xs font-semibold text-slate-700">{review.rating.toFixed(1)}</span>
                  </div>
                  {review.review && <p className="text-sm text-slate-600 leading-relaxed">{review.review}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {reviews.length > 4 && (
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 font-semibold text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            {showAll ? "View less" : `View all ${totalReviews} reviews`}
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  )
}
