# 📘 Next.js Notes (Quick Reference)

## 🎨 Styling in Next.js

### 1. Global CSS

* Used for applying styles across the entire app.
* Create a global CSS file (e.g., `globals.css`)
* Import it once in root layout or `_app.js`

```js
import './globals.css';
```

---

### 2. CSS Modules

* Scoped CSS (avoids class conflicts).
* File naming: `Component.module.css`

```js
import styles from './Component.module.css';

<div className={styles.container}>Hello</div>
```

---

### 3. Custom CSS

* You can create separate CSS files or inline styles based on project needs.

---

### 4. Conditional Styling (clsx)

* Helps apply classes dynamically based on conditions.

Install:

```bash
npm install clsx
```

Usage:

```js
import clsx from 'clsx';

<div className={clsx('base-class', condition && 'active-class')}>
  Content
</div>
```

---

## 🔤 Adding Fonts

Use Next.js built-in font optimization:

```js
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

<body className={inter.className}>
```

---

## 🖼️ Image Optimization

### Why Optimize Images?

* Better performance
* Automatic resizing
* Lazy loading
* Modern formats

### Static Assets

* Store images in `/public` folder
* Access directly using path

Example:

```js
import Image from 'next/image';

<Image
  src="/hero-desktop.png"
  width={1000}
  height={760}
  className="hidden md:block"
  alt="Screenshots of the dashboard project showing desktop version"
/>
```

---

## 🧩 Server vs Client Components

* App Router renders every component as a **Server Component by default** — no directive needed.
* **Server Components**: fetch data directly, access secrets/DB, send zero JS to the browser.
* **Client Components**: need `"use client"`, used for state, hooks, event handlers, browser APIs.
* You can pass a Server Component into a Client Component as `children`/props to mix both.

```js
// app/page.js — Server Component (default)
import LikeButton from './like-button'; // Client Component

export default async function Page() {
  const data = await fetch('https://api.example.com/posts');
  return <LikeButton />;
}
```

---

## ⚙️ Client-Side Rendering

### `use client`

* Enables client-side rendering
* Add only once in parent component
* No need to repeat in child components

```js
"use client";

export default function Component() {
  return <div>Client Component</div>;
}
```

---

## 📡 Data Fetching in Server Components

* Components can be `async` functions — `await fetch()` directly, no `useEffect` needed.
* Since Next.js 15, `fetch()` is **not cached by default** (opt-in, unlike older Next 13/14 behavior).
* Use `cache: 'force-cache'`, the `revalidate` option, or the `use cache` directive to enable caching.

```js
export default async function Page() {
  const res = await fetch('https://api.example.com/data', { cache: 'force-cache' });
  const data = await res.json();
  return <div>{data.title}</div>;
}
```

---

## 🧭 Routing (File-Based)

* Next.js uses file-system-based routing

Example structure:

```
app/
 ├── page.js        → /
 ├── about/
 │    └── page.js   → /about
```

---

## 🔀 Dynamic Routes

* `[id]/page.js` → matches `/blog/1`, `/blog/2`
* `[...slug]/page.js` → **catch-all**, matches `/a/b/c`
* `[[...slug]]/page.js` → **optional catch-all**, also matches `/`

```
app/blog/[id]/page.js   → /blog/123
```

---

## 🗂️ Route Groups & Parallel/Intercepting Routes

* `(groupName)/` — organizes routes/files without affecting the URL.
* Parallel routes (`@slot`) — render multiple independent pages in one layout at once.
* Intercepting routes (`(.)folder`) — show a route in a modal while keeping the current URL (e.g. Instagram-style photo modal).

---

## 🧱 Layouts & Templates

* `layout.js` — shared UI that persists across navigations; layouts nest automatically.
* Root layout (`app/layout.js`) is required and wraps `<html>`/`<body>`.
* `template.js` — same idea as layout, but **re-mounts** (resets state) on every navigation.

```js
export default function Layout({ children }) {
  return <section>{children}</section>;
}
```

---

## ⏳ Loading & Error UI

* `loading.js` — instant loading skeleton for a route segment (auto-wraps it in `<Suspense>`).
* `error.js` — catches errors in a segment; must be a Client Component.
* `not-found.js` — custom 404 UI, triggered via the `notFound()` function.

---

## 🌐 Route Handlers (API Routes)

* Define API endpoints inside `app/api/.../route.js`.
* Export functions named after HTTP methods.

```js
export async function GET(request) {
  return Response.json({ message: 'Hello' });
}
```

---

## 🔁 Server Actions

* Server-side functions callable directly from a form or component — no manual API route needed.
* Mark with `"use server"`; use in forms via `action={}`.

```js
async function createItem(formData) {
  "use server";
  // save to DB
}

<form action={createItem}>
  <button type="submit">Add</button>
</form>
```

---

## 🛡️ Middleware

* `middleware.js` at the project root — runs before a request completes.
* Common uses: auth redirects, logging, rewrites.
* Note: renamed to `proxy.js` in Next.js 16 (`middleware.js` still works but is deprecated).

```js
export function middleware(request) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

---

## 🔍 Metadata API (SEO)

* Static: export a `metadata` object from `layout.js`/`page.js`.
* Dynamic: export an async `generateMetadata()` function (e.g. per blog post).

```js
export const metadata = { title: 'My App', description: '...' };
```

---

## 🏗️ Rendering Strategies & Revalidation

* **Static Rendering** (default) — rendered at build time, cached, fastest.
* **Dynamic Rendering** — rendered per-request (using cookies, headers, or uncached fetch).
* ISR — revalidate a static page after N seconds:

```js
export const revalidate = 60; // seconds
```

* `generateStaticParams()` — pre-renders dynamic route params at build time (like old `getStaticPaths`).

---

## 🔐 Environment Variables

* `.env.local` — local secrets, never committed.
* Prefix with `NEXT_PUBLIC_` to expose a variable to the browser.

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## ⚙️ next.config.js

* Project-wide configuration — images, redirects, headers, env, etc.

```js
module.exports = {
  images: { domains: ['example.com'] },
};
```

---

## 🚀 Deployment

* Vercel = native, zero-config platform for Next.js.
* Also deployable anywhere via `next build` + `next start`, or Docker.

---

## ✅ Summary

* Global CSS for app-wide styling
* CSS Modules for scoped styling
* `clsx` for conditional classes
* Built-in font optimization
* Optimized images via `next/image`
* Server Components by default; `"use client"` for interactivity
* Data fetching directly in async Server Components (`fetch` not cached by default in Next 15+)
* File-based routing, dynamic routes (`[id]`, `[...slug]`, `[[...slug]]`)
* Route groups, parallel & intercepting routes for advanced layouts
* Layouts (`layout.js`) vs Templates (`template.js`)
* `loading.js`, `error.js`, `not-found.js` for UI states
* Route Handlers (`app/api/.../route.js`) for backend endpoints
* Server Actions (`"use server"`) for mutations without extra API routes
* Middleware (`middleware.js`, renamed `proxy.js` in Next 16) for auth/redirects
* Metadata API (`metadata`, `generateMetadata`) for SEO
* Static vs Dynamic rendering, ISR via `revalidate` and `generateStaticParams`
* Env vars via `.env.local`, `NEXT_PUBLIC_` for client exposure
* `next.config.js` for project-wide config
* Deploy on Vercel, or self-host via `next build`/`next start`/Docker

---
