const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const partsDir = path.join(__dirname, "fa-translations");
const extraPath = path.join(partsDir, "en-extra.json");
// Keys used only by @processmaker packages (screen-builder, modeler) and absent from en.json.
const en = {
  ...JSON.parse(fs.readFileSync(path.join(root, "resources/lang/en.json"), "utf8")),
  ...(fs.existsSync(extraPath) ? JSON.parse(fs.readFileSync(extraPath, "utf8")) : {}),
};
const faPath = path.join(root, "resources/lang/fa.json");

const translated = {};
fs.readdirSync(partsDir)
  .filter((file) => /^fa-part-\d+\.json$/.test(file))
  .sort()
  .forEach((file) => {
    Object.assign(translated, JSON.parse(fs.readFileSync(path.join(partsDir, file), "utf8")));
  });

const tokenPattern = /\{\{[^}]+\}\}|:[a-zA-Z][a-zA-Z0-9_]*|<[^>]+>|%[sd]/g;
const tokensOf = (text) => (String(text).match(tokenPattern) || []).sort();

const missing = [];
const tokenMismatch = [];
const fa = {};

Object.keys(en).forEach((key) => {
  if (!(key in translated) || typeof translated[key] !== "string" || translated[key] === "") {
    missing.push(key);
    fa[key] = en[key];
    return;
  }
  const expected = tokensOf(en[key]).join("|");
  const actual = tokensOf(translated[key]).join("|");
  if (expected !== actual) {
    tokenMismatch.push({ key, en: en[key], fa: translated[key] });
  }
  fa[key] = translated[key];
});

fs.writeFileSync(faPath, `${JSON.stringify(fa, null, 2)}\n`, "utf8");

const untranslated = Object.keys(fa).filter((key) => fa[key] === en[key] && /[a-z]{3,}/i.test(en[key]));

console.log(`keys: ${Object.keys(fa).length}`);
console.log(`missing from parts: ${missing.length}`);
console.log(`placeholder mismatches: ${tokenMismatch.length}`);
console.log(`unchanged from English: ${untranslated.length}`);
if (process.argv.includes("--verbose")) {
  tokenMismatch.forEach(({ key, en: e, fa: f }) => console.log(`MISMATCH ${key}\n  en: ${e}\n  fa: ${f}`));
  untranslated.forEach((key) => console.log(`SAME ${key}`));
}
