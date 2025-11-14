import React from "react";
import invoice from "../assets/images/invoice.jpg";
import ddriver from "../assets/images/ddriver.jpg";
import contract from "../assets/images/contract.jpg";
import priority from "../assets/images/priority.jpg";
import arrow_right from "../assets/images/arrow_right.png";
import ScrollAnimation from "../components/SrollAnimation";
import { useNavigate } from "react-router-dom";

const CorporateServices = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Dedicated Drivers",
      short: "Your Business, Your Familiar Face",
      description: "A dedicated driver ensures reliable, personalized service by providing a consistent professional who knows your business, leading to faster and more secure deliveries.",
      features: ["Consistent & Reliable", "Enhanced Security", "Personalized Service", "Improved Efficiency"],
      icon: ddriver,
    },
    {
      title: "Flexible Contracts",
      short: "Scale On Demand",
      description: "Our flexible contracts let you easily scale delivery resources without being locked into a long-term agreement.",
      features: ["Scalable Solutions", "No Long-Term Lock-In", "Cost-Effective", "Agility"],
      icon: contract,
    },
    {
      title: "Monthly Invoicing",
      short: "Simplify Your Accounting",
      description: "Consolidate all your delivery charges into one monthly invoice to simplify your bookkeeping and financial planning.",
      features: ["Consolidated Billing", "Simplified Budgeting", "Easy Reconciliation", "Detailed Reporting"],
      icon: invoice,
    },
    {
      title: "Priority Support",
      short: "Your Success is Our Priority",
      description: "Skip the queue with direct access to a dedicated specialist for fast resolutions to keep your deliveries moving.",
      features: ["Dedicated Line", "Faster Resolutions", "Proactive Monitoring", "Strategic Partnership"],
      icon: priority,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-8 md:py-14">
      <ScrollAnimation>
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <div className="text-center py-4 md:py-6 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4 md:mb-6">
              Corporate Delivery Solutions
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your operations and elevate your customer experience with our premium corporate delivery services. We handle the logistics, so you can focus on what you do best.
            </p>
          </div>

          {/* Services Grid */}
          <div className="mx-auto px-2 sm:px-4 py-4 md:py-5">
            <h2 className="flex justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 lg:mb-10 font-semibold text-black text-center">
              Why Corporate?
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              {services.map((service, index) => (
                <div key={index}>
                  <div className="bg-white rounded-lg shadow-lg border-2 border-gold/50 overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Image Section */}
                      <div className="md:w-2/5">
                        <img
                          src={service.icon}
                          alt={service.title}
                          className="w-full h-48 md:h-full object-cover p-1"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Content Section */}
                      <div className="md:w-3/5 p-4 sm:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center mb-2 sm:mb-3">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gold rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <span className="text-black font-bold text-xs sm:text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                              {service.title}
                            </h3>
                          </div>

                          <h4 className="text-base sm:text-lg font-semibold text-gold mb-2 sm:mb-3">
                            {service.short}
                          </h4>

                          <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                            {service.description}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold text-black mb-1 sm:mb-2 text-sm sm:text-base">
                            Key Benefits:
                          </h5>
                          <ul className="space-y-1 sm:space-y-2">
                            {service.features.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center text-gray-600 text-sm sm:text-base"
                              >
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <ScrollAnimation>
            <div className="bg-gold rounded-lg text-black mt-8 md:mt-10 py-6 md:py-8 lg:py-10 px-4 sm:px-6 text-center">
              <div className="flex flex-col justify-center items-center max-w-4xl mx-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                  Ready to Optimize Your Deliveries?
                </h2>
                <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 lg:mb-8 text-white">
                  Contact our corporate team today for a custom quote and see how our tailored solutions can drive efficiency and growth for your business.
                </p>
                <button
                  onClick={() => {
                    navigate("/register");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-row gap-2 bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-500 hover:translate-x-1 hover:duration-300 items-center"
                >
                  <span>Get Started</span>
                  <img src={arrow_right} alt="" className="w-5 sm:w-6 md:w-7" />
                </button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default CorporateServices;