'use client'

import * as React from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState } from 'react'
import disposableDomains from 'disposable-email-domains'
import { cn } from "@/lib/utils"
import Link from 'next/link'

export default function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  // Password validation checks
  const hasLength = password.length >= 8
  const hasNumber = /[0-9]/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasSpecial = /[@!#$%^&*]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)

  // Debug logging
  React.useEffect(() => {
    console.log('Password:', password)
    console.log('Contains Letter:', hasLetter)
  }, [password, hasLetter])

  const isPasswordValid = hasLength && 
                         hasNumber && 
                         hasLetter && 
                         hasSpecial && 
                         hasUppercase

  // Add this function to check email domain
  const isDisposableEmail = (email: string) => {
    try {
      // التحقق من وجود @ في البريد الإلكتروني
      if (!email || !email.includes('@')) {
        return false
      }

      const domain = email.split('@')[1]
      // التحقق من وجود النطاق
      if (!domain) {
        return false
      }

      return disposableDomains.includes(domain.toLowerCase())
    } catch (error) {
      console.error('Error checking disposable email:', error)
      return false
    }
  }

  // Add email validation state
  const [emailError, setEmailError] = useState<string | null>(null)

  // Add email validation function
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format')
      return false
    }
    
    if (isDisposableEmail(email)) {
      setEmailError('Temporary email addresses are not allowed')
      return false
    }
    
    setEmailError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const form = e.currentTarget
      const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim().toLowerCase()
      const password = (form.elements.namedItem('password') as HTMLInputElement)?.value
      const fullName = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim()

      // Input validation
      if (!fullName || !email || !password) {
        setError('All fields are required')
        return
      }

      // Email validation
      if (!validateEmail(email)) {
        return
      }

      console.log('Starting signup process...', { email, fullName })

      // 1. Check for existing user
      const { data: existingUser } = await supabase
        .from('hotel_owners')
        .select('email')
        .eq('email', email)
        .single()

      if (existingUser) {
        setError('Email already in use')
        return
      }

      // 2. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (authError) {
        console.error('Auth Error:', authError)
        if (authError.message.includes('email')) {
          setError('Email already in use')
        } else if (authError.message.includes('password')) {
          setError('Invalid password')
        } else {
          setError('Error creating account')
        }
        return
      }

      if (!authData.user?.id) {
        throw new Error('User was not created')
      }

      console.log('Auth user created:', authData.user.id)

      // 3. Create hotel owner record
      const { error: ownerError } = await supabase
        .from('hotel_owners')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          email: email
        })

      if (ownerError) {
        console.error('Database Error:', ownerError)
        throw new Error('Failed to save user data')
      }

      console.log('Hotel owner record created successfully')
      
      // 4. Redirect to verification page
      router.push('/verification')

    } catch (err) {
      console.error('Signup Error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Registration error occurred'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand Section */}
      <div className="hidden lg:flex items-center justify-center bg-primary p-8">
        <img 
          src="/logo.png?height=100&width=100" 
          alt="Bokinn Logo"
          className="max-w-[100px]"
        />
      </div>

      {/* Form Section */}
      <div className="p-8 lg:p-12 flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Hotel Owner Account Details
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the account details that will be used to manage bookings and subscriptions
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Enter your full name"
                className="transition-colors focus:ring-2 focus:ring-primary/20"
                required 
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@domain.com"
                className={cn(
                  "transition-colors focus:ring-2 focus:ring-primary/20",
                  emailError && "border-red-500 focus:ring-red-500/20"
                )}
                required 
                onChange={(e) => {
                  const email = e.target.value.trim()
                  if (email) validateEmail(email)
                }}
                onBlur={(e) => {
                  const email = e.target.value.trim()
                  if (email) validateEmail(email)
                }}
              />
              {emailError && (
                <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 transition-colors focus:ring-2 focus:ring-primary/20"
                  placeholder="•••••••"
                  required 
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
              
              {/* Password requirements checklist - تم إزالة الشرط لتظهر القائمة دائماً */}
              <div className="space-y-2 text-sm">
                <p className="font-medium text-muted-foreground">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-2 ${hasLength ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
                    <span>{hasLength ? '✓' : '✗'}</span>
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasNumber ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
                    <span>{hasNumber ? '✓' : '✗'}</span>
                    <span>At least one number</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasLetter ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
                    <span>{hasLetter ? '✓' : '✗'}</span>
                    <span>At least one letter</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasSpecial ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
                    <span>{hasSpecial ? '✓' : '✗'}</span>
                    <span>At least one special character (@!#$%^&*)</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasUppercase ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
                    <span>{hasUppercase ? '✓' : '✗'}</span>
                    <span>At least one uppercase letter</span>
                  </li>
                </ul>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full font-medium"
              disabled={loading || !isPasswordValid}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

            {/* Add login link */}
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login"
                className="text-primary hover:text-primary/90 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}