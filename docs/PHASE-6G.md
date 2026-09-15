# Phase 6G — Database-backed Classification Loading

## Verified base
Phase 6F commit: `dc80cd9804b32c1df768646cbd47be16055fbe24`.

## Implementation
- Supabase REST adapter for `classification_snapshots`.
- Validated refreshes attempt durable persistence.
- Latest classifications are loaded by `as_of`.
- Unified Market Context can bootstrap the latest persisted classification set.
- The in-process registry remains a fallback when the database is unavailable.

## Server environment
`SUPABASE_URL`
`SUPABASE_SERVICE_ROLE_KEY`

Keep the service-role key server-side only.

## Verification
Apply `database/phase6f.sql` and `database/phase6g.sql`, refresh classifications,
confirm `persisted: true`, restart the server, then verify classification status,
unified market pulse, and opportunity endpoints.

## Safety
No synthetic classifications are created when durable data is missing.
