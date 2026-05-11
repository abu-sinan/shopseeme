'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { cn } from '@/utils'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactInput) => {
    setIsLoading(true)
    // Simulate form submission — connect to email service in production
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Message sent! We'll get back to you within 24 hours.")
    reset()
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      {/* Hero */}
      <div className="bg-[#050505] border-b border-white/5 py-16">
        <div className="container-main text-center">
          <p className="section-subheading mb-3">Get In Touch</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-brand-pink">Us</span>
          </h1>
          <p className="text-brand-gray max-w-md mx-auto">
            Have a question, concern, or feedback? We&apos;re here to help. Reach out and
            we&apos;ll respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="container-main py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-xl font-bold text-white">Contact Information</h2>

            {[
              {
                icon: Phone,
                title: 'Phone / WhatsApp',
                content: '+880 1X-XXXX-XXXX',
                href: 'tel:+8801XXXXXXXXX',
              },
              {
                icon: Mail,
                title: 'Email',
                content: 'hello@shopseeme.com',
                href: 'mailto:hello@shopseeme.com',
              },
              {
                icon: MapPin,
                title: 'Address',
                content: 'Dhaka, Bangladesh',
                href: null,
              },
              {
                icon: Clock,
                title: 'Business Hours',
                content: 'Sat–Thu: 9am – 9pm\nFri: Closed',
                href: null,
              },
            ].map(({ icon: Icon, title, content, href }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-pink" />
                </div>
                <div>
                  <p className="text-xs text-brand-gray uppercase tracking-wide mb-1">{title}</p>
                  {href ? (
                    <a href={href} className="text-white text-sm hover:text-brand-pink transition-colors">
                      {content}
                    </a>
                  ) : (
                    <p className="text-white text-sm whitespace-pre-line">{content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* bKash / Social */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-4 mt-2">
              <p className="text-xs text-brand-gray uppercase tracking-wide mb-2">Quick Support</p>
              <p className="text-white text-sm">
                For fastest response, WhatsApp us at{' '}
                <a
                  href="https://wa.me/8801XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-pink hover:text-brand-pink-light transition-colors"
                >
                  +880 1X-XXXX-XXXX
                </a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6 md:p-8">
              <h2 className="font-display text-xl font-bold text-white mb-6">Send a Message</h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                    Your Name *
                  </label>
                  <input
                    {...register('name')}
                    className={cn('form-input', errors.name && 'border-red-500')}
                    placeholder="Full name"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn('form-input', errors.email && 'border-red-500')}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                    Phone (optional)
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={cn('form-input', errors.phone && 'border-red-500')}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                    Subject *
                  </label>
                  <input
                    {...register('subject')}
                    className={cn('form-input', errors.subject && 'border-red-500')}
                    placeholder="Order issue, product question, etc."
                  />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className={cn('form-input resize-none', errors.message && 'border-red-500')}
                    placeholder="How can we help you? Please be as detailed as possible..."
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-sm font-bold disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
