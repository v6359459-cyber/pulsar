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

let TOOLS_PROMPT = `
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
\`\`\`mkdir:photos
\`\`\`
\`\`\`move:IMG_1.jpg|photos/IMG_1.jpg
\`\`\`
\`\`\`open:https://example.com
\`\`\`
\`\`\`search:what to look up
\`\`\`
file: creates or overwrites a file. run: runs a .py or .js file (stdin is closed, so avoid input(); use fixed example values) or opens an .html file in the built-in preview. read: reads a file. list: lists a folder. mkdir:folder creates a folder. move:old/path|new/path moves or renames a file or folder (nothing is ever deleted; the user is asked first). open: opens a website in the built-in browser and gives you its text. search: searches the internet and gives you results with links.
When the user asks to make a website or program, write the COMPLETE code in one file block (for a site: one html file with CSS and JS inside, modern clean design). When the user asks to open a site, use open:. Never answer that you cannot save files, open websites or access the internet: you can, with these blocks.
After your blocks, stop. The results come back to you in the next message; then continue or give the final answer. Do not repeat a block that already succeeded. Answer in the user's language.`;
const PROVIDERS = [];

Object.assign(I18N.ru, { autoModel: 'Авто', autoModelD: 'PULSAR сам выбирает лучшую скачанную модель под задачу', autoPick: 'модель выберется сама', switching: 'Переключаю модель на', stContinue: 'Дописываю',
  cloudFree: 'Облачные · бесплатно', kimiD: 'Очень сильная модель от Moonshot AI. Работает через интернет, на ПК ничего не скачивается. Нужен бесплатный ключ OpenRouter.', kimiHow: 'Ключ бесплатный:' });
Object.assign(I18N.en, { autoModel: 'Auto', autoModelD: 'PULSAR picks the best downloaded model for the task', autoPick: 'model is picked automatically', switching: 'Switching model to', stContinue: 'Continuing',
  cloudFree: 'Cloud · free', kimiD: 'Very strong model by Moonshot AI. Runs online, nothing is downloaded. Needs a free OpenRouter key.', kimiHow: 'The key is free:' });
AGENTS.ru = [
  ['coder', 'PULSAR CODE', 'Пишет код, сайты и программы. Сам сохраняет файлы и запускает их.', 'Ты PULSAR CODE — сильный программист и веб-дизайнер. Пиши полный рабочий код без сокращений и заглушек. Сайт — один полный HTML-файл со встроенными CSS и JS: современный дизайн, крупная типографика, много воздуха, плавные анимации, адаптивность. Сохраняй файлы и запускай код, чтобы проверить. Объясняй коротко.', true],
  ['files', 'FILE SUP', 'Создаёт, читает и раскладывает файлы в рабочей папке.', 'Ты FILE SUP — помощник по файлам. Список файлов рабочей папки тебе уже дан. Действуй сразу блоками: read — прочитать, file — создать или переписать, mkdir — создать папку, move — переместить или переименовать. Чтобы разложить файлы, создай папки по типу (Документы, Картинки, Код…) и перемести туда файлы. Ничего не удаляй. В конце коротко скажи, что сделал.', true],
  ['browser', 'PULSAR IN BROWSER', 'Ищет в интернете, открывает сайты во встроенном браузере и делает выжимку.', 'Ты PULSAR IN BROWSER — агент для интернета. Ищи информацию, открывай сайты во встроенном браузере и работай с ними как человек: нажимай кнопки и ссылки (click:N), вводи текст в поля (type:N|текст{enter}), листай (scroll:down), возвращайся (back:). N — номер элемента из списка под текстом страницы, можно написать и текст кнопки. Делай одно-два действия за раз и смотри, что получилось. Отделяй факты от догадок и давай короткий вывод со ссылками.', true]
];
AGENTS.en = [
  ['coder', 'PULSAR CODE', 'Writes code, websites and programs. Saves and runs files itself.', 'You are PULSAR CODE, a strong programmer and web designer. Write complete working code with no placeholders. A website is one complete HTML file with embedded CSS and JS: modern design, large type, whitespace, smooth animations, responsive. Save files and run code to check. Explain briefly.', true],
  ['files', 'FILE SUP', 'Creates, reads and organizes files in the workspace.', 'You are FILE SUP, a file assistant. You already get the workspace file list. Act right away with blocks: read, file (create or rewrite), mkdir (new folder), move (move or rename). To organize, create folders by type (Documents, Images, Code…) and move files there. Never delete anything. Finish with a short summary.', true],
  ['browser', 'PULSAR IN BROWSER', 'Searches the web, opens sites in the built-in browser, summarizes.', 'You are PULSAR IN BROWSER, a web agent. Search, open sites in the built-in browser and use them like a person: click buttons and links (click:N), type into fields (type:N|text{enter}), scroll (scroll:down), go back (back:). N is the element number from the list under the page text; the button text also works. Do one or two actions at a time and check the result. Separate facts from guesses, give a short conclusion with links.', true]
];

Object.assign(I18N.ru, { autoAgentD: 'PULSAR сам выбирает агента под каждый запрос: разговор — HELLO PULSAR, код и сайты — PULSAR CODE, файлы и папки — FILE SUP, поиск и сайты в интернете — PULSAR IN BROWSER.', autoAgentPick: 'агент выберется сам' });
Object.assign(I18N.en, { autoAgentD: 'PULSAR picks the agent for every request: talk — HELLO PULSAR, code and sites — PULSAR CODE, files and folders — FILE SUP, web search and sites — PULSAR IN BROWSER.', autoAgentPick: 'agent is picked automatically' });

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

Object.assign(I18N.ru, { running: 'работает', runInputPh: 'Ввод для программы — Enter, чтобы отправить' });
Object.assign(I18N.en, { running: 'running', runInputPh: 'Input for the program — press Enter to send' });

Object.assign(I18N.ru, { editor: 'Редактор', openWin: 'Открыть в Windows', unsaved: 'не сохранено', tProjects: 'Проекты', projSub: 'Все сайты и программы, которые сделали агенты.', projEmpty: 'Пока пусто — попроси агента сделать сайт, и он появится здесь.',
  projContinue: 'Продолжить в чате', projCont: d => `Продолжаем работу над «${d}» — напиши, что изменить`, filesN: 'файлов',
  catMine: 'Мои модели', catMineD: 'GGUF-файлы с твоего диска', addModel: 'Добавить свою модель', addModelD: 'Выбери .gguf файл на диске — копировать не нужно',
  oTheme: 'Тема', oThemeD: 'Тёмная или светлая', light: 'Светлая', dark: 'Тёмная', oTray: 'Работа в фоне', oTrayD: 'Крестик сворачивает PULSAR в трей, агенты продолжают работать',
  updChecking: 'Проверка обновлений…', updUpdating: v => `Обновляю PULSAR до ${v}…`, updRestart: 'Перезапускаю…', notifyDone: 'Агенты закончили работу',
  attachT: 'Прикрепить файл (txt, pdf, docx, csv, код)', attachAsk: 'Разбери прикреплённые файлы',
  askSite: 'Открыть сайт', askSearch: 'Искать в интернете', askSearchRefs: 'Найти похожие сайты для примера', allowAllReq: 'Разрешать все в этом запросе',
  aClick: 'Нажатие', aType: 'Ввод', aScroll: 'Прокрутка', aBack: 'Назад' });
Object.assign(I18N.en, { editor: 'Editor', openWin: 'Open in Windows', unsaved: 'unsaved', tProjects: 'Projects', projSub: 'All websites and programs your agents made.', projEmpty: 'Nothing yet — ask an agent to make a site and it will appear here.',
  projContinue: 'Continue in chat', projCont: d => `Continuing "${d}" — tell me what to change`, filesN: 'files',
  catMine: 'My models', catMineD: 'GGUF files from your disk', addModel: 'Add your own model', addModelD: 'Pick a .gguf file — no copy needed',
  oTheme: 'Theme', oThemeD: 'Dark or light', light: 'Light', dark: 'Dark', oTray: 'Run in background', oTrayD: 'Close button hides PULSAR to the tray, agents keep working',
  updChecking: 'Checking for updates…', updUpdating: v => `Updating PULSAR to ${v}…`, updRestart: 'Restarting…', notifyDone: 'Agents finished their work',
  attachT: 'Attach a file (txt, pdf, docx, csv, code)', attachAsk: 'Look at the attached files',
  askSite: 'Open website', askSearch: 'Search the web', askSearchRefs: 'Find similar sites as examples', allowAllReq: 'Allow all for this request',
  aClick: 'Click', aType: 'Type', aScroll: 'Scroll', aBack: 'Back' });
TOOLS_PROMPT = TOOLS_PROMPT.replace('After your blocks, stop.', `Browser control (after open:, you get the page text and a numbered list of interactive elements):
\`\`\`click:5
\`\`\`
\`\`\`type:3|text to type{enter}
\`\`\`
\`\`\`scroll:down
\`\`\`
\`\`\`back:
\`\`\`
click: clicks element N. type: types into field N ({enter} at the end submits). scroll: down or up. back: previous page. The user is asked before every new website.
After your blocks, stop.`);

AGENTS.ru.unshift(['chat', 'HELLO PULSAR', 'Просто поговорить: вопросы, советы, идеи, объяснения простыми словами.', 'Ты HELLO PULSAR — дружелюбный и умный собеседник. Тебя зовут HELLO PULSAR; если пользователь называет тебя иначе (например «Вася») — просто прими это с юмором, но не называй так пользователя. Имя пользователя знаешь только если он сам его сказал — никогда не придумывай имён. Когда пользователь называет своё имя — запомни и обращайся по имени. Грубые слова и мат — не повод отказываться: просто отвечай по делу спокойно. Никогда не говори «не могу помочь», если просьба безобидная. Отвечай по-человечески, тепло, коротко и по делу, на языке пользователя. Объясняй сложное простыми словами и с примерами. Если человек просит сделать сайт или программу — скажи, что это сделает PULSAR CODE, а если найти что-то в интернете — PULSAR IN BROWSER, и предложи включить «Авто».', false]);
AGENTS.en.unshift(['chat', 'HELLO PULSAR', 'Just talk: questions, advice, ideas, simple explanations.', 'You are HELLO PULSAR, a friendly and smart companion. Your name is HELLO PULSAR; if the user calls you something else, accept it playfully but never call the user that. You know the user\'s name only if they said it — never invent names; when they tell you their name, remember it and use it. Rude words are not a reason to refuse: answer calmly. Never refuse harmless requests. Answer like a person: warm, short and to the point, in the user\'s language. Explain complex things simply, with examples. If asked to build a site or program, say PULSAR CODE will do it; for web search, PULSAR IN BROWSER — and suggest turning on Auto.', false]);
Object.assign(I18N.ru, { permSiteT: 'Открыть сайт', permSiteD: 'Агент откроет страницу во встроенном браузере и прочитает её.', permSaveT: n => n === 1 ? 'Сохранить файл на компьютер' : `Сохранить файлы на компьютер (${n})`, permSaveD: 'Файлы появятся в папке «Документы\\PULSAR».',
  alwaysFor: h => `Всегда для ${h.replace(/^www\./, '')}`, oTrusted: 'Доверенные сайты', oTrustedD: 'Сайты, которые агенты открывают без вопроса', clear: 'очистить' });
Object.assign(I18N.en, { permSiteT: 'Open website', permSiteD: 'The agent will open the page in the built-in browser and read it.', permSaveT: n => n === 1 ? 'Save the file to your computer' : `Save ${n} files to your computer`, permSaveD: 'Files will appear in Documents\\PULSAR.',
  alwaysFor: h => `Always for ${h.replace(/^www\./, '')}`, oTrusted: 'Trusted sites', oTrustedD: 'Sites the agents open without asking', clear: 'clear' });
Object.assign(I18N.ru, { bReady: 'Ускоритель готов — нажми', bReadyD: 'Ускоритель скачан. Нажми, чтобы перезапустить модель с ним', bApply: 'Перезапускаю модель с ускорителем', loopStop: 'Агент начал повторять одно и то же — остановил его.', oHeatGpu: 'Температура видеокарты', oHeatGpuD: 'Выше неё модель начинает думать медленнее, чтобы карта остыла', oHeatCpu: 'Температура процессора', oHeatCpuD: 'Выше неё модель начинает думать медленнее, чтобы процессор остыл', bOn: 'Ускорение работает', bNone: 'Без ускорения', bNoneD: 'Для этой модели нет ускорителя', bLoading: 'Ускоритель качается', bOff: 'Ускорение выключено', bOffD: 'Включи ускоритель во вкладке «Модели»',
  bNoRoom: 'Ускорение: мало видеопамяти', bNoRoomD: 'Модель с ускорителем не помещается в видеокарту', bFail: 'Ускорение не запустилось', bFailD: 'Модель работает без помощника. Нажми, чтобы попробовать ещё раз.', stopRun: 'Стоп', clear: 'Очистить', aMkdir: 'Новая папка', aMove: 'Переместить', stopped: 'Ответ прерван', withBoost: 'с ускорителем', noBoost: 'без', draftAuto: 'Качаю ускоритель {d} для {m} — подключу сам', catHelp: 'Ускорители', catHelpD: 'помогают большой модели отвечать быстрее; PULSAR сам видит модель и качает нужный при запуске', helperTag: 'Помощник', helperD: 'Ускоряет в 1,5–2 раза:', helperOn: 'Помогает · вкл', helperOff: 'Выключен',
  specOn: 'Ускоритель включён — ответы быстрее', specRestart: 'Перезапусти модель, чтобы применить', oSpec: 'Ускорители', oSpecD: 'Маленькая модель подсказывает большой — ответы быстрее',
  oMemory: 'Память HELLO PULSAR', oMemoryD: 'Что агент запомнил о тебе между чатами', memSaved: 'Запомнил:', memForgot: 'Забыл' });
Object.assign(I18N.en, { bReady: 'Booster ready — click', bReadyD: 'Booster downloaded. Click to restart the model with it', bApply: 'Restarting the model with the booster', loopStop: 'The agent started repeating itself — stopped it.', oHeatGpu: 'GPU temperature', oHeatGpuD: 'Above it the model slows down so the card cools', oHeatCpu: 'CPU temperature', oHeatCpuD: 'Above it the model slows down so the CPU cools', bOn: 'Boost on', bNone: 'No boost', bNoneD: 'No booster for this model', bLoading: 'Booster downloading', bOff: 'Boost off', bOffD: 'Turn the booster on in Models',
  bNoRoom: 'Boost: not enough VRAM', bNoRoomD: 'The model with a booster does not fit the GPU', bFail: 'Boost did not start', bFailD: 'The model runs without the helper. Click to try again.', stopRun: 'Stop', clear: 'Clear', aMkdir: 'New folder', aMove: 'Move', stopped: 'Answer stopped', withBoost: 'with booster', noBoost: 'without', draftAuto: 'Downloading booster {d} for {m} — will plug it in automatically', catHelp: 'Boosters', catHelpD: 'they help a big model answer faster; PULSAR detects the model and downloads the right one on launch', helperTag: 'Helper', helperD: 'Speeds up 1.5–2×:', helperOn: 'Helping · on', helperOff: 'Off',
  specOn: 'Booster on — faster answers', specRestart: 'Restart the model to apply', oSpec: 'Boosters', oSpecD: 'A small model drafts for the big one — faster answers',
  oMemory: 'HELLO PULSAR memory', oMemoryD: 'What the agent remembers about you between chats', memSaved: 'Remembered:', memForgot: 'Forgot' });

Object.assign(I18N.ru, { mb: 'МБ', updWait: 'Установка займёт до минуты, PULSAR откроется сам', updDone: v => `PULSAR обновлён до ${v}` });
Object.assign(I18N.en, { mb: 'MB', updWait: 'Installing takes up to a minute, PULSAR will reopen by itself', updDone: v => `PULSAR updated to ${v}` });

Object.assign(I18N.ru, { browserOpened: 'Открыл браузер справа. Скажи, какой сайт открыть.' });
Object.assign(I18N.en, { browserOpened: 'The browser is open on the right. Tell me which site to open.' });

Object.assign(I18N.ru, { tApi: 'API', srcPc: 'ПК', srcTog: 'Вместе', apiSub2: 'Вставь ключ любого сервиса нейросетей и нажми «Проверить». PULSAR сам поймёт, чей это ключ, и покажет модели. Ключи хранятся только на этом компьютере.',
  apiUrlOpt: 'Адрес API — необязательно, только для своего или редкого сервиса', apiCheckBtn: 'Проверить', apiChecking: 'Проверяю ключ…', apiKeyOk: (p, n) => `Ключ работает · ${p} · моделей: ${n}. Выбери модель:`,
  apiSearch: 'Поиск модели…', apiPinging: 'проверяю…', apiFree: 'бесплатно', apiNoMatch: 'Ничего не найдено', apiOn: 'API подключён', apiConnected: 'Подключённые API', apiNone: 'Пока ни одного API',
  apiAdded: (p, m) => `API подключён · ${p} · ${m}`, dbAnswer: 'отвечает', dbCritique: 'проверяет ответ соперника', dbMerge: 'Собираю лучший ответ из обоих', dbFail: 'Обе модели не ответили.', dbWin: 'выбран лучший' });
Object.assign(I18N.en, { tApi: 'API', srcPc: 'PC', srcTog: 'Together', apiSub2: 'Paste a key from any AI service and press Check. PULSAR detects the provider and shows its models. Keys stay on this computer.',
  apiUrlOpt: 'API address — optional, only for your own or a rare service', apiCheckBtn: 'Check', apiChecking: 'Checking the key…', apiKeyOk: (p, n) => `Key works · ${p} · ${n} models. Pick a model:`,
  apiSearch: 'Search models…', apiPinging: 'checking…', apiFree: 'free', apiNoMatch: 'Nothing found', apiOn: 'API connected', apiConnected: 'Connected APIs', apiNone: 'No APIs yet',
  apiAdded: (p, m) => `API connected · ${p} · ${m}`, dbAnswer: 'answering', dbCritique: 'reviewing the rival answer', dbMerge: 'Building the best answer from both', dbFail: 'Both models failed to answer.', dbWin: 'chosen as best' });

Object.assign(I18N.ru, { tDesign: 'Дизайн', designSub: 'Как агенты оформляют сайты. Готовые блоки в стиле shadcn/ui: модель собирает страницу из них, а PULSAR добавляет стили и анимации — сайты выходят ровными даже у маленьких моделей.',
  designMode: 'Режим дизайна', designOnD: 'Включён: сайты собираются из готовых блоков в выбранном стиле.', designOffD: 'Выключен: модель оформляет сайт сама, как умеет.',
  designStyles: 'Стиль', designChosen: 'выбран', designPreview: 'Предпросмотр', designBlocks: (b, e) => `Блоки · ${b} · примеров для модели: ${e}` });
Object.assign(I18N.en, { tDesign: 'Design', designSub: 'How agents style websites. Ready shadcn/ui-style blocks: the model builds the page from them and PULSAR adds the styles and animations — sites look clean even with small models.',
  designMode: 'Design mode', designOnD: 'On: sites are built from ready blocks in the chosen style.', designOffD: 'Off: the model styles the site on its own.',
  designStyles: 'Style', designChosen: 'selected', designPreview: 'Preview', designBlocks: (b, e) => `Blocks · ${b} · examples for the model: ${e}` });

Object.assign(I18N.ru, { seesPics: 'видит картинки', noPics: 'без картинок', seesPicsD: 'Можно прикрепить фото или скриншот — модель его увидит. Другие файлы тоже можно.',
  noPicsD: 'Эта модель не видит картинки — фото прикрепить нельзя, другие файлы можно. Картинки видят модели с пометкой «видит картинки».',
  visDl: 'Докачиваю модели «зрение» — это один раз', visNone: 'Для этой модели нет файла зрения', visOn: 'Включаю зрение модели — перезапуск',
  yes: 'Да', no: 'Нет', phAsk: 'Добавить на сайт настоящие фото?', phAskO: 'Возьму бесплатные фото с Openverse и сохраню их в папку сайта. Нужен интернет.', phAskP: 'Возьму фото с Pexels по твоему ключу и сохраню их в папку сайта.',
  phAgent: 'PULSAR · фото', phFind: 'подбираю фото', phFound: n => `фото: ${n}`, phNone: 'фото не нашлись — оставил заглушки', pexelsKey: 'Ключ Pexels для фото на сайтах (необязательно, бесплатно)',
  micT: 'Сказать голосом', micStop: 'Остановить запись', micBusy: 'Распознаю…', micSetup: 'Для голоса нужно один раз скачать модель распознавания речи (≈470 МБ). Скачать?', micDl: 'Качаю распознавание речи…', micReady: 'Голос готов — нажми микрофон ещё раз',
  micNo: 'Нет доступа к микрофону', micEmpty: 'Ничего не расслышал', micErr: 'Не удалось распознать', speakT: 'Прочитать вслух', oTts: 'Озвучивать ответы', oTtsD: 'PULSAR читает ответы вслух голосом Windows' });
Object.assign(I18N.en, { seesPics: 'sees pictures', noPics: 'no pictures', seesPicsD: 'You can attach a photo or screenshot — the model will see it. Other files work too.',
  noPicsD: 'This model cannot see pictures — photos cannot be attached, other files can. Models marked "sees pictures" can.',
  visDl: 'Downloading the vision part of the model — once', visNone: 'No vision file for this model', visOn: 'Turning on vision — restarting the model',
  yes: 'Yes', no: 'No', phAsk: 'Add real photos to the site?', phAskO: 'I will take free photos from Openverse and save them into the site folder. Needs internet.', phAskP: 'I will take photos from Pexels with your key and save them into the site folder.',
  phAgent: 'PULSAR · photos', phFind: 'picking photos', phFound: n => `photos: ${n}`, phNone: 'no photos found — kept placeholders', pexelsKey: 'Pexels key for site photos (optional, free)',
  micT: 'Speak', micStop: 'Stop recording', micBusy: 'Recognizing…', micSetup: 'Voice needs a one-time download of the speech model (≈470 MB). Download?', micDl: 'Downloading speech recognition…', micReady: 'Voice is ready — press the mic again',
  micNo: 'No access to the microphone', micEmpty: 'Heard nothing', micErr: 'Could not recognize', speakT: 'Read aloud', oTts: 'Read answers aloud', oTtsD: 'PULSAR reads answers with a Windows voice' });
