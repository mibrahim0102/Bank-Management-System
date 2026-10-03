# Evergreen Bank
## Frontend Banking Management System — Project Documentation

**Project type:** University Software Engineering demonstration  
**Application:** Responsive, frontend-only banking management web application  
**Technology:** React, JavaScript, React Router, CSS, Vite and browser `localStorage`  
**Backend/database:** None

---

## 1. Project overview

Evergreen Bank is a working browser-based demonstration of everyday customer banking and bank administration. It brings customer account information, deposits, withdrawals and transaction history together with administrative tools for managing customers, accounts and bank-wide activity.

The project demonstrates how a multi-role application can organize navigation, reusable interface components, form validation, state updates, client-side persistence and responsive design. It is a software-engineering demonstration, **not a real banking service**.

### Project goals

- Provide different, role-appropriate customer and administrator experiences.
- Demonstrate CRUD workflows for customers, accounts and transaction records.
- Validate money operations and prevent withdrawals from exceeding the available balance.
- Persist demo records and the active sign-in between browser sessions.
- Keep the React code organized into understandable, reusable project areas.
- Present the workflows in an accessible, responsive banking-style interface.

---

## 2. Roles and demonstration accounts

| Role | Email | Password | Capabilities |
| --- | --- | --- | --- |
| Administrator | `admin@gmail.com` | `admin123` | View bank-wide totals, manage customers and accounts, view and delete transaction records, review reports |
| Customer — Ali Khan | `user@gmail.com` | `user123` | Review own account and history, deposit, withdraw, search and filter transactions, update profile |
| Customer — Sara Ahmed | `sara@gmail.com` | `sara123` | Review own seeded account and transaction history |
| Customer — Usman Raza | `usman@gmail.com` | `usman123` | Demonstrates that a blocked account cannot sign in or make transactions |

Sample customer records include a name, email, phone number, CNIC, role, account type and number, balance and account status. Ali’s seeded account demonstrates a PKR 50,000 balance. Sample data loads automatically when the app is opened with no existing Evergreen data in local storage.

Passwords in these example accounts are for **demo access only**.

---

## 3. Features and workflows

### Authentication and registration

- Sign-in form accepts an email address and password.
- Demo-account buttons fill the corresponding sign-in fields.
- Customers and administrators are redirected to their respective dashboards after sign-in.
- Routes require a signed-in session and enforce the appropriate role.
- The registration form collects full name, email, phone, CNIC, account type, password and password confirmation.
- New registrations receive an active customer account, a generated account number, zero balance and a signed-in session.
- Duplicate email addresses, invalid phone numbers, short passwords and mismatched password confirmation are rejected with a visible error.
- Blocked and closed customers cannot sign in.

### Customer workspace

- **Overview:** greets the customer, summarizes the current account and balance, offers money movement shortcuts and shows recent activity.
- **Balance history:** draws an animated chart from that customer’s saved transaction balances, highlights the current balance and totals that customer’s deposits and withdrawals. It displays an empty-state message if no balance history exists.
- **My account:** shows account and contact details, current balance, total deposits, total withdrawals and last transaction.
- **Deposit:** records a positive amount, date and optional description; the balance is increased immediately and a transaction record is created.
- **Withdrawal:** validates a positive amount, rejects amounts greater than the available balance, and records a successful withdrawal.
- **Transactions:** displays only the signed-in customer’s records and provides text search, deposit/withdrawal filtering, date-order sorting and pagination.
- **Profile:** permits updates to the customer’s name, email, phone and password. Password changes require at least six characters; leaving the password blank keeps the current password.

### Administrator workspace

- **Overview:** displays customer count, bank balance, deposits, withdrawals, recent transactions and a live active-account percentage.
- **User management:** lists customers and supports name/email/phone/account search, status filtering, pagination, customer detail inspection, adding, editing and deleting a customer. Customer deletion requires confirmation and removes that customer’s linked account and transactions.
- **Accounts:** lists account holders, account numbers, types, balances and statuses. Supports search, status filtering, creating and editing accounts, details inspection, status updates, deletion confirmation and pagination.
- **Transactions:** searches and filters records across the bank. Administrators can inspect transaction details and delete a transaction record after confirmation.
- **Reports:** summarizes customer balances, deposit and withdrawal totals, average balance and account-type mix using clear visual comparisons.
- **Administrator profile:** permits profile details and password updates.

### Shared interface behavior

- Success and validation notifications appear in response to actions.
- Destructive administrative operations use a confirmation prompt.
- Tables display useful empty states and paginate longer result sets.
- Print/export actions open the browser print experience.
- On small screens, the sidebar becomes a toggleable navigation drawer.
- User-entered descriptions, profile changes and banking records are reflected throughout the React interface.

---

## 4. Design and visual system

### Visual direction

Evergreen Bank uses an original forest-green fintech bento system: a cool green-gray canvas (#E8EDEA), a softly bordered app shell (#F4F7F5), and white rounded cards arranged as a responsive mosaic. The customer and administrator dashboards use one deep forest-gradient hero card with low-opacity contour-line artwork; supportive cards remain white with restrained shadows and roomy spacing. Inflow uses green, outflow coral, selected/neutral highlights indigo, and warnings amber. Hatched tracks distinguish empty capacity in bar charts and inactive calendar days. The visual language borrows no product marks, names, or exact layouts from the reference inspiration.

The centralized CSS palette is `--canvas: #E8EDEA`, `--shell: #F4F7F5`, `--forest: #0F5A3C`, `--forest-deep: #0A3D2A`, `--mint: #5FCB8F`, `--mint-light: #DDF3E6`, `--coral: #FF7A59`, `--indigo: #4452E0`, `--amber: #F5B942`, and `--muted: #6B7A73`. Shared geometry uses `--r-card: 24px`, `--r-inner: 16px`, and `--r-pill: 999px`.

### Typography

- **Manrope** provides the stronger display and heading style.
- **DM Sans** is used for interface text, labels, tables and supporting information.
- Headings and body text scale for mobile layouts; the larger dashboard titles, labels and table content are tuned for readability.
- System sans-serif fallbacks remain available if the hosted fonts cannot be loaded.

### Visual components

- A centered, rounded application shell contains the icon-and-label sidebar, active forest-green pill navigation, a pill-shaped activity shortcut, round utility buttons, and the signed-in profile chip.
- Responsive dashboard cards follow a 12-column desktop bento grid, collapsing to two columns at tablet widths and one column below 640px.
- Shared `BentoGrid` and `BentoCard` containers, pill selects, icon buttons, tick meters, stacked pill charts, comparison bars, and transaction calendars keep dashboard patterns consistent.
- The customer hero card shows an animated, hideable balance, account reference and direct deposit/withdrawal links; the adjacent health meter is explicitly a demo indicator.
- The administrator hero summarizes bank balance and customer count with direct routes to customer and account creation.
- Recent activity cards use round deposit/withdrawal icon markers, and both dashboards show derived weekly/monthly activity, transaction calendars, and useful empty states.
- Account, transactions, user, report and profile pages reuse the same soft card, pill-control and hatched table-hover styling.
- Login and registration retain the split story/form composition inside the rounded Evergreen shell, with green-gradient artwork and pill-shaped controls.
- The transaction-backed balance chart includes grid lines, data points, a gradient fill and date labels, now recolored to the forest/mint palette.
- Lucide icons keep navigation and action affordances consistent.

### Motion and accessibility

- Motion uses shared duration and easing tokens and relies primarily on `transform` and `opacity`; no animation library is required.
- Customer and administrator pages show a short shimmer skeleton on entry, then fade and rise gently into place.
- Dashboard counters ease up to their PKR/count targets. The balance card number fades between visible and concealed states and its dark-green gradient receives a brief shimmer sweep on entry.
- The balance-history chart draws its path and reveals points in sequence. Report bars grow in a short stagger, the account-type mix uses an SVG donut, and active-account percentages use animated SVG progress rings in both the reports and administrator overview.
- Table rows enter in a capped stagger; confirmed customer, account and transaction deletions fade and collapse before their records are removed.
- Dialogs scale and fade into place, while success/error notifications arrive from the top-right and display a timed progress indicator. Successful actions include an animated SVG checkmark.
- Invalid forms and failed sign-ins give brief shake feedback. Form fields and the login story panel enter in sequence.
- Sidebar selection, mobile drawer/backdrop, cards, and primary-button press/ripple effects have subtle motion. Existing search/filter controls are selects and inputs rather than tabs; no artificial tab interface was added.
- Shared `--dur-fast`, `--dur-base`, `--dur-slow`, `--ease-out` and `--ease-soft` tokens keep transitions consistent. Count-up animation checks the operating-system/browser reduced-motion preference in JavaScript.
- `prefers-reduced-motion: reduce` disables decorative CSS motion, immediately settles report/chart visuals, and displays animated counters at their final values.
- Keyboard focus remains visibly outlined; notifications announce through polite status or assertive error live regions; the balance graph and SVG rings have accessible text alternatives.
- The theme tokens include `--r-card` (24px), `--r-inner` (16px), and `--r-pill` (999px); large dashboard amounts use a light Manrope weight and tabular numerals. Interface copy uses high-contrast forest/charcoal colors, while coral is reserved for marked outflow shapes paired with readable dark text.
- Activity visualizations are derived from existing transaction records only: local-week and month buckets, daily transaction type/counts, account type totals, and top customer balances are not persisted.
- Pill chart buttons and calendar day controls are keyboard reachable and expose transaction summaries; the stacked chart also includes a visually hidden data table. The quick-deposit amount retains a visible associated label and uses the existing transaction validation/operation.

---

## 5. Technology and application structure

| Technology | Use |
| --- | --- |
| React 18 | Page composition, reusable components and application state |
| React Router 7 | Client-side navigation and role-guarded routes |
| JavaScript / JSX | Application and UI logic |
| CSS | Responsive layout, visual design, chart rendering and animations |
| Vite | Local development server and production bundling |
| `lucide-react` | Consistent interface icons |
| `localStorage` | Persistent browser-side demo data |

### Source layout

```text
src/
├── components/
│   ├── BalanceTrend.jsx       # Animated, transaction-derived balance chart
│   ├── Forms.jsx              # Deposit, withdrawal, profile, user and account forms
│   └── UI.jsx                 # Buttons, cards, modals, tables, badges, pagination
├── context/
│   └── BankContext.jsx        # Shared records, login, CRUD and transaction operations
├── data/
│   └── seed.js                # Demonstration customer and transaction records
├── layouts/
│   └── AppLayout.jsx          # Role-aware sidebar, header, footer and notifications
├── pages/
│   ├── AdminPages.jsx         # Administrator dashboard, customers, accounts and reports
│   ├── AdminShared.jsx        # Shared administrator account form dialog
│   ├── Auth.jsx               # Sign-in and registration pages
│   └── UserPages.jsx          # Customer dashboard, account, money and profile screens
├── services/
│   └── storage.js             # Read/write browser-persisted application state
├── utils/
│   └── format.js              # Shared PKR currency and date formatting
├── App.jsx                    # Route definitions and route guards
├── index.css                  # Global design system, responsive rules and motion
└── main.jsx                   # React entry point and application providers
```

The project root also contains `index.html`, `vite.config.js`, `package.json`, `package-lock.json`, `README.md` and this document.

### State and operation flow

1. `main.jsx` mounts the React application, router and bank context.
2. The bank context initializes from the storage service, which loads saved records or the demonstration seed.
3. The route guard checks the signed-in user and, where required, their role before showing a protected page.
4. Page forms call bank-context operations to validate and change banking data.
5. Updated React state is written to browser storage so it is available on the next visit.
6. Tables, account summaries, charts and dashboard totals derive their display from the current records.

---

## 6. Data model and persistence

The browser stores JSON values under these keys:

| Local-storage key | Contents |
| --- | --- |
| `evergreen_users` | Administrator and customer profiles, role, account summary, status and demo password |
| `evergreen_accounts` | Account identifier, linked customer, account number, type, balance and status |
| `evergreen_transactions` | Transaction identifier, customer and account references, type, amount, date, description and resulting balance |
| `evergreen_current_user` | Identifier for the signed-in user |

Transactions are tagged as **Deposit** or **Withdrawal**. Successful transactions update the customer’s balance and the corresponding customer account, then insert a history record containing the resulting balance. Withdrawals are rejected when the requested amount exceeds that customer’s balance.

New users receive a generated account number. New administrator-created accounts can be linked to an existing customer; the customer record provides the primary account summary displayed in that customer’s banking pages.

To restore the built-in sample state in a browser, clear the application’s site data/local storage and reload it. Clearing browser data will also remove registrations and changes made during the demonstration.

---

## 7. Install, run and build

Use Node.js and npm. In a terminal opened at this project folder:

```powershell
npm install
npm run dev
```

Open the local address Vite prints in the terminal. For a production build:

```powershell
npm run build
npm run preview
```

The optimized build is written to `dist/`. There is no API server to start, and no external banking service or database is needed.

---

## 8. Validation and user feedback

- Registration checks required identity/contact information, email uniqueness, phone-number format and matching passwords.
- User forms validate names, email addresses, phone numbers and initial passwords.
- Account forms require an existing customer and reject duplicate account numbers.
- Account balances and money amounts must be valid nonnegative/positive numbers, as appropriate.
- Deposits and withdrawals require positive amounts and valid dates.
- Withdrawal validation checks available funds before recording the operation.
- Transactions are disabled for customers whose status is not active.
- Persistence errors are logged and surfaced in an error notification rather than presented as a successful save.
- User/customer records, transaction lists and account listings include filtering/search and paginated results.

---

## 9. Testing and verification

The delivered project was checked with a Vite production build and an npm dependency audit. Browser smoke checks exercised customer sign-in, dashboard rendering, a successful deposit, the insufficient-funds withdrawal response, administrator access, customer/account creation, and new-customer registration.

The responsive customer overview was checked at desktop and mobile widths; the tested mobile viewport did not introduce horizontal page overflow. The project does not currently include a dedicated automated unit- or end-to-end-test suite.

To reproduce manual testing:

1. Start the application with `npm run dev`.
2. Sign in with either demonstration account above.
3. For the customer workflow, try account overview, search/sort transaction history, and deposit/withdrawal forms. Test an attempted withdrawal above the available balance.
4. Sign out and use the administrator account to inspect customer, account, transaction and report pages.
5. Register a new customer and verify that the new session opens that customer’s dashboard.

---

## 10. Limitations and security notes

This is a **frontend-only teaching/demo project**, not a production banking system:

- Browser storage is controlled by the user and is not a secure or authoritative database.
- Demo passwords are stored as ordinary client-side data; there is no password hashing, server-side authentication or authorization.
- Role-based route guards improve the demonstration flow but cannot protect data from a user controlling their own browser.
- Transactions are simulated locally; no real bank, payment provider, ATM or external account is contacted.
- An administrator’s transaction-delete action removes a history record; it does not reverse or recalculate the account balance.
- This project does not implement real audit trails, banking settlement, regulatory checks, multi-device synchronization, server backups or access control.
- Do not enter real passwords, CNICs, personal data or financial information.
