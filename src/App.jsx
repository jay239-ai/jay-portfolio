import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Instagram, Linkedin, Mail, Phone, X, Youtube } from 'lucide-react';
import gsap from 'gsap';

const SCREENS = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const PROJECTS = [
  {
    title: 'Intelligent Free-Left Turn System',
    kind: 'COMPUTER VISION',
    tag: 'Spotting risk before it becomes a conflict.',
    desc: 'A computer-vision system for free-left turns, looking at pedestrian movement, blind spots and merging conflicts.',
    award: 'This project won my first hackathon.',
    stack: 'Python · OpenCV · Video analysis',
    url: 'https://github.com/spacedragon51/Intelligent-free-left-turn-system',
    visual: 'vision',
  },
  {
    title: 'AI LogLens',
    kind: 'AI / DEVELOPER TOOL',
    tag: 'Making noisy logs make sense.',
    desc: 'An AI-assisted log analysis and incident investigation project that turns raw application output into readable signals.',
    stack: 'Python · Streamlit · Log parsing',
    url: null,
    visual: 'logs',
  },
  {
    title: 'NetPulse',
    kind: 'NETWORK MONITORING',
    tag: 'See the quality behind the connection.',
    desc: 'A network quality-of-experience project that brings connection health into one focused view.',
    stack: 'React · FastAPI · Python',
    url: null,
    visual: 'pulse',
  },
  {
    title: 'LandRecords',
    kind: 'DOCUMENT AI / AUTOMATION',
    tag: 'Cleaner inputs. Better workflows.',
    desc: 'A document-processing pipeline for land records, covering denoising, deskewing, quality checks, classification and language detection.',
    stack: 'FastAPI · Python · OpenCV',
    url: 'https://github.com/kumudhanjali/SIH-LandRecords',
    visual: 'document',
  },
];

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = () => window.matchMedia('(pointer: fine)').matches;

function Art({ p }) {
  return (
    <div className={`art art-${p.visual}`} aria-hidden="true">
      {p.visual === 'vision' && (
        <>
          <div className="road r1" />
          <div className="road r2" />
          <div className="roi roi1" />
          <div className="roi roi2" />
          <div className="dot-track" />
        </>
      )}
      {p.visual === 'logs' && (
        <div className="log-lines">
          <span><b>INFO</b> service initialised</span>
          <span><b className="warn">WARN</b> latency above threshold</span>
          <span><b className="err">ERROR</b> connection timeout</span>
          <span><b>INFO</b> retry scheduled</span>
        </div>
      )}
      {p.visual === 'pulse' && (
        <svg viewBox="0 0 500 180" preserveAspectRatio="none">
          <path d="M0 95 L55 95 L72 90 L90 100 L112 95 L140 95 L158 38 L174 140 L192 75 L208 95 L246 95 L267 90 L282 95 L310 95 L330 28 L348 144 L365 84 L382 95 L420 95 L442 66 L460 110 L475 95 L500 95" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      )}
      {p.visual === 'document' && (
        <div className="paper">
          <i /><i /><i /><i />
          <span />
        </div>
      )}
      <span className="art-note">ILLUSTRATION</span>
    </div>
  );
}

function JellyText({ text = '', lines, className = '', id }) {
  const lettersRef = useRef([]);
  const pointerRef = useRef(null);

  const deform = (event) => {
    if (prefersReduced() || !window.matchMedia('(pointer: fine)').matches || event.pointerType === 'touch') return;
    const now = performance.now();
    const previous = pointerRef.current || { x: event.clientX, y: event.clientY, time: now };
    const elapsed = Math.max(1, now - previous.time);
    const vx = (event.clientX - previous.x) / elapsed;
    const vy = (event.clientY - previous.y) / elapsed;
    pointerRef.current = { x: event.clientX, y: event.clientY, time: now };
    const velocity = Math.max(1, Math.hypot(vx, vy));
    const radius = 210;

    lettersRef.current.forEach((letter) => {
      if (!letter) return;
      const rect = letter.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - (gsap.getProperty(letter, 'x') || 0) - event.clientX;
      const dy = rect.top + rect.height / 2 - (gsap.getProperty(letter, 'y') || 0) - event.clientY;
      const distance = Math.hypot(dx, dy);
      const proximity = Math.max(0, 1 - distance / radius);
      if (!proximity) {
        const x = Number(gsap.getProperty(letter, 'x')) || 0;
        const y = Number(gsap.getProperty(letter, 'y')) || 0;
        if (Math.abs(x) + Math.abs(y) > 0.25) {
          gsap.to(letter, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        }
        return;
      }
      const safeDistance = Math.max(1, distance);
      const nx = distance < 1 ? -vx : dx / safeDistance;
      const ny = distance < 1 ? -vy : dy / safeDistance;
      const swirl = (nx * vy - ny * vx) / velocity;
      const wave = Math.sin(distance * 0.075 - now * 0.012);
      const influence = Math.pow(proximity, 1.25);
      gsap.to(letter, {
        x: nx * 7 * influence - ny * swirl * 2.5 * influence + vx * 2 * influence,
        y: ny * 6 * influence + wave * 3.5 * influence + vy * 1.5 * influence,
        rotation: Math.max(-5, Math.min(5, swirl * 4 + wave * 2.5)) * influence,
        scaleX: 1 - influence * 0.045 + wave * influence * 0.025,
        scaleY: 1 + influence * 0.1 + wave * influence * 0.035,
        duration: 0.34,
        ease: 'elastic.out(1, 0.58)',
        overwrite: 'auto',
      });
    });
  };

  const settle = () => {
    if (prefersReduced()) return;
    const letters = lettersRef.current.filter(Boolean);
    gsap.to(letters, {
      x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.58)',
      stagger: { each: 0.018, from: 'center' },
      overwrite: true,
    });
    pointerRef.current = null;
  };

  const contentLines = lines || [{ text, accent: false }];
  let letterIndex = 0;
  const renderWords = (line, lineIndex) => line.text.split(/(\s+)/).filter(Boolean).map((part, partIndex) => {
    if (/^\s+$/.test(part)) return <span key={`space-${lineIndex}-${partIndex}`}> </span>;
    return (
      <span key={`word-${lineIndex}-${partIndex}`} className="jelly-word">
        {Array.from(part).map((character) => {
          const index = letterIndex++;
          return <span key={`letter-${index}`} className="jelly-letter" ref={(element) => { lettersRef.current[index] = element; }}>{character}</span>;
        })}
      </span>
    );
  });
  const label = lines ? lines.map((line) => line.text).join(' ') : text;

  return (
    <span id={id} className={`jelly-text ${lines ? 'jelly-stack' : ''} ${className}`} data-cursor="JELLY" onPointerMove={deform} onPointerLeave={settle}>
      <span className="sr-only">{label}</span>
      {contentLines.map((line, lineIndex) => (
        <span key={`line-${lineIndex}`} className={`jelly-line ${line.accent ? 'accent' : ''}`} aria-hidden="true">{renderWords(line, lineIndex)}</span>
      ))}
    </span>
  );
}

export default function App() {
  const [screen, setScreen] = useState(0);
  const [project, setProject] = useState(0);
  const [projectOpen, setProjectOpen] = useState(false);
  const siteRef = useRef(null);
  const sectionRef = useRef(null);
  const veilRef = useRef(null);
  const frameLabelRef = useRef(null);
  const pointerRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const busy = useRef(false);
  const closingProject = useRef(false);
  const stateRef = useRef({ screen: 0, projectOpen: false });
  stateRef.current = { screen, projectOpen };

  const tone = SCREENS[screen].id === 'contact' ? 'dark' : 'light';

  const goScreen = useCallback((n) => {
    const cur = stateRef.current.screen;
    if (n < 0 || n >= SCREENS.length || n === cur || busy.current) return;
    const dir = n > cur ? 1 : -1;
    const landProject = n === 1 && dir < 0 ? PROJECTS.length - 1 : 0;
    if (prefersReduced()) {
      setProject(landProject);
      setProjectOpen(false);
      setScreen(n);
      return;
    }
    const { x, y } = pointerRef.current;
    const radius = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 1.15);
    const closed = `circle(0px at ${x}px ${y}px)`;
    const open = `circle(${radius}px at ${x}px ${y}px)`;
    veilRef.current.style.setProperty('--focus-x', `${x}px`);
    veilRef.current.style.setProperty('--focus-y', `${y}px`);
    frameLabelRef.current.textContent = `JAY / ${SCREENS[n].label.toUpperCase()}`;
    busy.current = true;
    gsap.timeline({ onComplete: () => { busy.current = false; } })
      .set(veilRef.current, { clipPath: closed })
      .to(veilRef.current, { clipPath: open, duration: 0.55, ease: 'power3.in' })
      .fromTo(veilRef.current.querySelector('.focus-reticle'), { scale: 0.65, opacity: 0, rotation: -24 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.42, ease: 'back.out(1.7)' }, '<0.08')
      .fromTo(veilRef.current.querySelectorAll('.transition-readout, .transition-spec'), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, stagger: 0.04, ease: 'power2.out' }, '<0.12')
      .add(() => { setProject(landProject); setProjectOpen(false); setScreen(n); })
      .to(veilRef.current.querySelectorAll('.focus-reticle, .transition-readout, .transition-spec'), { opacity: 0, duration: 0.16, ease: 'power1.in' }, '<')
      .to(veilRef.current, { clipPath: closed, duration: 0.72, ease: 'power4.out' });
  }, []);

  const openProject = useCallback((n) => {
    closingProject.current = false;
    setProject(n);
    setProjectOpen(true);
  }, []);

  const closeProject = useCallback(() => {
    if (!projectOpen || closingProject.current) return;
    const host = siteRef.current;
    const source = host?.querySelector(`[data-project-card="${project}"] .project-card-art .art`);
    const target = host?.querySelector('.project-detail-art .art');
    const detail = host?.querySelector('.project-detail');
    const backdrop = host?.querySelector('.project-detail-backdrop');
    if (prefersReduced() || !target || !detail || !backdrop) { setProjectOpen(false); return; }
    closingProject.current = true;
    const start = target.getBoundingClientRect();
    const end = source?.getBoundingClientRect() || start;
    const flight = target.cloneNode(true);
    flight.classList.add('project-flight-art');
    flight.setAttribute('aria-hidden', 'true');
    Object.assign(flight.style, { position: 'fixed', left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px`, zIndex: '72', pointerEvents: 'none', margin: '0' });
    host.appendChild(flight);
    gsap.set(target, { autoAlpha: 0 });
    gsap.timeline({ onComplete: () => { flight.remove(); setProjectOpen(false); closingProject.current = false; } })
      .to(flight, { left: end.left, top: end.top, width: end.width, height: end.height, borderRadius: 18, duration: 0.58, ease: 'power3.inOut' })
      .to(detail, { autoAlpha: 0, scale: 0.985, duration: 0.28, ease: 'power2.in' }, '<0.06')
      .to(backdrop, { autoAlpha: 0, duration: 0.36, ease: 'power2.in' }, '<0.08');
  }, [projectOpen, project]);

  useLayoutEffect(() => {
    if (!projectOpen || prefersReduced()) return;
    const host = siteRef.current;
    const source = host?.querySelector(`[data-project-card="${project}"] .project-card-art .art`);
    const target = host?.querySelector('.project-detail-art .art');
    const detail = host?.querySelector('.project-detail');
    const backdrop = host?.querySelector('.project-detail-backdrop');
    if (!source || !target || !detail || !backdrop) return;
    const start = source.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    const flight = source.cloneNode(true);
    flight.classList.add('project-flight-art');
    flight.setAttribute('aria-hidden', 'true');
    Object.assign(flight.style, { position: 'fixed', left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px`, zIndex: '72', pointerEvents: 'none', margin: '0' });
    host.appendChild(flight);
    gsap.set([source, target, detail], { autoAlpha: 0 });
    gsap.set(backdrop, { autoAlpha: 0 });
    const tween = gsap.timeline({ onComplete: () => {
      flight.remove();
      gsap.set([source, target, detail], { clearProps: 'opacity,visibility,transform' });
    } })
      .to(backdrop, { autoAlpha: 1, duration: 0.32, ease: 'power1.out' }, 0)
      .to(flight, { left: end.left, top: end.top, width: end.width, height: end.height, borderRadius: 24, duration: 0.72, ease: 'power3.inOut' }, 0)
      .fromTo(detail, { autoAlpha: 0, scale: 0.985, y: 14 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.46, ease: 'power3.out' }, 0.1)
      .fromTo(detail.querySelectorAll('.project-detail-copy > *'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.055, ease: 'power2.out', clearProps: 'opacity,transform' }, 0.28);
    return () => tween.kill();
  }, [projectOpen, project]);

  useEffect(() => {
    if (!projectOpen) return;
    const onEscape = (event) => { if (event.key === 'Escape') closeProject(); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [projectOpen, closeProject]);

  const step = useCallback((dir) => {
    goScreen(stateRef.current.screen + dir);
  }, [goScreen]);

  const stepRef = useRef(step);
  stepRef.current = step;

  // True when the active scene has its own scroll left in the gesture direction.
  const sceneCanScroll = (dy) => {
    const el = sectionRef.current;
    if (!el || el.scrollHeight <= el.clientHeight + 4) return false;
    if (dy > 0) return el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    return el.scrollTop > 2;
  };

  // Entrance: staggered 3D rise of each scene's .reveal items.
  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const els = sectionRef.current?.querySelectorAll('.reveal');
    if (!els || !els.length) return;
    const tween = gsap.fromTo(els,
      { opacity: 0, y: 36, rotateX: -10, transformPerspective: 1200, transformOrigin: '50% 100%' },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08, clearProps: 'transform' });
    return () => tween.kill();
  }, [screen]);

  // Wheel, keyboard and touch navigation.
  useEffect(() => {
    let acc = 0;
    let last = 0;
    const onWheel = (e) => {
      if (e.ctrlKey) return;
      if (sceneCanScroll(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - last < 650) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 50) return;
      const dir = acc > 0 ? 1 : -1;
      acc = 0;
      last = now;
      stepRef.current(dir);
    };
    const onKey = (e) => {
      if (stateRef.current.projectOpen) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') stepRef.current(1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') stepRef.current(-1);
    };
    let tx = 0, ty = 0;
    const onTouchStart = (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - tx;
      const dy = t.clientY - ty;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        if (sceneCanScroll(-dy)) return;
        stepRef.current(dy < 0 ? 1 : -1);
      } else if (stateRef.current.screen === 1) {
        stepRef.current(dx < 0 ? 1 : -1);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Cursor ring, parallax, magnetic buttons and tilt cards (fine pointers only).
  useEffect(() => {
    if (!canHover()) return;
    const root = siteRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const reduce = prefersReduced();
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let rx = tx, ry = ty, px = 0, py = 0, ptx = 0, pty = 0;
    let raf;

    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      if (!reduce) {
        px += (ptx - px) * 0.06;
        py += (pty - py) * 0.06;
      }
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      root.style.setProperty('--px', px.toFixed(3));
      root.style.setProperty('--py', py.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (!reduce) {
        ptx = (e.clientX / window.innerWidth - 0.5) * 2;
        pty = (e.clientY / window.innerHeight - 0.5) * 2;
      }
      const m = e.target.closest?.('[data-magnetic]');
      if (m && !reduce) {
        const r = m.getBoundingClientRect();
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.25,
          y: (e.clientY - (r.top + r.height / 2)) * 0.35,
          duration: 0.35,
          ease: 'power3.out',
        });
      }
      const c = e.target.closest?.('[data-tilt]');
      if (c && !reduce) {
        const r = c.getBoundingClientRect();
        gsap.to(c, {
          rotateY: ((e.clientX - r.left) / r.width - 0.5) * 9,
          rotateX: -((e.clientY - r.top) / r.height - 0.5) * 7,
          transformPerspective: 900,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };

    const onOver = (e) => {
      const hoverEl = e.target.closest?.('[data-cursor]');
      if (hoverEl) {
        ring.dataset.label = hoverEl.dataset.cursor || '';
        ring.classList.add('hot');
      }
      const toneEl = e.target.closest?.('[data-tone]');
      ring.classList.toggle('on-dark', toneEl?.dataset.tone === 'dark');
    };

    const onOut = (e) => {
      const from = e.target.closest?.('[data-cursor]');
      if (from && !from.contains(e.relatedTarget)) {
        ring.classList.remove('hot');
        ring.dataset.label = '';
      }
      const mag = e.target.closest?.('[data-magnetic]');
      if (mag && !mag.contains(e.relatedTarget)) {
        gsap.to(mag, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      }
      const tilt = e.target.closest?.('[data-tilt]');
      if (tilt && !tilt.contains(e.relatedTarget)) {
        gsap.to(tilt, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      gsap.killTweensOf('[data-magnetic], [data-tilt]');
    };
  }, []);

  const p = PROJECTS[project];

  return (
    <div ref={siteRef} className="site" data-tone={tone}>
      <div ref={veilRef} className="veil" aria-hidden="true">
        <div className="focus-reticle"><i /><i /><i /><i /></div>
        <span ref={frameLabelRef} className="transition-readout">JAY / HOME</span>
        <span className="transition-spec">FRAME 01 <b>•</b> 24 FPS</span>
      </div>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />

      <header className="nav">
        <button className="logo" onClick={() => goScreen(0)} aria-label="Home" data-cursor="HOME">J<span>.</span></button>
        <div className="status"><i /> Bengaluru <em>/</em> Open to opportunities</div>
        <nav aria-label="Primary">
          {SCREENS.map((s, i) => (
            <button
              key={s.id}
              className={screen === i ? 'current' : ''}
              aria-current={screen === i ? 'page' : undefined}
              onClick={() => goScreen(i)}
              data-cursor="GO"
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="stage">
        {screen === 0 && (
          <section ref={sectionRef} className="scene scene-home">
            <div className="home-grid">
              <div className="hero-copy">
                <h1 className="headline reveal">
                  <JellyText className="l1" text="I AM JAY." />
                  <JellyText className="l2" lines={[{ text: 'PENDERI' }, { text: 'JAYA SAI.' }]} />
                </h1>
                <ul className="phrases reveal">
                  <li>TECH ENTHUSIAST. CODING NEWBIE.</li>
                  <li>BUILDING JOBHI CLUB.</li>
                  <li>CURIOUS BY NATURE. MULTIMEDIA CREATOR.</li>
                  <li>CSE STUDENT AT T. JOHN INSTITUTE OF TECHNOLOGY.</li>
                </ul>
              </div>
              <figure className="hero-photo reveal">
                <div className="photo-inner" data-depth>
                  <img src="/images/jay-creator.jpg" alt="Jay sharing an idea on camera" />
                </div>
              </figure>
            </div>

            <section className="updates reveal" aria-labelledby="updates-title">
              <div className="updates-heading">
                  <div><p className="kicker">WHAT I’M SHARING</p><h2><JellyText id="updates-title" text="Recent posts." /></h2></div>
                <span className="update-status">FOLLOW ALONG</span>
              </div>
              <div className="post-links">
                <a className="post-card" href="https://www.instagram.com/jobhiclub/" target="_blank" rel="noopener noreferrer" aria-label="See recent Instagram posts from Jobhi Club">
                  <Instagram /><span><small>INSTAGRAM</small><strong>Short-form ideas & moments</strong></span><ArrowUpRight />
                </a>
                <a className="post-card" href="https://www.linkedin.com/in/penderijayasai/" target="_blank" rel="noopener noreferrer" aria-label="See recent LinkedIn posts from Jay">
                  <Linkedin /><span><small>LINKEDIN</small><strong>Ideas, projects & updates</strong></span><ArrowUpRight />
                </a>
                <a className="post-card" href="https://youtube.com/@jobhiclub" target="_blank" rel="noopener noreferrer" aria-label="See recent YouTube videos from Jobhi Club">
                  <Youtube /><span><small>YOUTUBE</small><strong>Videos from Jobhi Club</strong></span><ArrowUpRight />
                </a>
              </div>
            </section>

            <section className="social-area reveal" aria-label="Social and contact links">
              <div className="social-area-title"><span className="kicker">FIND ME / SAY HELLO</span><span>Social & communication</span></div>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/penderijayasai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /><span>LinkedIn</span><ArrowUpRight /></a>
                <a href="https://www.instagram.com/jobhiclub/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /><span>Instagram</span><ArrowUpRight /></a>
                <a href="https://youtube.com/@jobhiclub" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube /><span>YouTube</span><ArrowUpRight /></a>
                <a href="mailto:jayasai.p239@gmail.com" aria-label="Email Jay"><Mail /><span>Email</span><ArrowUpRight /></a>
                <a href="tel:+917259891288" aria-label="Call Jay"><Phone /><span>Phone</span><ArrowUpRight /></a>
              </div>
            </section>

            <div className="scroll-cue" aria-hidden="true"><span /> SCROLL</div>
          </section>
        )}

        {screen === 1 && (
          <section ref={sectionRef} className="scene scene-work scene-gallery">
            <div className="work-head reveal">
              <div><span className="kicker">SELECTED WORK / 2026</span><h2><JellyText text="Projects in motion." /></h2></div>
              <div className="gallery-count"><b>{String(project + 1).padStart(2, '0')}</b><span> / {String(PROJECTS.length).padStart(2, '0')}</span></div>
            </div>
            <div className="project-gallery reveal" role="list" aria-label="Project gallery">
              {PROJECTS.map((item, index) => (
                <div key={item.title} role="listitem" className="project-card-wrap">
                  <button
                    className={`project-card ${project === index ? 'is-selected' : ''}`}
                    type="button"
                    data-project-card={index}
                    data-tilt
                    data-cursor="OPEN"
                    style={{ '--card-tilt': `${index % 2 === 0 ? -1.5 : 1.5}deg` }}
                    onClick={() => openProject(index)}
                    aria-label={`View project: ${item.title}`}
                  >
                    <div className="project-card-art"><Art p={item} /></div>
                    <div className="project-card-caption">
                      <span className="project-card-index">{String(index + 1).padStart(2, '0')} <i /> {item.kind}</span>
                      <h3>{item.title}</h3>
                      <ArrowUpRight size={18} />
                    </div>
                  </button>
                </div>
              ))}
            </div>
            <div className="gallery-note reveal"><span>MOVE THROUGH THE WORK</span><span>SELECT A PROJECT TO EXPAND</span></div>
          </section>
        )}

        {screen === 2 && (
          <section ref={sectionRef} className="scene scene-about">
            <div className="about-photos reveal">
              <figure className="ph ph-a" data-depth>
                <img src="/images/jay-creator.jpg" alt="Jay in a grey striped hoodie, mid-gesture in a dim room" />
              </figure>
              <figure className="ph ph-b" data-depth>
                <img src="/images/jay-outdoors.jpg" alt="Jay standing at a hilltop railing, looking over a green valley" />
              </figure>
              <figure className="ph ph-c" data-depth>
                <img src="/images/bangalore-greenery.jpg" alt="Jay looking up at tall palms on a campus road" />
              </figure>
            </div>
            <div className="about-copy reveal">
              <p className="kicker">A LITTLE ABOUT ME</p>
              <h2><JellyText lines={[{ text: 'MY' }, { text: 'STORY.', accent: true }]} /></h2>
              <p className="lead">I’m Penderi Jaya Sai, but most people call me Jay. I’m a CSE student at T. John Institute of Technology.</p>
              <p>Curiosity drives me to understand the world around me and try new things, including multimedia creation. I believe everyone has a story to tell, and I’m writing my own through the experiences, skills, and meaningful connections I collect along the way. I’d love to meet new people and learn from different perspectives.</p>
              <ul className="chips">
                <li>BUILDING</li>
                <li>LEARNING</li>
                <li>CREATING</li>
              </ul>
              <button className="btn" onClick={() => goScreen(3)} data-magnetic data-cursor="CONTACT">
                Let's connect <ArrowUpRight size={18} />
              </button>
            </div>
          </section>
        )}

        {screen === 3 && (
          <section ref={sectionRef} className="scene scene-contact">
            <div className="contact-copy reveal">
              <p className="kicker">I’D LOVE TO MEET NEW PEOPLE AND HEAR THEIR PERSPECTIVES.</p>
              <h2><JellyText lines={[{ text: "LET'S" }, { text: 'CONNECT.', accent: true }]} /></h2>
              <div className="contact-lines">
                <a className="contact-line" href="mailto:jayasai.p239@gmail.com" data-magnetic data-cursor="EMAIL">
                  <Mail size={22} />
                  <span className="cl-label">EMAIL</span>
                  <span className="cl-value">jayasai.p239@gmail.com</span>
                </a>
                <a className="contact-line" href="tel:+917259891288" data-magnetic data-cursor="CALL">
                  <Phone size={22} />
                  <span className="cl-label">PHONE</span>
                  <span className="cl-value">+91 72598 91288</span>
                </a>
              </div>
              <div className="contact-socials" aria-label="Social profiles">
                <a href="https://www.instagram.com/jobhiclub/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>
                <a href="https://www.linkedin.com/in/penderijayasai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
                <a href="https://youtube.com/@jobhiclub" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube /></a>
              </div>
            </div>
            <figure className="contact-photo reveal" data-depth>
              <img src="/images/jay-formal.jpg" alt="Jay in a navy suit, tie and white shirt against a plain background" />
            </figure>
          </section>
        )}
      </main>

      {projectOpen && (
        <div className="project-detail-backdrop" onClick={closeProject}>
          <section className="project-detail" role="dialog" aria-modal="true" aria-labelledby="project-detail-title" onClick={(event) => event.stopPropagation()}>
            <header className="project-detail-bar"><span>JAY / SELECTED WORK / {String(project + 1).padStart(2, '0')}</span><button type="button" onClick={closeProject} aria-label="Close project details" autoFocus><X size={19} /></button></header>
            <div className="project-detail-layout">
              <div className="project-detail-art"><Art p={p} /></div>
              <div className="project-detail-copy">
                <p className="eyebrow">{p.kind}</p>
                <h2 id="project-detail-title"><JellyText text={p.title} /></h2>
                <h3>{p.tag}</h3>
                <p className="desc">{p.desc}</p>
                {p.award && <p className="award">{p.award}</p>}
                <p className="stack">{p.stack}</p>
                {p.url ? <a className="link" href={p.url} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="OPEN REPO">Explore the repository <ArrowUpRight size={16} /></a> : <span className="link-unavailable">Repository link not added yet</span>}
              </div>
            </div>
            <footer className="project-detail-footer"><span>PROJECT {String(project + 1).padStart(2, '0')} <i /> {String(PROJECTS.length).padStart(2, '0')}</span><span>CLICK OUTSIDE OR PRESS ESC TO RETURN TO THE GALLERY</span></footer>
          </section>
        </div>
      )}

      <div className="pips" role="tablist" aria-label="Sections">
        {SCREENS.map((s, i) => (
          <button key={s.id} className={screen === i ? 'on' : ''} onClick={() => goScreen(i)} aria-label={`Go to ${s.label}`} aria-selected={screen === i} role="tab" data-cursor="GO">
            <i />
          </button>
        ))}
      </div>
    </div>
  );
}
