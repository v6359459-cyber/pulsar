const P = window.pulsar;
const root = document.getElementById('root');
const $ = s => root.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CATALOG = [
  // fast
  { id: 'gemma4-e4b', cat: 'fast', fresh: true, name: 'Gemma 4 E4B', repos: ['unsloth/gemma-4-E4B-it-GGUF', 'mradermacher/gemma-4-E4B-it-GGUF'], size: 5.0, layers: 42, kv: 40, tags: ['general'], ru: 'Очень быстрая и современная. Хороша для повседневных вопросов.', en: 'Very fast and modern. Great for everyday questions.' },
  { id: 'lfm25-8b-a1b', cat: 'fast', fresh: true, name: 'LFM2.5 8B-A1B', repos: ['LiquidAI/LFM2.5-8B-A1B-GGUF', 'AtomicChat/lfm25-8b-a1b-GGUF', 'atomicchat/lfm25-8b-a1b-GGUF'], size: 5.2, layers: 24, kv: 10, tags: ['general'], ru: 'Работает только 1,5 млрд параметров из 8 — поэтому отвечает мгновенно.', en: 'Only 1.5B of 8B parameters are active — answers instantly.' },
  { id: 'llama32-3b', cat: 'fast', fresh: true, name: 'Llama 3.2 3B', repos: ['bartowski/Llama-3.2-3B-Instruct-GGUF'], size: 2.0, layers: 28, kv: 57, tags: ['general'], ru: 'Самая лёгкая и быстрая. Пойдёт даже на слабом ПК.', en: 'Lightest and fastest. Runs even on a weak PC.' },
  { id: 'qwen25-3b', cat: 'fast', name: 'Qwen 2.5 3B', repos: ['bartowski/Qwen2.5-3B-Instruct-GGUF'], size: 1.9, layers: 36, kv: 18, tags: ['general'], ru: 'Маленькая и быстрая. Для слабых ПК.', en: 'Small and fast. For weak PCs.' },
  { id: 'llama31-8b', cat: 'fast', name: 'Llama 3.1 8B', repos: ['bartowski/Meta-Llama-3.1-8B-Instruct-GGUF'], size: 4.9, layers: 32, kv: 65, tags: ['general'], ru: 'Универсальная. Общение, тексты, вопросы.', en: 'All-rounder. Chat, writing, questions.' },
  { id: 'gemma2-9b', cat: 'fast', name: 'Gemma 2 9B', repos: ['bartowski/gemma-2-9b-it-GGUF'], size: 5.8, layers: 42, kv: 172, maxCtx: 8192, tags: ['general'], ru: 'Аккуратные ответы, хорошо держит русский. Для длинных сайтов мало памяти.', en: 'Neat answers, strong multilingual. Short memory for long sites.' },
  // code
  { id: 'qwen35-9b', cat: 'code', fresh: true, name: 'Qwen3.5 9B', repos: ['bartowski/Qwen_Qwen3.5-9B-GGUF', 'unsloth/Qwen3.5-9B-GGUF'], size: 5.9, layers: 32, kv: 16, tags: ['code', 'general'], ru: 'Лучшая для кода и сайтов на 8 ГБ в 2026 году. Хорошо знает русский.', en: 'Best for code and websites on 8 GB in 2026. Strong multilingual.' },
  { id: 'granite42-8b', cat: 'code', fresh: true, name: 'Granite 4.2 8B', repos: ['bartowski/granite-4.2-8b-GGUF'], size: 5.5, layers: 40, kv: 10, tags: ['code'], ru: 'Точно выполняет команды и действия. Хороша для агентов и файлов.', en: 'Follows commands and actions precisely. Great for agents and files.' },
  { id: 'qwen25-coder-7b', cat: 'code', name: 'Qwen 2.5 Coder 7B', repos: ['bartowski/Qwen2.5-Coder-7B-Instruct-GGUF'], size: 4.7, layers: 28, kv: 29, tags: ['code'], ru: 'Проверенная модель для кода. Стабильная и быстрая.', en: 'Proven code model. Stable and fast.' },
  { id: 'qwen25-coder-3b', cat: 'code', name: 'Qwen 2.5 Coder 3B', repos: ['bartowski/Qwen2.5-Coder-3B-Instruct-GGUF'], size: 1.9, layers: 36, kv: 18, tags: ['code'], ru: 'Маленькая модель для кода. Быстрая даже на слабом ПК.', en: 'Small code model. Fast even on weak PCs.' },
  // logic
  { id: 'r1-0528-8b', cat: 'logic', fresh: true, name: 'DeepSeek R1 8B', repos: ['unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF', 'bartowski/deepseek-ai_DeepSeek-R1-0528-Qwen3-8B-GGUF'], size: 5.0, layers: 36, kv: 73, tags: ['reason'], ru: 'Думает по шагам перед ответом. Для задач, математики и логики.', en: 'Thinks step by step. For problems, math and logic.' },
  { id: 'r1-distill-7b', cat: 'logic', name: 'DeepSeek R1 Distill 7B', repos: ['bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF'], size: 4.7, layers: 28, kv: 29, tags: ['reason'], ru: 'Предыдущая версия R1. Рассуждает по шагам.', en: 'Previous R1. Thinks step by step.' },
  { id: 'phi35-mini', cat: 'logic', name: 'Phi-3.5 mini', repos: ['bartowski/Phi-3.5-mini-instruct-GGUF'], size: 2.4, layers: 32, kv: 196, tags: ['reason'], ru: 'Лёгкая, хорошо рассуждает для своего размера.', en: 'Light, reasons well for its size.' },
  // power
  { id: 'gpt-oss-20b', cat: 'power', fresh: true, name: 'gpt-oss 20B', repos: ['ggml-org/gpt-oss-20b-GGUF'], quant: 'MXFP4', size: 12.1, layers: 24, kv: 24, moe: true, active: 3.6, tags: ['general', 'code', 'reason'], ru: 'Самая умная из тех, что потянет обычный ПК. Модель от OpenAI.', en: 'Smartest model a normal PC can run. By OpenAI.' },
  { id: 'gemma4-12b', cat: 'power', fresh: true, name: 'Gemma 4 12B', repos: ['unsloth/gemma-4-12b-it-GGUF'], size: 7.6, layers: 48, kv: 100, tags: ['code', 'general'], ru: 'Заметно сильнее в коде, чем лёгкие модели. Медленнее.', en: 'Noticeably stronger at code than light models. Slower.' },
  { id: 'gemma4-26b-a4b', cat: 'power', fresh: true, name: 'Gemma 4 26B A4B', repos: ['unsloth/gemma-4-26B-A4B-it-GGUF', 'AtomicChat/gemma-4-26B-A4B-it-GGUF'], size: 15.5, layers: 30, kv: 100, moe: true, active: 4, tags: ['code', 'general'], ru: 'Лучшая по коду в списке. Нужно много оперативной памяти.', en: 'Best at code in the list. Needs a lot of RAM.' },
  { id: 'qwen25-14b', cat: 'power', name: 'Qwen 2.5 14B', repos: ['bartowski/Qwen2.5-14B-Instruct-GGUF'], size: 9.0, layers: 48, kv: 98, tags: ['general', 'code'], ru: 'Умнее 7B-моделей. Лучше с видеокартой от 12 ГБ.', en: 'Smarter than 7B models. Best with a 12 GB GPU.' },
  { id: 'qwen25-32b', cat: 'power', name: 'Qwen 2.5 32B', repos: ['bartowski/Qwen2.5-32B-Instruct-GGUF'], size: 19.9, layers: 64, kv: 131, tags: ['general', 'code'], ru: 'Очень умная и очень тяжёлая.', en: 'Very smart and very heavy.' }
];
// helper models: they cannot run alone, they only speed up a big model of the same family (speculative decoding)
const DRAFTS = [
  { id: 'draft-qwen35', name: 'Qwen3.5 0.8B', repos: ['unsloth/Qwen3.5-0.8B-GGUF', 'bartowski/Qwen_Qwen3.5-0.8B-GGUF', 'lmstudio-community/Qwen3.5-0.8B-GGUF'], quant: 'Q8_0', size: 0.8, layers: 24 },
  { id: 'draft-qwen3', name: 'Qwen3 0.6B', repos: ['bartowski/Qwen_Qwen3-0.6B-GGUF', 'unsloth/Qwen3-0.6B-GGUF'], quant: 'Q8_0', size: 0.6, layers: 28 },
  { id: 'draft-r1', name: 'DeepSeek R1 Distill 1.5B', repos: ['bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF', 'unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF'], quant: 'Q4_K_M', size: 1.1, layers: 28 },
  { id: 'draft-qwen25', name: 'Qwen 2.5 0.5B', repos: ['bartowski/Qwen2.5-0.5B-Instruct-GGUF'], quant: 'Q8_0', size: 0.5, layers: 24 },
  { id: 'draft-qwen25-coder', name: 'Qwen 2.5 Coder 0.5B', repos: ['bartowski/Qwen2.5-Coder-0.5B-Instruct-GGUF'], quant: 'Q8_0', size: 0.5, layers: 24 },
  { id: 'draft-llama32', name: 'Llama 3.2 1B', repos: ['bartowski/Llama-3.2-1B-Instruct-GGUF'], quant: 'Q8_0', size: 1.3, layers: 16 },
  { id: 'draft-gemma4', name: 'Gemma 4 E2B', repos: ['unsloth/gemma-4-E2B-it-GGUF', 'ggml-org/gemma-4-E2B-it-GGUF'], quant: 'Q4_K_M', size: 3.1, layers: 35 },
  { id: 'draft-gemma2', name: 'Gemma 2 2B', repos: ['bartowski/gemma-2-2b-it-GGUF'], quant: 'Q4_K_M', size: 1.7, layers: 26 },
  { id: 'draft-granite', name: 'Granite 4.2 3B', repos: ['bartowski/granite-4.2-3b-GGUF'], quant: 'Q4_K_M', size: 2.0, layers: 40 }
];
// accelerator is chosen by model name, so it also works for the user's own models from disk
const DRAFT_RULES = [
  [/qwen[\s_.-]*3\.5/i, 'draft-qwen35'],
  [/r1[\s_.-]*0528|qwen[\s_.-]*3(?![.\d])/i, 'draft-qwen3'],
  [/r1[\s_.-]*distill|deepseek.*distill.*qwen/i, 'draft-r1'],
  [/qwen[\s_.-]*2\.5.*coder/i, 'draft-qwen25-coder'],
  [/qwen[\s_.-]*2\.5/i, 'draft-qwen25'],
  [/llama[\s_.-]*3(\.[123])?/i, 'draft-llama32'],
  [/gemma[\s_.-]*4/i, 'draft-gemma4'],
  [/gemma[\s_.-]*2/i, 'draft-gemma2'],
  [/granite[\s_.-]*4/i, 'draft-granite']
];
const NO_DRAFT = new Set(['gemma4-e4b', 'lfm25-8b-a1b', 'gpt-oss-20b', 'phi35-mini']);
// accelerator for this model if boosters are on and this one is not switched off
function draftOn(m) { if (S.st.spec === false) return null; const id = draftFor(m); return id && !(S.st.draftOff || {})[id] ? DRAFTS.find(x => x.id === id) : null; }
function draftFor(m) {
  if (!m || NO_DRAFT.has(m.id) || String(m.id).startsWith('draft-')) return null;
  const key = `${m.id} ${m.name} ${m.path ? m.path.split(/[\\/]/).pop() : ''}`;
  const r = DRAFT_RULES.find(([re]) => re.test(key)); if (!r) return null;
  const d = DRAFTS.find(x => x.id === r[1]);
  return d && (m.size || 5) >= d.size * 2 ? d.id : null;
}
const findM = id => allModels().find(x => x.id === id) || DRAFTS.find(x => x.id === id);
function helperCard(d, i) {
  const dl = S.dl[d.id], have = S.local.has(d.id), on = S.st.spec !== false && !(S.st.draftOff || {})[d.id];
  const helps = allModels().filter(m => draftFor(m) === d.id).map(m => m.name).join(', ');
  let actions;
  if (dl) actions = `<div class="track"><div id="pg-${d.id}" style="width:${dl.total ? (dl.got / dl.total * 100).toFixed(1) : 0}%"></div></div>
    <div class="row small muted"><span class="mono" id="pt-${d.id}">${dlText(dl, d)}</span><button class="btn ghost sm" data-act="cancel" data-v="${d.id}">${T('cancel')}</button></div>`;
  else if (have) actions = `<div class="row"><button class="btn sm ${on ? '' : 'ghost'}" style="flex:1" data-act="draftTgl" data-v="${d.id}">${on ? T('helperOn') : T('helperOff')}</button><button class="btn ghost sm" data-act="del" data-v="${d.id}">${T('del')}</button></div>`;
  else actions = `<button class="btn ghost sm" data-act="dlHelper" data-v="${d.id}">${S.partial[d.id] ? T('resumeDl') : T('download')}</button>`;
  return `<div class="card fu helper" style="animation-delay:${.14 + i * .04}s">
    <div class="row"><span class="fit fit2">${T('helperTag')}</span><span class="mono small muted">≈${d.size} ${T('gb')}</span></div>
    <div style="font-size:21px;font-weight:400">${esc(d.name)}</div>
    <div class="small muted" style="line-height:1.5;min-height:40px;font-size:14px">${T('helperD')} <span style="color:#bbb">${esc(helps)}</span></div>${actions}</div>`;
}
function allModels() {
  return [...CATALOG, ...(S.st.customModels || []).map(c => ({ id: c.id, cat: 'mine', name: c.name, path: c.path, size: c.sizeGB || 5, layers: 32, kv: 64, tags: ['general', 'code'], ru: 'Твоя модель с диска', en: 'Your model from disk' }))];
}
const CATS = [['fast', 'catFast'], ['code', 'catCode'], ['logic', 'catLogic'], ['power', 'catPower']];

const S = { partial: {}, chats: [], chatId: null, st: {}, tab: 'models', local: new Set(), dl: {}, running: null, engine: null, msgs: [], streaming: null, busy: null };
const T = k => (I18N[S.st.lang || 'ru'] || I18N.ru)[k] ?? k;
const L = () => S.st.lang || 'ru';
const save = patch => { Object.assign(S.st, patch); return P.setSettings(patch); };
let toastTimer;
function toast(msg) { document.querySelector('.toast')?.remove(); const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.appendChild(d); clearTimeout(toastTimer); toastTimer = setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 350); }, 3500); }

// ---------- optimization ----------
function plan(m) {
  const hw = S.st.hw || { vramGB: 0, ramGB: 8, threads: 4 };
  const o = S.st.opt || {};
  const auto = o.auto !== false;
  const vram = S.st.engine === 'cpu' ? 0 : hw.vramGB || 0, ram = hw.ramGB || 8;
  const dOn = draftOn(m), reserve = dOn ? dOn.size + 0.4 : 0;
  const budget0 = vram - 1.5, draftRoom = !!dOn && m.size <= budget0 - reserve, budget = draftRoom ? budget0 - reserve : budget0;
  let ngl = 0, fit, ctx = 4096, speed, cpuMoe = false;
  if (vram >= 2 && m.size <= budget) {
    ngl = 999; fit = 2; speed = Math.round(150 / m.size);
    ctx = Math.floor((budget - m.size) * 0.9 * 1048576 / (m.kv || 64) / 1024) * 1024;
    ctx = Math.max(4096, Math.min(16384, m.maxCtx || 16384, ctx));
  } else if (vram >= 4 && m.moe && m.size <= ram * 0.75 + budget) {
    ngl = 999; cpuMoe = true; ctx = 8192;
    fit = m.size <= ram * 0.7 + 2 ? 1 : 0; speed = Math.max(3, Math.round(70 / (m.active || 4)));
  } else if (vram >= 2 && m.size <= budget + ram * 0.6) {
    const frac = Math.max(0, budget) / m.size; ngl = Math.floor(m.layers * frac); ctx = Math.min(8192, m.maxCtx || 8192);
    fit = frac > 0.6 ? 1 : 0; speed = Math.max(1, Math.round(150 / m.size * frac * 0.5 + 10 / m.size));
  } else {
    ngl = 0; speed = Math.max(1, Math.round(22 / m.size));
    fit = m.size <= ram * 0.45 ? 1 : m.size <= ram * 0.75 ? 0 : -1;
  }
  if (fit === 2 && m.size < 3) fit = 2;
  if (!auto || o.layers === 'half') ngl = ngl === 999 ? Math.floor(m.layers / 2) : Math.floor(ngl / 2);
  if (o.ctx && o.ctx !== 'auto') ctx = +o.ctx;
  const threads = o.threads === 'all' ? (hw.threads || 4) : Math.max(2, hw.cores || 4);
  const measured = S.st.speed && S.st.speed[m.id];
  // parallel agents: as many as the free video memory allows
  let slots = 1;
  if (ngl === 999 && !cpuMoe) {
    const free = budget - m.size, per = (m.kv || 64) / 1048576;
    for (const n of [4, 3, 2]) { if (vram >= n * 4 && free * 0.9 / per / n >= 8192) { slots = n; break; } }
    if (slots > 1) ctx = Math.max(8192, Math.min(ctx, Math.floor(free * 0.9 / per / slots / 1024) * 1024));
  }
  return { ngl, fit, ctx, threads, slots, cpuMoe, speed: measured || speed, measured: !!measured, gpu: ngl > 0, draftRoom: draftRoom && ngl === 999 && !cpuMoe };
}
function planText(m, p) {
  const gpuPart = p.cpuMoe ? `${T('onGpu')} + ${T('inRam')}` : p.ngl === 999 ? `${m.layers}/${m.layers} ${T('onGpu')}` : p.ngl > 0 ? `${p.ngl}/${m.layers} ${T('onGpu')}, ${T('inRam')}` : T('onCpu');
  return `${m.quant || 'Q4_K_M'} · ${gpuPart}${p.slots > 1 ? ' · ' + p.slots + ' ' + T('agentsPar') : ''} · ${T('ctx')} ${p.ctx / 1024}K · ${p.measured ? '' : '≈'}${p.speed} ${T('tps')}`;
}
function profile() {
  const hw = S.st.hw || {}; const v = hw.vramGB || 0;
  if (v >= 11) return [T('profHigh'), '14B', true];
  if (v >= 6) return [T('profMid'), '8–9B', true];
  if (v >= 3) return [T('profLow'), '3–7B', true];
  return [T('profLow'), (hw.ramGB || 8) >= 16 ? '7B' : '3B', false];
}

// ---------- screens ----------
function langScreen() {
  root.innerHTML = `<div class="screen center" style="flex-direction:column;gap:28px">
    <div aria-hidden="true" style="position:absolute;top:50%;left:50%;width:360px;height:360px;margin:-260px 0 0 -180px">
      <div class="ring"></div><div class="ring" style="animation-delay:1.06s"></div><div class="ring" style="animation-delay:2.13s"></div>
      <div class="led" style="position:absolute;top:50%;left:50%;width:8px;height:8px;margin:-4px;border-radius:4px;background:#fff"></div></div>
    <div style="height:140px"></div>
    <div class="fu" style="font-size:14px;letter-spacing:.5em;font-weight:400">PULSAR</div>
    <h1 class="fu" style="text-align:center;animation-delay:.15s">Выбери язык<br><span style="color:#666">Choose language</span></h1>
    <div class="fu" style="display:flex;gap:12px;animation-delay:.3s">
      <button class="btn" data-act="lang" data-v="ru">Русский</button><button class="btn ghost" data-act="lang" data-v="en">English</button></div></div>`;
}
function applyT(el) { el.querySelectorAll('[data-t]').forEach(n => { n.innerHTML = T(n.dataset.t); }); }
let introTimer;
function intro() {
  root.innerHTML = document.getElementById('intro').innerHTML;
  const fan = document.getElementById('fan').innerHTML;
  root.querySelectorAll('.fanslot').forEach(i => { i.innerHTML = fan; i.style.display = 'block'; i.querySelector('svg').style.cssText = 'width:100%;height:100%'; });
  applyT(root);
  if (S.st.sound !== false) Sound.intro();
  introTimer = setTimeout(afterIntro, 11400);
}
async function afterIntro() {
  clearTimeout(introTimer); Sound.stopAll();
  if (S._afterIntro) return; S._afterIntro = true;
  if (!S.st.introSeen) save({ introSeen: true });
  // updates download in the background; the app opens at once
  P.checkUpdate().catch(() => {});
  if (!S.st.hw) scanScreen(); else appScreen();
  if (S.st.justUpdated) { const v = S.st.justUpdated; await save({ justUpdated: null }); setTimeout(() => toast(T('updDone')(v)), 900); }
}
async function updateStep() {
  root.innerHTML = `<div class="screen center" style="flex-direction:column;gap:26px"><div style="position:relative;width:90px;height:90px;margin:40px 0 50px"><div class="ring"></div><div class="ring" style="animation-delay:1.06s"></div><div class="led" style="position:absolute;top:50%;left:50%;width:6px;height:6px;margin:-3px;border-radius:3px;background:#fff"></div></div>
    <div class="fu updt" id="updtext">${T('updChecking')}</div><div class="track fu" style="width:320px;opacity:0;transition:opacity .5s" id="updtrack"><div id="updbar" style="width:0%;transition:width .4s"></div></div><div class="mono updsub" id="updsub"></div></div>`;
  const r = await Promise.race([P.checkUpdate().catch(() => ({})), new Promise(res => setTimeout(() => res({}), 9000))]);
  if (!r || !r.available) return;
  document.getElementById('updtext').textContent = T('updUpdating')(r.version);
  document.getElementById('updtrack').style.opacity = 1;
  const ok = await new Promise(res => { const t0 = Date.now(); const tick = () => { if (S.update && S.update.state === 'ready') return res(true); if (Date.now() - t0 > 15 * 60000) return res(false); setTimeout(tick, 500); }; tick(); });
  if (ok) { await save({ justUpdated: r.version }); document.getElementById('updtext').textContent = T('updRestart'); document.getElementById('updsub').textContent = T('updWait'); await new Promise(r => setTimeout(r, 800)); P.installUpdate(); await new Promise(() => {}); }
}

async function scanScreen() {
  Sound.stopAll();
  root.innerHTML = `<div class="screen" style="padding:48px 24px;overflow-y:auto"><div style="width:100%;max-width:640px;margin:auto;display:flex;flex-direction:column;gap:28px">
    <div class="fu" style="font-size:13px;letter-spacing:.4em;font-weight:400;color:#777">PULSAR</div>
    <h2 class="fu" style="font-size:48px;animation-delay:.1s">${T('scanTitle')}</h2><div id="rows" class="muted">…</div></div></div>`;
  const hw = await P.scan().catch(() => null) || { vramGB: 0, ramGB: 8 };
  await save({ hw });
  const [name, max, gpu] = profile();
  const rows = [
    [T('sGpu'), hw.gpu ? `${hw.gpu}${hw.vramGB ? ' · ' + hw.vramGB + ' ' + T('gb') : ''}` : T('noGpu')],
    [T('sRam'), `${hw.ramGB} ${T('gb')}`],
    [T('sCpu'), `${hw.cores || '?'} ${T('cores')} · ${hw.threads || '?'} ${T('threads')}`],
    [T('sDisk'), hw.freeGB != null ? `${hw.freeGB} ${T('gb')}` : '—'],
    [T('sSpeed'), T('speedLater')]
  ];
  $('#rows').outerHTML = `<div>${rows.map((r, i) => `<div class="fu" style="animation-delay:${.3 + i * .5}s;padding:16px 0;border-bottom:1px solid #141414">
      <div class="row" style="align-items:baseline"><span style="font-size:16px">${esc(r[0])}</span><span class="mono" style="font-size:13px;color:#aaa;text-align:right">${esc(r[1])}</span></div>
      <div class="track" style="margin-top:12px"><div class="bar" style="width:100%;animation-delay:${.4 + i * .5}s"></div></div></div>`).join('')}</div>
    <div class="fu" style="animation-delay:3.4s;border:1px solid #fff;border-radius:20px;padding:24px 28px;display:flex;flex-direction:column;gap:10px">
      <div class="mono" style="font-size:12px;color:#888">${T('profile')} · ${esc(name).toUpperCase()}</div>
      <div style="font-size:24px">${T('profText')(max, gpu)}</div><div class="small muted">${T('profNote')}</div></div>
    <div class="fu" style="animation-delay:3.7s">${recCard(false)}</div>`;
  if (S.st.sound !== false) Sound.scan();
}

async function appScreen() {
  Sound.stopAll();
  S.local = new Set([...(await P.localModels()), ...(S.st.customModels || []).map(c => c.id)]);
  const info = await P.engineInfo(); S.running = info ? info.id : null; S.slots = info ? info.slots || 1 : 1;
  S.ws = await P.ws.get(); S.partial = await P.partials(); S.chats = await P.chats.list();
  root.innerHTML = `<div class="screen"><nav class="fu" id="nav"></nav>
    <div class="mid"><main id="main"></main>
      </div>
    <aside id="codepanel" class="panel cpanel"><div class="bshell">
      <div class="btabs"><div class="btablist"><button class="ctab on" data-act="ctab" data-v="edit">${T('editor')}</button><button class="ctab" data-act="ctab" data-v="out">${T('output')}</button><span class="mono small muted" id="cfile" style="margin-left:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span></div><button class="ib sm" data-act="cclose" aria-label="close">${ico('x', 14)}</button></div>
      <div id="cedit" class="pbody"><div class="cbar"><button class="cb" data-act="csave">${T('saveFile')} · Ctrl+S</button><button class="cb pri" data-act="crun">${T('run')}</button><button class="cb" data-act="cext">${T('openWin')}</button><span id="cstate" class="mono small muted"></span></div><div id="cm" class="cmhost"></div></div>
      <div id="cout" class="pbody hidden"><div class="dhead"><span style="display:flex;align-items:center;gap:10px">${ico('play', 13)}<span class="mono small muted" id="dtitle"></span><span id="dcode" class="mono small"></span></span>
        <span><button class="ib sm" data-act="drerun" title="${T('run')}">${ico('reload', 14)}</button></span></div><pre id="out"></pre><div class="runbar" id="runbar" style="display:none"><span class="mono small muted">›</span><input id="runin" placeholder="${T('runInputPh')}" autocomplete="off"><button class="ib sm" data-act="runSend" aria-label="send">${ico('fwd', 14)}</button></div></div>
    </div></aside>
    <aside id="panel" class="panel"><div class="bshell">
      <div class="btabs"><div id="btabs" class="btablist"></div><button class="ib sm" data-act="pclose" aria-label="close">${ico('x', 14)}</button></div>
      <div class="bbar"><button class="ib sm" data-act="wvBack" aria-label="back">${ico('back', 15)}</button><button class="ib sm" data-act="wvFwd" aria-label="forward">${ico('fwd', 15)}</button><button class="ib sm" data-act="wvReload" aria-label="reload">${ico('reload', 14)}</button>
        <label class="addrbox">${ico('lock', 13)}<input id="addr" placeholder="${T('addrPh')}"></label><button class="ib sm" data-act="wvExt" title="${T('openExt')}">${ico('ext', 14)}</button></div>
      <div id="bprog" class="bprog"></div><div id="bviews" class="bviews"></div></div></aside></div>`;
  initBrowser(); initEditor();
  S.panel = null;
  S._lastTab = null;
  renderNav(); renderMain();
  P.monitor(S.st.load !== false);
}
function renderNav() {
  const tabs = [['chat', 'tChat'], ['projects', 'tProjects'], ['models', 'tModels'], ['opt', 'tOpt'], ['agents', 'tAgents']];
  const hw = S.st.hw || {}; const [pname] = profile();
  const sp = S.running && S.st.speed && S.st.speed[S.running];
  $('#nav').innerHTML = `<div class="brand"><div class="dot led"></div>PULSAR</div>
    ${tabs.map(t => `<button class="nav ${S.tab === t[0] ? 'on' : ''}" data-act="tab" data-v="${t[0]}">${T(t[1])}</button>`).join('')}
    <div class="hist">${S.chats.length ? `<div class="histh">${T('history')}</div>` : ''}${S.chats.slice(0, 40).map(c => `<div class="hitem ${c.id === S.chatId ? 'on' : ''}" data-act="openChat" data-v="${c.id}"><span>${esc(c.title)}</span><button class="bx" data-act="delChat" data-v="${c.id}" aria-label="delete">${ico('x', 11)}</button></div>`).join('')}</div>
    <div class="hwbox">${T('profileLbl')}: ${esc(pname)}<br><span class="mono" style="color:#ddd">${hw.vramGB ? 'GPU ' + hw.vramGB + ' ' + T('gb') + ' · ' : ''}RAM ${hw.ramGB || '?'} ${T('gb')}</span>
    ${sp ? `<br>${T('speedLbl')}: <span class="mono" style="color:#ddd">${sp} ${T('tps')}</span>` : ''}</div>
    <div class="hwbox" id="temps" style="margin-top:8px;${S.temps && (S.temps.gpu || S.temps.cpu) ? '' : 'display:none'}">${tempsHTML()}</div>
    ${S.update ? `<div class="hwbox upd">${S.update.state === 'ready' ? `${T('updReady')(S.update.version)}<button class="btn sm" style="margin-top:10px;width:100%" data-act="updInstall">${T('updBtn')}</button>` : `${T('updLoading')} ${S.update.percent || 0}%`}</div>` : ''}
    <div class="langsw"><button class="${L() === 'ru' ? 'on' : ''}" data-act="setLang" data-v="ru">RU</button><button class="${L() === 'en' ? 'on' : ''}" data-act="setLang" data-v="en">EN</button></div>`;
}
function renderMain() {
  const m = $('#main'); if (!m) return;
  const same = S._lastTab === S.tab; S._lastTab = S.tab;
  m.classList.toggle('still', same);
  if (!same) { m.classList.remove('swap'); void m.offsetWidth; m.classList.add('swap'); }
  m.style.padding = S.tab === 'chat' ? '48px 56px 28px' : '';
  if (S.tab === 'projects') { m.innerHTML = viewProjects(); loadProjects(); }
  else m.innerHTML = ({ chat: viewChat, models: viewModels, opt: viewOpt, agents: viewAgents, api: viewApi }[S.tab])();
  if (S.tab === 'chat') { const box = $('#msgs'); box.scrollTop = box.scrollHeight; $('#input')?.focus(); }
}

// ---------- models ----------
function modelCard(m, p, i) {
  const fk = p.fit === 2 ? 'fit2' : p.fit === 1 ? 'fit1' : p.fit === 0 ? 'fit0' : 'fitx';
  const d = S.dl[m.id], have = S.local.has(m.id), run = S.running === m.id;
  let actions;
  if (d) actions = `<div class="track"><div id="pg-${m.id}" style="width:${d.total ? (d.got / d.total * 100).toFixed(1) : 0}%"></div></div>
    <div class="row small muted"><span class="mono" id="pt-${m.id}">${dlText(d, m)}</span><button class="btn ghost sm" data-act="cancel" data-v="${m.id}">${T('cancel')}</button></div>`;
  else if (have) actions = `<div class="row"><button class="btn sm" style="flex:1" data-act="run" data-v="${m.id}" ${run ? 'disabled' : ''}>${run ? T('running') : T('use')}</button><button class="btn ghost sm" data-act="del" data-v="${m.id}">${T('del')}</button></div>`;
  else actions = `<button class="btn ghost sm" data-act="dl" data-v="${m.id}">${S.partial[m.id] ? T('resumeDl') + ' · ' + (S.partial[m.id] / 1073741824).toFixed(1) + ' ' + T('gb') : T('download')}</button>`;
  return `<div class="card fu" style="animation-delay:${.1 + i * .04}s;${p.fit < 0 ? 'opacity:.55' : ''}">
    <div class="row"><span class="fit ${fk}">${T(fk)}</span><span class="mono small muted">${m.fresh ? '<span class="newb">' + T('fresh') + '</span>' : ''}≈${m.size} ${T('gb')}</span></div>
    <div style="font-size:21px;font-weight:400">${esc(m.name)}</div>
    <div class="small muted" style="line-height:1.5;min-height:40px;font-size:14px">${esc(m[L()])}</div>
    <div class="mono" style="font-size:12px;color:#aaa;line-height:1.7;border-top:1px solid #1a1a1a;padding-top:12px">${planText(m, p)}</div>${actions}</div>`;
}
function viewModels() {
  const cur = S.mcat || 'all';
  const chips = `<div class="chips fu" style="margin-bottom:28px;animation-delay:.1s"><button class="chip ${cur === 'all' ? 'on' : ''}" data-act="mcat" data-v="all">${T('catAll')}</button>${CATS.map(c => `<button class="chip ${cur === c[0] ? 'on' : ''}" data-act="mcat" data-v="${c[0]}">${T(c[1])}</button>`).join('')}</div>`;
  let k = 0;
  const sections = CATS.filter(c => cur === 'all' || cur === c[0]).map(c => {
    const list = CATALOG.filter(m => m.cat === c[0]).map(m => ({ m, p: plan(m) }))
      .sort((a, b) => ((b.m.fresh ? 1 : 0) - (a.m.fresh ? 1 : 0)) || (b.p.fit - a.p.fit) || (b.m.size - a.m.size));
    return `<div class="sec fu" style="animation-delay:${.12 + k * .02}s">${T(c[1])} <span style="letter-spacing:0;text-transform:none;color:#555">— ${T(c[1] + 'D')}</span></div>
      <div class="grid">${list.map(({ m, p }) => modelCard(m, p, k++)).join('')}</div>`;
  }).join('');
  const mine = (S.st.customModels || []).map(c => allModels().find(m => m.id === c.id)).filter(Boolean);
  const mineSec = `<div class="sec fu" style="animation-delay:.11s">${T('catMine')} <span style="letter-spacing:0;text-transform:none;color:#555">— ${T('catMineD')}</span></div>
    <div class="grid">${mine.map((m, k) => modelCard(m, plan(m), k).replace(/<button class="btn ghost sm" data-act="del" data-v="([^"]+)">/, '<button class="btn ghost sm" data-act="delCustom" data-v="$1">')).join('')}
    <button class="card fu addm" data-act="addModel"><span style="font-size:30px;font-weight:200">+</span><span>${T('addModel')}</span><span class="small muted">${T('addModelD')}</span></button></div>`;
  const banner = !S.local.size ? recCard(true) : '';
  const helpSec = `<div class="sec fu" style="animation-delay:.12s">${T('catHelp')} <span style="letter-spacing:0;text-transform:none;color:#555">— ${T('catHelpD')}</span></div><div class="grid">${DRAFTS.map(helperCard).join('')}</div>`;
  return `<h2 class="fu">${T('tModels')}</h2><p class="sub fu" style="animation-delay:.08s;margin-bottom:20px">${T('modelsSub')}</p>${banner}${chips}${cur === 'all' ? mineSec : ''}${sections}${cur === 'all' ? helpSec : ''}`;
}
function kimiCard() {
  const k = (S.st.apis || []).find(a => a.cloud === 'kimi');
  return `<div class="sec fu" style="animation-delay:.5s">${T('cloudFree')}</div>
  <div class="card fu" style="animation-delay:.55s;max-width:620px;cursor:default">
    <div class="row"><span style="font-size:21px;font-weight:400">Kimi K2.6</span><span class="by">Moonshot AI</span></div>
    <div class="small muted" style="font-size:14px;line-height:1.5">${T('kimiD')}</div>
    ${k ? `<div class="row"><span class="mono small" style="color:#ddd">● ${T('keyOk')}</span><button class="btn ghost sm" data-act="kimiDel">${T('del')}</button></div>`
      : `<div class="small muted">${T('kimiHow')} <button class="cb" data-act="extLink" data-v="https://openrouter.ai/keys">openrouter.ai/keys</button></div>
    <label class="field">${T('apiKey')}<input id="kKey" type="password" class="mono" placeholder="sk-or-…"></label>
    <button class="btn sm" style="align-self:flex-start" data-act="kimiSave">${T('apiAdd')}</button>`}</div>`;
}
function recommend() {
  const order = ['qwen35-9b', 'gemma4-e4b', 'qwen25-coder-7b', 'llama32-3b', 'qwen25-3b'];
  const list = order.map(id => allModels().find(m => m.id === id)).filter(Boolean).map(m => ({ m, p: plan(m) }));
  return (list.find(x => x.p.fit === 2) || list.find(x => x.p.fit === 1) || list[list.length - 1]).m;
}
function recCard(compact) {
  const m = recommend();
  return `<div class="card fu rec" style="cursor:default;${compact ? 'margin-bottom:28px' : ''}">
    <div class="mono" style="font-size:12px;color:#888">${T('recFor')}</div>
    <div class="row" style="flex-wrap:wrap"><span style="font-size:26px;font-weight:300">${esc(m.name)}</span><span class="mono small muted">≈${m.size} ${T('gb')}</span></div>
    <div class="small muted" style="font-size:14px;line-height:1.5">${esc(m[L()])}</div>
    ${S.dl[m.id] ? `<div class="track"><div id="pg-${m.id}" style="width:${S.dl[m.id].total ? (S.dl[m.id].got / S.dl[m.id].total * 100).toFixed(1) : 0}%"></div></div><div class="mono small muted" id="pt-${m.id}">${dlText(S.dl[m.id], m)}</div>`
      : `<div class="row" style="justify-content:flex-start;gap:10px"><button class="btn sm" data-act="recDl" data-v="${m.id}">${T('recBtn')}</button>${compact ? '' : `<button class="btn ghost sm" data-act="toApp">${T('later')}</button>`}</div>`}</div>`;
}
async function downloadModel(id) {
  const m = findM(id); const helper = id.startsWith('draft-');
  if (!helper && plan(m).fit <= 0 && !confirm(T('warnHeavy'))) return;
  S.dl[id] = { got: 0, total: m.size * 1073741824 }; Sound.tick(1400); renderMain();
  const r = await P.download({ id, repos: m.repos, quant: m.quant || 'Q4_K_M' });
  delete S.dl[id]; S.partial = await P.partials();
  if (r.ok) { S.local.add(id); delete S.partial[id]; Sound.done(); if (S.autoRun === id) { S.autoRun = null; runModel(id); return; } } else if (r.error && !/abort/i.test(r.error)) toast(T('dlError') + ': ' + r.error);
  if (S.tab === 'models') renderMain();
}
function dlText(d, m) { return `${(d.got / 1073741824).toFixed(2)} / ${(d.total / 1073741824 || m.size).toFixed(2)} ${T('gb')} · ${d.total ? Math.floor(d.got / d.total * 100) : 0}%`; }
P.onProgress(({ id, got, total }) => {
  if (!S.dl[id]) return; S.dl[id] = { got, total: total || S.dl[id].total };
  if (S.tab !== 'models') return;
  const bar = document.getElementById('pg-' + id), txt = document.getElementById('pt-' + id);
  if (bar) bar.style.width = (S.dl[id].total ? S.dl[id].got / S.dl[id].total * 100 : 0).toFixed(1) + '%';
  if (txt) txt.textContent = dlText(S.dl[id], findM(id));
});
// sees the model name and downloads the matching accelerator by itself; restarts the model with it when idle
async function autoDraft(id, dr) {
  toast(T('draftAuto').replace('{d}', findM(dr).name).replace('{m}', findM(id).name));
  await downloadModel(dr);
  if (S.local.has(dr) && S.running === id && !S.streaming && !S.busy) startModel(id);
}
async function runModel(id) { S.tab = 'chat'; renderNav(); renderMain(); return startModel(id); }
async function startModel(id) {
  const m = allModels().find(x => x.id === id); const p = plan(m);
  S.running = null; S.engine = { stage: 'load' };
  if (S.tab === 'chat') { const el = $('#estatus'); if (el) el.innerHTML = engineText(); }
  const dd = draftOn(m), dr = dd && dd.id, canDraft = !!dr && p.draftRoom, useDraft = canDraft && S.local.has(dr);
  if (canDraft && !S.local.has(dr) && !S.dl[dr]) autoDraft(id, dr);
  const r = await P.start({ id, path: m.path, ngl: p.ngl, ctx: p.ctx, threads: p.threads, gpu: p.ngl > 0, layers: m.layers, slots: p.slots, cpuMoe: p.cpuMoe, draft: useDraft ? dr : null });
  if (!r.ok) { S.engine = { stage: 'error', error: r.error }; toast(T('eError') + ': ' + (r.error || '').slice(0, 300)); if (S.tab === 'chat') { const el = $('#estatus'); if (el) el.innerHTML = engineText(); } return false; }
  S.running = id; S.slots = r.slots || 1; S.engine = { stage: 'ready', kind: r.kind }; S.spec = !!r.spec; if (!S.sel || S.sel === 'local') S.sel = 'local';
  renderNav(); if (S.tab === 'chat') { const el = $('#estatus'); if (el) el.innerHTML = ''; const mp = $('#mpill'); if (mp) mp.textContent = m.name; } else renderMain();
  Sound.done();
  const sk = id + (r.spec ? '+spec' : '');
  if (!(S.st.speed && S.st.speed[sk])) measureSpeed(id, r.spec); else showSpeed();
  return true;
}
// auto model choice: picks the best downloaded model for the task
function taskKind(t) {
  if (BUILD_RE.test(t) || /(код|python|питон|html|css|javascript|\bjs\b|функци|ошибк|баг|скрипт|программ|сайт|верстк|code|bug|function|script)/i.test(t)) return 'code';
  if (/(реши|задач|докажи|вычисли|посчитай|логик|уравнен|сколько будет|math|solve|prove|calculate)/i.test(t)) return 'reason';
  return 'general';
}
function pickModel(kind) {
  const c = allModels().filter(m => S.local.has(m.id)).map(m => ({ m, p: plan(m) })).filter(x => x.p.fit >= 0);
  if (!c.length) return null;
  const score = x => (x.m.tags.includes(kind) ? 100 : x.m.tags.includes('general') ? 20 : 0) + x.p.fit * 10 + Math.min(x.p.speed, 60) / 6 + x.m.size;
  return c.sort((a, b) => score(b) - score(a))[0].m;
}
function speedText() {
  if (!S.running) return '';
  const sp = S.st.speed || {}, base = sp[S.running], fast = sp[S.running + '+spec'];
  if (S.spec) return fast ? `${fast} ${T('tps')} · ${T('withBoost')}${base ? ` · ${T('noBoost')} ${base}` : ''}` : T('withBoost');
  return base ? `${base} ${T('tps')}` : '';
}
function showSpeed() { const el = $('#spill'); if (el) { el.textContent = speedText(); el.style.display = el.textContent ? '' : 'none'; } }
async function measureSpeed(id, spec) {
  try {
    const r = await fetch('http://127.0.0.1:18089/completion', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Write a short paragraph about the sea.', n_predict: 64, cache_prompt: false }) });
    const j = await r.json(); const tps = Math.round(j.timings && j.timings.predicted_per_second || 0);
    if (tps) { await save({ speed: { ...(S.st.speed || {}), [id + (spec ? '+spec' : '')]: tps } }); toast(`${T('speedMeasured')}: ${speedText() || tps + ' ' + T('tps')}`); showSpeed(); renderNav(); if (S.tab === 'models') renderMain(); }
  } catch {}
}
P.onEngine(e => {
  if (e.stage === 'stopped') { S.running = null; S.engine = null; renderNav(); }
  else if (e.stage !== 'ready') S.engine = e;
  if (S.tab === 'chat') { const el = $('#estatus'); if (el) el.innerHTML = engineText(); }
});
function engineText() {
  const e = S.engine; if (!e) return '';
  const pct = e.total ? ' ' + Math.round(e.got / e.total * 100) + '%' : '';
  const map = { download: T('eDownload') + pct, unpack: T('eUnpack'), load: T('eLoad'), ready: T('eReady') + (e.kind ? ' · ' + e.kind.toUpperCase() : ''), error: T('eError') };
  return `<span class="pill"><span class="dot ${e.stage === 'ready' ? '' : 'led'}"></span>${map[e.stage] || ''}</span>`;
}

// ---------- optimization tab ----------
function viewOpt() {
  const o = S.st.opt || {};
  const ctxv = o.ctx && o.ctx !== 'auto' ? (+o.ctx / 1024) + 'K' : T('auto');
  const rows = [
    ['auto', T('oAuto'), T('oAutoD'), o.auto !== false ? T('on') : T('off')],
    ['layers', T('oLayers'), T('oLayersD'), o.layers === 'half' ? T('half') : T('max')],
    ['ctx', T('oCtx'), T('oCtxD'), ctxv],
    ['threads', T('oThreads'), T('oThreadsD'), o.threads === 'all' ? `${S.st.hw?.threads || '?'}` : `${T('auto')} · ${S.st.hw?.cores || '?'}`],
    ['load', T('oLoad'), T('oLoadD'), S.st.load !== false ? T('on') : T('off')],
    ['heat', T('oHeat'), T('oHeatD'), S.st.heat !== false ? `${T('on')} · ${S.st.heatLimit || 80}°` : T('off')],
    ['engine', T('oEngine'), T('oEngineD'), S.st.engine === 'cpu' ? 'CPU' : 'Vulkan'],
    ['sound', T('oSound'), T('oSoundD'), S.st.sound !== false ? T('on') : T('off')],
    ['theme', T('oTheme'), T('oThemeD'), S.st.theme === 'light' ? T('light') : T('dark')],
    ['tray', T('oTray'), T('oTrayD'), S.st.tray !== false ? T('on') : T('off')],
    ['memory', T('oMemory'), T('oMemoryD'), (S.st.memory || []).length ? `${(S.st.memory || []).length} · ${T('clear')}` : '—'],
    ['spec', T('oSpec'), T('oSpecD'), S.st.spec !== false ? T('on') : T('off')],
    ['trusted', T('oTrusted'), T('oTrustedD'), (S.st.trustedHosts || []).length ? `${(S.st.trustedHosts || []).length} · ${T('clear')}` : '—'],
    ['lang', T('oLang'), '', L() === 'ru' ? 'Русский' : 'English']
  ];
  return `<h2 class="fu">${T('tOpt')}</h2><p class="sub fu" style="animation-delay:.08s">${T('optSub')}</p>
  <div style="max-width:660px;display:flex;flex-direction:column;gap:12px">
  ${rows.map((r, i) => `<button class="card fu" data-act="opt" data-v="${r[0]}" style="animation-delay:${.12 + i * .05}s;flex-direction:row;justify-content:space-between;align-items:center;padding:18px 22px;border-radius:16px">
    <span style="display:flex;flex-direction:column;gap:4px"><span style="font-size:17px;font-weight:400">${r[1]}</span>${r[2] ? `<span class="small muted">${r[2]}</span>` : ''}</span>
    <span class="mono small" style="white-space:nowrap">${r[3]}</span></button>`).join('')}
  <div class="fu" style="animation-delay:.6s;display:flex;gap:12px;margin-top:12px"><button class="btn ghost sm" data-act="rescan">${T('rescan')}</button><button class="btn ghost sm" data-act="folder">${T('openFolder')}</button><button class="btn ghost sm" data-act="report">${T('reportBtn')}</button></div></div>`;
}
async function toggleOpt(k) {
  const o = { ...(S.st.opt || {}) };
  if (k === 'auto') o.auto = o.auto === false;
  if (k === 'layers') o.layers = o.layers === 'half' ? 'max' : 'half';
  if (k === 'ctx') { const seq = ['auto', '4096', '8192', '16384']; o.ctx = seq[(seq.indexOf(o.ctx || 'auto') + 1) % seq.length]; }
  if (k === 'threads') o.threads = o.threads === 'all' ? 'auto' : 'all';
  if (k === 'load') { await save({ load: S.st.load === false }); P.monitor(S.st.load !== false); }
  if (k === 'engine') await save({ engine: S.st.engine === 'cpu' ? 'vulkan' : 'cpu' });
  if (k === 'sound') await save({ sound: S.st.sound === false });
  if (k === 'theme') { await save({ theme: S.st.theme === 'light' ? 'dark' : 'light' }); applyTheme(); }
  if (k === 'tray') await save({ tray: S.st.tray === false });
  if (k === 'trusted') await save({ trustedHosts: [] });
  if (k === 'memory') await save({ memory: [] });
  if (k === 'spec') await save({ spec: S.st.spec === false });
  if (k === 'heat') { const seq = [[true, 80], [true, 75], [true, 85], [false, 80]]; const i = seq.findIndex(x => x[0] === (S.st.heat !== false) && x[1] === (S.st.heatLimit || 80)); const n = seq[(i + 1) % seq.length]; await save({ heat: n[0], heatLimit: n[1] }); }
  if (k === 'lang') { await save({ lang: L() === 'ru' ? 'en' : 'ru' }); renderNav(); }
  await save({ opt: o }); Sound.tick(1500); renderMain();
}

// ---------- agents ----------
const ourAgents = () => AGENTS[L()];
function viewAgents() {
  const cur = S.st.agent || 'coder';
  return `<h2 class="fu">${T('tAgents')}</h2><p class="sub fu" style="animation-delay:.08s">${T('agentsSub')}</p>
  <div class="sec fu" style="animation-delay:.1s">${T('secOurs')}</div>
  <button class="card fu ${S.st.autoAgent !== false ? 'on' : ''}" data-act="autoAgentCard" style="width:100%;margin-bottom:16px;animation-delay:.12s">
    <span class="row"><span style="font-size:22px;font-weight:400">${T('autoModel')}</span><span class="tgl ${S.st.autoAgent !== false ? 'on' : ''}" style="pointer-events:none"><span class="knob"></span>${S.st.autoAgent !== false ? T('on') : T('off')}</span></span>
    <span class="muted" style="font-size:14px;line-height:1.5">${T('autoAgentD')}</span></button>
  <div class="grid">${ourAgents().map((a, i) => `<button class="card fu ${cur === a[0] ? 'on' : ''}" data-act="agent" data-v="${a[0]}" style="animation-delay:${.16 + i * .05}s">
    <span class="row"><span style="font-size:20px;font-weight:400">${a[1]}</span><span class="by">${T('byPulsar')}</span></span>
    <span class="muted" style="font-size:14px;line-height:1.5">${a[2]}</span>
    <span class="mono" style="font-size:12px">${cur === a[0] ? '● ' + T('chosen') : '○'}</span></button>`).join('')}</div>`;
}

// ---------- custom APIs ----------
function viewApi() {
  const apis = S.st.apis || [];
  return `<h2 class="fu">${T('tApi')}</h2><p class="sub fu" style="animation-delay:.08s">${T('apiSub')}</p>
  <div class="fu" style="animation-delay:.15s;max-width:560px;display:flex;flex-direction:column;gap:16px">
    <label class="field">${T('apiName')}<input id="aName" placeholder="Groq"></label>
    <label class="field">${T('apiUrl')}<input id="aUrl" class="mono" placeholder="https://api.groq.com/openai/v1"></label>
    <label class="field">${T('apiKey')}<input id="aKey" type="password" class="mono" placeholder="sk-…"></label>
    <label class="field">${T('apiModel')}<input id="aModel" class="mono" placeholder="llama-3.3-70b-versatile"></label>
    <button class="btn" style="align-self:flex-start" data-act="apiAdd">${T('apiAdd')}</button>
    ${apis.length ? `<div style="margin-top:20px" class="small muted">${T('apiList')}</div>${apis.map((a, i) => `<div class="row card" style="flex-direction:row;padding:16px 20px"><span>${esc(a.name)} <span class="mono small muted">${esc(a.model)}</span></span><button class="btn ghost sm" data-act="apiDel" data-v="${i}">${T('del')}</button></div>`).join('')}` : ''}
    <label class="field" style="margin-top:28px">${T('searchKey')}<input id="sKey" type="password" class="mono" value="${esc(S.st.searchKey || '')}"></label>
    <button class="btn ghost sm" style="align-self:flex-start" data-act="sKey">${T('save')}</button>
  </div>`;
}

// ---------- projects ----------
async function loadProjects() {
  let list = []; try { list = await P.ws.list('.'); } catch (e) {}
  const found = [...new Set(list.filter(f => /^[^/]+\/index\.html$/i.test(f)).map(f => f.split('/')[0]))];
  const known = S.st.projects || [];
  const all = [...known.filter(p => found.includes(p.dir)), ...found.filter(d => !known.find(p => p.dir === d)).map(d => ({ dir: d, title: d, files: [d + '/index.html'], updated: 0 }))];
  S.projects = all.sort((a, b) => (b.updated || 0) - (a.updated || 0));
  const box = document.getElementById('projlist'); if (!box || S.tab !== 'projects') return;
  box.innerHTML = S.projects.length ? S.projects.map((p, i) => `<div class="card fu" style="animation-delay:${.08 + i * .04}s;cursor:default">
      <div class="row"><span style="font-size:20px;font-weight:400">${esc(p.title || p.dir)}</span><span class="mono small muted">${p.updated ? new Date(p.updated).toLocaleDateString() : ''}</span></div>
      <div class="mono small muted">${esc(p.dir)}/ · ${p.files.length} ${T('filesN')}</div>
      <div class="row" style="justify-content:flex-start;gap:6px;flex-wrap:wrap"><button class="cb pri" data-act="projOpen" data-v="${esc(p.files[0])}">${T('open')}</button><button class="cb" data-act="projEdit" data-v="${esc(p.files[0])}">${T('editor')}</button><button class="cb" data-act="projGo" data-v="${esc(p.dir)}">${T('projContinue')}</button><button class="cb" data-act="projFolder" data-v="${esc(p.dir)}">${T('folder')}</button></div></div>`).join('')
    : `<div class="muted fu">${T('projEmpty')}</div>`;
}
function viewProjects() {
  return `<h2 class="fu">${T('tProjects')}</h2><p class="sub fu" style="animation-delay:.08s">${T('projSub')}</p><div class="grid" id="projlist"></div>`;
}
async function rememberProject(dir, files, title) {
  const list = (S.st.projects || []).filter(p => p.dir !== dir);
  list.unshift({ dir, files, title: title || dir, updated: Date.now() });
  await save({ projects: list.slice(0, 200) });
}

// ---------- chat ----------
function sources() {
  const out = [];
  if (S.running) { const m = allModels().find(x => x.id === S.running); out.push(['local', m ? m.name : S.running]); }
  return out;
}
const ICON = {
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  power: '<path d="M12 3v8"/><path d="M6.3 6.8a8 8 0 1 0 11.4 0"/>',
  back: '<path d="M15 18l-6-6 6-6"/>', fwd: '<path d="M9 18l6-6-6-6"/>',
  reload: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  ext: '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  play: '<path d="M7 5v14l12-7z"/>'
};
const ico = (n, s) => `<svg width="${s || 16}" height="${s || 16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

let codeSeq = 0;
const CODES = {};
const RUNNABLE = { python: 'py', py: 'py', javascript: 'js', js: 'js', node: 'js', html: 'html' };
function permCard(p) {
  const site = p.type === 'site';
  const host = site ? p.host : '';
  const icon = site ? ico('globe', 18) : ico('folder', 18);
  const who = p.agent ? `<span class="perm-who">${esc(p.agent)}</span>` : '';
  const title = site ? (p.label || T('permSiteT')) : T('permSaveT')(p.files.length);
  const body = site
    ? `<div class="perm-host"><span class="perm-av">${esc((host.replace(/^www\./, '')[0] || '?').toUpperCase())}</span><span class="mono">${esc(host)}</span></div><div class="perm-d">${T('permSiteD')}</div>`
    : `<div class="perm-files">${p.files.map(f => `<div class="perm-file">${ico('folder', 13)}<span class="mono">${esc(f)}</span></div>`).join('')}</div><div class="perm-d">${T('permSaveD')}</div>`;
  const btns = site
    ? `<button class="pbtn pri" data-act="allow" data-v="${p.id}">${T('allow')}</button><button class="pbtn" data-act="allowSite" data-v="${p.id}" data-h="${esc(host)}">${T('alwaysFor')(host)}</button><button class="pbtn ghost" data-act="deny" data-v="${p.id}">${T('deny')}</button>`
    : `<button class="pbtn pri" data-act="allow" data-v="${p.id}">${T('saveFile')}</button><button class="pbtn ghost" data-act="deny" data-v="${p.id}">${T('deny')}</button>`;
  return `<div class="perm"><div class="perm-ic">${icon}</div><div class="perm-main">${who}<div class="perm-t">${esc(title)}</div>${body}
    <div class="perm-btns">${btns}</div>${site ? `<button class="perm-link" data-act="allowAll" data-v="${p.id}">${T('allowAllReq')}</button>` : ''}</div></div>`;
}
function actLine(kind, arg, a) {
  const label = { file: T('aFile'), run: T('aRun'), read: T('aRead'), list: T('aList'), mkdir: T('aMkdir'), move: T('aMove'), open: T('aOpen'), search: T('aSearch'), click: T('aClick'), type: T('aType'), scroll: T('aScroll'), back: T('aBack') }[kind];
  let right = '';
  if (a) {
    const sm = { wait: T('sWait'), ask: T('sAsk'), work: T('sWork'), done: T('sDone'), denied: T('sDenied'), error: T('sError') };
    if (a.state === 'ask' && a.site) return permCard({ type: 'site', id: a.id, host: a.site, label: kind === 'search' ? T('askSearch') : T('permSiteT'), agent: S.curAgentName });
    if (a.state === 'ask') right = `<span><button class="cb pri" data-act="allow" data-v="${a.id}">${T('allow')}</button><button class="cb" data-act="deny" data-v="${a.id}">${T('deny')}</button></span>`;
    else if (a.state === 'done' && kind === 'file') right = `<span><button class="cb" data-act="fopen" data-v="${esc(arg)}">${T('open')}</button>${/\.(py|js|html?)$/i.test(arg) ? `<button class="cb pri" data-act="frun" data-v="${esc(arg)}">${T('run')}</button>` : ''}</span>`;
    else right = `<span class="st ${a.state === 'done' ? 'ok' : a.state === 'error' ? 'err' : ''}">${a.state === 'work' ? '<span class="shimmer">' + sm.work + '</span>' : sm[a.state] + (a.err ? ': ' + esc(a.err).slice(0, 80) : '')}</span>`;
  }
  const out = a && a.out != null ? `<details class="aout"><summary>${T('output')}</summary><pre>${esc(a.out)}</pre></details>` : '';
  return `<div class="act"><div class="row" style="gap:12px"><span>${label} · <span class="mono">${esc(arg)}</span></span>${right}</div>${out}</div>`;
}
function md(s, ctx) {
  let h = esc(s);
  h = h.replace(/&lt;think&gt;([\s\S]*?)(&lt;\/think&gt;|$)/g, '<div class="think">$1</div>');
  h = h.replace(/```([^\n`]*)\n?([\s\S]*?)(```|$)/g, (_, lang, code, end) => {
    lang = lang.trim(); code = code.replace(/\n$/, '');
    const m = lang.match(/^(file|run|read|list|mkdir|move|open|search|click|type|scroll|back):(.*)$/);
    if (m) {
      const a = ctx && ctx.acts && (!ctx.only || ctx.only.includes(m[1])) ? ctx.acts[ctx.k++] : null;
      if (m[1] !== 'file') return actLine(m[1], m[2].trim(), a);
      return `<div class="codebox">${actLine('file', m[2].trim(), a).replace('class="act"', 'class="act flat"')}<pre><code>${code}</code></pre></div>`;
    }
    const n = ++codeSeq; CODES[n] = { lang, code: unesc(code) };
    const runnable = end && RUNNABLE[lang.toLowerCase()];
    return `<div class="codebox"><div class="codehead"><span>${esc(lang || 'code')}</span><span><button class="cb" data-act="copy" data-v="${n}">${T('copy')}</button>${end ? `<button class="cb" data-act="saveAs" data-v="${n}">${T('saveFile')}</button>` : ''}${runnable ? `<button class="cb pri" data-act="runCode" data-v="${n}">${T('run')}</button>` : ''}</span></div><pre><code>${code}</code></pre></div>`;
  });
  h = h.replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g, '<b style="font-weight:500">$1</b>');
  return h;
}
function unesc(s) { return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'); }
function liveStatus(c) {
  if (!c) return T('stThinking');
  if ((c.match(/<think>/g) || []).length > (c.match(/<\/think>/g) || []).length) return T('stThinking');
  if ((c.match(/```/g) || []).length % 2) {
    const lang = c.slice(c.lastIndexOf('```') + 3).split('\n')[0].trim();
    if (lang.startsWith('file:')) return T('stFile') + ' ' + lang.slice(5);
    if (/^(run|read|list|mkdir|move|open|search|click|type|scroll|back):/.test(lang)) return T('stAction');
    return T('stCode');
  }
  return T('stWriting');
}
const statusHTML = txt => `<div class="status"><span class="dot led"></span><span class="shimmer">${esc(txt)}</span></div>`;

function viewChat() {
  const src = sources();
  if (!S.sel || !src.find(s => s[0] === S.sel)) S.sel = src[0] ? src[0][0] : null;
  const cur = S.st.agent || 'coder';
  const opts = `${ourAgents().map(a => `<option value="${a[0]}" ${cur === a[0] ? 'selected' : ''}>${a[1]}</option>`).join('')}`;
  const auto = S.st.autoAgent !== false;
  const srcSel = src.length < 2 ? '' : `<select class="pick" data-act="sel">${src.map(s => `<option value="${s[0]}" ${S.sel === s[0] ? 'selected' : ''}>${esc(s[1])}</option>`).join('')}</select>`;
  const head = `<div class="row fu" style="margin-bottom:12px;gap:8px">
    <div class="chips"><button class="tgl ${auto ? 'on' : ''}" data-act="autoAgent" title="${T('autoAgentD')}"><span class="knob"></span>${T('autoModel')}</button>
      ${auto ? `<span class="pill" id="apill">${esc(S.lastAgent || T('autoAgentPick'))}</span>` : `<select class="pick" data-act="agentSel">${opts}</select>`}${srcSel}<span class="pill mono" id="spill" style="${speedText() ? '' : 'display:none'}">${esc(speedText())}</span><span id="estatus">${S.engine && S.engine.stage !== 'ready' ? engineText() : ''}</span></div>
    <div class="chips">
      <button class="ibtn" data-act="wsOpen" title="${T('folder')}: ${esc(S.ws || '')}">${ico('folder')}</button>
      <button class="ibtn ${S.panel ? 'on' : ''}" data-act="panel" title="${T('browser')}">${ico('globe')}</button>
      <button class="ibtn" data-act="newChat" title="${T('newChat')}">${ico('plus')}</button>
      <button class="ibtn" data-act="endChat" title="${T('endChat')}">${ico('power')}</button></div></div>`;
  const empty = `<div id="empty" style="flex:1;display:flex;align-items:center;justify-content:center">
    <div class="fu" style="position:relative;width:120px;height:120px"><div class="ring"></div><div class="ring" style="animation-delay:1.06s"></div><div class="ring" style="animation-delay:2.13s"></div>
    <div class="led" style="position:absolute;top:50%;left:50%;width:6px;height:6px;margin:-3px;border-radius:3px;background:#fff"></div></div></div>`;
  return `<div class="chat">${head}<div class="msgs" id="msgs">${S.msgs.length ? S.msgs.map(msgHTML).join('') : empty}</div>
    <div class="attachrow" id="attachrow"></div>
    <div class="composer fu" style="animation-delay:.15s"><button class="ib attachb" data-act="attach" title="${T('attachT')}" aria-label="attach"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5 12.5 20a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6l7.8-7.8"/></svg></button><textarea id="input" rows="1" placeholder="${src.length ? T('placeholder') : T('chatNoModel')}"></textarea>
    <button class="send" data-act="${S.streaming ? 'stop' : 'send'}" aria-label="send">${sendIcon()}</button></div></div>`;
}
const sendIcon = () => S.streaming ? '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect width="14" height="14" rx="3" fill="currentColor"/></svg>'
  : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
const STAGES = { accept: 'stAccept', analyze: 'stAnalyze', plan: 'stPlan', code: 'stBuild', review: 'stReview', save: 'stSave' };
function agentCounts(parts, onlyWork) {
  const c = {};
  for (const p of parts) { if (onlyWork && p.status !== 'work') continue; const n = p.name.replace(/ #\d+$/, ''); c[n] = (c[n] || 0) + 1; }
  return Object.entries(c).map(([n, k]) => k > 1 ? `${n} ×${k}` : n);
}
function chainHTML(m) {
  const ch = m.chain; const cur = ch.stages.findIndex(s => s.state === 'work');
  const steps = ch.stages.map((s, i) => `<span class="cstep ${s.state}">${s.state === 'work' ? '<span class="shimmer">' + T(STAGES[s.id]) + '</span>' : T(STAGES[s.id])}</span>${i < ch.stages.length - 1 ? '<span class="cline ' + (s.state === 'done' ? 'done' : '') + '"></span>' : ''}`).join('');
  return `<div class="chain"><div class="csteps">${steps}</div><div class="cnow"><span class="dot led ${ch.stages.some(s => s.state === 'work') ? '' : 'off'}"></span><span class="cnt">${chainNow(m)}</span></div></div>`;
}
function chainNow(m) {
  const ch = m.chain; const cur = ch.stages.findIndex(s => s.state === 'work');
  let line;
  if (cur >= 0) {
    const working = agentCounts(m.parts, true);
    const total = m.parts.filter(p => p.status === 'work').length;
    line = ch.cooling ? `<span class="shimmer">${T('cooling')}</span>`
      : `<span>${working.length ? (total > 1 ? T('agentsN')(total) + ' · ' : T('agent1') + ' · ') + working.join(', ') : T('stAccept')}</span>`;
  } else line = `<span class="muted">${T('agentsUsed')(m.parts.length)} · ${agentCounts(m.parts).join(' → ')}</span>`;
  return line;
}
const chainRest = m => (m.content ? `<div style="margin-top:14px">${md(m.content)}</div>` : '') + (m.extra || []).map(a => actLine(a.kind, a.arg, a)).join('') + askHTML(m.ask);
function msgInner(m) {
  if (m.chain) return chainHTML(m) + `<div class="mrest">${chainRest(m)}</div>`;
  const extra = (m.extra || []).map(a => actLine(a.kind, a.arg, a)).join('');
  const ctx = { acts: m.actions, k: 0, only: m.parts ? ['file', 'run'] : null };
  if (!m.parts) return (m.agent ? `<div class="alabel">${esc(m.agent)}</div>` : '') + (m.content ? md(stripMem(m.content), ctx) : '') + (m.memNote ? `<div class="memnote">${ico('check', 12)}<span>${esc(m.memNote)}</span></div>` : '') + extra + askHTML(m.ask) + (m.live ? statusHTML(m.status || liveStatus(m.content)) : '');
  const st = { wait: T('waiting'), work: T('working'), done: T('done') };
  const head = m.stage === 'plan' ? statusHTML(T('planning')) : '';
  const steps = m.parts.map(p => `<div class="step"><div class="row"><span style="font-size:15px;font-weight:400">${p.status === 'work' ? '<span class="dot led" style="display:inline-block;margin-right:8px"></span>' : ''}${esc(p.name)}</span>
    <span class="mono small muted">${p.status === 'work' ? '<span class="shimmer">' + liveStatus(p.content) + '</span>' : st[p.status]}</span></div><div class="small muted" style="margin-top:4px">${esc(p.task)}</div>
    ${p.content ? `<details ${p.status === 'work' ? 'open' : ''}><summary>···</summary><div class="body">${md(p.content, ctx)}</div></details>` : ''}</div>`).join('');
  const fin = m.stage === 'merge' && !m.content ? statusHTML(T('merging')) : m.content ? `<div style="margin-top:14px">${md(m.content)}</div>` : '';
  return head + steps + fin + extra + askHTML(m.ask);
}
function msgHTML(m, i) {
  if (m.role === 'user') return `<div class="msg me">${esc(m.shown != null ? m.shown : m.content)}${(m.files || []).length ? `<div class="mfiles">${m.files.map(f => `<span class="achip">${esc(f.name)}</span>`).join('')}</div>` : ''}</div>`;
  if (m.role === 'tool') return `<div class="msg" data-i="${i}" style="display:none"></div>`;
  if (m.stopped) return `<div class="msg stopped" data-i="${i}">${T('stopped')}</div>`;
  return `<div class="msg" data-i="${i}">${msgInner(m)}</div>`;
}
function addMsg(i) {
  const box = $('#msgs'); if (!box) return;
  $('#empty')?.remove();
  box.insertAdjacentHTML('beforeend', msgHTML(S.msgs[i], i));
  box.scrollTop = box.scrollHeight;
}
// repaint at most once per frame; only the parts that really changed are touched,
// so step animations and shimmers do not restart on every token
const paintQ = new Set(); let paintRaf = 0, paintCost = 0, paintNext = 0;
function paint(i) { paintQ.add(i); if (!paintRaf) paintRaf = requestAnimationFrame(flushPaint); }
function flushPaint(now) {
  paintRaf = 0; const box = $('#msgs'); if (!box) { paintQ.clear(); return; }
  if (now < paintNext) { paintRaf = requestAnimationFrame(flushPaint); return; }
  const t0 = performance.now();
  const stick = box.scrollHeight - box.scrollTop - box.clientHeight < 220;
  for (const i of paintQ) paintNow(i); paintQ.clear();
  if (stick) box.scrollTop = box.scrollHeight;
  paintCost = paintCost * 0.7 + (performance.now() - t0) * 0.3;
  paintNext = now + Math.min(250, paintCost * 3);
}
function setHTML(el, html) { if (el._h !== html) { el.innerHTML = html; el._h = html; } }
function patchChain(el, m) {
  const steps = el.querySelectorAll('.cstep'), lines = el.querySelectorAll('.cline');
  if (steps.length !== m.chain.stages.length) return false;
  m.chain.stages.forEach((s, k) => {
    const st = steps[k], cls = 'cstep ' + s.state;
    if (st.className !== cls) { st.className = cls; st.innerHTML = s.state === 'work' ? '<span class="shimmer">' + T(STAGES[s.id]) + '</span>' : T(STAGES[s.id]); }
    if (lines[k]) { const lc = 'cline' + (s.state === 'done' ? ' done' : ''); if (lines[k].className !== lc) lines[k].className = lc; }
  });
  const dot = el.querySelector('.cnow > .dot'); if (dot) dot.classList.toggle('off', !m.chain.stages.some(s => s.state === 'work'));
  const cnt = el.querySelector('.cnow > .cnt'); if (!cnt) return false; setHTML(cnt, chainNow(m));
  return true;
}
function paintNow(i) {
  const m = S.msgs[i]; if (!m || m.role === 'tool' || m.stopped) return;
  const el = root.querySelector(`.msg[data-i="${i}"]`); if (!el) return;
  if (m.chain) {
    const ch = el.querySelector(':scope > .chain'), rest = el.querySelector(':scope > .mrest');
    if (ch && rest && patchChain(ch, m)) { setHTML(rest, chainRest(m)); return; }
  }
  setHTML(el, msgInner(m));
}
function setSendBtn() { const b = root.querySelector('.send'); if (!b) return; b.dataset.act = S.streaming ? 'stop' : 'send'; b.innerHTML = sendIcon(); }

// --- model transport (through main process) ---
function target() {
  return { base: 'http://127.0.0.1:18089/v1', key: '', model: 'local' };
}
const live = {};
P.onChunk(({ id, data }) => live[id] && live[id].chunk(data));
P.onChatEnd(({ id, error }) => live[id] && live[id].end(error));
let reqSeq = 0;
function stream(messages, signal, onDelta, extra, meta) {
  const t = target(); const id = 'r' + (++reqSeq);
  return new Promise((resolve, reject) => {
    let buf = '', all = '', thinking = false;
    const emit = c => { all += c; onDelta && onDelta(c); };
    const stop = () => P.chatAbort(id);
    if (signal) { if (signal.aborted) return reject(new DOMException('aborted', 'AbortError')); signal.addEventListener('abort', stop, { once: true }); }
    live[id] = {
      chunk(d) {
        buf += d; const lines = buf.split('\n'); buf = lines.pop();
        for (const ln of lines) {
          const s = ln.trim(); if (!s.startsWith('data:')) continue;
          const x = s.slice(5).trim(); if (x === '[DONE]') continue;
          try {
            const ch = JSON.parse(x).choices?.[0]; const r = ch?.delta?.reasoning_content || ''; const c = ch?.delta?.content || '';
            if (ch?.finish_reason) { S.lastFinish = ch.finish_reason; if (meta) meta.finish = ch.finish_reason; }
            if (r) { if (!thinking) { thinking = true; emit('<think>'); } emit(r); }
            if (c) { if (thinking) { thinking = false; emit('</think>'); } emit(c); }
          } catch {}
        }
      },
      end(err) {
        delete live[id]; if (signal) signal.removeEventListener('abort', stop);
        if (thinking) { thinking = false; emit('</think>'); }
        if (err) reject(err === 'aborted' ? new DOMException('aborted', 'AbortError') : new Error(err)); else resolve(all);
      }
    };
    S.lastFinish = null;
    P.chat(id, t.base + '/chat/completions', t.key, { model: t.model, stream: true, messages, temperature: 0.4, ...(extra || {}) });
  });
}
const noThink = s => s.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trim();
const REFUSAL = /(не (имею|могу|умею)[^.\n]{0,80}(доступ|сохран|открыва|браузер|файл|компьютер|пк|интернет))|(у меня нет[^.\n]{0,40}(доступ|браузер))|(я (всего лишь|лишь|только)? ?текстов)|(I (can't|cannot|don't|do not)[^.\n]{0,80}(access|save|open|browse|file|computer|internet))|(text-based (AI|assistant))/i;
function toApi(list) {
  const out = [];
  for (const m of list) {
    if (m.role === 'tool') out.push({ role: 'user', content: '[Action results]\n' + m.content });
    else if (m.stopped) continue;
    else if (m.role === 'assistant') { const c = noThink(m.content || ''); if (c && !REFUSAL.test(c)) out.push({ role: 'assistant', content: c }); }
    else if (m.content) out.push({ role: 'user', content: m.content });
  }
  const merged = [];
  for (const m of out) { const p = merged[merged.length - 1]; if (p && p.role === m.role) p.content += '\n\n' + m.content; else merged.push({ ...m }); }
  while (merged.length && merged[0].role !== 'user') merged.shift();
  return merged;
}

// --- actions ---
let actSeq = 0;
function parseActions(text) {
  const out = []; const re = /```(file|run|read|list|mkdir|move|open|search|click|type|scroll|back):([^\n`]*)\n?([\s\S]*?)```/g; let m;
  while ((m = re.exec(text))) out.push({ id: 'a' + (++actSeq), kind: m[1], arg: m[2].trim(), body: m[3].replace(/\n$/, ''), state: 'wait' });
  return out;
}
S.pending = {};
function ask(a) { return new Promise(r => { S.pending[a.id] = r; }); }
async function doSearch(q) {
  const res = await P.webSearch(q, S.st.searchKey || '');
  return res.length ? res.map((x, i) => `[${i + 1}] ${x.title} — ${x.url}\n${x.text}`).join('\n\n') : '(no results)';
}
const hostOf = u => { try { return new URL(u).host; } catch { return u; } };
function siteAllowed(u) { const h = hostOf(u); return S.allowAll || (S.allowedHosts && S.allowedHosts.has(h)) || (S.st.trustedHosts || []).includes(h); }
async function askSiteAction(a, url, repaint) {
  if (siteAllowed(url)) return true;
  a.state = 'ask'; a.site = hostOf(url); repaint(); Sound.soft();
  const ok = await ask(a); if (ok) (S.allowedHosts ||= new Set()).add(hostOf(url));
  return ok;
}
async function askSite(msg, idx, url, label) {
  if (siteAllowed(url)) return true;
  const a = { id: 'a' + (++actSeq), site: true, title: label || T('askSite'), files: [hostOf(url)], state: 'ask' }; msg.ask = a; paint(idx); Sound.soft();
  const ok = await new Promise(r => { S.pending[a.id] = r; });
  msg.ask = null; paint(idx); if (ok) (S.allowedHosts ||= new Set()).add(hostOf(url));
  return ok;
}
async function execAction(a, repaint, auto) {
  a.state = 'work'; repaint();
  try {
    let res;
    if (a.kind === 'file') {
      await P.ws.write(a.arg, a.body); res = `File saved: ${a.arg}`;
      const lang = (a.arg.split('.').pop() || '').toLowerCase();
      if (/^(html?|py|js)$/.test(lang)) { const errs = await autoCheck({ lang: lang.startsWith('htm') ? 'html' : lang, code: a.body }, lang.startsWith('htm')); if (errs.length) { a.warn = errs.length; res += `\nPULSAR checked it and found problems — fix them and save the file again:\n- ${errs.join('\n- ')}`; } }
    }
    else if (a.kind === 'run') {
      let src = ''; try { src = await P.ws.read(a.arg); } catch (e) {}
      if (/\binput\s*\(|readline|prompt\(/.test(src)) { a.state = 'done'; repaint(); return `${a.arg} is interactive (asks for keyboard input). It was not run automatically; the user will press Run and play it. Do not remove input().`; }
      const r = await P.ws.run(a.arg);
      if (r.preview) { await browse(r.preview, true); res = `${a.arg} opened in the built-in browser.`; }
      else { a.out = r.noPython ? T('noPython') : (r.out || '').trim(); if (r.noPython) throw new Error(T('noPython')); res = `Ran ${a.arg}, exit code ${r.code}. Output:\n${(r.out || '').slice(-4000)}`; }
    }
    else if (a.kind === 'mkdir') { await P.ws.mkdir(a.arg); res = `Folder created: ${a.arg}`; }
    else if (a.kind === 'move') { const [f, t] = a.arg.split('|').map(x => x.trim()); if (!f || !t) throw new Error('use move:old|new'); await P.ws.move(f, t); res = `Moved ${f} → ${t}`; }
    else if (a.kind === 'read') res = `Content of ${a.arg}:\n${(await P.ws.read(a.arg)).slice(0, 8000)}`;
    else if (a.kind === 'list') { const l = await P.ws.list(a.arg || '.'); res = `Folder ${a.arg || '.'}:\n${l.join('\n') || '(empty)'}`; }
    else if (a.kind === 'open') {
      const u = /^https?:\/\//i.test(a.arg) ? a.arg : 'https://' + a.arg;
      if (!auto && !(await askSiteAction(a, u, repaint))) { a.state = 'denied'; repaint(); return `open:${u} — the user did not allow visiting this site.`; }
      a.state = 'work'; repaint(); res = `Page ${u}:\n${await browse(u)}`;
    }
    else if (a.kind === 'search') {
      if (!auto && !(await askSiteAction(a, 'https://duckduckgo.com', repaint))) { a.state = 'denied'; repaint(); return `search — the user did not allow searching the web.`; }
      a.state = 'work'; repaint(); res = `Search results for "${a.arg}":\n${await doSearch(a.arg)}`;
    }
    else if (/^(click|type|scroll|back)$/.test(a.kind)) res = await browserAct(a, repaint);
    a.state = 'done'; repaint(); Sound.tick(1500);
    return res;
  } catch (e) {
    a.state = 'error'; a.err = String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, ''); repaint();
    return `${a.kind}:${a.arg} failed: ${a.err}`;
  }
}

// --- intents: what the user clearly wants, done even if the model forgets ---
const SITES = [[/википеди|wikipedia/, 'https://ru.wikipedia.org'], [/ютуб|youtube/, 'https://www.youtube.com'], [/гугл|google/, 'https://www.google.com'],
  [/яндекс|yandex/, 'https://ya.ru'], [/вконтакт|(^|\s)вк(\s|$)|\bvk\b/, 'https://vk.com'], [/гитхаб|github/, 'https://github.com'], [/хабр|habr/, 'https://habr.com'],
  [/авито|avito/, 'https://www.avito.ru'], [/озон|ozon/, 'https://www.ozon.ru'], [/вайлдберр|wildberries/, 'https://www.wildberries.ru'],
  [/тик\s*-?\s*ток|тикток|tik\s*tok/, 'https://www.tiktok.com'], [/инст(аграм|у|а)|instagram/, 'https://www.instagram.com'], [/твиттер|twitter|\bx\.com/, 'https://x.com'],
  [/реддит|reddit/, 'https://www.reddit.com'], [/твич|twitch/, 'https://www.twitch.tv'], [/рутуб|rutube/, 'https://rutube.ru'], [/дзен|dzen/, 'https://dzen.ru'],
  [/(^|\s)стим(\s|$)|steam/, 'https://store.steampowered.com'], [/дискорд|discord/, 'https://discord.com/app'], [/спотиф|spotify/, 'https://open.spotify.com'],
  [/почт[ау] (на )?(мейл|mail)|mail\.ru|мейл/, 'https://mail.ru'], [/гмейл|gmail/, 'https://mail.google.com'], [/пинтерест|pinterest/, 'https://www.pinterest.com'],
  [/одноклассник|(^|\s)ок(\s|$)/, 'https://ok.ru'], [/яндекс музык/, 'https://music.yandex.ru'], [/яндекс карт|карты/, 'https://yandex.ru/maps'], [/переводчик/, 'https://translate.yandex.ru'],
  [/телеграм|telegram/, 'https://web.telegram.org'], [/кинопоиск/, 'https://www.kinopoisk.ru'], [/погод/, 'https://yandex.ru/pogoda']];
function openIntent(t) {
  const s = t.toLowerCase();
  if (!/(открой|открыть|откройте|открывай|зайди|перейди|запусти|включи|покажи сайт|\bopen\b|go to)/.test(s)) return null;
  const u = s.match(/https?:\/\/\S+/); if (u) return u[0];
  const d = s.match(/\b([a-z0-9-]+\.)+(ru|com|org|net|io|dev|рф|su|me|app|info|xyz|tv)(\/\S*)?/); if (d) return 'https://' + d[0];
  for (const [re, url] of SITES) if (re.test(s)) return url;
  // "открой его / ты открой / открой первую" -> the site from the last answer
  if (S.lastLinks && S.lastLinks.length && /(открой|открыть|open)\s*(его|её|ее|это|эту|этот|первую|первый|ссылку|сайт|it|that|the first)?\s*[.!?]*$/.test(s.replace(/(^|\s)(ты|ну|давай|а|мне|пожалуйста|плиз)(?=\s|$)/g, ' ').replace(/\s+/g, ' ').trim())) return S.lastLinks[0];
  return null;
}
const SAVE_RE = /(сохрани|сохранить|сохраняй|на пк|на компьютер|на комп|в файл|создай файл|запиши|\bsave\b|to (a )?file)/i;
const BUILD_RE = /(сделай|создай|напиши|сгенерируй|собери|переделай|доработай|улучши|make|build|create|write).{0,50}(сайт|страниц|лендинг|игр|программ|скрипт|бот|калькулятор|приложени|site|page|game|program|script|app|calculator)/i;
const SEARCH_RE = /(найди|поищи|загугли|что нового|новост|курс|погода|search|look up|find)/i;
const TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
const slug = s => (s || '').toLowerCase().split('').map(c => TR[c] ?? c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32);
const EXT = { html: 'html', htm: 'html', css: 'css', js: 'js', javascript: 'js', py: 'py', python: 'py', json: 'json', md: 'md', markdown: 'md', txt: 'txt', text: 'txt', bat: 'bat', ts: 'ts', java: 'java', cpp: 'cpp', c: 'c', cs: 'cs', go: 'go', rs: 'rs', php: 'php', sql: 'sql', sh: 'sh', xml: 'xml', yaml: 'yml', yml: 'yml' };
async function uniqueName(name) {
  let list = []; try { list = await P.ws.list('.'); } catch {}
  const base = name.replace(/\/$/, ''); if (!list.includes(base) && !list.includes(base + '/')) return base;
  for (let i = 2; i < 100; i++) { const n = base.replace(/(\.[a-z0-9]+)?$/, m => `-${i}${m}`); if (!list.includes(n) && !list.includes(n + '/')) return n; }
  return base;
}
async function autoFiles(msg, userText, agentId) {
  const save = SAVE_RE.test(userText), build = BUILD_RE.test(userText);
  if (!save && !build) return [];
  const text = noThink(msg.content || '');
  const blocks = []; const re = /```([^\n`]*)\n([\s\S]*?)```/g; let m;
  while ((m = re.exec(text))) { const lang = m[1].trim().toLowerCase(); if (/^(file|run|read|list|mkdir|move|open|search|click|type|scroll|back):/.test(lang)) continue; if (m[2].trim().length > 20) blocks.push({ lang, code: m[2].replace(/\n$/, '') }); }
  const files = [];
  const html = blocks.find(b => b.lang === 'html' || /^\s*<!doctype html|<html[\s>]/i.test(b.code));
  if (html) {
    const title = (html.code.match(/<title>([^<]*)<\/title>/i) || [])[1] || (html.code.match(/<h1[^>]*>([^<]*)</i) || [])[1] || 'site';
    const dir = await uniqueName(slug(title) || 'site');
    files.push({ path: `${dir}/index.html`, code: html.code, open: true });
    const css = blocks.find(b => b.lang === 'css'); if (css) files.push({ path: `${dir}/style.css`, code: css.code });
    const js = blocks.find(b => b.lang === 'js' || b.lang === 'javascript'); if (js) files.push({ path: `${dir}/script.js`, code: js.code });
  } else if (blocks.length) {
    for (const b of blocks.slice(0, 4)) {
      const ext = EXT[b.lang] || 'txt';
      const nm = ext === 'py' ? ((b.code.match(/^\s*(?:def|class)\s+(\w+)/m) || [])[1] || slug(userText.split(' ').slice(-2).join(' ')) || 'program') : 'file';
      files.push({ path: await uniqueName(`${slug(nm) || 'file'}.${ext}`), code: b.code });
    }
  } else if (save && text && (agentId === 'writer' || agentId === 'translator' || agentId === 'research' || agentId === 'files')) {
    files.push({ path: await uniqueName(`text-${new Date().toISOString().slice(0, 10)}.md`), code: text });
  }
  return files;
}
async function applyAuto(msg, idx, userText, agentId) {
  if (msg.actions && msg.actions.some(a => a.kind === 'file' && a.state === 'done')) return false;
  const files = await autoFiles(msg, userText, agentId);
  if (!files.length) return false;
  msg.extra = files.map(f => ({ id: 'a' + (++actSeq), kind: 'file', arg: f.path, body: f.code, state: 'wait', open: f.open }));
  msg.content = (msg.content || '').split('\n').filter(l => !REFUSAL.test(l)).join('\n');
  paint(idx);
  if (!(await askSave(msg, idx, msg.extra.map(a => a.arg)))) { msg.extra.forEach(a => a.state = 'denied'); paint(idx); return true; }
  for (const a of msg.extra) await execAction(a, () => paint(idx));
  const site = msg.extra.find(a => a.open && a.state === 'done');
  if (site) { const r = await P.ws.run(site.arg).catch(() => null); if (r && r.preview) browse(r.preview, true); }
  return true;
}

// --- built-in browser (tabs) ---
const B = { tabs: [], active: null, seq: 0 };
const START = new URL('start.html', location.href).href;
function initBrowser() {
  B.tabs = []; B.active = null;
  P.onNewTab && !B.hooked && (B.hooked = true, P.onNewTab(u => newTab(u)));
}
function newTab(url) {
  const id = ++B.seq; const wv = document.createElement('webview');
  wv.setAttribute('src', url || START); wv.setAttribute('partition', 'persist:pulsar');
  wv.setAttribute('useragent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'); wv.setAttribute('webpreferences', 'backgroundThrottling=yes, spellcheck=no'); wv.dataset.tab = id;
  if (B.tabs.length >= 8) { const old = B.tabs.find(x => x.id !== B.active) || B.tabs[0]; old.wv.remove(); B.tabs.splice(B.tabs.indexOf(old), 1); }
  const t = { id, wv, title: '…', url: url || START, loading: true, ready: new Promise(r => wv.addEventListener('dom-ready', r, { once: true })) };
  wv.addEventListener('page-title-updated', e => { t.title = e.title; drawTabs(); });
  wv.addEventListener('did-start-loading', () => { t.loading = true; t.failed = null; drawBar(); drawTabs(); });
  wv.addEventListener('did-fail-load', e => { if (e.isMainFrame && e.errorCode !== -3) { t.failed = `${e.errorDescription || 'error'} (${e.errorCode})`; t.loading = false; drawBar(); drawTabs(); } });
  wv.addEventListener('did-stop-loading', () => { t.loading = false; drawBar(); drawTabs(); });
  const nav = e => { t.url = e.url; if (B.active === id) setAddr(); };
  wv.addEventListener('did-navigate', nav); wv.addEventListener('did-navigate-in-page', nav);
  document.getElementById('bviews').appendChild(wv);
  B.tabs.push(t); selectTab(id); return t;
}
function selectTab(id) {
  B.active = id;
  B.tabs.forEach(t => t.wv.classList.toggle('on', t.id === id));
  drawTabs(); drawBar(); setAddr();
}
function closeTab(id) {
  const i = B.tabs.findIndex(t => t.id === id); if (i < 0) return;
  B.tabs[i].wv.remove(); B.tabs.splice(i, 1);
  if (!B.tabs.length) { closePanel(); return; }
  if (B.active === id) selectTab(B.tabs[Math.max(0, i - 1)].id); else drawTabs();
}
const curTab = () => B.tabs.find(t => t.id === B.active);
function setAddr() { const t = curTab(), a = document.getElementById('addr'); if (a && t) a.value = t.url === START ? '' : t.url; }
function drawBar() { const t = curTab(); document.getElementById('bprog')?.classList.toggle('on', !!(t && t.loading)); }
function drawTabs() {
  const el = document.getElementById('btabs'); if (!el) return;
  el.innerHTML = B.tabs.map(t => `<div class="btab ${t.id === B.active ? 'on' : ''}" data-act="btab" data-v="${t.id}">
    ${t.loading ? '<span class="spinner"></span>' : '<span class="dot" style="width:5px;height:5px;opacity:.5"></span>'}
    <span class="btitle">${esc(t.url === START ? T('newTab') : t.title)}</span>
    <button class="bx" data-act="bclose" data-v="${t.id}" aria-label="close">${ico('x', 12)}</button></div>`).join('') +
    `<button class="ib sm" data-act="bnew" aria-label="new tab">${ico('plus', 14)}</button>`;
}
function layoutPanels() { const sc = root.querySelector('.screen'); if (sc) sc.classList.toggle('two', !!(S.panel && S.code)); }
function openCode(tab) {
  S.code = tab || S.code || 'edit';
  document.getElementById('codepanel')?.classList.add('open');
  document.querySelectorAll('.ctab').forEach(b => b.classList.toggle('on', b.dataset.v === S.code));
  document.getElementById('cedit')?.classList.toggle('hidden', S.code !== 'edit');
  document.getElementById('cout')?.classList.toggle('hidden', S.code !== 'out');
  layoutPanels();
}
function closeCode() { S.code = null; document.getElementById('codepanel')?.classList.remove('open'); layoutPanels(); }
let ED = null;
function initEditor() {
  const host = document.getElementById('cm'); if (!host || !window.PulsarEditor) return;
  ED = PulsarEditor.create(host, { onSave: () => saveEditor(), onChange: () => { const st = document.getElementById('cstate'); if (st) st.textContent = '● ' + T('unsaved'); } });
}
async function openEditor(rel) {
  let text = ''; try { text = await P.ws.read(rel); } catch (e) { toast(String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, '')); return; }
  S.editFile = rel; if (ED) ED.set(text, rel);
  document.getElementById('cfile').textContent = rel; document.getElementById('cstate').textContent = '';
  openCode('edit');
}
async function saveEditor() {
  if (!S.editFile || !ED) return;
  await P.ws.write(S.editFile, ED.get()); document.getElementById('cstate').textContent = T('saved'); Sound.tick(1500);
  if (/\.html?$/i.test(S.editFile)) { const u = await P.wsUrl(S.editFile); const t = B.tabs.find(x => x.url.split('#')[0] === u); if (t) t.wv.reload(); else browse(u, true); }
}
function openPanel() {
  S.panel = true; setTimeout(layoutPanels);
  document.getElementById('panel')?.classList.add('open');
  root.querySelector('[data-act=panel]')?.classList.add('on');
  if (!B.tabs.length) newTab();
}
function closePanel() { S.panel = false; layoutPanels(); document.getElementById('panel')?.classList.remove('open'); root.querySelector('[data-act=panel]')?.classList.remove('on'); }
async function browse(url, show) {
  openPanel();
  let t = curTab();
  if (!t || (t.url !== START && !show)) t = newTab(url); else { selectTab(t.id); await t.ready; t.wv.loadURL(url).catch(() => {}); }
  await t.ready;
  return new Promise(res => {
    let fin = false;
    const done = async () => {
      if (fin) return; fin = true; clearTimeout(timer); t.wv.removeEventListener('did-stop-loading', done);
      await new Promise(r => setTimeout(r, 600));
      res(await snapshot(t));
    };
    const timer = setTimeout(done, 25000);
    t.wv.addEventListener('did-stop-loading', done);
    setTimeout(() => { try { if (!t.wv.isLoading()) done(); } catch {} }, 400);
  });
}

// --- the agent controls the built-in browser: click, type, scroll, back ---
const SNAP_JS = `(()=>{document.querySelectorAll('[data-pid]').forEach(e=>e.removeAttribute('data-pid'));let n=0;const out=[];
 const els=[...document.querySelectorAll('a[href],button,input,textarea,select,[role=button],[role=link],[onclick],summary')].filter(e=>{const r=e.getBoundingClientRect();const st=getComputedStyle(e);return r.width>2&&r.height>2&&st.visibility!=='hidden'&&st.display!=='none'&&!e.disabled});
 for(const e of els.slice(0,80)){n++;e.setAttribute('data-pid',n);const t=(e.innerText||e.value||e.placeholder||e.getAttribute('aria-label')||e.title||e.name||'').trim().replace(/\\s+/g,' ').slice(0,60);out.push('['+n+'] '+e.tagName.toLowerCase()+(e.type&&e.tagName!=='BUTTON'?'('+e.type+')':'')+' '+JSON.stringify(t));}
 return JSON.stringify({url:location.href,title:document.title,elements:out,text:(document.body?document.body.innerText:'').replace(/\\n{3,}/g,'\\n\\n').slice(0,5000)});})()`;
async function snapshot(t) {
  if (t.failed) return `(the page could not be opened: ${t.failed})`;
  for (let i = 0; i < 6; i++) { let n = 0; try { n = await t.wv.executeJavaScript('(document.body&&document.body.innerText||"").length'); } catch (e) {} if (n > 200) break; await new Promise(r => setTimeout(r, 500)); }
  try { const j = JSON.parse(await t.wv.executeJavaScript(SNAP_JS)); return `URL: ${j.url}\nTitle: ${j.title}\n\n${j.text}\n\nInteractive elements (use click:N or type:N|text):\n${j.elements.join('\n')}`; }
  catch (e) { return '(could not read the page)'; }
}
function waitLoad(t, ms) {
  return new Promise(res => { let done = false; const fin = () => { if (done) return; done = true; t.wv.removeEventListener('did-stop-loading', fin); setTimeout(res, 500); }; t.wv.addEventListener('did-stop-loading', fin); setTimeout(fin, ms || 2500); });
}
async function browserAct(a, repaint) {
  const t = curTab(); if (!t || t.url === START) throw new Error('no page is open — use open: first');
  const before = t.url;
  if (a.kind === 'click') {
    const r = await t.wv.executeJavaScript(`(()=>{const e=document.querySelector('[data-pid="${parseInt(a.arg)}"]');if(!e)return 'missing';e.scrollIntoView({block:'center'});e.click();return 'ok'})()`);
    if (r !== 'ok') throw new Error('element ' + a.arg + ' not found — take a fresh look at the page');
    await waitLoad(t, 2500);
  } else if (a.kind === 'type') {
    const [n, ...rest] = a.arg.split('|'); let text = rest.join('|'); const submit = /(\\n|⏎|\{enter\})$/i.test(text) || /\n$/.test(a.body || ''); text = text.replace(/(\\n|⏎|\{enter\})$/i, '');
    const r = await t.wv.executeJavaScript(`(()=>{const e=document.querySelector('[data-pid="${parseInt(n)}"]');if(!e)return 'missing';e.focus();const p=Object.getPrototypeOf(e);const d=Object.getOwnPropertyDescriptor(p,'value');d&&d.set?d.set.call(e,${JSON.stringify(text)}):(e.value=${JSON.stringify(text)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));
      if(${submit}){e.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));if(e.form){e.form.requestSubmit?e.form.requestSubmit():e.form.submit()}}return 'ok'})()`);
    if (r !== 'ok') throw new Error('field ' + n + ' not found');
    await waitLoad(t, submit ? 3000 : 400);
  } else if (a.kind === 'scroll') {
    await t.wv.executeJavaScript(`window.scrollBy({top:${/up/i.test(a.arg) ? -1 : 1}*innerHeight*0.8,behavior:'smooth'})`); await new Promise(r => setTimeout(r, 600));
  } else if (a.kind === 'back') { if (t.wv.canGoBack()) { t.wv.goBack(); await waitLoad(t, 2500); } }
  if (hostOf(t.url) !== hostOf(before) && !(await askSiteAction(a, t.url, repaint))) { if (t.wv.canGoBack()) t.wv.goBack(); a.state = 'denied'; repaint(); return `The page moved to ${hostOf(t.url)}, the user did not allow reading it. Went back.`; }
  a.state = 'work'; repaint();
  return `After ${a.kind}:${a.arg}\n${await snapshot(t)}`;
}
// --- output drawer (only opens on Run) ---
function showOut(title, text, code) {
  const d = document.getElementById('drawer'); if (!d) return;
  document.getElementById('dtitle').textContent = title;
  document.getElementById('dcode').textContent = code != null ? (code === 0 ? '● 0' : '● ' + code) : '';
  document.getElementById('dcode').className = 'mono small ' + (code === 0 ? '' : 'err');
  document.getElementById('out').textContent = (text || '').trim() || '—';
  d.classList.add('open');
}
// interactive run in the output panel: live output, typing goes to the program
let runSeq = 0;
async function runFile(rel, title) {
  if (S.runId) P.runKill(S.runId);
  const id = 'p' + (++runSeq); S.runId = id; S.lastRun = rel;
  const d = document.getElementById('drawer'); const out = document.getElementById('out');
  document.getElementById('dtitle').textContent = title || rel;
  const dc = document.getElementById('dcode'); dc.textContent = '● ' + T('running'); dc.className = 'mono small';
  out.textContent = ''; openCode('out'); setRunInput(true);
  const r = await P.runStart(id, rel).catch(err => ({ error: String(err.message || err).replace(/^Error invoking remote method '[^']+': (Error: )?/, '') }));
  if (r.preview) { S.runId = null; browse(r.preview, true); return; }
  if (r.error || !r.ok) { out.textContent = r.noPython ? T('noPython') : (r.error || 'error'); dc.textContent = '● -1'; dc.className = 'mono small err'; setRunInput(false); S.runId = null; }
  else setTimeout(() => document.getElementById('runin')?.focus(), 100);
}
function setRunInput(on) { const w = document.getElementById('runbar'); if (w) w.style.display = on ? 'flex' : 'none'; }
P.onRunOut(({ id, data }) => { if (id !== S.runId) return; const o = document.getElementById('out'); o.textContent += data; o.scrollTop = o.scrollHeight; });
P.onRunExit(({ id, code, missing }) => {
  if (id !== S.runId) return; S.runId = null; setRunInput(false);
  const o = document.getElementById('out'); if (missing) o.textContent += '\n' + T('noPython');
  const dc = document.getElementById('dcode'); dc.textContent = '● ' + code; dc.className = 'mono small ' + (code === 0 ? '' : 'err');
});
function sendRunInput() {
  const i = document.getElementById('runin'); if (!i || !S.runId) return;
  const line = i.value; i.value = '';
  const o = document.getElementById('out'); o.textContent += line + '\n'; o.scrollTop = o.scrollHeight;
  P.runInput(S.runId, line);
}

// --- conversation ---
const FEWSHOT = {
  ru: [['user', 'Сохрани файл hello.txt с текстом Привет'], ['assistant', '```file:hello.txt\nПривет\n```'], ['user', '[Action results]\nFile saved: hello.txt'], ['assistant', 'Готово — сохранил hello.txt в рабочую папку.'],
    ['user', 'Открой example.com'], ['assistant', '```open:https://example.com\n```'], ['user', '[Action results]\nPage https://example.com:\nExample Domain\nThis domain is for use in examples.'], ['assistant', 'Открыл example.com во встроенном браузере. Это демонстрационная страница «Example Domain».']],
  en: [['user', 'Save hello.txt with the text Hi'], ['assistant', '```file:hello.txt\nHi\n```'], ['user', '[Action results]\nFile saved: hello.txt'], ['assistant', 'Done — saved hello.txt in the workspace.'],
    ['user', 'Open example.com'], ['assistant', '```open:https://example.com\n```'], ['user', '[Action results]\nPage https://example.com:\nExample Domain\nThis domain is for use in examples.'], ['assistant', 'Opened example.com in the built-in browser. It is the demo page "Example Domain".']]
};
const memText = () => (S.st.memory || []).length ? `\nWhat you know about the user from earlier chats (use it naturally, do not list it):\n${S.st.memory.map(x => '- ' + x).join('\n')}` : '';
const MEM_RULE = '\nIf the user tells you something lasting about themselves (name, city, work, projects, what they like or want from you), put at the very end of your reply one line per fact: [[remember: short fact]]. If they ask to forget something: [[forget: the fact]]. Never mention these lines.';
const sysMsg = (prompt, tools, mem) => ({ role: 'system', content: prompt + (tools ? '\n' + TOOLS_PROMPT : '') + (mem ? MEM_RULE : '') + memText() + `\nWorkspace folder: ${S.ws || ''}` });
const MEM_RE = /\[\[\s*(remember|forget|запомни|забудь)\s*:\s*([^\]]+?)\s*\]\]/gi;
const stripMem = s => (s || '').replace(MEM_RE, '').replace(/\[\[[^\]]*\]?$/, '').trimEnd();
const NAME_RE = /(?:меня зовут|моё имя|мое имя|зови меня|my name is|call me)\s+([A-Za-zА-Яа-яЁё-]{2,20})|меня\s+([A-Za-zА-Яа-яЁё-]{2,20})\s+зовут/i;
async function applyMemory(msg) {
  const add = [], del = [];
  const lastUser = [...S.msgs].reverse().find(m => m.role === 'user');
  const nm = lastUser && (lastUser.shown || '').match(NAME_RE);
  if (nm) { const w = nm[1] || nm[2]; const n = w[0].toUpperCase() + w.slice(1).toLowerCase(); const lbl = L() === 'ru' ? 'Имя пользователя: ' : 'User name: '; const cur = (S.st.memory || []).filter(x => !x.startsWith(lbl)); if (!(S.st.memory || []).includes(lbl + n)) { await save({ memory: [...cur, lbl + n] }); add.push(lbl + n); } }
  for (const [, k, v] of (msg.content || '').matchAll(MEM_RE)) (/^(forget|забудь)/i.test(k) ? del : add).push(v.trim());
  if (!add.length && !del.length) return;
  msg.content = stripMem(msg.content);
  const lo = x => x.toLowerCase();
  let mem = (S.st.memory || []).filter(x => !del.some(d => lo(x).includes(lo(d)) || lo(d).includes(lo(x))));
  for (const a of add) if (!mem.some(x => lo(x) === lo(a))) mem.push(a.slice(0, 200));
  await save({ memory: mem.slice(-40) });
  msg.memNote = add.length ? T('memSaved') + ' ' + add.join(' · ') : T('memForgot');
}
const fewshot = () => FEWSHOT[L()].map(([role, content]) => ({ role, content }));
function pickAgent(t) {
  const def = id => { const a = ourAgents().find(x => x[0] === id); return { id: a[0], name: a[1], prompt: a[3], tools: a[4] }; };
  const build = BUILD_RE.test(t) || /(код|программ|скрипт|сайт|html|python|питон|ошибк|баг|code|bug)/i.test(t);
  if (!build && (openIntent(t) || /(найди|поищи|загугли|новост|курс (доллар|евро|валют|рубл|биткоин)|погод|в интернете|в сети|актуальн|сегодня|узнай|цен[аы] на|search|find|look up|news|weather|price of)/i.test(t))) return def('browser');
  if (!build && /(файл|папк|переимен|перемест|разлож|отсортир|сортир|документ|дубликат|рабоч\w* папк|folder|file|rename|move|organi[sz]e|sort)/i.test(t)) return def('files');
  if (build) return def('coder');
  return def('chat');
}
function curAgentDef() {
  const id = S.st.agent || 'coder';
  const a = ourAgents().find(x => x[0] === id) || ourAgents()[0];
  return { id: a[0], name: a[1], prompt: a[3], tools: a[4] };
}
async function askSave(msg, idx, paths) {
  const a = { id: 'a' + (++actSeq), files: paths, state: 'ask' }; msg.ask = a; paint(idx); Sound.soft();
  const ok = await new Promise(r => { S.pending[a.id] = r; });
  a.state = ok ? 'done' : 'denied'; paint(idx); return ok;
}
function askHTML(a) {
  if (!a || a.state === 'done') return '';
  if (a.site) return permCard({ type: 'site', id: a.id, host: a.files[0], label: a.title, agent: S.curAgentName });
  if (a.state === 'ask') return permCard({ type: 'save', id: a.id, files: a.files, agent: S.curAgentName });
  const right = a.state === 'ask' ? `<span><button class="cb pri" data-act="allow" data-v="${a.id}">${T('allow')}</button><button class="cb" data-act="deny" data-v="${a.id}">${T('deny')}</button></span>`
    : `<span class="st ${a.state === 'done' ? 'ok' : ''}">${a.state === 'done' ? T('saved') : T('sDenied')}</span>`;
  return `<div class="act askcard"><div class="row" style="gap:12px"><span>${T('saveToPc')} · ${a.files.length}</span>${right}</div><div style="margin-top:8px;display:flex;flex-direction:column;gap:3px;color:#999">${a.files.map(f => `<span class="mono small">${esc(f)}</span>`).join('')}</div></div>`;
}
function cool(signal) {
  return new Promise(res => { const t0 = Date.now(); const tick = () => { if (!S.temps?.hot || signal?.aborted || Date.now() - t0 > 120000) return res(); setTimeout(tick, 2000); }; tick(); });
}
async function runAgent(ag, userText, signal) {
  S.curAgentName = ag.name;
  for (let round = 0; round < 6; round++) {
    if (S.temps?.hot) { const w = { role: 'assistant', content: '', live: true, status: T('cooling') }; S.msgs.push(w); const wi = S.msgs.length - 1; addMsg(wi); await cool(signal); S.msgs.splice(wi, 1); root.querySelector(`.msg[data-i="${wi}"]`)?.remove(); }
    if (round === 0 && ag.id === 'files') { let l = []; try { l = await P.ws.list('.'); } catch (e) {} S.msgs.push({ role: 'tool', content: `Workspace files (${l.length}):\n${l.join('\n') || '(empty)'}` }); addMsg(S.msgs.length - 1); }
    const history = toApi(S.msgs.slice(-24));
    const msg = { role: 'assistant', content: '', live: true, agent: round === 0 ? ag.name : null }; S.msgs.push(msg); const idx = S.msgs.length - 1; addMsg(idx);
    try {
      const meta = {};
      await stream([sysMsg(ag.prompt, ag.tools, ag.id === 'chat'), ...(ag.tools ? fewshot() : []), ...history], signal, c => { msg.content += c; paint(idx); }, null, meta);
      for (let k = 0; k < 4 && meta.finish === 'length'; k++) {
        msg.status = T('stContinue'); meta.finish = null;
        await stream([{ role: 'system', content: ag.prompt + ' Continue the answer exactly where it stopped. Do not repeat anything.' }, { role: 'user', content: userText },
          { role: 'assistant', content: msg.content.slice(-6000) }], signal, c => { msg.content += c; paint(idx); }, null, meta);
      }
    } finally { msg.live = false; msg.status = null; msg.content = (msg.content || '').split('\n').filter(l => !/(блок\w*|block)\s*`*\s*(open|search|file|run|read|list|click|type)\s*:?/i.test(l)).join('\n').trimEnd(); await applyMemory(msg).catch(() => {}); paint(idx); }
    if (!ag.tools) return;
    const acts = parseActions(noThink(msg.content));
    if (!acts.length) { if (SAVE_RE.test(userText)) await applyAuto(msg, idx, userText, ag.id); return; }
    msg.actions = acts; paint(idx);
    const files = acts.filter(a => /^(file|mkdir|move)$/.test(a.kind));
    const allowed = files.length ? await askSave(msg, idx, files.map(a => a.kind === 'move' ? a.arg.replace('|', ' → ') : a.kind === 'mkdir' ? a.arg.replace(/\/?$/, '/') : a.arg)) : true;
    const results = [];
    for (const a of acts) {
      if (signal.aborted) return;
      if (/^(file|mkdir|move)$/.test(a.kind) && !allowed) { a.state = 'denied'; paint(idx); results.push(`${a.arg}: the user did not allow saving.`); continue; }
      results.push(await execAction(a, () => paint(idx)));
    }
    S.msgs.push({ role: 'tool', content: results.join('\n\n') }); addMsg(S.msgs.length - 1);
  }
}

// --- several agents in one request: look -> build (in parallel) -> review -> save ---
const URL_RE = /https?:\/\/[^\s)"'<>]+/g;
const MULTI_RE = /(\b[2-9]\b|два|две|три|четыре|пять|несколько|много)\s*(страниц|pages)|многостранич|multi-?page|страниц[аы]?\s*:/i;
function chainPlan(text) {
  const urls = [...new Set(text.match(URL_RE) || [])].slice(0, 3);
  const like = /(как|такой же|такой-же|похож|пример|по примеру|в стиле|like|similar|same as|copy)/i.test(text);
  const build = BUILD_RE.test(text) || (urls.length > 0 && (like || /(сделай|делай|создай|напиши|make|build)/i.test(text)));
  const site = urls.length > 0 || /(сайт|страниц|лендинг|site|page|landing|html)/i.test(text);
  const edit = !urls.length && !!S.lastProject && /(переделай|измени|исправь|добавь|доработай|улучши|поменяй|убери|замени|сделай (его|её|ее|сайт|страниц|кнопк|фон|шрифт|текст)|change|fix|add|remove|improve|make it)/i.test(text) && !/(нов(ый|ую)|another|new)\s*(сайт|site|программ)/i.test(text);
  return { urls, build: build || edit, edit, refs: site && !urls.length && !edit && (build || edit) && S.st.refs !== false, site: edit ? S.lastProject.site : site, multi: site && MULTI_RE.test(text), research: !urls.length && !edit && build && SEARCH_RE.test(text) };
}
async function limitAll(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.max(1, Math.min(n, items.length)) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}
function lastCode(s, wantHtml) {
  const re = /```([^\n`]*)\n([\s\S]*?)(```|$)/g; let m, best = null;
  while ((m = re.exec(noThink(s || '')))) {
    let l = m[1].trim().toLowerCase(); if (m[2].trim().length < 30) continue;
    if (l.startsWith('file:')) l = l.split('.').pop(); else if (/^(run|read|list|mkdir|move|open|search|click|type|scroll|back):/.test(l)) continue;
    const isHtml = l === 'html' || /^\s*(<!doctype html|<html)/i.test(m[2]);
    if (!wantHtml || isHtml) best = { lang: isHtml ? 'html' : l, code: m[2].replace(/\n$/, ''), closed: !!m[3] };
  }
  return best;
}
const PAGE_JS = `(()=>{const cs=e=>e?getComputedStyle(e):null;const b=cs(document.body),h=cs(document.querySelector('h1,h2')),bt=cs(document.querySelector('button,.btn,a[class*=btn],a[class*=button]'));
const hs=[...document.querySelectorAll('h1,h2,h3')].slice(0,25).map(x=>x.tagName+': '+x.innerText.trim().slice(0,90)).filter(x=>x.length>5);
const sec=[...document.querySelectorAll('header,nav,section,footer')].slice(0,30).map(x=>x.tagName.toLowerCase()+(x.id?'#'+x.id:''));
return JSON.stringify({title:document.title,background:b&&b.backgroundColor,textColor:b&&b.color,font:b&&b.fontFamily,headingFont:h&&h.fontFamily,headingSize:h&&h.fontSize,headingWeight:h&&h.fontWeight,buttonBg:bt&&bt.backgroundColor,buttonColor:bt&&bt.color,buttonRadius:bt&&bt.borderRadius,sections:sec,headings:hs,text:(document.body?document.body.innerText:'').slice(0,2500)});})()`;
// several generated pages -> one html file with a tiny hash router
function mergePages(pages, codes) {
  const dp = new DOMParser();
  const docs = codes.map(c => dp.parseFromString(c.code, 'text/html'));
  const base = docs[0];
  const ids = pages.map((p, k) => (p.file || 'page' + k).replace(/\.html?$/i, '').replace(/[^\w-]/g, '') || 'page' + k);
  ids[0] = 'index';
  const strip = d => { const b = d.body.cloneNode(true); b.querySelectorAll('header, footer, script').forEach(n => n.remove()); [...b.children].filter(n => n.tagName === 'NAV').forEach(n => n.remove()); return b.innerHTML.trim(); };
  const header = (base.body.querySelector('header') || [...base.body.children].find(n => n.tagName === 'NAV'))?.outerHTML || '';
  const footer = base.body.querySelector('footer')?.outerHTML || '';
  const extraCss = docs.slice(1).flatMap(d => [...d.querySelectorAll('style')].map(x => x.textContent)).join('\n');
  const extraLinks = [...new Set(docs.slice(1).flatMap(d => [...d.querySelectorAll('link[rel=stylesheet]')].map(l => l.outerHTML)))].filter(l => !base.head.innerHTML.includes(l)).join('');
  const scripts = [...new Set(docs.flatMap(d => [...d.querySelectorAll('script')].map(x => x.outerHTML)))].join('\n');
  const sections = docs.map((d, k) => `<section class="pl-page" id="page-${ids[k]}"${k ? ' hidden' : ''}>${strip(d)}</section>`).join('\n');
  const router = `<script>(function(){function show(){var id=(location.hash||'#index').slice(1),s=document.getElementById('page-'+id);if(!s)return;document.querySelectorAll('.pl-page').forEach(function(p){p.hidden=p!==s});window.scrollTo(0,0)}window.addEventListener('hashchange',show);show()})()</scr` + `ipt>`;
  let html = `<!DOCTYPE html>\n<html lang="${base.documentElement.lang || L()}">\n<head>${base.head.innerHTML}${extraLinks}<style>${extraCss}\n.pl-page[hidden]{display:none}</style></head>\n<body>${header}\n<main>${sections}</main>\n${footer}\n${router}\n${scripts}</body>\n</html>`;
  pages.forEach((p, k) => { const f = (p.file || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); if (f) html = html.replace(new RegExp(`href=(["'])(\\./)?${f}(#[^"']*)?\\1`, 'gi'), `href="#${ids[k]}"`); });
  return html;
}
// take the code out of an answer: html with its css/js blocks inlined, or the largest code block
function extractCode(s, wantHtml) {
  const text = noThink(s || '');
  const blocks = []; const re = /```([^\n`]*)\n([\s\S]*?)(```|$)/g; let m;
  while ((m = re.exec(text))) {
    let l = m[1].trim().toLowerCase(); if (/^(run|read|list|mkdir|move|open|search|click|type|scroll|back):/.test(l)) continue;
    if (l.startsWith('file:')) l = l.split('.').pop();
    if (m[2].trim().length > 20) blocks.push({ lang: l, code: m[2].replace(/\n$/, ''), closed: !!m[3] });
  }
  const isHtml = b => b.lang === 'html' || /^\s*(<!doctype html|<html)/i.test(b.code);
  let html = blocks.filter(isHtml).sort((a, b) => b.code.length - a.code.length)[0];
  if (!html && wantHtml) { const i = text.search(/<!doctype html|<html[\s>]/i); if (i >= 0) { const e = text.search(/<\/html>/i); html = { lang: 'html', code: text.slice(i, e > i ? e + 7 : undefined), closed: e > i }; } }
  if (html) {
    let code = html.code;
    const css = blocks.filter(b => b.lang === 'css').map(b => b.code).join('\n');
    const js = blocks.filter(b => b.lang === 'js' || b.lang === 'javascript').map(b => b.code).join('\n');
    if (css) { code = code.replace(/<link[^>]+href=["'](\.\/)?(style|styles|main)\.css["'][^>]*>/i, ''); code = /<\/head>/i.test(code) ? code.replace(/<\/head>/i, `<style>\n${css}\n</style>\n</head>`) : `<style>${css}</style>` + code; }
    if (js) { code = code.replace(/<script[^>]+src=["'](\.\/)?(script|main|app)\.js["'][^>]*>\s*<\/script>/i, ''); code = /<\/body>/i.test(code) ? code.replace(/<\/body>(?![\s\S]*<\/body>)/i, `<script>\n${js}\n</script>\n</body>`) : code + `<script>${js}</script>`; }
    return { lang: 'html', code, closed: html.closed };
  }
  if (wantHtml) return null;
  const big = blocks.sort((a, b) => b.code.length - a.code.length)[0];
  return big || null;
}
const PLACEHOLDER_RE = /lorem ipsum|\bTODO\b|остальн(ой|ые|ая) (код|част)|rest of (the )?(code|file)|\/\/ \.\.\.|<!--\s*\.\.\.\s*-->|\.\.\. ?(other|more|остальн)/i;
async function autoCheck(c, site) {
  const out = [];
  if (PLACEHOLDER_RE.test(c.code)) out.push('the code contains placeholders or omitted parts (lorem ipsum / TODO / "rest of the code") — write everything in full');
  if (c.lang === 'html' || site) {
    if (!/<\/html>\s*$/i.test(c.code.trim())) out.push('the file is cut off — it must end with </html>');
    const opens = (c.code.match(/<script\b/gi) || []).length, closes = (c.code.match(/<\/script>/gi) || []).length;
    if (opens !== closes) out.push('unclosed <script> tag');
    try { out.push(...await P.checkHtml(c.code)); } catch (e) {}
  } else if (/^(py|python|js|javascript|node)$/.test(c.lang)) {
    try { out.push(...await P.checkCode(c.lang, c.code)); } catch (e) {}
  }
  return [...new Set(out)];
}
function progName(c, text) {
  const ext = EXT[c.lang] || (c.lang && c.lang.length < 6 ? c.lang : 'txt');
  const nm = ext === 'py' ? ((c.code.match(/^\s*(?:def|class)\s+(\w+)/m) || [])[1] || 'program') : ext === 'js' ? 'script' : 'file';
  return { ext, nm: slug(nm) || 'file' };
}
async function runChain(text, signal, plan) {
  S.curAgentName = 'PULSAR IN BROWSER';
  const lang = L() === 'ru' ? 'Russian' : 'English';
  const def = id => ourAgents().find(x => x[0] === id);
  const ids = ['accept', (plan.urls.length || plan.research || plan.refs) && 'analyze', plan.multi && !plan.edit && 'plan', 'code', 'review', 'save'].filter(Boolean);
  const msg = { role: 'assistant', content: '', parts: [], chain: { stages: ids.map(id => ({ id, state: 'wait' })) } }; S.msgs.push(msg); const idx = S.msgs.length - 1; addMsg(idx);
  const stage = id => { let seen = false; for (const st of msg.chain.stages) { if (st.id === id) { st.state = 'work'; seen = true; } else if (!seen) st.state = 'done'; } paint(idx); };
  const finish = () => { msg.chain.stages.forEach(st => st.state = 'done'); paint(idx); };
  const part = (name, task, status) => { const p = { name, task, status: status || 'work', content: '' }; msg.parts.push(p); paint(idx); return p; };
  const waitCool = async () => { if (!S.temps?.hot) return; msg.chain.cooling = true; paint(idx); await cool(signal); msg.chain.cooling = false; paint(idx); };
  stage('accept'); await new Promise(r => setTimeout(r, 350));
  let brief = '';
  const browser = def('browser'), coder = def('coder');
  // 1. look at the examples / research
  if (plan.refs && !plan.urls.length) {
    stage('analyze');
    if (await askSite(msg, idx, 'https://duckduckgo.com', T('askSearchRefs'))) {
      const res = await P.webSearch(text.slice(0, 100) + (L() === 'ru' ? ' сайт' : ' website'), S.st.searchKey || '');
      plan.urls = res.map(r => r.url).filter(u => /^https?:/.test(u) && !/duckduckgo|youtube|wikipedia|facebook|instagram|vk\.com|pinterest|reddit|tiktok/i.test(u)).slice(0, 2);
      plan.refsFound = true;
    }
  }
  if (plan.urls.length) {
    stage('analyze'); await waitCool();
    const p = part(browser[1], T('chAnalyze'));
    const raw = [];
    for (const u of plan.urls) {
      if (signal.aborted) return;
      if (!(await askSite(msg, idx, u))) continue;
      p.task = T('chAnalyze') + ' · ' + u; paint(idx);
      await browse(u);
      let st = ''; try { st = await curTab().wv.executeJavaScript(PAGE_JS); } catch (e) {}
      raw.push(`URL: ${u}\n${st}`);
    }
    p.task = T('chAnalyze');
    if (!raw.length) { p.status = 'done'; p.content = '-'; paint(idx); } else
    await stream([{ role: 'system', content: browser[3] + ` Analyze the example websites for a web designer who must recreate the style: 1) sections in order, 2) colors (hex), fonts, sizes, corner radius, 3) mood and visual effects, animations, 4) key texts. Be concrete, use short lists. Answer in ${lang}.` },
      { role: 'user', content: `User request: ${text}\n\nPage data:\n${raw.join('\n\n').slice(0, 12000)}` }], signal, c => { p.content += c; paint(idx); });
    if (raw.length) { brief = noThink(p.content); p.status = 'done'; paint(idx); }
  } else if (plan.research && await askSite(msg, idx, 'https://duckduckgo.com', T('askSearch'))) {
    stage('analyze'); await waitCool();
    const p = part(browser[1], T('chResearch'));
    const res = await doSearch(text.slice(0, 120));
    await stream([{ role: 'system', content: browser[3] + ` From the search results, write a short brief with ideas, facts and examples useful for the build. Answer in ${lang}.` },
      { role: 'user', content: `Request: ${text}\n\nSearch results:\n${res}` }], signal, c => { p.content += c; paint(idx); });
    brief = noThink(p.content); p.status = 'done'; paint(idx);
  }
  // 2. plan pages (multi-page sites are built in parallel)
  let pages = [{ file: 'index.html', title: '', purpose: text }];
  const proj = plan.edit ? S.lastProject : null;
  if (proj) {
    pages = [];
    for (const f of proj.files) { let code = ''; try { code = await P.ws.read(f); } catch (e) {} pages.push({ file: f.split('/').pop(), path: f, title: '', purpose: text, code }); }
  } else if (plan.multi) {
    stage('plan');
    const p = part(T('coordinator'), T('chPlan'));
    try {
      const raw = noThink(await stream([{ role: 'system', content: `Plan a multi-page website. Answer ONLY with a JSON array of 2-5 pages: [{"file":"index.html","title":"<page name in ${lang}>","purpose":"<what is on the page>"}]. The first page is index.html.` },
        { role: 'user', content: text + (brief ? '\n\nReference:\n' + brief.slice(0, 2500) : '') }], signal, null, { temperature: 0.1 }));
      const j = JSON.parse((raw.match(/\[[\s\S]*\]/) || ['[]'])[0]).filter(x => x.file && /^[\w-]+\.html?$/i.test(x.file)).slice(0, 5);
      if (j.length > 1) { if (j[0].file !== 'index.html') j[0].file = 'index.html'; pages = j; }
    } catch (e) { if (e.name === 'AbortError') throw e; }
    p.content = pages.map(x => `${x.file} — ${x.title || ''}`).join('\n'); p.status = 'done'; paint(idx);
  }
  // 3. build, several agents at once if the PC allows
  const nav = pages.map(x => `${x.file} (${x.title || ''})`).join(', ');
  stage('code');
  const jobs = pages.map((pg, k) => part(coder[1] + (pages.length > 1 ? ' #' + (k + 1) : ''), plan.site ? `${pg.file}${pg.title ? ' — ' + pg.title : ''}` : T('chCode'), 'wait'));
  const slots = () => S.temps?.hot ? 1 : Math.max(1, S.slots || 1);
  const codes = await limitAll(pages, slots(), async (pg, k) => {
    await waitCool();
    const p = jobs[k]; p.status = 'work'; paint(idx);
    const sys = coder[3] + (plan.site
      ? ` Output ONLY one complete HTML file in a single \`\`\`html block (all CSS and JS inside), then one short sentence.${pages.length > 1 ? ` This is page "${pg.file}" of a site with pages: ${nav}. Every page has the same header with links to all pages, the same footer, colors and fonts.` : ''}`
      : ' Output the complete program in one code block, then a short explanation of how to run it.') + ` Never say you cannot save or open files. Answer in ${lang}.`;
    const user = pg.code ? `Change request: ${text}\n\nCurrent code of ${pg.file} (keep everything that was not asked to change, return the whole updated file):\n\`\`\`${plan.site ? 'html' : ''}\n${pg.code.slice(0, 24000)}\n\`\`\`` : `Request: ${text}${pages.length > 1 ? `\n\nThis page: ${pg.file} — ${pg.title}. Content: ${pg.purpose}` : ''}${brief ? `\n\nDesign reference from the examples (recreate this style and structure with the user's own content):\n${brief.slice(0, 5000)}` : ''}`;
    const meta = {};
    await stream([{ role: 'system', content: sys }, { role: 'user', content: user }], signal, c => { p.content += c; paint(idx); }, { temperature: 0.3 }, meta);
    for (let r = 0; r < 4 && meta.finish === 'length'; r++) {
      meta.finish = null;
      await stream([{ role: 'system', content: sys + ' Continue exactly where it stopped, no repetition.' }, { role: 'user', content: user }, { role: 'assistant', content: p.content.slice(-6000) }], signal, c => { p.content += c; paint(idx); }, null, meta);
    }
    p.status = 'done'; paint(idx);
    return extractCode(p.content, plan.site);
  });
  // 4. PULSAR runs every result, a second agent fixes the real errors it finds (up to 3 rounds)
  stage('review');
  await limitAll(codes.map((c, k) => ({ c, k })).filter(x => x.c), slots(), async ({ c, k }) => {
    await waitCool();
    const label = plan.site ? pages[k].file : T('chCode');
    const p = part(coder[1] + ' · ' + T('chReview') + (pages.length > 1 ? ' #' + (k + 1) : ''), label);
    let cur = c, fixedAny = false;
    for (let round = 0; round < 3; round++) {
      const problems = await autoCheck(cur, plan.site);
      if (!problems.length) break;
      p.task = `${label} · ${T('chFixing')} ${round + 1}`; p.content += `\n${problems.join('\n')}\n`; paint(idx);
      await waitCool();
      const meta = {}; let out = '';
      await stream([{ role: 'system', content: `You fix code. Fix ALL listed problems and anything else that is broken. Return the COMPLETE fixed file in ONE code block — no explanations before it, no omissions like "rest of the code". Keep the design and content. Answer in ${lang}.` },
        { role: 'user', content: `Problems found when running it:\n- ${problems.join('\n- ')}\n\nCode:\n\`\`\`${cur.lang}\n${cur.code}\n\`\`\`` }], signal, ch => { out += ch; p.content += ch; paint(idx); }, { temperature: 0.2 }, meta);
      for (let r = 0; r < 3 && meta.finish === 'length'; r++) { meta.finish = null; await stream([{ role: 'system', content: 'Continue the code exactly where it stopped. No repetition.' }, { role: 'assistant', content: out.slice(-6000) }], signal, ch => { out += ch; p.content += ch; paint(idx); }, { temperature: 0.2 }, meta); }
      const fixed = extractCode(out, plan.site);
      if (!fixed || fixed.code.length < cur.code.length * 0.5) break;
      cur = fixed; fixedAny = true;
    }
    codes[k] = cur;
    const left = fixedAny ? await autoCheck(cur, plan.site) : [];
    p.task = `${label} · ${left.length ? T('chLeft')(left.length) : fixedAny ? T('chFixed') : 'OK'}`;
    p.status = 'done'; paint(idx);
  });
  // 5. one permission for all files, then save and show
  stage('save');
  const valid = codes.filter(Boolean);
  if (!valid.length) { finish(); msg.content = T('chNoCode'); paint(idx); return; }
  let files = [], dir = '';
  if (proj) {
    dir = proj.dir; files = pages.map((pg, k) => codes[k] && { path: pg.path, code: codes[k].code }).filter(Boolean);
  } else if (plan.site) {
    const title = (valid[0].code.match(/<title>([^<]*)<\/title>/i) || [])[1] || pages[0].title || 'site';
    dir = await uniqueName(slug(title) || 'site');
    const okPages = pages.filter((pg, k) => codes[k]); const okCodes = codes.filter(Boolean);
    files = [{ path: `${dir}/index.html`, code: okCodes.length > 1 ? mergePages(okPages, okCodes) : okCodes[0].code }];
  } else {
    for (const c of valid) { const n = progName(c, text); files.push({ path: await uniqueName(`${n.nm}.${n.ext}`), code: c.code }); }
  }
  const ok = await askSave(msg, idx, files.map(f => f.path));
  if (ok) {
    for (const f of files) await P.ws.write(f.path, f.code);
    msg.extra = files.map(f => ({ id: 'a' + (++actSeq), kind: 'file', arg: f.path, state: 'done' }));
    S.lastProject = { dir, site: plan.site, files: proj ? proj.files : files.map(f => f.path) };
    if (plan.site) rememberProject(dir, S.lastProject.files, ((files[0].code.match(/<title>([^<]*)<\/title>/i) || [])[1] || dir).trim()).catch(() => {});
    finish();
    msg.content = proj ? T('chEdited')(files.length) : plan.site ? T('chDoneSite')(pages.filter((pg, k) => codes[k]).length, dir) : T('chDone')(files.length);
    paint(idx); Sound.done();
    if (plan.site) { const r = await P.ws.run(files[0].path).catch(() => null); if (r && r.preview) browse(r.preview, true); }
  } else { finish(); msg.content = T('chNotSaved'); paint(idx); }
}
async function saveChat() {
  if (!S.msgs.length) return;
  if (!S.chatId) S.chatId = 'c' + Date.now();
  const first = S.msgs.find(m => m.role === 'user');
  const msgs = JSON.parse(JSON.stringify(S.msgs, (k, v) => k === 'live' ? undefined : v));
  await P.chats.save({ id: S.chatId, title: (first ? (first.shown || first.content) : '…').replace(/\s+/g, ' ').slice(0, 60), msgs, lastProject: S.lastProject || null });
  S.chats = await P.chats.list(); renderNav();
}
async function openChat(id) {
  if (S.streaming) return;
  const c = await P.chats.get(id); if (!c) return;
  S.chatId = id; S.msgs = c.msgs || []; S.lastProject = c.lastProject || null;
  S.tab = 'chat'; S._lastTab = null; renderNav(); renderMain();
}
S.attach = [];
function addAttach(list) {
  for (const f of list || []) { if (f.error) toast(`${f.name}: ${f.error}`); else if (S.attach.length < 6) S.attach.push(f); }
  drawAttach();
}
function drawAttach() {
  const el = document.getElementById('attachrow'); if (!el) return;
  el.innerHTML = S.attach.map((f, i) => `<span class="achip">${esc(f.name)}<span class="mono">${(f.size / 1024).toFixed(0)} KB</span><button class="bx" data-act="unattach" data-v="${i}" aria-label="remove">${ico('x', 10)}</button></span>`).join('');
}
document.addEventListener('dragover', e => { if (e.target.closest && e.target.closest('.chat')) { e.preventDefault(); } });
document.addEventListener('drop', async e => {
  if (!(e.target.closest && e.target.closest('.chat'))) return; e.preventDefault();
  const paths = [...(e.dataTransfer.files || [])].map(f => P.pathForFile(f)).filter(Boolean);
  if (paths.length) addAttach(await P.readFiles(paths));
});
function lockComposer(on) {
  const ta = $('#input'); if (!ta) return;
  ta.disabled = on; ta.placeholder = on ? T('agentsWorking') : T('placeholder');
}
async function sendMsg() {
  const ta = $('#input'); const typed = ta.value.trim(); if ((!typed && !S.attach.length) || S.streaming) return;
  const files = S.attach.splice(0); drawAttach();
  const text = (typed || T('attachAsk')) + files.map(f => `\n\n[Attached file: ${f.name}${f.cut ? ' (cut)' : ''}]\n\`\`\`\n${f.text}\n\`\`\``).join('');
  S.allowAll = false; S.allowedHosts = new Set();
  if (!files.length && /^(открой|открыть|покажи|open)?\s*(браузер|browser)\s*(открой|открыть|open)?[.!]*$/i.test(typed)) {
    ta.value = ''; S.msgs.push({ role: 'user', content: typed, shown: typed }); addMsg(S.msgs.length - 1);
    if (!S.panel) openPanel(); S.msgs.push({ role: 'assistant', content: T('browserOpened') }); addMsg(S.msgs.length - 1); Sound.done(); saveChat().catch(() => {}); return;
  }
  const url = files.length ? null : openIntent(typed);
  if (url) S.lastLinks = [url];
  if (!S.running && !url) { toast(T('chatNoModel')); return; }
  ta.value = ''; ta.style.height = 'auto';
  S.msgs.push({ role: 'user', content: text, shown: typed, files: files.map(f => ({ name: f.name, size: f.size })) }); addMsg(S.msgs.length - 1);
  const ctl = new AbortController(); S.streaming = ctl; setSendBtn(); lockComposer(true); Sound.soft();
  const from = S.msgs.length;
  const auto = S.st.autoAgent !== false;
  const ag = auto ? pickAgent(text) : curAgentDef();
  const plan = chainPlan(text);
  const chain = plan.build && (auto || ag.id === 'coder');
  if (!plan.build && S.lastProject && /(скачай|сохрани|загрузи|перекинь|где (файл|сайт|лежит)|куда сохран|download|where)/i.test(text)) {
    const p = S.lastProject;
    S.msgs.push({ role: 'assistant', content: T('alreadySaved')(S.ws + '\\' + p.dir.replace(/\//g, '\\')), extra: p.files.map(f => ({ id: 'a' + (++actSeq), kind: 'file', arg: f, state: 'done' })) }); addMsg(S.msgs.length - 1);
    P.ws.openFile(p.dir); S.streaming = null; setSendBtn(); lockComposer(false); Sound.done(); saveChat().catch(() => {}); return;
  }
  const pill = $('#apill'); if (pill && auto) pill.textContent = chain ? (plan.urls.length || plan.research ? 'PULSAR IN BROWSER → PULSAR CODE' : 'PULSAR CODE ×2') : ag.name;
  try {
    if (chain && S.running) await runChain(text, ctl.signal, plan);
    else if (url) {
      const m = { role: 'assistant', content: '', extra: [{ id: 'a' + (++actSeq), kind: 'open', arg: url, state: 'wait' }] };
      S.msgs.push(m); const i = S.msgs.length - 1; addMsg(i);
      const res = await execAction(m.extra[0], () => paint(i), true);
      const rest = text.replace(/(открой|открыть|зайди|перейди|open|go to)[^,.;]*/i, '').trim();
      if (S.running && rest.split(/\s+/).length >= 3) { S.msgs.push({ role: 'tool', content: res }); addMsg(S.msgs.length - 1); await runAgent(ag, text, ctl.signal); }
    } else {
      if (ag.id === 'browser' && !SAVE_RE.test(text)) {
        const m = { role: 'assistant', content: '', extra: [{ id: 'a' + (++actSeq), kind: 'search', arg: text.slice(0, 120), state: 'wait' }] };
        S.msgs.push(m); const i = S.msgs.length - 1; addMsg(i);
        const res = await execAction(m.extra[0], () => paint(i), false);
        const links = [...String(res).matchAll(/https?:\/\/[^\s)\]>"']+/g)].map(x => x[0]);
        if (links.length) S.lastLinks = links;
        if (links.length && /(открой|открыть|зайди|перейди|запусти|включи|\bopen\b)/i.test(typed)) {
          const o = { id: 'a' + (++actSeq), kind: 'open', arg: links[0], state: 'wait' }; m.extra.push(o);
          const page = await execAction(o, () => paint(i), false);
          S.msgs.push({ role: 'tool', content: `Opened ${links[0]} in the built-in browser.\n${String(page).slice(0, 3000)}\nTell the user in one or two short sentences that the site is open in the browser on the right. Do not list links.` });
        } else S.msgs.push({ role: 'tool', content: res + '\nAnswer from these results and cite the best links. If you need more, open a link yourself. Never tell the user about blocks or tools.' });
        addMsg(S.msgs.length - 1);
      }
      await runAgent(ag, text, ctl.signal);
    }
  } catch (e) {
    if (e.name !== 'AbortError') { S.msgs.push({ role: 'assistant', content: '⚠ ' + (e.message || e) }); addMsg(S.msgs.length - 1); }
  }
  Object.values(S.pending).forEach(r => r(false)); S.pending = {};
  const stopped = ctl.signal.aborted;
  if (stopped) {
    // drop everything half-written in this request, keep only the note
    paintQ.clear(); S.msgs.splice(from); S.msgs.push({ role: 'assistant', content: '', stopped: true });
    const box = $('#msgs'); if (box) { box.querySelectorAll('.msg[data-i]').forEach(el => { if (+el.dataset.i >= from) el.remove(); }); addMsg(S.msgs.length - 1); }
  }
  S.streaming = null; setSendBtn(); lockComposer(false); stopped ? Sound.tick(900) : Sound.done(); $('#input')?.focus();
  saveChat().catch(() => {});
  if (!stopped) P.notify('PULSAR', T('notifyDone')).catch(() => {});
}

// ---------- events ----------
root.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b || b.tagName === 'SELECT') return;
  const v = b.dataset.v;
  switch (b.dataset.act) {
    case 'lang': await save({ lang: v }); document.documentElement.lang = v; intro(); break;
    case 'skip': Sound.stopAll(); afterIntro(); break;
    case 'toApp': appScreen(); break;
    case 'setLang': await save({ lang: v }); document.documentElement.lang = v; Sound.tick(1500); renderNav(); S._lastTab = null; renderMain(); drawTabs(); break;
    case 'tab': S.tab = v; Sound.tick(1200); renderNav(); renderMain(); break;
    case 'dl': downloadModel(v); break;
    case 'cancel': P.cancel(v); break;
    case 'run': runModel(v); break;
    case 'del': await P.deleteModel(v); S.local.delete(v); if (S.running === v) S.running = null; renderNav(); renderMain(); break;
    case 'opt': toggleOpt(v); break;
    case 'mcat': S.mcat = v; Sound.tick(1300); S._lastTab = null; renderMain(); break;
    case 'rescan': await save({ hw: null }); scanScreen(); break;
    case 'folder': P.openModels(); break;
    case 'autoAgentCard': await save({ autoAgent: S.st.autoAgent === false }); Sound.tick(1500); renderMain(); break;
    case 'agent': await save({ agent: v, autoAgent: false }); Sound.tick(1500); renderMain(); break;
    case 'apiAdd': {
      const a = { name: $('#aName').value.trim() || 'API', url: $('#aUrl').value.trim(), key: $('#aKey').value.trim(), model: $('#aModel').value.trim() };
      if (!a.url || !a.model) return;
      await save({ apis: [...(S.st.apis || []), a] }); Sound.done(); renderMain(); break;
    }
    case 'apiDel': { const l = [...(S.st.apis || [])]; l.splice(+v, 1); await save({ apis: l }); renderMain(); break; }
    case 'sKey': await save({ searchKey: $('#sKey').value.trim() }); toast(T('saved')); break;
    case 'newChat': S.streaming?.abort(); S.msgs = []; S.chatId = null; S.lastProject = null; S._lastTab = null; renderNav(); renderMain(); break;
    case 'openChat': if (!e.target.closest('.bx')) openChat(v); break;
    case 'delChat': await P.chats.del(v); if (S.chatId === v) { S.chatId = null; S.msgs = []; if (S.tab === 'chat') { S._lastTab = null; renderMain(); } } S.chats = await P.chats.list(); renderNav(); break;
    case 'recDl': if (!$('#main')) await appScreen(); S.tab = 'models'; renderNav(); renderMain(); S.autoRun = v; downloadModel(v); break;
    case 'updInstall': P.installUpdate(); break;
    case 'report': { const f = await P.report(JSON.stringify({ tab: S.tab, running: S.running, slots: S.slots, temps: S.temps, msgs: S.msgs.length })); toast(T('reportDone')); break; }
    case 'endChat':
      S.streaming?.abort(); Object.values(S.pending).forEach(r => r(false)); S.pending = {};
      await P.stop(); S.running = null; S.engine = null; S.msgs = []; S.chatId = null; S.lastProject = null; S._lastTab = null;
      renderNav(); renderMain(); toast(T('ended')); break;
    case 'send': sendMsg(); break;
    case 'stop': S.streaming?.abort(); Object.values(S.pending).forEach(r => r(false)); S.pending = {}; break;
    case 'allow': case 'deny': { const r = S.pending[v]; delete S.pending[v]; r && r(b.dataset.act === 'allow'); break; }
    case 'autoAgent': await save({ autoAgent: S.st.autoAgent === false }); Sound.tick(1500); S._lastTab = 'chat'; renderMain(); break;
    case 'kimiSave': {
      const key = $('#kKey').value.trim(); if (!key) return;
      const apis = (S.st.apis || []).filter(a => a.cloud !== 'kimi');
      apis.push({ name: 'Kimi K2.6', url: 'https://openrouter.ai/api/v1', key, model: 'moonshotai/kimi-k2.6:free', cloud: 'kimi' });
      await save({ apis }); Sound.done(); toast(T('saved')); renderMain(); break;
    }
    case 'kimiDel': await save({ apis: (S.st.apis || []).filter(a => a.cloud !== 'kimi') }); renderMain(); break;
    case 'extLink': P.openExternal(v); break;
    case 'autoAct': await save({ autoAct: !S.st.autoAct }); b.classList.toggle('on', !!S.st.autoAct); toast(T('autoAct') + ': ' + (S.st.autoAct ? T('on') : T('off'))); break;
    case 'wsOpen': P.ws.open(); break;
    case 'panel': S.panel ? closePanel() : openPanel(); break;
    case 'btab': if (!e.target.closest('.bx')) selectTab(+v); break;
    case 'bclose': closeTab(+v); break;
    case 'bnew': newTab(); break;
    case 'pclose': closePanel(); break;
    case 'wvBack': curTab()?.wv.goBack(); break;
    case 'wvFwd': curTab()?.wv.goForward(); break;
    case 'wvReload': curTab()?.wv.reload(); break;
    case 'wvExt': { const t = curTab(); if (t && t.url !== START) P.openExternal(t.url); break; }
    case 'cclose': closeCode(); if (S.runId) { P.runKill(S.runId); S.runId = null; } break;
    case 'ctab': openCode(v); break;
    case 'csave': saveEditor(); break;
    case 'crun': if (S.editFile) { await saveEditor(); runFile(S.editFile); } break;
    case 'cext': if (S.editFile) P.ws.openFile(S.editFile); break;
    case 'attach': { const f = await P.pickFiles(); addAttach(f); break; }
    case 'unattach': S.attach.splice(+v, 1); drawAttach(); break;
    case 'dlHelper': downloadModel(v); break;
    case 'draftTgl': { const off = { ...(S.st.draftOff || {}) }; if (S.st.spec === false) { await save({ spec: true }); delete off[v]; } else if (off[v]) delete off[v]; else off[v] = true; await save({ draftOff: off }); Sound.tick(1500); renderMain(); if (S.running && draftFor(findM(S.running)) === v) toast(T('specRestart')); break; }
    case 'specTgl': await save({ spec: S.st.spec === false }); Sound.tick(1500); renderMain(); if (S.running && draftFor(findM(S.running))) toast(T('specRestart')); break;
    case 'allowSite': { const h = b.dataset.h; if (h) await save({ trustedHosts: [...new Set([...(S.st.trustedHosts || []), h])] }); const r = S.pending[v]; delete S.pending[v]; r && r(true); Sound.tick(1500); break; }
    case 'allowAll': { S.allowAll = true; const r = S.pending[v]; delete S.pending[v]; r && r(true); break; }
    case 'addModel': { const m = await P.pickModel(); if (m) { const id = 'custom-' + (slug(m.name) || Date.now()); await save({ customModels: [...(S.st.customModels || []).filter(x => x.id !== id), { id, name: m.name, path: m.path, sizeGB: m.sizeGB }] }); S.local.add(id); Sound.done(); renderMain(); } break; }
    case 'delCustom': await save({ customModels: (S.st.customModels || []).filter(x => x.id !== v) }); S.local.delete(v); if (S.running === v) { await P.stop(); S.running = null; } renderNav(); renderMain(); break;
    case 'projOpen': { const r = await P.ws.run(v).catch(() => null); if (r && r.preview) browse(r.preview, true); break; }
    case 'projEdit': openEditor(v); break;
    case 'projFolder': P.ws.openFile(v); break;
    case 'projGo': { const pr = (S.projects || []).find(p => p.dir === v); if (pr) { S.msgs = []; S.chatId = null; S.lastProject = { dir: pr.dir, site: true, files: pr.files }; S.tab = 'chat'; S._lastTab = null; renderNav(); renderMain(); toast(T('projCont')(pr.dir)); } break; }
    case 'runSend': sendRunInput(); break;
    case 'drerun': if (S.lastRun) runFile(S.lastRun); break;
    case 'copy': navigator.clipboard.writeText(CODES[v].code); toast(T('copied')); break;
    case 'saveAs': { const c = CODES[v]; const ext = EXT[c.lang.toLowerCase()] || 'txt'; await P.ws.saveAs('file.' + ext, c.code); break; }
    case 'runCode': {
      const c = CODES[v]; const ext = RUNNABLE[c.lang.toLowerCase()]; const rel = `.pulsar/snippet.${ext}`;
      await P.ws.write(rel, c.code); runFile(rel, c.lang); break;
    }
    case 'fopen': openEditor(v); break;
    case 'frun': runFile(v); break;
  }
});
document.addEventListener('keydown', e => {
  if (e.target.id === 'runin' && e.key === 'Enter') { e.preventDefault(); sendRunInput(); return; }
  if (e.target.id === 'addr' && e.key === 'Enter') {
    let u = e.target.value.trim(); if (!u) return;
    u = /^[a-z]+:\/\//i.test(u) ? u : /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(u) ? 'https://' + u : 'https://duckduckgo.com/?q=' + encodeURIComponent(u);
    const t = curTab(); if (t) t.wv.loadURL(u).catch(() => {}); else browse(u, true);
  }
});
root.addEventListener('change', async e => {
  const t = e.target;
  if (t.dataset.act === 'sel') S.sel = t.value;
  if (t.dataset.act === 'agentSel') { await save({ agent: t.value }); Sound.tick(1500); }
});
root.addEventListener('keydown', e => {
  if (e.target.id === 'input' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});
root.addEventListener('input', e => {
  if (e.target.id === 'input') { e.target.style.height = 'auto'; e.target.style.height = Math.min(200, e.target.scrollHeight) + 'px'; }
});
function tempsHTML() {
  const t = S.temps || {}; const f = (n, v) => v ? `<span style="color:${v >= (t.limit || 80) ? '#ff8a80' : '#ddd'}">${n} ${Math.round(v)}°</span>` : '';
  return `${T('tempLbl')}${t.hot ? ' · <span style="color:#ff8a80">' + T('heatOn') + '</span>' : ''}<br><span class="mono">${[f('GPU', t.gpu), f('CPU', t.cpu)].filter(Boolean).join(' · ')}</span>`;
}
P.onTemps(t => {
  const was = S.temps?.hot; S.temps = t;
  const el = document.getElementById('temps'); if (el) { el.style.display = t.gpu || t.cpu ? '' : 'none'; el.innerHTML = tempsHTML(); }
  if (t.hot && !was) toast(T('hotToast')(Math.round(t.max)));
  if (!t.hot && was) toast(T('coolToast'));
  if (t.max >= (t.limit || 80) + 10 && S.streaming) { S.streaming.abort(); toast(T('tooHot')(Math.round(t.max))); }
});
P.onUpdate(u => { S.update = { ...(S.update || {}), ...u }; const ub = document.getElementById('updbar'); if (ub && u.percent != null) ub.style.width = u.percent + '%';
  const us = document.getElementById('updsub'); if (us && u.total) { const mb = x => (x / 1048576).toFixed(0); us.textContent = `${u.percent}% · ${mb(u.got)} / ${mb(u.total)} ${T('mb')} · ${(u.speed / 1048576).toFixed(1)} ${T('mb')}/s`; } if ($('#nav')) renderNav(); if (u.state === 'ready') toast(T('updReady')(u.version)); });
P.onLoad(l => {
  const was = S.busy; S.busy = l.busy ? l.name : null;
  if (S.busy && S.busy !== was && S.running) toast(T('busy')(S.busy));
});

window.addEventListener('error', e => P.log(`UI error: ${e.message} @ ${e.filename}:${e.lineno}`));
window.addEventListener('unhandledrejection', e => P.log(`UI promise: ${e.reason && (e.reason.stack || e.reason.message) || e.reason}`));
function applyTheme() { document.documentElement.classList.toggle('light', S.st.theme === 'light'); }
// ---------- boot ----------
(async () => {
  S.st = await P.getSettings(); applyTheme();
  if (S.st.apis) await save({ apis: [] });
  if (S.st.agent === 'team' || !['chat', 'coder', 'files', 'browser'].includes(S.st.agent || 'coder')) await save({ agent: 'chat' });
  if (S.st.lang) document.documentElement.lang = S.st.lang;
  if (!S.st.lang) langScreen(); else if (!S.st.introSeen) intro(); else afterIntro();
})();
