'use client'

import React from "react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Check } from "lucide-react"

export default function SignupForm() {
  const [password, setPassword] = React.useState("")
  
  // Password validation checks
  const hasLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasSpecial = /[!@#$%^&*]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)

  return (
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

      <form className="space-y-6">
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
            className="transition-colors focus:ring-2 focus:ring-primary/20"
            required 
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <div className="flex gap-2">
            <Select defaultValue="966">
              <SelectTrigger className="w-[100px] focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="+966" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="966">
                  <span className="flex items-center">
                    <img
                      src="/placeholder.svg?height=20&width=30"
                      alt="SA"
                      className="w-4 h-4 mr-2"
                    />
                    +966
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="5XXXXXXXX"
              className="flex-1 transition-colors focus:ring-2 focus:ring-primary/20" 
              required 
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="transition-colors focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
            required 
          />
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className={`flex items-center gap-2 ${hasLength ? 'text-success' : ''}`}>
              <Check className={`h-3.5 w-3.5 ${hasLength ? 'opacity-100' : 'opacity-30'}`} />
              <span>Minimum 8 characters</span>
            </div>
            <div className={`flex items-center gap-2 ${hasNumber ? 'text-success' : ''}`}>
              <Check className={`h-3.5 w-3.5 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} />
              <span>At least one number</span>
            </div>
            <div className={`flex items-center gap-2 ${hasLetter ? 'text-success' : ''}`}>
              <Check className={`h-3.5 w-3.5 ${hasLetter ? 'opacity-100' : 'opacity-30'}`} />
              <span>At least one letter</span>
            </div>
            <div className={`flex items-center gap-2 ${hasUppercase ? 'text-success' : ''}`}>
              <Check className={`h-3.5 w-3.5 ${hasUppercase ? 'opacity-100' : 'opacity-30'}`} />
              <span>At least one uppercase letter</span>
            </div>
            <div className={`flex items-center gap-2 ${hasSpecial ? 'text-success' : ''}`}>
              <Check className={`h-3.5 w-3.5 ${hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
              <span>At least one special character (e.g., @ ! # $ % ^)</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full font-medium">
          Create Account
        </Button>
      </form>
    </div>
  )
} 