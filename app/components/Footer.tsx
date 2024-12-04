export default function Footer() {
  return (
    <footer className="bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-2 md:mb-0">&copy; 2023 OTA Booking Engine. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

