import React from "react";
import Hero from "../components/Hero";
import PricingAndDelivery from "../components/PricingAndDelivery";
import image2 from "../assets/images/image4.jpg";

const Home = () => {
  return (
    <div className="mt-0">
      <Hero />
      <PricingAndDelivery />
    </div>
  );
};

export default Home;
