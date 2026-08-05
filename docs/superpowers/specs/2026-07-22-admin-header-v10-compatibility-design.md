# Admin Header NHSUK v10 Compatibility Design

**Date:** 2026-07-22

## Goal

Retain NHSUK frontend v10 globally while restoring the admin header’s original desktop and mobile visual layout and interaction behavior shown in the pre-upgrade screenshots.

## Context

Commit `3606c61c` replaced the v7-specific admin header markup and approximately 18 KB of component SCSS with NHSUK v10 classes and a small custom stylesheet. This removed legacy size, but also delegated important layout behavior to v10 defaults. The resulting header differs from the original in desktop breakpoints, active navigation tabs, submenu layout/descriptions, mobile branding/account presentation, menu controls, spacing, and colors.

## Design

Keep `nhsuk-frontend` v10 as the global design-system dependency. Limit compatibility rules to `HeaderAdminComponent` using `app-admin-header__*` selectors. Restore the old layout contract explicitly rather than restoring the old v7 stylesheet wholesale.

### Desktop behavior

- Use the original large-screen breakpoint at `61.875em` for the horizontal navigation.
- Render the service logo/name and account information in the header container with the old visual alignment.
- Render navigation on the NHS blue background with a thin top border, horizontal items, white active-tab background, dark active-tab text, and right-aligned account/sign-out items.
- Position an open submenu across the navigation width, below the navigation bar, with the original two-column child-link/description presentation.
- Preserve chevron direction and active/open styling for parent menu buttons.

### Mobile behavior

- Use the original compact header composition: NHS logo/service, user information, yellow Menu button, and white menu panel.
- Keep the navigation closed by default and expose it through the Angular `navigationOpen` state.
- Render menu rows with separators, blue links, chevrons, and the original close control/focus treatment.
- Expand child menus inline without losing the old spacing or link hierarchy.

### State and accessibility

- Keep Angular event handlers for open/close behavior; do not reintroduce `ngAfterViewInit` DOM listeners.
- Keep `aria-expanded`, `aria-controls`, navigation labels, and visually-hidden close text synchronized with state.
- Close the main menu on route navigation and close parent submenus when another parent opens.
- Preserve existing sign-out, role-switching, notification, router-link, and full-reload behavior.

## Files

- Modify `src/modules/theme/components/header/header-admin.component.html` for compatibility structure/classes and semantic controls.
- Modify `src/modules/theme/components/header/header-admin.component.scss` for scoped responsive compatibility rules.
- Modify `src/modules/theme/components/header/header-admin.component.ts` only where state or focus behavior needs correction.
- Add or extend a focused header component spec alongside the component if current test coverage does not cover these behaviors.

No global NHSUK v10 stylesheet, package version, or unrelated header component should be reverted.

## Verification

- Run focused admin-header unit tests, then the project lint and SPA build.
- Compare rendered output at the old mobile, tablet, and desktop viewport sizes against the supplied reference screenshots.
- Verify keyboard focus, menu open/close, submenu expansion, route reset, sign-out, role switching, notifications, and full-reload links.
- Confirm the compatibility stylesheet remains materially smaller than the removed v7 stylesheet.

