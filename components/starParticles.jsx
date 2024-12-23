import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";

import { loadFull } from "tsparticles";

export default function StarParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    console.log("Initializing StarParticles...");
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles loaded:", container);
  };

  return (
    <>
      {init && (
        <Particles
          id="star-particles"
          particlesLoaded={particlesLoaded}

          options={{
            style: {position: 'absolute', zIndex: -1 },
            fpsLimit: 120,
            particles: {
              number: {
                value: 355,
                density: {
                  enable: true,
                  value_area: 789.15,
                },
              },
              color: {
                value: "#ffffff",
              },
              shape: {
                type: "circle",
                stroke: {
                  width: 0,
                  color: "#000000",
                },
                polygon: {
                  nb_sides: 5,
                },
              },
              opacity: {
                value: 0.49,
                random: false,
                anim: {
                  enable: true,
                  speed: 0.25,
                  opacity_min: 0,
                  sync: false,
                },
              },
              size: {
                value: 2,
                random: true,
                anim: {
                  enable: true,
                  speed: 0.333,
                  size_min: 0,
                  sync: false,
                },
              },
              line_linked: {
                enable: false,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1,
              },
              move: {
                enable: true,
                speed: 0.1,
                direction: "none",
                random: true,
                straight: false,
                outModes: {
                  default: "out",
                },
                bounce: false,
                attract: {
                  enable: false,
                  rotateX: 600,
                  rotateY: 1200,
                },
              },
            },
            fullScreen: {
              enable: false,
              zIndex: -1,
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onHover: {
                  enable: true,
                  mode: "bubble",
                },
                onClick: {
                  enable: true,
                  mode: "push",
                },
                resize: true,
              },
              modes: {
                grab: {
                  distance: 400,
                  line_linked: {
                    opacity: 1,
                  },
                },
                bubble: {
                  distance: 83.9,
                  size: 1,
                  duration: 3,
                  opacity: 1,
                  speed: 3,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
                push: {
                  particles_nb: 4,
                },
                remove: {
                  particles_nb: 2,
                },
              },
            },
            retina_detect: true,
          }}
        />
      )}
    </>
  );
}
