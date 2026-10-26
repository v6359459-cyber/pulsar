<div align="center">

# PULSAR

**Free AI agents that run on your own PC.**
No account, no subscription — download a model and start building. Connect cloud APIs too, if you want.

[**Download for Windows**](https://github.com/v6359459-cyber/pulsar/releases/latest) · [Watch the demo with sound (52 s)](https://github.com/v6359459-cyber/pulsar/releases/download/v0.9.0/PULSAR-demo.mp4) · [Русский](#по-русски)

<img src="docs/demo.gif" alt="PULSAR demo" width="880">

<sub>Demo is sped up. On a real PC a 9B model builds a site in a few minutes, not seconds.</sub>

</div>

---

## What it does

- **Runs AI locally.** Models run on your GPU or CPU with [llama.cpp](https://github.com/ggml-org/llama.cpp). Your chats and files never leave your computer.
- **Picks the right model for your hardware.** PULSAR checks your GPU, RAM and CPU, recommends a model, and tunes compression, GPU layers and context automatically.
- **Agents that actually do things.** They write files, run code, open websites and read them — inside a workspace folder you control.
- **Several agents in one request.** Send a link and say "make a site like this" — one agent studies the example, coders build it (two at once if your GPU allows), PULSAR runs the result, and another agent fixes the errors it finds.
- **Asks before saving, and every overwrite can be undone.** Nothing is written to your PC without your OK, and the previous content of any file an agent overwrites is kept (last 10 versions) so a bad edit can be rolled back.
- **Built-in browser** with tabs. Agents can click, type and scroll in it — and ask before opening every new website.
- **Code editor and output panel** on the side: edit what the agents made, run Python / JavaScript (games with keyboard input work). Python is bundled, nothing to install.
- **Attach files** (txt, pdf, docx, csv, code) and ask questions about them.
- **Projects** tab with everything your agents built; continue any project in chat, or delete one — the folder goes to the Windows recycle bin, never straight to nowhere.
- **Project memory.** Agents see the current project's folder, its files and what you asked for earlier, so "change the font on the site" edits that site instead of starting a new one. Before changing a file that exists, an agent has to read it first.
- **Export a chat**: right-click it in the history and save the whole conversation as markdown.
- **Use your own GGUF models** from disk.
- **Runs in the background** from the tray, with a Windows notification when agents finish.
- **Light and dark themes.**
- **Overheat protection.** Set the GPU and CPU limits (75 °C by default) — above them PULSAR slows the model down until the PC cools.
- **Chat history, resumable model downloads, auto-updates** (PULSAR checks for updates right after the intro and installs them by itself).
- **English and Russian** interface.

- **Design mode.** Websites are built from 25 ready shadcn/ui-style blocks (hero, pricing, menu, reviews, FAQ, dashboard…) in one of eight styles — Apple minimalism, dark tech / neon, glass and soft colors, clean corporate, brutalism, terminal, magazine and gradients. PULSAR adds the CSS and the animations, so even a small model makes a clean site. Can be turned off.
- **Any cloud API.** Paste a key from OpenRouter, Groq, Gemini, Claude, OpenAI, DeepSeek, xAI and others — PULSAR checks the key with a real request and connects every model it gives access to; you pick which one answers in the chat. Or pick the PC model, or **Together**: both answer, review each other and the best final answer comes out.
- **Vision.** Models marked "sees pictures" (Gemma 4, Qwen3.5 9B, and vision API models) understand photos and screenshots — "make a site like this screenshot".
- **Real photos on sites.** On request PULSAR picks photos from Openverse (or Pexels with your free key) and saves them next to the site.
- **Safe updates.** API keys are encrypted with Windows. If a new version fails to start twice, PULSAR rolls back to the last one that worked.
- **Boosters.** Small helper models make big ones answer 1.5–2× faster (speculative decoding) — downloaded and plugged in automatically.
- **Loop guard.** If a model starts repeating itself, PULSAR stops it.

## Agents

| Agent | What it does |
|---|---|
| **HELLO PULSAR** | Just talk: questions, advice, ideas. Remembers what you tell it about yourself. |
| **PULSAR CODE** | Websites, programs, scripts. Saves files and runs them to check. |
| **PULSAR IN PC** | Reads and searches files anywhere on the computer; creates and organizes them inside the projects folder. Never deletes. |
| **PULSAR IN BROWSER** | Searches the web, opens sites in the built-in browser, summarizes with links. |

With **Auto** on, PULSAR picks the agent for every message and chains them when a task needs more than one:

`Task received → Analysis → Plan → Processing → Check & fix → Saving`

## Image generation

A separate **Image generation** section that works like the text models: pick a model, download it, run it. Eight models in three groups, from **SD Turbo** (1 GB, draws in seconds even with no GPU) to **Qwen Image 2.1** (8.5 GB, the best at rendering text inside the picture). Every card shows whether your PC can run it. The [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp) engine downloads itself before the first image, and finished pictures stay in a gallery and in their own folder.

## Models

28 models in five groups — **For weak PCs**, **Fast**, **Code**, **Problems & logic**, **Powerful** — including Qwen3.5 9B, Gemma 4 (E4B, 12B, 26B A4B), gpt-oss 20B, DeepSeek R1 8B, Granite 4.2 8B, LFM2.5 8B-A1B, Llama 3.2 3B and the Qwen 2.5 family. Every card shows whether it fits your PC and the settings PULSAR will use.

## Requirements

- Windows 10 / 11, 64-bit
- 8 GB RAM minimum, 16 GB recommended
- Any GPU with Vulkan support (NVIDIA, AMD, Intel) is optional but much faster — 8 GB VRAM runs 7–9B models fully on the GPU
- 2–20 GB of free disk space per model

## Install

1. Download `PULSAR-Setup-x.y.z.exe` from [Releases](https://github.com/v6359459-cyber/pulsar/releases/latest).
2. Run it. Windows may warn about an unknown publisher — click **More info → Run anyway**. See [Why does my antivirus complain?](#why-does-my-antivirus-complain)
3. Pick a language, let PULSAR check your PC, and press **Download and start**.

## Why does my antivirus complain?

PULSAR is safe — the full source code is here, and every installer is built by GitHub Actions straight from this repository. Antiviruses and Windows SmartScreen still sometimes warn, for reasons that are normal for small free apps:

- **No code-signing certificate.** A certificate costs hundreds of dollars a year. Without it Windows shows "unknown publisher", and SmartScreen warns until enough people have installed the app.
- **New file, few downloads.** Antiviruses trust files by reputation. Every new version is a new file with zero reputation, so heuristics are careful with it.
- **It runs other programs.** PULSAR starts the llama.cpp engine (`llama-server.exe`) and the bundled Python to run the code agents write. Starting processes and opening a local port (127.0.0.1) looks like "suspicious behaviour" to heuristics, even though it is how local AI works.
- **It downloads files.** Models, the engine and updates are downloaded from Hugging Face and GitHub.
- **Self-updating installer.** NSIS installers with auto-update are a common false-positive target.

What you can do: check the file on [VirusTotal](https://www.virustotal.com) (usually 0–3 of ~70 engines flag it, all with generic "heuristic" names), add the PULSAR folder to your antivirus exceptions, or build it yourself from source (below). If your antivirus flags it, please report a false positive to its vendor — it helps everyone.

## Build from source

```bash
git clone https://github.com/v6359459-cyber/pulsar
cd pulsar
npm install
npm test         # smoke test: no Electron or Windows needed
npm run engine   # downloads the llama.cpp engine for Windows
npm start        # run in development
npm run build    # make the installer in ./dist
```

Releases are built by GitHub Actions (`.github/workflows/release.yml`) and published to GitHub Releases; the app updates itself from there. The workflow syntax-checks every script and runs the smoke test before it builds, so a broken release does not get published.

The llama.cpp engine version is pinned in two places that must stay in step: `LLAMA_TAG` in `main.js` and `TAG` in `scripts/fetch-engine.js`. The stable-diffusion.cpp release is pinned separately as `SD_TAG` in `main.js`; its Windows zip is found by matching the release's own asset list, so a renamed asset gives a clear error instead of a silent 404.

## Report a problem

In PULSAR open **Optimization → Report a problem**. It saves a report file (versions, hardware, engine log) — attach it to a new [issue](https://github.com/v6359459-cyber/pulsar/issues).

## Credits

[llama.cpp](https://github.com/ggml-org/llama.cpp) · [Electron](https://www.electronjs.org/) · design blocks inspired by [shadcn/ui](https://ui.shadcn.com) (MIT) · [Geist](https://vercel.com/font) font · model authors: Qwen, Google, Meta, DeepSeek, IBM, Liquid AI, OpenAI, Microsoft. Models are downloaded from Hugging Face under their own licenses.

## License

[MIT](LICENSE)

---

## По-русски

**PULSAR** — бесплатное приложение для Windows, которое запускает нейросети прямо на твоём компьютере, без облака и регистрации.

- Сам проверяет железо и советует модель, сам подбирает настройки.
- Агенты пишут сайты и программы, сохраняют файлы, запускают код и открывают сайты во встроенном браузере.
- Несколько агентов в одном запросе: один разбирает пример по ссылке, двое пишут код, PULSAR проверяет результат, ещё один агент исправляет ошибки.
- Перед сохранением на компьютер всегда спрашивает разрешение, а прошлую версию перезаписанного файла всегда можно вернуть.
- **Режим дизайна:** сайты собираются из 25 готовых блоков в стиле shadcn/ui, 8 стилей (минимализм Apple, тёмный tech / неон, стекло, корпоративный, брутализм, терминал, журнал, градиенты), стили и анимации PULSAR добавляет сам. Можно выключить.
- **Генерация фото:** отдельный раздел — качаешь модель и рисуешь прямо на ПК, от лёгкой SD Turbo до Qwen Image 2.1, которая умеет надписи по-русски.
- **Любые облачные API:** вставь ключ и дай имя — PULSAR сам определит сервис и подключит все его модели; какая отвечает, выбираешь в чате. Или модель на ПК, или «Вместе» — обе отвечают, спорят и выдают лучший итог.
- **Модели видят картинки** (Gemma 4, Qwen3.5 9B и API-модели со зрением): «сделай сайт как на скрине».
- **Настоящие фото на сайтах** с Openverse или Pexels — сохраняются в папку сайта.
- **Ключи API зашифрованы**, а если новая версия не запустится дважды — PULSAR сам вернёт прошлую.
- **Ускорители** — маленькие модели-помощники, ответы быстрее в 1,5–2 раза.
- **Память проекта:** агент видит папку проекта, её файлы и прошлые просьбы, а перед правкой обязан прочитать файл. «Поменяй шрифт на сайте» правит тот самый сайт, а не делает новый.
- **Удаление проектов** в корзину Windows и **экспорт чата** в файл по правому клику.
- Защита от перегрева (порог для видеокарты и процессора, по умолчанию 75 °C), защита от зацикливания, история чатов, докачка моделей, автообновления.

**Скачать:** [последняя версия](https://github.com/v6359459-cyber/pulsar/releases/latest). Если Windows предупредит о неизвестном издателе — «Подробнее → Выполнить в любом случае».

### Почему ругается антивирус

PULSAR безопасен: весь код открыт здесь, а установщик собирает GitHub Actions прямо из этого репозитория. Антивирусы и SmartScreen иногда предупреждают, потому что:

- **нет платной цифровой подписи** (сертификат стоит сотни долларов в год) — отсюда «неизвестный издатель»;
- **новый файл с малым числом скачиваний** — у каждой версии ещё нет «репутации»;
- **приложение запускает другие программы** — движок llama.cpp и встроенный Python для кода агентов, и открывает локальный порт 127.0.0.1. Для эвристики это выглядит подозрительно, хотя так работает любой локальный ИИ;
- **скачивает файлы** — модели, движок и обновления с Hugging Face и GitHub;
- **сам обновляется** — такие установщики часто ловят ложные срабатывания.

Что делать: проверить файл на [VirusTotal](https://www.virustotal.com), добавить папку PULSAR в исключения антивируса или собрать из исходников. Если антивирус ругается — отправь ему жалобу на ложное срабатывание.
