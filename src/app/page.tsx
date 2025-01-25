"use client"

import Image from "next/image";
import { useState } from "react";
import StakingComponent from "./components/StakingModal";
import StakingModal from "./components/StakingModal";

export default function Home() {

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  return (
    <>
    <div className="flex flex-col items-center justify-center gap-12 pt-6 w-1/5 min-w-[300px] h-screen">
      <img src="/logo.png" alt="Logo" className="w-full h-auto" />

      <StakingModal />

    </div>

  <div className="absolute top-0 right-0 p-6 text-right">
      <h1 className="text-[#fff] text-3xl font-bold leading-tight pb-4">performance.</h1>
      <h1 className="text-[#fff] text-3xl font-bold leading-tight pb-4">with.</h1>
      <h1 className="text-[#fff] text-3xl font-bold leading-tight">purpose.</h1>
  </div>

</>
  );
}
