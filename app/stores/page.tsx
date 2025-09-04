import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { SearchableStoreList } from "@/components/searchable-store-list"

interface StoresPageProps {
  searchParams: Promise<{
    search?: string
    minRating?: string
    sortBy?: string
  }>
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const user = await getCurrentUser()
  const params = await searchParams

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Stores</h1>
          <p className="text-muted-foreground">Discover and rate local businesses</p>
        </div>

        <SearchableStoreList
          initialSearch={params.search}
          initialMinRating={params.minRating}
          initialSortBy={params.sortBy}
        />
      </main>
    </div>
  )
}
