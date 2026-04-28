/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

/* ============================================
   CANVAS BACKGROUND — PARTICULES
   ============================================ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

const PARTICLE_COUNT = 60;

let mouse = { x: W / 2, y: H / 2 };

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initParticles();
});

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 1 + 0.3;
    this.alpha = Math.random() * 0.35 + 0.08;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 300) {
      this.vx += (dx / dist) * 0.006;
      this.vy += (dy / dist) * 0.006;
    }

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 0.7) {
      this.vx = (this.vx / speed) * 0.7;
      this.vy = (this.vy / speed) * 0.7;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 200, 200, ${this.alpha})`;
    ctx.fill();
  }
}

let particles = [];

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function drawLines() {
  const MAX_DIST = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(180, 180, 180, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function drawRadialGlow() {
  const gradient = ctx.createRadialGradient(
    mouse.x, mouse.y, 0,
    mouse.x, mouse.y, 380
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.025)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawRadialGlow();
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}

initParticles();
animate();

/* ============================================
   NAVBAR — SCROLL EFFECT
   ============================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================
   HERO — APPARITION AU CHARGEMENT
   ============================================ */
window.addEventListener('DOMContentLoaded', () => {
  const heroReveal = document.querySelectorAll('.hero .reveal');
  heroReveal.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 150 + i * 110);
  });
});

/* ============================================
   SMOOTH ANCHOR SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});