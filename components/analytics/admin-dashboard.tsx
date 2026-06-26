import { prisma } from "@/lib/db"
import { AdminDashboardStats } from "./admin-dashboard-stats"
import { AdminDashboardActions } from "./admin-dashboard-actions"
import { AdminDashboardActivity } from "./admin-dashboard-activity"

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

  return (
    <div className="space-y-6">
      <AdminDashboardStats 
        userStats={userStats}
        storeStats={storeStats}
        ratingStats={ratingStats}
        newUsers30d={newUsers30d}
        newStores30d={newStores30d}
        newRatings30d={newRatings30d}
      />
      
      <AdminDashboardActions />
      
      <AdminDashboardActivity 
        recentUsers={recentUsers}
        recentStores={recentStores}
        recentRatings={recentRatings}
      />
    </div>
  )
}
