/* Media URL helpers — YouTube first, Drive only as a legacy fallback. */

export const thumbUrl = v =>
  v.yt ? `https://i.ytimg.com/vi/${v.yt}/maxresdefault.jpg`
       : `https://drive.google.com/thumbnail?id=${v.did}&sz=w800`;

// maxresdefault 404s on some uploads; hqdefault always exists.
export const thumbFallback = v =>
  v.yt ? `https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg`
       : `https://lh3.googleusercontent.com/d/${v.did}=w800`;

export const embedUrl = v =>
  v.yt ? `https://www.youtube-nocookie.com/embed/${v.yt}?rel=0&modestbranding=1`
       : `https://drive.google.com/file/d/${v.did}/preview`;

export const watchUrl = v =>
  v.yt ? `https://www.youtube.com/watch?v=${v.yt}`
       : `https://drive.google.com/file/d/${v.did}/view`;

/* Per-category fallback tints, used when canvas colour extraction is blocked
   (ytimg does not reliably send CORS headers, which taints the canvas). */
const CAT_TINT = {
  'Music Video':    { r: 215, g: 52,  b: 11  },
  'Short Film':     { r: 215, g: 52,  b: 11  },
  'Live Multi-Cam': { r: 99,  g: 102, b: 241 },
  'Commercial':     { r: 245, g: 158, b: 11  },
  'Doc Teaser':     { r: 16,  g: 185, b: 129 },
  'Documentary':    { r: 16,  g: 185, b: 129 },
  'Broadcast':      { r: 51,  g: 100, b: 103 },
};

export const tintFor = v => CAT_TINT[v.cat] || { r: 215, g: 52, b: 11 };

/* Try to pull an average colour off the thumbnail. Resolves to null when the
   browser blocks the read, and callers fall back to the category tint. */
export function extractColor(v) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = 40; c.height = 24;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 40, 24);
        const { data } = ctx.getImageData(0, 0, 40, 24);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Skip near-black and near-white so letterboxing doesn't wash it out.
          if (lum < 24 || lum > 236) continue;
          r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
        }
        if (!n) return resolve(null);
        // Push toward saturation so the glow reads as a colour, not grey.
        const avg = [r / n, g / n, b / n];
        const mean = (avg[0] + avg[1] + avg[2]) / 3;
        const sat = avg.map(x => Math.max(0, Math.min(255, mean + (x - mean) * 1.9)));
        resolve({ r: Math.round(sat[0]), g: Math.round(sat[1]), b: Math.round(sat[2]) });
      } catch {
        resolve(null); // canvas tainted — caller uses the category tint
      }
    };
    img.onerror = () => resolve(null);
    img.src = thumbUrl(v);
  });
}
