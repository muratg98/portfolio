import React from "react";
import { motion } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

// Import your static journey JSON
import journeys from "../data/journey.json";

type JourneyType = {
  title: string;
  company_name: string;
  date: string;
  icon: string;
  iconBg: string;
  points: string[];
};

const ExperienceCard: React.FC<{ experience: JourneyType }> = ({
  experience,
}) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1F2937",
        color: "#fff",
        fontWeight: 700,
      }}
      contentArrowStyle={{ borderRight: "7px solid #232631" }}
      date={experience.date}
      dateClassName="timeline-date-class"
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          {experience.icon && (
            <img
              src={experience.icon}
              alt={experience.company_name}
              className="w-[60%] h-[60%] object-contain"
            />
          )}
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
        <p
          className="text-secondary text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>
      {experience.points && (
        <ul className="mt-5 list-disc ml-5 space-y-2">
          {experience.points.map((point, index) => (
            <li
              key={`experience-point-${index}`}
              className="text-black-100 text-[14px] pl-1 tracking-wider"
            >
              {point}
            </li>
          ))}
        </ul>
      )}
    </VerticalTimelineElement>
  );
};

const Journey: React.FC = () => {
  if (!journeys || journeys.length === 0) return null;

  return (
    <section className="bg-gray-200" id="journey">
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
            <stop offset="0%" style={{ stopColor: "#111827", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#1F2937", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#000", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <g transform="translate(-14.514284,-115.36352)">
          <path
            style={{ fill: "#4074b5" }}
            d="m 14.74107,115.49581 h 178.02679 v 30.61607 h -29.10417 v -12.47321 h -10.58333 v -8.31548 h -13.98512 v 13.98512 h -20.41072 v -13.98512 h -8.31547 v 7.18155 h -7.18155 v 10.9613 H 85.422617 v -10.9613 H 68.791666 V 121.54343 H 51.40476 v 15.875 H 29.860117 v -9.82739 h -8.693452 v -7.55952 h -6.520089 v -4.53571 z"
          />
          <path
            style={{ fill: "url(#gradient1)" }}
            d="M 14.741071,112.54762 H 192.76786 v 30.61607 H 163.66369 V 130.69048 H 153.08036 V 122.375 h -13.98512 v 13.98512 H 118.68452 V 122.375 h -8.31547 v 7.18155 h -7.18155 v 10.9613 H 85.422617 v -10.9613 H 68.791666 V 118.59524 H 51.40476 v 15.875 H 29.860118 v -9.82739 h -8.693452 v -7.55952 h -6.520089 v -4.53571 z"
          />
        </g>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-6xl mb-12 text-gray-800 pt-24 font-extrabold">
          My Journey
        </h2>
      </motion.div>

      <div className="mt-10 flex flex-col">
        <VerticalTimeline className="vertical-timeline-custom-line">
          {journeys.map((experience, idx) => (
            <ExperienceCard key={idx} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
};

export default Journey;
