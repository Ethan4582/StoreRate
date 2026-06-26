"use client"

import { useEffect, useState } from "react"
import { StoreGrid } from "@/components/store/store-grid"

export function SavedStoresList() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadBookmarks = async () => {
    try {
      setLoading(true)
      const saved = localStorage.getItem("savedStores")
      if (!saved) {
        setStores([])
        setLoading(false)
        return
      }

      const ids = JSON.parse(saved)
      if (!Array.isArray(ids) || ids.length === 0) {
        setStores([])
        setLoading(false)
        return
      }

      const res = await fetch("/api/stores/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })

      if (res.ok) {
        const data = await res.json()
        setStores(data.stores)
      } else {
        console.error("Failed to fetch saved stores")
        setStores([])
      }
    } catch (e) {
      console.error(e)
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookmarks()

    const handleUpdate = () => {
      loadBookmarks()
    }

    window.addEventListener("bookmarksUpdated", handleUpdate)
    return () => window.removeEventListener("bookmarksUpdated", handleUpdate)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-500">
        Loading saved stores...
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-slate-500">You haven't saved any stores yet.</p>
      </div>
    )
  }

  return <StoreGrid processedStores={stores} showOwnerActions={false} />
}
