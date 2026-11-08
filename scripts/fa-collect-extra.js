const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const en = JSON.parse(fs.readFileSync(path.join(root, "resources/lang/en.json"), "utf8"));
const dirs = [
  "node_modules/@processmaker/screen-builder/src",
  "node_modules/@processmaker/modeler/src",
  "node_modules/@processmaker/vue-form-elements/src",
].map((dir) => path.join(root, dir));

const pattern = /\$t\(\s*(['"`])((?:(?!\1)[^\\]|\\.)+)\1\s*[,)]/g;
const found = new Set();

const walk = (dir) => {
  if (!fs.existsSync(dir)) {
    return;
  }
  fs.readdirSync(dir).forEach((name) => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (!["node_modules", "stories", "tests"].includes(name)) {
        walk(full);
      }
      return;
    }
    if (!/\.(vue|js)$/.test(name)) {
      return;
    }
    const content = fs.readFileSync(full, "utf8");
    for (const match of content.matchAll(pattern)) {
      if (match[1] !== "`" || !match[2].includes("${")) {
        found.add(match[2].replace(/\\(['"`])/g, "$1"));
      }
    }
  });
};

dirs.forEach(walk);

const missing = [...found].filter((key) => !(key in en) && /[A-Za-z]/.test(key)).sort();
const out = Object.fromEntries(missing.map((key) => [key, key]));
fs.writeFileSync(
  path.join(__dirname, "fa-translations/en-extra.json"),
  `${JSON.stringify(out, null, 2)}\n`,
  "utf8",
);
console.log(`found ${found.size}, missing from en.json ${missing.length}`);
