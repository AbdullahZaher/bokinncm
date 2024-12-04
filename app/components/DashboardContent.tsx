'use client'

import DashboardStats from './DashboardStats'
import BookingsClient from './BookingsClient'

const DashboardContent = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardStats />
      <div className="mt-8">
        <BookingsClient />
      </div>
    </main>
  )
}

export default DashboardContent 