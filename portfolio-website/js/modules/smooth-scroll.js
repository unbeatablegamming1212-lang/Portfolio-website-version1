// This module initializes and manages the Lenis smooth scrolling library.

export function initSmoothScrolling() {
  // Do not initialize if the user prefers reduced motion.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  // Initialize Lenis
  const lenis = new Lenis({
    lerp: 0.1, // Lower values create a smoother, more 'floaty' scroll
    smoothWheel: true,
  });

  // This function is called on every animation frame,
  // which is how Lenis achieves its smooth effect.
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  // Start the animation frame loop.
  requestAnimationFrame(raf);

  // Integrate with GSAP's ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}
