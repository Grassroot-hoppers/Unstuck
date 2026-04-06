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
        'Very high Extraversion (assertiveness, gregariousness) but low warmth; very low Agreeableness across all facets; explosive Anger; near-zero Self-Consciousness and Vulnerability; high Achievement-Striving but very low Deliberation/Dutifulness.',
      answers: [

        // ================================================================
        // NEUROTICISM (N)
        // ================================================================

        // N1 — Anxiety
        { num: 1,   text: "Worry about things",                    answer: 4, justification: "Documented worry about loyalty, ratings, media coverage" },
        { num: 31,  text: "Fear for the worst",                    answer: 4, justification: "Catastrophizing about threats — political, legal, reputational" },
        { num: 61,  text: "Am afraid of many things",              answer: 3, justification: "Projects fearlessness publicly; anxiety exists but is masked by narcissistic bravado" },
        { num: 91,  text: "Get stressed out easily",               answer: 3, justification: "Performs stress-resistance; the 'easily' qualifier doesn't fit the public persona" },

        // N2 — Anger
        { num: 6,   text: "Get angry easily",                      answer: 5, justification: "Explosive temper documented by biographers, aides (Barbara Res, Tony Schwartz); hair-trigger" },
        { num: 36,  text: "Get irritated easily",                  answer: 5, justification: "Very easily irritated; low frustration tolerance well documented" },
        { num: 66,  text: "Lose my temper",                        answer: 5, justification: "Frequent documented outbursts; bipartisan academic consensus" },
        { num: 96,  text: "Am not easily annoyed",                 answer: 1, justification: "Reversed — maximally annoyed; extremely thin-skinned" },

        // N3 — Depression
        { num: 11,  text: "Often feel blue",                       answer: 3, justification: "No strong evidence either way" },
        { num: 41,  text: "Dislike myself",                        answer: 2, justification: "Narcissistic self-image — does not dislike himself" },
        { num: 71,  text: "Am often down in the dumps",            answer: 2, justification: "No evidence of depression; grandiosity counteracts this" },
        { num: 101, text: "Feel comfortable with myself",          answer: 5, justification: "Reversed — extreme self-comfort; definitional narcissistic grandiosity" },

        // N4 — Self-Consciousness
        { num: 16,  text: "Am easily intimidated",                 answer: 1, justification: "Never intimidated; projects pure dominance; both voter groups rated 1.75–2.16" },
        { num: 46,  text: "Am afraid to draw attention to myself", answer: 1, justification: "Obsessively seeks attention; center-stage persona" },
        { num: 76,  text: "Only feel comfortable with friends",    answer: 1, justification: "Comfortable performing to millions of strangers; zero social inhibition" },
        { num: 106, text: "Find it difficult to approach others",  answer: 1, justification: "Approaches everyone; near-zero self-consciousness is consensus" },

        // N5 — Immoderation
        { num: 21,  text: "Go on binges",                          answer: 3, justification: "No strong evidence either way" },
        { num: 51,  text: "Rarely overindulge",                    answer: 4, justification: "Reversed — non-drinker, non-smoker; moderately accurate that he rarely overindulges" },
        { num: 81,  text: "Easily resist temptations",             answer: 3, justification: "Reversed — mixed; disciplined on substances but impulsive in other areas" },
        { num: 111, text: "Am able to control my cravings",        answer: 3, justification: "Reversed — neutral; controlled on substances, less so on food/attention" },

        // N6 — Vulnerability
        { num: 26,  text: "Panic easily",                          answer: 2, justification: "Narcissists project invincibility, not panic; 'I alone can fix it' posture" },
        { num: 56,  text: "Feel that I'm unable to deal with things", answer: 1, justification: "Antithetical to 'I alone can fix it' self-image; core grandiosity" },
        { num: 86,  text: "Remain calm under pressure",            answer: 4, justification: "Reversed — presents as outwardly composed (bravado); low vulnerability" },
        { num: 116, text: "Can handle complex problems",           answer: 4, justification: "Reversed — firmly believes he can handle anything; narcissistic self-efficacy" },

        // ================================================================
        // EXTRAVERSION (E)
        // ================================================================

        // E1 — Friendliness
        { num: 2,   text: "Make friends easily",                   answer: 3, justification: "Makes acquaintances easily; genuine friendships are rare and transactional" },
        { num: 32,  text: "Warm up quickly to others",             answer: 2, justification: "Warmth is performative; academic consensus = very low (Clinton voters: 1.62, Trump voters: 2.85)" },
        { num: 62,  text: "Am hard to get to know",                answer: 4, justification: "Reversed — he IS hard to truly know behind the persona" },
        { num: 92,  text: "Keep others at a distance",             answer: 3, justification: "Reversed — keeps emotional intimacy at distance but socially available" },

        // E2 — Gregariousness
        { num: 7,   text: "Love large parties",                    answer: 5, justification: "Rallies, galas, Mar-a-Lago events — thrives in large social settings" },
        { num: 37,  text: "Talk to a lot of different people at parties", answer: 5, justification: "Works the room; documented by decades of NYC social life" },
        { num: 67,  text: "Avoid crowds",                          answer: 1, justification: "Reversed — seeks crowds; rally-driven persona" },
        { num: 97,  text: "Prefer to be alone",                    answer: 1, justification: "Reversed — needs audience and social energy" },

        // E3 — Assertiveness
        { num: 12,  text: "Take charge",                           answer: 5, justification: "Defining trait — business, politics, any room he enters" },
        { num: 42,  text: "Try to lead others",                    answer: 5, justification: "Compulsive leader; universal academic consensus" },
        { num: 72,  text: "Wait for others to lead the way",       answer: 1, justification: "Reversed — never waits; always takes initiative" },
        { num: 102, text: "Keep in the background",                answer: 1, justification: "Reversed — always front and center" },

        // E4 — Activity Level
        { num: 17,  text: "Am always busy",                        answer: 5, justification: "Relentless schedule; multiple rallies per day during campaigns" },
        { num: 47,  text: "Am always on the go",                   answer: 5, justification: "Constant motion; high energy well documented" },
        { num: 77,  text: "Like to take it easy",                  answer: 1, justification: "Reversed — does not take it easy" },
        { num: 107, text: "Do a lot in my spare time",             answer: 5, justification: "Golf, calls, social media — always active" },

        // E5 — Excitement-Seeking
        { num: 22,  text: "Love excitement",                       answer: 4, justification: "Thrives on controversy, confrontation, spectacle" },
        { num: 52,  text: "Seek adventure",                        answer: 4, justification: "Seeks novelty in deals and political combat" },
        { num: 82,  text: "Would never go hang gliding or bungee jumping", answer: 3, justification: "Reversed — physically risk-averse; excitement-seeking is social/psychological, not physical" },
        { num: 112, text: "Enjoy being reckless",                  answer: 4, justification: "Reckless rhetoric and decisions well documented" },

        // E6 — Cheerfulness
        { num: 27,  text: "Radiate joy",                           answer: 3, justification: "Charismatic but not consistently joyful; grievance-driven, episodic" },
        { num: 57,  text: "Have a lot of fun",                     answer: 4, justification: "Visibly enjoys rallies, social dominance, winning" },
        { num: 87,  text: "Am not easily amused",                  answer: 2, justification: "Reversed — easily amused by flattery and entertainment" },
        { num: 117, text: "Love life",                             answer: 4, justification: "High vitality and engagement" },

        // ================================================================
        // OPENNESS (O)
        // ================================================================

        // O1 — Imagination
        { num: 3,   text: "Have a vivid imagination",              answer: 3, justification: "Narcissistic/grandiose imagination is real but narrow; fantasy about self, not aesthetics" },
        { num: 33,  text: "Enjoy wild flights of fantasy",         answer: 3, justification: "'Make America Great Again' and 'biggest/best' are fantasy constructs" },
        { num: 63,  text: "Do not have a good imagination",        answer: 2, justification: "Reversed — he does have self-serving imagination" },
        { num: 93,  text: "Love to daydream",                      answer: 3, justification: "Self-aggrandizing projections = a form of daydreaming" },

        // O2 — Artistic Interests
        { num: 8,   text: "Believe in the importance of art",      answer: 2, justification: "No genuine interest in art; gold-plated aesthetic is conspicuous consumption, not appreciation" },
        { num: 38,  text: "See beauty in things that others might not notice", answer: 2, justification: "Aesthetic sense is blunt — 'big' and 'gold' rather than subtle" },
        { num: 68,  text: "Do not like art",                       answer: 4, justification: "Reversed — art is not a priority" },
        { num: 98,  text: "Do not enjoy going to art museums",     answer: 4, justification: "Reversed — no evidence of museum visits or art engagement" },

        // O3 — Emotionality
        { num: 13,  text: "Experience my emotions intensely",      answer: 4, justification: "Rage, grievance, elation are all intense — his own emotions run hot" },
        { num: 43,  text: "Feel others' emotions",                 answer: 1, justification: "Empathy deficit; cognitive not affective empathy; floor score" },
        { num: 73,  text: "Rarely notice my emotional reactions",  answer: 2, justification: "Reversed — hyper-aware of his own emotional states; grievances catalogued" },
        { num: 103, text: "Don't understand people who get emotional", answer: 4, justification: "Reversed — dismisses others' emotional reactions" },

        // O4 — Adventurousness
        { num: 18,  text: "Prefer variety to routine",             answer: 3, justification: "Mixed — disrupts political norms but eats same McDonald's order" },
        { num: 48,  text: "Prefer to stick with things that I know", answer: 4, justification: "Reversed — well-documented: same diet, trusted brands, familiar settings" },
        { num: 78,  text: "Am attached to conventional ways",      answer: 2, justification: "Reversed — upended all conventional political norms" },
        { num: 108, text: "Like to visit new places",              answer: 3, justification: "Travels widely but sticks to his own properties" },

        // O5 — Intellect
        { num: 23,  text: "Like to solve complex problems",        answer: 2, justification: "Prefers simple framings; no evidence of intellectual curiosity" },
        { num: 53,  text: "Avoid philosophical discussions",       answer: 5, justification: "Reversed — strongly and consistently avoids abstract/philosophical discussion" },
        { num: 83,  text: "Am not interested in abstract ideas",   answer: 5, justification: "Reversed — very well documented; anti-intellectual orientation" },
        { num: 113, text: "Can handle a lot of information",       answer: 2, justification: "Prefers one-page bullet points; short attention span documented" },

        // O6 — Liberalism
        { num: 28,  text: "Tend to vote for liberal political candidates", answer: 1, justification: "Arch-conservative; leader of Republican Party" },
        { num: 58,  text: "Believe that there is no absolute right or wrong", answer: 2, justification: "Moral absolutism in rhetoric: 'good vs evil,' 'law and order'" },
        { num: 88,  text: "Tend to vote for conservative political candidates", answer: 5, justification: "Reversed — he IS American conservatism; maximum score" },
        { num: 118, text: "Believe that we should be tough on crime", answer: 5, justification: "Reversed — core message from Central Park Five ad to present" },

        // ================================================================
        // AGREEABLENESS (A)
        // ================================================================

        // A1 — Trust
        { num: 4,   text: "Trust others",                          answer: 1, justification: "Deeply suspicious; loyalty tests are constant" },
        { num: 34,  text: "Believe that others have good intentions", answer: 1, justification: "Assumes everyone has an angle; transactional worldview" },
        { num: 64,  text: "Trust what people say",                 answer: 1, justification: "Trusts almost nobody; fires allies who disagree" },
        { num: 94,  text: "Distrust people",                       answer: 5, justification: "Reversed — high distrust is baseline" },

        // A2 — Morality
        { num: 9,   text: "Use others for my own ends",            answer: 5, justification: "Reversed — instrumentalizes relationships; documented pattern" },
        { num: 39,  text: "Know how to get around the rules",      answer: 5, justification: "Reversed — tax avoidance, legal maneuvering, norm-breaking" },
        { num: 69,  text: "Use flattery to get ahead",             answer: 5, justification: "Reversed — strategic flattery (Putin, Xi) documented" },
        { num: 99,  text: "Stick to the rules",                    answer: 1, justification: "Rules are for others; defining pattern" },

        // A3 — Altruism
        { num: 14,  text: "Make people feel welcome",              answer: 2, justification: "Rally charm is real, even if performative; better than floor" },
        { num: 44,  text: "Anticipate the needs of others",        answer: 1, justification: "Self-focused; does not anticipate others' needs" },
        { num: 74,  text: "Love to help others",                   answer: 1, justification: "Help is transactional; no evidence of altruistic motivation" },
        { num: 104, text: "Am concerned about others",             answer: 1, justification: "Concern is performative and self-serving" },

        // A4 — Cooperation
        { num: 19,  text: "Am easy to satisfy",                    answer: 1, justification: "Impossible to satisfy; demands constant loyalty and praise" },
        { num: 49,  text: "Have a sharp tongue",                   answer: 5, justification: "Reversed — 'nasty,' 'loser,' 'enemy of the people'; defining trait" },
        { num: 79,  text: "Cut others to pieces",                  answer: 5, justification: "Reversed — publicly attacks allies and enemies alike" },
        { num: 109, text: "Am out for my own personal gain",       answer: 5, justification: "Reversed — self-dealing documented across career" },

        // A5 — Modesty
        { num: 24,  text: "Believe that I am better than others",  answer: 5, justification: "Reversed — 'I'm the best at everything' is literally his brand; bipartisan consensus" },
        { num: 54,  text: "Think highly of myself",                answer: 5, justification: "Reversed — extreme self-regard; narcissistic grandiosity" },
        { num: 84,  text: "Make myself the center of attention",   answer: 5, justification: "Reversed — definitional for Trump; every event orbits him" },
        { num: 114, text: "Dislike being the center of attention", answer: 1, justification: "He LOVES the center of attention; opposite of this item" },

        // A6 — Sympathy
        { num: 29,  text: "Sympathize with the homeless",          answer: 1, justification: "No documented concern; referred to homeless as 'disgraceful'" },
        { num: 59,  text: "Feel sympathy for those who are worse off than myself", answer: 1, justification: "No evidence of downward sympathy" },
        { num: 89,  text: "Believe in an eye for an eye",          answer: 5, justification: "Reversed — retaliatory; 'hit back ten times harder'" },
        { num: 119, text: "Try not to think about the needy",      answer: 5, justification: "Reversed — avoids engagement with need-based issues" },

        // ================================================================
        // CONSCIENTIOUSNESS (C)
        // ================================================================

        // C1 — Self-Efficacy
        { num: 5,   text: "Complete tasks successfully",           answer: 4, justification: "Believes he succeeds; deal-making persona; built brand on winning" },
        { num: 35,  text: "Excel in what I do",                    answer: 4, justification: "Core narcissistic belief; Trump voters rated 3.84/5" },
        { num: 65,  text: "Handle tasks smoothly",                 answer: 2, justification: "Process is chaotic even when outcomes sometimes work" },
        { num: 95,  text: "Know how to get things done",           answer: 4, justification: "'The Art of the Deal' brand; genuinely effective at certain kinds of action" },

        // C2 — Orderliness
        { num: 10,  text: "Like to tidy up",                       answer: 2, justification: "No evidence of tidiness habits; chaotic desk documented" },
        { num: 40,  text: "Often forget to put things back in their proper place", answer: 4, justification: "Reversed — chaos documented in governance and personal style" },
        { num: 70,  text: "Leave a mess in my room",               answer: 4, justification: "Reversed — consistent with chaotic, papers-everywhere style" },
        { num: 100, text: "Like order",                            answer: 2, justification: "Low order; prefers chaos that keeps him at center" },

        // C3 — Dutifulness
        { num: 15,  text: "Keep my promises",                      answer: 1, justification: "Multiple documented broken promises: 'Mexico will pay,' infrastructure, etc." },
        { num: 45,  text: "Tell the truth",                        answer: 1, justification: "30,000+ false or misleading claims documented by fact-checkers" },
        { num: 75,  text: "Break rules",                           answer: 5, justification: "Reversed — consistent, defining pattern across career and presidency" },
        { num: 105, text: "Break my promises",                     answer: 5, justification: "Reversed — well documented across decades" },

        // C4 — Achievement-Striving
        { num: 20,  text: "Work hard",                             answer: 4, justification: "Relentless deal-making and self-promotion; high drive" },
        { num: 50,  text: "Do more than what's expected of me",    answer: 4, justification: "Goes far beyond normal political activity; prolific output" },
        { num: 80,  text: "Do just enough work to get by",         answer: 2, justification: "Reversed — driven, not coasting; ambitious" },
        { num: 110, text: "Set high standards for myself and others", answer: 5, justification: "'Only the best people,' 'best/biggest' rhetoric; narcissistic standards" },

        // C5 — Self-Discipline
        { num: 25,  text: "Am always prepared",                    answer: 1, justification: "Notoriously unprepared; documented winging it in meetings and debates" },
        { num: 55,  text: "Carry out my plans",                    answer: 3, justification: "Some succeed (tax cuts), many abandoned (infrastructure, healthcare); mixed" },
        { num: 85,  text: "Waste my time",                         answer: 3, justification: "Reversed — golf/TV documented but also prolific; neutral" },
        { num: 115, text: "Have difficulty starting tasks",        answer: 2, justification: "Reversed — launches things instantly; no starting difficulty" },

        // C6 — Cautiousness
        { num: 30,  text: "Avoid mistakes",                        answer: 1, justification: "Does not try to avoid mistakes — most impulsive POTUS on record" },
        { num: 60,  text: "Rush into things",                      answer: 5, justification: "Reversed — defining trait; impulsive decisions well documented" },
        { num: 90,  text: "Make rash decisions",                   answer: 5, justification: "Reversed — extremely consistent pattern; biographer consensus" },
        { num: 120, text: "Jump into things without thinking",     answer: 5, justification: "Reversed — textbook impulsivity; zero deliberation" },
      ],
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
        { num: 21,  text: "Go on binges",                          answer: 2, justification: "Controlled, ascetic lifestyle — extreme diets were disciplined, not impulsive" },
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
        { num: 7,   text: "Love large parties",                    answer: 3, justification: "No strong evidence either way" },
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
        { num: 115, text: "Have difficulty starting tasks",        answer: 2, justification: "Reversed — no hesitation in starting" },

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
      answers: [

        // ================================================================
        // NEUROTICISM (N)
        // ================================================================

        // N1 — Anxiety
        { num: 1,   text: "Worry about things",                    answer: 5, justification: "Chronic worry; anxiety threaded through public arc" },
        { num: 31,  text: "Fear for the worst",                    answer: 5, justification: "Catastrophizing; fear of loss and humiliation" },
        { num: 61,  text: "Am afraid of many things",              answer: 5, justification: "Many documented fears despite bravery facades" },
        { num: 91,  text: "Get stressed out easily",               answer: 5, justification: "Stress dysregulation and emotional flooding" },

        // N2 — Anger
        { num: 6,   text: "Get angry easily",                      answer: 5, justification: "Hair-trigger anger; defining public narrative" },
        { num: 36,  text: "Get irritated easily",                  answer: 5, justification: "Irritability paired with emotional volatility" },
        { num: 66,  text: "Lose my temper",                        answer: 5, justification: "Temper outbursts iconic" },
        { num: 96,  text: "Am not easily annoyed",                 answer: 1, justification: "Thin patience; known for annoyance triggers" },

        // N3 — Depression
        { num: 11,  text: "Often feel blue",                       answer: 5, justification: "Chronic, treatment-resistant depression documented across decades" },
        { num: 41,  text: "Dislike myself",                        answer: 5, justification: "Direct quotes on waste, embarrassment with self; lifelong self-loathing" },
        { num: 71,  text: "Am often down in the dumps",            answer: 5, justification: "Bipolar depressive cycles; persistent down periods" },
        { num: 101, text: "Feel comfortable with myself",          answer: 1, justification: "Reversed — crippling low self-esteem; not comfortable with self" },

        // N4 — Self-Consciousness
        { num: 16,  text: "Am easily intimidated",                 answer: 4, justification: "Inner fear coexists with outer aggression" },
        { num: 46,  text: "Am afraid to draw attention to myself", answer: 2, justification: "Public performances, podcasts — attention workable despite inner anxiety" },
        { num: 76,  text: "Only feel comfortable with friends",    answer: 4, justification: "Inner-circle attachment; strangers harder" },
        { num: 106, text: "Find it difficult to approach others",  answer: 3, justification: "Mixed: anxious in some settings, confrontational in others" },

        // N5 — Immoderation
        { num: 21,  text: "Go on binges",                          answer: 5, justification: "Spending, drugs, sex — documented extreme overindulgence" },
        { num: 51,  text: "Rarely overindulge",                    answer: 1, justification: "Reversed — rarely overindulges is false; massive overindulgence" },
        { num: 81,  text: "Easily resist temptations",             answer: 1, justification: "Reversed — cannot resist temptations; financial and addiction history" },
        { num: 111, text: "Am able to control my cravings",        answer: 2, justification: "Craving battles across substances and impulses" },

        // N6 — Vulnerability
        { num: 26,  text: "Panic easily",                          answer: 4, justification: "Panic internalized but channeled into aggression, not collapse" },
        { num: 56,  text: "Feel that I'm unable to deal with things", answer: 4, justification: "Struggles exist but not full helplessness; recovery arc" },
        { num: 86,  text: "Remain calm under pressure",            answer: 2, justification: "Reversed — famously calm in the ring; moderate inaccuracy overall" },
        { num: 116, text: "Can handle complex problems",           answer: 2, justification: "Reversed — boxing craft demands handling complex tactical problems" },

        // ================================================================
        // EXTRAVERSION (E)
        // ================================================================

        // E1 — Friendliness
        { num: 2,   text: "Make friends easily",                   answer: 4, justification: "Charismatic but trust issues; friendships uneven" },
        { num: 32,  text: "Warm up quickly to others",             answer: 3, justification: "Social anxiety makes warmth variable; not consistently warm" },
        { num: 62,  text: "Am hard to get to know",                answer: 3, justification: "Reversed — surface openness but guarded inner self" },
        { num: 92,  text: "Keep others at a distance",             answer: 3, justification: "Reversed — betrayal history maintains emotional distance" },

        // E2 — Gregariousness
        { num: 7,   text: "Love large parties",                    answer: 4, justification: "Enjoys crowds, spectacle, Vegas energy" },
        { num: 37,  text: "Talk to a lot of different people at parties", answer: 4, justification: "Gregarious in party/social spectacle settings" },
        { num: 67,  text: "Avoid crowds",                          answer: 2, justification: "Avoids some crowds when dysregulated; not pure gregarious highs" },
        { num: 97,  text: "Prefer to be alone",                    answer: 3, justification: "Reversed — genuinely enjoys solitude, pigeons, reading" },

        // E3 — Assertiveness
        { num: 12,  text: "Take charge",                           answer: 4, justification: "Dominant in ring, interviews, and life situations" },
        { num: 42,  text: "Try to lead others",                    answer: 3, justification: "Leading the ring narrative but not always organizations" },
        { num: 72,  text: "Wait for others to lead the way",       answer: 2, justification: "Reversed — acts first; does not wait to lead" },
        { num: 102, text: "Keep in the background",                answer: 2, justification: "Reversed — never background; center of gravity" },

        // E4 — Activity Level
        { num: 17,  text: "Am always busy",                        answer: 4, justification: "Bursts of activity but also profound inactive/depressive periods" },
        { num: 47,  text: "Am always on the go",                   answer: 4, justification: "Same — not perpetually on the go" },
        { num: 77,  text: "Like to take it easy",                  answer: 2, justification: "Reversed — lazy/depressed stretches documented" },
        { num: 107, text: "Do a lot in my spare time",             answer: 4, justification: "Active hobbies but not maximally always doing" },

        // E5 — Excitement-Seeking
        { num: 22,  text: "Love excitement",                       answer: 5, justification: "Thrill-seeking and chaos appetite" },
        { num: 52,  text: "Seek adventure",                        answer: 5, justification: "Adventure-seeking; chaotic life trajectory" },
        { num: 82,  text: "Would never go hang gliding or bungee jumping", answer: 1, justification: "Physical risk-taking; not timid adrenaline avoider" },
        { num: 112, text: "Enjoy being reckless",                  answer: 5, justification: "Youthful recklessness; impulse and spectacle" },

        // E6 — Cheerfulness
        { num: 27,  text: "Radiate joy",                           answer: 3, justification: "Episodic joy; not steady cheer baseline" },
        { num: 57,  text: "Have a lot of fun",                     answer: 4, justification: "Later-life joy, podcast humor — genuinely has fun" },
        { num: 87,  text: "Am not easily amused",                  answer: 2, justification: "Reversed — infectious laugh; readily amused" },
        { num: 117, text: "Love life",                             answer: 4, justification: "Post-therapy spirituality; expresses love of life" },

        // ================================================================
        // OPENNESS (O)
        // ================================================================

        // O1 — Imagination
        { num: 3,   text: "Have a vivid imagination",              answer: 4, justification: "Grandiose and philosophical inner life; rich imagination" },
        { num: 33,  text: "Enjoy wild flights of fantasy",         answer: 4, justification: "War/philosophy fascinations; vivid inner narratives" },
        { num: 63,  text: "Do not have a good imagination",        answer: 2, justification: "Reversed — strong imagination, not weak" },
        { num: 93,  text: "Love to daydream",                      answer: 4, justification: "Visualization, meditation, reflection documented" },

        // O2 — Artistic Interests
        { num: 8,   text: "Believe in the importance of art",      answer: 3, justification: "Serious culture via literature more than fine-art scene" },
        { num: 38,  text: "See beauty in things that others might not notice", answer: 4, justification: "Pigeons, literature — notices beauty others skip" },
        { num: 68,  text: "Do not like art",                       answer: 2, justification: "Reversed — engages serious art through reading" },
        { num: 98,  text: "Do not enjoy going to art museums",     answer: 3, justification: "Museum-lite; literacy is his openness channel" },

        // O3 — Emotionality
        { num: 13,  text: "Experience my emotions intensely",      answer: 5, justification: "Defining trait: rage, grief, love, all at extremes; bipolar amplification" },
        { num: 43,  text: "Feel others' emotions",                 answer: 3, justification: "Can read emotional tones especially in combat context" },
        { num: 73,  text: "Rarely notice my emotional reactions",  answer: 1, justification: "Reversed — hyper-vigilant to own emotions" },
        { num: 103, text: "Don't understand people who get emotional", answer: 2, justification: "Reversed — emotional himself; empathizes in interviews" },

        // O4 — Adventurousness
        { num: 18,  text: "Prefer variety to routine",             answer: 4, justification: "Life of extreme variety, reinvention, chaos" },
        { num: 48,  text: "Prefer to stick with things that I know", answer: 3, justification: "Comfort zones and familiar routines when stable" },
        { num: 78,  text: "Am attached to conventional ways",      answer: 2, justification: "Reversed — unconventional in virtually every dimension" },
        { num: 108, text: "Like to visit new places",              answer: 4, justification: "World travel and novelty-seeking" },

        // O5 — Intellect
        { num: 23,  text: "Like to solve complex problems",        answer: 3, justification: "Philosophical complexity yes; mundane executive tasks weaker" },
        { num: 53,  text: "Avoid philosophical discussions",       answer: 1, justification: "Reversed — seeks philosophy obsessively; Nietzsche, deep reading" },
        { num: 83,  text: "Am not interested in abstract ideas",   answer: 1, justification: "Reversed — deeply interested in abstract ideas; not light reading" },
        { num: 113, text: "Can handle a lot of information",       answer: 3, justification: "Absorbs dense historical/philosophical material" },

        // O6 — Liberalism
        { num: 28,  text: "Tend to vote for liberal political candidates", answer: 2, justification: "Not a liberal voter frame; conservative drift in public life" },
        { num: 58,  text: "Believe that there is no absolute right or wrong", answer: 3, justification: "Nietzschean nuance vs. Islamic conversion — genuinely mixed" },
        { num: 88,  text: "Tend to vote for conservative political candidates", answer: 4, justification: "Reversed — conservative leanings in public framing" },
        { num: 118, text: "Believe that we should be tough on crime", answer: 4, justification: "Law-and-order framing fits post-reform public talk" },

        // ================================================================
        // AGREEABLENESS (A)
        // ================================================================

        // A1 — Trust
        { num: 4,   text: "Trust others",                          answer: 2, justification: "Distrust and betrayal themes; low baseline trust" },
        { num: 34,  text: "Believe that others have good intentions", answer: 2, justification: "Assumes bad intent after repeated exploitation" },
        { num: 64,  text: "Trust what people say",                 answer: 2, justification: "Skeptical of others' words after burns" },
        { num: 94,  text: "Distrust people",                       answer: 4, justification: "Betrayal narrative; baseline distrust" },

        // A2 — Morality
        { num: 9,   text: "Use others for my own ends",            answer: 4, justification: "Loyalty and generosity complicate pure exploitation" },
        { num: 39,  text: "Know how to get around the rules",      answer: 5, justification: "Street-smart rule-bending; Cus vs. post-Cus eras" },
        { num: 69,  text: "Use flattery to get ahead",             answer: 3, justification: "Intimidation over flattery as main social tool" },
        { num: 99,  text: "Stick to the rules",                    answer: 1, justification: "Rule-following is not hallmark outside ring codes" },

        // A3 — Altruism
        { num: 14,  text: "Make people feel welcome",              answer: 3, justification: "Podcast warmth and charm; loyal to inner circle" },
        { num: 44,  text: "Anticipate the needs of others",        answer: 2, justification: "Self-focused; limited anticipatory care for strangers" },
        { num: 74,  text: "Love to help others",                   answer: 3, justification: "Documented charitable impulses and giving" },
        { num: 104, text: "Am concerned about others",             answer: 3, justification: "Cares about close circle; mixed for strangers" },

        // A4 — Cooperation
        { num: 19,  text: "Am easy to satisfy",                    answer: 1, justification: "Demanding; hard to placate when triggered" },
        { num: 49,  text: "Have a sharp tongue",                   answer: 5, justification: "Cutting speech; verbal aggression documented" },
        { num: 79,  text: "Cut others to pieces",                  answer: 5, justification: "Verbal evisceration and intimidation style" },
        { num: 109, text: "Am out for my own personal gain",       answer: 4, justification: "Self-oriented but not purely Machiavellian" },

        // A5 — Modesty
        { num: 24,  text: "Believe that I am better than others",  answer: 4, justification: "Grandiosity eras alternate with shame" },
        { num: 54,  text: "Think highly of myself",                answer: 3, justification: "Grandiosity and self-loathing coexist — split captures both" },
        { num: 84,  text: "Make myself the center of attention",   answer: 4, justification: "Center of attention in fame phases" },
        { num: 114, text: "Dislike being the center of attention", answer: 2, justification: "Fame forces spotlight; not seeking to hide" },

        // A6 — Sympathy
        { num: 29,  text: "Sympathize with the homeless",          answer: 4, justification: "Photographed helping homeless; grew up poor" },
        { num: 59,  text: "Feel sympathy for those who are worse off than myself", answer: 4, justification: "Same thread — empathy for worse-off" },
        { num: 89,  text: "Believe in an eye for an eye",          answer: 5, justification: "Reversed — retribution and eye-for-an-eye core to persona" },
        { num: 119, text: "Try not to think about the needy",      answer: 2, justification: "Reversed — actively thinks about and helps needy" },

        // ================================================================
        // CONSCIENTIOUSNESS (C)
        // ================================================================

        // C1 — Self-Efficacy
        { num: 5,   text: "Complete tasks successfully",           answer: 3, justification: "Ring success vs. life chaos — blended self-efficacy" },
        { num: 35,  text: "Excel in what I do",                    answer: 4, justification: "Youngest heavyweight champ — excelled at boxing peak" },
        { num: 65,  text: "Handle tasks smoothly",                 answer: 2, justification: "Life outside craft often disorganized failure" },
        { num: 95,  text: "Know how to get things done",           answer: 3, justification: "Gets things done in craft; life management messier" },

        // C2 — Orderliness
        { num: 10,  text: "Like to tidy up",                       answer: 2, justification: "Chaotic environments; not naturally orderly" },
        { num: 40,  text: "Often forget to put things back in their proper place", answer: 4, justification: "Domestic/order chaos during spiral years" },
        { num: 70,  text: "Leave a mess in my room",               answer: 4, justification: "Mess and neglect during worst years" },
        { num: 100, text: "Like order",                            answer: 2, justification: "Disorder beats love-of-order in daily life" },

        // C3 — Dutifulness
        { num: 15,  text: "Keep my promises",                      answer: 2, justification: "Broken promises and unstable relationships documented" },
        { num: 45,  text: "Tell the truth",                        answer: 3, justification: "Brutal honesty about self and others in media" },
        { num: 75,  text: "Break rules",                           answer: 5, justification: "Reversed — extreme rule-breaking across eras" },
        { num: 105, text: "Break my promises",                     answer: 4, justification: "Unreliability punctuates relationships and business" },

        // C4 — Achievement-Striving
        { num: 20,  text: "Work hard",                             answer: 4, justification: "D'Amato-era 50–60 hr training = elite work ethic" },
        { num: 50,  text: "Do more than what's expected of me",    answer: 3, justification: "Exceeds expectations in sport; less so outside it" },
        { num: 80,  text: "Do just enough work to get by",         answer: 3, justification: "Reversed — not purely coasting nor purely maximal" },
        { num: 110, text: "Set high standards for myself and others", answer: 4, justification: "Perfectionist training standards at peak" },

        // C5 — Self-Discipline
        { num: 25,  text: "Am always prepared",                    answer: 2, justification: "Prepared obsessively under Cus; overall uneven" },
        { num: 55,  text: "Carry out my plans",                    answer: 2, justification: "Some plans land; many derail — moderate inaccuracy" },
        { num: 85,  text: "Waste my time",                         answer: 4, justification: "Reversed — wastes time significantly but not totally" },
        { num: 115, text: "Have difficulty starting tasks",        answer: 3, justification: "Starts impulsively; completion/discipline is the struggle" },

        // C6 — Cautiousness
        { num: 30,  text: "Avoid mistakes",                        answer: 1, justification: "Repeated catastrophic mistakes; does little to prevent repeats" },
        { num: 60,  text: "Rush into things",                      answer: 5, justification: "Reversed — impulsive rushing is defining" },
        { num: 90,  text: "Make rash decisions",                   answer: 5, justification: "Reversed — rash decisions are textbook" },
        { num: 120, text: "Jump into things without thinking",     answer: 5, justification: "Reversed — acts without thinking chronically" },
      ],
    },
    {
      id: 'ross',
      displayName: 'Bob Ross',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect very high Agreeableness + Openness, very low Neuroticism.',
      answers: [
        // ================================================================
        // NEUROTICISM (N)
        // ================================================================

        // N1 — Anxiety
        { num: 1,   text: "Worry about things",                    answer: 2, justification: "Estate battles with Kowalskis — documented anxiety about legacy" },
        { num: 31,  text: "Fear for the worst",                    answer: 2, justification: "Predicted early death; urgency around health and succession" },
        { num: 61,  text: "Am afraid of many things",              answer: 1, justification: "Retained after calibration; N1 Anxiety (plus-keyed baseline)" },
        { num: 91,  text: "Get stressed out easily",               answer: 1, justification: "Retained after calibration; N1 Anxiety (plus-keyed baseline)" },

        // N2 — Anger
        { num: 6,   text: "Get angry easily",                      answer: 2, justification: "Drill-sergeant past; gentleness was learned suppression not absence" },
        { num: 36,  text: "Get irritated easily",                  answer: 2, justification: "Alexander feud and business friction show irritability beneath calm" },
        { num: 66,  text: "Lose my temper",                        answer: 1, justification: "Retained after calibration; N2 Anger (plus-keyed baseline)" },
        { num: 96,  text: "Am not easily annoyed",                 answer: 4, justification: "Reversed — annoyance existed; cultivated patience on camera" },

        // N3 — Depression
        { num: 11,  text: "Often feel blue",                       answer: 2, justification: "Private grief: widowhood, cancer, betrayal themes" },
        { num: 41,  text: "Dislike myself",                        answer: 1, justification: "Retained after calibration; N3 Depression (plus-keyed baseline)" },
        { num: 71,  text: "Am often down in the dumps",            answer: 2, justification: "End-of-life stressors; not perpetual cheer" },
        { num: 101, text: "Feel comfortable with myself",          answer: 4, justification: "Reversed — comfortable with persona yet documentary ego beneath" },

        // N4 — Self-Consciousness
        { num: 16,  text: "Am easily intimidated",                 answer: 1, justification: "Retained after calibration; N4 Self-Consciousness (plus-keyed baseline)" },
        { num: 46,  text: "Am afraid to draw attention to myself", answer: 2, justification: "Fiercely private; rare interviews despite TV fame" },
        { num: 76,  text: "Only feel comfortable with friends",    answer: 2, justification: "Warm on TV; guarded personal circle" },
        { num: 106, text: "Find it difficult to approach others",  answer: 1, justification: "Retained after calibration; N4 Self-Consciousness (plus-keyed baseline)" },

        // N5 — Immoderation
        { num: 21,  text: "Go on binges",                          answer: 1, justification: "Retained after calibration; N5 Immoderation (plus-keyed baseline)" },
        { num: 51,  text: "Rarely overindulge",                    answer: 5, justification: "Retained after calibration; N5 Immoderation (reverse-keyed baseline)" },
        { num: 81,  text: "Easily resist temptations",             answer: 4, justification: "Reversed — doc suggests imperfect impulse control (affair allegations)" },
        { num: 111, text: "Am able to control my cravings",        answer: 4, justification: "Reversed — same context; not total mastery of craving" },

        // N6 — Vulnerability
        { num: 26,  text: "Panic easily",                          answer: 1, justification: "Retained after calibration; N6 Vulnerability (plus-keyed baseline)" },
        { num: 56,  text: "Feel that I'm unable to deal with things", answer: 1, justification: "Retained after calibration; N6 Vulnerability (plus-keyed baseline)" },
        { num: 86,  text: "Remain calm under pressure",            answer: 5, justification: "Retained after calibration; N6 Vulnerability (reverse-keyed baseline)" },
        { num: 116, text: "Can handle complex problems",           answer: 5, justification: "Retained after calibration; N6 Vulnerability (reverse-keyed baseline)" },

        // ================================================================
        // EXTRAVERSION (E)
        // ================================================================

        // E1 — Friendliness
        { num: 2,   text: "Make friends easily",                   answer: 4, justification: "Magnetic connection with millions; masterful warmth as host" },
        { num: 32,  text: "Warm up quickly to others",             answer: 4, justification: "Immediate warmth was defining broadcast skill" },
        { num: 62,  text: "Am hard to get to know",                answer: 4, justification: "Reversed — real Bob guarded; hard to truly know" },
        { num: 92,  text: "Keep others at a distance",             answer: 3, justification: "Retained after calibration; E1 Friendliness (reverse-keyed baseline)" },

        // E2 — Gregariousness
        { num: 7,   text: "Love large parties",                    answer: 2, justification: "Preferred Alaska solitude and nature over party scene" },
        { num: 37,  text: "Talk to a lot of different people at parties", answer: 3, justification: "Retained after calibration; E2 Gregariousness (plus-keyed baseline)" },
        { num: 67,  text: "Avoid crowds",                          answer: 3, justification: "Retained after calibration; E2 Gregariousness (reverse-keyed baseline)" },
        { num: 97,  text: "Prefer to be alone",                    answer: 4, justification: "Reversed — genuine love of alone time in wilderness" },

        // E3 — Assertiveness
        { num: 12,  text: "Take charge",                           answer: 4, justification: "MSgt drill instructor; leader in studio and business" },
        { num: 42,  text: "Try to lead others",                    answer: 4, justification: "Teaching empire — led every instructional frame" },
        { num: 72,  text: "Wait for others to lead the way",       answer: 2, justification: "Reversed — built own method, brand, and company" },
        { num: 102, text: "Keep in the background",                answer: 2, justification: "Reversed — face of global franchise; not background figure" },

        // E4 — Activity Level
        { num: 17,  text: "Am always busy",                        answer: 4, justification: "Three paintings per episode plus workshops — relentless output" },
        { num: 47,  text: "Am always on the go",                   answer: 3, justification: "Busy yet valued contemplation; balanced 3" },
        { num: 77,  text: "Like to take it easy",                  answer: 3, justification: "Reversed — calm demeanor but extraordinarily productive" },
        { num: 107, text: "Do a lot in my spare time",             answer: 4, justification: "Wildlife rehab, teaching, painting — packed non-TV life" },

        // E5 — Excitement-Seeking
        { num: 22,  text: "Love excitement",                       answer: 2, justification: "Retained after calibration; E5 Excitement-Seeking (plus-keyed baseline)" },
        { num: 52,  text: "Seek adventure",                        answer: 3, justification: "Military + Alaska wilderness more adventurous than pure homebody" },
        { num: 82,  text: "Would never go hang gliding or bungee jumping", answer: 4, justification: "Retained after calibration; E5 Excitement-Seeking (reverse-keyed baseline)" },
        { num: 112, text: "Enjoy being reckless",                  answer: 1, justification: "Wet-on-wet discipline; anti-recklessness" },

        // E6 — Cheerfulness
        { num: 27,  text: "Radiate joy",                           answer: 5, justification: "Title-level joy — definitional TV trait" },
        { num: 57,  text: "Have a lot of fun",                     answer: 5, justification: "Episodic delight constant on camera" },
        { num: 87,  text: "Am not easily amused",                  answer: 1, justification: "Reversed — delighted by squirrels, clouds, small joys" },
        { num: 117, text: "Love life",                             answer: 5, justification: "Stated philosophy: deep love of life and process" },

        // ================================================================
        // OPENNESS (O)
        // ================================================================

        // O1 — Imagination
        { num: 3,   text: "Have a vivid imagination",              answer: 5, justification: "Retained after calibration; O1 Imagination (plus-keyed baseline)" },
        { num: 33,  text: "Enjoy wild flights of fantasy",         answer: 5, justification: "Retained after calibration; O1 Imagination (plus-keyed baseline)" },
        { num: 63,  text: "Do not have a good imagination",        answer: 1, justification: "Retained after calibration; O1 Imagination (reverse-keyed baseline)" },
        { num: 93,  text: "Love to daydream",                      answer: 5, justification: "Retained after calibration; O1 Imagination (plus-keyed baseline)" },

        // O2 — Artistic Interests
        { num: 8,   text: "Believe in the importance of art",      answer: 5, justification: "Life mission was art education and craft" },
        { num: 38,  text: "See beauty in things that others might not notice", answer: 5, justification: "Happy accidents — saw beauty where novices saw mistakes" },
        { num: 68,  text: "Do not like art",                       answer: 1, justification: "Reversed — art was identity incarnate" },
        { num: 98,  text: "Do not enjoy going to art museums",     answer: 2, justification: "Retained after calibration; O2 Artistic (reverse-keyed baseline)" },

        // O3 — Emotionality
        { num: 13,  text: "Experience my emotions intensely",      answer: 4, justification: "Retained after calibration; O3 Emotionality (plus-keyed baseline)" },
        { num: 43,  text: "Feel others' emotions",                 answer: 5, justification: "Addressed viewer fears and shame with surgical empathy" },
        { num: 73,  text: "Rarely notice my emotional reactions",  answer: 2, justification: "Retained after calibration; O3 Emotionality (reverse-keyed baseline)" },
        { num: 103, text: "Don't understand people who get emotional", answer: 1, justification: "Reversed — emotional insight was core teaching skill" },

        // O4 — Adventurousness
        { num: 18,  text: "Prefer variety to routine",             answer: 3, justification: "Decades of same formula, palette, mountain motif" },
        { num: 48,  text: "Prefer to stick with things that I know", answer: 4, justification: "Reversed — mastery relied on familiar repeatable method" },
        { num: 78,  text: "Am attached to conventional ways",      answer: 3, justification: "Reversed — innovative painter, conventional personal lifestyle" },
        { num: 108, text: "Like to visit new places",              answer: 4, justification: "Retained after calibration; O4 Adventurousness (plus-keyed baseline)" },

        // O5 — Intellect
        { num: 23,  text: "Like to solve complex problems",        answer: 4, justification: "Retained after calibration; O5 Intellect (plus-keyed baseline)" },
        { num: 53,  text: "Avoid philosophical discussions",       answer: 2, justification: "Retained after calibration; O5 Intellect (reverse-keyed baseline)" },
        { num: 83,  text: "Am not interested in abstract ideas",   answer: 2, justification: "Retained after calibration; O5 Intellect (reverse-keyed baseline)" },
        { num: 113, text: "Can handle a lot of information",       answer: 4, justification: "Retained after calibration; O5 Intellect (plus-keyed baseline)" },

        // O6 — Liberalism
        { num: 28,  text: "Tend to vote for liberal political candidates", answer: 3, justification: "Retained after calibration; O6 Liberalism (plus-keyed baseline)" },
        { num: 58,  text: "Believe that there is no absolute right or wrong", answer: 3, justification: "Retained after calibration; O6 Liberalism (plus-keyed baseline)" },
        { num: 88,  text: "Tend to vote for conservative political candidates", answer: 3, justification: "Retained after calibration; O6 Liberalism (reverse-keyed baseline)" },
        { num: 118, text: "Believe that we should be tough on crime", answer: 3, justification: "Retained after calibration; O6 Liberalism (reverse-keyed baseline)" },

        // ================================================================
        // AGREEABLENESS (A)
        // ================================================================

        // A1 — Trust
        { num: 4,   text: "Trust others",                          answer: 4, justification: "Trusted partners; betrayal narrative — not blind faith" },
        { num: 34,  text: "Believe that others have good intentions", answer: 4, justification: "Same — learned suspicion tempered absolutism" },
        { num: 64,  text: "Trust what people say",                 answer: 4, justification: "Same realism about others reliability" },
        { num: 94,  text: "Distrust people",                       answer: 2, justification: "Reversed — late-life wariness after business wounds" },

        // A2 — Morality
        { num: 9,   text: "Use others for my own ends",            answer: 2, justification: "Brand built on Alexander lineage controversy" },
        { num: 39,  text: "Know how to get around the rules",      answer: 2, justification: "Strategic maneuvering in art-business wars" },
        { num: 69,  text: "Use flattery to get ahead",             answer: 2, justification: "Strategic warmth grew audience empire" },
        { num: 99,  text: "Stick to the rules",                    answer: 4, justification: "Ethical bends amid empire-building" },

        // A3 — Altruism
        { num: 14,  text: "Make people feel welcome",              answer: 5, justification: "Retained after calibration; A3 Altruism (plus-keyed baseline)" },
        { num: 44,  text: "Anticipate the needs of others",        answer: 5, justification: "Retained after calibration; A3 Altruism (plus-keyed baseline)" },
        { num: 74,  text: "Love to help others",                   answer: 5, justification: "Retained after calibration; A3 Altruism (plus-keyed baseline)" },
        { num: 104, text: "Am concerned about others",             answer: 5, justification: "Retained after calibration; A3 Altruism (plus-keyed baseline)" },

        // A4 — Cooperation
        { num: 19,  text: "Am easy to satisfy",                    answer: 3, justification: "Perfectionist instructor and demanding colleague reports" },
        { num: 49,  text: "Have a sharp tongue",                   answer: 2, justification: "Reversed — cutting toward Alexander and rivals" },
        { num: 79,  text: "Cut others to pieces",                  answer: 1, justification: "Retained after calibration; A4 Cooperation (reverse-keyed baseline)" },
        { num: 109, text: "Am out for my own personal gain",       answer: 2, justification: "Reversed — name-on-every-canvas personal brand logic" },

        // A5 — Modesty
        { num: 24,  text: "Believe that I am better than others",  answer: 2, justification: "Retained after calibration; A5 Modesty (reverse-keyed baseline)" },
        { num: 54,  text: "Think highly of myself",                answer: 3, justification: "Reversed — documented ego behind humble we-language" },
        { num: 84,  text: "Make myself the center of attention",   answer: 3, justification: "Reversed — unavoidable center of television product" },
        { num: 114, text: "Dislike being the center of attention", answer: 3, justification: "Professionally spotlighted; privately shy — split score" },

        // A6 — Sympathy
        { num: 29,  text: "Sympathize with the homeless",          answer: 5, justification: "Retained after calibration; A6 Sympathy (plus-keyed baseline)" },
        { num: 59,  text: "Feel sympathy for those who are worse off than myself", answer: 5, justification: "Retained after calibration; A6 Sympathy (plus-keyed baseline)" },
        { num: 89,  text: "Believe in an eye for an eye",          answer: 1, justification: "Retained after calibration; A6 Sympathy (reverse-keyed baseline)" },
        { num: 119, text: "Try not to think about the needy",      answer: 1, justification: "Retained after calibration; A6 Sympathy (reverse-keyed baseline)" },

        // ================================================================
        // CONSCIENTIOUSNESS (C)
        // ================================================================

        // C1 — Self-Efficacy
        { num: 5,   text: "Complete tasks successfully",           answer: 5, justification: "403 episodes × three paintings each = elite completion" },
        { num: 35,  text: "Excel in what I do",                    answer: 5, justification: "Innovative master of wet-on-wet craft" },
        { num: 65,  text: "Handle tasks smoothly",                 answer: 5, justification: "Smooth execution under broadcast clock" },
        { num: 95,  text: "Know how to get things done",           answer: 5, justification: "Self-made global instruction business" },

        // C2 — Orderliness
        { num: 10,  text: "Like to tidy up",                       answer: 3, justification: "Retained after calibration; C2 Orderliness (plus-keyed baseline)" },
        { num: 40,  text: "Often forget to put things back in their proper place", answer: 2, justification: "Reversed — brush care and palette discipline legendary" },
        { num: 70,  text: "Leave a mess in my room",               answer: 2, justification: "Reversed — studio ritual cleanliness" },
        { num: 100, text: "Like order",                            answer: 4, justification: "Military habit plus televised routine prized order" },

        // C3 — Dutifulness
        { num: 15,  text: "Keep my promises",                      answer: 4, justification: "Retained after calibration; C3 Dutifulness (plus-keyed baseline)" },
        { num: 45,  text: "Tell the truth",                        answer: 4, justification: "Retained after calibration; C3 Dutifulness (plus-keyed baseline)" },
        { num: 75,  text: "Break rules",                           answer: 2, justification: "Retained after calibration; C3 Dutifulness (reverse-keyed baseline)" },
        { num: 105, text: "Break my promises",                     answer: 2, justification: "Retained after calibration; C3 Dutifulness (reverse-keyed baseline)" },

        // C4 — Achievement-Striving
        { num: 20,  text: "Work hard",                             answer: 5, justification: "Renaissance-level workload in soft voice" },
        { num: 50,  text: "Do more than what's expected of me",    answer: 5, justification: "Over-delivered encouragement, animals, education every show" },
        { num: 80,  text: "Do just enough work to get by",         answer: 1, justification: "Reversed — never coasting; maximal effort culture" },
        { num: 110, text: "Set high standards for myself and others", answer: 4, justification: "Retained after calibration; C4 Achievement-Striving (plus-keyed baseline)" },

        // C5 — Self-Discipline
        { num: 25,  text: "Am always prepared",                    answer: 5, justification: "Pre-produced three versions; military precision prep" },
        { num: 55,  text: "Carry out my plans",                    answer: 5, justification: "Multi-decade program and tour execution" },
        { num: 85,  text: "Waste my time",                         answer: 1, justification: "Reversed — productivity famously extreme" },
        { num: 115, text: "Have difficulty starting tasks",        answer: 1, justification: "Reversed — on-air starts instant; no procrastination stereotype" },

        // C6 — Cautiousness
        { num: 30,  text: "Avoid mistakes",                        answer: 4, justification: "Controlled strokes; reframed errors without loving sloppiness" },
        { num: 60,  text: "Rush into things",                      answer: 2, justification: "Reversed — slow deliberate technique" },
        { num: 90,  text: "Make rash decisions",                   answer: 2, justification: "Reversed — calculated business and brush decisions" },
        { num: 120, text: "Jump into things without thinking",     answer: 2, justification: "Reversed — every move telegraphed for lesson plan" },
      ],
    },
    {
      id: 'cobain',
      displayName: 'Kurt Cobain',
      defaultAge: DEFAULT_AGE,
      defaultGender: DEFAULT_GENDER,
      expectedBlurb:
        'Expect very high Neuroticism + Openness; lower Extraversion + Conscientiousness.',
      answers: [
        // ================================================================
        // NEUROTICISM (N)
        // ================================================================

        // N1 — Anxiety
        { num: 1,   text: "Worry about things",                    answer: 5, justification: "Chronic worry in interviews; stomach pain tied to anxiety" },
        { num: 31,  text: "Fear for the worst",                    answer: 5, justification: "Catastrophizing health and career collapse" },
        { num: 61,  text: "Am afraid of many things",              answer: 5, justification: "Hypochondria and phobic texture in bios" },
        { num: 91,  text: "Get stressed out easily",               answer: 5, justification: "Band conflict and fame amplified stress reactivity" },

        // N2 — Anger
        { num: 6,   text: "Get angry easily",                      answer: 5, justification: "Instrument destruction; volatile behind-scenes temper" },
        { num: 36,  text: "Get irritated easily",                  answer: 5, justification: "Thin skin to criticism; punk aggression" },
        { num: 66,  text: "Lose my temper",                        answer: 5, justification: "Documented rage at media and peers" },
        { num: 96,  text: "Am not easily annoyed",                 answer: 1, justification: "Reversed — easily annoyed; thin patience when dysregulated" },

        // N3 — Depression
        { num: 11,  text: "Often feel blue",                       answer: 5, justification: "Suicidal ideation and depressive spiral in journals" },
        { num: 41,  text: "Dislike myself",                        answer: 5, justification: "Profound self-loathing in lyrics and letters" },
        { num: 71,  text: "Am often down in the dumps",            answer: 5, justification: "Persistent anhedonia periods" },
        { num: 101, text: "Feel comfortable with myself",          answer: 1, justification: "Reversed — rarely comfortable in own skin at depth" },

        // N4 — Self-Consciousness
        { num: 16,  text: "Am easily intimidated",                 answer: 5, justification: "Painful shyness masked by performance" },
        { num: 46,  text: "Am afraid to draw attention to myself", answer: 4, justification: "Frontman for millions — drew attention reluctantly; ambivalence not total avoidance" },
        { num: 76,  text: "Only feel comfortable with friends",    answer: 5, justification: "Trusted tiny circle only" },
        { num: 106, text: "Find it difficult to approach others",  answer: 5, justification: "Approach anxiety in non-musical social life" },

        // N5 — Immoderation
        { num: 21,  text: "Go on binges",                          answer: 5, justification: "Documented heroin binges; loss of control, not moderate indulgence" },
        { num: 51,  text: "Rarely overindulge",                    answer: 1, justification: "Reversed — chronic overindulgence in addiction arc" },
        { num: 81,  text: "Easily resist temptations",             answer: 1, justification: "Reversed — could not resist in active addiction" },
        { num: 111, text: "Am able to control my cravings",        answer: 1, justification: "Reversed — substance use controlled him, not the reverse" },

        // N6 — Vulnerability
        { num: 26,  text: "Panic easily",                          answer: 5, justification: "Overwhelmed easily when reserves depleted" },
        { num: 56,  text: "Feel that I'm unable to deal with things", answer: 5, justification: "Felt unable to cope with fame demands" },
        { num: 86,  text: "Remain calm under pressure",            answer: 1, justification: "Reversed — brittle calm; not resilient under pressure" },
        { num: 116, text: "Can handle complex problems",           answer: 1, justification: "Reversed — executive function collapsed late; complex problems felt impossible" },

        // ================================================================
        // EXTRAVERSION (E)
        // ================================================================

        // E1 — Friendliness
        { num: 2,   text: "Make friends easily",                   answer: 2, justification: "Small trusted circle; not socially expansive" },
        { num: 32,  text: "Warm up quickly to others",             answer: 2, justification: "Slow to warm; misanthropic streak in quotes" },
        { num: 62,  text: "Am hard to get to know",                answer: 4, justification: "Reversed — genuinely hard to know beneath persona" },
        { num: 92,  text: "Keep others at a distance",             answer: 4, justification: "Reversed — emotional walls with most people" },

        // E2 — Gregariousness
        { num: 7,   text: "Love large parties",                    answer: 1, justification: "Avoided crowds and industry parties" },
        { num: 37,  text: "Talk to a lot of different people at parties", answer: 1, justification: "One-on-one or stage, not mixer personality" },
        { num: 67,  text: "Avoid crowds",                          answer: 5, justification: "Reversed — sought isolation offstage" },
        { num: 97,  text: "Prefer to be alone",                    answer: 5, justification: "Reversed — solitude default in Seattle years" },

        // E3 — Assertiveness
        { num: 12,  text: "Take charge",                           answer: 3, justification: "Creative dictator of Nirvana; led sound and vision if not social management" },
        { num: 42,  text: "Try to lead others",                    answer: 3, justification: "Drove band artistic direction from early days" },
        { num: 72,  text: "Wait for others to lead the way",       answer: 3, justification: "Reversed — led in studio; sometimes passive in press; mixed" },
        { num: 102, text: "Keep in the background",                answer: 3, justification: "Reversed — undisputed frontman yet ambivalent about stardom" },

        // E4 — Activity Level
        { num: 17,  text: "Am always busy",                        answer: 2, justification: "Pre-fame years obsessively building band and scene" },
        { num: 47,  text: "Am always on the go",                   answer: 1, justification: "Not on-the-go; homebody between tours" },
        { num: 77,  text: "Like to take it easy",                  answer: 4, justification: "Reversed — ease forced by illness and sedation as much as taste" },
        { num: 107, text: "Do a lot in my spare time",             answer: 2, justification: "Journals, drawing, guitar at home — spare time not empty" },

        // E5 — Excitement-Seeking
        { num: 22,  text: "Love excitement",                       answer: 2, justification: "Thrill-seeking channelled into sound, not sports" },
        { num: 52,  text: "Seek adventure",                        answer: 2, justification: "Adventure muted; domestic focus" },
        { num: 82,  text: "Would never go hang gliding or bungee jumping", answer: 4, justification: "Reversed — would skip physical risk activities" },
        { num: 112, text: "Enjoy being reckless",                  answer: 3, justification: "Substance and romantic risk carried defiant edge; moderate thrill" },

        // E6 — Cheerfulness
        { num: 27,  text: "Radiate joy",                           answer: 2, justification: "Public joy often performed; private mood darker" },
        { num: 57,  text: "Have a lot of fun",                     answer: 2, justification: "Fun episodic, not baseline temperament" },
        { num: 87,  text: "Am not easily amused",                  answer: 4, justification: "Reversed — hard to amuse when depressed" },
        { num: 117, text: "Love life",                             answer: 2, justification: "Love-of-life ambivalence in final years" },

        // ================================================================
        // OPENNESS (O)
        // ================================================================

        // O1 — Imagination
        { num: 3,   text: "Have a vivid imagination",              answer: 5, justification: "Surreal metaphor-rich songwriting" },
        { num: 33,  text: "Enjoy wild flights of fantasy",         answer: 5, justification: "Fantasy and nightmare blended in imagery" },
        { num: 63,  text: "Do not have a good imagination",        answer: 1, justification: "Reversed — imagination central to art" },
        { num: 93,  text: "Love to daydream",                      answer: 5, justification: "Contemplative dissociative daydream thread" },

        // O2 — Artistic Interests
        { num: 8,   text: "Believe in the importance of art",      answer: 5, justification: "Fine-art and punk collage aesthetics mattered" },
        { num: 38,  text: "See beauty in things that others might not notice", answer: 5, justification: "Painting and visual work alongside music" },
        { num: 68,  text: "Do not like art",                       answer: 1, justification: "Reversed — art-first identity" },
        { num: 98,  text: "Do not enjoy going to art museums",     answer: 1, justification: "Museums and culture engaged when functional" },

        // O3 — Emotionality
        { num: 13,  text: "Experience my emotions intensely",      answer: 5, justification: "Raw emotional transparency in performance" },
        { num: 43,  text: "Feel others' emotions",                 answer: 5, justification: "Empathic to audience pain; tapped collective ache" },
        { num: 73,  text: "Rarely notice my emotional reactions",  answer: 1, justification: "Hyperaware of own emotional weather" },
        { num: 103, text: "Don't understand people who get emotional", answer: 1, justification: "Reversed — took others emotional seriousness seriously" },

        // O4 — Adventurousness
        { num: 18,  text: "Prefer variety to routine",             answer: 3, justification: "Aberdeen/Seattle habits deeply anchored; variety mostly musical" },
        { num: 48,  text: "Prefer to stick with things that I know", answer: 3, justification: "Reversed — genre-flips vs. comfort of routine; blended" },
        { num: 78,  text: "Am attached to conventional ways",      answer: 2, justification: "Mixed conventional suburb roots vs. punk rebellion" },
        { num: 108, text: "Like to visit new places",              answer: 3, justification: "Tour obligation without tourist enthusiasm; not avid novelty travel" },

        // O5 — Intellect
        { num: 23,  text: "Like to solve complex problems",        answer: 4, justification: "Lyric density and metaphor complexity" },
        { num: 53,  text: "Avoid philosophical discussions",       answer: 2, justification: "Engaged feminist and political reads" },
        { num: 83,  text: "Am not interested in abstract ideas",   answer: 2, justification: "Abstract themes in songs about power and pain" },
        { num: 113, text: "Can handle a lot of information",       answer: 3, justification: "Sharp when sober; capacity eroded significantly by long addiction" },

        // O6 — Liberalism
        { num: 28,  text: "Tend to vote for liberal political candidates", answer: 5, justification: "Avowed feminist; anti-war benefits; vocally liberal politics" },
        { num: 58,  text: "Believe that there is no absolute right or wrong", answer: 3, justification: "Moral relativism in some adolescent writings" },
        { num: 88,  text: "Tend to vote for conservative political candidates", answer: 1, justification: "Reversed — anti-conservative across documented interviews and causes" },
        { num: 118, text: "Believe that we should be tough on crime", answer: 2, justification: "Reversed — working-class left; skeptical of punitive law-and-order" },

        // ================================================================
        // AGREEABLENESS (A)
        // ================================================================

        // A1 — Trust
        { num: 4,   text: "Trust others",                          answer: 2, justification: "Suspicious of industry; betrayal sensitivity" },
        { num: 34,  text: "Believe that others have good intentions", answer: 2, justification: "Assumed bad faith from press" },
        { num: 64,  text: "Trust what people say",                 answer: 2, justification: "Questioned motives of handlers" },
        { num: 94,  text: "Distrust people",                       answer: 4, justification: "Reversed — baseline distrust elevated" },

        // A2 — Morality
        { num: 9,   text: "Use others for my own ends",            answer: 3, justification: "Band friction and guilt; unwilling exploiter rather than cold strategist" },
        { num: 39,  text: "Know how to get around the rules",      answer: 4, justification: "Rule-bending in punk ethos though not Machiavellian" },
        { num: 69,  text: "Use flattery to get ahead",             answer: 2, justification: "Reversed — blunt and awkward salesmanship; confrontation over flattery" },
        { num: 99,  text: "Stick to the rules",                    answer: 2, justification: "Honesty about not being a saint" },

        // A3 — Altruism
        { num: 14,  text: "Make people feel welcome",              answer: 3, justification: "Feminist allyship; cared about fans wellbeing" },
        { num: 44,  text: "Anticipate the needs of others",        answer: 3, justification: "Charity instincts uneven but present" },
        { num: 74,  text: "Love to help others",                   answer: 4, justification: "Career aimed to voice outcast pain and help fans feel understood" },
        { num: 104, text: "Am concerned about others",             answer: 4, justification: "Anti-sexism, anti-homophobia, feminist themes — documented concern" },

        // A4 — Cooperation
        { num: 19,  text: "Am easy to satisfy",                    answer: 2, justification: "Acid interview tongue when provoked" },
        { num: 49,  text: "Have a sharp tongue",                   answer: 4, justification: "Could cut critics sharply" },
        { num: 79,  text: "Cut others to pieces",                  answer: 3, justification: "Reversed — occasionally cutting; not a systematic verbal destroyer" },
        { num: 109, text: "Am out for my own personal gain",       answer: 3, justification: "Reversed — resented commerce; artistic integrity over cynical gain" },

        // A5 — Modesty
        { num: 24,  text: "Believe that I am better than others",  answer: 3, justification: "Imposter feelings alongside fame" },
        { num: 54,  text: "Think highly of myself",                answer: 2, justification: "Reversed — relentless self-deprecation in interviews" },
        { num: 84,  text: "Make myself the center of attention",   answer: 2, justification: "Reversed — actively resisted myth of wanting stardom" },
        { num: 114, text: "Dislike being the center of attention", answer: 4, justification: "Reluctant icon; discomfort as megastar well documented" },

        // A6 — Sympathy
        { num: 29,  text: "Sympathize with the homeless",          answer: 4, justification: "Working-class identification; championed marginalized and poor" },
        { num: 59,  text: "Feel sympathy for those who are worse off than myself", answer: 4, justification: "Outcast solidarity core to lyrics and public stance" },
        { num: 89,  text: "Believe in an eye for an eye",          answer: 3, justification: "Reversed — feuds existed alongside empathy and forgiveness threads" },
        { num: 119, text: "Try not to think about the needy",      answer: 2, justification: "Reversed — marginalized experience stayed central to his work" },

        // ================================================================
        // CONSCIENTIOUSNESS (C)
        // ================================================================

        // C1 — Self-Efficacy
        { num: 5,   text: "Complete tasks successfully",           answer: 3, justification: "Nevermind, In Utero, Unplugged — real completion amid personal chaos" },
        { num: 35,  text: "Excel in what I do",                    answer: 4, justification: "Musically undeniably excelled; reshaped rock" },
        { num: 65,  text: "Handle tasks smoothly",                 answer: 2, justification: "Inconsistent follow-through outside music" },
        { num: 95,  text: "Know how to get things done",           answer: 3, justification: "Built Nirvana from scratch; knew how to realize records" },

        // C2 — Orderliness
        { num: 10,  text: "Like to tidy up",                       answer: 2, justification: "Chaotic living spaces in deep use" },
        { num: 40,  text: "Often forget to put things back in their proper place", answer: 4, justification: "Forgot domestic order when using" },
        { num: 70,  text: "Leave a mess in my room",               answer: 4, justification: "Mess compounded during lows" },
        { num: 100, text: "Like order",                            answer: 2, justification: "Order valued ideologically, not executed" },

        // C3 — Dutifulness
        { num: 15,  text: "Keep my promises",                      answer: 2, justification: "Broken commitments in personal relationships" },
        { num: 45,  text: "Tell the truth",                        answer: 3, justification: "Brutally honest about mind, industry, and denial cycles when lucid" },
        { num: 75,  text: "Break rules",                           answer: 4, justification: "Rules flexible; punk anti-authority" },
        { num: 105, text: "Break my promises",                     answer: 4, justification: "Promises eroded by addiction" },

        // C4 — Achievement-Striving
        { num: 20,  text: "Work hard",                             answer: 3, justification: "Pre-fame relentless grind; post-fame physical collapse — net moderate" },
        { num: 50,  text: "Do more than what's expected of me",    answer: 2, justification: "Artistic ambition often beyond expectations even when body quit" },
        { num: 80,  text: "Do just enough work to get by",         answer: 3, justification: "Reversed — early career far above minimum; fame era coasted" },
        { num: 110, text: "Set high standards for myself and others", answer: 4, justification: "Studio perfectionist; demanding about takes and sound" },

        // C5 — Self-Discipline
        { num: 25,  text: "Am always prepared",                    answer: 1, justification: "Poor prep for emotional demands of fame" },
        { num: 55,  text: "Carry out my plans",                    answer: 2, justification: "Finished major albums despite chaos; follow-through uneven" },
        { num: 85,  text: "Waste my time",                         answer: 5, justification: "Reversed — time lost to withdrawal and chaos" },
        { num: 115, text: "Have difficulty starting tasks",        answer: 4, justification: "Deepest lows froze initiative; early years started projects fast" },

        // C6 — Cautiousness
        { num: 30,  text: "Avoid mistakes",                        answer: 2, justification: "Avoided mistakes in recording; reckless in life" },
        { num: 60,  text: "Rush into things",                      answer: 4, justification: "Impulsive medically and romantically" },
        { num: 90,  text: "Make rash decisions",                   answer: 4, justification: "Rash choices around substances" },
        { num: 120, text: "Jump into things without thinking",     answer: 4, justification: "Heroin, romance, stage destruction, dropout — documented impulsive pattern" },
      ],
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
