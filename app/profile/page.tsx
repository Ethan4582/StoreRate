import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User as UserIcon, Mail, Shield, Calendar, Edit } from "lucide-react"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "system_admin": return "System Administrator"
      case "store_owner": return "Store Owner"
      case "normal_user": return "Customer"
      default: return "User"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "system_admin": return "destructive"
      case "store_owner": return "default"
      case "normal_user": return "secondary"
      default: return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-500">View your public account information</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm" asChild>
            <Link href="/settings">
              <Edit className="w-4 h-4 mr-2" />
              Edit Settings
            </Link>
          </Button>
        </div>

        <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          <CardContent className="px-8 pb-8 relative pt-0">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start -mt-16 sm:-mt-12 mb-8">
              <Avatar className="w-32 h-32 sm:w-24 sm:h-24 border-4 border-white shadow-sm bg-white">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl sm:text-2xl font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left mt-2 sm:mt-14 flex-1">
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <Badge variant={getRoleBadgeVariant(user.role)} className="mt-2 text-xs font-medium">
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Account Details block */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Account Details</h3>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Full Name</p>
                    <p className="text-slate-900 font-medium">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email Address</p>
                    <p className="text-slate-900 font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Status block */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">System Status</h3>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                    <Shield className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Account Role</p>
                    <p className="text-slate-900 font-medium">{getRoleLabel(user.role)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Join Date</p>
                    <p className="text-slate-900 font-medium">Active Member</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
