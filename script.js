const COLOURS = {
  red:    {name:"Fiery Red",    hex:"#ff4d4d", hex2:"#ff9b54", tag:"The Leader. You make things happen.",
           about:"You are bold, fast and goal-focused. You like to take charge, decide quickly and win. People trust you to get the job done.",
           strengths:"Confident, direct, brave, great at starting things and pushing through hard times.",
           watch:"You can sound too harsh or get impatient. Slow down and listen sometimes.",
           best:"Works well with Blue (who checks the details) and Green (who keeps the team calm)."},
  yellow: {name:"Sunshine Yellow", hex:"#ffc933", hex2:"#ff9f1c", tag:"The Spark. You bring the energy.",
           about:"You are cheerful, creative and social. You love people, new ideas and good vibes. A room feels brighter when you enter.",
           strengths:"Friendly, funny, inspiring, great at talking and bringing people together.",
           watch:"You can lose focus or forget small details. Finish what you start.",
           best:"Works well with Green (who supports you) and Red (who gives you direction)."},
  green:  {name:"Earth Green",  hex:"#3ecf8e", hex2:"#2bb3a3", tag:"The Heart. You keep everyone together.",
           about:"You are calm, kind and loyal. You care about people and like peace and steady routines. Others come to you when they need support.",
           strengths:"Patient, good listener, reliable, great team player.",
           watch:"You may say yes too often or avoid hard talks. Your voice matters too.",
           best:"Works well with Yellow (who brings fun) and Blue (who shares your careful nature)."},
  blue:   {name:"Cool Blue",    hex:"#4d8dff", hex2:"#7a6bff", tag:"The Thinker. You see what others miss.",
           about:"You are logical, careful and curious. You like facts, plans and doing things the right way. You think before you act.",
           strengths:"Smart, organised, detail-focused, great at research and solving problems.",
           watch:"You can overthink or be too hard on yourself. Done is sometimes better than perfect.",
           best:"Works well with Red (who pushes you to act) and Green (who keeps things relaxed)."}
};


const $ = id => document.getElementById(id);
const show = id => { document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); $(id).classList.add("active"); };
const QUIZ_LENGTH = 10, MIN_EXTRA = 3, MAX_EXTRA = 6, MAX_SKIPS = 5;
const COMBOS = {"blue-green":"The Guardian","blue-red":"The Strategist","blue-yellow":"The Innovator","green-red":"The Protector","green-yellow":"The Connector","red-yellow":"The Trailblazer"};
const JOBS = {red:"Entrepreneur, manager, sales leader, sports coach, lawyer",yellow:"Content creator, marketer, teacher, event host, actor",green:"Counsellor, nurse, HR, social worker, community manager",blue:"Engineer, programmer, data analyst, researcher, designer"};
const KEYS = ["red", "yellow", "green", "blue"];
let deck, i, scores, locked, tied, extra, answered, skips;

const shuffle = a => { a = a.slice(); for (let n = a.length - 1; n > 0; n--) { const m = Math.floor(Math.random() * (n + 1)); [a[n], a[m]] = [a[m], a[n]]; } return a; };
const gap = () => { const v = Object.values(scores).sort((a, b) => b - a); return v[0] - v[1]; };

// Colours that are close to the top score: these get the tie-breaker questions
function contenders(){
  const sorted = KEYS.slice().sort((a, b) => scores[b] - scores[a]);
  const n = Math.max(2, sorted.filter(k => scores[k] >= scores[sorted[0]] - 1).length);
  return sorted.slice(0, n);
}

function start(){
  deck = shuffle(POOL); i = 0; answered = 0; skips = 0; extra = 0; tied = null; locked = false;
  scores = {red:0, yellow:0, green:0, blue:0};
  document.body.style.removeProperty("--accent");
  document.body.style.removeProperty("--accent2");
  next();
}

function next(){
  show("quiz"); render();
  [$("quiz"), $("question")].forEach(el => { el.style.animation = "none"; void el.offsetWidth; el.style.animation = ""; });
}

function render(){
  const [q, ...ans] = deck[i];
  $("count").textContent = tied ? `Tie-breaker ${extra}: your colours are very close!` : `Question ${answered+1} of ${QUIZ_LENGTH}`;
  $("bar").style.width = tied ? "100%" : (answered / QUIZ_LENGTH * 100) + "%";
  $("question").textContent = q;
  const box = $("answers"); box.innerHTML = "";
  shuffle(tied || KEYS).forEach((c, n) => {
    const b = document.createElement("button");
    b.className = "ans"; b.style.animationDelay = (n * .08) + "s";
    b.innerHTML = `<span>${n+1}</span>${ans[KEYS.indexOf(c)]}`;
    b.onclick = () => pick(c, b);
    box.appendChild(b);
  });
  const left = MAX_SKIPS - skips, sk = document.createElement("button");
  sk.className = "ans skip"; sk.disabled = left <= 0; sk.style.animationDelay = "0.4s";
  sk.innerHTML = `<span>0</span>🤷 I can't choose, skip this <small>(${left} left)</small>`;
  sk.onclick = skip; box.appendChild(sk);
  locked = false;
}

function pick(c, btn){
  if (locked) return; locked = true;
  btn.classList.add("picked"); scores[c]++; i++; answered++;
  setTimeout(() => {
    if (answered < QUIZ_LENGTH) return next();
    const g = gap();
    if ((extra === 0 && g > 0) || (extra >= MIN_EXTRA && g > 0) || extra >= MAX_EXTRA) return finish();
    extra++; tied = contenders(); next();
  }, 380);
}

// Skip: no points, and the question does not count. A new question comes instead.
function skip(){
  if (locked || skips >= MAX_SKIPS) return; locked = true;
  skips++; i++;
  document.querySelector(".skip").classList.add("picked");
  setTimeout(next, 320);
}

function finish(){
  $("bar").style.width = "100%";
  show("loading");
  setTimeout(result, 2200);
}

function result(){
  const total = answered;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [top, second] = [sorted[0][0], sorted[1][0]];
  const C = COLOURS[top];
  document.body.style.setProperty("--accent", C.hex);
  document.body.style.setProperty("--accent2", C.hex2);
  const pct = Math.round(scores[top] / total * 100);
  const dual = scores[second] >= scores[top] - 1 && scores[second] > 0;
  const combo = COMBOS[[top, second].sort().join("-")];
  const mixNote = dual ? `<p class="sub">You also have a lot of <b>${COLOURS[second].name}</b> in you, so your style is <b>${combo}</b>.</p>` : "";
  $("result").innerHTML = `
    <p class="eyebrow">Your colour is</p>
    <div class="ring" style="--p:0" id="ring"><span id="num">0%</span></div>
    <h2 class="rname">${C.name}</h2>
    <p class="tag">${C.tag}</p>
    ${mixNote}
    <div class="card"><h3>Who you are</h3><p>${C.about}</p></div>
    <div class="card"><h3>Strengths</h3><p>${C.strengths}</p></div>
    <div class="card"><h3>Watch out</h3><p>${C.watch}</p></div>
    <div class="card"><h3>Teamwork</h3><p>${C.best}</p></div>
    <div class="card"><h3>Careers that fit you</h3><p>${JOBS[top]}</p></div>
    <div class="mix">${sorted.map(([k, v]) => `<div class="row"><em>${k[0].toUpperCase()+k.slice(1)}</em><div class="track"><div class="fill" data-w="${v/total*100}" style="background:${COLOURS[k].hex}"></div></div><small>${Math.round(v/total*100)}%</small></div>`).join("")}</div>
    <div class="btns"><button class="btn" id="share">Copy my result</button><button class="btn" id="save">Save my card</button><button class="btn ghost" id="again">Try again</button></div>
    ${skips ? `<p class="hint">You skipped ${skips} question${skips === 1 ? "" : "s"}.</p>` : ""}`;
  show("result");
  const w = document.createElement("div"); w.className = "wipe"; document.body.appendChild(w); setTimeout(() => w.remove(), 1200);
  $("again").onclick = start;
  $("save").onclick = () => saveCard(C, pct, dual ? combo : "");
  $("share").onclick = () => {
    const t = `I took the Colour Quiz and I am ${C.name} (${pct}%)! Find yours: ${location.href}`;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => $("share").textContent = "Copied!").catch(() => prompt("Copy this:", t));
  };
  // count-up ring
  const t0 = performance.now();
  (function tick(now){
    const p = Math.min((now - t0) / 1400, 1), v = Math.round(pct * p);
    $("ring").style.setProperty("--p", v); $("num").textContent = v + "%";
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
  setTimeout(() => document.querySelectorAll(".fill").forEach(f => f.style.width = f.dataset.w + "%"), 200);
  confetti(C);
}

function confetti(C){
  for (let n = 0; n < 36; n++){
    const d = document.createElement("i"); d.className = "burst";
    const a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 220;
    d.style.setProperty("--x", Math.cos(a) * r + "px");
    d.style.setProperty("--y", Math.sin(a) * r + "px");
    d.style.background = n % 2 ? C.hex : C.hex2;
    document.body.appendChild(d); setTimeout(() => d.remove(), 1500);
  }
}

$("startBtn").onclick = start;
document.addEventListener("keydown", e => {
  if (!$("quiz").classList.contains("active")) return;
  const b = e.key === "0" ? document.querySelector(".skip") : document.querySelectorAll(".ans:not(.skip)")[Number(e.key) - 1];
  if (b) b.click();
});

// Download a share card as an image
function saveCard(C, pct, combo){
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350;
  const x = c.getContext("2d"), g = x.createLinearGradient(0, 0, 1080, 1350);
  g.addColorStop(0, C.hex); g.addColorStop(1, C.hex2);
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.fillStyle = "rgba(255,255,255,.14)";
  x.beginPath(); x.arc(920, 240, 330, 0, 7); x.fill();
  x.beginPath(); x.arc(140, 1160, 270, 0, 7); x.fill();
  x.fillStyle = "#fff"; x.textAlign = "center";
  x.font = "600 42px system-ui, sans-serif"; x.fillText("MY PERSONALITY COLOUR IS", 540, 360);
  x.font = "800 100px system-ui, sans-serif"; x.fillText(C.name, 540, 540);
  x.font = "800 260px system-ui, sans-serif"; x.fillText(pct + "%", 540, 840);
  x.font = "italic 40px system-ui, sans-serif"; x.fillText(C.tag, 540, 940);
  if (combo) { x.font = "600 44px system-ui, sans-serif"; x.fillText("Style: " + combo, 540, 1030); }
  x.font = "600 34px system-ui, sans-serif"; x.fillText("Find yours: " + location.host + location.pathname, 540, 1250);
  const a = document.createElement("a"); a.download = "my-colour.png"; a.href = c.toDataURL("image/png"); a.click();
}

// Mouse glow and floating sparks
addEventListener("pointermove", e => { document.body.style.setProperty("--mx", e.clientX + "px"); document.body.style.setProperty("--my", e.clientY + "px"); });
(() => {
  const box = document.createElement("div"); box.className = "sparks"; document.body.appendChild(box);
  for (let n = 0; n < 26; n++) {
    const p = document.createElement("i");
    p.style.cssText = `left:${Math.random() * 100}%;--d:${9 + Math.random() * 12}s;--sz:${3 + Math.random() * 5}px;animation-delay:${-Math.random() * 20}s`;
    box.appendChild(p);
  }
})();
