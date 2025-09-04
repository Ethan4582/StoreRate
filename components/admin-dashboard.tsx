import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Store, Star, TrendingUp } from "lucide-react"

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

  const customers = userRoleCounts.find((stat) => stat.role === "normal_user")?._count.id || 0
  const storeOwners = userRoleCounts.find((stat) => stat.role === "store_owner")?._count.id || 0

  
  const [recentUsers, recentStores, recentRatings] = await Promise.all([
    prisma.user.findMany({
      where: { role: { not: "system_admin" } },
      select: { name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.store.findMany({
      include: {
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.rating.findMany({
      include: {
        store: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "store_owner":
        return "default"
      case "normal_user":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats._count.id}</div>
            <p className="text-xs text-muted-foreground">+{newUsers30d} this month</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {customers} customers, {storeOwners} store owners
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeStats._count.id}</div>
            <p className="text-xs text-muted-foreground">+{newStores30d} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratingStats._count.id}</div>
            <p className="text-xs text-muted-foreground">+{newRatings30d} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ratingStats._avg.rating ? Number(ratingStats._avg.rating).toFixed(1) : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Platform average</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage platform users and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Oversight</CardTitle>
            <CardDescription>Monitor and manage store listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/stores">Manage Stores</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
            <CardDescription>View detailed platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Stores</CardTitle>
            <CardDescription>Latest store additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentStores.map((store, index) => (
                <div key={index}>
                  <p className="font-medium text-sm">{store.name}</p>
                  <p className="text-xs text-muted-foreground">by {store.owner.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(store.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Ratings</CardTitle>
            <CardDescription>Latest customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRatings.map((rating, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">{rating.store.name}</p>
                    <Badge variant="secondary">⭐ {rating.rating}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">by {rating.user.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
