const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const enPath = path.join(root, "resources/lang/en.json");
const faPath = path.join(root, "resources/lang/fa.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const fa = fs.existsSync(faPath)
  ? JSON.parse(fs.readFileSync(faPath, "utf8"))
  : {};

const missing = Object.keys(en).filter((key) => !(key in fa));
const extra = Object.keys(fa).filter((key) => !(key in en));

console.log(`en keys: ${Object.keys(en).length}`);
console.log(`fa keys: ${Object.keys(fa).length}`);
console.log(`missing in fa: ${missing.length}`);
console.log(`extra in fa: ${extra.length}`);

if (missing.length) {
  console.log("\nMissing keys (first 50):");
  missing.slice(0, 50).forEach((key) => console.log(`- ${key}`));
}

if (extra.length) {
  console.log("\nExtra keys (first 50):");
  extra.slice(0, 50).forEach((key) => console.log(`- ${key}`));
}

process.exit(missing.length ? 1 : 0);
