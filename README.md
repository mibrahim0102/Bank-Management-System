# Evergreen Bank

A responsive, frontend-only banking management demo built with React, React Router and Vite. Users, accounts, transactions and the signed-in session are stored in this browser's `localStorage`; there is no backend or database.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create a production build in `dist/`.

## Demo sign-in

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@gmail.com` | `admin123` |
| Customer | `user@gmail.com` | `user123` |

Additional sample customers are `sara@gmail.com` / `sara123` and `usman@gmail.com` / `usman123`. The blocked Usman account demonstrates status-based access control. New registrations receive an active account with a zero balance.

## What to explore

- Customer overview, account summary, deposit, withdrawal, transaction search/filter/date sort, and editable profile.
- Administrator overview, customer CRUD, account CRUD and status controls, bank-wide transaction search/filter/delete, and reports.
- Responsive navigation, route protection, confirmation prompts, validation, success notifications, print/export, and reduced-motion support.
- Animated, transaction-backed balance-history chart with deposit and withdrawal totals on the customer overview.
- Subtle dashboard, activity-indicator, login-illustration, and card animations; system reduced-motion preferences are respected.
- Accessible route transitions, first-view shimmer skeletons, count-up banking metrics, SVG chart/ring animations, staggered table rows, delete exits, animated confirmations, and report visualizations.
- Motion effects adapt to `prefers-reduced-motion`; navigation, validation, feedback, and responsive behavior remain keyboard-friendly.
- Evergreen's original fintech bento redesign adds a cool green-gray canvas, soft rounded white mosaic cards, a forest-gradient balance hero, pill controls and hatching-backed activity visuals.
- Theme tokens are centralized in `src/index.css`: canvas `#E8EDEA`, shell `#F4F7F5`, forest `#0F5A3C` / `#0A3D2A`, mint `#5FCB8F` / `#DDF3E6`, coral `#FF7A59`, indigo `#4452E0`, amber `#F5B942`, and 24px / 16px / pill radii.
- Customer and administrator dashboards include derived weekly/monthly stacked activity, a keyboard-accessible transaction calendar, comparison bars and recent-activity cards. The customer overview also supports validated quick deposits.
- Shared `BentoCard`, `PillSelect`, `TickMeter`, `PillBarChart`, `HBarList` and `ActivityCalendar` components keep the redesign reusable. Their metrics are derived from existing local transactions and do not create new stored data.
- Responsive dashboards use 12 columns on desktop, two columns on tablet and one column below 640px; the existing reduced-motion, focus and chart-accessibility support is retained.

## Demo data and security

Clearing this site's local storage restores the sample data. The app uses browser storage and plain demo passwords only; it is not a real bank, does not provide server-side authentication, and must not be used for real customer information or funds.

For the architecture, bento design tokens and components, data model, demo workflows and project limitations, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).
