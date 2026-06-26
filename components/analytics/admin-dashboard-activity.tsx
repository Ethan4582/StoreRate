import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import Link from "next/link"
import { Store, Star, ArrowRight } from "lucide-react"

interface RecentUser {
  name: string
  email: string
  role: string
  createdAt: Date
}

interface RecentStore {
  name: string
  owner: { name: string }
  createdAt: Date
}

interface RecentRating {
  store: { name: string }
  user: { name: string }
  rating: number
  createdAt: Date
}

interface AdminDashboardActivityProps {
  recentUsers: RecentUser[]
  recentStores: RecentStore[]
  recentRatings: RecentRating[]
}

export function AdminDashboardActivity({
  recentUsers,
  recentStores,
  recentRatings
}: AdminDashboardActivityProps) {

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "store_owner": return "Store Owner"
      case "normal_user": return "Customer"
      default: return "User"
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="border-border/50 shadow-sm flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Recent Users</CardTitle>
            <CardDescription className="text-xs">Latest user registrations</CardDescription>
          </div>
          <Link href="/admin/users" className="text-xs text-blue-600 hover:underline font-medium">View all</Link>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    user.role === 'store_owner' ? 'bg-purple-100 text-purple-700' : 
                    user.role === 'system_admin' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-tight">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {getRoleLabel(user.role)}
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex justify-center items-center gap-2" asChild>
            <Link href="/admin/users">
              View All Users <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Recent Stores</CardTitle>
            <CardDescription className="text-xs">Latest store additions</CardDescription>
          </div>
          <Link href="/admin/stores" className="text-xs text-blue-600 hover:underline font-medium">View all</Link>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            {recentStores.map((store, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-tight">{store.name}</p>
                    <p className="text-xs text-muted-foreground">by {store.owner.name}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(store.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                  <Star className="w-3 h-3 fill-amber-500" />
                  -.-
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex justify-center items-center gap-2" asChild>
            <Link href="/admin/stores">
              View All Stores <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Recent Ratings</CardTitle>
            <CardDescription className="text-xs">Latest customer reviews</CardDescription>
          </div>
          <Link href="/admin/ratings" className="text-xs text-blue-600 hover:underline font-medium">View all</Link>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            {recentRatings.map((rating, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm leading-tight">{rating.store.name}</p>
                  <p className="text-xs text-muted-foreground">by {rating.user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                  <Star className="w-3 h-3 fill-amber-500" />
                  {rating.rating}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex justify-center items-center gap-2" asChild>
            <Link href="/admin/ratings">
              View All Ratings <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
