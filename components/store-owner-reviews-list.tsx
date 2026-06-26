import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
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
        select: { id: true, name: true, slug: true },
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
    <div className="space-y-8">
      {Object.values(reviewsByStore).map(({ store, reviews: storeReviews }) => (
        <Card key={store.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-xl">{store.name}</CardTitle>
              <CardDescription>{storeReviews.length} customer review(s)</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/stores/${store.slug || store.id}`}>View Details</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
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
              
              {storeReviews.length > 3 && (
                <div className="text-center pt-2 mt-4">
                  <p className="text-sm text-muted-foreground">
                    + {storeReviews.length - 3} more reviews. Click View Details to see all.
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
