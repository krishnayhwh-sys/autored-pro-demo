/* ============================================================
   AutoRed Pro — Prototipo Fase 1
   Navegación e interacciones simuladas. Sin backend, sin datos
   reales: todo es maqueta para validar producto.
   ============================================================ */

// ---------- Datos simulados ----------
const WORKSHOPS = [
  {
    icon: "🏭", name: "Taller Hermanos Ruiz", badge: '<span class="badge badge-gold">★ ORO</span><span class="badge badge-spec">Especialista frenos</span>',
    meta: "⭐ 4.8 (156) · a 1.2 km · Responde en ~15 min · 98% evidencia completa",
    price: "Diagnóstico $250", cta: true
  },
  {
    icon: "🔧", name: "Frenos y Clutch García", badge: '<span class="badge badge-silver">PLATA</span>',
    meta: "⭐ 4.5 (89) · a 2.8 km · Responde en ~40 min · 93% evidencia completa",
    price: "Diagnóstico $200", cta: false
  },
  {
    icon: "🛠️", name: "MecaExpress", badge: '<span class="badge badge-bronze">BRONCE</span>',
    meta: "⭐ 4.1 (34) · a 0.8 km · Responde en ~1 h · 88% evidencia completa",
    price: "Diagnóstico $180", cta: false
  },
  {
    icon: "🏪", name: "Servicio El Compa", badge: '<span class="badge badge-proc">EN PROCESO DE CERTIFICACIÓN 🟡</span>',
    meta: "⭐ 4.0 (12) · a 1.9 km · Avance de certificación: etapa 3 de 5",
    price: "Diagnóstico $150", cta: false
  }
];

const QUOTE_ITEMS = [
  { c: "Balatas delanteras (par)", d: "Cerámica, refacción original · parte #D1060-4M", imp: 1450, on: true },
  { c: "Mano de obra: cambio de balatas", d: "Incluye limpieza y ajuste de calipers", imp: 800, on: true },
  { c: "Líquido de frenos DOT-4", d: "Purga y reemplazo completo", imp: 640, on: true },
  { c: "Rectificado de discos (par)", d: "Con rectificadora certificada de la red · +1 día", imp: 950, on: false }
];

// ---------- Navegación ----------
const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll(".nav-item");
const roleTabs = document.querySelectorAll(".role-tab");
const navGroups = document.querySelectorAll(".nav-group");

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.screen === id));
  const group = document.querySelector(`.nav-item[data-screen="${id}"]`)?.closest(".nav-group");
  if (group) setRole(group.dataset.role, false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setRole(role, jump = true) {
  roleTabs.forEach(t => t.classList.toggle("active", t.dataset.role === role));
  navGroups.forEach(g => g.classList.toggle("hidden", g.dataset.role !== role));
  if (jump) {
    const first = document.querySelector(`.nav-group[data-role="${role}"] .nav-item`);
    if (first) showScreen(first.dataset.screen);
  }
}

navItems.forEach(n => n.addEventListener("click", () => showScreen(n.dataset.screen)));
roleTabs.forEach(t => t.addEventListener("click", () => setRole(t.dataset.role)));
document.querySelectorAll("[data-go]").forEach(b =>
  b.addEventListener("click", () => showScreen(b.dataset.go))
);

// ---------- 3 · Selección de síntoma ----------
const SYM_LABEL = {
  frenos: "frenos", motor: "enfriamiento", suspension: "suspensión",
  electrico: "sistema eléctrico", transmision: "transmisión", afinacion: "mantenimiento"
};
document.querySelectorAll(".symptom").forEach(s =>
  s.addEventListener("click", () => {
    document.querySelectorAll(".symptom").forEach(x => x.classList.remove("active"));
    s.classList.add("active");
    document.getElementById("symContinue").textContent =
      `Buscar talleres para ${SYM_LABEL[s.dataset.sym]} →`;
  })
);
document.querySelector('.symptom[data-sym="frenos"]').classList.add("active");

// ---------- 4 · Render de talleres ----------
const wsList = document.getElementById("workshopList");
wsList.innerHTML = WORKSHOPS.map(w => `
  <div class="ws-card">
    <div class="ws-ico">${w.icon}</div>
    <div class="ws-info">
      <b>${w.name}</b>
      <div class="ws-meta">${w.meta}</div>
      <div class="ws-badges">${w.badge}</div>
    </div>
    <div class="ws-side">
      <div class="price">${w.price}</div>
      <div class="price-note">El diagnóstico se descuenta si autorizas la reparación.</div>
      <button class="btn ${w.cta ? "btn-red" : "btn-ghost"}" data-go="s5" style="margin-top:8px">
        ${w.cta ? "Ver perfil →" : "Ver perfil"}
      </button>
    </div>
  </div>`).join("");
wsList.querySelectorAll("[data-go]").forEach(b =>
  b.addEventListener("click", () => showScreen(b.dataset.go))
);

// ---------- 7 · Presupuesto con autorización parcial ----------
const fmt = n => "$" + n.toLocaleString("es-MX");
const qWrap = document.getElementById("quoteItems");

function renderQuote() {
  qWrap.innerHTML = QUOTE_ITEMS.map((it, i) => `
    <div class="q-item ${it.on ? "" : "off"}">
      <div><b>${it.c}</b></div>
      <small>${it.d}</small>
      <span class="imp">${fmt(it.imp)}</span>
      <input type="checkbox" data-i="${i}" ${it.on ? "checked" : ""}>
    </div>`).join("");
  const total = QUOTE_ITEMS.filter(i => i.on).reduce((a, b) => a + b.imp, 0);
  const nOn = QUOTE_ITEMS.filter(i => i.on).length;
  document.getElementById("quoteTotal").textContent = fmt(total);
  document.getElementById("authTotal").textContent = fmt(total);
  const off = QUOTE_ITEMS.filter(i => !i.on).map(i => i.c.toLowerCase()).join(", ");
  document.getElementById("authItems").textContent =
    `${nOn} de ${QUOTE_ITEMS.length}` + (off ? ` (no autorizado: ${off})` : " (todas)");
  qWrap.querySelectorAll("input").forEach(chk =>
    chk.addEventListener("change", () => {
      QUOTE_ITEMS[chk.dataset.i].on = chk.checked;
      renderQuote();
    })
  );
}
renderQuote();

// ---------- 8 · Firma simulada ----------
const signZone = document.getElementById("signZone");
signZone.addEventListener("click", () => {
  signZone.classList.add("signed");
  document.getElementById("signText").textContent = "Carlos Mendoza";
});
document.getElementById("authorizeBtn").addEventListener("click", e => {
  if (!signZone.classList.contains("signed")) {
    e.stopImmediatePropagation();
    signZone.classList.add("signed");
    document.getElementById("signText").textContent = "Carlos Mendoza";
    setTimeout(() => showScreen("s9"), 450);
  }
}, true);

// ---------- 10 → 14 · saltos con cambio de rol ----------
document.querySelectorAll("[data-role-go]").forEach(b =>
  b.addEventListener("click", () => setRole(b.dataset.roleGo, false))
);

// ---------- 14 · NPS interactivo ----------
const npsRow = document.getElementById("npsRow");
for (let i = 0; i <= 10; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.addEventListener("click", () => selectNps(i));
  npsRow.appendChild(btn);
}
function selectNps(v) {
  npsRow.querySelectorAll("button").forEach((b, i) => {
    b.className = "";
    if (i === v) b.classList.add("sel", v >= 9 ? "hi" : v <= 6 ? "lo" : "mid");
  });
  const label = v >= 9 ? "Promotor 🎉" : v >= 7 ? "Pasivo" : "Detractor — se abre seguimiento";
  document.getElementById("npsLabel").textContent = `${v} · ${label}`;
}
selectNps(9);

document.querySelectorAll("#cpStars .slot").forEach(s =>
  s.addEventListener("click", () => {
    document.querySelectorAll("#cpStars .slot").forEach(x => x.classList.remove("active"));
    s.classList.add("active");
  })
);

document.getElementById("sendSurvey").addEventListener("click", function () {
  this.textContent = "¡Gracias! Evaluación registrada ✓";
  this.disabled = true;
  this.style.opacity = .6;
});
