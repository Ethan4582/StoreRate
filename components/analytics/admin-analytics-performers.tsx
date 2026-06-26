import { Card, CardContent } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { Trophy, UsersRound, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"

interface TopStore {
  id: number
  name: string
  slug: string | null
  image: string | null
  address: string
  avg_rating: number
  review_count: number
  owner: { name: string }
}

interface TopUser {
  id: number
  name: string
  email: string
  rating_count: number
}

interface AdminAnalyticsPerformersProps {
  topStores: TopStore[]
  topUsers: TopUser[]
}

export function AdminAnalyticsPerformers({ topStores, topUsers }: AdminAnalyticsPerformersProps) {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
  const colors = ["bg-blue-600", "bg-green-600", "bg-orange-600", "bg-purple-600"]

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm border-slate-200 flex flex-col">
        <CardContent className="p-6 flex-1">
          <div className="flex gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="pt-1">
              <h3 className="font-bold text-slate-900 text-sm">Top Rated Stores</h3>
              <p className="text-xs text-slate-500">Stores with highest ratings and most reviews</p>
            </div>
          </div>

          <div className="space-y-6">
            {topStores.map((store) => (
              <div key={store.id} className="flex gap-4 items-center">
                <div className="w-16 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden relative">
                  {store.image ? (
                    <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/stores/${store.slug || store.id}`} className="font-bold text-slate-900 text-sm truncate block hover:text-blue-600">
                    {store.name}
                  </Link>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide mt-0.5">by {store.owner.name}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{store.address}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <Badge variant="secondary" className="bg-yellow-50 text-slate-800 hover:bg-yellow-50 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-yellow-100">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {Number(store.avg_rating).toFixed(1)}
                  </Badge>
                  <p className="text-xs text-slate-500">{store.review_count} reviews</p>
                </div>
              </div>
            ))}
            {topStores.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-4">No top stores found.</div>
            )}
          </div>
        </CardContent>
        <div className="p-4 pt-0">
          <Button variant="secondary" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 h-10 rounded-xl font-semibold text-xs" asChild>
            <Link href="/admin/stores">
              View all stores <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl shadow-sm border-slate-200 flex flex-col">
        <CardContent className="p-6 flex-1">
          <div className="flex gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
              <UsersRound className="w-6 h-6 text-purple-600" />
            </div>
            <div className="pt-1">
              <h3 className="font-bold text-slate-900 text-sm">Most Active Reviewers</h3>
              <p className="text-xs text-slate-500">Customers with most store ratings</p>
            </div>
          </div>

          <div className="space-y-6">
            {topUsers.map((user, index) => {
              const color = colors[index % colors.length]
              return (
                <div key={user.id} className="flex gap-4 items-center">
                  <Avatar className={`w-10 h-10 border-0 ${color}`}>
                    <AvatarFallback className={`${color} text-white font-semibold text-sm`}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/users/${user.id}`} className="font-bold text-slate-900 text-sm truncate block hover:text-blue-600">
                      {user.name}
                    </Link>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {user.rating_count} reviews
                    </Badge>
                  </div>
                </div>
              )
            })}
            {topUsers.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-4">No active reviewers found.</div>
            )}
          </div>
        </CardContent>
        <div className="p-4 pt-0">
          <Button variant="secondary" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 h-10 rounded-xl font-semibold text-xs" asChild>
            <Link href="/admin/users">
              View all reviewers <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
