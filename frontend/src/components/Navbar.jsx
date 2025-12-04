import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/corporate-services", label: "Corporate" },
    { path: "/impact", label: "Impact" },
    { path: "/contact", label: "Contact" },
  ];

  // User-specific navigation items
  const userNavItems = [
    { path: "/my-profile", label: "My Profile" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/track", label: "Track"},
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
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
                    ? "text-gold font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold"></span>
                )}
              </Link>
            ))}
            
            {/* User Navigation (when logged in) */}
            {user && (
              <>
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium px-1 py-2 transition-all duration-300 hover:text-gold relative text-sm lg:text-base ${
                      location.pathname === item.path
                        ? "text-gold font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold"></span>
                    )}
                  </Link>
                ))}
                
                {/* Admin Navigation (only for admin users) - CHANGED TO <a> TAG */}
                {user.isAdmin && (
                  <a
                    href="https://oteadmin.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium px-1 py-2 transition-all duration-300 hover:text-red-400 relative text-sm lg:text-base flex items-center space-x-1"
                  >
                    <span>⚙️</span>
                    <span>Admin</span>
                    {/* Remove the active indicator since it's an external link */}
                  </a>
                )}
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  Welcome, {user.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs border border-gray-600 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="text-xs border border-gray-600 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="text-xs border-none bg-gold text-black px-3 py-2 rounded-lg hover:bg-white hover:text-gold transition-colors duration-300 font-medium"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Spacer for mobile to center logo */}
          <div className="md:hidden w-6"></div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-2">
              {/* Main Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-3 px-4 font-medium transition-all duration-300 rounded-lg hover:bg-gray-800 text-center ${
                    location.pathname === item.path
                      ? "text-gold bg-gray-900 border-l-4 border-gold"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* User Navigation (when logged in) */}
              {user && (
                <>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">
                      My Account
                    </div>
                    {userNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`py-3 px-4 font-medium transition-all duration-300 rounded-lg hover:bg-gray-800 text-center flex items-center justify-center space-x-2 ${
                          location.pathname === item.path
                            ? "text-gold bg-gray-900 border-l-4 border-gold"
                            : "text-gray-300 hover:text-white"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Admin Navigation (only for admin users) - CHANGED TO <a> TAG */}
                  {user.isAdmin && (
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">
                        Administration
                      </div>
                      <a
                        href="http://localhost:5174"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 font-medium transition-all duration-300 rounded-lg hover:bg-gray-800 text-center flex items-center justify-center space-x-2 text-gray-300 hover:text-red-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>⚙️</span>
                        <span>Admin Panel</span>
                      </a>
                    </div>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="py-3 px-4 font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-800 text-center border-t border-gray-700 mt-2"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Login/Register (when not logged in) */}
              {!user && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                  <button
                    onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                    className="py-3 px-4 font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-800 text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/register"); setIsMenuOpen(false); }}
                    className="py-3 px-4 font-medium bg-gold text-black rounded-lg hover:bg-white transition-colors duration-300 text-center"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;