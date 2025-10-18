// js/modules/webgl-background.js
export function initWebGLBackground() {
  try {
    const canvas = document.getElementById('shader-canvas');
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl');

    if (gl) {
      // Mouse tracking
      let mouseX = 0.5;
      let mouseY = 0.5;
      let targetX = 0.5;
      let targetY = 0.5;

      window.addEventListener('mousemove', (e) => {
        targetX = e.clientX / window.innerWidth;
        targetY = e.clientY / window.innerHeight;
      });

      function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }

      window.addEventListener('resize', resize);

      function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
      }

      const vertSrc = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';
      
      // Get original shader from HTML and ADD mouse uniforms to it
      const fragShaderEl = document.getElementById('fragShader');
      if (!fragShaderEl) {
        console.warn('Missing fragShader script in HTML');
        return;
      }

      let fragSrc = fragShaderEl.textContent;
      
      // Add mouse uniforms after the existing uniforms
      fragSrc = fragSrc.replace(
        'uniform float iTime;',
        'uniform float iTime;\nuniform vec2 iMouse;\nuniform float iMouseRadius;'
      );
      
      // Add brightness AND size boost calculation right before gl_FragColor
      fragSrc = fragSrc.replace(
        'gl_FragColor = vec4(vec3(s), 1.);',
        `// Mouse interaction - smaller radius, higher brightness, size boost
    vec2 mousePos = iMouse * iResolution;
    float dist = distance(gl_FragCoord.xy, mousePos);
    float hotspot = smoothstep(iMouseRadius, 0.0, dist);
    
    // Brightness boost: +350% at center
    float brightnessBoost = 1.0 + (hotspot * 3.5);
    
    // Size boost: multiply star intensity to make them appear larger
    float sizeBoost = 1.0 + (hotspot * 0.4); // +40% size increase
    s = pow(s * sizeBoost, 1.0) * brightnessBoost;
    
    gl_FragColor = vec4(vec3(s), 1.);`
      );

      const program = gl.createProgram();
      gl.attachShader(program, compileShader(gl, vertSrc, gl.VERTEX_SHADER));
      gl.attachShader(program, compileShader(gl, fragSrc, gl.FRAGMENT_SHADER));
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Program link error: ' + gl.getProgramInfoLog(program));
      }

      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const iResolution = gl.getUniformLocation(program, 'iResolution');
      const iTime = gl.getUniformLocation(program, 'iTime');
      const iMouse = gl.getUniformLocation(program, 'iMouse');
      const iMouseRadius = gl.getUniformLocation(program, 'iMouseRadius');

      let startTime = Date.now();

      function render() {
        const elapsedTime = (Date.now() - startTime) * 0.001;
        
        // Smooth lerp for responsive following
        mouseX += (targetX - mouseX) * 0.15;
        mouseY += (targetY - mouseY) * 0.15;

        gl.uniform2f(iResolution, canvas.width, canvas.height);
        gl.uniform1f(iTime, reducedMotion ? elapsedTime * 0.5 : elapsedTime);
        gl.uniform2f(iMouse, mouseX, 1.0 - mouseY); // Flip Y for screen coords
        gl.uniform1f(iMouseRadius, reducedMotion ? 60 : 120); // REDUCED: 120px radius (was 200px)
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }

      resize();
      requestAnimationFrame(render);
    }
  } catch (error) {
    console.error("WebGL Error:", error);
  }
}
