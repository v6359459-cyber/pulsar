<div align="center">

# PULSAR

**Free AI agents that run on your own PC.**
No cloud, no account, no subscription — download a model and start building.

[**Download for Windows**](https://github.com/v6359459-cyber/pulsar/releases/latest) · [Watch the demo (52 s)](docs/demo.mp4) · [Русский](#по-русски)

<img src="docs/demo.gif" alt="PULSAR demo" width="880">

<sub>Demo is sped up. On a real PC a 9B model builds a site in a few minutes, not seconds.</sub>

</div>

---

## What it does

- **Runs AI locally.** Models run on your GPU or CPU with [llama.cpp](https://github.com/ggml-org/llama.cpp). Your chats and files never leave your computer.
- **Picks the right model for your hardware.** PULSAR checks your GPU, RAM and CPU, recommends a model, and tunes compression, GPU layers and context automatically.
- **Agents that actually do things.** They write files, run code, open websites and read them — inside a workspace folder you control.
- **Several agents in one request.** Send a link and say "make a site like this" — one agent studies the example, coders build it (two at once if your GPU allows), PULSAR runs the result, and another agent fixes the errors it finds.
- **Asks before saving.** Nothing is written to your PC without your OK.
- **Built-in browser** with tabs, and an output panel for running Python / JavaScript.
- **Overheat protection.** Above 80 °C PULSAR lowers its load and waits for your PC to cool down.
- **Chat history, resumable model downloads, auto-updates.**
- **English and Russian** interface.

## Agents

| Agent | What it does |
|---|---|
| **PULSAR CODE** | Websites, programs, scripts. Saves files and runs them to check. |
| **FILE SUP** | Lists, reads, creates and organizes files in the workspace. Never deletes. |
| **PULSAR IN BROWSER** | Searches the web, opens sites in the built-in browser, summarizes with links. |

With **Auto** on, PULSAR picks the agent for every message and chains them when a task needs more than one:

`Task received → Analysis → Plan → Processing → Check & fix → Saving`

## Models

18 models in four groups — **Fast**, **Code**, **Problems & logic**, **Powerful** — including Qwen3.5 9B, Gemma 4 (E4B, 12B, 26B A4B), gpt-oss 20B, DeepSeek R1 8B, Granite 4.2 8B, LFM2.5 8B-A1B, Llama 3.2 3B and the Qwen 2.5 family. Every card shows whether it fits your PC and the settings PULSAR will use.

## Requirements

- Windows 10 / 11, 64-bit
- 8 GB RAM minimum, 16 GB recommended
- Any GPU with Vulkan support (NVIDIA, AMD, Intel) is optional but much faster — 8 GB VRAM runs 7–9B models fully on the GPU
- 2–20 GB of free disk space per model

## Install

1. Download `PULSAR-Setup-x.y.z.exe` from [Releases](https://github.com/v6359459-cyber/pulsar/releases/latest).
2. Run it. Windows may warn about an unknown publisher (the installer is not code-signed yet) — click **More info → Run anyway**.
3. Pick a language, let PULSAR check your PC, and press **Download and start**.

## Build from source

```bash
git clone https://github.com/v6359459-cyber/pulsar
cd pulsar
npm install
npm run engine   # downloads the llama.cpp engine for Windows
npm start        # run in development
npm run build    # make the installer in ./dist
```

Releases are built automatically by GitHub Actions when a `v*` tag is pushed.

## Report a problem

In PULSAR open **Optimization → Report a problem**. It saves a report file (versions, hardware, engine log) — attach it to a new [issue](https://github.com/v6359459-cyber/pulsar/issues).

## Credits

[llama.cpp](https://github.com/ggml-org/llama.cpp) · [Electron](https://www.electronjs.org/) · [Geist](https://vercel.com/font) font · model authors: Qwen, Google, Meta, DeepSeek, IBM, Liquid AI, OpenAI, Microsoft. Models are downloaded from Hugging Face under their own licenses.

## License

[MIT](LICENSE)

---

## По-русски

**PULSAR** — бесплатное приложение для Windows, которое запускает нейросети прямо на твоём компьютере, без облака и регистрации.

- Сам проверяет железо и советует модель, сам подбирает настройки.
- Агенты пишут сайты и программы, сохраняют файлы, запускают код и открывают сайты во встроенном браузере.
- Несколько агентов в одном запросе: один разбирает пример по ссылке, двое пишут код, PULSAR проверяет результат, ещё один агент исправляет ошибки.
- Перед сохранением на компьютер всегда спрашивает разрешение.
- Защита от перегрева, история чатов, докачка моделей, автообновления.

**Скачать:** [последняя версия](https://github.com/v6359459-cyber/pulsar/releases/latest). Если Windows предупредит о неизвестном издателе — «Подробнее → Выполнить в любом случае».
