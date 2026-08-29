(function () {
  const canvas = document.getElementById('hero-network');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement || document.body;
  const portrait = document.querySelector('img[alt="Emmanuel Guerra portrait"]');
  let width, height, dpr;
  let particles = [];
  let animationId;
  let isVisible = true;
  let exclusion = null;

  const config = {
    particleCount: window.innerWidth < 640 ? 35 : 65,
    connectionDistance: 200,
    mouseRadius: 150,
    repulsionForce: 0.75,
    exclusionMargin: 40,
    exclusionForce: 1.2,
    baseSpeed: 0.3,
    nodeColor: '#84f6e6',
    lineColor: '#cbe6fb',
    nodeOpacity: 0.7,
    lineOpacity: 0.22,
  };

  function updateExclusionZone() {
    if (!portrait) {
      exclusion = null;
      return;
    }
    const portraitRect = portrait.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const cx = portraitRect.left + portraitRect.width / 2 - canvasRect.left;
    const cy = portraitRect.top + portraitRect.height / 2 - canvasRect.top;
    const radius = Math.max(portraitRect.width, portraitRect.height) / 2 + config.exclusionMargin;
    exclusion = { cx, cy, radius };
  }

  function isInsideExclusion(x, y) {
    if (!exclusion) return false;
    const dx = x - exclusion.cx;
    const dy = y - exclusion.cy;
    return Math.sqrt(dx * dx + dy * dy) < exclusion.radius;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateExclusionZone();
    initParticles();
  }

  function initParticles() {
    particles = [];
    let attempts = 0;
    while (particles.length < config.particleCount && attempts < config.particleCount * 20) {
      attempts++;
      const x = Math.random() * width;
      const y = Math.random() * height;
      if (isInsideExclusion(x, y)) continue;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * config.baseSpeed * 2,
        vy: (Math.random() - 0.5) * config.baseSpeed * 2,
        radius: Math.random() * 2.2 + 0.8,
      });
    }
  }

  const mouse = { x: -1000, y: -1000 };

  container.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function applyMouseRepulsion(p) {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < config.mouseRadius && dist > 0) {
      const force = (config.mouseRadius - dist) / config.mouseRadius;
      p.vx += (dx / dist) * force * config.repulsionForce;
      p.vy += (dy / dist) * force * config.repulsionForce;
    }
  }

  function applyExclusion(p) {
    if (!exclusion) return;
    const dx = p.x - exclusion.cx;
    const dy = p.y - exclusion.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < exclusion.radius && dist > 0) {
      const force = (exclusion.radius - dist) / exclusion.radius;
      p.vx += (dx / dist) * force * config.exclusionForce;
      p.vy += (dy / dist) * force * config.exclusionForce;
    }
  }

  function update() {
    for (const p of particles) {
      applyMouseRepulsion(p);
      applyExclusion(p);

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;

      if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.02;
      if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.02;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = config.lineColor;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectionDistance) {
          const opacity = (1 - dist / config.connectionDistance) * config.lineOpacity;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = config.nodeColor;
    for (const p of particles) {
      ctx.globalAlpha = config.nodeOpacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function loop() {
    if (!isVisible) {
      animationId = null;
      return;
    }
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  const observer = new IntersectionObserver((entries) => {
    const wasVisible = isVisible;
    isVisible = entries[0].isIntersecting;
    if (isVisible && !wasVisible && !animationId) {
      animationId = requestAnimationFrame(loop);
    }
  }, { threshold: 0 });
  observer.observe(canvas);

  window.addEventListener('resize', resize);
  resize();
  loop();

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
    observer.disconnect();
    window.removeEventListener('resize', resize);
  });
})();
