import { Card, CardContent } from "@/components/ui/layout/card"
import { Progress } from "@/components/ui/feedback/progress"
import { Star } from "lucide-react"

interface RatingData {
  rating: number
  count: number
  percentage: string
}

interface AdminAnalyticsRatingsProps {
  distribution: RatingData[]
}

export function AdminAnalyticsRatings({ distribution }: AdminAnalyticsRatingsProps) {
  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-8">
          <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            <Star className="w-7 h-7 text-purple-600" />
          </div>
          <div className="pt-1">
            <h3 className="font-bold text-slate-900">Rating Distribution</h3>
            <p className="text-sm text-slate-500">How customers rate stores on the platform</p>
          </div>
        </div>

        <div className="space-y-6">
          {distribution.map((rating) => (
            <div key={rating.rating} className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-800 w-16">{rating.rating} Stars</span>
              <div className="flex-1">
                <Progress value={Number(rating.percentage)} className="h-1.5 bg-slate-100 [&>div]:bg-blue-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium w-32 text-right">
                {rating.count} ratings <span className="text-blue-600">({rating.percentage}%)</span>
              </span>
            </div>
          ))}
          {distribution.length === 0 && (
            <div className="text-sm text-slate-500 text-center py-4">No ratings yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
