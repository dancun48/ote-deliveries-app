import React from "react";
import ScrollAnimation from "../components/SrollAnimation";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();
  
  return (
    <div className="py-8 md:py-14 bg-gray-100 min-h-[50vh] md:min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 lg:p-12 max-w-2xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-4 md:mb-6">
                OTE Blog
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">
                Insights, news, and updates from the world of logistics and delivery
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                  <div className="text-center sm:text-left">
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-2">
                      Exciting content coming soon!
                    </p>
                    <p className="text-sm md:text-base text-gray-600">
                      We're working on valuable content to help you optimize your delivery needs.
                    </p>
                  </div>
                  <button 
                    onClick={() => { navigate('/'); window.scrollTo(0, 0) }} 
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gold text-black rounded-lg font-semibold text-sm sm:text-base hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap flex-shrink-0 shadow-md hover:shadow-lg"
                  >
                    Come Back Later
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left">
                <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                  <h3 className="font-semibold text-gold mb-3 text-lg">What to Expect</h3>
                  <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                    <li className="flex items-start">
                      <span className="text-gold mr-2 mt-1">•</span>
                      <span>Industry insights and trends</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2 mt-1">•</span>
                      <span>Delivery optimization tips</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2 mt-1">•</span>
                      <span>Company updates and news</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                  <h3 className="font-semibold text-gold mb-3 text-lg">Stay Updated</h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3">
                    Subscribe to our newsletter to get notified when we publish new content.
                  </p>
                  <div className="flex md:flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent transition duration-300"
                    />
                    <button className="bg-gold text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-600 transition-colors duration-300 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional CTA Button */}
              <div className="mt-6 md:mt-8 text-center">
                <button 
                  onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }} 
                  className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Contact Us for Updates
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Blog;