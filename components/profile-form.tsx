"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "@/lib/auth"

interface ProfileFormProps {
  user: User
}

export function SettingsForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match")
        setLoading(false)
        return
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters")
        setLoading(false)
        return
      }
      if (!formData.currentPassword) {
        setError("Current password is required to change password")
        setLoading(false)
        return
      }
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Settings updated successfully")
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        router.refresh()
      } else {
        setError(data.error || "Failed to update settings")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <AlertDescription className="font-medium">{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information Section */}
      <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-900">Personal Information</CardTitle>
          <CardDescription>Update your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password & Security Section */}
      <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-900">Password & Security</CardTitle>
          <CardDescription>Keep your account secure by updating your password</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="currentPassword" className="text-slate-700 font-medium">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="Enter current password"
              className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-700 font-medium">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 font-medium">
          {loading ? "Saving Changes..." : "Save Settings"}
        </Button>
      </div>
    </form>
  )
}
