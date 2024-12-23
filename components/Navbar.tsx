"use client";

import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const navLinks = [
  { title: "Skills", path: "#skills" },
  { title: "Projects", path: "#projects" },
  { title: "Contact", path: "#contact" },
];

const Navbar: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-black bg-opacity-90 backdrop-blur-lg text-white px-6 py-8 shadow-md">
    <div className="flex justify-between items-center container mx-auto">
        {/* Logo */}
        <div className="text-4xl font-extrabold">muratg</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-12">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.path}
                className="hover:text-gray-400 font-semibold text-2xl"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="md:hidden flex items-center px-3 py-2 border rounded border-gray-400 text-gray-400 hover:text-white hover:border-white"
        >
          {navbarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {navbarOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center space-y-4 py-4">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className="text-3xl text-gray-200 hover:text-white font-semibold"
              onClick={() => setNavbarOpen(false)} // Close the menu when a link is clicked
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
