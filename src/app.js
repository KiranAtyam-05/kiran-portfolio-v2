﻿const { useEffect, useMemo, useState } = React;

const fallbackResume = {
  name: 'KIRAN ATYAM',
  title: 'Software Developer | React.js | Java | GCP | Terraform',
  phone: '+91 7013797454',
  email: 'atyamkiran057@gmail.com',
  linkedin: 'https://linkedin.com/in/kiranatyam70ba77205',
  github: 'https://github.com/KiranAtyam-05',
  summary: 'Software Developer with 3.5 years of IT experience across React.js, Java, SQL, GCP, Terraform, CI/CD, and enterprise healthcare applications.',
  skills: {},
  experience: [],
  education: [],
  certifications: []
};

function linesBetween(lines, start, endMarkers) {
  const startIndex = lines.findIndex((line) => line.toUpperCase() === start);
  if (startIndex === -1) return [];
  let endIndex = lines.length;
  for (const marker of endMarkers) {
    const found = lines.findIndex((line, index) => index > startIndex && line.toUpperCase() === marker);
    if (found !== -1 && found < endIndex) endIndex = found;
  }
  return lines.slice(startIndex + 1, endIndex).filter(Boolean);
}

function parseResume(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const markers = ['PROFESSIONAL SUMMARY', 'TECHNICAL SKILLS', 'PROFESSIONAL EXPERIENCE', 'EDUCATION', 'CERTIFICATIONS'];
  const contact = Object.fromEntries(lines.slice(2, 7).map((line) => {
    const [key, ...value] = line.split(':');
    return [key.toLowerCase(), value.join(':').trim()];
  }));
  const skills = {};
  linesBetween(lines, 'TECHNICAL SKILLS', markers).forEach((line) => {
    const [key, ...value] = line.split(':');
    if (value.length) skills[key.trim()] = value.join(':').split(',').map((item) => item.trim()).filter(Boolean);
  });
  const experience = [];
  let current = null;
  linesBetween(lines, 'PROFESSIONAL EXPERIENCE', markers).forEach((line) => {
    if (/\(.+\)/.test(line) && !line.startsWith('Client:')) {
      current = { role: line, details: [] };
      experience.push(current);
    } else if (current) current.details.push(line);
  });
  return {
    name: lines[0] || fallbackResume.name,
    title: lines[1] || fallbackResume.title,
    phone: contact.phone || fallbackResume.phone,
    email: contact.email || fallbackResume.email,
    linkedin: contact.linkedin || fallbackResume.linkedin,
    github: contact.github || fallbackResume.github,
    summary: linesBetween(lines, 'PROFESSIONAL SUMMARY', markers).join(' ') || fallbackResume.summary,
    skills,
    experience,
    education: linesBetween(lines, 'EDUCATION', markers),
    certifications: linesBetween(lines, 'CERTIFICATIONS', markers)
  };
}

function useResume() {
  const [resume, setResume] = useState(fallbackResume);
  useEffect(() => {
    fetch('/resume/resume.txt', { cache: 'no-store' })
      .then((res) => res.ok ? res.text() : Promise.reject())
      .then((text) => setResume(parseResume(text)))
      .catch(() => setResume(fallbackResume));
  }, []);
  return resume;
}

function useGithub() {
  const [github, setGithub] = useState({ user: {}, repos: [] });
  useEffect(() => {
    const local = () => fetch('data/github.json').then((res) => res.json());
    Promise.all([
      fetch('https://api.github.com/users/KiranAtyam-05').then((res) => res.json()),
      fetch('https://api.github.com/users/KiranAtyam-05/repos?per_page=100&sort=updated').then((res) => res.json())
    ]).then(([user, repos]) => setGithub({ user, repos })).catch(() => local().then(setGithub));
  }, []);
  return github;
}

const LOGO_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
const TECHNOLOGY_LOGOS = {
  'React.js': `${LOGO_BASE}/react/react-original.svg`,
  JavaScript: `${LOGO_BASE}/javascript/javascript-original.svg`,
  TypeScript: `${LOGO_BASE}/typescript/typescript-original.svg`,
  HTML5: `${LOGO_BASE}/html5/html5-original.svg`,
  CSS3: `${LOGO_BASE}/css3/css3-original.svg`,
  'Redux Toolkit': `${LOGO_BASE}/redux/redux-original.svg`,
  'Context API': `${LOGO_BASE}/react/react-original.svg`,
  'Core Java': `${LOGO_BASE}/java/java-original.svg`,
  'Spring Boot': `${LOGO_BASE}/spring/spring-original.svg`,
  'REST APIs': `${LOGO_BASE}/postman/postman-original.svg`,
  GCP: `${LOGO_BASE}/googlecloud/googlecloud-original.svg`,
  Terraform: `${LOGO_BASE}/terraform/terraform-original.svg`,
  GitHub: `${LOGO_BASE}/github/github-original.svg`,
  'CI/CD Pipelines': `${LOGO_BASE}/githubactions/githubactions-original.svg`,
  'Deployment Automation': `${LOGO_BASE}/jenkins/jenkins-original.svg`,
  'Oracle SQL': `${LOGO_BASE}/oracle/oracle-original.svg`,
  Git: `${LOGO_BASE}/git/git-original.svg`,
  Docker: `${LOGO_BASE}/docker/docker-original.svg`,
  Kubernetes: `${LOGO_BASE}/kubernetes/kubernetes-original.svg`,
  'VS Code': `${LOGO_BASE}/vscode/vscode-original.svg`,
  Eclipse: `${LOGO_BASE}/eclipse/eclipse-original.svg`,
  STS: `${LOGO_BASE}/spring/spring-original.svg`,
  Agile: `${LOGO_BASE}/jira/jira-original.svg`,
  Scrum: `${LOGO_BASE}/trello/trello-original.svg`
};

function LogoMark({ name, orbitIndex, orbitTotal }) {
  const initials = name.split(/\s|\.|\//).filter(Boolean).map((part) => part[0]).join('').slice(0, 3).toUpperCase();
  return React.createElement('button', {
    type: 'button',
    className: orbitTotal ? 'tech-logo orbit-logo' : 'tech-logo',
    title: name,
    'aria-label': name,
    style: orbitTotal ? { '--i': orbitIndex, '--total': orbitTotal } : null,
    onMouseEnter: () => window.portfolioSpeak?.(name)
  },
    TECHNOLOGY_LOGOS[name]
      ? React.createElement('img', { src: TECHNOLOGY_LOGOS[name], alt: '', loading: 'lazy', onError: (event) => { event.currentTarget.style.display = 'none'; event.currentTarget.nextSibling.style.display = 'grid'; } })
      : null,
    React.createElement('span', { className: 'logo-fallback', style: TECHNOLOGY_LOGOS[name] ? { display: 'none' } : null }, initials),
    React.createElement('small', null, name)
  );
}
function Speak({ children, className = '', as = 'span' }) {
  const Tag = as;
  return React.createElement(Tag, {
    className: `speakable ${className}`,
    onMouseEnter: (event) => window.portfolioSpeak?.(event.currentTarget.textContent || '')
  }, children);
}

function Splash({ name }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 8200);
    return () => clearTimeout(timer);
  }, []);
  return show ? React.createElement('div', { className: 'splash cinematic' },
    React.createElement('div', { className: 'splash-grid' }),
    React.createElement('div', { className: 'coding-scene', 'aria-label': 'Cartoon coding intro animation' },
      React.createElement('div', { className: 'window-view' },
        React.createElement('span', null), React.createElement('span', null), React.createElement('span', null)
      ),
      React.createElement('div', { className: 'desk' }),
      React.createElement('div', { className: 'chair' }),
      React.createElement('div', { className: 'developer' },
        React.createElement('div', { className: 'head' }),
        React.createElement('div', { className: 'body' }),
        React.createElement('div', { className: 'arm arm-left' }),
        React.createElement('div', { className: 'arm arm-right' }),
        React.createElement('div', { className: 'leg leg-left' }),
        React.createElement('div', { className: 'leg leg-right' })
      ),
      React.createElement('div', { className: 'laptop' },
        React.createElement('div', { className: 'screen' },
          React.createElement('i', null), React.createElement('i', null), React.createElement('i', null), React.createElement('i', null)
        ),
        React.createElement('div', { className: 'keyboard' })
      ),
      React.createElement('div', { className: 'code-bubbles' },
        React.createElement('span', null, '<React />'),
        React.createElement('span', null, 'Java'),
        React.createElement('span', null, 'GCP')
      )
    ),
    React.createElement('div', { className: 'splash-core' },
      React.createElement('span', null, 'Opening workspace'),
      React.createElement('h1', null, name),
      React.createElement('p', null, 'walking in . sitting down . coding begins')
    )
  ) : null;
}
function VoiceDock() {
  const [enabled, setEnabled] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceName, setVoiceName] = useState('');
  useEffect(() => {
    const load = () => {
      const next = window.speechSynthesis ? speechSynthesis.getVoices() : [];
      setVoices(next);
      if (!voiceName && next.length) setVoiceName(next[0].name);
    };
    load();
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = load;
  }, []);
  useEffect(() => {
    window.portfolioSpeak = (text) => {
      if (!enabled || !('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 150));
      const selected = voices.find((voice) => voice.name === voiceName);
      if (selected) utterance.voice = selected;
      utterance.rate = .94;
      utterance.pitch = 1.08;
      speechSynthesis.speak(utterance);
    };
  }, [enabled, voiceName, voices]);
  return React.createElement('aside', { className: 'control-pad' },
    React.createElement('button', { className: enabled ? 'magnetic voice active' : 'magnetic voice', onClick: () => setEnabled(!enabled) }, enabled ? 'Voice ON' : 'Voice OFF'),
    React.createElement('select', { value: voiceName, onChange: (e) => setVoiceName(e.target.value), 'aria-label': 'Choose voice' },
      voices.length ? voices.map((voice) => React.createElement('option', { key: voice.name }, voice.name)) : React.createElement('option', null, 'System voice')
    )
  );
}

function TopNav({ theme, setTheme }) {
  const items = ['skills', 'experience', 'projects', 'contact'];
  return React.createElement('nav', { className: 'top-nav' },
    React.createElement('a', { href: '#home', className: 'brand' }, 'KA'),
    React.createElement('div', { className: 'nav-links' }, items.map((item) => React.createElement('a', { href: `#${item}`, key: item }, item))),
    React.createElement('div', { className: 'theme-pills' }, ['noir', 'solar', 'ice'].map((mode) =>
      React.createElement('button', { className: theme === mode ? 'active' : '', onClick: () => setTheme(mode), key: mode, title: `${mode} theme` }, mode)
    ))
  );
}

function Hero({ resume, github }) {
  return React.createElement('section', { id: 'home', className: 'hero reveal' },
    React.createElement('div', { className: 'hero-left' },
      React.createElement('div', { className: 'status-line' }, React.createElement('span', null), 'Available for React, Java and GCP delivery'),
      React.createElement(Speak, { as: 'h1' }, resume.name),
      React.createElement(Speak, { as: 'h2' }, resume.title),
      React.createElement(Speak, { as: 'p', className: 'lead' }, resume.summary),
      React.createElement('div', { className: 'action-row' },
        React.createElement('a', { className: 'magnetic btn primary', href: resume.github, target: '_blank', rel: 'noreferrer' }, 'Explore GitHub'),
        React.createElement('a', { className: 'magnetic btn ghost', href: resume.linkedin, target: '_blank', rel: 'noreferrer' }, 'LinkedIn'),
        React.createElement('a', { className: 'magnetic btn ghost', href: '/resume/Kiran_Atyam_Final_Resume.docx' }, 'Resume')
      )
    ),
    React.createElement('div', { className: 'hero-right' },
      React.createElement('div', { className: 'avatar-shell avatar-animated' },
        React.createElement('div', { className: 'avatar-pulse' }),
        React.createElement('div', { className: 'avatar-spark spark-a' }),
        React.createElement('div', { className: 'avatar-spark spark-b' }),
        React.createElement('div', { className: 'scan' }),
        React.createElement('img', { src: '/assets/kiran-avatar-animated.gif', alt: 'Animated cartoon avatar of Kiran Atyam' }),
        React.createElement('div', { className: 'hud hud-a' }, React.createElement('strong', null, '3.5+'), React.createElement('span', null, 'Years')),
        React.createElement('div', { className: 'hud hud-b' }, React.createElement('strong', null, github.user.public_repos || 6), React.createElement('span', null, 'Repos')),
        React.createElement('div', { className: 'hud hud-c' }, React.createElement('strong', null, 'GCP'), React.createElement('span', null, 'Cloud'))
      )
    )
  );
}

function Skills({ skills }) {
  const entries = Object.entries(skills);
  const allSkills = entries.flatMap(([, values]) => values).slice(0, 18);
  return React.createElement('section', { id: 'skills', className: 'section reveal' },
    React.createElement('div', { className: 'section-title' }, React.createElement('span', null, '01'), React.createElement(Speak, { as: 'h2' }, 'Technology cockpit')),
    React.createElement('div', { className: 'cockpit logo-cockpit' },
      React.createElement('div', { className: 'radar logo-radar' },
        React.createElement('div', { className: 'radar-core' }, 'KA'),
        allSkills.map((skill, index) => React.createElement(LogoMark, { key: skill, name: skill, orbitIndex: index, orbitTotal: allSkills.length }))
      ),
      React.createElement('div', { className: 'skill-stack logo-stack' }, entries.map(([group, items]) =>
        React.createElement('article', { className: 'tilt-card tech-card', key: group },
          React.createElement(Speak, { as: 'h3' }, group),
          React.createElement('div', { className: 'logo-grid' }, items.map((item) => React.createElement(LogoMark, { key: item, name: item })))
        )
      ))
    )
  );
}
function Experience({ experience }) {
  return React.createElement('section', { id: 'experience', className: 'section reveal' },
    React.createElement('div', { className: 'section-title' }, React.createElement('span', null, '02'), React.createElement(Speak, { as: 'h2' }, 'Delivery timeline')),
    React.createElement('div', { className: 'experience-grid' }, experience.map((item, index) =>
      React.createElement('article', { className: 'exp-card tilt-card', key: item.role },
        React.createElement('div', { className: 'exp-index' }, `0${index + 1}`),
        React.createElement(Speak, { as: 'h3' }, item.role),
        React.createElement('ul', null, item.details.slice(0, 8).map((detail) => React.createElement('li', { key: detail }, React.createElement(Speak, null, detail))))
      )
    ))
  );
}

function Projects({ repos }) {
  const fallbackDesc = {
    MovieRating: 'Movie rating and discovery experiment with a clean interaction model.',
    myProfile: 'Personal profile foundation shaped into a modern portfolio direction.',
    'Eat-and-Split': 'React expense-splitting workflow for quick shared decisions.',
    'travel-List': 'Stateful travel checklist for packing and trip preparation.'
  };
  return React.createElement('section', { id: 'projects', className: 'section reveal' },
    React.createElement('div', { className: 'section-title' }, React.createElement('span', null, '03'), React.createElement(Speak, { as: 'h2' }, 'Interactive build wall')),
    React.createElement('div', { className: 'project-wall' }, repos.slice(0, 6).map((repo, index) =>
      React.createElement('a', { className: 'project-tile tilt-card', href: repo.html_url, target: '_blank', rel: 'noreferrer', key: repo.name },
        React.createElement('small', null, `0${index + 1} / ${repo.language || 'Code'}`),
        React.createElement(Speak, { as: 'h3' }, repo.name),
        React.createElement(Speak, { as: 'p' }, repo.description || fallbackDesc[repo.name] || 'Public GitHub project by Kiran Atyam.'),
        React.createElement('span', { className: 'launch' }, 'Open repo')
      )
    ))
  );
}

function Contact({ resume }) {
  return React.createElement('section', { id: 'contact', className: 'section contact reveal' },
    React.createElement('div', { className: 'contact-hero' },
      React.createElement('div', { className: 'contact-kicker' }, React.createElement('span', null, '06 - CONTACT'), React.createElement('i', null)),
      React.createElement(Speak, { as: 'h2' }, ['Let’s build a ', React.createElement('br', { key: 'br1' }), 'clean, reliable ', React.createElement('br', { key: 'br2' }), React.createElement('em', { key: 'em' }, 'software experience.')]),
      React.createElement(Speak, { as: 'p', className: 'contact-copy' }, 'Open to software developer roles where React, enterprise application delivery, production support, and practical teamwork matter.'),
      React.createElement('div', { className: 'contact-actions' },
        React.createElement('a', { className: 'magnetic contact-btn hello', href: `mailto:${resume.email}` },
          React.createElement('span', { className: 'contact-icon' }, '✉'),
          'Say Hello'
        ),
        React.createElement('a', { className: 'magnetic contact-btn download', href: '/resume/Kiran_Atyam_Final_Resume.docx' },
          React.createElement('span', { className: 'contact-icon' }, '⇩'),
          'Download Resume'
        )
      ),
      React.createElement('div', { className: 'contact-strip' },
        React.createElement('a', { href: `mailto:${resume.email}` }, React.createElement('span', null, '✉'), resume.email),
        React.createElement('a', { href: `tel:${resume.phone.replace(/\s/g, '')}` }, React.createElement('span', null, '☎'), resume.phone),
        React.createElement('a', { href: resume.github, target: '_blank', rel: 'noreferrer' }, React.createElement('span', null, '</>'), 'GitHub'),
        React.createElement('a', { href: resume.linkedin, target: '_blank', rel: 'noreferrer' }, React.createElement('span', null, '↗'), 'LinkedIn')
      )
    )
  );
}

function App() {
  const resume = useResume();
  const github = useGithub();
  const [theme, setTheme] = useState('noir');
  useEffect(() => document.documentElement.dataset.theme = theme, [theme]);
  useEffects();
  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'progress', id: 'progress' }),
    React.createElement(Splash, { name: resume.name }),
    React.createElement(TopNav, { theme, setTheme }),
    React.createElement(VoiceDock),
    React.createElement('main', null,
      React.createElement(Hero, { resume, github }),
      React.createElement(Skills, { skills: resume.skills }),
      React.createElement(Experience, { experience: resume.experience }),
      React.createElement(Projects, { repos: github.repos || [] }),
      React.createElement(Contact, { resume })
    ),
    React.createElement('footer', null, React.createElement('span', null, `© ${new Date().getFullYear()} KIRAN ATYAM`))
  );
}

function useEffects() {
  React.useEffect(() => {
    const reveals = [...document.querySelectorAll('.reveal')];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach((item) => io.observe(item));

    return () => io.disconnect();
  }, []);
}
function startMotion() {
  const cursor = document.getElementById('cursor');
  const spot = document.getElementById('spotlight');
  let x = innerWidth / 2, y = innerHeight / 2;
  addEventListener('mousemove', (event) => {
    x = event.clientX; y = event.clientY;
    document.documentElement.style.setProperty('--mx', `${x}px`);
    document.documentElement.style.setProperty('--my', `${y}px`);
  });
  function loop() {
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    spot.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(73, 227, 194, .18), transparent 280px)`;
    requestAnimationFrame(loop);
  }
  loop();
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.getElementById('progress').style.width = `${(scrollY / max) * 100}%`;
  }, { passive: true });
  addEventListener('mousemove', (event) => {
    document.querySelectorAll('.magnetic').forEach((button) => {
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      if (distance < 130) button.style.transform = `translate(${dx * .12}px, ${dy * .18}px)`;
      else button.style.transform = '';
    });
  });
}

function startCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const nodes = [];
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    nodes.length = 0;
    for (let i = 0; i < Math.min(120, Math.floor(innerWidth / 11)); i++) nodes.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, s: Math.random() * 2 + .8 });
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    nodes.forEach((node) => { node.x += node.vx; node.y += node.vy; if (node.x < 0 || node.x > innerWidth) node.vx *= -1; if (node.y < 0 || node.y > innerHeight) node.vy *= -1; });
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach((b) => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 120) { ctx.strokeStyle = `rgba(80,227,194,${.16 - d / 900})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }));
    nodes.forEach((node) => { ctx.fillStyle = 'rgba(255,214,102,.7)'; ctx.beginPath(); ctx.arc(node.x, node.y, node.s, 0, Math.PI * 2); ctx.fill(); });
    requestAnimationFrame(draw);
  }
  resize(); addEventListener('resize', resize); draw();
}

startCanvas();
startMotion();
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));