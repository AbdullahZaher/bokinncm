'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun, Home, Hotel, BedSingle, Calendar, LinkIcon, BarChart, Settings, Code } from 'lucide-react'
import { Button } from "./ui/button"
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Header() {
  const [session, setSession] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      
      // Fetch user's dark mode preference
      if (currentSession?.user?.id) {
        const { data } = await supabase
          .from('hotel_owners')
          .select('dark_mode')
          .eq('id', currentSession.user.id)
          .single()
        
        if (data) {
          setIsDarkMode(data.dark_mode)
          document.documentElement.classList.toggle('dark', data.dark_mode)
        }
      }
      
      setIsLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    }

    getSession()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle('dark', newDarkMode)

    // Update dark mode preference in Supabase
    if (session?.user?.id) {
      await supabase
        .from('hotel_owners')
        .update({ dark_mode: newDarkMode })
        .eq('id', session.user.id)
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  if (isLoading) {
    return null
  }

  return (
    <header className="shadow-md bg-[hsl(var(--home-bg))]">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo - always visible */}
          <Link href="/" className="text-md font-medium text-white">
            Bokinn Channel Manager
          </Link>

          {/* Mobile Menu Controls - only when authenticated */}
          {session && (
            <div className="flex items-center gap-4 md:hidden">
              <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          )}

          {/* Navigation Menu - only when authenticated */}
          {session && (
            <div className={`
              md:flex items-center space-x-4
              ${isMenuOpen ? 'block' : 'hidden'}
              absolute md:relative
              top-16 md:top-0
              left-0 md:left-auto
              right-0 md:right-auto
              bg-card md:bg-transparent
              p-4 md:p-0
              shadow-md md:shadow-none
              z-50
            `}>
              <Link 
                href="/dashboard" 
                className="block md:inline-block py-2 hover:text-primary relative group"
                onClick={closeMenu}
              >
                <div className="flex items-center gap-2">
                  <Home size={18} />
                  <span className="md:hidden">Dashboard</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Dashboard
                  </span>
                </div>
              </Link>
              <Link href="/rooms" className="block md:inline-block py-2 hover:text-primary relative group" onClick={closeMenu}>
                <div className="flex items-center gap-2">
                  <BedSingle size={18} />
                  <span className="md:hidden">Rooms</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Rooms
                  </span>
                </div>
              </Link>
              <Link href="/bookings" className="block md:inline-block py-2 hover:text-primary relative group" onClick={closeMenu}>
                <div className="flex items-center gap-2">
                  <Hotel size={18} />
                  <span className="md:hidden">Bookings</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Bookings
                  </span>
                </div>
              </Link>
              <Link href="/calendar" className="block md:inline-block py-2 hover:text-primary relative group" onClick={closeMenu}>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span className="md:hidden">Calendar</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Calendar
                  </span>
                </div>
              </Link>
              <Link href="/integrations" className="block md:inline-block py-2 hover:text-primary relative group" onClick={closeMenu}>
                <div className="flex items-center gap-2">
                  <LinkIcon size={18} />
                  <span className="md:hidden">Integrations</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Integrations
                  </span>
                </div>
              </Link>
              <Link href="/analytics" className="block md:inline-block py-2 hover:text-primary relative group" onClick={closeMenu}>
                <div className="flex items-center gap-2">
                  <BarChart size={18} />
                  <span className="md:hidden">Analytics</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Analytics
                  </span>
                </div>
              </Link>
              <Link href="/admin/xml-feeds" className="block md:inline-block py-2 hover:text-primary relative group" onClick={closeMenu}>
                <div className="flex items-center gap-2">
                  <Code size={18} />
                  <span className="md:hidden">XML Feeds</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    XML Feeds
                  </span>
                </div>
              </Link>
              <Link href="/settings" className="block md:inline-block py-2 hover:text-primary relative group" onClick={closeMenu}>
                <div className="flex items-center gap-2">
                  <Settings size={18} />
                  <span className="md:hidden">Settings</span>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-popover rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Settings
                  </span>
                </div>
              </Link>
              
              {/* Dark mode toggle - desktop */}
              <button onClick={toggleDarkMode} className="hidden md:block">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              {/* Logout button */}
              <Button 
                variant="destructive" 
                className="w-full md:w-auto h-7 mt-2 md:mt-0"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}

          {/* Login button - only when not authenticated */}
          {!session && (
            <div className="flex items-center gap-4 text-white">
              <Link href="/login">
                <Button variant="default" className="w-18 h-7 text-white bg-[hsl(var(--foreground))]">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

