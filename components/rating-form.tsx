"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Lock } from "lucide-react"

interface Store {
  id: number
  name: string
  description: string
  address: string
  image?: string // 
}

interface Rating {
  id: number
  rating: number
  review: string
}

interface RatingFormProps {
  store: Store
  existingRating?: Rating | null
}

export function RatingForm({ store, existingRating }: RatingFormProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0)
  const [review, setReview] = useState(existingRating?.review || "")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (rating === 0) {
      setError("Please select a rating")
      setLoading(false)
      return
    }

    try {
      const url = existingRating ? `/api/ratings/${existingRating.id}` : "/api/ratings"
      const method = existingRating ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          rating,
          review: review.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/stores/${store.id}`)
      } else {
        setError(data.error || "Failed to submit rating")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isActive = starValue <= (hoveredRating || rating)

      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
            }`}
          />
        </button>
      )
    })
  }

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm border">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Label className="text-base font-semibold">Your Rating *</Label>
            <div className="flex gap-1.5">{renderStars()}</div>
            {rating > 0 && (
              <p className="text-sm font-medium text-muted-foreground mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="review" className="text-base font-semibold">Your Review (Optional)</Label>
            <div className="relative">
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this store..."
                rows={6}
                maxLength={500}
                className="resize-none rounded-xl bg-slate-50/50 pb-8"
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {review.length} / 500
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex gap-4">
              <Button type="submit" disabled={loading || rating === 0} className="w-full sm:w-auto px-8 rounded-xl h-11 bg-primary hover:bg-primary/90 text-white font-medium">
                {loading ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto px-8 rounded-xl h-11">
                Cancel
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Your review will be public and visible to all users.</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
