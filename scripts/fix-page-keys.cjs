const fs = require("node:fs");

const file = "app/page.tsx";
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  '].map((x) => (\\n            <div>',
  '].map((x) => (\\n            <div key={x[0]}>'
);

source = source.replace(
  '].map((x) => (\\n                    <p>',
  '].map((x) => (\\n                    <p key={x[0]}>'
);

fs.writeFileSync(file, source);
console.log("Page list key fixes applied.");
