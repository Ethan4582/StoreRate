import { Card, CardContent } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Users, Store } from "lucide-react"

interface AdminAnalyticsGrowthProps {
  currentMonthUser: { month: Date; user_count: number | string | bigint }
  currentMonthStore: { month: Date; store_count: number | string | bigint }
}

export function AdminAnalyticsGrowth({ currentMonthUser, currentMonthStore }: AdminAnalyticsGrowthProps) {
  const formatMonth = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm border-slate-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-slate-900">User Growth (Last 12 Months)</h3>
              <p className="text-sm text-slate-500 mb-6">Monthly user registrations</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800 text-sm">{formatMonth(currentMonthUser.month)}</span>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs font-semibold px-2 py-0.5 rounded-md">
                  {Number(currentMonthUser.user_count)} users
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-slate-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <Store className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-slate-900">Store Growth (Last 12 Months)</h3>
              <p className="text-sm text-slate-500 mb-6">Monthly store additions</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800 text-sm">{formatMonth(currentMonthStore.month)}</span>
                <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-50 text-xs font-semibold px-2 py-0.5 rounded-md">
                  {Number(currentMonthStore.store_count)} stores
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
