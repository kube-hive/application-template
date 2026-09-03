# Application Template

SvelteKit application template with [shadcn-svelte](https://www.shadcn-svelte.com/llms.txt) (Vega style), Tailwind CSS v4, and Zod v4.

## Critical Rules

### Svelte 5 Runes Mode (MANDATORY)

This project **enforces Svelte 5 runes mode**. Do NOT use legacy Svelte 4 syntax.

**Always use:**
- `$props()` for component props (never `export let`)
- `$state()` for reactive state (never top-level `let` for reactive values)
- `$derived()` for computed values (never `$:` reactive statements)
- `$effect()` for side effects (never `$:` blocks with side effects)
- `$bindable()` for two-way bindable props
- `{@render children()}` for slot content (never `<slot />`)

```svelte
<!-- CORRECT: Svelte 5 -->
<script lang="ts">
    let { name, count = $bindable(0) } = $props();
    let doubled = $derived(count * 2);
</script>

<!-- WRONG: Svelte 4 (DO NOT USE) -->
<script lang="ts">
    export let name: string;
    export let count = 0;
    $: doubled = count * 2;
</script>
```

### Component Snippets (Svelte 5)

Use `{#snippet}` and `{@render}` instead of slots:

```svelte
<!-- CORRECT -->
{#snippet header()}
    <h1>Title</h1>
{/snippet}
{@render header()}

<!-- WRONG (DO NOT USE) -->
<slot name="header" />
```

## Project Structure

```
src/
  routes/            # SvelteKit routes
    +layout.svelte   # Root layout
    +page.svelte     # Pages
    *.remote.ts      # Server-side remote functions
  lib/
    components/ui/   # shadcn-svelte components
    utils.ts         # cn() helper and utility types
    hooks/           # Svelte hooks (e.g., is-mobile.svelte.ts)
    assets/          # Static assets bundled by Vite (favicons live in static/)
tests/
  playwright/        # E2E tests
```

## Remote Functions (SvelteKit `$app/server`)

This project uses SvelteKit's **experimental [remote functions](https://svelte.dev/docs/kit/remote-functions)** instead of `+page.server.ts` actions or `+server.ts` API routes. Remote functions are defined in `*.remote.ts` files and execute on the server, but can be imported directly into Svelte components.

The feature is enabled in `vite.config.ts` via `experimental: { remoteFunctions: true }`.

### `form()` — Server-Side Form Handling

`form()` creates a server-side form handler with [Zod](https://www.npmjs.com/package/zod) v4 validation. It returns an object you spread onto a `<form>` element.

#### Basic example

```ts
// src/routes/compute.remote.ts
import * as z from 'zod';
import { form } from '$app/server';

export const computePost = form(
    z.object({
        a: z.number(),
        b: z.number()
    }),
    async ({ a, b }) => {
        return a + b;
    }
);
```

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { computePost } from "./compute.remote";
</script>

<form {...computePost}>
    <input {...computePost.fields.a.as('number')} />
    <input {...computePost.fields.b.as('number')} />
    <button type="submit">Compute</button>

    {#if computePost.result != null}
        <p>Result: {computePost.result}</p>
    {/if}
</form>
```

#### Key APIs on the form object

| API | Description |
|-----|-------------|
| `{...formObj}` | Spread onto `<form>` to set `method` and `action` |
| `formObj.fields.<name>.as(type)` | Returns input attributes (`name`, `value`, `aria-invalid`, etc.). Types: `'text'`, `'number'`, `'hidden'`, `'checkbox'`, `'radio'`, `'submit'` |
| `formObj.fields.<name>.issues()` | Returns `{ message: string }[]` or `undefined` for validation errors |
| `formObj.fields.<name>.value()` | Returns the current field value |
| `formObj.fields.<name>.set(val)` | Programmatically set a field value |
| `formObj.fields.set({...})` | Set multiple field values at once |
| `formObj.fields.value()` | Returns all field values as an object |
| `formObj.pending` | Boolean, `true` while submitting |
| `formObj.result` | The return value from the server handler (ephemeral — clears on resubmit/navigation) |
| `formObj.validate()` | Trigger validation programmatically |
| `formObj.validate({ includeUntouched: true })` | Validate all fields including untouched ones |
| `formObj.for(id)` | Create an isolated form instance (for lists of forms) |

#### Validation errors

Display per-field validation errors from the Zod schema:

```svelte
<input {...formObj.fields.email.as('text')} />
{#each formObj.fields.email.issues() ?? [] as issue}
    <p class="text-destructive text-sm">{issue.message}</p>
{/each}
```

#### Server-side validation with `invalid()`

Use `invalid()` from `@sveltejs/kit` to return custom validation errors from the handler:

```ts
import * as z from 'zod';
import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';

export const loginForm = form(
    z.object({
        email: z.string().email(),
        password: z.string().min(8)
    }),
    async (data, issue) => {
        const user = await db.findUser(data.email);
        if (!user) {
            invalid(issue.email('No account found with this email'));
        }
    }
);
```

#### Enhanced submission

Customize submission behavior (e.g., show a toast, reset the form):

```svelte
<form {...loginForm.enhance(async (form) => {
    try {
        if (await form.submit()) {
            form.element.reset();
        }
    } catch (error) {
        // handle network errors
    }
})}>
```

#### Multiple submit buttons

Use a field with `.as('submit', value)`:

```svelte
<button {...formObj.fields.action.as('submit', 'save')}>Save</button>
<button {...formObj.fields.action.as('submit', 'delete')}>Delete</button>
```

### `query()` — Server-Side Data Fetching

For read-only data loading (replaces `+page.server.ts` `load`):

```ts
// src/routes/todos.remote.ts
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getTodos = query(async () => {
    return await db.getTodos();
});
```

```svelte
<script lang="ts">
    import { getTodos } from "./todos.remote";
</script>

{#each await getTodos() as todo}
    <p>{todo.title}</p>
{/each}
```

## shadcn-svelte Components

Components are located in `src/lib/components/ui/`. Use `npx shadcn-svelte@latest add <component>` to add new ones.

### Import Patterns

**Single-export components** — use named import:

```ts
import { Button } from "$lib/components/ui/button/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { Label } from "$lib/components/ui/label/index.js";
```

**Multi-part components** — use namespace import:

```ts
import * as Card from "$lib/components/ui/card/index.js";
import * as Field from "$lib/components/ui/field/index.js";
import * as Dialog from "$lib/components/ui/dialog/index.js";
```

Then use as `<Card.Root>`, `<Card.Header>`, `<Card.Title>`, `<Card.Content>`, etc.

### Utility function

Use `cn()` from `$lib/utils.js` for merging Tailwind classes:

```ts
import { cn } from "$lib/utils.js";
```

```svelte
<div class={cn("flex items-center", someCondition && "bg-muted", className)}>
```

### Icons

Icons use `@lucide/svelte`:

```ts
import { Plus, Trash2 } from "@lucide/svelte";
```

## Validation & Testing

**All testing must be done through Playwright using `npm run test:e2e`.** Do not use other test runners or frameworks. Write and run E2E tests to verify changes. Do not start a dev server manually (`npm run dev`, `npm run preview`, etc.) — the Playwright test command handles the web server automatically.

### Type checking

```bash
npm run check
```

Runs `svelte-kit sync` and `svelte-check` against the TypeScript config.

### E2E tests (Playwright)

```bash
npm run test:e2e
```

Tests are in `tests/playwright/`. The web server builds and previews the app on port 4173 before running tests.

#### Writing Playwright tests

```ts
import { expect, test } from '@playwright/test';

test('computes sum of two numbers', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Number A').fill('3');
    await page.getByLabel('Number B').fill('5');
    await page.getByRole('button', { name: 'Compute' }).click();

    await expect(page.getByText('Result:')).toBeVisible();
    await expect(page.getByText('8')).toBeVisible();
});
```

Prefer accessible selectors: `getByRole`, `getByLabel`, `getByText` over CSS selectors.

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```
