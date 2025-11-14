import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ServiceForm from "../components/ServiceForm";
import DirectionsBikeTwoToneIcon from "@mui/icons-material/DirectionsBikeTwoTone";
import CorporateFareTwoToneIcon from "@mui/icons-material/CorporateFareTwoTone";
import AllInboxTwoToneIcon from "@mui/icons-material/AllInboxTwoTone";
import ScrollAnimation from "../components/SrollAnimation";
import image2 from "../assets/images/image4.jpg";
import DispatchInfo from "../components/DispatchInfo";


const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Personal Deliveries",
      description: "Small packages, errands, food, gifts, and parcels within Kisumu. Perfect for your everyday needs and surprise deliveries.",
      features: ["Small Packages & Parcels", "Food & Grocery Delivery", "Gifts & Surprises", "Same-Day Service", "All Kisumu Areas"],
      icon: <AllInboxTwoToneIcon />,
      bgColor: "bg-white",
      textColor: "text-black",
      borderColor: "border-gold",
    },
    {
      title: "Corporate Deliveries",
      description: "Dedicated fleet and driver services for businesses. Trusted by MEDS Kisumu, Tilly Delights Cakes, and more.",
      features: ["Dedicated Fleet & Drivers", "Flexible Contracts", "Monthly Invoicing", "Priority Support", "Custom Business Solutions"],
      icon: <CorporateFareTwoToneIcon />,
      bgColor: "bg-black",
      textColor: "text-white",
      borderColor: "border-gold",
    },
    {
      title: "Errand Services",
      description: "Custom pick-up and drop-off requests tailored to your specific needs. Tell us what you need, and we'll handle it.",
      features: ["Custom Pick-ups & Drop-offs", "Personal Shopping", "Urgent Errands", "Multiple Stops", "Tailored to Your Schedule"],
      icon: <DirectionsBikeTwoToneIcon />,
      bgColor: "bg-gold",
      textColor: "text-black",
      borderColor: "border-black",
    },
  ];

  return (
    <>
      <div className="bg-white py-8 md:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <ScrollAnimation>
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4 md:mb-6">
                Our Services
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Comprehensive delivery solutions tailored to meet your specific needs. From small parcels to large shipments, we deliver with care and precision.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            {/* Services Grid */}
            <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`${service.bgColor} ${service.textColor} rounded-xl md:rounded-2xl shadow-lg border ${service.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                      {/* Icon & Title */}
                      <div className="text-center mb-4 md:mb-6">
                        <div className="text-4xl sm:text-5xl my-3 md:my-4 text-green-800">
                          {service.icon}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">
                          {service.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-6 flex-grow">
                        {service.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 sm:space-y-3 mb-6 md:mb-8 flex-grow">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full mr-2 sm:mr-3 opacity-70 flex-shrink-0"></span>
                            <span className="text-sm sm:text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Book Now Button */}
                      <Link
                        to="/booking"
                        className={`w-full py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base ${
                          service.bgColor === "bg-black"
                            ? "bg-gold text-black hover:bg-yellow-600"
                            : service.bgColor === "bg-gold"
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            {/* Process Section */}
            <div className="my-12 md:my-16 lg:my-20 px-2 sm:px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-black mb-8 md:mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {[
                  { step: "1", title: "Request Quote", description: "Fill out our simple form with your delivery details" },
                  { step: "2", title: "Get Quote", description: "Receive a competitive quote within hours" },
                  { step: "3", title: "Schedule Pickup", description: "Choose a convenient pickup time" },
                  { step: "4", title: "Track & Deliver", description: "Track your shipment and receive delivery confirmation" },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="text-center border rounded-lg shadow-lg bg-gray-100 p-4 sm:p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gold text-black rounded-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg">
                      {step.step}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <DispatchInfo />
          </ScrollAnimation>
          <ScrollAnimation>
            {/* Bottom CTA */}
            <div className="text-center mt-12 md:mt-16 px-4 sm:px-6">
              <div className="bg-black text-white rounded-xl md:rounded-2xl py-8 md:py-12 px-4 sm:px-6 max-w-4xl mx-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                  Not Sure Which Service You Need?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 md:mb-6">
                  Contact us and we'll help you choose the perfect solution for your delivery needs.
                </p>
                <button
                  onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }}
                  className="bg-gold text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-yellow-600 transition-colors duration-300 inline-block"
                >
                  Get In Touch
                </button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
      
      <ScrollAnimation>
        <div
        style={{ backgroundImage: `url(${image2})` }}
        className="py-10 bg-cover bg-no-repeat h-auto bg-center"
      >
        <ServiceForm />
      </div>
      </ScrollAnimation>
    </>
  );
};

export default Services;