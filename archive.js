(() => {
  'use strict';

  const ZONES = {
    D1: { code: 'D1', tag: 'DOME 1 · OLD TOWN', name: '구시가', en: 'Old Town', area: '가장 크고 오래된 돔', built: '최초 건설', use: '행정 · 생활 · 생명유지 핵심',
      note: '정착의 출발점. 외벽을 따라 관측창이 이어지는 창 회랑이 있다. 지상에는 얇은 돔 껍질만 두고 나머지는 전부 지하로 파 내려갔다. 지표층부터 핵심층까지 네 층.' },
    D2: { code: 'D2', tag: 'DOME 2 · HOUSING + SCHOOL', name: '주거 + 학교', en: 'Housing + School', area: '중형 돔', built: '2차 확장', use: '주거 A · 주거 B · 학교',
      note: '북동쪽 중형 돔. 가족 단위 숙소가 주거 A · 주거 B 두 구역으로 나뉘어 있고, 그 맞은편에 학교가 있다.' },
    D3: { code: 'D3', tag: 'DOME 3 · FARM ANNEX', name: '농장 별관 + 미입주 블록', en: 'Farm Annex + Unoccupied Blocks', area: '중형 돔 · 일부 미완', built: '최신 · 공사 중', use: '농장 · 예비 주거',
      note: '남동쪽, 가장 새 돔. 농장 별관이 가동 중이고 나머지 블록은 아직 비어 있다. 도면의 해칭 구역이 미입주 블록.' },
    AQ: { code: 'AT', tag: 'ADVANCE TEAM QUARTER', name: '선발대 거주구', en: 'Advance Team Quarter', area: '최외곽 확장 돔 · 최소형', built: '돔 1 외벽에 증축', use: '선발대 숙소 · 장비 · 대기',
      note: '돔 1 외벽에 붙은 가장 작은 확장 돔. 연결 통로 하나로 본체와 이어진다. 서른 명 규모로 지었으나 일곱 명이 산다. 지상층만 화성이 보인다.' },
    OD: { code: 'OD', tag: 'OBSERVATION DECK', name: '전망대', en: 'Observation Deck', area: '지상 구조물', built: '—', use: '관측',
      note: '돔 바깥의 솟은 구조물. 돔 안에서 창으로 보는 것과 다르게, 여기서는 지평선이 통째로 보인다.' },
    LF: { code: 'LF', tag: 'LANDING FIELD', name: '착륙장', en: 'Landing Field', area: '남쪽 · 지상 셔틀 패드', built: '—', use: '셔틀 · 화물',
      note: '정착지 남쪽의 지상 셔틀 패드. 이주창마다 한 번 바빠지고, 나머지 기간은 바람이 쓴다.' },
    L0: { code: '1F', tag: 'DOME 1 · 1F', name: '지표층', en: 'Surface Level', area: '지상 1층', built: '—', use: '에어록 · 슈트실 · 로버 격납고 · 검역 · 창 회랑',
      note: '바깥과 맞닿은 층. 오염 구역으로 분류되어 오래 머무르지 않는다. 화성을 눈으로 볼 수 있는 창 회랑이 이 층에 있다.' },
    L1: { code: 'B1', tag: 'DOME 1 · B1', name: '중층', en: 'Mid Level', area: '지하 1층', built: '—', use: '정착지 당국 · 컨소시엄 사무실 · 보안 · 의료동',
      note: '행정과 보안. 보안은 사무실 하나와 구금실 하나. 의료동은 복도 하나를 따라 접수·진료실 둘·상담실·수술/응급 겸용실·입원 침상 여섯·음압 격리실·재활실·약국(잠금)·치과 의자 하나가 늘어선다. 복도 끝 계단은 영구 봉쇄.' },
    L2: { code: 'B2', tag: 'DOME 1 · B2', name: '심층', en: 'Deep Level', area: '지하 2층', built: '—', use: '식당(타운홀) · 배급소 · 상점 · 물물교환 게시판 · 기념벽 + 기도실',
      note: '사람이 모이는 층. 식당이 곧 타운홀이다. 배급소와 상점, 물물교환 게시판, 그리고 기념벽과 기도실.' },
    L3: { code: 'B3', tag: 'DOME 1 · B3', name: '핵심층', en: 'Core Level', area: '지하 3층', built: '—', use: '중앙 생명유지(ECLSS) · 소형 핵분열로 + 태양광 보조',
      note: '가장 깊은 층. 중앙 생명유지 장치와 소형 핵분열로. 출입 제한.' },
    A0: { code: '1F', tag: 'ADVANCE TEAM QUARTER · 1F', name: '지표층', en: 'Surface', area: '지상 1층', built: '—', use: '에어록 · 슈트실 · 로버 격납고(가압 로버 1) · 제염 · 검역 · 창 라운지',
      note: '선발대 거주구에서 화성이 보이는 유일한 층. 가압 로버 한 대가 격납고에 있다. 나갈 때와 들어올 때 반드시 거치는 제염·검역.' },
    A1: { code: 'B1', tag: 'ADVANCE TEAM QUARTER · B1', name: '중층', en: 'Mid Level', area: '지하 1층', built: '—', use: '정비실 · 장비 창고 · 데이터실 · 브리핑실',
      note: '일하는 층. 장비를 고치고, 자료를 정리하고, 다음 출동을 짠다.' },
    A2: { code: 'B2', tag: 'ADVANCE TEAM QUARTER · B2', name: '심층', en: 'Deep Level', area: '지하 2층', built: '—', use: '개인실 ×7 · 공용 라운지 · 간이 주방 · 식탁 · 훈련 구역',
      note: '창이 없는 층. 정원보다 큰 개인실 일곱 개와 공용 라운지, 간이 주방, 식탁 하나, 훈련 구역.' }
  };

  const TEAM = [
    { no: '01', name: '오크사나 루먄체바', latin: 'Oxana Rumyantseva', nation: '러시아', age: '여 · 39세', role: '선발대장 (Captain)', org: '러시아 국가우주공사',
      duty: '팀장', roles: ['진입 여부 · 경로 · 철수 시점의 최종 결정권', '모든 보고서의 최종 서명자. 컨소시엄 보고 계통의 종착점'] },
    { no: '02', name: '윤승언', latin: 'Yoon Seungeon', nation: '대한민국', age: '남 · 39세', role: '부팀장 (Second-in-Command)', org: '한국항공우주연구원 계통',
      duty: '부팀장', roles: ['작전 전술 · 기동 경로 설계. 진입로 · 이탈선 · 낙오선 수립', '대장 판단 보좌 및 현장 실행 관리'] },
    { no: '03', name: '뤼번 싱클레어', latin: 'Ruben Sinclair', nation: '미국 (네덜란드 출생)', age: '남 · 35세', role: '근접 대응 요원 (Close-Quarters Response)', org: 'NASA 계통',
      duty: '팀원', roles: ['선두(Point) 담당 — 최초 진입로 확보, 접근로 정리', '나이프 운용. 기척 차단과 감각 탐지(특히 청각) 우수'] },
    { no: '04', name: '레안더 비쇼프', latin: 'Leander Bischoff', nation: '독일', age: '남 · 35세', role: '돌파 · 전투공병 (Breaching · Combat Engineer)', org: 'ESA (유럽우주국)',
      duty: '팀원', roles: ['폐쇄 통로 · 붕괴 지형 · 잠긴 구조물의 절단 · 해체 · 폭파', '성형작약과 지향성 폭약의 정밀 폭파 — 대형 · 재난급 개체 대응 시 팀 최대 화력'] },
    { no: '05', name: '이고르', latin: 'Igor', nation: '브라질', age: '남 · 32세', role: '근접 돌격 · 정면 화력 (Assault · Frontal Firepower)', org: '브라질 우주국',
      duty: '팀원', roles: ['근접 돌격 담당. 마체테 운용', '정면 화력 전개 — 교전 시 전위 유지'] },
    { no: '06', name: '나오키', latin: 'Naoki', nation: '신원 말소', age: '남 · 29세', role: '환경 · 지질 계측 / 장거리 저격 (Survey · Sniper)', org: '—',
      duty: '팀원', roles: ['위성 · 지형 데이터 분석, 출동 전 이상징후 선별', '지반 · 기압 · 방사선 환경 측정 및 기록'] },
    { no: '07', name: '루이 브로되르', latin: 'Louis Brodeur', nation: '캐나다 (프랑스계)', age: '남 · 24세', role: '군의관 / 현장 해부 · 시료채취 (Medic · Field Dissection)', org: '캐나다 우주청',
      duty: '팀원', roles: ['현장 응급처치, 대원 건강 관리, 복약 통제', '미확인 개체 현장 해부 및 시료 채취 — 구조 · 생리 1차 매핑'] }
  ];

  const SITES = [
    { id: 'D1', n: 1, parts: ['L0', 'L1', 'L2', 'L3'] },
    { id: 'D2', n: 2, parts: [] },
    { id: 'D3', n: 3, parts: [] },
    { id: 'AQ', n: 4, parts: ['A0', 'A1', 'A2'] },
    { id: 'OD', n: 5, parts: [] },
    { id: 'LF', n: 6, parts: [] }
  ];
  const callouts = document.getElementById('callouts');
  callouts.innerHTML = SITES.map(sd => {
    const z = ZONES[sd.id];
    return `<li data-id="${sd.id}" tabindex="0"><span class="n">${sd.n}</span><span>${z.name}<small>${z.en}</small></span></li>`;
  }).join('');

  const modal = document.getElementById('zone-modal');
  const mMap = document.getElementById('modal-map');
  const mText = document.getElementById('modal-text');
  let current = null;

  function partText(z) {
    return `<dl><dt>규모</dt><dd>${z.area}</dd><dt>용도</dt><dd>${z.use}</dd></dl><p>${z.note}</p>`;
  }
  const mFoot = document.getElementById('modal-foot');
  function renderText(site, partId) {
    const z = ZONES[site.id];
    const parts = site.parts.map(pid => {
      const p = ZONES[pid];
      return `<li data-part="${pid}" class="${pid === partId ? 'sel' : ''}">${p.code}</li>`;
    }).join('');
    mText.innerHTML = `<h3 id="modal-title">${z.name}</h3><p class="en">${z.en}</p>${partText(z)}${parts ? `<ol class="parts">${parts}</ol>` : ''}`;
    if (partId) {
      const p = ZONES[partId];
      mFoot.innerHTML = `<div class="foot-grid"><h4>${p.code} <span>${p.name}</span></h4><div><dl><dt>용도</dt><dd>${p.use}</dd></dl><p>${p.note}</p></div></div>`;
      mFoot.hidden = false;
    } else { mFoot.hidden = true; mFoot.innerHTML = ''; }
    mMap.querySelectorAll('.zone').forEach(g => g.classList.toggle('sel', g.dataset.id === partId));
  }
  function openSite(id, partId) {
    const site = SITES.find(s => s.id === id);
    if (!site) return;
    current = site;
    const src = document.getElementById('det-' + id);
    mMap.innerHTML = '';
    if (src) mMap.appendChild(src.cloneNode(true));
    modal.querySelector('.modal-box').classList.toggle('nomap', !src);
    renderText(site, partId || null);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; current = null; }

  document.querySelector('.bp.site').addEventListener('click', (e) => { const g = e.target.closest('.zone'); if (g) openSite(g.dataset.id); });
  callouts.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) openSite(li.dataset.id); });
  callouts.addEventListener('keydown', (e) => { const li = e.target.closest('li'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openSite(li.dataset.id); } });
  mMap.addEventListener('click', (e) => { const g = e.target.closest('.zone'); if (g && current) renderText(current, g.dataset.id); });
  mText.addEventListener('click', (e) => { const li = e.target.closest('li[data-part]'); if (li && current) renderText(current, li.dataset.part); });
  document.getElementById('modal-x').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  const roster = document.getElementById('roster');
  roster.innerHTML = TEAM.map(a => `
      <article class="agent">
        <div class="ag-h"><span class="idx">${a.no}</span><span class="duty">${a.duty}</span></div>
        <div class="ag-photo"></div>
        <h3>${a.name} <span class="lat">${a.latin}</span></h3>
        <p class="role">${a.role}</p>
        <dl><dt>국적</dt><dd>${a.nation}</dd><dt>신상정보</dt><dd>${a.age}</dd><dt>파견</dt><dd>${a.org}</dd></dl>
        <ul class="roles">${a.roles.map(r => `<li>${r}</li>`).join('')}</ul>
      </article>`).join('') + (TEAM.length % 2 ? `
      <div class="agent agent-blank" aria-hidden="true"><span>— End of Roster —</span></div>` : '');

  function makeSlider(trackId, prevId, nextId, countId) {
    const track = document.getElementById(trackId);
    const prev = document.getElementById(prevId), next = document.getElementById(nextId), count = document.getElementById(countId);
    if (!track || !prev || !next || !count) return;
    const pad = (x) => String(x).padStart(2, '0');
    const pages = () => Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
    const idx = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = (i) => track.scrollTo({ left: Math.max(0, Math.min(pages() - 1, i)) * track.clientWidth, behavior: 'smooth' });
    const update = () => { const i = idx(), n = pages(); count.textContent = `${pad(i + 1)} / ${pad(n)}`; prev.disabled = i <= 0; next.disabled = i >= n - 1; };
    prev.addEventListener('click', () => go(idx() - 1));
    next.addEventListener('click', () => go(idx() + 1));
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', () => { go(idx()); update(); });
    let drag = null;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, from: idx() };
      track.classList.add('dragging');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => { if (drag) track.scrollLeft = drag.left - (e.clientX - drag.x); });
    const endDrag = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const to = Math.abs(dx) > 60 ? drag.from - Math.sign(dx) : drag.from;
      drag = null; track.classList.remove('dragging'); go(to);
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    update();
  }
  makeSlider('terms-track', 'terms-prev', 'terms-next', 'terms-count');
  makeSlider('roster', 'roster-prev', 'roster-next', 'roster-count');

  (() => {
    const NS = 'http://www.w3.org/2000/svg';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mk = (tag, attrs, parent) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); parent.appendChild(el); return el; };
    function buildSphere(g) {
      const R = +g.dataset.r, N = R > 40 ? 9 : 6, mer = [];
      for (let i = 0; i < N; i++) mer.push(mk('ellipse', { cx: 0, cy: 0, ry: R }, g));
      [-60, -30, 0, 30, 60].forEach(lat => {
        const r = R * Math.cos(lat * Math.PI / 180), y = R * Math.sin(lat * Math.PI / 180);
        mk('ellipse', { class: 'par', cx: 0, cy: y * 0.98, rx: r, ry: r * 0.22 }, g);
      });
      mk('circle', { class: 'rim', cx: 0, cy: 0, r: R }, g);
      return { g, R, N, mer, speed: +g.dataset.speed, orbit: +g.dataset.orbit || 0, rate: +g.dataset.rate || 0, x: +g.dataset.x || 200, y: +g.dataset.y || 160, a: 0 };
    }
    const figs = [...document.querySelectorAll('.dg.anim')].map(svg => ({
      svg, type: svg.dataset.fig, visible: false,
      spheres: [...svg.querySelectorAll('.sphere')].map(buildSphere),
      transfer: svg.querySelector('.transfer'), ship: svg.querySelector('.ship'),
      route: svg.querySelector('.route'), secured: svg.querySelector('.secured'), sweep: svg.querySelector('.sweep'), team: [...svg.querySelectorAll('.team circle')]
    }));
    const io = new IntersectionObserver(es => es.forEach(e => { const f = figs.find(x => x.svg === e.target); if (f) f.visible = e.isIntersecting; }), { threshold: .1 });
    figs.forEach(f => io.observe(f.svg));
    const t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / 1000;
      for (const f of figs) {
        if (!f.visible) continue;
        for (const s of f.spheres) {
          for (let i = 0; i < s.N; i++) s.mer[i].setAttribute('rx', Math.max(.4, Math.abs(Math.cos(t * s.speed + i * Math.PI / s.N)) * s.R));
          if (s.orbit) {
            s.a = t * s.rate;
            s.x = 200 + s.orbit * Math.cos(s.a); s.y = 160 + s.orbit * Math.sin(s.a);
          }
          s.g.setAttribute('transform', `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(-18)`);
        }
        if (f.type === 'T1' && f.spheres.length === 2) {
          const [E, M] = f.spheres;
          let d = (M.a - E.a) % (2 * Math.PI); if (d < 0) d += 2 * Math.PI; if (d > Math.PI) d -= 2 * Math.PI;
          const open = Math.abs(d) < 0.42;
          if (open) {
            const mx = (E.x + M.x) / 2 + (E.x - 200) * 0.25, my = (E.y + M.y) / 2 + (E.y - 160) * 0.25;
            f.transfer.setAttribute('d', `M${E.x.toFixed(1)} ${E.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${M.x.toFixed(1)} ${M.y.toFixed(1)}`);
          }
          f.transfer.classList.toggle('on', open);
        }
        if (f.type === 'T2' && f.ship) {
          const rot = -24 * Math.PI / 180, cx = 229, cy = 160, rx = 89, ry = 50, a = t * 0.5;
          const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
          const px = ex * Math.cos(rot) - ey * Math.sin(rot), py = ex * Math.sin(rot) + ey * Math.cos(rot);
          const ox = 200 + (cx - 200) * Math.cos(rot), oy = 160 + (cx - 200) * Math.sin(rot);
          const x = ox + px, y = oy + py;
          const dx = -rx * Math.sin(a), dy = ry * Math.cos(a);
          const tx = dx * Math.cos(rot) - dy * Math.sin(rot), ty = dx * Math.sin(rot) + dy * Math.cos(rot);
          const ang = Math.atan2(ty, tx) * 180 / Math.PI;
          f.ship.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
        }
        if (f.type === 'T3' && f.team.length) {
          const R = 86, cx = 200, cy = 160, tilt = -22 * Math.PI / 180, ry = R * 0.38;
          const cycle = 11, p = (t % cycle) / cycle, a0 = -0.6, a = a0 + p * 2 * Math.PI;
          const pos = (ang) => { const ex = R * Math.cos(ang), ey = ry * Math.sin(ang);
            return { x: cx + ex * Math.cos(tilt) - ey * Math.sin(tilt), y: cy + ex * Math.sin(tilt) + ey * Math.cos(tilt), front: Math.sin(ang) > -0.08 }; };
          f.team.forEach((d, i) => { const q = pos(a - i * 0.11); d.setAttribute('cx', q.x.toFixed(1)); d.setAttribute('cy', q.y.toFixed(1)); d.style.opacity = q.front ? 1 : .25; });
          let dStr = '';
          for (let k = 0; k <= 60; k++) { const q = pos(a0 + (a - a0) * k / 60); dStr += (k ? 'L' : 'M') + q.x.toFixed(1) + ' ' + q.y.toFixed(1); }
          f.secured.setAttribute('d', dStr);
          const hp = pos(a), hp2 = pos(a + 0.03);
          const ang = Math.atan2(hp2.y - hp.y, hp2.x - hp.x) * 180 / Math.PI + 90 + Math.sin(t * 3) * 22;
          f.sweep.setAttribute('transform', `translate(${hp.x.toFixed(1)} ${hp.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
          f.sweep.style.opacity = hp.front ? .9 : .2;
        }
      }
      if (!reduced) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  (() => {
    const svg = document.querySelector('.dg[data-fig="T3"]');
    if (!svg) return;
    const P = {
      shadow: svg.querySelector('.r-shadow'), wheels: svg.querySelector('.r-wheels'), spokes: svg.querySelector('.r-spokes'),
      body: svg.querySelector('.r-body'), detail: svg.querySelector('.r-detail'), accent: svg.querySelector('.r-accent')
    };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = false;
    new IntersectionObserver(es => es.forEach(x => { visible = x.isIntersecting; }), { threshold: .1 }).observe(svg);

    const S = 1.75, CX = 200, CY = 182, PITCH = 0.42;
    let yaw = 0.6;
    let proj = (x, y, z) => {
      const cx = Math.cos(yaw), sx = Math.sin(yaw);
      const X = x * cx - z * sx, Z = x * sx + z * cx;
      const Y2 = y * Math.cos(PITCH) - Z * Math.sin(PITCH);
      return [CX + X * S, CY - Y2 * S];
    };
    const seg = (a, b) => { const p = proj(...a), q = proj(...b); return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`; };
    const box = (x0, x1, y0, y1, z0, z1) => {
      const c = [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]];
      const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      return E.map(([i, k]) => seg(c[i], c[k])).join('');
    };
    const cabin = (dy) => {
      const y0 = 14 + dy, y1 = 52 + dy, z = 22;
      const c = [[-6,y0,-z],[52,y0,-z],[52,y0,z],[-6,y0,z],[-6,y1,-z],[36,y1,-z],[36,y1,z],[-6,y1,z]];
      const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      let d = E.map(([i, k]) => seg(c[i], c[k])).join('');
      d += seg([38, y0 + 10, -z], [38, y0 + 10, z]);
      d += seg([-6, y0 + 22, -z], [36, y0 + 22, -z]) + seg([-6, y0 + 22, z], [36, y0 + 22, z]);
      return d;
    };
    const wheel = (x, z, side, spin, ex) => {
      const r = 13, w = 9, zc = z + side * ex, n = 18;
      let rim = '', sp = '';
      for (const zz of [zc - w / 2, zc + w / 2]) {
        for (let i = 0; i < n; i++) {
          const a1 = i / n * Math.PI * 2, a2 = (i + 1) / n * Math.PI * 2;
          rim += seg([x + r * Math.cos(a1), r + r * Math.sin(a1), zz], [x + r * Math.cos(a2), r + r * Math.sin(a2), zz]);
        }
        for (let i = 0; i < 4; i++) {
          const a = spin + i * Math.PI / 2;
          sp += seg([x, r, zz], [x + r * Math.cos(a), r + r * Math.sin(a), zz]);
        }
      }
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; rim += seg([x + r * Math.cos(a), r + r * Math.sin(a), zc - w / 2], [x + r * Math.cos(a), r + r * Math.sin(a), zc + w / 2]); }
      return { rim, sp, hub: [x, r, zc] };
    };
    const t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / 1000;
      if (visible) {
        yaw = 0.62;
        const ex = 0;
        const spin = t * 5;
        const bob = Math.sin(t * 9) * 1.1 + Math.sin(t * 23) * 0.4;
        const rock = Math.sin(t * 7) * 0.02;
        const P0 = proj; proj = (x, y, z) => P0(x, y + bob + x * rock, z);
        let body = box(-62, 62, 14, 24, -24, 24) + cabin(ex * 0.6);
        body += box(-58, -12, 24 + ex * 0.6, 42 + ex * 0.6, -22, 22);
        let detail = '';
        const ay = 42 + ex * 1.6;
        detail += seg([-34, ay, 8], [-34, ay + 34, 8]);
        for (let i = 0; i < 12; i++) { const a1 = i / 12 * Math.PI * 2, a2 = (i + 1) / 12 * Math.PI * 2; detail += seg([-34 + 7 * Math.cos(a1), ay + 34 + 3 * Math.sin(a1), 8 + 7 * Math.sin(a1) * 0.4], [-34 + 7 * Math.cos(a2), ay + 34 + 3 * Math.sin(a2), 8 + 7 * Math.sin(a2) * 0.4]); }
        detail += seg([-58, 28 + ex * 0.6, -14], [-58, 40 + ex * 0.6, -14]) + seg([-58, 28 + ex * 0.6, 14], [-58, 40 + ex * 0.6, 14]) + seg([-58, 28 + ex * 0.6, -14], [-58, 28 + ex * 0.6, 14]);
        detail += seg([-50, 24, -24], [50, 24, -24]) + seg([-50, 24, 24], [50, 24, 24]);
        let wheels = '', spokes = '', accent = '';
        for (const x of [-42, 0, 42]) for (const side of [-1, 1]) {
          const w = wheel(x, side * 32, side, spin * (side === 1 ? 1 : -1), ex);
          wheels += w.rim; spokes += w.sp;
          detail += seg([x, 16, side * 24], [w.hub[0], w.hub[1], w.hub[2] - side * 4.5]);
          accent += seg([w.hub[0], w.hub[1] - 1.2, w.hub[2]], [w.hub[0], w.hub[1] + 1.2, w.hub[2]]);
        }
        accent += seg([62, 20, -16], [62, 20, -8]) + seg([62, 20, 8], [62, 20, 16]);
        proj = P0;
        let shadow = '';
        const run = (t * 60) % 40;
        for (let i = -4; i <= 4; i++) { const x = i * 40 - run; shadow += seg([x - 6, 0, -44], [x + 6, 0, -44]) + seg([x - 6, 0, 44], [x + 6, 0, 44]) + seg([x - 3, 0, -60], [x + 3, 0, -60]) + seg([x - 3, 0, 60], [x + 3, 0, 60]); }
        for (let k = 0; k < 3; k++) { const ph = ((t * 1.4 + k * 0.33) % 1), px = -70 - ph * 40, py = 2 + ph * 14, pr = 2 + ph * 5; for (let i = 0; i < 8; i++) { const a1 = i / 8 * Math.PI * 2, a2 = (i + 1) / 8 * Math.PI * 2; shadow += seg([px + pr * Math.cos(a1), py + pr * Math.sin(a1), 20 + k * 6], [px + pr * Math.cos(a2), py + pr * Math.sin(a2), 20 + k * 6]); } }
        P.shadow.setAttribute('d', shadow); P.wheels.setAttribute('d', wheels); P.spokes.setAttribute('d', spokes);
        P.body.setAttribute('d', body); P.detail.setAttribute('d', detail); P.accent.setAttribute('d', accent);
      }
      if (!reduced) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  document.querySelectorAll('.top nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });

  const links = [...document.querySelectorAll('.top nav a')];
  const secIo = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('.sec').forEach(s => secIo.observe(s));
})();
