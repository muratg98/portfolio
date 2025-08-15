'use client'
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import AchievementsSection from '../components/Achievements';
import QuickGame from '../components/QuickGame';
import Projects from '../components/Projects';
import Journey from '../components/Journey';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ContactButton from '@/components/ContactButton';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <ContactButton/>
      <Hero />
      <Journey/>
      <Skills />
      <QuickGame/>
      <Projects/>      
      <Footer/>
    </div>
  );
};

export default Home;
