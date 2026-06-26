import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Store, Star, TrendingUp, UserRound, Store as StoreIcon, PieChart, ArrowRight } from "lucide-react"

export async function AdminDashboard() {

  const [userStats, userRoleCounts, storeStats, ratingStats] = await Promise.all([
    prisma.user.aggregate({
      where: { role: { not: "system_admin" } },
      _count: {
        id: true,
      },
    }),
    prisma.user.groupBy({
      by: ["role"],
      where: { role: { not: "system_admin" } },
      _count: {
        id: true,
      },
    }),
    prisma.store.aggregate({
      _count: {
        id: true,
      },
    }),
    prisma.rating.aggregate({
      _count: {
        id: true,
      },
      _avg: { rating: true },
    }),
  ])

  const newUsers30d = await prisma.user.count({
    where: {
      role: { not: "system_admin" },
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  })

  const newStores30d = await prisma.store.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  })

  const newRatings30d = await prisma.rating.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  })

  const [recentUsers, recentStores, recentRatings] = await Promise.all([
    prisma.user.findMany({
      where: { role: { not: "system_admin" } },
      select: { name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.store.findMany({
      include: {
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.rating.findMany({
      include: {
        store: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ])

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "store_owner":
        return "Store Owner"
      case "normal_user":
        return "Customer"
      default:
        return "User"
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
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

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">User Management</h3>
                <p className="text-sm text-muted-foreground">Manage platform users and permissions</p>
              </div>
            </div>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex justify-between items-center h-11">
              <Link href="/admin/users">
                Manage Users
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <StoreIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Store Overview</h3>
                <p className="text-sm text-muted-foreground">Monitor and manage store listings</p>
              </div>
            </div>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex justify-between items-center h-11">
              <Link href="/admin/stores">
                Manage Stores
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                <PieChart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Platform Analytics</h3>
                <p className="text-sm text-muted-foreground">View detailed platform statistics</p>
              </div>
            </div>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex justify-between items-center h-11">
              <Link href="/admin/analytics">
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
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
                  {/* Assuming store rating isn't available here directly, mock or just show a star */}
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
    </div>
  )
}
