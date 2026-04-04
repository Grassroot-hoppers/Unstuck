(function () {
  const DEFAULT_AGE = '26-30';
  const DEFAULT_GENDER = 'male';

  const FIXTURES = [
    {
      id: 'trump',
      displayName: 'Trump',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect strong Extraversion/assertiveness flavor, very low Agreeableness, lower Openness, reactive Neuroticism possible.',
      facetMeans: {
        N1: 4, N2: 4, N3: 3, N4: 3, N5: 3, N6: 4,
        E1: 5, E2: 5, E3: 5, E4: 5, E5: 4, E6: 4,
        O1: 2, O2: 2, O3: 2, O4: 3, O5: 2, O6: 2,
        A1: 1, A2: 1, A3: 1, A4: 1, A5: 2, A6: 1,
        C1: 2, C2: 3, C3: 2, C4: 3, C5: 2, C6: 2,
      },
    },
    {
      id: 'jobs',
      displayName: 'Steve Jobs',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Very high Openness; strong Conscientiousness except dutifulness/cautiousness; very low Agreeableness; elevated anger; low self-consciousness.',
      answers: [
        // ================================================================
        // NEUROTICISM (N)
        // ================================================================

        // N1 — Anxiety
        { num: 1,   text: "Worry about things",                    answer: 4, justification: "Hogan: despite outward audacity, always worried about things going wrong" },
        { num: 31,  text: "Fear for the worst",                    answer: 3, justification: "No strong evidence either way" },
        { num: 61,  text: "Am afraid of many things",              answer: 3, justification: "No strong evidence either way" },
        { num: 91,  text: "Get stressed out easily",               answer: 4, justification: "Chronic stress responses documented; cancer denial partly attributed to anxiety-driven avoidance" },

        // N2 — Anger
        { num: 6,   text: "Get angry easily",                      answer: 4, justification: "Legendary temper; frequent explosive outbursts at employees" },
        { num: 36,  text: "Get irritated easily",                  answer: 4, justification: "Consistent with documented low frustration tolerance" },
        { num: 66,  text: "Lose my temper",                        answer: 4, justification: "Isaacson documents regular eruptions" },
        { num: 96,  text: "Am not easily annoyed",                 answer: 2, justification: "Reversed — he was very easily annoyed" },

        // N3 — Depression
        { num: 11,  text: "Often feel blue",                       answer: 3, justification: "No strong evidence either way" },
        { num: 41,  text: "Dislike myself",                        answer: 3, justification: "No strong evidence either way" },
        { num: 71,  text: "Am often down in the dumps",            answer: 3, justification: "No strong evidence either way" },
        { num: 101, text: "Feel comfortable with myself",          answer: 3, justification: "Reversed — neutral; complex self-image" },

        // N4 — Self-Consciousness
        { num: 16,  text: "Am easily intimidated",                 answer: 1, justification: "No evidence of Jobs being intimidated; used silence and eye contact as dominance tools" },
        { num: 46,  text: "Am afraid to draw attention to myself", answer: 1, justification: "Sought the spotlight — product launches, center-stage persona" },
        { num: 76,  text: "Only feel comfortable with friends",    answer: 2, justification: "Comfortable performing to thousands of strangers" },
        { num: 106, text: "Find it difficult to approach others",  answer: 3, justification: "No strong evidence either way" },

        // N5 — Immoderation
        { num: 21,  text: "Go on binges",                         answer: 2, justification: "Controlled, ascetic lifestyle — extreme diets were disciplined, not impulsive" },
        { num: 51,  text: "Rarely overindulge",                    answer: 4, justification: "Reversed — he rarely overindulged" },
        { num: 81,  text: "Easily resist temptations",             answer: 4, justification: "Reversed — strong self-control in personal habits" },
        { num: 111, text: "Am able to control my cravings",        answer: 4, justification: "Reversed — extreme dietary discipline" },

        // N6 — Vulnerability
        { num: 26,  text: "Panic easily",                          answer: 3, justification: "No strong evidence either way" },
        { num: 56,  text: "Feel that I'm unable to deal with things", answer: 3, justification: "No strong evidence either way" },
        { num: 86,  text: "Remain calm under pressure",            answer: 3, justification: "Reversed — mixed; could be intensely calm or explosive" },
        { num: 116, text: "Can handle complex problems",           answer: 3, justification: "Reversed — neutral baseline" },

        // ================================================================
        // EXTRAVERSION (E)
        // ================================================================

        // E1 — Friendliness
        { num: 2,   text: "Make friends easily",                   answer: 2, justification: "Very small inner circle; guarded and cold at first contact" },
        { num: 32,  text: "Warm up quickly to others",             answer: 2, justification: "Warmth was strategic and selective, not spontaneous" },
        { num: 62,  text: "Am hard to get to know",                answer: 4, justification: "He was genuinely hard to get to know; guarded with most people" },
        { num: 92,  text: "Keep others at a distance",             answer: 4, justification: "Kept most people at arm's length; inner circle was tiny" },

        // E2 — Gregariousness
        { num: 7,   text: "Love large parties",                   answer: 3, justification: "No strong evidence either way" },
        { num: 37,  text: "Talk to a lot of different people at parties", answer: 3, justification: "No strong evidence either way" },
        { num: 67,  text: "Avoid crowds",                          answer: 3, justification: "Reversed — neutral" },
        { num: 97,  text: "Prefer to be alone",                    answer: 3, justification: "Reversed — valued solitude for thinking but not reclusive" },

        // E3 — Assertiveness
        { num: 12,  text: "Take charge",                           answer: 5, justification: "Defined by taking charge — Apple, Pixar, NeXT" },
        { num: 42,  text: "Try to lead others",                    answer: 5, justification: "Compulsive leader in every context" },
        { num: 72,  text: "Wait for others to lead the way",       answer: 1, justification: "Reversed — never waited for anyone" },
        { num: 102, text: "Keep in the background",                answer: 1, justification: "Reversed — always front and center" },

        // E4 — Activity Level
        { num: 17,  text: "Am always busy",                        answer: 4, justification: "Relentless work schedule across multiple companies" },
        { num: 47,  text: "Am always on the go",                   answer: 4, justification: "Constant motion between Apple, Pixar, family" },
        { num: 77,  text: "Like to take it easy",                  answer: 2, justification: "Reversed — did not take it easy" },
        { num: 107, text: "Do a lot in my spare time",             answer: 4, justification: "Spare time barely existed; always working or thinking about work" },

        // E5 — Excitement-Seeking
        { num: 22,  text: "Love excitement",                       answer: 3, justification: "No strong evidence either way" },
        { num: 52,  text: "Seek adventure",                        answer: 3, justification: "India trip and counterculture youth, but not a thrill-seeker per se" },
        { num: 82,  text: "Would never go hang gliding or bungee jumping", answer: 3, justification: "Reversed — no strong evidence either way" },
        { num: 112, text: "Enjoy being reckless",                  answer: 3, justification: "Not reckless for thrills; impulsive in business but not sensation-seeking" },

        // E6 — Cheerfulness
        { num: 27,  text: "Radiate joy",                           answer: 3, justification: "Could be charismatic and enthusiastic but not consistently joyful" },
        { num: 57,  text: "Have a lot of fun",                     answer: 3, justification: "No strong evidence either way" },
        { num: 87,  text: "Am not easily amused",                  answer: 3, justification: "Reversed — neutral" },
        { num: 117, text: "Love life",                             answer: 3, justification: "Stanford speech suggests yes, but overall neutral baseline" },

        // ================================================================
        // OPENNESS (O)
        // ================================================================

        // O1 — Imagination
        { num: 3,   text: "Have a vivid imagination",              answer: 5, justification: "Defining trait — envisioned products years ahead of the market" },
        { num: 33,  text: "Enjoy wild flights of fantasy",         answer: 5, justification: "Reality distortion field was fueled by imaginative vision" },
        { num: 63,  text: "Do not have a good imagination",        answer: 1, justification: "Reversed — extraordinary imagination" },
        { num: 93,  text: "Love to daydream",                      answer: 5, justification: "Spent time in contemplation; Zen practice, long walks for thinking" },

        // O2 — Artistic Interests
        { num: 8,   text: "Believe in the importance of art",      answer: 5, justification: "Intersection of technology and liberal arts was his mantra" },
        { num: 38,  text: "See beauty in things that others might not notice", answer: 5, justification: "Obsessive attention to aesthetic detail, even inside the machine" },
        { num: 68,  text: "Do not like art",                       answer: 1, justification: "Reversed — art was central to his identity" },
        { num: 98,  text: "Do not enjoy going to art museums",     answer: 1, justification: "Reversed — deeply engaged with art and design" },

        // O3 — Emotionality
        { num: 13,  text: "Experience my emotions intensely",      answer: 4, justification: "Cried frequently; intense emotional reactions well documented" },
        { num: 43,  text: "Feel others' emotions",                 answer: 2, justification: "Isaacson: could read people to manipulate, not empathize — cognitive not affective empathy" },
        { num: 73,  text: "Rarely notice my emotional reactions",  answer: 4, justification: "Oblivious to how his emotional reactions landed on others" },
        { num: 103, text: "Don't understand people who get emotional", answer: 4, justification: "Dismissed emotional employees as weak; cognitive empathy only" },

        // O4 — Adventurousness
        { num: 18,  text: "Prefer variety to routine",             answer: 5, justification: "Constantly reinventing products, companies, industries" },
        { num: 48,  text: "Prefer to stick with things that I know", answer: 1, justification: "Reversed — embraced the unknown" },
        { num: 78,  text: "Am attached to conventional ways",      answer: 1, justification: "Reversed — 'think different' was literal" },
        { num: 108, text: "Like to visit new places",              answer: 5, justification: "India pilgrimage, Japan visits, broad cultural curiosity" },

        // O5 — Intellect
        { num: 23,  text: "Like to solve complex problems",        answer: 5, justification: "Thrived on impossible engineering and design challenges" },
        { num: 53,  text: "Avoid philosophical discussions",       answer: 1, justification: "Reversed — engaged deeply with philosophy, Zen Buddhism, counterculture thought" },
        { num: 83,  text: "Am not interested in abstract ideas",   answer: 1, justification: "Reversed — abstract thinking was core to his approach" },
        { num: 113, text: "Can handle a lot of information",       answer: 5, justification: "Managed multiple complex organizations simultaneously" },

        // O6 — Liberalism
        { num: 28,  text: "Tend to vote for liberal political candidates", answer: 4, justification: "Bay Area liberal; supported Democratic candidates" },
        { num: 58,  text: "Believe that there is no absolute right or wrong", answer: 4, justification: "Counterculture values; flexible morality in business dealings" },
        { num: 88,  text: "Tend to vote for conservative political candidates", answer: 2, justification: "Reversed — not conservative politically" },
        { num: 118, text: "Believe that we should be tough on crime", answer: 2, justification: "Reversed — no evidence of law-and-order orientation" },

        // ================================================================
        // AGREEABLENESS (A)
        // ================================================================

        // A1 — Trust
        { num: 4,   text: "Trust others",                          answer: 1, justification: "Deeply suspicious; tested people constantly" },
        { num: 34,  text: "Believe that others have good intentions", answer: 1, justification: "Assumed incompetence until proven otherwise" },
        { num: 64,  text: "Trust what people say",                 answer: 1, justification: "Verified everything; trusted almost nobody" },
        { num: 94,  text: "Distrust people",                       answer: 5, justification: "Reversed — high distrust was baseline" },

        // A2 — Morality
        { num: 9,   text: "Use others for my own ends",            answer: 4, justification: "Reversed — manipulated people instrumentally (Woz, employees, partners)" },
        { num: 39,  text: "Know how to get around the rules",      answer: 4, justification: "Reversed — handicapped parking, SEC rules, stock options backdating" },
        { num: 69,  text: "Use flattery to get ahead",             answer: 4, justification: "Reversed — reality distortion field included strategic charm" },
        { num: 99,  text: "Stick to the rules",                    answer: 2, justification: "Rules were for other people" },

        // A3 — Altruism
        { num: 14,  text: "Make people feel welcome",              answer: 1, justification: "Routinely made people feel unwelcome, dismissed, or attacked" },
        { num: 44,  text: "Anticipate the needs of others",        answer: 1, justification: "Anticipated user needs, not people's emotional needs" },
        { num: 74,  text: "Love to help others",                   answer: 1, justification: "No philanthropy; didn't help others unless it served his vision" },
        { num: 104, text: "Am concerned about others",             answer: 1, justification: "Denied paternity of Lisa; ignored friends in need" },

        // A4 — Cooperation
        { num: 19,  text: "Am easy to satisfy",                    answer: 2, justification: "Impossible to satisfy — obsessive perfectionism" },
        { num: 49,  text: "Have a sharp tongue",                   answer: 4, justification: "Reversed — brutal verbal attacks were routine" },
        { num: 79,  text: "Cut others to pieces",                  answer: 4, justification: "Reversed — publicly humiliated employees" },
        { num: 109, text: "Am out for my own personal gain",       answer: 4, justification: "Reversed — Atari bonus split, stock options manipulation" },

        // A5 — Modesty
        { num: 24,  text: "Believe that I am better than others",  answer: 4, justification: "Reversed — openly considered himself superior" },
        { num: 54,  text: "Think highly of myself",                answer: 4, justification: "Reversed — extreme self-regard" },
        { num: 84,  text: "Make myself the center of attention",   answer: 4, justification: "Reversed — keynotes, product reveals, always center stage" },
        { num: 114, text: "Dislike being the center of attention", answer: 2, justification: "Loved being the center of attention" },

        // A6 — Sympathy
        { num: 29,  text: "Sympathize with the homeless",          answer: 2, justification: "No documented concern for social causes" },
        { num: 59,  text: "Feel sympathy for those who are worse off than myself", answer: 2, justification: "No philanthropy; shut down Apple's charitable programs" },
        { num: 89,  text: "Believe in an eye for an eye",          answer: 4, justification: "Reversed — retaliatory; held grudges (Google/Android, IBM)" },
        { num: 119, text: "Try not to think about the needy",      answer: 4, justification: "Reversed — actively avoided charitable engagement" },

        // ================================================================
        // CONSCIENTIOUSNESS (C)
        // ================================================================

        // C1 — Self-Efficacy
        { num: 5,   text: "Complete tasks successfully",           answer: 5, justification: "Mac, iPod, iPhone, iPad, Pixar — serial successful completion" },
        { num: 35,  text: "Excel in what I do",                    answer: 5, justification: "Best-in-class results across multiple industries" },
        { num: 65,  text: "Handle tasks smoothly",                 answer: 5, justification: "Despite chaos, shipped revolutionary products" },
        { num: 95,  text: "Know how to get things done",           answer: 5, justification: "Defining trait — relentless execution" },

        // C2 — Orderliness
        { num: 10,  text: "Like to tidy up",                       answer: 5, justification: "Minimalist aesthetic extended to personal space" },
        { num: 40,  text: "Often forget to put things back in their proper place", answer: 1, justification: "Reversed — obsessive about order and simplicity" },
        { num: 70,  text: "Leave a mess in my room",               answer: 1, justification: "Reversed — famously minimal, sparse living spaces" },
        { num: 100, text: "Like order",                            answer: 5, justification: "Order and simplicity were core values" },

        // C3 — Dutifulness
        { num: 15,  text: "Keep my promises",                      answer: 2, justification: "Broke promises to Woz (Atari bonus), employees (equity), daughter Lisa (paternity denial)" },
        { num: 45,  text: "Tell the truth",                        answer: 2, justification: "Reality distortion field was documented manipulation; Isaacson records serial deception" },
        { num: 75,  text: "Break rules",                           answer: 4, justification: "Reversed — handicapped parking, SEC rules, ignored medical advice" },
        { num: 105, text: "Break my promises",                     answer: 4, justification: "Reversed — breaking promises was part of his operating style" },

        // C4 — Achievement-Striving
        { num: 20,  text: "Work hard",                             answer: 5, justification: "80+ hour weeks; relentless work ethic" },
        { num: 50,  text: "Do more than what's expected of me",    answer: 5, justification: "Consistently exceeded expectations in product ambition" },
        { num: 80,  text: "Do just enough work to get by",         answer: 1, justification: "Reversed — never did just enough" },
        { num: 110, text: "Set high standards for myself and others", answer: 5, justification: "Impossibly high standards were his signature" },

        // C5 — Self-Discipline
        { num: 25,  text: "Am always prepared",                    answer: 4, justification: "Keynote rehearsals were legendary in their thoroughness" },
        { num: 55,  text: "Carry out my plans",                    answer: 4, justification: "Long-term vision executed over years" },
        { num: 85,  text: "Waste my time",                         answer: 2, justification: "Reversed — intensely focused on what mattered" },
        { num: 115, text: "Have difficulty starting tasks",         answer: 2, justification: "Reversed — no hesitation in starting" },

        // C6 — Cautiousness
        { num: 30,  text: "Avoid mistakes",                        answer: 3, justification: "Cared about avoiding mistakes but made significant ones (NeXT, Lisa project, delayed cancer surgery)" },
        { num: 60,  text: "Rush into things",                      answer: 3, justification: "Reversed — rushed Mac to market without hard drive or sufficient RAM" },
        { num: 90,  text: "Make rash decisions",                   answer: 3, justification: "Reversed — Hogan labels him notoriously impulsive and intuitive" },
        { num: 120, text: "Jump into things without thinking",     answer: 3, justification: "Reversed — NeXT $9,995 pricing, spontaneous product pivots" },
      ],
    },
    {
      id: 'tyson',
      displayName: 'Mike Tyson',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect high Neuroticism + Extraversion; lower Agreeableness + Conscientiousness.',
      facetMeans: {
        N1: 5, N2: 5, N3: 4, N4: 4, N5: 4, N6: 5,
        E1: 4, E2: 4, E3: 3, E4: 5, E5: 5, E6: 3,
        O1: 3, O2: 3, O3: 3, O4: 3, O5: 2, O6: 2,
        A1: 2, A2: 1, A3: 2, A4: 1, A5: 2, A6: 2,
        C1: 2, C2: 2, C3: 2, C4: 2, C5: 1, C6: 2,
      },
    },
    {
      id: 'ross',
      displayName: 'Bob Ross',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect very high Agreeableness + Openness, very low Neuroticism.',
      facetMeans: {
        N1: 1, N2: 1, N3: 1, N4: 1, N5: 1, N6: 1,
        E1: 3, E2: 3, E3: 3, E4: 2, E5: 2, E6: 4,
        O1: 5, O2: 4, O3: 4, O4: 4, O5: 4, O6: 3,
        A1: 5, A2: 5, A3: 5, A4: 5, A5: 4, A6: 5,
        C1: 4, C2: 3, C3: 4, C4: 4, C5: 4, C6: 3,
      },
    },
    {
      id: 'cobain',
      displayName: 'Kurt Cobain',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect very high Neuroticism + Openness; lower Extraversion + Conscientiousness.',
      facetMeans: {
        N1: 5, N2: 5, N3: 5, N4: 5, N5: 4, N6: 5,
        E1: 2, E2: 1, E3: 2, E4: 1, E5: 2, E6: 2,
        O1: 5, O2: 5, O3: 5, O4: 4, O5: 4, O6: 3,
        A1: 2, A2: 2, A3: 3, A4: 2, A5: 3, A6: 2,
        C1: 2, C2: 2, C3: 2, C4: 1, C5: 1, C6: 2,
      },
    },
  ];

  function getFixture(id) {
    return FIXTURES.find((f) => f.id === id) || null;
  }

  function listFixtures() {
    return FIXTURES.slice();
  }

  function getFixtureAnswers(id) {
    const f = getFixture(id);
    if (!f) throw new Error('Unknown fixture: ' + id);

    if (f.answers) {
      const map = {};
      for (const entry of f.answers) {
        map[entry.num] = entry.answer;
      }
      return map;
    }

    const builder = window.buildFixtureAnswersFromFacetMeans;
    if (typeof builder !== 'function') {
      throw new Error('buildFixtureAnswersFromFacetMeans not loaded');
    }
    return builder(f.facetMeans);
  }

  window.UnstuckTestPersonas = {
    listFixtures,
    getFixture,
    getFixtureAnswers,
  };
})();
