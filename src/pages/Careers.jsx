import React from "react";
import ScrollAnimation from "../components/SrollAnimation";
import { useNavigate } from "react-router-dom";

const Careers = () => {
  const navigate = useNavigate();
  
  return (
    <div className="py-8 md:py-14 bg-gray-100 min-h-[50vh] md:min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 lg:p-12 max-w-2xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-4 md:mb-6">
                Careers at OTE
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">
                Join our team and be part of revolutionizing delivery services in Kenya
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 text-center sm:text-left">
                    There are no open positions currently.
                  </p>
                  <button 
                    onClick={() => { navigate('/'); window.scrollTo(0, 0) }} 
                    className="px-4 sm:px-6 py-2 sm:py-3 border rounded-lg bg-gold text-white text-sm sm:text-base md:text-lg hover:bg-gold/60 transition-all duration-500 whitespace-nowrap flex-shrink-0"
                  >
                    Come back later
                  </button>
                </div>
              </div>

              <div className="text-left bg-gray-50 rounded-lg p-4 md:p-6">
                <h3 className="font-semibold text-gold mb-3 md:mb-4 text-lg md:text-xl">
                  Why Work With Us?
                </h3>
                <ul className="space-y-2 md:space-y-3 text-gray-600 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-gold mr-2 mt-1">•</span>
                    <span>Competitive salaries and benefits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2 mt-1">•</span>
                    <span>Opportunities for growth and development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2 mt-1">•</span>
                    <span>Inclusive and supportive work environment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2 mt-1">•</span>
                    <span>Make a real impact in your community</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 md:mt-8 text-center">
                <p className="text-gray-500 text-sm md:text-base mb-4">
                  Interested in future opportunities?
                </p>
                <button 
                  onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }} 
                  className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition-colors duration-300"
                >
                  Send Us Your CV
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Careers;