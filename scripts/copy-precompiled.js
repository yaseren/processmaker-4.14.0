const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const targetDir = path.join(root, "public/css/precompiled");

const copyRecursive = (source, destination) => {
  if (!fs.existsSync(source)) {
    return;
  }
  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
};

fs.mkdirSync(targetDir, { recursive: true });

const copies = [
  ["node_modules/npm-font-open-sans", "npm-font-open-sans"],
  ["node_modules/bootstrap/scss", "bootstrap"],
  ["node_modules/@fortawesome/fontawesome-free", "fontawesome-free"],
  ["node_modules/@fontsource/poppins", "poppins"],
  ["node_modules/@fontsource/vazirmatn", "vazirmatn"],
];

copies.forEach(([from, to]) => {
  copyRecursive(path.join(root, from), path.join(targetDir, to));
});

const multiselectCss = path.join(
  root,
  "node_modules/@processmaker/vue-multiselect/dist/vue-multiselect.min.css",
);
const multiselectTarget = path.join(targetDir, "vue-multiselect.min.css");
if (fs.existsSync(multiselectCss)) {
  fs.copyFileSync(multiselectCss, multiselectTarget);
}
