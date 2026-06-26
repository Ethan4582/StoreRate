import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/get-user"
import { Navbar } from "@/components/navbar"
import { Star, MapPin, ArrowRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getTopRatedStores() {
  const stores = await prisma.store.findMany({
    include: {
      ratings: {
        select: { rating: true, review: true, user: { select: { name: true } } },
      },
      owner: { select: { name: true } },
    },
    take: 20,
  })

  return stores
    .map((store) => {
      const count = store.ratings.length
      const avg =
        count > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / count
          : 0
      const topTag = store.ratings
        .flatMap((r) => (r.review ? r.review.split(" ").slice(0, 2).join(" ") : []))
        .find(Boolean)
      return { ...store, avgRating: avg, reviewCount: count, topTag }
    })
    .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    .slice(0, 8)
}

export default async function HomePage() {
  const user = await getCurrentUser()
  const topStores = await getTopRatedStores()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar user={user} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-5">
                Discover. Rate.{" "}
                <span className="text-blue-600">Trust Local Stores.</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md">
                StoreRate helps you find great stores, share honest reviews, and
                make better choices—together.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-7 font-semibold"
                >
                  <Link href="/stores">
                    Browse Stores <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                {!user && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-xl px-7 font-semibold border-slate-200"
                  >
                    <Link href="/register">
                      Sign Up <Users className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["1", "2", "3", "4"].map((n) => (
                    <div
                      key={n}
                      className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden"
                    >
                      <img
                        src={`/${n}.png`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  Join thousands of users rating local stores
                </p>
              </div>
            </div>

            {/* Right asset */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <img
                  src="/hero_asset.png"
                  alt="StoreRate platform preview"
                  className="w-full h-auto object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP RATED STORES ─────────────────────────────────── */}
      <section className="bg-slate-50 py-16 flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Top Rated Stores
            </h2>
            <Link
              href="/stores"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View all stores <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {topStores.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg">No stores yet.</p>
              <p className="text-sm mt-1">
                Be the first to{" "}
                <Link href="/stores" className="text-blue-600 hover:underline">
                  add a store
                </Link>
                !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topStores.map((store) => (
                <Link
                  key={store.id}
                  href={`/stores/${store.slug}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col"
                >
                  {/* Store image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {store.image ? (
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                        <div className="text-4xl font-bold text-blue-200">
                          {store.name.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Store info */}
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                          {store.name}
                        </h3>
                        {store.description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {store.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{store.address}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-slate-800">
                          {store.avgRating > 0
                            ? store.avgRating.toFixed(1)
                            : "—"}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({store.reviewCount}{" "}
                          {store.reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </div>

                      {/* Top tag from a review */}
                      {store.topTag && (
                        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2.5 py-0.5 font-medium truncate max-w-[120px]">
                          {store.topTag}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-tight">
                  StoreRate
                </p>
                <p className="text-xs text-slate-400">
                  Discover. Rate. Trust Local Stores.
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link
                href="/stores"
                className="hover:text-blue-600 transition-colors"
              >
                Browse Stores
              </Link>
              {!user && (
                <>
                  <Link
                    href="/register"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>

            {/* Copyright */}
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} StoreRate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}