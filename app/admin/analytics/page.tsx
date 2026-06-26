import { AdminAnalytics } from "@/components/analytics/admin-analytics"

export default function AdminAnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Platform Analytics</h1>
        <p className="text-muted-foreground">Detailed insights and platform statistics</p>
      </div>

      <AdminAnalytics />
    </div>
  )
}
