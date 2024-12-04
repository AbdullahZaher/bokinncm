'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const cleanEmail = formData.email.toLowerCase().trim()

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password
      })

      if (authError) {
        throw new Error(authError.message)
      }

      const { data: hotelOwner, error: dbError } = await supabase
        .from('hotel_owners')
        .select('id, email, full_name')
        .eq('email', cleanEmail)
        .single()

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          throw new Error('User account not found. Please contact support.')
        }
        throw new Error('Error accessing user data. Please try again.')
      }

      if (!hotelOwner) {
        throw new Error('User account not found. Please contact support.')
      }

      router.push('/dashboard')
      router.refresh()

    } catch (err) {
      console.error('Login error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-primary p-8">
        <img 
          src="/logo.png?height=100&width=100" 
          alt="Bokinn Logo"
          className="max-w-[100px]"
        />
      </div>

      <div className="p-8 lg:p-12 flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    setError(null)
                  }}
                  placeholder="example@domain.com"
                  className="w-full transition-colors focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      setError(null)
                    }}
                    className="w-full pr-10 transition-colors focus:ring-2 focus:ring-primary/20"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                defaultChecked
              />
              <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                Remember me for 7 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                href="/signup"
                className="text-primary hover:text-primary/90 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}