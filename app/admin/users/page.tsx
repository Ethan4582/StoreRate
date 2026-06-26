import { AdminUsersList } from "@/components/admin-users-list"
import { Button } from "@/components/ui/forms/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage platform users and their permissions</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      <AdminUsersList />
    </div>
  )
}
