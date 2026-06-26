import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { Store, CheckCircle, Clock, AlertCircle, Search, Filter, MoreHorizontal } from "lucide-react"

interface StoreData {
  id: number
  storeName: string
  category: string
  location: string
  rating: number
  reviews: number
  status: string
}

export function AdminStoresTable({ stores, totalStores }: { stores: StoreData[], totalStores: number }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "Needs Review":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Verified":
        return "default"
      case "Pending":
        return "secondary"
      case "Needs Review":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="shadow-sm border-slate-100">
      <CardHeader>
        <CardTitle>Store Management</CardTitle>
        <CardDescription>Manage all stores on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search stores..."
                className="w-full bg-background pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="ml-4 rounded-lg">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase border-b border-slate-100 bg-slate-50/50">
            <div className="col-span-5 pl-2">Store</div>
            <div className="col-span-2 text-center">Rating</div>
            <div className="col-span-2 text-center">Reviews</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          <div className="divide-y divide-slate-100">
            {stores.map((store) => (
              <div key={store.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">{store.storeName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {store.category} • {store.location}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2 text-center">
                  <p className="font-medium text-sm text-slate-900 flex items-center justify-center">
                    <span className="text-amber-400 mr-1 text-lg leading-none">★</span> {store.rating.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Rating</p>
                </div>
                
                <div className="col-span-2 text-center">
                  <p className="font-medium text-sm text-slate-900">{store.reviews}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Reviews</p>
                </div>
                
                <div className="col-span-2 flex justify-center items-center">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                    ${store.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' : 
                      'bg-amber-50 text-amber-700 border-amber-200'}`}
                  >
                    {getStatusIcon(store.status)}
                    <span>{store.status}</span>
                  </div>
                </div>
                
                <div className="col-span-1 flex justify-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} of {totalStores} stores
          </p>
          <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">View All Stores</Button>
        </div>
      </CardContent>
    </Card>
  )
}
