# Paywall Setup — v0.4

## Overview

The v0.4 paywall gates **interpretation text** (the paragraphs explaining what scores mean) behind a one-time unlock. Users can unlock via access codes or (in a future release) a €5 Stripe payment.

**Free for everyone:**
- Take the 120-question assessment
- Radar chart with 5 domain scores
- Raw scores and level badges (High/Average/Low)
- Facet scores (30 facets) as bars with numeric values

**Paid (access code or €5):**
- Full interpretation text for each domain
- Facet-level interpretation text (when added)
- PDF download
- Personalized recommendations (when added)

## Database Migration

Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New query):

```sql
-- ============================================================
-- PAYWALL v0.4 — Database Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add unlocked column to results table
ALTER TABLE results ADD COLUMN IF NOT EXISTS unlocked BOOLEAN DEFAULT FALSE;

-- 2. Create access_codes table
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  used_by TEXT REFERENCES results(id),
  used_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security for access_codes
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if a code exists (needed for validation)
CREATE POLICY "Anyone can check codes" ON access_codes
  FOR SELECT USING (true);

-- Allow anyone to claim a code (update used_by and used_at)
CREATE POLICY "Anyone can claim a code" ON access_codes
  FOR UPDATE USING (true) WITH CHECK (true);

-- 4. Insert initial access codes
INSERT INTO access_codes (code, note) VALUES
  ('GRASSROOT2026', 'Grassroots Hoppers community'),
  ('JULIEN-FRIEND', 'Personal handout'),
  ('WORKSHOP-FREE', 'Workshop participants'),
  ('BETA-TESTER01', 'Beta testing'),
  ('BETA-TESTER02', 'Beta testing'),
  ('BETA-TESTER03', 'Beta testing'),
  ('BETA-TESTER04', 'Beta testing'),
  ('BETA-TESTER05', 'Beta testing');
```

## Adding More Access Codes

To add more codes later, run:

```sql
INSERT INTO access_codes (code, note) VALUES
  ('YOUR-CODE-HERE', 'Description of who this is for');
```

## Checking Code Usage

To see which codes have been used:

```sql
SELECT code, note, used_by, used_at
FROM access_codes
ORDER BY created_at;
```

## Stripe Payment (Future)

When ready to add Stripe:

1. Create a Stripe Payment Link at https://dashboard.stripe.com/payment-links
2. Product: "Unstuck — Full Interpretation" — €5.00 one-time
3. Set success URL to: `https://yourdomain.com/results.html?id={CHECKOUT_SESSION_ID_OR_RESULT_ID}&unlocked=true`
4. In `results.html`, update `const STRIPE_LINK = null;` to the Payment Link URL
5. The payment button will automatically appear in the paywall card

## Backward Compatibility

- Hash-based result URLs (pre-paywall users) see everything unlocked
- The `unlocked` column defaults to `false` for new results
- Existing results in Supabase will show as locked; use access codes to unlock them if needed
