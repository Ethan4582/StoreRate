"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface StoreOwner {
  id: number
  name: string
  email: string
}

export function AdminStoreCreateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [owners, setOwners] = useState<StoreOwner[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    ownerId: "",
  })

  useEffect(() => {
    // Fetch users with store_owner role
    const fetchOwners = async () => {
      try {
        const response = await fetch("/api/admin/users?role=store_owner")
        if (response.ok) {
          const data = await response.json()
          setOwners(data.users)
        }
      } catch (error) {
        console.error("Failed to fetch store owners:", error)
      }
    }
    fetchOwners()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOwnerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, ownerId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create store")
      }

      toast.success("Store created successfully")
      router.push("/admin/stores")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Store</CardTitle>
        <CardDescription>Add a new store and assign it to a store owner</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Acme Supermarket"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Store description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Market St, City"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@store.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.store.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerId">Store Owner</Label>
            <Select value={formData.ownerId} onValueChange={handleOwnerChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a store owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id.toString()}>
                    {owner.name} ({owner.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="w-full">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Store"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
