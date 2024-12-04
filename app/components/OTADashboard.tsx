'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { HotelIcon, Globe, Calendar, Activity, Clock, Settings } from 'lucide-react'
import { Skeleton } from "./ui/skeleton"
import { Progress } from "./ui/progress"
import ConnectedOTAs from './ConnectedOTAs'
import SyncHistory from './SyncHistory'
import { OTAConnection, SyncLog } from '../../types/integration'
import { formatDateTime } from '../utils/dateFormatting'
import { supabase } from '../lib/supabase'
import { useToast } from "./ui/use-toast"
import { useInterval } from '../hooks/useInterval'
import { cn } from '@/lib/utils'

const initialConnections: OTAConnection[] = [
  {
    id: '0',
    name: 'Bokinn.app',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Calendar
  },
  {
    id: '1',
    name: 'Booking.com',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '2',
    name: 'Expedia',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '3',
    name: 'Airbnb',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '4',
    name: 'Google Calendar',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Calendar
  },
  {
    id: '5',
    name: 'Agoda',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '6',
    name: 'TripAdvisor',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '7',
    name: 'Gathern',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '8',
    name: 'Trip.com',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '9',
    name: 'Hotels.com',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '10',
    name: 'Kayak.sa',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  }
]

export default function OTADashboard() {
  const [autoSync, setAutoSync] = useState(true)
  const [connections, setConnections] = useState<OTAConnection[]>(initialConnections)
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Add new states for enhanced features
  const [syncProgress, setSyncProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  // Add new state for auto sync status
  const [isAutoSyncing, setIsAutoSyncing] = useState(false)
  const SYNC_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

  // Load or create auto-sync settings
  useEffect(() => {
    const loadAutoSyncSettings = async () => {
      try {
        // Try to get existing settings
        const { data: settings, error } = await supabase
          .from('settings')
          .select('*')
          .single()

        if (error) {
          if (error.code === 'PGRST116') { // No rows returned
            // Create initial settings if none exist
            const { error: insertError } = await supabase
              .from('settings')
              .insert([
                {
                  auto_sync: false,
                  last_sync_time: null
                }
              ])
            
            if (insertError) throw insertError
            setAutoSync(false)
          } else {
            throw error
          }
        } else if (settings) {
          setAutoSync(settings.auto_sync)
        }
      } catch (error) {
        console.error('Error loading auto-sync settings:', error)
        toast({
          title: "Error",
          description: "Failed to load auto-sync settings",
          variant: "destructive",
        })
      }
    }

    loadAutoSyncSettings()
  }, [])

  // Update handleAutoSyncChange to properly update Supabase
  const handleAutoSyncChange = async (newValue: boolean) => {
    try {
      // Get the current settings ID first
      const { data: currentSettings, error: fetchError } = await supabase
        .from('settings')
        .select('id')
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // No rows returned
          // Create initial settings if none exist
          const { error: insertError } = await supabase
            .from('settings')
            .insert([
              {
                auto_sync: newValue,
                last_sync_time: null
              }
            ])
          
          if (insertError) throw insertError
        } else {
          throw fetchError
        }
      } else if (currentSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('settings')
          .update({
            auto_sync: newValue
          })
          .eq('id', currentSettings.id)

        if (updateError) throw updateError
      }

      // Update local state only after successful database update
      setAutoSync(newValue)
      
      toast({
        title: newValue ? "Auto-Sync Enabled" : "Auto-Sync Disabled",
        description: newValue 
          ? "Channels will be synced automatically every 5 minutes" 
          : "Automatic synchronization has been disabled",
      })

      // If auto-sync is enabled, trigger initial sync
      if (newValue) {
        syncAllChannels()
      }

    } catch (error) {
      console.error('Error saving auto-sync settings:', error)
      toast({
        title: "Error",
        description: "Failed to update auto-sync settings",
        variant: "destructive",
      })
      // Revert the switch state if there was an error
      setAutoSync(!newValue)
    }
  }

  // Update last sync time in Supabase
  const updateLastSyncTime = async () => {
    try {
      // Get the current settings ID first
      const { data: currentSettings, error: fetchError } = await supabase
        .from('settings')
        .select('id')
        .single()

      if (fetchError) throw fetchError

      const currentTime = new Date().toISOString()
      const { error: updateError } = await supabase
        .from('settings')
        .update({
          last_sync_time: currentTime,
          updated_at: currentTime
        })
        .eq('id', currentSettings.id)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Error updating last sync time:', error)
    }
  }

  const fetchConnectionStatus = async () => {
    try {
      // Get all connections including Agoda
      const { data: channelData, error } = await supabase
        .from('channel_connections')
        .select('channel_id, channel_name, status, last_sync')
        .order('last_sync', { ascending: false })

      if (error) throw error

      // Get room count for Bokinn
      const { data: roomCount, error: roomError } = await supabase
        .from('rooms')
        .select('id')
        
      if (roomError) throw roomError

      // Get property counts for all channels including Agoda
      const { data: countData, error: countError } = await supabase
        .from('channel_connections')
        .select('channel_id')
        .eq('status', 'connected')

      if (countError) throw countError

      // Create a count map
      const propertyCountMap = countData?.reduce((acc, curr) => {
        acc[curr.channel_id] = (acc[curr.channel_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Add Bokinn room count
      propertyCountMap['0'] = roomCount?.length || 0

      // Get the latest sync for each channel
      const channelLastSync = channelData?.reduce((acc, curr) => {
        if (!acc[curr.channel_id] || new Date(curr.last_sync) > new Date(acc[curr.channel_id])) {
          acc[curr.channel_id] = curr.last_sync
        }
        return acc
      }, {} as Record<string, string>)

      // Process the data to update connections
      const updatedConnections = initialConnections.map(conn => {
        const hasConnections = (propertyCountMap[conn.id] || 0) > 0
        return {
          ...conn,
          status: hasConnections ? 'connected' : 'disconnected',
          lastSync: channelLastSync[conn.id] || null,
          propertyCount: propertyCountMap[conn.id] || 0
        }
      })

      setConnections(updatedConnections as OTAConnection[])
    } catch (error) {
      console.error('Error fetching connection status:', error)
      toast({
        title: "Error",
        description: "Failed to fetch connection status",
        variant: "destructive",
      })
    }
  }

  const fetchSyncLogs = async () => {
    try {
      const { data: logs, error } = await supabase
        .from('sync_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10)

      if (error) throw error

      setSyncLogs(logs?.map(log => ({
        id: log.id,
        channel: log.channel_name,
        timestamp: log.timestamp,
        status: log.status,
        details: log.details
      })) || [])
    } catch (error) {
      console.error('Error fetching sync logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchConnectionStatus(),
        fetchSyncLogs()
      ])
    }
    fetchData()
  }, [])

  const handleConnectionUpdate = async (updatedConnections: OTAConnection[]) => {
    setConnections(updatedConnections)
    fetchSyncLogs() // Refresh sync logs after connection update
  }

  // Computed values
  const connectedChannels = connections.filter(c => c.status === 'connected').length
  const totalProperties = connections.reduce((sum, c) => sum + c.propertyCount, 0)

  // Safe date formatting
  const lastSync = syncLogs[0]?.timestamp
  const formattedLastSync = lastSync ? formatDateTime(lastSync) : 'Never'
  const [dateStr = '', timeStr = ''] = formattedLastSync === 'Never' 
    ? ['Never', ''] 
    : (formattedLastSync?.split(',') || ['', ''])

  // New function to handle manual sync
  const handleManualSync = async () => {
    setIsSyncing(true)
    setSyncProgress(0)
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 500)

      await Promise.all([
        fetchConnectionStatus(),
        fetchSyncLogs()
      ])

      toast({
        title: "Sync Complete",
        description: "All channels have been synchronized successfully",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "There was an error during synchronization",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  // Function to perform sync for all connected channels
  const syncAllChannels = async () => {
    if (!autoSync || isAutoSyncing) return
    
    setIsAutoSyncing(true)
    setSyncProgress(0)
    
    try {
      const connectedChannels = connections.filter(c => c.status === 'connected')
      const totalChannels = connectedChannels.length
      let currentProgress = 0

      for (const channel of connectedChannels) {
        try {
          // Log sync start
          const { error: logError } = await supabase
            .from('sync_logs')
            .insert([
              {
                channel_id: channel.id,
                channel_name: channel.name,
                timestamp: new Date().toISOString(),
                status: 'success',
                details: `Auto-sync started for ${channel.name}`
              }
            ])

          if (logError) throw logError

          // Update progress
          currentProgress++
          setSyncProgress((currentProgress / totalChannels) * 100)

        } catch (error) {
          console.error(`Error syncing ${channel.name}:`, error)
          // Log sync error
          await supabase
            .from('sync_logs')
            .insert([
              {
                channel_id: channel.id,
                channel_name: channel.name,
                timestamp: new Date().toISOString(),
                status: 'error',
                details: `Auto-sync failed for ${channel.name}: ${error.message}`
              }
            ])
        }
      }

      // Refresh data after sync
      await Promise.all([
        fetchConnectionStatus(),
        fetchSyncLogs()
      ])

      toast({
        title: "Auto-Sync Complete",
        description: `Successfully synced ${totalChannels} channels`,
      })
    } catch (error) {
      console.error('Error in auto-sync:', error)
      toast({
        title: "Auto-Sync Failed",
        description: "There was an error during synchronization",
        variant: "destructive",
      })
    } finally {
      setIsAutoSyncing(false)
      setSyncProgress(0)
    }
  }

  // Use custom interval hook for auto-sync
  useInterval(
    syncAllChannels,
    autoSync ? SYNC_INTERVAL : null // Only run when autoSync is enabled
  )

  // Add effect to start initial sync
  useEffect(() => {
    if (autoSync) {
      syncAllChannels()
    }
  }, [autoSync]) // Run when autoSync changes

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-4 w-[120px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(isSyncing || isAutoSyncing) && (
        <div className="mb-4">
          <Progress value={syncProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {isAutoSyncing ? 'Auto-syncing channels...' : 'Synchronizing channels...'}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Channels</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedChannels}</div>
            <p className="text-xs text-muted-foreground">
              {totalProperties} properties synchronized
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeStr || 'Never'}</div>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
          </CardContent>
        </Card>

        <Card className={cn(
          "hover:shadow-lg transition-shadow",
          !autoSync && "border-orange-500"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Sync</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={handleAutoSyncChange}
              />
              <Label htmlFor="auto-sync" className="text-sm">
                {autoSync ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            {!autoSync && (
              <p className="text-xs text-orange-500 mt-2">
                Auto-sync is disabled. Enable to sync every 5 minutes.
              </p>
            )}
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleManualSync}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manual Sync</CardTitle>
            <div className={`h-4 w-4 rounded-full ${isSyncing ? 'animate-pulse bg-blue-500' : 'bg-green-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {isSyncing ? 'Syncing...' : 'Click to sync'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="channels">Connected Channels</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>
        <TabsContent value="channels">
          <ConnectedOTAs 
            connections={connections} 
            onConnectionUpdate={handleConnectionUpdate}
          />
        </TabsContent>
        <TabsContent value="history">
          <SyncHistory logs={syncLogs} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

