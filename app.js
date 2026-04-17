// ===================================
// StadiumIQ — AI Event Assistant App
// ===================================

// ---- Live clock on hero card ----
function updateClock() {
  const el = document.getElementById('cardTime');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}
updateClock();
setInterval(updateClock, 1000);

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ---- Hamburger menu (fixed) ----
const hamburger = document.getElementById('hamburger');
let mobileMenu = null;

function buildMobileMenu() {
  if (mobileMenu) return;
  mobileMenu = document.createElement('nav');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.setAttribute('aria-label', 'Mobile navigation');
  mobileMenu.innerHTML = `
    <a href="#features" id="mNavFeatures">Features</a>
    <a href="#assistant" id="mNavAssistant">Assistant</a>
    <a href="#crowd" id="mNavCrowd">Live Crowd</a>
    <a href="#howItWorks" id="mNavHow">How It Works</a>
    <a href="#maps" id="mNavMaps">Maps</a>
    <a href="#about" id="mNavAbout">About</a>
    <button class="btn-primary" id="mNavCTA" style="margin-top:8px">Get Started</button>
  `;
  document.body.appendChild(mobileMenu);
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  document.getElementById('mNavCTA').addEventListener('click', () => {
    closeMobileMenu();
    document.getElementById('assistant').scrollIntoView({ behavior: 'smooth' });
  });
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  buildMobileMenu();
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (mobileMenu && mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

// ---- Smooth scroll for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- CTA buttons ----
document.getElementById('tryAssistantBtn').addEventListener('click', () => {
  document.getElementById('assistant').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('chatInput')?.focus(), 700);
});
document.getElementById('getStartedBtn').addEventListener('click', () => {
  document.getElementById('assistant').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('learnMoreBtn').addEventListener('click', () => {
  document.getElementById('crowd').scrollIntoView({ behavior: 'smooth' });
});

// ---- Toast notification ----
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toastNotif');
  toast.textContent = msg;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ---- Counter animation ----
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isFloat = !Number.isInteger(target);
    const duration = 1800;
    const steps = 60;
    let current = 0;
    const inc = target / steps;
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, duration / steps);
  });
}

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.3 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-item').forEach(el => revealObserver.observe(el));

// ---- Duplicate ticker for seamless loop ----
const ticker = document.getElementById('tickerInner');
if (ticker) {
  ticker.innerHTML += ticker.innerHTML;
}

// ---- Chatbot AI Responses ----
const responses = {
  'gate a': '🚪 **Gate A** is showing **Low traffic** — entry time under **2 minutes**. Head there now for the fastest access!',
  'gate b': '🚪 **Gate B** has **High traffic** right now. Use **Gate A or Gate C** instead — only 2-3 min wait vs 12 min at B.',
  'gate c': '🚪 **Gate C** is **Low traffic** — a great option! Estimated entry: **2 minutes**.',
  'gate d': '🚪 **Gate D is congested** ⚠️. Please avoid Gate D — use **Gate A or Gate C** for faster access.',
  'restroom': '🚻 Nearest low-wait restroom: **Restroom N1 (North Stand)** — only **1 minute** wait. Restroom S2 has a 12-min wait — avoid.',
  'bathroom': '🚻 Nearest low-wait restroom: **Restroom N1 (North Stand)** — ~1 min. Restroom S2 is busy (12 min wait).',
  'toilet': '🚻 **Restroom N1 (North Stand)** is your best bet — just 1 min wait! Avoid S2 right now (12 min).',
  'food': '🍔 **Food Court A** has the shortest queue — only **2 minutes** wait! Food Court B is at 8 min. Or order to your seat for zero wait!',
  'order': '🍕 Order food from your seat in the Features section! Browse the menu and items get delivered in **8-12 minutes**. Available: Burgers, Nachos, Cold Drinks, Popcorn & more!',
  'queue': '🍔 Shortest queue: **Food Court A** (~2 min). Food Court B is busier (~8 min). Tip: order from your seat for zero queue!',
  'section 14': '🧭 To reach **Section 14**: Gate A → Corridor 2 (right) → Left at blue signage → **Section 14 on your left**. About 3-4 minutes walk.',
  'seat': '🪑 Share your seat number and I\'ll give turn-by-turn directions! Or visit the **Navigation kiosk** at any gate entrance.',
  'parking': '🚗 **Parking Lot C** has 200+ spaces right now. Lots A & B are at 85% capacity. Lot C to Gate A: ~5 min walk. Check the Maps section for live directions!',
  'emergency': '🚨 Nearest emergency exit: **Exit 7 (North Corridor)**. Security + first aid are at **Entry Points A, B, and East Stand**. For medical emergencies, alert a steward immediately.',
  'exit': '🚪 Lowest congestion exits right now: **Gate A (North)** and **Gate C (East)**. Avoid Gate D — congested.',
  'halftime': '⏱ **Halftime in ~8 minutes!** Recommendation: Order food now from your seat, or head to **Food Court A** before the rush. Restroom N1 will also be less crowded.',
  'crowd': '🌊 Current crowd: **North 65%**, **East 82%**, **West 45%** (least crowded!), **South 91%** (avoid). Total attendance: ~42,000.',
  'help': '👋 I can help with:\n• Wait times at any gate or food stall\n• Navigation to your seat\n• Restroom locations & wait times\n• Parking info\n• Emergency exits\n• Food ordering from your seat\n\nJust ask! 😊',
  'wait': '⏱ Current wait times:\n• Gate A: 2 min ✅\n• Gate B: 12 min ⚠️\n• Gate C: 3 min ✅\n• Gate D: 18 min 🔴\n• Food Court A: 2 min ✅\n• Food Court B: 8 min 🟡\n• Restroom N1: 1 min ✅\n• Restroom S2: 12 min ⚠️',
  'navigate': '🧭 Share your section or seat number and I\'ll provide step-by-step indoor directions from your current position!',
  'hi': '👋 Hi there! I\'m **StadiumIQ**, your personal stadium assistant. I can help with navigation, wait times, food ordering, and more. What do you need?',
  'hello': '👋 Hello! Welcome to the stadium! I\'m here to make your experience seamless. How can I help you today?',
  'hey': '👋 Hey! I\'m StadiumIQ — ask me anything about the stadium. Gates, food, navigation, parking — you name it!',
  'map': '🗺️ Check the **Maps section** below for an interactive stadium map and Google Maps integration for directions to the venue. I can also give you gate-by-gate directions!',
  'google': '🔵 StadiumIQ is powered by **Google Cloud AI**, **Firebase**, and the **Google Maps API** for real-time directions and indoor navigation!',
  'default': '🤖 I\'m here to help! Try asking about:\n• Gate wait times (e.g., "Wait at Gate A?")\n• Navigation (e.g., "How to get to Section 14?")\n• Restrooms, food queues, parking\n• Emergency exits and safety\n• Halftime tips\n\nWhat would you like to know? 😊'
};

function getResponse(query) {
  const q = query.toLowerCase().trim();
  if (!q) return responses['default'];
  for (const [key, value] of Object.entries(responses)) {
    if (q.includes(key)) return value;
  }
  return responses['default'];
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
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
  typingEl.className = 'msg msg-bot';
  typingEl.id = 'typingIndicator';
  typingEl.setAttribute('aria-label', 'Assistant is typing');
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  typingEl.appendChild(bubble);
  chatMessages.appendChild(typingEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  document.getElementById('typingIndicator')?.remove();
}

function sendMessage(query) {
  if (!query.trim()) return;
  addMessage(query, true);
  const input = document.getElementById('chatInput');
  if (input) input.value = '';
  const suggestions = document.getElementById('chatSuggestions');
  if (suggestions) suggestions.style.display = 'none';
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage(getResponse(query));
  }, 700 + Math.random() * 600);
}

document.getElementById('chatSend').addEventListener('click', () => {
  sendMessage(document.getElementById('chatInput').value);
});

document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(e.target.value);
  }
});

document.querySelectorAll('.suggestion-btn').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.query));
});

// ---- Food order cart (with running total) ----
const cart = { burger: 0, nachos: 0, drink: 0, popcorn: 0 };
const prices = { burger: 280, nachos: 180, drink: 60, popcorn: 80 };
const items = { burger: '🍔 Burger', nachos: '🌮 Nachos', drink: '🥤 Cold Drink', popcorn: '🍿 Popcorn' };

function updateOrderSummary() {
  const total = Object.keys(cart).reduce((sum, k) => sum + cart[k] * prices[k], 0);
  const count = Object.values(cart).reduce((sum, v) => sum + v, 0);
  const summaryEl = document.getElementById('orderSummary');
  if (summaryEl) {
    summaryEl.style.display = count > 0 ? 'flex' : 'none';
    document.getElementById('orderCount').textContent = count;
    document.getElementById('orderTotal').textContent = `₹${total}`;
  }
}

function handleAddItem(btn, key) {
  cart[key]++;
  const count = cart[key];
  btn.textContent = `✓ ${count > 1 ? '×' + count : 'Added'}`;
  btn.style.background = 'rgba(0,196,140,0.25)';
  btn.style.color = '#00c48c';
  btn.style.borderColor = 'rgba(0,196,140,0.4)';
  updateOrderSummary();
  showToast(`${items[key]} added to cart!`, 'success');
}

document.getElementById('addBurger').addEventListener('click', function() { handleAddItem(this, 'burger'); });
document.getElementById('addNachos').addEventListener('click', function() { handleAddItem(this, 'nachos'); });
document.getElementById('addDrink').addEventListener('click', function() { handleAddItem(this, 'drink'); });
document.getElementById('addPopcorn').addEventListener('click', function() { handleAddItem(this, 'popcorn'); });

document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  const count = Object.values(cart).reduce((s, v) => s + v, 0);
  const total = Object.keys(cart).reduce((s, k) => s + cart[k] * prices[k], 0);
  if (count === 0) return;
  showToast(`🎉 Order placed! ${count} items · ₹${total} — ETA 10 min`, 'success');
  // Reset cart
  Object.keys(cart).forEach(k => cart[k] = 0);
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.textContent = '+ Add';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
  });
  updateOrderSummary();
});

// ---- Stadium Map zone hover ----
const tooltip = document.getElementById('zoneTooltip');
const zoneData = {
  'zone-north': { name: 'North Stand', density: '65%', wait: '3 min entry', status: '🟡 Moderate' },
  'zone-south': { name: 'South Stand', density: '91%', wait: '10 min entry', status: '🔴 High Traffic' },
  'zone-east':  { name: 'East Stand',  density: '82%', wait: '7 min entry', status: '🟠 Busy' },
  'zone-west':  { name: 'West Stand',  density: '45%', wait: '1 min entry', status: '🟢 Clear' }
};

document.querySelectorAll('.map-zone').forEach(zone => {
  zone.addEventListener('mouseenter', () => {
    const data = zoneData[zone.id];
    if (!data) return;
    tooltip.innerHTML = `<strong>${data.name}</strong><br>Density: ${data.density} &nbsp;|&nbsp; ${data.wait}<br>${data.status}`;
    tooltip.style.opacity = '1';
  });
  zone.addEventListener('mousemove', (e) => {
    const rect = document.getElementById('stadiumMap').getBoundingClientRect();
    tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
    tooltip.style.top = (e.clientY - rect.top + 12) + 'px';
  });
  zone.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
  // Keyboard accessibility
  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const data = zoneData[zone.id];
      if (data) showToast(`${data.name}: ${data.density} density — ${data.status}`, 'success');
    }
  });
});

// ---- Live data simulation ----
function simulateLiveData() {
  document.querySelectorAll('.wait-bar').forEach(bar => {
    const current = parseFloat(bar.style.width) || 30;
    const delta = (Math.random() - 0.5) * 8;
    bar.style.width = Math.min(95, Math.max(5, current + delta)) + '%';
  });

  const fill = document.getElementById('capacityFill');
  const pct = document.getElementById('capacityPct');
  if (fill && pct) {
    const cur = parseFloat(fill.style.width) || 78;
    const newCap = Math.min(97, Math.max(62, cur + (Math.random() - 0.5) * 2));
    fill.style.width = newCap + '%';
    fill.setAttribute('aria-valuenow', Math.round(newCap));
    pct.textContent = Math.round(newCap) + '%';
  }

  const alerts = [
    { type: 'alert-warn',    text: '🟡 Gate D is congested — redirect to Gate C' },
    { type: 'alert-info',    text: '🔵 Food Court A now serving — only 2 min wait!' },
    { type: 'alert-success', text: '🟢 Parking Lot C has 200+ spaces available' },
    { type: 'alert-info',    text: '🔵 Section 12 has open seats — upgrade available' },
    { type: 'alert-warn',    text: '🟡 South Stand at 91% — avoid for movement' },
    { type: 'alert-success', text: '🟢 Restroom N1 is free — nearest and quickest!' },
    { type: 'alert-info',    text: '🔵 West Stand is least crowded — best experience!' }
  ];

  const alertList = document.getElementById('alertList');
  if (alertList && Math.random() > 0.55) {
    const pick = alerts[Math.floor(Math.random() * alerts.length)];
    const newAlert = document.createElement('div');
    newAlert.className = `alert-item ${pick.type}`;
    newAlert.textContent = pick.text;
    newAlert.style.opacity = '0';
    newAlert.style.transition = 'opacity 0.5s';
    alertList.insertBefore(newAlert, alertList.firstChild);
    requestAnimationFrame(() => { newAlert.style.opacity = '1'; });
    if (alertList.children.length > 4) alertList.removeChild(alertList.lastChild);
    // Update badge
    const badge = document.getElementById('alertCountBadge');
    if (badge) badge.textContent = alertList.children.length;
  }
}
setInterval(simulateLiveData, 3500);

// ---- Zone fill entrance animation ----
const zoneObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.zone-fill').forEach(fill => {
      const h = fill.style.height;
      fill.style.height = '0';
      requestAnimationFrame(() => {
        setTimeout(() => {
          fill.style.transition = 'height 1s ease';
          fill.style.height = h;
        }, 100);
      });
    });
    zoneObserver.disconnect();
  }
}, { threshold: 0.3 });
const stadiumMap = document.getElementById('stadiumMap');
if (stadiumMap) zoneObserver.observe(stadiumMap);

// ---- Parking spots live simulation ----
const parkEl = document.getElementById('parkingSpots');
if (parkEl) {
  let spots = 247;
  setInterval(() => {
    spots = Math.max(50, Math.min(300, spots + Math.floor((Math.random() - 0.5) * 6)));
    parkEl.textContent = `${spots} spots free right now`;
  }, 5000);
}

// ---- Hero mini card pulse ----
const miniCard = document.getElementById('heroMiniCard');
const miniMessages = [
  { icon: '🤖', title: 'AI Suggestion', body: 'Head to Food Court A — only 2 min wait!' },
  { icon: '🚪', title: 'Gate Update', body: 'Gate A clear — fastest entry right now!' },
  { icon: '🚻', title: 'Pro Tip', body: 'Restroom N1 has zero queue — go now!' },
  { icon: '🏏', title: 'Match Alert', body: 'Match starting in 5 minutes — to your seats!' },
];
if (miniCard) {
  let msgIdx = 0;
  setInterval(() => {
    msgIdx = (msgIdx + 1) % miniMessages.length;
    const m = miniMessages[msgIdx];
    miniCard.querySelector('.hmc-icon').textContent = m.icon;
    miniCard.querySelector('.hmc-title').textContent = m.title;
    miniCard.querySelector('.hmc-body').textContent = m.body;
  }, 4000);
}

console.log('%c🏟️ StadiumIQ Loaded!', 'color:#6c63ff;font-size:18px;font-weight:bold;');
console.log('%cBuilt for PromptWars 2026 — Physical Event Experience', 'color:#00d4aa;font-size:12px;');
