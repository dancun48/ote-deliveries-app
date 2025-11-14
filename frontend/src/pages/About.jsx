import React from "react";
import customer from "../assets/images/customer.png";
import innovate from "../assets/images/innovate.png";
import reliable from "../assets/images/reliable.png";
import independence from "../assets/images/independence.png";
import quality from "../assets/images/quality.png";
import expert from "../assets/images/expert.png";
import ScrollAnimation from "../components/SrollAnimation";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="py-8 md:py-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header Section */}
          <ScrollAnimation>
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4 md:mb-6">
                About OTE Deliveries
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                Established in 2019, OTE is one of the leading delivery and logistics companies delivering cost-effective solutions throughout the Western, Nyanza and Rift Valley Regions in Kenya.
              </p>
            </div>
          </ScrollAnimation>

          {/* Who We Are Section */}
          <ScrollAnimation>
            <div className="mb-12 md:mb-20">
              <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6">
                  WHO ARE WE?
                </h2>
                <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                  <p>
                    OTE Deliveries develops comprehensive delivery and logistics service plans tailored to meet specific requirements of customers. This is accomplished by learning customer's exact objectives with regards to their internal and external requirements, thus ensuring that OTE will provide quality services more consistently than any other service provider in the market.
                  </p>
                  <p>
                    Our tried and proven transportation and logistics methodologies and delivery approaches ensure local reach whatever your cargo and timeframe is. As the preferred supplier for various large scale to micro-sized companies and the first point of contact to increase supply chain efficiency in Western and Nyanza, we are very proud of our reputation and always strive to maintain it.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Mission & Vision */}
          <ScrollAnimation>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-20">
              <div className="bg-black text-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="text-center mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <span className="text-black font-bold text-base md:text-lg">M</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gold">Our Mission</h2>
                </div>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed text-center">
                  To offer memorable customer-centric logistic solutions and sustain our upward growth through steady investments in research, development, and innovation.
                </p>
              </div>

              <div className="bg-gray-100 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
                <div className="text-center mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <span className="text-black font-bold text-base md:text-lg">V</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">Our Vision</h2>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center">
                  To be the leading logistics and delivery service provider in Western, Nyanza, and Rift Valley regions, known for reliability, innovation, and exceptional customer service.
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {/* Why Choose OTE Section */}
          <ScrollAnimation>
            <div className="mb-12 md:mb-20">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-3 md:mb-4">
                  Why Choose OTE?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                  The preferred choice for businesses seeking reliable logistics solutions
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                      Successful delivery, logistics, handling, and related services in challenging markets like the Western, Nyanza, and Rift Valley regions require expertise, inside knowledge, and a reputation that businesses can trust.
                    </p>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      This is why <span className="font-bold text-lg md:text-xl">OTE</span> is the preferred choice of many large, medium and small companies in the region. Our in-depth knowledge of the Western, Nyanza, and Rift Valley Regions, coupled with our Inter-County service network makes OTE a leading service provider in the region.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 md:p-6 border border-gold border-opacity-30">
                    <h4 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">
                      One-Stop Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                      OTE provides a "one-stop solution" to meet all of your logistics requirements. You will get personalized service at every level with OTE because we are truly independent, make our own decisions, and specialize in our home market.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Values */}
          <ScrollAnimation>
            <div className="mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gold mb-8 md:mb-12">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {[
                  { title: "Reliability", description: "We deliver on our promises, ensuring your items reach their destination safely and on time.", icon: reliable },
                  { title: "Customer-Centric", description: "Personalized service at every level, understanding and meeting exact customer objectives.", icon: customer },
                  { title: "Expertise", description: "In-depth knowledge of Western, Nyanza, and Rift Valley regions with proven methodologies.", icon: expert },
                  { title: "Innovation", description: "Continuous improvement through research, development, and innovative solutions.", icon: innovate },
                  { title: "Quality", description: "Consistent quality services that outperform other providers in the market.", icon: quality },
                  { title: "Independence", description: "Truly independent decision-making focused on our home market specialization.", icon: independence },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center p-4 md:p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4">
                      <img src={value.icon} alt={value.title} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gold mb-3 md:mb-4 text-center">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base text-center">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Stats */}
          <ScrollAnimation>
            <div className="bg-black text-white py-8 md:py-12 lg:py-16 rounded-xl md:rounded-2xl shadow-xl">
              <div className="text-center mb-8 md:mb-12">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-3 md:mb-4">
                  Our Impact
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                  Delivering excellence across Western, Nyanza, and Rift Valley regions since 2019
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-center">
                {[
                  { number: "20K+", label: "Deliveries Completed" },
                  { number: "97%", label: "On-Time Rate" },
                  { number: "50+", label: "Towns Covered" },
                  { number: "3", label: "Regions Served" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-1 md:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Final CTA */}
          <ScrollAnimation>
            <div className="text-center mt-12 md:mt-16">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">
                Ready to Experience Reliable Delivery Services?
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Join the many businesses and individuals who trust OTE for their delivery needs across Western Kenya.
              </p>
              <button 
                onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }} 
                className="bg-gold text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-yellow-600 transition-colors duration-300"
              >
                Get Started Today
              </button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default About;