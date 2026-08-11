/* ══════════════════════════════════════
   SITE CONTENT — edit this file, not the components.
   YouTube is the source of truth for video: thumbnails and
   embeds are always public, unlike Drive links which 403 or
   die when sharing settings change.
   ══════════════════════════════════════ */

// The award winner leads the page — strongest single credential.
export const FEATURED_ID = 'brief';

// Ordered best-first: the featured award winner leads (rendered separately),
// then the two solo-shot-and-edited music videos, then full-pipeline solo
// work (writer/director/DP/editor), then live-directing credits, then
// broadcast/teaser work, weakest (no-credit intro graphics) last.
export const VIDEOS = [
  { id:'brief',    title:'The Briefcase',          cat:'Short Film',     role:'Lead Actor · DP · Editor',        year:'2024', desc:'Crime thriller. Two couriers, one briefcase.',               yt:'pUZkiH74yTU', feat:true,  pos:'top',
    note:'Best First-Year Drama · Lead Actor · Supporting Actor' },
  { id:'10m',      title:'10 Million',             cat:'Music Video',    role:'Solo Shot · Edited',              year:'2026', desc:'Shot, lit, and edited solo.',                               yt:'3frfHolmYkE', feat:true,  pos:'center' },
  { id:'black',    title:'Black Stuff',            cat:'Music Video',    role:'Solo Shot · Edited',              year:'2025', desc:'Dark aesthetics, deep narrative weight.',                    yt:'NqcGtFr95oM', feat:true,  pos:'center' },
  { id:'psa',      title:'The Grand PSA',          cat:'Commercial',     role:'Writer · Director · DP · Editor', year:'2025', desc:'Wrote, directed, shot, and graded.',                         yt:'Z9hXm2u4cZw', feat:false, pos:'center' },
  { id:'altitude', title:'The Pursuit of Altitude',cat:'Documentary',    role:'Writer · Director · DP · Editor', year:'2024', desc:'Visual storytelling through landscape and movement.',        yt:'wHwXBw2xk5M', feat:false, pos:'left' },
  { id:'intv',     title:'Live Interview Show',    cat:'Live Multi-Cam', role:'Director · Producer',             year:'2025', desc:'Directing multiple camera operators in real time.',          yt:'rctvfSJsO9Y', feat:false, pos:'left' },
  { id:'cook',     title:'Live Cooking Demo',      cat:'Live Multi-Cam', role:'Producer · Director · DP',        year:'2025', desc:'Real-time switching, no second takes.',                      yt:'R2IZKAHYmME', feat:false, pos:'top' },
  { id:'news',     title:'Banded Peak News Pack',  cat:'Broadcast',      role:'Camera Op · Editor',              year:'2024', desc:'Broadcast news package under deadline.',                     yt:'l6JnCA7e3DY', feat:false, pos:'center' },
  { id:'audio',    title:'The Audio Blueprint',    cat:'Doc Teaser',     role:'Director · Writer · Editor',      year:'2025', desc:'Sound design — the secret weapon behind iconic movies.',     yt:'FiTiVNZxTPs', feat:false, pos:'center' },
  { id:'fraud',    title:'Fraud',                  cat:'Doc Teaser',     role:'Producer · Editor',               year:'2024', desc:'How fraud operates in plain sight.',                         yt:'E6rydhe1PAY', feat:false, pos:'center' },
  { id:'sports',   title:'Live Sports Show Intro', cat:'Live Multi-Cam', role:'Director · Editor',               year:'2025', desc:'Live broadcast opener. Motion graphics meets live energy.',  yt:'gWYoZh9kl9I', feat:false, pos:'center' },
];

export const CREW_CREDITS = [
  { title:'The Bite', cat:'Short Film', role:'Script Supervisor', org:'Red Stripe Studio', date:'Aug 2026' },
];

/* Sample pages only — the full spec is shared on request, not published. */
export const WRITING = {
  title: 'Femme Fatale: The Useful Dead',
  meta: 'Original Spec · Noir Thriller · Limited Series',
  blurb: 'Port-au-Prince, 1957, cut against a Parisian television studio — a woman who survives not with weapons, but with the story she chooses to tell.',
  excerpt: [
    { t:'scene',  x:'INT. ORTF TELEVISION STUDIO — PARIS — NIGHT' },
    { t:'action', x:"A makeup brush moves across IRIS BEAUMONT's cheekbone." },
    { t:'action', x:"She watches herself in the mirror attentively as she's being pampered, analyzing every crevice and detail in her face." },
    { t:'action', x:"Her glance lingering to the reflection of the signal on the monitor behind her showcasing a classic 30's alt flick." },
    { t:'action', x:'It quickly switches to a close-up shot of herself from what seems like a hidden camera.' },
    { t:'action', x:'An unnerving feeling brewing as she watches.' },
    { t:'action', x:'The artist sets the pencil down with a CLANG. Snapping Iris out of her trance.' },
    { t:'char',   x:'MAKEUP ARTIST' },
    { t:'paren',  x:'(French, soft)' },
    { t:'dialog', x:'All set.' },
    { t:'action', x:'Iris looks at her hands in her lap. Her right thumb finding the inside of her left wrist and pressing.' },
    { t:'action', x:"The FLOOR MANAGER's reflection enters frame left holding up five fingers." },
    { t:'action', x:'Four. Three. Two.' },
    { t:'action', x:'The studio lights rise to a warm golden spotlight.' },
    { t:'action', x:'Between them, a lone white rose in a thin glass vase.' },
    { t:'char',   x:'INTERVIEWER' },
    { t:'paren',  x:'(not looking up)' },
    { t:'dialog', x:"So, we'll start with Charles. Then Cécile. Then him." },
    { t:'char',   x:'IRIS' },
    { t:'dialog', x:'Naturally.' },
  ],
};

/* Scripts that are safe to publish in full — written for clients/coursework.
   Entries without a `did` render as an in-progress credit, not a link. */
export const OTHER_WRITING = [
  { type:'PSA Script', title:'A Stage for Every Story', sub:'The Grand Theatre',  did:'1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf' },
  { type:'Screenplay', title:'Live From Los Santos',    sub:'In development',     did:null },
];

export const SKILL_GROUPS = [
  { label:'Edit & Post',  color:'#d7340b', items:['Premiere Pro','DaVinci Resolve','Color Grading','Sound & Mix'] },
  { label:'Camera & Set', color:'#6366f1', items:['Cinematography','Lighting','Live Multi-Cam','Script Supervision'] },
  { label:'Story',        color:'#10b981', items:['Screenwriting','Directing','On-Camera','Production Planning'] },
  { label:'Design',       color:'#f59e0b', items:['Photoshop','Brand & Logo Design','Motion Graphics','Thumbnails & Posters'] },
];

export const FACTS = [
  ['Based',     'Calgary, AB'],
  ['Available', 'Part-time or project work'],
  ['Setup',     'On-site or fully remote'],
  ['Cuts on',   'Premiere Pro · DaVinci Resolve'],
  ['Also',      'Camera op · Directing · Script supervision'],
];

export const EMAIL = 'peterolowude@icloud.com';

export const SOCIALS = [
  { label:'Instagram', href:'https://www.instagram.com/lonerkid' },
  { label:'YouTube',   href:'https://www.youtube.com/@lonerkid' },
  { label:'Twitch',    href:'https://www.twitch.tv/lonerfs' },
  { label:'X',         href:'https://x.com/lonerfss' },
  { label:'LinkedIn',  href:'https://linkedin.com/in/peterolowude' },
];
