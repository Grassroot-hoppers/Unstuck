/**
 * Dev-only: full Jobs fixture → raw scores → interpretive patterns.
 * Run: node scripts/checkpoint-interpretive-jobs.mjs
 */
import fs from 'fs';

const html = fs.readFileSync('src/assessment.html', 'utf8');
const start = html.indexOf('window.UNSTUCK_ITEMS = [');
const from = html.indexOf('[', start);
let depth = 0;
let i = from;
for (; i < html.length; i++) {
  const c = html[i];
  if (c === '[') depth++;
  else if (c === ']') {
    depth--;
    if (depth === 0) {
      i++;
      break;
    }
  }
}
const ITEMS = (0, eval)(`(${html.slice(from, i)})`);

const tp = fs.readFileSync('src/test-personas.js', 'utf8');
const jobsStart = tp.indexOf("id: 'jobs'");
const ansStart = tp.indexOf('answers: [', jobsStart);
const ansFrom = tp.indexOf('[', ansStart);
depth = 0;
let j = ansFrom;
for (; j < tp.length; j++) {
  if (tp[j] === '[') depth++;
  else if (tp[j] === ']') {
    depth--;
    if (depth === 0) {
      j++;
      break;
    }
  }
}
const answersArr = (0, eval)(`(${tp.slice(ansFrom, j)})`);
const ansMap = Object.fromEntries(answersArr.map((e) => [e.num, e.answer]));

function scoreItem(item, response) {
  if (item.keyed === 'minus') return 6 - response;
  return response;
}

const raw = {};
for (const d of 'NEOAC') {
  for (let f = 1; f <= 6; f++) raw[d + f] = 0;
}
for (const item of ITEMS) {
  const response = ansMap[item.num];
  if (response === undefined) throw new Error(`missing answer ${item.num}`);
  raw[item.domain + item.facet] += scoreItem(item, response);
}

const { scoreProfile } = await import('../src/engine/scoring.js');
const { evaluateRules } = await import('../src/engine/rules.js');
const { buildInterpretiveReport } = await import('../src/engine/interpretive/build-report.js');
const { getInstrumentConfig } = await import('../src/engine/instruments/ipip-neo-120.config.js');

const profile = scoreProfile(raw);
const fired = evaluateRules(profile);
const rep = buildInterpretiveReport({
  profile,
  rawScores: raw,
  instrumentConfig: getInstrumentConfig(),
  firedRules: fired,
});

console.log('Jobs O facets', {
  O1: raw.O1,
  O2: raw.O2,
  O3: raw.O3,
  O4: raw.O4,
  O5: raw.O5,
  O6: raw.O6,
});
console.log('scatter.O', profile.scatter.O, 'domains.O.proseRegister', rep.domains.O.proseRegister);
console.log('opennessChannels.signalClass', {
  aesthetic: rep.opennessChannels.aesthetic.signalClass,
  cognitive: rep.opennessChannels.cognitive.signalClass,
  values: rep.opennessChannels.values.signalClass,
});
const need = ['disagreeable_leader', 'flag_A1_low', 'flag_A2_low', 'flag_C4_high'];
for (const id of need) {
  const p = rep.patterns.find((x) => x.ruleId === id);
  console.log(
    id,
    'fired',
    !!p,
    'researchBlock' in (p || {}),
    'value',
    p ? p.researchBlock : undefined,
  );
}
console.log('Total patterns', rep.patterns.length);
