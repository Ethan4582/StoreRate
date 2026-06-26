import { Card, CardContent } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import Link from "next/link"
import { UserRound, Store as StoreIcon, PieChart, ArrowRight } from "lucide-react"

export function AdminDashboardActions() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage platform users and permissions</p>
            </div>
          </div>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex justify-between items-center h-11">
            <Link href="/admin/users">
              Manage Users
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <StoreIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Store Overview</h3>
              <p className="text-sm text-muted-foreground">Monitor and manage store listings</p>
            </div>
          </div>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex justify-between items-center h-11">
            <Link href="/admin/stores">
              Manage Stores
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
              <PieChart className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Platform Analytics</h3>
              <p className="text-sm text-muted-foreground">View detailed platform statistics</p>
            </div>
          </div>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex justify-between items-center h-11">
            <Link href="/admin/analytics">
              View Analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
