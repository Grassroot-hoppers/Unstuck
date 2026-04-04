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
        'Expect very high Openness + Conscientiousness, very low Agreeableness.',
      facetMeans: {
        N1: 3, N2: 4, N3: 3, N4: 3, N5: 2, N6: 3,
        E1: 4, E2: 3, E3: 5, E4: 4, E5: 3, E6: 3,
        O1: 5, O2: 5, O3: 4, O4: 5, O5: 5, O6: 4,
        A1: 1, A2: 2, A3: 1, A4: 2, A5: 2, A6: 2,
        C1: 5, C2: 5, C3: 5, C4: 5, C5: 4, C6: 5,
      },
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
