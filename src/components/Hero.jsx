import React from "react";
import { Link } from "react-router-dom";
import hero_video from "../assets/videos/video1.mp4";
import BackgroundVideo from "./BackgroundVideo";
import ScrollAnimation from '../components/SrollAnimation';

const Hero = () => {
  return (
    <div className="flex items-center justify-center mt-0 pt-0"> {/* Remove top margin and padding */}
      <BackgroundVideo videoSrc={hero_video} className="flex flex-col items-center justify-center text-center w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScrollAnimation>
          <div className="flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Heading Section */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-white text-4xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6">
                Fast, Reliable
                <br /> & Secure
                <span className="text-gold block mt-2 md:mt-4">Delivery</span>
              </h1>
            </div>
            
            {/* Description Section */}
            <div className="mb-8 md:mb-12 max-w-3xl">
              <p className="text-xl md:text-2xl lg:text-3xl text-white font-semibold leading-relaxed">
                Delivery solutions for all your needs in Kisumu and beyond. From
                small parcels to full truckloads, we've got you covered.
              </p>
            </div>

            {/* Buttons Section */}
            <div className="font-semibold flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link
                to="/services-form"
                className="text-white btn-primary border-2 border-white px-8 py-4 rounded-lg bg-black hover:bg-white hover:text-black transition-all duration-300 text-lg md:text-xl w-full sm:w-auto text-center"
              >
                Book a Delivery
              </Link>
              <Link
                to="/corporate-services"
                className="text-gold btn-secondary border-2 border-gold px-8 py-4 rounded-lg bg-black hover:bg-gold hover:text-black transition-all duration-300 text-lg md:text-xl w-full sm:w-auto text-center"
              >
                Corporate Services
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </BackgroundVideo>
    </div>
  );
};

export default Hero;