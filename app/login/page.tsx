"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Search, Star, Shield, Store } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push(data.redirect || "/")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Pane - Image and Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-[55%] xl:w-[60%] bg-[#0B1536] relative text-white overflow-hidden p-12">
        {/* Background Image */}
        <img 
          src="/login.png" 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover object-right z-0"
        />
        
        {/* Content on top of background */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center font-bold text-sm h-8 w-8">
              SR
            </div>
            <span className="font-bold text-xl tracking-tight">StoreRate</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4 tracking-tight drop-shadow-md">
              Discover. Rate. Trust.<br />
              <span className="text-blue-400">All in One Place.</span>
            </h1>
            
            <p className="text-slate-200 text-base mb-12 max-w-md leading-relaxed drop-shadow-md">
              Find the best local businesses, share honest reviews, and help communities make better choices.
            </p>

            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="bg-[#0B1536]/60 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 drop-shadow-md">Discover</h3>
                  <p className="text-slate-200 text-sm drop-shadow-md">Find top-rated stores near you</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="bg-[#0B1536]/60 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 drop-shadow-md">Review</h3>
                  <p className="text-slate-200 text-sm drop-shadow-md">Share your experience and help others</p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="bg-[#0B1536]/60 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 drop-shadow-md">Trust</h3>
                  <p className="text-slate-200 text-sm drop-shadow-md">Real reviews from real people</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col min-h-screen relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-20 bg-white">
        {/* Top Right Header */}
        <div className="absolute top-8 right-8 hidden sm:block">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Mobile Logo & Sign Up Link */}
        <div className="flex justify-between items-center p-6 lg:hidden border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1 rounded-md flex items-center justify-center font-bold text-xs h-6 w-6">
              SR
            </div>
            <span className="font-bold tracking-tight text-slate-900">StoreRate</span>
          </div>
          <Link href="/register" className="text-sm text-blue-600 font-medium">
            Sign up
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 xl:px-16 w-full max-w-xl mx-auto py-12">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="pl-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-base mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center px-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              By signing in, you agree to our{" "}
              <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
