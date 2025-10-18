// This module handles the interactive effects for homepage buttons.

export function initButtonEffects() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const primary = document.getElementById('primary-cta');
  const secondary = document.getElementById('secondary-cta');

  if (primary) {
    // Magnetic pull effect
    primary.addEventListener('mousemove', (e) => {
      const rect = primary.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2));
      const dy = (e.clientY - (rect.top + rect.height / 2));
      const max = 18; // px max translation
      const tx = Math.max(-max, Math.min(max, dx * 0.12));
      const ty = Math.max(-max, Math.min(max, dy * 0.08));
      gsap.to(primary, {
          x: tx,
          y: ty,
          scale: 1.03,
          duration: 0.2,
          ease: 'power2.out'
      });
    });
    primary.addEventListener('mouseleave', () => {
        gsap.to(primary, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
  }

  if (secondary) {
    // Star icon animation
    secondary.addEventListener('mouseenter', () => {
      const star = secondary.querySelector('.star-icon');
      if (star) {
        gsap.to(star, { y: -6, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    });
    secondary.addEventListener('mouseleave', () => {
      const star = secondary.querySelector('.star-icon');
      if (star) {
        gsap.to(star, { y: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
    });
  }
}

