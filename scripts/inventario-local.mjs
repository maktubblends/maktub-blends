// Genera merchant/inventario-local.tsv a partir de la tienda online (stock por variante).
// Variantes disponibles -> 100 unidades / in_stock; agotadas -> 0 / out_of_stock.
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const BASE = "https://www.maktubblends.com.ar";
const STORE = "11290269674577462446";
const OUT = "merchant/inventario-local.tsv";
const UA = { "user-agent": "MaktubInventarioBot/1.0" };

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const sitemap = await (await fetch(BASE + "/sitemap.xml", { headers: UA })).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => /\/productos\/[^/]+\/?$/.test(u));
if (urls.length < 10) throw new Error("Sitemap con pocos productos: " + urls.length);

const rows = new Map();
for (const u of urls) {
  let html = "";
  for (let t = 0; t < 3 && !html; t++) {
    try { const r = await fetch(u, { headers: UA }); if (r.ok) html = await r.text(); } catch {}
  }
  if (!html) throw new Error("No se pudo leer " + u);
  const m = html.match(/data-variants="([^"]+)"/) || html.match(/data-variants='([^']+)'/);
  if (!m) continue;
  for (const v of JSON.parse(decode(m[1]))) rows.set(String(v.id), !!v.available);
}
if (rows.size < 10) throw new Error("Pocas variantes: " + rows.size);

let tsv = "store_code\tid\tquantity\tavailability\n";
for (const [id, ok] of [...rows].sort((a, b) => a[0].localeCompare(b[0]))) {
  tsv += `${STORE}\t${id}\t${ok ? 100 : 0}\t${ok ? "in_stock" : "out_of_stock"}\n`;
}
const prev = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
writeFileSync(OUT, tsv);
console.log(`${rows.size} variantes, ${[...rows.values()].filter(Boolean).length} en stock${prev === tsv ? " (sin cambios)" : ""}`);
