#!/usr/bin/env node
// Builds the Where To Go London blog section from the live About page template.
// Run from the repo root: node ../build-blog.js   (copy this file one level ABOVE the repo first)
// Safe to re-run: it rewrites the blog pages and blog.css, and patches the nav, footer and sitemap only once.
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const BASE = 'https://wheretogolondon.co.uk';
const SLUG = 'what-types-of-activities-can-i-do-in-london';
const TITLE = 'What types of activities can I do in London?';
const PUBLISHED = '2026-10-24';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escA = s => esc(s).replace(/"/g, '&quot;');

// ---------- CSS (written to blog.css; site.css is untouched) ----------
const CSS = `/* Where To Go London blog styles. Uses the variables from site.css. */
.tag{display:inline-block;background:var(--racing);color:var(--ink);font-family:var(--data);font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:5px 10px;font-weight:500;margin:0 0 18px}
.byline .by{display:flex;align-items:center;gap:10px}
.av{width:36px;height:36px;border-radius:50%;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:15px;flex:none}
.ph{position:relative;overflow:hidden;border:3px solid var(--ink);background:repeating-linear-gradient(-45deg,rgba(255,255,255,.2) 0 14px,transparent 14px 28px),var(--c,var(--darts));display:flex;align-items:flex-end;padding:12px;box-sizing:border-box}
.ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.ph-label{position:relative;font-family:var(--data);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;background:var(--paper);color:var(--mid);padding:5px 9px}
.pfig{margin:0}
.pfig .pcredit{font-family:var(--data);font-size:11px;color:var(--mid);letter-spacing:.02em;margin-top:8px}
.pfig--hero{margin:0 0 clamp(28px,4vw,48px)}
.pfig--hero .ph{min-height:clamp(220px,34vw,440px)}
.introrow{display:flex;flex-wrap:wrap;gap:24px 48px;margin-bottom:clamp(36px,5vw,64px)}
.short{flex:1 1 440px;border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);padding:clamp(18px,2.6vw,26px) 0;box-sizing:border-box}
.kicker{font-family:var(--data);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin:0 0 10px}
.short p{margin:0;font-size:clamp(19px,2.1vw,24px);line-height:1.4;font-weight:500;max-width:46ch}
.toc{flex:1 1 320px;border:3px solid var(--ink);box-sizing:border-box;align-self:flex-start}
.toc-h{background:var(--ink);color:#fff;font-family:var(--data);font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:10px 16px}
.toc ol{list-style:none;margin:0;padding:0}
.toc a{display:flex;gap:12px;padding:9px 16px;text-decoration:none;border-top:1px solid var(--rule);font-size:15.5px;font-weight:500}
.toc .n{font-family:var(--data);font-size:13px;color:var(--mid);min-width:22px;font-weight:400}
.toc a:hover{background:var(--ink);color:#fff}
.toc a:hover .n{color:#fff}
.toc .last a{border-top:2px solid var(--ink);font-weight:600}
.post h2{font-family:var(--display);font-variation-settings:'wdth' 112,'wght' 800;font-size:clamp(25px,3.6vw,48px);text-transform:uppercase;letter-spacing:-.025em;line-height:.98;margin:0 0 20px;max-width:20ch}
.post h2::before{content:"";display:block;width:64px;height:9px;background:var(--racing);margin-bottom:14px}
.pblock{max-width:70ch;margin:0 0 clamp(36px,5vw,64px)}
.pblock p,.post-p{margin:0 0 15px;max-width:68ch}
.post-p a{color:var(--ink);font-weight:600;text-decoration:underline;text-decoration-thickness:2px;text-decoration-color:var(--racing);text-underline-offset:3px}
.post-p a:hover{background:var(--yellow)}
.asec{border-top:3px solid var(--ink);padding:clamp(28px,4vw,48px) 0;display:flex;flex-wrap:wrap;gap:28px 44px}
.asec-media{flex:1 1 320px;max-width:440px;box-sizing:border-box}
.asec-media .ph{min-height:260px}
.asec-body{flex:2 1 460px;min-width:0}
.asec-head{display:flex;align-items:baseline;gap:14px;margin:0 0 12px}
.asec-head .num{font-family:var(--data);font-size:14px;color:var(--mid);letter-spacing:.06em}
.asec h3{margin:0;font-family:var(--display);font-variation-settings:'wdth' 116,'wght' 800;font-size:clamp(26px,3.2vw,40px);text-transform:uppercase;letter-spacing:-.02em;line-height:1}
.asec-body > p{margin:0 0 20px;max-width:62ch}
.where{font-family:var(--data);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin:0 0 8px}
.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px;list-style:none;margin:0;padding:0}
.vgrid li{margin:0;padding:0}
.vc{display:flex;flex-direction:column;gap:2px;border:2px solid var(--ink);padding:10px 12px;text-decoration:none;background:var(--paper);height:100%;box-sizing:border-box}
.vc b{display:block;font-family:var(--display);font-variation-settings:'wdth' 106,'wght' 700;font-size:13.5px;letter-spacing:.03em;text-transform:uppercase;line-height:1.2}
.vc span{font-size:13.5px;color:var(--mid);line-height:1.35}
.vc:hover{background:var(--grey)}
.decidesec{border-top:3px solid var(--ink);padding-top:clamp(28px,4vw,48px)}
.decide{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2px;background:var(--ink);border:3px solid var(--ink);margin:0 0 28px}
.decide > div{background:var(--paper);padding:20px}
.decide .k{font-family:var(--data);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin:0 0 8px}
.decide b{display:block;font-family:var(--display);font-variation-settings:'wdth' 108,'wght' 800;font-size:19px;text-transform:uppercase;line-height:1.1;margin-bottom:8px}
.decide span{font-size:15px;line-height:1.45}
.agebox{border:3px solid var(--ink);background:var(--yellow);padding:18px 22px;max-width:68ch;margin:0 0 28px}
.agebox p{margin:0;font-size:16px}
.ctaband{background:var(--ink);color:#fff;margin:clamp(24px,4vw,48px) 0 0}
.ctaband .wrap{display:flex;flex-wrap:wrap;gap:20px 40px;align-items:center;justify-content:space-between;padding-top:clamp(32px,5vw,60px);padding-bottom:clamp(32px,5vw,60px)}
.ctaband h2{margin:0;flex:1 1 420px;font-family:var(--display);font-variation-settings:'wdth' 118,'wght' 800;font-size:clamp(26px,3.6vw,46px);text-transform:uppercase;letter-spacing:-.025em;line-height:1;max-width:none;color:#fff}
.ctaband h2::before{display:none}
.btn--orange{background:var(--racing);color:var(--ink);border-color:var(--racing)}
.btn--orange:hover{background:var(--paper);color:var(--ink);border-color:var(--paper)}
.bloghead{display:flex;flex-wrap:wrap;align-items:flex-end;gap:20px 48px;margin-bottom:clamp(28px,4vw,48px)}
.bloghead h1{flex:1 1 560px;margin:0;max-width:none}
.bloghead p{flex:1 1 320px;max-width:44ch;margin:0;font-size:clamp(18px,2vw,22px);line-height:1.4}
.chiprow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 clamp(28px,4vw,44px)}
.chiprow .lbl{font-family:var(--data);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);margin-right:8px}
.feat{display:flex;flex-wrap:wrap;border:3px solid var(--ink);text-decoration:none;color:var(--ink);box-shadow:8px 8px 0 var(--ink);margin:0 8px clamp(40px,6vw,72px) 0}
.feat .ph{flex:1 1 440px;min-height:340px;border:0}
.feat-body{flex:1 1 400px;padding:clamp(24px,3.4vw,44px);display:flex;flex-direction:column;gap:16px;justify-content:center;box-sizing:border-box}
.feat-body .tag{align-self:flex-start;margin:0}
.feat h2{margin:0;font-family:var(--display);font-variation-settings:'wdth' 116,'wght' 800;font-size:clamp(28px,3.6vw,46px);line-height:1;letter-spacing:-.025em;text-transform:uppercase;max-width:none}
.feat h2::before{display:none}
.feat:hover h2{text-decoration:underline;text-underline-offset:4px}
.feat-body p{margin:0;font-size:18px;line-height:1.45;max-width:46ch}
.feat-meta{font-family:var(--data);font-size:12px;color:var(--mid);letter-spacing:.03em;display:flex;flex-wrap:wrap;gap:6px 22px}
.feat .btn{align-self:flex-start}
.feat:hover .btn{background:var(--paper);color:var(--ink)}
.soonsec h2{font-family:var(--display);font-variation-settings:'wdth' 118,'wght' 800;font-size:clamp(24px,3.2vw,40px);text-transform:uppercase;letter-spacing:-.025em;line-height:1;margin:0 0 20px}
.soonsec h2::before{content:"";display:block;width:64px;height:9px;background:var(--racing);margin-bottom:14px}
.soon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin:0 0 clamp(40px,6vw,72px);padding:0;list-style:none}
.soon-card{border:3px dashed var(--ink);min-height:220px;display:flex;flex-direction:column}
.soon-card .bar{height:96px;background:repeating-linear-gradient(-45deg,rgba(255,255,255,.2) 0 10px,transparent 10px 20px),var(--c);border-bottom:3px dashed var(--ink)}
.soon-card div{padding:14px 16px 16px;display:flex;flex-direction:column;gap:8px}
.soon-card small{font-family:var(--data);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--mid)}
.soon-card b{font-family:var(--display);font-variation-settings:'wdth' 108,'wght' 800;font-size:19px;text-transform:uppercase;letter-spacing:-.015em;line-height:1.05}
@media(max-width:520px){.asec-media{max-width:none}}
`;

// ---------- Content ----------
const SECTIONS = [
 { id:'darts', title:'Darts', color:'#0060df', chip:'darts', text:'Social darts is one of the easiest ways to get a mixed group playing. Each group gets its own lane with a dartboard, cameras track every throw and the scoring is done for you, so nobody needs to do the maths.',
   venues:[['Flight Club, Shoreditch','flight-club/shoreditch','Social darts with automatic scoring'],['Flight Club, Victoria','flight-club/victoria','Closer to the West End'],['Flight Club, Bloomsbury','flight-club/bloomsbury','Two floors and a carousel bar'],['Flight Club, Islington','flight-club/islington','Heated terrace garden'],['Oche, The Strand','oche/the-strand','Darts with a full kitchen attached']] },
 { id:'bowling', title:'Bowling', color:'#ff5a00', chip:'bowling', text:'Bowling suits groups who want to chat between turns, and London has everything from retro boutique lanes to large tenpin halls.',
   venues:[['All Star Lanes, Brick Lane','all-star-lanes/brick-lane','Boutique bowling with a diner menu'],['All Star Lanes, Holborn','all-star-lanes/holborn','Four retro lanes and a speakeasy bar'],['All Star Lanes, Stratford','all-star-lanes/stratford','Fourteen lanes and karaoke booths'],['All Star Lanes, White City','all-star-lanes/white-city','Eight lanes, two bars and a terrace'],['Lane7, Victoria','lane7/victoria','Mini golf, shuffleboard and an 18+ arcade hall'],['Hollywood Bowl, The O2','hollywood-bowl/the-o2','Thirteen tenpin lanes plus duckpin bowling'],['Rowans, Finsbury Park','rowans/finsbury-park','Bowling, karaoke and pool in one building']] },
 { id:'golf', title:'Golf and crazy golf', color:'#e8112d', chip:'golf', text:'Mini golf in London ranges from classic crazy golf to technology-led courses, where each ball carries a chip and screens track your score automatically.',
   venues:[['Puttshack, Bank','puttshack/bank','Three tech-scored courses'],['Puttshack, White City','puttshack/white-city','Inside Westfield London'],['Swingers, West End','swingers/west-end','Nine holes, four cocktail bars and street food'],['Topgolf, Chigwell','topgolf/chigwell','Scored driving range games in heated bays']] },
 { id:'shuffleboard', title:'Shuffleboard and boules', color:'#6e2fe0', chip:'shuffleboard', text:'Shuffleboard means sliding weighted pucks down a long board to score points, and most people pick it up within a few rounds. Boules is the French game of throwing metal balls close to a small target.',
   venues:[['Electric Shuffle, London Bridge','electric-shuffle/london-bridge','Instant scoring, players must be 18 or over'],["Electric Shuffle, King's Cross",'electric-shuffle/kings-cross','Groups of 2 to 32'],['Electric Shuffle, Canary Wharf','electric-shuffle/canary-wharf','Ten boards and two bars'],['Boulebar, South Bank','boulebar/south-bank','Twenty courts behind the National Theatre'],['Boulebar, Spitalfields','boulebar/spitalfields','Ten indoor courts'],['Crazy Boules, Elephant & Castle','crazy-boules/elephant-and-castle','Crazy-golf-style tracks']] },
 { id:'clay-shooting', title:'Clay shooting', color:'#111014', chip:'clays', text:'Virtual clay shooting gives you the feel of clay pigeon shooting without any real ammunition. Motion-tracked controllers fire at clays on screens, and live scores appear for the whole group.',
   venues:[['Clays, Soho','clays/soho','Automatic scoring and live leaderboards'],['Clays, Canary Wharf','clays/canary-wharf','Waterside terrace'],['Clays, City','clays/city','The original site, near Moorgate']] },
 { id:'sports', title:'Sports and ice skating', color:'#00a550', chip:'sports', text:'Several venues turn well-known sports into social games. You can kick real footballs at interactive screens, bat against a ball machine or play ping pong, and the ice rinks add public skating.',
   venues:[['Toca Social, The O2','toca-social/the-o2','Kick real footballs at screen targets'],['Toca Social, White City','toca-social/white-city','The biggest site, with VR'],['Sixes Cricket, London Bridge','sixes-cricket/london-bridge','Batting nets with a ball machine'],['Sixes Cricket, Stratford','sixes-cricket/stratford','Two nets by the Olympic Park'],['Sixes Cricket, Wembley','sixes-cricket/wembley','Inside Boxpark Wembley'],['Bounce, Battersea','bounce/battersea','Ping pong inside Battersea Power Station'],['Alexandra Palace Ice Rink','alexandra-palace/ice-rink','Year-round public skating'],['Lee Valley Ice Centre','lee-valley/ice-centre','Two Olympic-size rinks'],['Streatham Ice and Leisure Centre','streatham/ice-rink','Olympic-size rink']] },
 { id:'bingo-karaoke', title:'Bingo and karaoke', color:'#ffd500', chip:'bingo', text:'Bingo in London has moved a long way from the church hall, and karaoke is usually in private rooms booked for your own group.',
   venues:[['Hijingo, Shoreditch','hijingo/shoreditch','Theatrical bingo with live dancers, 18+'],['Dabbers Social Bingo, Aldgate','dabbers/aldgate','Themed nights with a shared table'],['Lucky Voice, Soho','lucky-voice/soho','Private rooms for 2 to 15'],['Lucky Voice, Islington','lucky-voice/islington','Nine private rooms'],['Lucky Voice, Liverpool Street','lucky-voice/liverpool-street','Rooms for up to 25'],['Lucky Voice, Holborn','lucky-voice/holborn','Open until 3am Thursday to Saturday'],['Lucky Voice, Waterloo','lucky-voice/waterloo','Eight rooms under the station platforms']] },
 { id:'arcades', title:'Arcades and board games', color:'#0060df', chip:'gaming', text:'Arcades and board games suit groups who want a slower pace and plenty of time to talk.',
   venues:[['NQ64, Shoreditch','nq64/shoreditch','Retro arcade machines and a cocktail bar'],['NQ64, Soho','nq64/soho','Two floors and 60-plus cabinets'],['Fairgame, Canary Wharf','fairgame/canary-wharf','Adults-only funfair, nine games'],['Fairgame, City','fairgame/city','Twelve games by St Paul\u2019s'],['Draughts, Waterloo','draughts/waterloo','1,000-plus board games'],['Draughts, Stratford','draughts/stratford','1,000-plus board games, under-12s free']] },
 { id:'immersive', title:'Immersive experiences and escape rooms', color:'#6e2fe0', chip:'immersive', text:'Immersive venues build a whole experience around the game, and escape rooms ask a team to solve puzzles to get out.',
   venues:[['The Crystal Maze LIVE Experience, West End','crystal-maze/west-end','The 90s game show, live'],['Immersive Gamebox, Southbank','immersive-gamebox/southbank','Private rooms with motion tracking'],['SPYSCAPE, Covent Garden','spyscape/covent-garden','Interactive spy museum with challenges'],["clueQuest, King's Cross",'cluequest/kings-cross','Six spy-themed escape rooms'],['Mission: Breakout, Kentish Town','mission-breakout/kentish-town','Inside a disused tube station'],['Escape Hunt, Oxford Street','escape-hunt/oxford-street','Six rooms, including Doctor Who']] },
 { id:'all-rounders', title:'All-rounders', color:'#ff5a00', chip:'allrounders', text:'All-rounders put several activities in one building, which helps when a group cannot agree.',
   venues:[['Boom Battle Bar, Oxford Street','boom-battle-bar/oxford-street','Axe throwing, darts, crazy golf and karaoke'],['Boom Battle Bar, Liverpool Street','boom-battle-bar/liverpool-street',''],['Boom Battle Bar, The O2','boom-battle-bar/the-o2',''],['Boom Battle Bar, Wandsworth','boom-battle-bar/wandsworth',''],['Boom Battle Bar, Ealing','boom-battle-bar/ealing',''],['Roxy Ball Room, Old Street','roxy-ball-room/old-street','Duckpin bowling, pool, darts and karaoke'],['Roxy Ball Room, St Mary Axe','roxy-ball-room/st-mary-axe',''],['Roxy Ball Room, Holborn','roxy-ball-room/holborn',''],['Queens Skate Dine Bowl, Bayswater','queens/bayswater','An ice rink with 17 bowling lanes'],['Gravity Max, Wandsworth','gravity-max/wandsworth','Karting, bowling, VR and batting cages']] }
];
const SHORT = "London\u2019s competitive socialising venues cover darts, bowling, golf and crazy golf, shuffleboard and boules, clay shooting, sports and ice skating, bingo and karaoke, arcades and board games, immersive experiences and escape rooms, and all-rounders that combine several of these in one building.";
const INTRO = "London has a wide range of places built around playing games together, and the choice goes well beyond the pub quiz. You can throw darts with automatic scoring, kick a football at a giant screen, sing in a private karaoke room or take part in a live bingo show. Most of these venues serve food and drink to your group while you play, and they are designed so that nobody needs any experience. This guide walks through each type of activity, explains how it works and links to the venues on Where To Go London where you can try it.";
const DESC = 'A guide to the types of competitive socialising activities in London, from darts and bowling to clay shooting and immersive bingo, with the venues where you can play each one.';
const SOON = [['Best activities for an office social','#6e2fe0'],['Best activities for a date','#e8112d'],['Best activities for a group of friends','#00a550']];

// ---------- Template pieces from the live About page ----------
const about = fs.readFileSync(path.join(ROOT, 'about/index.html'), 'utf8');
const rebase = (s, p) => s.replace(/(href|src)="\.\.\//g, (m, a) => `${a}="${p}`);
let common = about.slice(about.indexOf('<link rel="preconnect"'), about.indexOf('<link rel="canonical"'));
let header = about.slice(about.indexOf('<a class="skip"'), about.indexOf('</header>') + 9);
let footer = about.slice(about.indexOf('<footer>'));
header = header.replace(/<a href="\.\.\/blog\/"[^>]*>Blog<\/a>\s*/g, '');
footer = footer.replace(/<li><a href="\.\.\/blog\/">Blog<\/a><\/li>\s*/g, '');
const buildCommon = p => rebase(common, p).replace(/(<link rel="stylesheet" href="[^"]*site\.css">)/, `$1\n<link rel="stylesheet" href="${p}blog.css">`);
const buildHeader = (p, cur) => rebase(header, p).replace('<span>About</span>', '<span>Blog</span>')
  .replace(/<a href="([^"]*)about\/"( aria-current="page")?>About<\/a>/, `<a href="${p}blog/"${cur ? ' aria-current="page"' : ''}>Blog</a>\n<a href="${p}about/">About</a>`);
const buildFooter = p => rebase(footer, p).replace(/(<li><a href="[^"]*finder\/">Venue finder<\/a><\/li>)/, `$1\n<li><a href="${p}blog/">Blog</a></li>`);
const page = (p, title, desc, canonical, schema, main, type, ogImage) => `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${escA(desc)}">
${buildCommon(p)}<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Where To Go London">
<meta property="og:title" content="${escA(title)}">
<meta property="og:description" content="${escA(desc)}">
<meta property="og:url" content="${canonical}">
${ogImage ? `<meta property="og:image" content="${ogImage}">\n` : ''}<meta name="twitter:card" content="summary_large_image">
${schema}
</head>
<body>
${buildHeader(p, type === 'website')}
${main}
${buildFooter(p)}`;

// ---------- Photos: optional. Drop files in img/blog/ and list them in img/blog/photos.json ----------
// Example: {"hero":{"file":"hero.jpg","alt":"Friends playing darts","credit":"Photo: Name"},"darts":{"file":"darts.jpg","alt":"...","credit":"..."}}
let photos = {};
try { photos = JSON.parse(fs.readFileSync(path.join(ROOT, 'img/blog/photos.json'), 'utf8')); } catch (e) {}
const havePhoto = k => photos[k] && photos[k].file && fs.existsSync(path.join(ROOT, 'img/blog', photos[k].file));
function fig(key, p, cls, color, label, eager) {
  const has = havePhoto(key), ph = photos[key];
  const inner = has
    ? `<img src="${p}img/blog/${ph.file}" alt="${escA(ph.alt || '')}"${eager ? '' : ' loading="lazy"'} decoding="async"${ph.width && ph.height ? ` width="${ph.width}" height="${ph.height}"` : ''}>`
    : `<span class="ph-label" aria-hidden="true">${esc(label)}</span>`;
  const credit = has && ph.credit ? `<figcaption class="pcredit">${esc(ph.credit)}</figcaption>` : '';
  return `<figure class="pfig ${cls}"><div class="ph" style="--c:${color}">${inner}</div>${credit}</figure>`;
}

// ---------- Blog index ----------
function buildIndex() {
  const p = '../';
  const chips = SECTIONS.filter(s => ['darts','bowling','golf','shuffleboard','clay-shooting','bingo-karaoke','all-rounders'].includes(s.id))
    .map(s => `<li><a class="chip" href="${p}activities/#${s.chip}">${esc(s.title.replace(' and ', ' & '))}</a></li>`).join('');
  const heroFig = havePhoto('hero')
    ? `<div class="ph" style="--c:#0060df"><img src="${p}img/blog/${photos.hero.file}" alt="${escA(photos.hero.alt || '')}" decoding="async"></div>`
    : `<div class="ph" style="--c:#0060df"><span class="ph-label" aria-hidden="true">Guide</span></div>`;
  const soon = SOON.map(([t, c]) => `<li class="soon-card"><div class="bar" style="--c:${c}"></div><div><small>Coming soon</small><b>${esc(t)}</b></div></li>`).join('');
  const main = `<main id="main"><div class="wrap"><div class="masthead">
<div class="crumbs"><a href="${p}">Home</a> / Blog</div>
<div class="bloghead"><h1>The blog</h1><p>Guides to the darts bars, bowling alleys, golf courses and escape rooms of London, written by Saul and checked against each venue\u2019s own website.</p></div>
</div>
<div class="chiprow"><span class="lbl">Browse by activity</span><ul class="chips" style="margin:0">${chips}</ul></div>
<a class="feat" href="${SLUG}/">${heroFig}<div class="feat-body"><span class="tag">Latest guide</span><h2>${esc(TITLE)}</h2><p>Darts, bowling, crazy golf, clay shooting, bingo, escape rooms and more. Here is how each type of activity works and where in London you can play it.</p><div class="feat-meta"><span>By Saul</span><span>24 October 2026</span><span>10 activity types</span></div><span class="btn">Read the guide</span></div></a>
<section class="soonsec"><h2>More guides on the way</h2><ul class="soon-grid">${soon}</ul></section>
</div></main>`;
  const title = 'Where To Go London Blog | Guides to Competitive Socialising in London';
  const desc = 'Guides from Where To Go London on competitive socialising venues in London, including the types of activities you can try and how to choose between them.';
  const schema = `<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Where To Go London Blog", "url": "${BASE}/blog/", "description": ${JSON.stringify(desc)}}
</script>
<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "${BASE}/"}, {"@type": "ListItem", "position": 2, "name": "Blog", "item": "${BASE}/blog/"}]}
</script>`;
  return page(p, title, desc, `${BASE}/blog/`, schema, main, 'website', havePhoto('hero') ? `${BASE}/img/blog/${photos.hero.file}` : '');
}

// ---------- Article ----------
function buildArticle() {
  const p = '../../';
  const toc = SECTIONS.map((s, i) => `<li><a href="#${s.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.title)}</span></a></li>`).join('')
    + `<li class="last"><a href="#decide"><span class="n">&rarr;</span><span>How to decide</span></a></li>`;
  const secs = SECTIONS.map((s, i) => {
    const venues = s.venues.map(([n, v, note]) => `<li><a class="vc" href="${p}activity/${v}/"><b>${esc(n)}</b>${note ? `<span>${esc(note)}</span>` : ''}</a></li>`).join('');
    return `<section class="asec" id="${s.id}">
<div class="asec-media">${fig(s.id, p, '', s.color, s.title)}</div>
<div class="asec-body"><div class="asec-head"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.title)}</h3></div>
<p>${esc(s.text)}</p>
<p class="where">Where to play</p>
<ul class="vgrid">${venues}</ul></div>
</section>`;
  }).join('\n');
  const main = `<main id="main"><div class="wrap"><article class="post">
<div class="masthead">
<div class="crumbs"><a href="${p}">Home</a> / <a href="${p}blog/">Blog</a> / ${esc(TITLE)}</div>
<span class="tag">Guide</span>
<h1 class="long">${esc(TITLE)}</h1>
<div class="byline"><span class="by"><span class="av" aria-hidden="true">S</span><span>Written by <b>Saul</b></span></span><span>Published <b>24 October 2026</b></span><span>Last verified <b>October 2026</b></span></div>
</div>
${fig('hero', p, 'pfig--hero', '#0060df', 'London activity venues', true)}
<div class="introrow">
<div class="short"><p class="kicker">The short answer</p><p>${esc(SHORT)}</p></div>
<nav class="toc" aria-label="In this guide"><div class="toc-h">In this guide</div><ol>${toc}</ol></nav>
</div>
<div class="pblock"><h2>What types of activities exist in London?</h2><p>${esc(INTRO)}</p></div>
<h2>List of activity types</h2>
${secs}
<section class="decidesec" id="decide">
<h2>How to decide on an activity</h2>
<p class="post-p">Start with who is coming. Then match the group to the style of play.</p>
<div class="decide">
<div><p class="k">Mixed colleagues</p><b>Darts, shuffleboard, virtual clay shooting</b><span>Something that scores automatically and needs no skill.</span></div>
<div><p class="k">Time to talk</p><b>Bowling, crazy golf, board games</b><span>Groups that want to chat between turns.</span></div>
<div><p class="k">Celebrations</p><b>Bingo and other show-style venues</b><span>Birthdays and hen or stag dos that want something louder.</span></div>
<div><p class="k">Cannot agree</p><b>An all-rounder</b><span>Everyone picks their own game under one roof.</span></div>
</div>
<div class="agebox"><p><b>Check the age rules before you book.</b> Several venues are 18+ for every session, and others change their rules in the evening.</p></div>
<p class="post-p">Where To Go London compares every venue on the same four things: price, time of day, the group it suits best and the type of activity. Browse our <a href="${p}activities/">activities page</a> to see every venue grouped by activity, and read <a href="${p}about/#how-we-research">how we research venues</a> to see how we check each detail.</p>
</section>
</article></div>
<div class="ctaband"><div class="wrap"><h2>Compare every venue by activity</h2><a class="btn btn--big btn--orange" href="${p}activities/">Browse the activities</a></div></div>
</main>`;
  const url = `${BASE}/blog/${SLUG}/`;
  const title = 'What Types of Activities Can I Do in London? | Where To Go London';
  const img = havePhoto('hero') ? `${BASE}/img/blog/${photos.hero.file}` : '';
  const schema = `<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "BlogPosting", "headline": ${JSON.stringify(TITLE)}, "description": ${JSON.stringify(DESC)}, "url": "${url}", "mainEntityOfPage": "${url}", "datePublished": "${PUBLISHED}", "dateModified": "${PUBLISHED}", "author": {"@type": "Person", "name": "Saul", "url": "${BASE}/about/#who"}, "publisher": {"@id": "${BASE}/#organization"}${img ? `, "image": "${img}"` : ''}}
</script>
<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "${BASE}/"}, {"@type": "ListItem", "position": 2, "name": "Blog", "item": "${BASE}/blog/"}, {"@type": "ListItem", "position": 3, "name": ${JSON.stringify(TITLE)}, "item": "${url}"}]}
</script>`;
  return page(p, title, DESC, url, schema, main, 'article', img);
}

// ---------- Write files ----------
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), s); console.log('wrote', f); };
write('blog.css', CSS);
write('blog/index.html', buildIndex());
write(`blog/${SLUG}/index.html`, buildArticle());

// ---------- Sitemap (once) ----------
const smPath = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
if (!sm.includes(`${BASE}/blog/`)) {
  const add = `<url>\n<loc>${BASE}/blog/</loc>\n<lastmod>${PUBLISHED}</lastmod>\n<changefreq>weekly</changefreq>\n<priority>0.7</priority>\n</url>\n<url>\n<loc>${BASE}/blog/${SLUG}/</loc>\n<lastmod>${PUBLISHED}</lastmod>\n<changefreq>monthly</changefreq>\n<priority>0.8</priority>\n</url>\n`;
  const anchor = `<url>\n<loc>${BASE}/featured-venues/</loc>`;
  sm = sm.includes(anchor) ? sm.replace(anchor, add + anchor) : sm.replace('</urlset>', add + '</urlset>');
  fs.writeFileSync(smPath, sm); console.log('sitemap updated');
} else console.log('sitemap already has blog URLs');

// ---------- Nav and footer on every other page (once) ----------
function walk(d, out = []) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git', 'blog'].includes(f.name)) continue;
    const q = path.join(d, f.name);
    if (f.isDirectory()) walk(q, out); else if (f.name.endsWith('.html')) out.push(q);
  }
  return out;
}
let changed = 0, skipped = 0;
for (const file of walk(ROOT)) {
  let s = fs.readFileSync(file, 'utf8');
  if (/<a href="[^"]*blog\/"[^>]*>Blog<\/a>/.test(s)) { skipped++; continue; }
  if (!/<a href="[^"]*featured-venues\/">Featured venues<\/a>/.test(s)) { console.log('no nav found, skipped:', path.relative(ROOT, file)); continue; }
  const before = s;
  s = s.replace(/<a href="([^"]*)about\/"( aria-current="page")?>About<\/a>/, (all, pre) => `<a href="${pre}blog/">Blog</a>\n${all}`);
  s = s.replace(/<li><a href="([^"]*)finder\/">Venue finder<\/a><\/li>/, (all, pre) => `${all}\n<li><a href="${pre}blog/">Blog</a></li>`);
  if (s !== before) { fs.writeFileSync(file, s); changed++; }
}
console.log(`Nav and footer: ${changed} pages updated, ${skipped} already had the Blog link.`);
