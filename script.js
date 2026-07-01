/* ========================================
   NAFISA — Animations & Interactivity
   ======================================== */

// ── PRELOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1800);
});


// ── CUSTOM CURSOR ──
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .collection-card, .featured-item');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// ── SPARKLE CANVAS ──
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');
let sparkles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Sparkle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.5 + 0.1;
    this.speed = Math.random() * 0.008 + 0.003;
    this.phase = Math.random() * Math.PI * 2;
    this.drift = (Math.random() - 0.5) * 0.2;
  }
  update() {
    this.phase += this.speed;
    this.opacity = this.maxOpacity * Math.abs(Math.sin(this.phase));
    this.y -= 0.15;
    this.x += this.drift;
    if (this.opacity < 0.01 && this.phase > Math.PI) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#c9a84c';
    ctx.beginPath();
    // 4-point star shape
    const s = this.size;
    ctx.moveTo(this.x, this.y - s * 2);
    ctx.lineTo(this.x + s * 0.5, this.y - s * 0.5);
    ctx.lineTo(this.x + s * 2, this.y);
    ctx.lineTo(this.x + s * 0.5, this.y + s * 0.5);
    ctx.lineTo(this.x, this.y + s * 2);
    ctx.lineTo(this.x - s * 0.5, this.y + s * 0.5);
    ctx.lineTo(this.x - s * 2, this.y);
    ctx.lineTo(this.x - s * 0.5, this.y - s * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 60; i++) sparkles.push(new Sparkle());

function animateSparkles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparkles.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animateSparkles);
}
animateSparkles();

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 80);
  lastScroll = y;
});

// ── MOBILE MENU ──
const menuBtn = document.querySelector('.nav-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = menuBtn.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION ──
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 25);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ── TESTIMONIAL SLIDER ──
const track = document.querySelector('.testimonial-track');
const dots = document.querySelectorAll('.slider-dots .dot');
let currentSlide = 0;
const totalSlides = 3;

function goToSlide(n) {
  currentSlide = n;
  track.style.transform = `translateX(-${n * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === n));
}

dots.forEach(d => {
  d.addEventListener('click', () => goToSlide(parseInt(d.dataset.slide)));
});

// Auto-advance
setInterval(() => {
  goToSlide((currentSlide + 1) % totalSlides);
}, 5000);

// ── TILT EFFECT ON COLLECTION CARDS ──
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    card.style.transition = 'transform .5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// ── SMOOTH ANCHOR SCROLLING ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── PARALLAX ON HERO ──
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
  }
});

// ── FORM INPUT ANIMATION ──
document.querySelectorAll('.input-group input').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.querySelector('.input-line').style.width = '100%';
  });
  input.addEventListener('blur', () => {
    if (!input.value) {
      input.parentElement.querySelector('.input-line').style.width = '0';
    }
  });
});
