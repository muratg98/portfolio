"use client";
import React from "react";
import { FaHandPeace } from "react-icons/fa";
import general from "../data/general.json";

const ContactButton: React.FC = () => {
  const handleClick = () => {
    window.location.href = `mailto:${general.email}`;
  };

  return (
    <div
      className="fixed bottom-16 left-16 flex flex-col items-center justify-center lg:block hidden"
      style={{ zIndex: 9999 }}
    >
      <div
        className="relative w-40 h-40 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-black cursor-pointer"
        style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}
        onClick={handleClick}
      >
        <FaHandPeace size={70} className="text-white text-5xl" />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <img
            src="/general/contactme.png"
            alt="Contact"
            className="object-contain animate-spin-slow"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactButton;
