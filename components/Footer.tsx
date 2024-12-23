import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#111827] to-black text-white pb-6">
        <svg className="separator" xmlns="http://www.w3.org/2000/svg" width="100%" height="166.61502" viewBox="0.4 0.2 200 44" preserveAspectRatio="none">
            <defs>
                {/* Define Gradient */}
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#111827', stopOpacity: 1 }} /> {/* gray-900 */}
                    <stop offset="50%" style={{ stopColor: '#1F2937', stopOpacity: 1 }} /> {/* gray-800 */}
                    <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 1 }} /> {/* black */}
                </linearGradient>
                </defs>
            <g className="separator" transform="translate(-9.2218046,-83.494585)">
                <path style={{ fill: '#111827' }} d="M 9.484815,89.716055 H 209.81018 V 126.90507 L 110.46368,93.705147 9.579391,127.39334 Z" />
                <path style={{ fill: 'url(#gradient1)' }} d="M 9.3544335,83.626877 H 209.68181 V 120.29057 L 110.46368,93.705147 9.4490103,120.77195 Z" />
            </g>
        </svg>

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Website Name on the Left */}
        <div className="text-2xl font-extrabold">
          <a href="/" className="text-white hover:text-primary">
            muratg
          </a>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-end space-y-2">
          <span className="text-md font-medium">Socials</span>
          <div className="flex space-x-4">
            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/murat-gungor-257937168/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500"
            >
              LinkedIn
            </a>

            {/* Email Link */}
            <a
              href="mailto:muratgungor-98@hotmail.com"
              className="text-white hover:text-gray-400"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
