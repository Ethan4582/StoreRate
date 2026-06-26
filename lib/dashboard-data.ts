import { prisma } from "@/lib/db"

export async function getDashboardData() {
  const [
    totalStores,
    totalUsers,
    totalRatings,
    avgRatingResult,
    stores,
    recentUsers,
    recentRatings
  ] = await Promise.all([
    prisma.store.count(),
    prisma.user.count(),
    prisma.rating.count(),
    prisma.rating.aggregate({ _avg: { rating: true } }),
    prisma.store.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { 
        ratings: true,
        owner: { select: { name: true } }
      }
    }),
    prisma.user.findMany({
      take: 2,
      orderBy: { createdAt: "desc" }
    }),
    prisma.rating.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { store: { select: { name: true } }, user: { select: { name: true } } }
    })
  ])

  // Get stats from 30 days ago to calculate % change
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [lastMonthStores, lastMonthUsers, lastMonthRatings] = await Promise.all([
    prisma.store.count({ where: { createdAt: { lt: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { lt: thirtyDaysAgo } } }),
    prisma.rating.count({ where: { createdAt: { lt: thirtyDaysAgo } } })
  ])

  const storeGrowth = lastMonthStores === 0 ? 100 : Math.round(((totalStores - lastMonthStores) / lastMonthStores) * 100)
  const userGrowth = lastMonthUsers === 0 ? 100 : Math.round(((totalUsers - lastMonthUsers) / lastMonthUsers) * 100)
  
  // Pending reviews: we'll simulate this by counting reviews in the last 7 days since we don't have a status
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const pendingReviews = await prisma.rating.count({ where: { createdAt: { gte: sevenDaysAgo } } })
  const lastWeekPendingReviews = await prisma.rating.count({ 
    where: { 
      createdAt: { gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000), lt: sevenDaysAgo } 
    } 
  })
  const pendingReviewsChange = pendingReviews - lastWeekPendingReviews

  // Chart data: Group stores and ratings by month for the current year
  const currentYear = new Date().getFullYear()
  
  const allStoresThisYear = await prisma.store.findMany({
    where: { createdAt: { gte: new Date(`${currentYear}-01-01`) } },
    select: { createdAt: true }
  })
  const allRatingsThisYear = await prisma.rating.findMany({
    where: { createdAt: { gte: new Date(`${currentYear}-01-01`) } },
    select: { createdAt: true }
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const chartData = months.map((month, index) => {
    return {
      name: month,
      stores: allStoresThisYear.filter(s => s.createdAt.getMonth() === index).length,
      reviews: allRatingsThisYear.filter(r => r.createdAt.getMonth() === index).length,
    }
  }).slice(0, new Date().getMonth() + 1) // Only show up to current month

  // Format stores for table
  const formattedStores = stores.map(store => {
    const avgRating = store.ratings.length > 0 
      ? store.ratings.reduce((acc, curr) => acc + curr.rating, 0) / store.ratings.length 
      : 0
    return {
      id: store.id,
      storeName: store.name,
      category: "General", // Since category isn't in schema, default to General
      location: store.address || "Unknown Location",
      rating: Number(avgRating.toFixed(1)),
      reviews: store.ratings.length,
      status: store.ratings.length > 0 ? "Verified" : "Pending", // Mock status
    }
  })

  // Format recent activity
  const recentActivity = [
    ...stores.slice(0, 2).map(store => ({
      id: `store-${store.id}`,
      type: "New store registration",
      description: `${store.name} was added`,
      timestamp: store.createdAt,
      iconType: "store"
    })),
    ...recentRatings.slice(0, 2).map(rating => ({
      id: `rating-${rating.id}`,
      type: "New review added",
      description: `${rating.user?.name || "Unknown"} reviewed ${rating.store?.name || "Unknown"}`,
      timestamp: rating.createdAt,
      iconType: "review"
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 4)

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  }

  const formattedRecentActivity = recentActivity.map(act => ({
    ...act,
    timestamp: timeAgo(act.timestamp)
  }))

  return {
    stats: {
      totalStores,
      totalUsers,
      averageRating: Number((avgRatingResult._avg.rating || 0).toFixed(1)),
      pendingReviews,
      storeGrowth,
      userGrowth,
      pendingReviewsChange
    },
    chartData,
    stores: formattedStores,
    recentActivity: formattedRecentActivity
  }
}
