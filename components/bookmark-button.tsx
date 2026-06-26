"use client"

import { useState, useEffect } from "react"
import { Bookmark } from "lucide-react"
import { toast } from "sonner"

interface BookmarkButtonProps {
  storeId: number
}

export function BookmarkButton({ storeId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem("savedStores")
    if (saved) {
      try {
        const savedIds = JSON.parse(saved) as number[]
        if (savedIds.includes(storeId)) {
          setIsBookmarked(true)
        }
      } catch (e) {
        console.error("Error reading bookmarks", e)
      }
    }
  }, [storeId])

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    let savedIds: number[] = []
    const saved = localStorage.getItem("savedStores")
    
    if (saved) {
      try {
        savedIds = JSON.parse(saved)
      } catch (e) {
        // ignore
      }
    }

    if (isBookmarked) {
      savedIds = savedIds.filter(id => id !== storeId)
      setIsBookmarked(false)
      toast.success("Store removed from bookmarks")
    } else {
      savedIds.push(storeId)
      setIsBookmarked(true)
      toast.success("Store saved to bookmarks")
    }

    localStorage.setItem("savedStores", JSON.stringify(savedIds))
    
    // Dispatch a custom event so other components (like a Saved page) can listen to updates if needed
    window.dispatchEvent(new Event("bookmarksUpdated"))
  }

  return (
    <button 
      onClick={toggleBookmark} 
      className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-blue-500 shadow-sm border border-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-blue-500 text-blue-500" : ""}`} />
    </button>
  )
}
