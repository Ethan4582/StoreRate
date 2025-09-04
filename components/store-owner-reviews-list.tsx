import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

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
        select: { name: true },
      },
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

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

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No customer reviews yet.</p>
        </CardContent>
      </Card>
    )
  }
  const reviewsByStore = reviews.reduce(
    (acc, review) => {
      if (!acc[review.store.name]) {
        acc[review.store.name] = []
      }
      acc[review.store.name].push(review)
      return acc
    },
    {} as Record<string, typeof reviews>,
  )

  return (
    <div className="space-y-8">
      {Object.entries(reviewsByStore).map(([storeName, storeReviews]) => (
        <Card key={storeName}>
          <CardHeader>
            <CardTitle>{storeName}</CardTitle>
            <CardDescription>{storeReviews.length} customer review(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeReviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="ml-1">{getRatingLabel(review.rating)}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">by {review.user.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {review.review && <p className="text-sm text-muted-foreground mt-2">{review.review}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
