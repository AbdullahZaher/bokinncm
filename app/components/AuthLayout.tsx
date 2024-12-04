'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "./ui/use-toast"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error checking auth status:', error)
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        })
        router.push('/login')
        return
      }

      if (!session && !isPublicRoute(pathname)) {
        toast({
          title: "Access Denied",
          description: "Please log in to continue",
          variant: "destructive",
        })
        router.push('/login')
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    checkAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router, supabase, toast])

  return <>{children}</>
}

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/', '/login', '/signup', '/auth/callback', '/verification']
  return publicRoutes.includes(pathname)
} 