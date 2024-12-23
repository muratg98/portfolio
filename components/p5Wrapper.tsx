import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface P5WrapperProps {
  gameStarted: boolean; // Game start state passed as a prop
  setGameStarted: (started: boolean) => void; // Function to update gameStarted state passed as a prop
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ gameStarted, setGameStarted }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: any) => {
      let player: any;
      let obstacles: any[] = [];
      let score = 0;

      let catImages: p5.Image[] = [];
      let fireImage: p5.Image;
      let catAnimationSpeed = 6;

      let canvasWidth = Math.min(900, window.innerWidth * 0.9);
      let canvasHeight = canvasWidth / 5 + 100; // Maintain a 5:1 aspect ratio

      p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight);
        player = new Player(100, canvasHeight - 100, 100, p);
        p.frameRate(60);

        for (let i = 1; i <= 6; i++) {
          catImages.push(p.loadImage(`/catrun${i}.png`));
        }

        fireImage = p.loadImage('/fire-unscreen.gif');
      };

      p.draw = () => {
        p.background(64, 116, 181);

        // Check if the game has started
        if (!gameStarted) {
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER, p.CENTER);
          return;
        }

        player.update(canvasHeight);
        player.display(catImages, catAnimationSpeed);

        if (p.frameCount % 60 === 0) {
          obstacles.push(new Obstacle(canvasWidth, canvasHeight - 70, 50, fireImage, p));
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].update();
          obstacles[i].display();

          if (obstacles[i].x + obstacles[i].size < 0) {
            obstacles.splice(i, 1);
            score++;
          }

          if (player.isOnFloor(canvasHeight) && player.collidesWith(obstacles[i])) {
            p.noLoop();
            alert(`Game Over! Your score: ${score}`);
          }
        }

        p.fill('#fff');
        p.textSize(24);
        p.textStyle('bold');
        p.textFont('monospace');
        p.text(`Score: ${score}`, 10, 30);
      };

      p.mouseClicked = () => {
        if (!player.isJumping) {
          player.jump();
        }
      };

      const handleResize = () => {
        canvasWidth = Math.min(1000, window.innerWidth * 0.9);
        canvasHeight = canvasWidth / 5 + 100;
        p.resizeCanvas(canvasWidth, canvasHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current!);

    return () => {
      p5Instance.remove();
    };
  }, [gameStarted]); // Re-run the effect when `gameStarted` changes

  return <div ref={canvasRef} />;
};

class Player {
  pos: p5.Vector;
  vel: p5.Vector;
  size: number;
  isJumping: boolean;
  ySpeed: number;
  animationFrame: number;
  jumpForce: number = -10;
  gravity: number = 0.5;
  p: p5;

  constructor(x: number, y: number, size: number, p: p5) {
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(0, 0);
    this.size = size;
    this.isJumping = false;
    this.ySpeed = 0;
    this.animationFrame = 0;
    this.p = p;
  }

  update(canvasHeight: number) {
    if (this.isJumping) {
      this.vel.y += this.gravity;
      this.pos.y += this.vel.y;

      if (this.pos.y >= canvasHeight - 100) {
        this.pos.y = canvasHeight - 100;
        this.vel.y = 0;
        this.isJumping = false;
      }
    }
  }

  jump() {
    this.vel.y = this.jumpForce;
    this.isJumping = true;
  }

  display(images: p5.Image[], animationSpeed: number) {
    this.animationFrame = (this.animationFrame + 1) % (animationSpeed * 6);
    let catFrame = Math.floor(this.animationFrame / animationSpeed);
    this.p.image(images[catFrame], this.pos.x, this.pos.y, this.size, this.size);
  }

  collidesWith(obstacle: Obstacle): boolean {
    return !(
      this.pos.x + this.size / 2 < obstacle.x - 24 ||
      this.pos.x - this.size / 2 > obstacle.x + obstacle.size - 65 ||
      this.pos.y + this.size / 2 < obstacle.y ||
      this.pos.y - this.size / 2 > obstacle.y + obstacle.size
    );
  }

  isOnFloor(canvasHeight: number) {
    return this.pos.y >= canvasHeight - 100;
  }
}

class Obstacle {
  x: number;
  y: number;
  size: number;
  image: p5.Image;
  p: p5;

  constructor(x: number, y: number, size: number, image: p5.Image, p: p5) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;
    this.p = p;
  }

  update() {
    this.x -= 5; // Move the obstacle left
  }

  display() {
    this.p.image(this.image, this.x, this.y, this.size, this.size); // Use size for both width and height
  }
}

export default P5Wrapper;
