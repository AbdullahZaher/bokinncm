'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useToast } from "./ui/use-toast"
import { supabase } from '../lib/supabase'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface AccessStats {
  totalAccess: number
  uniqueIPs: number
  successRate: number
  dailyStats: Array<{
    date: string
    count: number
  }>
  statusDistribution: Array<{
    status: number
    count: number
  }>
  topRooms: Array<{
    roomName: string
    accessCount: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function XmlAnalyticsDashboard() {
  const [stats, setStats] = useState<AccessStats | null>(null)
  const [timeRange, setTimeRange] = useState('7d') // '7d', '30d', '90d'
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      // Get date range
      const now = new Date()
      const days = parseInt(timeRange)
      const startDate = new Date(now.setDate(now.getDate() - days))

      // Fetch total access and unique IPs
      const { data: accessData, error: accessError } = await supabase
        .from('xml_access_logs')
        .select('*')
        .gte('accessed_at', startDate.toISOString())

      if (accessError) throw accessError

      // Calculate stats
      const uniqueIPs = new Set(accessData.map(log => log.ip_address)).size
      const successCount = accessData.filter(log => log.response_status === 200).length
      const successRate = (successCount / accessData.length) * 100

      // Get daily stats
      const dailyStats = accessData.reduce((acc: any[], log) => {
        const date = log.accessed_at.split('T')[0]
        const existing = acc.find(item => item.date === date)
        if (existing) {
          existing.count++
        } else {
          acc.push({ date, count: 1 })
        }
        return acc
      }, [])

      // Get status distribution
      const statusDistribution = accessData.reduce((acc: any[], log) => {
        const existing = acc.find(item => item.status === log.response_status)
        if (existing) {
          existing.count++
        } else {
          acc.push({ status: log.response_status, count: 1 })
        }
        return acc
      }, [])

      // Get top rooms
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id, name, xml_access_count')
        .order('xml_access_count', { ascending: false })
        .limit(5)

      if (roomError) throw roomError

      setStats({
        totalAccess: accessData.length,
        uniqueIPs,
        successRate,
        dailyStats,
        statusDistribution,
        topRooms: roomData.map(room => ({
          roomName: room.name,
          accessCount: room.xml_access_count || 0
        }))
      })
    } catch (error) {
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
  }, [timeRange])

  if (isLoading || !stats) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAccess}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.uniqueIPs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.successRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Access Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Rooms by Access</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topRooms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="roomName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accessCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 