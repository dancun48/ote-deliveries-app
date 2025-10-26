import React from "react";
import ServiceForm from "../components/ServiceForm";
import PhoneCallbackTwoToneIcon from "@mui/icons-material/PhoneCallbackTwoTone";
import AttachEmailTwoToneIcon from "@mui/icons-material/AttachEmailTwoTone";
import HomeWorkTwoToneIcon from "@mui/icons-material/HomeWorkTwoTone";
import ScrollAnimation from "../components/SrollAnimation";

const Contact = () => {
  const contactDetails = [
    {
      icon: <PhoneCallbackTwoToneIcon />,
      title: "Phone",
      content: "(+254) 0722 850 108",
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: <AttachEmailTwoToneIcon />,
      title: "Email",
      content: (
        <a
          href="mailto:sendwithote@gmail.com"
          className="text-gold underline text-sm md:text-base"
        >
          sendwithote@gmail.com
        </a>
      ),
      description: "We reply within 24 hours",
    },
    {
      icon: <HomeWorkTwoToneIcon />,
      title: "Office",
      content: "Off Aga Khan Road, B-05 Next To Kika Hotel, Milimani, Kisumu",
      description: "Visit us during business hours",
    },
  ];

  const workDays = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Emergency services only" },
  ];

  return (
    <div className="py-8 md:py-14 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4 md:mb-6">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Get in touch with our team. We're here to answer any questions and provide the best delivery solutions for your needs.
            </p>
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <div className="order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8">
                Get In Touch
              </h2>

              <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                {contactDetails.map((contact, index) => (
                  <div key={index} className="flex items-start space-x-3 md:space-x-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl md:text-2xl text-gold flex-shrink-0 mt-1">
                      {contact.icon}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-black mb-1">
                        {contact.title}
                      </h3>
                      <p className="text-gray-600 font-medium text-sm md:text-base mb-1">
                        {contact.content}
                      </p>
                      <p className="text-gray-400 text-xs md:text-sm">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Business Hours */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg md:text-xl font-semibold text-black mb-3 md:mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {workDays.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700 text-sm md:text-base">{schedule.day}</span>
                      <span className="text-gray-600 font-medium text-sm md:text-base">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Form */}
            <div className="order-1 lg:order-2">
              <ServiceForm />
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Contact;