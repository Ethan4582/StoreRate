import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { User as UserIcon, Mail, Shield, Calendar, Edit, Store, Star, Lock, PlusCircle, Bookmark, Eye, Activity } from "lucide-react"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const [storeCount, reviewCount, recentRatings, recentStores] = await Promise.all([
    prisma.store.count({ where: { ownerId: user.id } }),
    prisma.rating.count({ where: { userId: user.id } }),
    prisma.rating.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { store: true }
    }),
    prisma.store.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3
    })
  ])

  // Combine and sort recent activity
  const activities = [
    ...recentRatings.map(r => ({ type: "review", title: "Submitted a review", desc: r.store.name, date: r.createdAt, icon: Star, color: "text-green-600", bg: "bg-green-100" })),
    ...recentStores.map(s => ({ type: "store", title: "Added a new store", desc: s.name, date: s.createdAt, icon: PlusCircle, color: "text-blue-600", bg: "bg-blue-100" }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4)

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase()

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "system_admin": return "System Administrator"
      case "store_owner": return "Store Owner"
      case "normal_user": return "Customer"
      default: return "User"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <SidebarLayout userRole={user.role}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">My Profile</h1>
              <p className="text-sm text-slate-500">View and manage your public account information</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm" asChild>
              <Link href="/settings">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>

          {/* Banner Card */}
          <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <CardContent className="px-8 pb-8 relative pt-0">
              <div className="flex flex-col sm:flex-row gap-6 items-start -mt-12 sm:-mt-10">
                <Avatar className="w-24 h-24 border-4 border-white shadow-sm bg-white">
                  <AvatarFallback className="bg-blue-50 text-blue-700 text-2xl font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 sm:mt-12 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                    <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Member since {format(user.createdAt, "dd MMM yyyy")}
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 rounded-full font-medium">
                      Active Member
                    </Badge>
                  </div>
                </div>
                {/* Quote section from mockup */}
                <div className="hidden md:block w-72 mt-12 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-blue-500 font-serif text-2xl leading-none">"</div>
                  <p className="text-sm text-slate-600 italic mt-1">Discovering great places and sharing authentic experiences.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl shadow-sm border-slate-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{storeCount}</div>
                  <div className="text-xs font-medium text-slate-900 mb-0.5">Stores Created</div>
                  <div className="text-[10px] text-slate-500">Total stores you've added</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-slate-200 opacity-60">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">--</div>
                  <div className="text-xs font-medium text-slate-900 mb-0.5">Profile Views</div>
                  <div className="text-[10px] text-slate-500">People viewed your profile</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-slate-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{reviewCount}</div>
                  <div className="text-xs font-medium text-slate-900 mb-0.5">Reviews</div>
                  <div className="text-[10px] text-slate-500">Total reviews submitted</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-slate-200 opacity-60">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <Bookmark className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">--</div>
                  <div className="text-xs font-medium text-slate-900 mb-0.5">Saved Stores</div>
                  <div className="text-[10px] text-slate-500">Stores you've saved</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Details */}
            <Card className="rounded-2xl shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Account Details</h3>
                </div>
                
                <div className="space-y-0">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 w-1/3">
                      <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">Full Name</span>
                    </div>
                    <span className="text-sm text-slate-900 font-medium text-left flex-1">{user.name}</span>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg" asChild>
                      <Link href="/settings">Edit</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 w-1/3">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">Email Address</span>
                    </div>
                    <span className="text-sm text-slate-900 font-medium text-left flex-1">{user.email}</span>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg" asChild>
                      <Link href="/settings">Edit</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 w-1/3">
                      <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">Account Role</span>
                    </div>
                    <span className="text-sm text-slate-900 font-medium text-left flex-1">{getRoleLabel(user.role)}</span>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>View</Button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 w-1/3">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">Join Date</span>
                    </div>
                    <span className="text-sm text-slate-900 font-medium text-left flex-1">{format(user.createdAt, "dd MMM yyyy")}</span>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Overview */}
            <Card className="rounded-2xl shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Security Overview</h3>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Keep your account secure</h4>
                    <p className="text-xs text-slate-500 mt-1">Your account is protected and all security settings are up to date.</p>
                  </div>
                </div>

                <div className="space-y-0">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 flex-1">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-sm text-slate-900 font-medium block">Password</span>
                        <span className="text-xs text-slate-500 tracking-widest">••••••••••••</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg" asChild>
                      <Link href="/settings">Update</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 flex-1 opacity-50">
                      <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-sm text-slate-900 font-medium block">Two-Factor Authentication</span>
                        <span className="text-xs text-slate-500">Disabled</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="rounded-2xl shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                </div>
                <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>View All Activity</Button>
              </div>

              {activities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {activities.map((activity, i) => {
                    const Icon = activity.icon
                    return (
                      <div key={i} className="flex gap-3 items-start border-r border-slate-100 last:border-0 pr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.bg}`}>
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{activity.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 truncate max-w-[140px]">{activity.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{format(activity.date, "dd MMM yyyy, hh:mm a")}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No recent activity found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    </div>
  )
}
