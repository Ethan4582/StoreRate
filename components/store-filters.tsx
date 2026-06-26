"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StoreFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSearch = searchParams.get("search") || ""
  const currentSort = searchParams.get("sort") || "desc"

  const [searchTerm, setSearchTerm] = useState(currentSearch)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) {
        params.set("search", searchTerm)
      } else {
        params.delete("search")
      }
      router.push(`?${params.toString()}`)
    }, 400)
    
    return () => clearTimeout(timer)
  }, [searchTerm, router, searchParams])

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your stores..." 
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-sm placeholder:text-slate-400 text-slate-900 shadow-sm"
        />
      </div>
      
      <div className="flex gap-4 w-full sm:w-auto">
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[210px] h-11 bg-white border-slate-200 rounded-xl shadow-sm text-sm font-medium text-[#0F172A]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Sort by: Latest Updated</SelectItem>
            <SelectItem value="asc">Sort by: Oldest Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
