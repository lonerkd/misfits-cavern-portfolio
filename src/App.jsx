import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, ExternalLink, X, Film, Mail, FileText, ChevronLeft, Images } from 'lucide-react';
import CustomCursor from './CustomCursor.jsx';
import DotField from './DotField.jsx';
import StarField from './StarField.jsx';
import CinematicNav from './CinematicNav.jsx';
import { VIDEOS, FEATURED_ID, CREW_CREDITS, WRITING, OTHER_WRITING, SKILL_GROUPS, FACTS, EMAIL, SOCIALS } from './content.js';
import { thumbUrl, thumbFallback, embedUrl, watchUrl, tintFor, extractColor } from './media.js';

const FEATURED = VIDEOS.find(v => v.id === FEATURED_ID);
const REST = VIDEOS.filter(v => v.id !== FEATURED_ID);

/* ─── Scroll reveal ─────────────────────────────────────── */
function Reveal({ children, delay = 0, style, className = '' }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal${seen ? ' in' : ''} ${className}`.trim()} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ text, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
      <div style={{ width:22, height:1, background:'var(--accent)', flexShrink:0 }} />
      <span style={{ fontSize:8.5, letterSpacing:3.5, textTransform:'uppercase', color:'var(--accent)', whiteSpace:'nowrap' }}>{text}</span>
      <div style={{ flex:1, height:1, background:'var(--border)' }} />
      {right && <span style={{ fontSize:8, letterSpacing:2, textTransform:'uppercase', color:'var(--fg-dim)', whiteSpace:'nowrap' }}>{right}</span>}
    </div>
  );
}

/* ─── Thumbnail with double fallback ────────────────────── */
function Thumb({ v, style = {} }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div style={{ ...style, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(150deg, var(--bg-3), var(--bg-4))' }}>
        <Film size={26} color="var(--fg-ghost)" />
      </div>
    );
  }
  return (
    <img src={thumbUrl(v)} alt={v.title} loading="lazy"
      style={{ objectFit:'cover', objectPosition: v.pos || 'center', display:'block', ...style }}
      onError={e => {
        if (!e.target.dataset.fb) { e.target.dataset.fb = '1'; e.target.src = thumbFallback(v); }
        else setFailed(true);
      }}
    />
  );
}

/* ─── Work card ─────────────────────────────────────────── */
function VCard({ v, onClick, big, onTint }) {
  const [h, setH] = useState(false);
  const [color, setColor] = useState(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const ref = useRef(null);

  useEffect(() => {
    let live = true;
    extractColor(v).then(c => { if (live) setColor(c || tintFor(v)); });
    return () => { live = false; };
  }, [v]);

  const c = color || tintFor(v);
  const rgba = a => `rgba(${c.r},${c.g},${c.b},${a})`;

  const handleMove = useCallback(e => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  return (
    <button
      ref={ref}
      className="film-chrome"
      data-cursor="play"
      aria-label={`Play ${v.title}`}
      onMouseEnter={() => { setH(true); onTint?.(c); }}
      onMouseLeave={() => { setH(false); onTint?.(null); }}
      onMouseMove={handleMove}
      onClick={() => onClick(v, c)}
      style={{
        position:'relative', overflow:'hidden', textAlign:'left',
        aspectRatio:'16/9', background:'var(--bg-2)',
        border:`1px solid ${h ? rgba(0.32) : 'var(--border)'}`,
        borderRadius:'var(--r-md)',
        padding:0, width:'100%', display:'block', height:'100%',
        transition:'border-color 0.5s var(--ease-expo), transform 0.35s var(--ease-expo), box-shadow 0.5s var(--ease-expo)',
        transform: h ? 'translateY(-4px)' : 'none',
        boxShadow: h ? `0 22px 55px rgba(0,0,0,0.6), 0 0 60px ${rgba(0.14)}` : '0 8px 24px rgba(0,0,0,0.35)',
        cursor:'pointer',
      }}
    >
      <Thumb v={v} style={{
        position:'absolute', inset:0, width:'100%', height:'100%',
        transition:'transform 0.8s var(--ease-expo), filter 0.6s',
        transform: h ? 'scale(1.045)' : 'scale(1)',
        filter: h ? 'brightness(0.52)' : 'brightness(0.42)',
      }} />

      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(to top, rgba(2,4,8,0.94) 0%, rgba(2,4,8,0.25) 52%, transparent 100%)' }} />

      {/* Cursor-tracking colour bloom */}
      <div aria-hidden style={{
        position:'absolute', inset:0, pointerEvents:'none', mixBlendMode:'screen',
        opacity: h ? 1 : 0, transition:'opacity 0.5s',
        background:`radial-gradient(circle 320px at ${mouse.x}% ${mouse.y}%, ${rgba(0.16)}, transparent 78%)`,
      }} />

      {/* Category */}
      <div style={{
        position:'absolute', top:13, right:13, zIndex:11,
        fontSize:7.5, letterSpacing:2.5, textTransform:'uppercase',
        color:'var(--fg)', fontFamily:'var(--mono)',
        padding:'5px 11px', borderRadius:'var(--r-full)',
        background:'rgba(4,7,13,0.45)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
        border:'1px solid rgba(224,221,174,0.10)',
      }}>{v.cat}</div>

      {/* Play */}
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none',
      }}>
        <div style={{
          width: big ? 66 : 52, height: big ? 66 : 52, borderRadius:'50%',
          background:'rgba(224,221,174,0.10)', border:'1px solid rgba(224,221,174,0.22)',
          backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
          opacity: h ? 1 : 0, transform: h ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(8px)',
          transition:'opacity 0.4s var(--ease-expo), transform 0.4s var(--ease-expo)',
        }}>
          <Play size={big ? 21 : 17} fill="rgba(224,221,174,0.92)" color="rgba(224,221,174,0.92)" style={{ marginLeft:3 }} />
        </div>
      </div>

      {/* Meta */}
      <div style={{ position:'absolute', bottom:0, left:0, padding: big ? 24 : 16, zIndex:11, width:'100%' }}>
        <h3 style={{
          fontSize: big ? 'clamp(1.7rem, 3vw, 2.5rem)' : '1.2rem', letterSpacing:1.5, color:'var(--fg)',
          transform: h ? 'translateY(-3px)' : 'none', transition:'transform 0.5s var(--ease-expo)',
        }}>{v.title}</h3>
        <div style={{
          display:'flex', alignItems:'center', gap:8, marginTop:6,
          fontFamily:'var(--mono)', fontSize: big ? 9 : 8, letterSpacing:1.8,
          color:'var(--fg-dim)', textTransform:'uppercase',
        }}>
          <span>{v.role}</span>
          <span style={{ width:3, height:3, borderRadius:'50%', background:'currentColor', opacity:0.6 }} />
          <span>{v.year}</span>
        </div>
        {v.note && (
          <div style={{
            fontFamily:'var(--mono)', fontSize: big ? 8.5 : 7.5, letterSpacing:1.5,
            color:'var(--accent)', marginTop:8, textTransform:'uppercase',
          }}>❦ {v.note}</div>
        )}
        {big && (
          <p style={{
            fontFamily:'var(--serif)', fontSize:14, lineHeight:1.5, color:'var(--fg-muted)',
            marginTop:10, maxWidth:'88%', fontStyle:'italic',
            opacity: h ? 1 : 0, maxHeight: h ? 60 : 0, overflow:'hidden',
            transition:'opacity 0.4s var(--ease-expo), max-height 0.45s var(--ease-expo)',
          }}>{v.desc}</p>
        )}
      </div>
    </button>
  );
}

/* ─── Cinematic player overlay ──────────────────────────── */
function VideoOverlay({ video, color, onClose }) {
  const backdrop = useRef(null);

  useEffect(() => {
    if (!video) return;
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [video, onClose]);

  if (!video) return null;
  const c = color || tintFor(video);
  const rgba = a => `rgba(${c.r},${c.g},${c.b},${a})`;

  return (
      <div
        ref={backdrop}
        onClick={e => { if (e.target === backdrop.current) onClose(); }}
        role="dialog" aria-modal="true" aria-label={video.title}
        style={{
          position:'fixed', inset:0, zIndex:9500,
          background:'rgba(2,4,8,0.72)',
          backdropFilter:'blur(14px) saturate(1.2)', WebkitBackdropFilter:'blur(14px) saturate(1.2)',
          overflowY:'auto',
          paddingTop:48, paddingBottom:48,
        }}
      >
        {/* Colour wash from the film itself */}
        <div aria-hidden style={{
          position:'fixed', inset:0, pointerEvents:'none',
          background:`radial-gradient(ellipse 80% 60% at 50% 40%, ${rgba(0.18)} 0%, transparent 70%)`,
        }} />

        {/* Letterbox bars */}
        <div style={{
          position:'fixed', top:0, left:0, right:0, height:48, zIndex:10,
          background:'rgba(2,4,8,0.86)', display:'flex', alignItems:'center',
          justifyContent:'space-between', padding:'0 20px',
        }}>
          <button onClick={onClose} style={{
            display:'flex', alignItems:'center', gap:8, background:'none', border:'none',
            fontFamily:'var(--mono)', fontSize:9, letterSpacing:3, textTransform:'uppercase',
            color:'var(--fg-dim)', cursor:'pointer',
          }}><ChevronLeft size={14} /> Back</button>
          <button onClick={onClose} aria-label="Close" style={{
            width:34, height:34, borderRadius:'50%',
            background:'rgba(224,221,174,0.06)', border:'1px solid rgba(224,221,174,0.10)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg)', cursor:'pointer',
          }}><X size={15} /></button>
        </div>
        <div aria-hidden style={{ position:'fixed', bottom:0, left:0, right:0, height:48, background:'rgba(2,4,8,0.86)', zIndex:10 }} />

        <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:1060, margin:'0 auto', padding:'0 20px 20px' }}>
        <div style={{
          aspectRatio:'16/9', background:'#000', borderRadius:'var(--r-md)', overflow:'hidden',
          boxShadow:`0 0 0 1px rgba(224,221,174,0.06), 0 30px 100px rgba(0,0,0,0.7), 0 0 120px ${rgba(0.12)}`,
        }}>
          <iframe title={video.title} src={embedUrl(video)} width="100%" height="100%"
            allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen
            style={{ border:'none', display:'block' }} />
        </div>

        <div style={{ marginTop:26 }}>
          <span style={{
            display:'inline-block', padding:'5px 13px', borderRadius:'var(--r-full)',
            background:rgba(0.10), border:`1px solid ${rgba(0.26)}`,
            fontFamily:'var(--mono)', fontSize:8.5, letterSpacing:2.5, textTransform:'uppercase',
            color:`rgb(${c.r},${c.g},${c.b})`,
          }}>{video.cat}</span>

          <h2 style={{ fontSize:'clamp(2rem, 5.5vw, 3.6rem)', lineHeight:0.94, letterSpacing:1.5, marginTop:14 }}>
            {video.title}
          </h2>

          <p style={{ fontFamily:'var(--serif)', fontSize:16, lineHeight:1.7, color:'var(--fg-muted)', fontStyle:'italic', marginTop:12, maxWidth:600 }}>
            {video.desc}
          </p>
          {video.note && (
            <div style={{ fontFamily:'var(--mono)', fontSize:9, letterSpacing:2, color:'var(--accent)', marginTop:12, textTransform:'uppercase' }}>
              ❦ {video.note}
            </div>
          )}

          <div style={{
            marginTop:24, paddingTop:20, borderTop:`1px solid ${rgba(0.12)}`,
            display:'flex', flexWrap:'wrap', gap:'16px 40px',
          }}>
            {[['Role', video.role], ['Year', video.year], ['By', 'Peter Olowude']].map(([k, val]) => (
              <div key={k}>
                <div style={{ fontSize:8, letterSpacing:3, color:'var(--fg-ghost)', fontFamily:'var(--mono)', marginBottom:5, textTransform:'uppercase' }}>{k}</div>
                <div style={{ fontSize:11, letterSpacing:1.5, color:'var(--fg-muted)', fontFamily:'var(--mono)' }}>{val}</div>
              </div>
            ))}
          </div>

          <a href={watchUrl(video)} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ marginTop:26 }}>
            <ExternalLink size={12} /> Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [ambient, setAmbient] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const open = (v, c) => { setActive(v); setActiveColor(c); };

  return (
    <>
      <CustomCursor />
      <DotField color={ambient} />
      <CinematicNav />
      <div className="grain-overlay" />

      <div style={{ position:'relative', zIndex:1 }}>
        {/* ═══ NAV ═══ */}
        <nav style={{
          position:'fixed', top:0, left:0, width:'100%', height:54, zIndex:100,
          display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px',
          background: scrolled ? 'var(--glass)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          transition:'background 0.35s, border-color 0.35s',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontFamily:'var(--display)', fontSize:'0.95rem', letterSpacing:4 }}>PETER OLOWUDE</span>
            <span className="nav-meta" style={{ width:1, height:13, background:'var(--border-2)' }} />
            <span className="nav-meta" style={{ fontSize:8, letterSpacing:2.5, textTransform:'uppercase', color:'var(--fg-dim)' }}>Editor · Filmmaker · Calgary</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <a href="#work" className="link-btn" style={{ padding:'7px 13px' }}>Work</a>
            <button
              onClick={() => setShowPhotos(true)}
              data-cursor="view"
              className="link-btn"
              style={{ padding:'7px 13px', display:'inline-flex', alignItems:'center', gap:6 }}
            >
              <Images size={10} /> Photos
            </button>
            <a href={`mailto:${EMAIL}`} className="link-btn" style={{ padding:'7px 13px' }}>
              <Mail size={10} /> Hire Me
            </a>
          </div>
        </nav>

        {/* ═══ INTRO + FEATURED ═══ */}
        <section style={{ maxWidth:1180, margin:'0 auto', padding:'92px 22px 40px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'minmax(0, 0.92fr) minmax(0, 1.08fr)', gap:36, alignItems:'center' }} className="mc-hero-grid">
            <div>
              <Reveal>
                <h1 style={{ fontSize:'clamp(2.2rem, 4.8vw, 3.7rem)', lineHeight:0.94, letterSpacing:0.5, marginBottom:16 }}>
                  EDITOR &amp;<br />
                  <span style={{ color:'var(--accent)' }}>FILMMAKER</span>
                </h1>
              </Reveal>

              <Reveal delay={0.08}>
                <p style={{
                  fontFamily:'var(--serif)', fontSize:'1.08rem', lineHeight:1.7,
                  color:'var(--fg-muted)', maxWidth:430, marginBottom:24,
                }}>
                  I conceptualize, shoot and edit video in Calgary. From commercial, music
                  videos, narrative film, broadcast, live multi-cam, usually from start to finish.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <dl style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'9px 18px', marginBottom:26, fontSize:10.5 }}>
                  {FACTS.map(([k, val]) => (
                    <React.Fragment key={k}>
                      <dt style={{ fontSize:8, letterSpacing:2, textTransform:'uppercase', color:'var(--fg-dim)', paddingTop:2 }}>{k}</dt>
                      <dd style={{ color:'var(--fg-muted)', letterSpacing:0.3 }}>{val}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.2}>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <a href={`mailto:${EMAIL}`} className="btn-primary"><Mail size={12} /> Get in Touch</a>
                  <a href="https://ig.me/m/lonerkid" target="_blank" rel="noopener noreferrer" className="btn-ghost">DM</a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <SectionLabel text="Featured" right="Award Winner" />
              <VCard v={FEATURED} onClick={open} onTint={setAmbient} big />
            </Reveal>
          </div>
        </section>

        {/* ═══ WORK ═══ */}
        <section id="work" style={{ maxWidth:1180, margin:'0 auto', padding:'30px 22px 20px' }}>
          <Reveal><SectionLabel text="Selected Work" right={`${VIDEOS.length} Projects`} /></Reveal>
          <div className="mc-bento">
            {REST.map((v, i) => {
              // Apple-style bento: featured items are large (2×2), the first
              // two after that are wide (2×1), the rest standard (1×1).
              // On smaller screens the .mc-bento CSS collapses to 1 column.
              const cls = v.feat ? 'bento-feat' : (i < 2 ? 'bento-wide' : '');
              return (
                <Reveal key={v.id} className={cls} delay={(i % 4) * 0.05}>
                  <VCard v={v} onClick={open} onTint={setAmbient} big={v.feat} />
                </Reveal>
              );
            })}
          </div>

          {CREW_CREDITS.length > 0 && (
            <Reveal>
              <div style={{ marginTop:34 }}>
                <SectionLabel text="Also Crewed On" />
                {CREW_CREDITS.map((c, i) => (
                  <div key={i} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:10,
                    padding:'14px 18px', background:'var(--bg-2)', border:'1px solid var(--border)',
                    borderRadius:'var(--r-sm)',
                  }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
                      <span style={{ fontFamily:'var(--display)', fontSize:'1.1rem', letterSpacing:1.5 }}>{c.title}</span>
                      <span style={{ fontSize:8, letterSpacing:2, textTransform:'uppercase', color:'var(--accent)' }}>{c.cat}</span>
                    </div>
                    <span style={{ fontSize:8.5, letterSpacing:2, textTransform:'uppercase', color:'var(--fg-dim)' }}>
                      {c.role} · {c.org} · {c.date}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </section>

        {/* ═══ WRITING ═══ */}
        <section style={{ maxWidth:1180, margin:'0 auto', padding:'34px 22px 0' }}>
          <Reveal>
            <SectionLabel text="Writing" right="Sample Pages" />
            <div style={{
              display:'grid', gridTemplateColumns:'minmax(0, 0.85fr) minmax(0, 1.15fr)', gap:28,
              padding:'24px', background:'var(--bg-2)', border:'1px solid var(--border)',
              borderRadius:'var(--r-md)',
            }} className="mc-hero-grid">
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:'var(--display)', fontSize:'1.9rem', letterSpacing:1.5, lineHeight:1.05, marginBottom:8 }}>
                  {WRITING.title}
                </div>
                <div style={{ fontSize:8.5, letterSpacing:2, textTransform:'uppercase', color:'var(--accent)', marginBottom:12 }}>
                  {WRITING.meta}
                </div>
                <p style={{ fontFamily:'var(--serif)', fontSize:14.5, lineHeight:1.65, color:'var(--fg-muted)', fontStyle:'italic', marginBottom:20 }}>
                  {WRITING.blurb}
                </p>
                <a
                  href={`mailto:${EMAIL}?subject=` +
                    encodeURIComponent('Script request — Femme Fatale: The Useful Dead') + '&body=' +
                    encodeURIComponent("Hi Peter,\n\nI read the sample pages on your site and I'd like to read the full script.\n\nName:\nCompany / role:\n\nThanks,")}
                  className="btn-primary"
                  data-cursor="req"
                >
                  <FileText size={12} /> Request Full Script
                </a>

                {/* Scripts that are fine to read in full */}
                <div style={{ marginTop:22, display:'flex', flexDirection:'column', gap:8 }}>
                  {OTHER_WRITING.map(w => w.did ? (
                    <a key={w.title} href={`https://drive.google.com/file/d/${w.did}/view`} target="_blank" rel="noopener noreferrer" data-cursor="read"
                      style={{
                        display:'flex', justifyContent:'space-between', alignItems:'center', gap:12,
                        padding:'10px 14px', border:'1px solid var(--border)', borderRadius:'var(--r-xs)',
                        textDecoration:'none', color:'inherit', transition:'border-color 0.3s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      <span style={{ minWidth:0 }}>
                        <span style={{ display:'block', fontSize:7.5, letterSpacing:2.5, textTransform:'uppercase', color:'var(--fg-dim)' }}>{w.type}</span>
                        <span style={{ fontSize:11.5, color:'var(--fg-muted)' }}>{w.title} — {w.sub}</span>
                      </span>
                      <ExternalLink size={11} style={{ flexShrink:0, color:'var(--fg-dim)' }} />
                    </a>
                  ) : (
                    <div key={w.title} style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center', gap:12,
                      padding:'10px 14px', border:'1px dashed var(--border)', borderRadius:'var(--r-xs)',
                    }}>
                      <span style={{ minWidth:0 }}>
                        <span style={{ display:'block', fontSize:7.5, letterSpacing:2.5, textTransform:'uppercase', color:'var(--fg-dim)' }}>{w.type}</span>
                        <span style={{ fontSize:11.5, color:'var(--fg-muted)' }}>{w.title} — {w.sub}</span>
                      </span>
                      <span style={{ flexShrink:0, fontSize:7.5, letterSpacing:2, textTransform:'uppercase', color:'var(--fg-ghost)' }}>Soon</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                position:'relative', minWidth:0,
                background:'var(--bg-3)', border:'1px solid var(--border)',
                borderRadius:'var(--r-sm)', padding:'20px 18px',
                maxHeight:380, overflow:'hidden',
              }}>
                <div className="screenplay-preview">
                  {WRITING.excerpt.map((l, i) => {
                    if (l.t === 'scene')  return <div key={i} className="screenplay-scene-hdr" style={{ marginBottom:10 }}>{l.x}</div>;
                    if (l.t === 'char')   return <div key={i} className="screenplay-char" style={{ marginTop:10 }}>{l.x}</div>;
                    if (l.t === 'paren')  return <div key={i} className="screenplay-paren">{l.x}</div>;
                    if (l.t === 'dialog') return <div key={i} className="screenplay-dialog" style={{ marginBottom:6 }}>{l.x}</div>;
                    return <div key={i} style={{ marginBottom:9 }}>{l.x}</div>;
                  })}
                </div>
                <div aria-hidden style={{
                  position:'absolute', left:0, right:0, bottom:0, height:110,
                  background:'linear-gradient(transparent, var(--bg-3))', pointerEvents:'none',
                }} />
                <div style={{
                  position:'absolute', bottom:12, left:0, right:0, textAlign:'center',
                  fontSize:7.5, letterSpacing:3, textTransform:'uppercase', color:'var(--fg-dim)',
                }}>
                  Excerpt · Full script on request
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══ CAPABILITIES ═══ */}
        <section style={{ maxWidth:1180, margin:'0 auto', padding:'34px 22px 50px' }}>
          <Reveal><SectionLabel text="What I Do" /></Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(215px, 1fr))', gap:12 }}>
            {SKILL_GROUPS.map((g, i) => (
              <Reveal key={g.label} delay={i * 0.05}>
                <div style={{
                  position:'relative', overflow:'hidden', height:'100%',
                  background:'var(--bg-2)', border:'1px solid var(--border)',
                  borderRadius:'var(--r-md)', padding:'18px',
                }}>
                  <div aria-hidden style={{
                    position:'absolute', top:-46, right:-46, width:130, height:130, borderRadius:'50%',
                    background:`radial-gradient(circle, ${g.color}14 0%, transparent 65%)`, pointerEvents:'none',
                  }} />
                  <div style={{ position:'relative', zIndex:1 }}>
                    <div style={{ fontSize:7.5, letterSpacing:3, textTransform:'uppercase', color:g.color, marginBottom:11 }}>
                      {g.label}
                    </div>
                    <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:6 }}>
                      {g.items.map(item => (
                        <li key={item} style={{ fontSize:10.5, color:'var(--fg-muted)', letterSpacing:0.3 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <footer style={{ borderTop:'1px solid var(--border)', background:'var(--bg-2)' }}>
          <div style={{
            maxWidth:1180, margin:'0 auto', padding:'30px 22px',
            display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20,
          }}>
            <div>
              <div style={{ fontFamily:'var(--display)', fontSize:'1.5rem', letterSpacing:2, marginBottom:5 }}>
                LET&rsquo;S WORK TOGETHER
              </div>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'var(--fg-dim)' }}>
                Calgary, AB · On-site or remote · Available now
              </div>
            </div>
            <a href={`mailto:${EMAIL}`} className="btn-primary"><Mail size={12} /> {EMAIL}</a>
          </div>

          <div style={{
            maxWidth:1180, margin:'0 auto', padding:'0 22px 26px',
            display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14,
            borderTop:'1px solid var(--border)', paddingTop:18,
          }}>
            <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  fontSize:10, letterSpacing:2.5, textTransform:'uppercase', color:'var(--fg-muted)',
                  textDecoration:'none', transition:'color 0.25s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
                >{s.label}</a>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:8, letterSpacing:4, textTransform:'uppercase', color:'var(--fg-dim)' }}>
              © 2026 Peter Olowude · Misfits Cavern
              <img src="/misfits-mark.svg" alt="" aria-hidden="true" style={{ height:25, width:'auto', opacity:0.75, flexShrink:0 }} />
            </div>
          </div>
        </footer>
      </div>

      <VideoOverlay video={active} color={activeColor} onClose={() => setActive(null)} />
      {showPhotos && <StarField onClose={() => setShowPhotos(false)} />}
    </>
  );
}
