# Testing

How to run tests for the Portal and org web.

## Org web (`w3pn-org-web`)

At the moment there is no dedicated test suite. To add tests later:

- **Unit / component tests:** Consider Vitest + React Testing Library (Vite-friendly).
- **E2E:** Consider Playwright or Cypress against the built app.

When tests exist, they will be run with a command such as:

```bash
cd w3pn-org-web
npm test
```

(Exact command to be added with the test setup.)

## Portal (`apps/web`)

Check the portal app for existing test scripts:

```bash
cd apps/web
npm test
```

If present, see `package.json` and the test framework (e.g. Jest, Vitest) config for details.

## CI

Once CI is set up for this repo, it will run:

- Lint and type checks
- Unit and integration tests for apps that have them
- Build of org web and portal to ensure they compile

This section will be updated when CI and test commands are finalised.
