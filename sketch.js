let main = [];
let groups = [];
let LHS = [],
  RHS = [],
  cgroups = [];
async function getFile() {
  await fetch("t.txt")
    .then((response) => response.text())
    .then((data) => {
      main = data.split("\n");
    });
}
function expand(input) {
  let result = [];
  let i = [input];
  if (input.indexOf(";") != -1) {
    i = input.split(";");
    for (let y = 0; y < i.length; y++) {
      i[y] = i[y].trim();
    }
  }
  for (let x = 0; x < i.length; x++) {
    result.push(...expandLinear(i[x]));
  }
  return result;
}
function expandLinear(input) {
  let parts = input.split(/,\s?/),
    res = [];
  let firstMatch = input.match(/^(.+?)\s*\(s\)\s*(.*)$/);
  if (firstMatch)
    return [
      `${firstMatch[1]} ${firstMatch[2]}`.trim(),
      `${firstMatch[1]}s ${firstMatch[2]}`.trim(),
    ];
  let base = parts[0];
  if (base.includes("(")) return [input];
  res.push(base);
  parts.slice(1).forEach((p) => {
    let m = p.match(/\((.*?)\)/);
    if (m) res.push(base.trim() + m[1]);
  });
  return res;
}
async function start() {
  await getFile();
  let lastIndex = 0;
  for (let i = 0; i < main.length; i++) {
    if (main[i] == "") {
      groups.push(
        main.slice(lastIndex, i).filter((elem) => {
          return elem != "";
        })
      );
      lastIndex = i;
    }
  }
  let tog = true;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i][0].startsWith("[CONCURRENT] ")) {
      groups[i][0] = groups[i][0].substring(13);
      let newL = [],
        newR = [];
      let tog2 = true;
      for (let p = 0; p < groups[i].length; p++) {
        if (tog2) {
          newL.push(groups[i][p]);
        } else {
          newR.push(groups[i][p]);
        }
        tog2 = !tog2;
      }
      LHS.push(newL);
      RHS.push(newR);
    } else {
      if (tog) {
        LHS.push(groups[i]);
      } else {
        RHS.push(groups[i]);
      }
      tog = !tog;
    }
  }

  for (let i = 0; i < LHS.length; i++) {
    let diff = LHS[i].length - RHS[i].length;
    if (diff != 0) {
      console.log(i, LHS[i], RHS[i]);
    }
    for (let j = 0; j < LHS[i].length; j++) {}
  }
  let result = [];
  for (let i = 0; i < LHS.length; i++) {
    for (let j = 0; j < LHS[i].length; j++) {
      let expanded = expand(LHS[i][j]);
      for (let k = 0; k < expanded.length; k++) {
        result.push(expanded[k] + "," + RHS[i][j]);
      }
    }
  }
  document.body.innerHTML = result.join("\n<br>");
}
start();
