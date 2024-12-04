'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errors: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'Unable to sign in.',
  }

  const errorMessage = error && errors[error] ? errors[error] : errors.Default

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-red-600">
          Authentication Error
        </h2>
        
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {errorMessage}
        </div>

        <div className="text-center">
          <Link 
            href="/login"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  )
} 