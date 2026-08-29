(function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-section], .mobile-nav-link[data-section]'));
  if (!navLinks.length) return;

  const linksBySection = new Map(navLinks.map((link) => [link.dataset.section, link]));
  const sections = Array.from(linksBySection.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('font-bold', isActive);
      link.classList.toggle('text-graphite-primary', isActive);
      link.classList.toggle('border-graphite-primary-container', isActive);
      link.classList.toggle('text-graphite-on-surface-variant', !isActive);
      link.classList.toggle('border-transparent', !isActive);
    });
  }

  let currentId = null;
  const visibleRatios = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });

    let bestId = currentId;
    let bestRatio = 0;
    visibleRatios.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });

    if (bestRatio > 0 && bestId !== currentId) {
      currentId = bestId;
      setActiveLink(currentId);
    }
  }, { rootMargin: '-100px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

  sections.forEach((section) => observer.observe(section));
})();
