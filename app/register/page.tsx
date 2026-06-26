"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Eye, EyeOff, Mail, Lock, Search, Star, Shield, User, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  // Simple password validation checks for the UI
  const hasMinLength = formData.password.length >= 8
  const hasUppercase = /[A-Z]/.test(formData.password)
  const hasNumberOrSymbol = /[\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!hasMinLength || !hasUppercase || !hasNumberOrSymbol) {
      setError("Please ensure your password meets all requirements.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Account created successfully!")
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push(data.redirect || "/stores")
      } else {
        toast.error(data.error || "Registration failed")
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden lg:flex flex-col w-[55%] xl:w-[60%] bg-[#0B1536] relative text-white overflow-hidden p-12">
     
        <Image 
          src="/login.png" 
          alt="Login Background" 
          fill
          priority
          className="object-cover object-right z-0"
        />
        
   
        <div className="relative z-10 h-full flex flex-col">
     
          <div className="flex items-center mb-16">
            <img src="/logo.png" alt="StoreRate Logo" className="h-8 w-auto" />
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
              <div className="flex items-start gap-4">
                <div className="bg-[#0B1536]/60 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 drop-shadow-md">Discover</h3>
                  <p className="text-slate-200 text-sm drop-shadow-md">Find top-rated stores near you</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#0B1536]/60 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 drop-shadow-md">Review</h3>
                  <p className="text-slate-200 text-sm drop-shadow-md">Share your experience and help others</p>
                </div>
              </div>
              
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

      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col min-h-screen relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-20 bg-white">
      
        <div className="absolute top-8 right-8 hidden sm:block">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

     
        <div className="flex justify-between items-center p-6 lg:hidden border-b border-slate-100">
          <div className="flex items-center">
            <img src="/logo.png" alt="StoreRate Logo" className="h-6 w-auto" />
          </div>
          <Link href="/login" className="text-sm text-blue-600 font-medium">
            Sign in
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-16 w-full max-w-2xl mx-auto py-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
            <p className="text-slate-500">Join our community and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

          
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your full name"
                    className="pl-9 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Enter your email"
                    className="pl-9 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

         
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-sm font-medium text-slate-700">Account Type</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50/50">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal_user">Customer</SelectItem>
                  <SelectItem value="store_owner">Store Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

          
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Enter your password"
                    className="pl-9 pr-9 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirm your password"
                    className="pl-9 pr-9 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

          
            <div className="space-y-2 mt-4 mb-2">
              <p className="text-xs font-medium text-slate-700">Your password must contain:</p>
              <ul className="space-y-1.5 text-xs">
                <li className={`flex items-center gap-2 ${hasMinLength ? 'text-green-600' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> At least 8 characters
                </li>
                <li className={`flex items-center gap-2 ${hasUppercase ? 'text-green-600' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> One uppercase letter
                </li>
                <li className={`flex items-center gap-2 ${hasNumberOrSymbol ? 'text-green-600' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> One number or symbol
                </li>
              </ul>
            </div>

            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-base mt-2" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 px-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              By creating an account, you agree to our{" "}
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
