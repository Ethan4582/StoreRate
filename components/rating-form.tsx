"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star } from "lucide-react"

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
    <Card>
      <CardHeader>
        {/* Store Image */}
        {store.image && (
          <img
            src={store.image}
            alt={store.name}
            className="mb-3 rounded-md w-full h-40 object-cover"
          />
        )}
        <CardTitle>{store.name}</CardTitle>
        <CardDescription>{store.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label>Your Rating *</Label>
            <div className="flex gap-1">{renderStars()}</div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Your Review (Optional)</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this store..."
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || rating === 0}>
              {loading ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
