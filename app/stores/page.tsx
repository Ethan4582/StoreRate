import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { SearchableStoreList } from "@/components/searchable-store-list"
import Image from "next/image"

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl bg-white p-8 shadow-sm">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Browse Stores</h1>
            <p className="text-lg text-muted-foreground">Discover and rate the best local businesses near you.</p>
          </div>
          <div className="hidden md:block w-full max-w-[350px]">
            <Image 
              src="/asset_1.png" 
              alt="Store illustration" 
              width={400} 
              height={300} 
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

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
