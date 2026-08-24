const fs = require("node:fs");

const file = "app/page.tsx";
let source = fs.readFileSync(file, "utf8");

const replacements = [
  [
    ".map(x=><div><small>{x[0]}</small>",
    ".map((x)=><div key={x[0]}><small>{x[0]}</small>",
  ],
  [
    "caps.map(([n,s,c,state]:any)=><div className={s<55?'cap warn':'cap'}>",
    "caps.map(([n,s,c,state]:any)=><div key={n} className={s<55?'cap warn':'cap'}>",
  ],
  [
    "sectors.map(([n,s,c]:any)=><div className=\"sector\">",
    "sectors.map(([n,s,c]:any)=><div key={n} className=\"sector\">",
  ],
  [
    "opportunities.map((o:any)=><div className=\"opp\">",
    "opportunities.map((o:any)=><div key={o[0]} className=\"opp\">",
  ],
  [
    "dangers.map((d:any)=><div className=\"danger\">",
    "dangers.map((d:any)=><div key={d[0]} className=\"danger\">",
  ],
  [
    "[['Diversification',82],['Risk',71],['Quality',84],['Momentum',79],['Sector Balance',68]].map(x=><p>",
    "[['Diversification',82],['Risk',71],['Quality',84],['Momentum',79],['Sector Balance',68]].map(x=><p key={x[0]}>",
  ],
];

for (const [from, to] of replacements) {
  source = source.replace(from, to);
}

fs.writeFileSync(file, source);
console.log("Applied React list-key hotfixes to app/page.tsx");
