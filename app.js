/* ============================================================
   AutoRed Pro — Prototipo Fase 1 · Motor de escenarios
   Navegación, escenarios, trazabilidad, islas y acceso demo.
   Sin backend: todos los datos son simulados.
   ============================================================ */

"use strict";
const $ = id => document.getElementById(id);
const fmt = n => "$" + n.toLocaleString("es-MX");

/* ============================================================
   1 · VEHÍCULOS (datos simulados)
   ============================================================ */
const VEHICLES = [
  { id: "vrs19", label: "Nissan Versa 2019",      km: "78,500 km",  code: "VRS19" },
  { id: "mar20", label: "Nissan March 2020",      km: "52,300 km",  code: "MAR20" },
  { id: "tsu15", label: "Nissan Tsuru 2015",      km: "148,900 km", code: "TSU15" },
  { id: "np321", label: "Nissan NP300 2021",      km: "96,700 km",  code: "NP321" },
  { id: "ave20", label: "Chevrolet Aveo 2020",    km: "61,200 km",  code: "AVE20" },
  { id: "spk18", label: "Chevrolet Spark 2018",   km: "88,400 km",  code: "SPK18" },
  { id: "ven19", label: "Volkswagen Vento 2019",  km: "72,800 km",  code: "VEN19" },
  { id: "jet17", label: "Volkswagen Jetta 2017",  km: "112,500 km", code: "JET17" },
  { id: "rio17", label: "Kia Rio 2017",           km: "94,100 km",  code: "RIO17" },
  { id: "gi121", label: "Hyundai Grand i10 2021", km: "38,600 km",  code: "GI121" },
  { id: "hil20", label: "Toyota Hilux 2020",      km: "104,300 km", code: "HIL20" },
  { id: "ran19", label: "Ford Ranger 2019",       km: "121,700 km", code: "RAN19" },
  { id: "crv18", label: "Honda CR-V 2018",        km: "97,200 km",  code: "CRV18" },
  { id: "kwd22", label: "Renault Kwid 2022",      km: "21,400 km",  code: "KWD22" },
  { id: "swf21", label: "Suzuki Swift 2021",      km: "44,900 km",  code: "SWF21" }
];

/* ============================================================
   2 · TALLERES BASE (catálogo simulado de la red)
   ============================================================ */
const WS = {
  ruiz:    { icon: "🏭", name: "Taller Hermanos Ruiz",        level: "gold",   lvl: "★ ORO",   specs: ["Frenos", "Suspensión"],        meta: "Av. Hidalgo 214, Centro · a 1.2 km", rating: "⭐ 4.8 (156)", resp: "~15 min", ev: "98%" },
  garcia:  { icon: "🔧", name: "Frenos y Clutch García",      level: "silver", lvl: "PLATA",   specs: ["Frenos", "Clutch"],             meta: "Calle Morelos 88 · a 2.8 km",        rating: "⭐ 4.5 (89)",  resp: "~40 min", ev: "93%" },
  meca:    { icon: "🛠️", name: "MecaExpress",                 level: "bronze", lvl: "BRONCE",  specs: ["Servicio general"],             meta: "Blvd. Juárez 45 · a 0.8 km",         rating: "⭐ 4.1 (34)",  resp: "~1 h",    ev: "88%" },
  compa:   { icon: "🏪", name: "Servicio El Compa",           level: "proc",   lvl: "EN PROCESO 🟡", specs: ["Servicio general"],       meta: "Av. Central 302 · a 1.9 km",         rating: "⭐ 4.0 (12)",  resp: "~2 h",    ev: "71%" },
  electro: { icon: "⚡", name: "ElectroAuto Domínguez",       level: "gold",   lvl: "★ ORO",   specs: ["Electricidad", "Diagnóstico"],  meta: "Calle Aldama 120 · a 1.5 km",        rating: "⭐ 4.7 (98)",  resp: "~20 min", ev: "96%" },
  palma:   { icon: "🌡️", name: "Radiadores Palma",            level: "silver", lvl: "PLATA",   specs: ["Enfriamiento"],                 meta: "Carr. Costera km 2 · a 3.1 km",      rating: "⭐ 4.6 (64)",  resp: "~30 min", ev: "92%" },
  marin:   { icon: "🚗", name: "Suspensión y Dirección Marín",level: "silver", lvl: "PLATA",   specs: ["Suspensión", "Dirección"],      meta: "Av. Independencia 77 · a 2.2 km",    rating: "⭐ 4.4 (51)",  resp: "~45 min", ev: "91%" },
  nunez:   { icon: "⚙️", name: "Transmisiones Núñez",         level: "gold",   lvl: "★ ORO",   specs: ["Transmisiones", "Clutch"],      meta: "Calle Zaragoza 210 · a 2.6 km",      rating: "⭐ 4.9 (73)",  resp: "~25 min", ev: "95%" },
  frias:   { icon: "❄️", name: "Clima Automotriz Frías",      level: "silver", lvl: "PLATA",   specs: ["Aire acondicionado"],           meta: "Av. del Sol 15 · a 1.7 km",          rating: "⭐ 4.5 (42)",  resp: "~35 min", ev: "90%" },
  rivera:  { icon: "🔩", name: "Motores Rivera",              level: "silver", lvl: "PLATA",   specs: ["Motor", "Diagnóstico"],         meta: "Calle Allende 96 · a 2.4 km",        rating: "⭐ 4.6 (58)",  resp: "~30 min", ev: "94%" }
};
const BADGE = { gold: "badge-gold", silver: "badge-silver", bronze: "badge-bronze", proc: "badge-proc" };

/* ============================================================
   3 · ESCENARIOS (8 rutas completas, datos simulados)
   Regla: las causas son "posibles causas a revisar"; el
   presupuesto nace de los hallazgos del diagnóstico.
   ============================================================ */
const SCENARIOS = {
  brakes: {
    id: "brakes", icon: "🛑", sym: "Rechina, raspa o truena al frenar", cat: "Frenos",
    variants: ["me rechinan los frenos", "suena al pisar el freno", "truena cuando freno"],
    system: "Sistema de frenos", specialty: "Frenos",
    urgency: { lvl: "alta", txt: "Urgencia alta — atiéndelo pronto: el frenado es un sistema de seguridad." },
    causes: ["Balatas desgastadas", "Discos rayados o alabeados", "Cáliper pegado o guías secas", "Objeto extraño entre balata y disco"],
    workshops: ["ruiz", "garcia", "meca", "compa"], main: "ruiz",
    reviews: [
      { who: "María G. ⭐⭐⭐⭐⭐", txt: "Me mandaron fotos de las balatas antes de cambiarlas. Nunca me habían explicado así." },
      { who: "Jorge T. ⭐⭐⭐⭐⭐", txt: "Autoricé todo desde el teléfono. Cero sorpresas en el precio." }
    ],
    diag: { cost: 250, note: "Incluye inspección de balatas, discos y líquido. Se descuenta si autorizas la reparación." },
    findings: ["Balatas delanteras al 10% de vida útil", "Disco delantero derecho con rayadura profunda", "Nivel de líquido de frenos al mínimo"],
    reception: [["📷", "Recepción"], ["📷", "Balata desgastada"], ["🎥", "Ruido al girar disco"], ["📷", "Disco rayado"]],
    quote: {
      folio: "PR-2026-0341",
      items: [
        { c: "Balatas delanteras (par)", d: "Cerámica, refacción calidad original", part: "BAL", imp: 1450, on: true },
        { c: "Mano de obra: cambio de balatas", d: "Incluye limpieza y ajuste de calipers", imp: 800, on: true },
        { c: "Líquido de frenos DOT-4", d: "Purga y reemplazo completo", imp: 640, on: true },
        { c: "Rectificado de discos (par)", d: "Con rectificadora certificada de la red · +1 día", imp: 950, on: false }
      ]
    },
    qa: ["Prueba de frenado en patio (baja velocidad)", "Medición de espesor de balata y disco", "Verificación de torque de rueda"],
    finding: null,
    warranty: { big: "6 meses", alt: "10,000 km", cover: "Cubre mano de obra y refacciones del trabajo autorizado. Válida en cualquier taller de la red AutoRed Pro.", folio: "G-2026-0512 · vigente hasta 13/ene/2027" },
    report: { works: "Cambio de balatas delanteras · limpieza y ajuste de calipers · reemplazo de líquido de frenos", tech: "José Ruiz · Certificado en frenos", rec: "Revisar estado de discos en 5,000 km (rectificado no autorizado hoy)." },
    ba: [["📷", "ANTES", "Balata al 10%"], ["📷", "DESPUÉS", "Balata nueva instalada"], ["🎥", "ANTES", "Rechinido audible"], ["🎥", "DESPUÉS", "Frenado silencioso"]]
  },

  overheating: {
    id: "overheating", icon: "🌡️", sym: "Se calienta el motor", cat: "Enfriamiento",
    variants: ["se me calienta el carro", "la aguja sube mucho", "sale vapor del cofre"],
    system: "Sistema de enfriamiento", specialty: "Enfriamiento / motor",
    urgency: { lvl: "critica", txt: "Urgencia crítica — no circules con temperatura alta: riesgo de daño mayor al motor. Considera grúa si la aguja llega al máximo." },
    causes: ["Nivel bajo o fuga de refrigerante", "Termostato pegado (no abre)", "Ventilador que no enciende", "Bomba de agua desgastada", "Radiador obstruido"],
    workshops: ["palma", "rivera", "meca", "compa"], main: "palma",
    reviews: [
      { who: "Raúl D. ⭐⭐⭐⭐⭐", txt: "Me mostraron la prueba de presión en video. Se veía clarito dónde fugaba." },
      { who: "Ana C. ⭐⭐⭐⭐", txt: "Me explicaron por qué era el termostato y no la bomba. Sin venderme de más." }
    ],
    diag: { cost: 300, note: "Incluye prueba de presión del sistema y verificación de ventilador. Se descuenta si autorizas la reparación." },
    findings: ["Fuga visible en manguera superior del radiador", "Termostato no abre a temperatura de operación", "Ventilador funciona correctamente"],
    reception: [["📷", "Recepción"], ["🎥", "Prueba de presión"], ["📷", "Fuga en manguera"], ["📷", "Nivel de refrigerante"]],
    quote: {
      folio: "PR-2026-0355",
      items: [
        { c: "Termostato con empaque", d: "Refacción calidad original", part: "TER", imp: 620, on: true },
        { c: "Manguera superior de radiador", d: "Incluye abrazaderas nuevas", part: "MAN", imp: 480, on: true },
        { c: "Refrigerante y purga del sistema", d: "Anticongelante 50/50, purga completa", imp: 550, on: true },
        { c: "Mano de obra", d: "Desmontaje, sustitución y pruebas", imp: 900, on: true }
      ]
    },
    qa: ["Prueba de presión post-reparación (sin fuga)", "Ciclo térmico de 20 min en marcha", "Verificación de encendido de ventilador"],
    finding: { desc: "Al purgar el sistema se detectó la tapa del radiador sin sello (no retiene presión).", item: { c: "Tapa de radiador", d: "Hallazgo adicional — requiere tu autorización", imp: 180 } },
    warranty: { big: "4 meses", alt: "8,000 km", cover: "Cubre refacciones instaladas y mano de obra del sistema de enfriamiento intervenido.", folio: "G-2026-0533 · vigente hasta 13/nov/2026" },
    report: { works: "Cambio de termostato y manguera superior · tapa de radiador (autorizada como adicional) · purga y refrigerante nuevo", tech: "R. Palma · Especialista en enfriamiento", rec: "Revisar estado de la bomba de agua en el próximo servicio." },
    ba: [["📷", "ANTES", "Fuga en manguera"], ["📷", "DESPUÉS", "Manguera nueva"], ["🎥", "ANTES", "Presión no retenía"], ["🎥", "DESPUÉS", "Presión estable 20 min"]]
  },

  electrical_no_start: {
    id: "electrical_no_start", icon: "🔋", sym: "No enciende o la batería se descarga", cat: "Eléctrico",
    variants: ["no prende mi carro", "amaneció sin batería", "se queda sin pila"],
    system: "Sistema eléctrico · arranque y carga", specialty: "Electricidad automotriz",
    urgency: { lvl: "media", txt: "Urgencia media — puede dejarte varado. Requiere prueba de batería, alternador y consumos antes de reemplazar piezas." },
    causes: ["Batería al final de su vida útil", "Alternador que no carga", "Consumo parásito (algo queda encendido)", "Motor de arranque (marcha) dañado", "Bornes sulfatados o flojos"],
    workshops: ["electro", "meca", "rivera", "compa"], main: "electro",
    reviews: [
      { who: "Pedro L. ⭐⭐⭐⭐⭐", txt: "Probaron la batería y el alternador antes de venderme nada. Resultó ser solo la batería." },
      { who: "Sofía M. ⭐⭐⭐⭐⭐", txt: "Me enseñaron el medidor con la lectura. Así da confianza pagar." }
    ],
    diag: { cost: 200, note: "Incluye prueba de batería, sistema de carga y consumo en reposo. Se descuenta si autorizas la reparación." },
    findings: ["Batería al 45% de capacidad (fin de vida útil)", "Alternador carga correctamente: 14.1 V", "Consumo en reposo dentro de rango normal"],
    reception: [["📷", "Recepción"], ["📷", "Prueba de batería"], ["📷", "Lectura 14.1 V"], ["📷", "Bornes sulfatados"]],
    quote: {
      folio: "PR-2026-0362",
      items: [
        { c: "Batería nueva", d: "12 V, capacidad según especificación · garantía del fabricante", part: "BAT", imp: 2350, on: true },
        { c: "Limpieza y protección de bornes", d: "Incluye antisulfatante", imp: 150, on: true },
        { c: "Verificación final de carga", d: "Prueba de arranque y carga post-instalación", imp: 0, on: true },
        { c: "Revisión de motor de arranque", d: "Preventiva · opcional según edad del vehículo", imp: 350, on: false }
      ]
    },
    qa: ["Prueba de arranque en frío (3 ciclos)", "Medición de voltaje de carga en marcha", "Verificación de consumo en reposo"],
    finding: null,
    warranty: { big: "12 meses", alt: "en batería (fabricante)", cover: "Batería con garantía del fabricante; mano de obra e instalación garantizadas por el taller de la red.", folio: "G-2026-0540 · vigente hasta 13/jul/2027" },
    report: { works: "Sustitución de batería · limpieza y protección de bornes · verificación de sistema de carga", tech: "E. Domínguez · Certificado en electricidad automotriz", rec: "Verificar sistema de carga en 6 meses; revisar marcha si aparecen arranques lentos." },
    ba: [["📷", "ANTES", "Batería al 45%"], ["📷", "DESPUÉS", "Batería nueva"], ["📷", "ANTES", "Bornes sulfatados"], ["📷", "DESPUÉS", "Bornes protegidos"]]
  },

  suspension: {
    id: "suspension", icon: "〰️", sym: "Suena, golpea o vibra la suspensión", cat: "Suspensión",
    variants: ["suena al pasar topes", "golpetea adelante", "vibra el volante"],
    system: "Suspensión y dirección", specialty: "Suspensión y dirección",
    urgency: { lvl: "media-alta", txt: "Urgencia media-alta — afecta el control del vehículo, sobre todo en frenado y curvas. Programa revisión esta semana." },
    causes: ["Amortiguadores vencidos", "Bujes de horquilla desgastados", "Terminales de dirección con juego", "Bieletas de barra estabilizadora", "Rótulas con desgaste"],
    workshops: ["marin", "ruiz", "meca", "compa"], main: "marin",
    reviews: [
      { who: "Luis H. ⭐⭐⭐⭐⭐", txt: "Me subieron el carro a la rampa y me mostraron el juego de las bieletas en video." },
      { who: "Carmen R. ⭐⭐⭐⭐", txt: "Alineación incluida y entregaron con prueba de manejo. Se siente otro carro." }
    ],
    diag: { cost: 250, note: "Incluye revisión en rampa con prueba de juego pieza por pieza. Se descuenta si autorizas la reparación." },
    findings: ["Bieletas de barra estabilizadora con juego evidente", "Bujes de horquilla agrietados", "Amortiguadores en buen estado"],
    reception: [["📷", "Recepción"], ["🎥", "Juego en bieleta"], ["📷", "Buje agrietado"], ["📷", "Amortiguador OK"]],
    quote: {
      folio: "PR-2026-0367",
      items: [
        { c: "Bieletas de estabilizadora (par)", d: "Refacción calidad original", part: "BIE", imp: 780, on: true },
        { c: "Bujes de horquilla (juego)", d: "Incluye prensado", part: "BUJ", imp: 950, on: true },
        { c: "Mano de obra suspensión", d: "Desmontaje, sustitución y apriete a torque", imp: 1100, on: true },
        { c: "Alineación y balanceo", d: "Recomendada tras cambiar componentes", imp: 450, on: true }
      ]
    },
    qa: ["Prueba de manejo en topes y bache controlado", "Revisión de juego en rampa post-instalación", "Verificación de alineación impresa"],
    finding: null,
    warranty: { big: "6 meses", alt: "10,000 km", cover: "Cubre refacciones y mano de obra de los componentes de suspensión sustituidos.", folio: "G-2026-0545 · vigente hasta 13/ene/2027" },
    report: { works: "Cambio de bieletas y bujes de horquilla · apriete a torque · alineación y balanceo", tech: "A. Marín · Certificado en suspensión y dirección", rec: "Amortiguadores en buen estado: reevaluar en 10,000 km." },
    ba: [["🎥", "ANTES", "Juego en bieleta"], ["🎥", "DESPUÉS", "Sin juego"], ["📷", "ANTES", "Buje agrietado"], ["📷", "DESPUÉS", "Buje nuevo prensado"]]
  },

  transmission: {
    id: "transmission", icon: "⚙️", sym: "Jala, patina o golpea al cambiar", cat: "Transmisión",
    variants: ["patina el clutch", "golpea al meter cambio", "huele a quemado al arrancar"],
    system: "Transmisión / embrague", specialty: "Transmisiones",
    urgency: { lvl: "alta", txt: "Urgencia alta — seguir rodando puede convertir una reparación media en una mayor. Evita cargas pesadas y pendientes." },
    causes: ["Disco de clutch desgastado", "Nivel o estado del aceite de transmisión", "Soportes de motor/caja vencidos", "Sincronizadores desgastados (manual)", "Cuerpo de válvulas (automática)"],
    workshops: ["nunez", "garcia", "meca", "compa"], main: "nunez",
    reviews: [
      { who: "Iván P. ⭐⭐⭐⭐⭐", txt: "Especialistas de verdad. Me mostraron el disco desgastado junto al nuevo." },
      { who: "Rosa E. ⭐⭐⭐⭐⭐", txt: "Encontraron una fuga extra y NO la repararon hasta que yo autoricé. Así sí." }
    ],
    diag: { cost: 350, note: "Incluye prueba de manejo, revisión de punto de clutch y fugas. Se descuenta si autorizas la reparación." },
    findings: ["Disco de clutch al 20% (patina bajo carga)", "Soporte trasero de caja agrietado", "Aceite de transmisión oscurecido"],
    reception: [["📷", "Recepción"], ["🎥", "Clutch patinando"], ["📷", "Soporte agrietado"], ["📷", "Aceite oscurecido"]],
    quote: {
      folio: "PR-2026-0371",
      items: [
        { c: "Kit de clutch completo", d: "Disco, plato y collarín · calidad original", part: "CLU", imp: 3850, on: true },
        { c: "Mano de obra: bajar/subir caja", d: "Incluye ajuste de punto de embrague", imp: 2200, on: true },
        { c: "Aceite de transmisión", d: "Reemplazo según especificación", imp: 480, on: true },
        { c: "Soporte trasero de caja", d: "Recomendado por grieta visible", part: "SOP", imp: 690, on: false }
      ]
    },
    qa: ["Prueba de manejo con cambios ascendentes/descendentes", "Verificación de punto de embrague", "Revisión de fugas post-instalación"],
    finding: { desc: "Con la caja abajo se detectó fuga leve en retén de cigüeñal (lado caja).", item: { c: "Retén de cigüeñal trasero", d: "Hallazgo adicional con caja abajo — requiere tu autorización", imp: 350 } },
    warranty: { big: "6 meses", alt: "10,000 km", cover: "Cubre kit de clutch instalado y mano de obra; retén adicional incluido en la cobertura.", folio: "G-2026-0551 · vigente hasta 13/ene/2027" },
    report: { works: "Kit de clutch completo · retén de cigüeñal (autorizado como adicional) · aceite de transmisión nuevo", tech: "M. Núñez · Especialista en transmisiones", rec: "Sustituir soporte trasero de caja (no autorizado hoy) en el próximo servicio." },
    ba: [["📷", "ANTES", "Disco al 20%"], ["📷", "DESPUÉS", "Kit nuevo instalado"], ["🎥", "ANTES", "Patina bajo carga"], ["🎥", "DESPUÉS", "Tracción firme"]]
  },

  maintenance: {
    id: "maintenance", icon: "🧰", sym: "Afinación, aceite o mantenimiento preventivo", cat: "Mantenimiento",
    variants: ["ya le toca servicio", "cambio de aceite", "afinación mayor"],
    system: "Mantenimiento programado", specialty: "Servicio general",
    urgency: { lvl: "baja", txt: "Urgencia baja — es preventivo, pero no lo pospongas: el mantenimiento a tiempo evita las reparaciones caras." },
    causes: ["Aceite y filtro según kilometraje", "Bujías con desgaste normal", "Filtro de aire sucio", "Filtro de cabina saturado", "Inspección de frenos y niveles"],
    workshops: ["meca", "ruiz", "compa", "rivera"], main: "meca",
    reviews: [
      { who: "Diego F. ⭐⭐⭐⭐", txt: "Servicio express con checklist firmado. Me avisaron de las balatas para la próxima." },
      { who: "Paty V. ⭐⭐⭐⭐⭐", txt: "Todo con fotos: el aceite viejo, el filtro sucio, el nuevo instalado." }
    ],
    diag: { cost: 0, note: "La revisión de niveles y puntos de seguridad está incluida en el servicio: sin costo de diagnóstico." },
    findings: ["Aceite al límite de vida útil (según kilometraje)", "Filtro de aire con suciedad visible", "Bujías con desgaste normal para el kilometraje"],
    reception: [["📷", "Recepción"], ["📷", "Nivel de aceite"], ["📷", "Filtro de aire sucio"], ["📷", "Bujías actuales"]],
    quote: {
      folio: "PR-2026-0378",
      items: [
        { c: "Aceite sintético + filtro", d: "Grado según especificación del fabricante", part: "ACE", imp: 1250, on: true },
        { c: "Juego de bujías", d: "Según especificación del motor", part: "BUJ", imp: 890, on: true },
        { c: "Filtro de aire de motor", d: "Reemplazo", part: "FIL", imp: 320, on: true },
        { c: "Filtro de cabina", d: "Recomendado para clima y polvo de la zona", imp: 280, on: false }
      ]
    },
    qa: ["Escaneo general post-servicio (sin códigos)", "Prueba de ruta corta", "Verificación de niveles y torque de tapón"],
    finding: null,
    warranty: { big: "3 meses", alt: "5,000 km", cover: "Cubre mano de obra del servicio y refacciones instaladas dentro del periodo.", folio: "G-2026-0558 · vigente hasta 13/oct/2026" },
    report: { works: "Cambio de aceite y filtro · juego de bujías · filtro de aire", tech: "C. Ortega · Servicio general certificado", rec: "Próximo servicio en 10,000 km; considerar filtro de cabina (no autorizado hoy)." },
    ba: [["📷", "ANTES", "Aceite al límite"], ["📷", "DESPUÉS", "Aceite nuevo"], ["📷", "ANTES", "Filtro sucio"], ["📷", "DESPUÉS", "Filtro nuevo"]]
  },

  ac: {
    id: "ac", icon: "❄️", sym: "El aire acondicionado no enfría", cat: "Clima",
    variants: ["el clima avienta aire caliente", "enfría poco", "huele raro el aire"],
    system: "Climatización (A/C)", specialty: "Aire acondicionado",
    urgency: { lvl: "baja-media", txt: "Urgencia baja-media — es de confort, pero una fuga pequeña hoy es un compresor dañado mañana. Conviene diagnosticar pronto." },
    causes: ["Carga de gas baja por fuga", "Compresor que no embraga", "Condensador sucio u obstruido", "Filtro de cabina saturado", "Ventilador del condensador"],
    workshops: ["frias", "electro", "meca", "compa"], main: "frias",
    reviews: [
      { who: "Hugo S. ⭐⭐⭐⭐⭐", txt: "Encontraron la fuga con tinte UV y me la enseñaron con la lámpara. Convincente." },
      { who: "Elena B. ⭐⭐⭐⭐", txt: "Midieron la temperatura en la rejilla antes y después: de 18° a 6°." }
    ],
    diag: { cost: 350, note: "Incluye lectura con manómetros y detección de fugas. Se descuenta si autorizas la reparación." },
    findings: ["Carga de refrigerante al 30%", "Fuga leve localizada en válvula de servicio", "Filtro de cabina saturado"],
    reception: [["📷", "Recepción"], ["📷", "Lectura manómetros"], ["📷", "Fuga con tinte UV"], ["📷", "Filtro saturado"]],
    quote: {
      folio: "PR-2026-0384",
      items: [
        { c: "Válvula de servicio", d: "Sustitución del punto de fuga localizado", part: "VAL", imp: 260, on: true },
        { c: "Recarga de gas refrigerante", d: "R-134a con aceite y tinte UV", imp: 1100, on: true },
        { c: "Filtro de cabina", d: "Mejora flujo y olor del aire", imp: 280, on: true },
        { c: "Limpieza de condensador", d: "Recomendada por polvo acumulado", imp: 400, on: false }
      ]
    },
    qa: ["Medición de temperatura en rejilla (°C)", "Verificación de presiones alta/baja", "Reinspección de fuga a las 24 h (tinte UV)"],
    finding: null,
    warranty: { big: "90 días", alt: "en recarga y punto reparado", cover: "Cubre la recarga y el punto de fuga reparado; no cubre fugas nuevas en otros componentes.", folio: "G-2026-0561 · vigente hasta 11/oct/2026" },
    report: { works: "Cambio de válvula de servicio · recarga completa con tinte UV · filtro de cabina", tech: "L. Frías · Certificado en climatización", rec: "Limpieza de condensador (no autorizada hoy) para mejorar rendimiento." },
    ba: [["📷", "ANTES", "Rejilla a 18 °C"], ["📷", "DESPUÉS", "Rejilla a 6 °C"], ["📷", "ANTES", "Fuga con tinte UV"], ["📷", "DESPUÉS", "Sin fuga a 24 h"]]
  },

  engine_check: {
    id: "engine_check", icon: "⚠️", sym: "Pierde potencia o tiene encendido el Check Engine", cat: "Motor",
    variants: ["se prendió el check engine", "no jala parejo", "tironea al acelerar"],
    system: "Motor · gestión electrónica", specialty: "Diagnóstico electrónico",
    urgency: { lvl: "media-alta", txt: "Urgencia media-alta — requiere escaneo antes de seguir circulando distancias largas: una falla de encendido sostenida puede dañar el catalizador." },
    causes: ["Bobina o cables de encendido", "Sensor de oxígeno", "Cuerpo de aceleración sucio", "Fugas de vacío", "Catalizador restringido"],
    workshops: ["rivera", "electro", "meca", "compa"], main: "rivera",
    reviews: [
      { who: "Marco A. ⭐⭐⭐⭐⭐", txt: "Me imprimieron el reporte del escáner con el código y su explicación. Nada de adivinar." },
      { who: "Julia N. ⭐⭐⭐⭐⭐", txt: "Repararon solo lo que el diagnóstico confirmó. El carro volvió a jalar como antes." }
    ],
    diag: { cost: 400, note: "Incluye escaneo OBD-II, lectura de datos en vivo y prueba de encendido. Se descuenta si autorizas la reparación." },
    findings: ["Código P0301: falla de encendido en cilindro 1", "Bobina del cilindro 1 con chispa débil", "Cuerpo de aceleración con carbón acumulado"],
    reception: [["📷", "Recepción"], ["📷", "Código P0301"], ["📷", "Prueba de bobina"], ["📷", "Cuerpo con carbón"]],
    quote: {
      folio: "PR-2026-0390",
      items: [
        { c: "Bobina de encendido", d: "Cilindro 1 · calidad original", part: "BOB", imp: 980, on: true },
        { c: "Juego de bujías", d: "Recomendado al intervenir encendido", part: "BUJ", imp: 890, on: true },
        { c: "Limpieza de cuerpo de aceleración", d: "Incluye reaprendizaje de marcha mínima", imp: 600, on: true },
        { c: "Sensor de oxígeno", d: "Solo si persiste código tras reparación", imp: 1450, on: false }
      ]
    },
    qa: ["Borrado de códigos y re-escaneo (sin códigos nuevos)", "Prueba de ruta de 10 km con datos en vivo", "Verificación de marcha mínima estable"],
    finding: null,
    warranty: { big: "6 meses", alt: "10,000 km", cover: "Cubre refacciones instaladas y mano de obra; el re-escaneo de verificación está incluido.", folio: "G-2026-0567 · vigente hasta 13/ene/2027" },
    report: { works: "Cambio de bobina cilindro 1 · juego de bujías · limpieza de cuerpo de aceleración con reaprendizaje", tech: "G. Rivera · Certificado en diagnóstico electrónico", rec: "Monitorear en el siguiente servicio; sensor de oxígeno solo si reaparece código." },
    ba: [["📷", "ANTES", "Código P0301"], ["📷", "DESPUÉS", "Escáner sin códigos"], ["🎥", "ANTES", "Tironeo al acelerar"], ["🎥", "DESPUÉS", "Aceleración uniforme"]]
  }
};

/* ============================================================
   4 · ESTADO GLOBAL
   ============================================================ */
const state = {
  vehicle: VEHICLES[0],
  scenario: SCENARIOS.brakes
};
const EV_CLASSES = ["ev-a", "ev-b", "ev-c", "ev-d"];
const OT = "OT-2026-0512";

/* ============================================================
   5 · TRAZABILIDAD — generador de eventos por escenario
   Cada evento: hora, actor, etapa, descripción, evidencia,
   estado anterior → nuevo, folio, requiere autorización.
   ============================================================ */
function buildEvents(sc, veh) {
  const ws = WS[sc.main].name;
  const E = [];
  const push = (t, actor, stage, desc, ev, prev, next, folio, auth, obs) =>
    E.push({ t, actor, stage, desc, ev: ev || "—", prev, next, folio: folio || OT, auth: !!auth, obs: obs || "" });

  push("Día 1 · 08:42", "Cliente", "Solicitud creada", `Solicitud de diagnóstico: "${sc.sym}" · ${veh.label}`, "1 foto · 1 video del síntoma", "—", "solicitado", "SR-2026-0207");
  push("Día 1 · 08:57", "Recepcionista", "Cita confirmada", `${ws} confirma cita para el día siguiente 9:00`, "—", "solicitado", "aceptado", "SR-2026-0207");
  push("Día 2 · 09:02", "Recepcionista", "Vehículo recibido", `Ingreso de ${veh.label} · km registrado: ${veh.km}`, "—", "aceptado", "en_recepcion");
  push("Día 2 · 09:08", "Recepcionista", "Recepción documentada", "Estado del vehículo documentado en 4 fotos (exterior, interior, tablero, km)", "4 fotos", "en_recepcion", "recibido");
  push("Día 2 · 09:20", "Técnico", "Diagnóstico iniciado", `Inspección del sistema: ${sc.system}`, "—", "recibido", "en_diagnostico");
  push("Día 2 · 09:55", "Técnico", "Diagnóstico concluido", `Hallazgos: ${sc.findings.join("; ")}`, `${sc.reception.length} evidencias`, "en_diagnostico", "diagnosticado");
  push("Día 2 · 10:05", "Responsable del taller", "Presupuesto emitido", `Presupuesto ${sc.quote.folio} enviado al cliente (${sc.quote.items.length} partidas)`, "PDF + evidencias ligadas", "diagnosticado", "presupuestado", sc.quote.folio);
  push("Día 2 · 10:22", "Cliente", "Cliente autoriza partidas", "Autorización parcial/total registrada con firma y sello de tiempo", "firma digital", "presupuestado", "autorizado", sc.quote.folio, true);
  push("Día 2 · 10:30", "Técnico", "Trabajo iniciado", "Orden asignada a isla de trabajo con técnico responsable", "—", "autorizado", "en_proceso");
  if (sc.finding) {
    push("Día 2 · 11:40", "Técnico", "Hallazgo adicional", sc.finding.desc, "1 foto del hallazgo", "en_proceso", "adicional_pendiente", null, false, "El trabajo relacionado se PAUSA: ningún hallazgo se ejecuta sin nueva partida y autorización.");
    push("Día 2 · 11:45", "Responsable del taller", "Nuevo presupuesto requerido", `Partida adicional: ${sc.finding.item.c} (${fmt(sc.finding.item.imp)})`, "PDF adicional", "adicional_pendiente", "adicional_pendiente", sc.quote.folio + "-AD", true);
    push("Día 2 · 12:02", "Cliente", "Autorización adicional", "Cliente autoriza la partida adicional desde su teléfono", "firma digital", "adicional_pendiente", "autorizado", sc.quote.folio + "-AD", true);
    push("Día 2 · 12:05", "Técnico", "Trabajo reanudado", "Se reanuda la ejecución incluyendo la partida adicional autorizada", "—", "autorizado", "en_proceso");
  }
  push("Día 2 · 14:30", "Técnico", "Pruebas de calidad", sc.qa.join(" · "), "evidencia de pruebas", "en_proceso", "en_pruebas");
  push("Día 2 · 16:45", "Responsable del taller", "Entrega", "Reporte final con evidencia antes/después; vehículo entregado al cliente", "reporte + fotos", "en_pruebas", "entregado");
  push("Día 2 · 16:50", "Administrador de la red", "Garantía registrada", `Garantía ${sc.warranty.big} / ${sc.warranty.alt} registrada en la red`, "certificado digital", "entregado", "en_garantia", sc.warranty.folio.split(" ")[0]);
  push("Día 2 · 19:10", "Cliente", "Evaluación del cliente", "Encuesta post-servicio respondida (calidad-precio y NPS)", "—", "en_garantia", "cerrado");
  return E;
}

function traceHtml(events) {
  return events.map(e => `
    <div class="tr-ev ${e.auth ? "tr-auth" : ""}">
      <div class="tr-when">${e.t}</div>
      <div class="tr-body">
        <div class="tr-top"><b>${e.stage}</b> <span class="tr-actor">${e.actor}</span> ${e.auth ? '<span class="pill warn">requiere autorización</span>' : ""}</div>
        <div class="tr-desc">${e.desc}</div>
        <div class="tr-meta">Evidencia: ${e.ev} · Estado: <code>${e.prev} → ${e.next}</code> · Folio: ${e.folio}</div>
        ${e.obs ? `<div class="tr-obs">⚠ ${e.obs}</div>` : ""}
      </div>
    </div>`).join("");
}

/* ============================================================
   6 · NAVEGACIÓN Y ROLES (con acceso demostrativo)
   ============================================================ */
const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll(".nav-item");
const roleTabs = document.querySelectorAll(".role-tab[data-role]");
const navGroups = document.querySelectorAll(".nav-group");
const SESSION_KEY = "arp_demo_session";
const DEMO_PASS = "autoredpro"; // barrera DEMOSTRATIVA, no seguridad real
let pendingRole = null;

const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; } };

function showScreen(id) {
  const group = document.querySelector(`.nav-item[data-screen="${id}"]`)?.closest(".nav-group");
  const role = group ? group.dataset.role : "cliente";
  if (role !== "cliente" && !getSession()) { openLogin(role); return; }
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.screen === id));
  if (group) setRole(role, false, true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setRole(role, jump = true, skipAuth = false) {
  if (!skipAuth && role !== "cliente" && !getSession()) { openLogin(role); return; }
  roleTabs.forEach(t => t.classList.toggle("active", t.dataset.role === role));
  navGroups.forEach(g => g.classList.toggle("hidden", g.dataset.role !== role));
  if (jump) {
    const first = document.querySelector(`.nav-group[data-role="${role}"] .nav-item`);
    if (first) showScreen(first.dataset.screen);
  }
  refreshLogout();
}

function openLogin(role) {
  pendingRole = role;
  $("loginStep1").classList.remove("hidden");
  $("loginStep2").classList.add("hidden");
  $("loginError").classList.add("hidden");
  $("loginOverlay").classList.remove("hidden");
  $("loginPass").value = "";
  setTimeout(() => $("loginUser").focus(), 50);
}

function doLogin() {
  const user = $("loginUser").value.trim();
  const pass = $("loginPass").value;
  if (!user || pass !== DEMO_PASS) { $("loginError").classList.remove("hidden"); return; }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, ts: Date.now() }));
  $("loginWho").textContent = user;
  $("loginStep1").classList.add("hidden");
  $("loginStep2").classList.remove("hidden");
  refreshLogout();
}

function refreshLogout() { $("logoutBtn").classList.toggle("hidden", !getSession()); }

$("loginBtn").addEventListener("click", doLogin);
$("loginPass").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });
$("loginCancel").addEventListener("click", () => { $("loginOverlay").classList.add("hidden"); setRole("cliente"); });
$("pwToggle").addEventListener("click", () => {
  const p = $("loginPass"); p.type = p.type === "password" ? "text" : "password";
});
$("chooseTaller").addEventListener("click", () => { $("loginOverlay").classList.add("hidden"); setRole("taller"); });
$("chooseAdmin").addEventListener("click", () => { $("loginOverlay").classList.add("hidden"); setRole("admin"); });
$("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  refreshLogout();
  setRole("cliente");
});

navItems.forEach(n => n.addEventListener("click", () => showScreen(n.dataset.screen)));
roleTabs.forEach(t => t.addEventListener("click", () => setRole(t.dataset.role)));
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => {
  if (b.dataset.roleGo) setRole(b.dataset.roleGo, false, !!getSession() || b.dataset.roleGo === "cliente");
  showScreen(b.dataset.go);
}));

/* ============================================================
   7 · RENDER DEL FLUJO CLIENTE (dinámico por escenario/vehículo)
   ============================================================ */
function renderVehicleSelect() {
  $("vehicleSelect").innerHTML = VEHICLES.map(v =>
    `<option value="${v.id}" ${v.id === state.vehicle.id ? "selected" : ""}>${v.label}</option>`).join("");
  $("vehKm").value = state.vehicle.km;
}
$("vehicleSelect")?.addEventListener("change", e => {
  state.vehicle = VEHICLES.find(v => v.id === e.target.value) || VEHICLES[0];
  $("vehKm").value = state.vehicle.km;
  applyScenario();
});

function renderSymptoms() {
  $("symptomGrid").innerHTML = Object.values(SCENARIOS).map(sc => `
    <button class="symptom ${sc.id === state.scenario.id ? "active" : ""}" data-sym="${sc.id}">
      ${sc.icon}<b>${sc.sym}</b><small>${sc.cat}</small>
    </button>`).join("");
  document.querySelectorAll(".symptom").forEach(s => s.addEventListener("click", () => {
    state.scenario = SCENARIOS[s.dataset.sym];
    document.querySelectorAll(".symptom").forEach(x => x.classList.toggle("active", x.dataset.sym === s.dataset.sym));
    applyScenario();
  }));
}

function wsCard(ref, isMain, sc) {
  const w = WS[ref];
  return `
  <div class="ws-card">
    <div class="ws-ico">${w.icon}</div>
    <div class="ws-info">
      <b>${w.name}</b>
      <div class="ws-meta">${w.rating} · ${w.meta} · Responde en ${w.resp} · ${w.ev} evidencia completa</div>
      <div class="ws-badges"><span class="badge ${BADGE[w.level]}">${w.lvl}</span>${w.specs.map(s => `<span class="badge badge-spec">${s}</span>`).join("")}</div>
    </div>
    <div class="ws-side">
      <div class="price">Diagnóstico ${sc.diag.cost ? fmt(sc.diag.cost) : "incluido"}</div>
      <div class="price-note">${sc.diag.cost ? "El diagnóstico se descuenta si autorizas la reparación." : "Incluido en el servicio."}</div>
      <button class="btn ${isMain ? "btn-red" : "btn-ghost"}" data-go="s5">${isMain ? "Ver perfil →" : "Ver perfil"}</button>
    </div>
  </div>`;
}

function applyScenario() {
  const sc = state.scenario, veh = state.vehicle, w = WS[sc.main];
  const partOf = it => it.part ? ` · N° parte demo: ${it.part}-${veh.code}` : "";

  /* s3 */
  $("s3veh").textContent = veh.label;
  $("symContinue").textContent = `Buscar talleres de ${sc.specialty.toLowerCase()} →`;
  $("symDesc").value = `${sc.variants[0].charAt(0).toUpperCase() + sc.variants[0].slice(1)}. Empezó hace una semana.`;
  $("s3urgency").innerHTML = `⏱ <b>${sc.urgency.txt}</b> Posible sistema relacionado: ${sc.system}. <i>Requiere diagnóstico: esto no sustituye la inspección técnica.</i>`;

  /* s4 */
  $("s4spec").textContent = sc.specialty;
  $("s4system").textContent = sc.system;
  $("s4filters").innerHTML = `<span class="chip chip-navy">Especialidad: ${sc.specialty} ✓</span><span class="chip">Cerca de mí</span><span class="chip">Nivel Oro</span><span class="chip">Disponible hoy</span>`;
  $("workshopList").innerHTML = sc.workshops.map((ref, i) => wsCard(ref, i === 0, sc)).join("");
  $("workshopList").querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showScreen(b.dataset.go)));

  /* s5 */
  $("wsProfIcon").textContent = w.icon;
  $("wsProfName").textContent = w.name;
  $("wsProfBadges").innerHTML = `<span class="badge ${BADGE[w.level]}">${w.lvl === "★ ORO" ? "★ CERTIFICADO ORO" : "CERTIFICADO " + w.lvl}</span><span class="badge badge-spec">Especialista: ${sc.specialty}</span>`;
  $("wsProfMeta").textContent = `${w.meta} · Abierto hasta las 19:00`;
  $("wsProfStats").innerHTML = `<span>${w.rating} reseñas</span><span>📷 ${w.ev} evidencia completa</span><span>🛡️ 100% garantías cumplidas</span><span>⏱️ Responde en ${w.resp}</span>`;
  $("causesList").innerHTML = sc.causes.map(c => `<li>🔍 ${c}</li>`).join("");
  $("specLine").innerHTML = `✅ Técnicos capacitados: ${w.specs.join(" y ").toLowerCase()}`;
  $("wsReviews").innerHTML = sc.reviews.map(r => `<div class="review"><b>${r.who}</b><p>"${r.txt}"</p></div>`).join("");

  /* s6 */
  $("sumWsTop").textContent = w.name;
  $("sumVeh").textContent = `${veh.label} · ${veh.km}`;
  $("sumSym").textContent = sc.sym;
  $("sumSys").innerHTML = `${sc.system} <small>(posible, a confirmar en diagnóstico)</small>`;
  $("sumDesc").textContent = $("symDesc").value;
  $("sumWs").textContent = `${w.name} · ${w.lvl.replace("★ ", "Certificado ")}`;
  $("diagNote").innerHTML = sc.diag.cost
    ? `ℹ️ El diagnóstico tiene costo de <b>${fmt(sc.diag.cost)}</b>. ${sc.diag.note}`
    : `ℹ️ ${sc.diag.note}`;

  /* s7 */
  $("flowNote").innerHTML = `📩 <b>${w.name}</b> documentó la recepción de tu ${veh.label} y concluyó el diagnóstico. Te envió este presupuesto:`;
  $("qFolio").textContent = "FOLIO " + sc.quote.folio;
  $("findingsList").innerHTML = sc.findings.map(f => `<li>🔧 ${f}</li>`).join("");
  $("evStrip").innerHTML = sc.reception.map((e, i) => `<div class="ev ${EV_CLASSES[i % 4]}">${e[0]}<small>${e[1]}</small></div>`).join("");
  $("qMeta").textContent = `Vigencia: 5 días · Garantía: ${sc.warranty.big} / ${sc.warranty.alt} · ${sc.diag.cost ? `Diagnóstico (${fmt(sc.diag.cost)}) bonificado al autorizar` : "Diagnóstico incluido"}`;
  renderQuote();

  /* s8 */
  $("authFolio").textContent = `${sc.quote.folio} · ${w.name}`;
  $("authWarranty").textContent = `${sc.warranty.big} / ${sc.warranty.alt}`;

  /* s9 */
  $("s9sub").innerHTML = `${veh.label} · ${w.name} · Entrega estimada: <b>hoy 17:00</b>`;
  renderTimeline();
  const events = buildEvents(sc, veh);
  $("traceLog").innerHTML = traceHtml(events);
  $("traceToggle").textContent = `Ver bitácora completa (${events.length} eventos)`;
  $("traceLogTaller").innerHTML = traceHtml(events);

  /* s10 */
  $("repVeh").textContent = `${veh.label} · ${veh.km}`;
  $("repWorks").textContent = sc.report.works;
  const partsTxt = sc.quote.items.filter(i => i.on && i.part).map(i => `${i.c} — parte demo ${i.part}-${veh.code}`).join(" · ") || "Sin refacciones con número de parte";
  $("repParts").textContent = partsTxt;
  $("repQa").textContent = sc.qa.join(" · ");
  $("repTech").textContent = sc.report.tech;
  $("repRec").textContent = sc.report.rec.replace("{veh}", veh.label);
  $("baRow").innerHTML = sc.ba.map(b => `<div class="ba ${b[1] === "ANTES" ? "before" : "after"}">${b[0]}<b>${b[1]}</b><small>${b[2]}</small></div>`).join("");
  $("wBig").innerHTML = `${sc.warranty.big} <span>o</span> ${sc.warranty.alt}`;
  $("wCover").textContent = sc.warranty.cover;
  $("wFolio").textContent = "Certificado " + sc.warranty.folio;
  $("histList").innerHTML = [
    `<div class="hist-item"><b>Hoy</b> ${sc.specialty} · ${w.name} · <span id="histTotal"></span> · 🛡️</div>`,
    `<div class="hist-item"><b>Mar 2026</b> Afinación mayor · MecaExpress · $1,850 · 🛡️</div>`,
    `<div class="hist-item"><b>Nov 2025</b> Suspensión del. · Suspensiones Marín · $3,200 · 🛡️</div>`
  ].join("");

  /* s11 kanban card ligada al escenario activo */
  $("kanbanMain").textContent = `${OT.replace("OT-2026-", "OT-")} · ${veh.label.replace(/^\w+ /, "")}`;
  $("kanbanMainSub").textContent = `${sc.specialty} · en proceso`;

  updateTotals();
}

/* ---------- Presupuesto con autorización parcial ---------- */
function renderQuote() {
  const sc = state.scenario, veh = state.vehicle;
  $("quoteItems").innerHTML = sc.quote.items.map((it, i) => `
    <div class="q-item ${it.on ? "" : "off"}">
      <div><b>${it.c}</b></div>
      <small>${it.d}${it.part ? ` · N° parte demo: ${it.part}-${veh.code}` : ""}</small>
      <span class="imp">${fmt(it.imp)}</span>
      <input type="checkbox" data-i="${i}" ${it.on ? "checked" : ""}>
    </div>`).join("");
  $("quoteItems").querySelectorAll("input").forEach(chk =>
    chk.addEventListener("change", () => {
      sc.quote.items[chk.dataset.i].on = chk.checked;
      renderQuote();
    })
  );
  updateTotals();
}

function updateTotals() {
  const sc = state.scenario;
  const items = sc.quote.items;
  let total = items.filter(i => i.on).reduce((a, b) => a + b.imp, 0);
  if (sc.finding) total += sc.finding.item.imp; // adicional autorizado en la simulación
  const nOn = items.filter(i => i.on).length;
  const off = items.filter(i => !i.on).map(i => i.c.toLowerCase()).join(", ");
  $("quoteTotal").textContent = fmt(items.filter(i => i.on).reduce((a, b) => a + b.imp, 0));
  $("authTotal").textContent = fmt(items.filter(i => i.on).reduce((a, b) => a + b.imp, 0));
  $("authItems").textContent = `${nOn} de ${items.length}` + (off ? ` (no autorizado: ${off})` : " (todas)") + (sc.finding ? " · +1 adicional autorizado durante el servicio" : "");
  $("repTotal").textContent = fmt(total);
  const ht = $("histTotal"); if (ht) ht.textContent = fmt(total);
}

/* ---------- Timeline visual (s9) ---------- */
function renderTimeline() {
  const sc = state.scenario;
  const steps = [
    { st: "done", ico: "✓", t: "Recepción documentada", s: "9:08 · 4 fotos del estado del vehículo", ev: ["📷", "📷", "📷", "📷"] },
    { st: "done", ico: "✓", t: "Diagnóstico", s: `9:55 · ${sc.findings[0]}`, ev: sc.reception.slice(1, 3).map(e => e[0]) },
    { st: "done", ico: "✓", t: "Presupuesto autorizado", s: `10:22 · ${sc.quote.folio} · firma registrada`, ev: [] },
    { st: "active", ico: "🔧", t: `En proceso: ${sc.specialty.toLowerCase()}`, s: "Ahora · refacción documentada con foto", ev: ["📷", "📷"] },
    ...(sc.finding ? [{ st: "active", ico: "➕", t: "Hallazgo adicional (pausado hasta autorizar)", s: sc.finding.desc, ev: ["📷"] }] : []),
    { st: "", ico: "5", t: "Pruebas y control de calidad", s: sc.qa[0], ev: [] },
    { st: "", ico: "6", t: "Reporte final y entrega", s: "Pendiente", ev: [] }
  ];
  $("timeline").innerHTML = steps.map(x => `
    <div class="t-step ${x.st}"><div class="t-dot">${x.ico}</div><div>
      <b>${x.t}</b><small>${x.s}</small>
      ${x.ev.length ? `<div class="mini-ev">${x.ev.map(e => `<span>${e}</span>`).join("")}</div>` : ""}
    </div></div>`).join("");
}

$("traceToggle").addEventListener("click", function () {
  const log = $("traceLog");
  log.classList.toggle("hidden");
  this.textContent = log.classList.contains("hidden")
    ? this.textContent.replace("Ocultar bitácora", "Ver bitácora completa")
    : this.textContent.replace("Ver bitácora completa", "Ocultar bitácora");
});

/* ---------- Firma simulada (s8) ---------- */
const signZone = $("signZone");
signZone.addEventListener("click", () => {
  signZone.classList.add("signed");
  $("signText").textContent = "Carlos Mendoza";
});
$("authorizeBtn").addEventListener("click", e => {
  if (!signZone.classList.contains("signed")) {
    e.stopImmediatePropagation();
    signZone.classList.add("signed");
    $("signText").textContent = "Carlos Mendoza";
    setTimeout(() => showScreen("s9"), 450);
  }
}, true);

/* ============================================================
   8 · ISLAS DE TRABAJO (panel del taller)
   ============================================================ */
const TECHS = ["José Ruiz", "M. Lara", "C. Ortega", "E. Prieto", "Sin asignar"];
const ISLAND_STATES = {
  disponible: { txt: "Disponible", cls: "ist-free" },
  reservada: { txt: "Reservada", cls: "ist-res" },
  esperando_vehiculo: { txt: "Esperando vehículo", cls: "ist-res" },
  ocupada: { txt: "Ocupada", cls: "ist-busy" },
  esperando_autorizacion: { txt: "Esperando autorización", cls: "ist-block" },
  esperando_refaccion: { txt: "Esperando refacción", cls: "ist-block" },
  en_pruebas: { txt: "En pruebas", cls: "ist-test" },
  lista_entrega: { txt: "Lista para entregar", cls: "ist-done" },
  fuera_servicio: { txt: "Fuera de servicio", cls: "ist-off" }
};

const islands = [
  { id: 1, name: "Isla 1 · Elevador y frenos", spec: "Frenos", eq: "Elevador 2 postes · torquímetro · medidor de discos", tech: "José Ruiz", state: "ocupada", order: "OT-0512", veh: "Nissan Versa 2019", stage: "Cambio de balatas", tin: "9:15", eta: "2.5 h", evp: 1, next: "Subir foto de refacción instalada" },
  { id: 2, name: "Isla 2 · Suspensión y dirección", spec: "Suspensión", eq: "Rampa · alineadora · prensa de resortes", tech: "M. Lara", state: "esperando_autorizacion", order: "OT-0513", veh: "VW Jetta 2017", stage: "Presupuesto enviado 10:40", tin: "10:05", eta: "—", evp: 0, next: "Esperar autorización del cliente" },
  { id: 3, name: "Isla 3 · Diagnóstico electrónico", spec: "Diagnóstico", eq: "Scanner OBD-II · osciloscopio · multímetro", tech: "Sin asignar", state: "disponible", order: null, veh: null, stage: "—", tin: "—", eta: "—", evp: 0, next: "Asignar orden de la cola" },
  { id: 4, name: "Isla 4 · Electricidad automotriz", spec: "Electricidad", eq: "Probador de baterías · cargador · multímetro", tech: "E. Prieto", state: "esperando_refaccion", order: "OT-0509", veh: "Nissan March 2020", stage: "Kit de clutch en camino", tin: "8:40", eta: "refacción 14:30", evp: 0, next: "Avisar demora al cliente" },
  { id: 5, name: "Isla 5 · Motor y enfriamiento", spec: "Motor", eq: "Prueba de presión · kit térmico · herramienta de motor", tech: "C. Ortega", state: "en_pruebas", order: "OT-0510", veh: "Nissan NP300 2021", stage: "Ciclo térmico 20 min", tin: "11:20", eta: "0.5 h", evp: 1, next: "Subir video de prueba y pasar a entrega" },
  { id: 6, name: "Isla compartida · Mecánico independiente", spec: "Multiuso", eq: "Elevador · banco de trabajo · equipo bajo reserva", tech: "—", state: "disponible", order: null, veh: null, stage: "—", tin: "—", eta: "—", evp: 0, next: "Puede reservarse por mecánicos certificados", shared: true }
];

const queue = [
  { id: "OT-0514", txt: "OT-0514 · Nissan Tsuru 2015 · No enciende (diagnóstico eléctrico)" },
  { id: "OT-0515", txt: "OT-0515 · Chevrolet Aveo 2020 · Afinación · cita 12:30" }
];

let sharedRequest = {
  open: true,
  who: "Carlos Vega · Mecánico independiente certificado (Plata)",
  what: "Solicita Isla compartida · jueves 10:00–14:00 · equipo: elevador + scanner OBD-II",
  order: "Orden externa MI-0033 · Kia Rio 2017 · cambio de amortiguadores",
  cond: "Condiciones: evidencia obligatoria en la app, presupuesto autorizado previo, responsable: C. Vega."
};

const islandEvents = [];
function logIsland(msg) {
  const t = new Date();
  islandEvents.unshift({ t: `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`, msg });
  $("islandLog").innerHTML = islandEvents.map(e => `<div class="tr-ev"><div class="tr-when">${e.t}</div><div class="tr-body"><div class="tr-desc">${e.msg}</div></div></div>`).join("") || "<small>Sin movimientos aún.</small>";
}

function renderIslands() {
  /* KPIs */
  const busy = islands.filter(i => i.state === "ocupada" || i.state === "en_pruebas").length;
  const blocked = islands.filter(i => i.state === "esperando_autorizacion" || i.state === "esperando_refaccion").length;
  const free = islands.filter(i => i.state === "disponible").length;
  $("islandKpis").innerHTML = `
    <div class="kpi"><b>${busy}</b><span>en trabajo</span></div>
    <div class="kpi"><b>${blocked}</b><span>bloqueadas</span></div>
    <div class="kpi"><b>${free}</b><span>disponibles</span></div>`;

  $("islandsGrid").innerHTML = islands.map(is => {
    const st = ISLAND_STATES[is.state];
    const idle = is.state === "disponible" && queue.length > 0 && !is.shared;
    const blockedIs = is.state === "esperando_autorizacion" || is.state === "esperando_refaccion";
    return `
    <div class="island ${st.cls}">
      <div class="is-head"><b>${is.name}</b><span class="is-state">${st.txt}</span></div>
      <div class="is-body">
        <div class="is-row">🧰 <span>${is.eq}</span></div>
        <div class="is-row">👤 Técnico: <b>${is.tech}</b></div>
        <div class="is-row">📋 ${is.order ? `${is.order} · ${is.veh}` : "Sin orden asignada"}</div>
        <div class="is-row">🔄 Etapa: ${is.stage} · Ingreso: ${is.tin} · Est.: ${is.eta}</div>
        <div class="is-row">📷 Evidencias pendientes: <b>${is.evp}</b> · Siguiente: ${is.next}</div>
        ${idle ? '<div class="is-flag warn">⚠ Tiempo ocioso: hay cola por asignar</div>' : ""}
        ${blockedIs ? '<div class="is-flag block">⛔ Bloqueada: no depende del técnico</div>' : ""}
      </div>
      <div class="is-actions">
        <select data-act="state" data-id="${is.id}">${Object.entries(ISLAND_STATES).map(([k, v]) => `<option value="${k}" ${k === is.state ? "selected" : ""}>${v.txt}</option>`).join("")}</select>
        <select data-act="tech" data-id="${is.id}">${TECHS.map(t => `<option ${t === is.tech ? "selected" : ""}>${t}</option>`).join("")}</select>
        ${is.state === "disponible" && queue.length ? `<button class="btn btn-mini" data-act="assign" data-id="${is.id}">Asignar de la cola</button>` : ""}
        ${(is.state === "lista_entrega" || is.state === "ocupada" || is.state === "en_pruebas") && is.order ? `<button class="btn btn-mini" data-act="release" data-id="${is.id}">Liberar isla</button>` : ""}
        ${is.shared ? `<button class="btn btn-mini" data-act="reserve" data-id="${is.id}">Reservar</button>` : ""}
      </div>
    </div>`;
  }).join("");

  $("queueList").innerHTML = queue.length
    ? queue.map(q => `<div class="alert-item">${q.txt}</div>`).join("")
    : "<small>Cola vacía: todas las órdenes están asignadas.</small>";

  $("sharedReq").innerHTML = sharedRequest.open ? `
    <div class="alert-item"><b>${sharedRequest.who}</b><br>${sharedRequest.what}<br><small>${sharedRequest.order}</small><br><small>${sharedRequest.cond}</small></div>
    <div class="is-actions">
      <button class="btn btn-mini ok" id="shApprove">✔ Aprobar</button>
      <button class="btn btn-mini bad" id="shReject">✖ Rechazar</button>
    </div>
    <p class="disclaim">El uso compartido no elimina los controles: evidencia, presupuesto, autorización y garantía aplican igual. (Demo: sin pagos ni renta real.)</p>`
    : `<div class="alert-item">Sin solicitudes pendientes.</div><p class="disclaim">Las reservas aprobadas registran horario, responsable, orden y condiciones en la trazabilidad.</p>`;

  $("shApprove")?.addEventListener("click", () => {
    sharedRequest.open = false;
    const is = islands.find(i => i.shared);
    Object.assign(is, { state: "reservada", tech: "C. Vega (externo)", order: "MI-0033", veh: "Kia Rio 2017", stage: "Reserva jueves 10:00–14:00", tin: "jue 10:00", eta: "4 h", next: "Check-in con evidencia al ingresar" });
    logIsland("✔ Reserva de isla compartida APROBADA: C. Vega · MI-0033 · jue 10:00–14:00 · condiciones registradas en trazabilidad.");
    renderIslands();
  });
  $("shReject")?.addEventListener("click", () => {
    sharedRequest.open = false;
    logIsland("✖ Solicitud de isla compartida RECHAZADA por el responsable del taller (queda registrada con motivo).");
    renderIslands();
  });

  $("islandsGrid").querySelectorAll("[data-act]").forEach(el => {
    const is = islands.find(i => i.id == el.dataset.id);
    if (el.dataset.act === "state") el.addEventListener("change", () => {
      const prev = ISLAND_STATES[is.state].txt;
      is.state = el.value;
      logIsland(`${is.name}: estado ${prev} → ${ISLAND_STATES[is.state].txt}${is.order ? ` (orden ${is.order})` : ""}.`);
      renderIslands();
    });
    if (el.dataset.act === "tech") el.addEventListener("change", () => {
      is.tech = el.value;
      logIsland(`${is.name}: técnico asignado → ${is.tech}${is.order ? ` (orden ${is.order})` : ""}.`);
      renderIslands();
    });
    if (el.dataset.act === "assign") el.addEventListener("click", () => {
      const q = queue.shift();
      Object.assign(is, { state: "esperando_vehiculo", order: q.id, veh: q.txt.split("·")[1].trim(), stage: "Asignada, esperando unidad", tin: "ahora", eta: "por definir", next: "Documentar recepción al ingresar" });
      logIsland(`${is.name}: orden ${q.id} asignada desde la cola · técnico ${is.tech}.`);
      renderIslands();
    });
    if (el.dataset.act === "release") el.addEventListener("click", () => {
      logIsland(`${is.name}: orden ${is.order} cerrada con reporte final; isla liberada.`);
      Object.assign(is, { state: "disponible", order: null, veh: null, tech: is.shared ? "—" : is.tech, stage: "—", tin: "—", eta: "—", evp: 0, next: "Asignar orden de la cola" });
      renderIslands();
    });
    if (el.dataset.act === "reserve") el.addEventListener("click", () => {
      sharedRequest.open = true;
      logIsland("Nueva solicitud de reserva de isla compartida recibida (demo).");
      renderIslands();
    });
  });
}

/* ============================================================
   9 · VOZ DEL CLIENTE (NPS y calidad-precio)
   ============================================================ */
const npsRow = $("npsRow");
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
  $("npsLabel").textContent = `${v} · ${label}`;
}
selectNps(9);

document.querySelectorAll("#cpStars .slot").forEach(s =>
  s.addEventListener("click", () => {
    document.querySelectorAll("#cpStars .slot").forEach(x => x.classList.remove("active"));
    s.classList.add("active");
  })
);
$("sendSurvey").addEventListener("click", function () {
  this.textContent = "¡Gracias! Evaluación registrada ✓";
  this.disabled = true;
  this.style.opacity = .6;
});

/* ============================================================
   10 · ARRANQUE
   ============================================================ */
renderVehicleSelect();
renderSymptoms();
applyScenario();
renderIslands();
logIsland("Turno iniciado: tablero de islas sincronizado (datos simulados).");
refreshLogout();
