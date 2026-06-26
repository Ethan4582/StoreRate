import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { SearchableStoreList } from "@/components/searchable-store-list"

interface StoresPageProps {
  searchParams: Promise<{
    search?: string
    minRating?: string
    sortBy?: string
    location?: string
  }>
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const user = await getCurrentUser()
  const params = await searchParams

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar user={user} />

      <main className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <SearchableStoreList
          initialSearch={params.search}
          initialMinRating={params.minRating}
          initialSortBy={params.sortBy}
          initialLocation={params.location}
        />
      </main>
    </div>
  )
}
