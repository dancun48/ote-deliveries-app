import React from "react";
import map from '../assets/images/map1.png'

function Routes() {
  const zones = [
    {
      name: "ZONE 1",
      price: "KES 200",
      areas: [
        "Town CBD", "Mage City", "Millmani", "Kibuye", "Arina", 
        "Patel flats", "Mosque", "Tom Mboya", "Mountain View",
        "Wyalenda", "Oboie RD", "Mamboleo"
      ]
    },
    {
      name: "ZONE 2",
      price: "KES 350", 
      areas: [
        "Ahero", "Rabuor", "Alendu", "Kisian", "Maseno",
        "Majengo", "Kiboswa", "Gambogi", "Chiga"
      ]
    },
    {
      name: "ZONE 3", 
      price: "KES 400",
      areas: ["Holo", "Luanda", "Mbale", "Chavakali", "Kombewa"]
    },
    {
      name: "ZONE 4",
      price: "KES 500",
      areas: [
        "Katito", "Kombewa", "Muk husalaba", "Sagam", "Lvak",
        "Mahoroni", "Kabujol", "Sabatia"
      ]
    }
  ];

  const guidelines = [
    "All prices are inclusive of 16% VAT",
    "Base charges for three (3) boxes per chemist/destination within a radius of 10KM in Kisumu",
    "Boxes above the base of three (3), i.e., four (4), we shall revert to charging at KES 60.00 per box",
    "Boxes below the base of three (3), i.e., one (1) or two (2), outside the 10KM radius of Kisumu, the above rates shall apply"
  ];

  return (
    <div className="min-h-[600px] bg-white mt-0 py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-no-repeat bg-center"
        style={{backgroundImage: `url(${map})` } }>
      {/* Header Section */}
      <div className="flex flex-col justify-center text-center mb-12 md:mb-16 max-w-4xl mx-auto">
        <h2 className="text-base sm:text-lg font-semibold text-black bg-white/80 uppercase tracking-wider mb-2 py-1 px-2">
          MOTORBIKE DELIVERY
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4 md:mb-6 bg-black/80 py-2 px-4">
          Low-Capacity Vessel Pricing
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-black bg-white/80 font-semibold py-2 px-4 rounded">
          Competitive rates for motorbike deliveries across Kisumu and surrounding areas
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {zones.map((zone, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-gold overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Zone Header */}
              <div className="bg-black text-white py-4 md:py-6 px-3 md:px-4 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gold mb-1 md:mb-2">{zone.name}</h3>
                <div className="text-2xl md:text-3xl font-bold">{zone.price}</div>
                <p className="text-gray-300 text-xs md:text-sm mt-1">per trip</p>
              </div>
              
              {/* Areas List */}
              <div className="p-3 md:p-4 lg:p-6">
                <h4 className="font-semibold text-gray-500 text-xs md:text-sm uppercase tracking-wide mb-3 md:mb-4">
                  Covered Areas:
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {zone.areas.map((area, areaIndex) => (
                    <li 
                      key={areaIndex}
                      className="flex items-center text-gray-700 text-xs md:text-sm"
                    >
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gold rounded-full mr-2 md:mr-3 flex-shrink-0"></span>
                      <span className="break-words">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-200">
          <h3 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6 text-center">
            Pricing Guidelines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h4 className="font-semibold text-gold text-base md:text-lg mb-3 md:mb-4">Standard Pricing</h4>
              <ul className="space-y-2 md:space-y-3">
                {guidelines.slice(0, 2).map((guideline, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gold mr-2 md:mr-3 mt-1 text-sm">•</span>
                    <span className="text-gray-700 text-sm md:text-base">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gold text-base md:text-lg mb-3 md:mb-4">Additional Charges</h4>
              <ul className="space-y-2 md:space-y-3">
                {guidelines.slice(2).map((guideline, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gold mr-2 md:mr-3 mt-1 text-sm">•</span>
                    <span className="text-gray-700 text-sm md:text-base">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary Card */}
          <div className="mt-6 md:mt-8 bg-gold bg-opacity-10 border border-gold rounded-xl p-4 md:p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-gold rounded-full flex items-center justify-center mr-3 md:mr-4 mt-1">
                <span className="text-black font-bold text-xs md:text-sm">i</span>
              </div>
              <div>
                <h5 className="font-bold text-black mb-1 md:mb-2 text-base md:text-lg">Important Note</h5>
                <p className="text-gray-700 text-sm md:text-base">
                  All prices are based on standard deliveries within the specified zones. 
                  Contact us for custom quotes for special requirements or bulk deliveries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <button className="bg-gold text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-base hover:bg-yellow-600 transition-colors duration-300">
            Book Motorbike Delivery
          </button>
          <button className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-800 transition-colors duration-300">
            Contact for Quote
          </button>
        </div>
      </div>
    </div>
  );
}

export default Routes;