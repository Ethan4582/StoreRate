import { Input } from "@/components/ui/forms/input"
import { Button } from "@/components/ui/forms/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Search, Filter } from "lucide-react"
import Image from "next/image"

interface StoreListSidebarProps {
  search: string
  setSearch: (val: string) => void
  category: string
  setCategory: (val: string) => void
  location: string
  setLocation: (val: string) => void
  availableLocations: string[]
  clearFilters: () => void
}

export function StoreListSidebar({
  search,
  setSearch,
  category,
  setCategory,
  location,
  setLocation,
  availableLocations,
  clearFilters
}: StoreListSidebarProps) {
  return (
    <div className="w-full lg:w-[320px] shrink-0 bg-background lg:bg-slate-50/50 rounded-3xl lg:p-6 lg:border border-border/50 flex flex-col space-y-6 lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
      
    
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
        <Image 
          src="/asset_1.png" 
          alt="Store illustration" 
          width={300} 
          height={200} 
          className="w-full max-w-[250px] h-auto object-contain mb-6"
          priority
        />
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Browse Stores</h1>
        <p className="text-sm text-muted-foreground">Discover and rate the best local businesses near you.</p>
      </div>

  
      <div className="space-y-4 pt-4 border-t border-border/50">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-white border-border/50 focus-visible:ring-1 focus-visible:ring-primary text-sm shadow-sm"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full h-11 rounded-xl bg-white border-border/50 shadow-sm text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="food">Food & Beverage</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="health">Health & Wellness</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>

        <Select value={location || "all"} onValueChange={setLocation}>
          <SelectTrigger className="w-full h-11 rounded-xl bg-white border-border/50 shadow-sm text-sm">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {availableLocations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="w-full h-11 rounded-xl border-border/50 bg-white shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 text-primary hover:text-primary" onClick={clearFilters}>
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </Button>
      </div>
    </div>
  )
}
