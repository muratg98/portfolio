"use client";

import React from "react";
import { ReactTyped } from "react-typed";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Particle from '@/components/particles';
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import general from "../data/general.json";

const Hero: React.FC = () => {
  return (
    <section className="lg:py-16 bg-gradient-to-r min-h-screen from-gray-900 via-gray-800 to-black h-[calc(100vh-250px)] flex items-center justify-center relative">
      <Particle />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto px-4 z-10">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-white mb-4 text-5xl sm:text-5xl lg:text-7xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">
              Hi! I'm{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600">
              Murat,
            </span>
          </h1>

          {/* Animated Type Text */}
          <p className="text-[#fff] text-base sm:text-lg mb-6 lg:text-xl">
            <ReactTyped
              strings={[
                "a Full-stack Developer",
                "a Web Developer",
                "a Software Developer",
              ]}
              typeSpeed={50}
              backSpeed={30}
              loop
              className="text-5xl text-white font-bold"
            />
          </p>
          <p className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-md">
          Self-taught software developer from London, skilled in Python, JS, TS, and NextJS. My psychology background drives user-centered solutions, and my quick learning helps me collaborate effectively on real-world problems.
          </p>

          <div className="flex items-center mt-6">
            <Link
              href="general/FullStack NextJS-React Dev CV.pdf"
              className="px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 hover:bg-slate-800 text-white mt-3"
            >
              <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
                Download CV
              </span>
            </Link>

            {/* Social icons aligned on the same line */}
            <div className="flex items-center space-x-4 ml-4 pt-3">
              {/* LinkedIn Icon */}
              <a
                href={general.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500"
              >
                <FaLinkedin size={24} />
              </a>

              {/* GitHub Icon */}
              <a
                href={general.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-500"
              >
                <FaGithub size={24} />
              </a>

              {/* Email Icon */}
              <a
                href={`mailto:${general.email}`}
                className="text-white hover:text-yellow-500"
              >
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-4 lg:mt-0 hidden lg:block"
        >
          <div className="rounded-full bg-[#181818] w-[150px] h-[150px] lg:w-[400px] lg:h-[400px] relative mx-auto overflow-hidden shadow-glow">
            <Image
              src="/general/mehuh3.png"
              alt="hero image"
              className="object-cover scale-150 transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width={300}
              height={300}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
