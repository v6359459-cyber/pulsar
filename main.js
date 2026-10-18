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

// API keys are stored encrypted with Windows DPAPI (Electron safeStorage); the UI works with plain values in memory
const canEnc = () => { try { return require('electron').safeStorage.isEncryptionAvailable(); } catch { return false; } };
const enc = v => { if (!v || String(v).startsWith('enc:') || !canEnc()) return v; return 'enc:' + require('electron').safeStorage.encryptString(String(v)).toString('base64'); };
const dec = v => { if (!v || !String(v).startsWith('enc:')) return v; try { return require('electron').safeStorage.decryptString(Buffer.from(String(v).slice(4), 'base64')); } catch { return ''; } };
function secrets(s, f) {
  const o = { ...s };
  if (Array.isArray(o.apis)) o.apis = o.apis.map(a => a && a.key ? { ...a, key: f(a.key) } : a);
  if (o.searchKey) o.searchKey = f(o.searchKey);
  if (o.pexelsKey) o.pexelsKey = f(o.pexelsKey);
  return o;
}
function readSettings() { try { return secrets(JSON.parse(fs.readFileSync(SETTINGS(), 'utf8')), dec); } catch { return {}; } }
function writeSettings(s) { fs.mkdirSync(DATA(), { recursive: true }); fs.writeFileSync(SETTINGS(), JSON.stringify(secrets(s, enc), null, 2)); }
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
  try { if (fs.existsSync(SETTINGS())) writeSettings(readSettings()); } catch {}
  if (bootCheck()) return;
  createWindow();
});

// ---------- rollback: two failed starts of a new version -> install the last version that worked ----------
const REPO = 'v6359459-cyber/pulsar';
const BOOT = () => path.join(DATA(), 'boot.json');
const readBoot = () => { try { return JSON.parse(fs.readFileSync(BOOT(), 'utf8')); } catch { return {}; } };
const writeBoot = b => { try { fs.mkdirSync(DATA(), { recursive: true }); fs.writeFileSync(BOOT(), JSON.stringify(b)); } catch {} };
function bootCheck() {
  const v = app.getVersion(); let b = readBoot();
  if (b.version !== v) b = { ...b, version: v, fails: 0, pending: false };
  if (b.pending) b.fails = (b.fails || 0) + 1;
  b.pending = true; writeBoot(b);
  const force = process.env.PULSAR_TEST_ROLLBACK;
  if ((app.isPackaged || force) && b.fails >= 2 && b.okVersion && b.okVersion !== v) { rollback(b.okVersion, v); return true; }
  return false;
}
ipcMain.on('boot:ok', () => { const v = app.getVersion(); writeBoot({ ...readBoot(), version: v, pending: false, fails: 0, okVersion: v }); });
async function rollback(okV, badV) {
  writeBoot({ ...readBoot(), blocked: badV, pending: false, fails: 0 });
  const w = new BrowserWindow({ width: 520, height: 260, frame: false, resizable: false, backgroundColor: '#000000', show: true });
  const page = t => 'data:text/html;charset=utf-8,' + encodeURIComponent(`<body style="margin:0;background:#000;color:#fff;font:300 18px/1.5 Segoe UI,system-ui,sans-serif;display:flex;flex-direction:column;justify-content:center;height:100vh;padding:0 40px;box-sizing:border-box"><div style="font-size:13px;letter-spacing:.4em;color:#777;margin-bottom:14px">PULSAR</div><div id="t">${t}</div></body>`);
  const say = t => { try { w.webContents.executeJavaScript(`document.getElementById('t').innerHTML=${JSON.stringify(t)}`); } catch {} };
  await w.loadURL(page(`Версия ${badV} не запускается.<br>Возвращаю ${okV}…`));
  try {
    const url = process.env.PULSAR_TEST_ROLLBACK || `https://github.com/${REPO}/releases/download/v${okV}/PULSAR-Setup-${okV}.exe`;
    const exe = path.join(app.getPath('temp'), `PULSAR-Setup-${okV}.exe`);
    await download(url, exe, (g, t) => say(`Версия ${badV} не запускается.<br>Возвращаю ${okV}… ${t ? Math.floor(g / t * 100) : 0}%`));
    say(`Устанавливаю ${okV}…`);
    if (!process.env.PULSAR_TEST_ROLLBACK) spawn(exe, ['/S', '--force-run'], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    fs.appendFileSync(path.join(DATA(), 'app.log'), `[rollback] ${badV} -> ${okV}\n`);
    setTimeout(() => app.exit(0), 1200);
  } catch (e) {
    say(`Не получилось вернуть версию: ${String(e.message || e).slice(0, 120)}<br>Запускаю как есть…`);
    setTimeout(() => { w.close(); createWindow(); }, 2500);
  }
}
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
// vision helper file (mmproj) for models that can see pictures
ipcMain.handle('model:mmproj', async (_e, { id, repos }) => {
  const dest = path.join(DIRS().models, id + '.mmproj');
  if (fs.existsSync(dest)) return { ok: true };
  const key = id + ':mmproj'; if (jobs[key]) return { ok: false, error: 'already' };
  const ctl = new AbortController(); jobs[key] = ctl;
  try {
    let file = null, repo = null;
    for (const r of repos || []) {
      try {
        const info = await (await fetch(`https://huggingface.co/api/models/${r}`, { signal: ctl.signal })).json();
        const mm = (info.siblings || []).map(x => x.rfilename).filter(f => /mmproj/i.test(f) && f.endsWith('.gguf'));
        const pick = ['q8_0', 'f16', 'bf16', 'f32'].map(q => mm.find(f => f.toLowerCase().includes(q))).find(Boolean) || mm[0];
        if (pick) { file = pick; repo = r; break; }
      } catch (e) { if (ctl.signal.aborted) throw e; }
    }
    if (!file) return { ok: false, none: true };
    await download(`https://huggingface.co/${repo}/resolve/main/${encodeURI(file)}`, dest, (g, t) => send('model:progress', { id: key, got: g, total: t }), ctl.signal);
    return { ok: true };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
  finally { delete jobs[key]; }
});
ipcMain.handle('model:hasMmproj', (_e, id) => fs.existsSync(path.join(DIRS().models, id + '.mmproj')));
ipcMain.handle('model:cancel', (_e, id) => { if (jobs[id]) jobs[id].abort(); return true; });
ipcMain.handle('model:local', () => fs.readdirSync(DIRS().models).filter(f => f.endsWith('.gguf')).map(f => f.replace(/\.gguf$/, '')));
ipcMain.handle('model:delete', (_e, id) => { if (serverInfo && serverInfo.id === id) stopServer(); for (const f of [id + '.gguf', id + '.gguf.part', id + '.mmproj', id + '.mmproj.part']) { try { fs.unlinkSync(path.join(DIRS().models, f)); } catch {} } return true; });
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
  if (opts.mmproj) { const mp = path.join(DIRS().models, opts.id + '.mmproj'); if (fs.existsSync(mp)) args.push('--mmproj', mp); }
  if (opts.draft && !opts.mmproj) { const dp = path.join(DIRS().models, opts.draft + '.gguf'); if (fs.existsSync(dp)) args.push('-md', dp, '-ngld', kind === 'vulkan' ? '99' : '0', '--draft-max', '16', '--draft-min', '1'); }
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
      serverInfo = { id: opts.id, kind, port: PORT, ngl: o.ngl, slots: o.slots || 1, vision: !!o.mmproj };
      send('engine:status', { stage: 'ready', kind });
      return { ok: true, kind, port: PORT, slots: o.slots || 1, spec: !!o.draft && !o.mmproj, specErr, vision: !!o.mmproj };
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
// ---------- cloud APIs: any OpenAI-compatible provider, Gemini (compat endpoint) and Anthropic (native) ----------
const PROVIDERS = [
  { re: /^sk-or-/, name: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
  { re: /^sk-ant-/, name: 'Anthropic', url: 'https://api.anthropic.com/v1', kind: 'anthropic' },
  { re: /^gsk_/, name: 'Groq', url: 'https://api.groq.com/openai/v1' },
  { re: /^AIza/, name: 'Google Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai' },
  { re: /^xai-/, name: 'xAI Grok', url: 'https://api.x.ai/v1' },
  { re: /^nvapi-/, name: 'NVIDIA', url: 'https://integrate.api.nvidia.com/v1' },
  { re: /^hf_/, name: 'Hugging Face', url: 'https://router.huggingface.co/v1' },
  { re: /^csk-/, name: 'Cerebras', url: 'https://api.cerebras.ai/v1' },
  { re: /^fw_/, name: 'Fireworks', url: 'https://api.fireworks.ai/inference/v1' },
  { re: /^pplx-/, name: 'Perplexity', url: 'https://api.perplexity.ai' },
  { re: /^sk-proj-|^sk-svcacct-/, name: 'OpenAI', url: 'https://api.openai.com/v1' }
];
// keys without a clear prefix are tried against these one by one
const GUESS = [
  { name: 'OpenAI', url: 'https://api.openai.com/v1' }, { name: 'DeepSeek', url: 'https://api.deepseek.com/v1' },
  { name: 'Moonshot (Kimi)', url: 'https://api.moonshot.ai/v1' }, { name: 'Mistral', url: 'https://api.mistral.ai/v1' },
  { name: 'Together', url: 'https://api.together.xyz/v1' }, { name: 'SambaNova', url: 'https://api.sambanova.ai/v1' },
  { name: 'Qwen (DashScope)', url: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1' }, { name: 'Zhipu GLM', url: 'https://api.z.ai/api/paas/v4' }
];
const apiHeaders = (p, key) => p.kind === 'anthropic'
  ? { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' }
  : { ...(key ? { Authorization: 'Bearer ' + key } : {}), 'Content-Type': 'application/json', 'HTTP-Referer': 'https://github.com/v6359459-cyber/pulsar', 'X-Title': 'PULSAR' };
function apiError(status, text) {
  const t = String(text || '').slice(0, 300);
  if (status === 401) return 'Ключ неверный или отозван (401)';
  if (status === 402) return 'На счету API нет денег (402)';
  if (status === 403) return 'Нет доступа: ключ не подходит или регион заблокирован (403)';
  if (status === 404) return 'Адрес API не найден (404) — проверь ссылку';
  if (status === 429) return 'Лимит запросов или квота закончилась (429)';
  if (status >= 500) return `Сервер API сейчас не работает (${status})`;
  return `Ошибка ${status}: ${t}`;
}
async function listModels(p, key) {
  const r = await fetch(p.url.replace(/\/$/, '') + '/models' + (p.kind === 'anthropic' ? '?limit=100' : ''), { headers: apiHeaders(p, key), signal: AbortSignal.timeout(15000) });
  if (!r.ok) { const e = new Error(apiError(r.status, await r.text().catch(() => ''))); e.status = r.status; throw e; }
  const j = await r.json(); const arr = Array.isArray(j) ? j : j.data || j.models || [];
  return arr.map(m => {
    const id = String(m.id || m.name || '').replace(/^models\//, ''); if (!id) return null;
    const pr = m.pricing || {}; const free = /:free$/.test(id) || (pr.prompt === '0' && pr.completion === '0');
    return { id, name: m.display_name || m.name && m.name !== m.id ? (m.display_name || m.name) : id, free, ctx: m.context_length || m.context_window || null };
  }).filter(Boolean).filter(m => !/embed|whisper|tts|dall-e|image|audio|moderation|rerank|transcribe|realtime|guard/i.test(m.id));
}
ipcMain.handle('api:check', async (_e, { key, url }) => {
  key = String(key || '').trim(); url = String(url || '').trim().replace(/\/(chat\/completions|models)\/?$/, '').replace(/\/$/, '');
  if (!key && !url) return { ok: false, error: 'Вставь ключ API' };
  if (/\s/.test(key)) return { ok: false, error: 'В ключе есть пробелы или переносы строк — скопируй его заново' };
  let cands;
  if (url) { const known = PROVIDERS.find(p => url.startsWith(p.url)); cands = [{ name: known ? known.name : (url.match(/\/\/([^/]+)/) || [])[1] || 'API', url, kind: /anthropic\.com/.test(url) ? 'anthropic' : undefined }]; }
  else { const p = PROVIDERS.find(p => p.re.test(key)); cands = p ? [p] : GUESS; }
  let last = 'Не удалось определить, от какого сервиса этот ключ. Укажи адрес API вручную.', authErr = null;
  for (const p of cands) {
    try {
      const models = await listModels(p, key);
      if (!models.length) { last = 'Ключ работает, но у него нет доступных моделей'; continue; }
      models.sort((a, b) => (b.free - a.free) || a.id.localeCompare(b.id));
      return { ok: true, provider: p.name, url: p.url, kind: p.kind || 'openai', models };
    } catch (e) {
      if (e.name === 'TimeoutError' || /fetch failed|ENOTFOUND|ECONN/i.test(String(e.message) + String(e.cause))) { last = cands.length === 1 ? 'Нет связи с сервером API — проверь интернет или адрес' : last; continue; }
      if (cands.length === 1 || e.status !== 401) authErr = authErr || e.message; 
    }
  }
  return { ok: false, error: authErr || last };
});
// a tiny real request, so "connected" means the model really answers
ipcMain.handle('api:ping', async (_e, a) => {
  try {
    const p = { url: a.url, kind: a.kind };
    const body = a.kind === 'anthropic' ? { model: a.model, max_tokens: 5, messages: [{ role: 'user', content: 'Hi' }] } : { model: a.model, max_tokens: 5, messages: [{ role: 'user', content: 'Hi' }] };
    const r = await fetch(a.url.replace(/\/$/, '') + (a.kind === 'anthropic' ? '/messages' : '/chat/completions'), { method: 'POST', headers: apiHeaders(p, a.key), body: JSON.stringify(body), signal: AbortSignal.timeout(45000) });
    if (!r.ok) return { ok: false, error: apiError(r.status, await r.text().catch(() => '')) + ' · ' + a.model };
    return { ok: true };
  } catch (e) { return { ok: false, error: e.name === 'TimeoutError' ? 'Модель не ответила за 45 секунд' : 'Нет связи с сервером API' }; }
});
// Anthropic native stream -> OpenAI-style SSE, so the UI parser stays the same
async function anthropicChat(id, url, key, body, ctl) {
  const txt = c => Array.isArray(c) ? c.filter(x => x.type === 'text').map(x => x.text).join('\n') : String(c || '');
  const parts = c => !Array.isArray(c) ? [{ type: 'text', text: String(c || '') }] : c.map(x => {
    if (x.type !== 'image_url') return { type: 'text', text: x.text || '' };
    const m = String(x.image_url && x.image_url.url || '').match(/^data:([^;]+);base64,(.*)$/);
    return m ? { type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } } : { type: 'image', source: { type: 'url', url: x.image_url.url } };
  });
  const sys = body.messages.filter(m => m.role === 'system').map(m => txt(m.content)).join('\n\n');
  const msgs = []; for (const m of body.messages.filter(m => m.role !== 'system')) { const l = msgs[msgs.length - 1]; if (l && l.role === m.role) l.content.push(...parts(m.content)); else msgs.push({ role: m.role, content: parts(m.content) }); }
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  const r = await fetch(url.replace(/\/$/, '') + '/messages', { method: 'POST', signal: ctl.signal, headers: apiHeaders({ kind: 'anthropic' }, key),
    body: JSON.stringify({ model: body.model, max_tokens: body.max_tokens || 8192, stream: true, system: sys || undefined, messages: msgs, temperature: body.temperature }) });
  if (!r.ok) { send('chat:end', { id, error: apiError(r.status, await r.text()) }); return; }
  const rd = r.body.getReader(), dec = new TextDecoder(); let buf = '';
  const out = o => send('chat:chunk', { id, data: 'data: ' + JSON.stringify(o) + '\n\n' });
  for (;;) {
    const { done, value } = await rd.read(); if (done) break;
    buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop();
    for (const ln of lines) {
      if (!ln.startsWith('data:')) continue; let j; try { j = JSON.parse(ln.slice(5)); } catch { continue; }
      if (j.type === 'content_block_delta' && j.delta) { if (j.delta.type === 'text_delta') out({ choices: [{ delta: { content: j.delta.text } }] }); else if (j.delta.type === 'thinking_delta') out({ choices: [{ delta: { reasoning_content: j.delta.thinking } }] }); }
      else if (j.type === 'message_delta' && j.delta && j.delta.stop_reason) out({ choices: [{ delta: {}, finish_reason: j.delta.stop_reason === 'max_tokens' ? 'length' : 'stop' }] });
      else if (j.type === 'error') { send('chat:end', { id, error: (j.error && j.error.message) || 'error' }); return; }
    }
  }
  send('chat:end', { id });
}
ipcMain.on('chat:start', async (_e, { id, url, key, body, kind }) => {
  const ctl = new AbortController(); chats[id] = ctl;
  try {
    if (kind === 'anthropic') { await anthropicChat(id, url, key, body, ctl); return; }
    const local = /127\.0\.0\.1|localhost/.test(url);
    const r = await fetch(url, { method: 'POST', signal: ctl.signal,
      headers: local ? { 'Content-Type': 'application/json' } : apiHeaders({}, key), body: JSON.stringify(body) });
    if (!r.ok) { const t = await r.text(); send('chat:end', { id, error: local ? 'HTTP ' + r.status + ' ' + t.slice(0, 300) : apiError(r.status, t) }); return; }
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
  autoUpdater.autoDownload = false; autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('update-available', i => { if (i.version === readBoot().blocked) return; send('update', { state: 'downloading', version: i.version, percent: 0 }); autoUpdater.downloadUpdate().catch(() => {}); });
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
    const newer = v && v !== readBoot().blocked && v.localeCompare(app.getVersion(), undefined, { numeric: true }) > 0;
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


// ---------- photos for websites: Openverse (free, no key) or Pexels (user's free key) ----------
const PHOTO_API = () => process.env.PULSAR_TEST_PHOTOS || null;
ipcMain.handle('photos:find', async (_e, { q, n, key }) => {
  const out = [];
  try {
    if (key) {
      const r = await fetch((PHOTO_API() || 'https://api.pexels.com/v1') + `/search?per_page=${n || 3}&orientation=landscape&query=` + encodeURIComponent(q), { headers: { Authorization: key }, signal: AbortSignal.timeout(15000) });
      if (r.ok) for (const p of (await r.json()).photos || []) out.push({ url: p.src.large2x || p.src.large, by: p.photographer, src: 'Pexels', link: p.url });
    }
    if (!out.length) {
      const r = await fetch((PHOTO_API() || 'https://api.openverse.org/v1') + `/images/?page_size=${(n || 3) * 2}&license_type=commercial&aspect_ratio=wide&mature=false&q=` + encodeURIComponent(q), { headers: { 'User-Agent': 'PULSAR' }, signal: AbortSignal.timeout(15000) });
      if (r.ok) for (const p of (await r.json()).results || []) if (p.url && /\.(jpe?g|png|webp)(\?|$)/i.test(p.url) || p.thumbnail) out.push({ url: p.url, thumb: p.thumbnail, by: p.creator || '', src: 'Openverse', license: (p.license || '').toUpperCase(), link: p.foreign_landing_url });
    }
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
  return { ok: true, photos: out.slice(0, n || 3) };
});
// download a picture straight into the workspace (only after the user allowed saving)
ipcMain.handle('ws:download', async (_e, { url, rel, alt }) => {
  const dest = wsPath(rel); fs.mkdirSync(path.dirname(dest), { recursive: true });
  for (const u of [url, alt].filter(Boolean)) {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': 'PULSAR' }, signal: AbortSignal.timeout(30000) });
      if (!r.ok || !/^image\//.test(r.headers.get('content-type') || 'image/')) continue;
      const b = Buffer.from(await r.arrayBuffer()); if (b.length < 2000 || b.length > 8 * 1048576) continue;
      fs.writeFileSync(dest, b); return { ok: true };
    } catch {}
  }
  return { ok: false };
});

// ---------- voice: whisper.cpp + ggml-small, downloaded on first use ----------
const VOICE = () => path.join(DATA(), 'voice');
// newer whisper.cpp releases (v1.9.3+) ship sources only, so /releases/latest has no Windows build: pin the last one that does
const WHISPER_URL = 'https://github.com/ggml-org/whisper.cpp/releases/download/v1.9.2/whisper-bin-x64.zip';
function whisperExe() {
  const bundled = path.join(process.resourcesPath || '', 'engine', 'whisper'), dev = path.join(__dirname, 'engine', 'whisper');
  for (const d of [bundled, dev, VOICE()]) { if (!fs.existsSync(d)) continue; const f = findFile(d, 'whisper-cli.exe') || findFile(d, 'main.exe'); if (f) return f; }
  return null;
}
ipcMain.handle('voice:status', () => ({ exe: !!whisperExe(), model: fs.existsSync(path.join(VOICE(), 'ggml-small.bin')) }));
ipcMain.handle('voice:setup', async () => {
  try {
    fs.mkdirSync(VOICE(), { recursive: true });
    if (!whisperExe()) {
      const zip = path.join(VOICE(), 'w.zip');
      await download(WHISPER_URL, zip, (g, t) => send('voice:progress', { part: 'bin', got: g, total: t }));
      await unzip(zip, VOICE()); try { fs.unlinkSync(zip); } catch {}
      if (!whisperExe()) throw new Error('whisper-cli.exe not found');
    }
    const m = path.join(VOICE(), 'ggml-small.bin');
    if (!fs.existsSync(m)) await download('https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin', m, (g, t) => send('voice:progress', { part: 'model', got: g, total: t }));
    return { ok: true };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
});
ipcMain.handle('voice:transcribe', async (_e, { wav, lang }) => {
  const exe = whisperExe(), model = path.join(VOICE(), 'ggml-small.bin');
  if (!exe || !fs.existsSync(model)) return { ok: false, error: 'not installed' };
  const f = path.join(app.getPath('temp'), `pulsar-voice-${Date.now()}.wav`);
  fs.writeFileSync(f, Buffer.from(wav));
  try {
    const threads = String(Math.max(2, Math.min(8, require('os').cpus().length - 2)));
    const out = await new Promise((res, rej) => execFile(exe, ['-m', model, '-f', f, '-l', lang || 'auto', '-nt', '-np', '-t', threads], { windowsHide: true, timeout: 120000, maxBuffer: 4 << 20, cwd: path.dirname(exe) },
      (e, so, se) => e ? rej(new Error((se || e.message).slice(-300))) : res(so)));
    return { ok: true, text: String(out).replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim() };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
  finally { try { fs.unlinkSync(f); } catch {} }
});

// ---------- attach files: read text from txt/code/csv/json/pdf/docx ----------
const TEXT_EXT = /\.(txt|md|csv|tsv|json|js|mjs|ts|py|html?|css|xml|yml|yaml|log|ini|bat|ps1|sql|java|c|cpp|h|cs|go|rs|php|rb|kt|swift|sh)$/i;
async function readAny(p) {
  const name = path.basename(p); const st = fs.statSync(p);
  if (st.size > 25 * 1048576) throw new Error('file is larger than 25 MB');
  const im = (p.match(/\.(png|jpe?g|webp|gif|bmp)$/i) || [])[1];
  if (im) { if (st.size > 12 * 1048576) throw new Error('picture is larger than 12 MB'); return { name, size: st.size, image: `data:image/${im.toLowerCase().replace('jpg', 'jpeg')};base64,` + fs.readFileSync(p).toString('base64') }; }
  let text = '';
  if (/\.pdf$/i.test(p)) { const { PDFParse } = require('pdf-parse'); const parser = new PDFParse({ data: fs.readFileSync(p) }); text = (await parser.getText()).text; await parser.destroy?.(); }
  else if (/\.docx$/i.test(p)) { text = (await require('mammoth').extractRawText({ path: p })).value; }
  else if (TEXT_EXT.test(p)) text = fs.readFileSync(p, 'utf8');
  else throw new Error('unsupported file type');
  return { name, size: st.size, text: text.slice(0, 60000), cut: text.length > 60000 };
}
ipcMain.handle('file:pick', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openFile', 'multiSelections'], filters: [{ name: 'Files', extensions: ['txt', 'md', 'csv', 'json', 'pdf', 'docx', 'html', 'css', 'js', 'py', 'xml', 'log', 'ts', 'sql', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'] }, { name: 'All', extensions: ['*'] }] });
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
