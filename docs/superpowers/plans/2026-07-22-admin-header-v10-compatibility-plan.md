# Admin Header NHSUK v10 Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task, with review checkpoints after each task.

**Goal:** Restore the original admin-header desktop/mobile appearance and behavior while keeping NHSUK frontend v10 globally and keeping the replacement stylesheet materially smaller than the removed v7 stylesheet.

**Architecture:** Use one scoped `HeaderAdminComponent` compatibility layer. A read-only analyst establishes the screenshot/DOM baseline, one implementation owner changes the shared HTML/SCSS/TS files, and separate test/reviewer agents verify behavior and visual contracts. Shared implementation files are never edited concurrently.

**Tech Stack:** Angular, TypeScript, Angular templates, SCSS, Jest, NHSUK frontend 10.3.1.

---

## Subagent ownership and sequencing

1. **Baseline analyst — read-only.** Record current/pre-rewrite markup, breakpoint rules, computed visual contracts, and affected test/build commands. No file changes.
2. **TDD/test agent — test files only.** Add focused failing `HeaderAdminComponent` tests based on the baseline. Do not edit component implementation.
3. **Header implementation agent — component files only.** Make the minimal template/state/style changes and run focused tests. Owns `header-admin.component.html`, `.scss`, and `.ts`.
4. **Verification agent — read-only first, then test/build commands.** Review the diff against the design and screenshots, run lint/build/tests, and report any remaining mismatch. It must not silently alter implementation files.

The test agent must finish before the implementation agent starts. The verification agent starts only after the implementation agent reports passing focused tests.

## Task 1: Establish the visual and code baseline

**Owner:** Baseline analyst subagent

**Files:** None modified.

- [ ] Inspect `3606c61c^` and `HEAD` versions of:
  - `src/modules/theme/components/header/header-admin.component.html`
  - `src/modules/theme/components/header/header-admin.component.scss`
  - `src/modules/theme/components/header/header-admin.component.ts`
- [ ] Record the old and new breakpoints, service/account markup, navigation classes, submenu layout rules, and menu state transitions.
- [ ] Confirm the three target viewport categories from the supplied references: mobile phone, tablet/small desktop, and wide desktop.
- [ ] Establish the stylesheet baseline with:

```bash
git show 3606c61c^:src/modules/theme/components/header/header-admin.component.scss | wc -c
git show 3606c61c:src/modules/theme/components/header/header-admin.component.scss | wc -c
npm run lint
```

- [ ] Return a concise report identifying the exact selectors that must be restored and any current v10 selectors that must be overridden. Do not commit changes.

## Task 2: Add failing behavioral tests

**Owner:** TDD/test subagent

**Files:**
- Create or modify: `src/modules/theme/components/header/header-admin.component.spec.ts`

- [ ] Follow the existing Angular/Jest setup used by `src/app/app.component.spec.ts` and the nearby theme component specs.
- [ ] Create the component with `TestBed`, stub `CookiesService`, `Router`, and the minimum `CtxStore` user methods required by the template.
- [ ] Add tests for the state contract:

```ts
it('starts with the main navigation closed', () => {
  expect(component.navigationOpen).toBe(false);
});

it('toggles and closes the main navigation', () => {
  component.toggleNavigation();
  expect(component.navigationOpen).toBe(true);
  component.closeNavigation();
  expect(component.navigationOpen).toBe(false);
});

it('opens one parent menu and closes the other', () => {
  component.leftMenuBarItems = [
    { id: 'management', label: 'Management', children: [{ label: 'Users', url: '/users' }] },
    { id: 'communications', label: 'Communications', children: [{ label: 'Announcements', url: '/announcements' }] }
  ];
  component.ngOnInit();
  component.onHeaderMenuClick(component.leftMenuBarItems[0]);
  component.onHeaderMenuClick(component.leftMenuBarItems[1]);
  expect(component.leftMenuBarItems[0].isOpen).toBe(false);
  expect(component.leftMenuBarItems[1].isOpen).toBe(true);
});
```

- [ ] Add template assertions for `aria-expanded`, `aria-controls`, the mobile menu button, the close button, and the `[hidden]` submenu state.
- [ ] Add regression assertions that service name, user information, role-switch link, sign-out, notification tags, router links, and full-reload links remain rendered.
- [ ] Run the focused spec and confirm the new layout/state expectations fail against the current rewrite before implementation begins.

## Task 3: Restore the compatibility markup and state contract

**Owner:** Header implementation subagent

**Files:**
- Modify: `src/modules/theme/components/header/header-admin.component.html`
- Modify: `src/modules/theme/components/header/header-admin.component.ts`

- [ ] Keep the NHSUK v10 global classes where they provide typography and base controls, but add stable `app-admin-header__*` hooks for every compatibility rule.
- [ ] Restore the old visual grouping in the template:
  - service logo/name group;
  - user-information group with display name, role/unit description, and “Switch profile” behavior;
  - desktop/mobile menu control group;
  - primary navigation list with left items, right items, and sign-out;
  - submenu container with description and child links.
- [ ] Keep state Angular-driven. Do not reintroduce `AfterViewInit`, `querySelector`, or manually attached click listeners.
- [ ] Ensure parent-menu buttons use unique IDs based on `item.id` and have matching `aria-controls`; keep `[hidden]` synchronized with `item.isOpen`.
- [ ] Ensure route navigation calls `closeNavigation()` and that opening one parent closes any other open parent.
- [ ] Preserve all existing link modes and notification rendering.
- [ ] Run the focused header spec and make the behavior tests pass before changing visual rules further.

## Task 4: Recreate the old visual contracts with scoped SCSS

**Owner:** Same header implementation subagent, after Task 3

**Files:**
- Modify: `src/modules/theme/components/header/header-admin.component.scss`

- [ ] Keep the stylesheet component-scoped and target `app-admin-header__*` selectors; do not restore the deleted global `.nhsuk-*-v7` stylesheet.
- [ ] Implement desktop rules at `@media (min-width: 61.875em)`:
  - blue navigation bar and subtle top border;
  - horizontal navigation list and old item spacing;
  - white active/open tab with dark text and bottom border/focus treatment;
  - right alignment for account/sign-out items;
  - full-width absolute submenu under the nav;
  - two-column child links and visible descriptions.
- [ ] Implement mobile rules below `61.875em`:
  - compact service/logo and account alignment;
  - NHS yellow menu button and visible focus state;
  - hidden navigation until `navigationOpen` is true;
  - white menu panel, blue links, row separators, chevrons, and close control;
  - inline submenu expansion with the old indentation and spacing.
- [ ] Explicitly override only v10 rules that cause the screenshot regressions, such as the v10 40.0625em navigation breakpoint, default navigation padding, default flex list behavior, and account styling.
- [ ] Use v10 color variables/tokens where available, with exact legacy values only for visual compatibility.
- [ ] Compile the component stylesheet and verify the compressed output remains materially below the pre-rewrite 16,121-byte compiled baseline.

## Task 5: Independent verification and visual review

**Owner:** Verification/reviewer subagent

**Files:** None modified unless a test-only correction is explicitly agreed.

- [ ] Review the diff for unintended global selectors, restored `v7` names, duplicated NHSUK v10 rules, and unsafe DOM event code.
- [ ] Run:

```bash
npm test -- --runInBand src/modules/theme/components/header/header-admin.component.spec.ts
npm run lint
npm run build:spa
```

- [ ] Verify the header at the reference viewport categories:
  - mobile closed/open menu;
  - desktop Management submenu open;
  - desktop Communications submenu open;
  - desktop collapsed navigation;
  - role/account and sign-out visibility.
- [ ] Check keyboard focus and screen-reader attributes for the menu button, close button, parent submenu buttons, links, and skip link.
- [ ] Confirm the final stylesheet has no `v7`, `header-v7`, or `width-container-v7` selectors and remains materially smaller than the old component stylesheet.
- [ ] Report PASS/FAIL with exact file/line references; do not claim completion if build or visual checks fail.

## Commit checkpoints

- [ ] Commit the focused tests: `test: cover admin header compatibility behavior`
- [ ] Commit the implementation: `fix: restore admin header v10 compatibility layout`
- [ ] Commit any test-only verification correction separately if required.

