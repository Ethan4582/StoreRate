"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/forms/input"
import { Button } from "@/components/ui/forms/button"
import { Label } from "@/components/ui/forms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Textarea } from "@/components/ui/forms/textarea"
import { toast } from "sonner"
import { Store, MapPin, Phone, Mail, Globe, User, ArrowLeft } from "lucide-react"

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
    <div className="max-w-2xl">
     
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Stores
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-lg font-semibold text-slate-900">Create New Store</h2>
          <p className="text-sm text-slate-500 mt-0.5">Add a new store and assign it to a store owner</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
        
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Store Name</Label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acme Supermarket"
                className="pl-9 h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

        
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Store description..."
              rows={3}
              className="rounded-xl border-slate-200 resize-none"
            />
          </div>

        
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium text-slate-700">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Market St, City"
                className="pl-9 h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

       
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="pl-9 h-11 rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@store.com"
                  className="pl-9 h-11 rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>

         
          <div className="space-y-1.5">
            <Label htmlFor="website" className="text-sm font-medium text-slate-700">
              Website <span className="text-slate-400 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.store.com"
                className="pl-9 h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ownerId" className="text-sm font-medium text-slate-700">Store Owner</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
              <Select value={formData.ownerId} onValueChange={handleOwnerChange} required>
                <SelectTrigger className="pl-9 h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select a store owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.length === 0 ? (
                    <SelectItem value="__none" disabled>No store owners found</SelectItem>
                  ) : (
                    owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>
                        {owner.name} ({owner.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="h-11 rounded-xl border-slate-200 flex-1 sm:flex-none sm:w-32"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              {loading ? "Creating..." : "Create Store"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
