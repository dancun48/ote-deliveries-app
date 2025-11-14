import React, { useState } from 'react'

const ServiceForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    service: '',
    phoneNumber: '',
    pickupCity: '',
    dropoffCity: '',
    description: ''
  })

  const services = [
    'Personal Deliveries',
    'Errand Services',
    'Corporate Services',
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your request! We will contact you shortly with a quote.')
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      service: '',
      phoneNumber: '',
      pickupCity: '',
      dropoffCity: '',
      description: ''
    })
  }

  return (
    <div className="max-w-4xl mx-auto bg-white/80 border-gold rounded-lg shadow-xl p-4 sm:p-6 md:p-8 border">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-black mb-2">Request a Quote</h2>
      <p className="text-gray-600 text-center text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">Fill out the form below and we'll get back to you with a quote</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300 text-sm sm:text-base"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300 text-sm sm:text-base"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Select a Service *
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300 text-sm sm:text-base"
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300 text-sm sm:text-base"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="pickupCity" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Pickup City/Town *
            </label>
            <input
              type="text"
              id="pickupCity"
              name="pickupCity"
              value={formData.pickupCity}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300 text-sm sm:text-base"
              placeholder="Enter pickup location"
            />
          </div>
          
          <div>
            <label htmlFor="dropoffCity" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Drop-off City/Town *
            </label>
            <input
              type="text"
              id="dropoffCity"
              name="dropoffCity"
              value={formData.dropoffCity}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300 text-sm sm:text-base"
              placeholder="Enter drop-off location"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Describe Delivery Item *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300 text-sm sm:text-base"
            placeholder="Please describe the item(s) to be delivered, including any special requirements"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gold text-black py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
        >
          Request Quote
        </button>
      </form>
    </div>
  )
}

export default ServiceForm