"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import Link from "next/link"
import { Store, Star, ThumbsUp } from "lucide-react"

export function StoreOwnerStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Stores</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.7</div>
          <p className="text-xs text-muted-foreground">
            +0.3 from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">
            +142 from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function StoreOwnerStores() {
  const ownerStores = [
    {
      id: 1,
      storeName: "FreshMart Grocery",
      category: "Grocery",
      location: "Downtown, New York",
      rating: 4.7,
      reviews: 284,
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Stores</CardTitle>
        <CardDescription>Manage your store listings and information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ownerStores.map((store) => (
            <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{store.storeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {store.category} • {store.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-medium">{store.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{store.reviews}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
                <Button size="sm">Manage</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild className="w-full">
            <Link href="/store-owner/stores">View All Stores</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
