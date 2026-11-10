import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUpRight, BookOpen, Bot, Check, Copy, GraduationCap, Github, Hammer,
  Layers, Linkedin, Mail, MapPin,
} from 'lucide-react';
import data from './data/portfolio.json';
import heroArt from './assets/hero-light.webp';
import brainUrl from './assets/brain.bin?url';
import { createBrain } from './lib/brainStipple';

const FACT_ICONS = { pin: MapPin, hammer: Hammer, layers: Layers, degree: GraduationCap, paper: BookOpen, bot: Bot };
const SECTIONS = [
  ['about', 'About'],
  ['work', 'Work'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['research', 'Research'],
  ['contact', 'Contact'],
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Murat Gungor, back to top">
      <span>&lt;/</span>MG<span>&gt;</span>
    </a>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`nav${solid ? ' nav-solid' : ''}`}>
      <div className="wrap nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const canvasRef = useRef(null);
  const { profile, social } = data;
  useEffect(() => {
    const brain = createBrain(canvasRef.current, brainUrl);
    return () => brain.destroy();
  }, []);
  return (
    <section className="hero" id="top">
      <img className="hero-layer hero-art" src={heroArt} alt="" width="1914" height="822" />
      <div className="wrap hero-inner">
        <div className="hero-brain">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="img"
            aria-label="A pink 3D brain with red veins that pulse across it. Drag it, or use the arrow keys, to spin it."
          />
        </div>
        <p className="hero-role">{profile.role}</p>
        <h1 aria-label={profile.name}>
          {profile.name.split(' ').map((word) => <span key={word} aria-hidden="true">{word}</span>)}
        </h1>
        <p className="hero-lead">
          {profile.lead.split(/(?<=\.)\s/).map((line) => <span key={line}>{line} </span>)}
        </p>
        <ul className="hero-meta">
          <li><i className="live" aria-hidden="true" />{profile.availability}</li>
          <li><MapPin size={17} aria-hidden="true" />{profile.location}</li>
          <li><GraduationCap size={17} aria-hidden="true" />{profile.background}</li>
        </ul>
        <div className="hero-actions">
          <a className="btn" href="#work">See my work</a>
          <a className="btn btn-line btn-mail" href="#contact" aria-label="Get in touch"><Mail size={17} aria-hidden="true" /><span>Get in touch</span></a>
          <a className="icon-link" href={social.linkedin} aria-label="LinkedIn"><Linkedin size={20} /></a>
          <a className="icon-link" href={social.github} aria-label="GitHub"><Github size={20} /></a>
        </div>
        <nav className="threads" aria-label="Start here">
          {profile.threads.map((t) => (
            <a key={t.href} href={t.href}>
              <span className="thread-when">{t.when}</span>
              <span className="thread-text">{t.text}</span>
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

function Section({ id, title, note, children }) {
  return (
    <section className="section" id={id} data-section>
      <div className="section-grid">
        <div className="section-head">
          <h2>{title}</h2>
          {note && <p className="section-note">{note}</p>}
        </div>
        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}

function About() {
  const { about } = data;
  return (
    <Section id="about" title="About">
      <div className="about-top">
        <div className="about-photo">
          <img className="portrait" src="/images/murat.jpg" alt="Murat Gungor" width="600" height="600" loading="lazy" />
          <p className="first">{about.first}</p>
        </div>
        <div className="prose">
          {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>
      <dl className="facts">
        {about.facts.map((f) => {
          const Icon = FACT_ICONS[f.icon];
          return (
            <div key={f.label}>
              <Icon size={20} aria-hidden="true" />
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}

function Work() {
  return (
    <Section id="work" title="Work">
      <div className="jobs">
        {data.experience.map((job) => (
          <article className="job" key={job.company + job.period}>
            <p className="job-when">{job.period}</p>
            <div>
              <h3>{job.company}</h3>
              <p className="job-role">
                {job.role}
                <span><MapPin size={15} aria-hidden="true" />{job.location}</span>
              </p>
              <ul>{job.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Projects() {
  const { featured, projects } = data;
  return (
    <Section id="projects" title="Projects">
      <article className="owlex">
        <div className="owlex-head">
          <h3>{featured.title}</h3>
          <a href={featured.url}>{featured.urlLabel}<ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <p className="owlex-lead">{featured.lead}</p>
        <div className="figures">
          {featured.figures.map((f) => (
            <div key={f.label}><b>{f.value}</b><span>{f.label}</span></div>
          ))}
        </div>
        <ol className="pipeline" aria-label="How a scan works">
          {featured.pipeline.map((p) => (
            <li key={p.step}><b>{p.step}</b><span>{p.detail}</span></li>
          ))}
        </ol>
      </article>
      <div className="rows">
        {projects.map((p) => (
          <div className="row" key={p.title}>
            <span className="row-name">
              {p.url ? <a href={p.url}>{p.title}<ArrowUpRight size={16} aria-hidden="true" /></a> : p.title}
            </span>
            <span className="row-what">{p.description}</span>
            <span className="row-stack">{p.stack}</span>
            <span className="row-when">{p.period}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="skills">
        {data.skills.map((s) => (
          <div key={s.group}><dt>{s.group}</dt><dd>{s.items}</dd></div>
        ))}
      </dl>
    </Section>
  );
}

function Research() {
  const { publication, education } = data;
  return (
    <Section id="research" title="Research and education">
      <p className="paper">{publication.title}</p>
      <p className="paper-meta"><em>{publication.journal}</em>, {publication.date}. {publication.description}</p>
      <ul className="degrees">
        {education.map((e) => (
          <li key={e.degree}>
            <GraduationCap size={20} aria-hidden="true" />
            <b>{e.degree}</b>
            <span>{e.institution}, {e.period}</span>
            <span>{e.grade}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Contact() {
  const { profile, social } = data;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <section className="section contact" id="contact" data-section>
      <h2>Tell me what you're building.</h2>
      <div className="contact-line">
        <a className="email" href={`mailto:${profile.email}`}>{profile.email}</a>
        <button className="copy" type="button" onClick={copy} aria-label={copied ? 'Copied' : 'Copy email'}>
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          <span>{copied ? 'Copied' : 'Copy email'}</span>
        </button>
      </div>
      <div className="contact-links">
        <a href={social.linkedin} aria-label="LinkedIn"><Linkedin size={18} aria-hidden="true" /><b>LinkedIn</b></a>
        <a href={social.github} aria-label="GitHub"><Github size={18} aria-hidden="true" /><b>GitHub</b></a>
        <a className="contact-extra" href={social.owlex}><ArrowUpRight size={18} aria-hidden="true" /><b>Owlex</b></a>
        <span><MapPin size={18} aria-hidden="true" />{profile.location}</span>
      </div>
    </section>
  );
}

// A gold trace runs down the page from the hero. A pulse follows the scroll position and
// each section's solder pad lights once the pulse has passed it.
function useSignalTrace(mainRef, pulseRef) {
  useEffect(() => {
    const main = mainRef.current, pulse = pulseRef.current;
    if (!main || !pulse) return undefined;
    const sections = [...main.querySelectorAll('[data-section]')];
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = main.getBoundingClientRect();
      const y = Math.max(0, Math.min(r.height, window.innerHeight * 0.5 - r.top));
      pulse.style.transform = `translateY(${y}px)`;
      main.style.setProperty('--trace-y', `${y}px`);
      sections.forEach((s) => s.classList.toggle('reached', s.getBoundingClientRect().top - r.top <= y + 60));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [mainRef, pulseRef]);
}

export default function App() {
  const mainRef = useRef(null);
  const pulseRef = useRef(null);
  useSignalTrace(mainRef, pulseRef);
  return (
    <>
      <Nav />
      <Hero />
      <main className="wrap main" ref={mainRef}>
        <div className="trace" aria-hidden="true"><i ref={pulseRef} /></div>
        <About />
        <Work />
        <Projects />
        <Skills />
        <Research />
        <Contact />
      </main>
      <footer className="wrap foot">
        <Logo />
        <span>Murat Gungor, London. {data.profile.website}</span>
      </footer>
    </>
  );
}
