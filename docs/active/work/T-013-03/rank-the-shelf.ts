/*
 * T-013-03 — the whole shelf, ranked twice, against the two occasions that invert each other.
 *
 * Produces every number in docs/gaps/two-that-invert.md. Reads src/generated/recipes.json and
 * imports src/lib/ directly; writes nothing.
 *
 *   PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH" \
 *     node docs/active/work/T-013-03/rank-the-shelf.ts
 *
 * Node 24 strips the types natively, so this runs with no build step and uses the site's own
 * buildSchedule(), costOf() and diagnose() rather than a second model of the same graph. Same
 * shape as docs/active/work/T-012-02/read-the-shelf.ts, for the same reason: a document whose
 * arithmetic cannot be re-run is a document nobody can check.
 *
 * THE PROFILE TABLES IN §A ARE THE REVIEWABLE SURFACE. Every rate is a line transcribed from
 * docs/knowledge/occasions.md §3.3 and §3.4, with the section it came from written next to it.
 * NO RATE IS TUNED. The ticket is explicit that a profile adjusted to flatter its examples has
 * proved nothing, so the transcription is checked against occasions.md's own worked figure
 * (chili-con-carne = −95.0) and the run ABORTS if it does not reproduce.
 *
 * There is no `if (occasion === 'party')` anywhere in the arithmetic. The inversion is entirely
 * in the signs of the rate table, which is occasions.md §3.2's claim asserted structurally:
 * "the same number, one sign".
 */
import { readFileSync } from 'node:fs';
import { buildSchedule, handsOnEvidence, type Confidence } from '../../../../src/lib/schedule.ts';
import { costOf, servingsOf } from '../../../../src/lib/scaling.ts';
import { diagnose, type Meal } from '../../../../src/lib/meal.ts';

const R: any[] = JSON.parse(readFileSync('src/generated/recipes.json', 'utf8'));

const TARGET_SERVINGS = 12;
const MINUTES_PER_DAY = 1440;

/* =========================================================== §A  THE PROFILES

 * Two occasions, transcribed. `higherIsBetter` is the only structural difference between them;
 * everything else is a signed number in one table.
 */

type SlackLevel = 'forgiving' | 'narrow' | 'unforgiving';

interface Rates {
  /** occasions.md: `standing(12)`. */
  standingPerMinute: number;
  /** occasions.md: `longest(12)`. */
  longestPerMinute: number;
  /** occasions.md: `washingUp.count`. */
  washingUpPerThing: number;
  /** occasions.md: `keeps`. */
  keepsPerDay: number;
  /** Days, not minutes. occasions.md §3.3: "capped at 4". */
  keepsCapDays: number;
  slackForgiving: number;
  slackUnforgiving: number;
}

interface Profile {
  key: 'family' | 'party';
  name: string;
  /** occasions.md §3.3's score is a COST; §3.4's is a GOOD. */
  higherIsBetter: boolean;
  rates: Rates;
  /**
   * occasions.md §3.6's rule, and its two clauses travel together because they are one rule:
   *
   *   "A profile that gives hands-on time a positive weight may score only claimed minutes —
   *    handsOnMinutes less assumedHandsOnMinutes — and must put evidence: unknown into
   *    cannot-say rather than ranking it."
   */
  claimedMinutesOnly: boolean;
  source: string;
}

const FAMILY: Profile = {
  key: 'family',
  name: 'A big family holiday meal, cooked alone',
  higherIsBetter: false,
  rates: {
    standingPerMinute: +1,
    longestPerMinute: +1,
    washingUpPerThing: +5,
    keepsPerDay: -20,
    keepsCapDays: 4,
    slackForgiving: -20,
    slackUnforgiving: 0, // gated before it can score
  },
  claimedMinutesOnly: false,
  source: 'docs/knowledge/occasions.md §3.3',
};

const PARTY: Profile = {
  key: 'party',
  name: 'A dumpling party for friends',
  higherIsBetter: true,
  rates: {
    standingPerMinute: +1, // THE SIGN FLIP. The labour is the party.
    longestPerMinute: +0.5,
    washingUpPerThing: -2,
    keepsPerDay: 0, // it is eaten tonight
    keepsCapDays: 4,
    slackForgiving: +20,
    slackUnforgiving: -40, // declared in §3.4's table; the gate means it never fires
  },
  claimedMinutesOnly: true,
  source: 'docs/knowledge/occasions.md §3.4',
};

const PROFILES = [FAMILY, PARTY];

/* ============================================================== §B  READING

 * One pass over every file. slack, keeps, washingUp and capacity arrive already parsed in
 * recipes.json, so their readers are not called again — re-parsing an object would be a second
 * reading of one line.
 */

interface Row {
  slug: string;
  category: string;
  writtenServings: number | null;
  /** Null when costOf() returned null: no readable `>> servings:` to scale from. */
  standingAt: number | null;
  assumedStandingAt: number;
  longestAt: number | null;
  elapsedAt: number | null;
  /** NULL means never declared. 0 means declared as nothing. The difference is load-bearing. */
  washingUpCount: number | null;
  /** NULL means never declared. 0 means "not at all" — the author said it does not keep. */
  keepsDays: number | null;
  slackLevel: SlackLevel | null;
  evidence: Confidence;
  bindsAt12: boolean;
  untimedCount: number;
}

function read(recipe: any): Row {
  const schedule = buildSchedule(recipe);
  const cost = costOf(recipe, TARGET_SERVINGS, schedule);
  return {
    slug: recipe.slug,
    category: recipe.category,
    writtenServings: servingsOf(recipe),
    standingAt: cost ? cost.standing.at : null,
    assumedStandingAt: cost ? cost.assumedStandingMinutes : schedule.assumedHandsOnMinutes,
    longestAt: cost ? cost.longest.at : null,
    elapsedAt: cost ? cost.elapsed.at : null,
    washingUpCount: recipe.washingUp ? recipe.washingUp.count : null,
    keepsDays: recipe.keeps ? recipe.keeps.minutes / MINUTES_PER_DAY : null,
    slackLevel: recipe.slack ? recipe.slack.level : null,
    evidence: cost ? cost.evidence : handsOnEvidence(schedule),
    bindsAt12: cost ? cost.batches.binds : false,
    untimedCount: schedule.untimedCount,
  };
}

/* ============================================================== §C  SCORING

 * Three answers, never two: ranked · rejected · cannot say. `because` is required even on a
 * ranked verdict, so all 1,370 of them can be explained without re-reading this file.
 */

type Answer = 'ranked' | 'rejected' | 'cannot-say';

interface Verdict {
  answer: Answer;
  score: number | null;
  because: string;
}

/** Never negative: a cap on days, per §3.3, and "not at all" is a real declared zero. */
const keepsTerm = (row: Row, rates: Rates): number =>
  row.keepsDays === null ? 0 : rates.keepsPerDay * Math.min(row.keepsDays, rates.keepsCapDays);

function judge(row: Row, profile: Profile): Verdict {
  const { rates } = profile;

  // The gate. occasions.md §3.3 and §3.4 both reject `unforgiving`, for different reasons.
  if (row.slackLevel === 'unforgiving') {
    return { answer: 'rejected', score: null, because: 'gate: slack is unforgiving' };
  }
  // Not a gate the occasion wrote — a gap in the collection. There is no twelve-serving figure
  // at all, which is a different silence from "nobody timed it".
  if (row.standingAt === null) {
    return { answer: 'cannot-say', score: null, because: 'no readable >> servings: to scale from' };
  }
  // §3.6's rule. Binds the party only, because only the party pays for hands-on time.
  if (profile.claimedMinutesOnly && row.evidence === 'unknown') {
    return {
      answer: 'cannot-say',
      score: null,
      because: 'hands-on evidence is unknown, and this profile pays for hands-on minutes',
    };
  }

  const standing = profile.claimedMinutesOnly
    ? Math.max(0, row.standingAt - row.assumedStandingAt)
    : row.standingAt;

  const score =
    rates.standingPerMinute * standing +
    rates.longestPerMinute * (row.longestAt ?? 0) +
    rates.washingUpPerThing * (row.washingUpCount ?? 0) +
    keepsTerm(row, rates) +
    (row.slackLevel === 'forgiving' ? rates.slackForgiving : 0) +
    (row.slackLevel === 'unforgiving' ? rates.slackUnforgiving : 0);

  return { answer: 'ranked', score: Math.round(score * 100) / 100, because: 'scored' };
}

/* ------------------------------------------------- the stop-the-line checks */

const rows = R.map(read);
const byslug = new Map<string, Row>(rows.map((row) => [row.slug, row]));

function abort(message: string): never {
  console.error(`\nABORT — ${message}`);
  process.exit(1);
}

{
  // occasions.md §3.3 works this one out longhand: 0 + 0 + (1×5) + (4×−20) + (−20) = −95.
  const chili = byslug.get('chili-con-carne');
  if (!chili) abort('chili-con-carne is not in the collection; §3.3 cannot be reproduced');
  const verdict = judge(chili!, FAMILY);
  if (verdict.score !== -95) {
    abort(
      `the family profile scores chili-con-carne at ${verdict.score}, not −95.0 as ` +
        `occasions.md §3.3 works it out. Either the transcription is wrong or the file changed. ` +
        `DO NOT adjust a rate to make this pass.`,
    );
  }
  console.log('transcription check: chili-con-carne = −95.0 under the family profile — reproduced');

  // The party's unforgiving term is declared in §3.4's table and can never fire, because the
  // gate removed those recipes first. Asserted rather than trusted.
  const fired = rows.filter((row) => judge(row, PARTY).answer === 'ranked' && row.slackLevel === 'unforgiving');
  if (fired.length > 0) abort(`the party's unforgiving term fired on ${fired.length} recipes; the gate has stopped gating`);
  console.log("transcription check: the party's unforgiving term never fires — the gate holds\n");
}

/* ============================================================ §D  THE LISTS */

interface Ranked {
  slug: string;
  score: number;
  /** Competition rank: equal scores share a rank, because a tie is not a distinction. */
  rank: number;
}

interface Listing {
  profile: Profile;
  verdicts: Map<string, Verdict>;
  ranked: Ranked[];
  rejected: string[];
  cannotSay: { slug: string; because: string }[];
}

function rank(profile: Profile): Listing {
  const verdicts = new Map<string, Verdict>();
  const scored: { slug: string; score: number }[] = [];
  const rejected: string[] = [];
  const cannotSay: { slug: string; because: string }[] = [];

  for (const row of rows) {
    const verdict = judge(row, profile);
    verdicts.set(row.slug, verdict);
    if (verdict.answer === 'ranked') scored.push({ slug: row.slug, score: verdict.score! });
    else if (verdict.answer === 'rejected') rejected.push(row.slug);
    else cannotSay.push({ slug: row.slug, because: verdict.because });
  }

  // Ties broken by slug so two runs of this script are byte-identical.
  scored.sort((a, b) =>
    a.score === b.score ? a.slug.localeCompare(b.slug) : profile.higherIsBetter ? b.score - a.score : a.score - b.score,
  );

  const ranked: Ranked[] = [];
  let lastScore: number | null = null;
  let lastRank = 0;
  for (const [i, entry] of scored.entries()) {
    if (lastScore === null || entry.score !== lastScore) lastRank = i + 1;
    lastScore = entry.score;
    ranked.push({ ...entry, rank: lastRank });
  }

  return { profile, verdicts, ranked, rejected, cannotSay: cannotSay.sort((a, b) => a.slug.localeCompare(b.slug)) };
}

const listings = new Map(PROFILES.map((p) => [p.key, rank(p)] as const));
const family = listings.get('family')!;
const party = listings.get('party')!;

const pct = (n: number, of: number) => `${((100 * n) / of).toFixed(1)}%`;
const line = (title: string) => console.log(`\n${'='.repeat(78)}\n${title}\n${'='.repeat(78)}`);

function why(slug: string): string {
  const row = byslug.get(slug)!;
  const parts: string[] = [];
  parts.push(`standing ${row.standingAt?.toFixed(1) ?? '—'}`);
  if (row.assumedStandingAt > 0) parts.push(`(${row.assumedStandingAt.toFixed(1)} assumed)`);
  parts.push(`longest ${row.longestAt?.toFixed(1) ?? '—'}`);
  parts.push(`wash ${row.washingUpCount ?? '—'}`);
  parts.push(`keeps ${row.keepsDays === null ? '—' : `${row.keepsDays}d`}`);
  parts.push(`slack ${row.slackLevel ?? '—'}`);
  parts.push(row.evidence);
  return parts.join(' · ');
}

function report(listing: Listing) {
  const { profile, ranked, rejected, cannotSay } = listing;
  line(`${profile.name}  —  ${profile.source}`);
  console.log(
    `rates: standing ${profile.rates.standingPerMinute} · longest ${profile.rates.longestPerMinute} · ` +
      `wash ${profile.rates.washingUpPerThing} · keeps ${profile.rates.keepsPerDay}/day capped at ` +
      `${profile.rates.keepsCapDays} · forgiving ${profile.rates.slackForgiving} · ` +
      `unforgiving ${profile.rates.slackUnforgiving} · ${profile.higherIsBetter ? 'higher' : 'lower'} is better` +
      `${profile.claimedMinutesOnly ? ' · claimed minutes only (§3.6)' : ''}`,
  );

  console.log(`\nthree answers over ${R.length} files`);
  console.log(`  ranked      ${String(ranked.length).padStart(4)}  ${pct(ranked.length, R.length)}`);
  console.log(`  rejected    ${String(rejected.length).padStart(4)}  ${pct(rejected.length, R.length)}  (slack: unforgiving)`);
  console.log(`  cannot say  ${String(cannotSay.length).padStart(4)}  ${pct(cannotSay.length, R.length)}`);
  const causes = new Map<string, number>();
  for (const entry of cannotSay) causes.set(entry.because, (causes.get(entry.because) ?? 0) + 1);
  for (const [because, n] of [...causes].sort((a, b) => b[1] - a[1])) console.log(`      ${String(n).padStart(4)}  ${because}`);
  if (ranked.length + rejected.length + cannotSay.length !== R.length) abort('the three answers do not sum to the collection');

  const scores = ranked.map((r) => r.score);
  const distinct = new Set(scores).size;
  const groups = new Map<number, number>();
  for (const s of scores) groups.set(s, (groups.get(s) ?? 0) + 1);
  const [biggestScore, biggestSize] = [...groups].sort((a, b) => b[1] - a[1])[0] ?? [0, 0];
  console.log(`\nseparation`);
  console.log(`  distinct scores       ${distinct} over ${ranked.length} ranked`);
  console.log(`  largest tie group     ${biggestSize} recipes all scoring ${biggestScore}`);
  console.log(`  ranked on a tie       ${ranked.length - distinct} recipes share a score with somebody`);

  const noSlack = ranked.filter((r) => byslug.get(r.slug)!.slackLevel === null).length;
  const noKeeps = ranked.filter((r) => byslug.get(r.slug)!.keepsDays === null).length;
  const noWash = ranked.filter((r) => byslug.get(r.slug)!.washingUpCount === null).length;
  console.log(`\nhow much of this ranking is absence`);
  console.log(`  ranked with no >> slack:        ${noSlack}  ${pct(noSlack, ranked.length)}`);
  console.log(`  ranked with no >> keeps:        ${noKeeps}  ${pct(noKeeps, ranked.length)}`);
  console.log(`  ranked with no >> washing-up:   ${noWash}  ${pct(noWash, ranked.length)}`);

  const standingTotal = ranked.reduce((sum, r) => sum + (byslug.get(r.slug)!.standingAt ?? 0), 0);
  const assumedTotal = ranked.reduce((sum, r) => sum + byslug.get(r.slug)!.assumedStandingAt, 0);
  console.log(
    `  standing minutes that are a fallback rather than a claim: ` +
      `${assumedTotal.toFixed(0)} of ${standingTotal.toFixed(0)}  ${pct(assumedTotal, standingTotal || 1)}`,
  );

  // "Genuinely good" — the rule is declared in plan.md §6 before any number was read: ranked, AND
  // at least two of the four profile fields actually declared.
  const declaredFields = (slug: string) => {
    const row = byslug.get(slug)!;
    return (
      (row.slackLevel !== null ? 1 : 0) +
      (row.keepsDays !== null ? 1 : 0) +
      (row.washingUpCount !== null ? 1 : 0) +
      (row.evidence !== 'unknown' ? 1 : 0)
    );
  };
  const good = ranked.filter((r) => declaredFields(r.slug) >= 2);
  const allFour = ranked.filter((r) => declaredFields(r.slug) === 4);
  console.log(`\nadmissible against genuinely good`);
  console.log(`  ranked (admissible)   ${ranked.length}`);
  console.log(`  >= 2 fields declared  ${good.length}  ${pct(good.length, ranked.length)}   <- genuinely good`);
  console.log(`  all 4 declared        ${allFour.length}`);

  const show = (label: string, entries: Ranked[]) => {
    console.log(`\n${label}`);
    for (const entry of entries) {
      console.log(`  ${String(entry.rank).padStart(4)}  ${String(entry.score).padStart(8)}  ${entry.slug.padEnd(34)} ${why(entry.slug)}`);
    }
  };
  show('top 20', ranked.slice(0, 20));
  show('bottom 20', ranked.slice(-20));
}

report(family);
report(party);

/* ============================================================ §E  OVERLAP */

line('Do the two lists differ');

const familyTop10 = family.ranked.filter((r) => r.rank <= 10).map((r) => r.slug);
const partyTop10 = party.ranked.filter((r) => r.rank <= 10).map((r) => r.slug);
const familyTop10Cut = family.ranked.slice(0, 10).map((r) => r.slug);
const partyTop10Cut = party.ranked.slice(0, 10).map((r) => r.slug);

const intersect = (a: string[], b: string[]) => a.filter((slug) => b.includes(slug));

console.log(`\nA. top ten, as a reader would see it (first ten rows of each list)`);
console.log(`   family: ${familyTop10Cut.join(', ')}`);
console.log(`   party : ${partyTop10Cut.join(', ')}`);
const topCutShared = intersect(familyTop10Cut, partyTop10Cut);
console.log(`   shared: ${topCutShared.length} of 10  ${topCutShared.join(', ') || '(none)'}`);

console.log(`\n   by competition rank <= 10, ties included: family ${familyTop10.length}, party ${partyTop10.length}`);
const topRankShared = intersect(familyTop10, partyTop10);
console.log(`   shared: ${topRankShared.length}  ${topRankShared.slice(0, 20).join(', ') || '(none)'}`);

const familyRankedSet = new Set(family.ranked.map((r) => r.slug));
const partyRankedSet = new Set(party.ranked.map((r) => r.slug));
const both = [...familyRankedSet].filter((slug) => partyRankedSet.has(slug));
const union = new Set([...familyRankedSet, ...partyRankedSet]);
console.log(`\nB. Jaccard over the two RANKED SETS (a coverage fact, not a ranking fact)`);
console.log(`   ranked by both ${both.length} · ranked by either ${union.size} · Jaccard ${(both.length / union.size).toFixed(3)}`);

/** Spearman over the population both profiles rank, on competition ranks with ties averaged. */
function spearman(slugs: string[]): number {
  const ranksOf = (listing: Listing) => {
    const byScore = new Map<number, number[]>();
    const order = listing.ranked.filter((r) => slugs.includes(r.slug));
    order.forEach((entry, i) => {
      const list = byScore.get(entry.score) ?? [];
      list.push(i + 1);
      byScore.set(entry.score, list);
    });
    const out = new Map<string, number>();
    for (const entry of order) {
      const positions = byScore.get(entry.score)!;
      out.set(entry.slug, positions.reduce((a, b) => a + b, 0) / positions.length);
    }
    return out;
  };
  const a = ranksOf(family);
  const b = ranksOf(party);
  const n = slugs.length;
  const mean = (n + 1) / 2;
  let num = 0;
  let da = 0;
  let db = 0;
  for (const slug of slugs) {
    const x = a.get(slug)! - mean;
    const y = b.get(slug)! - mean;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  return num / Math.sqrt(da * db);
}

const rho = spearman(both);
console.log(`\nC. Spearman rho over the ${both.length} recipes BOTH profiles rank`);
console.log(`   rho = ${rho.toFixed(3)}`);
console.log(
  `   +1 would mean the two profiles are one profile (the "easy is good" collapse the ticket names).`,
);
console.log(`   −1 would mean a clean inversion. Near 0 means they are reading different fields.`);

/* =========================================================== §F  INVERSION */

line('The inversion test');

const familyWorst = family.ranked[family.ranked.length - 1];
const partyRankOf = new Map(party.ranked.map((r) => [r.slug, r]));
const familyRankOf = new Map(family.ranked.map((r) => [r.slug, r]));

console.log(`\n1. The literal test — the dish the holiday list ranks worst`);
console.log(`   family's last ranked: ${familyWorst.slug} (rank ${familyWorst.rank}, score ${familyWorst.score})`);
const worstInParty = partyRankOf.get(familyWorst.slug);
console.log(
  worstInParty
    ? `   in the party's list: YES — rank ${worstInParty.rank} of ${party.ranked.length}, score ${worstInParty.score}`
    : `   in the party's list: NO — ${party.verdicts.get(familyWorst.slug)!.answer}: ${party.verdicts.get(familyWorst.slug)!.because}`,
);

console.log(`\n   everything sharing the family's worst score (${familyWorst.score}):`);
for (const entry of family.ranked.filter((r) => r.score === familyWorst.score)) {
  const inParty = partyRankOf.get(entry.slug);
  console.log(
    `     ${entry.slug.padEnd(34)} party: ${inParty ? `rank ${inParty.rank}` : party.verdicts.get(entry.slug)!.because}`,
  );
}

console.log(`\n2. The bottom ten against the top ten`);
const familyWorst10 = family.ranked.slice(-10).map((r) => r.slug);
const inPartyTop10 = intersect(familyWorst10, partyTop10Cut);
console.log(`   family's worst ten: ${familyWorst10.join(', ')}`);
console.log(`   of those, in the party's top ten: ${inPartyTop10.length}  ${inPartyTop10.join(', ') || '(none)'}`);
console.log(`   where each lands in the party's list:`);
for (const slug of familyWorst10) {
  const inParty = partyRankOf.get(slug);
  console.log(`     ${slug.padEnd(34)} ${inParty ? `rank ${inParty.rank} of ${party.ranked.length}` : party.verdicts.get(slug)!.because}`);
}

console.log(`\n3. The named case — gyoza, occasions.md §3.5's headline claim (#17 family, #1 party)`);
for (const slug of ['gyoza', 'green-beans', 'samosa', 'egg-rolls']) {
  const f = familyRankOf.get(slug);
  const p = partyRankOf.get(slug);
  console.log(
    `   ${slug.padEnd(16)} family ${f ? `rank ${f.rank}/${family.ranked.length} (${f.score})` : family.verdicts.get(slug)!.because}` +
      `  |  party ${p ? `rank ${p.rank}/${party.ranked.length} (${p.score})` : party.verdicts.get(slug)!.because}`,
  );
}

/* ================================================= §H  THE SEVENTEEN, AGAIN */

line("occasions.md §3.5's seventeen, reproduced at 685 files");

const SEVENTEEN = [
  'chili-con-carne', 'smoked-turkey-breast', 'turkey-brine', 'cranberry-sauce', 'mashed-potatoes',
  'baked-turkey-wings', 'turkey-pan-gravy', 'green-beans', 'gyoza', 'samosa', 'egg-rolls',
  'ham-sui-gok', 'har-gow', 'char-siu-bao', 'wonton-soup', 'siu-mai', 'xiao-long-bao',
];

console.log('\n  slug                            family (of 685)              party (of 685)');
for (const slug of SEVENTEEN) {
  if (!byslug.has(slug)) {
    console.log(`  ${slug.padEnd(30)} NOT IN THE COLLECTION`);
    continue;
  }
  const f = familyRankOf.get(slug);
  const p = partyRankOf.get(slug);
  const fs = f ? `#${f.rank} (${f.score})` : family.verdicts.get(slug)!.answer;
  const ps = p ? `#${p.rank} (${p.score})` : party.verdicts.get(slug)!.answer;
  console.log(`  ${slug.padEnd(30)} ${fs.padEnd(28)} ${ps}`);
}

// The same seventeen ranked ONLY against each other, which is what §3.5 actually did.
line("The same seventeen ranked only against each other — §3.5's own experiment, re-run");
for (const profile of PROFILES) {
  const listing = listings.get(profile.key)!;
  const subset = listing.ranked.filter((r) => SEVENTEEN.includes(r.slug));
  console.log(`\n  ${profile.name}`);
  subset.forEach((entry, i) => console.log(`    #${String(i + 1).padStart(2)}  ${String(entry.score).padStart(8)}  ${entry.slug}`));
  const out = SEVENTEEN.filter((slug) => byslug.has(slug) && !subset.some((r) => r.slug === slug));
  for (const slug of out) console.log(`     --  ${listing.verdicts.get(slug)!.answer.padStart(10)}  ${slug}  (${listing.verdicts.get(slug)!.because})`);
}

/* ================================================= §G  CAN IT FEED EITHER */

line('Can the shelf feed either');

const DUMPLING_DIR = 'dumplings-and-rolls';
const dumplingFiles = R.filter((r) => r.path.includes(DUMPLING_DIR)).map((r) => r.slug);
console.log(`\nthe dumpling folder: ${dumplingFiles.length} files`);
console.log(`  ${dumplingFiles.join(', ')}`);
console.log(`\nwhere each lands in the party's list:`);
for (const slug of dumplingFiles) {
  const p = partyRankOf.get(slug);
  console.log(`  ${slug.padEnd(32)} ${p ? `rank ${p.rank} of ${party.ranked.length}, score ${p.score}` : `${party.verdicts.get(slug)!.answer}: ${party.verdicts.get(slug)!.because}`}   ${why(slug)}`);
}

/*
 * Slug, title, `aka` AND tags — all four, because `cornbread-dressing` is the collection's
 * stuffing and says so only in its `aka` list. A search that reads slugs alone reports a hole
 * that is not there, which is the failure mode this whole document is about.
 */
const haystack = (r: any) => [r.slug, r.title, ...(r.aka ?? []), ...(r.tags ?? [])].join(' ').toLowerCase();

const HOLIDAY_WORDS = [
  'turkey', 'cranberry', 'stuffing', 'dressing', 'gravy', 'roast', 'pie', 'mashed', 'yam',
  'casserole', 'gratin', 'sprout', 'green bean', 'dinner roll', 'creamed corn',
];
const holidayish = R.filter((r) => HOLIDAY_WORDS.some((w) => haystack(r).includes(w))).map((r) => r.slug);

// The plate's vocabulary, asked as absence rather than presence.
const WANTED = [
  'whole roast turkey', 'stuffing', 'pumpkin pie', 'green bean casserole', 'gratin', 'goose',
  'prime rib', 'jiaozi', 'potsticker', 'pierogi', 'ravioli', 'manti', 'momo', 'khinkali',
  'dumpling wrapper', 'dumpling dough',
];
console.log(`\nwhat the plate's vocabulary asks for, searched over slug + title + aka + tags:`);
for (const want of WANTED) {
  const hits = R.filter((r) => haystack(r).includes(want.split(' ').slice(-1)[0])).map((r) => r.slug);
  console.log(`  ${want.padEnd(22)} ${hits.length ? hits.slice(0, 6).join(', ') : '— NOTHING'}`);
}

console.log(`\nholiday-shaped files by slug, title, aka or tag (${holidayish.length}):`);
for (const slug of holidayish) {
  const f = familyRankOf.get(slug);
  console.log(`  ${slug.padEnd(32)} ${f ? `rank ${f.rank} of ${family.ranked.length}, score ${f.score}` : `${family.verdicts.get(slug)!.answer}: ${family.verdicts.get(slug)!.because}`}`);
}

/* ==================================================== §I  THE HOLIDAY MEAL

 * Chosen by hand from the family ranking above, one per slot, with the rank each came in at
 * written next to it. The slot rules are in plan.md §7 and were written before the ranking ran.
 * Where the ranking's own pick for a slot was overridden, the comment says why — that override
 * is itself a finding about the profile.
 */

const PLATE: { slug: string; slot: string; note: string }[] = [
  { slug: 'pot-roast', slot: 'centrepiece', note: "family #1 of 592, and the ranking's own pick" },
  { slug: 'mashed-potatoes', slot: 'starch', note: 'family #105 — the four-way-tied middle at 0' },
  { slug: 'roasted-brussels-sprouts', slot: 'vegetable', note: 'family #357 — best-ranked green side' },
  { slug: 'green-beans', slot: 'vegetable', note: 'family #468 — the ranking says avoid it; a household cooks it anyway' },
  { slug: 'cranberry-sauce', slot: 'sauce', note: 'family #105' },
  { slug: 'apple-pie', slot: 'dessert', note: 'family #105' },
];

/** The same plate with the gated centrepiece §3.3 says the profile is right to reject. */
const PLATE_WITH_TURKEY: { slug: string; slot: string; note: string }[] = [
  { slug: 'smoked-turkey-breast', slot: 'centrepiece', note: 'REJECTED by the gate: slack unforgiving' },
  ...PLATE.filter((d) => d.slot !== 'centrepiece'),
];

line('The holiday meal, diagnosed');

const recipeOf = (slug: string) => R.find((r) => r.slug === slug);

function diagnosePlate(label: string, dishes: typeof PLATE, cookCounts: number[]) {
  console.log(`\n### ${label}`);
  for (const dish of dishes) {
    const f = familyRankOf.get(dish.slug);
    const verdict = family.verdicts.get(dish.slug)!;
    console.log(
      `  ${dish.slot.padEnd(12)} ${dish.slug.padEnd(26)} family ${f ? `#${f.rank} of ${family.ranked.length}` : verdict.answer.padEnd(12)}   ${dish.note}`,
    );
  }
  for (const cooks of cookCounts) {
    const meal: Meal = {
      dishes: dishes.map((d) => ({ recipe: recipeOf(d.slug), servings: TARGET_SERVINGS })),
      cooks,
      burners: 4,
      ovenShelves: null,
    };
    console.log(`\n--- diagnose(), ${cooks} cook${cooks > 1 ? 's' : ''}, 4 burners, ovenShelves null ---`);
    console.log(JSON.stringify(diagnose(meal), null, 2));
  }
}

diagnosePlate('Plate A — assembled from the family ranking', PLATE, [1, 2]);
diagnosePlate(
  'Plate B — the same plate with the gated centrepiece §3.3 says the profile is right to reject',
  PLATE_WITH_TURKEY,
  [1],
);

/*
 * Plate C is not a meal and is not proposed as one. It is an UPPER BOUND: the six dishes in the
 * whole collection with the most hands-on minutes at twelve servings. If a hands-pile-up cannot
 * be produced from these six, it cannot be produced from any six, and S-013's promised sentence
 * — "seventy minutes of hands-on work falls in the last forty-five" — is a sentence this
 * collection cannot currently say about anything.
 */
line('Plate C — the upper bound: the six most hands-on dishes in the collection');
const heaviest = [...rows]
  .filter((row) => row.standingAt !== null)
  .sort((a, b) => b.standingAt! - a.standingAt!)
  .slice(0, 6);
console.log(`\n  the six, by standing minutes at ${TARGET_SERVINGS} servings:`);
for (const row of heaviest) {
  console.log(`    ${row.slug.padEnd(32)} ${row.standingAt!.toFixed(1).padStart(7)} min  (${row.assumedStandingAt.toFixed(1)} assumed)`);
}
diagnosePlate(
  'Plate C — an upper bound, not a meal',
  heaviest.map((row) => ({ slug: row.slug, slot: 'bound', note: `standing ${row.standingAt!.toFixed(1)}` })),
  [1],
);

/* How much hands-on work this collection thinks a dish is, at twelve servings. */
const standings = rows.map((row) => row.standingAt).filter((n): n is number => n !== null).sort((a, b) => a - b);
const at = (q: number) => standings[Math.floor(q * (standings.length - 1))];
console.log(`\nstanding minutes at ${TARGET_SERVINGS} servings, over ${standings.length} scalable files`);
console.log(`  median ${at(0.5).toFixed(1)} · 75th ${at(0.75).toFixed(1)} · 90th ${at(0.9).toFixed(1)} · 99th ${at(0.99).toFixed(1)} · max ${at(1).toFixed(1)}`);
console.log(`  files at zero: ${standings.filter((n) => n === 0).length}  (${pct(standings.filter((n) => n === 0).length, standings.length)})`);
const over30claimed = rows.filter((row) => (row.standingAt ?? 0) - row.assumedStandingAt >= 30 && row.evidence !== 'unknown');
console.log(`  files with >= 30 CLAIMED standing minutes at 12 and a non-unknown reading: ${over30claimed.length}`);
