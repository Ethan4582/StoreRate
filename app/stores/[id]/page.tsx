import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Phone, Mail, Globe, Star } from "lucide-react"
import { notFound } from "next/navigation"

interface StoreDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  const store = await prisma.store.findUnique({
    where: { id: Number.parseInt(id) },
    include: {
      owner: {
        select: { name: true },
      },
      ratings: {
        select: { rating: true },
      },
    },
  })

  if (!store) {
    notFound()
  }

  const avgRating =
    store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0

  const reviews = await prisma.rating.findMany({
    where: { storeId: Number.parseInt(id) },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Store Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    {/* Store Image */}
                    {store.image ? (
                      <img
                        src={store.image}
                        alt={store.name}
                        className="mb-4 rounded-md w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="mb-4 rounded-md w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <CardTitle className="text-2xl">{store.name}</CardTitle>
                    <CardDescription className="mt-2 text-base">{store.description}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">Owner: {store.owner.name}</p>
                  </div>
                  {Number(avgRating) > 0 && (
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      ⭐ {Number(avgRating).toFixed(1)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <span>{store.address}</span>
                  </div>

                  {store.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{store.phone}</span>
                    </div>
                  )}

                  {store.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>{store.email}</span>
                    </div>
                  )}

                  {store.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {store.website}
                      </a>
                    </div>
                  )}
                </div>

                {user && user.role === "normal_user" && (
                  <div className="mt-6">
                    <Button asChild>
                      <Link href={`/stores/${store.id}/rate`}>Rate This Store</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {store.ratings.length} review{store.ratings.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-muted-foreground">by {review.user.name}</span>
                        </div>
                        {review.review && <p className="text-sm">{review.review}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
