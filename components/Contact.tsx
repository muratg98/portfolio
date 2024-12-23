import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import StarParticles from "./starParticles";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      if (response.ok) {
        alert("Thank you! Your message has been sent.");
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Motion settings for sliding animation
  const leftSlideIn = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { type: "tween", duration: 0.8, ease: "easeOut" },
  };

  const rightSlideIn = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { type: "tween", duration: 0.8, ease: "easeOut" },
  };

  return (
    <section className="bg-gradient-to-b from-[#111827] to-black min-h-screen">
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
      <div className="max-w-4xl mx-auto w-full" style={{zIndex: 1}}>

        <motion.div
          {...leftSlideIn}
          className="bg-gray-800 p-8 rounded-3xl"
          style={{ boxShadow: "0px 10px 30px rgba(80, 118, 221, 0.4)", zIndex: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(80, 118, 221, 0.4)" }}
          whileTap={{ scale: 0.98, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.4)" }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-6xl font-extrabold text-center text-white mb-12 pt-12">
            Get In Touch
          </h3>

          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.label
              className="flex flex-col"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white font-medium mb-4">Your Name</span>
              <motion.input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your good name?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium"
                whileFocus={{ scale: 1.05 }}
              />
            </motion.label>

            <motion.label
              className="flex flex-col"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white font-medium mb-4">Your email</span>
              <motion.input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your web address?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium"
                whileFocus={{ scale: 1.05 }}
              />
            </motion.label>

            <motion.label
              className="flex flex-col"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white font-medium mb-4">Your Message</span>
              <motion.textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What you want to say?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium"
                whileFocus={{ scale: 1.05 }}
              />
            </motion.label>

            <motion.button
              type="submit"
              className="bg-gray-600 py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Sending..." : "Send"}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>

      {/* Empty space for possible Earth Canvas or other content */}
      <motion.div
        {...rightSlideIn}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        {/* You can add your EarthCanvas or other content here */}
      </motion.div>
    </section>
  );
};

export default Contact;
