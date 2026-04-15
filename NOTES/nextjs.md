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

## ✅ Summary

* Global CSS for app-wide styling
* CSS Modules for scoped styling
* `clsx` for conditional classes
* Built-in font optimization
* Optimized images via `next/image`
* File-based routing
* Easy client/server component control

---
