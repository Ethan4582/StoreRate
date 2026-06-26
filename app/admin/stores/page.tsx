import { AdminStoresList } from "@/components/admin-stores-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AdminStoresPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Store Management</h1>
          <p className="text-muted-foreground">Monitor and manage all store listings</p>
        </div>
        <Button asChild>
          <Link href="/admin/stores/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Store
          </Link>
        </Button>
      </div>

      <AdminStoresList />
    </div>
  )
}
