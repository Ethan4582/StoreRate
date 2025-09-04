import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { motion } from "framer-motion";
const CTASection = () => {
  return (
    <div>
       <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              READY TO JOIN OUR COMMUNITY?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              SIGN UP TODAY TO START EXPLORING AND REVIEWING STORES IN YOUR AREA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/register">CREATE ACCOUNT</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">SIGN IN</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CTASection