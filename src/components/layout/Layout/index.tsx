import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[88px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout