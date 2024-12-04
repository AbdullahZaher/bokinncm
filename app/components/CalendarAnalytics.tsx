'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { RefreshCw, Activity, Calendar, Clock } from "lucide-react"
import { supabase } from '../lib/supabase'
import { useToast } from "./ui/use-toast"
import { cn } from "@/lib/utils"
import moment from 'moment'

interface AccessLog {
  id: string
  roomName: string
  accessedAt: string
  ipAddress: string
  userAgent: string
  source: string
  status: number
}

interface Analytics {
  totalAccess: number
  uniqueIPs: number
  successRate: number
  lastAccess: string | null
  topSources: { source: string; count: number }[]
}

export default function CalendarAnalytics() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    totalAccess: 0,
    uniqueIPs: 0,
    successRate: 0,
    lastAccess: null,
    topSources: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchData = async (showToast = false) => {
    try {
      setIsRefreshing(true)

      // جلب سجلات الوصول
      const { data: logsData, error: logsError } = await supabase
        .from('calendar_access_logs')
        .select(`
          id,
          rooms (name),
          accessed_at,
          ip_address,
          user_agent,
          source,
          status
        `)
        .order('accessed_at', { ascending: false })
        .limit(100)

      if (logsError) throw logsError

      // تحويل البيانات
      const formattedLogs = logsData.map(log => ({
        id: log.id,
        roomName: log.rooms[0]?.name,
        accessedAt: log.accessed_at,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        source: log.source,
        status: log.status
      }))

      setLogs(formattedLogs)

      // حساب التحليلات
      const uniqueIPs = new Set(logsData.map(log => log.ip_address)).size
      const successCount = logsData.filter(log => log.status === 200).length
      const sourceCounts = logsData.reduce((acc, log) => {
        acc[log.source] = (acc[log.source] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const topSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setAnalytics({
        totalAccess: logsData.length,
        uniqueIPs,
        successRate: (successCount / logsData.length) * 100,
        lastAccess: logsData[0]?.accessed_at || null,
        topSources
      })

      if (showToast) {
        toast({
          title: "Updated",
          description: "Analytics data has been refreshed",
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendar Analytics</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2",
              isRefreshing && "animate-spin"
            )} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{analytics.totalAccess}</div>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{analytics.uniqueIPs}</div>
                <p className="text-xs text-muted-foreground">Unique IPs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {analytics.lastAccess 
                    ? moment(analytics.lastAccess).fromNow()
                    : 'Never'}
                </div>
                <p className="text-xs text-muted-foreground">Last Access</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Room
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Accessed At
                    </div>
                  </TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.roomName}</TableCell>
                    <TableCell>{moment(log.accessedAt).format('LLL')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.source}</Badge>
                    </TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={log.status === 200 ? 'default' : 'destructive'}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 