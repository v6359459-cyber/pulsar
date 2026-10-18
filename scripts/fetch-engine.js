// Downloads the llama.cpp engine (Vulkan + CPU builds for Windows) into ./engine before packaging.
const fs = require('fs'), path = require('path'), extract = require('extract-zip');
const TAG = process.env.LLAMA_TAG || 'b11669';
const PY = process.env.PY_VERSION || '3.12.7';
const KEEP = f => !/\.exe$/i.test(f) || /^llama-server\.exe$/i.test(f);
const KEEP_DLL = f => !/-impl\.dll$/i.test(f) || /^llama-server-impl\.dll$/i.test(f);
async function get(kind) {
  const dir = path.join(__dirname, '..', 'engine', kind);
  if (fs.existsSync(path.join(dir, 'llama-server.exe'))) return console.log(kind, 'already there');
  fs.mkdirSync(dir, { recursive: true });
  const url = `https://github.com/ggml-org/llama.cpp/releases/download/${TAG}/llama-${TAG}-bin-win-${kind}-x64.zip`;
  console.log('download', url);
  const r = await fetch(url); if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  const zip = path.join(dir, 'engine.zip'); fs.writeFileSync(zip, Buffer.from(await r.arrayBuffer()));
  await extract(zip, { dir: path.resolve(dir) }); fs.unlinkSync(zip);
  for (const f of fs.readdirSync(dir)) if (!KEEP(f) || !KEEP_DLL(f)) fs.rmSync(path.join(dir, f), { force: true, recursive: true });
  console.log(kind, 'ok:', fs.readdirSync(dir).length, 'files');
}
async function python() {
  const dir = path.join(__dirname, '..', 'engine', 'python');
  if (fs.existsSync(path.join(dir, 'python.exe'))) return console.log('python already there');
  const url = `https://www.python.org/ftp/python/${PY}/python-${PY}-embed-amd64.zip`;
  try {
    console.log('download', url);
    const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status);
    fs.mkdirSync(dir, { recursive: true }); const zip = path.join(dir, 'py.zip'); fs.writeFileSync(zip, Buffer.from(await r.arrayBuffer()));
    await extract(zip, { dir: path.resolve(dir) }); fs.unlinkSync(zip);
    console.log('python ok');
  } catch (e) { console.warn('python skipped:', e.message); }
}
// whisper.cpp (speech to text) — the voice model itself is downloaded on first use
async function whisper() {
  const dir = path.join(__dirname, '..', 'engine', 'whisper');
  if (fs.existsSync(dir) && fs.readdirSync(dir).length) return console.log('whisper already there');
  try {
    const url = 'https://github.com/ggml-org/whisper.cpp/releases/download/v1.9.2/whisper-bin-x64.zip'; // v1.9.3+ have no Windows build, so no /releases/latest
    console.log('download', url);
    const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status);
    fs.mkdirSync(dir, { recursive: true }); const zip = path.join(dir, 'w.zip'); fs.writeFileSync(zip, Buffer.from(await r.arrayBuffer()));
    await extract(zip, { dir: path.resolve(dir) }); fs.unlinkSync(zip);
    console.log('whisper ok: v1.9.2');
  } catch (e) { console.warn('whisper skipped (downloaded on first use instead):', e.message); }
}
(async () => { await get('vulkan'); await get('cpu'); await python(); await whisper(); })().catch(e => { console.error(e); process.exit(1); });
