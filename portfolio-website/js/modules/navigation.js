// js/modules/navigation.js
// Premium navigation bar with buttery-smooth scroll-based reveal/hide

function enableNavScrollAnimation() {
  const header = document.querySelector('header');
  if (!header) return;

  const nav = header.querySelector('nav');
  let lastScrollY = window.scrollY;
  let ticking = false;
  let isNavHidden = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Force glass morphism styles + smooth transform origin
  nav.style.cssText += `
    background: rgba(16, 16, 24, 0.75) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    transform-origin: center center !important;
  `;

  // Smooth, professional transitions
  header.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
  nav.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 0.4s ease-out, background-color 0.4s ease-out';

  if (reducedMotion) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        nav.style.backdropFilter = 'blur(28px) saturate(200%)';
        nav.style.webkitBackdropFilter = 'blur(28px) saturate(200%)';
        nav.style.background = 'rgba(16, 16, 24, 0.85)';
      } else {
        nav.style.backdropFilter = 'blur(20px) saturate(180%)';
        nav.style.webkitBackdropFilter = 'blur(20px) saturate(180%)';
        nav.style.background = 'rgba(16, 16, 24, 0.75)';
      }
    }, { passive: true });
    return;
  }

  // Smooth scroll handler with refined thresholds
  function updateNav() {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;

    // Smooth blur + scale transition
    if (currentScrollY > 10) {
      nav.style.transform = 'scale(0.96)';
      nav.style.backdropFilter = 'blur(28px) saturate(200%)';
      nav.style.webkitBackdropFilter = 'blur(28px) saturate(200%)';
      nav.style.background = 'rgba(16, 16, 24, 0.85)';
    } else {
      nav.style.transform = 'scale(1)';
      nav.style.backdropFilter = 'blur(20px) saturate(180%)';
      nav.style.webkitBackdropFilter = 'blur(20px) saturate(180%)';
      nav.style.background = 'rgba(16, 16, 24, 0.75)';
    }

    // Seamless hide/show based on scroll direction
    if (currentScrollY > 100) {
      if (scrollDifference > 3 && !isNavHidden) {
        // Scrolling DOWN - hide navbar
        header.style.transform = 'translateX(-50%) translateY(-120%)';
        header.style.opacity = '0';
        isNavHidden = true;
      } else if (scrollDifference < -3 && isNavHidden) {
        // Scrolling UP - show navbar
        header.style.transform = 'translateX(-50%) translateY(0)';
        header.style.opacity = '1';
        isNavHidden = false;
      }
    } else {
      // Always visible near top
      header.style.transform = 'translateX(-50%) translateY(0)';
      header.style.opacity = '1';
      isNavHidden = false;
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  // Throttle with requestAnimationFrame for 60fps smoothness
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
}

export function initNavigation() {
  enableNavScrollAnimation();
}
