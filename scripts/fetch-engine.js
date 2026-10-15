// Downloads the llama.cpp engine (Vulkan + CPU builds for Windows) into ./engine before packaging.
const fs = require('fs'), path = require('path'), extract = require('extract-zip');
const TAG = process.env.LLAMA_TAG || 'b11669';
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
(async () => { await get('vulkan'); await get('cpu'); })().catch(e => { console.error(e); process.exit(1); });
