import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Store, Users, AlertCircle, MessageSquare } from "lucide-react"

interface ActivityData {
  id: string
  type: string
  description: string
  timestamp: string
  iconType: string
}

export function AdminRecentActivity({ recentActivity }: { recentActivity: ActivityData[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "store":
        return <Store className="h-4 w-4 text-blue-500" />
      case "user":
        return <Users className="h-4 w-4 text-blue-500" />
      case "review":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className="shadow-sm border-slate-100">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest activities on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center mt-0.5">
                {getActivityIcon(activity.iconType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 truncate">{activity.type}</p>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{activity.description}</p>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">{activity.timestamp}</p>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No recent activity.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
