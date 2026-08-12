import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  '1tVlWzEhbkik6Xxk90X1ra_FmZR9VMCAf','1QvTjsBw-UHstHFVVrRAkehxzIx-eGEgZ','1xFFHMEpKQRMbSOewkw3aZy-IWaVH1OoQ',
  '1dDVuqIKdbvUhMqnj8sjHdK_VYS0_C6Ui','1SNR9x1kdHAGxG4sSf0JQNw9hpkhk9o0C','1wHB3MHF1C_oaU7E5sN84mXeH2IjK17eQ',
  '1hqxnx3MQVi7A6EllAeUWYljNxwUHxI49','1UcdpkhuMuA5df6ZZ1ZbsHi5jZoEAU9Sk','1OFCGZWLgcX5n1FkZ8JFoHawYakjf-K2Y',
  '1m9vSaWclI0qpkaolzJf1BIyadOYWU3Ko','1JoHf-1BK6sJ57rzYbgQyoyrp7j7X23rk','1IpNQV_iqLywS4CwZj-MbfFhzzFqKq8Uw',
  '1v6kGMbPNcELJ6m-cHwBUVc5FWfR80oaD','1E_vf5yeYCtRaB8CMGIrkJu5zBNT-MRLO','1owmYc9lTuoas80z6uX68Zh5gjWc_HFzm',
  '1tfFCE5ORbHwHb_HFIS3SeYGoXcQRpdfS','1KwIxNlnl2vUuH6Wo57LToYa2b9Sj7Bhm','1wcmVwR9mWMHv9WP9nWHBX9RpI5rPjXge',
  '1VRjE0VIvLoDaOdGfPAvx8Z_5NRlzxutw','1s8gA48BIhJddg-Mk2Ns_bfjb0rP5l6v5','1_nlR0Yb0E-wYlE_-byVDt3nu1w_OJ_Pi',
  '1_YhQ-VxITvZ_XWRQ_UMwhmMN5YNU_1nD','1CfevkaSmrmpUEaetdGnM8quZAQBV6fLB','1iknUEH6srEtmHyJ4JZVVjU0t-R8l3Sze',
  '1d73j2enoH-IkFGAXRG6JsX1lK2N_tWP4','1GuvBsMJ80PCEgGlhFwHerkgxJPHXgmIT','13-KoJjPnW4r4sIV7LjfUOMuTvMh_tpWV',
  '1vo2E90SI4CBo0A3EmGPmd-vPkc4cDzCm','1QAY4u44Ltse_FSbtj2lvSnxXon0yg0Wj','1Quwts5Lrg1rHZn-whJLkm2T_MoWTPBDB',
  '1ILTYjQTcZrHA5jXsWOcLcUVvHRUxf5_G','124P4ZdzSU_ow_CeafQjuCuLXU5kZ_sZx','1M7Sppe-rL4aTUl5GxvcvDOMWMTDZMi9b',
  '1CVqpX_9p9gZmVAMZmOWIcm6mZfc3kPwA','1OgjJq4ntvzO7XGicNiZtq49VoegdbED5','1-z_F6Hh6aWucEklqNMhQx2LRriEelBMg',
  '1x8Rx9QbaM99_KZ5TnkRS9-59eqQxlWyG','1gzV0QORGu-WvgDMwWiqF3o6bDOGxGirE','1vEdEC8tQH07U-xHAaWfs__Ielw_cDjQj',
  '1Aepa5uqFy_zmOw27sCy_6yCKML52G30y','1eO_nfq1A4ZvjHkJWeCPaRPkJXWYRWExV','1VKzGRHR5grAUHdmoY4vPtNluVSKJuDm2',
  '17AlppMeCPngBkwMGDYnpirQ4HxxsJ0Cl','1iBzF_Ytzfh3XJo2vlsu_BNfndrm5sTgE','1Z1wyVtOuV9tvG09SRTN8mLpN3In_sSyc',
  '1WPJSt8J0lw5-LN9zzEDWkZQz7dJNAzdI','1GpjLJ_yeN8RZl0tvGod4s1GaOHKkmI_c','1z-AE3G5HElOKPx90H-MnjraJydEFfXYF',
  '1ufKtiwg02EV539ODLXExlFoaY2fOnChL','1j-cacRyIdUDq_RHXCtQG--oIGV2UkXfY','1CQscxdu54rzFbUnEp6deRxLkhX9SJrn1',
  '18-TeqGt-6d4dfll9iyyP9sMnHle4b37K','1nPK5xeo2eQtIsOT2gI9ElrAqsML_5tdn','1e-gN_E23X7PsgdC46t7cIvMpyCyF7ycU',
  '1c_R6t5XKc1_HUxGlpSJnGVjvoTkk2MG8','1XOYt8xvOvnnuJFoF0FHpwMnBhLRs0Gtc','1Tw3aX8wrW_OVh_zTumR8XXJmMK7efl8L',
  '1H6DDmPrMGM-ltuTGsVZC482R-Gxm1Pvv','1_VFLNBVHg3yOkxlKG-X5LNEXTLSbP_mg','1ZIzCnlWzBqQPtOMnkRC1AYYcy32UwSRw',
  '1D-Y0pAfR5U5zfJWh9AxyNkcT_kMTGmPi','1BiYMJygJ6IpnPhoP0y_XGkhtF-2sU8SC','1dtHR8xNV6c2Ap4J_LP5zWg6rfR_jEzRq',
  '1EUuD6HLokHjuFQ4kxzl_C46KAHu8RFtt','1rmdf7lTT5sqESynKTgUs3LG_qisZctxd','1kR8_54R-rI2ezatf6dTBLea5nsbehTpW',
  '1jKbu4wouPdckhe5ZvZkTo2Jf1M8JEL6P','1Ln4-lxYI7GyblT4_wt_m2E8j7hQuE2G9','1dix-7qzP-g_SoxFExdxi8umReO39g6Tm',
  '1chYJxm4X4shY_OHPq5f7na72co_z8vaO','1bUBxp6A5cKhZ9s9544VwklksYLPXQr6X','1FNLySSunuVih4PaW9jTeChx1cDZdEXfM',
  '1oxypoRFSLHMrI8N0yWyzdRNZbc-pX08C','1HfCFFKRdsN39b5Lr4dv581TOZj-BLobE','13AHjSGo6U8u_xMZHgdqy1HMLrNB64PKR',
  '1U5vjuGYE08RlmSe04QMK657-YBLht4AH','1pQvAnYifhYuAQ38VkCSQA_AHV6geXpsm','1hMl7N5jMfEQs_tS-8kD3Zxj35NN0bYcH',
  '1rfOxvN9ma3_U3Z8D3aQAbnQcJyJR09Mk','1thwuXrp_qcITKOlB6V0F5AtSnPatEBzw','1LIqrIaOJwVwtViTN5a3D8Pk5b8Dm8Izo',
  '1-OGi_xmIECT4EP5SUjJ-_JzEZG4Vz2MR','1pkLE02GQm3bS0gCffbHAjQXMy6TosKAK','1fKjkXrPXUlgGUTREDiSG7Z43kjjxVdV2',
  '1gHeCdlcsgxFsJY4WwgU8Br-SZl_tz1IP','1XldskBnYHylvXLu1Bgeaj7zsgKl7AAaQ','1s_Jvg7pOvxdgNnBXY1wVVHv7XzV5XYp9',
  '10oVxhOiZUlag_syWulvZTv369E9t7B6f','1DtOx7VxCUdBC44o3rEgedWyUuwCEf25p','16wYnq9_OxL8PgA_g8tgTn7h2lIviTQgM',
  '1bj7Do90ybvwOcJNcNL3k4fPcmfA14ATF','1f4sPQWbNGiCiZgpk85D4_-tAERQOfr13','11rKGwPWuW791Nc9gRaXVjiWuDsluKMUI',
  '1JOCajNRIdTCdztBqYdPpaq6TeF6Q8Jw3','1SOHLpyo65Lpx_MT8FC0r5ay4EP_q3-X1','1fqqOxywLUgPwqJwWUEtjych3uc0wJqMM',
  '1_j3CG7clf1JjE1JaNBvNG0cMqhoRqkLc','1fSNxxxNah51tP51xSbvn1BBl6fgCuSR4','1afs3_OBj53XPp0TSepx4KqzwB2i2bOl',
];

const img = id => `https://lh3.googleusercontent.com/d/${id}=w400`;
const imgFull = id => `https://lh3.googleusercontent.com/d/${id}=w1600`;

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}

/* Three flat parallax layers instead of a preserve-3d world:
   the compositor only animates 3 transforms per frame (not 100),
   no 3D rendering context, no per-photo shadows → smooth on laptops. */
const LAYERS = [
  { d: 0.45, z: 1, op: 0.5,  w: [110, 170] },  // far
  { d: 0.7,  z: 2, op: 0.78, w: [150, 230] },  // mid
  { d: 1,    z: 3, op: 1,    w: [190, 300] },  // near
];

export default function StarField({ onClose }) {
  const [active, setActive] = useState(null);
  const [photos, setPhotos] = useState([]);
  const layerRefs = [useRef(null), useRef(null), useRef(null)];
  const cam = useRef({ x: 0, y: 0, s: 1, tx: 0, ty: 0, ts: 1 });
  const pointers = useRef(new Map());
  const pinch = useRef(0);
  const activeRef = useRef(null);
  activeRef.current = active;

  useEffect(() => {
    const r = rng(2026);
    setPhotos([...PHOTOS].sort(() => r() - 0.5).map((id, i) => {
      const layer = i % 3;
      const [lo, hi] = LAYERS[layer].w;
      return {
        id, i, layer,
        x: (r() - 0.5) * 2600,
        y: (r() - 0.5) * 1500,
        rot: (r() - 0.5) * 22,
        w: lo + r() * (hi - lo),
      };
    }));
  }, []);

  /* Camera loop — 3 layer transforms per frame, refs only. */
  useEffect(() => {
    let raf;
    const tick = () => {
      const c = cam.current;
      c.x += (c.tx - c.x) * 0.16;
      c.y += (c.ty - c.y) * 0.16;
      c.s += (c.ts - c.s) * 0.16;
      for (let i = 0; i < 3; i++) {
        const el = layerRefs[i].current;
        if (el) el.style.transform = `translate3d(${c.x * LAYERS[i].d}px, ${c.y * LAYERS[i].d}px, 0) scale(${c.s})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clampCam = () => {
    const c = cam.current;
    const bx = 1400 * c.ts + 300, by = 800 * c.ts + 250;
    c.tx = Math.max(-bx, Math.min(bx, c.tx));
    c.ty = Math.max(-by, Math.min(by, c.ty));
    c.ts = Math.max(0.4, Math.min(2.6, c.ts));
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = e => {
      if (e.key === 'Escape') return onClose();
      const c = cam.current;
      if (activeRef.current !== null) {
        if (e.key === 'ArrowRight') { e.preventDefault(); setActive(a => Math.min(photos.length - 1, a + 1)); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
        return;
      }
      switch (e.key) {
        case 'ArrowLeft':  c.tx += 150; break;
        case 'ArrowRight': c.tx -= 150; break;
        case 'ArrowUp':    c.ty += 150; break;
        case 'ArrowDown':  c.ty -= 150; break;
        case '+': case '=': c.ts += 0.2; break;
        case '-': case '_': c.ts -= 0.2; break;
        case '0': c.tx = c.ty = 0; c.ts = 1; break;
        default: return;
      }
      e.preventDefault();
      clampCam();
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose, photos.length]);

  /* Pointer events: 1 finger/mouse drags, 2 fingers pinch-zoom. */
  const onDown = e => {
    if (activeRef.current !== null) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onMove = e => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    const c = cam.current;
    if (pointers.current.size === 1) { c.tx += dx / c.s; c.ty += dy / c.s; }
    else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      c.ts += (d - pinch.current) * 0.004;
      pinch.current = d;
    }
    clampCam();
  };
  const onUp = e => { pointers.current.delete(e.pointerId); pinch.current = 0; };
  const onWheel = e => { cam.current.ts += -e.deltaY * 0.0012; clampCam(); };

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Photo archive"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
      onPointerCancel={onUp} onWheel={onWheel}
      style={{
        position:'fixed', inset:0, zIndex:9900, overflow:'hidden',
        background:'radial-gradient(ellipse at center, #0b1022 0%, #020306 100%)',
        touchAction:'none',
        cursor: active === null ? 'grab' : 'default',
      }}
    >
      <StarCanvas />

      <div style={{
        position:'fixed', top:0, left:0, right:0, height:54, zIndex:10000,
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px',
        background:'rgba(2,4,8,0.6)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(224,221,174,0.06)',
      }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:8, letterSpacing:2.5, textTransform:'uppercase', color:'var(--fg-muted)' }}>
          Photo Archive · {photos.length} stills
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={() => { cam.current.ts -= 0.2; clampCam(); }} aria-label="Zoom out" style={iconBtn}><ZoomOut size={14} /></button>
          <button onClick={() => { cam.current.ts += 0.2; clampCam(); }} aria-label="Zoom in" style={iconBtn}><ZoomIn size={14} /></button>
          <button onClick={onClose} aria-label="Close gallery" style={{ ...iconBtn, borderColor:'var(--accent)', color:'var(--accent)' }}><X size={16} /></button>
        </div>
      </div>

      <div aria-hidden style={{
        position:'fixed', bottom:10, left:0, right:0, zIndex:10000, textAlign:'center',
        fontFamily:'var(--mono)', fontSize:7.5, letterSpacing:2.5, textTransform:'uppercase',
        color:'var(--fg-dim)', pointerEvents:'none',
      }}>
        drag pan · scroll / pinch zoom · arrows move · + − zoom · 0 reset · esc close
      </div>

      {/* Parallax layers (far → near) */}
      {LAYERS.map((L, li) => (
        <div
          key={li}
          ref={layerRefs[li]}
          style={{
            position:'absolute', left:'50%', top:'50%', width:0, height:0,
            zIndex:L.z, opacity:L.op, willChange:'transform',
          }}
        >
          {photos.filter(p => p.layer === li).map(p => {
            const selected = active === p.i;
            return (
              <button
                key={p.id}
                data-cursor={selected ? 'close' : 'view'}
                aria-label={`Open still ${p.i + 1}`}
                onClick={e => { e.stopPropagation(); setActive(selected ? null : p.i); }}
                style={{
                  position:'absolute', left:0, top:0,
                  width:p.w, height:p.w * 0.65,
                  transform:`translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`,
                  opacity: active === null || selected ? 1 : 0.15,
                  transition:'opacity 0.4s',
                  background:'none', border:'none', padding:0,
                }}
              >
                <div style={{
                  width:'100%', height:'100%', borderRadius:8, overflow:'hidden',
                  border: selected ? '2px solid rgba(224,221,174,0.4)' : '1px solid rgba(224,221,174,0.08)',
                  background:'#0a0f1a',
                }}>
                  <img
                    src={img(p.id)} alt="" loading="lazy" decoding="async"
                    style={{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(0.35) contrast(1.05)', display:'block' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ))}

      {active !== null && photos[active] && (
        <div
          onPointerDown={e => e.stopPropagation()}
          style={{
            position:'fixed', bottom:34, left:16, right:16, maxWidth:560, margin:'0 auto',
            zIndex:10001,
            background:'rgba(2,4,8,0.8)', backdropFilter:'blur(20px)',
            border:'1px solid rgba(224,221,174,0.10)', borderRadius:'var(--r-md)',
            padding:'14px 16px',
            display:'flex', gap:12, alignItems:'center', flexWrap:'wrap',
          }}
        >
          <img src={img(photos[active].id)} alt="" style={{ width:70, height:48, objectFit:'cover', borderRadius:6, flexShrink:0 }} />
          <div style={{ flex:1, minWidth:110 }}>
            <div style={{ fontFamily:'var(--display)', fontSize:'1.05rem', letterSpacing:1 }}>Still #{active + 1} / {photos.length}</div>
            <div style={{ fontSize:7.5, letterSpacing:2, textTransform:'uppercase', color:'var(--fg-dim)', marginTop:3 }}>
              ← → browse · esc close
            </div>
          </div>
          <button onClick={() => setActive(a => Math.max(0, a - 1))} data-cursor="action" aria-label="Previous still" style={iconBtn}><ChevronLeft size={15} /></button>
          <button onClick={() => setActive(a => Math.min(photos.length - 1, a + 1))} data-cursor="action" aria-label="Next still" style={iconBtn}><ChevronRight size={15} /></button>
          <a
            href={imgFull(photos[active].id)} target="_blank" rel="noopener noreferrer" data-cursor="open"
            style={{
              display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:'var(--r-full)',
              border:'1px solid var(--border-2)', fontFamily:'var(--mono)', fontSize:8, letterSpacing:2,
              textTransform:'uppercase', color:'var(--fg)', textDecoration:'none', whiteSpace:'nowrap',
            }}
          >Full size <ZoomIn size={10} /></a>
          <button onClick={() => setActive(null)} data-cursor="close" aria-label="Close still" style={iconBtn}><X size={15} /></button>
        </div>
      )}
    </div>
  );
}

/* Static starfield — drawn once (and on resize), no rAF loop. */
function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h;

    const draw = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      const r = rng(7);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#e0ddae';
      for (let i = 0; i < 300; i++) {
        const x = r() * w, y = r() * h, z = r() * 2 + 0.3, size = r() * 1.3 + 0.3;
        ctx.globalAlpha = z / 2.3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return <canvas ref={canvasRef} aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none' }} />;
}

const iconBtn = {
  width:34, height:34, borderRadius:'50%',
  background:'rgba(224,221,174,0.05)', border:'1px solid rgba(224,221,174,0.12)',
  display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg)',
  cursor:'pointer', flexShrink:0,
};