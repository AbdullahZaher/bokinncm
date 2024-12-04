'use client'

import { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useToast } from "./ui/use-toast"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function SettingsClient() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [userData, setUserData] = useState({
    email: '',
    full_name: '',
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  // Fetch user data on component mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('hotel_owners')
            .select('*')
            .eq('id', user.id)
            .single()
            
          if (profile) {
            setUserData({
              email: user.email || '',
              full_name: profile.full_name || '',
            })
            setDarkMode(profile.dark_mode || false)
            setNotifications(profile.notifications || false)
            setTimezone(profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
          }
        }
      } catch (error: any) {
        console.error('Error loading user data:', error)
        toast({
          title: "Error loading settings",
          description: error.message || "Failed to load user settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [supabase, toast])

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // First update the auth user's metadata if needed
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: userData.full_name }
      })

      if (authError) throw authError

      // Then update the hotel_owners table
      const { error: profileError } = await supabase
        .from('hotel_owners')
        .update({
          full_name: userData.full_name,
          dark_mode: darkMode,
          notifications: notifications,
          timezone: timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Apply dark mode changes
      document.documentElement.classList.toggle('dark', darkMode)

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
        variant: "default",
        duration: 3000,
      })
    } catch (error: any) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    
    // Validation with toasts
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError('All password fields are required')
      toast({
        title: "Validation Error",
        description: "All password fields are required",
        variant: "destructive",
      })
      return
    }
    
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match')
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwords.new.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwords.new 
      })

      if (error) throw error

      // Clear password fields
      setPasswords({
        current: '',
        new: '',
        confirm: '',
      })

      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      })
    } catch (error: any) {
      console.error('Error updating password:', error)
      setPasswordError(error.message || 'Failed to update password')
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      {/* Account Settings Card */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Account Information</h2>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  type="text" 
                  id="full_name" 
                  value={userData.full_name}
                  onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  value={userData.email}
                  disabled
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <Label htmlFor="darkMode">Dark Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
                <Label htmlFor="notifications">Enable email notifications</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Time Zone</h2>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="timezone">Select Time Zone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {Intl.supportedValuesOf('timeZone').map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  type="password" 
                  id="currentPassword"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  type="password" 
                  id="newPassword"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  type="password" 
                  id="confirmPassword"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

