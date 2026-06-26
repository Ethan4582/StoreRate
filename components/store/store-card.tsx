import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { MapPin, Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"
import { BookmarkButton } from "@/components/bookmark-button"

export interface Store {
  id: number
  name: string
  slug: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  owner_name: string
  avg_rating: number
  review_count: number
  image?: string
}

interface StoreCardProps {
  store: Store
  viewMode: "grid" | "list"
  category: string
}

export function StoreCard({ store, viewMode, category }: StoreCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden hover:shadow-md transition-shadow ${viewMode === "grid" ? "flex-col md:flex-row" : "flex-col sm:flex-row"}`}>
   
      <div className={`relative shrink-0 bg-gray-50 ${viewMode === "grid" ? "w-full md:w-[45%] h-64 md:h-auto" : "w-full sm:w-[30%] lg:w-[25%] h-48 sm:h-auto"}`}>
        <div className="absolute top-4 left-4 z-10">
          <BookmarkButton storeId={store.id} />
        </div>
        {store.image ? (
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

  
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 mb-3 px-3 py-1 font-medium rounded-full border-none">
            {category}
          </Badge>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
          
          <p className="text-sm text-gray-500 mb-5 line-clamp-2">
            {store.description}
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600 line-clamp-1">{store.address}</span>
            </div>

            {store.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-600">{store.phone}</span>
              </div>
            )}

            {store.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-600 truncate">{store.email}</span>
              </div>
            )}

            {store.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate"
                >
                  {new URL(store.website.startsWith('http') ? store.website : `https://${store.website}`).hostname.replace('www.', '')}
                </a>
              </div>
            )}
          </div>
        </div>

      
        <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
          <Button variant="outline" className="flex-1 rounded-xl h-10 font-semibold hover:bg-accent" asChild>
            <Link href={`/stores/${store.slug || store.id}`}>View Details</Link>
          </Button>
          <Button className="flex-1 rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm" asChild>
            <Link href={`/stores/${store.slug || store.id}/rate`}>Rate Store</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
