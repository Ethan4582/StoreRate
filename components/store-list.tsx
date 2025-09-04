import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, MapPin, Phone, Mail, Globe } from "lucide-react"

interface StoreListProps {
  ownerId?: number
  showOwnerActions?: boolean
}

export async function StoreList({ ownerId, showOwnerActions = true }: StoreListProps) {
  let stores

  if (ownerId) {
    stores = await prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } else {
    stores = await prisma.store.findMany({
      include: {
        owner: {
          select: { name: true },
        },
        ratings: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  const processedStores = stores.map((store) => {
    const avgRating =
      store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0

    return {
      ...store,
      owner_name: ownerId ? undefined : (store as any).owner?.name,
      avg_rating: avgRating,
      review_count: store.ratings.length,
    }
  })

  if (processedStores.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">{ownerId ? "You haven't added any stores yet." : "No stores found."}</p>
          {ownerId && (
            <Button asChild className="mt-4">
              <Link href="/store-owner/stores/new">Add Your First Store</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {processedStores.map((store) => (
        <Card key={store.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                {/* Store Image */}
                {store.image && (
                  <img
                    src={store.image}
                    alt={store.name}
                    className="mb-3 rounded-md w-full h-40 object-cover"
                  />
                )}
                <CardTitle className="text-xl">{store.name}</CardTitle>
                <CardDescription className="mt-2">{store.description}</CardDescription>
                {!ownerId && store.owner_name && (
                  <p className="text-sm text-muted-foreground mt-1">Owner: {store.owner_name}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {Number(store.avg_rating) > 0 && (
                  <Badge variant="secondary">
                    ⭐ {Number(store.avg_rating).toFixed(1)} ({store.review_count} reviews)
                  </Badge>
                )}
                {ownerId && showOwnerActions && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/store-owner/stores/${store.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">{store.address}</span>
              </div>

              {store.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{store.phone}</span>
                </div>
              )}

              {store.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{store.email}</span>
                </div>
              )}

              {store.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {store.website}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/stores/${store.id}`}>View Details</Link>
              </Button>
              {!ownerId && (
                <Button size="sm" asChild>
                  <Link href={`/stores/${store.id}/rate`}>Rate Store</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
