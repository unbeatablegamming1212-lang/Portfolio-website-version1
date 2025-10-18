// js/app.js

// This is the main orchestrator script.
// It imports modules and decides which ones to run based on the current page.

import { initSmoothScrolling } from './modules/smooth-scroll.js';
import { initNavigation } from './modules/navigation.js';
import { initWebGLBackground } from './modules/webgl-background.js';
// Cursor glow can be removed or kept based on your preference
// import { initCursorGlow } from './modules/cursor-glow.js';
import { initHeroAnimation } from './modules/hero-animation.js';
import { initTechStrip } from './modules/tech-strip.js';
import { initButtonEffects } from './modules/button-effects.js';

// This function runs when the page is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
  // --- GLOBAL INITIALIZATIONS (run on every page) ---
  lucide.createIcons();
  gsap.registerPlugin(ScrollTrigger);

  initSmoothScrolling();
  initNavigation();

  // --- PAGE-SPECIFIC INITIALIZATIONS ---
  // We check if an element unique to the homepage exists.
  if (document.getElementById('hero')) {
    initWebGLBackground(); // Now includes interactive mouse hotspot
    // initCursorGlow(); // Optional: Remove this line if you don't want the glow anymore
    initHeroAnimation();
    initTechStrip();
    initButtonEffects();
  }
});
