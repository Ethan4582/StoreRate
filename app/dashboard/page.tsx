"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Users, 
  Store, 
  Star, 
  AlertCircle, 
  TrendingUp, 
  BarChart3, 
  Shield,
  ThumbsUp,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react"


const dashboardData = {
  stats: {
    totalStores: 1247,
    totalUsers: 58234,
    averageRating: 4.6,
    pendingReviews: 47,
    verifiedStores: 892,
    pendingStores: 132
  },
  stores: [
    {
      id: 1,
      storeName: "FreshMart Grocery",
      category: "Grocery",
      location: "Downtown, New York",
      rating: 4.7,
      reviews: 284,
      status: "Verified",
      owner: "John Smith",
      lastUpdated: "2023-10-15"
    },
    {
      id: 2,
      storeName: "TechGadgets",
      category: "Electronics",
      location: "Silicon Valley, CA",
      rating: 4.9,
      reviews: 512,
      status: "Verified",
      owner: "Sarah Johnson",
      lastUpdated: "2023-10-14"
    },
    {
      id: 3,
      storeName: "FashionHub Boutique",
      category: "Clothing",
      location: "Beverly Hills, CA",
      rating: 4.5,
      reviews: 187,
      status: "Pending",
      owner: "Michael Brown",
      lastUpdated: "2023-10-13"
    },
    {
      id: 4,
      storeName: "HomeEssentials",
      category: "Home Goods",
      location: "Seattle, WA",
      rating: 4.8,
      reviews: 346,
      status: "Verified",
      owner: "Emily Davis",
      lastUpdated: "2023-10-12"
    },
    {
      id: 5,
      storeName: "FitLife Gym",
      category: "Fitness",
      location: "Austin, TX",
      rating: 4.6,
      reviews: 423,
      status: "Verified",
      owner: "Robert Wilson",
      lastUpdated: "2023-10-11"
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "New store registration",
      description: "TechHub Electronics was added 2 hours ago",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      type: "Store verification",
      description: "Fashion Boutique was verified 5 hours ago",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      type: "User report",
      description: "A review was reported and needs attention",
      timestamp: "Yesterday"
    }
  ],
  chartData: [
    { name: "Jan", stores: 45, reviews: 240 },
    { name: "Feb", stores: 52, reviews: 298 },
    { name: "Mar", stores: 48, reviews: 312 },
    { name: "Apr", stores: 78, reviews: 456 },
    { name: "May", stores: 65, reviews: 387 },
    { name: "Jun", stores: 72, reviews: 421 },
    { name: "Jul", stores: 84, reviews: 532 },
    { name: "Aug", stores: 76, reviews: 489 },
    { name: "Sep", stores: 93, reviews: 567 },
    { name: "Oct", stores: 108, reviews: 642 },
  ]
}

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
    
        const mockUser = {
          id: "1",
          name: "Admin User",
          email: "admin@storerate.com",
          role: "system_admin"
        }
        setUser(mockUser)
        
        
        if (!mockUser) {
          redirect("/login")
        }
        
     
        if (mockUser.role === "normal_user") {
          redirect("/stores")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const getRoleSpecificContent = () => {
    if (!user) return null

    switch (user.role) {
      case "system_admin":
        return (
          <div className="space-y-8">
            <StatsSection />
            <ChartSection />
            <StoresTable />
            <RecentActivitySection />
          </div>
        )

      case "store_owner":
        return (
          <div className="space-y-8">
            <StoreOwnerStats />
            <StoreOwnerStores />
          </div>
        )

      default:
        return null
    }
  }

  const getRoleTitle = () => {
    if (!user) return "Dashboard"
    
    switch (user.role) {
      case "system_admin":
        return "System Administrator Dashboard"
      case "store_owner":
        return "Store Owner Dashboard"
      default:
        return "Dashboard"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">{getRoleTitle()}</p>
        </div>

        {getRoleSpecificContent()}
      </main>
    </div>
  )
}

function StatsSection() {
  const { stats } = dashboardData

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStores.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +18% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating}</div>
          <p className="text-xs text-muted-foreground">
            +0.2 from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          <p className="text-xs text-muted-foreground">
            -5 from last week
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


function ChartSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Growth & Reviews</CardTitle>
        <CardDescription>Monthly growth of registered stores and reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chart visualization would appear here</p>
              <p className="text-sm text-muted-foreground mt-2">
                Showing data for: Jan - Oct
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StoresTable() {
  const { stores } = dashboardData

  const getStatusIcon = (status) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Needs Review":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Verified":
        return "default"
      case "Pending":
        return "secondary"
      case "Needs Review":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Management</CardTitle>
        <CardDescription>Manage all stores on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search stores..."
                className="w-full bg-background pl-8 pr-4 py-2 rounded-md border"
              />
            </div>
            <Button variant="outline" size="sm" className="ml-4">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="divide-y">
            {stores.map((store) => (
              <div key={store.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{store.storeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {store.category} • {store.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-medium">{store.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{store.reviews}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(store.status)}
                    <Badge variant={getStatusVariant(store.status)} className="ml-2">
                      {store.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} of {dashboardData.stats.totalStores} stores
          </p>
          <Button variant="outline">View All Stores</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivitySection() {
  const { recentActivity } = dashboardData

  const getActivityIcon = (type) => {
    if (type.includes("store")) return <Store className="h-4 w-4" />
    if (type.includes("user")) return <Users className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest activities on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.type}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


function StoreOwnerStats() {
  const { stats } = dashboardData

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Stores</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.7</div>
          <p className="text-xs text-muted-foreground">
            +0.3 from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">
            +142 from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


function StoreOwnerStores() {
  const ownerStores = dashboardData.stores.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Stores</CardTitle>
        <CardDescription>Manage your store listings and information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ownerStores.map((store) => (
            <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{store.storeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {store.category} • {store.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-medium">{store.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{store.reviews}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
                <Button size="sm">Manage</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild className="w-full">
            <Link href="/store-owner/stores">View All Stores</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}