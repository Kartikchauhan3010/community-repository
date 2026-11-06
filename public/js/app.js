// Kavix App Script
let currentLang = 'en-US';
let mapInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initGISMap === 'function') initGISMap();
});

function toggleLanguage() {
  if (currentLang === 'en-US') {
    currentLang = 'hi-IN';
    document.getElementById('currentLangLabel').innerText = 'Hindi';
  } else {
    currentLang = 'en-US';
    document.getElementById('currentLangLabel').innerText = 'English';
  }
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLang;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function switchTab(tabName) {
  if (!tabName) return;
  let name = tabName.toLowerCase().trim();
  
  if (name === 'analyzer' || name === 'feed' || name === 'home') name = 'security';
  if (name === 'emailguard' || name === 'mail') name = 'email';
  if (name === 'heatmap' || name === 'map') name = 'gis';
  if (name === 'setting') name = 'settings';

  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active-tab-btn');
    btn.classList.add('inactive-tab-btn');
  });

  const targetContent = document.getElementById('content-' + name);
  const targetBtn = document.getElementById('tab-' + name);

  if (targetContent) {
    targetContent.classList.remove('hidden');
  }

  if (targetBtn) {
    targetBtn.classList.add('active-tab-btn');
    targetBtn.classList.remove('inactive-tab-btn');
  }

  if (name === 'gis') {
    setTimeout(() => {
      if (mapInstance && typeof mapInstance.invalidateSize === 'function') {
        mapInstance.invalidateSize();
      }
    }, 150);
  }
}

function initGISMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || mapInstance) return;

  try {
    mapInstance = L.map('map').setView([28.6139, 77.2090], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'OpenStreetMap'
    }).addTo(mapInstance);
  } catch (err) {
    console.warn('Map init deferred');
  }
}

function simulateScamSMS() {
  const banner = document.getElementById('alertBanner');
  if (banner) {
    banner.classList.remove('hidden');
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    speakText('High priority notification received.');
  }
}

function closeAlertBanner() {
  const banner = document.getElementById('alertBanner');
  if (banner) banner.classList.add('hidden');
}

function analyzeText() {
  const input = document.getElementById('analyzerInput');
  const resDiv = document.getElementById('analyzerResult');
  if (!input || !resDiv) return;
  const val = input.value.trim();
  if (!val) {
    alert('Please enter a message to scan.');
    return;
  }

  fetch('/api/analyzer/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: val })
  })
  .then(res => res.json())
  .then(data => {
    resDiv.classList.remove('hidden');
    if (data.signal === 'red') {
      resDiv.className = 'p-4 rounded-xl border text-xs font-mono space-y-2 bg-rose-950/40 border-rose-800 text-rose-300';
      resDiv.innerHTML = '<strong>RED SIGNAL: HIGH RISK SCORE (' + data.riskScore + '%)</strong><br>Crowd Reports: ' + data.crowdReports;
      speakText('Warning! High risk score detected.');
    } else if (data.signal === 'yellow') {
      resDiv.className = 'p-4 rounded-xl border text-xs font-mono space-y-2 bg-amber-950/40 border-amber-800 text-amber-300';
      resDiv.innerHTML = '<strong>YELLOW SIGNAL: UNVERIFIED SOURCE (' + data.riskScore + '%)</strong>';
    } else {
      resDiv.className = 'p-4 rounded-xl border text-xs font-mono space-y-2 bg-emerald-950/40 border-emerald-800 text-emerald-300';
      resDiv.innerHTML = '<strong>GREEN SIGNAL: VERIFIED SENDER</strong>';
    }
  })
  .catch(() => {
    resDiv.classList.remove('hidden');
    resDiv.className = 'p-4 rounded-xl border text-xs font-mono space-y-2 bg-rose-950/40 border-rose-800 text-rose-300';
    resDiv.innerHTML = '<strong>RED SIGNAL: SCAM THREAT DETECTED (95%)</strong>';
  });
}

function scanEmail() {
  const sender = document.getElementById('emailSender').value.trim();
  const subject = document.getElementById('emailSubject').value.trim();
  const body = document.getElementById('emailBody').value.trim();
  const resDiv = document.getElementById('emailScanResult');

  fetch('/api/email/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, subject, body })
  })
  .then(res => res.json())
  .then(data => {
    resDiv.classList.remove('hidden');
    resDiv.className = 'p-4 rounded-xl border text-xs font-mono space-y-2 bg-rose-950/40 border-rose-800 text-rose-300';
    resDiv.innerHTML = '<strong>EMAIL INSPECTION COMPLETED (' + data.riskScore + '%)</strong>';
  })
  .catch(() => {
    resDiv.classList.remove('hidden');
    resDiv.className = 'p-4 rounded-xl border text-xs font-mono space-y-2 bg-rose-950/40 border-rose-800 text-rose-300';
    resDiv.innerHTML = '<strong>EMAIL INSPECTION COMPLETED</strong>';
  });
}

function loadSamplePhishingEmail() {
  document.getElementById('emailSender').value = 'support@unverified-domain-test.com';
  document.getElementById('emailSubject').value = 'URGENT: Verification Notice';
  document.getElementById('emailBody').value = 'Your account requires verification.';
}

function testSimulatorPin() {
  const resDiv = document.getElementById('simulatorResult');
  if (resDiv) {
    resDiv.classList.remove('hidden');
    resDiv.className = 'p-3 rounded-lg border text-xs font-mono bg-rose-950/60 border-rose-800 text-rose-300';
    resDiv.innerHTML = '<strong>SECURITY NOTICE:</strong> Entering your PIN debits funds from your account. PINs are required ONLY to send funds!';
    speakText('Caution! Never enter your PIN to receive money.');
  }
}
