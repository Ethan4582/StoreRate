"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/auth"
import { useState } from "react"
import { User as UserIcon, Settings, LogOut, Menu, X } from "lucide-react"

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "system_admin":
        return "System Admin"
      case "store_owner":
        return "Store Owner"
      case "normal_user":
        return "Customer"
      default:
        return "User"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "system_admin":
        return "destructive"
      case "store_owner":
        return "default"
      case "normal_user":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getNavigationLinks = () => {
    if (!user) return []

    if (user.role === "store_owner") {
      return [
        { href: "/store-owner/reviews", label: "Reviews" },
        { href: "/store-owner/stores", label: "My Stores" },
        { href: "/stores", label: "Browse Stores" }
      ]
    }

    const baseLinks = [
      { href: "/dashboard", label: "Dashboard" }
    ]

    switch (user.role) {
      case "system_admin":
        return [
          ...baseLinks,
          { href: "/admin", label: "Admin Panel" },
          { href: "/stores", label: "Browse Stores" }
        ]
      case "normal_user":
        return [
          { href: "/stores", label: "Browse Stores" },
          { href: "/my-reviews", label: "My Reviews" }
        ]
      default:
        return baseLinks
    }
  }

  const navigationLinks = getNavigationLinks()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href={user ? "/dashboard" : "/"} 
              className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SR</span>
              </div>
              <span>StoreRate</span>
            </Link>
          </div>

          {/* Right side - User menu or Auth buttons */}
          <div className="flex items-center space-x-3">

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full hover:bg-accent hover:ring-2 hover:ring-primary/20 transition-all duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" sideOffset={5}>
                  <div className="flex items-center justify-start gap-2 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs w-fit">
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Navigation Links */}
                  <div className="px-1 py-1">
                    <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Navigation</p>
                    {navigationLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} className="flex items-center cursor-pointer w-full">
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>

                  <DropdownMenuSeparator />
                  
                  {/* Account Links */}
                  <div className="px-1 py-1">
                    <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Account</p>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer w-full">
                        <UserIcon className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2 cursor-pointer w-full">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Get started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}