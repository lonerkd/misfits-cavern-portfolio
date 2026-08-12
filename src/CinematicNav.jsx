import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/* CinematicNav — Apple-style scroll puck, ported from the suite.
   Tap  = spring to the next logical frame (section / bento item).
   Hold = smooth fast-scroll. At page bottom, tap returns to top. */
export default function CinematicNav() {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const holdTimer = useRef(null);
  const holding = useRef(false);
  const raf = useRef(null);
  const anim = useRef(null);
  const downAt = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      setAtBottom(window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => () => {
    clearTimeout(holdTimer.current);
    cancelAnimationFrame(raf.current);
    cancelAnimationFrame(anim.current);
  }, []);

  const stopAll = () => {
    holding.current = false;
    clearTimeout(holdTimer.current);
    cancelAnimationFrame(raf.current);
    cancelAnimationFrame(anim.current);
  };

  const glideTo = target => {
    cancelAnimationFrame(anim.current);
    const start = window.scrollY;
    const dist = target - start;
    const t0 = performance.now();
    const dur = Math.min(850, 320 + Math.abs(dist) * 0.1);
    const ease = t => 1 - Math.pow(1 - t, 4);
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      window.scrollTo({ top: start + dist * ease(t), behavior: 'auto' });
      if (t < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  };

  const nextFrame = () => {
    const cur = window.scrollY;
    const els = Array.from(document.querySelectorAll('section, footer, .mc-bento > *'));
    const positions = els
      .map(el => Math.round((el.getBoundingClientRect().top + cur - 70) / 10) * 10)
      .filter(p => p > cur + 40);
    const next = [...new Set(positions)].sort((a, b) => a - b)[0];
    glideTo(next !== undefined ? next : cur + window.innerHeight * 0.8);
  };

  const down = e => {
    if (e.button !== undefined && e.button !== 0) return;
    setPressed(true);
    downAt.current = Date.now();
    stopAll();
    holdTimer.current = setTimeout(() => {
      holding.current = true;
      const tick = () => {
        if (!holding.current) return;
        window.scrollBy({ top: 7, behavior: 'auto' });
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, 250);
  };

  const up = () => {
    setPressed(false);
    const wasHolding = holding.current;
    stopAll();
    if (wasHolding) return;
    if (Date.now() - downAt.current < 250) {
      if (atBottom) window.scrollTo({ top: 0, behavior: 'smooth' });
      else nextFrame();
    }
  };

  return (
    <div className="mc-puck" style={{ position: 'fixed', bottom: 34, right: 34, zIndex: 9000 }}>
      <button
        aria-label="Scroll to next section"
        data-cursor="action"
        onPointerDown={down}
        onPointerUp={up}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => { setHovered(false); setPressed(false); stopAll(); }}
        onContextMenu={e => e.preventDefault()}
        style={{
          width: 54, height: 54, borderRadius: '50%',
          background: pressed ? 'rgba(215,52,11,0.18)' : 'rgba(4,7,13,0.6)',
          border: `1px solid ${hovered || pressed ? 'rgba(215,52,11,0.5)' : 'rgba(224,221,174,0.12)'}`,
          backdropFilter: 'blur(20px) saturate(1.6)', WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          transition: 'background 0.3s, border-color 0.3s, transform 0.2s',
          transform: pressed ? 'scale(0.92)' : hovered ? 'scale(1.06)' : 'scale(1)',
          touchAction: 'none', cursor: 'pointer', color: 'var(--fg)',
        }}
      >
        <ChevronDown size={18} style={{
          transform: atBottom ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s',
          color: hovered || pressed ? 'var(--accent)' : 'rgba(224,221,174,0.7)',
        }} />
      </button>
    </div>
  );
}