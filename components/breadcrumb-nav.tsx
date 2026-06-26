"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export function BreadcrumbNav() {
  const pathname = usePathname()
  
  if (pathname === "/") return null

  const paths = pathname.split("/").filter((path) => path)

  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`
        const isLast = index === paths.length - 1
        
        // Capitalize and clean up path segment
        const label = path
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-slate-300" />
            {isLast ? (
              <span className="text-slate-900 font-semibold truncate max-w-[150px] sm:max-w-[200px]" aria-current="page">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-blue-600 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                {label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
