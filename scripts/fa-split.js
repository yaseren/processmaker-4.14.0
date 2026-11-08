const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const en = JSON.parse(fs.readFileSync(path.join(root, "resources/lang/en.json"), "utf8"));
const outDir = path.join(__dirname, "fa-translations");
const parts = Number(process.argv[2] || 8);

fs.mkdirSync(outDir, { recursive: true });

const keys = Object.keys(en);
const size = Math.ceil(keys.length / parts);

for (let i = 0; i < parts; i += 1) {
  const chunk = {};
  keys.slice(i * size, (i + 1) * size).forEach((key) => {
    chunk[key] = en[key];
  });
  fs.writeFileSync(
    path.join(outDir, `en-part-${i + 1}.json`),
    `${JSON.stringify(chunk, null, 2)}\n`,
    "utf8",
  );
  console.log(`part ${i + 1}: ${Object.keys(chunk).length} keys`);
}
