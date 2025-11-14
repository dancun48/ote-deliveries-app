import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../assets/Assets";
import fb from "../assets/images/fb.png";
import ig from "../assets/images/ig.png";
import x from "../assets/images/x.png";
import tt from "../assets/images/tt.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                <img
                  src={logo}
                  alt="OTE Deliveries"
                  className="w-6 h-6 md:w-20 md:h-20 object-contain"
                />
              </div>
              <span className="text-lg md:text-xl font-bold text-gold">
                Ote Deliveries
              </span>
            </Link>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Your trusted partner for reliable and sustainable delivery
              solutions. We connect people and businesses through efficient
              logistics services.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <a href="https://www.facebook.com" target="_blank">
                <img src={fb} alt="" className="w-7 cursor-pointer" />
              </a>
              <a href="https://www.instagram.com" target="_blank">
                <img src={tt} alt="" className="w-7 cursor-pointer" />
              </a>
              <a href="https://www.tiktok.com" target="_blank">
                <img src={ig} alt="" className="w-7 cursor-pointer" />
              </a>
              <a href="https://www.x.com" target="_blank">
                <img src={x} alt="" className="w-7 cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-semibold mb-3 md:mb-4 text-base md:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-1 md:space-y-2">
              {["Home", "About", "Impact", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${
                      item.toLowerCase() === "home" ? "" : item.toLowerCase()
                    }`}
                    className="text-gray-300 hover:text-gold transition duration-300 text-sm md:text-base"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold font-semibold mb-3 md:mb-4 text-base md:text-lg">
              Our Services
            </h3>
            <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm md:text-base">
              <li
                onClick={() => {
                  navigate("/services");
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer hover:text-gold transition duration-300 md:text-base"
              >
                Parcel Delivery
              </li>
              <li
                onClick={() => {
                  navigate("/corporate-services");
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer hover:text-gold transition duration-300 md:text-base"
              >
                Corporate Services
              </li>
              <li
                onClick={() => {
                  navigate("/services");
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer hover:text-gold transition duration-300 md:text-base"
              >
                Errands
              </li>
              <li
                onClick={() => {
                  navigate("/services");
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer hover:text-gold transition duration-300 md:text-base"
              >
                Motorbike Delivery
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm space-y-2 sm:space-y-0">
          <div>
            <p>&copy; 2025 Ote Deliveries. All rights reserved.</p>
          </div>
          <div className="flex flex-row gap-3 md:gap-4">
            <a
              href="#"
              className="text-gray-300 hover:text-gold transition duration-300"
            >
              Terms & Conditions
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-gold transition duration-300"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
