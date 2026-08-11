import { useEffect, useRef } from 'react';

/**
 * Canvas dot-grid background — replaces the floating-photo-field idea with
 * something lighter: a dim grid of dots that blooms into the hovered
 * project's colour around the cursor, like the reference glow cluster.
 * Static (one draw, no rAF loop) when the OS asks for reduced motion.
 */
export default function DotField({ color }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const eased = useRef({ x: -9999, y: -9999 });
  const colorRef = useRef(color);
  const rafRef = useRef(null);

  useEffect(() => { colorRef.current = color; }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SPACING = 30;
    const GLOW_RADIUS = 210;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(true);
    };

    const onMove = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999; };

    function draw(instant) {
      const c = colorRef.current || { r: 215, g: 52, b: 11 };
      if (instant) { eased.current.x = mouse.current.x; eased.current.y = mouse.current.y; }
      else {
        eased.current.x += (mouse.current.x - eased.current.x) * 0.14;
        eased.current.y += (mouse.current.y - eased.current.y) * 0.14;
      }
      const { x: mx, y: my } = eased.current;

      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING;
          const y = j * SPACING;
          const d = Math.hypot(x - mx, y - my);
          const t = Math.max(0, 1 - d / GLOW_RADIUS); // 0 far, 1 at cursor
          const eased_t = t * t; // ease-in — glow feels concentrated, not smeared

          const baseA = 0.10;
          const alpha = baseA + eased_t * 0.75;
          const r = 1.1 + eased_t * 1.6;

          if (eased_t > 0.02) {
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha.toFixed(3)})`;
          } else {
            ctx.fillStyle = `rgba(224,221,174,${baseA})`;
          }
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      // Static grid, no cursor bloom, no rAF loop.
      draw(true);
    } else {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);
      const loop = () => { draw(false); rafRef.current = requestAnimationFrame(loop); };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}
    />
  );
}
