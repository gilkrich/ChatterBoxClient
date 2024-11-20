import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='layout'>
        <nav className='nav-bar'>
         logo
        </nav>

        
       <Outlet></Outlet>
    </div>
  )
}

export default Layout
