# CertiX Achievements frontend contribution

This folder contains Ranim's focused Achievements-to-Records contribution. It is an integration bundle for the club application, not a replacement website.

## Included and excluded

Included: the achievement explorer, achievement record details, the add/edit/resubmit form, shared status display, scoped styles, explicit record types, related mock data, route helpers, and a browser-local mock repository.

Excluded: the dashboard and sidebar, profile and settings pages, unrelated record sections, the prototype shell, authentication, server code, API assumptions, package configuration, and copied dependencies.

## Folder structure

- src/components/AchievementsExplorer.tsx — search, category and status filters, sorting, cards, and empty/loading/error preview states.
- src/components/AchievementRecordDetail.tsx — detail and review history for the record opened from an achievement.
- src/components/AchievementRecordEditor.tsx — create, draft, edit, resubmit, review, validation, local evidence preview, and success states.
- src/components/AchievementStatus.tsx — shared status label and semantic colored dot.
- src/components/AchievementStyles.css — scoped component styles and theme-token contract.
- src/data/achievementTypes.ts — record, ID, history, status, and repository types.
- src/data/mockAchievements.ts — sample records copied from the prototype plus a rejected and draft example.
- src/data/achievementRepository.ts — isolated local mock data access and React subscription hook.
- src/utils/achievementRoutes.ts — current prototype route paths and date formatting.

## Preview in the existing prototype

The submission is intentionally not a standalone app and has no package manifest. In this workspace, the prototype folder is C:\Users\21625\Documents\Codex\2026-10-25\i-m-working-on-certix-a. Open a terminal there (the folder containing package.json) and run:

    npm.cmd run dev

Then open the local address printed by Vite and navigate to Achievements. This previews the prototype's existing implementation, not the isolated copies in this folder. To review the exact submitted modules inside the prototype shell, temporarily map the Achievements, record-detail, and editor routes below to these components. The prototype source has not been changed to do that here; the bundle is kept isolated for teammate integration.

## Integration guide

The components use React 18 or later and TypeScript and do not require another library. Each component imports the same scoped AchievementStyles.css file; the host bundler should include it once. If the production app centralizes styles, move that import to its stylesheet entry point. Then connect routes to:

- /achievements → AchievementsExplorer
- /records/detail?type=achievement&record=<id> → AchievementRecordDetail
- /records/new?type=achievement → AchievementRecordEditor with mode="new"
- /records/edit?type=achievement&record=<id> → AchievementRecordEditor with mode="edit" and that record ID

The current prototype uses ordinary links and reads the record query value. If production uses a client-side router or different paths, replace the route helper output or its anchor links with the team's route/link component. Keep the same record ID when moving from a card to its detail or editor view.

The component styles read these theme variables when the host provides them: --certix-primary, --certix-primary-hover, --certix-primary-active, --certix-on-accent, --certix-background, --certix-surface, --certix-ink, --certix-muted, --certix-border, and --certix-focus. Semantic status colors are read from --cxw-verified, --cxw-pending, and --cxw-rejected, with matching surface and border variables for feedback panels. Map different production token names in the host stylesheet. Accent color is used for actions and focus; verification statuses retain separate green, amber, red, and neutral colors. The dark-mode selector recognizes data-certix-theme="dark" for shadow tuning; the host still supplies its own light/dark surface and text tokens.

## Data and simulated behavior

An achievement is represented as one record with type "achievement". Its id is the same ID used in the explorer, detail URL, edit URL, and status history. Explicit statuses are verified, pending, rejected, and draft.

mockAchievements.ts holds the demonstration records. achievementRepository.ts is the only UI-facing data access layer. It supports listing, looking up by ID, subscribing to changes, and saving by ID. Its isolated browser key is certix.achievements.mock.v1; it is local demo storage, not a backend connection. If browser storage is unavailable, edits remain in memory for that page session. Save failures are shown in the editor.

Submitting, saving a draft, editing, and resubmitting update only the local mock repository. Selecting an evidence file creates a temporary browser preview and simulates local preparation progress; file bytes are never uploaded or persisted. Sample evidence names are display data, not attached files. Explorer loading, empty, and error options are demonstration states because the mock repository reads synchronously.

## Future backend handoff

Keep these UI models and replace the repository implementation after the production team confirms:

- how the signed-in member is identified and which records they may view or edit;
- API operations, request/response types, record ID format, and whether search/filter/sort are server-side;
- allowed status transitions, who supplies review history, and how rejection feedback is returned;
- evidence upload destination, accepted file rules, and metadata returned after upload;
- loading, retry, validation, and error response behavior;
- whether drafts and local prototype data should be migrated or cleared.

No endpoint, database schema, authentication flow, or server persistence is assumed. The production route, theme-token mapping, and navigation component are unresolved until the team's app conventions are known.

The existing prototype uses React 18.3.1 and Vite. It does not include the React TypeScript declaration package, so the focused TypeScript check for the TSX components could not run in this workspace. The model, mock data, and route helper files pass TypeScript checking. The production project should provide React typings if it compiles these components with TypeScript.
