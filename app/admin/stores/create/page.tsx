import { AdminStoreCreateForm } from "@/components/admin-store-create-form"

export default function CreateStorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Store</h1>
        <p className="text-muted-foreground">Register a new store listing</p>
      </div>
      
      <AdminStoreCreateForm />
    </div>
  )
}
