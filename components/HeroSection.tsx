import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar" 

export function HeroSection({ platformStats, scrollToFeatures, user }) {
  const [dark, setDark] = useState(false)


  const toggleDark = () => {
    setDark((d) => !d)
    if (!dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className={`min-h-screen w-full relative bg-white dark:bg-background`}>
      {/* Soft Green Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #8FFFB0 40%, transparent 80%)
          `,
        }}
      />
      {/* Navbar */}
      {user ? (
        <Navbar user={user} />
      ) : (
        <nav className="relative z-10 w-full flex items-center justify-between px-8 py-4 border-b border-border bg-card dark:bg-background">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="px-3 py-1 rounded-lg font-semibold text-black dark:text-white bg-muted dark:bg-muted/20"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#reviews"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Sign In
            </Link>
            <Button
              asChild
              className="bg-white text-black dark:bg-muted dark:text-white font-semibold px-4 py-2 rounded-lg"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <button
              aria-label="Toggle dark mode"
              onClick={toggleDark}
              className="rounded-full p-2 bg-muted text-muted-foreground hover:bg-accent transition"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      )}
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-6">
            StoreRate
          </h1>
          <p className="text-2xl md:text-3xl font-light text-black dark:text-white mb-10">
            WHERE SHOPPERS AND STORES CONNECT
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <p className="text-xl text-black dark:text-white mb-10">
            DISCOVER HONEST STORE RATINGS AND REVIEWS FROM REAL CUSTOMERS. MAKE INFORMED SHOPPING DECISIONS AND SUPPORT BUSINESSES THAT EXCEL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/register">GET STARTED</Link>
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToFeatures} className="border-black text-black dark:border-white dark:text-white hover:bg-muted">
              LEARN MORE
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {platformStats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/70 dark:bg-card/80 backdrop-blur-sm rounded-lg border border-border">
              <p className="text-2xl font-bold text-black dark:text-white">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}