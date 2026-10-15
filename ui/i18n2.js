Object.assign(I18N.ru, {
  stThinking: 'Думает', stWriting: 'Пишет ответ', stCode: 'Пишет код', stFile: 'Создаёт файл', stAction: 'Готовит действие',
  aFile: 'Файл', aRun: 'Запуск', aRead: 'Чтение', aList: 'Папка', aOpen: 'Сайт',
  sWait: 'ожидает', sAsk: 'нужно разрешение', sWork: 'выполняется', sDone: 'готово', sDenied: 'отклонено', sError: 'ошибка',
  allow: 'Разрешить', deny: 'Отклонить', copy: 'Копировать', copied: 'Скопировано', saveFile: 'Сохранить', run: 'Запустить', inConsole: 'В консоли', open: 'Открыть',
  results: 'Результаты действий', browser: 'Браузер', output: 'Вывод', folder: 'Папка', changeFolder: 'Сменить папку',
  autoAct: 'Авто-действия', endChat: 'Завершить', ended: 'Чат завершён, модель выгружена из памяти',
  secOurs: 'От создателя PULSAR', secOthers: 'От других разработчиков', byPulsar: 'PULSAR',
  needKey: 'нужен ключ', keyOk: 'ключ добавлен', keyFor: 'Ключ для', keyWhere: 'Где взять ключ:', modelName: 'Модель',
  chosen: 'выбран', noKey: 'Добавь ключ во вкладке «Агенты»', addrPh: 'Адрес сайта', wsLbl: 'Рабочая папка',
  aSearch: 'Поиск', newTab: 'Новая вкладка', openExt: 'Открыть в обычном браузере',
  noPython: 'Python не установлен. Скачай с python.org и отметь «Add to PATH».'
});
Object.assign(I18N.en, {
  stThinking: 'Thinking', stWriting: 'Writing', stCode: 'Writing code', stFile: 'Creating file', stAction: 'Preparing action',
  aFile: 'File', aRun: 'Run', aRead: 'Read', aList: 'Folder', aOpen: 'Website',
  sWait: 'waiting', sAsk: 'needs permission', sWork: 'running', sDone: 'done', sDenied: 'declined', sError: 'error',
  allow: 'Allow', deny: 'Decline', copy: 'Copy', copied: 'Copied', saveFile: 'Save', run: 'Run', inConsole: 'In console', open: 'Open',
  results: 'Action results', browser: 'Browser', output: 'Output', folder: 'Folder', changeFolder: 'Change folder',
  autoAct: 'Auto-actions', endChat: 'End', ended: 'Chat ended, model unloaded from memory',
  secOurs: 'By the creator of PULSAR', secOthers: 'By other developers', byPulsar: 'PULSAR',
  needKey: 'key needed', keyOk: 'key added', keyFor: 'Key for', keyWhere: 'Get a key:', modelName: 'Model',
  chosen: 'selected', noKey: 'Add a key in Agents', addrPh: 'Website address', wsLbl: 'Workspace',
  aSearch: 'Search', newTab: 'New tab', openExt: 'Open in your browser',
  noPython: 'Python is not installed. Get it from python.org and tick "Add to PATH".'
});

// id, name, description, system prompt, uses tools
AGENTS.ru = [
  ['coder', 'Кодер', 'Пишет код, сам создаёт файлы проекта и запускает их.', 'Ты опытный программист. Пиши рабочий, понятный код. Сохраняй код в файлы и запускай его, чтобы проверить. Объясняй коротко.', true],
  ['research', 'Исследователь', 'Ищет в интернете, читает сайты и делает выжимку.', 'Ты исследователь. Открывай нужные сайты, отделяй факты от догадок, в конце давай короткий вывод со ссылками.', true],
  ['writer', 'Редактор', 'Пишет, сокращает и переписывает тексты.', 'Ты редактор. Пиши ясно и живо, без воды, сохраняй смысл и тон автора. Если просят сохранить текст — сохрани его в файл.', true],
  ['files', 'Файловый помощник', 'Создаёт, читает и раскладывает файлы в рабочей папке.', 'Ты файловый помощник. Работай с файлами в рабочей папке: смотри список, читай, создавай и переписывай файлы. Ничего не удаляй.', true],
  ['translator', 'Переводчик', 'Переводит тексты с сохранением смысла и стиля.', 'Ты переводчик. Переводи точно и естественно, сохраняй форматирование. Если язык не указан — переводи на русский, а русский текст — на английский.', false],
  ['browser', 'Браузерный агент', 'Открывает сайты во встроенном браузере и читает их.', 'Ты браузерный агент. Открывай сайты во встроенном браузере, читай их и отвечай по ним.', true]
];
AGENTS.en = [
  ['coder', 'Coder', 'Writes code, creates project files and runs them.', 'You are an experienced programmer. Write working, clear code. Save code to files and run it to check. Explain briefly.', true],
  ['research', 'Researcher', 'Searches the web, reads sites, summarizes.', 'You are a researcher. Open the right websites, separate facts from guesses, end with a short conclusion with links.', true],
  ['writer', 'Editor', 'Writes, shortens and rewrites texts.', 'You are an editor. Write clearly and vividly, no filler, keep meaning and tone. If asked to save text, save it to a file.', true],
  ['files', 'File assistant', 'Creates, reads and organizes files in the workspace.', 'You are a file assistant. Work with files in the workspace: list, read, create and rewrite files. Never delete anything.', true],
  ['translator', 'Translator', 'Translates keeping meaning and style.', 'You are a translator. Translate accurately and naturally, keep formatting. If no language is given, translate to English, and English text to Russian.', false],
  ['browser', 'Browser agent', 'Opens websites in the built-in browser and reads them.', 'You are a browser agent. Open websites in the built-in browser, read them and answer from them.', true]
];

// Agents from other developers: run through the user's own key
const PROVIDERS_ALL = [
  { id: 'claude', name: 'Claude', by: 'Anthropic', url: 'https://api.anthropic.com/v1', model: 'claude-sonnet-5-5', site: 'console.anthropic.com',
    ru: 'Сильный агент для кода в духе Claude Code: планирует, пишет и проверяет.', en: 'Strong coding agent in the spirit of Claude Code: plans, writes, checks.' },
  { id: 'gpt', name: 'GPT', by: 'OpenAI', url: 'https://api.openai.com/v1', model: 'gpt-5-mini', site: 'platform.openai.com',
    ru: 'Универсальный агент: код, тексты, разбор задач.', en: 'All-round agent: code, writing, problem solving.' },
  { id: 'gemini', name: 'Gemini', by: 'Google', url: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash', site: 'aistudio.google.com',
    ru: 'Быстрый агент с большим контекстом. Есть бесплатный ключ.', en: 'Fast agent with a large context. Free key available.' },
  { id: 'codestral', name: 'Codestral', by: 'Mistral AI', url: 'https://codestral.mistral.ai/v1', model: 'codestral-latest', site: 'console.mistral.ai',
    ru: 'Агент только для кода. Есть бесплатный ключ.', en: 'Code-only agent. Free key available.' },
  { id: 'deepseek', name: 'DeepSeek', by: 'DeepSeek', url: 'https://api.deepseek.com/v1', model: 'deepseek-chat', site: 'platform.deepseek.com',
    ru: 'Недорогой и сильный агент для кода и рассуждений.', en: 'Cheap and strong agent for code and reasoning.' }
];

const TOOLS_PROMPT = `
You work inside PULSAR on the user's Windows PC and you CAN act on it inside the workspace folder. Never say you have no access to the PC; act instead.
To act, write one or more blocks exactly in this format (paths are relative to the workspace folder):
\`\`\`file:folder/name.ext
full file content
\`\`\`
\`\`\`run:name.py
\`\`\`
\`\`\`read:name.ext
\`\`\`
\`\`\`list:.
\`\`\`
\`\`\`open:https://example.com
\`\`\`
\`\`\`search:what to look up
\`\`\`
file: creates or overwrites a file. run: runs a .py or .js file (stdin is closed, so avoid input(); use fixed example values) or opens an .html file in the built-in preview. read: reads a file. list: lists a folder. open: opens a website in the built-in browser and gives you its text. search: searches the internet and gives you results with links.
When the user asks to make a website or program, write the COMPLETE code in one file block (for a site: one html file with CSS and JS inside, modern clean design). When the user asks to open a site, use open:. Never answer that you cannot save files, open websites or access the internet: you can, with these blocks.
After your blocks, stop. The results come back to you in the next message; then continue or give the final answer. Do not repeat a block that already succeeded. Answer in the user's language.`;
const PROVIDERS = [];

Object.assign(I18N.ru, { autoModel: 'Авто', autoModelD: 'PULSAR сам выбирает лучшую скачанную модель под задачу', autoPick: 'модель выберется сама', switching: 'Переключаю модель на', stContinue: 'Дописываю',
  cloudFree: 'Облачные · бесплатно', kimiD: 'Очень сильная модель от Moonshot AI. Работает через интернет, на ПК ничего не скачивается. Нужен бесплатный ключ OpenRouter.', kimiHow: 'Ключ бесплатный:' });
Object.assign(I18N.en, { autoModel: 'Auto', autoModelD: 'PULSAR picks the best downloaded model for the task', autoPick: 'model is picked automatically', switching: 'Switching model to', stContinue: 'Continuing',
  cloudFree: 'Cloud · free', kimiD: 'Very strong model by Moonshot AI. Runs online, nothing is downloaded. Needs a free OpenRouter key.', kimiHow: 'The key is free:' });
AGENTS.ru = [
  ['coder', 'PULSAR CODE', 'Пишет код, сайты и программы. Сам сохраняет файлы и запускает их.', 'Ты PULSAR CODE — сильный программист и веб-дизайнер. Пиши полный рабочий код без сокращений и заглушек. Сайт — один полный HTML-файл со встроенными CSS и JS: современный дизайн, крупная типографика, много воздуха, плавные анимации, адаптивность. Сохраняй файлы и запускай код, чтобы проверить. Объясняй коротко.', true],
  ['files', 'FILE SUP', 'Создаёт, читает и раскладывает файлы в рабочей папке.', 'Ты FILE SUP — помощник по файлам. Работай с файлами в рабочей папке: смотри список, читай, создавай и переписывай. Ничего не удаляй.', true],
  ['browser', 'PULSAR IN BROWSER', 'Ищет в интернете, открывает сайты во встроенном браузере и делает выжимку.', 'Ты PULSAR IN BROWSER — агент для интернета. Ищи информацию, открывай сайты во встроенном браузере, читай их, отделяй факты от догадок и давай короткий вывод со ссылками.', true]
];
AGENTS.en = [
  ['coder', 'PULSAR CODE', 'Writes code, websites and programs. Saves and runs files itself.', 'You are PULSAR CODE, a strong programmer and web designer. Write complete working code with no placeholders. A website is one complete HTML file with embedded CSS and JS: modern design, large type, whitespace, smooth animations, responsive. Save files and run code to check. Explain briefly.', true],
  ['files', 'FILE SUP', 'Creates, reads and organizes files in the workspace.', 'You are FILE SUP, a file assistant. Work with files in the workspace: list, read, create and rewrite. Never delete anything.', true],
  ['browser', 'PULSAR IN BROWSER', 'Searches the web, opens sites in the built-in browser, summarizes.', 'You are PULSAR IN BROWSER, a web agent. Search for information, open sites in the built-in browser, read them, separate facts from guesses, give a short conclusion with links.', true]
];

Object.assign(I18N.ru, { autoAgentD: 'PULSAR сам выбирает агента под каждый запрос: код и сайты — PULSAR CODE, файлы и папки — FILE SUP, поиск и сайты в интернете — PULSAR IN BROWSER.', autoAgentPick: 'агент выберется сам' });
Object.assign(I18N.en, { autoAgentD: 'PULSAR picks the agent for every request: code and sites — PULSAR CODE, files and folders — FILE SUP, web search and sites — PULSAR IN BROWSER.', autoAgentPick: 'agent is picked automatically' });

Object.assign(I18N.ru, { catAll: 'Все', catFast: 'Быстрые', catCode: 'Код', catLogic: 'Задачи и логика', catPower: 'Мощные',
  catFastD: 'мгновенные ответы на повседневные вопросы', catCodeD: 'сайты, программы, агенты', catLogicD: 'думают по шагам: математика, задачи', catPowerD: 'умнее, но медленнее и тяжелее',
  fresh: 'новая', agentsPar: 'агента сразу' });
Object.assign(I18N.en, { catAll: 'All', catFast: 'Fast', catCode: 'Code', catLogic: 'Problems & logic', catPower: 'Powerful',
  catFastD: 'instant answers for everyday questions', catCodeD: 'websites, programs, agents', catLogicD: 'think step by step: math, problems', catPowerD: 'smarter but slower and heavier',
  fresh: 'new', agentsPar: 'agents at once' });
Object.assign(I18N.ru, { saveToPc: 'Сохранить на компьютер', chAnalyze: 'Смотрю сайты-примеры', chResearch: 'Ищу информацию', chPlan: 'Планирую страницы', chCode: 'Пишу код', chReview: 'проверка', chFixed: 'исправил',
  chNoCode: 'Не получилось собрать код. Попробуй ещё раз или выбери модель из раздела «Код».', chNotSaved: 'Не сохранял — ты не разрешил. Код выше.', agentsWorking: 'Агенты работают…',
  chDoneSite: (n, d) => `Готово: ${n === 1 ? 'страница' : n + ' страниц(ы)'} в папке «${d}», всё проверено. Сайт открыт в браузере справа.`, chDone: n => `Готово: файлов — ${n}, код проверен и сохранён.` });
Object.assign(I18N.en, { saveToPc: 'Save to computer', chAnalyze: 'Looking at the example sites', chResearch: 'Searching', chPlan: 'Planning pages', chCode: 'Writing code', chReview: 'review', chFixed: 'fixed',
  chNoCode: 'Could not build the code. Try again or pick a model from Code.', chNotSaved: 'Not saved — you did not allow it. The code is above.', agentsWorking: 'Agents are working…',
  chDoneSite: (n, d) => `Done: ${n} page(s) in "${d}", all checked. The site is open in the browser.`, chDone: n => `Done: ${n} file(s), checked and saved.` });
Object.assign(I18N.ru, { stAccept: 'Принятие задачи', stAnalyze: 'Анализ', stPlan: 'План', stBuild: 'Обработка', stReview: 'Проверка', stSave: 'Сохранение',
  agentsN: n => `Работают ${n} агента`, agent1: 'Работает', agentsUsed: n => `Агентов: ${n}`, cooling: 'ПК горячий — жду, пока остынет',
  alreadySaved: p => `Файлы уже на компьютере, открыл папку:\n${p}`, chEdited: n => `Готово: обновил ${n === 1 ? 'файл' : 'файлы (' + n + ')'}, всё проверено. Сайт открыт справа.`,
  tempLbl: 'Температура', heatOn: 'снижаю нагрузку', hotToast: t => `Нагрев ${t}° — PULSAR снижает нагрузку`, coolToast: 'ПК остыл — работаю в полную силу',
  tooHot: t => `${t}° — остановил генерацию, чтобы не перегреть ПК`, oHeat: 'Защита от перегрева', oHeatD: 'Выше порога PULSAR сбавляет нагрузку и ждёт, пока ПК остынет' });
Object.assign(I18N.en, { stAccept: 'Task received', stAnalyze: 'Analysis', stPlan: 'Plan', stBuild: 'Processing', stReview: 'Review', stSave: 'Saving',
  agentsN: n => `${n} agents working`, agent1: 'Working', agentsUsed: n => `Agents: ${n}`, cooling: 'PC is hot — waiting for it to cool down',
  alreadySaved: p => `The files are already on your computer, opened the folder:\n${p}`, chEdited: n => `Done: updated ${n} file(s), all checked. The site is open on the right.`,
  tempLbl: 'Temperature', heatOn: 'reducing load', hotToast: t => `${t}° — PULSAR is reducing load`, coolToast: 'PC cooled down — full speed again',
  tooHot: t => `${t}° — stopped generation to protect your PC`, oHeat: 'Overheat protection', oHeatD: 'Above the limit PULSAR reduces load and waits for the PC to cool' });
(function () {
  const extra = {
    ru: ' Никогда не используй lorem ipsum и картинки-заглушки (via.placeholder и т.п.): пиши настоящие тексты под бизнес пользователя (меню с позициями и ценами, адрес-заглушка [адрес], часы работы). Вместо фото — CSS-градиенты, формы и inline SVG. Подключай шрифт Inter или Manrope с Google Fonts, делай большие заголовки, много воздуха, плавные анимации появления, адаптивность под телефон.',
    en: ' Never use lorem ipsum or placeholder images (via.placeholder etc.): write real copy for the user\'s business (menu items with prices, [address] placeholder, opening hours). Instead of photos use CSS gradients, shapes and inline SVG. Use Inter or Manrope from Google Fonts, large headings, generous whitespace, smooth reveal animations, mobile-friendly layout.'
  };
  for (const l of ['ru', 'en']) { const c = AGENTS[l].find(a => a[0] === 'coder'); if (c) c[3] += extra[l]; }
})();
Object.assign(I18N.ru, { recFor: 'РЕКОМЕНДУЮ ДЛЯ ТВОЕГО ПК', recBtn: 'Скачать и начать', later: 'Позже', resumeDl: 'Докачать', history: 'Чаты',
  reportBtn: 'Сообщить об ошибке', reportDone: 'Отчёт сохранён — приложи этот файл к сообщению об ошибке' });
Object.assign(I18N.en, { recFor: 'RECOMMENDED FOR YOUR PC', recBtn: 'Download and start', later: 'Later', resumeDl: 'Resume', history: 'Chats',
  reportBtn: 'Report a problem', reportDone: 'Report saved — attach this file to your bug report' });

Object.assign(I18N.ru, { chDoneSite: (n, d) => `Готово: ${n > 1 ? n + ' страницы в одном файле' : 'сайт'} в папке «${d}», всё проверено. Сайт открыт в браузере справа.` });
Object.assign(I18N.en, { chDoneSite: (n, d) => `Done: ${n > 1 ? n + ' pages in one file' : 'the site'} in "${d}", all checked. It is open in the browser on the right.` });

Object.assign(I18N.ru, { chFixing: 'исправляю, круг', chLeft: n => `осталось замечаний: ${n}`, stReview: 'Проверка и исправление' });
Object.assign(I18N.en, { chFixing: 'fixing, round', chLeft: n => `${n} issue(s) left`, stReview: 'Check & fix' });

Object.assign(I18N.ru, { updReady: v => `Новая версия ${v} готова`, updBtn: 'Перезапустить и обновить', updLoading: 'Скачиваю обновление' });
Object.assign(I18N.en, { updReady: v => `Version ${v} is ready`, updBtn: 'Restart to update', updLoading: 'Downloading update' });
