'use client'

import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { BarChart2, Globe, Users } from 'lucide-react'

export default function ChannelManager() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/signup')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2">
                <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Bokinn Channel Manager
                  </span>
                </h1>
                <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                  Streamline your hotel bookings across multiple platforms with our powerful channel manager solution.
                </p>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                  >
                    Get Started
                  </Button>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <Image
                    src="/dashboard-preview.jpg"
                    alt="Dashboard Preview"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl dark:shadow-blue-500/10"
                  />
                  <div className="absolute -z-10 top-4 right-4 w-full h-full bg-blue-600/10 dark:bg-blue-400/10 rounded-lg blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: BarChart2,
                  title: "Real-time Analytics",
                  description: "Track your performance across all channels"
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  description: "Connect with booking platforms worldwide"
                },
                {
                  icon: Users,
                  title: "Multi-user Access",
                  description: "Collaborate with your team efficiently"
                }
              ].map((feature, index) => (
                <Card 
                  key={index} 
                  className="border-none shadow-lg bg-white dark:bg-gray-800 transition-colors duration-200"
                >
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of hotels managing their bookings efficiently
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Start Free Trial
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Bokinn Channel Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}