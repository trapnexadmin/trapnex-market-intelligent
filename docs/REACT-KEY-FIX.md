# Dashboard React key warning fix

GitHub inspection found two real warnings in `app/page.tsx`.

## 1. Market ticker

Current:

```tsx
].map((x) => (
  <div>
```

Change to:

```tsx
].map((x) => (
  <div key={x[0]}>
```

## 2. Portfolio health bars

Current:

```tsx
].map((x) => (
  <p>
```

Change to:

```tsx
].map((x) => (
  <p key={x[0]}>
```

These keys are stable because the labels are unique within each list.

Run:

```bash
node scripts/fix-dashboard-keys.mjs
```

Then restart Next.js and verify the browser console.

Note: GitHub write access returned HTTP 403 during this turn, so this fix is supplied as a deterministic patch script rather than pretending it was pushed.
