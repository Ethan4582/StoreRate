import { Navbar } from "@/components/navbar"
import { Skeleton } from "@/components/ui/feedback/skeleton"

export default function StoreOwnerStoresLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar user={null} />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 flex gap-8">
        
  
        <div className="hidden lg:flex flex-col w-[260px] shrink-0 space-y-2 sticky top-24 self-start">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}

          <div className="mt-8 bg-[#F8FAFF] border border-blue-100 rounded-3xl p-6 flex flex-col items-center text-center">
            <Skeleton className="w-32 h-32 rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40 mb-6" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>

     
        <div className="flex-1 w-full space-y-8">
          
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>

      
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>

        
          <div className="flex gap-4">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
