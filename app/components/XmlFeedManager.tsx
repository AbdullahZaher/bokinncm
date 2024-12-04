'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Link2, 
  Calendar,
  Share2,
  Activity,
  History,
  BarChart3,
  Search,
  Filter
} from "lucide-react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { supabase } from '../lib/supabase'
import { useToast } from "./ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Skeleton } from "./ui/skeleton"
import { cn } from "@/lib/utils"
import XmlAccessLogs from './XmlAccessLogs'
import XmlAnalyticsDashboard from './XmlAnalyticsDashboard'

interface XmlFeed {
  roomId: string
  roomName: string
  lastAccessed: string | null
  accessCount: number
  token: string
  status: 'active' | 'inactive'
  distributionLink: string | null
  hasBookingUrl: boolean
  hasCalendarUrl: boolean
}

export default function XmlFeedManager() {
  const [feeds, setFeeds] = useState<XmlFeed[]>([])
  const [filteredFeeds, setFilteredFeeds] = useState<XmlFeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toast } = useToast()

  const fetchFeeds = async (showToast = false) => {
    try {
      setIsRefreshing(true)
      
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          name,
          xml_token,
          calendar_url,
          bookingdotcom_xml_url,
          distribution_link,
          xml_last_accessed,
          xml_access_count
        `)
        .order('name')

      if (roomsError) throw roomsError

      const formattedFeeds = roomsData.map(room => ({
        roomId: room.id,
        roomName: room.name,
        lastAccessed: room.xml_last_accessed,
        accessCount: room.xml_access_count || 0,
        token: room.xml_token || '',
        status: room.calendar_url || room.bookingdotcom_xml_url ? 'active' : 'inactive',
        distributionLink: room.distribution_link,
        hasBookingUrl: !!room.bookingdotcom_xml_url,
        hasCalendarUrl: !!room.calendar_url
      }))

      setFeeds(formattedFeeds as XmlFeed[])

      if (showToast) {
        toast({
          title: "Updated",
          description: "Feed list has been refreshed",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch feeds",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchFeeds()
    const interval = setInterval(() => fetchFeeds(), 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const filtered = feeds.filter(feed => {
      const matchesSearch = feed.roomName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || feed.status === statusFilter
      return matchesSearch && matchesStatus
    })
    setFilteredFeeds(filtered)
  }, [feeds, searchTerm, statusFilter])

  const regenerateToken = async (roomId: string) => {
    try {
      const newToken = Array.from(crypto.getRandomValues(new Uint8Array(25)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      const { error } = await supabase
        .from('rooms')
        .update({ 
          xml_token: newToken,
          xml_access_count: 0,
          xml_last_accessed: null
        })
        .eq('id', roomId)

      if (error) throw error

      toast({
        title: "Success",
        description: "XML token regenerated successfully",
      })
      fetchFeeds()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate token",
        variant: "destructive",
      })
    }
  }

  const copyDistributionLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Copied",
      description: "Distribution link copied to clipboard",
    })
  }

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
              <p className="text-2xl font-bold">{feeds.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Feeds</p>
              <p className="text-2xl font-bold">
                {feeds.filter(f => f.status === 'active').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Access</p>
              <p className="text-2xl font-bold">
                {feeds.reduce((sum, feed) => sum + feed.accessCount, 0)}
              </p>
            </div>
            <Share2 className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="feeds" className="space-y-6">
        <TabsList className="bg-muted/50 dark:bg-muted/80">
          <TabsTrigger value="feeds" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Feeds
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Access Logs
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feeds">
          <div className="space-y-6">
            <StatsCards />
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search rooms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Calendar Sources</TableHead>
                      <TableHead>Last Accessed</TableHead>
                      <TableHead>Access Count</TableHead>
                      <TableHead>Distribution Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeeds.map((feed) => (
                      <TableRow key={feed.roomId}>
                        <TableCell className="font-medium">{feed.roomName}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={feed.status === 'active' ? 'default' : 'destructive'}
                            className="flex items-center gap-1 w-fit"
                          >
                            {feed.status === 'active' ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {feed.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant={feed.hasCalendarUrl ? "default" : "secondary"}>
                              Bokinn
                            </Badge>
                            <Badge variant={feed.hasBookingUrl ? "default" : "secondary"}>
                              Booking.com
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {feed.lastAccessed 
                            ? new Date(feed.lastAccessed).toLocaleString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>{feed.accessCount}</TableCell>
                        <TableCell>
                          {feed.distributionLink ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyDistributionLink(feed.distributionLink!)}
                              className="flex items-center gap-2"
                            >
                              <Link2 className="h-4 w-4" />
                              Copy Link
                            </Button>
                          ) : (
                            <Badge variant="outline">No Link</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => regenerateToken(feed.roomId)}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Regenerate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredFeeds.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No feeds found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <XmlAccessLogs />
        </TabsContent>

        <TabsContent value="analytics">
          <XmlAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
} 