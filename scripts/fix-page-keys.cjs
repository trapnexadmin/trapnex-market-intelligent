const fs = require("node:fs");

const file = "app/page.tsx";
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  '          ].map((x) => (\\n            <div>\\n              <small>{x[0]}</small>',
  '          ].map((x) => (\\n            <div key={x[0]}>\\n              <small>{x[0]}</small>'
);

source = source.replace(
  '                  ].map((x) => (\\n                    <p>\\n                      <span>{x[0]}</span>',
  '                  ].map((x) => (\\n                    <p key={x[0]}>\\n                      <span>{x[0]}</span>'
);

fs.writeFileSync(file, source);
console.log("Fixed missing React keys in app/page.tsx");
