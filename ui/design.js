// PULSAR design kit: shadcn-style components in plain HTML + CSS (works offline, no build step).
// The model writes only HTML with these classes; PULSAR injects the CSS, the theme and the animations.
const DESIGN = (() => {
  const THEMES = {
    apple: { ru: 'Минимализм Apple', en: 'Apple minimalism', dru: 'Чёрно-белый, крупный светлый шрифт, много воздуха, плавные анимации', den: 'Black and white, large light type, whitespace, smooth motion',
      vars: '--bg:#fff;--bg2:#f5f5f7;--fg:#1d1d1f;--muted:#6e6e73;--card:#f5f5f7;--line:#e5e5ea;--accent:#1d1d1f;--accent-fg:#fff;--accent2:#6e6e73;--radius:24px;--h-weight:300;--h-track:-.035em;--shadow:0 30px 60px -30px rgba(0,0,0,.18)',
      extra: '' },
    neon: { ru: 'Тёмный tech / неон', en: 'Dark tech / neon', dru: 'Тёмный фон, свечение, градиенты — для IT, игр, стартапов', den: 'Dark background, glow, gradients — for IT, games, startups',
      vars: '--bg:#06060a;--bg2:#0b0b12;--fg:#f1f1f7;--muted:#8b8ba7;--card:#0f0f18;--line:#20203a;--accent:#7c5cff;--accent-fg:#fff;--accent2:#00e5ff;--radius:18px;--h-weight:600;--h-track:-.03em;--shadow:0 0 0 1px rgba(124,92,255,.25),0 20px 60px -20px rgba(124,92,255,.45)',
      extra: `.pl-hero h1 .pl-w,.pl-hero-split h1 .pl-w{background:linear-gradient(120deg,#fff 10%,var(--accent2) 70%,var(--accent) 120%);-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.08em}
.pl-btn{box-shadow:0 0 24px -4px var(--accent)}.pl-card:hover,.pl-price-card:hover,.pl-product:hover{box-shadow:var(--shadow);border-color:rgba(124,92,255,.6)}
body::before{content:'';position:fixed;inset:-20% -10% auto;height:70vh;background:radial-gradient(closest-side,rgba(124,92,255,.22),transparent),radial-gradient(closest-side at 80% 40%,rgba(0,229,255,.14),transparent);pointer-events:none;z-index:-1;animation:pl-float 14s ease-in-out infinite alternate}` },
    glass: { ru: 'Стекло и мягкие цвета', en: 'Glass and soft colors', dru: 'Матовое стекло, пастель, размытие — для кафе, салонов, блогов', den: 'Frosted glass, pastels, blur — for cafes, salons, blogs',
      vars: '--bg:#f7f3ff;--bg2:rgba(255,255,255,.45);--fg:#1f1a33;--muted:#6b6485;--card:rgba(255,255,255,.55);--line:rgba(255,255,255,.8);--accent:#8b5cf6;--accent-fg:#fff;--accent2:#f472b6;--radius:28px;--h-weight:400;--h-track:-.03em;--shadow:0 20px 50px -20px rgba(139,92,246,.35)',
      extra: `body{background:linear-gradient(135deg,#f7f3ff,#eef7ff 50%,#fff1f7)}
body::before,body::after{content:'';position:fixed;width:46vw;height:46vw;border-radius:50%;filter:blur(80px);opacity:.55;z-index:-1;pointer-events:none;animation:pl-float 16s ease-in-out infinite alternate}
body::before{background:#c4b5fd;top:-10vw;left:-8vw}body::after{background:#fbcfe8;bottom:-12vw;right:-8vw;animation-delay:-6s}
.pl-card,.pl-price-card,.pl-quote,.pl-product,.pl-kpi,.pl-cta,.pl-nav,.pl-faq details,.pl-form,.pl-menu{backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4)}
.pl-btn{background:linear-gradient(135deg,var(--accent),var(--accent2))}` },
    corp: { ru: 'Строгий корпоративный', en: 'Clean corporate', dru: 'Светлый, синий акцент, чёткая сетка — для бизнеса и услуг', den: 'Light, blue accent, clear grid — for business and services',
      vars: '--bg:#fff;--bg2:#f8fafc;--fg:#0f172a;--muted:#64748b;--card:#fff;--line:#e2e8f0;--accent:#2563eb;--accent-fg:#fff;--accent2:#0ea5e9;--radius:12px;--h-weight:650;--h-track:-.025em;--shadow:0 10px 30px -12px rgba(15,23,42,.18)',
      extra: `.pl-card,.pl-price-card,.pl-product,.pl-kpi,.pl-quote{box-shadow:0 1px 2px rgba(15,23,42,.06)}.pl-eyebrow{color:var(--accent)}` },
    brutal: { ru: 'Брутализм', en: 'Brutalism', dru: 'Жирные рамки, резкие тени, кричащие цвета, огромный шрифт', den: 'Thick borders, hard shadows, loud colours, huge type',
      vars: '--bg:#fffceb;--bg2:#fff;--fg:#0a0a0a;--muted:#3f3f3f;--card:#fff;--line:#0a0a0a;--accent:#ff4a1c;--accent-fg:#fff;--accent2:#1d4ed8;--radius:0px;--h-weight:800;--h-track:-.04em;--shadow:8px 8px 0 #0a0a0a',
      extra: `.pl-card,.pl-price-card,.pl-product,.pl-kpi,.pl-quote,.pl-form,.pl-menu,.pl-faq details,.pl-cta{border:3px solid #0a0a0a;box-shadow:var(--shadow)}
.pl-btn{border:3px solid #0a0a0a;box-shadow:5px 5px 0 #0a0a0a;border-radius:0;transition:transform .12s,box-shadow .12s}
.pl-btn:hover{transform:translate(3px,3px);box-shadow:2px 2px 0 #0a0a0a}
.pl-card:hover,.pl-product:hover,.pl-price-card:hover{transform:translate(-3px,-3px);box-shadow:11px 11px 0 #0a0a0a}
.pl-hero h1,.pl-hero-split h1{line-height:.92;text-transform:uppercase}
.pl-eyebrow{background:var(--accent);color:#fff;padding:3px 10px;border:3px solid #0a0a0a;display:inline-block}
.pl-nav{border-bottom:3px solid #0a0a0a;box-shadow:none}` },
    term: { ru: 'Терминал', en: 'Terminal', dru: 'Моношрифт, зелёный по чёрному, каретка, консольная сетка', den: 'Monospace, green on black, caret, console grid',
      vars: '--bg:#06080a;--bg2:#0b1014;--fg:#c8f7d4;--muted:#5f8f72;--card:#0b1014;--line:#1d3326;--accent:#2bff88;--accent-fg:#06080a;--accent2:#7df9ff;--radius:4px;--h-weight:500;--h-track:0em;--shadow:0 0 0 1px rgba(43,255,136,.18)',
      extra: `body{font-family:"Geist Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace}
h1,h2,h3,.pl-btn,.pl-eyebrow{font-family:inherit;text-transform:lowercase}
.pl-eyebrow::before{content:'$ '}
.pl-hero h1::after,.pl-hero-split h1::after{content:'_';animation:pl-caret 1.1s steps(1) infinite;color:var(--accent)}
@keyframes pl-caret{50%{opacity:0}}
.pl-card,.pl-price-card,.pl-product,.pl-kpi,.pl-quote,.pl-faq details{border:1px solid var(--line)}
.pl-card:hover,.pl-product:hover,.pl-price-card:hover{border-color:var(--accent);box-shadow:0 0 24px -8px var(--accent)}
body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(to bottom,rgba(43,255,136,.045) 0 1px,transparent 1px 3px);pointer-events:none;z-index:9999}` },
    mag: { ru: 'Журнал', en: 'Magazine', dru: 'Крупные заголовки, колонки, строгая сетка, много воздуха', den: 'Big headlines, columns, strict grid, lots of air',
      vars: '--bg:#fbfaf7;--bg2:#f1efe9;--fg:#141210;--muted:#6a645c;--card:#fbfaf7;--line:#141210;--accent:#141210;--accent-fg:#fbfaf7;--accent2:#b4452f;--radius:0px;--h-weight:300;--h-track:-.05em;--shadow:none',
      extra: `.pl-hero h1,.pl-hero-split h1{font-size:clamp(44px,8vw,116px);line-height:.94}
.pl-nav{border-bottom:1px solid var(--line);box-shadow:none}
.pl-section + .pl-section{border-top:1px solid var(--line)}
.pl-card,.pl-price-card,.pl-product,.pl-kpi{border:none;border-top:1px solid var(--line);border-radius:0;padding-top:22px}
.pl-quote{border:none;border-left:3px solid var(--accent2);font-size:1.3em;line-height:1.35;padding-left:24px}
.pl-eyebrow{letter-spacing:.22em;text-transform:uppercase;font-size:11px;color:var(--accent2)}
.pl-lead,.pl-text{column-gap:40px}
@media(min-width:900px){.pl-text{columns:2}}` },
    grad: { ru: 'Градиенты', en: 'Gradients', dru: 'Плавные цветные переходы, размытые пятна, стеклянные карточки', den: 'Smooth colour transitions, blurred blobs, glass cards',
      vars: '--bg:#0d0920;--bg2:rgba(255,255,255,.06);--fg:#f4f1ff;--muted:#a79ed0;--card:rgba(255,255,255,.07);--line:rgba(255,255,255,.14);--accent:#ff7ac6;--accent-fg:#1a0b2e;--accent2:#5ee7ff;--radius:22px;--h-weight:500;--h-track:-.035em;--shadow:0 24px 70px -24px rgba(255,122,198,.5)',
      extra: `body{background:linear-gradient(160deg,#0d0920,#1b0f3a 45%,#0a1030)}
body::before,body::after{content:'';position:fixed;width:58vw;height:58vw;border-radius:50%;filter:blur(90px);opacity:.5;z-index:-1;pointer-events:none;animation:pl-float 18s ease-in-out infinite alternate}
body::before{background:linear-gradient(135deg,#ff7ac6,#8b5cf6);top:-16vw;left:-12vw}
body::after{background:linear-gradient(135deg,#5ee7ff,#3b82f6);bottom:-18vw;right:-12vw;animation-delay:-8s}
.pl-card,.pl-price-card,.pl-quote,.pl-product,.pl-kpi,.pl-cta,.pl-nav,.pl-faq details,.pl-form,.pl-menu{backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5)}
.pl-hero h1 .pl-w,.pl-hero-split h1 .pl-w{background:linear-gradient(100deg,#fff,var(--accent) 45%,var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.08em}
.pl-btn{background:linear-gradient(100deg,var(--accent),var(--accent2));border:none;color:#1a0b2e}` }
  };

  const CSS = `*,*::before,*::after{box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:400 17px/1.6 "Inter","SF Pro Text",-apple-system,"Segoe UI",Roboto,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}a{color:inherit;text-decoration:none}
h1,h2,h3,h4{margin:0;font-family:"Inter","SF Pro Display",-apple-system,"Segoe UI",system-ui,sans-serif;letter-spacing:var(--h-track);line-height:1.05}
h1{font-size:clamp(44px,7.4vw,96px);font-weight:var(--h-weight)}h2{font-size:clamp(34px,4.8vw,60px);font-weight:var(--h-weight)}h3{font-size:21px;font-weight:600;letter-spacing:-.01em;line-height:1.25}
p{margin:0}.pl-muted{color:var(--muted)}.pl-center{text-align:center}
.pl-container{width:100%;max-width:1140px;margin:0 auto;padding:0 28px}
.pl-section{padding:clamp(80px,12vw,150px) 0}.pl-alt{background:var(--bg2)}
.pl-section-head{max-width:720px;margin:0 auto 64px;text-align:center;display:flex;flex-direction:column;gap:18px}.pl-section-head p{color:var(--muted);font-size:19px}
.pl-eyebrow{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.pl-lead{font-size:clamp(18px,2vw,23px);color:var(--muted);max-width:640px;line-height:1.5}
.pl-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;border:1px solid var(--line);font-size:13px;color:var(--muted);background:var(--card)}
.pl-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 26px;border-radius:999px;border:0;background:var(--accent);color:var(--accent-fg);font:500 16px/1 inherit;font-family:inherit;cursor:pointer;transition:transform .35s cubic-bezier(.2,.9,.25,1.2),opacity .2s,box-shadow .3s}
.pl-btn:hover{transform:translateY(-2px) scale(1.02)}.pl-btn:active{transform:scale(.97)}
.pl-btn-ghost{background:transparent;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line)}.pl-btn-ghost:hover{box-shadow:inset 0 0 0 1px var(--fg)}
.pl-btn-lg{height:58px;padding:0 34px;font-size:18px}.pl-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px}
.pl-nav{position:sticky;top:0;z-index:50;transition:background .4s,border-color .4s,backdrop-filter .4s;border-bottom:1px solid transparent}
.pl-nav.pl-scrolled{background:color-mix(in srgb,var(--bg) 78%,transparent);backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);border-color:var(--line)}
.pl-nav .pl-container{display:flex;align-items:center;justify-content:space-between;height:68px;gap:24px}
.pl-logo{font-weight:600;font-size:19px;letter-spacing:-.02em}.pl-links{display:flex;gap:30px;align-items:center}.pl-links a{font-size:15px;color:var(--muted);transition:color .2s}.pl-links a:hover{color:var(--fg)}
.pl-burger{display:none;width:40px;height:40px;border:0;background:none;color:var(--fg);cursor:pointer;font-size:22px}
.pl-hero{padding:clamp(90px,14vw,180px) 0 clamp(70px,10vw,130px);text-align:center}.pl-hero .pl-container{display:flex;flex-direction:column;align-items:center;gap:26px}
.pl-hero .pl-actions{justify-content:center}
.pl-hero-split{padding:clamp(70px,10vw,130px) 0}.pl-hero-split .pl-container{display:grid;grid-template-columns:1.05fr 1fr;gap:64px;align-items:center}.pl-hero-split .pl-container>div:first-child{display:flex;flex-direction:column;gap:24px}
.pl-img{position:relative;border-radius:var(--radius);min-height:var(--h,320px);overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 22%,var(--bg2)),color-mix(in srgb,var(--accent2) 26%,var(--bg2)));box-shadow:var(--shadow)}
.pl-img::after{content:attr(data-label);position:absolute;inset:auto 0 0;padding:18px 22px;font-size:14px;color:var(--fg);opacity:.75}
.pl-img.pl-photo{background-size:cover;background-position:center}.pl-img.pl-photo::before{display:none}.pl-img.pl-photo[data-label]::after{background:linear-gradient(transparent,rgba(0,0,0,.5));color:#fff;opacity:1}
.pl-credits{font-size:12px;color:var(--muted);text-align:center;padding:16px 0 28px;margin:0}
.pl-img[data-emoji]::before{content:attr(data-emoji);position:absolute;inset:0;display:grid;place-items:center;font-size:clamp(56px,8vw,110px);animation:pl-float 7s ease-in-out infinite alternate}
.pl-grid-2,.pl-grid-3,.pl-grid-4{display:grid;gap:22px}.pl-grid-2{grid-template-columns:repeat(2,1fr)}.pl-grid-3{grid-template-columns:repeat(3,1fr)}.pl-grid-4{grid-template-columns:repeat(4,1fr)}
.pl-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:34px;display:flex;flex-direction:column;gap:12px;transition:transform .5s cubic-bezier(.2,.9,.25,1),box-shadow .5s,border-color .4s}
.pl-card:hover{transform:translateY(-6px);box-shadow:var(--shadow)}.pl-card p{color:var(--muted)}
.pl-card-icon{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:24px;background:var(--bg);border:1px solid var(--line);margin-bottom:6px}
.pl-feature-row{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}.pl-feature-row+.pl-feature-row{margin-top:110px}.pl-feature-row:nth-child(even)>:first-child{order:2}
.pl-feature-row>div:not(.pl-img){display:flex;flex-direction:column;gap:18px}.pl-feature-row p{color:var(--muted);font-size:19px}
.pl-logos{display:flex;flex-wrap:wrap;justify-content:center;gap:24px 56px;color:var(--muted);font-weight:600;font-size:20px;letter-spacing:-.01em;opacity:.8}
.pl-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:22px;text-align:center}
.pl-stat b{display:block;font-size:clamp(44px,6vw,72px);font-weight:var(--h-weight);letter-spacing:var(--h-track);line-height:1}.pl-stat span{color:var(--muted);font-size:15px}
.pl-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;counter-reset:st}
.pl-step{counter-increment:st;padding:30px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:10px}.pl-step::before{content:counter(st,decimal-leading-zero);font-size:14px;color:var(--muted);font-variant-numeric:tabular-nums}.pl-step p{color:var(--muted)}
.pl-menu{display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:12px 34px}
.pl-menu-item{display:grid;grid-template-columns:1fr auto;gap:4px 24px;padding:22px 0;border-bottom:1px solid var(--line)}.pl-menu-item:last-child{border:0}
.pl-menu-item b{font-weight:500;font-size:19px}.pl-menu-item .pl-price{font-variant-numeric:tabular-nums;font-size:19px}.pl-menu-item small{grid-column:1/-1;color:var(--muted);font-size:15px}
.pl-pricing{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;align-items:stretch}
.pl-price-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:36px;display:flex;flex-direction:column;gap:18px;transition:transform .5s cubic-bezier(.2,.9,.25,1),box-shadow .5s}
.pl-price-card:hover{transform:translateY(-6px);box-shadow:var(--shadow)}.pl-price-card.pl-featured{background:var(--fg);color:var(--bg);border-color:var(--fg)}.pl-price-card.pl-featured .pl-muted,.pl-price-card.pl-featured li{color:color-mix(in srgb,var(--bg) 70%,transparent)}
.pl-price-card.pl-featured .pl-btn{background:var(--bg);color:var(--fg)}
.pl-price{font-size:48px;font-weight:var(--h-weight);letter-spacing:var(--h-track)}.pl-price small{font-size:16px;color:var(--muted);letter-spacing:0}
.pl-price-card ul,.pl-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;color:var(--muted)}.pl-price-card li::before,.pl-list li::before{content:'✓';margin-right:10px;color:var(--accent)}.pl-price-card .pl-btn{margin-top:auto}
.pl-testimonials{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px}
.pl-quote{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:34px;display:flex;flex-direction:column;gap:22px;margin:0}.pl-quote p{font-size:19px;line-height:1.55}
.pl-author{display:flex;align-items:center;gap:14px}.pl-author b{display:block;font-weight:600;font-size:15px}.pl-author span{color:var(--muted);font-size:14px}
.pl-avatar{width:46px;height:46px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:600;color:var(--accent-fg);background:linear-gradient(135deg,var(--accent),var(--accent2))}
.pl-team{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px;text-align:center}.pl-member{display:flex;flex-direction:column;align-items:center;gap:8px}.pl-member .pl-avatar{width:110px;height:110px;font-size:34px;margin-bottom:8px}.pl-member span{color:var(--muted);font-size:15px}
.pl-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.pl-gallery .pl-img{--h:260px}.pl-gallery .pl-img:nth-child(4n+1){grid-row:span 2;--h:536px}
.pl-faq{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.pl-faq details{background:var(--card);border:1px solid var(--line);border-radius:calc(var(--radius) * .7);padding:0 28px;transition:background .3s}
.pl-faq summary{list-style:none;cursor:pointer;padding:24px 0;font-size:18px;font-weight:500;display:flex;justify-content:space-between;gap:20px}.pl-faq summary::-webkit-details-marker{display:none}
.pl-faq summary::after{content:'+';font-size:24px;line-height:1;transition:transform .4s cubic-bezier(.2,.9,.25,1)}.pl-faq details[open] summary::after{transform:rotate(45deg)}
.pl-faq details p{color:var(--muted);padding:0 0 24px;animation:pl-in .5s cubic-bezier(.2,.8,.2,1)}
.pl-cta{border-radius:calc(var(--radius) * 1.3);padding:clamp(56px,8vw,100px) clamp(28px,6vw,80px);text-align:center;background:var(--fg);color:var(--bg);display:flex;flex-direction:column;align-items:center;gap:22px}
.pl-cta p{opacity:.7;font-size:19px;max-width:560px}.pl-cta .pl-btn{background:var(--bg);color:var(--fg)}
.pl-form{display:flex;flex-direction:column;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:34px}
.pl-input,.pl-form input,.pl-form textarea,.pl-form select{width:100%;padding:15px 18px;border-radius:14px;border:1px solid var(--line);background:var(--bg);color:var(--fg);font:inherit;font-size:16px;outline:none;transition:border-color .2s,box-shadow .2s}
.pl-form textarea{min-height:130px;resize:vertical}.pl-input:focus,.pl-form input:focus,.pl-form textarea:focus{border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent)}
.pl-contact{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}.pl-contact>div:first-child{display:flex;flex-direction:column;gap:20px}
.pl-hours{list-style:none;padding:0;margin:0}.pl-hours li{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--line);color:var(--muted)}.pl-hours li b{color:var(--fg);font-weight:500}
.pl-newsletter{display:flex;gap:10px;max-width:480px;margin:0 auto;width:100%}.pl-newsletter input{flex:1}
.pl-products{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px}
.pl-product{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:14px 14px 24px;display:flex;flex-direction:column;gap:10px;transition:transform .5s cubic-bezier(.2,.9,.25,1),box-shadow .5s}
.pl-product:hover{transform:translateY(-6px);box-shadow:var(--shadow)}.pl-product .pl-img{--h:220px;border-radius:calc(var(--radius) * .75);box-shadow:none}.pl-product h3,.pl-product p,.pl-product .pl-row{padding:0 10px}
.pl-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.pl-timeline{position:relative;max-width:760px;margin:0 auto;padding-left:34px;border-left:1px solid var(--line);display:flex;flex-direction:column;gap:44px}
.pl-tl-item{position:relative;display:flex;flex-direction:column;gap:6px}.pl-tl-item::before{content:'';position:absolute;left:-41px;top:6px;width:13px;height:13px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 6px var(--bg)}.pl-tl-item span{color:var(--muted);font-size:14px}.pl-tl-item p{color:var(--muted)}
.pl-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px}
.pl-kpi{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:24px;display:flex;flex-direction:column;gap:8px}.pl-kpi span{color:var(--muted);font-size:14px}.pl-kpi b{font-size:36px;font-weight:600;letter-spacing:-.02em}
.pl-trend{font-size:13px;font-weight:600}.pl-trend.up{color:#16a34a}.pl-trend.down{color:#dc2626}
.pl-progress{height:8px;border-radius:4px;background:var(--line);overflow:hidden}.pl-progress i{display:block;height:100%;width:var(--v,50%);background:var(--accent);border-radius:4px;transform-origin:left;animation:pl-bar 1.4s cubic-bezier(.2,.8,.2,1)}
.pl-table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;font-size:15px}
.pl-table th,.pl-table td{text-align:left;padding:14px 20px;border-bottom:1px solid var(--line)}.pl-table th{color:var(--muted);font-weight:500;font-size:13px;text-transform:uppercase;letter-spacing:.06em}.pl-table tr:last-child td{border:0}
.pl-dash{display:grid;grid-template-columns:230px 1fr;min-height:100vh}.pl-side{border-right:1px solid var(--line);padding:28px 18px;display:flex;flex-direction:column;gap:6px;background:var(--bg2)}
.pl-side a{padding:10px 14px;border-radius:12px;color:var(--muted);transition:background .2s,color .2s}.pl-side a:hover,.pl-side a.on{background:var(--card);color:var(--fg)}.pl-main{padding:34px;display:flex;flex-direction:column;gap:24px}
.pl-footer{padding:70px 0 40px;border-top:1px solid var(--line);color:var(--muted);font-size:15px}
.pl-footer .pl-container>div:first-child{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:36px}.pl-footer h4{color:var(--fg);font-size:14px;font-weight:600;margin-bottom:14px;letter-spacing:0}
.pl-footer a{display:block;padding:4px 0;transition:color .2s}.pl-footer a:hover{color:var(--fg)}.pl-copy{margin-top:56px;padding-top:24px;border-top:1px solid var(--line);font-size:13px}
@keyframes pl-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes pl-float{from{transform:translateY(-12px)}to{transform:translateY(12px)}}
@keyframes pl-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes pl-word{from{opacity:0;transform:translateY(.4em);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
.pl-rv{opacity:0;transform:translateY(36px) scale(.985);transition:opacity .9s cubic-bezier(.2,.8,.2,1) var(--d,0s),transform 1s cubic-bezier(.2,.8,.2,1) var(--d,0s)}.pl-rv.pl-on{opacity:1;transform:none}
.pl-w{display:inline-block;opacity:0;animation:pl-word .9s cubic-bezier(.2,.8,.2,1) forwards}
@media (max-width:900px){.pl-grid-3,.pl-grid-4{grid-template-columns:repeat(2,1fr)}.pl-hero-split .pl-container,.pl-feature-row,.pl-contact{grid-template-columns:1fr;gap:40px}.pl-feature-row:nth-child(even)>:first-child{order:0}
.pl-footer .pl-container>div:first-child{grid-template-columns:1fr 1fr}.pl-dash{grid-template-columns:1fr}.pl-side{display:none}.pl-gallery{grid-template-columns:1fr 1fr}}
@media (max-width:700px){.pl-links{display:none;position:absolute;top:68px;left:0;right:0;flex-direction:column;padding:20px 28px 28px;background:var(--bg);border-bottom:1px solid var(--line)}.pl-nav.pl-open .pl-links{display:flex}.pl-burger{display:block}
.pl-grid-2,.pl-grid-3,.pl-grid-4{grid-template-columns:1fr}.pl-newsletter{flex-direction:column}.pl-gallery .pl-img:nth-child(4n+1){grid-row:auto;--h:260px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.pl-rv,.pl-w{opacity:1!important;transform:none!important}}`;

  // reveal on scroll, word-by-word hero, nav blur, mobile menu, count-up numbers
  const JS = `(function(){var d=document;var nav=d.querySelector('.pl-nav');
if(nav){var f=function(){nav.classList.toggle('pl-scrolled',scrollY>10)};addEventListener('scroll',f,{passive:true});f();
var l=nav.querySelector('.pl-links');if(l&&!nav.querySelector('.pl-burger')){var b=d.createElement('button');b.className='pl-burger';b.setAttribute('aria-label','menu');b.textContent='\\u2630';l.parentNode.appendChild(b);b.onclick=function(){nav.classList.toggle('pl-open')};l.addEventListener('click',function(){nav.classList.remove('pl-open')})}}
d.querySelectorAll('.pl-hero h1,.pl-hero-split h1').forEach(function(h){if(h.children.length)return;var w=h.textContent.trim().split(/\\s+/);h.textContent='';w.forEach(function(x,i){var s=d.createElement('span');s.className='pl-w';s.style.animationDelay=(.08+i*.07)+'s';s.textContent=x;h.appendChild(s);h.appendChild(d.createTextNode(' '))})});
var sel='.pl-section-head,.pl-card,.pl-price-card,.pl-quote,.pl-stat,.pl-step,.pl-product,.pl-member,.pl-feature-row>*,.pl-img,.pl-menu,.pl-faq details,.pl-cta,.pl-kpi,.pl-tl-item,.pl-form,.pl-logos,.pl-hero .pl-lead,.pl-hero .pl-actions,.pl-hero .pl-badge,.pl-hero-split .pl-lead,.pl-hero-split .pl-actions,.pl-contact>div,.pl-table';
var els=[].slice.call(d.querySelectorAll(sel));var grp=new Map();els.forEach(function(e){var p=e.parentNode,n=grp.get(p)||0;grp.set(p,n+1);e.style.setProperty('--d',Math.min(n*.08,.5)+'s');e.classList.add('pl-rv')});
var cnt=function(e){var orig=e.textContent,m=orig.match(/^([^\\d]*)(\\d[\\d\\s.,]*\\d|\\d)([\\s\\S]*)$/);if(!m)return;var raw=m[2].replace(/[\\s,]/g,''),to=parseFloat(raw);if(!isFinite(to)||to===0)return;var dec=(raw.split('.')[1]||'').length,t0=performance.now();
var step=function(t){var k=Math.min(1,(t-t0)/1400),v=to*(1-Math.pow(1-k,3));e.textContent=m[1]+v.toLocaleString('ru-RU',{minimumFractionDigits:dec,maximumFractionDigits:dec})+m[3];if(k<1)requestAnimationFrame(step);else e.textContent=orig};requestAnimationFrame(step)};
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('pl-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(!x.isIntersecting)return;x.target.classList.add('pl-on');io.unobserve(x.target);x.target.querySelectorAll&&x.target.querySelectorAll('.pl-stat b,.pl-kpi b').forEach(cnt);if(x.target.matches('.pl-stat,.pl-kpi'))cnt(x.target.querySelector('b'))})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
els.forEach(function(e){io.observe(e)})})();`;

  // the component catalog the model sees (short, so small local models keep context for the page)
  const BLOCKS = [
    ['nav', 'Navigation', `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">Brand</a><nav class="pl-links"><a href="#features">…</a><a href="#contact">…</a></nav><a class="pl-btn" href="#contact">…</a></div></header>`],
    ['hero', 'Hero, centered', `<section class="pl-hero"><div class="pl-container"><span class="pl-badge">…</span><h1>Big short title</h1><p class="pl-lead">One sentence.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#">…</a><a class="pl-btn pl-btn-ghost pl-btn-lg" href="#">…</a></div></div></section>`],
    ['hero-split', 'Hero, text + picture', `<section class="pl-hero-split"><div class="pl-container"><div><span class="pl-eyebrow">…</span><h1>…</h1><p class="pl-lead">…</p><div class="pl-actions"><a class="pl-btn">…</a></div></div><div class="pl-img" data-emoji="☕" style="--h:460px"></div></div></section>`],
    ['section', 'Section with heading', `<section class="pl-section" id="features"><div class="pl-container"><div class="pl-section-head"><span class="pl-eyebrow">…</span><h2>…</h2><p>…</p></div> …blocks… </div></section>  (add pl-alt to the section for a tinted background)`],
    ['features', 'Feature cards', `<div class="pl-grid-3"><div class="pl-card"><div class="pl-card-icon">⚡</div><h3>…</h3><p>…</p></div> ×3</div>  (pl-grid-2 / pl-grid-4 also exist)`],
    ['feature-row', 'Text + picture rows (alternate automatically)', `<div class="pl-feature-row"><div><span class="pl-eyebrow">…</span><h2>…</h2><p>…</p></div><div class="pl-img" data-emoji="📱" data-label="…"></div></div>`],
    ['logos', 'Logo strip', `<div class="pl-logos"><span>Name</span> ×5</div>`],
    ['stats', 'Big numbers (animated count-up)', `<div class="pl-stats"><div class="pl-stat"><b>12 000+</b><span>…</span></div> ×3-4</div>`],
    ['steps', 'Numbered steps', `<div class="pl-steps"><div class="pl-step"><h3>…</h3><p>…</p></div> ×3</div>`],
    ['menu', 'Menu / price list', `<div class="pl-menu"><div class="pl-menu-item"><b>Капучино</b><span class="pl-price">250 ₽</span><small>…</small></div> ×N</div>`],
    ['pricing', 'Pricing plans', `<div class="pl-pricing"><div class="pl-price-card"><h3>…</h3><div class="pl-price">990 ₽<small>/мес</small></div><ul><li>…</li></ul><a class="pl-btn">…</a></div><div class="pl-price-card pl-featured">…</div></div>`],
    ['testimonials', 'Reviews', `<div class="pl-testimonials"><figure class="pl-quote"><p>«…»</p><div class="pl-author"><div class="pl-avatar">А</div><div><b>Имя</b><span>…</span></div></div></figure> ×3</div>`],
    ['team', 'Team', `<div class="pl-team"><div class="pl-member"><div class="pl-avatar">И</div><b>Имя</b><span>Роль</span></div> ×4</div>`],
    ['gallery', 'Gallery', `<div class="pl-gallery"><div class="pl-img" data-emoji="🥐" data-label="…"></div> ×6</div>`],
    ['products', 'Product cards', `<div class="pl-products"><div class="pl-product"><div class="pl-img" data-emoji="👟"></div><h3>…</h3><p class="pl-muted">…</p><div class="pl-row"><b>4 990 ₽</b><a class="pl-btn">…</a></div></div> ×N</div>`],
    ['faq', 'FAQ', `<div class="pl-faq"><details><summary>Вопрос?</summary><p>Ответ.</p></details> ×N</div>`],
    ['timeline', 'Timeline / history', `<div class="pl-timeline"><div class="pl-tl-item"><span>2024</span><h3>…</h3><p>…</p></div> ×N</div>`],
    ['cta', 'Call to action banner', `<div class="pl-cta"><h2>…</h2><p>…</p><a class="pl-btn pl-btn-lg">…</a></div>`],
    ['contact', 'Contacts + form', `<div class="pl-contact"><div><h2>…</h2><p class="pl-muted">Адрес, телефон</p><ul class="pl-hours"><li>Пн–Пт <b>8:00–22:00</b></li></ul></div><form class="pl-form"><input placeholder="Имя"><input placeholder="Телефон"><textarea placeholder="Сообщение"></textarea><button class="pl-btn">Отправить</button></form></div>`],
    ['newsletter', 'Email signup', `<form class="pl-newsletter"><input class="pl-input" placeholder="Email"><button class="pl-btn">…</button></form>`],
    ['list', 'Check list', `<ul class="pl-list"><li>…</li></ul>`],
    ['kpis', 'Dashboard KPI cards', `<div class="pl-kpis"><div class="pl-kpi"><span>Выручка</span><b>1 240 000 ₽</b><span class="pl-trend up">+12%</span><div class="pl-progress"><i style="--v:72%"></i></div></div> ×4</div>`],
    ['table', 'Table', `<table class="pl-table"><tr><th>…</th></tr><tr><td>…</td></tr></table>`],
    ['dashboard', 'Dashboard layout', `<div class="pl-dash"><aside class="pl-side"><b class="pl-logo">App</b><a class="on">Обзор</a><a>…</a></aside><main class="pl-main"><h2>…</h2> …kpis, table… </main></div>`],
    ['footer', 'Footer', `<footer class="pl-footer"><div class="pl-container"><div><div><b class="pl-logo">Brand</b><p>…</p></div><div><h4>…</h4><a>…</a></div> ×3</div><div class="pl-copy">© 2026 …</div></div></footer>`]
  ];

  // few-shot: request -> page body built only from the blocks
  const EXAMPLES = [
    { k: /коф|кафе|ресторан|пекар|еда|кухн|cafe|coffee|restaurant|bakery|food/i, q: 'Сделай сайт кофейни «Зерно» в Тольятти',
      a: `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">Зерно</a><nav class="pl-links"><a href="#menu">Меню</a><a href="#about">О нас</a><a href="#contact">Контакты</a></nav><a class="pl-btn" href="#contact">Забронировать</a></div></header>
<section class="pl-hero"><div class="pl-container"><span class="pl-badge">Свежая обжарка каждую неделю</span><h1>Кофе, ради которого просыпаются</h1><p class="pl-lead">Небольшая кофейня в центре Тольятти. Зерно своей обжарки, домашняя выпечка и тишина.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#menu">Смотреть меню</a><a class="pl-btn pl-btn-ghost pl-btn-lg" href="#contact">Как добраться</a></div></div></section>
<section class="pl-section pl-alt" id="menu"><div class="pl-container"><div class="pl-section-head"><span class="pl-eyebrow">Меню</span><h2>Просто и вкусно</h2></div><div class="pl-menu"><div class="pl-menu-item"><b>Эспрессо</b><span class="pl-price">150 ₽</span><small>Плотный, с нотами шоколада</small></div><div class="pl-menu-item"><b>Капучино</b><span class="pl-price">250 ₽</span><small>Бархатная молочная пена</small></div><div class="pl-menu-item"><b>Раф лавандовый</b><span class="pl-price">290 ₽</span><small>Сливки и лаванда</small></div><div class="pl-menu-item"><b>Круассан</b><span class="pl-price">180 ₽</span><small>Печём каждое утро</small></div></div></div></section>
<section class="pl-section" id="about"><div class="pl-container"><div class="pl-feature-row"><div><span class="pl-eyebrow">О нас</span><h2>Обжариваем сами</h2><p>Покупаем зерно у фермеров и обжариваем небольшими партиями прямо в кофейне.</p></div><div class="pl-img" data-emoji="☕" data-label="Наша обжарка"></div></div></div></section>
<section class="pl-section pl-alt"><div class="pl-container"><div class="pl-stats"><div class="pl-stat"><b>12</b><span>сортов зерна</span></div><div class="pl-stat"><b>4.9</b><span>оценка гостей</span></div><div class="pl-stat"><b>2019</b><span>год открытия</span></div></div></div></section>
<section class="pl-section" id="contact"><div class="pl-container"><div class="pl-contact"><div><h2>Ждём в гости</h2><p class="pl-muted">Тольятти, ул. Победы, 12 · +7 900 000-00-00</p><ul class="pl-hours"><li>Пн–Пт <b>8:00–21:00</b></li><li>Сб–Вс <b>9:00–22:00</b></li></ul></div><form class="pl-form"><input placeholder="Имя"><input placeholder="Телефон"><button class="pl-btn">Забронировать столик</button></form></div></div></section>
<footer class="pl-footer"><div class="pl-container"><div><div><b class="pl-logo">Зерно</b><p>Кофейня своей обжарки</p></div><div><h4>Меню</h4><a href="#menu">Кофе</a><a href="#menu">Выпечка</a></div><div><h4>Мы</h4><a href="#about">О нас</a><a href="#contact">Контакты</a></div><div><h4>Соцсети</h4><a href="#">VK</a><a href="#">Telegram</a></div></div><div class="pl-copy">© 2026 Зерно</div></div></footer>` },
    { k: /приложени|сервис|стартап|saas|app|продукт|платформ|нейросет|ии\b|ai\b/i, q: 'Лендинг для приложения-трекера привычек',
      a: `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">Habitly</a><nav class="pl-links"><a href="#features">Возможности</a><a href="#pricing">Цены</a><a href="#faq">Вопросы</a></nav><a class="pl-btn" href="#pricing">Скачать</a></div></header>
<section class="pl-hero"><div class="pl-container"><span class="pl-badge">Новое · iOS и Android</span><h1>Привычки, которые остаются</h1><p class="pl-lead">Отмечай, анализируй и не срывайся. Один экран вместо десяти напоминаний.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#pricing">Начать бесплатно</a><a class="pl-btn pl-btn-ghost pl-btn-lg" href="#features">Как это работает</a></div></div></section>
<section class="pl-section pl-alt" id="features"><div class="pl-container"><div class="pl-section-head"><h2>Всё, что нужно. Ничего лишнего.</h2></div><div class="pl-grid-3"><div class="pl-card"><div class="pl-card-icon">✓</div><h3>Одно касание</h3><p>Отметить привычку — секунда.</p></div><div class="pl-card"><div class="pl-card-icon">📈</div><h3>Понятная статистика</h3><p>Серии и прогресс за месяц.</p></div><div class="pl-card"><div class="pl-card-icon">🔔</div><h3>Умные напоминания</h3><p>Приходят, когда удобно тебе.</p></div></div></div></section>
<section class="pl-section" id="pricing"><div class="pl-container"><div class="pl-section-head"><h2>Цены</h2></div><div class="pl-pricing"><div class="pl-price-card"><h3>Бесплатно</h3><div class="pl-price">0 ₽</div><ul><li>3 привычки</li><li>Напоминания</li></ul><a class="pl-btn pl-btn-ghost">Начать</a></div><div class="pl-price-card pl-featured"><h3>Pro</h3><div class="pl-price">199 ₽<small>/мес</small></div><ul><li>Без ограничений</li><li>Статистика</li><li>Синхронизация</li></ul><a class="pl-btn">Попробовать</a></div></div></div></section>
<section class="pl-section pl-alt" id="faq"><div class="pl-container"><div class="pl-faq"><details><summary>Это правда бесплатно?</summary><p>Да, базовая версия бесплатна навсегда.</p></details><details><summary>Данные в безопасности?</summary><p>Всё хранится зашифрованным.</p></details></div></div></section>
<section class="pl-section"><div class="pl-container"><div class="pl-cta"><h2>Начни сегодня</h2><p>Первая серия — самая важная.</p><a class="pl-btn pl-btn-lg">Скачать Habitly</a></div></div></section>
<footer class="pl-footer"><div class="pl-container"><div><div><b class="pl-logo">Habitly</b><p>Трекер привычек</p></div><div><h4>Продукт</h4><a href="#features">Возможности</a><a href="#pricing">Цены</a></div><div><h4>Помощь</h4><a href="#faq">Вопросы</a></div><div><h4>Связь</h4><a href="#">Telegram</a></div></div><div class="pl-copy">© 2026 Habitly</div></div></footer>` },
    { k: /портфолио|фотограф|дизайнер|художник|резюме|personal|portfolio|photograph/i, q: 'Портфолио фотографа Анны',
      a: `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">Анна Светлова</a><nav class="pl-links"><a href="#works">Работы</a><a href="#price">Услуги</a><a href="#contact">Связаться</a></nav></div></header>
<section class="pl-hero-split"><div class="pl-container"><div><span class="pl-eyebrow">Фотограф · Самара</span><h1>Свет, который запоминается</h1><p class="pl-lead">Портреты, свадьбы и семейные истории — живые и без постановки.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#contact">Записаться</a></div></div><div class="pl-img" data-emoji="📷" style="--h:520px"></div></div></section>
<section class="pl-section" id="works"><div class="pl-container"><div class="pl-section-head"><h2>Работы</h2></div><div class="pl-gallery"><div class="pl-img" data-label="Портрет"></div><div class="pl-img" data-label="Свадьба"></div><div class="pl-img" data-label="Семья"></div><div class="pl-img" data-label="Love story"></div><div class="pl-img" data-label="Город"></div><div class="pl-img" data-label="Студия"></div></div></div></section>
<section class="pl-section pl-alt" id="price"><div class="pl-container"><div class="pl-grid-3"><div class="pl-card"><h3>Портрет</h3><p>1 час · 30 фото</p><b>5 000 ₽</b></div><div class="pl-card"><h3>Семья</h3><p>2 часа · 60 фото</p><b>9 000 ₽</b></div><div class="pl-card"><h3>Свадьба</h3><p>Весь день</p><b>от 35 000 ₽</b></div></div></div></section>
<section class="pl-section" id="contact"><div class="pl-container"><div class="pl-cta"><h2>Давайте снимать</h2><p>Напишите — подберём дату и место.</p><a class="pl-btn pl-btn-lg" href="#">Написать в Telegram</a></div></div></section>
<footer class="pl-footer"><div class="pl-container"><div class="pl-copy">© 2026 Анна Светлова</div></div></footer>` },
    { k: /магазин|товар|каталог|shop|store|одежд|обув|интернет-магазин/i, q: 'Интернет-магазин кроссовок',
      a: `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">STEP</a><nav class="pl-links"><a href="#catalog">Каталог</a><a href="#delivery">Доставка</a></nav><a class="pl-btn" href="#catalog">Купить</a></div></header>
<section class="pl-hero"><div class="pl-container"><h1>Лёгкость в каждом шаге</h1><p class="pl-lead">Оригинальные кроссовки с доставкой за 1 день.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#catalog">В каталог</a></div></div></section>
<section class="pl-section pl-alt" id="catalog"><div class="pl-container"><div class="pl-section-head"><h2>Новинки</h2></div><div class="pl-products"><div class="pl-product"><div class="pl-img" data-emoji="👟"></div><h3>Air Light</h3><p class="pl-muted">Для бега</p><div class="pl-row"><b>8 990 ₽</b><a class="pl-btn">В корзину</a></div></div><div class="pl-product"><div class="pl-img" data-emoji="👞"></div><h3>Street One</h3><p class="pl-muted">На каждый день</p><div class="pl-row"><b>6 490 ₽</b><a class="pl-btn">В корзину</a></div></div><div class="pl-product"><div class="pl-img" data-emoji="🥾"></div><h3>Trail Pro</h3><p class="pl-muted">Для походов</p><div class="pl-row"><b>11 990 ₽</b><a class="pl-btn">В корзину</a></div></div></div></div></section>
<section class="pl-section" id="delivery"><div class="pl-container"><div class="pl-steps"><div class="pl-step"><h3>Выбери</h3><p>Размер и цвет.</p></div><div class="pl-step"><h3>Оформи</h3><p>За минуту.</p></div><div class="pl-step"><h3>Получи</h3><p>Курьер привезёт завтра.</p></div></div></div></section>
<footer class="pl-footer"><div class="pl-container"><div class="pl-copy">© 2026 STEP</div></div></footer>` },
    { k: /барбер|салон|красот|маникюр|парикмахер|спа|beauty|salon|barber|клиник|стомат/i, q: 'Сайт барбершопа',
      a: `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">Бритва</a><nav class="pl-links"><a href="#services">Услуги</a><a href="#team">Мастера</a><a href="#contact">Запись</a></nav><a class="pl-btn" href="#contact">Записаться</a></div></header>
<section class="pl-hero"><div class="pl-container"><span class="pl-badge">Без очередей</span><h1>Стрижка, после которой хочется улыбаться</h1><p class="pl-lead">Мужские стрижки и бритьё опасной бритвой.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#contact">Записаться онлайн</a></div></div></section>
<section class="pl-section pl-alt" id="services"><div class="pl-container"><div class="pl-section-head"><h2>Услуги</h2></div><div class="pl-menu"><div class="pl-menu-item"><b>Мужская стрижка</b><span class="pl-price">1 200 ₽</span></div><div class="pl-menu-item"><b>Стрижка бороды</b><span class="pl-price">800 ₽</span></div><div class="pl-menu-item"><b>Королевское бритьё</b><span class="pl-price">1 500 ₽</span></div></div></div></section>
<section class="pl-section" id="team"><div class="pl-container"><div class="pl-team"><div class="pl-member"><div class="pl-avatar">А</div><b>Артём</b><span>Топ-барбер</span></div><div class="pl-member"><div class="pl-avatar">Д</div><b>Денис</b><span>Барбер</span></div><div class="pl-member"><div class="pl-avatar">М</div><b>Максим</b><span>Барбер</span></div></div></div></section>
<section class="pl-section pl-alt"><div class="pl-container"><div class="pl-testimonials"><figure class="pl-quote"><p>«Лучшая стрижка в городе, хожу второй год».</p><div class="pl-author"><div class="pl-avatar">И</div><div><b>Игорь</b><span>клиент</span></div></div></figure><figure class="pl-quote"><p>«Уютно, быстро и без пафоса».</p><div class="pl-author"><div class="pl-avatar">С</div><div><b>Сергей</b><span>клиент</span></div></div></figure></div></div></section>
<section class="pl-section" id="contact"><div class="pl-container"><div class="pl-contact"><div><h2>Запись</h2><ul class="pl-hours"><li>Ежедневно <b>10:00–21:00</b></li></ul></div><form class="pl-form"><input placeholder="Имя"><input placeholder="Телефон"><button class="pl-btn">Записаться</button></form></div></div></section>
<footer class="pl-footer"><div class="pl-container"><div class="pl-copy">© 2026 Бритва</div></div></footer>` },
    { k: /фитнес|спорт|зал|тренер|йог|gym|fitness|yoga/i, q: 'Сайт фитнес-клуба',
      a: `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">PULSE GYM</a><nav class="pl-links"><a href="#programs">Программы</a><a href="#pricing">Абонементы</a></nav><a class="pl-btn" href="#pricing">Пробное занятие</a></div></header>
<section class="pl-hero-split"><div class="pl-container"><div><span class="pl-eyebrow">Открыто 24/7</span><h1>Сильнее с каждым днём</h1><p class="pl-lead">Зал, групповые занятия и тренеры, которые помнят твоё имя.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#pricing">Первое занятие бесплатно</a></div></div><div class="pl-img" data-emoji="🏋️" style="--h:480px"></div></div></section>
<section class="pl-section pl-alt"><div class="pl-container"><div class="pl-stats"><div class="pl-stat"><b>1500</b><span>м² зала</span></div><div class="pl-stat"><b>25</b><span>тренеров</span></div><div class="pl-stat"><b>40</b><span>занятий в неделю</span></div></div></div></section>
<section class="pl-section" id="programs"><div class="pl-container"><div class="pl-grid-3"><div class="pl-card"><div class="pl-card-icon">💪</div><h3>Силовые</h3><p>Свободные веса и тренажёры.</p></div><div class="pl-card"><div class="pl-card-icon">🧘</div><h3>Йога</h3><p>Гибкость и спокойствие.</p></div><div class="pl-card"><div class="pl-card-icon">🥊</div><h3>Бокс</h3><p>Кардио и техника.</p></div></div></div></section>
<section class="pl-section pl-alt" id="pricing"><div class="pl-container"><div class="pl-pricing"><div class="pl-price-card"><h3>Месяц</h3><div class="pl-price">2 900 ₽</div><ul><li>Зал без ограничений</li></ul><a class="pl-btn pl-btn-ghost">Выбрать</a></div><div class="pl-price-card pl-featured"><h3>Год</h3><div class="pl-price">24 000 ₽</div><ul><li>Зал и группы</li><li>2 персональные тренировки</li></ul><a class="pl-btn">Выбрать</a></div></div></div></section>
<footer class="pl-footer"><div class="pl-container"><div class="pl-copy">© 2026 PULSE GYM</div></div></footer>` },
    { k: /дашборд|панел|админ|статистик|отчёт|отчет|crm|dashboard|admin|analytics/i, q: 'Дашборд продаж',
      a: `<div class="pl-dash"><aside class="pl-side"><b class="pl-logo">Sales</b><a class="on" href="#">Обзор</a><a href="#">Заказы</a><a href="#">Клиенты</a><a href="#">Настройки</a></aside><main class="pl-main"><div class="pl-row"><h2>Обзор</h2><span class="pl-badge">Октябрь 2026</span></div>
<div class="pl-kpis"><div class="pl-kpi"><span>Выручка</span><b>1 240 000 ₽</b><span class="pl-trend up">+12%</span><div class="pl-progress"><i style="--v:72%"></i></div></div><div class="pl-kpi"><span>Заказы</span><b>384</b><span class="pl-trend up">+5%</span><div class="pl-progress"><i style="--v:55%"></i></div></div><div class="pl-kpi"><span>Средний чек</span><b>3 229 ₽</b><span class="pl-trend down">−2%</span><div class="pl-progress"><i style="--v:40%"></i></div></div></div>
<table class="pl-table"><tr><th>Клиент</th><th>Сумма</th><th>Статус</th></tr><tr><td>Иван П.</td><td>4 500 ₽</td><td>Оплачен</td></tr><tr><td>Мария К.</td><td>2 100 ₽</td><td>В пути</td></tr><tr><td>ООО «Ромашка»</td><td>18 000 ₽</td><td>Новый</td></tr></table></main></div>` },
    { k: /компани|агентств|студи|услуг|бизнес|юрист|строит|ремонт|завод|agency|company|business|service/i, q: 'Сайт IT-студии',
      a: `<header class="pl-nav"><div class="pl-container"><a class="pl-logo" href="#">Nord Studio</a><nav class="pl-links"><a href="#services">Услуги</a><a href="#process">Как работаем</a><a href="#contact">Контакты</a></nav><a class="pl-btn" href="#contact">Обсудить проект</a></div></header>
<section class="pl-hero"><div class="pl-container"><span class="pl-badge">Сайты · Приложения · Дизайн</span><h1>Делаем цифровые продукты, которые работают</h1><p class="pl-lead">От идеи до запуска за 6 недель.</p><div class="pl-actions"><a class="pl-btn pl-btn-lg" href="#contact">Оставить заявку</a></div></div></section>
<section class="pl-section pl-alt"><div class="pl-container"><div class="pl-logos"><span>Сбер</span><span>Лада</span><span>Тинькофф</span><span>Яндекс</span></div></div></section>
<section class="pl-section" id="services"><div class="pl-container"><div class="pl-section-head"><h2>Услуги</h2></div><div class="pl-grid-3"><div class="pl-card"><div class="pl-card-icon">🖥</div><h3>Сайты</h3><p>Лендинги и корпоративные сайты.</p></div><div class="pl-card"><div class="pl-card-icon">📱</div><h3>Приложения</h3><p>iOS, Android, веб.</p></div><div class="pl-card"><div class="pl-card-icon">🎨</div><h3>Дизайн</h3><p>Интерфейсы и айдентика.</p></div></div></div></section>
<section class="pl-section pl-alt" id="process"><div class="pl-container"><div class="pl-steps"><div class="pl-step"><h3>Бриф</h3><p>Разбираем задачу.</p></div><div class="pl-step"><h3>Дизайн</h3><p>Показываем макеты.</p></div><div class="pl-step"><h3>Разработка</h3><p>Пишем и тестируем.</p></div><div class="pl-step"><h3>Запуск</h3><p>Публикуем и поддерживаем.</p></div></div></div></section>
<section class="pl-section" id="contact"><div class="pl-container"><div class="pl-contact"><div><h2>Расскажите о проекте</h2><p class="pl-muted">Ответим в течение дня.</p></div><form class="pl-form"><input placeholder="Имя"><input placeholder="Email или телефон"><textarea placeholder="Задача"></textarea><button class="pl-btn">Отправить</button></form></div></div></section>
<footer class="pl-footer"><div class="pl-container"><div><div><b class="pl-logo">Nord Studio</b><p>Цифровая студия</p></div><div><h4>Услуги</h4><a>Сайты</a><a>Приложения</a></div><div><h4>Студия</h4><a>О нас</a><a>Вакансии</a></div><div><h4>Связь</h4><a>hello@nord.ru</a></div></div><div class="pl-copy">© 2026 Nord Studio</div></div></footer>` }
  ];

  const theme = id => THEMES[id] || THEMES.apple;
  const kitCss = id => `:root{${theme(id).vars}}\n${CSS}\n${theme(id).extra}`;
  const catalog = () => BLOCKS.map(([id, name, html]) => `- ${name}: ${html}`).join('\n');
  function pickExamples(text, n) {
    const hits = EXAMPLES.filter(e => e.k.test(text));
    const rest = EXAMPLES.filter(e => !hits.includes(e));
    return [...hits, ...rest].slice(0, n || 2);
  }
  function prompt(id, lang) {
    const t = theme(id);
    return `\n\nDESIGN SYSTEM (style: ${t.en}). Build the page ONLY from these ready components — do NOT write CSS, do NOT add <style> tags or style frameworks, do not invent new class names. PULSAR adds the CSS, the theme and all animations itself. Use real, specific texts for the user's business (no lorem ipsum). Pictures: use <div class="pl-img" data-emoji="…" data-label="…"></div>. Put the whole page inside <body> of one complete HTML file (with <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>…</title></head>). Small inline style only for --h or --v. JavaScript only if the page really needs logic.
Components:
${catalog()}`;
  }
  // remove the model's own CSS and add the kit (marked, so it can be removed again before an edit)
  function apply(html, id) {
    let h = strip(html);
    h = h.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi, m => /fonts\.googleapis/.test(m) ? m : '')
      .replace(/<script\b[^>]*src=["'][^"']*(tailwind|bootstrap)[^"']*["'][^>]*>\s*<\/script>/gi, '');
    if (!/<html[\s>]/i.test(h)) h = `<!DOCTYPE html>\n<html lang="ru">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Site</title></head>\n<body>\n${h}\n</body>\n</html>`;
    if (!/<meta[^>]+viewport/i.test(h)) h = h.replace(/<head[^>]*>/i, m => m + '<meta name="viewport" content="width=device-width,initial-scale=1">');
    if (!/<head[\s>]/i.test(h)) h = h.replace(/<html[^>]*>/i, m => m + '<head><meta charset="utf-8"></head>');
    const css = `<style id="pl-kit">${kitCss(id)}</style>`, js = `<script id="pl-kit-js">${JS}</scr` + `ipt>`;
    h = h.replace(/<\/head>/i, css + '\n</head>');
    h = /<\/body>/i.test(h) ? h.replace(/<\/body>(?![\s\S]*<\/body>)/i, js + '\n</body>') : h + js;
    return h;
  }
  const strip = html => String(html || '').replace(/<style id="pl-kit">[\s\S]*?<\/style>\s*/i, '').replace(/<script id="pl-kit-js">[\s\S]*?<\/script>\s*/i, '');
  const uses = html => /class=["'][^"']*\bpl-(nav|hero|section|card|container|footer|dash|menu|pricing)/.test(html || '');
  const preview = (id, k) => apply(`<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><title>Preview</title></head><body>${EXAMPLES[k || 0].a}</body></html>`, id);
  return { THEMES, BLOCKS, EXAMPLES, prompt, apply, strip, uses, pickExamples, preview };
})();
