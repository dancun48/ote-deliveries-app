import React from "react";

const DispatchInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-14 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-base sm:text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">
              SERVICE INFORMATION
            </h2>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-4 md:mb-6">
              Dispatch & Policies
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Clear guidelines for efficient service delivery and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 px-2 sm:px-4">
            {/* Left Column */}
            <div className="space-y-6 md:space-y-8">
              {/* Dispatch Times */}
              <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">
                    DISPATCH TIMES
                  </h3>
                  <div className="w-16 sm:w-20 h-1 bg-gold mx-auto"></div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 md:mb-6">
                  {[
                    "07:00 AM – 08:00 AM",
                    "10:00 AM – 11:45 AM",
                    "14:00 PM – 15:45 PM",
                  ].map((time, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                        {time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded-xl p-3 sm:p-4">
                  <h4 className="font-bold text-black mb-2 sm:mb-3 text-lg sm:text-xl">
                    Why pick up dispatch times?
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    It enables our clients to manage expectations and also ensure better service delivery by our company staff.
                  </p>
                </div>
              </div>

              {/* Off-Peak Time */}
              <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">
                    OFF-PEAK TIME
                  </h3>
                  <div className="w-16 sm:w-20 h-1 bg-gold mx-auto"></div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    This is any time within the dispatch times. This does not mean we do not offer pick up services during this time.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-700 font-semibold text-sm sm:text-base">
                      We still offer but at standard rate without scheduling discount and little costly (100/=).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 md:space-y-8">
              {/* Sign Up Discount */}
              <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">
                    SIGN UP DISCOUNT
                  </h3>
                  <div className="w-16 sm:w-20 h-1 bg-gold mx-auto"></div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Discounted rates for all clients who have completed sign up on all errands.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                    <h4 className="font-bold text-green-800 text-lg sm:text-xl mb-2 sm:mb-3 text-center">
                      FREE ERRANDS
                    </h4>
                    <ul className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>
                          For all the signed up clients get 1 week FREE ERRANDS
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>For every 10 errands there is a FREE ERRAND</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">
                    CANCELLATION OF ERRANDS
                  </h3>
                  <div className="w-16 sm:w-20 h-1 bg-gold mx-auto"></div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-lg sm:text-xl">!</span>
                    </div>
                  </div>
                  <p className="text-red-700 text-center font-semibold text-base sm:text-lg leading-relaxed">
                    Late (15mins before time) cancellation of errands attracts a charge of 30% of the errand bill.
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="rounded-xl md:rounded-2xl p-2 text-center">
                <button className="bg-black text-white px-8 sm:px-12 md:px-16 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 text-sm sm:text-base w-full sm:w-auto">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchInfo;