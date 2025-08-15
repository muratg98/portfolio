'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import skills from '../data/skills.json';

type SkillType = {
  name: string;
  proficiency: number; // 1–10 scale
};

const Skills: React.FC = () => {
  if (!skills || skills.length === 0) return null;

  const [isInView, setIsInView] = useState(false);

  // Filter skills (e.g., show only proficiency >= 5)
  const filteredSkills = skills.filter((skill) => skill.proficiency >= 5);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById('skills');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  if (filteredSkills.length === 0) return null;

  return (
    <section
      id="skills"
      className="bg-gray-200 text-center mx-auto"
      style={{ transition: 'opacity 0.5s ease' }}
    >
      {/* Top Separator */}
      <svg
        className="separator"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="120"
        viewBox="0.2 0 178 30"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#111827', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#1F2937', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <g transform="translate(-14.514284,-115.36352)">
          <path
            style={{ fill: '#4074b5' }}
            d="m 14.74107,115.49581 h 178.02679 v 30.61607 h -29.10417 v -12.47321 h -10.58333 v -8.31548 h -13.98512 v 13.98512 h -20.41072 v -13.98512 h -8.31547 v 7.18155 h -7.18155 v 10.9613 H 85.422617 v -10.9613 H 68.791666 V 121.54343 H 51.40476 v 15.875 H 29.860117 v -9.82739 h -8.693452 v -7.55952 h -6.520089 v -4.53571 z"
          />
          <path
            style={{ fill: 'url(#gradient1)' }}
            d="M 14.741071,112.54762 H 192.76786 v 30.61607 H 163.66369 V 130.69048 H 153.08036 V 122.375 h -13.98512 v 13.98512 H 118.68452 V 122.375 h -8.31547 v 7.18155 h -7.18155 v 10.9613 H 85.422617 v -10.9613 H 68.791666 V 118.59524 H 51.40476 v 15.875 H 29.860118 v -9.82739 h -8.693452 v -7.55952 h -6.520089 v -4.53571 z"
          />
        </g>
      </svg>

      <motion.h2
        className="text-6xl mb-12 text-gray-800 pt-24 font-extrabold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        My Skills
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6">
        {filteredSkills.map((skill: SkillType, index) => (
          <div key={index} className="flex flex-col items-center mb-4">
            <span className="mb-2 text-lg font-semibold text-gray-800">
              {skill.name}
            </span>
            <div className="w-full h-6 bg-gray-300 rounded-lg overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 block"
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${skill.proficiency * 10}%` : '0%' }}
                transition={{ duration: 2, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: '5px' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Separator */}
      <svg
        className="separator-bottom pt-16"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="120"
        viewBox="0.2 0 151 27"
        preserveAspectRatio="none"
      >
        <g transform="translate(-18.766517,-159.24846)">
          <path
            style={{ fill: '#4074b5' }}
            d="m 18.898809,169.7732 h 11.150298 v -10.20536 l 10.016369,10.01637 10.016369,10.01637 v -9.82738 h 20.032738 v -10.20536 l 20.127232,20.12723 v -9.92187 h 19.938245 v -10.01637 l 19.93824,19.93824 v -9.92187 h 19.93824 v -10.20536 l 20.12723,20.12723 v 5.19718 H 18.898809 Z"
          />
          <path
            style={{ fill: '#4074b5' }}
            d="m 18.898809,171.88988 h 11.150298 v -10.20536 l 10.016368,10.01637 10.016368,10.01637 v -9.82738 h 20.032739 v -10.20536 l 20.127233,20.12723 v -9.92187 h 19.938245 v -10.01637 l 19.93824,19.93824 v -9.92187 h 19.93825 v -10.20536 l 20.12723,20.12723 v 5.19718 H 18.898809 Z"
          />
        </g>
      </svg>
    </section>
  );
};

export default Skills;
