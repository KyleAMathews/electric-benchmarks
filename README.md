# Electric Benchmarks

## Setup
1. start electric — `npm run backend:start`
2. Run migration — `npm run db:migrate`
3. load data (modify script to control how many rows are created) — `npx tsx load-users.ts`
4. Run benchmark e.g. w/ concurrency of 10 — `hyperfine --warmup 3 'npx tsx ./main.ts 10'`
