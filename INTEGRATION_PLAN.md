# Integration Plan for Migrating Prototype Code to Production

This document outlines the complete integration plan for incorporating the prototype code into the production repository (lukemoderwell/zippo). It covers the following areas:

## 1. Directory Structure

- **Analysis**: The production codebase includes directories such as `app`, `components`, `hooks`, `lib`, `public`, `styles`, etc. Prototype files are organized into UI components, theme providers, hooks, and style files.
- **Decisions**:
  - Place UI components (e.g. `alert.tsx`, `button.tsx`, etc.) under `components/ui` and the kokonutui-specific components under `components/kokonutui` to keep concerns separated.
  - Global CSS files from prototype (e.g. `app/globals.css`) will be merged with production globals in `app/globals.css` and `styles/globals.css`.
  - Hooks from the prototype (e.g. `use-mobile.tsx` and `use-toast.ts`) will reside in the `hooks/` folder.
  - Utility functions like `cn` in `lib/utils.ts` are centralized and reused across components.
- **Impact**: This organization supports both scalability and maintainability, ensuring that future developers can quickly locate UI, business-logic, and style files.

## 2. Code Adaptation

- **Framework-specific adjustments**:
  - Confirm that each client component begins with `'use client'` as necessary.
  - Update import paths and aliases to adhere to the settings in `tsconfig.json` and `components.json`.
- **Changes**: Rename file paths if necessary and adjust inline styles to use Tailwind CSS classes instead of hardcoded CSS values.
- **Impact**: Revised components follow production patterns and benefit from centralized theme tokens.

## 3. Dependency Management

- **Review**: Cross-check the dependencies in the prototype with existing dependencies in `package.json`.
- **Decisions**:
  - Use already approved packages (e.g. `next-themes`, `lucide-react`, `react-hook-form`) to avoid bloat.
  - Remove any redundant dependencies.
- **Impact**: Reduced maintenance burden and potential performance gains due to smaller bundle sizes.

## 4. Integration Steps

1. **Merge .gitignore**: Ensure the prototype’s .gitignore rules are integrated into the existing .gitignore.
2. **Global Styles**: Incorporate Tailwind base, components, and utilities from `app/globals.css` and `styles/globals.css` while maintaining CSS variable consistency.
3. **Component Migration**: Move all prototype components into the appropriate directories (e.g., `components/ui`, `components/kokonutui`). Update all import paths accordingly.
4. **Hooks & Utilities**: Place hook files (`hooks/use-mobile.tsx`, `hooks/use-toast.ts`) and lib files (`lib/utils.ts`) into their respective directories, ensuring no conflicts with existing code.
5. **Configuration Files**: Review and merge changes in `next.config.mjs`, `tailwind.config.js`, and `tsconfig.json` as needed.
6. **Testing & Verification**: Run the development server and execute unit and integration tests to verify that the UI behaves as expected across themes and devices.

## 5. Code Style and Patterns

- **Consistency**: All components will use the `cn` utility to merge Tailwind class names and follow the naming conventions defined in the production code.
- **Justification**: This minimizes cognitive overhead for developers and prevents style conflicts.

## 6. Impact Analysis and Risks

- **Path & Import Issues**: Moving files may break relative paths. Automated tests and manual testing will verify imports.
- **Theming Inconsistency**: Misalignment in CSS variables can lead to design issues. Careful review of Tailwind configuration and CSS variables is necessary.
- **Responsive Behavior**: Ensure that hooks like `useIsMobile` continue to work after integration.

## 7. Testing Recommendations

- **Unit Tests**: Write tests for UI components and hooks to validate functionality, interactions, and style consistency.
- **Integration Tests**: Use tools like Cypress or Playwright to simulate user interactions in both desktop and mobile scenarios.
- **Manual QA**: Perform a complete walkthrough of flows sensitive to theme changes and navigation (e.g. sidebar toggle, dashboard content updates).

## Final Notes

All changes should be integrated in small, testable commits. Peer review and testing are essential after each integration step to minimize risks. Any breaking changes should be documented and communicated to the team.

---

*This document will be maintained in the repository root as a reference for future integrations and as a guide for on-boarding new team members.*