"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Search, MapPin, Star, Filter } from "lucide-react"

interface Store {
  id: number
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  owner_name: string
  owner_email: string
  created_at: string
  avg_rating: number
  review_count: number
}

export function AdminStoresList() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [minRating, setMinRating] = useState("any")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const fetchStores = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (minRating !== "any") params.append("minRating", minRating)
      if (sortBy !== "newest") params.append("sortBy", sortBy)

      const response = await fetch(`/api/admin/stores?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setStores(data.stores)
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [search, minRating, sortBy])

  const clearFilters = () => {
    setSearch("")
    setMinRating("any")
    setSortBy("newest")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Search Stores</CardTitle>
              <CardDescription>Find stores by name, owner, or location</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by store name, owner, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="2">2+ stars</SelectItem>
                    <SelectItem value="1">1+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="rating_high">Highest Rated</SelectItem>
                    <SelectItem value="rating_low">Lowest Rated</SelectItem>
                    <SelectItem value="most_reviews">Most Reviews</SelectItem>
                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading stores...</p>
          </CardContent>
        </Card>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              {search || minRating !== "any" ? "No stores match your search criteria." : "No stores found."}
            </p>
            {(search || minRating !== "any") && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {stores.length} store{stores.length !== 1 ? "s" : ""}
          </p>

          {stores.map((store) => (
            <Card key={store.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{store.name}</h3>
                      {Number(store.avg_rating) > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {Number(store.avg_rating).toFixed(1)} ({store.review_count})
                        </Badge>
                      )}
                    </div>

                    {store.description && <p className="text-sm text-muted-foreground">{store.description}</p>}

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm">{store.address}</span>
                    </div>

                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Owner: {store.owner_name}</span>
                      <span>Email: {store.owner_email}</span>
                      <span>Added: {new Date(store.created_at).toLocaleDateString()}</span>
                    </div>

                    {(store.phone || store.email || store.website) && (
                      <div className="flex gap-4 text-sm">
                        {store.phone && <span>Phone: {store.phone}</span>}
                        {store.email && <span>Email: {store.email}</span>}
                        {store.website && (
                          <a
                            href={store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/stores/${store.id}`}>View Store</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
