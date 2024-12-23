import React from "react";
import { motion } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { GiGiftOfKnowledge } from "react-icons/gi";

const experiences = [
    {
      title: "MSc Health Psychology | Merit (2.1)",
      company_name: "University of Westminster",
      date: "Sept 2020 – Sept 2021",
      icon: "/uow-icon.png",
      iconBg: "#FF5733",
      points: [
        "Dissertation: 'Acceptability of Artificial Humans and Virtual Assistants in Healthcare'.",
        "Explored the acceptance of AI-based healthcare assistants during COVID-19.",
        "Conducted quantitative analysis using logistic regression, multiple regression, and cross-tabulation.",
        "Identified users' awareness, perceived usefulness, and barriers as pivotal factors for acceptance.",
      ],
    },
    {
      title: "Python Programming",
      company_name: "Online Courses and Mini Projects",
      date: "Jan 2022 - March 2023",
      icon: "/study-icon-19.png",
      iconBg: "#33BFFF",
      points: [
        "Completed courses like 'Python For Everybody' by Dr. Chuck, '100 Days of Code' by Angela Yu, and 'Harvard CS50x'.",
        "Projects included: WhatsApp AI Text Impersonator, Python GUI for AI Training, Google Maps Scraper, and Text Sentiment Analysis.",
      ],
    },
    {
      title: "Hackathon Project: Onaegis",
      company_name: "Hackathon",
      date: "March 2023 – June 2023",
      icon: "/devposticon.png",
      iconBg: "#FFD700",
      points: [
        "Developed a SaaS website to detect bot-like behaviors in users' YouTube accounts.",
        "Used APIs (YouTube and GPT), JavaScript for the website, and Python to train the AI Model.",
      ],
    },
    {
      title: "Team Member",
      company_name: "Honi Poke",
      date: "August 2023 - Current",
      icon: "/honipokeicon.png",
      iconBg: "#FF4500",
      points: [
        "Completed daily KPIs and ensured customer inquiries were met.",
        "Worked collaboratively to achieve team operational targets.",
      ],
    },
    {
      title: "MaxReach",
      company_name: "Personal Project",
      date: "Nov 2023 - Jan 2024",
      icon: "/maxreachicon.png",
      iconBg: "#1E90FF",
      points: [
        "Used APIs and scraping to develop a better understanding of LinkedIn profiles.",
        "Created character profiles and personalized outreach using a trained GPT-3.5 Turbo AI Model.",
      ],
    },
    {
      title: "Freelancer",
      company_name: "UpWork",
      date: "Nov 2023 - Current",
      icon: "/uwicon.png",
      iconBg: "#32CD32",
      points: [
        "Promoted my services on UpWork, assisting clients with Python scripting tasks.",
        "Projects included a script to read barcodes and QR codes from images and export data to Excel.",
      ],
    },
  ];
  

// ExperienceCard Component
const ExperienceCard: React.FC<{ experience: typeof experiences[0] }> = ({
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
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
        <p className="text-secondary text-[16px] font-semibold" style={{ margin: 0 }}>
          {experience.company_name}
        </p>
      </div>
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
    </VerticalTimelineElement>
  );
};

const Journey: React.FC = () => {
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
          {experiences.map((experience, index) => (
            <ExperienceCard key={`experience-${index}`} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>

    </section>
  );
};

export default Journey;
