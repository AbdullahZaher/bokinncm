export interface RoomAvailability {
  id: string
  roomId: string
  date: string
  isAvailable: boolean
  rate: number
}

export interface RoomBooking {
  id: string
  room_id: string
  start_date: string
  end_date: string
  guest_name: string
  rate: number
}

export interface Room {
  id: string
  name: string
  type: string
  capacity: number
  price: number
  available: boolean
  xml_token?: string
}

export interface RoomWithXML extends Room {
  xml_token: string
} 