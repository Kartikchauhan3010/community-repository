// State variables
let currentLang = 'en-US'; // or 'hi-IN'
let mapInstance = null;
let chartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  loadModules();
  loadImpactMetrics();
  initMapAndChart();
});

// 1. Language & Speech Synthesis (Web Speech API)
function toggleLanguage() {
  if (currentLang === 'en-US') {
    currentLang = 'hi-IN';
    document.getElementById('currentLangLabel').innerText = 'Language: Hindi (हिंदी)';
  } else {
    currentLang = 'en-US';
    document.getElementById('currentLangLabel').innerText = 'Language: English';
  }
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel(); // Stop ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLang;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

// 2. Tab Navigation
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-indigo-50', 'text-indigo-700', 'font-bold', 'border', 'border-indigo-200');
    btn.classList.add('hover:bg-slate-100');
  });

  const activeContent = document.getElementById(`content-${tabName}`);
  const activeTab = document.getElementById(`tab-${tabName}`);

  if (activeContent) activeContent.classList.remove('hidden');
  if (activeTab) {
    activeTab.classList.add('bg-indigo-50', 'text-indigo-700', 'font-bold', 'border', 'border-indigo-200');
    activeTab.classList.remove('hover:bg-slate-100');
  }

  if (tabName === 'heatmap' && mapInstance) {
    setTimeout(() => mapInstance.invalidateSize(), 200);
  }
}

// 3. AI Scam Analyzer Client
async function runScamScan() {
  const input = document.getElementById('scanInput').value;
  if (!input.trim()) return alert('Please enter message text to analyze.');

  try {
    const res = await fetch('/api/analyzer/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const data = await res.json();

    document.getElementById('scanPlaceholder').classList.add('hidden');
    document.getElementById('scanResult').classList.remove('hidden');

    document.getElementById('riskScoreVal').innerText = data.risk_score;
    const bar = document.getElementById('riskProgressBar');
    bar.style.width = `${data.risk_score}%`;

    const badge = document.getElementById('scanBadge');
    badge.innerText = data.threat_level;
    badge.className = `px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-${data.badge_color}-100 text-${data.badge_color}-800`;

    const flaggedList = document.getElementById('flaggedList');
    flaggedList.innerHTML = '';
    if (data.detected_flags.length === 0) {
      flaggedList.innerHTML = '<li class="text-emerald-700"><i class="fa-solid fa-circle-check"></i> No critical phishing indicators detected.</li>';
    } else {
      data.detected_flags.forEach(flag => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2 text-rose-800 font-medium';
        li.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-rose-600 mt-0.5"></i> <span>[${flag.severity}] ${flag.text}</span>`;
        flaggedList.appendChild(li);
      });
    }

    document.getElementById('recommendationText').innerText = data.recommendation;
    speakText(`Risk Score is ${data.risk_score} percent. ${data.threat_level}. ${data.recommendation}`);
  } catch (err) {
    alert('Failed to analyze message: ' + err.message);
  }
}

// 4. UPI & Soundbox Simulator State Engine
function runSimScenario(type) {
  const content = document.getElementById('simScreenContent');
  if (type === 'fake_screenshot') {
    content.innerHTML = `
      <div class="bg-amber-50 border border-amber-300 p-4 rounded-2xl animate-fade-in">
        <div class="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xl shadow">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="font-bold text-amber-900 text-xs uppercase">Simulated Payment Screen</h3>
        <p class="text-2xl font-black text-slate-900 mt-1">₹1,500.00</p>
        <p class="text-xs text-slate-600 mt-1">Status: Offline Display</p>
      </div>
      <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-left text-xs text-red-900">
        <p class="font-bold"><i class="fa-solid fa-xmark"></i> Verification Check:</p>
        <p class="mt-1">No bank SMS received. Soundbox silent. This screen is an offline image mockup!</p>
      </div>
    `;
    speakText("Scenario 1: Customer shows a payment screen, but your soundbox remains silent and no bank SMS arrives. Always wait for official audio chime!");
  } else if (type === 'qr_trap') {
    content.innerHTML = `
      <div class="bg-rose-50 border border-rose-300 p-4 rounded-2xl animate-fade-in">
        <div class="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xl shadow">
          <i class="fa-solid fa-key"></i>
        </div>
        <h3 class="font-bold text-rose-900 text-xs uppercase">Enter UPI PIN Prompt</h3>
        <p class="text-xl font-black text-rose-900 mt-1">Paying ₹2,000.00</p>
        <p class="text-xs text-rose-700 mt-1">Warning: Entering PIN will DEDUCT funds!</p>
      </div>
      <div class="p-3 bg-rose-100 border border-rose-300 rounded-xl text-left text-xs text-rose-950 font-semibold">
        <p><i class="fa-solid fa-ban text-rose-600"></i> DANGER TRAP:</p>
        <p class="mt-1">Entering your UPI PIN NEVER receives money! Cancel transaction immediately!</p>
      </div>
    `;
    speakText("Scenario 2 Danger: Entering your UPI PIN will deduct money from your account. Never enter a PIN to receive payments!");
  }
}

// 5. Leaflet Map & Chart.js Analytics
async function initMapAndChart() {
  // Leaflet GIS Map
  mapInstance = L.map('map').setView([28.6139, 77.2090], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(mapInstance);

  try {
    const res = await fetch('/api/analytics/heatmap');
    const incidents = await res.json();

    const counts = { 'Merchant Payment Risk': 0, 'Messaging Risk': 0, 'Terminal Safety': 0 };

    incidents.forEach(inc => {
      counts[inc.category] = (counts[inc.category] || 0) + 1;

      const color = inc.severity === 'Critical' ? '#dc2626' : '#d97706';
      L.circle([inc.lat, inc.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 350
      }).addTo(mapInstance).bindPopup(`<b>${inc.title}</b><br>${inc.location_name}<br>Severity: ${inc.severity}`);
    });

    // Chart.js Category Breakdown
    const ctx = document.getElementById('threatChart').getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  } catch (err) {
    console.error('Heatmap init error:', err);
  }
}

// 6. Modules & Quizzes
async function loadModules() {
  try {
    const res = await fetch('/api/modules');
    const modules = await res.json();
    const container = document.getElementById('modulesContainer');
    container.innerHTML = '';

    modules.forEach(m => {
      const card = document.createElement('div');
      card.className = 'bg-white p-6 rounded-2xl shadow-sm border border-slate-200 card-hover flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">${m.category}</span>
            <button onclick="speakText('${m.title}. ${m.description}')" class="speaker-btn"><i class="fa-solid fa-volume-high"></i> Listen</button>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">${m.title}</h3>
          <p class="text-xs text-slate-600 mb-4">${m.description}</p>
        </div>
        <button onclick="startQuiz(${m.id}, '${m.title}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-circle-play"></i> Start Interactive Scenario Test
        </button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load modules:', err);
  }
}

async function startQuiz(moduleId, title) {
  try {
    const res = await fetch(`/api/quizzes?module_id=${moduleId}`);
    const questions = await res.json();

    const section = document.getElementById('quizSection');
    section.classList.remove('hidden');
    document.getElementById('quizTitle').innerText = `Quiz: ${title}`;

    const body = document.getElementById('quizBody');
    body.innerHTML = '';

    if (questions.length === 0) {
      body.innerHTML = '<p class="text-xs text-slate-500">No quiz questions available for this module yet.</p>';
      return;
    }

    questions.forEach((q, idx) => {
      const qDiv = document.createElement('div');
      qDiv.className = 'p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3';
      qDiv.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-indigo-600">${q.image_badge || 'Scenario'}</span>
          <button onclick="speakText('${q.scenario_text}')" class="speaker-btn"><i class="fa-solid fa-volume-high"></i> Listen</button>
        </div>
        <p class="text-xs font-semibold text-slate-800">${idx + 1}. ${q.scenario_text}</p>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-indigo-50">
            <input type="radio" name="q_${q.id}" value="option_a"> <span>A) ${q.option_a}</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-indigo-50">
            <input type="radio" name="q_${q.id}" value="option_b"> <span>B) ${q.option_b}</span>
          </label>
        </div>
      `;
      body.appendChild(qDiv);
    });

    const submitBtn = document.createElement('button');
    submitBtn.className = 'w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition shadow mt-4';
    submitBtn.innerText = 'Submit Quiz Answers';
    submitBtn.onclick = () => submitQuizAnswers(questions);
    body.appendChild(submitBtn);

    section.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    alert('Error loading quiz: ' + err.message);
  }
}

async function submitQuizAnswers(questions) {
  const answers = [];
  questions.forEach(q => {
    const checked = document.querySelector(`input[name="q_${q.id}"]:checked`);
    if (checked) {
      answers.push({ question_id: q.id, selected_option: checked.value });
    }
  });

  if (answers.length < questions.length) {
    return alert('Please answer all scenario questions before submitting.');
  }

  try {
    const res = await fetch('/api/quizzes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const result = await res.json();

    alert(`Quiz Complete! Score: ${result.score} / ${result.total} (${result.percentage}%)`);
    speakText(`Quiz complete! You scored ${result.score} out of ${result.total}.`);
  } catch (err) {
    alert('Failed to submit quiz: ' + err.message);
  }
}

function closeQuiz() {
  document.getElementById('quizSection').classList.add('hidden');
}

// 7. Bot Dispatch Simulator
async function sendBotAlert() {
  const phone = document.getElementById('botPhoneInput').value;
  const scam = document.getElementById('botScamSelect').value;

  try {
    const res = await fetch('/api/bot/simulate-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phone, scam_type: scam })
    });
    const data = await res.json();

    const box = document.getElementById('botResponseBox');
    box.classList.remove('hidden');
    box.innerHTML = `
      <p class="font-bold mb-1"><i class="fa-brands fa-whatsapp text-emerald-600"></i> Dispatch Success to ${data.phone_number}:</p>
      <p class="text-xs bg-white p-3 rounded-lg border border-emerald-300 font-mono text-slate-800">${data.message}</p>
    `;
    speakText('Emergency WhatsApp warning alert dispatched successfully.');
  } catch (err) {
    alert('Bot dispatch failed: ' + err.message);
  }
}

// 8. Impact Metrics & Feedback Submission
async function loadImpactMetrics() {
  try {
    const res = await fetch('/api/feedback/metrics');
    const data = await res.json();

    document.getElementById('statEvaluated').innerText = data.total_participants_evaluated;
    document.getElementById('statPre').innerText = `${data.avg_pre_confidence} / 5`;
    document.getElementById('statPost').innerText = `${data.avg_post_confidence} / 5`;
    document.getElementById('statGrowth').innerText = `+${data.impact_growth_percentage}%`;
  } catch (err) {
    console.error('Impact metrics error:', err);
  }
}

async function submitFeedback(e) {
  e.preventDefault();
  const type = document.getElementById('fbType').value;
  const pre = parseInt(document.getElementById('fbPre').value);
  const post = parseInt(document.getElementById('fbPost').value);

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participant_type: type,
        pre_confidence_score: pre,
        post_confidence_score: post,
        fraud_awareness_rating: 5,
        feedback_notes: 'Submitted via workshop portal'
      })
    });
    if (res.ok) {
      alert('Feedback response submitted successfully!');
      loadImpactMetrics();
    }
  } catch (err) {
    alert('Failed to submit feedback: ' + err.message);
  }
}
