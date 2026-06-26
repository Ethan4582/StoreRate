import Link from "next/link"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { Star, MapPin, Search, ArrowRight, Facebook, Instagram, Twitter, User } from "lucide-react"

async function getTopRatedStores() {
  const stores = await prisma.store.findMany({
    include: { ratings: { select: { rating: true, review: true } } },
    take: 20,
  })
  return stores
    .map((store) => {
      const count = store.ratings.length
      const avg = count > 0 ? store.ratings.reduce((s, r) => s + r.rating, 0) / count : 0
      const topTag = store.ratings.flatMap((r) => (r.review ? [r.review.split(" ").slice(0, 2).join(" ")] : [])).find(Boolean)
      return { ...store, avgRating: avg, reviewCount: count, topTag }
    })
    .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    .slice(0, 10)
}

export default async function HomePage() {
  const user = await getCurrentUser()
  const topStores = await getTopRatedStores()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} />

    
      <section className="relative w-full h-[600px] flex items-center justify-center">
     
        <div className="absolute inset-0 z-0">
          <img src="/hero_bg.png" alt="Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px]"></div>
      
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-screen-md mx-auto px-6 text-center flex flex-col items-center mt-[-40px]">
    
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm mb-6">
            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-sm font-medium text-slate-700">Trusted by 10,000+ shoppers</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6">
            Discover. Rate. Trust<br />
            <span className="text-blue-600">Local Stores.</span>
          </h1>
          
          <p className="text-slate-700 text-lg mb-10 max-w-xl mx-auto font-medium">
            Find amazing local stores, share honest reviews, and make better choices—together.
          </p>

      
          <div className="flex flex-col sm:flex-row items-center w-full max-w-3xl bg-white rounded-3xl sm:rounded-full p-2 shadow-xl border border-slate-100">
            <div className="flex items-center flex-1 px-4 w-full">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search stores, categories, or locations" 
                className="w-full h-12 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium" 
              />
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2"></div>
            <div className="flex items-center flex-1 px-4 w-full border-t sm:border-t-0 border-slate-100 mt-2 sm:mt-0 pt-2 sm:pt-0">
              <MapPin className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Near me" 
                className="w-full h-12 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium" 
              />
            </div>
            <button className="w-full sm:w-auto mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-full font-bold transition-colors shrink-0">
              Explore Stores
            </button>
          </div>
        </div>
      </section>

     
      <section className="w-full py-20 bg-slate-50 relative z-10">
        <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Top Rated Stores</h2>
              <p className="text-slate-500 font-medium">Explore top-rated local stores<br className="hidden sm:block" /> based on real customer reviews.</p>
            </div>
            <Link href="/stores" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors group">
              View all stores <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {topStores.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <p className="text-base">No stores yet — be the first to <Link href="/stores" className="text-blue-600 underline">add one</Link>!</p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory">
              {topStores.map((store) => (
                <Link
                  key={store.id}
                  href={`/stores/${store.slug}`}
                  className="group flex-none w-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col snap-start overflow-hidden"
                >
          
                  <div className="relative h-[200px] w-full bg-slate-100 overflow-hidden">
                    {store.image ? (
                      <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                        <span className="text-6xl font-extrabold text-blue-200">{store.name.charAt(0)}</span>
                      </div>
                    )}
                
                    <div className="absolute top-4 right-4 bg-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-slate-900">{store.avgRating > 0 ? store.avgRating.toFixed(1) : "—"}</span>
                    </div>
                  </div>

        
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-1.5 truncate group-hover:text-blue-600 transition-colors">{store.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-5 truncate font-medium">
                      <span>Store</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="truncate">{store.address}</span>
                    </div>

                
                    <div className="flex flex-wrap gap-2 mb-6">
                      {store.topTag && (
                        <span className="text-xs bg-slate-50 text-slate-600 border border-slate-100 rounded-md px-3 py-1 font-semibold">{store.topTag}</span>
                      )}
                      <span className="text-xs bg-slate-50 text-slate-600 border border-slate-100 rounded-md px-3 py-1 font-semibold">Verified</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                        <User className="w-4 h-4" />
                        <span>{store.reviewCount} Reviews</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">Open Now</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

  
      <footer className="w-full bg-white border-t border-slate-200 mt-auto">
        <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-12 py-16">
          <div className="flex flex-col lg:flex-row justify-between gap-12">
         
            <div className="lg:w-1/3">
              <div className="flex items-center mb-6">
                <img src="/logo.png" alt="StoreRate Logo" className="h-8 w-auto" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px] mb-8 font-medium">
                Discover. Rate. Trust Local Stores.
              </p>
              <p className="text-sm text-slate-500 mb-6 font-medium">
                © {new Date().getFullYear()} StoreRate. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:w-2/3">
              <div>
                <p className="text-sm font-bold text-slate-900 mb-6">Quick Links</p>
                <ul className="space-y-4 text-sm text-slate-500 font-medium">
                  <li><Link href="/stores" className="hover:text-blue-600 transition-colors">Browse Stores</Link></li>
                  <li><Link href="#" className="hover:text-blue-600 transition-colors">How It Works</Link></li>
                  <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 mb-6">For Users</p>
                <ul className="space-y-4 text-sm text-slate-500 font-medium">
                  <li><Link href="/register" className="hover:text-blue-600 transition-colors">Sign Up</Link></li>
                  <li><Link href="/login" className="hover:text-blue-600 transition-colors">Log In</Link></li>
                  <li><Link href="/my-reviews" className="hover:text-blue-600 transition-colors">My Reviews</Link></li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 mb-6">For Store Owners</p>
                <ul className="space-y-4 text-sm text-slate-500 font-medium">
                  <li><Link href="/store-owner/stores" className="hover:text-blue-600 transition-colors">Register Store</Link></li>
                  <li><Link href="/login" className="hover:text-blue-600 transition-colors">Store Login</Link></li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 mb-6">Legal</p>
                <ul className="space-y-4 text-sm text-slate-500 font-medium">
                  <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}