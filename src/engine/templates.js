/**
 * UNSTUCK — Template Library (v0.5.1 — T3 audit pass)
 * 
 * Pure text templates with percentile slots.
 * Every word here is pre-written. No generation at runtime.
 * 
 * PROVENANCE TAGS (in comments):
 *   T1 [SOURCE: ...] — Direct copy/paraphrase from published research
 *   T2 [DERIVED: ...] — Synthesized from multiple research findings
 *   (No T3 remaining — all LLM-generated text replaced or cut)
 * 
 * Template functions receive:
 *   P = facet percentiles object { N1: 87, N2: 38, ... }
 *   D = domain percentiles { N: 43, E: 71, ... }
 *   S = scatter scores { N: 68, E: 55, ... }
 * 
 * Convention: "slightly below/above mid" replaces "average"
 * — per Julien's decision: nobody wants to hear "average"
 * 
 * Sources:
 *   Roberts 2017 — 207-study meta-analysis on personality change through intervention
 *   Bleidorn 2022 — k=276, N=242,542 personality stability meta-analysis
 *   Jang 1996 — Twin study heritability of Big Five facets
 *   Samuel & Widiger 2008 — Meta-analysis of FFM and personality disorders
 *   Speed 2017 — Assertiveness training evidence review
 *   Mertens 2021 (PNAS) — Choice architecture meta-analysis
 *   Johnson 2014 — IPIP-NEO-120 facet descriptions
 *   Piedmont/WKU — NEO PI-R clinical interpretation guide
 *   ACER — NEO PI-R Interpretive Report (Style Graphs)
 *   NEO PI-3 — Problems in Living checklists (PAR Inc)
 *   Costa & McCrae 1995 — Domains and Facets hierarchical interpretation
 *   Coker, Samuel & Widiger 2002 — Maladaptive traits at both poles
 *   Peterson — Understand Myself conditional statements
 *   PMC8980698 — Burnout vs. work engagement meta-analysis
 *   PMC6838776 — Fearless Dominance / Impulsive Antisociality
 */

import { NORMS, DOMAIN_FACETS } from './normative-data.js';
import { formatResearchAppendix } from './research-blocks.js';

// Helper: describe position relative to 50
function pos(p) {
  if (p >= 85) return 'very high';
  if (p >= 65) return 'above mid';
  if (p > 50) return 'slightly above mid';
  if (p === 50) return 'exactly at the midpoint';
  if (p >= 35) return 'slightly below mid';
  if (p >= 15) return 'below mid';
  return 'very low';
}

/**
 * Openness: separate aesthetic / intellect / values channels; O4 called out separately; O3 ambiguous.
 * @param {Record<string, number>} P
 * @param {Record<string, number>} S
 * @param {object | null} interpretive
 */
function opennessChannelNote(P, S, interpretive) {
  if (!interpretive?.opennessChannels) return '';
  const { aesthetic, cognitive, values } = interpretive.opennessChannels;
  const strengthTail = (signalClass) => {
    if (signalClass === 'core') return 'Strong match for you in this part of Openness.';
    if (signalClass === 'supporting')
      return 'Shows up meaningfully here, but it is not the whole story.';
    return 'Use this channel as exploratory — bands are wide or measurement is weaker.';
  };
  const line = (label, ch) => {
    const bits = ch.facetCodes.map((code) => {
      const lab = NORMS[code]?.label || code;
      const pct = P[code];
      return pct == null ? `${lab} (no percentile)` : `${lab} ${pct}pct`;
    });
    return `${label} — ${bits.join(', ')} ${strengthTail(ch.signalClass)}`;
  };
  const o4 = P.O4 != null ? `Adventurousness (O4) at ${P.O4}pct sits outside those channels and is worth reading on its own.` : '';
  const o3 =
    P.O3 != null
      ? `Emotionality (O3) is a weaker marker of "general openness" on short forms — treat it as exploratory.`
      : '';
  const scatterNote =
    (S.O ?? 0) >= 45
      ? 'Your Openness facets diverge sharply, so the headline domain score is only a summary. '
      : '';
  return (
    scatterNote +
    [
      line('Aesthetic / imaginative', aesthetic),
      line('Ideas / intellect', cognitive),
      line('Politics / convention (short scale — interpret tentatively)', values),
      o4,
      o3,
    ]
      .filter(Boolean)
      .join(' ')
  );
}

/**
 * Surfaced on the N domain paragraph when facets diverge in a characteristic way (T2 derived).
 * Low N4 vs elevated N1/N2/N3/N6: avoid implying uniform "worry about everything including how you look socially."
 */
function neuroticismFacetShapeNote(P) {
  const otherCodes = ['N1', 'N2', 'N3', 'N6'];
  const others = otherCodes.map((c) => P[c]).filter((p) => p != null);
  const n4 = P.N4;
  if (n4 == null || others.length < 3) return '';
  const meanOther = others.reduce((a, b) => a + b, 0) / others.length;
  const lo = Math.min(...others);
  const hi = Math.max(...others);
  const lab = NORMS.N4?.label || 'Self-Consciousness';

  if (n4 <= 38 && meanOther >= 48 && meanOther - n4 >= 22) {
    return ` The facet breakdown sharpens this: ${lab} is only about ${n4} out of 100 — well below your Anxiety, Anger, Depression, and Vulnerability facets, which sit higher together (roughly ${lo}–${hi}). That pattern usually reads less like steady embarrassment or image-worry in every situation, and more like tension, irritability, and mood vulnerability without a strong social-evaluative core.`;
  }

  if (n4 >= 58 && meanOther <= 45 && n4 - meanOther >= 18) {
    return ` The facet breakdown sharpens this: ${lab} is about ${n4} out of 100 — markedly higher than your other Neuroticism facets, which are comparatively lower (roughly ${lo}–${hi}). That often means self-presentation and perceived judgment carry more of the strain than generic mood alone.`;
  }

  return '';
}

// ============================================================
// DOMAIN TEMPLATES (30 total: 5 domains × 6 bands)
// ============================================================

export const DOMAIN_TEMPLATES = {
  N: {
    // T1 [SOURCE: Johnson IPIP-NEO low N; Peterson low N health benefits; Coker et al. 2002 maladaptive low N]
    very_low: (P, D) => `In a room of 100 people, about ${100-D.N} would experience more negative emotion than you. Your emotional baseline is unusually stable — stress, anxiety, and sadness rarely take hold. Low neuroticism is associated with decreased concern about mental and physical health, fewer physician visits, and reduced absenteeism at work and school. Worth knowing: very low emotional reactivity can mean missing signals that something genuinely needs attention — maladaptive low neuroticism traits include what researchers describe as "conscienceless, emotionless, inexcitable."`,

    // T1 [SOURCE: Johnson low N; Piedmont/WKU coping strategies; Peterson low N + E self-esteem]
    low: (P, D) => `In a room of 100 people, about ${100-D.N} would experience more negative emotion. You handle stress well and recover from setbacks faster than most. Low scorers tend to be "relaxed, unemotional, secure, and self-satisfied" and are more likely to use effective coping — humor, positive reinterpretation, and acceptance rather than avoidance. People at this level also "tend to have much higher levels of self-esteem, particularly when also average or above in extraversion."`,

    // T1 [SOURCE: Costa & McCrae 1995 scatter principle; Bleidorn 2022 lifespan development]
    below_mid: (P, D, S) => `In a room of 100 people, about ${100-D.N} would experience more negative emotion than you — you're on the calmer side, but not dramatically so. Emotional stability increases consistently across the lifespan — roughly 1.5 standard deviations of cumulative gain — and the 23–39 age range is the most active period for this change. ${S.N >= 40 ? 'But your domain score is hiding real variation underneath — your individual Neuroticism facets tell a more specific story than this number suggests.' : 'The facet-level picture will add useful detail.'}`,

    // T1 [SOURCE: Costa & McCrae 1995 scatter principle] — 0% T3 already, no changes needed
    above_mid: (P, D, S) => `In a room of 100 people, about ${D.N} would experience less negative emotion than you. You're on the more reactive side — not dramatically, but enough that stress, worry, or low mood show up more readily than for most people. ${S.N >= 40 ? 'Your Neuroticism facets are pulling in different directions — this domain score hides an important internal pattern.' : 'The facet-level picture will tell you where the reactivity actually lives.'}`,

    // T1 [SOURCE: Johnson high N; Costa & McCrae scatter] — 0% T3, no changes needed
    high: (P, D) => `In a room of 100 people, only about ${100-D.N} would experience more negative emotion. You feel the weight of stress, anxiety, and sadness more readily and more persistently than most. There's a specific pattern in how your neuroticism is shaped — it's not uniform, and that matters for knowing what to work on.`,

    // T1 [SOURCE: Piedmont/WKU N domain coping; Roberts 2017 intervention meta-analysis; Costa & McCrae scatter]
    very_high: (P, D) => `In a room of 100 people, only about ${100-D.N} would feel negative emotions more intensely. You are prone to experience feelings that are upsetting — fear, sadness, embarrassment, anger, guilt. People scoring in this range tend to use avoidant coping strategies and are less likely to use humor, positive reinterpretation, or acceptance. The specific facet pattern matters enormously: not all neuroticism is the same. Across 207 intervention studies, emotional stability showed the largest changes through therapy (d = .57) — roughly half the gain made across an entire lifespan, with the largest effects for cognitive-behavioral approaches.`,
  },
  E: {
    // T1 [SOURCE: Jang 1996 heritability; NEO PI-3 Problems in Living low E]
    very_low: (P, D) => `In a room of 100 people, about ${100-D.E} would be more socially energized. You're genuinely introverted — solitude recharges you, and social interaction costs energy even when it goes well. Extraversion is approximately 53% heritable according to twin studies — this is wiring, not a character flaw. The documented costs at this level: "Social isolation; no apparent social support network" and "difficulty developing or sustaining personal, intimate relationships."`,

    // T1 [SOURCE: Johnson low E description]
    low: (P, D) => `In a room of 100 people, about ${100-D.E} would be more outgoing. You prefer smaller settings, selective engagement, and recovery time after social interaction. Low scorers are "not necessarily unfriendly; they simply do not need social stimulation as much as extraverts do, preferring to keep to a small circle rather than a large one."`,

    // T1 [SOURCE: Jang 1996 heritability; Johnson moderate E; Costa & McCrae scatter]
    below_mid: (P, D, S) => `In a room of 100 people, about ${100-D.E} would be more extraverted — you're on the quieter side but not dramatically so. Extraversion is 53% heritable — moderate introverts can engage socially but have a genuine, stable preference for less stimulation. ${S.E >= 40 ? 'Your Extraversion facets have real variation — the domain score does not capture how your social energy is actually structured.' : ''}`,

    // T2 [DERIVED: standard percentile interpretation; Costa & McCrae scatter] — 0% T3, no changes
    above_mid: (P, D, S) => `In a room of 100 people, about ${D.E} would be less socially energized. You lean toward engagement, activity, and social interaction. ${S.E >= 40 ? 'But your extraversion has a specific shape — the individual facets tell you which parts of social life energize you and which do not.' : 'The facet picture adds useful detail about what kind of social energy you run on.'}`,

    // T1 [SOURCE: Johnson high E; Costa & McCrae scatter] — M5 fix: PD language moved to very_high; M6 fix: no blanket "sociable" claim
    high: (P, D, S) => `In a room of 100 people, only about ${100-D.E} would be more socially energized. You're drawn to engagement and action more than most. ${S.E >= 40 ? 'But your extraversion has a specific internal shape — your individual facets diverge significantly, which means the domain label does not describe you accurately. The facet breakdown matters more than this number.' : 'Your extraversion has a specific shape; how assertiveness, excitement-seeking, warmth, and cheerfulness combine tells the real story.'}`,

    // T1 [SOURCE: Johnson very high E; Samuel & Widiger 2008 Histrionic PD; Piedmont/WKU]
    very_high: (P, D) => `In a room of 100 people, only about ${100-D.E} would be more extraverted. You run on social energy — engagement, assertion, stimulation, positive emotion. At this level, the profile may show features documented in histrionic personality — the only personality disorder defined almost entirely by elevated Extraversion across all six facets. The specific facet pattern determines which parts of this drive are producing returns and which are costing more than they give back.`,
  },
  O: {
    // Behavioral-first; channels appended via interpretive (4th arg)
    very_low: (P, D, S, interpretive) => {
      const base = `In a room of 100 people, about ${100-D.O} would be more open to experience. You often prefer the concrete and familiar over the ambiguous — roles that reward stability, clear criteria, and stepwise change usually fit well. The trade-off is that novel or abstract paths may feel costly until the payoff is obvious.`;
      const note = opennessChannelNote(P, S, interpretive);
      return note ? `${base} ${note}` : base;
    },
    low: (P, D, S, interpretive) => {
      const base = `In a room of 100 people, about ${100-D.O} would be more open to new experiences. You lean practical — arts, ideas for their own sake, or unconventional norms may not pull your attention the way they pull others'. Openness is among the more heritable domains (~61% in twin work), so this is often a stable preference rather than a blind spot to "fix."`;
      const note = opennessChannelNote(P, S, interpretive);
      return note ? `${base} ${note}` : base;
    },
    below_mid: (P, D, S, interpretive) => {
      const base = `In a room of 100 people, about ${100-D.O} would be more open to experience — you're on the practical side without being closed off. Meta-analytic intervention work finds Openness changes least with therapy (small effects), which fits treating it as a preference to design around more than a skill deficit.`;
      const tail = S.O >= 30 ? ' Facet spread matters: "open" can mean different things for aesthetics, ideas, risk-taking, and values.' : '';
      const note = opennessChannelNote(P, S, interpretive);
      return `${base}${tail}${note ? ` ${note}` : ''}`;
    },
    above_mid: (P, D, S, interpretive) => {
      const base = `In a room of 100 people, about ${D.O} would be less open to experience. You're drawn to ideas, aesthetics, variety, or intellectual play more than most — often a strength for learning and innovation. The recurring cost is diffusion: too many threads, or impatience with routines others need.`;
      const note = opennessChannelNote(P, S, interpretive);
      return note ? `${base} ${note}` : base;
    },
    high: (P, D, S, interpretive) => {
      const base = `In a room of 100 people, only about ${100-D.O} would be more open to experience. High openness often tracks curiosity, aesthetic sensitivity, and comfort with novelty — useful when problems are ambiguous. Under pressure it can show up as restlessness, skepticism toward "how we've always done it," or chasing new frames before finishing the last one.`;
      const note = opennessChannelNote(P, S, interpretive);
      return note ? `${base} ${note}` : base;
    },
    very_high: (P, D, S, interpretive) => {
      const base = `In a room of 100 people, only about ${100-D.O} would be more open to experience. This usually means a strong pull toward imagination, ideas, beauty, and exploration — a genuine edge in creative and strategic work. The trade-off is maintaining follow-through and shared reality: very high openness can correlate with scattered priorities or friction with highly routine environments — context matters as much as the score.`;
      const note = opennessChannelNote(P, S, interpretive);
      return note ? `${base} ${note}` : base;
    },
  },
  A: {
    // Non-clinical default; PD-correlation depth → research mode / research-blocks (patterns)
    very_low: (P, D) => `In a room of 100 people, about ${100-D.A} would be more agreeable. You often prioritize candor, independence, and your own read on situations over automatic harmony. In practice that can mean sharp standards, fast disagreement, and low patience for perceived nonsense — strengths where clarity and negotiation matter. The trade-off is relationship load: trust, warmth, and cooperation can take longer to build, and friction can spike when others need reassurance before substance.`,

    // T1 [SOURCE: Johnson low A; Piedmont/WKU low A interpretation]
    low: (P, D) => `In a room of 100 people, about ${100-D.A} would be more agreeable. You lean tough-minded and independent. Compromise doesn't come naturally. Low scorers are described as "hardheaded, skeptical, proud, and competitive — they tend to express their anger directly." As the NEO interpretation manual notes, "the readiness to fight for one's convictions does have its place — in the courtroom, on the battlefield."`,

    // T1 [SOURCE: Costa & McCrae 1995 scatter; Jang 1996 heritability]
    below_mid: (P, D, S) => `In a room of 100 people, about ${100-D.A} would be more agreeable — you're on the tougher side but not dramatically so. ${S.A >= 40 ? 'This domain score is hiding significant internal contradictions — your Agreeableness facets are pulling in different directions, and that tension is where the real story is. "Particular attention should be focused on the facet scales" when scatter this large is present.' : 'Agreeableness is approximately 41% heritable. The remaining variance comes from nonshared environmental influences — meaning your individual experiences, not your family environment, primarily shaped this trait.'}`,

    // T1 [SOURCE: Johnson moderate-high A; Costa & McCrae scatter] — 0% T3, no changes
    above_mid: (P, D, S) => `In a room of 100 people, about ${D.A} would be less agreeable. You lean toward warmth, trust, and cooperation. ${S.A >= 40 ? 'But your Agreeableness facets have real variation — some parts of your agreeableness are much stronger than others.' : 'The facet picture adds useful nuance.'}`,

    // T1 [SOURCE: Johnson high A; Coker et al. 2002 maladaptive high A; Samuel & Widiger Dependent PD] — 0% T3
    high: (P, D) => `In a room of 100 people, only about ${100-D.A} would be more agreeable. You're warm, trusting, and cooperative — people generally experience you as kind and accommodating. The shadow side of high agreeableness is real: difficulty saying no, vulnerability to exploitation, and a tendency to lose track of your own needs while attending to others'.`,

    very_high: (P, D) =>
      `In a room of 100 people, only about ${100-D.A} would be more agreeable. You prioritize others' needs, avoid conflict, and extend trust readily — a real strength for cohesion and care. The recurring cost is boundary strain: saying no, pushing back, or protecting your own time can feel disproportionately costly, and you may absorb more than your share until resentment or burnout surfaces.`,
  },
  C: {
    // T1 [SOURCE: Johnson very low C; Peterson O×C underachiever]
    very_low: (P, D) => `In a room of 100 people, about ${100-D.C} would be more disciplined and organized. You live spontaneously — plans, schedules, and long-term goals aren't your natural mode. The cost is documented: without some structure, even things you care about stay perpetually unfinished. Peterson notes that "open, unconscientious people tend to be underachievers — they have the capability to succeed, can learn quickly, and are creative, but they have trouble implementing their ideas."`,

    // T1 [SOURCE: Johnson low C; standard interpretation] — 0% T3, no changes
    low: (P, D) => `In a room of 100 people, about ${100-D.C} would be more conscientious. Structure and organization take real effort for you. You can push when it matters, but your default is flexible rather than systematic.`,

    // T1 [SOURCE: Costa & McCrae scatter; Bleidorn 2022 maturity principle]
    below_mid: (P, D, S) => `In a room of 100 people, about ${100-D.C} would be more conscientious — you're on the looser side but not dramatically so. ${S.C >= 40 ? 'This average-looking domain score is misleading — your Conscientiousness facets have extreme scatter, and the gap between your drive and your structure is the most important pattern in this domain.' : 'Conscientiousness increases naturally through young adulthood — it is part of the documented "maturity principle" of personality development, with cumulative gains of roughly one standard deviation across the lifespan.'}`,

    // T1 [SOURCE: Costa & McCrae scatter]
    above_mid: (P, D, S) => `In a room of 100 people, about ${D.C} would be less disciplined. You have some real drive and follow-through. ${S.C >= 40 ? 'But your Conscientiousness has an unusual internal shape — some facets are very high while others are notably low. Costa & McCrae note that when facets within a domain pull in opposite directions, "interpretation should focus on these facets rather than the domain."' : 'The facet detail adds useful specificity about where your discipline lives and where it does not.'}`,

    // T1 [SOURCE: Johnson high C; Costa & McCrae scatter] — 0% T3, no changes
    high: (P, D, S) => `In a room of 100 people, only about ${100-D.C} would be more disciplined and driven. You have real drive, real follow-through, and the ability to push when others quit. ${S.C >= 40 ? 'But your conscientiousness is built unevenly — the specific pattern of what is high and what is low within it is where the real insight lives.' : 'The facet picture adds important detail.'}`,

    // T1 [SOURCE: Johnson very high C; Piedmont/WKU C domain; Samuel & Widiger OCPD]
    very_high: (P, D) => `In a room of 100 people, only about ${100-D.C} would be more driven. You operate with intense purpose, high standards, and the willpower to push through anything. High Conscientiousness is associated with academic and occupational achievement. At the extreme, the documented costs include "annoying fastidiousness, compulsive neatness, or workaholic behavior" — and OCPD is the only personality disorder defined primarily by elevated Conscientiousness across multiple facets.`,
  },
};

// ============================================================
// CROSS-CONNECTION TEMPLATES (15 templates)
// Each has a teaser (free) and full (paid) version
// ============================================================

export const CROSS_TEMPLATES = {
  // T1 [SOURCE: Costa & McCrae scatter; ACER N×C Style Graph; Mertens 2021 choice architecture] — M11 fix: distinguish driven-but-disorganized from true low-C
  engine_no_steering: {
    teaser: (P) => {
      const isDrivenButDisorganized = P.C4 >= 75 || P.C5 >= 75;
      if (isDrivenButDisorganized) {
        return `Your drive is at ${P.C4} out of 100 and your discipline at ${P.C5} — but your ability to organize is at ${P.C2}, and your tendency to pause before acting is at ${P.C6}. ${100-P.C6} people out of 100 would think longer before committing. Costa & McCrae confirm: "Some scatter among facets within a domain is the rule; this scatter is not due to unreliability of measurement — it reflects real differences in standing on different but related traits." You are not low in Conscientiousness. You are high in drive and low in structure — an internal mismatch that produces a specific frustration: knowing exactly what you want to achieve and watching yourself fail to organize the path there. Choice architecture research (d = .43 across 200+ studies) shows that modifying environments — making the productive choice the default — is more effective than self-control, which you already have in abundance.`;
      }
      return `Your ability to organize is at ${P.C2} out of 100, and your tendency to pause before acting is at ${P.C6} — meaning ${100-P.C6} people out of 100 would think longer before committing. The ACER style graph calls this the "Dreamer" pattern: "attracted to new ideas, able to develop them with imaginative elaboration, but may get lost in flights of fancy — good at starting innovative projects, less successful in completing them." Costa & McCrae confirm this scatter reflects genuinely different traits coexisting within the same person, not measurement error.`;
    },
    full: (P) => `[Full version: Costa & McCrae scatter interpretation, secondary loadings explanation, choice architecture evidence from Mertens 2021]`,
  },

  // T1 [SOURCE: Johnson N1/N4; NEO PI-3 Problems in Living low N4; Roberts 2017 intervention data]
  confident_worrier: {
    teaser: (P) => `You carry a background tension that only ${100-P.N1} people in 100 would feel more strongly — always scanning, anticipating, running scenarios of what could go wrong. But here's what's unusual: you don't worry about what people think. Only ${P.N4} in 100 would care less about others' opinions. Your anxiety is about the world, not about yourself. It drives preparation, not avoidance. Across 207 intervention studies, emotional stability was the primary trait domain showing change through therapy (d = .57) — roughly half the gain made across an entire lifespan, achieved in an average of 24 weeks. Patients with anxiety disorders changed the most.`,
    full: (P) => `[Full version: how N1 and N4 decouple, Roberts 2017 data on anxiety-specific intervention response, structured worry protocols]`,
  },

  // T1 [SOURCE: Johnson A3/A2; Samuel & Widiger NPD profile — low A-Altruism breaks pattern]
  pragmatic_idealist: {
    teaser: (P) => `Your desire to help people is genuine — only ${100-P.A3} in 100 would find it more rewarding. But your comfort with managing how information gets presented is also real: ${100-P.A2} people out of 100 would be more straightforward. You care deeply about outcomes for others AND you're willing to bend the rules to get there. This specific combination — low straightforwardness with high altruism — breaks the narcissistic personality profile, which requires low altruism (r = −.20 in meta-analysis). But low straightforwardness alone maps onto documented features: people at this level are described as "cunning, manipulative, and deceptive" at the extreme. The tension is real and visible to others.`,
    full: (P) => `[Full version: Samuel & Widiger narcissistic PD proximity analysis with pattern-break, trust dynamics in A3-high/A2-low profiles]`,
  },

  // T1 [SOURCE: factor structure N1/E5; PMC6838776 Fearless Dominance; Roberts 2017 E domain change]
  opposing_forces: {
    teaser: (P) => `You scan for danger — your anxiety is at ${P.N1} out of 100 — and you seek excitement — ${P.E5} out of 100 — simultaneously. These are supposed to be opposing forces: N1 loads on Neuroticism, E5 loads on Extraversion, and they typically correlate negatively. You crave the edge, the risk, the new thing, and your threat-detection system is running the entire time. This combination falls between the "Overly Emotional" (High N + High E) and "Hypersensitive" (High N + High O) style graphs — it has no formal clinical name, but the competing signals of threat-detection and reward-seeking both running at high intensity is a documented energy drain. Extraversion is the second most responsive domain to intervention (d = .23), after emotional stability.`,
    full: (P) => `[Full version: fearless dominance vs anxious sensation-seeking distinction, PMC6838776 data, burnout risk analysis]`,
  },

  disagreeable_leader: {
    teaser: (P) =>
      `You take charge — only ${100 - P.E3} in 100 would be more assertive. You resist easy compromise — ${100 - P.A4} would yield more readily. You're also comfortable shaping how things are framed — ${100 - P.A2} would be more plain-spoken. In practice this cluster often reads as decisive, forceful, and quick to challenge; it tends to help when stakes are execution and clarity, and to cost more when the work is alignment, repair, or shared ambiguity.`,
    full: (P) => `[Full version: E×A Leader style graph deep dive, Samuel & Widiger narcissistic proximity, assertiveness training evidence from Speed 2017]`,
  },

  // T1 [SOURCE: PMC8980698 burnout vs. engagement; ACER N×C "Overcontrolled"; Roberts 2017]
  burnout_setup: {
    teaser: (P) => `Your self-discipline at ${P.C5} out of 100 combined with anxiety at ${P.N1} creates a documented risk: high discipline + high negative emotion = the burnout pattern. You push through because you can — and the anxiety ensures it never feels finished. Research is specific: "Burnout was characterized by high neuroticism alone, whereas work engagement was characterized by low neuroticism with high extraversion and mobility of temperament." The critical variable is not the discipline level — it's the neuroticism level underneath it. The ACER style graph names this the "Overcontrolled" pattern: "perfectionistic strivings, will not allow themselves to fail, prone to guilt and self-recrimination."`,
    full: (P) => `[Full version: burnout vs engagement research from PMC8980698, ACER N×C Overcontrolled profile, Roberts 2017 intervention data for emotional stability]`,
  },

  // T1 [SOURCE: Samuel & Widiger NPD profile; Hudson 2019 agreeableness intervention]
  altruism_breaks_pattern: {
    teaser: (P) => `Your Agreeableness has an unusual shape. On the competitive side: straightforwardness at ${P.A2} out of 100, cooperation at ${P.A4}. On the caring side: altruism at ${P.A3}. Research shows the competitive pattern alone maps to concerning personality features — narcissistic PD is defined almost entirely by low Agreeableness across multiple facets (low A-Modesty r = −.37, low A-Straightforwardness r = −.31, low A-Compliance r = −.26, low A-Altruism r = −.20). But your high altruism breaks that pattern — you have the assertive, rule-bending style without the core indifference to others that defines NPD. In a 15-week intervention study, Agreeableness showed more improvement than any other Big Five domain.`,
    full: (P) => `[Full version: Samuel & Widiger narcissistic PD proximity check with pattern-break analysis, Hudson 2019 SMU agreeableness change data]`,
  },

  // T1 [SOURCE: ACER N×O Style Graphs "Hypersensitive" and "Adaptive" — near-verbatim]
  hypersensitive_to_adaptive: {
    teaser: (P) => `Your imagination and intellectual depth are near the ceiling, and your anxiety runs underneath. The ACER interpretive framework describes this as the "Hypersensitive" pattern: "Hypersensitive individuals seem undefended. They are alert to danger and vividly imagine possible misfortunes. They may be prone to nightmares. Because they think in unusual and creative ways, they may sometimes be troubled by odd and eccentric ideas." Key insight: if the anxiety comes down even modestly, this same combination shifts to "Adaptive" — "keenly aware of conflict, stress, and threat, but use these situations to stimulate creative adaptations. They grapple intellectually with their own intrapsychic problems, and they may react to life stress as a source of humor or artistic inspiration."`,
    full: (P) => `[Full version: ACER N×O style graph quadrant analysis, Roberts 2017 data on emotional stability change (d = .57), anxiety regulation without suppressing openness]`,
  },

  // T1 [SOURCE: Costa & McCrae 1995 scatter — verbatim principles]
  domain_scatter_C: {
    teaser: (P) => `Your Conscientiousness looks ${pos(P.C4 > P.C2 ? 65 : 45)} on paper — but the facets are pulling in opposite directions. Drive at ${P.C4} out of 100. Discipline at ${P.C5}. Organization at ${P.C2}. Cautiousness at ${P.C6}. Costa & McCrae confirm: "Some scatter among facets within a domain is the rule; this scatter is not due to unreliability of measurement, because it is preserved over time. Instead, it reflects real differences in standing on different but related traits." When scatter is this wide, "interpretation should focus on these facets rather than the domain."`,
    full: (P) => `[Full version: Costa & McCrae Case A analysis, secondary loadings of E4 and E3 on C, external scaffolding evidence from Mertens 2021]`,
  },

  // T1 [SOURCE: Costa & McCrae 1995 scatter — Case A example, verbatim] — was already 0% T3
  domain_scatter_N: {
    teaser: (P) => {
      const vals = DOMAIN_FACETS.N.map((f) => P[f]).filter((x) => x != null);
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      return `Your Neuroticism domain score suggests you're roughly in the middle — but that average is hiding real extremes. Your individual facets range from ${lo} to ${hi} out of 100. Research says this scatter isn't measurement error — it reflects genuinely different emotional systems operating at different intensities in you. The domain label doesn't describe you accurately. The facets do.`;
    },
    full: (P) => `[Full version: Costa & McCrae Case A example, secondary loadings on A and C, facet-specific interpretation]`,
  },

  // T1 [SOURCE: Costa & McCrae 1995 scatter principle — verbatim]
  domain_scatter_A: {
    teaser: (P) => {
      const vals = DOMAIN_FACETS.A.map((f) => P[f]).filter((x) => x != null);
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      return `Your Agreeableness domain score looks moderate — but the facets are in conflict. They range from ${lo} to ${hi} out of 100. Costa & McCrae are specific: "To the extent that there is wide scatter among facet scores within a domain, interpretation of that domain becomes more complex. Particular attention should be focused on the facet scales." Understanding which facets are high and which are low tells you something no domain score ever could.`;
    },
    full: (P) => `[Full version: Agreeableness internal structure, compassion vs politeness distinction, secondary loadings analysis]`,
  },

  // T1 [SOURCE: Samuel & Widiger Dependent PD; Speed 2017 assertiveness training; Jang 1996]
  doormat_risk: {
    teaser: (P) => `Your cooperation is at ${P.A4} out of 100 — you avoid confrontation strongly. Your assertiveness is at ${P.E3} — you stay in the background. Your modesty is at ${P.A5} — you don't claim credit. Research documents what this combination costs: exploitation and victimization due to failure to protect yourself, difficulty expressing anger, inability to set limits. You end up carrying other people's work and absorbing their frustration. Twin studies estimate these traits are 41–53% heritable. But assertiveness training has a strong evidence base: meta-analyses show it improves behavioral assertiveness, reduces depressive symptoms, and increases self-esteem, with gains maintained at follow-up.`,
    full: (P) => `[Full version: Samuel & Widiger dependent PD facet profile, Speed 2017 assertiveness training evidence, Jang 1996 heritability data]`,
  },

  // T1 [SOURCE: Samuel & Widiger Avoidant PD — r values; Roberts 2017 emotional stability intervention]
  social_withdrawal: {
    teaser: (P) => `Your gregariousness is at ${P.E2} out of 100 — you avoid social situations. Your warmth is at ${P.E1} — connecting doesn't come naturally. And your self-consciousness is at ${P.N4} — you're acutely aware of how you're perceived. This combination is documented in research as the avoidant pattern: wanting connection but finding the social cost too high. The self-consciousness score is the strongest single predictor — N4 shows r = .56 with avoidant personality features, the highest facet-PD correlation in the entire Samuel & Widiger meta-analysis. The avoidance makes sense as protection — but it narrows your world progressively. Emotional stability is the trait domain most responsive to intervention (d = .57 across 207 studies), and avoidant features respond particularly well.`,
    full: (P) => `[Full version: Samuel & Widiger avoidant PD full facet profile, Roberts 2017 anxiety-specific intervention response rates]`,
  },

  // T1 [SOURCE: Peterson O×C conditional — verbatim quote]
  underachiever: {
    teaser: (P) => `Your intellectual curiosity and openness are high — at the ${P.O5} percentile for ideas, only ${100-P.O5} in 100 would score higher. But your orderliness is at ${P.C2} and your cautiousness at ${P.C6}. Peterson names this directly: "Open, unconscientious people tend to be underachievers — they have the capability to succeed, can learn quickly, and are creative, but they have trouble implementing their ideas." He adds a critical modifier: this is "particularly the case if they are also above average in neuroticism." The ACER style graph calls this "Dreamers" — "good at starting innovative projects, but less successful in completing them, and may need help in staying focused."`,
    full: (P) => `[Full version: Peterson's O×C conditional with N modifier, ACER O×C Dreamer profile, identity diffusion risk analysis]`,
  },

  // T1 [SOURCE: ACER E×O "Creative Interactors" — near-verbatim]
  creative_interactor: {
    teaser: (P) => `Your extraversion and openness are both elevated — a combination the ACER interpretive framework calls "Creative Interactors": "Their interests revolve around the new and different and they like to share their discoveries with others. They enjoy public speaking and teaching and fit in well in discussion groups. They enjoy meeting people from different backgrounds." Peterson adds that people high in both are "comparatively proficient at formulating new ideas, and tend to be articulate." The risk is documented in the Openness literature: high novelty-seeking + high social energy can spread across too many connections and ideas without deepening any of them — "unpredictability in plans and interests."`,
    full: (P) => `[Full version: ACER E×O style graph, Peterson O+E articulation finding, vocational implications]`,
  },
};

// ============================================================
// SINGLE-FACET FLAG TEMPLATES (10 templates)
// ============================================================

export const FLAG_TEMPLATES = {
  // T1 [SOURCE: Johnson N1; facet-texts-complete; Roberts 2017 CBT effect sizes]
  flag_N1_high: {
    teaser: (P) => `Your anxiety is at ${P.N1} out of 100 — only ${100-P.N1} people would feel more tension, worry, and apprehension than you do. High scorers are "apprehensive, fearful, prone to worry, nervous, tense, and jittery" — always scanning for problems and rehearsing worst cases. The documented advantage: this drives preparation and catches problems early. The documented cost: real energy burned on threats that haven't materialized. A 207-study meta-analysis found cognitive-behavioral therapy produced d = .73 effect sizes on emotional stability specifically — roughly half the personality change made across an entire lifespan. These changes persisted beyond one year (d = .76). Patients with anxiety disorders changed the most of any diagnostic group.`,
  },

  // T1 [SOURCE: Johnson N3; Jang 1996 heritability; Roberts 2017 intervention persistence]
  flag_N3_high: {
    teaser: (P) => `Your tendency toward depressive feelings is at ${P.N3} out of 100 — most people carry less persistent sadness and discouragement. Low moods aren't just bad days for you — they're a recurring pattern that shapes your energy and initiative. People scoring high are "prone to feelings of guilt, sadness, hopelessness, and loneliness — easily discouraged and often dejected" — and often describe starting tasks or sustaining motivation as disproportionately hard when the low mood is active. Twin studies estimate Neuroticism is 41% heritable. Research across 207 intervention studies found emotional stability (including depression-proneness) was the trait most responsive to therapy, with changes persisting beyond 12 months (d = .76).`,
  },

  // T1 [SOURCE: Johnson E3; NEO PI-3 Problems in Living; Speed 2017 assertiveness training]
  flag_E3_low: {
    teaser: (P) => `Your assertiveness is at ${P.E3} out of 100 — about ${100-P.E3} people would speak up more readily, take charge more naturally, or push their agenda more confidently. You hang back, let others steer, and default to the background. The NEO PI-3 documents the costs: "Little influence or authority at work and over decisions that affect personal life; difficulty assuming leadership roles; difficulty expressing wishes and setting limits; inability to stand up for own rights; being easily bullied." Assertiveness training has a strong evidence base — meta-analyses show it improves behavioral assertiveness, reduces depressive symptoms, and increases self-esteem and internal locus of control, with gains maintained at follow-up.`,
  },

  // T1 [SOURCE: Johnson C5; Piedmont/WKU C5 low; Mertens 2021 choice architecture]
  flag_C5_low: {
    teaser: (P) => `Your self-discipline is at ${P.C5} out of 100 — most people find it easier to push through boring or difficult tasks. The gap between your intention and your action is wider than most. People low on self-discipline "procrastinate in beginning chores and are easily discouraged and eager to quit" — critically, "they cannot force themselves to do what they want to do." This is not impulsiveness — it's a distinct failure of self-regulation. Research on choice architecture (200+ studies, d = .43) shows that modifying decision environments — making the productive choice the default — is consistently more effective than information-based or willpower-based interventions.`,
  },

  // T1 [SOURCE: Johnson C2; Piedmont/WKU C2 low/high; Mertens 2021 choice architecture]
  flag_C2_low: {
    teaser: (P) => `Your orderliness is at ${P.C2} out of 100 — about ${100-P.C2} people keep more lists, maintain more routines, and have tidier systems than you. Low scorers are described as "haphazard, disorganized, and sloppy" — "unable to get organized and describe themselves as unmethodical." At the other extreme, high orderliness "carried to its extreme can be indicative of compulsive personality disorder." Research on choice architecture — modifying decision environments rather than relying on self-control — shows d = .43 effect sizes on behavior change across 200+ studies. "Decision structure interventions that modify decision environments are consistently more effective than decision information interventions."`,
  },

  flag_A2_low: {
    teaser: (P) =>
      `Your straightforwardness is at ${P.A2} out of 100 — about ${100 - P.A2} people would be more transparent and less strategic about how information is framed. You may frame, omit, or steer in ways that feel necessary socially but read as slick or evasive to others. The recurring cost is trust erosion when people feel managed rather than informed. This facet is especially vulnerable to self-presentation effects — compare with how trusted colleagues describe you.`,
  },

  flag_A1_low: {
    teaser: (P) =>
      `Your trust is at ${P.A1} out of 100 — about ${100 - P.A1} people default to giving others more benefit of the doubt. You run a verification-first stance: competence and motives tend to be earned, not assumed. That can protect you from naive commitments; the trade-off is slower rapport, sharper suspicion under stress, and fatigue from constant vigilance. Self-report here often diverges from observer ratings — worth checking with someone who sees you in real conflicts and collaborations.`,
  },

  // T1 [SOURCE: Johnson N6; NEO PI-3 Problems in Living; Jang 1996; Bleidorn 2022; Roberts 2017]
  flag_N6_high: {
    teaser: (P) => {
      const n = 100 - P.N6;
      const people = n === 1 ? 'person' : 'people';
      return `Your vulnerability is at ${P.N6} out of 100 — only ${n} ${people} would feel more overwhelmed under pressure. When stress arrives, something shifts: thinking clouds, confidence drops, the ability to act slows. The NEO PI-3 documents the costs: "Inability to cope with stress; responding with panic, helplessness, and dismay to even minor stressors; emotional instability; interpersonal neediness or dependency." The real cost is losing access to your own competence exactly when you need it. Personality traits are approximately 40–60% heritable according to twin studies. Young adulthood (23–39) is the most critical life stage for personality change — emotional stability increases more substantially across the lifespan than any other trait, and therapy accelerates this (d = .57 across 207 studies).`;
    },
  },

  flag_C4_high: {
    teaser: (P) =>
      `Your achievement-striving is at ${P.C4} out of 100 — only ${100 - P.C4} people push harder on goals and standards. That pattern often shows up as strong delivery, visibility, and follow-through; the trade-off is crammed life space — recovery, relationships, and "good enough" outcomes can shrink when every cycle demands peak output. The IPIP-NEO author notes very high scores can become single-minded about work; context (role demands, season of life) matters as much as the number.`,
  },

  // T1 [SOURCE: Johnson E5; Piedmont/WKU E5; PMC6838776 Fearless Dominance; Samuel & Widiger ASPD]
  flag_E5_high: {
    teaser: (P) => `Your excitement-seeking is at ${P.E5} out of 100 — only ${100-P.E5} people crave more stimulation. Without sufficient input, the world feels flat and routine feels like a trap. High scorers are described as "daring and reckless" — "they crave excitement and stimulation, love bright colors and noisy environments." The documented cost: excitement-seeking shows a significant association with antisocial personality features (r = .25 in meta-analysis) and correlates with the "Fearless Dominance" factor — low anxiety combined with social dominance and thrill-seeking. Excitement-seeking is also the strongest Extraversion marker for histrionic personality features (r = .27). The facet itself is not the problem — the question is whether the stimulation-seeking is channeled toward experiences with genuine returns.`,
  },
};

/**
 * Get the domain template for a given domain and percentile
 * @param {object | null} [interpretive] — from buildInterpretiveReport; enriches Openness channel copy
 */
export function getDomainText(domain, percentile, P, D, S, interpretive = null) {
  let band;
  if (percentile <= 15) band = 'very_low';
  else if (percentile <= 35) band = 'low';
  else if (percentile <= 49) band = 'below_mid';
  else if (percentile <= 65) band = 'above_mid';
  else if (percentile <= 85) band = 'high';
  else band = 'very_high';

  const template = DOMAIN_TEMPLATES[domain]?.[band];
  if (!template) return '';
  let text = template(P, D, S, interpretive);
  if (domain === 'N') text += neuroticismFacetShapeNote(P);
  return text;
}

/**
 * @returns {{ behavioral: string | null, research: string | null }}
 */
export function getTeaserParts(ruleId, P, D, S) {
  let behavioral = null;
  if (CROSS_TEMPLATES[ruleId]) {
    behavioral = CROSS_TEMPLATES[ruleId].teaser(P, D, S);
  } else if (FLAG_TEMPLATES[ruleId]) {
    behavioral = FLAG_TEMPLATES[ruleId].teaser(P, D, S);
  }
  const research = formatResearchAppendix(ruleId);
  return { behavioral, research: research || null };
}

/**
 * Get teaser text for a fired rule (behavioral layer only; use getTeaserParts + research UI for appendix)
 */
export function getTeaserText(ruleId, P, D, S) {
  return getTeaserParts(ruleId, P, D, S).behavioral;
}

/**
 * Get full text for a fired rule (paid layer)
 */
export function getFullText(ruleId, P, D, S) {
  if (CROSS_TEMPLATES[ruleId]?.full) {
    return CROSS_TEMPLATES[ruleId].full(P, D, S);
  }
  // Flags don't have separate full text yet — teaser IS the full text for v0.5
  if (FLAG_TEMPLATES[ruleId]) {
    return FLAG_TEMPLATES[ruleId].teaser(P, D, S);
  }
  return null;
}
