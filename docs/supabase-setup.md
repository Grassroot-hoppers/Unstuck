# Supabase Setup — Persistent Results Storage

## What This Adds

Currently, results live in the URL hash (base64-encoded). This works for sharing but users can't reliably retrieve their results later.

Supabase adds: **permanent storage + short URLs + (future) email receipt.**

## What Changes

| Before (v0.1) | After (v1) |
|---|---|
| Results encoded in URL hash | Results saved to Supabase, loaded via short ID |
| URL: `results.html#eyJkIjp7Ik4iOj...` (long, ugly) | URL: `results.html?id=a7x9k2` (short, clean) |
| Lost if user loses the URL | Permanent — retrievable anytime |
| Zero server | One Supabase project (free tier) |

## The Database

### One table. That's it.

```sql
CREATE TABLE results (
  id TEXT PRIMARY KEY,           -- short ID: 'a7x9k2'
  scores JSONB NOT NULL,          -- full results object
  age_group TEXT,                 -- '26-30'
  gender TEXT,                    -- 'male', 'female', 'other'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  opt_in_research BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth needed)
CREATE POLICY "Anyone can save results"
  ON results FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read by ID (results are "public" via the short URL)
CREATE POLICY "Anyone can read results by ID"
  ON results FOR SELECT
  USING (true);

-- (Optional) Research pool view — anonymized aggregate data
CREATE VIEW research_pool AS
  SELECT
    age_group,
    gender,
    scores->'d'->>'N' AS neuroticism,
    scores->'d'->>'E' AS extraversion,
    scores->'d'->>'O' AS openness,
    scores->'d'->>'A' AS agreeableness,
    scores->'d'->>'C' AS conscientiousness,
    created_at::DATE AS date
  FROM results
  WHERE opt_in_research = TRUE;
```

### Why no auth?

For v1, results are saved anonymously. No account needed. The short ID IS the access key — if you have the URL, you can see the results. This is the same security model as Google Docs with "anyone with the link" sharing.

User accounts (email + password / magic link) come in v2 when Steps 2-5 need persistent, private storage.

## The Code Changes

### In assessment.html — Save scores to Supabase after calculation

```javascript
// Add Supabase client (from CDN — no npm needed)
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generate a short ID
function generateId() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'; // no confusable chars
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// After scoring, save to Supabase
async function saveResults(scores, ageGroup, gender) {
  const id = generateId();

  const { error } = await supabase
    .from('results')
    .insert({
      id: id,
      scores: scores,
      age_group: ageGroup,
      gender: gender
    });

  if (error) {
    // Fallback to base64 URL if Supabase fails
    console.error('Save failed, using URL fallback:', error);
    return null;
  }

  return id;
}

// On assessment completion:
const id = await saveResults(allScores, ageGroup, gender);
if (id) {
  window.location.href = `results.html?id=${id}`;
} else {
  // Fallback: use base64 hash like before
  const hash = btoa(JSON.stringify(allScores));
  window.location.href = `results.html#${hash}`;
}
```

### In results.html — Load scores from Supabase OR URL hash

```javascript
async function loadResults() {
  // Check for Supabase ID first
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    // Load from Supabase
    const { data, error } = await supabase
      .from('results')
      .select('scores, age_group, gender, created_at')
      .eq('id', id)
      .single();

    if (data) {
      return {
        scores: data.scores,
        ageGroup: data.age_group,
        gender: data.gender,
        savedAt: data.created_at,
        permalink: `${window.location.origin}/results.html?id=${id}`
      };
    }
  }

  // Fallback: read from URL hash (backward compatible)
  const hash = window.location.hash.substring(1);
  if (hash) {
    const scores = JSON.parse(atob(hash));
    return { scores, ageGroup: scores.a, gender: scores.g, permalink: window.location.href };
  }

  // No results found
  return null;
}
```

## Setup Steps (for the developer)

### 1. Create a Supabase project
- Go to [supabase.com](https://supabase.com) → New Project
- Name: "unstuck"
- Region: closest to your users (EU West for Brussels)
- Free tier is fine

### 2. Run the SQL
- Go to SQL Editor in Supabase dashboard
- Paste the CREATE TABLE and POLICY statements from above
- Run

### 3. Get your keys
- Go to Settings → API
- Copy the "Project URL" and "anon (public)" key
- These go in the JavaScript code (they're safe to expose — RLS protects the data)

### 4. Add the Supabase client
Add to both `assessment.html` and `results.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 5. Update the JavaScript
Apply the code changes above. The base64 URL hash still works as a fallback if Supabase is unreachable.

### 6. Test
- Complete an assessment
- Check that results appear with a `?id=` URL
- Open the URL in a different browser/incognito → results should load
- Check the Supabase dashboard → data should be in the `results` table

## Environment Variables

For local development and deployment, store the Supabase credentials:

```
# .env (DO NOT commit this file)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
```

For GitHub Pages (static hosting), the keys are embedded in the HTML. This is fine because:
- The anon key only allows operations permitted by RLS policies
- RLS allows: INSERT (anyone can save results) and SELECT (anyone can read by ID)
- No DELETE, no UPDATE, no admin access
- The key is not a secret — it's a public API key

## Cost

| Metric | Supabase Free Tier | When You'd Exceed |
|---|---|---|
| Database size | 500 MB | ~10,800 users (see storage analysis) |
| Auth MAU | 50,000 | Not using auth in v1 |
| API requests | Unlimited | Never |
| Realtime connections | 200 concurrent | Not using realtime |

**Monthly cost for v1: €0.**

## What This Enables Later

With Supabase in place, future versions can add:
- **Email receipt** (Supabase Edge Functions + Resend)
- **Re-take and compare** (same user takes test again, sees both results side by side)
- **Opt-in research pool** (anonymized aggregate personality data)
- **User accounts** (Supabase Auth — magic link, no password needed)
- **Steps 2-5 persistence** (JSONB column per step in a `journey` table)

Each of these is ONE additional feature on top of the same Supabase project. No new infrastructure.
