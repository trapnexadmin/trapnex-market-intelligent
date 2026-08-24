import fs from "node:fs";

const path = "app/page.tsx";
let source = fs.readFileSync(path, "utf8");

source = source.replace(
  /(\]\.map\(\(x\) => \(\s*<div)(>\s*<small>\{x\[0\]\}<\/small>)/,
  "$1 key={x[0]}$2",
);

source = source.replace(
  /(\]\.map\(\(x\) => \(\s*<p)(>\s*<span>\{x\[0\]\}<\/span>)/,
  "$1 key={x[0]}$2",
);

fs.writeFileSync(path, source);
console.log("Applied stable keys to dashboard map children.");
