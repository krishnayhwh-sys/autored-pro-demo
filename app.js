/* ============================================================
   AutoRed Pro — Prototipo Fase 1 · Motor de escenarios
   Navegación, escenarios, trazabilidad, islas y acceso demo.
   Sin backend: todos los datos son simulados.
   ============================================================ */

"use strict";
const $ = id => document.getElementById(id);
const fmt = n => "$" + n.toLocaleString("es-MX");

/* ============================================================
   1 · VEHÍCULO ACTIVO
   El catálogo completo (familias por rangos de años, alias,
   prioridad regional) vive en vehicle-catalog.js.
   ============================================================ */
const DEFAULT_VEHICLE = { label: "Nissan Versa 2019", km: "78,500 km", code: "VRS19" };
const RECENT_VEHICLES = [
  { label: "Nissan Versa 2019", km: "78,500 km", code: "VRS19" },
  { label: "Chevrolet Spark 2018", km: "88,400 km", code: "SPK18" }
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
  vehicle: { ...DEFAULT_VEHICLE },
  scenario: SCENARIOS.brakes,
  authorized: false,          // se vuelve true al firmar en s8 (alimenta la puerta "Trabajo")
  kmStatus: "conocido",       // o una razón formal de desconocimiento
  consolidated: false,        // Paso 11: la orden actual ya se consolidó en el expediente
  ext: { status: null, sistema: null, certeza: "cliente" } // intervenciones externas (null = sin responder)
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
/* ---------- Buscador predictivo de vehículos (typeahead) ---------- */
const vehLog = { selections: {}, misses: [], manual: [] };

const norm = s => s.toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[-_.]/g, " ").replace(/\s+/g, " ").trim();

function famYears(f) {
  const [a, b] = f.anios;
  return `${a}–${b || "actual"}`;
}
function famKm(year) {
  const kmN = Math.max(1, 2026 - year) * 14000 + 500;
  return "~" + kmN.toLocaleString("es-MX") + " km";
}
function makeVehicle(fam, year, version) {
  const codeBase = norm(fam.modelo).replace(/[^a-z0-9]/g, "").slice(0, 3).toUpperCase() || "VEH";
  return {
    label: `${fam.marca} ${fam.modelo} ${year}${version ? " " + version : ""}`,
    km: famKm(year), code: `${codeBase}${String(year).slice(-2)}`, fam
  };
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[m][n];
}

function searchCatalog(q) {
  const nq = norm(q);
  if (!nq) return [];
  const scored = [];
  for (const f of VEHICLE_CATALOG) {
    const keys = [norm(f.marca), norm(f.modelo), norm(f.marca + " " + f.modelo), ...f.alias.map(norm)];
    let best = -1;
    for (const k of keys) {
      const pos = k.indexOf(nq);
      if (pos >= 0) { best = pos === 0 ? 0 : 1; break; }
    }
    if (best >= 0) scored.push({ f, s: best * 10 - f.prioridad });
  }
  scored.sort((a, b) => a.s - b.s);
  return scored.slice(0, 8).map(x => x.f);
}
function didYouMean(q) {
  const nq = norm(q);
  if (nq.length < 3) return [];
  const cand = VEHICLE_CATALOG.map(f => {
    const keys = [norm(f.modelo), ...f.alias.map(norm)];
    const d = Math.min(...keys.map(k => levenshtein(nq, k.slice(0, Math.max(nq.length, 3)))));
    return { f, d };
  }).filter(x => x.d <= 2).sort((a, b) => a.d - b.d || b.f.prioridad - a.f.prioridad);
  return cand.slice(0, 3).map(x => x.f);
}

let vsIndex = -1, vsItems = [];
function hlMatch(text, q) {
  const i = norm(text).indexOf(norm(q));
  if (i < 0) return text;
  return text.slice(0, i) + "<b>" + text.slice(i, i + q.length) + "</b>" + text.slice(i + q.length);
}
function renderSuggest(q) {
  const box = $("vehSuggest");
  vsItems = searchCatalog(q);
  vsIndex = -1;
  if (!q.trim()) { box.classList.add("hidden"); return; }
  let html = vsItems.map((f, i) => `
    <div class="vs-item" data-i="${i}">
      <div>${hlMatch(f.marca + " " + f.modelo, q)} <small>${famYears(f)} · ${f.carroceria}${f.estado === "descontinuado" ? " · descontinuado" : ""}${f.validar ? " · ⚠ por validar" : ""}</small></div>
      ${f.prioridad >= 3 ? '<span class="pill ok">frecuente</span>' : ""}
    </div>`).join("");
  if (!vsItems.length) {
    const dym = didYouMean(q);
    vehLog.misses.push(q);
    renderCatalogAdmin();
    html = dym.length
      ? `<div class="vs-empty">Sin resultados para "${q}". ¿Quisiste decir…?</div>` +
        dym.map(f => `<div class="vs-item vs-dym" data-m="${f.marca}" data-mo="${f.modelo}">${f.marca} ${f.modelo} <small>${famYears(f)}</small></div>`).join("")
      : `<div class="vs-empty">Sin resultados para "${q}".</div>`;
  }
  html += `<div class="vs-item vs-manual" id="vsManual">➕ No encuentro mi vehículo (captura manual)</div>`;
  box.innerHTML = html;
  box.classList.remove("hidden");
  box.querySelectorAll(".vs-item[data-i]").forEach(el =>
    el.addEventListener("click", () => pickFamily(vsItems[el.dataset.i])));
  box.querySelectorAll(".vs-dym").forEach(el =>
    el.addEventListener("click", () => {
      const f = VEHICLE_CATALOG.find(x => x.marca === el.dataset.m && x.modelo === el.dataset.mo);
      if (f) pickFamily(f);
    }));
  $("vsManual")?.addEventListener("click", () => {
    box.classList.add("hidden");
    $("vehManualCard").classList.remove("hidden");
    $("vehManualCard").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function pickFamily(fam) {
  $("vehSuggest").classList.add("hidden");
  $("vehSearch").value = `${fam.marca} ${fam.modelo}`;
  const [a, b] = fam.anios;
  const to = b || 2026;
  const years = [];
  for (let y = to; y >= a; y--) years.push(y);
  $("vehPicked").innerHTML = `
    <div class="veh-picked-box">
      <b>${fam.marca} ${fam.modelo}</b> <small>${famYears(fam)} · ${fam.carroceria} · ${fam.categoria}${fam.gen ? " · " + fam.gen : ""}</small>
      <div class="slot-row" style="margin-top:8px">
        <select id="vpYear">${years.map(y => `<option>${y}</option>`).join("")}</select>
        ${fam.versiones.length ? `<select id="vpVer"><option value="">Versión (opcional)</option>${fam.versiones.map(v => `<option>${v}</option>`).join("")}</select>` : ""}
        ${fam.motores.length ? `<select id="vpMot"><option value="">Motor (opcional)</option>${fam.motores.map(m => `<option>${m}</option>`).join("")}</select>` : ""}
        <button class="btn btn-red" id="vpOk">Usar este vehículo ✓</button>
      </div>
    </div>`;
  $("vpOk").addEventListener("click", () => {
    const year = parseInt($("vpYear").value, 10);
    const ver = $("vpVer") ? $("vpVer").value : "";
    state.vehicle = makeVehicle(fam, year, ver);
    vehLog.selections[`${fam.marca} ${fam.modelo}`] = (vehLog.selections[`${fam.marca} ${fam.modelo}`] || 0) + 1;
    $("vehKm").value = state.vehicle.km;
    $("vehPicked").innerHTML = `<div class="veh-picked-box ok">✔ <b>${state.vehicle.label}</b> seleccionado — se conserva durante todo el flujo. <button class="btn btn-mini" id="vpChange">Cambiar vehículo</button></div>`;
    $("vpChange").addEventListener("click", () => { $("vehSearch").value = ""; $("vehSearch").focus(); renderRecents(); });
    renderCatalogAdmin();
    applyScenario();
  });
}

function renderRecents() {
  $("vehPicked").innerHTML = `
    <div class="veh-picked-box"><small>Vehículos recientes del cliente:</small>
      <div class="slot-row" style="margin-top:6px">
        ${RECENT_VEHICLES.map((v, i) => `<button class="slot" data-r="${i}">🚗 ${v.label}</button>`).join("")}
      </div>
    </div>`;
  $("vehPicked").querySelectorAll("[data-r]").forEach(b => b.addEventListener("click", () => {
    state.vehicle = { ...RECENT_VEHICLES[b.dataset.r] };
    $("vehKm").value = state.vehicle.km;
    $("vehSearch").value = state.vehicle.label;
    $("vehPicked").innerHTML = `<div class="veh-picked-box ok">✔ <b>${state.vehicle.label}</b> seleccionado.</div>`;
    applyScenario();
  }));
}

function initVehicleSearch() {
  const inp = $("vehSearch");
  inp.value = state.vehicle.label;
  $("vehKm").value = state.vehicle.km;
  renderRecents();
  inp.addEventListener("input", () => renderSuggest(inp.value));
  inp.addEventListener("focus", () => { if (inp.value === state.vehicle.label) { inp.value = ""; renderRecents(); } });
  inp.addEventListener("keydown", e => {
    const box = $("vehSuggest");
    const items = box.querySelectorAll(".vs-item[data-i]");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      vsIndex = e.key === "ArrowDown" ? (vsIndex + 1) % items.length : (vsIndex - 1 + items.length) % items.length;
      items.forEach((el, i) => el.classList.toggle("sel", i === vsIndex));
    } else if (e.key === "Enter" && vsIndex >= 0 && vsItems[vsIndex]) {
      e.preventDefault(); pickFamily(vsItems[vsIndex]);
    } else if (e.key === "Escape") {
      box.classList.add("hidden");
    }
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".veh-wrap")) $("vehSuggest").classList.add("hidden");
  });
  $("vehKm").addEventListener("input", () => { state.vehicle.km = $("vehKm").value || "—"; });
  $("vmSave").addEventListener("click", () => {
    const marca = $("vmMarca").value.trim(), modelo = $("vmModelo").value.trim(), anio = $("vmAnio").value.trim();
    if (!marca || !modelo || !anio) {
      $("vehManualCard").querySelector(".disclaim").innerHTML =
        "⚠ Para la captura manual se necesitan al menos <b>marca, modelo y año</b> (versión y motor son opcionales).";
      return;
    }
    const cap = { marca, modelo, anio, version: $("vmVersion").value.trim(), motor: $("vmMotor").value.trim() };
    vehLog.manual.push(cap);
    state.vehicle = {
      label: `${marca} ${modelo} ${anio}`, km: famKm(parseInt(anio, 10) || 2015),
      code: "MAN" + String(vehLog.manual.length).padStart(2, "0"), manual: true
    };
    $("vehKm").value = state.vehicle.km;
    $("vehSearch").value = state.vehicle.label;
    $("vehManualCard").classList.add("hidden");
    $("vehPicked").innerHTML = `<div class="veh-picked-box ok">✔ <b>${state.vehicle.label}</b> — <span class="tag tag-pen">Captura manual pendiente de normalizar</span> (no bloquea el servicio).</div>`;
    renderCatalogAdmin();
    applyScenario();
  });
}

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

  /* nueva iteración: expediente, intervenciones, puertas, consolidación */
  state.consolidated = false;
  $("consolidateDone").classList.add("hidden");
  $("consolidateBtn").disabled = false;
  renderExt();
  renderConsolidate();
  renderDossier();
  renderGates();

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
function markSigned() {
  signZone.classList.add("signed");
  $("signText").textContent = "Carlos Mendoza";
  state.authorized = true;      // abre la puerta de calidad "Trabajo"
  renderGates();
}
signZone.addEventListener("click", markSigned);
$("authorizeBtn").addEventListener("click", e => {
  if (!signZone.classList.contains("signed")) {
    e.stopImmediatePropagation();
    markSigned();
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
/* La encuesta superior es una ENTRADA REAL del motor de riesgos:
   construye un feedback, llama a evaluateCustomerFeedback() (la
   única función; sin motores paralelos) y crea/actualiza el caso
   estable "demo-survey-current" en FEEDBACK_CASES. */
const SURVEY_CASE_ID = "demo-survey-current";
const surveyState = { presupuesto: "coincide", cp: 4, nps: 9, incidents: new Set(), comment: "" };

/* incidencia → bandera del motor (null = solo revela comentario) */
const SV_INCIDENTS = [
  ["none", "No hubo inconvenientes", null],
  ["retraso", "Retraso", "retraso"],
  ["comunicacion", "Falta de comunicación", "faltaComunicacion"],
  ["noauth", "Trabajo o cobro no autorizado", "noAutorizado"],
  ["repite", "La misma falla volvió a presentarse", "fallaRepetida"],
  ["evidencia", "No recibí la evidencia prometida", "evidenciaNoEntregada"],
  ["garantia", "Problema relacionado con garantía", "problemaGarantia"],
  ["peor", "El vehículo quedó peor", "condicionPeor"],
  ["inseguro", "Sentí que el vehículo no era seguro", "inseguro"],
  ["otro", "Otro", null]
];

const npsRow = $("npsRow");
for (let i = 0; i <= 10; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.addEventListener("click", () => selectNps(i));
  npsRow.appendChild(btn);
}
function selectNps(v) {
  surveyState.nps = v;
  npsRow.querySelectorAll("button").forEach((b, i) => {
    b.className = "";
    if (i === v) b.classList.add("sel", v >= 9 ? "hi" : v <= 6 ? "lo" : "mid");
  });
  /* vista del cliente: sin siglas ni jerga interna */
  $("npsLabel").textContent = `${v}/10 · ${v >= 9 ? "¡Nos alegra!" : v >= 7 ? "Gracias por tu respuesta" : "Tomamos nota para mejorar"}`;
  svReveal();
}
selectNps(9);

document.querySelectorAll("#cpStars .slot").forEach((s, i) =>
  s.addEventListener("click", () => {
    document.querySelectorAll("#cpStars .slot").forEach(x => x.classList.remove("active"));
    s.classList.add("active");
    surveyState.cp = i + 1;
    svReveal();
  })
);
$("svBudget").querySelectorAll(".slot").forEach(s =>
  s.addEventListener("click", () => {
    $("svBudget").querySelectorAll(".slot").forEach(x => x.classList.remove("active"));
    s.classList.add("active");
    surveyState.presupuesto = s.dataset.v;
    svReveal();
  })
);

$("svIncidents").innerHTML = SV_INCIDENTS.map(([k, label]) =>
  `<label class="sv-inc"><input type="checkbox" data-k="${k}" ${k === "none" ? "checked" : ""}> ${label}</label>`).join("");
surveyState.incidents.add("none");
$("svIncidents").querySelectorAll("input").forEach(chk =>
  chk.addEventListener("change", () => {
    const k = chk.dataset.k;
    if (k === "none" && chk.checked) {
      surveyState.incidents.clear(); surveyState.incidents.add("none");
      $("svIncidents").querySelectorAll("input").forEach(c => { if (c.dataset.k !== "none") c.checked = false; });
    } else if (chk.checked) {
      surveyState.incidents.delete("none"); surveyState.incidents.add(k);
      $("svIncidents").querySelector('input[data-k="none"]').checked = false;
    } else surveyState.incidents.delete(k);
    svReveal();
  })
);
$("svComment").addEventListener("input", () => surveyState.comment = $("svComment").value);
$("svAddComment").addEventListener("click", () => { $("svMore").classList.remove("hidden"); $("svAddComment").classList.add("hidden"); });

/* revelado progresivo: lo positivo se queda corto; lo negativo pide detalle */
function svNegative() {
  const inc = [...surveyState.incidents].filter(k => k !== "none");
  return surveyState.cp <= 3 || surveyState.nps <= 6 || surveyState.presupuesto !== "coincide" || inc.length > 0;
}
function svReveal() {
  if (svNegative()) { $("svMore").classList.remove("hidden"); $("svAddComment").classList.add("hidden"); }
  else if ($("svMore").classList.contains("hidden")) $("svAddComment").classList.remove("hidden");
}
svReveal();

function buildSurveyFb() {
  const fb = { presupuesto: surveyState.presupuesto, cp: surveyState.cp, nps: surveyState.nps, comment: surveyState.comment };
  SV_INCIDENTS.forEach(([k, , flag]) => { if (flag && surveyState.incidents.has(k)) fb[flag] = true; });
  return fb;
}

function svLock(locked) {
  $("surveyCard").classList.toggle("survey-locked", locked);
  $("sendSurvey").classList.toggle("hidden", locked);
  $("svResult").classList.toggle("hidden", !locked);
}

$("sendSurvey").addEventListener("click", () => {
  const fb = buildSurveyFb();
  const res = evaluateCustomerFeedback(fb);   // el MISMO motor que la bandeja y el laboratorio
  const cs = {
    id: SURVEY_CASE_ID, orden: "OT-2026-0512", taller: WS[state.scenario.main].name,
    cliente: "C. Mendoza (demo)", veh: state.vehicle.label, sistema: state.scenario.system,
    fb, auto: res, estado: "Pendiente de revisión humana"
  };
  const idx = FEEDBACK_CASES.findIndex(c => c.id === SURVEY_CASE_ID);
  if (idx >= 0) FEEDBACK_CASES[idx] = cs; else FEEDBACK_CASES.push(cs);   // actualiza, nunca duplica
  renderFeedback();
  const positive = ["felicitacion", "sugerencia"].includes(res.category);
  /* vista del cliente: sin etiquetas internas de riesgo */
  $("svResult").innerHTML = `
    <div class="notice">${positive
      ? "🎉 <b>¡Gracias! Tu evaluación fue registrada.</b>"
      : "🤝 <b>Gracias. Recibimos tu reporte y será revisado por el equipo de calidad de AutoRed Pro.</b>"}</div>
    <div class="slot-row">
      <button class="slot" id="svEdit">✏️ Editar evaluación</button>
      <button class="slot" id="svNew">🔄 Probar otro caso</button>
      <button class="slot" id="svInternal">🔍 Ver clasificación interna — solo demo</button>
    </div>
    <p class="disclaim">Controles disponibles únicamente para probar el prototipo.</p>`;
  svLock(true);
  $("svEdit").addEventListener("click", () => svLock(false));   // conserva respuestas; reenvío actualiza el mismo caso
  $("svNew").addEventListener("click", () => {
    const i = FEEDBACK_CASES.findIndex(c => c.id === SURVEY_CASE_ID);
    if (i >= 0) FEEDBACK_CASES.splice(i, 1);                    // solo el caso de prueba; semillas intactas
    renderFeedback();
    svResetControls();
    svLock(false);
  });
  $("svInternal").addEventListener("click", () => {
    const el = $("fbcase-" + SURVEY_CASE_ID);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.querySelector(".fb-reasons")?.classList.remove("hidden");
      el.classList.add("fix-highlight");
      setTimeout(() => el.classList.remove("fix-highlight"), 3200);
    }
  });
});

function svResetControls() {
  surveyState.presupuesto = "coincide"; surveyState.cp = 4; surveyState.comment = "";
  surveyState.incidents.clear(); surveyState.incidents.add("none");
  $("svBudget").querySelectorAll(".slot").forEach(s => s.classList.toggle("active", s.dataset.v === "coincide"));
  document.querySelectorAll("#cpStars .slot").forEach((s, i) => s.classList.toggle("active", i === 3));
  $("svIncidents").querySelectorAll("input").forEach(c => c.checked = c.dataset.k === "none");
  $("svComment").value = "";
  $("svMore").classList.add("hidden");
  selectNps(9);
}

/* ============================================================
   10 · INTERVENCIONES EXTERNAS (recepción / diagnóstico / garantía)
   Distingue: sí / no / desconoce / no respondió / no recuerda /
   no fue posible entrevistar. Una ausencia de información nunca
   se convierte en una afirmación.
   ============================================================ */
const EXT_STATUS = {
  si:              { txt: "Sí" },
  no:              { txt: "No" },
  desconoce:       { txt: "El cliente lo desconoce" },
  no_respondio:    { txt: "El cliente no respondió" },
  no_recuerda:     { txt: "El cliente indicó que no recuerda" },
  no_entrevistado: { txt: "No fue posible entrevistar al cliente" }
};
const CERTEZA = {
  confirmado:  "Confirmado con documento o evidencia",
  cliente:     "Declarado por el cliente",
  tercero:     "Declarado por un tercero",
  parcial:     "Parcialmente conocido",
  desconocido: "Desconocido"
};
/* Preguntas específicas por escenario */
const EXT_ASK = {
  brakes: "Preguntar en específico por: rectificación de discos, cambio de balatas, líquido de frenos o intervención externa al ABS.",
  overheating: "Preguntar en específico por: cambio de radiador, termostato, bomba de agua, anticongelante o reparación de culata.",
  electrical_no_start: "Preguntar en específico por: cambio de batería, alternador, marcha, alarmas, estéreo o instalaciones eléctricas externas.",
  suspension: "Preguntar en específico por: amortiguadores, rótulas, alineación, cambio de llantas o golpes/impactos recientes.",
  transmission: "Preguntar en específico por: cambio de aceite de caja, clutch, reparación de transmisión o reprogramaciones.",
  maintenance: "Preguntar en específico por: últimos servicios de aceite, afinaciones o mantenimientos hechos fuera de la red.",
  ac: "Preguntar en específico por: recargas de gas, cambio de compresor, reparación de fugas o modificaciones al sistema.",
  engine_check: "Preguntar en específico por: afinaciones, cambio de sensores, reprogramaciones, reparación interna de motor o borrado de códigos."
};

function renderExt() {
  $("extOptions").innerHTML = Object.entries(EXT_STATUS).map(([k, v]) =>
    `<button class="slot ${state.ext.status === k ? "active" : ""}" data-ext="${k}">${v.txt}</button>`).join("");
  $("extOptions").querySelectorAll("[data-ext]").forEach(b => b.addEventListener("click", () => {
    state.ext.status = b.dataset.ext;
    renderExt(); renderGates(); renderDossier(); renderConsolidate();
  }));
  $("extAskHint").textContent = EXT_ASK[state.scenario.id];
  $("extForm").classList.toggle("hidden", state.ext.status !== "si");
  $("extGateNote").textContent = state.ext.status === null
    ? "⚠ Esta pregunta es una puerta de calidad: la recepción no puede cerrarse sin responderla (ver Control de integridad)."
    : "";
  const sis = $("extSistema"), cer = $("extCerteza");
  if (sis && !sis.dataset.bound) {
    sis.dataset.bound = "1";
    sis.addEventListener("change", () => { state.ext.sistema = sis.value; renderDossier(); });
    cer.addEventListener("change", () => { state.ext.certeza = cer.value; renderDossier(); });
  }
  state.ext.sistema = sis ? sis.value : null;
}

/* ============================================================
   11 · EXPEDIENTE TÉCNICO DEL VEHÍCULO (permanente)
   ============================================================ */
const TAG = {
  arp: '<span class="tag tag-arp">AutoRed Pro</span>',
  ext: '<span class="tag tag-ext">Externa declarada</span>',
  cli: '<span class="tag tag-cli">Dato del cliente</span>',
  ver: '<span class="tag tag-ver">Verificado con evidencia</span>',
  unk: '<span class="tag tag-unk">Desconocido</span>',
  pen: '<span class="tag tag-pen">Pendiente de confirmar</span>'
};

function dossierSeed(veh, sc) {
  /* eventos permanentes previos (simulados) del vehículo */
  return [
    {
      when: "2025 · nov (fecha exacta)", origin: "arp", sys: "Mantenimiento",
      desc: "Afinación mayor y cambio de aceite", who: "MecaExpress · técnico C. Ortega",
      ev: "Evidencia completa (9 archivos)", cert: "ver", order: "ARP-000087",
      warr: "Garantía 3 meses · vencida sin reclamos", obs: "Kilometraje verificado en tablero."
    },
    {
      when: "2026 · feb (aproximada)", origin: "ext", sys: sc.system,
      desc: "El cliente declara una revisión externa relacionada con el mismo sistema de la falla actual",
      who: "Taller no identificado", ev: "Sin evidencia documental", cert: "cli", order: "—",
      warr: "Posible efecto sobre garantías: requiere evaluación técnica si hay reclamación",
      obs: "Información proporcionada por el cliente; no verificada."
    }
  ];
}

function currentOrderEvent(veh, sc) {
  return {
    when: "Hoy", origin: "arp", sys: sc.system,
    desc: sc.report.works, who: `${WS[sc.main].name} · ${sc.report.tech}`,
    ev: `Evidencia completa (${sc.reception.length + sc.ba.length} archivos) · Isla de trabajo registrada`,
    cert: "ver", order: "ARP-000124 (OT-2026-0512)",
    warr: `Garantía ${sc.warranty.big} / ${sc.warranty.alt}`,
    obs: state.consolidated ? "Consolidado en el expediente al cierre de la orden." : "Orden activa: se consolidará al cierre (Paso 11)."
  };
}

function lifeEventHtml(e) {
  return `
  <div class="life-ev ${e.origin === "ext" ? "life-ext" : "life-arp"}">
    <div class="life-when">${e.when}</div>
    <div class="life-body">
      <div class="life-top">${e.origin === "ext" ? TAG.ext : TAG.arp} ${TAG[e.cert] || ""} <b>${e.sys}</b></div>
      <div class="life-desc">${e.desc}</div>
      <div class="tr-meta">Responsable: ${e.who} · Evidencia: ${e.ev} · Orden: ${e.order}</div>
      <div class="tr-meta">Garantías: ${e.warr}</div>
      ${e.obs ? `<div class="tr-obs soft">${e.obs}</div>` : ""}
    </div>
  </div>`;
}

function renderDossier() {
  const veh = state.vehicle, sc = state.scenario, w = WS[sc.main];
  const extDeclared = state.ext.status === "si";

  $("dsFolio").textContent = `ARP-VEH-${veh.code}`;
  $("dsSub").innerHTML = `${veh.label} · Propietario: Carlos Mendoza · Cada vehículo tiene un expediente independiente y permanente.`;
  $("dsKpis").innerHTML = `
    <div class="kpi"><b>3</b><span>servicios AutoRed</span></div>
    <div class="kpi"><b>${extDeclared ? 2 : 1}</b><span>externas declaradas</span></div>
    <div class="kpi"><b>75%</b><span>historial conocido</span></div>`;

  $("dsIdent").innerHTML = [
    ["Propietario / usuario", `Carlos Mendoza ${TAG.ver}`],
    ["Vehículo", `${veh.label} · versión Sense (demo)`],
    ["Placas", `XWA-124-B ${TAG.ver}`],
    ["VIN (demostrativo)", `3N1-DEMO-${veh.code}-2026 ${TAG.pen}`],
    ["Kilometraje actual", state.kmStatus === "conocido" ? `${veh.km} ${TAG.ver}` : `${TAG.unk} <small>(${state.kmStatus})</small>`],
    ["Fecha de alta en AutoRed", "12 / nov / 2025"],
    ["Taller habitual", `${w.name}`],
    ["Servicios en la red", "3 (incluida la orden actual)"]
  ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");

  /* indicadores de continuidad (demostrativos, no financieros, sin juicios) */
  $("dsIndicators").innerHTML = [
    "🔧 Servicios dentro de AutoRed: <b>3</b>",
    `🏪 Servicios externos declarados: <b>${extDeclared ? "2" : "1"}</b>`,
    "📖 Porcentaje del historial conocido: <b>75%</b>",
    "✅ Recomendaciones cumplidas: <b>2 de 4</b>",
    "📌 Recomendaciones pendientes: <b>2</b>",
    "🔁 Reincidencias en el mismo sistema: <b>1 (a revisar)</b>",
    "🛡️ Garantías atendidas: <b>1 de 1</b>",
    "⏱ Tiempo desde el último servicio: <b>4 meses</b>",
    "↩️ Retorno del cliente a la red: <b>Sí</b>",
    `⚙️ Sistema intervenido repetidamente: <b>${sc.system}</b>`,
    "⭐ Calidad percibida (promedio): <b>4.6 / 5</b>",
    "🤝 Probabilidad cualitativa de continuidad: <b>Alta</b>"
  ].map(t => `<li>${t}</li>`).join("");

  /* línea de vida */
  const events = [...dossierSeed(veh, sc), currentOrderEvent(veh, sc)];
  $("lifeline").innerHTML = events.map(lifeEventHtml).join("");

  /* recomendaciones pendientes */
  $("dsRecs").innerHTML = [
    `📌 ${sc.report.rec} <small>(orden actual)</small> ${TAG.arp}`,
    "📌 Rotación de llantas y revisión de presiones — sugerida hace 4 meses " + TAG.arp,
    `🗓 Próximo mantenimiento estimado: 10,000 km ${TAG.pen}`
  ].map(t => `<li>${t}</li>`).join("");

  /* garantías */
  $("dsWarr").innerHTML = `
    <div class="hist-item"><b>Activa</b> ${sc.warranty.big} / ${sc.warranty.alt} · ${sc.specialty} · ${w.name} · cert. ${sc.warranty.folio.split(" ")[0]}</div>
    <div class="hist-item"><b>Histórica</b> Afinación (3 meses) · vencida sin reclamos</div>
    <div class="hist-item"><b>Reaperturas</b> Ninguna registrada para este vehículo</div>`;

  renderWarrEval();
  renderClientCard();
}

/* ---------- Reapertura por garantía con intervención externa ---------- */
const WARR_STATES = {
  sin_ext:       "Sin intervención externa declarada",
  no_rel:        "Intervención externa no relacionada",
  posible:       "Posiblemente relacionada; requiere evaluación",
  mismo:         "Mismo sistema intervenido; requiere dictamen",
  insuficiente:  "Información insuficiente",
  revision:      "Garantía en revisión"
};
function suggestedWarrState() {
  const s = state.ext.status;
  if (s === null || s === "no") return "sin_ext";
  if (s === "si") return (state.ext.sistema || "").startsWith("El mismo") ? "mismo" : "posible";
  return "insuficiente"; // desconoce / no respondió / no recuerda / no entrevistado
}
function renderWarrEval() {
  const yes = state.ext.status === "si";
  const unk = ["desconoce", "no_respondio", "no_recuerda", "no_entrevistado"].includes(state.ext.status);
  const mark = v => v === true ? '<span class="pill ok">Sí</span>' : v === false ? '<span class="pill bad">No</span>' : '<span class="pill warn">Se desconoce</span>';
  $("warrQuestions").innerHTML = [
    ["¿La intervención fue posterior al servicio garantizado?", yes ? true : unk ? undefined : false],
    ["¿Se trabajó el mismo sistema?", yes ? (state.ext.sistema || "").startsWith("El mismo") : unk ? undefined : false],
    ["¿Se alteraron piezas instaladas por AutoRed?", yes ? undefined : unk ? undefined : false],
    ["¿Existe evidencia de la intervención?", yes ? false : undefined],
    ["¿Puede afectar la evaluación de la garantía?", yes ? undefined : unk ? undefined : false],
    ["¿Se requiere revisión técnica antes de decidir?", yes || unk ? true : false]
  ].map(q => `<li>${q[0]} ${mark(q[1])}</li>`).join("");

  const sel = $("warrState");
  const suggested = suggestedWarrState();
  sel.innerHTML = Object.entries(WARR_STATES).map(([k, v]) =>
    `<option value="${k}" ${k === suggested ? "selected" : ""}>${v}</option>`).join("");
  if (!sel.dataset.bound) {
    sel.dataset.bound = "1";
    sel.addEventListener("change", () => {
      $("warrStateNote").textContent = "Estado registrado por el evaluador. Ningún estado cancela la garantía en automático.";
    });
  }
  $("warrStateNote").innerHTML = `Estado sugerido según lo declarado en recepción: <b>${WARR_STATES[suggested]}</b>. El dictamen final requiere revisión técnica.`;
}

/* ---------- Cliente y fidelización ---------- */
function renderClientCard() {
  $("dsClient").innerHTML = [
    ["Cliente", "Carlos Mendoza"],
    ["Contacto preferido", "WhatsApp · tardes"],
    ["Taller preferido", WS[state.scenario.main].name],
    ["Citas cumplidas / canceladas", "5 / 1"],
    ["Evaluaciones promedio", "4.6 / 5"],
    ["Nivel de continuidad", "Alta — cliente recurrente"]
  ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
  $("dsClientVeh").innerHTML = [
    `🚗 <b>${state.vehicle.label}</b> — este expediente · 3 servicios`,
    "🚗 <b>Chevrolet Spark 2018</b> — expediente ARP-VEH-SPK18 · 1 servicio",
    "💬 <i>El registro de servicios externos no penaliza al cliente: sirve para conservar la continuidad técnica del vehículo.</i>"
  ].map(t => `<li>${t}</li>`).join("");
}

/* ============================================================
   12 · PUERTAS DE CONTROL DE CALIDAD (s17)
   ok = completo · just = pendiente justificado (razón formal)
   pend = falta (bloquea) · na = no aplica
   ============================================================ */
const KM_REASONS = ["conocido", "Se desconoce — odómetro ilegible", "Cliente no respondió", "Cliente no recuerda", "Pendiente de confirmar"];

const EXT_JUSTIFIED = ["desconoce", "no_respondio", "no_recuerda", "no_entrevistado"];

function gateData() {
  const sc = state.scenario;
  const extSt = state.ext.status;
  const extJust = EXT_JUSTIFIED.includes(extSt);
  const kmOk = state.kmStatus === "conocido";
  const stages = [];

  stages.push({
    name: "1 · Recepción", resp: "Recepcionista",
    fields: [
      { l: "Identificación del vehículo", st: "ok" },
      { l: "Kilometraje", st: kmOk ? "ok" : "just", note: kmOk ? state.vehicle.km : state.kmStatus, km: true },
      { l: "Combustible aproximado", st: "ok", note: "3/4 de tanque" },
      { l: "Fotografías mínimas (4)", st: "ok" },
      { l: "Daños visibles registrados", st: "ok", note: "rayón puerta trasera (previo)" },
      { l: "Objetos entregados", st: "ok", note: "llave + tarjeta de circulación" },
      { l: "Síntoma expresado por el cliente", st: "ok", note: sc.sym },
      { l: "Intervenciones externas",
        st: extSt === null ? "pend" : (extJust ? "just" : "ok"),
        note: extSt === null ? "sin responder"
          : extJust ? `Completo con dato desconocido justificado — "${EXT_STATUS[extSt].txt}" (no equivale a "No hubo")`
          : extSt === "si" ? "Sí — declarada; formulario capturado con nivel de certeza"
          : "No — respuesta afirmativa del cliente",
        fix: { screen: "s6", target: "extOptions",
          reason: "La recepción no puede cerrarse sin registrar si hubo intervenciones externas. Elige una de las 6 opciones formales: una ausencia de respuesta nunca se convierte en 'No hubo'." } },
      { l: "Responsable de recepción", st: "ok", note: "L. Torres" },
      { l: "Aceptación / firma demostrativa", st: "ok" }
    ],
    blockMsg: "No puedes cerrar la recepción porque falta registrar si hubo intervenciones externas (pregunta obligatoria en la pantalla de solicitud)."
  });

  stages.push({
    name: "2 · Diagnóstico", resp: sc.report.tech.split("·")[0].trim(),
    fields: [
      { l: "Técnico responsable", st: "ok" },
      { l: "Sistema revisado", st: "ok", note: sc.system },
      { l: "Pruebas realizadas", st: "ok", note: sc.qa[0] },
      { l: "Resultados registrados", st: "ok" },
      { l: "Evidencia del diagnóstico", st: "ok", note: `${sc.reception.length} archivos` },
      { l: "Posibles causas ≠ diagnóstico confirmado", st: "ok", note: "separados en pantalla" },
      { l: "Riesgos de seguridad", st: "ok", note: sc.urgency.txt.split("—")[0] },
      { l: "Recomendación", st: "ok" },
      { l: "¿Puede circular?", st: "ok", note: sc.urgency.lvl === "critica" ? "No — riesgo de daño mayor" : "Sí, con precaución" },
      { l: "Información técnica pendiente", st: "just", note: "Se desconoce historial de refacciones previas — registrado formalmente" }
    ]
  });

  stages.push({
    name: "3 · Presupuesto", resp: "Responsable del taller",
    fields: [
      { l: "Diagnóstico relacionado", st: "ok", note: "hallazgos ligados" },
      { l: "Partidas", st: "ok", note: `${sc.quote.items.length} partidas` },
      { l: "Refacciones", st: "ok" },
      { l: "Mano de obra", st: "ok" },
      { l: "Tratamiento fiscal", st: "just", note: "Precios demostrativos — aclaración registrada" },
      { l: "Tiempo estimado", st: "ok" },
      { l: "Garantía propuesta", st: "ok", note: `${sc.warranty.big} / ${sc.warranty.alt}` },
      { l: "Indispensables vs opcionales", st: "ok", note: "marcados por partida" },
      { l: "Autorización requerida", st: "ok", note: "enviado al cliente" }
    ]
  });

  stages.push({
    name: "4 · Trabajo", resp: sc.report.tech.split("·")[0].trim(),
    fields: [
      { l: "Presupuesto vigente y autorizado", st: state.authorized ? "ok" : "pend",
        note: state.authorized ? "firmado" : "sin firma del cliente",
        fix: { screen: "s8", target: "signZone",
          reason: "No puedes iniciar el trabajo porque el presupuesto todavía no ha sido autorizado. Pide al cliente firmar la autorización." } },
      { l: "Partidas autorizadas identificadas", st: state.authorized ? "ok" : "pend",
        fix: { screen: "s8", target: "authItems",
          reason: "Las partidas autorizadas se identifican al registrar la autorización del cliente." } },
      { l: "Responsable asignado", st: "ok" },
      { l: "Isla asignada", st: "ok", note: "Isla 1" },
      { l: "Refacciones disponibles", st: "ok" },
      { l: "Evidencia previa (antes)", st: "ok" },
      { l: "Indicaciones técnicas", st: "ok" }
    ],
    blockMsg: "No puedes iniciar el trabajo porque el presupuesto todavía no ha sido autorizado (firma en la pantalla 8)."
  });

  if (sc.finding) stages.push({
    name: "4b · Hallazgo adicional", resp: "Responsable del taller",
    fields: [
      { l: "Descripción del hallazgo", st: "ok", note: sc.finding.desc.slice(0, 60) + "…" },
      { l: "Evidencia del hallazgo", st: "ok", note: "1 foto" },
      { l: "Impacto explicado", st: "ok" },
      { l: "Nueva partida generada", st: "ok", note: sc.finding.item.c },
      { l: "Costo", st: "ok", note: fmt(sc.finding.item.imp) },
      { l: "Tiempo adicional", st: "ok", note: "+30 min" },
      { l: "Nueva autorización del cliente", st: "ok", note: "registrada 12:02" }
    ]
  });

  stages.push({
    name: "5 · Pruebas de calidad", resp: "Técnico + control de calidad",
    fields: [
      { l: "Prueba definida para el escenario", st: "ok", note: sc.qa[0] },
      { l: "Resultado", st: "ok", note: "aprobada" },
      { l: "Técnico que probó", st: "ok" },
      { l: "Evidencia de la prueba", st: "ok" },
      { l: "Anomalías remanentes", st: "na", note: "No aplica — sin anomalías" },
      { l: "¿Entrega o nueva revisión?", st: "ok", note: "lista para entrega" }
    ]
  });

  stages.push({
    name: "6 · Entrega y cierre", resp: "Responsable del taller",
    fields: [
      { l: "Explicación del trabajo al cliente", st: "ok" },
      { l: "Reporte final", st: "ok" },
      { l: "Evidencia antes/después", st: "ok", note: `${sc.ba.length} comparativas` },
      { l: "Garantía registrada", st: "ok" },
      { l: "Pendientes informados", st: "ok", note: "partidas no autorizadas" },
      { l: "Recomendaciones", st: "ok" },
      { l: "Aceptación del cliente", st: "ok" },
      { l: "Kilometraje actualizado", st: state.kmStatus === "conocido" ? "ok" : "just", note: state.kmStatus === "conocido" ? state.vehicle.km : state.kmStatus },
      { l: "Consolidación del expediente (Paso 11)", st: state.consolidated ? "ok" : "pend",
        note: state.consolidated ? "expediente actualizado" : "pendiente de cerrar la orden",
        fix: { screen: "s10", target: "consolidateBtn",
          reason: "La entrega no puede cerrarse sin la Consolidación del Expediente Técnico: la información validada debe incorporarse al expediente permanente del vehículo." } }
    ],
    blockMsg: "No puedes cerrar la entrega porque falta la Consolidación del Expediente Técnico (Paso 11, al final del reporte)."
  });

  return stages;
}

const GATE_ICON = { ok: "✅", just: "🟨", pend: "⛔", na: "➖" };
function stageStatus(st) {
  const pend = st.fields.filter(f => f.st === "pend").length;
  const just = st.fields.filter(f => f.st === "just").length;
  if (pend) return { pill: '<span class="pill bad">Incompleto — bloqueada</span>', blocked: true };
  if (just) return { pill: '<span class="pill warn">Completa con pendientes justificados</span>', blocked: false };
  return { pill: '<span class="pill ok">Completa</span>', blocked: false };
}

/* ---------- Resolución contextual de campos bloqueantes ---------- */
let gateFixes = [];
function resolveNow(idx) {
  const { fix, label } = gateFixes[idx];
  showScreen(fix.screen);
  $("fixBarField").textContent = "Resolviendo: " + label + " · ";
  $("fixBarReason").textContent = fix.reason;
  $("fixBar").classList.remove("hidden");
  setTimeout(() => {
    const el = $(fix.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("fix-highlight");
      setTimeout(() => el.classList.remove("fix-highlight"), 3200);
    }
  }, 250);
}
$("fixBarBack").addEventListener("click", () => {
  $("fixBar").classList.add("hidden");
  showScreen("s17");
});
$("fixBarClose").addEventListener("click", () => $("fixBar").classList.add("hidden"));

function renderGates() {
  if (!$("gatesList")) return;
  gateFixes = [];
  const stages = gateData();
  const allFields = stages.flatMap(s => s.fields);
  const okN = allFields.filter(f => f.st === "ok" || f.st === "na").length;
  const justN = allFields.filter(f => f.st === "just").length;
  const pendN = allFields.filter(f => f.st === "pend").length;
  const pct = Math.round(((okN + justN) / allFields.length) * 100);

  $("gateKpis").innerHTML = `
    <div class="kpi"><b>${pct}%</b><span>integridad</span></div>
    <div class="kpi"><b>${justN}</b><span>desconocidos justificados</span></div>
    <div class="kpi"><b>${pendN}</b><span>campos bloqueantes</span></div>`;

  /* inconsistencia demostrativa: trabajo en curso sin autorización firmada */
  $("gateInconsistency").innerHTML = !state.authorized
    ? "🚨 <b>Bloqueado por inconsistencia:</b> el trabajo aparece iniciado en el tablero antes de la autorización del cliente. Resuélvelo firmando la autorización (pantalla 8) o pausando la orden."
    : "✅ Sin inconsistencias: la secuencia autorización → trabajo es correcta.";

  $("gatesList").innerHTML = stages.map((st, i) => {
    const s = stageStatus(st);
    const stPct = Math.round((st.fields.filter(f => f.st !== "pend").length / st.fields.length) * 100);
    return `
    <div class="card gate-card ${s.blocked ? "gate-blocked" : ""}">
      <div class="gate-head">
        <b>${st.name}</b> ${s.pill}
        <div class="prog gate-prog"><div class="prog-fill" style="width:${stPct}%"></div></div><small>${stPct}%</small>
      </div>
      <ul class="gate-fields">
        ${st.fields.map(f => {
          let fixBtn = "";
          if (f.st === "pend" && f.fix) {
            gateFixes.push({ fix: f.fix, label: f.l });
            fixBtn = ` <button class="btn btn-mini fix-btn" data-fx="${gateFixes.length - 1}">Resolver ahora →</button>`;
          }
          return `<li>${GATE_ICON[f.st]} ${f.l}${f.note ? ` — <small>${f.note}</small>` : ""}${f.km ? kmSelectHtml() : ""}${fixBtn}</li>`;
        }).join("")}
      </ul>
      <div class="tr-meta">Responsable del registro: ${st.resp} · Siguiente acción: ${s.blocked ? "resolver el campo bloqueante" : "puede avanzar / validar"}</div>
      ${s.blocked && st.blockMsg ? `<div class="gate-msg">⛔ ${st.blockMsg}</div>` : ""}
      <button class="btn btn-mini" data-gate="${i}">Intentar avanzar etapa</button>
      <span class="gate-try" id="gateTry${i}"></span>
    </div>`;
  }).join("");

  $("gatesList").querySelectorAll("[data-fx]").forEach(b =>
    b.addEventListener("click", () => resolveNow(b.dataset.fx)));

  $("gatesList").querySelectorAll("[data-gate]").forEach(b => b.addEventListener("click", () => {
    const st = stages[b.dataset.gate];
    const s = stageStatus(st);
    $("gateTry" + b.dataset.gate).textContent = s.blocked
      ? (st.blockMsg || "No puede avanzar: hay campos indispensables sin resolver.")
      : "✔ Etapa validada: puede avanzar.";
  }));

  const kmSel = $("kmReason");
  if (kmSel) kmSel.addEventListener("change", () => {
    state.kmStatus = kmSel.value;
    renderGates(); renderDossier();
  });
}
function kmSelectHtml() {
  return ` <select id="kmReason" class="km-select">${KM_REASONS.map(r =>
    `<option value="${r}" ${state.kmStatus === r ? "selected" : ""}>${r === "conocido" ? "Conocido (" + state.vehicle.km + ")" : r}</option>`).join("")}</select>`;
}

/* ============================================================
   13 · PASO 11: CONSOLIDACIÓN DEL EXPEDIENTE TÉCNICO
   ============================================================ */
function renderConsolidate() {
  const sc = state.scenario, veh = state.vehicle;
  const rejected = sc.quote.items.filter(i => !i.on).map(i => i.c).join(", ") || "ninguno";
  $("consolidateList").innerHTML = [
    `Orden de servicio y diagnóstico (${sc.quote.folio})`,
    `Trabajos autorizados y ejecutados`,
    `Trabajos rechazados o pospuestos: ${rejected}`,
    `Evidencias (${sc.reception.length + sc.ba.length} archivos con metadatos)`,
    `Refacciones y números de parte demostrativos`,
    `Técnico responsable y taller participante`,
    `Isla de trabajo utilizada (Isla 1)`,
    `Pruebas de calidad y resultados`,
    `Garantía ${sc.warranty.big} / ${sc.warranty.alt}`,
    `Recomendaciones pendientes`,
    `Evaluación del cliente`,
    `Intervenciones externas declaradas en recepción (${state.ext.status ? EXT_STATUS[state.ext.status].txt : "sin responder"})`,
    `Kilometraje ${state.kmStatus === "conocido" ? "actualizado: " + veh.km : "con razón formal: " + state.kmStatus}`
  ].map(t => `<li>📎 ${t}</li>`).join("");

  if (!$("consolidateBtn").dataset.bound) {
    $("consolidateBtn").dataset.bound = "1";
    $("consolidateBtn").addEventListener("click", () => {
      state.consolidated = true;
      $("consolidateDone").classList.remove("hidden");
      $("consolidateBtn").disabled = true;
      renderDossier(); renderGates();
      setTimeout(() => showScreen("s16"), 600);
    });
  }
}

/* ============================================================
   14 · MOTOR DE RIESGOS · VOZ DEL CLIENTE
   evaluateCustomerFeedback(fb) combina señales; nunca condena
   por una sola palabra aislada. La clasificación automática
   orienta la atención; no sustituye la revisión humana.
   ============================================================ */
/* Análisis de comentario con contexto y polaridad básica (sin pretender
   semántica avanzada). La palabra técnica aislada es SOLO señal auxiliar.
   Nota: los comentarios pasan por norm() → los regex van SIN acentos. */
const TECH_RX   = /(frenos?|balatas?|direccion|volante|humo|clutch|embrague|suspension|amortiguador|motor|bateria|transmision)/;
const DANGER_RX = /(sin frenos|se quedo sin frenos|perdi(o)? el control|sin control|accidente|choqu(e|é)|fuego|incendi|se apag(a|o) en marcha|inseguro)/;
const NEGCTX_RX = /(sigue(n)? (fallando|igual|mal)|falla(n|ndo)|se traba|truena|rechina|vibra|ruido raro|no sirve|no funciona|qued(o)? (mal|peor)|peor que|temo|me da miedo|me preocupa|no respond|se solt(o)?|se jala|otra vez|volvi(o)? a)/;
const POSCTX_RX = /(qued(o|aron) (muy |super )?(bien|excelente|perfect)|excelente|perfecto|muy bien|de maravilla|ya no (suena|rechina|falla|sale humo|tiembla|se calienta)|sin problemas?|funciona(n)? (muy )?bien|todo bien)/;
const UNAUTH_RX = /(no (lo |la )?autoric|sin (mi )?autorizaci|no autorizad|cobr\w* .*no (autoric|autorizad))/;
const POSITIVE_RX = /(excelente|perfecto|muy bien|encantad|recomiendo|felicidades|primera vez que)/;
const SUGGEST_RX = /(estaria bien|sugiero|podrian|deberian|seria bueno|propongo)/;

const RISK_META = {
  critico:  { label: "Riesgo crítico", pill: "risk", accion: "Contacto inmediato con el cliente y revisión física del vehículo", prioridad: "Máxima", plazo: "2 horas", resp: "Administrador de la red" },
  alto:     { label: "Riesgo alto", pill: "bad", accion: "Solicitar respuesta del taller y llamar al cliente", prioridad: "Alta", plazo: "24 horas", resp: "Administrador de la red" },
  medio:    { label: "Riesgo medio", pill: "warn", accion: "Seguimiento por el responsable del taller", prioridad: "Media", plazo: "48 horas", resp: "Responsable del taller" },
  queja:    { label: "Queja ordinaria", pill: "warn", accion: "Flujo estándar de atención de quejas", prioridad: "Normal", plazo: "72 horas", resp: "Responsable del taller" },
  sugerencia: { label: "Sugerencia", pill: "sug", accion: "Registrar en backlog de mejora y agradecer", prioridad: "Baja", plazo: "7 días", resp: "Administración / producto" },
  felicitacion: { label: "Felicitación", pill: "fel", accion: "Compartir con el taller y registrar en reputación", prioridad: "Baja", plazo: "—", resp: "Administración" },
  sin_clasificar: { label: "Sin clasificación automática suficiente", pill: "proc", accion: "Revisión manual desde cero", prioridad: "Media", plazo: "24 horas", resp: "Administrador de la red" }
};

function evaluateCustomerFeedback(fb) {
  const c = norm(fb.comment || "");
  const reasons = [];
  let level = null;
  const bump = (lvl, why) => {
    reasons.push(why);
    const order = ["felicitacion", "sugerencia", "queja", "medio", "alto", "critico"];
    if (!level || order.indexOf(lvl) > order.indexOf(level)) level = lvl;
  };

  const hasRatings = fb.cp != null || fb.nps != null;
  const anyFlag = fb.retraso || fb.fallaRepetida || fb.evidenciaNoEntregada || fb.garantiaRechazada ||
    fb.condicionPeor || fb.noAutorizado || fb.faltaComunicacion || fb.problemaGarantia || fb.inseguro;
  if (!hasRatings && !c && !anyFlag) {
    return { ...RISK_META.sin_clasificar, category: "sin_clasificar", reasons: ["No hay calificaciones, comentario ni señales registradas."], manualReview: true };
  }

  /* señales de apoyo (para no condenar por una palabra aislada) */
  const negSupport = (fb.cp != null && fb.cp <= 2) || (fb.nps != null && fb.nps <= 4) ||
    fb.presupuesto === "cambios_sin_explicar" || fb.fallaRepetida || fb.garantiaRechazada ||
    fb.evidenciaNoEntregada || fb.condicionPeor || fb.noAutorizado || fb.problemaGarantia;

  /* --- contexto del comentario (polaridad básica) --- */
  const unauth = UNAUTH_RX.test(c);
  const tech = TECH_RX.test(c);        // palabra técnica presente
  const danger = DANGER_RX.test(c);    // frase de peligro inequívoca
  const posCtx = POSCTX_RX.test(c);    // contexto positivo
  const negCtx = NEGCTX_RX.test(c);    // contexto negativo
  let ambiguousTech = false;

  /* --- críticos (prioridad: incidencias explícitas primero) --- */
  if (fb.noAutorizado) bump("critico", "El cliente marcó la incidencia: trabajo o cobro no autorizado.");
  if (unauth) bump("critico", "El comentario describe un trabajo o cobro no autorizado.");
  if (fb.condicionPeor) bump("critico", "Vehículo entregado en condición aparentemente peor.");

  /* Comentario sobre sistemas técnicos: el contexto decide, nunca la palabra sola. */
  if (danger || (tech && negCtx)) {
    if (negSupport || unauth || fb.inseguro)
      bump("critico", "Comentario negativo sobre un sistema de seguridad (frenos/dirección/humo/control) con señales adicionales.");
    else
      bump("alto", "Comentario negativo sobre un sistema de seguridad: atender y verificar con el cliente.");
  } else if (tech && posCtx) {
    /* mención positiva ("los frenos quedaron muy bien"): no genera riesgo ni revisión por sí sola */
  } else if (tech) {
    ambiguousTech = true;  // señal auxiliar; se resuelve al final si no hay otras señales
  }

  if (fb.inseguro) {
    if (negSupport || unauth || danger || (tech && negCtx))
      bump("critico", "El cliente sintió el vehículo inseguro, con señales negativas adicionales.");
    else
      bump("medio", "El cliente sintió el vehículo inseguro sin otras señales: requiere verificación humana prioritaria.");
  }
  if (fb.garantiaRechazada && fb.fallaRepetida) bump("critico", "Posible alteración grave del proceso de garantía con reincidencia no atendida.");

  /* --- altos --- */
  if (fb.cp != null && fb.cp <= 2) bump("alto", `Calidad-precio muy baja: ${fb.cp}/5.`);
  if (fb.nps != null && fb.nps <= 4) bump("alto", `NPS detractor severo: ${fb.nps}/10.`);
  if (fb.presupuesto === "cambios_sin_explicar") bump("alto", "Presupuesto no coincidente con cambios sin explicación.");
  if (fb.fallaRepetida) bump("alto", "La misma falla se repite (reincidencia sobre la orden o el sistema).");
  if (fb.garantiaRechazada) bump("alto", "Garantía rechazada sin dictamen técnico registrado.");
  if (fb.problemaGarantia) bump("alto", "El cliente reporta un problema relacionado con garantía.");
  if (fb.evidenciaNoEntregada) bump("alto", "La evidencia prometida no fue entregada.");

  /* --- medios --- */
  if (fb.cp === 3) bump("medio", "Calidad-precio neutra (3/5): experiencia mejorable.");
  if (fb.nps != null && fb.nps >= 5 && fb.nps <= 6) bump("medio", `NPS detractor moderado: ${fb.nps}/10.`);
  if (fb.retraso) bump("medio", "Retraso relevante en la entrega.");
  if (fb.faltaComunicacion) bump("medio", "Falta de comunicación reportada por el cliente.");
  if (fb.presupuesto === "cambios_explicados") bump("medio", "Hubo cambios al presupuesto (explicados): revisar comunicación.");

  /* --- mención técnica ambigua sin ninguna otra señal: a revisión humana --- */
  if (!level && ambiguousTech) {
    reasons.push("El comentario menciona un sistema técnico sin contexto suficiente para interpretarlo (ni positivo ni negativo): requiere revisión humana. No se clasifica como riesgo por una palabra aislada.");
    return { ...RISK_META.sin_clasificar, category: "sin_clasificar", reasons, manualReview: true };
  }
  /* si hay otras señales, la mención ambigua queda solo como nota auxiliar */
  if (level && ambiguousTech)
    reasons.push("Nota auxiliar: el comentario menciona un sistema técnico de forma ambigua; verificar en la llamada.");

  /* --- positivos --- */
  if (!level) {
    if (SUGGEST_RX.test(c)) bump("sugerencia", "El comentario contiene una propuesta concreta de mejora sin señales graves.");
    else if (fb.cp === 5 && fb.nps != null && fb.nps >= 9) bump("felicitacion", `Calidad-precio 5/5 y NPS ${fb.nps}/10 sin incidentes.`);
    else if (POSITIVE_RX.test(c) && !negSupport) bump("felicitacion", "Comentario positivo sin señales negativas.");
    else bump("queja", "Señales mixtas o inconformidad general sin patrón de riesgo definido.");
  }

  return { ...RISK_META[level], category: level, reasons, manualReview: true };
}

/* --- bandeja demostrativa (clasificada por el motor) --- */
const FEEDBACK_CASES = [
  { id: "C-121", orden: "OT-0498", taller: "MecaExpress", cliente: "L. Gómez", veh: "Chevrolet Aveo 2020", sistema: "Mantenimiento",
    fb: { presupuesto: "coincide", cp: 3, nps: 6, comment: "Me entregaron 2 horas tarde y nadie avisó.", retraso: true } },
  { id: "C-118", orden: "OT-0471", taller: "AutoServicio Norte", cliente: "R. Peña", veh: "Nissan Tsuru 2015", sistema: "Motor",
    fb: { presupuesto: "cambios_sin_explicar", cp: 2, nps: 3, comment: "Me cobraron un cambio de bujías que nunca autoricé." } },
  { id: "C-124", orden: "—", taller: "—", cliente: "Cliente frecuente", veh: "—", sistema: "—",
    fb: { presupuesto: "coincide", cp: 4, nps: 8, comment: "Estaría bien poder agendar desde el historial del carro." } },
  { id: "C-125", orden: "OT-0512", taller: "Hermanos Ruiz", cliente: "C. Mendoza", veh: "Nissan Versa 2019", sistema: "Frenos",
    fb: { presupuesto: "coincide", cp: 5, nps: 10, comment: "Primera vez que un taller me manda video del problema. Excelente." } }
];

function renderFeedback() {
  if (!$("fbInbox")) return;
  $("fbInbox").innerHTML = FEEDBACK_CASES.map((cs, i) => {
    const r = cs.auto || evaluateCustomerFeedback(cs.fb);
    const isDemo = cs.id === "demo-survey-current";
    return `
    <div class="fb-item ${isDemo ? "fb-demo" : ""}" id="fbcase-${cs.id}">
      <span class="pill ${r.pill}">${r.label.toUpperCase()}</span>
      <div>
        <b>${cs.orden} · ${cs.taller}</b> ${isDemo ? '<span class="pill proc">ENCUESTA DEMO</span>' : ""}
        <p>${cs.fb.comment ? `"${cs.fb.comment}"` : "<i>(sin comentario)</i>"}</p>
        <small>Caso ${cs.id} · ${cs.veh} · auto-clasificado (${r.reasons.length} regla${r.reasons.length > 1 ? "s" : ""}) ·
        ${r.accion} · plazo ${r.plazo} · resp: ${r.resp}${cs.estado ? ` · <b>${cs.estado}</b>` : ""}</small>
        <div class="fb-reasons hidden">${r.reasons.map(x => `<div>• ${x}</div>`).join("")}</div>
        <button class="btn btn-mini" data-fbr="${i}">¿Por qué se clasificó así?</button>
      </div>
    </div>`;
  }).join("");
  $("fbInbox").querySelectorAll("[data-fbr]").forEach(b =>
    b.addEventListener("click", () =>
      b.closest(".fb-item").querySelector(".fb-reasons").classList.toggle("hidden")));
}

/* --- clasificador interactivo + expediente del caso --- */
const clfState = { presupuesto: "coincide", cp: 4, nps: 9, flags: {} };
const caseState = { final: null, resp: "Administrador de la red", estado: "Abierto", solucion: "—", aprendizaje: "—", tResp: "—" };

function renderCaseRecord(r) {
  if (!r) { $("caseRecord").innerHTML = "<h3>Registro del caso</h3><p class='disclaim'>Clasifica un caso para ver su registro completo.</p>"; return; }
  $("caseRecord").innerHTML = `
    <h3>Registro del caso (demo)</h3>
    <table class="kv">
      <tr><td>Orden / cliente</td><td>OT-2026-0512 · Carlos Mendoza</td></tr>
      <tr><td>Vehículo / taller</td><td>${state.vehicle.label} · ${WS[state.scenario.main].name}</td></tr>
      <tr><td>Sistema</td><td>${state.scenario.system}</td></tr>
      <tr><td>Calificaciones</td><td>CP ${clfState.cp ?? "—"}/5 · NPS ${clfState.nps ?? "—"}/10 · presupuesto: ${clfState.presupuesto}</td></tr>
      <tr><td>Reglas activadas</td><td>${r.reasons.length}</td></tr>
      <tr><td>Clasificación automática</td><td>${r.label}</td></tr>
      <tr><td>Clasificación final</td><td>${caseState.final || r.label + " (sin revisar)"}</td></tr>
      <tr><td>Responsable</td><td>${caseState.resp}</td></tr>
      <tr><td>Tiempo de respuesta</td><td>${caseState.tResp}</td></tr>
      <tr><td>Solución</td><td>${caseState.solucion}</td></tr>
      <tr><td>Aprendizaje</td><td>${caseState.aprendizaje}</td></tr>
      <tr><td>Estado</td><td>${caseState.estado}</td></tr>
    </table>
    <div class="clf-actions">
      <button class="btn btn-mini" data-ca="confirmar">✔ Confirmar</button>
      <select id="caReclas" class="km-select"><option value="">Reclasificar…</option>
        ${Object.entries(RISK_META).filter(([k]) => k !== "sin_clasificar").map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("")}</select>
      <button class="btn btn-mini" data-ca="escalar">⚡ Escalar</button>
      <select id="caResp" class="km-select"><option>Administrador de la red</option><option>Responsable del taller</option><option>Certificador</option></select>
      <button class="btn btn-mini" data-ca="respuesta">Solicitar respuesta al taller</button>
      <button class="btn btn-mini ok" data-ca="solucion">Marcar solución</button>
      <button class="btn btn-mini" data-ca="aprendizaje">Registrar aprendizaje</button>
      <button class="btn btn-mini bad" data-ca="cerrar">Cerrar caso</button>
    </div>`;
  $("caseRecord").querySelectorAll("[data-ca]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.ca;
    if (a === "confirmar") { caseState.final = lastResult.label + " (confirmada)"; caseState.tResp = "35 min"; }
    if (a === "escalar") { caseState.resp = "Administrador de la red"; caseState.estado = "Escalado"; }
    if (a === "respuesta") { caseState.estado = "Esperando respuesta del taller (SLA 24 h)"; caseState.tResp = "35 min"; }
    if (a === "solucion") { caseState.solucion = "Acordada con el cliente"; caseState.estado = "En solución"; }
    if (a === "aprendizaje") { caseState.aprendizaje = "Registrado: mejora de comunicación de demoras"; }
    if (a === "cerrar") { caseState.estado = "Cerrado con aprendizaje"; }
    renderCaseRecord(lastResult);
  }));
  $("caReclas")?.addEventListener("change", e => {
    if (e.target.value) { caseState.final = RISK_META[e.target.value].label + " (reclasificación manual)"; renderCaseRecord(lastResult); }
  });
  $("caResp")?.addEventListener("change", e => { caseState.resp = e.target.value; renderCaseRecord(lastResult); });
}

let lastResult = null;
function initClassifier() {
  if (!$("clfNps")) return;
  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      clfState.nps = i;
      $("clfNps").querySelectorAll("button").forEach((b, j) => { b.className = j === i ? "sel " + (i >= 9 ? "hi" : i <= 6 ? "lo" : "mid") : ""; });
    });
    $("clfNps").appendChild(btn);
  }
  $("clfNps").children[9].click();
  $("clfBudget").querySelectorAll(".slot").forEach(s => s.addEventListener("click", () => {
    $("clfBudget").querySelectorAll(".slot").forEach(x => x.classList.remove("active"));
    s.classList.add("active"); clfState.presupuesto = s.dataset.v;
  }));
  $("clfCp").querySelectorAll(".slot").forEach((s, i) => s.addEventListener("click", () => {
    $("clfCp").querySelectorAll(".slot").forEach(x => x.classList.remove("active"));
    s.classList.add("active"); clfState.cp = i + 1;
  }));
  $("clfFlags").querySelectorAll("input").forEach(chk =>
    chk.addEventListener("change", () => clfState.flags[chk.dataset.f] = chk.checked));
  $("clfRun").addEventListener("click", () => {
    const fb = { presupuesto: clfState.presupuesto, cp: clfState.cp, nps: clfState.nps, comment: $("clfComment").value, ...clfState.flags };
    lastResult = evaluateCustomerFeedback(fb);
    caseState.final = null; caseState.estado = "Abierto"; caseState.tResp = "—"; caseState.solucion = "—"; caseState.aprendizaje = "—";
    $("clfResult").innerHTML = `
      <h3>¿Por qué se clasificó así?</h3>
      <p><span class="pill ${lastResult.pill}">${lastResult.label.toUpperCase()}</span></p>
      <ul class="check-list">${lastResult.reasons.map(x => `<li>• ${x}</li>`).join("")}</ul>
      <table class="kv">
        <tr><td>Acción recomendada</td><td>${lastResult.accion}</td></tr>
        <tr><td>Prioridad / plazo</td><td>${lastResult.prioridad} · ${lastResult.plazo}</td></tr>
        <tr><td>Responsable sugerido</td><td>${lastResult.resp}</td></tr>
        <tr><td>Revisión manual</td><td>Siempre disponible — la clasificación automática orienta, no decide</td></tr>
      </table>`;
    renderCaseRecord(lastResult);
  });
  renderCaseRecord(null);
}

/* ============================================================
   15 · CATÁLOGO DE VEHÍCULOS — VISTA ADMINISTRADOR (s18)
   ============================================================ */
const CAT_SEED = { "Nissan Tsuru": 34, "Nissan Versa": 29, "Chevrolet Aveo": 22, "Volkswagen Jetta": 19, "Nissan NP300": 17, "Chevrolet Chevy": 15, "Volkswagen Vento": 12, "Toyota Hilux": 9 };

function renderCatalogAdmin() {
  if (!$("catStats")) return;
  const brands = [...new Set(VEHICLE_CATALOG.map(f => f.marca))];
  $("catStats").innerHTML = `
    <div class="stat"><b>${brands.length}</b><span>marcas</span></div>
    <div class="stat"><b>${VEHICLE_CATALOG.length}</b><span>familias de modelos</span></div>
    <div class="stat"><b>${vehLog.misses.length}</b><span>búsquedas sin resultado</span></div>
    <div class="stat"><b>${vehLog.manual.length}</b><span>capturas manuales</span></div>`;

  const merged = { ...CAT_SEED };
  Object.entries(vehLog.selections).forEach(([k, n]) => merged[k] = (merged[k] || 0) + n);
  const top = Object.entries(merged).sort((a, b) => b[1] - a[1]).slice(0, 8);
  $("catTop").innerHTML = top.map(([k, n]) =>
    `<div class="hist-item"><b>${n}</b> ${k}${vehLog.selections[k] ? ' <span class="pill ok">+sesión</span>' : ""}</div>`).join("") +
    '<p class="disclaim">Conteos demostrativos (semilla + selecciones de esta sesión).</p>';

  const brandCount = {};
  top.forEach(([k, n]) => { const m = k.split(" ")[0]; brandCount[m] = (brandCount[m] || 0) + n; });
  $("catBrands").innerHTML = Object.entries(brandCount).sort((a, b) => b[1] - a[1])
    .map(([m, n]) => `<div class="hist-item"><b>${m}</b> — ${n} selecciones</div>`).join("");

  $("catMisses").innerHTML = (vehLog.misses.length
    ? [...new Set(vehLog.misses)].slice(-8).map(q =>
        `<div class="hist-item">"${q}" <button class="btn btn-mini" data-addcat="${q}">Agregar al catálogo (simulado)</button></div>`).join("")
    : "<small>Sin búsquedas fallidas en esta sesión.</small>");
  $("catManual").innerHTML = (vehLog.manual.length
    ? vehLog.manual.map(c =>
        `<div class="hist-item">${c.marca} ${c.modelo} ${c.anio}${c.version ? " · " + c.version : ""} <span class="tag tag-pen">pendiente de normalizar</span> <button class="btn btn-mini" data-addcat="${c.marca} ${c.modelo}">Agregar al catálogo (simulado)</button></div>`).join("")
    : "<small>Sin capturas manuales en esta sesión.</small>");

  const sample = ["Nissan Tsuru", "Nissan Versa", "Chevrolet Aveo", "Volkswagen Jetta", "Toyota Hilux"];
  const toValidate = VEHICLE_CATALOG.filter(f => f.validar);
  $("catPriority").innerHTML =
    sample.map(k => {
      const f = VEHICLE_CATALOG.find(x => `${x.marca} ${x.modelo}` === k);
      return `<div class="hist-item">${k} · prioridad regional:
        <select class="km-select" data-prio="${k}">
          ${[3, 2, 1, 0].map(p => `<option value="${p}" ${f.prioridad === p ? "selected" : ""}>${p === 3 ? "3 · alta" : p === 2 ? "2 · media" : p === 1 ? "1 · baja" : "0 · sin validar"}</option>`).join("")}
        </select></div>`;
    }).join("") +
    `<p class="disclaim" style="margin-top:8px"><b>Modelos que René debe validar (${toValidate.length}):</b>
     ${toValidate.map(f => `${f.marca} ${f.modelo}`).join(" · ")} — más alias regionales, años críticos y modelos faltantes
     (ver guía de validación §7).</p>`;

  $("catPriority").querySelectorAll("[data-prio]").forEach(sel => sel.addEventListener("change", () => {
    const f = VEHICLE_CATALOG.find(x => `${x.marca} ${x.modelo}` === sel.dataset.prio);
    if (f) f.prioridad = parseInt(sel.value, 10);
  }));
  document.querySelectorAll("[data-addcat]").forEach(b => b.addEventListener("click", function () {
    this.textContent = "✔ Marcado para agregar (demo)";
    this.disabled = true;
  }));
}

/* ============================================================
   16 · ARRANQUE
   ============================================================ */
initVehicleSearch();
renderSymptoms();
applyScenario();
renderIslands();
renderFeedback();
initClassifier();
renderCatalogAdmin();
logIsland("Turno iniciado: tablero de islas sincronizado (datos simulados).");
refreshLogout();
