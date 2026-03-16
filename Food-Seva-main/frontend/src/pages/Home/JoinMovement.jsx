import React from "react";

const JoinMovement = () => {
  return (
    <div className="w-full bg-[#eeecdd] py-20 flex flex-col items-center text-center px-6 ">
      <h2 className="text-3xl font-bold text-black mb-4">Join the Movement</h2>

      <p className="text-gray-700 max-w-2xl mb-6">
        Start making a difference today. Register your organization or food
        surplus and help us combat food waste while nourishing our community.
      </p>

      <button className="bg-[#1E3A3A] text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-[#16302F] transition-all duration-300">
        Donate Now
      </button>
    </div>
  );
};

export default JoinMovement;