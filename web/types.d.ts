// The root @tonyh-2-eightfold/ef-design-system package doesn't currently emit
// TypeScript declarations. Treat it as untyped (any-typed exports) so the
// Next.js build doesn't fail on imports from the catalog.
// Follow-up: add a tsc -d declaration build at the root so types come through.
declare module "@tonyh-2-eightfold/ef-design-system";
declare module "@tonyh-2-eightfold/ef-design-system/tokens";
declare module "@tonyh-2-eightfold/ef-design-system/styles";
