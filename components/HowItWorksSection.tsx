import React from 'react'

import { motion } from "framer-motion";
const HowItWorksSection = () => {
  return (
    <div>
       <section  id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              HOW STORERATE WORKS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "FIND STORES", 
                description: "SEARCH FOR STORES BY NAME, CATEGORY, OR LOCATION." 
              },
              { 
                title: "READ REVIEWS", 
                description: "SEE HONEST RATINGS AND REVIEWS FROM REAL CUSTOMERS." 
              },
              { 
                title: "SHARE EXPERIENCES", 
                description: "RATE STORES BASED ON YOUR OWN SHOPPING EXPERIENCES." 
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-8 rounded-xl text-center border"
              >
                <div className="text-3xl font-bold text-primary mb-4">{index + 1}</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorksSection