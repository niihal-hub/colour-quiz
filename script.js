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

const QUESTIONS = [
 {q:"On a group trip, you are the one who...", a:{red:"Takes charge and makes the plan",yellow:"Brings the music and the fun",green:"Makes sure everyone is comfortable",blue:"Checks the route and the budget"}},
 {q:"A friend shares a big problem. You...", a:{red:"Give a quick solution",yellow:"Cheer them up and make them smile",green:"Listen quietly and stay with them",blue:"Ask questions to understand the full picture"}},
 {q:"Your perfect weekend is...", a:{red:"Playing a game or sport to win",yellow:"Meeting lots of friends and going out",green:"Home with family and good food",blue:"Reading or learning something new"}},
 {q:"The deadline is close. You...", a:{red:"Push hard and finish it fast",yellow:"Get friends to help and make it fun",green:"Stay calm and go step by step",blue:"Already finished early, now checking for mistakes"}},
 {q:"People often say you are...", a:{red:"Strong and bold",yellow:"Friendly and funny",green:"Kind and patient",blue:"Smart and careful"}},
 {q:"In an argument, you...", a:{red:"Say it straight and don't back down",yellow:"Make a joke to cool things down",green:"Stay quiet to avoid a fight",blue:"Bring facts and proof"}},
 {q:"You are buying a new phone. You...", a:{red:"Pick the fastest and best, decide quickly",yellow:"Pick the one that looks cool",green:"Pick the one that is reliable and trusted",blue:"Compare reviews and specs for days"}},
 {q:"You enter a room full of strangers. You...", a:{red:"Walk in and take the lead",yellow:"Start talking with everyone",green:"Find one friendly face and stay close",blue:"Watch first, speak when you are sure"}},
 {q:"What stresses you the most?", a:{red:"Slow people and wasted time",yellow:"Boredom and being ignored",green:"Sudden changes and fights",blue:"Mistakes and messy plans"}},
 {q:"Your biggest dream is to...", a:{red:"Be a leader or the boss",yellow:"Be loved and known by many people",green:"Live a peaceful life with loved ones",blue:"Become an expert in your field"}}
];

const $ = id => document.getElementById(id);
const show = id => { document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); $(id).classList.add("active"); };
let i, scores, locked;

function start(){
  i = 0; locked = false;
  scores = {red:0, yellow:0, green:0, blue:0};
  document.body.style.removeProperty("--accent");
  document.body.style.removeProperty("--accent2");
  show("quiz"); render();
}

function render(){
  const item = QUESTIONS[i];
  $("count").textContent = `Question ${i+1} of ${QUESTIONS.length}`;
  $("bar").style.width = (i / QUESTIONS.length * 100) + "%";
  $("question").textContent = item.q;
  const box = $("answers"); box.innerHTML = "";
  Object.keys(item.a).sort(() => Math.random() - .5).forEach((c, n) => {
    const b = document.createElement("button");
    b.className = "ans"; b.style.animationDelay = (n * .08) + "s";
    b.innerHTML = `<span>${n+1}</span>${item.a[c]}`;
    b.onclick = () => pick(c, b);
    box.appendChild(b);
  });
  locked = false;
}

function pick(c, btn){
  if (locked) return; locked = true;
  btn.classList.add("picked"); scores[c]++;
  setTimeout(() => {
    i++;
    if (i < QUESTIONS.length) { show("quiz"); render(); $("quiz").style.animation="none"; void $("quiz").offsetWidth; $("quiz").style.animation=""; }
    else finish();
  }, 380);
}

function finish(){
  $("bar").style.width = "100%";
  show("loading");
  setTimeout(result, 2200);
}

function result(){
  const total = QUESTIONS.length;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [top, second] = [sorted[0][0], sorted[1][0]];
  const C = COLOURS[top];
  document.body.style.setProperty("--accent", C.hex);
  document.body.style.setProperty("--accent2", C.hex2);
  const pct = Math.round(scores[top] / total * 100);
  const mixNote = scores[second] >= scores[top] - 1 && scores[second] > 0
    ? `<p class="sub">You also have a lot of <b>${COLOURS[second].name}</b> in you. Most people are a mix.</p>` : "";
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
    <div class="mix">${sorted.map(([k, v]) => `<div class="row"><em>${k[0].toUpperCase()+k.slice(1)}</em><div class="track"><div class="fill" data-w="${v/total*100}" style="background:${COLOURS[k].hex}"></div></div><small>${Math.round(v/total*100)}%</small></div>`).join("")}</div>
    <div class="btns"><button class="btn" id="share">Copy my result</button><button class="btn ghost" id="again">Try again</button></div>`;
  show("result");
  $("again").onclick = start;
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
  const b = document.querySelectorAll(".ans")[Number(e.key) - 1];
  if (b) b.click();
});
