import React from 'react';
import { FaReact, FaNodeJs, FaGithub, FaExternalLinkAlt, FaPython } from 'react-icons/fa';
import { DiHtml5, DiCss3, DiJavascript1, DiMongodb } from 'react-icons/di';

interface Project {
  image: string;
  title: string;
  techStack: React.ReactNode[];
  description: string;
  codeUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    image: '/zamanbooking.png',
    title: 'Zaman Bookings',
    techStack: [<FaReact size={20} />, <FaNodeJs size={20} />, <DiMongodb size={20} />, <DiHtml5 size={20} />],
    description: 'A full-stack booking site for salons that allows them to take bookings for multiple services and employees per booking. Built with Next.js, MongoDB, and Node.js.',
    liveUrl: 'https://zamanbookings.com',
  },
  {
    image: '/audiosumimage.png', 
    title: 'GP AI Audio Summariser', 
    techStack: [<FaReact size={20} />, <FaNodeJs size={20} />, <DiHtml5 size={20} />, <DiCss3 size={20} />],
    description: 'Used DeepGram API and trained GPT-4 to transcribe audio and develop a table summarizing symptoms, duration, and client health notes for GP consultations.',
    codeUrl: 'https://github.com/muratg98/audio-summary-deepgram',
  },
  {
    image: '/omdemnachallenge.png',
    title: 'Omdena Challenge: Alzheimer Detection',
    techStack: [<FaReact size={20} />, <FaPython size={20} />, <FaNodeJs size={20} />],
    description: 'Developed a machine learning model for early Alzheimer\'s detection using brain scan images. Overcame challenges like data leakage and medical imaging complexities.',
  },
  {
    image: '/maxreachimage.png',
    title: 'MaxReach',
    techStack: [<FaReact size={20} />, <FaNodeJs size={20} />, <FaPython size={20} />, <DiJavascript1 size={20} />, <DiMongodb size={20} />],
    description: 'Analyzed LinkedIn profiles with APIs and scraping, automate lead data, and provide personalized outreach using GPT-3.5, with a Next.js dashboard, MongoDB, Clerk, and Stripe.',
    liveUrl: 'https://maxreach.io',
  },    
  {
    image: '/onaegishomepage.png',
    title: 'Onaegis',
    techStack: [<FaReact size={20} />, <FaNodeJs size={20} />, <DiJavascript1 size={20} />, <FaPython size={20} />],
    description: 'Developed a SaaS website during a hackathon that detects bot-like behaviors across YouTube accounts using GPT and Python-based AI model training.',
    liveUrl: 'https://onaegis.com',
  },
];


const Projects: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-black min-h-screen">
        <svg className="separator" xmlns="http://www.w3.org/2000/svg" width="100%" height="120" viewBox="0.2 0 178 30" preserveAspectRatio="none">
            <g transform="translate(-14.514284,-115.36352)">
                <path style={{"fill":"#000"}} d="m 14.74107,115.49581 h 178.02679 v 30.61607 h -29.10417 v -12.47321 h -10.58333 v -8.31548 h -13.98512 v 13.98512 h -20.41072 v -13.98512 h -8.31547 v 7.18155 h -7.18155 v 10.9613 H 85.422617 v -10.9613 H 68.791666 V 121.54343 H 51.40476 v 15.875 H 29.860117 v -9.82739 h -8.693452 v -7.55952 h -6.520089 v -4.53571 z" />
                <path style={{"fill":"#4074b5"}} d="M 14.741071,112.54762 H 192.76786 v 30.61607 H 163.66369 V 130.69048 H 153.08036 V 122.375 h -13.98512 v 13.98512 H 118.68452 V 122.375 h -8.31547 v 7.18155 h -7.18155 v 10.9613 H 85.422617 v -10.9613 H 68.791666 V 118.59524 H 51.40476 v 15.875 H 29.860118 v -9.82739 h -8.693452 v -7.55952 h -6.520089 v -4.53571 z"/>
            </g>
        </svg>
      <h1 className="text-6xl font-extrabold text-center text-white mb-12 pt-24">My Projects</h1>
      <div className='max-w-7xl mx-auto'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:bg-gray-700"
          >
            <img src={project.image} alt={project.title} className="w-full h-54 object-cover" />
            <div className="p-4">
              <h2 className="text-2xl text-white font-bold">{project.title}</h2>
              <div className="flex gap-2 mt-2">
                {project.techStack.map((icon, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-600 text-white text-xs font-semibold py-1 px-2 rounded-full"
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <p className="text-gray-300 mt-4">{project.description}</p>
            </div>

            {/* Hover effect: Buttons appear */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 transition duration-300 hover:opacity-100">
              <div className="flex gap-4">
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm flex items-center"
                  >
                    <FaGithub className="mr-2" />
                    View Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm flex items-center"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  View Live
                </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Projects;
