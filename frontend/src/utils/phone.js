export function normalizeSaudiPhone(input) {
  const raw = (input || "").trim();
  if (!raw) return "";

  // remove spaces/dashes
  let p = raw.replace(/[\s-]/g, "");

  // if starts with +966 already
  if (p.startsWith("+966")) return p;

  // if starts with 966
  if (p.startsWith("966")) return `+${p}`;

  // if starts with 05xxxxx -> +9665xxxxx
  if (p.startsWith("05")) return `+966${p.slice(1)}`;

  // if starts with 5xxxxx -> +9665xxxxx
  if (p.startsWith("5")) return `+966${p}`;

  // fallback
  return p.startsWith("+") ? p : `+${p}`;
}

export function whatsappLink(phone, text) {
  const p = normalizeSaudiPhone(phone).replace("+", "");
  const t = encodeURIComponent(text || "");
  return `https://wa.me/${p}?text=${t}`;
}
