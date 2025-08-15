import React from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

// Import static JSON data
import projects from "../data/projects.json";

type ProjectType = {
  name: string;
  description: string;
  skills?: string[];
  image: string;
  pin?: boolean;
  links?: {
    github?: string;
    blog?: string;
    linkedin?: string;
  };
};

const Projects: React.FC = () => {
  if (!projects || projects.length === 0) return null;

  const sortedProjects = [...projects].sort((a, b) => {
    return b.pin === true ? 1 : -1;
  });

  return (
    <section
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-black min-h-screen p-4"
      id="projects"
    >
      <h1 className="text-6xl font-extrabold text-center text-white mb-12 pt-24">
        My Projects
      </h1>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sortedProjects.map((project: ProjectType, index) => (
           <div
              key={index}
              className={`relative rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:bg-gray-700 ${
                project.pin ? "border-2 border-yellow-800" : "bg-gray-800"
              }`}
            >
              {project.pin && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                  📌 Pinned
                </span>
              )}
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-2xl text-white font-bold">
                  {project.name}
                </h2>

                {/* Skills */}
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-700 text-white text-xs font-medium py-1 px-3 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-300 mt-4">{project.description}</p>
              </div>

              {/* Overlay with links */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 transition duration-300 hover:opacity-100">
                <div className="flex gap-4">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm flex items-center"
                    >
                      <FaGithub className="mr-2" />
                      View Code
                    </a>
                  )}
                  {project.links?.blog && (
                    <a
                      href={project.links.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm flex items-center"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      View Live
                    </a>
                  )}
                  {project.links?.linkedin && (
                    <a
                      href={project.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm flex items-center"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      LinkedIn
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
