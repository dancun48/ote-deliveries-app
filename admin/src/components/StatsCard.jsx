import React from 'react';

const StatsCard = ({ title, value, change, trend, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600'
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]} transition-all hover:shadow-lg shadow-md cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
            <span className={trend === 'up' ? 'mr-1' : 'mr-1 transform rotate-180'}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
            <span>{change}</span>
            <span className="text-gray-500 ml-1">from yesterday</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
          color === 'blue' ? 'bg-blue-100 text-blue-600' :
          color === 'green' ? 'bg-green-100 text-green-600' :
          color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
          color === 'orange' ? 'bg-orange-100 text-orange-600' :
          'bg-red-100 text-red-600'
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;