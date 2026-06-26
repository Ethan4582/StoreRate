import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, MapPin, Phone, Globe, Eye, Trash2, MoreVertical } from "lucide-react"

interface StoreGridProps {
  processedStores: any[]
  ownerId?: number
  showOwnerActions?: boolean
}

export function StoreGrid({ processedStores, ownerId, showOwnerActions = true }: StoreGridProps) {
  if (processedStores.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-slate-500 mb-4">{ownerId ? "You haven't added any stores yet." : "No stores found."}</p>
        {ownerId && (
          <Button asChild className="bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl">
            <Link href="/store-owner/stores/new">Add Your First Store</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
      {processedStores.map((store, index) => {
        const isDraft = index === 2 

        return (
          <div key={store.id} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row flex-1">
              <div className="sm:w-[40%] shrink-0 bg-slate-100 relative min-h-[220px]">
                {store.image ? (
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 absolute inset-0">
                    No image
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 relative flex flex-col justify-center">
                <button className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-5 w-5" />
                </button>

                <div className="mb-3">
                  {isDraft ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-orange-50 text-orange-600">
                      Draft
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600">
                      Published
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-[#0F172A] mb-1.5 pr-6">{store.name}</h3>
                <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">{store.description}</p>
                
                <div className="space-y-2.5 mb-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-xs font-medium text-slate-600">{store.address}</span>
                  </div>
                  {store.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-600">{store.phone}</span>
                    </div>
                  )}
                  {store.website && (
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-[#3B82F6] shrink-0" />
                      <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#3B82F6] hover:underline truncate">
                        {store.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-[11px] font-medium text-slate-400">
                  Updated on {new Date(store.updatedAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 p-2 sm:p-3 flex gap-2 justify-center sm:justify-evenly bg-white">
              <Button variant="ghost" asChild className="text-slate-600 font-semibold text-[13px] gap-2 flex-1 hover:bg-slate-50 rounded-xl h-10">
                <Link href={`/stores/${store.id}`}>
                  <Eye className="h-4 w-4" /> View Details
                </Link>
              </Button>
              
              {ownerId && showOwnerActions && (
                <>
                  <Button variant="ghost" asChild className="text-slate-600 font-semibold text-[13px] gap-2 flex-1 hover:bg-slate-50 rounded-xl h-10">
                    <Link href={`/store-owner/stores/${store.id}/edit`}>
                      <Edit className="h-4 w-4" /> Edit Store
                    </Link>
                  </Button>
                  <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 w-12 px-0 shrink-0 rounded-xl h-10 ml-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
