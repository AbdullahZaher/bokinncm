'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { supabase } from '../lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface AccessLog {
  id: string
  room_id: string
  room_name: string
  accessed_at: string
  ip_address: string
  user_agent: string
  response_status: number
}

export default function XmlAccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState({
    roomId: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })
  const { toast } = useToast()

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('xml_access_logs')
        .select(`
          *,
          rooms (
            name
          )
        `)
        .order('accessed_at', { ascending: false })
        .limit(100)

      if (filter.roomId) {
        query = query.eq('room_id', filter.roomId)
      }
      if (filter.status) {
        query = query.eq('response_status', parseInt(filter.status))
      }
      if (filter.dateFrom) {
        query = query.gte('accessed_at', filter.dateFrom)
      }
      if (filter.dateTo) {
        query = query.lte('accessed_at', filter.dateTo)
      }

      const { data, error } = await query

      if (error) throw error

      setLogs(data.map(log => ({
        ...log,
        room_name: log.rooms.name
      })))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch access logs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 400 && status < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>XML Access Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Select
            value={filter.roomId}
            onValueChange={(value) => setFilter(prev => ({ ...prev, roomId: value }))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {/* Add room options dynamically */}
            </SelectContent>
          </Select>

          <Select
            value={filter.status}
            onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="200">Success (200)</SelectItem>
              <SelectItem value="401">Unauthorized (401)</SelectItem>
              <SelectItem value="429">Rate Limited (429)</SelectItem>
              <SelectItem value="500">Error (500)</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={filter.dateFrom}
            onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="w-[200px]"
          />

          <Input
            type="date"
            value={filter.dateTo}
            onChange={(e) => setFilter(prev => ({ ...prev, dateTo: e.target.value }))}
            className="w-[200px]"
          />

          <Button
            variant="outline"
            onClick={() => setFilter({ roomId: 'all', status: 'all', dateFrom: '', dateTo: '' })}
          >
            Clear Filters
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>User Agent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.room_name}</TableCell>
                <TableCell>{new Date(log.accessed_at).toLocaleString()}</TableCell>
                <TableCell>{log.ip_address}</TableCell>
                <TableCell className="max-w-xs truncate" title={log.user_agent}>
                  {log.user_agent}
                </TableCell>
                <TableCell className={getStatusColor(log.response_status)}>
                  {log.response_status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 