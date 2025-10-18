// This module handles the infinite scrolling tech strip animation.

export function initTechStrip() {
  const section = document.getElementById("tech-strip-section");
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animate the section into view
  gsap.from(section, {
    opacity: 0,
    y: 100,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: 'play reverse play reverse'
    }
  });

  // Stop here if the user prefers reduced motion
  if (reducedMotion) return;

  const rows = gsap.utils.toArray(".tech-row");
  rows.forEach(row => {
    const inner = row.querySelector('.tech-row-inner');
    if (!inner) return;

    // Set initial position based on whether the row is reversed
    gsap.set(inner, { xPercent: row.classList.contains('reverse') ? -50 : 0 });
    
    const scrollAnim = gsap.to(inner, {
      xPercent: row.classList.contains('reverse') ? 0 : -50,
      duration: 40, // Adjust duration for speed
      ease: "none",
      repeat: -1,
    });

    // Slow down the animation on hover
    row.addEventListener('mouseenter', () => scrollAnim.timeScale(0.2));
    row.addEventListener('mouseleave', () => scrollAnim.timeScale(1));
  });
}

