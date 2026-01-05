'use client'; 

import { useRef, useLayoutEffect } from 'react'; 
import { gsap } from 'gsap';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const WebGL_Gradient = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isActiveRef = useRef(true); 

    const getScroll = () => {
        const smoother = ScrollSmoother.get();
        return smoother ? smoother.scrollTop() : window.pageYOffset || document.documentElement.scrollTop;
    };

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { 
            alpha: false, 
            antialias: false,
            powerPreference: "low-power",
            failIfMajorPerformanceCaveat: false
        });
        
        if (!gl) return;

        const resize = () => {
            const dpr = 0.5; 
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const vertexShaderSource = `
          attribute vec2 a_position;
          varying vec2 v_uv;
          void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `;
        const fragmentShaderSource = `
          precision mediump float;
          uniform float u_time;
          uniform float u_scroll;
          varying vec2 v_uv;
          void main() {
            vec2 uv = v_uv;
            float x = uv.x;
            float y = uv.y;
            float scrollFactor = clamp(u_scroll * 0.0008, 0.0, 1.0);
            float curveShift = scrollFactor * 0.6;
            float curveY = 1.0 - pow(x, 0.4 - curveShift);
            float boundaryShift = scrollFactor * 0.8;
            float boundary = (curveY - y) - boundaryShift;
            float gradientMask = smoothstep(-0.1, 0.2, boundary);
            gradientMask *= (1.0 - scrollFactor * 0.8);
            float distanceFromCorner = length(uv - vec2(0.0, 0.0));
            float colorProgress = distanceFromCorner / 0.8;
            colorProgress = clamp(colorProgress, 0.0, 1.0);
            colorProgress = smoothstep(0.0, 1.0, colorProgress);
            vec3 brightCyan = vec3(0.016, 0.851, 1.0);
            vec3 midBlue = vec3(0.039, 0.153, 0.694);
            vec3 deepestPurple = vec3(0.059, 0.004, 0.271);
            float cyanToMid = smoothstep(0.0, 0.4, colorProgress);
            float midToDark = smoothstep(0.1, 1.0, colorProgress);
            vec3 gradientColor = brightCyan;
            gradientColor = mix(gradientColor, midBlue, cyanToMid);
            gradientColor = mix(gradientColor, deepestPurple, midToDark);
            vec3 backgroundColor = vec3(0.043,0.043,0.043);
            vec3 finalColor = mix(backgroundColor, gradientColor, gradientMask);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `;

        const createShader = (type: number, source: string) => {
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

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;
        
        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const startTime = Date.now();
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const scrollLocation = gl.getUniformLocation(program, 'u_scroll');

        const render = () => {
            if (!isActiveRef.current) return;

            gl.useProgram(program);
            const currentTime = (Date.now() - startTime) * 0.001;
            
            if (timeLocation) gl.uniform1f(timeLocation, currentTime);
            if (scrollLocation) gl.uniform1f(scrollLocation, getScroll());
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        
        gsap.ticker.add(render);

        const trigger = ScrollTrigger.create({
          trigger: document.body,
          start: 0,
          end: 1000, 
          onEnter: () => { isActiveRef.current = true; },
          onLeave: () => { isActiveRef.current = false; },
          onEnterBack: () => { isActiveRef.current = true; },
          onLeaveBack: () => { isActiveRef.current = true; }
        });

        return () => {
            window.removeEventListener('resize', resize);
            gsap.ticker.remove(render);
            trigger.kill();
            
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
        };
    }, []); 

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
};

export default WebGL_Gradient;