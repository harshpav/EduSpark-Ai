/**
 * AI Classroom Tools — Shared JS
 * API key is stored ONLY in memory (sessionStorage as fallback for page navigation)
 * Never hardcoded, never sent to any server other than Google Gemini API.
 */

// ─────────────────────────────────────────────
//  API KEY MANAGER
// ─────────────────────────────────────────────
const ApiKey = (() => {
  const SESSION_KEY = '__gcai_key__';

  function get() {
    return sessionStorage.getItem(SESSION_KEY) || null;
  }
  function set(key) {
    sessionStorage.setItem(SESSION_KEY, key.trim());
  }
  function clear() {
    sessionStorage.removeItem(SESSION_KEY);
  }
  function isSet() {
    const k = get();
    return k && k.length > 10;
  }
  return { get, set, clear, isSet };
})();

// ─────────────────────────────────────────────
//  MODAL LOGIC
// ─────────────────────────────────────────────
function initApiKeyModal() {
  const modal = document.getElementById('api-modal');
  if (!modal) return;

  if (ApiKey.isSet()) {
    modal.classList.add('hidden');
  }
  // pressing Enter in the input saves the key
  const input = document.getElementById('api-key-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveApiKey();
    });
  }
}

function saveApiKey() {
  const input = document.getElementById('api-key-input');
  const key = input ? input.value.trim() : '';
  if (!key || key.length < 10) {
    showToast('Please enter a valid API key.', 'error');
    return;
  }
  ApiKey.set(key);
  const modal = document.getElementById('api-modal');
  if (modal) modal.classList.add('hidden');
  showToast('API key saved for this session ✓', 'success');
}

function changeApiKey() {
  ApiKey.clear();
  const modal = document.getElementById('api-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const input = document.getElementById('api-key-input');
    if (input) { input.value = ''; input.focus(); }
  }
}

// ─────────────────────────────────────────────
//  GEMINI API HELPER
// ─────────────────────────────────────────────
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
];

/**
 * Call Gemini API — auto-retries with fallback models on high-demand errors.
 * @param {string} prompt
 * @param {object} [options]
 * @returns {Promise<string>}
 */
async function callGemini(prompt, options = {}) {
  const key = ApiKey.get();
  if (!key) throw new Error('No API key set. Please enter your Gemini API key first.');

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const body = { contents: [{ parts: [{ text: prompt }] }] };
    if (options.systemInstruction) {
      body.system_instruction = { parts: [{ text: options.systemInstruction }] };
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      // If high demand or unavailable → try next model
      if (!res.ok) {
        const msg = data?.error?.message || `HTTP ${res.status}`;
        const isRetryable = msg.includes('high demand') || msg.includes('no longer available') || msg.includes('not found');
        if (isRetryable) { lastError = msg; continue; }
        throw new Error(`Gemini API error: ${msg}`);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini API.');
      return text;

    } catch (e) {
      if (e.message.includes('Gemini API error')) throw e; // hard error, don't retry
      lastError = e.message;
    }
  }

  throw new Error(`All models busy. Please try again in a minute. (${lastError})`);
}

/**
 * Parse JSON from Gemini's response (strips markdown fences if present).
 */
function parseGeminiJson(text) {
  // Remove ```json ... ``` wrappers if present
  const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned);
}

// ─────────────────────────────────────────────
//  TOAST NOTIFICATION
// ─────────────────────────────────────────────
let toastTimer = null;
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ''; }, 3500);
}

// ─────────────────────────────────────────────
//  LOADING HELPER
// ─────────────────────────────────────────────
function setLoading(id, active) {
  const el = document.getElementById(id);
  if (!el) return;
  if (active) el.classList.add('active');
  else el.classList.remove('active');
}

// ─────────────────────────────────────────────
//  COPY TO CLIPBOARD
// ─────────────────────────────────────────────
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Copy failed. Try manually.', 'error');
  });
}

// ─────────────────────────────────────────────
//  DOWNLOAD AS TEXT FILE
// ─────────────────────────────────────────────
function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ─────────────────────────────────────────────
//  INIT ON EVERY PAGE
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initApiKeyModal();
});
