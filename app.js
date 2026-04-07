// ===================================
// StadiumIQ — AI Event Assistant App
// ===================================

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '70px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(7,8,15,0.98)';
  navLinks.style.padding = '20px 24px';
  navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.07)';
  navLinks.style.zIndex = '999';
});

// ---- Smooth scroll for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (navLinks.style.display === 'flex' && navLinks.style.flexDirection === 'column') {
      navLinks.style.display = 'none';
    }
  });
});

// ---- Scroll to assistant ----
document.getElementById('tryAssistantBtn').addEventListener('click', () => {
  document.getElementById('assistant').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('chatInput').focus(), 600);
});
document.getElementById('getStartedBtn').addEventListener('click', () => {
  document.getElementById('assistant').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('learnMoreBtn').addEventListener('click', () => {
  document.getElementById('crowd').scrollIntoView({ behavior: 'smooth' });
});

// ---- Counter animation ----
const animateCounters = () => {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isFloat = target % 1 !== 0;
    const duration = 1800;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const inc = target / steps;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
    }, stepTime);
  });
};

// Trigger counter on hero visible
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
heroObserver.observe(document.querySelector('.hero-stats'));

// ---- Scroll reveal animation ----
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .about-card, .cd-panel').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

document.addEventListener('animationend', () => {}, false);

// Revealed class
const styleEl = document.createElement('style');
styleEl.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleEl);

// ---- Chatbot AI Responses ----
const responses = {
  'gate a': '🚪 **Gate A** is currently showing **Low traffic** — estimated entry time is under **2 minutes**. Head to Gate A for the fastest entry!',
  'gate b': '🚪 **Gate B** has **High traffic** right now. I recommend using **Gate A or Gate C** for a faster entry (2-3 min wait vs 12 min at B).',
  'gate c': '🚪 **Gate C** is showing **Low traffic** — a great alternative! Estimated entry: **2 minutes**.',
  'gate d': '🚪 **Gate D is congested** right now. ⚠️ Please avoid Gate D and use **Gate A or Gate C** for faster access.',
  'restroom': '🚻 The nearest restroom with the shortest wait is **Restroom N1 (North Stand)** — only **1 minute** wait. Restroom S2 has a 12-min wait, best to avoid.',
  'bathroom': '🚻 Nearest low-wait restroom: **Restroom N1 (North Stand)** — ~1 minute. Restroom S2 is busy right now (12 min wait).',
  'food': '🍔 **Food Court A** has the shortest queue — only **2 minutes** wait! Food Court B has an 8-min wait. I recommend Court A for quicker service.',
  'queue': '🍔 Shortest food queue: **Food Court A** (~2 min). Food Court B is busier (~8 min). Order from your seat for zero wait!',
  'section 14': '🧭 To reach **Section 14**: Enter through **Gate A → Take Corridor 2 on the right → Turn left at the blue signage → Section 14 is on your left**. About 3-4 minutes walk from the main entrance.',
  'seat': '🪑 Please share your seat number and I\'ll give you turn-by-turn directions! Or visit the **Navigation** kiosk at any gate entrance.',
  'parking': '🚗 **Parking Lot C** has 200+ spaces available right now. Lots A and B are at 85% capacity. ETA from Lot C to Gate A: ~5 minutes walk.',
  'emergency': '🚨 Nearest emergency exit from your location: **Exit 7 (North Corridor)**. Security and first aid are stationed at **Entry Points A, B, and the East Stand**. For medical emergencies, dial the stadium helpline.',
  'exit': '🚪 Best exits right now with low congestion: **Gate A (North)** and **Gate C (East)**. Gate D is congested — avoid it.',
  'halftime': '⏱ **Halftime in 8 minutes!** My recommendation: Order food now from your seat (delivery to seat available) or head to **Food Court A** now before the rush hits.',
  'crowd': '🌊 Current crowd density: **North Stand 65%**, **East Stand 82%**, **West Stand 45%**, **South Stand 91%** (avoid South for movement). Total attendance: ~42,000.',
  'help': '👋 I can help you with:\n• Wait times at any gate or food stall\n• Navigation to your seat\n• Restroom locations\n• Parking info\n• Emergency exits\n• Food ordering\n\nJust ask me anything! 😊',
  'order': '🍕 You can order food directly from your seat! Go to the **Food** section → Browse the menu → Place your order. Avg delivery time: **8-12 minutes**. Available items: Burgers, Pizza, Nachos, Cold Drinks, Popcorn and more!',
  'hi': '👋 Hi there! I\'m StadiumIQ, your personal stadium assistant. I can help with navigation, wait times, food ordering, and more. What do you need?',
  'hello': '👋 Hello! Welcome to the stadium! I\'m here to make your experience seamless. How can I help you today?',
  'wait': '⏱ Current wait times:\n• Gate A: 2 min\n• Gate B: 12 min\n• Gate C: 3 min\n• Gate D: 18 min (congested)\n• Food Court A: 2 min\n• Food Court B: 8 min\n• Restroom N1: 1 min\n• Restroom S2: 12 min',
  'navigate': '🧭 I can navigate you to any section! Please give me your section/seat number and I\'ll provide step-by-step directions from your current gate.',
  'default': '🤖 I\'m here to help! You can ask me about:\n• Gate wait times (e.g., "Wait at Gate A?")\n• Navigation (e.g., "How to get to Section 14?")\n• Restrooms, food queues, parking\n• Emergency exits and safety\n• Halftime tips\n\nWhat would you like to know? 😊'
};

function getResponse(query) {
  const q = query.toLowerCase();
  for (const [key, value] of Object.entries(responses)) {
    if (q.includes(key)) return value;
  }
  return responses['default'];
}

function formatMessage(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

function addMessage(text, isUser = false) {
  const chatMessages = document.getElementById('chatMessages');
  const msgEl = document.createElement('div');
  msgEl.className = `msg ${isUser ? 'msg-user' : 'msg-bot'}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = isUser ? text : formatMessage(text);
  msgEl.appendChild(bubble);
  chatMessages.appendChild(msgEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const chatMessages = document.getElementById('chatMessages');
  const typingEl = document.createElement('div');
  typingEl.className = 'msg msg-bot'; typingEl.id = 'typingIndicator';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  typingEl.appendChild(bubble);
  chatMessages.appendChild(typingEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

function sendMessage(query) {
  if (!query.trim()) return;
  addMessage(query, true);
  document.getElementById('chatInput').value = '';
  document.getElementById('chatSuggestions').style.display = 'none';
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage(getResponse(query));
  }, 800 + Math.random() * 600);
}

document.getElementById('chatSend').addEventListener('click', () => {
  sendMessage(document.getElementById('chatInput').value);
});

document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage(e.target.value);
});

document.querySelectorAll('.suggestion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sendMessage(btn.dataset.query);
  });
});

// ---- Food add button interactions ----
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const original = btn.textContent;
    btn.textContent = '✓ Added';
    btn.style.background = 'rgba(0,196,140,0.3)';
    btn.style.color = '#00c48c';
    btn.style.borderColor = 'rgba(0,196,140,0.5)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 1500);
  });
});

// ---- Stadium Map zone hover ----
const tooltip = document.getElementById('zoneTooltip');
const zoneData = {
  'zone-north': { name: 'North Stand', density: '65%', wait: '3 min entry', status: '🟡 Moderate' },
  'zone-south': { name: 'South Stand', density: '91%', wait: '10 min entry', status: '🔴 High Traffic' },
  'zone-east': { name: 'East Stand', density: '82%', wait: '7 min entry', status: '🟠 Busy' },
  'zone-west': { name: 'West Stand', density: '45%', wait: '1 min entry', status: '🟢 Clear' }
};

document.querySelectorAll('.map-zone').forEach(zone => {
  zone.addEventListener('mouseenter', (e) => {
    const data = zoneData[zone.id];
    if (!data) return;
    tooltip.innerHTML = `<strong>${data.name}</strong><br>Density: ${data.density} &nbsp;|&nbsp; ${data.wait}<br>${data.status}`;
    tooltip.style.opacity = '1';
  });
  zone.addEventListener('mousemove', (e) => {
    const rect = document.getElementById('stadiumMap').getBoundingClientRect();
    tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
    tooltip.style.top = (e.clientY - rect.top + 10) + 'px';
  });
  zone.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
});

// ---- Live data simulation ----
function simulateLiveData() {
  // Randomly update wait bar widths
  const waitBars = document.querySelectorAll('.wait-bar');
  waitBars.forEach(bar => {
    const current = parseInt(bar.style.width);
    const delta = (Math.random() - 0.5) * 10;
    const newVal = Math.min(95, Math.max(5, current + delta));
    bar.style.width = newVal + '%';
  });

  // Randomly update capacity fill
  const fill = document.querySelector('.capacity-fill');
  if (fill) {
    const cur = parseInt(fill.style.width);
    const newCap = Math.min(98, Math.max(60, cur + (Math.random() - 0.5) * 3));
    fill.style.width = newCap + '%';
    document.querySelector('.capacity-pct').textContent = Math.round(newCap) + '%';
  }

  // Rotate alerts
  const alerts = [
    { type: 'alert-warn', text: '🟡 Gate D is congested — redirect to Gate C' },
    { type: 'alert-info', text: '🔵 Food Court A now serving — only 2 min wait!' },
    { type: 'alert-success', text: '🟢 Parking Lot C has 200+ spaces available' },
    { type: 'alert-info', text: '🔵 Section 12 now has open seats — upgrade available' },
    { type: 'alert-warn', text: '🟡 South Stand at 91% — avoid for now' },
    { type: 'alert-success', text: '🟢 Restroom N1 is free — nearest and quickest!' }
  ];

  const alertList = document.getElementById('alertList');
  if (alertList && Math.random() > 0.6) {
    const pick = alerts[Math.floor(Math.random() * alerts.length)];
    const newAlert = document.createElement('div');
    newAlert.className = `alert-item ${pick.type}`;
    newAlert.textContent = pick.text;
    newAlert.style.opacity = '0';
    newAlert.style.transition = 'opacity 0.5s';
    alertList.insertBefore(newAlert, alertList.firstChild);
    setTimeout(() => { newAlert.style.opacity = '1'; }, 50);
    if (alertList.children.length > 4) {
      alertList.removeChild(alertList.lastChild);
    }
  }
}

setInterval(simulateLiveData, 3500);

// ---- Zone fill animation on scroll ----
const zoneObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.zone-fill').forEach(fill => {
        const h = fill.style.height;
        fill.style.height = '0';
        setTimeout(() => { fill.style.transition = 'height 1s ease'; fill.style.height = h; }, 100);
      });
      zoneObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
zoneObserver.observe(document.getElementById('stadiumMap'));

console.log('%c🏟️ StadiumIQ Loaded!', 'color:#6c63ff;font-size:18px;font-weight:bold;');
console.log('%cBuilt for PromptWars 2026 — Physical Event Experience', 'color:#00d4aa;font-size:12px;');
