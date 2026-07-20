/* ============================================================
   AutoRed Pro — Catálogo de vehículos (demostrativo)
   Familias por rangos de años (NO combinaciones año-versión).
   prioridad regional: 3 alta · 2 media · 1 baja · 0 sin validar
   (editable y demostrativa: NO es estadística definitiva; se
   valida con René y con las búsquedas reales del piloto).
   estado: "actual" | "descontinuado" (los descontinuados siguen
   circulando y llegando a talleres).
   ============================================================ */
"use strict";

function _v(marca, modelo, alias, a1, a2, carroceria, categoria, prioridad, estado, extra) {
  return Object.assign({
    marca, modelo, alias: alias || [],
    anios: [a1, a2],            // a2 = null → sigue vigente ("actual")
    carroceria, categoria, prioridad, estado,
    gen: null, versiones: [], motores: [], validar: false
  }, extra || {});
}

const VEHICLE_CATALOG = [
  /* ---- Nissan ---- */
  _v("Nissan", "Tsuru", ["tsurito", "tsuru iii"], 1992, 2017, "sedán", "subcompacto", 3, "descontinuado", { motores: ["1.6 8v"] }),
  _v("Nissan", "Versa", ["versita"], 2012, null, "sedán", "subcompacto", 3, "actual", { versiones: ["Sense", "Advance", "Exclusive"] }),
  _v("Nissan", "March", [], 2011, null, "hatchback", "subcompacto", 3, "actual"),
  _v("Nissan", "Sentra", [], 1995, null, "sedán", "compacto", 3, "actual"),
  _v("Nissan", "Tiida", [], 2007, 2018, "sedán/hatchback", "compacto", 2, "descontinuado"),
  _v("Nissan", "Platina", [], 2002, 2010, "sedán", "subcompacto", 2, "descontinuado"),
  _v("Nissan", "Aprio", [], 2007, 2010, "sedán", "subcompacto", 1, "descontinuado"),
  _v("Nissan", "Altima", [], 2002, null, "sedán", "mediano", 1, "actual"),
  _v("Nissan", "NP300", ["estaquitas", "estacas", "np 300"], 2008, null, "pickup", "trabajo", 3, "actual", { versiones: ["Chasis", "Doble cabina", "Estacas"] }),
  _v("Nissan", "Frontier", [], 2005, null, "pickup", "trabajo", 3, "actual"),
  _v("Nissan", "X-Trail", ["xtrail", "x trail"], 2004, null, "SUV", "familiar", 2, "actual"),
  _v("Nissan", "Kicks", [], 2016, null, "SUV", "familiar", 2, "actual"),
  /* ---- Chevrolet ---- */
  _v("Chevrolet", "Chevy", ["chevy pop", "chevy c2", "chevy monza"], 1994, 2012, "hatchback/sedán", "subcompacto", 3, "descontinuado"),
  _v("Chevrolet", "Corsa", [], 2002, 2008, "sedán/hatchback", "subcompacto", 2, "descontinuado"),
  _v("Chevrolet", "Aveo", [], 2008, null, "sedán", "subcompacto", 3, "actual"),
  _v("Chevrolet", "Spark", ["sparkcito"], 2011, 2022, "hatchback", "subcompacto", 3, "descontinuado"),
  _v("Chevrolet", "Beat", [], 2018, 2024, "sedán/hatchback", "subcompacto", 2, "actual"),
  _v("Chevrolet", "Onix", [], 2020, null, "sedán", "subcompacto", 2, "actual"),
  _v("Chevrolet", "Cavalier", [], 1995, null, "sedán", "compacto", 2, "actual", { gen: "clásico 1995–2005 · nuevo 2018–" }),
  _v("Chevrolet", "Trax", [], 2013, null, "SUV", "familiar", 2, "actual"),
  _v("Chevrolet", "Captiva", [], 2008, null, "SUV", "familiar", 1, "actual"),
  _v("Chevrolet", "S10", ["s-10", "s10 max"], 1994, null, "pickup", "trabajo", 2, "actual", { gen: "clásica 90s · S10 Max 2021–" }),
  _v("Chevrolet", "Silverado", ["cheyenne"], 1994, null, "pickup", "trabajo", 2, "actual"),
  /* ---- Volkswagen ---- */
  _v("Volkswagen", "Sedán", ["vocho", "vochito", "beetle clasico", "escarabajo"], 1954, 2003, "sedán", "clásico", 3, "descontinuado"),
  _v("Volkswagen", "Derby", [], 1995, 2009, "sedán", "subcompacto", 2, "descontinuado"),
  _v("Volkswagen", "Pointer", ["pointer city"], 1998, 2009, "hatchback", "subcompacto", 3, "descontinuado"),
  _v("Volkswagen", "Gol", [], 2009, 2019, "hatchback/sedán", "subcompacto", 2, "descontinuado"),
  _v("Volkswagen", "Jetta", ["jetta clasico", "bicho"], 1993, null, "sedán", "compacto", 3, "actual", { gen: "A3/A4 'Clásico' · A6/A7" }),
  _v("Volkswagen", "Bora", [], 2005, 2010, "sedán", "compacto", 2, "descontinuado"),
  _v("Volkswagen", "Vento", [], 2014, 2023, "sedán", "subcompacto", 3, "descontinuado"),
  _v("Volkswagen", "Virtus", [], 2023, null, "sedán", "subcompacto", 2, "actual"),
  _v("Volkswagen", "Saveiro", [], 2010, null, "pickup", "trabajo", 2, "actual"),
  _v("Volkswagen", "Tiguan", [], 2008, null, "SUV", "familiar", 1, "actual"),
  /* ---- Toyota ---- */
  _v("Toyota", "Yaris", ["yaris sedan", "yaris r"], 2006, null, "sedán/hatchback", "subcompacto", 2, "actual"),
  _v("Toyota", "Corolla", [], 2000, null, "sedán", "compacto", 2, "actual"),
  _v("Toyota", "Avanza", [], 2008, null, "minivan", "familiar", 2, "actual"),
  _v("Toyota", "Hilux", [], 2005, null, "pickup", "trabajo", 3, "actual"),
  _v("Toyota", "RAV4", ["rav 4"], 2006, null, "SUV", "familiar", 1, "actual"),
  _v("Toyota", "Tacoma", [], 2005, null, "pickup", "trabajo", 1, "actual"),
  _v("Toyota", "Sienna", [], 2004, null, "minivan", "familiar", 1, "actual"),
  /* ---- Ford ---- */
  _v("Ford", "Ikon", [], 2001, 2011, "sedán/hatchback", "subcompacto", 1, "descontinuado"),
  _v("Ford", "Fiesta", [], 1998, 2019, "sedán/hatchback", "subcompacto", 2, "descontinuado"),
  _v("Ford", "Focus", [], 2000, 2018, "sedán/hatchback", "compacto", 1, "descontinuado"),
  _v("Ford", "Fusion", [], 2006, 2019, "sedán", "mediano", 1, "descontinuado"),
  _v("Ford", "EcoSport", ["ecosport", "eco sport"], 2004, 2021, "SUV", "familiar", 2, "descontinuado"),
  _v("Ford", "Escape", [], 2001, null, "SUV", "familiar", 1, "actual"),
  _v("Ford", "Ranger", [], 1998, null, "pickup", "trabajo", 3, "actual"),
  _v("Ford", "F-150", ["lobo", "f150"], 1997, null, "pickup", "trabajo", 2, "actual"),
  /* ---- Kia ---- */
  _v("Kia", "Rio", [], 2016, null, "sedán/hatchback", "subcompacto", 2, "actual"),
  _v("Kia", "Forte", [], 2016, null, "sedán", "compacto", 1, "actual"),
  _v("Kia", "Soul", [], 2015, 2021, "SUV", "familiar", 1, "descontinuado"),
  _v("Kia", "Seltos", [], 2020, null, "SUV", "familiar", 1, "actual"),
  _v("Kia", "Sportage", [], 2015, null, "SUV", "familiar", 1, "actual"),
  /* ---- Hyundai ---- */
  _v("Hyundai", "Atos", ["dodge atos", "atos basico"], 2000, 2012, "hatchback", "subcompacto", 3, "descontinuado"),
  _v("Hyundai", "Grand i10", ["gran i10", "i10"], 2015, null, "sedán/hatchback", "subcompacto", 2, "actual"),
  _v("Hyundai", "Accent", [], 2018, null, "sedán", "subcompacto", 2, "actual"),
  _v("Hyundai", "Elantra", [], 2016, null, "sedán", "compacto", 1, "actual"),
  _v("Hyundai", "Creta", [], 2017, null, "SUV", "familiar", 1, "actual"),
  _v("Hyundai", "Tucson", [], 2016, null, "SUV", "familiar", 1, "actual"),
  /* ---- Honda ---- */
  _v("Honda", "Fit", [], 2005, 2020, "hatchback", "subcompacto", 2, "descontinuado"),
  _v("Honda", "City", [], 2010, null, "sedán", "subcompacto", 2, "actual"),
  _v("Honda", "Civic", [], 1995, null, "sedán", "compacto", 2, "actual"),
  _v("Honda", "Accord", [], 1995, null, "sedán", "mediano", 1, "actual"),
  _v("Honda", "HR-V", ["hrv"], 2015, null, "SUV", "familiar", 2, "actual"),
  _v("Honda", "CR-V", ["crv"], 1997, null, "SUV", "familiar", 2, "actual"),
  /* ---- Renault ---- */
  _v("Renault", "Clio", [], 2002, 2010, "hatchback", "subcompacto", 1, "descontinuado"),
  _v("Renault", "Logan", [], 2015, null, "sedán", "subcompacto", 2, "actual"),
  _v("Renault", "Sandero", [], 2015, null, "hatchback", "subcompacto", 2, "actual"),
  _v("Renault", "Stepway", [], 2015, null, "hatchback", "subcompacto", 2, "actual"),
  _v("Renault", "Kwid", [], 2019, null, "hatchback", "subcompacto", 2, "actual"),
  _v("Renault", "Duster", [], 2012, null, "SUV", "familiar", 2, "actual"),
  _v("Renault", "Kangoo", [], 2004, null, "van", "trabajo", 2, "actual"),
  /* ---- Suzuki ---- */
  _v("Suzuki", "Swift", [], 2008, null, "hatchback", "subcompacto", 2, "actual"),
  _v("Suzuki", "Ignis", [], 2017, null, "hatchback", "subcompacto", 1, "actual"),
  _v("Suzuki", "Ciaz", [], 2016, 2020, "sedán", "subcompacto", 1, "descontinuado"),
  _v("Suzuki", "Ertiga", [], 2019, null, "minivan", "familiar", 1, "actual"),
  _v("Suzuki", "Vitara", [], 2016, null, "SUV", "familiar", 1, "actual"),
  _v("Suzuki", "Jimny", [], 2021, null, "SUV", "familiar", 1, "actual"),
  /* ---- Mazda ---- */
  _v("Mazda", "Mazda2", ["mazda 2"], 2012, null, "sedán/hatchback", "subcompacto", 1, "actual"),
  _v("Mazda", "Mazda3", ["mazda 3"], 2006, null, "sedán/hatchback", "compacto", 2, "actual"),
  _v("Mazda", "Mazda6", ["mazda 6"], 2006, 2021, "sedán", "mediano", 1, "descontinuado"),
  _v("Mazda", "CX-3", ["cx3"], 2016, 2021, "SUV", "familiar", 1, "descontinuado"),
  _v("Mazda", "CX-30", ["cx30"], 2020, null, "SUV", "familiar", 1, "actual"),
  _v("Mazda", "CX-5", ["cx5"], 2013, null, "SUV", "familiar", 1, "actual"),
  /* ---- Mitsubishi ---- */
  _v("Mitsubishi", "Mirage", [], 2014, null, "hatchback/sedán", "subcompacto", 1, "actual"),
  _v("Mitsubishi", "Lancer", [], 2008, 2017, "sedán", "compacto", 1, "descontinuado"),
  _v("Mitsubishi", "Outlander", [], 2003, null, "SUV", "familiar", 1, "actual"),
  _v("Mitsubishi", "L200", ["l-200"], 2008, null, "pickup", "trabajo", 2, "actual"),
  /* ---- Dodge / Ram ---- */
  _v("Dodge", "Attitude", ["atitud"], 2006, 2023, "sedán", "subcompacto", 2, "descontinuado"),
  _v("Dodge", "Neon", [], 1995, 2021, "sedán", "compacto", 1, "descontinuado", { gen: "clásico 1995–2005 · nuevo 2017–2021" }),
  _v("Dodge", "Journey", [], 2009, 2020, "SUV", "familiar", 1, "descontinuado"),
  _v("Ram", "700", ["ram700", "ram 700"], 2015, null, "pickup", "trabajo", 2, "actual"),
  _v("Ram", "1500", ["ram1500"], 1994, null, "pickup", "trabajo", 1, "actual"),
  /* ---- Seat ---- */
  _v("Seat", "Ibiza", [], 2002, 2021, "hatchback", "subcompacto", 1, "descontinuado"),
  _v("Seat", "Córdoba", ["cordoba"], 2000, 2009, "sedán", "subcompacto", 1, "descontinuado"),
  _v("Seat", "Toledo", [], 2013, 2019, "sedán", "compacto", 1, "descontinuado"),
  _v("Seat", "León", ["leon"], 2005, null, "hatchback", "compacto", 1, "actual"),
  _v("Seat", "Arona", [], 2018, null, "SUV", "familiar", 1, "actual"),
  _v("Seat", "Ateca", [], 2017, null, "SUV", "familiar", 1, "actual"),
  /* ---- Jeep ---- */
  _v("Jeep", "Patriot", [], 2007, 2017, "SUV", "familiar", 1, "descontinuado"),
  _v("Jeep", "Compass", [], 2007, null, "SUV", "familiar", 1, "actual"),
  _v("Jeep", "Renegade", [], 2017, null, "SUV", "familiar", 1, "actual"),
  _v("Jeep", "Cherokee", ["grand cherokee"], 1990, null, "SUV", "familiar", 1, "actual"),
  _v("Jeep", "Wrangler", [], 1997, null, "SUV", "todo terreno", 1, "actual"),
  /* ---- MG ---- */
  _v("MG", "MG3", ["mg 3"], 2023, null, "hatchback", "subcompacto", 1, "actual"),
  _v("MG", "MG5", ["mg 5"], 2021, null, "sedán", "subcompacto", 1, "actual"),
  _v("MG", "ZS", [], 2021, null, "SUV", "familiar", 1, "actual"),
  _v("MG", "HS", [], 2021, null, "SUV", "familiar", 1, "actual"),
  /* ---- JAC (prioridad 0 = sin validar con René) ---- */
  _v("JAC", "Sei4", ["sei 4"], 2018, null, "SUV", "familiar", 0, "actual", { validar: true }),
  _v("JAC", "J7", [], 2020, null, "sedán", "compacto", 0, "actual", { validar: true }),
  _v("JAC", "Frison T8", ["frison"], 2020, null, "pickup", "trabajo", 0, "actual", { validar: true }),
  /* ---- Chirey (prioridad 0 = sin validar con René) ---- */
  _v("Chirey", "Tiggo 4 Pro", ["tiggo 4"], 2022, null, "SUV", "familiar", 0, "actual", { validar: true }),
  _v("Chirey", "Tiggo 7 Pro", ["tiggo 7"], 2022, null, "SUV", "familiar", 0, "actual", { validar: true }),
  _v("Chirey", "Tiggo 8", [], 2022, null, "SUV", "familiar", 0, "actual", { validar: true })
];
