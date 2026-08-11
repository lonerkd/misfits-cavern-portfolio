import { useEffect, useRef, useState } from 'react';

/**
 * Ported from the Misfits Cavern suite (components/CustomCursor.tsx).
 * A fast dot plus a lagging ring that changes shape to tell you what a
 * target does before you click it. Fine-pointer devices only — touch keeps
 * the native cursor, and reduced-motion turns it off entirely.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [mode, setMode] = useState('default');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const evaluate = () => {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const on = finePointer && !reduced;
      setEnabled(on);
      document.body.classList.toggle('custom-cursor-active', on);
    };
    evaluate();
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener?.('change', evaluate);
    rm.addEventListener?.('change', evaluate);
    return () => {
      mq.removeEventListener?.('change', evaluate);
      rm.removeEventListener?.('change', evaluate);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  const resolveMode = (el) => {
    if (!el) return 'default';
    if (el.closest('input, textarea, [contenteditable="true"]')) return 'text';
    const actionable = el.closest('a, button, [role="button"], [data-cursor="action"]');
    if (actionable) {
      if (actionable.matches('[disabled], [aria-disabled="true"]')) return 'disabled';
      return 'action';
    }
    if (el.closest('[data-cursor="view"]')) return 'view';
    return 'default';
  };

  useEffect(() => {
    if (!enabled) return;
    let raf;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) setVisible(true);
      setMode(prev => { const next = resolveMode(e.target); return next === prev ? prev : next; });
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, [visible, enabled]);

  if (!enabled) return null;

  const accent = 'var(--accent)';
  const isText = mode === 'text';
  const dotColor = mode === 'action' ? accent : mode === 'disabled' ? '#ff5c5c' : 'var(--fg)';

  const ring = (() => {
    switch (mode) {
      case 'action':   return { size: 44, border: `1px solid ${accent}`, radius: '50%', bg: 'transparent' };
      case 'view':     return { size: 58, border: '1px solid rgba(224,221,174,0.5)', radius: '50%', bg: 'rgba(224,221,174,0.04)' };
      case 'disabled': return { size: 30, border: '1.5px solid #ff5c5c', radius: '50%', bg: 'transparent' };
      case 'text':     return { size: 0, border: '1px solid transparent', radius: '50%', bg: 'transparent' };
      default:         return { size: clicking ? 28 : 36, border: '1px solid rgba(224,221,174,0.35)', radius: '50%', bg: 'transparent' };
    }
  })();

  const label = mode === 'view' ? 'PLAY' : '';

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: isText ? 2 : clicking ? 6 : 8,
          height: isText ? 20 : clicking ? 6 : 8,
          borderRadius: isText ? 1 : '50%',
          background: dotColor,
          pointerEvents: 'none', zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'width 0.15s, height 0.15s, background 0.2s, border-radius 0.15s, opacity 0.3s',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: ring.size, height: ring.size,
          borderRadius: ring.radius,
          border: ring.border,
          background: ring.bg,
          pointerEvents: 'none', zIndex: 99998,
          opacity: visible && ring.size > 0 ? 1 : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, background 0.2s, opacity 0.3s',
          willChange: 'transform',
        }}
      >
        {label && (
          <span style={{ fontSize: 7.5, letterSpacing: 1.5, fontWeight: 700, color: 'rgba(224,221,174,0.7)', fontFamily: 'var(--mono)' }}>{label}</span>
        )}
      </div>
    </>
  );
}
