import React from 'react';
import './WhatsAppFloat.css';
import whatsapp from '../assets/images/whatsapp.png'

const WhatsAppFloat = () => {
  const phoneNumber = '+254722850108';
  const message = 'Request for delivery services!';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="whatsapp-float">
    <span className='text-yellow-400'>Chat with us!</span>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-link"
      >
        <img 
          src={whatsapp} 
          alt="WhatsApp" 
          className="whatsapp-icon"
        />
      </a>
    </div>
  );
};

export default WhatsAppFloat;