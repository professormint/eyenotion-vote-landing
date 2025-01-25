"use client";

import React, { useState } from "react";
import StakingComponent from "./StakingComponent";

const StakingModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Main Stake Button */}
      <button
        onClick={openModal}
        className="w-full bg-gradient-to-r from-[#32FECB] to-[#A2FF63] text-[#15151F] font-bold text-lg uppercase py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl active:scale-95"
      >
        Stake
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`relative bg-[#1E1E2A] text-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-md h-auto p-4 sm:p-8 transform transition-transform`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300"
            >
              ✕
            </button>

            {/* Staking Component */}
            <StakingComponent />
          </div>
        </div>
      )}
    </>
  );
};

export default StakingModal;