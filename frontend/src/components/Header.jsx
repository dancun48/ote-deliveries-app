import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { logo } from '../assets/Assets';
import AccessTimeFilledTwoToneIcon from '@mui/icons-material/AccessTimeFilledTwoTone';
import PhoneInTalkTwoToneIcon from '@mui/icons-material/PhoneInTalkTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';

const Header = () => {
  return (
    <header className="top-0 z-50 shadow-lg bg-white">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-full flex items-center justify-center">
              <img src={logo} alt="OTE Deliveries" className='w-32 h-20 md:w-60 md:h-44 rounded-lg object-contain'/>
            </div>
          </Link>
        
        {/* Desktop Navigation */}
        <div className='hidden lg:flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-6'>
          <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6'>
            <div className='flex gap-2 items-center'>
              <span className='flex items-center justify-center w-7 h-7 border rounded-full bg-black px-4 py-4 text-gold'><AccessTimeFilledTwoToneIcon /></span>
              <span className='text-xs md:text-sm font-semibold'>Mon - Fri 8:00 AM-6:00 PM<br />Sat & Sun Emergency Only</span>
            </div>
            <div className='flex gap-2 items-center'>
              <span className='flex items-center justify-center w-7 h-7 border rounded-full bg-black px-4 py-4 text-gold'><PhoneInTalkTwoToneIcon /></span>
              <span className='text-xs md:text-sm font-semibold'>(+254) 0722 850 108</span>
            </div>
            <div className='flex gap-2 items-center'>
              <span className='flex items-center justify-center w-7 h-7 border rounded-full bg-black px-4 py-4 text-gold'><PinDropTwoToneIcon /></span>
              <span className='text-xs md:text-sm font-semibold'>Off Aga Khan Road<br />Milimani, Kisumu</span>
            </div>
          </div>
        </div>

        {/* Mobile Contact Info */}
        <div className='lg:hidden text-center'>
          <div className='flex flex-col space-y-2'>
            <span className='text-sm font-semibold'>(+254) 0722 850 108</span>
            <span className='text-xs text-gray-600'>Mon - Fri: 8AM-6PM</span>
          </div>
        </div>
        </div>
      </div>
    </header>
  )
}

export default Header