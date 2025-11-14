import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      text: 'PENDING'
    },
    assigned: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      text: 'ASSIGNED'
    },
    picked_up: {
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      text: 'PICKED UP'
    },
    in_transit: {
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      text: 'IN TRANSIT'
    },
    delivered: {
      color: 'bg-green-100 text-green-800 border-green-200',
      text: 'DELIVERED'
    },
    cancelled: {
      color: 'bg-red-100 text-red-800 border-red-200',
      text: 'CANCELLED'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;