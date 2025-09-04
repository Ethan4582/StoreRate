import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Edit } from "lucide-react"

interface UserRatingsListProps {
  userId: number
}

export async function UserRatingsList({ userId }: UserRatingsListProps) {
  const ratings = await prisma.rating.findMany({
    where: { userId },
    include: {
      store: {
        select: {
          name: true,
          address: true,
        },
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

  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">You haven't rated any stores yet.</p>
          <Button asChild>
            <Link href="/stores">Browse Stores to Rate</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {ratings.map((rating) => (
        <Card key={rating.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{rating.store.name}</CardTitle>
                <CardDescription>{rating.store.address}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="flex">{renderStars(rating.rating)}</div>
                  <span className="ml-1">{getRatingLabel(rating.rating)}</span>
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/stores/${rating.storeId}/rate`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {rating.review && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Your Review:</h4>
                <p className="text-muted-foreground">{rating.review}</p>
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Rated on {new Date(rating.createdAt).toLocaleDateString()}</span>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/stores/${rating.storeId}`}>View Store</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
