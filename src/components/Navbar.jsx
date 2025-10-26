import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/corporate-services', label: 'Corporate' },
    { path: '/impact', label: 'Impact' },
    { path: '/careers', label: 'Careers' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium px-1 py-2 transition-all duration-300 hover:text-gold relative text-sm lg:text-base ${
                  location.pathname === item.path 
                    ? 'text-gold font-semibold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Spacer for mobile to center logo */}
          <div className="md:hidden w-6"></div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-3 px-4 font-medium transition-all duration-300 rounded-lg hover:bg-gray-800 text-center ${
                    location.pathname === item.path 
                      ? 'text-gold bg-gray-900 border-l-4 border-gold' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar