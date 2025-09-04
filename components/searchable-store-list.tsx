"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Search, MapPin, Phone, Mail, Globe, Star, Filter } from "lucide-react"

interface Store {
  id: number
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  owner_name: string
  avg_rating: number
  review_count: number
  image?: string
}

interface SearchableStoreListProps {
  initialSearch?: string
  initialMinRating?: string
  initialSortBy?: string
}

export function SearchableStoreList({
  initialSearch = "",
  initialMinRating = "",
  initialSortBy = "newest",
}: SearchableStoreListProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initialSearch)
  const [minRating, setMinRating] = useState(initialMinRating)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [showFilters, setShowFilters] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchStores = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (minRating) params.append("minRating", minRating)
      if (sortBy) params.append("sortBy", sortBy)

      const response = await fetch(`/api/stores/search?${params.toString()}`)
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

  const updateURL = () => {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (minRating) params.append("minRating", minRating)
    if (sortBy !== "newest") params.append("sortBy", sortBy)

    const newURL = params.toString() ? `/stores?${params.toString()}` : "/stores"
    router.push(newURL, { scroll: false })
  }

  useEffect(() => {
    fetchStores()
  }, [search, minRating, sortBy])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, minRating, sortBy])

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleMinRatingChange = (value: string) => {
    setMinRating(value)
  }

  const handleSortByChange = (value: string) => {
    setSortBy(value)
  }

  const clearFilters = () => {
    setSearch("")
    setMinRating("")
    setSortBy("newest")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Find Stores</CardTitle>
              <CardDescription>Search and filter stores by various criteria</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by store name, description, or address..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select value={minRating} onValueChange={handleMinRatingChange}>
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
                <Select value={sortBy} onValueChange={handleSortByChange}>
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
                    <SelectItem value="name_desc">Name Z-A</SelectItem>
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
              {search || minRating ? "No stores match your search criteria." : "No stores found."}
            </p>
            {(search || minRating) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Found {stores.length} store{stores.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{store.name}</CardTitle>
                      <CardDescription className="mt-2">{store.description}</CardDescription>
                      
                    </div>
                    <div className="flex items-center gap-2">
                      {Number(store.avg_rating) > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {Number(store.avg_rating).toFixed(1)} ({store.review_count})
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {store.image ? (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="mb-3 rounded-md w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="mb-3 rounded-md w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

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
                    <Button size="sm" asChild>
                      <Link href={`/stores/${store.id}/rate`}>Rate Store</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
