import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "data", "symbols", "names");

const numberWords = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
const tens = ["", "", "twenty", "thirty", "forty", "fifty"];

function word(n) {
  if (n <= 20) return numberWords[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? tens[t] : `${tens[t]} ${numberWords[o]}`;
}

const titleCase = (s) =>
  s.toLowerCase().replace(/(^|[\s-])([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase());

const hex = (cp) => cp.toString(16).toUpperCase().padStart(4, "0");

async function writeNames(file, map) {
  const sorted = Object.keys(map).sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
  const obj = {};
  for (const k of sorted) obj[k] = map[k];
  const out = { names: obj };
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, file), `${JSON.stringify(out, null, 2)}\n`);
  console.log(`wrote data/symbols/names/${file} (${sorted.length} names)`);
}

// ---------------------------------------------------------------- forms.json
{
  const m = {};
  const set = (cp, name) => { m[hex(cp)] = titleCase(name); };

  // Superscripts & Subscripts
  set(0x2070, "SUPERSCRIPT ZERO");
  set(0x2071, "SUPERSCRIPT LATIN SMALL LETTER I");
  for (let n = 4; n <= 9; n++) set(0x2070 + n, `SUPERSCRIPT ${word(n).toUpperCase()}`);
  set(0x207a, "SUPERSCRIPT PLUS SIGN");
  set(0x207b, "SUPERSCRIPT MINUS");
  set(0x207c, "SUPERSCRIPT EQUALS SIGN");
  set(0x207d, "SUPERSCRIPT LEFT PARENTHESIS");
  set(0x207e, "SUPERSCRIPT RIGHT PARENTHESIS");
  set(0x207f, "SUPERSCRIPT LATIN SMALL LETTER N");
  for (let n = 0; n <= 9; n++) set(0x2080 + n, `SUBSCRIPT ${word(n).toUpperCase()}`);
  set(0x208a, "SUBSCRIPT PLUS SIGN");
  set(0x208b, "SUBSCRIPT MINUS");
  set(0x208c, "SUBSCRIPT EQUALS SIGN");
  set(0x208d, "SUBSCRIPT LEFT PARENTHESIS");
  set(0x208e, "SUBSCRIPT RIGHT PARENTHESIS");
  const subLetters = ["a", "e", "o", "x", "SCHWA", "h", "k", "l", "m", "n", "p", "s", "t"];
  for (let i = 0; i < subLetters.length; i++) {
    set(0x2090 + i, `SUBSCRIPT LATIN SMALL LETTER ${subLetters[i]}`);
  }

  // Number Forms
  const fractions = {
    0x2150: "VULGAR FRACTION ONE SEVENTH",
    0x2151: "VULGAR FRACTION ONE NINTH",
    0x2152: "VULGAR FRACTION ONE TENTH",
    0x2153: "VULGAR FRACTION ONE THIRD",
    0x2154: "VULGAR FRACTION TWO THIRDS",
    0x2155: "VULGAR FRACTION ONE FIFTH",
    0x2156: "VULGAR FRACTION TWO FIFTHS",
    0x2157: "VULGAR FRACTION THREE FIFTHS",
    0x2158: "VULGAR FRACTION FOUR FIFTHS",
    0x2159: "VULGAR FRACTION ONE SIXTH",
    0x215a: "VULGAR FRACTION FIVE SIXTHS",
    0x215b: "VULGAR FRACTION ONE EIGHTH",
    0x215c: "VULGAR FRACTION THREE EIGHTHS",
    0x215d: "VULGAR FRACTION FIVE EIGHTHS",
    0x215e: "VULGAR FRACTION SEVEN EIGHTHS",
    0x215f: "FRACTION NUMERATOR ONE",
  };
  for (const [cp, name] of Object.entries(fractions)) set(Number(cp), name);
  const romanUp = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  for (let i = 0; i < romanUp.length; i++) set(0x2160 + i, `ROMAN NUMERAL ${romanUp[i].toUpperCase()}`);
  set(0x216c, "ROMAN NUMERAL FIFTY");
  set(0x216d, "ROMAN NUMERAL ONE HUNDRED");
  set(0x216e, "ROMAN NUMERAL FIVE HUNDRED");
  set(0x216f, "ROMAN NUMERAL ONE THOUSAND");
  for (let i = 0; i < romanUp.length; i++) set(0x2170 + i, `SMALL ROMAN NUMERAL ${romanUp[i].toUpperCase()}`);
  set(0x217c, "SMALL ROMAN NUMERAL FIFTY");
  set(0x217d, "SMALL ROMAN NUMERAL ONE HUNDRED");
  set(0x217e, "SMALL ROMAN NUMERAL FIVE HUNDRED");
  set(0x217f, "SMALL ROMAN NUMERAL ONE THOUSAND");
  set(0x2180, "ROMAN NUMERAL ONE THOUSAND C D");
  set(0x2181, "ROMAN NUMERAL FIVE THOUSAND");
  set(0x2182, "ROMAN NUMERAL TEN THOUSAND");
  set(0x2183, "ROMAN NUMERAL REVERSED ONE HUNDRED");
  set(0x2184, "LATIN SMALL LETTER REVERSED C");
  set(0x2185, "ROMAN NUMERAL SIX LATE FORM");
  set(0x2186, "ROMAN NUMERAL FIFTY EARLY FORM");
  set(0x2187, "ROMAN NUMERAL FIFTY THOUSAND");
  set(0x2188, "ROMAN NUMERAL ONE HUNDRED THOUSAND");
  set(0x2189, "VULGAR FRACTION ZERO THIRDS");

  await writeNames("forms.json", m);
}

// -------------------------------------------------------------- enclosed.json
{
  const m = {};
  const set = (cp, name) => { m[hex(cp)] = titleCase(name); };

  // Enclosed Alphanumerics
  for (let n = 1; n <= 9; n++) set(0x2460 + n - 1, `CIRCLED DIGIT ${word(n).toUpperCase()}`);
  for (let n = 10; n <= 20; n++) set(0x2460 + n - 1, `CIRCLED NUMBER ${word(n).toUpperCase()}`);
  for (let n = 1; n <= 10; n++) set(0x2474 + n - 1, `PARENTHESIZED DIGIT ${word(n).toUpperCase()}`);
  for (let n = 11; n <= 20; n++) set(0x2474 + n - 1, `PARENTHESIZED NUMBER ${word(n).toUpperCase()}`);
  for (let n = 1; n <= 10; n++) set(0x2488 + n - 1, `DIGIT ${word(n).toUpperCase()} FULL STOP`);
  for (let n = 11; n <= 20; n++) set(0x2488 + n - 1, `NUMBER ${word(n).toUpperCase()} FULL STOP`);
  for (let i = 0; i < 26; i++) set(0x249c + i, `PARENTHESIZED LATIN SMALL LETTER ${String.fromCharCode(97 + i)}`);
  for (let i = 0; i < 26; i++) set(0x24b6 + i, `CIRCLED LATIN CAPITAL LETTER ${String.fromCharCode(65 + i)}`);
  for (let i = 0; i < 26; i++) set(0x24d0 + i, `CIRCLED LATIN SMALL LETTER ${String.fromCharCode(97 + i)}`);
  set(0x24ea, "CIRCLED DIGIT ZERO");
  for (let n = 11; n <= 20; n++) set(0x24eb + n - 11, `NEGATIVE CIRCLED NUMBER ${word(n).toUpperCase()}`);
  for (let n = 1; n <= 10; n++) set(0x24f5 + n - 1, `DOUBLE CIRCLED DIGIT ${word(n).toUpperCase()}`);
  set(0x24ff, "NEGATIVE CIRCLED DIGIT ZERO");

  // Enclosed Alphanumeric Supplement (curated subset with verified official names)
  for (let i = 0; i < 26; i++) {
    if (i <= 18) set(0x1f130 + i, `SQUARED LATIN CAPITAL LETTER ${String.fromCharCode(65 + i)}`);
    if (i <= 18) set(0x1f150 + i, `NEGATIVE CIRCLED LATIN CAPITAL LETTER ${String.fromCharCode(65 + i)}`);
    if (i <= 18) set(0x1f170 + i, `NEGATIVE SQUARED LATIN CAPITAL LETTER ${String.fromCharCode(65 + i)}`);
    set(0x1f1e6 + i, `REGIONAL INDICATOR SYMBOL LETTER ${String.fromCharCode(65 + i)}`);
  }
  set(0x1f18e, "NEGATIVE SQUARED AB");

  await writeNames("enclosed.json", m);
}

// -------------------------------------------------------------------- box.json
{
  const m = {};
  const set = (cp, name) => { m[hex(cp)] = titleCase(name); };

  const boxSuffixes = {
    0x2500: "LIGHT HORIZONTAL",
    0x2501: "HEAVY HORIZONTAL",
    0x2502: "LIGHT VERTICAL",
    0x2503: "HEAVY VERTICAL",
    0x2504: "LIGHT TRIPLE DASH HORIZONTAL",
    0x2505: "HEAVY TRIPLE DASH HORIZONTAL",
    0x2506: "LIGHT TRIPLE DASH VERTICAL",
    0x2507: "HEAVY TRIPLE DASH VERTICAL",
    0x2508: "LIGHT QUADRUPLE DASH HORIZONTAL",
    0x2509: "HEAVY QUADRUPLE DASH HORIZONTAL",
    0x250a: "LIGHT QUADRUPLE DASH VERTICAL",
    0x250b: "HEAVY QUADRUPLE DASH VERTICAL",
    0x250c: "DOWN LIGHT AND RIGHT LIGHT",
    0x250d: "DOWN LIGHT AND RIGHT HEAVY",
    0x250e: "DOWN HEAVY AND RIGHT LIGHT",
    0x250f: "DOWN HEAVY AND RIGHT HEAVY",
    0x2510: "DOWN LIGHT AND LEFT LIGHT",
    0x2511: "DOWN LIGHT AND LEFT HEAVY",
    0x2512: "DOWN HEAVY AND LEFT LIGHT",
    0x2513: "DOWN HEAVY AND LEFT HEAVY",
    0x2514: "UP LIGHT AND RIGHT LIGHT",
    0x2515: "UP LIGHT AND RIGHT HEAVY",
    0x2516: "UP HEAVY AND RIGHT LIGHT",
    0x2517: "UP HEAVY AND RIGHT HEAVY",
    0x2518: "UP LIGHT AND LEFT LIGHT",
    0x2519: "UP LIGHT AND LEFT HEAVY",
    0x251a: "UP HEAVY AND LEFT LIGHT",
    0x251b: "UP HEAVY AND LEFT HEAVY",
    0x251c: "VERTICAL LIGHT AND RIGHT LIGHT",
    0x251d: "VERTICAL LIGHT AND RIGHT HEAVY",
    0x251e: "UP HEAVY AND RIGHT DOWN LIGHT",
    0x251f: "DOWN HEAVY AND RIGHT UP LIGHT",
    0x2520: "VERTICAL HEAVY AND RIGHT LIGHT",
    0x2521: "DOWN LIGHT AND RIGHT UP HEAVY",
    0x2522: "UP LIGHT AND RIGHT DOWN HEAVY",
    0x2523: "VERTICAL HEAVY AND RIGHT HEAVY",
    0x2524: "VERTICAL LIGHT AND LEFT LIGHT",
    0x2525: "VERTICAL LIGHT AND LEFT HEAVY",
    0x2526: "UP HEAVY AND LEFT DOWN LIGHT",
    0x2527: "DOWN HEAVY AND LEFT UP LIGHT",
    0x2528: "VERTICAL HEAVY AND LEFT LIGHT",
    0x2529: "DOWN LIGHT AND LEFT UP HEAVY",
    0x252a: "UP LIGHT AND LEFT DOWN HEAVY",
    0x252b: "VERTICAL HEAVY AND LEFT HEAVY",
    0x252c: "DOWN LIGHT AND HORIZONTAL LIGHT",
    0x252d: "DOWN LIGHT AND HORIZONTAL HEAVY",
    0x252e: "DOWN HEAVY AND HORIZONTAL LIGHT",
    0x252f: "DOWN HEAVY AND HORIZONTAL HEAVY",
    0x2530: "UP LIGHT AND HORIZONTAL LIGHT",
    0x2531: "UP LIGHT AND HORIZONTAL HEAVY",
    0x2532: "UP HEAVY AND HORIZONTAL LIGHT",
    0x2533: "UP HEAVY AND HORIZONTAL HEAVY",
    0x2534: "VERTICAL LIGHT AND HORIZONTAL LIGHT",
    0x2535: "VERTICAL LIGHT AND HORIZONTAL HEAVY",
    0x2536: "UP LIGHT AND DOWN HEAVY",
    0x2537: "DOWN LIGHT AND UP HEAVY",
    0x2538: "VERTICAL HEAVY AND HORIZONTAL LIGHT",
    0x2539: "UP HEAVY AND DOWN LIGHT",
    0x253a: "DOWN HEAVY AND UP LIGHT",
    0x253b: "VERTICAL HEAVY AND HORIZONTAL HEAVY",
    0x253c: "LIGHT VERTICAL AND HORIZONTAL",
    0x253d: "LEFT HEAVY AND RIGHT VERTICAL LIGHT",
    0x253e: "RIGHT HEAVY AND LEFT VERTICAL LIGHT",
    0x253f: "VERTICAL LIGHT AND HORIZONTAL HEAVY",
    0x2540: "UP HEAVY AND DOWN HORIZONTAL LIGHT",
    0x2541: "DOWN HEAVY AND UP HORIZONTAL LIGHT",
    0x2542: "VERTICAL HEAVY AND HORIZONTAL LIGHT",
    0x2543: "LEFT UP HEAVY AND RIGHT DOWN LIGHT",
    0x2544: "RIGHT UP HEAVY AND LEFT DOWN LIGHT",
    0x2545: "LEFT DOWN HEAVY AND RIGHT UP LIGHT",
    0x2546: "RIGHT DOWN HEAVY AND LEFT UP LIGHT",
    0x2547: "DOWN LIGHT AND UP HORIZONTAL HEAVY",
    0x2548: "UP LIGHT AND DOWN HORIZONTAL HEAVY",
    0x2549: "RIGHT LIGHT AND LEFT VERTICAL HEAVY",
    0x254a: "LEFT LIGHT AND RIGHT VERTICAL HEAVY",
    0x254b: "HEAVY VERTICAL AND HORIZONTAL",
    0x254c: "LIGHT DOUBLE DASH HORIZONTAL",
    0x254d: "HEAVY DOUBLE DASH HORIZONTAL",
    0x254e: "LIGHT DOUBLE DASH VERTICAL",
    0x254f: "HEAVY DOUBLE DASH VERTICAL",
    0x2550: "DOUBLE HORIZONTAL",
    0x2551: "DOUBLE VERTICAL",
    0x2552: "DOWN SINGLE AND RIGHT DOUBLE",
    0x2553: "DOWN DOUBLE AND RIGHT SINGLE",
    0x2554: "DOUBLE DOWN AND RIGHT",
    0x2555: "DOWN SINGLE AND LEFT DOUBLE",
    0x2556: "DOWN DOUBLE AND LEFT SINGLE",
    0x2557: "DOUBLE DOWN AND LEFT",
    0x2558: "UP SINGLE AND RIGHT DOUBLE",
    0x2559: "UP DOUBLE AND RIGHT SINGLE",
    0x255a: "DOUBLE UP AND RIGHT",
    0x255b: "UP SINGLE AND LEFT DOUBLE",
    0x255c: "UP DOUBLE AND LEFT SINGLE",
    0x255d: "DOUBLE UP AND LEFT",
    0x255e: "VERTICAL SINGLE AND RIGHT DOUBLE",
    0x255f: "VERTICAL DOUBLE AND RIGHT SINGLE",
    0x2560: "DOUBLE VERTICAL AND RIGHT",
    0x2561: "VERTICAL SINGLE AND LEFT DOUBLE",
    0x2562: "VERTICAL DOUBLE AND LEFT SINGLE",
    0x2563: "DOUBLE VERTICAL AND LEFT",
    0x2564: "DOWN SINGLE AND HORIZONTAL DOUBLE",
    0x2565: "DOWN DOUBLE AND HORIZONTAL SINGLE",
    0x2566: "DOUBLE DOWN AND HORIZONTAL",
    0x2567: "UP SINGLE AND HORIZONTAL DOUBLE",
    0x2568: "UP DOUBLE AND HORIZONTAL SINGLE",
    0x2569: "DOUBLE UP AND HORIZONTAL",
    0x256a: "VERTICAL SINGLE AND HORIZONTAL DOUBLE",
    0x256b: "VERTICAL DOUBLE AND HORIZONTAL SINGLE",
    0x256c: "DOUBLE VERTICAL AND HORIZONTAL",
    0x256d: "LIGHT ARC DOWN AND RIGHT",
    0x256e: "LIGHT ARC DOWN AND LEFT",
    0x256f: "LIGHT ARC UP AND LEFT",
    0x2570: "LIGHT ARC UP AND RIGHT",
    0x2571: "LIGHT DIAGONAL UPPER RIGHT TO LOWER LEFT",
    0x2572: "LIGHT DIAGONAL UPPER LEFT TO LOWER RIGHT",
    0x2573: "LIGHT DIAGONAL CROSS",
    0x2574: "LIGHT LEFT",
    0x2575: "LIGHT UP",
    0x2576: "LIGHT RIGHT",
    0x2577: "LIGHT DOWN",
    0x2578: "HEAVY LEFT",
    0x2579: "HEAVY UP",
    0x257a: "HEAVY RIGHT",
    0x257b: "HEAVY DOWN",
    0x257c: "LIGHT LEFT AND HEAVY RIGHT",
    0x257d: "LIGHT UP AND HEAVY DOWN",
    0x257e: "HEAVY LEFT AND LIGHT RIGHT",
    0x257f: "HEAVY UP AND LIGHT DOWN",
  };
  for (const [cp, suffix] of Object.entries(boxSuffixes)) set(Number(cp), `BOX DRAWINGS ${suffix}`);

  // Block Elements (formulaic)
  set(0x2580, "UPPER HALF BLOCK");
  const lower = ["one eighth", "one quarter", "three eighths", "half", "five eighths", "three quarters", "seven eighths"];
  for (let i = 0; i < lower.length; i++) set(0x2581 + i, `LOWER ${lower[i].toUpperCase()} BLOCK`);
  set(0x2588, "FULL BLOCK");
  const left = ["seven eighths", "three quarters", "five eighths", "half", "three eighths", "one quarter", "one eighth"];
  for (let i = 0; i < left.length; i++) set(0x2589 + i, `LEFT ${left[i].toUpperCase()} BLOCK`);
  set(0x2590, "RIGHT HALF BLOCK");
  set(0x2591, "LIGHT SHADE");
  set(0x2592, "MEDIUM SHADE");
  set(0x2593, "DARK SHADE");
  set(0x2594, "UPPER ONE EIGHTH BLOCK");
  set(0x2595, "RIGHT ONE EIGHTH BLOCK");
  const quadrants = {
    0x2596: "QUADRANT LOWER LEFT",
    0x2597: "QUADRANT LOWER RIGHT",
    0x2598: "QUADRANT UPPER LEFT",
    0x2599: "QUADRANT UPPER LEFT AND LOWER LEFT AND LOWER RIGHT",
    0x259a: "QUADRANT UPPER LEFT AND LOWER RIGHT",
    0x259b: "QUADRANT UPPER LEFT AND UPPER RIGHT AND LOWER LEFT",
    0x259c: "QUADRANT UPPER LEFT AND UPPER RIGHT AND LOWER RIGHT",
    0x259d: "QUADRANT UPPER RIGHT",
    0x259e: "QUADRANT UPPER RIGHT AND LOWER LEFT",
    0x259f: "QUADRANT UPPER RIGHT AND LOWER LEFT AND LOWER RIGHT",
  };
  for (const [cp, name] of Object.entries(quadrants)) set(Number(cp), name);

  await writeNames("box.json", m);
}

// --------------------------------------------------------------------- cjk.json
{
  const m = {};
  m["3000"] = "Ideographic Space";
  m["303B"] = "Vertical Ideographic Iteration Mark";
  m["303C"] = "Masu Mark";
  await writeNames("cjk.json", m);
}
