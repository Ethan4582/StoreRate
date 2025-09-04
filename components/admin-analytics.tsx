import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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
    .slice(0, 10)

  
  const processedTopUsers = topUsers
    .map((user) => ({
      ...user,
      rating_count: user.ratings.length,
    }))
    .filter((user) => user.rating_count > 0)
    .sort((a, b) => b.rating_count - a.rating_count)
    .slice(0, 10)


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
      LIMIT 12
    `,
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as store_count
      FROM stores
      WHERE created_at >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `,
  ])

  return (
    <div className="space-y-8">
      {/* Growth Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth (Last 12 Months)</CardTitle>
            <CardDescription>Monthly user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(userGrowth as any[]).map((month, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {new Date(month.month).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                  <Badge variant="secondary">{Number(month.user_count)} users</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Growth (Last 12 Months)</CardTitle>
            <CardDescription>Monthly store additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(storeGrowth as any[]).map((month, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {new Date(month.month).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                  <Badge variant="secondary">{Number(month.store_count)} stores</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>How customers rate stores on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processedRatingDistribution.map((rating) => (
              <div key={rating.rating} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{rating.rating} Stars</span>
                  <span className="text-sm text-muted-foreground">
                    {rating.count} ratings ({rating.percentage}%)
                  </span>
                </div>
                <Progress value={Number(rating.percentage)} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Rated Stores</CardTitle>
            <CardDescription>Stores with highest ratings and most reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedTopStores.map((store, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{store.name}</p>
                    <p className="text-xs text-muted-foreground">by {store.owner.name}</p>
                    <p className="text-xs text-muted-foreground">{store.address}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">⭐ {Number(store.avg_rating).toFixed(1)}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{store.review_count} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Active Reviewers</CardTitle>
            <CardDescription>Customers with most store ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedTopUsers.map((user, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="secondary">{user.rating_count} reviews</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
