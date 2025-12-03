// App.jsx - Make sure routes are correct
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Impact from './pages/Impact'
import WhatsAppFloat from './components/WhatsAppFloat'
import CorporateServices from './pages/CorporateServices'
import Careers from './pages/Careers'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/user/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import TrackDelivery from './pages/TrackDelivery'
import BookDelivery from './pages/BookDelivery'
import MyProfile from './pages/user/MyProfile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[f5f5f5] flex flex-col">
          <div className="mx-auto w-full max-w-screen-3xl flex-1 flex flex-col">
            <Header />
            <Navbar />
            <main className="pb-6 flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/corporate-services" element={<CorporateServices />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/track" element={<TrackDelivery />} />
                
                {/* Protected Routes */}
                <Route path="/my-profile" element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/book-delivery" element={
                  <ProtectedRoute>
                    <BookDelivery />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <div className='mt-auto'>
              <Footer />
            </div>
          </div>
          <WhatsAppFloat />
          <ScrollToTop />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App