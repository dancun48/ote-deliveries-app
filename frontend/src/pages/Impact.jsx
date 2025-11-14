import React from "react";
import sustainability from "../assets/images/sustainability.jpg";
import csr from "../assets/images/csr.jpg";
import innovation from "../assets/images/innovation.jpg";
import ScrollAnimation from "../components/SrollAnimation";

const Impact = () => {
  return (
    <div className="py-8 md:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4 md:mb-6">
              Our Impact
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Committed to sustainable practices, innovation, and positive community impact through responsible logistics and delivery services.
            </p>
          </div>
        </ScrollAnimation>

        {/* Sustainability Section */}
        <ScrollAnimation>
          <section className="mb-12 md:mb-16 lg:mb-20 border rounded-lg border-y-gold p-3 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center p-2 sm:p-4">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6">
                  Sustainability
                </h2>
                <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6">
                  We are dedicated to reducing our environmental footprint through innovative solutions and sustainable practices in every aspect of our operations.
                </p>
                <div className="space-y-3 md:space-y-4">
                  {[
                    "Electric and hybrid vehicle fleet implementation",
                    "Carbon offset programs for all deliveries",
                    "Optimized routing to reduce fuel consumption",
                    "Eco-friendly packaging materials",
                    "Partnerships with environmental organizations",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-gold mr-2 md:mr-3 text-lg md:text-xl mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 text-center mt-6 lg:mt-0">
                <div className="text-4xl md:text-6xl mb-4">
                  <img 
                    src={sustainability} 
                    alt="Sustainability" 
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Innovation Section */}
        <ScrollAnimation>
          <section className="mb-12 md:mb-16 lg:mb-20 border rounded-lg border-y-gold p-3 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="rounded-lg p-4 md:p-6 lg:p-8 text-center">
                  <div className="text-4xl md:text-6xl mb-4">
                    <img 
                      src={innovation} 
                      alt="Innovation" 
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6">
                  Innovation
                </h2>
                <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6">
                  We continuously invest in technology and innovative solutions to improve our services and stay ahead in the logistics industry.
                </p>
                <div className="space-y-3 md:space-y-4">
                  {[
                    "AI-powered route optimization",
                    "Real-time GPS tracking system",
                    "Automated dispatch and scheduling",
                    "Mobile app for seamless customer experience",
                    "Blockchain for secure documentation",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-gold mr-2 md:mr-3 text-lg md:text-xl mt-0.5 flex-shrink-0">⚡</span>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Community Impact Section */}
        <ScrollAnimation>
          <section className="mb-12 md:mb-16 lg:mb-20 border rounded-lg border-y-gold p-3 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6">
                  Community Impact
                </h2>
                <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6">
                  We believe in giving back to the communities we serve and creating positive social impact through our operations and partnerships.
                </p>
                <div className="space-y-3 md:space-y-4">
                  {[
                    "Job creation and local employment opportunities",
                    "Support for local small businesses",
                    "Community outreach and education programs",
                    "Disaster relief and emergency response support",
                    "Partnerships with local charities and non-profits",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-gold mr-2 md:mr-3 text-lg md:text-xl mt-0.5 flex-shrink-0">❤️</span>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg p-4 md:p-6 lg:p-8 text-center mt-6 lg:mt-0">
                <div className="text-4xl md:text-6xl mb-4">
                  <img 
                    src={csr} 
                    alt="Community Impact" 
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Impact Metrics */}
        <ScrollAnimation>
          <section className="bg-black text-white py-8 md:py-10 lg:py-12 rounded-lg">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gold mb-3 md:mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-gray-300 text-sm md:text-base">
                Measuring our progress towards a sustainable future
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-center px-4">
              {[
                { number: "30%", label: "Carbon Reduction", description: "Since 2022" },
                { number: "5+", label: "Electric Vehicles", description: "In our fleet" },
                { number: "1000+", label: "Trees Planted", description: "Annual commitment" },
                { number: "25%", label: "Fuel Efficiency", description: "Improvement" },
              ].map((metric, index) => (
                <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gold mb-1 md:mb-2">
                    {metric.number}
                  </div>
                  <div className="text-white font-semibold mb-1 text-xs sm:text-sm md:text-base">
                    {metric.label}
                  </div>
                  <div className="text-gray-400 text-xs md:text-sm">
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Impact;