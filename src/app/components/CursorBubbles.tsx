import React, { useEffect, useRef, useCallback } from 'react';

interface Bubble {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    hue: number;
    life: number;
    maxLife: number;
    wobbleSpeed: number;
    wobbleAmount: number;
    phase: number;
}

export const CursorBubbles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bubblesRef = useRef<Bubble[]>([]);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const animationRef = useRef<number>(0);
    const lastSpawnRef = useRef(0);

    const createBubble = useCallback((x: number, y: number): Bubble => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.2;
        const maxLife = 60 + Math.random() * 80;
        return {
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5 - Math.random() * 0.8,
            radius: 3 + Math.random() * 10,
            opacity: 0.4 + Math.random() * 0.4,
            hue: 180 + Math.random() * 40, // cyan-blue range
            life: 0,
            maxLife,
            wobbleSpeed: 0.02 + Math.random() * 0.04,
            wobbleAmount: 1 + Math.random() * 3,
            phase: Math.random() * Math.PI * 2,
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Also resize on scroll height changes
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(document.documentElement);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY + window.scrollY,
            };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = performance.now();

            // Spawn new bubbles at cursor position
            if (now - lastSpawnRef.current > 40 && mouseRef.current.x > 0) {
                for (let i = 0; i < 2; i++) {
                    bubblesRef.current.push(
                        createBubble(mouseRef.current.x, mouseRef.current.y)
                    );
                }
                lastSpawnRef.current = now;
            }

            // Cap max bubbles
            if (bubblesRef.current.length > 120) {
                bubblesRef.current = bubblesRef.current.slice(-120);
            }

            // Update and draw
            bubblesRef.current = bubblesRef.current.filter((b) => {
                b.life++;
                if (b.life > b.maxLife) return false;

                // Physics
                b.x += b.vx + Math.sin(b.life * b.wobbleSpeed + b.phase) * b.wobbleAmount * 0.3;
                b.y += b.vy;
                b.vy -= 0.005; // slight float up
                b.vx *= 0.995;
                b.vy *= 0.995;

                // Fade in/out
                const lifeRatio = b.life / b.maxLife;
                let alpha: number;
                if (lifeRatio < 0.1) {
                    alpha = b.opacity * (lifeRatio / 0.1);
                } else if (lifeRatio > 0.6) {
                    alpha = b.opacity * (1 - (lifeRatio - 0.6) / 0.4);
                } else {
                    alpha = b.opacity;
                }

                // Shrink near end
                const scale = lifeRatio > 0.7 ? 1 - (lifeRatio - 0.7) / 0.3 : 1;
                const r = b.radius * scale;

                if (r <= 0 || alpha <= 0) return false;

                // Draw bubble with gradient
                const gradient = ctx.createRadialGradient(
                    b.x - r * 0.3, b.y - r * 0.3, r * 0.1,
                    b.x, b.y, r
                );
                gradient.addColorStop(0, `hsla(${b.hue}, 80%, 75%, ${alpha * 0.9})`);
                gradient.addColorStop(0.5, `hsla(${b.hue}, 70%, 60%, ${alpha * 0.5})`);
                gradient.addColorStop(1, `hsla(${b.hue}, 60%, 50%, ${alpha * 0.05})`);

                ctx.beginPath();
                ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Highlight / shine
                ctx.beginPath();
                ctx.arc(b.x - r * 0.25, b.y - r * 0.25, r * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${b.hue}, 90%, 90%, ${alpha * 0.6})`;
                ctx.fill();

                return true;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationRef.current);
        };
    }, [createBubble]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 50,
            }}
        />
    );
};
