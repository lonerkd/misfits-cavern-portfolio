import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor — a fast dot plus a lagging ring that morphs to tell you
 * what a target does before you click. Fine-pointer devices only; touch
 * keeps the native cursor, reduced-motion turns it off entirely.
 *
 * Every interactive element sets a `data-cursor` attribute to signal its
 * action, and the ring shows a matching label:
 *   play  -> "PLAY"    (video cards)
 *   read  -> "READ"    (public scripts / full reads)
 *   req   -> "REQUEST" (private scripts — request access)
 *   open  -> "OPEN"    (external links)
 *   close -> "CLOSE"   (dismiss / close)
 *   view  -> "VIEW"    (gallery stills)
 *   action-> (no label, accent ring) for generic buttons/links
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [mode, setMode] = useState('default');
  const [label, setLabel] = useState('');
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

  const LABELS = { play: 'PLAY', read: 'READ', req: 'REQUEST', open: 'OPEN', close: 'CLOSE', view: 'VIEW' };

  const resolve = (el) => {
    if (!el) return { mode: 'default', label: '' };
    if (el.closest('input, textarea, [contenteditable="true"]')) return { mode: 'text', label: '' };

    // data-cursor attribute on the element or any ancestor
    const tagged = el.closest('[data-cursor]');
    const tag = tagged?.getAttribute('data-cursor');
    if (tag) {
      if (tag === 'action') return { mode: 'action', label: '' };
      if (LABELS[tag]) return { mode: tag, label: LABELS[tag] };
      return { mode: 'action', label: '' };
    }

    const disabled = el.closest('[disabled], [aria-disabled="true"]');
    if (disabled) return { mode: 'disabled', label: '' };

    const actionable = el.closest('a, button, [role="button"]');
    if (actionable) return { mode: 'action', label: '' };

    return { mode: 'default', label: '' };
  };

  useEffect(() => {
    if (!enabled) return;
    let raf;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) setVisible(true);
      const next = resolve(e.target);
      setMode(prev => (next.mode === prev && next.label === label ? prev : next.mode));
      setLabel(prev => (next.label === prev ? prev : next.label));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, visible]);

  if (!enabled) return null;

  const accent = 'var(--accent)';
  const isText = mode === 'text';
  const dotColor = mode === 'action' ? accent : mode === 'disabled' ? '#ff5c5c' : 'var(--fg)';

  const ring = (() => {
    const labelled = ['play', 'read', 'req', 'open', 'close', 'view'].includes(mode);
    switch (mode) {
      case 'action':   return { size: 44, border: `1px solid ${accent}`, radius: '50%', bg: 'transparent' };
      case 'play':     return { size: 58, border: '1px solid rgba(224,221,174,0.5)', radius: '50%', bg: 'rgba(224,221,174,0.04)' };
      case 'read':     return { size: 58, border: '1px solid #10b981', radius: '50%', bg: 'rgba(16,185,129,0.06)' };
      case 'req':      return { size: 62, border: '1px solid #f59e0b', radius: '50%', bg: 'rgba(245,158,11,0.06)' };
      case 'open':     return { size: 54, border: '1px solid #6366f1', radius: '50%', bg: 'rgba(99,102,241,0.06)' };
      case 'close':    return { size: 48, border: '1px solid #ff5c5c', radius: '50%', bg: 'rgba(255,92,92,0.06)' };
      case 'view':     return { size: 54, border: '1px solid rgba(224,221,174,0.4)', radius: '50%', bg: 'rgba(224,221,174,0.03)' };
      case 'disabled': return { size: 30, border: '1.5px solid #ff5c5c', radius: '50%', bg: 'transparent' };
      case 'text':     return { size: 0, border: '1px solid transparent', radius: '50%', bg: 'transparent' };
      default:         return { size: clicking ? 28 : 36, border: '1px solid rgba(224,221,174,0.35)', radius: '50%', bg: 'transparent' };
    }
  })();

  const labelColor = (() => {
    switch (mode) {
      case 'read': return '#10b981';
      case 'req':  return '#f59e0b';
      case 'open': return '#6366f1';
      case 'close':return '#ff5c5c';
      default:     return 'rgba(224,221,174,0.7)';
    }
  })();

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
          <span style={{ fontSize: 7.5, letterSpacing: 1.5, fontWeight: 700, color: labelColor, fontFamily: 'var(--mono)' }}>{label}</span>
        )}
      </div>
    </>
  );
}