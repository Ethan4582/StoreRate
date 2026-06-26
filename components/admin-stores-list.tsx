"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, MoreVertical, Star } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Store {
  id: number
  name: string
  slug: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  owner_name: string
  owner_email: string
  created_at: string
  avg_rating: number
  review_count: number
}

export function AdminStoresList() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [minRating, setMinRating] = useState("any")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchStores = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (minRating !== "any") params.append("minRating", minRating)

      const response = await fetch(`/api/admin/stores?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setStores(data.stores)
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [search, minRating])

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by store name, owner, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-lg bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Rating:</span>
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className="w-[130px] rounded-lg bg-slate-50 border-transparent">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] rounded-lg bg-slate-50 border-transparent">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="rounded-lg gap-2 text-slate-600">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Store Name</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Added On</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Loading stores...
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No stores found matching your criteria.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 whitespace-nowrap">
                        {store.name}
                      </div>
                      <div className="text-xs text-slate-500 max-w-[200px] truncate">
                        {store.email || store.website || "No contact info"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-900">{store.owner_name}</div>
                      <div className="text-xs text-slate-500">{store.owner_email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {store.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-slate-900">
                          {Number(store.avg_rating) > 0 ? Number(store.avg_rating).toFixed(1) : "New"}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({store.review_count})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(store.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-green-50 text-green-600 px-2 py-1 rounded-sm">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" asChild>
                          <Link href={`/stores/${store.slug || store.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/stores/${store.slug || store.id}`}>View public page</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Store</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete Store</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
