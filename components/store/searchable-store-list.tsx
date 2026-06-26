"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/forms/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Skeleton } from "@/components/ui/feedback/skeleton"
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import { StoreListSidebar } from "./store-list-sidebar"
import { StoreCard, Store } from "./store-card"

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
        setCurrentPage(1)
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

  const getDummyCategory = (id: number) => {
    const categories = ["Sports", "Food & Beverage", "Electronics", "Fashion", "Health & Wellness", "General"]
    return categories[id % categories.length]
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      <StoreListSidebar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
        availableLocations={availableLocations}
        clearFilters={clearFilters}
      />

      <div className="flex-1 w-full space-y-6">
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

        {loading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
            {Array.from({ length: viewMode === "grid" ? 6 : 4 }).map((_, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden ${viewMode === "grid" ? "flex-col md:flex-row" : "flex-col sm:flex-row"}`}>
                <Skeleton className={`shrink-0 ${viewMode === "grid" ? "w-full md:w-[45%] h-64 md:h-auto" : "w-full sm:w-[30%] lg:w-[25%] h-48 sm:h-auto"}`} />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <Skeleton className="h-6 w-24 rounded-full mb-3" />
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6 mb-5" />
                    <div className="space-y-2.5">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground bg-white rounded-2xl shadow-sm border border-border/50">
            <p className="mb-4">No stores found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
              {paginatedStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  viewMode={viewMode}
                  category={getDummyCategory(store.id)}
                />
              ))}
            </div>

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
                    className={`h-10 w-10 rounded-lg font-medium ${currentPage === i + 1
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
