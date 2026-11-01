import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Kalos Pokedex: two graphite halves that slide apart vertically; a translucent screen lives in the gap.
// The only control is the centre lens, which opens and closes it.
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
  // Environment: a 64×32 equirect gradient (dark floor, bright horizon, blue sky, two white "windows").
  // The renderer PMREMs it at 16 px per cube face, a fraction of the RoomEnvironment's 256 px, with the same soft reflections.
  const envTex = (() => {
    const w = 64, h = 32, d = new Float32Array(w * h * 4); // linear HDR: the windows are far brighter than white
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const up = y / (h - 1), i = (y * w + x) * 4; // row 0 is the floor
      const win = (x > 8 && x < 18 && up > 0.6 && up < 0.85) || (x > 40 && x < 54 && up > 0.55 && up < 0.8);
      const [r, g, b] = win ? [6, 5.8, 5.6] : up < 0.5 ? [0.12 + up * 2.2, 0.12 + up * 2.2, 0.14 + up * 2.2] : [1.2 - (up - 0.5) * 1.2, 1.2 - (up - 0.5) * 1, 1.3 - (up - 0.5) * 0.6];
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 1;
    }
    const t = new THREE.DataTexture(d, w, h, THREE.RGBAFormat, THREE.FloatType);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.magFilter = t.minFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  })();
  scene.environment = envTex;
  scene.environmentIntensity = 0.5;

  // Glossy plastic with a clearcoat; the environment map gives the reflections.
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x1f3645, roughness: 0.45, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.18 });
  const darkMat = new THREE.MeshPhysicalMaterial({ color: 0x0b1620, roughness: 0.25, metalness: 0.15, clearcoat: 0.7, clearcoatRoughness: 0.1 });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xaac4d6, roughness: 0.35, metalness: 0.9 });
  // Opaque and matte: a reflective or translucent strip would blend streaks over the lens hole below it.
  const glowMat = new THREE.MeshStandardMaterial({ color: 0xe8eb1c, emissive: 0xe8eb1c, roughness: 0.7, envMapIntensity: 0, emissiveIntensity: 0.6 });
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
  const R = Math.min(W, HH * 2) * 0.26; // centre feature radius
  // Half of a rounded square (half-size o, corner r) above y = 0; with i > 0 it is a frame around an inner half-square (i, ri).
  const halfSquare = (o, r, i = 0, ri = 0) => {
    const s = new THREE.Shape();
    s.moveTo(-o, 0);
    if (i) { s.lineTo(-i, 0); s.lineTo(-i, i - ri); s.absarc(-i + ri, i - ri, ri, Math.PI, Math.PI / 2, true); s.lineTo(i - ri, i); s.absarc(i - ri, i - ri, ri, Math.PI / 2, 0, true); s.lineTo(i, 0); }
    s.lineTo(o, 0); s.lineTo(o, o - r); s.absarc(o - r, o - r, r, 0, Math.PI / 2, false); s.lineTo(-o + r, o); s.absarc(-o + r, o - r, r, Math.PI / 2, Math.PI, false);
    return s;
  };
  const extrude = (shape, depth, bevel) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 12 });
  // n copies of geo in one draw call; place(i, dummy) sets position/rotation/scale of copy i.
  const instances = (parent, geo, mat, n, place) => {
    const im = new THREE.InstancedMesh(geo, mat, n), o = new THREE.Object3D();
    for (let i = 0; i < n; i++) { o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); place(i, o); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
    parent.add(im);
    return im;
  };
  const finMat = new THREE.MeshStandardMaterial({ color: 0x59616d, roughness: 0.35, metalness: 0.85 });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // unlit; per-instance colour carries the skin glow and the pulse
  // Front face, one half per shell half g (seam edge at y = inner, sign = which half): a GPU vent. Dark rounded-square recess
  // in a chrome frame, metal fins that part around the lens, an LED strip between each pair of fins pulsing outward from the
  // seam (animated in tick via g.leds). Everything stays outside r = 1.3 (lens ring) and no higher than z = F + 0.09 (band face).
  const vent = (g, inner, theta, sign) => {
      const o = R * 0.95, r = R * 0.3;
      add(g, extrude(halfSquare(o, r), 0.04, 0.04), darkMat, 0, inner, F - 0.04, [0, 0, theta]);
      add(g, extrude(halfSquare(o + 0.16, r + 0.1, o - 0.02, r), 0.06, 0.03), ringMat, 0, inner, F - 0.02, [0, 0, theta]);
      // Half-width still inside the frame at height y: the frame's inner edge (o - 0.02, corner r) minus its bevel and a margin.
      const e = o - 0.15, cr = r - 0.13, cy0 = o - 0.02 - r;
      const chord = (y) => (y <= cy0 ? e : y >= cy0 + cr ? 0 : cy0 + Math.sqrt(cr * cr - (y - cy0) ** 2));
      // Rows [x, y, length, rowIndex] of bars `hgt` tall starting at y0, measured at their outer edge so corners are respected.
      const rows = (y0, hgt) => {
        const list = [];
        for (let y = y0, k = 0; chord(y + hgt / 2) > 0.4; y += 0.26, k++) {
          const w = chord(y + hgt / 2);
          if (y < 1.38) { const c = Math.sqrt(1.38 * 1.38 - y * y); if (w - c > 0.15) list.push([-(w + c) / 2, y, w - c, k], [(w + c) / 2, y, w - c, k]); } // split around the lens
          else list.push([0, y, 2 * w, k]);
        }
        return list;
      };
      const place = (list) => (i, o) => { o.position.set(list[i][0], inner + sign * list[i][1], F + 0.05); o.scale.x = list[i][2]; };
      const fins = rows(0.28, 0.1), leds = rows(0.41, 0.05);
      instances(g, new THREE.BoxGeometry(1, 0.1, 0.06), finMat, fins.length, place(fins));
      g.leds = instances(g, new THREE.BoxGeometry(1, 0.05, 0.04), ledMat, leds.length, place(leds));
      g.leds.rows = leds.map((l) => l[3]);
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
  // One half: shell, front-face feature, light band, corner screws.
  const half = (sign) => {
    const g = new THREE.Group();
    dex.add(g);
    const inner = -sign * HH / 2; // y of the edge that meets the other half
    add(g, new RoundedBoxGeometry(W, HH, D, 4, 0.5), bodyMat, 0, 0, 0);
    vent(g, inner, sign > 0 ? 0 : Math.PI, sign);
    // Glowing band round the whole shell near the seam, with a highlight that sweeps along the front.
    add(g, band(), glowMat, 0, inner + sign * 0.55 - 0.12, 0, [-Math.PI / 2, 0, 0]);
    g.sweep = add(g, new THREE.BoxGeometry(1.4, 0.18, 0.04), sweepMat, 0, inner + sign * 0.55, F + 0.12);
    // Corner screws: chrome heads sunk into the face with a slot, 0.6 in from the two outer corners.
    const outer = sign * (HH / 2 - 0.6), cx = W / 2 - 0.6;
    instances(g, new THREE.CylinderGeometry(0.16, 0.16, 0.06, 24).rotateX(Math.PI / 2), ringMat, 2, (i, o) => o.position.set(i ? cx : -cx, outer, F - 0.02));
    instances(g, new THREE.BoxGeometry(0.22, 0.04, 0.02), darkMat, 2, (i, o) => { o.position.set(i ? cx : -cx, outer, F + 0.01); o.rotation.z = Math.PI / 4; });
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

  // Renderers: CSS3D behind, WebGL (transparent) on top with pointer-events off.
  const css = new CSS3DRenderer();
  Object.assign(css.domElement.style, { position: 'absolute', inset: '0', zIndex: '0' });
  const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  gl.setPixelRatio(Math.min(devicePixelRatio, 2));
  Object.assign(gl.domElement.style, { position: 'absolute', inset: '0', zIndex: '1', pointerEvents: 'none' });
  root.prepend(gl.domElement);
  root.prepend(css.domElement);

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
  // Swipes on the screen scroll its panel; they must not also tilt the body.
  root.addEventListener('pointerdown', (e) => { if (!screenEl.contains(e.target)) drag = { x: e.clientX, y: e.clientY, moved: false }; });
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
    // Move the nav underline (classes mirror Nav.astro's navLinkClasses).
    const section = Object.keys(HASH_TAB).find((k) => HASH_TAB[k] === name);
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((a) => {
      const on = a.dataset.section === section;
      a.classList.toggle('text-graphite-primary', on);
      a.classList.toggle('font-bold', on);
      a.classList.toggle('border-graphite-primary-container', on);
      a.classList.toggle('text-graphite-on-surface-variant', !on);
      a.classList.toggle('border-transparent', !on);
    });
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
  const size = new THREE.Vector3(), center = new THREE.Vector3(), ledColor = new THREE.Color();
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
    // Vent LED strips: a pulse travelling outward from the seam, row by row; faster while loading, static if reduced motion.
    for (const g of [top, bottom]) if (g.leds) {
      const speed = reduced ? 0 : state.loading ? 7 : 2;
      g.leds.rows.forEach((k, i) => {
        const p = Math.max(0, Math.sin(t * speed - k * 0.9));
        g.leds.setColorAt(i, ledColor.copy(glowMat.color).multiplyScalar(0.25 + 1.1 * p * p));
      });
      g.leds.instanceColor.needsUpdate = true;
    }
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
