import React from "react";
import rates1 from "../assets/images/rates2.png";
import { useNavigate } from "react-router-dom";

function Rates() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">
          DELIVERY RATES
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
          Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Clear, competitive rates for all your delivery needs in Kisumu
        </p>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between mb-16">
          {/* Pricing Table */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-black text-white py-6 px-8 text-center">
                <h3 className="text-2xl font-bold text-gold">
                  Standard Delivery Rates
                </h3>
                <p className="text-gray-300 mt-2">
                  Price ranges according to weight of parcel
                </p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="py-4 px-6 text-left text-white font-semibold text-lg border-r border-gray-700">
                      Weight of Parcel
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold text-lg">
                      Price (Ksh)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { weight: "0 - 5 kg", price: "200" },
                    { weight: "6 - 10 kg", price: "290" },
                    { weight: "11 - 15 kg", price: "375" },
                    { weight: "16 - 20 kg", price: "525" },
                    { weight: "Above 20 kg", price: "Additional 30 per kg" },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gold bg-opacity-20" : "bg-white"
                      } hover:bg-gold hover:bg-opacity-30 transition-colors duration-200`}
                    >
                      <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800">
                        {item.weight}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200 font-semibold text-gray-900">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  * Rates are for standard delivery within Kisumu metropolitan
                  area
                </p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-2/5">
            <div className="relative">
              <img
                src={rates1}
                alt="Delivery Service Rates"
                className="w-full h-80 lg:h-[370px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-20 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Custom Quote and Note Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch justify-center mb-16">
          {/* Custom Quote Card */}
          <div className="w-full lg:w-2/5">
            <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-xl p-6 h-full shadow-md">
              <h4 className="text-xl font-bold text-black mb-4">
                Custom Quote Available
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Bulk deliveries & regular clients</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Special handling requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Urgent/express delivery options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Multiple stop deliveries</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Note Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-black rounded-2xl p-6 lg:p-8 text-center h-full flex flex-col justify-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold rounded-full mb-4 mx-auto">
                <span className="text-black font-bold text-lg">!</span>
              </div>
              <p className="text-lg md:text-xl font-semibold text-white leading-relaxed mb-6">
                <span className="text-gold">Note:</span> We always discuss rates
                with clients for specific assignments depending on weight,
                frequency (number of deliveries), and distance. Contact us for a
                personalized quote.
              </p>
              <button onClick={()=>{navigate('/contact'); scrollTo(0,0)}} className="mt-auto bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 w-full sm:w-auto">
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>

        {/* Additional Pricing Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="text-2xl mb-3">🚚</div>
            <h4 className="font-bold text-black mb-2">Same-Day Delivery</h4>
            <p className="text-gray-600 text-sm">
              Available for urgent packages within Kisumu
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="text-2xl mb-3">💰</div>
            <h4 className="font-bold text-black mb-2">No Hidden Fees</h4>
            <p className="text-gray-600 text-sm">
              Transparent pricing with no surprise charges
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="text-2xl mb-3">⚡</div>
            <h4 className="font-bold text-black mb-2">Instant Quotes</h4>
            <p className="text-gray-600 text-sm">
              Get pricing instantly through our booking system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rates;