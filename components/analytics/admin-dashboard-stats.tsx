import { Card, CardContent } from "@/components/ui/layout/card"
import { Users, Store, Star, TrendingUp } from "lucide-react"

interface AdminDashboardStatsProps {
  userStats: { _count: { id: number } }
  storeStats: { _count: { id: number } }
  ratingStats: { _count: { id: number }, _avg: { rating: number | null } }
  newUsers30d: number
  newStores30d: number
  newRatings30d: number
}

export function AdminDashboardStats({
  userStats,
  storeStats,
  ratingStats,
  newUsers30d,
  newStores30d,
  newRatings30d
}: AdminDashboardStatsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{userStats._count.id}</h3>
            </div>
            <p className="text-xs text-green-500 mt-1 font-medium flex items-center gap-1">
              ↑ {newUsers30d} this month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-500 p-3 rounded-2xl">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{storeStats._count.id}</h3>
            </div>
            <p className="text-xs text-green-500 mt-1 font-medium flex items-center gap-1">
              ↑ {newStores30d} this month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-purple-50 text-purple-500 p-3 rounded-2xl">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Ratings</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{ratingStats._count.id}</h3>
            </div>
            <p className="text-xs text-green-500 mt-1 font-medium flex items-center gap-1">
              ↑ {newRatings30d} this month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-500 p-3 rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">
                {ratingStats._avg.rating ? Number(ratingStats._avg.rating).toFixed(1) : "0.0"}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Platform average</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
