import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { StoreList } from "@/components/store/store-list"
import { Button } from "@/components/ui/forms/button"
import Link from "next/link"
import { Plus, Store, Star, Bookmark, User as UserIcon, Settings, Eye, Calendar } from "lucide-react"
import { StoreFilters } from "@/components/store/store-filters"
import { prisma } from "@/lib/db"

export default async function StoreOwnerStoresPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  if (currentUser.role !== "store_owner") {
    redirect("/dashboard")
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      stores: {
        include: {
          _count: {
            select: { ratings: true }
          }
        }
      }
    }
  })

  if (!user) redirect("/login")

  const totalStores = user.stores.length
  const totalViews = "2.4K"
  const totalReviews = user.stores.reduce((acc, store) => acc + store._count.ratings, 0)
  const joinedOn = new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })

  let filteredStores = user.stores
  if (params?.search) {
    const q = params.search.toLowerCase()
    filteredStores = filteredStores.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    )
  }

  filteredStores.sort((a, b) => {
    if (params?.sort === "asc") {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar user={currentUser} />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 flex gap-8">


        <div className="hidden lg:flex flex-col w-[260px] shrink-0 space-y-2 sticky top-24 self-start">
          <Link href="/store-owner/stores" className="flex items-center gap-3 px-4 py-3 bg-[#EEF2FF] text-[#4F46E5] font-semibold rounded-xl">
            <Store className="w-5 h-5" />
            My Stores
          </Link>
          <Link href="/my-reviews" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors">
            <Star className="w-5 h-5" />
            My Reviews
          </Link>
          <Link href="/profile/saved" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors">
            <Bookmark className="w-5 h-5" />
            Saved Stores
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors">
            <UserIcon className="w-5 h-5" />
            Profile
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>

          <div className="mt-8 bg-[#F8FAFF] border border-blue-100 rounded-3xl p-6 flex flex-col items-center text-center">
            <img src="/asset_1.png" alt="Add Store" className="w-32 h-auto mb-4" />
            <h3 className="text-[#0F172A] font-bold mb-2 text-lg">Add more stores</h3>
            <p className="text-slate-500 text-sm mb-6">List more businesses and reach more customers.</p>
            <Button asChild className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl h-11">
              <Link href="/store-owner/stores/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Store
              </Link>
            </Button>
          </div>
        </div>


        <div className="flex-1 w-full space-y-8">

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[28px] font-bold text-[#0F172A] mb-1">My Stores</h1>
              <p className="text-slate-500">Manage your store listings and information</p>
            </div>
            <Button asChild className="bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl h-11 px-6 font-medium">
              <Link href="/store-owner/stores/new">
                <Plus className="h-4 w-4 mr-2 shrink-0" />
                Add New Store
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Store className="h-5 w-5 text-[#3B82F6]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{totalStores}</div>
                <div className="text-sm font-medium text-slate-500">Total Stores</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Eye className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{totalViews}</div>
                <div className="text-sm font-medium text-slate-500">Total Views</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{totalReviews}</div>
                <div className="text-sm font-medium text-slate-500">Total Reviews</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Joined on</div>
                <div className="text-sm font-bold text-[#0F172A]">{joinedOn}</div>
              </div>
            </div>
          </div>


          <StoreFilters />

          <StoreList ownerId={currentUser.id} storesData={filteredStores} />
        </div>
      </main>
    </div>
  )
}
