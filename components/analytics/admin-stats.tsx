import { Card, CardContent } from "@/components/ui/layout/card"
import { Users, Store, Star, Clock, ArrowUp, ArrowDown } from "lucide-react"

interface StatsType {
  totalStores: number
  totalUsers: number
  averageRating: number
  pendingReviews: number
  storeGrowth: number
  userGrowth: number
  pendingReviewsChange: number
}

export function AdminStats({ stats }: { stats: StatsType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center mb-4">
              <div className="bg-blue-50 text-blue-500 p-3 rounded-xl flex items-center justify-center">
                <Store className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{stats.totalStores.toLocaleString()}</div>
          <div className="flex items-center text-sm font-medium text-green-500">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>{stats.storeGrowth}% from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center mb-4">
              <div className="bg-blue-50 text-blue-500 p-3 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Registered Users</p>
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{stats.totalUsers.toLocaleString()}</div>
          <div className="flex items-center text-sm font-medium text-green-500">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>{stats.userGrowth}% from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center mb-4">
              <div className="bg-blue-50 text-blue-500 p-3 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{stats.averageRating}</div>
          <div className="flex items-center text-sm font-medium text-red-500">
            <ArrowDown className="h-4 w-4 mr-1" />
            <span>0.2 from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center mb-4">
              <div className="bg-blue-50 text-blue-500 p-3 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{stats.pendingReviews}</div>
          <div className="flex items-center text-sm font-medium text-red-500">
            <ArrowDown className="h-4 w-4 mr-1" />
            <span>{Math.abs(stats.pendingReviewsChange)} from last week</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
