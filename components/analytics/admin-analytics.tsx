import { prisma } from "@/lib/db"
import { AdminAnalyticsGrowth } from "./admin-analytics-growth"
import { AdminAnalyticsRatings } from "./admin-analytics-ratings"
import { AdminAnalyticsPerformers } from "./admin-analytics-performers"

export async function AdminAnalytics() {
  const [ratingDistribution, topStores, topUsers] = await Promise.all([
    prisma.rating.groupBy({
      by: ["rating"],
      _count: { rating: true },
      orderBy: { rating: "desc" },
    }),
    prisma.store.findMany({
      include: {
        owner: { select: { name: true } },
        ratings: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "normal_user" },
      include: {
        ratings: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const totalRatings = ratingDistribution.reduce((sum, item) => sum + item._count.rating, 0)
  
  const processedRatingDistribution = ratingDistribution.map((item) => ({
    rating: item.rating,
    count: item._count.rating,
    percentage: totalRatings > 0 ? ((item._count.rating / totalRatings) * 100).toFixed(1) : "0",
  }))

  const processedTopStores = topStores
    .map((store) => {
      const avgRating =
        store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0
      return {
        ...store,
        avg_rating: avgRating,
        review_count: store.ratings.length,
      }
    })
    .filter((store) => store.review_count > 0)
    .sort((a, b) => b.avg_rating - a.avg_rating || b.review_count - a.review_count)
    .slice(0, 3)

  const processedTopUsers = topUsers
    .map((user) => ({
      ...user,
      rating_count: user.ratings.length,
    }))
    .filter((user) => user.rating_count > 0)
    .sort((a, b) => b.rating_count - a.rating_count)
    .slice(0, 2)

  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const [userGrowth, storeGrowth] = await Promise.all([
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as user_count
      FROM users
      WHERE role != 'system_admin' AND created_at >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 1
    `,
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as store_count
      FROM stores
      WHERE created_at >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 1
    `,
  ])

  const currentMonthUser = (userGrowth as any[])[0] || { month: new Date(), user_count: 0 }
  const currentMonthStore = (storeGrowth as any[])[0] || { month: new Date(), store_count: 0 }

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminAnalyticsGrowth 
        currentMonthUser={currentMonthUser} 
        currentMonthStore={currentMonthStore} 
      />
      <AdminAnalyticsRatings 
        distribution={processedRatingDistribution} 
      />
      <AdminAnalyticsPerformers 
        topStores={processedTopStores} 
        topUsers={processedTopUsers} 
      />
    </div>
  )
}
