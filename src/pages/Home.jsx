import React from "react";
import Hero from "../components/Hero";
import ServiceForm from "../components/ServiceForm";
import DispatchInfo from "../components/DispatchInfo";
import PricingAndDelivery from "../components/PricingAndDelivery";
import image2 from "../assets/images/image4.jpg";

const Home = () => {
  return (
    <div className="mt-0">
      <Hero />
      <PricingAndDelivery />
      <DispatchInfo />
      <div
        style={{ backgroundImage: `url(${image2})` }}
        className="py-10 bg-cover bg-no-repeat h-auto bg-center"
      >
        <ServiceForm />
      </div>
    </div>
  );
};

export default Home;
