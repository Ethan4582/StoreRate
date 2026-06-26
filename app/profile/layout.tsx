import { Navbar } from "@/components/navbar"
import { getCurrentUser } from "@/lib/get-user"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User as UserIcon, Bookmark, Settings, Star } from "lucide-react"

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar user={user} />
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 flex gap-8">
        
        {/* Left Sidebar */}
        <div className="hidden lg:flex flex-col w-[260px] shrink-0 space-y-2 sticky top-24 self-start">
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-[#EEF2FF] text-[#4F46E5] font-semibold rounded-xl">
            <UserIcon className="w-5 h-5" />
            My Profile
          </Link>
          <Link href="/profile/saved" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors">
            <Bookmark className="w-5 h-5" />
            Saved Stores
          </Link>
          <Link href="/my-reviews" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors">
            <Star className="w-5 h-5" />
            My Reviews
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 w-full max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}
