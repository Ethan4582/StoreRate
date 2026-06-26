import { Navbar } from "@/components/navbar"
import { Skeleton } from "@/components/ui/feedback/skeleton"

export default function StoreDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar user={null} />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        

        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

     
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row gap-8">
          
          
          <div className="lg:w-[450px] shrink-0 flex flex-col gap-6">
            <Skeleton className="h-[300px] w-full rounded-2xl" />
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

         
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-80 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="h-11 w-24 rounded-xl" />
                  <Skeleton className="h-11 w-40 rounded-xl" />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="flex items-center gap-3 mb-8">
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            <div>
             
              <div className="flex flex-col sm:flex-row gap-6 py-5 border-y border-slate-100 mb-6">
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 flex-1" />
              </div>

             
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          
          <div className="space-y-8">
            <Skeleton className="h-[400px] w-full rounded-[24px]" />
            <Skeleton className="h-[400px] w-full rounded-[24px]" />
          </div>

          <div className="space-y-8">
           
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200 self-start space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
