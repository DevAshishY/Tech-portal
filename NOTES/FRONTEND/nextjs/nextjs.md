## Part A — Basics

### NX-1. 🆕 What is Next.js and why use it?

A **React framework** for full-stack web apps: file-based routing, server rendering, data fetching, caching, API endpoints, image/font optimisation and bundling built in.

**Real-life:** React = a car engine. Next.js = the whole car with steering, brakes and GPS.

| Benefit | How |
|---|---|
| SEO + fast first load | server rendering, static generation, streaming |
| less client JS | Server Components |
| full stack | Route Handlers, Server Actions |
| fast builds | Turbopack (default bundler) |

### NX-2. 🆕 Next.js vs plain React (Vite SPA)?

| React + Vite | Next.js |
|---|---|
| client-side rendering only | server + static + client rendering |
| pick your own router | file-based routing |
| SEO harder | SEO-friendly HTML |
| no backend | Route Handlers, Server Actions |
| simple static hosting | Node / serverless / edge hosting (or static export) |

🎯 SPA behind a login (dashboard) → Vite is fine. Public, SEO, content-heavy → Next.js.

### NX-3. 🆕 App Router vs Pages Router?

| Pages Router (`pages/`) | App Router (`app/`) ✅ |
|---|---|
| older, still supported | recommended for new apps |
| `getServerSideProps`, `getStaticProps`, `getStaticPaths` | `async` Server Components, `use cache`, `generateStaticParams` |
| `_app.js`, `_document.js` | `layout.js` (root layout) |
| `pages/api/*` | `app/**/route.js` |
| client components only | Server Components by default |

**Real-life:** Pages Router = an older building that still works; App Router = the new building with modern wiring.

⚠️ Both can live in one app during migration (NX-57).

### NX-4. 🆕 What's the current version and what changed recently?

**Next.js 16.4** (Oct 2026), React **19.3**, Node.js **20.9+**.

| Version | Key change |
|---|---|
| 13 | App Router, Server Components |
| 15 | `fetch` **not cached by default**, async `params` / `cookies()` |
| 16 (Oct 2025) | **Turbopack default**, `proxy.ts` replaces `middleware.ts`, Cache Components (`use cache`), `updateTag` / `refresh`, React Compiler support, `next lint` removed |
| 16.3 | Instant Navigations, Partial Prefetching |
| 16.4 | Cache Components **recommended for all apps** (on by default in `create-next-app`); default in Next 17 |

🎯 Showing you know the caching model changed (implicit → opt-in) impresses interviewers.

### NX-5. 🆕 How do you create a project, and what are the special files?

```bash
npx create-next-app@latest my-app   # TypeScript, Tailwind, ESLint, App Router
npm run dev
```

| File | Purpose |
|---|---|
| `layout.js` | shared UI (persists) |
| `page.js` | the route's UI (makes it public) |
| `loading.js` | loading UI (Suspense) |
| `error.js` | error UI (Client Component) |
| `not-found.js` | 404 UI |
| `template.js` | like layout, but remounts |
| `route.js` | API endpoint |
| `default.js` | fallback for parallel route slots |
| `proxy.js` | request interception (root) |

**Real-life:** special file names are like labelled rooms: Next.js knows what each one is for.

⚠️ A folder without `page.js` is **not** a route (useful for colocating components).

---

## Part B — Routing

### NX-6. How does file-based routing work?

The **folder structure is the URL**.

```text
app/
├── page.js            → /
├── about/
│   └── page.js        → /about
└── blog/
    └── page.js        → /blog
```

**Real-life:** a building directory: floor → room = URL path.

### NX-7. What are dynamic routes?

| Folder | Matches |
|---|---|
| `[id]` | `/blog/1`, `/blog/2` |
| `[...slug]` | catch-all: `/docs/a/b/c` |
| `[[...slug]]` | optional catch-all: also `/docs` |

```text
app/blog/[id]/page.js   → /blog/123
```

**Real-life:** a hotel with numbered rooms: one template, any room number.

### NX-8. 🆕 How do you read `params` and `searchParams`?

Since Next.js 15 they're **Promises**; in 16 sync access is removed.

```tsx
// app/blog/[id]/page.tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { id } = await params;
  const { sort } = await searchParams;
  return <h1>Post {id}, sorted by {sort}</h1>;
}
```

In Client Components: `useParams()`, `useSearchParams()`, `usePathname()`.

⚠️ Forgetting `await` gives errors in Next 16. `cookies()`, `headers()`, `draftMode()` are async too.

### NX-9. Route groups?

`(groupName)/` organises files **without affecting the URL**.

```text
app/
├── (marketing)/about/page.js   → /about
├── (shop)/cart/page.js         → /cart
└── (auth)/layout.js            → layout only for auth pages
```

**Real-life:** coloured folders in a filing cabinet; the colour doesn't appear on the document.

🎯 Use for different layouts per section (marketing vs app).

### NX-10. Parallel routes?

`@slot` folders render **several pages at once** in one layout.

```text
app/dashboard/
├── layout.js
├── @analytics/page.js
├── @team/page.js
└── default.js
```

```tsx
export default function Layout({ children, analytics, team }) {
  return <>{children}{analytics}{team}</>;
}
```

**Real-life:** a TV with picture-in-picture: two channels at once.

⚠️ Next 16: every slot needs a **`default.js`** or the build fails.

### NX-11. Intercepting routes?

Show a route **in a modal** while keeping the current page, using `(.)`, `(..)`, `(...)`.

```text
app/feed/page.js
app/feed/(..)photo/[id]/page.js   → opens /photo/1 as a modal over the feed
app/photo/[id]/page.js            → full page on refresh / direct link
```

**Real-life:** Instagram: tap a photo → modal; share the link → full photo page.

🎯 Usually combined with parallel routes (`@modal`).

### NX-12. Layouts vs templates?

| `layout.js` | `template.js` |
|---|---|
| **persists** across navigations (state kept) | **remounts** on every navigation (state reset) |
| nested automatically | use for enter animations, per-page effects |

```tsx
export default function Layout({ children }) {
  return <section><Sidebar />{children}</section>;
}
```

**Real-life:** layout = the building's corridor (stays); template = a new welcome mat laid each time you enter.

⚠️ The **root layout** (`app/layout.js`) is required and must render `<html>` and `<body>`.

### NX-13. Loading, error and not-found UI?

| File | Does |
|---|---|
| `loading.js` | instant skeleton; auto-wraps the segment in `<Suspense>` |
| `error.js` | catches errors in the segment; **must be `"use client"`** |
| `not-found.js` | 404 UI, triggered by `notFound()` |
| `global-error.js` | catches errors in the root layout |

```tsx
// app/blog/[id]/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Try again</button>;
}
```

```tsx
import { notFound } from "next/navigation";
if (!post) notFound();
```

**Real-life:** a "please wait" sign, a "sorry, out of order" sign, and a "room doesn't exist" sign.

### NX-14. 🆕 How do you navigate?

```tsx
import Link from "next/link";
<Link href="/about">About</Link>              // client navigation + prefetch

"use client";
const router = useRouter();                   // from "next/navigation"
router.push("/dashboard");
router.refresh();                              // re-fetch server data

import { redirect } from "next/navigation";
redirect("/login");                            // server-side (components, actions)
```

**Real-life:** `<Link>` = a door that's already unlocked because Next.js peeked inside (prefetch).

⚠️ Use `next/navigation` (App Router), not `next/router` (Pages Router).

### NX-15. 🆕 What's the difference between `redirect`, `permanentRedirect` and `next.config` redirects?

| Way | Where | Status |
|---|---|---|
| `redirect()` | Server Components, Actions, Route Handlers | 307 (303 in actions) |
| `permanentRedirect()` | same | 308 |
| `redirects()` in `next.config` | before routing, static rules | 307/308 |
| `proxy.ts` | per request, logic (auth) | any |

---

## Part C — Server & Client Components

### NX-16. Server vs Client Components? ⭐

App Router components are **Server Components by default**.

| Server Component | Client Component (`"use client"`) |
|---|---|
| fetch data, use DB/secrets directly | state, effects, event handlers |
| `async/await` in the component | browser APIs (`window`, `localStorage`) |
| **zero JS** sent to browser | JS shipped and hydrated |
| no hooks, no `onClick` | hooks allowed |

```tsx
// app/page.tsx (Server Component)
import LikeButton from "./like-button"; // Client Component

export default async function Page() {
  const posts = await getPosts();
  return posts.map((p) => <article key={p.id}>{p.title}<LikeButton id={p.id} /></article>);
}
```

**Real-life:** server = the kitchen (cooks, has the secret recipes). Client = your table (where you interact).

🎯 Default to Server; add `"use client"` only for interactivity, as low (leaf) as possible.

### NX-17. How does `"use client"` work?

It marks a **boundary**: that file **and everything it imports** becomes client code. No need to repeat it in children it imports.

```tsx
"use client";
import { useState } from "react";

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

**Real-life:** a door marked "staff area": everything behind it follows staff rules.

⚠️ Putting `"use client"` on a top-level layout makes the **whole tree** client-side → more JS.

### NX-18. 🆕 How do you mix Server and Client Components?

```tsx
// ✅ Server Component passed as children to a Client Component
<ClientTabs>
  <ServerReport />
</ClientTabs>

// ❌ A Client Component can't import a Server Component directly
```

Props from server → client must be **serialisable** (plain objects, arrays, strings, Dates, Promises), not functions or class instances.

**Real-life:** the kitchen can put a finished dish on the tray (children), but the waiter can't cook.

### NX-19. 🆕 How do you keep server code out of the browser?

```ts
import "server-only"; // build error if a client component imports this file

export async function getSecretData() {
  return db.query(process.env.DB_URL);
}
```

- Secrets only in server files (no `NEXT_PUBLIC_`).
- Map DB rows to safe DTOs before passing to Client Components.

**Real-life:** a "staff only" safe that triggers an alarm if moved to the shop floor.

---

## Part D — Data Fetching, Caching & Rendering

### NX-20. How do you fetch data in Server Components?

Make the component `async` and `await` directly: no `useEffect`.

```tsx
export default async function Page() {
  const res = await fetch("https://api.example.com/data");
  if (!res.ok) throw new Error("Failed"); // caught by error.js
  const data = await res.json();
  return <div>{data.title}</div>;
}
```

Or query the DB / ORM directly (Prisma, Drizzle).

**Real-life:** the chef fetches ingredients from the store room directly, no waiter needed.

### NX-21. 🆕 How did caching change across versions? ⭐

| Version | Default |
|---|---|
| 13 / 14 | `fetch` **cached** by default (often surprising) |
| 15 | `fetch` **not cached** by default; opt in with `cache: 'force-cache'` / `revalidate` |
| 16+ | **Cache Components**: everything dynamic by default; cache explicitly with **`"use cache"`** |
| 16.4 | Cache Components on by default in new apps; default for all in Next 17 |

```js
// next.config.ts
const nextConfig = { cacheComponents: true };
```

**Real-life:** old way = the shop kept everything in storage "just in case". New way = you label exactly what to store and for how long.

### NX-22. 🆕 What is `"use cache"`?

A directive to cache a **page, component or function**. Next.js creates the cache key automatically from inputs.

```tsx
import { cacheLife, cacheTag } from "next/cache";

async function getProducts(category: string) {
  "use cache";
  cacheLife("hours");        // how long
  cacheTag("products");      // label for invalidation
  return db.products.findMany({ where: { category } });
}
```

Built-in `cacheLife` profiles: `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`.

**Real-life:** a component-level "Cache-Control" header.

⚠️ Don't read request data (`cookies()`, `headers()`) inside a `"use cache"` scope; pass needed values in as arguments.

### NX-23. How do you revalidate (refresh) cached data?

| API | Use |
|---|---|
| `cacheLife("hours")` / `fetch(..., { next: { revalidate: 60 } })` | time-based |
| `revalidatePath("/blog")` | refresh a route |
| `revalidateTag("posts", "max")` | refresh tagged data, **stale-while-revalidate** |
| `updateTag("posts")` | Server Actions only, **read-your-writes** (user sees change immediately) |
| `refresh()` | Server Actions only, refresh **uncached** data |

```ts
"use server";
import { updateTag } from "next/cache";

export async function updateProfile(id: string, data: Profile) {
  await db.users.update(id, data);
  updateTag(`user-${id}`); // user sees new data right away
}
```

⚠️ Next 16: `revalidateTag(tag)` with one argument is **deprecated**; pass a profile (`"max"`).

**Real-life:** `revalidateTag` = "restock in the background, serve the old stock meanwhile". `updateTag` = "restock now, the customer is waiting".

### NX-24. Static vs dynamic rendering?

| Static | Dynamic |
|---|---|
| rendered at **build** (or cached), served from CDN | rendered **per request** |
| fastest, cheapest | needed for personal data |
| blog, docs, marketing | dashboards, carts |

Becomes dynamic when you use `cookies()`, `headers()`, `searchParams`, or uncached data.

**Real-life:** static = printed newspaper; dynamic = a personalised letter.

🎯 With Cache Components, one page can be **both**: a static shell plus dynamic parts streamed in (NX-26).

### NX-25. ISR and `generateStaticParams`?

**ISR (Incremental Static Regeneration):** static pages that **refresh** after N seconds.

```tsx
export const revalidate = 60; // classic model (without Cache Components)
```

**`generateStaticParams`:** pre-render dynamic routes at build time (replaces `getStaticPaths`).

```tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ id: String(p.id) }));
}
```

**Real-life:** a printed menu that's reprinted every hour with today's specials.

🎯 In the Cache Components model, use `"use cache"` + `cacheLife()` instead of `export const revalidate`.

### NX-26. 🆕 What is Partial Prerendering (PPR) / streaming?

A page is served as a **static shell** instantly, and dynamic parts **stream in** through `<Suspense>`.

```tsx
export default function Page() {
  return (
    <>
      <ProductInfo />                       {/* cached, in the shell */}
      <Suspense fallback={<CartSkeleton />}>
        <Cart />                            {/* dynamic, streamed */}
      </Suspense>
    </>
  );
}
```

**Real-life:** a restaurant serves bread immediately and brings the main course when it's ready.

🎯 PPR is now part of **Cache Components** (the old `experimental.ppr` flag was removed in 16).

### NX-27. 🆕 Sequential vs parallel data fetching?

```tsx
// ❌ waterfall: 2s + 2s
const user = await getUser();
const posts = await getPosts();

// ✅ parallel: ~2s
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

Or split into separate components inside their own `<Suspense>` so each streams independently.

**Real-life:** boiling eggs and making toast at the same time.

### NX-28. 🆕 When do you fetch on the client?

User-specific, frequently changing or interaction-driven data (live search, infinite scroll, polling).

```tsx
"use client";
const { data, isLoading } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });
```

Tools: **TanStack Query**, **SWR**.

🎯 Default to server fetching; client fetching for highly interactive parts.

---

## Part E — Mutations: Route Handlers & Server Actions

### NX-29. What are Route Handlers (API routes)?

API endpoints in `app/**/route.js`, exporting functions named after HTTP methods.

```ts
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await db.users.findMany();
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.users.create({ data: body });
  return Response.json(user, { status: 201 });
}
```

```ts
// app/api/users/[id]/route.ts
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return Response.json(await db.users.findUnique({ where: { id } }));
}
```

**Real-life:** a takeaway counter: outside apps (mobile, webhooks) can order from your kitchen.

⚠️ A folder can't have both `page.js` and `route.js` at the same level.

### NX-30. What are Server Actions? ⭐

Async functions marked **`"use server"`** that run on the server but are called from forms or client code, **with no manual API route**.

```tsx
// app/actions.ts
"use server";
import { revalidatePath } from "next/cache";

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  await db.todo.create({ data: { title } });
  revalidatePath("/todos");
}
```

```tsx
// app/todos/page.tsx
import { createTodo } from "../actions";

export default function Page() {
  return (
    <form action={createTodo}>
      <input name="title" />
      <button type="submit">Add</button>
    </form>
  );
}
```

**Real-life:** pressing a call button for room service; you don't need to know the kitchen's phone number (API URL).

✅ Works without JS (progressive enhancement) when used in `<form action>`.

### NX-31. 🆕 Are Server Actions secure by default?

**No.** Every Server Action is a **public POST endpoint** anyone can call with any data.

```ts
"use server";
export async function deletePost(id: string) {
  const session = await auth();                         // 1. authenticate
  if (!session) throw new Error("Unauthorized");
  const postId = z.string().uuid().parse(id);           // 2. validate
  const post = await db.post.findUnique({ where: { id: postId } });
  if (post?.authorId !== session.userId) throw new Error("Forbidden"); // 3. authorise
  await db.post.delete({ where: { id: postId } });
}
```

**Real-life:** a back door anyone can knock on; always check who's there.

⚠️ Keep Next.js **patched**: critical RSC vulnerabilities (e.g. **CVE-2025-66478**, Dec 2025) and regular monthly security releases in 2026.

### NX-32. 🆕 How do you show pending state and errors for forms?

```tsx
"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signup } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Saving…" : "Sign up"}</button>;
}

export function SignupForm() {
  const [state, formAction] = useActionState(signup, { error: null });
  return (
    <form action={formAction}>
      <input name="email" />
      <SubmitButton />
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

```ts
"use server";
export async function signup(prev: { error: string | null }, formData: FormData) {
  const email = formData.get("email") as string;
  if (!email.includes("@")) return { error: "Invalid email" };
  await db.user.create({ data: { email } });
  return { error: null };
}
```

🎯 Add `useOptimistic` for instant UI (likes, todos).

### NX-33. 🆕 Route Handler vs Server Action?

| Server Action | Route Handler |
|---|---|
| mutations from **your own** UI (forms, buttons) | public API for **other** clients (mobile, webhooks, third parties) |
| POST only, no URL to manage | any method, your URL |
| integrates with revalidation, forms, `useActionState` | full control of request/response |

**Real-life:** Server Action = an internal staff button. Route Handler = the public phone line.

---

## Part F — Proxy (Middleware) & Auth

### NX-34. What is `proxy.ts` (formerly middleware)?

Runs **before** a request reaches a route: auth redirects, rewrites, headers, A/B tests, geo routing.

```ts
// proxy.ts (project root, or src/)
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
```

**Real-life:** a security guard at the building entrance who checks badges before you reach any office.

⚠️ Next.js 16 renamed `middleware.ts` → **`proxy.ts`** (function `proxy`), running on **Node.js**. `middleware.ts` still works for Edge but is **deprecated**.
⚠️ Keep it light (runs on every matched request). Do **real** authorisation checks in pages/actions too, not only in the proxy.

### NX-35. 🆕 How do you implement authentication?

- Library: **Auth.js (NextAuth)**, Clerk, Better Auth, or your own.
- Session in an **HttpOnly cookie**.
- `proxy.ts` for quick redirects; **verify session again** in Server Components, Actions and Route Handlers (data access layer).

```tsx
// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession((await cookies()).get("session")?.value);
  if (!session) redirect("/login");
  return <h1>Hi {session.user.name}</h1>;
}
```

**Real-life:** the guard at the gate (proxy) plus a lock on each office door (page checks).

---

## Part G — Styling, Fonts, Images & Scripts

### NX-36. Global CSS?

App-wide styles; import **once** in the root layout.

```tsx
// app/layout.tsx
import "./globals.css";
```

⚠️ In the App Router you can import global CSS anywhere, but keep it in the root layout to avoid ordering issues.

### NX-37. CSS Modules?

Scoped class names per file: `Component.module.css`.

```tsx
import styles from "./Card.module.css";
<div className={styles.container}>Hello</div>
```

**Real-life:** labelled lunch boxes, so nobody eats someone else's food (no class clashes).

### NX-38. 🆕 Tailwind CSS?

The default in `create-next-app`: utility classes in markup, only used classes are generated.

```tsx
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
```

🎯 Works perfectly with Server Components (no runtime CSS-in-JS).

⚠️ Runtime CSS-in-JS (styled-components, Emotion) needs extra setup and only works in Client Components.

### NX-39. Conditional classes with `clsx`?

```bash
npm install clsx
```

```tsx
import clsx from "clsx";
<div className={clsx("base", isActive && "active", { disabled: !enabled })}>Content</div>
```

🎯 With Tailwind, `tailwind-merge` (often as `cn()` = `clsx` + `twMerge`) resolves conflicting classes.

### NX-40. How do you add fonts?

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }) {
  return <html lang="en" className={inter.className}><body>{children}</body></html>;
}
```

```tsx
import localFont from "next/font/local";
const brand = localFont({ src: "./Brand.woff2" });
```

**Why:** fonts are **self-hosted** at build (no request to Google at runtime), preloaded, and use size-adjusted fallbacks → **no layout shift**.

### NX-41. How does `next/image` optimise images?

Automatic resizing, modern formats (WebP/AVIF), lazy loading, and reserved space (no CLS).

```tsx
import Image from "next/image";

<Image src="/hero-desktop.png" width={1000} height={760} alt="Dashboard preview" preload />
<Image src="/avatar.png" width={48} height={48} alt="User" />   // lazy by default
```

Remote images must be allowed:

```ts
// next.config.ts
images: {
  remotePatterns: [new URL("https://cdn.example.com/**")],
}
```

**Real-life:** a tailor who resizes every outfit to fit each customer (device).

⚠️ **Next 16 changes:** `images.domains` deprecated → use **`remotePatterns`**; the `priority` prop is deprecated → use **`preload`** (or `loading="eager"`) for the LCP/hero image; default `qualities` is `[75]`.
⚠️ Always give `width`/`height` (or `fill` + `sizes`).

### NX-42. Static assets (`/public`)?

Files in `/public` are served from the site root.

```text
public/hero.png  →  /hero.png
public/robots.txt → /robots.txt
```

⚠️ Don't put secrets in `public/`; everything there is downloadable.

### NX-43. 🆕 How do you load third-party scripts?

```tsx
import Script from "next/script";

<Script src="https://analytics.example.com/a.js" strategy="afterInteractive" />
<Script src="https://chat.example.com/widget.js" strategy="lazyOnload" />
```

| Strategy | Loads |
|---|---|
| `beforeInteractive` | before hydration (rare, critical) |
| `afterInteractive` (default) | after hydration |
| `lazyOnload` | when the browser is idle |

**Real-life:** letting guests in first, then the photographer, then the cleaners.

---

## Part H — SEO & Metadata

### NX-44. How do you set metadata?

```tsx
// app/layout.tsx or page.tsx
export const metadata = {
  title: { default: "My App", template: "%s | My App" },
  description: "Best app ever",
  openGraph: { images: ["/og.png"] },
};
```

**Real-life:** the label and cover of a book; search engines and social sites read it.

### NX-45. Dynamic metadata with `generateMetadata`?

```tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id); // same request is deduped with the page's fetch
  return { title: post.title, description: post.summary };
}
```

⚠️ `metadata` and `generateMetadata` work only in **Server Components**.

### NX-46. 🆕 Sitemap, robots and OG images?

```ts
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getPosts();
  return posts.map((p) => ({ url: `https://site.com/blog/${p.id}`, lastModified: p.updatedAt }));
}
```

```ts
// app/robots.ts
export default function robots() {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://site.com/sitemap.xml" };
}
```

`app/opengraph-image.tsx` with `ImageResponse` generates social preview images.

**Real-life:** a map for search engines (sitemap) and a "please don't enter" sign (robots).

---

## Part I — Config, Env & Tooling

### NX-47. Environment variables?

| File | Use |
|---|---|
| `.env` | defaults |
| `.env.local` | local secrets (**never commit**) |
| `.env.development` / `.env.production` | per environment |

```env
DATABASE_URL=postgres://...            # server only
NEXT_PUBLIC_API_URL=https://api.example.com   # exposed to browser
```

**Real-life:** `NEXT_PUBLIC_` = writing on a postcard; anyone handling it can read it.

⚠️ `NEXT_PUBLIC_*` values are **inlined at build time** into the JS bundle; never put secrets there.
⚠️ `serverRuntimeConfig` / `publicRuntimeConfig` were **removed** in Next 16.

### NX-48. `next.config.ts`?

Project-wide config.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  images: { remotePatterns: [new URL("https://cdn.example.com/**")] },
  async redirects() {
    return [{ source: "/old", destination: "/new", permanent: true }];
  },
  async headers() {
    return [{ source: "/(.*)", headers: [{ key: "X-Frame-Options", value: "DENY" }] }];
  },
  output: "standalone", // for Docker
};

export default nextConfig;
```

⚠️ Next 16: `turbopack` config moved to the top level (not `experimental`).

### NX-49. 🆕 What is Turbopack?

The Rust-based bundler, **default in Next.js 16** for dev and build (2–5× faster builds, up to 10× faster Fast Refresh).

```bash
next dev            # Turbopack
next build --webpack # opt back into webpack (custom webpack config)
```

**Real-life:** swapping a bicycle courier for a motorbike.

🎯 Also know: `next lint` was **removed** in 16; run ESLint or Biome directly.

---

## Part J — Performance & Debugging

### NX-50. 🆕 How do you optimise a Next.js app?

- **Server Components** by default; `"use client"` only at the leaves.
- Cache with `"use cache"`; stream slow parts with `<Suspense>`.
- `next/image`, `next/font`, `next/script`.
- Code-split heavy client components:

```tsx
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("./Chart"), { loading: () => <p>Loading…</p> });
```

- Parallel data fetching (`Promise.all`).
- Analyse bundles: the built-in **Turbopack Bundle Analyzer** (added in 16.1, improved in 16.4) or `@next/bundle-analyzer` for webpack builds.
- Enable the **React Compiler** (`reactCompiler: true`).

**Real-life:** pack only what each room needs, and deliver the heavy furniture later.

### NX-51. 🆕 What causes hydration errors in Next.js?

Server HTML ≠ first client render.

| Cause | Fix |
|---|---|
| `Date.now()`, `Math.random()`, locale formats | compute on server and pass down, or in `useEffect` |
| `typeof window` checks in render | `useEffect` or `dynamic(..., { ssr: false })` in a Client Component |
| invalid HTML (`<div>` inside `<p>`) | fix markup |
| browser extensions | usually harmless |

```tsx
const Map = dynamic(() => import("./Map"), { ssr: false }); // client-only component
```

**Real-life:** the printed programme (server) doesn't match what's on stage (client).

### NX-52. 🆕 How do you debug Next.js?

- Error overlay in dev (with actionable fixes and copyable prompts).
- `next dev --inspect` → Chrome DevTools / VS Code for server code.
- React DevTools for components.
- Request logs show compile vs render time (Next 16).
- **Next.js DevTools MCP** to let AI agents read logs and errors.

---

## Part K — Deployment & Security

### NX-53. How do you deploy?

| Option | How |
|---|---|
| **Vercel** | zero-config, native platform |
| Self-host (Node) | `next build` + `next start` |
| Docker | `output: "standalone"` → small image |
| Other platforms | **Adapters API** (stable in 16.2), OpenNext (AWS, Cloudflare, Netlify) |
| Static export | `output: "export"` (no server features) |

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
CMD ["node", "server.js"]
```

**Real-life:** Vercel = a fully managed restaurant chain; self-hosting = running your own kitchen.

### NX-54. 🆕 What is static export?

```ts
const nextConfig = { output: "export" };
```

Generates plain HTML/CSS/JS in `out/` for any static host (S3, GitHub Pages).

⚠️ No Server Actions, Route Handlers with dynamic data, `proxy`, ISR, or default image optimisation.

### NX-55. 🆕 Security checklist?

- Validate + authorise in **every** Server Action and Route Handler.
- Secrets only server-side; `server-only` imports.
- Don't leak sensitive fields to Client Components (DTOs).
- Security headers / CSP via `headers()` or `proxy.ts`.
- Use `images.remotePatterns`, not open domains.
- **Patch quickly**: follow the Next.js monthly security releases and advisories.

**Real-life:** locks on every door, not just the front gate.

---

## Part L — Scenario & Senior Questions

### NX-56. 🆕 "My page shows old data after I update it." What's wrong?

Likely cached and **not invalidated**.

1. Check what's cached: `"use cache"`, `fetch` `cache` option, `revalidate`.
2. After the mutation, call `updateTag()` (read-your-writes) / `revalidateTag(tag, "max")` / `revalidatePath()`.
3. For client router cache: `router.refresh()`.

🎯 Explain the difference between **server cache** (data/pages) and the **client router cache** (prefetched segments).

### NX-57. 🆕 How do you migrate from Pages Router to App Router?

1. Keep `pages/` and add `app/` side by side.
2. Create the root `app/layout.tsx` (replaces `_app` / `_document`).
3. Move routes one at a time; `getServerSideProps` → `async` Server Component; `getStaticProps` → `"use cache"`; `getStaticPaths` → `generateStaticParams`.
4. `next/router` → `next/navigation`.
5. `pages/api` → `route.ts` or Server Actions.

**Real-life:** moving house room by room while still living there.

🎯 Use the codemods: `npx @next/codemod@latest upgrade latest`.

### NX-58. 🆕 When would you NOT choose Next.js?

- Internal SPA behind login with no SEO needs → **Vite + React** (simpler hosting).
- Mostly static content site → **Astro** may ship less JS.
- Team prefers loaders/actions with less framework magic → **React Router v7 (framework mode)**.

🎯 Senior answers weigh hosting, team skills, caching complexity and vendor neutrality.

### NX-59. 🆕 How do you test a Next.js app?

| Layer | Tool |
|---|---|
| Unit / component | **Vitest** or **Jest** + React Testing Library |
| Async Server Components | E2E (unit tools support is limited) |
| E2E | **Playwright** / Cypress |
| API / actions | call functions directly or test via E2E |

---

## Part M — Cheat Sheet

### NX-60. One-line answers

| Topic | One line |
|---|---|
| Version | 16.4 (Oct 2026), React 19.3, Node 20.9+ |
| Router | App Router (`app/`); Pages Router legacy |
| Components | Server by default; `"use client"` for interactivity |
| `"use client"` | boundary: file + its imports become client |
| Data fetching | `async` Server Components, `await` directly |
| `params` | Promise → `await params` |
| Caching | opt-in; `"use cache"` + `cacheLife` + `cacheTag` |
| Revalidate | `revalidatePath`, `revalidateTag(tag, "max")`, `updateTag` (actions), `refresh` |
| Rendering | static, dynamic, or both (PPR shell + Suspense) |
| Pre-render params | `generateStaticParams` |
| Layout vs template | persists vs remounts |
| UI states | `loading.js`, `error.js` (client), `not-found.js` |
| API | `route.ts` with `GET`/`POST` exports |
| Mutations | Server Actions (`"use server"`); always auth + validate |
| Middleware | `proxy.ts` (Next 16); `middleware.ts` deprecated |
| Images | `next/image`, `remotePatterns`, `preload` (not `priority`) |
| Fonts | `next/font`, self-hosted, no CLS |
| SEO | `metadata`, `generateMetadata`, `sitemap.ts`, `robots.ts` |
| Env | `.env.local`; `NEXT_PUBLIC_` = public, build-time |
| Bundler | Turbopack default; `--webpack` to opt out |
| Lint | `next lint` removed; use ESLint/Biome |
| Deploy | Vercel, `next start`, Docker `standalone`, adapters, static export |
