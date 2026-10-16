const { app, BrowserWindow, ipcMain, shell, dialog, Tray, Menu, Notification, nativeImage } = require('electron');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const { spawn, execFile } = require('child_process');
const si = require('systeminformation');

const DATA = () => app.getPath('userData');
const DIRS = () => ({ models: path.join(DATA(), 'models'), engine: path.join(DATA(), 'engine') });
const SETTINGS = () => path.join(DATA(), 'settings.json');
const PORT = 18089;
let win, server = null, serverInfo = null;

function readSettings() { try { return JSON.parse(fs.readFileSync(SETTINGS(), 'utf8')); } catch { return {}; } }
function writeSettings(s) { fs.mkdirSync(DATA(), { recursive: true }); fs.writeFileSync(SETTINGS(), JSON.stringify(s, null, 2)); }
function send(ch, d) { if (win && !win.isDestroyed()) win.webContents.send(ch, d); }

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 980, minHeight: 680, backgroundColor: '#000000',
    titleBarStyle: 'hidden', titleBarOverlay: { color: '#000000', symbolColor: '#ffffff', height: 36 },
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, autoplayPolicy: 'no-user-gesture-required', webviewTag: true }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'ui', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(() => {
  for (const d of Object.values(DIRS())) fs.mkdirSync(d, { recursive: true });
  createWindow();
});
app.on('window-all-closed', () => { stopServer(); app.quit(); });

// ---------- settings ----------
ipcMain.handle('settings:get', () => readSettings());
ipcMain.handle('settings:set', (_e, patch) => { const s = { ...readSettings(), ...patch }; writeSettings(s); return s; });

// ---------- hardware ----------
ipcMain.handle('hw:scan', async () => {
  const [g, mem, cpu, disk] = await Promise.all([si.graphics().catch(() => ({ controllers: [] })), si.mem(), si.cpu(), si.fsSize().catch(() => [])]);
  const gpus = (g.controllers || []).filter(c => c && c.model);
  const best = gpus.slice().sort((a, b) => (b.vram || 0) - (a.vram || 0))[0];
  const drive = path.parse(DATA()).root.replace(/\\$/, '').toUpperCase();
  const d = disk.find(x => (x.mount || '').toUpperCase().startsWith(drive)) || disk[0];
  return {
    gpu: best ? best.model : null,
    gpuVendor: best ? (best.vendor || '') : '',
    vramGB: best && best.vram ? +(best.vram / 1024).toFixed(1) : 0,
    ramGB: +(mem.total / 1073741824).toFixed(1),
    cpu: `${cpu.manufacturer} ${cpu.brand}`.trim(),
    cores: cpu.physicalCores, threads: cpu.cores,
    freeGB: d ? Math.round(d.available / 1073741824) : null
  };
});

// ---------- downloads ----------
// resumable download: keeps <file>.part, continues with a Range request, retries on network errors
async function download(url, dest, onProgress, signal) {
  const tmp = dest + '.part';
  for (let attempt = 0; ; attempt++) {
    let start = 0; try { start = fs.statSync(tmp).size; } catch {}
    try {
      const res = await fetch(url, { redirect: 'follow', signal, headers: { 'User-Agent': 'PULSAR', ...(start ? { Range: `bytes=${start}-` } : {}) } });
      if (res.status === 416 && start) { fs.renameSync(tmp, dest); onProgress && onProgress(start, start); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const resumed = res.status === 206 && start > 0; if (!resumed) start = 0;
      const total = (+res.headers.get('content-length') || 0) + start;
      const out = fs.createWriteStream(tmp, { flags: resumed ? 'a' : 'w' });
      let got = start, last = 0;
      const reader = res.body.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          got += value.length;
          if (!out.write(Buffer.from(value))) await new Promise(r => out.once('drain', r));
          const now = Date.now();
          if (now - last > 200) { last = now; onProgress && onProgress(got, total); }
        }
      } finally { await new Promise(r => out.end(r)); }
      if (total && got < total) throw new Error('connection lost');
      fs.renameSync(tmp, dest);
      onProgress && onProgress(got, total || got);
      return;
    } catch (e) {
      if (signal && signal.aborted) throw e;
      if (attempt >= 8) throw e;
      await new Promise(r => setTimeout(r, Math.min(30000, 2000 * 2 ** attempt)));
    }
  }
}

const jobs = {};
ipcMain.handle('model:download', async (_e, { id, repo, repos, quant }) => {
  if (jobs[id]) return { ok: false, error: 'already' };
  const ctl = new AbortController(); jobs[id] = ctl;
  try {
    const re = new RegExp(quant.replace(/[_]/g, '[_-]') + '\\.gguf$', 'i');
    let file = null;
    for (const r of (repos || [repo])) {
      try {
        const info = await (await fetch(`https://huggingface.co/api/models/${r}`, { signal: ctl.signal })).json();
        const files = (info.siblings || []).map(s => s.rfilename).filter(f => f.toLowerCase().endsWith('.gguf') && !/mmproj/i.test(f));
        const f = files.find(f => re.test(f) && !f.includes('/')) || files.find(f => re.test(f));
        if (f) { file = f; repo = r; break; }
      } catch (e) { if (ctl.signal.aborted) throw e; }
    }
    if (!file) throw new Error('no file ' + quant);
    const dest = path.join(DIRS().models, id + '.gguf');
    await download(`https://huggingface.co/${repo}/resolve/main/${encodeURI(file)}`, dest,
      (g, t) => send('model:progress', { id, got: g, total: t }), ctl.signal);
    return { ok: true };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
  finally { delete jobs[id]; }
});
ipcMain.handle('model:cancel', (_e, id) => { if (jobs[id]) jobs[id].abort(); return true; });
ipcMain.handle('model:local', () => fs.readdirSync(DIRS().models).filter(f => f.endsWith('.gguf')).map(f => f.replace(/\.gguf$/, '')));
ipcMain.handle('model:delete', (_e, id) => { if (serverInfo && serverInfo.id === id) stopServer(); for (const f of [id + '.gguf', id + '.gguf.part']) { try { fs.unlinkSync(path.join(DIRS().models, f)); } catch {} } return true; });
ipcMain.handle('model:partial', () => { const o = {}; for (const f of fs.readdirSync(DIRS().models)) if (f.endsWith('.gguf.part')) { try { o[f.replace(/\.gguf\.part$/, '')] = fs.statSync(path.join(DIRS().models, f)).size; } catch {} } return o; });
ipcMain.handle('open:models', () => shell.openPath(DIRS().models));

// ---------- engine (llama.cpp) ----------
function findFile(dir, name) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isFile() && e.name.toLowerCase() === name) return p;
    if (e.isDirectory()) { const r = findFile(p, name); if (r) return r; }
  }
  return null;
}
function unzip(zip, dest) {
  return new Promise((res, rej) => execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
    `Expand-Archive -LiteralPath '${zip.replace(/'/g, "''")}' -DestinationPath '${dest.replace(/'/g, "''")}' -Force`],
    { windowsHide: true }, err => err ? rej(err) : res()));
}
async function ensureEngine(kind) {
  const bundled = path.join(process.resourcesPath || '', 'engine', kind, 'llama-server.exe');
  if (fs.existsSync(bundled)) return bundled;
  const dev = path.join(__dirname, 'engine', kind, 'llama-server.exe');
  if (fs.existsSync(dev)) return dev;
  const dir = path.join(DIRS().engine, kind);
  fs.mkdirSync(dir, { recursive: true });
  let exe = findFile(dir, 'llama-server.exe');
  if (exe) return exe;
  send('engine:status', { stage: 'download', kind });
  const rel = await (await fetch('https://api.github.com/repos/ggml-org/llama.cpp/releases/latest', { headers: { 'User-Agent': 'PULSAR' } })).json();
  const assets = rel.assets || [];
  const pick = kind === 'vulkan'
    ? assets.find(a => /bin-win-vulkan-x64\.zip$/i.test(a.name))
    : (assets.find(a => /bin-win-cpu-x64\.zip$/i.test(a.name)) || assets.find(a => /bin-win-avx2-x64\.zip$/i.test(a.name)));
  if (!pick) throw new Error('engine asset not found');
  const zip = path.join(dir, pick.name);
  await download(pick.browser_download_url, zip, (g, t) => send('engine:status', { stage: 'download', kind, got: g, total: t }));
  send('engine:status', { stage: 'unpack', kind });
  await unzip(zip, dir);
  try { fs.unlinkSync(zip); } catch {}
  exe = findFile(dir, 'llama-server.exe');
  if (!exe) throw new Error('llama-server.exe not found');
  return exe;
}

function stopServer() { if (server) { try { server.kill(); } catch {} } server = null; serverInfo = null; }
async function waitHealth(proc, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (proc.exitCode !== null) return false;
    try { const r = await fetch(`http://127.0.0.1:${PORT}/health`); if (r.ok) return true; } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}
async function launch(kind, opts) {
  const exe = await ensureEngine(kind);
  const args = ['-m', opts.path || path.join(DIRS().models, opts.id + '.gguf'), '--host', '127.0.0.1', '--port', String(PORT),
    '-c', String(opts.ctx || 4096), '-t', String(opts.threads || 4), '--jinja'];
  args.push('-ngl', String(kind === 'vulkan' ? (opts.ngl ?? 999) : 0));
  if (opts.slots > 1) { args.push('-np', String(opts.slots)); args[args.indexOf('-c') + 1] = String((opts.ctx || 4096) * opts.slots); }
  if (opts.cpuMoe && kind === 'vulkan') args.push('--cpu-moe');
  if (opts.kv !== false) args.push('-fa', 'on', '-ctk', 'q8_0', '-ctv', 'q8_0');
  if (opts.draft) { const dp = path.join(DIRS().models, opts.draft + '.gguf'); if (fs.existsSync(dp)) args.push('-md', dp, '-ngld', kind === 'vulkan' ? '99' : '0', '--draft-max', '16', '--draft-min', '1'); }
  send('engine:status', { stage: 'load', kind });
  let log = '';
  const logFile = path.join(DATA(), 'engine.log');
  fs.appendFileSync(logFile, `\n==== ${new Date().toISOString()} ${kind} ${args.join(' ')}\n`);
  const p = spawn(exe, args, { cwd: path.dirname(exe), windowsHide: true });
  const onData = d => { log = (log + d).slice(-6000); try { fs.appendFileSync(logFile, d); } catch {} };
  p.stdout.on('data', onData); p.stderr.on('data', onData);
  p.on('error', e => onData('spawn error: ' + e.message + '\n'));
  server = p;
  const ok = await waitHealth(p, 300000);
  if (!ok) {
    try { p.kill(); } catch {} server = null;
    const lines = log.split('\n').filter(l => /error|fail|unable|cannot|out of memory|exception/i.test(l)).slice(-3);
    throw new Error((lines.length ? lines : log.split('\n').slice(-4)).join('\n').trim() || 'engine exited');
  }
  p.on('exit', () => { if (server === p) { server = null; serverInfo = null; send('engine:status', { stage: 'stopped' }); } });
  return true;
}
ipcMain.handle('engine:start', async (_e, opts) => {
  stopServer();
  const s = readSettings();
  const tries = [];
  if (opts.draft && opts.gpu && s.engine !== 'cpu') tries.push(['vulkan', opts]);
  opts = { ...opts, draft: null };
  if (opts.gpu && s.engine !== 'cpu') {
    tries.push(['vulkan', opts]);
    tries.push(['vulkan', { ...opts, kv: false, slots: 1, ctx: Math.min(opts.ctx || 4096, 4096) }]);
    tries.push(['vulkan', { ...opts, ngl: opts.ngl === 999 ? Math.floor((opts.layers || 32) * 0.6) : Math.floor((opts.ngl || 0) * 0.6), ctx: 4096 }]);
  }
  tries.push(['cpu', { ...opts, slots: 1, ctx: Math.min(opts.ctx || 4096, 4096) }]);
  let lastErr, specErr = '';
  for (const [kind, o] of tries) {
    try {
      await launch(kind, o);
      serverInfo = { id: opts.id, kind, port: PORT, ngl: o.ngl, slots: o.slots || 1 };
      send('engine:status', { stage: 'ready', kind });
      return { ok: true, kind, port: PORT, slots: o.slots || 1, spec: !!o.draft, specErr };
    } catch (e) { lastErr = e; if (o.draft) specErr = String(e.message || e).slice(0, 300); }
  }
  send('engine:status', { stage: 'error' });
  return { ok: false, error: String(lastErr && lastErr.message || lastErr) };
});
ipcMain.handle('engine:stop', () => { stopServer(); return true; });
ipcMain.handle('engine:info', () => serverInfo);

// ---------- web search (Brave, user's own key) ----------
ipcMain.handle('search', async (_e, { q, key }) => {
  try {
    const r = await fetch('https://api.search.brave.com/res/v1/web/search?count=5&q=' + encodeURIComponent(q),
      { headers: { 'Accept': 'application/json', 'X-Subscription-Token': key } });
    if (!r.ok) return { ok: false, error: 'HTTP ' + r.status };
    const j = await r.json();
    return { ok: true, results: ((j.web && j.web.results) || []).map(x => ({ title: x.title, url: x.url, text: (x.description || '').replace(/<[^>]+>/g, '') })) };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
});

// ---------- load monitor: lighten when a heavy app (game) appears ----------
let monitorTimer = null;
ipcMain.handle('monitor:set', (_e, on) => {
  clearInterval(monitorTimer); monitorTimer = null;
  if (!on) return true;
  monitorTimer = setInterval(async () => {
    try {
      const pr = await si.processes();
      const heavy = pr.list.filter(p => p.cpu > 25 && !/llama-server|pulsar|electron|system|idle/i.test(p.name)).sort((a, b) => b.cpu - a.cpu)[0];
      if (server && server.pid) { try { require('os').setPriority(server.pid, heavy ? 19 : 0); } catch {} }
      send('monitor:load', heavy ? { busy: true, name: heavy.name } : { busy: false });
    } catch {}
  }, 15000);
  return true;
});

// ---------- workspace: files the agents can touch ----------
function workspace() {
  const s = readSettings();
  const ws = s.workspace || path.join(app.getPath('documents'), 'PULSAR');
  fs.mkdirSync(ws, { recursive: true });
  return ws;
}
function wsPath(rel) {
  const ws = path.resolve(workspace());
  const p = path.resolve(ws, String(rel || '.').replace(/^[\\/]+/, ''));
  if (p !== ws && !p.startsWith(ws + path.sep)) throw new Error('path outside workspace');
  return p;
}
ipcMain.handle('ws:get', () => workspace());
ipcMain.handle('ws:choose', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openDirectory', 'createDirectory'], defaultPath: workspace() });
  if (r.canceled || !r.filePaths[0]) return workspace();
  writeSettings({ ...readSettings(), workspace: r.filePaths[0] });
  return r.filePaths[0];
});
ipcMain.handle('ws:open', () => shell.openPath(workspace()));
ipcMain.handle('ws:openFile', (_e, rel) => shell.openPath(wsPath(rel)));
ipcMain.handle('ws:write', (_e, { rel, content }) => {
  const p = wsPath(rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content, 'utf8'); return p;
});
ipcMain.handle('ws:move', (_e, { from, to }) => {
  const a = wsPath(from), b = wsPath(to);
  if (!fs.existsSync(a)) throw new Error('not found: ' + from);
  if (fs.existsSync(b)) throw new Error('already exists: ' + to);
  fs.mkdirSync(path.dirname(b), { recursive: true }); fs.renameSync(a, b); return true;
});
ipcMain.handle('ws:mkdir', (_e, rel) => { fs.mkdirSync(wsPath(rel), { recursive: true }); return true; });
ipcMain.handle('ws:read', (_e, rel) => {
  const p = wsPath(rel); const st = fs.statSync(p);
  if (st.size > 200000) throw new Error('file too large');
  return fs.readFileSync(p, 'utf8');
});
ipcMain.handle('ws:list', (_e, rel) => {
  const base = wsPath(rel); const out = [];
  const walk = (d, depth) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (out.length >= 200 || e.name === '.pulsar' || e.name === 'node_modules' || e.name.startsWith('.git')) continue;
      const p = path.join(d, e.name); const r = path.relative(base, p).replace(/\\/g, '/');
      out.push(e.isDirectory() ? r + '/' : r);
      if (e.isDirectory() && depth < 2) walk(p, depth + 1);
    }
  };
  walk(base, 0);
  return out;
});
ipcMain.handle('ws:saveAs', async (_e, { name, content }) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: path.join(workspace(), name) });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, content, 'utf8'); return r.filePath;
});
function runners(f) {
  const ext = path.extname(f).toLowerCase(); const winOS = process.platform === 'win32';
  const bp = [path.join(process.resourcesPath || '', 'engine', 'python', 'python.exe'), path.join(__dirname, 'engine', 'python', 'python.exe')].find(p => { try { return fs.existsSync(p); } catch { return false; } });
  if (ext === '.py') return [...(bp ? [[bp, [f]]] : []), ...(winOS ? [['py', ['-3', f]], ['python', [f]]] : [['python3', [f]], ['python', [f]]])];
  if (ext === '.js' || ext === '.mjs') return [[process.execPath, [f], { ELECTRON_RUN_AS_NODE: '1' }]];
  if (ext === '.bat' || ext === '.cmd') return winOS ? [['cmd.exe', ['/c', f]]] : null;
  return null;
}
function runOnce(cmd, args, env, cwd) {
  return new Promise(res => {
    let out = '', done = false;
    const p = spawn(cmd, args, { cwd, windowsHide: true, env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', ...(env || {}) } });
    const add = d => { out = (out + d).slice(-12000); };
    p.stdout.on('data', add); p.stderr.on('data', add);
    try { p.stdin.end(); } catch {}
    const t = setTimeout(() => { try { p.kill(); } catch {} add('\n[stopped after 30 s]'); }, 30000);
    p.on('error', e => { if (!done) { done = true; clearTimeout(t); res({ missing: e.code === 'ENOENT', code: -1, out: e.message }); } });
    p.on('close', code => { if (!done) { done = true; clearTimeout(t); res({ code, out }); } });
  });
}
ipcMain.handle('ws:run', async (_e, rel) => {
  const f = wsPath(rel); const ext = path.extname(f).toLowerCase();
  if (!fs.existsSync(f)) throw new Error('file not found: ' + rel);
  if (ext === '.html' || ext === '.htm') return { preview: pathToFileURL(f).href };
  const list = runners(f);
  if (!list) throw new Error('cannot run ' + ext + ' files');
  let last;
  for (const [cmd, args, env] of list) {
    last = await runOnce(cmd, args, env, path.dirname(f));
    if (!last.missing && !(cmd === 'python' && last.code === 9009)) return last;
  }
  return { code: -1, out: ext === '.py' ? 'Python is not installed. Install it from python.org (tick "Add to PATH").' : last.out, noPython: ext === '.py' };
});
ipcMain.handle('ws:console', (_e, rel) => {
  const f = wsPath(rel); const ext = path.extname(f).toLowerCase(); const dir = path.dirname(f);
  const tmp = path.join(workspace(), '.pulsar'); fs.mkdirSync(tmp, { recursive: true });
  let line;
  if (ext === '.py') line = `py -3 "${f}" 2>nul || python "${f}"`;
  else if (ext === '.js' || ext === '.mjs') line = `set ELECTRON_RUN_AS_NODE=1\r\n"${process.execPath}" "${f}"`;
  else if (ext === '.html' || ext === '.htm') { shell.openPath(f); return true; }
  else line = `"${f}"`;
  const bat = path.join(tmp, 'run.bat');
  fs.writeFileSync(bat, `@echo off\r\nchcp 65001 >nul\r\ncd /d "${dir}"\r\n${line}\r\necho.\r\npause\r\n`);
  shell.openPath(bat); return true;
});

// ---------- chat proxy (no CORS limits for cloud APIs) ----------
const chats = {};
ipcMain.on('chat:start', async (_e, { id, url, key, body }) => {
  const ctl = new AbortController(); chats[id] = ctl;
  try {
    const r = await fetch(url, { method: 'POST', signal: ctl.signal,
      headers: { 'Content-Type': 'application/json', ...(key ? { Authorization: 'Bearer ' + key } : {}) }, body: JSON.stringify(body) });
    if (!r.ok) { send('chat:end', { id, error: 'HTTP ' + r.status + ' ' + (await r.text()).slice(0, 300) }); return; }
    const rd = r.body.getReader(), dec = new TextDecoder();
    for (;;) { const { done, value } = await rd.read(); if (done) break; send('chat:chunk', { id, data: dec.decode(value, { stream: true }) }); }
    send('chat:end', { id });
  } catch (err) { send('chat:end', { id, error: ctl.signal.aborted ? 'aborted' : String(err.message || err) }); }
  finally { delete chats[id]; }
});
ipcMain.on('chat:abort', (_e, id) => { if (chats[id]) chats[id].abort(); });

// ---------- free web search (DuckDuckGo), Brave if the user has a key ----------
ipcMain.handle('web:search', async (_e, { q, key }) => {
  try {
    if (key) {
      const r = await fetch('https://api.search.brave.com/res/v1/web/search?count=6&q=' + encodeURIComponent(q), { headers: { Accept: 'application/json', 'X-Subscription-Token': key } });
      if (r.ok) { const j = await r.json(); return ((j.web && j.web.results) || []).map(x => ({ title: x.title, url: x.url, text: (x.description || '').replace(/<[^>]+>/g, '') })); }
    }
    const r = await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36', 'Accept-Language': 'ru,en;q=0.8' } });
    const h = await r.text(); const out = [];
    const re = /class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g; let m;
    const clean = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    while ((m = re.exec(h)) && out.length < 6) {
      let u = m[1]; const uddg = u.match(/uddg=([^&]+)/); if (uddg) u = decodeURIComponent(uddg[1]); if (u.startsWith('//')) u = 'https:' + u;
      if (/duckduckgo\.com\/y\.js/.test(u)) continue;
      out.push({ title: clean(m[2]), url: u, text: clean(m[3]) });
    }
    return out;
  } catch (e) { return []; }
});

// links that open a new window inside the built-in browser become new tabs
app.on('web-contents-created', (_e, wc) => {
  if (wc.getType() === 'webview') wc.setWindowOpenHandler(({ url }) => { send('wv:newtab', url); return { action: 'deny' }; });
});
ipcMain.handle('open:external', (_e, url) => { if (/^https?:\/\//i.test(url)) shell.openExternal(url); return true; });

// ---------- heat guard: watch GPU/CPU temperature, slow down above the user's limits (75 °C by default) ----------
let tempTimer = null, hot = false;
function nvidiaTemp() {
  return new Promise(res => execFile('nvidia-smi', ['--query-gpu=temperature.gpu', '--format=csv,noheader,nounits'], { windowsHide: true, timeout: 4000 },
    (e, o) => res(e ? null : Math.max(...String(o).split(/\s+/).map(Number).filter(n => n > 0)) || null)));
}
async function readTemps() {
  let gpu = await nvidiaTemp().catch(() => null), cpu = null;
  if (!gpu) { try { const g = await si.graphics(); const t = (g.controllers || []).map(c => c.temperatureGpu).filter(Boolean); gpu = t.length ? Math.max(...t) : null; } catch {} }
  try { const c = await si.cpuTemperature(); cpu = c.main || c.max || null; } catch {}
  return { gpu: gpu || null, cpu: cpu || null };
}
function startTemps() {
  clearInterval(tempTimer);
  tempTimer = setInterval(async () => {
    const s = readSettings(); if (s.heat === false) { if (hot) { hot = false; send('temps', { hot: false }); } return; }
    const gl = s.gpuLimit || 75, cl = s.cpuLimit || 75;
    const t = await readTemps(); const max = Math.max(t.gpu || 0, t.cpu || 0), limit = Math.min(gl, cl);
    const over = (t.gpu || 0) >= gl || (t.cpu || 0) >= cl, cool = (t.gpu || 0) < gl - 6 && (t.cpu || 0) < cl - 6;
    const nowHot = over ? true : cool ? false : hot;
    if (nowHot !== hot) { hot = nowHot; if (server && server.pid) { try { require('os').setPriority(server.pid, hot ? 19 : 0); } catch {} } }
    send('temps', { ...t, max, hot, limit });
  }, 5000);
}
app.whenReady().then(startTemps);

// ---------- chat history ----------
const CHATS = () => { const d = path.join(DATA(), 'chats'); fs.mkdirSync(d, { recursive: true }); return d; };
const chatFile = id => path.join(CHATS(), String(id).replace(/[^\w-]/g, '') + '.json');
// list reads only the head of each file: id, title and updated are written first
function chatHead(f) {
  const fd = fs.openSync(f, 'r'); const buf = Buffer.alloc(600); const n = fs.readSync(fd, buf, 0, 600, 0); fs.closeSync(fd);
  const h = buf.toString('utf8', 0, n), m = h.match(/^\{"updated":(\d+),"id":("(?:[^"\\]|\\.)*"),"title":("(?:[^"\\]|\\.)*")/);
  if (m) return { updated: +m[1], id: JSON.parse(m[2]), title: JSON.parse(m[3]) };
  const c = JSON.parse(fs.readFileSync(f, 'utf8')); return { id: c.id, title: c.title, updated: c.updated };
}
ipcMain.handle('chats:list', () => {
  const out = [];
  for (const f of fs.readdirSync(CHATS())) {
    if (!f.endsWith('.json')) continue;
    try { out.push(chatHead(path.join(CHATS(), f))); } catch {}
  }
  return out.sort((a, b) => b.updated - a.updated).slice(0, 200);
});
ipcMain.handle('chats:get', (_e, id) => { try { return JSON.parse(fs.readFileSync(chatFile(id), 'utf8')); } catch { return null; } });
ipcMain.handle('chats:save', (_e, c) => { fs.writeFileSync(chatFile(c.id), JSON.stringify({ updated: Date.now(), id: c.id, title: c.title, ...c })); return true; });
ipcMain.handle('chats:delete', (_e, id) => { try { fs.unlinkSync(chatFile(id)); } catch {} return true; });

// ---------- error report ----------
ipcMain.on('log', (_e, line) => { try { fs.appendFileSync(path.join(DATA(), 'app.log'), `[${new Date().toISOString()}] ${String(line).slice(0, 2000)}\n`); } catch {} });
ipcMain.handle('report:make', async (_e, extra) => {
  const tail = f => { try { const t = fs.readFileSync(path.join(DATA(), f), 'utf8'); return t.slice(-15000); } catch { return '(none)'; } };
  const s = readSettings();
  const txt = [`PULSAR ${app.getVersion()}`, `Date: ${new Date().toISOString()}`, `Windows: ${require('os').release()} ${process.arch}`,
    `Hardware: ${JSON.stringify(s.hw || {})}`, `Engine: ${JSON.stringify(serverInfo)}`, `Models: ${fs.readdirSync(DIRS().models).join(', ')}`,
    `Settings: ${JSON.stringify({ lang: s.lang, engine: s.engine, opt: s.opt, heat: s.heat, heatLimit: s.heatLimit, agent: s.agent, autoAgent: s.autoAgent })}`,
    `App state: ${extra || ''}`, '', '===== engine.log =====', tail('engine.log'), '', '===== app.log =====', tail('app.log')].join('\n');
  const file = path.join(workspace(), `PULSAR-report-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.txt`);
  fs.writeFileSync(file, txt, 'utf8'); shell.showItemInFolder(file);
  return file;
});

// ---------- real checks: run what the agents wrote and collect actual errors ----------
ipcMain.handle('check:html', async (_e, code) => {
  const tmp = path.join(workspace(), '.pulsar'); fs.mkdirSync(tmp, { recursive: true });
  const f = path.join(tmp, `check-${Date.now()}.html`); fs.writeFileSync(f, code, 'utf8');
  const w = new BrowserWindow({ show: false, width: 1280, height: 800, webPreferences: { sandbox: true, contextIsolation: true, offscreen: true } });
  const errors = [];
  w.webContents.on('console-message', (_ev, level, message, line) => {
    if (level >= 3 && !/Failed to load resource|favicon|ERR_|net::/i.test(message)) errors.push(`JS error (line ${line}): ${message}`);
  });
  w.webContents.on('render-process-gone', () => errors.push('page crashed'));
  try {
    await Promise.race([w.loadFile(f), new Promise(r => setTimeout(r, 8000))]);
    await new Promise(r => setTimeout(r, 1500));
    const info = await w.webContents.executeJavaScript(`(()=>{const out=[];
      const t=(document.body&&document.body.innerText||'').trim(); if(t.length<40) out.push('the page is almost empty');
      document.querySelectorAll('a[href^="#"]').forEach(a=>{const id=a.getAttribute('href').slice(1); if(id&&!document.getElementById(id)&&!/^page-|^index$/.test(id)) out.push('link to missing section #'+id)});
      document.querySelectorAll('img').forEach(i=>{const s=i.getAttribute('src')||''; if(/placeholder|via\\.placeholder|example\\.com|your-image/i.test(s)) out.push('placeholder image: '+s)});
      if(document.documentElement.scrollWidth>window.innerWidth+5) out.push('page is wider than the screen (horizontal scroll)');
      return out.slice(0,8);})()`).catch(() => []);
    // phone width
    w.setSize(390, 844); await new Promise(r => setTimeout(r, 400));
    const mob = await w.webContents.executeJavaScript(`document.documentElement.scrollWidth>window.innerWidth+5`).catch(() => false);
    if (mob) info.push('on a phone (390px) the page scrolls sideways — make it responsive');
    errors.push(...info);
  } catch (e) { errors.push('could not open the page: ' + e.message); }
  finally { w.destroy(); try { fs.unlinkSync(f); } catch {} }
  return [...new Set(errors)].slice(0, 12);
});
ipcMain.handle('check:code', async (_e, { lang, code }) => {
  const tmp = path.join(workspace(), '.pulsar'); fs.mkdirSync(tmp, { recursive: true });
  const ext = /py/.test(lang) ? '.py' : '.js';
  const f = path.join(tmp, `check-${Date.now()}${ext}`); fs.writeFileSync(f, code, 'utf8');
  const errors = [];
  try {
    const interactive = /\binput\s*\(|readline|prompt\(/.test(code);
    const list = runners(f);
    if (!list) return [];
    if (ext === '.py') {
      for (const [cmd, args] of list) {
        const r = await runOnce(cmd, [...args.slice(0, -1), '-m', 'py_compile', f], null, tmp);
        if (r.missing || (cmd === 'python' && r.code === 9009)) continue;
        if (r.code !== 0) { errors.push('syntax error:\n' + r.out.slice(-1500)); break; }
        if (!interactive && !/tkinter|pygame|flask|fastapi|django|while\s+True/.test(code)) {
          const run = await runOnce(cmd, args, null, tmp);
          if (run.code !== 0 && /Traceback|Error/.test(run.out)) errors.push('runtime error:\n' + run.out.slice(-1500));
        }
        break;
      }
    } else {
      const [cmd, , env] = list[0];
      const r = await runOnce(cmd, ['--check', f], env, tmp);
      if (r.code !== 0) errors.push('syntax error:\n' + r.out.slice(-1500));
    }
  } finally { try { fs.unlinkSync(f); } catch {} }
  return errors;
});

// ---------- auto-update from GitHub Releases ----------
let autoUpdater = null;
try { ({ autoUpdater } = require('electron-updater')); } catch {}
app.whenReady().then(() => {
  if (!autoUpdater || !app.isPackaged) return;
  autoUpdater.autoDownload = true; autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('update-available', i => send('update', { state: 'downloading', version: i.version, percent: 0 }));
  autoUpdater.on('download-progress', p => send('update', { state: 'downloading', percent: Math.round(p.percent), got: p.transferred, total: p.total, speed: p.bytesPerSecond }));
  autoUpdater.on('update-downloaded', i => send('update', { state: 'ready', version: i.version }));
  autoUpdater.on('error', e => { try { fs.appendFileSync(path.join(DATA(), 'app.log'), `[update] ${e.message}\n`); } catch {} });
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 6 * 3600 * 1000);
});
ipcMain.handle('update:install', () => { if (autoUpdater) { stopServer(); app.isQuitting = true; autoUpdater.quitAndInstall(true, true); } });
ipcMain.handle('update:check', async () => {
  if (!autoUpdater || !app.isPackaged) return { available: false };
  try {
    const r = await Promise.race([autoUpdater.checkForUpdates(), new Promise(res => setTimeout(() => res(null), 8000))]);
    const v = r && r.updateInfo && r.updateInfo.version;
    const newer = v && v.localeCompare(app.getVersion(), undefined, { numeric: true }) > 0;
    return { available: !!newer, version: v };
  } catch (e) { return { available: false, error: e.message }; }
});
ipcMain.handle('app:version', () => app.getVersion());

// ---------- interactive run: live output + keyboard input for programs with input() ----------
const procs = {};
ipcMain.handle('run:start', async (_e, { id, rel }) => {
  const f = wsPath(rel); const ext = path.extname(f).toLowerCase();
  if (!fs.existsSync(f)) throw new Error('file not found: ' + rel);
  if (ext === '.html' || ext === '.htm') return { preview: pathToFileURL(f).href };
  const list = runners(f); if (!list) throw new Error('cannot run ' + ext + ' files');
  for (const [cmd, args, env] of list) {
    const ok = await new Promise(res => {
      let started = false, early = '';
      const p = spawn(cmd, ext === '.py' ? [args[0] === '-3' ? '-3' : null, '-u', ...args.filter(a => a !== '-3')].filter(Boolean) : args,
        { cwd: path.dirname(f), windowsHide: true, env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PYTHONUNBUFFERED: '1', ...(env || {}) } });
      p.on('error', e => { if (!started) res(false); });
      const out = d => { started = true; early += d; send('run:out', { id, data: String(d) }); };
      p.stdout.on('data', out); p.stderr.on('data', out);
      p.on('spawn', () => { procs[id] = p; setTimeout(() => res(true), 0); });
      p.on('close', code => {
        if (procs[id] === p) delete procs[id];
        if (cmd === 'python' && code === 9009) { send('run:out', { id, data: '' }); }
        send('run:exit', { id, code, missing: cmd === 'python' && code === 9009 });
      });
    });
    if (ok) return { ok: true };
  }
  return { ok: false, noPython: ext === '.py' };
});
ipcMain.handle('run:input', (_e, { id, line }) => { const p = procs[id]; if (p && p.stdin.writable) p.stdin.write(line + '\n'); return !!p; });
ipcMain.handle('run:kill', (_e, id) => { const p = procs[id]; if (p) { try { p.kill(); } catch {} delete procs[id]; } return true; });
app.on('before-quit', () => { for (const p of Object.values(procs)) { try { p.kill(); } catch {} } });


// ---------- attach files: read text from txt/code/csv/json/pdf/docx ----------
const TEXT_EXT = /\.(txt|md|csv|tsv|json|js|mjs|ts|py|html?|css|xml|yml|yaml|log|ini|bat|ps1|sql|java|c|cpp|h|cs|go|rs|php|rb|kt|swift|sh)$/i;
async function readAny(p) {
  const name = path.basename(p); const st = fs.statSync(p);
  if (st.size > 25 * 1048576) throw new Error('file is larger than 25 MB');
  let text = '';
  if (/\.pdf$/i.test(p)) { const { PDFParse } = require('pdf-parse'); const parser = new PDFParse({ data: fs.readFileSync(p) }); text = (await parser.getText()).text; await parser.destroy?.(); }
  else if (/\.docx$/i.test(p)) { text = (await require('mammoth').extractRawText({ path: p })).value; }
  else if (TEXT_EXT.test(p)) text = fs.readFileSync(p, 'utf8');
  else throw new Error('unsupported file type');
  return { name, size: st.size, text: text.slice(0, 60000), cut: text.length > 60000 };
}
ipcMain.handle('file:pick', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openFile', 'multiSelections'], filters: [{ name: 'Documents', extensions: ['txt', 'md', 'csv', 'json', 'pdf', 'docx', 'html', 'css', 'js', 'py', 'xml', 'log', 'ts', 'sql'] }, { name: 'All', extensions: ['*'] }] });
  if (r.canceled) return [];
  const out = []; for (const p of r.filePaths.slice(0, 6)) { try { out.push(await readAny(p)); } catch (e) { out.push({ name: path.basename(p), error: e.message }); } }
  return out;
});
ipcMain.handle('file:read', async (_e, paths) => { const out = []; for (const p of (paths || []).slice(0, 6)) { try { out.push(await readAny(p)); } catch (e) { out.push({ name: path.basename(p), error: e.message }); } } return out; });

// ---------- your own model from disk ----------
ipcMain.handle('model:pickLocal', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openFile'], filters: [{ name: 'GGUF model', extensions: ['gguf'] }] });
  if (r.canceled || !r.filePaths[0]) return null;
  const p = r.filePaths[0]; return { path: p, name: path.basename(p, '.gguf'), sizeGB: +(fs.statSync(p).size / 1073741824).toFixed(1) };
});

// ---------- tray + background work + notifications ----------
let tray = null, trayHinted = false;
app.whenReady().then(() => {
  try {
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'build', 'icon.png')).resize({ width: 16, height: 16 }));
    tray.setToolTip('PULSAR');
    tray.setContextMenu(Menu.buildFromTemplate([{ label: 'PULSAR', click: () => { win.show(); win.focus(); } }, { type: 'separator' }, { label: 'Quit / Выход', click: () => { app.isQuitting = true; stopServer(); app.quit(); } }]));
    tray.on('click', () => { win.show(); win.focus(); });
  } catch {}
});
app.on('browser-window-created', (_e, w) => {
  if (w !== win && win) return;
  setTimeout(() => {
    if (!win || win.__trayHooked) return; win.__trayHooked = true;
    win.on('close', ev => {
      if (app.isQuitting || readSettings().tray === false || !tray) return;
      ev.preventDefault(); win.hide();
      if (!trayHinted) { trayHinted = true; try { new Notification({ title: 'PULSAR', body: readSettings().lang === 'en' ? 'PULSAR keeps working in the background. Right-click the tray icon to quit.' : 'PULSAR продолжает работать в фоне. Выйти — правый клик по значку в трее.' }).show(); } catch {} }
    });
  }, 100);
});
app.on('before-quit', () => { app.isQuitting = true; });
ipcMain.handle('notify', (_e, { title, body }) => {
  if (win && win.isVisible() && win.isFocused()) return false;
  try { const n = new Notification({ title, body, icon: path.join(__dirname, 'build', 'icon.png') }); n.on('click', () => { win.show(); win.focus(); }); n.show(); } catch {}
  return true;
});
ipcMain.handle('ws:abs', (_e, rel) => pathToFileURL(wsPath(rel)).href);
