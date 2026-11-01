import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Kalos Pokedex: two red halves that slide apart vertically; a translucent screen lives in the gap.
// The only control is the centre lens, which opens and closes it.
const SKINS = {
  red: { body: 0xc4202f, dark: 0x1a1a1f, ring: 0xc9ccd1, glow: 0x7fe9ff },
  graphite: { body: 0x1f3645, dark: 0x0b1620, ring: 0xaac4d6, glow: 0xe8eb1c },
};
const HASH_TAB = { about: 'info', contact: 'contact', projects: 'projects', blog: 'blog' };

const root = document.getElementById('dex');
if (root) init(root);

function init(root) {
  const $ = (id) => document.getElementById(id);
  const openBtn = $('dex-open'), screenEl = $('dex-screen');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // shortcut: device shape is picked once from the initial width; a resize across 720px needs a reload.
  const portrait = root.clientWidth < 720;
  root.classList.toggle('dex-portrait', portrait);
  const W = portrait ? 10 : 16, HH = portrait ? 4 : 5, D = 1.4, GAP = portrait ? 14 : 10;
  const PX = portrait ? 34 : 64; // CSS pixels per world unit for the screen
  const SW = W - 0.6, SH = GAP;
  screenEl.style.width = `${SW * PX}px`;
  screenEl.style.height = `${SH * PX}px`;
  openBtn.style.width = openBtn.style.height = `${2.2 * PX}px`; // must match its hole mesh exactly
  root.style.setProperty('--dex-lens', `${1.2 * PX}px`); // how far the lens reaches up into the screen

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(6, 10, 12); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.6); fill.position.set(-8, -4, -6); scene.add(fill);

  // Glossy plastic with a clearcoat; the environment map (set up after the renderer) gives the reflections.
  const bodyMat = new THREE.MeshPhysicalMaterial({ roughness: 0.45, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.18 });
  const darkMat = new THREE.MeshPhysicalMaterial({ roughness: 0.25, metalness: 0.15, clearcoat: 0.7, clearcoatRoughness: 0.1 });
  const ringMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.9 });
  // Opaque and matte: a reflective or translucent strip would blend streaks over the lens hole below it.
  const glowMat = new THREE.MeshStandardMaterial({ roughness: 0.7, envMapIntensity: 0, emissiveIntensity: 0.6 });
  const sweepMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.5, envMapIntensity: 0 });
  // Transparent-but-depth-writing "hole": the CSS3D layer behind the canvas shows through only here.
  const holeMat = new THREE.MeshBasicMaterial({ color: 0, opacity: 0, blending: THREE.NoBlending });

  const dex = new THREE.Group();
  dex.rotation.order = 'YXZ'; // pitch first, then turntable yaw around the world axis
  scene.add(dex);
  const add = (parent, geo, mat, x, y, z, rot) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
    parent.add(m);
    return m;
  };
  const F = D / 2; // front face
  const R = Math.min(W, HH * 2) * 0.26; // pokeball circle radius
  // Bevelled half-disc, extruded towards +z: the black half of the pokeball with a real edge.
  const halfDisc = (theta) => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, R, theta, theta + Math.PI, false);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4, curveSegments: 48 });
  };
  // Light band: the shell's cross-section grown by 0.06 (rounded rect, r 0.56), extruded 0.24 along y, so it wraps all the way round.
  const band = () => {
    const w = W / 2 + 0.06, d = F + 0.06, r = 0.56, s = new THREE.Shape();
    s.moveTo(-w + r, -d);
    s.lineTo(w - r, -d); s.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
    s.lineTo(w, d - r); s.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
    s.lineTo(-w + r, d); s.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(-w, -d + r); s.absarc(-w + r, -d + r, r, Math.PI, Math.PI * 1.5, false);
    return new THREE.ExtrudeGeometry(s, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 16 });
  };
  // One half: shell, black dish + chrome torus arc at the inner edge, light band, corner ridges.
  const half = (sign) => {
    const g = new THREE.Group();
    dex.add(g);
    const inner = -sign * HH / 2; // y of the edge that meets the other half
    add(g, new RoundedBoxGeometry(W, HH, D, 4, 0.5), bodyMat, 0, 0, 0);
    const theta = sign > 0 ? 0 : Math.PI;
    add(g, halfDisc(theta), darkMat, 0, inner, F - 0.04);
    add(g, new THREE.TorusGeometry(R + 0.16, 0.11, 12, 48, Math.PI), ringMat, 0, inner, F + 0.02, [0, 0, theta]);
    // Glowing band round the whole shell near the seam, with a highlight that sweeps along the front.
    add(g, band(), glowMat, 0, inner + sign * 0.55 - 0.12, 0, [-Math.PI / 2, 0, 0]);
    g.sweep = add(g, new THREE.BoxGeometry(1.4, 0.18, 0.04), sweepMat, 0, inner + sign * 0.55, F + 0.12);
    // Corner ridges: quarter-torus arcs centred on the two outer corners, only the part inside the shell.
    // Centred 0.6 in from the corner (the flat part of the face, past the 0.5 edge radius) and half sunk in.
    const outer = sign * (HH / 2 - 0.6), cx = W / 2 - 0.6;
    const qL = sign > 0 ? -Math.PI / 2 : 0, qR = sign > 0 ? Math.PI : Math.PI / 2;
    add(g, new THREE.TorusGeometry(1.8, 0.06, 8, 32, Math.PI / 2), darkMat, -cx, outer, F - 0.03, [0, 0, qL]);
    add(g, new THREE.TorusGeometry(1.8, 0.06, 8, 32, Math.PI / 2), darkMat, cx, outer, F - 0.03, [0, 0, qR]);
    return g;
  };
  const top = half(1), bottom = half(-1);
  // Lens rides with the bottom half; closed it sits dead centre, open it peeks over the screen's bottom edge.
  add(bottom, new THREE.TorusGeometry(1.16, 0.08, 12, 48), ringMat, 0, HH / 2, F + 0.18);
  add(bottom, new THREE.CircleGeometry(1.1, 48), holeMat, 0, HH / 2, F + 0.2);
  const lens = new CSS3DObject(openBtn);
  lens.position.set(0, HH / 2, F + 0.21);
  lens.scale.setScalar(1 / PX);
  bottom.add(lens);
  // Screen: sunk below the rounded seam between the halves, so nothing of it shows until they slide apart.
  const plate = add(dex, new THREE.BoxGeometry(SW + 0.4, SH - 0.4, 0.2), darkMat, 0, 0, -0.05); // back plate: seen from behind when open; grows with the gap
  const screenHole = add(dex, new THREE.PlaneGeometry(SW, SH), holeMat, 0, 0, 0.1);
  const screen = new CSS3DObject(screenEl);
  screen.position.set(0, 0, 0.11);
  screen.scale.setScalar(1 / PX);
  dex.add(screen);

  const setSkin = (name) => {
    const s = SKINS[name] || SKINS.red;
    bodyMat.color.set(s.body); darkMat.color.set(s.dark); ringMat.color.set(s.ring);
    glowMat.color.set(s.glow); glowMat.emissive.set(s.glow);
    root.dataset.skin = name;
    root.querySelectorAll('.dex-skin').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.skin === name)));
    try { localStorage.setItem('dex-skin', name); } catch {}
  };
  let saved = 'red';
  try { saved = localStorage.getItem('dex-skin') || 'red'; } catch {}
  setSkin(saved);
  root.querySelectorAll('.dex-skin').forEach((b) => b.addEventListener('click', () => setSkin(b.dataset.skin)));

  // Renderers: CSS3D behind, WebGL (transparent) on top with pointer-events off.
  const css = new CSS3DRenderer();
  Object.assign(css.domElement.style, { position: 'absolute', inset: '0', zIndex: '0' });
  const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  gl.setPixelRatio(Math.min(devicePixelRatio, 2));
  Object.assign(gl.domElement.style, { position: 'absolute', inset: '0', zIndex: '1', pointerEvents: 'none' });
  root.prepend(gl.domElement);
  root.prepend(css.domElement);
  scene.environment = new THREE.PMREMGenerator(gl).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;

  const state = { open: false, loading: false, yaw: 0, pitch: 0, interacted: false };
  const cur = { slide: 0, pitch: 0, yaw: 0, dist: 40, cx: 0, cy: 0 };
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  let aspect = 1;
  const resize = () => {
    const w = root.clientWidth, h = root.clientHeight;
    aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    gl.setSize(w, h);
    css.setSize(w, h);
  };
  new ResizeObserver(resize).observe(root);
  resize();

  // Drag to rotate (full 360° yaw, clamped pitch). Clicks right after a drag are swallowed.
  let drag = null, lastDragEnd = 0;
  root.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, moved: false }; });
  root.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) { drag.moved = true; state.interacted = true; root.setPointerCapture(e.pointerId); }
    state.yaw += dx * 0.01;
    state.pitch = THREE.MathUtils.clamp(state.pitch + dy * 0.01, -0.8, 0.8);
    cur.yaw = state.yaw;
    drag.x = e.clientX; drag.y = e.clientY;
  });
  const endDrag = () => { if (drag?.moved) lastDragEnd = performance.now(); drag = null; };
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);
  root.addEventListener('click', (e) => { if (performance.now() - lastDragEnd < 300) { e.stopPropagation(); e.preventDefault(); } }, true);

  // Open / close with a loading phase (portrait decoded + a short boot delay).
  const imagesReady = () => Promise.all([...screenEl.querySelectorAll('img:not([loading])')].map((img) =>
    img.complete ? img.decode().catch(() => {}) : new Promise((r) => { img.onload = img.onerror = r; })));
  const open = async () => {
    if (state.open || state.loading) return;
    state.loading = true;
    state.interacted = true;
    openBtn.disabled = true;
    openBtn.setAttribute('aria-label', openBtn.dataset.loading);
    await Promise.all([imagesReady(), new Promise((r) => setTimeout(r, reduced ? 300 : 1200))]);
    state.loading = false;
    state.open = true;
    state.yaw = Math.round(state.yaw / (2 * Math.PI)) * 2 * Math.PI; // face the camera via the shortest way
    state.pitch = 0;
    openBtn.disabled = false;
    openBtn.setAttribute('aria-label', openBtn.dataset.close);
  };
  const close = () => {
    state.open = false;
    state.pitch = 0;
    openBtn.setAttribute('aria-label', openBtn.dataset.open);
  };
  openBtn.addEventListener('click', () => (state.open ? close() : open()));

  // Tabs + nav hash links (#about, #projects, #contact, #blog).
  const tabs = [...screenEl.querySelectorAll('[data-tab]')];
  const panels = screenEl.querySelector('.dex-panels');
  // "More below" chevron: shown while the panel can still scroll down.
  const scrollHint = () => root.classList.toggle('dex-more', panels.scrollTop + panels.clientHeight < panels.scrollHeight - 8);
  const selectTab = (name) => {
    tabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    screenEl.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== name; });
    panels.scrollTop = 0;
    scrollHint();
  };
  tabs.forEach((b) => b.addEventListener('click', () => selectTab(b.dataset.tab)));
  const onHash = () => {
    const tab = HASH_TAB[location.hash.slice(1)];
    if (!tab) return;
    selectTab(tab);
    open();
  };
  addEventListener('hashchange', onHash);
  onHash();
  panels.addEventListener('scroll', scrollHint, { passive: true });
  new ResizeObserver(scrollHint).observe(panels);

  // Contact: copy email.
  const contactBtn = $('dex-contact'), copied = $('dex-copied');
  let hideTimer;
  contactBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contactBtn.dataset.email);
      copied.classList.replace('opacity-0', 'opacity-100');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => copied.classList.replace('opacity-100', 'opacity-0'), 3000);
    } catch {
      location.href = `mailto:${contactBtn.dataset.email}`;
    }
  });

  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = reduced ? 1 : 0.08;
  const box = new THREE.Box3();
  const size = new THREE.Vector3(), center = new THREE.Vector3();
  const tick = (now) => {
    const t = now / 1000;
    // Always-on life: bob, sway and a slow tilt wobble. Bigger while closed and untouched, subtle otherwise.
    const life = reduced ? 0 : state.open ? 0.25 : state.interacted ? 0.4 : 1;
    const sway = Math.sin(t * 0.6) * 0.35 * life;
    const wobble = Math.sin(t * 0.9) * 0.04 * life;
    const roll = Math.sin(t * 0.7) * 0.02 * life;
    const bob = Math.sin(t * 1.1) * 0.25 * life;
    cur.yaw = lerp(cur.yaw, state.yaw, ease);
    cur.pitch = lerp(cur.pitch, state.pitch, ease);
    cur.slide = lerp(cur.slide, state.open ? 1 : 0, ease * 0.8);
    dex.rotation.set(cur.pitch + wobble, cur.yaw + sway, roll);
    top.position.y = HH / 2 + cur.slide * GAP / 2;
    bottom.position.y = -top.position.y;
    // The screen and plate can be taller than the closed shell (portrait), so only the part inside the gap exists.
    plate.scale.y = Math.max(0.001, cur.slide);
    screenEl.style.clipPath = `inset(${(1 - cur.slide) * SH / 2 * PX}px 0)`;
    screenEl.style.pointerEvents = cur.slide > 0.9 ? 'auto' : 'none'; // the DOM is still there behind the closed shell
    // Frame the whole device while closed, just the screen (plus a bit of shell) once open.
    const settled = state.open && cur.slide > 0.75;
    dex.position.set(0, 0, 0);
    dex.updateMatrixWorld(true);
    box.setFromObject(settled ? screenHole : dex).getSize(size);
    box.getCenter(center);
    cur.cx = lerp(cur.cx, -center.x, ease);
    cur.cy = lerp(cur.cy, -center.y, ease);
    dex.position.set(cur.cx, cur.cy + bob, 0);
    const pad = settled ? (portrait ? 1.4 : 3) : 4; // phones: let the screen use nearly the full width
    const fit = Math.max((size.y + pad) / 2 / tanHalf, (size.x + pad) / 2 / (tanHalf * aspect)) + Math.max(0, box.max.z);
    cur.dist = lerp(cur.dist, fit, ease);
    camera.position.set(0, 0, cur.dist);
    camera.lookAt(0, 0, 0);
    glowMat.emissiveIntensity = state.loading ? 0.6 + 0.8 * Math.abs(Math.sin(t * 8)) : state.open ? 1.1 : 0.5 + 0.2 * Math.sin(t * 1.5);
    const sweepX = (W - 2.6) / 2 * Math.sin(t * (state.loading ? 6 : 1.4)); // highlight scanning along the front of the bands
    top.sweep.position.x = sweepX;
    bottom.sweep.position.x = -sweepX;
    gl.render(scene, camera);
    css.render(scene, camera);
    root.classList.add('dex-ready');
    root.classList.toggle('dex-open', state.open);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
