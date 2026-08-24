import fs from "node:fs";

const path = "app/page.tsx";
let source = fs.readFileSync(path, "utf8");

const tickerNeedle = '          ].map((x) => (\\n            <div>';
const tickerReplacement = '          ].map((x) => (\\n            <div key={x[0]}>';
const healthNeedle = '                  ].map((x) => (\\n                    <p>';
const healthReplacement = '                  ].map((x) => (x) => (\\n                    <p key={x[0]}>';
// The health replacement above is intentionally guarded below to avoid
// changing unrelated map blocks.
if (source.includes(tickerNeedle)) {
  source = source.replace(tickerNeedle, tickerReplacement);
}

const exactHealthNeedle = '                  ].map((x) => (\\n                    <p>\\n                      <span>{x[0]}</span>';
const exactHealthReplacement = '                  ].map((x) => (\\n                    <p key={x[0]}>\\n                      <span>{x[0]}</span>';
if (source.includes(exactHealthNeedle)) {
  source = source.replace(exactHealthNeedle, exactHealthReplacement);
}

fs.writeFileSync(path, source);
console.log("Dashboard React key warnings fixed in app/page.tsx");
