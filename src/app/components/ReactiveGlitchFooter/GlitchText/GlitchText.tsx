'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GlitchTextProps {
  text?: string;
  className?: string;
}

export default function GlitchText({ 
  text = 'Ramneek', 
  className = '' 
}: GlitchTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize WebGL
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // 2. Resize Handler
    const resizeCanvas = () => {
      // Cap DPR at 2 for performance on high-res screens
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = 700 * dpr;
      canvas.height = 400 * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();

    // --- SHADERS ---
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_aberration;
      uniform float u_bloom;
      uniform float u_glitch;
      uniform float u_scanlines;
      uniform float u_brightness;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      float random2(vec2 st) {
        return fract(sin(dot(st.xy, vec2(39.346, 11.135))) * 73156.8473192);
      }
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        f = f * f * (3.0 - 2.0 * f);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      void main() {
        vec2 uv = v_texCoord;
        float wave = sin(uv.y * 10.0 + u_time * 0.5) * 0.001;
        uv.x += wave;
        
        float aberrationAmount = u_aberration / u_resolution.x;
        vec2 offsetR = vec2(-aberrationAmount * 2.0, 0.0);
        vec2 offsetG = vec2(aberrationAmount * 0.3, 0.0);
        vec2 offsetB = vec2(aberrationAmount * 2.0, 0.0);
        
        float verticalShift = sin(u_time * 2.0) * 0.003;
        offsetR.y += verticalShift * 0.8;
        offsetB.y -= verticalShift * 0.8;
        
        float glitchRow = floor(uv.y * 100.0);
        float glitchDisplace = 0.0;
        if(random(vec2(glitchRow, floor(u_time * 5.0))) > 0.95) {
          glitchDisplace = (random2(vec2(glitchRow, u_time)) - 0.5) * 0.03 * u_glitch;
        }
        
        float r = texture2D(u_texture, uv + offsetR + vec2(glitchDisplace, 0.0)).r;
        float g = texture2D(u_texture, uv + offsetG).g;
        float b = texture2D(u_texture, uv + offsetB - vec2(glitchDisplace, 0.0)).b;
        
        vec3 color = vec3(r, g, b);
        float textMask = max(max(r, g), b);
        
        // Bloom
        vec3 bloomAccum = vec3(0.0);
        float bloomRadius = u_bloom * 0.012;
        for(int i = 0; i < 8; i++) {
          float angle = float(i) * 3.14159 * 2.0 / 8.0;
          vec2 offset = vec2(cos(angle), sin(angle)) * bloomRadius * 1.0;
          bloomAccum.r += texture2D(u_texture, uv + offset + offsetR).r;
          bloomAccum.g += texture2D(u_texture, uv + offset + offsetG).g;
          bloomAccum.b += texture2D(u_texture, uv + offset + offsetB).b;
        }
        color += bloomAccum * 0.8 / 8.0;
        
        // Scanlines & Noise
        float scanlineFreq = u_resolution.y * 0.7;
        float scanlinePattern = sin(uv.y * scanlineFreq + u_time * 0.1);
        color *= mix(1.0, pow((scanlinePattern * 0.5 + 0.5), 0.4), u_scanlines);
        
        float grain = (random(uv * u_time) - 0.5) * 0.05;
        color += grain * u_glitch * 0.5;
        
        color = pow(color, vec3(0.85)) * u_brightness;
        gl_FragColor = vec4(color, textMask);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Buffers
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const aberrationLocation = gl.getUniformLocation(program, 'u_aberration');
    const bloomLocation = gl.getUniformLocation(program, 'u_bloom');
    const glitchLocation = gl.getUniformLocation(program, 'u_glitch');
    const scanlinesLocation = gl.getUniformLocation(program, 'u_scanlines');
    const brightnessLocation = gl.getUniformLocation(program, 'u_brightness');

    // Text Texture
    const createTextTexture = (text: string) => {
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 2048;
      textCanvas.height = 1024;
      const ctx = textCanvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      ctx.fillStyle = 'white';
      ctx.font = 'italic bold 510px "Benton Modern Display", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return texture;
    };

    const texture = createTextTexture(text);
    if (!texture) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // --- RENDER LOOP WITH VISIBILITY CHECK ---
    const startTime = Date.now();
    let animationId: number;
    let isVisible = false; // Start invisible, ScrollTrigger will enable

    const render = () => {
      if (!isVisible) return; // Stop drawing if off-screen

      const time = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      
      gl.uniform1f(aberrationLocation, 2.6);
      gl.uniform1f(bloomLocation, 0.25);
      gl.uniform1f(glitchLocation, 0.3);
      gl.uniform1f(scanlinesLocation, 0.55);
      gl.uniform1f(brightnessLocation, 1.2);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };

    // --- PAUSE WHEN SCROLLED AWAY ---
    const trigger = ScrollTrigger.create({
      trigger: canvas,
      start: "top bottom", // When top of text hits bottom of screen
      end: "bottom top",   // When bottom of text hits top of screen
      onEnter: () => {
        isVisible = true;
        if (!animationId) render();
      },
      onLeave: () => {
        isVisible = false;
        // Optionally cancel loop here, but boolean check is safer/faster
      },
      onEnterBack: () => {
        isVisible = true;
        if (!animationId) render();
      },
      onLeaveBack: () => {
        isVisible = false;
      }
    });

    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      trigger.kill();

      // IMPORTANT: Free GPU memory
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
      if (texture) gl.deleteTexture(texture);
    };
  }, [text]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ width: '99%', height: '500px', display: 'block', pointerEvents: 'none', margin: '0 auto' }}
    />
  );
}