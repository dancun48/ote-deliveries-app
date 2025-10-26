import React from "react";
import { useNavigate } from "react-router-dom";
import rates1 from "../assets/images/rates2.png";
import map from '../assets/images/map.png';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import ElectricBoltTwoToneIcon from '@mui/icons-material/ElectricBoltTwoTone';

function PricingAndDelivery() {
  const navigate = useNavigate();

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
    <div className="min-h-screen  py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Unified Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-6xl mx-auto">
          <h2 className="text-base sm:text-lg font-semibold text-gray-400 uppercase tracking-wider mb-2">
            PRICING & DELIVERY
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-4 md:mb-6 p-2">
            Complete Delivery Solutions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-3xl mx-auto px-4">
            Transparent pricing for all your delivery needs in Kisumu
          </p>
        </div>

        <div className="max-w-screen-2xl mx-auto">
          {/* Package Delivery Section */}
          <div className="mb-12 md:mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4">
                Package Delivery Rates
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-500">
                Standard rates based on parcel weight
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-center justify-between">
              {/* Pricing Table */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-black text-white py-4 md:py-6 px-4 md:px-8 text-center">
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gold">
                      Standard Delivery Rates
                    </h4>
                    <p className="text-gray-300 mt-1 md:mt-2 text-xs md:text-sm">
                      Price ranges according to weight of parcel
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="bg-gray-900">
                          <th className="py-3 md:py-4 px-4 md:px-6 text-left text-white font-semibold text-sm md:text-lg border-r border-gray-700">
                            Weight of Parcel
                          </th>
                          <th className="py-3 md:py-4 px-4 md:px-6 text-left text-white font-semibold text-sm md:text-lg">
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
                          { weight: "Above 20 kg", price: "Additional Ksh. 30 per kg" },
                        ].map((item, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-gold bg-opacity-20" : "bg-white"
                            } hover:bg-gold hover:bg-opacity-30 transition-colors duration-200`}
                          >
                            <td className="py-3 md:py-4 px-4 md:px-6 border-b border-gray-200 font-medium text-gray-800 text-sm md:text-base">
                              {item.weight}
                            </td>
                            <td className="py-3 md:py-4 px-4 md:px-6 border-b border-gray-200 font-semibold text-gray-900 text-sm md:text-base">
                              {item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-50 py-3 md:py-4 px-4 md:px-6 border-t border-gray-200">
                    <p className="text-xs md:text-sm text-gray-600 text-center">
                      * Rates are for standard delivery within Kisumu metropolitan area
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="w-full lg:w-2/5 mt-6 lg:mt-0">
                <div className="relative">
                  <img
                    src={rates1}
                    alt="Delivery Service Rates"
                    className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-xl md:rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-20 rounded-xl md:rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Motorbike Delivery Section */}
          <div className="mb-12 md:mb-20 relative rounded-2xl md:rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
              style={{backgroundImage: `url(${map})`}}
            ></div>
            <div className="relative bg-white/95 backdrop-blur-sm py-8 md:py-12 px-4 md:px-6">
              <div className="text-center mb-8 md:mb-12">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4">
                  Motorbike Delivery Zones
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-500">
                  Fast and affordable motorbike deliveries across Kisumu
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                {zones.map((zone, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-gold overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="bg-black text-white py-4 md:py-6 px-3 md:px-4 text-center">
                      <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-gold mb-1 md:mb-2">{zone.name}</h4>
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold">{zone.price}</div>
                      <p className="text-gray-300 text-xs md:text-sm mt-1">per trip</p>
                    </div>
                    
                    <div className="p-3 md:p-4 lg:p-6">
                      <h5 className="font-semibold text-gray-500 text-xs md:text-sm uppercase tracking-wide mb-2 md:mb-4">
                        Covered Areas:
                      </h5>
                      <ul className="space-y-1 md:space-y-2">
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

              {/* Guidelines */}
              <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-200 max-w-4xl mx-auto">
                <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-4 md:mb-6 text-center">
                  Delivery Guidelines
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h5 className="font-semibold text-gold text-base md:text-lg mb-2 md:mb-4">Standard Pricing</h5>
                    <ul className="space-y-2 md:space-y-3">
                      {guidelines.slice(0, 2).map((guideline, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gold mr-2 md:mr-3 mt-0.5 md:mt-1 text-sm">•</span>
                          <span className="text-gray-700 text-sm md:text-base">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gold text-base md:text-lg mb-2 md:mb-4">Additional Charges</h5>
                    <ul className="space-y-2 md:space-y-3">
                      {guidelines.slice(2).map((guideline, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gold mr-2 md:mr-3 mt-0.5 md:mt-1 text-sm">•</span>
                          <span className="text-gray-700 text-sm md:text-base">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Features & CTA Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
            {/* Custom Quote Card */}
            <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 h-full">
              <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-4 md:mb-6 text-center">
                Custom Quote Available
              </h4>
              <ul className="space-y-2 md:space-y-3 text-gray-700 mb-4 md:mb-6">
                {[
                  "Bulk deliveries & regular clients",
                  "Special handling requirements",
                  "Urgent/express delivery options",
                  "Multiple stop deliveries"
                ].map((item, index) => (
                  <li key={index} className="flex justify-center items-center">
                    <span className="text-gold mr-2 md:mr-3 mt-0.5">•</span>
                    <span className="text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <button 
                  onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }} 
                  className="px-6 md:px-8 lg:px-10 py-2 md:py-3 lg:py-4 bg-gold text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 text-sm md:text-base"
                >
                  Get Custom Quote
                </button>
              </div>
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: <CalendarTodayTwoToneIcon/>, title: "Same-Day Delivery", desc: "Available for urgent packages" },
                { icon: <VisibilityOffTwoToneIcon />, title: "No Hidden Fees", desc: "Transparent pricing" },
                { icon: <ElectricBoltTwoToneIcon />, title: "Instant Quotes", desc: "Quick pricing through our system" }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 md:p-6 bg-white rounded-xl border border-gold shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3 text-gold">{feature.icon}</div>
                  <h5 className="font-bold text-black mb-1 md:mb-2 text-sm md:text-base">{feature.title}</h5>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingAndDelivery;