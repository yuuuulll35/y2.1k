(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MESSAGES = [
    {
      id: '수신 01',
      tag: '출처 불명 · 반복 송신',
      lines: [
        '@ 세계가 멸망하는 날까지 사랑하겠다는 다짐이 이별 통보가 될 수 있다고 생각한 적이 있습니까? 이미 일어났으니 각오해라······'
      ],
      discard: true
    },
    {
      id: '수신 02',
      tag: '전진조사대 교신 · CH 4',
      lines: [
        "'······고르, 이거 보여? 존나 귀엽지 않아? 허여멀게 가지고는, 뭔 우파루파처럼 생겼네.",
        '루이, 만지지 마. 그러다 또 뤼크한테 불려가려고.',
        '아, 씨. 그거 이 개월 전 얘기거든? 그 전까지는 잘만 피해 다녔는데. ······ 봐, 멀쩡하잖아. 그땐 그냥 운이 안 좋았던······',
        "악! 아, 아! 이, 씨발, 이 씹새—'"
      ],
      cut: true
    }
  ];
  const TOTAL = MESSAGES.reduce((n, m) => n + m.lines.length, 0);

  const rx = $('#rx');
  const radio = $('#radio');
  const area = $('#tape-area');
  const floor = $('#floor');
  const dlg = $('#dlg');
  const dlgSrc = $('#dlg-src');
  const dlgBody = $('#dlg-body');
  const dlgNext = $('#dlg-next');
  const dlgFill = $('#dlg-fill');
  const status = $('#rx-status');
  const hint = $('#rx-hint');
  const skipBtn = $('#skip');
  const hissBtn = $('#hiss');

  let done = false;
  let tape = null;
  let typing = false;
  let skipLine = false;
  let advance = null;
  let doneLines = 0;

  const setFill = () => dlgFill.style.setProperty('--w', (doneLines / TOTAL * 100).toFixed(1) + '%');

  function newTape(m) {
    const t = document.createElement('div');
    t.className = 'tape';
    t.innerHTML = `<div class="hd"><span>${m.id}</span><span>${m.tag}</span></div>`;
    area.appendChild(t);
    tape = t;
    return t;
  }
  function inkLines(text) {
    const n = Math.max(1, Math.min(4, Math.round(text.length / 34)));
    const g = document.createElement('div');
    g.style.margin = '0 0 10px';
    for (let i = 0; i < n; i++) {
      const l = document.createElement('div');
      l.className = 'ln';
      l.style.width = (i === n - 1 ? 30 + Math.random() * 50 : 78 + Math.random() * 22) + '%';
      l.style.animationDelay = (i * .12) + 's';
      g.appendChild(l);
    }
    tape.appendChild(g);
  }
  function discard(t) {
    const r = t.getBoundingClientRect();
    t.remove();
    t.classList.add('cut-top', 'torn');
    t.style.left = r.left + 'px';
    t.style.top = r.top + 'px';
    t.style.width = r.width + 'px';
    t.style.setProperty('--dy', (innerHeight - r.top + 60) + 'px');
    t.style.setProperty('--rot', (-10 + Math.random() * 6).toFixed(1) + 'deg');
    floor.appendChild(t);
    t.addEventListener('animationend', () => t.remove(), { once: true });
  }

  const STEP = 46;
  async function typeLine(text) {
    typing = true; skipLine = false;
    dlgBody.textContent = '';
    dlgBody.classList.add('cur');
    dlgNext.classList.remove('on');
    for (let i = 0; i < text.length; i++) {
      if (done) break;
      if (skipLine) { dlgBody.textContent = text; break; }
      dlgBody.textContent += text[i];
      const ch = text[i];
      sfxKey(ch === ' ');
      await sleep(ch === '·' ? 110 : ch === ' ' ? 24 : STEP);
    }
    typing = false;
    sfxDing();
    dlgBody.classList.remove('cur');
  }
  function waitNext(ms) {
    dlgNext.classList.add('on');
    return new Promise(res => {
      let t = setTimeout(fin, ms);
      function fin() { clearTimeout(t); advance = null; dlgNext.classList.remove('on'); res(); }
      advance = fin;
    });
  }

  async function cutSignal(text) {
    const glyphs = '▚▞▒░█▌▐';
    const keep = text.slice(0, -4);
    for (let f = 0; f < 8; f++) {
      let g = '';
      for (let k = 0; k < 4 + f; k++) g += glyphs[Math.floor(Math.random() * glyphs.length)];
      dlgBody.innerHTML = keep + `<span class="ghost">${g}</span>`;
      spikeHiss();
      await sleep(60);
    }
    dlgBody.innerHTML = keep + `<span class="ghost">${'▒'.repeat(6)}</span>`;
    await sleep(900);
    dlgBody.innerHTML = '<span class="ghost">— 신호 유실 —</span>';
    sfxBeep();
    tape.classList.add('torn');
    radio.classList.remove('rxing');
    radio.classList.add('lost');
    rx.classList.add('lost');
    status.textContent = '신호 유실';
  }

  async function run() {
    await sleep(350);
    radio.classList.add('locked');
    await sleep(2100);
    status.textContent = 'LOCK · 2.127 MHz';
    radio.classList.add('rxing');
    dlg.classList.add('on');
    hint.classList.add('on');
    await sleep(700);

    for (const msg of MESSAGES) {
      if (done) return;
      newTape(msg);
      dlgSrc.textContent = `${msg.id} · ${msg.tag}`;
      await sleep(30);
      tape.classList.add('out');
      await sleep(900);
      for (let i = 0; i < msg.lines.length; i++) {
        if (done) return;
        const line = msg.lines[i];
        inkLines(line);
        await typeLine(line);
        if (done) return;
        doneLines++; setFill();
        const last = i === msg.lines.length - 1;
        if (msg.cut && last) { await sleep(120); await cutSignal(line); }
        else await waitNext(last ? 900 : 1500);
      }
      if (msg.discard) {
        tape.classList.add('torn');
        status.textContent = '절단';
        dlgBody.textContent = '';
        await sleep(450);
        discard(tape);
        await sleep(1500);
        status.textContent = 'LOCK · 2.127 MHz';
      }
    }
    if (done) return;
    await sleep(1800);
    receive();
  }

  function renderAll() {
    area.innerHTML = ''; floor.innerHTML = '';
    const m = MESSAGES[MESSAGES.length - 1];
    newTape(m);
    tape.style.transition = 'none';
    tape.classList.add('out', 'torn');
    m.lines.forEach(l => inkLines(l));
    dlgSrc.textContent = `${m.id} · ${m.tag}`;
    dlgBody.innerHTML = '<span class="ghost">— 신호 유실 —</span>';
    doneLines = TOTAL; setFill();
    dlg.classList.add('on');
    radio.classList.add('locked', 'lost');
    rx.classList.add('lost');
    status.textContent = '신호 유실';
  }

  let received = false;
  async function receive() {
    if (received) return;
    received = true; done = true;
    stopHiss();
    const cut = $('#cutframe');
    rx.classList.add('off');
    await sleep(620);
    cut.classList.add('on');
    document.body.classList.remove('is-rx');
    document.body.classList.add('is-log');
    rx.hidden = true;
    window.scrollTo(0, 0);
    await sleep(760);
    cut.classList.remove('on');
    cut.classList.add('flash');
    await sleep(90);
    cut.classList.remove('flash');
    const log = $('#log');
    log.classList.add('camera-in');
    log.addEventListener('animationend', () => log.classList.remove('camera-in'), { once: true });
    initLog();
  }

  rx.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (typing) skipLine = true;
    else if (advance) advance();
  });
  skipBtn.addEventListener('click', () => {
    done = true;
    renderAll();
    receive();
  });

  const TYPE_SAMPLE = '';
  const SFX = { on: true, ctx: null, master: null, hiss: null, sample: null, unlocked: false, noise: null };

  function audioInit() {
    if (SFX.ctx) return;
    const ctx = SFX.ctx = new (window.AudioContext || window.webkitAudioContext)();
    SFX.master = ctx.createGain(); SFX.master.gain.value = SFX.on ? 1 : 0;
    SFX.master.connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    SFX.noise = buf;
    SFX.hiss = ctx.createGain(); SFX.hiss.gain.value = 0;
    if (TYPE_SAMPLE) {
      fetch(TYPE_SAMPLE).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(b => { SFX.sample = b; }).catch(() => {});
    }
  }
  function unlock() {
    if (SFX.unlocked || SFX.off) return;
    SFX.unlocked = true;
    audioInit();
    SFX.ctx.resume();
    hint.textContent = '클릭 · 다음';
  }
  addEventListener('pointerdown', unlock, { once: true });
  addEventListener('keydown', unlock, { once: true });

  function sfxKey(space) {
    if (!SFX.unlocked || !SFX.on) return;
    const ctx = SFX.ctx, t = ctx.currentTime;
    if (SFX.sample) {
      const s = ctx.createBufferSource(); s.buffer = SFX.sample;
      s.playbackRate.value = .92 + Math.random() * .16;
      const g = ctx.createGain(); g.gain.value = space ? .5 : .8;
      s.connect(g).connect(SFX.master); s.start(t); return;
    }
    const n = ctx.createBufferSource(); n.buffer = SFX.noise;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass';
    f.frequency.value = (space ? 1200 : 2600) + Math.random() * 900; f.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(space ? .22 : .42, t);
    g.gain.exponentialRampToValueAtTime(.001, t + .045);
    n.connect(f).connect(g).connect(SFX.master); n.start(t); n.stop(t + .06);
    const o = ctx.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(space ? 110 : 150 + Math.random() * 40, t);
    o.frequency.exponentialRampToValueAtTime(60, t + .05);
    const og = ctx.createGain();
    og.gain.setValueAtTime(.16, t); og.gain.exponentialRampToValueAtTime(.001, t + .06);
    o.connect(og).connect(SFX.master); o.start(t); o.stop(t + .07);
  }
  function sfxDing() {
    if (!SFX.unlocked || !SFX.on) return;
    const ctx = SFX.ctx, t = ctx.currentTime;
    [[2300, .10], [3450, .035]].forEach(([fr, v]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = fr;
      const g = ctx.createGain();
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0005, t + .7);
      o.connect(g).connect(SFX.master); o.start(t); o.stop(t + .75);
    });
    const n = ctx.createBufferSource(); n.buffer = SFX.noise;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .7;
    const g = ctx.createGain(); g.gain.setValueAtTime(.05, t + .05); g.gain.linearRampToValueAtTime(.0001, t + .3);
    n.connect(f).connect(g).connect(SFX.master); n.start(t + .05); n.stop(t + .32);
  }
  function sfxBeep() {
    if (!SFX.unlocked || !SFX.on) return;
    const ctx = SFX.ctx, t = ctx.currentTime;
    SFX.hiss.gain.setTargetAtTime(0, t, .2);
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 1000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.11, t + .02);
    g.gain.setValueAtTime(.11, t + 2.2); g.gain.exponentialRampToValueAtTime(.0001, t + 3.2);
    o.connect(g).connect(SFX.master); o.start(t); o.stop(t + 3.3);
  }
  function spikeHiss() {
    if (!SFX.unlocked || !SFX.on) return;
    const ctx = SFX.ctx, t = ctx.currentTime;
    const n = ctx.createBufferSource(); n.buffer = SFX.noise;
    const g = ctx.createGain(); g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .08);
    n.connect(g).connect(SFX.master); n.start(t); n.stop(t + .09);
  }
  function stopHiss() {
    SFX.off = true;
    if (!SFX.ctx) return;
    SFX.master.gain.setTargetAtTime(0, SFX.ctx.currentTime, .3);
    setTimeout(() => { if (SFX.ctx && SFX.ctx.state === 'running') SFX.ctx.suspend(); }, 1500);
  }
  hissBtn.addEventListener('click', () => {
    if (SFX.off) return;
    SFX.on = !SFX.on;
    hissBtn.setAttribute('aria-pressed', SFX.on ? 'true' : 'false');
    hissBtn.querySelector('span').textContent = SFX.on ? 'ON' : 'OFF';
    if (SFX.master) SFX.master.gain.setTargetAtTime(SFX.on ? 1 : 0, SFX.ctx.currentTime, .1);
  });

  let logInit = false;
  function initLog() {
    if (logInit) return; logInit = true;
    const cut = $('#cutframe');
    const hudShot = $('#hud-shot');
    const hudTc = $('#hud-tc');
    const chapters = [...document.querySelectorAll('.ch')];
    const pad = (n) => String(n).padStart(2, '0');
    let current = null;

    function countUp(ch) {
      ch.querySelectorAll('[data-to]').forEach(el => {
        const to = +el.dataset.to, t0 = performance.now(), dur = 700;
        const step = () => {
          const p = Math.min(1, (performance.now() - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * e);
          if (p < 1) requestAnimationFrame(step);
        };
        setTimeout(step, 450);
      });
    }

    function goLive(ch) {
      if (ch === current) return;
      const first = !current;
      current = ch;
      if (!first) { cut.classList.add('on'); setTimeout(() => cut.classList.remove('on'), 70); }
      chapters.forEach(c => c.classList.toggle('live', c === ch));
      document.body.dataset.shot = ch.id;
      const i = chapters.indexOf(ch);
      hudShot.textContent = `SHOT ${pad(i + 1)} / ${pad(chapters.length)} · ${ch.dataset.year || ''}`;
      countUp(ch);
    }

    (() => {
      const ch = $('#c1'), p = ch && ch.querySelector('.point.lit');
      if (!p) return;
      let painted = false, lock = false, ty = 0;
      const paint = () => { painted = true; lock = true; p.classList.add('hl'); setTimeout(() => { lock = false; }, 900); };
      const hold = () => document.body.dataset.shot === 'c1' && (!painted || lock);
      addEventListener('wheel', (e) => { if (!hold()) return; if (e.deltaY > 0) { e.preventDefault(); if (!painted) paint(); } }, { passive: false });
      addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
      addEventListener('touchmove', (e) => { if (!hold()) return; if (ty - e.touches[0].clientY > 8) { e.preventDefault(); if (!painted) paint(); } }, { passive: false });
      addEventListener('keydown', (e) => { if (!hold()) return; if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); if (!painted) paint(); } });
    })();
    document.documentElement.classList.add('snap');
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) goLive(e.target); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    chapters.forEach(s => io.observe(s));
    goLive(chapters[0]);

    const t0 = performance.now();
    (function tick() {
      const f = Math.floor((performance.now() - t0) / 1000 * 24);
      const s = Math.floor(f / 24);
      hudTc.textContent = `TC ${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`;
      requestAnimationFrame(tick);
    })();
  }

  if (reduced) {
    renderAll();
    hint.textContent = '';
    setTimeout(receive, 1400);
  } else {
    run();
  }
})();
