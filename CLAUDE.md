# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000 with HMR
npm run build      # Type-check (tsc -b) then bundle with Vite
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm run test       # Run tests once (vitest run)
npm run test:watch # Run tests in watch mode (vitest)
```

## Testing

**Stack:** Vitest + React Testing Library + jsdom

- Test files: `src/**/*.test.tsx`
- Setup file: `src/test/setup.ts` (imports `@testing-library/jest-dom` matchers)
- Vitest configured in `vite.config.ts` under the `test` key
- `globals: true` — no need to import `describe`/`it`/`expect` in test files

**Conventions:**
- Co-locate test files next to the component being tested (e.g., `App.test.tsx` beside `App.tsx`)
- Use `userEvent.setup()` for user interactions (preferred over `fireEvent`)
- Query by role/label/text — avoid querying by class or test IDs unless necessary

## Architecture

This is a minimal React 19 + TypeScript + Vite starter. The entry point is `index.html` → `src/main.tsx` → `src/App.tsx`.

**TypeScript config is split:**
- `tsconfig.app.json` — compiles `src/` (target ES2022, strict mode)
- `tsconfig.node.json` — compiles Vite config files (target ES2023)
- `tsconfig.json` — references both via composite project references

**ESLint** uses the flat config format (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. The `dist/` directory is excluded.

**Strict TypeScript** is enforced: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports` are all enabled.

For production apps, consider upgrading ESLint to use `recommendedTypeChecked` or `strictTypeChecked` (see README.md for details).