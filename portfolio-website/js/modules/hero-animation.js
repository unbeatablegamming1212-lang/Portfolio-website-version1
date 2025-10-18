// js/modules/hero-animation.js
// Character mask reveal + Smooth Dynamic Island navbar animation

function splitHeading(selector) {
  const elem = document.querySelector(selector);
  if (!elem) return null;

  const originalHTML = elem.innerHTML;
  elem.textContent = '';

  const temp = document.createElement('div');
  temp.innerHTML = originalHTML;

  const allChars = [];

  const buildWord = (text, charClassList, container) => {
    const tokens = text.match(/\S+|\s+/g) || [];
    tokens.forEach((token) => {
      if (/^\s+$/.test(token)) {
        container.appendChild(document.createTextNode(token));
      } else {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        for (const ch of token) {
          const c = document.createElement('span');
          c.className = charClassList;
          c.textContent = ch;
          c.style.display = 'inline-block';
          c.style.transformOrigin = 'center center';
          wordSpan.appendChild(c);
          allChars.push(c);
        }

        container.appendChild(wordSpan);
      }
    });
  };

  Array.from(temp.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      buildWord(node.textContent, 'char', elem);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
      const wrapper = document.createElement('span');
      wrapper.className = node.className;
      buildWord(node.textContent, `char ${node.className}`, wrapper);
      elem.appendChild(wrapper);
    } else {
      elem.appendChild(node.cloneNode(true));
    }
  });

  return allChars;
}

function startTypingAnimation() {
  const skills = ['embedded systems', 'AI/ML solutions', 'IoT projects', 'impactful video edits'];
  const skillElement = document.getElementById('hero-skill');
  if (!skillElement) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    skillElement.textContent = skills[0];
    const cursor = document.getElementById('typing-cursor');
    if (cursor) cursor.style.display = 'none';
    return;
  }

  let skillIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = skills[skillIndex];
    if (!isDeleting && charIndex < current.length) {
      skillElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, 80);
    } else if (isDeleting && charIndex > 0) {
      skillElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, 50);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        skillIndex = (skillIndex + 1) % skills.length;
      }
      setTimeout(type, isDeleting ? 1500 : 500);
    }
  }
  type();
}

function runLandingAnimation() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('header');
  const nav = header ? header.querySelector('nav') : null;
  const logo = header ? header.querySelector('a') : null;
  const navLinks = header ? header.querySelector('.main-nav') : null;
  const heroContent = document.getElementById('hero-content');
  const shaderCanvas = document.getElementById('shader-canvas');
  const heroHeading = document.querySelector('.hero-heading');

  if (!heroHeading) {
    startTypingAnimation();
    return;
  }

  const chars = splitHeading('.hero-heading');
  const heroSubheading = document.querySelector('.hero-subheading');
  const heroButtons = document.querySelectorAll('.hero-buttons a');

  // Initial states
  gsap.set(heroContent, { opacity: 1 });
  gsap.set(heroSubheading, { autoAlpha: 0, y: 20 });
  gsap.set(heroButtons, { autoAlpha: 0, y: 20 });

  if (reduced || !chars || !chars.length) {
    if (chars && chars.length) gsap.set(chars, { rotationY: 0, opacity: 1 });
    gsap.set(header, { opacity: 1 });
    gsap.set(heroSubheading, { autoAlpha: 1, y: 0 });
    gsap.set(heroButtons, { autoAlpha: 1, y: 0 });
    startTypingAnimation();
    return;
  }

  // DYNAMIC ISLAND - Initial Setup (tiny circle)
  if (nav && logo && navLinks) {
    gsap.set(nav, {
      width: '52px',
      height: '52px',
      borderRadius: '50%',
      paddingLeft: '14px',
      paddingRight: '14px',
      paddingTop: '14px',
      paddingBottom: '14px'
    });
    gsap.set(navLinks, { autoAlpha: 0, scaleX: 0, transformOrigin: 'left center' });
    gsap.set(logo, { scale: 1, opacity: 1 });
    gsap.set(header, { opacity: 1 }); // Header always visible from start
  }

  // Character animation setup
  gsap.set(chars, { 
    rotationY: -90,
    opacity: 0,
    transformOrigin: 'center center',
    transformPerspective: 1000
  });

  const tl = gsap.timeline({
    onComplete: () => {
      startTypingAnimation();
    }
  });

  // Blur canvas
  tl.to(shaderCanvas, { filter: 'blur(0px)', duration: 3.5, ease: 'power2.out' }, 0);

  // Character rotation animation (happens first)
  tl.to(chars, {
    rotationY: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    stagger: 0.05
  }, 0.5);

  // DYNAMIC ISLAND EXPANSION - AFTER heading completes (smooth GSAP animation)
  if (nav && logo && navLinks) {
    tl.to(nav, {
      width: 'auto',
      height: 'auto',
      borderRadius: '9999px',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '8px',
      paddingBottom: '8px',
      duration: 0.8,
      ease: 'power3.out' // Smooth expansion
    }, 1.8) // Starts AFTER heading completes (0.5 + 0.6 + stagger time)
    .to(navLinks, {
      autoAlpha: 1,
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, 2.0); // Links appear during expansion
  }

  // Rest of animations (adjusted timing to flow naturally)
  tl.to(heroSubheading, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.7 }, 1.5)
    .to(heroButtons, { autoAlpha: 1, y: 0, stagger: 0.12, ease: 'power2.out', duration: 0.7 }, 2.6);
}

export function initHeroAnimation() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLandingAnimation);
  } else {
    runLandingAnimation();
  }
}
