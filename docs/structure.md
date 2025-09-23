## Project Structure and Conventions

This document explains how the app is organized, how to build features, call data APIs, and apply styles. Follow these patterns for consistency.

### Directory layout

```
app/                     # Expo Router screens & layouts (navigation)
  _layout.tsx            # Root layout/navigation
  index.tsx              # Home route
  Login.tsx, Signup.tsx  # Auth routes (route-level wrappers)
src/
  components/ui/         # Reusable UI primitives (Button, Input, BottomSheet)
  db/                    # Drizzle ORM + SQLite database setup & schema
    database.ts          # db instance, session keys
    schema.ts            # drizzle tables (users, transactions, categories)
    migrations/          # SQL snapshots and helpers
  lib/                   # Small utilities (non-UI)
  modules/               # Feature modules (auth, transactions, ...)
    auth/
      components/        # Feature-specific UI for auth
      hooks/             # React Query hooks for auth flows
      server/            # Server-like functions using local DB
      index.ts           # Public exports for the feature
    transactions/
      components/        # Screens & feature UI (TransactionScreen, Item, etc.)
      hooks/             # React Query hooks (queries + mutations)
      server/            # Data access functions (CRUD + queries)
      types.ts           # Feature types
  providers/             # App-wide providers (React Query)
  utils/                 # App-level helpers (e.g., database init)
assets/                  # Images, fonts
```

### Navigation (Expo Router)

- Place route files inside `app/`. A file named `app/Foo.tsx` is navigable as `/Foo`.
- Use `router.push("/Route")` to navigate programmatically.

Example:

```tsx
import { router } from "expo-router";

function Example() {
  return <Button onPress={() => router.push("/Login")}>Go to Login</Button>;
}
```

### Data layer (Drizzle ORM + SQLite)

- Database is configured in `src/db/database.ts` and models in `src/db/schema.ts`.
- Feature modules expose data-access functions under `src/modules/<feature>/server/`.
- Keep validation and typed errors close to data functions.

Example (simplified create):

```ts
// src/modules/transactions/server/transactions.ts
export const createTransaction = async (data: TransactionInsert) => {
  // validate, then insert via drizzle
};
```

### Server functions vs. UI

- Treat `src/modules/**/server/*` as the single source of truth for data.
- UI never calls `db` directly; it imports server functions and wraps them with React Query hooks.

### React Query usage

- Provider is set up in `src/providers/QueryProvider.tsx`.
- Put hooks in `src/modules/<feature>/hooks/`.
- Use descriptive `queryKey`s per resource.

Query example:

```ts
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../server/transactions";

export function useTransactions(userId: number) {
  return useQuery({
    queryKey: ["transactions", { userId }],
    queryFn: () => getTransactions(userId),
  });
}
```

Mutation example:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../server/transactions";

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
```

### Auth flow

- Session token/key stored in `expo-secure-store` using `SESSION_KEY` from `src/db/database.ts`.
- Hooks in `src/modules/auth/hooks/useAuth.ts` handle login, signup, logout, and session retrieval.
- After login/signup, navigate using `router.push` and invalidate relevant queries.

### UI components and screens

- Reusable primitives in `src/components/ui/` (e.g., `Button`, `Input`, `BottomSheet`). Keep them stateless and styleable.
- Feature-specific components/screens live in `src/modules/<feature>/components/`.
- Export feature public API via `src/modules/<feature>/index.ts`.

Naming:
- Components: `PascalCase` file names; default export or named consistently.
- Hooks: `useThing.ts` returning a typed value or object.
- Server: verb-first functions (`createTransaction`, `getTransactions`).

### Styling (NativeWind + Tailwind)

- Tailwind config: `tailwind.config.js` with custom colors.
- Use className with NativeWind on React Native components.
- Prefer design tokens from `theme.extend.colors` (primary, secondary, background, foreground, muted, success, danger).

Example:

```tsx
import { View, Text } from "react-native";

export function Card({ title }: { title: string }) {
  return (
    <View className="bg-secondary border border-border rounded-xl p-4">
      <Text className="text-foreground text-base font-medium">{title}</Text>
    </View>
  );
}
```

Gradient and images (Expo):

```tsx
import { LinearGradient } from "expo-linear-gradient";

<LinearGradient colors={["#FFF8F3", "#E4D8CB"]} className="rounded-2xl p-6" />
```

### Calling API (server functions) from components

1. Add or reuse a server function in `src/modules/<feature>/server/*`.
2. Create a hook in `src/modules/<feature>/hooks/*` that wraps it with React Query.
3. Use the hook in a component under `src/modules/<feature>/components/*` or a screen under `app/`.

End-to-end usage:

```tsx
// 1) server
export async function updateTransaction(id: number, userId: number, data: Partial<TransactionInsert>) { /* ... */ }

// 2) hook
export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId, data }: { id: number; userId: number; data: Partial<TransactionInsert> }) =>
      updateTransaction(id, userId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// 3) component
function EditForm({ id, userId }: { id: number; userId: number }) {
  const { mutate, isPending } = useUpdateTransaction();
  return (
    <Button onPress={() => mutate({ id, userId, data: { title: "Coffee" } })} disabled={isPending}>
      Save
    </Button>
  );
}
```

### Error handling

- Throw typed errors in server functions (`ValidationError`, `NotFoundError`, `TransactionError`).
- In hooks, surface errors via React Query and show user feedback (e.g., `Alert.alert`).

### Testing locally

- Data persists in Expo SQLite. Migrations live in `src/db/migrations/`.
- If you need a clean slate, provide a reset path that clears the DB (if implemented), then rerun initialization.

### Adding a new feature module

- Create `src/modules/<feature>/` with `components/`, `hooks/`, `server/`, and `types.ts`.
- Define server functions first, then hooks, then UI components.
- Add routes in `app/` if the feature needs screens.

### Performance and cache

- Use stable `queryKey`s and `queryClient.invalidateQueries` after mutations.
- Default config: retries, stale time, and gc time are defined in `QueryProvider`.

### Code style

- Strong TypeScript types everywhere. Verb-led function names for actions.
- Keep components small and focused; extract UI primitives into `src/components/ui`.


