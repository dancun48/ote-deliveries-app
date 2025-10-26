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
import Blog from './pages/Blog'
import Careers from './pages/Careers'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Fixed container width for better responsiveness */}
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
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <div className='mt-auto'>
            <Footer />
          </div>
        </div>
        <WhatsAppFloat />
      </div>
    </Router>
  )
}

export default App