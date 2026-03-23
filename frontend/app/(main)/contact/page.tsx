"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-zinc-900 dark:text-white mb-12">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            <p>
              Have a question about a product, order, or just want to say hello? 
              Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-1">Email</h3>
                <p>support@essentialcurations.com</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-1">Hours</h3>
                <p>Monday - Friday, 9am - 5pm EST</p>
              </div>
            </div>
          </div>
          
          <div>
            {submitted ? (
              <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-2">Message Sent</h3>
                <p className="text-zinc-600 dark:text-zinc-400 font-light">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-zinc-900 dark:text-white tracking-widest uppercase">Name</label>
                  <input 
                    id="name" 
                    type="text" 
                    required 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-none px-4 py-3 text-sm focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-zinc-900 dark:text-white tracking-widest uppercase">Email</label>
                  <input 
                    id="email" 
                    type="email" 
                    required 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-none px-4 py-3 text-sm focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-zinc-900 dark:text-white tracking-widest uppercase">Message</label>
                  <textarea 
                    id="message" 
                    required 
                    rows={5}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-none px-4 py-3 text-sm focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 outline-none resize-none"
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full rounded-none tracking-widest uppercase text-xs h-12">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
