import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
      badge: null
    },
    {
      name: 'Deliveries',
      path: '/deliveries',
      icon: '📦',
      badge: null
    },
    {
      name: 'Users',
      path: '/users',
      icon: '👥',
      badge: null
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: '🚗',
      badge: null
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: '📈',
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 bg-black text-white">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold">DeliveryAdmin</h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-white hover:text-gray-200 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="mb-6 lg:hidden">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-4">
              Navigation
            </h3>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                    ${location.pathname === item.path
                      ? 'bg-black text-gold border-r-4 border-gold/60'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => {
                    // Close sidebar on mobile when item is clicked
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Quick Actions - Mobile Only */}
          <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
            <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button 
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                <span>➕</span>
                <span>Add Driver</span>
              </button>
              <button 
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                <span>📊</span>
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* Mobile Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                Delivery Management System
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Admin Panel v1.0
              </p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;