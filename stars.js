(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('class', 'stars'); s.setAttribute('aria-hidden', 'true');
  const W = 1600, H = 1000;
  s.setAttribute('viewBox', `0 0 ${W} ${H}`);
  s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  let seed = 2127;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let h = '';
  for (let i = 0; i < 520; i++) {
    const r = .4 + rnd() * rnd() * .9;
    const o = (.1 + rnd() * rnd() * .55).toFixed(2);
    h += `<circle cx="${(rnd() * W).toFixed(1)}" cy="${(rnd() * H).toFixed(1)}" r="${r.toFixed(2)}" opacity="${o}"/>`;
  }
  s.innerHTML = h;
  document.body.prepend(s);
})();
