'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BarChart, CalendarDays, Settings, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface DashboardStats {
  totalBookings: number
  revenue: number
  activeRooms: number
  newCustomers: number
  bookingGrowth: number
  revenueGrowth: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    revenue: 0,
    activeRooms: 0,
    newCustomers: 0,
    bookingGrowth: 0,
    revenueGrowth: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const currentDate = new Date()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const { data: currentBookings, error: bookingsError } = await supabase
          .from('reservations')
          .select('*')
          .gte('created_at', firstDayOfMonth.toISOString())
          .lte('created_at', lastDayOfMonth.toISOString())

        if (bookingsError) throw bookingsError

        if (currentBookings && currentBookings.length > 0) {
          console.log('Sample booking:', currentBookings[0])
        }

        const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        const lastDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)

        const { data: lastMonthBookings, error: lastMonthError } = await supabase
          .from('reservations')
          .select('*')
          .gte('created_at', firstDayLastMonth.toISOString())
          .lte('created_at', lastDayLastMonth.toISOString())

        if (lastMonthError) throw lastMonthError

        const currentRevenue = currentBookings?.reduce((sum, booking) => {
          const bookingAmount = booking.amount || booking.total || booking.rate || 0
          return sum + bookingAmount
        }, 0) || 0

        const lastMonthRevenue = lastMonthBookings?.reduce((sum, booking) => {
          const bookingAmount = booking.amount || booking.total || booking.rate || 0
          return sum + bookingAmount
        }, 0) || 0

        const bookingGrowth = lastMonthBookings?.length > 0 
          ? ((currentBookings?.length || 0) - lastMonthBookings.length) / lastMonthBookings.length * 100
          : 0

        const revenueGrowth = lastMonthRevenue > 0
          ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0

        const { count: activeRooms, error: roomsError } = await supabase
          .from('rooms')
          .select('*', { count: 'exact', head: true })

        if (roomsError) throw roomsError

        const weekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))
        const { count: newCustomers, error: customersError } = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo.toISOString())

        if (customersError) throw customersError

        setStats({
          totalBookings: currentBookings?.length || 0,
          revenue: currentRevenue,
          activeRooms: activeRooms || 0,
          newCustomers: newCustomers || 0,
          bookingGrowth,
          revenueGrowth
        })

      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        console.log('Full error:', JSON.stringify(error, null, 2))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <CalendarDays className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            {stats.bookingGrowth >= 0 ? '+' : ''}{stats.bookingGrowth.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <BarChart className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rooms</CardTitle>
          <Settings className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeRooms}</div>
          <p className="text-xs text-muted-foreground">Active properties</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newCustomers}</div>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
} 