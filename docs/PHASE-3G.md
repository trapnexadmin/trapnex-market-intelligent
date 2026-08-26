# Phase 3G — Navigation + Functional Page Boundaries

The current dashboard sidebar must be real navigation, not inert buttons.

Functional pages:
- /
- /stocks
- /stocks/[symbol]
- /market-pulse
- /live-market
- /market-breadth
- /sector-pulse

Future pages can render explicit Coming Soon states until their APIs are complete.

The current dashboard still contains demo text/values in several panels. Those
must be removed as each live API is wired. Never present demo values as live data.
