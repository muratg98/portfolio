"use client";
import React from "react";
import dynamic from "next/dynamic";

const AnimatedNumbers = dynamic(
  () => {
    return import("react-animated-numbers");
  },
  { ssr: false }
);

const achievementsList = [
  {
    metric: "Projects",
    value: "11",
    postfix: "+",
  },
  {
    prefix: "",
    postfix: "%",
    metric: "Happy Clients",
    value: "100",
  },
  {
    metric: "Awards",
    value: "7",
  },
  {
    metric: "Years",
    value: "3",
  },
];

const AchievementsSection = () => {
  return (
    <div className="px-4 xl:gap-16 sm:py-16 xl:px-16 bg-gradient-to-r from-gray-900 via-gray-800 to-black">
      <div className="sm:border-[#33353F] sm:border rounded-md py-8 px-16 mx-auto max-w-[1000px]">
        {/* Achievements grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievementsList.map((achievement, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center mx-4 my-4 sm:my-0"
              >
                <h2 className="text-white text-4xl font-bold flex flex-row">
                  {achievement.prefix}
                  <AnimatedNumbers
                    includeComma
                    animateToNumber={parseInt(achievement.value)}
                    locale="en-US"
                    className="text-white text-4xl font-bold"
                  />
                  {achievement.postfix}
                </h2>
                <p className="text-[#ADB7BE] text-base">{achievement.metric}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;
