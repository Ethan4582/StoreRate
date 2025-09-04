import React from 'react'
import { motion } from "framer-motion";
import { Quote, Star } from 'lucide-react';
const TestimonialsSection = () => {
  return (
    <div>
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              WHAT OUR USERS SAY
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "RACHEL T.",
                role: "FREQUENT SHOPPER",
                quote: "StoreRate has completely changed how I choose where to shop. The detailed reviews save me time and money!",
                rating: 5
              },
              {
                name: "MARK S.",
                role: "STORE OWNER",
                quote: "As a business owner, StoreRate provides invaluable feedback that helps me improve my customer experience.",
                rating: 5
              },
              {
                name: "LISA M.",
                role: "BUDGET CONSCIOUS",
                quote: "I love being able to see which stores offer the best value before I even step foot inside.",
                rating: 4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-primary-foreground/10 p-8 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? "fill-current" : "text-primary-foreground/30"}`} 
                    />
                  ))}
                </div>
                <Quote className="h-8 w-8 mb-4 opacity-50" />
                <p className="italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm opacity-80">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TestimonialsSection