import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { SyncLog } from '../../types/integration'
import { Calendar } from "lucide-react"
import { formatDateTime } from "../utils/dateFormatting"

interface SyncHistoryProps {
  logs: SyncLog[]
}

export default function SyncHistory({ logs }: SyncHistoryProps) {
  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <div className="font-medium">
              {log.channel === 'Bokinn.app' ? (
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {log.channel}
                </span>
              ) : (
                log.channel
              )}
            </div>
            <div className="text-sm text-muted-foreground">{log.details}</div>
          </div>
          <div className="text-right">
            <div className={`text-sm ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {log.status}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDateTime(log.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

