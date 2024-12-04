'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { supabase } from "../lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useToast } from "./ui/use-toast"

interface RevenueData {
  name: string
  total: number
}

interface BookingStats {
  totalBookings: number
  totalRevenue: number
  averageRate: number
  occupancyRate: number
}

export default function AnalyticsClient() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRate: 0,
    occupancyRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchAnalytics = async () => {
    try {
      // Fetch monthly revenue data
      const currentYear = new Date().getFullYear()
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('reservations')
        .select('check_in, price')
        .gte('check_in', `${currentYear}-01-01`)
        .lte('check_in', `${currentYear}-12-31`)
        .neq('status', 'cancelled')

      if (monthlyError) throw monthlyError

      // Process monthly revenue
      const monthlyRevenue = Array(12).fill(0)
      monthlyData?.forEach(booking => {
        const month = new Date(booking.check_in).getMonth()
        monthlyRevenue[month] += booking.price || 0
      })

      const formattedRevenueData = monthlyRevenue.map((total, index) => ({
        name: new Date(2024, index).toLocaleString('default', { month: 'short' }),
        total
      }))

      setRevenueData(formattedRevenueData)

      // Calculate booking statistics
      const { data: statsData, error: statsError } = await supabase
        .from('reservations')
        .select('price, check_in, check_out')
        .neq('status', 'cancelled')

      if (statsError) throw statsError

      const totalBookings = statsData?.length || 0
      const totalRevenue = statsData?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0
      const averageRate = totalBookings > 0 ? totalRevenue / totalBookings : 0

      // Calculate occupancy rate
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('id')
        .eq('available', true)

      const totalRooms = roomsData?.length || 0
      const totalDays = 365
      const totalPossibleNights = totalRooms * totalDays

      const bookedNights = statsData?.reduce((sum, booking) => {
        const start = new Date(booking.check_in)
        const end = new Date(booking.check_out)
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        return sum + nights
      }, 0) || 0

      const occupancyRate = totalPossibleNights > 0 
        ? (bookedNights / totalPossibleNights) * 100 
        : 0

      setBookingStats({
        totalBookings,
        totalRevenue,
        averageRate,
        occupancyRate
      })

    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${bookingStats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${bookingStats.averageRate.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingStats.occupancyRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar 
                dataKey="total" 
                fill="#F3C321" 
                radius={[4, 4, 0, 0]} 
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  )
}

