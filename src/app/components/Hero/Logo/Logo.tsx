'use client'
import { useRef, useLayoutEffect } from 'react' // Changed to useLayoutEffect
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Logo.module.css'

gsap.registerPlugin(ScrollTrigger);

interface LogoProps {
    className?: string
    width?: number
    height?: number
}

export default function Logo({ className, width = 420, height = 219 }: LogoProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    
    const rendererRef = useRef<any>(null);
    const animationIdRef = useRef<number | null>(null);
    const isAnimatingRef = useRef(true); // Start true since it's in the Hero

    useLayoutEffect(() => {
        const THREE = (window as any).THREE;
        if (!THREE) {
          console.error("THREE.js not loaded.");
          return;
        }
        if (!containerRef.current) return;

        const currentContainer = containerRef.current;

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
        rendererRef.current = renderer;

        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        
        if (currentContainer.childElementCount === 0) {
          currentContainer.appendChild(renderer.domElement);
        }

        camera.position.z = 2.5

        const mouse = new THREE.Vector2()
        let mouseWorldPos = new THREE.Vector3(999, 999, 0)
        let isMouseInside = false

        function updateMouse(event: MouseEvent) {
            const rect = currentContainer.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / width) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / height) * 2 + 1
            isMouseInside = true
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
            vector.unproject(camera)
            const dir = vector.sub(camera.position).normalize()
            const distance = -camera.position.z / dir.z
            mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance))
        }

        function handleMouseLeave(): void {
            isMouseInside = false
            mouseWorldPos.set(999, 999, 0)
        }

        currentContainer.addEventListener('mousemove', updateMouse)
        currentContainer.addEventListener('mouseleave', handleMouseLeave)

        function createLogoTexture() {
          const scale = 2;
          const canvas = document.createElement('canvas');
          canvas.width = 420 * scale;
          canvas.height = 219 * scale;
          const ctx = canvas.getContext('2d');
          if (!ctx) return null; // Safety check
          
          ctx.scale(scale, scale);
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.clearRect(0, 0, 420, 219);
          ctx.fillStyle = '#F1F1F1';
          const path = new Path2D('M351.556 0.491638H89.1852V43.485H341.185C364 43.485 395.457 57.4749 395.457 83.7486C395.457 107.002 373.621 130.495 351.556 130.495C349.136 130.495 341.908 130.577 331.571 130.694C295.201 131.106 220.338 131.953 180.916 131.207C180.877 131.188 180.835 131.178 180.79 131.178C110.818 130.799 90.6916 74.1642 90.5679 44.9016V44.5892C90.5679 44.3307 90.42 44.0944 90.1857 43.9788C89.9911 43.8827 89.762 43.8827 89.5674 43.9788C89.3331 44.0944 89.1852 44.3307 89.1852 44.5892V44.9016C89.1852 113.359 30.129 130.419 0.518519 131.178C-0.17284 131.178 -0.17284 132.629 0.518519 132.629C71.3136 132.629 88.4938 188.93 88.4938 218.188C88.4938 218.871 89.8765 218.871 89.8765 218.188C90.2688 149.66 151.178 134.034 180.636 133.569L180.932 133.567C181.044 133.567 181.113 133.566 181.136 133.566H269.63C366.765 133.566 368.148 218.529 368.148 218.529H420C420 150.742 372.477 133.68 348.239 133.566H351.556C374.37 132.77 420 118.553 420 68.0526C420 17.5525 374.37 1.97025 351.556 0.491638Z');
          ctx.fill(path);
          const gradient = ctx.createLinearGradient(144.494, 44.5086, 73.0597, 136.175);
          gradient.addColorStop(0, 'rgba(241, 241, 241, 0)');
          gradient.addColorStop(1, '#04D9FF');
          ctx.fillStyle = gradient;
          ctx.fill(path);
          const texture = new THREE.CanvasTexture(canvas);
          texture.flipY = false;
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          return texture;
        }
        
        const tiles: any[] = [];
        const gridSize = 6;
        const logoWidth = 5.25;
        const logoHeight = 2.7375;
        const tileWidth = logoWidth / gridSize;
        const tileHeight = logoHeight / gridSize;

        const logoTexture = createLogoTexture();
        if (logoTexture) { // Safety check
            for (let x = 0; x < gridSize; x++) {
                for (let y = 0; y < gridSize; y++) {
                const uLeft = x / gridSize;
                const uRight = (x + 1) / gridSize;
                const vBottom = y / gridSize;
                const vTop = (y + 1) / gridSize;
                const geometry = new THREE.PlaneGeometry(tileWidth, tileHeight);
                const uvAttribute = geometry.attributes.uv;
                const uvArray = uvAttribute.array;
                uvArray[0] = uLeft; uvArray[1] = vBottom;
                uvArray[2] = uRight; uvArray[3] = vBottom;
                uvArray[4] = uLeft; uvArray[5] = vTop;
                uvArray[6] = uRight; uvArray[7] = vTop;
                uvAttribute.needsUpdate = true;
                const fragmentShader = `
                    uniform sampler2D map;
                    uniform vec2 tileOffset;
                    uniform float glowStrength;
                    varying vec2 vUv;
                    void main() {
                    vec2 aberration = tileOffset * 0.05;
                    float r = texture2D(map, vUv + aberration * -3.0).r;
                    float g = texture2D(map, vUv + aberration * 1.0).g;
                    float b = texture2D(map, vUv + aberration * 0.5).b;
                    float a = texture2D(map, vUv).a;
                    vec4 color = vec4(r, g, b, a);
                    if (glowStrength > 0.0) {
                        vec3 glowColor = vec3(0.0, 0.8, 1.0);
                        color.rgb += glowColor * glowStrength * 0.5;
                        vec2 center = vUv - 0.5;
                        float distance = length(center) * 2.0;
                        float edgeGlow = 1.0 - smoothstep(0.0, 1.0, distance);
                        color.rgb += glowColor * edgeGlow * glowStrength * 0.8;
                    }
                    gl_FragColor = color;
                    }
                `;
                const vertexShader = `
                    varying vec2 vUv;
                    void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `;
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                    map: { value: logoTexture },
                    tileOffset: { value: new THREE.Vector2(0, 0) },
                    glowStrength: { value: 0.0 }
                    },
                    vertexShader,
                    fragmentShader,
                    transparent: true
                });
                const tileMesh = new THREE.Mesh(geometry, material);
                const worldX = (x - gridSize / 2 + 0.5) * tileWidth;
                const worldY = (gridSize / 2 - y - 0.5) * tileHeight;
                tileMesh.position.set(worldX, worldY, 0);
                tileMesh.userData = {
                    originalPos: new THREE.Vector3(worldX, worldY, 0),
                    tileID: new THREE.Vector2(x, y),
                    targetOffset: new THREE.Vector3(0, 0, 0),
                    currentOffset: new THREE.Vector3(0, 0, 0),
                    velocity: new THREE.Vector3(0, 0, 0),
                    isSettling: false
                };
                tiles.push(tileMesh);
                scene.add(tileMesh);
                }
            }
        }

        const animate = () => {
            if (!isAnimatingRef.current) {
                animationIdRef.current = null;
                return;
            }

            animationIdRef.current = requestAnimationFrame(animate);

            tiles.forEach((tile) => {
                const userData = tile.userData;
                const tileCenter = userData.originalPos;
                const dist = isMouseInside ? mouseWorldPos.distanceTo(tileCenter) : 999;
                const effect = Math.exp(-dist * 3.0) * 2.0;
                const movementIntensity = userData.currentOffset.length();
                const glowStrength = Math.min(movementIntensity * 5.0, 1.0);
                if (effect > 0.01) {
                    userData.isSettling = false;
                    userData.velocity.set(0, 0, 0);
                    const seed = userData.tileID.x * 12.9898 + userData.tileID.y * 78.233;
                    const randVal = (Math.sin(seed) * 43758.5453) % 1;
                    const angle = randVal * Math.PI * 2 + Date.now() * 0.0005;
                    userData.targetOffset.x = Math.cos(angle) * effect * 0.8;
                    userData.targetOffset.y = Math.sin(angle) * effect * 0.8;
                    userData.currentOffset.lerp(userData.targetOffset, 0.1);
                } else {
                    userData.targetOffset.set(0, 0, 0);
                    userData.isSettling = true;
                    const springStrength = 0.02;
                    const damping = 0.85;
                    const springForce = userData.targetOffset.clone().sub(userData.currentOffset).multiplyScalar(springStrength);
                    userData.velocity.multiplyScalar(damping);
                    userData.velocity.add(springForce);
                    userData.currentOffset.add(userData.velocity);
                    if (userData.currentOffset.length() < 0.01 && userData.velocity.length() < 0.01) {
                        userData.currentOffset.set(0, 0, 0);
                        userData.velocity.set(0, 0, 0);
                        userData.isSettling = false;
                    }
                }
                tile.position.copy(userData.originalPos).add(userData.currentOffset);
                const material = tile.material as any;
                material.uniforms.tileOffset.value.set(userData.currentOffset.x, userData.currentOffset.y);
                material.uniforms.glowStrength.value = glowStrength;
            });

            renderer.render(scene, camera);
        }

        const trigger = ScrollTrigger.create({
            trigger: currentContainer,
            start: "top bottom", 
            end: "bottom top", 
            onEnter: () => {
                isAnimatingRef.current = true;
                if (!animationIdRef.current) animate();
            },
            onLeave: () => {
                isAnimatingRef.current = false;
            },
            onEnterBack: () => {
                isAnimatingRef.current = true;
                if (!animationIdRef.current) animate();
            },
            onLeaveBack: () => {
                isAnimatingRef.current = false; // Pause when scrolling back up past it? 
                isAnimatingRef.current = false; 
            }
        });

        animate();

        return () => {
            trigger.kill(); // Kill ScrollTrigger
            isAnimatingRef.current = false; // Stop loop
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            
            currentContainer.removeEventListener('mousemove', updateMouse);
            currentContainer.removeEventListener('mouseleave', handleMouseLeave);
            
            if (rendererRef.current) {
                if (currentContainer.contains(rendererRef.current.domElement)) {
                    currentContainer.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current.dispose();
            }

            scene.traverse((object: any) => {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((material: any) => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            });
        }
    }, [width, height]) 

    return (
      <div 
        ref={containerRef} 
        className={`${styles.logoContainer} ${className || ''}`}
        style={{ width, height }}
      />
    )
}