"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", stores: 45, reviews: 240 },
  { name: "Feb", stores: 52, reviews: 298 },
  { name: "Mar", stores: 48, reviews: 312 },
  { name: "Apr", stores: 78, reviews: 456 },
  { name: "May", stores: 65, reviews: 387 },
  { name: "Jun", stores: 72, reviews: 421 },
  { name: "Jul", stores: 84, reviews: 532 },
  { name: "Aug", stores: 76, reviews: 489 },
  { name: "Sep", stores: 93, reviews: 567 },
  { name: "Oct", stores: 108, reviews: 642 },
]

export function ChartAreaInteractive() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Store Growth & Reviews</h2>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Monthly growth of registered stores and reviews
        </p>
      </div>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="stores" fill="#3b82f6" name="Stores" />
            <Bar dataKey="reviews" fill="#10b981" name="Reviews" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}