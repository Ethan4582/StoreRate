"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Phone, Mail, Globe, Filter, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import { BookmarkButton } from "@/components/bookmark-button"

interface Store {
  id: number
  name: string
  slug: string
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
  initialLocation?: string
}

export function SearchableStoreList({
  initialSearch = "",
  initialMinRating = "",
  initialSortBy = "newest",
  initialLocation = "",
}: SearchableStoreListProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initialSearch)
  const [location, setLocation] = useState(initialLocation)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [category, setCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = viewMode === "grid" ? 6 : 4

  const router = useRouter()

  useEffect(() => {
    // Fetch unique locations
    fetch('/api/stores/locations')
      .then(res => res.json())
      .then(data => {
        if (data.locations) setAvailableLocations(data.locations)
      })
      .catch(console.error)
  }, [])

  const fetchStores = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (location && location !== "all") params.append("location", location)
      if (sortBy) params.append("sortBy", sortBy)

      const response = await fetch(`/api/stores/search?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setStores(data.stores)
        setCurrentPage(1) // Reset to first page on new search
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
    if (location && location !== "all") params.append("location", location)
    if (sortBy !== "newest") params.append("sortBy", sortBy)

    const newURL = params.toString() ? `/stores?${params.toString()}` : "/stores"
    router.push(newURL, { scroll: false })
  }

  useEffect(() => {
    fetchStores()
  }, [search, location, sortBy])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, location, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(stores.length / itemsPerPage)
  const paginatedStores = stores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const clearFilters = () => {
    setSearch("")
    setLocation("all")
    setSortBy("newest")
    setCategory("all")
  }

  // Dummy categories mapping just for visual
  const getDummyCategory = (id: number) => {
    const categories = ["Sports", "Food & Beverage", "Electronics", "Fashion", "Health & Wellness", "General"]
    return categories[id % categories.length]
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Sidebar (Left) */}
      <div className="w-full lg:w-[320px] shrink-0 bg-background lg:bg-slate-50/50 rounded-3xl lg:p-6 lg:border border-border/50 flex flex-col space-y-6 lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
        
        {/* Hero Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <Image 
            src="/asset_1.png" 
            alt="Store illustration" 
            width={300} 
            height={200} 
            className="w-full max-w-[250px] h-auto object-contain mb-6"
            priority
          />
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Browse Stores</h1>
          <p className="text-sm text-muted-foreground">Discover and rate the best local businesses near you.</p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-white border-border/50 focus-visible:ring-1 focus-visible:ring-primary text-sm shadow-sm"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full h-11 rounded-xl bg-white border-border/50 shadow-sm text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="health">Health & Wellness</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location || "all"} onValueChange={setLocation}>
            <SelectTrigger className="w-full h-11 rounded-xl bg-white border-border/50 shadow-sm text-sm">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {availableLocations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full h-11 rounded-xl border-border/50 bg-white shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 text-primary hover:text-primary" onClick={clearFilters}>
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area (Right) */}
      <div className="flex-1 w-full space-y-6">

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm font-semibold text-foreground">
          {stores.length} Store{stores.length !== 1 ? "s" : ""} Found
        </p>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center p-1 rounded-lg bg-gray-100/80 mr-2">
            <button
              onClick={() => { setViewMode("grid"); setCurrentPage(1); }}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setViewMode("list"); setCurrentPage(1); }}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-10 rounded-lg bg-white border-none shadow-sm text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Latest</SelectItem>
              <SelectItem value="rating_high">Highest Rated</SelectItem>
              <SelectItem value="most_reviews">Most Reviews</SelectItem>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground animate-pulse">Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground bg-white rounded-2xl shadow-sm border border-border/50">
          <p className="mb-4">No stores found matching your criteria.</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
            {paginatedStores.map((store) => (
              <div key={store.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden hover:shadow-md transition-shadow ${viewMode === "grid" ? "flex-col md:flex-row" : "flex-col sm:flex-row"}`}>
                {/* Image Section */}
                <div className={`relative shrink-0 bg-gray-50 ${viewMode === "grid" ? "w-full md:w-[45%] h-64 md:h-auto" : "w-full sm:w-[30%] lg:w-[25%] h-48 sm:h-auto"}`}>
                  <div className="absolute top-4 left-4 z-10">
                    <BookmarkButton storeId={store.id} />
                  </div>
                  {store.image ? (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 mb-3 px-3 py-1 font-medium rounded-full border-none">
                      {getDummyCategory(store.id)}
                    </Badge>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                    
                    <p className="text-sm text-gray-500 mb-5 line-clamp-2">
                      {store.description}
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-1">{store.address}</span>
                      </div>

                      {store.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600">{store.phone}</span>
                        </div>
                      )}

                      {store.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{store.email}</span>
                        </div>
                      )}

                      {store.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-primary shrink-0" />
                          <a
                            href={store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate"
                          >
                            {new URL(store.website.startsWith('http') ? store.website : `https://${store.website}`).hostname.replace('www.', '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
                    <Button variant="outline" className="flex-1 rounded-xl h-10 font-semibold hover:bg-accent" asChild>
                      <Link href={`/stores/${store.slug || store.id}`}>View Details</Link>
                    </Button>
                    <Button className="flex-1 rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm" asChild>
                      <Link href={`/stores/${store.slug || store.id}/rate`}>Rate Store</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 w-10 rounded-lg border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-10 w-10 rounded-lg font-medium ${
                    currentPage === i + 1 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm border-transparent" 
                      : "hover:bg-accent text-foreground"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-10 w-10 rounded-lg border-gray-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  )
}
