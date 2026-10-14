# HTML & CSS Advanced Interview Notes (12–14 Years Frontend)

Oct 14, 2026 · @ashish yadav

All questions are numbered in one series. Each answer starts simple, then adds the senior-level point interviewers look for.

## Section 1: HTML document structure and fundamentals

### Q1. What changed from HTML to HTML5?

HTML5 is the current "living standard". It added semantic tags (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`), new input types (`email`, `date`, `range`), native `audio`/`video`, `canvas`/SVG inline, Web Storage, and the short `<!DOCTYPE html>`.

Senior point: HTML is now maintained by WHATWG as a Living Standard; there is no "HTML6".

### Q2. HTML vs XHTML?

XHTML follows strict XML rules: every tag closed, properly nested, lowercase, attributes quoted. HTML is forgiving and has a defined error-recovery algorithm, so broken markup still renders consistently across browsers.

### Q3. What does `<!DOCTYPE html>` do, and what is quirks mode?

It tells the browser to use **standards mode**. Without it, browsers fall back to **quirks mode**, which emulates old browser bugs (e.g. a different box model and table sizing). Always include it as the very first line.

### Q4. What goes in `<head>` vs `<body>`?

`<head>` holds metadata: `title`, `meta`, `link`, `style`, `script`, `base`. `<body>` holds visible content. Place scripts at the end of `body` or, better, in `head` with `defer`.

### Q5. What is a minimal production-ready HTML5 boilerplate?

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page title</title>
  <meta name="description" content="Short page summary">
  <link rel="stylesheet" href="/styles.css">
  <script src="/app.js" defer></script>
</head>
<body>
  <main>...</main>
</body>
</html>
```

`lang` helps screen readers and translation; `charset` must be in the first 1024 bytes.

### Q6. Which meta tags matter most?

`charset`, `viewport`, `description`, `robots`, Open Graph / Twitter tags for social sharing (`og:title`, `og:image`), `theme-color`, and `Content-Security-Policy` (better sent as an HTTP header). The `keywords` meta tag is ignored by major search engines.

### Q7. Tag vs element vs attribute?

A tag is the marker (`<p>`, `</p>`). An element is the whole thing: start tag + content + end tag. An attribute adds extra info on the start tag (`href`, `id`, `data-*`). In the DOM, attributes (HTML) and properties (JS object) are related but not always the same: `input.value` changes as the user types, while the `value` attribute keeps the initial value.

### Q8. What are void (empty) elements?

Elements with no content and no closing tag: `img`, `input`, `br`, `hr`, `meta`, `link`, `area`, `base`, `col`, `embed`, `source`, `track`, `wbr`. The self-closing slash (`<br />`) is optional in HTML.

### Q9. Block vs inline elements?

Block elements start on a new line and take full width (`div`, `p`, `h1`, `ul`, `section`). Inline elements flow inside text (`span`, `a`, `strong`, `em`). Senior point: "block" and "inline" are really CSS `display` values; the HTML spec now groups elements by content categories (flow, phrasing, interactive, etc.).

### Q10. `id` vs `class` vs `style`, and what about duplicate IDs?

`id` must be unique per page (anchor targets, label `for`, ARIA references). `class` is reusable for styling and JS hooks. `style` is inline CSS with very high priority. Duplicate IDs render but are invalid: `getElementById` returns only the first, and ARIA/label links break.

### Q11. What are `data-*` attributes and when should you use them?

Custom attributes that store extra information on an element, readable in JS via `dataset` and in CSS via attribute selectors.

```html
<div id="user" data-id="42" data-role="admin">Happy</div>
```

```js
const el = document.getElementById("user");
el.dataset.id;   // "42"
el.dataset.role; // "admin"
```

```css
[data-role="admin"] { color: red; }
```

Use them for small UI state or test hooks (`data-testid`), not as a database.

### Q12. What are HTML entities?

Codes for reserved or special characters: `&amp;` (&), `&lt;` (<), `&gt;` (>), `&quot;`, `&apos;`, `&nbsp;` (non-breaking space), `&copy;`. Escaping `<` and `&` in user content is part of preventing XSS.

### Q13. What are the types of links and important `<a>` attributes?

Page links (`href="/about"`), fragment links (`href="#pricing"` jumps to the element with that id), email (`mailto:`), phone (`tel:`), and download links (`download` attribute). `<link>` loads external resources like stylesheets.

`target="_blank"` opens a new tab. Modern browsers imply `rel="noopener"` for it, but adding `rel="noopener noreferrer"` is still good practice to stop the new page accessing `window.opener`.

### Q14. Absolute vs relative URL, and what does `<base>` do?

An absolute URL has the full address (`https://site.com/a`). A relative URL is resolved from the current page (`../img/a.png`). `<base href>` in the head changes the starting point for every relative URL on the page; it is easy to break things with it, so use carefully.

### Q15. What list and table elements should you know?

Lists: `ol` (numbered), `ul` (bulleted), `dl`/`dt`/`dd` (term + description). Tables: `table`, `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, with `colspan` / `rowspan` to merge cells and `scope="col"` on headers for accessibility. Tables are for tabular data, never for page layout.

## Section 2: Semantic HTML, forms and accessibility

### Q16. What is semantic HTML and why does it matter?

Using elements for their meaning: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`, `time`, `mark`, `details`/`summary`. `div` and `span` have no meaning. Semantic markup gives screen readers landmarks, helps SEO, and makes code easier to read.

### Q17. `section` vs `article` vs `div`?

`article` is self-contained content that makes sense on its own (blog post, product card, comment). `section` groups related content and should usually have a heading. `div` is a meaningless wrapper for styling or layout only.

### Q18. How should headings be structured?

One `h1` per page for the main topic, then `h2`–`h6` in order without skipping levels for structure. Never choose a heading level for its size; style it with CSS instead. Screen-reader users navigate by headings.

### Q19. What are landmarks?

Regions that assistive tech can jump to: `header` (banner), `nav` (navigation), `main` (main), `aside` (complementary), `footer` (contentinfo), `form` with a name, `search`. Use only one `main` per page.

### Q20. What is ARIA and what is the "first rule of ARIA"?

ARIA (Accessible Rich Internet Applications) adds roles, states and properties (`role="dialog"`, `aria-expanded`, `aria-label`) for custom widgets. First rule: **don't use ARIA if a native HTML element does the job**. A `<button>` gets focus, keyboard support and role for free; a `<div role="button">` needs all of that added manually.

### Q21. `aria-label` vs `aria-labelledby` vs `aria-describedby`?

- `aria-label`: a text name directly on the element (icon-only buttons).
- `aria-labelledby`: name taken from another element's text, by id.
- `aria-describedby`: extra description, like help or error text.

```html
<button aria-label="Close dialog">×</button>
<input id="email" aria-describedby="email-err">
<p id="email-err">Enter a valid email</p>
```

### Q22. How do you make a page keyboard accessible?

Use native interactive elements, keep a logical DOM order, never remove focus outlines without a replacement (use `:focus-visible`), add a "Skip to main content" link, trap focus inside modals and return it on close, and avoid positive `tabindex` values (use 0 or −1 only).

### Q23. What are WCAG levels and key rules to remember?

WCAG has levels A, AA and AAA; most companies and laws target **AA** (WCAG 2.1 / 2.2). Key rules: text contrast at least 4.5:1 (3:1 for large text), all functionality usable by keyboard, alt text on meaningful images (`alt=""` for decorative ones), visible focus, no content that flashes more than 3 times per second, and target size at least 24×24 px (2.2).

### Q24. How do you hide content visually but keep it for screen readers?

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

`display: none` and `visibility: hidden` hide content from everyone, including screen readers. `aria-hidden="true"` hides it only from assistive tech. The `hidden` attribute is like `display: none`.

### Q25. How do you build an accessible form?

Every input has a `<label for>`; group radio buttons with `fieldset` + `legend`; use the right `type` (`email`, `tel`, `number`) for mobile keyboards; set `autocomplete` (`email`, `current-password`); show errors as text linked with `aria-describedby`, plus `aria-invalid="true"`; never rely on placeholder as the label.

### Q26. What native form validation features exist?

Attributes: `required`, `min`, `max`, `minlength`, `maxlength`, `pattern`, `type="email"`. CSS hooks: `:valid`, `:invalid`, `:user-invalid` (only after user interaction). JS: the Constraint Validation API (`checkValidity()`, `setCustomValidity()`). Senior point: client validation is for UX only; always validate on the server too.

### Q27. Radio vs checkbox vs select?

Radio: choose exactly one; group by the same `name`. Checkbox: choose any number. `select`: one (or `multiple`) choice from a long list, saving space. `datalist` gives suggestions on a text input.

### Q28. What are `<dialog>`, `<details>` and the Popover API?

- `<dialog>` with `showModal()`: a native modal with focus trapping, Escape to close, a `::backdrop`, and rendering in the top layer.
- `<details>`/`<summary>`: native accordion with no JS.
- Popover API (`popover` attribute + `popovertarget`): native menus and tooltips in the top layer with light-dismiss.

Senior point: these replace a lot of custom JS and get accessibility mostly right by default.

### Q29. What are Web Components?

Browser-native reusable components built with three APIs: Custom Elements (`customElements.define`), Shadow DOM (encapsulated DOM and styles), and `<template>`/`<slot>`. They work in any framework. Trade-offs: styling from outside needs CSS custom properties or `::part()`, and server-side rendering needs Declarative Shadow DOM.

## Section 3: HTML loading, performance, images and SEO

### Q30. What is the Critical Rendering Path?

The steps a browser takes to show pixels: parse HTML → build the DOM; parse CSS → build the CSSOM; combine them into the render tree; **layout** (calculate sizes and positions); **paint** (draw pixels); **composite** (combine layers on the GPU). CSS is render-blocking and synchronous scripts are parser-blocking, so both delay first paint.

### Q31. `script` vs `async` vs `defer` vs `type="module"`?

| Type | Download | Runs | Order kept |
| --- | --- | --- | --- |
| `<script>` | Blocks HTML parsing | Immediately | Yes |
| `async` | In parallel | As soon as downloaded (may interrupt parsing) | No |
| `defer` | In parallel | After HTML is parsed, before `DOMContentLoaded` | Yes |
| `type="module"` | In parallel | Deferred by default | Yes |

Use `defer` for app code, `async` for independent scripts like analytics.

### Q32. What are resource hints?

- `preload`: fetch a critical resource for this page early (fonts, hero image). Needs the `as` attribute.
- `preconnect`: open the connection (DNS + TCP + TLS) to an important third-party origin early.
- `dns-prefetch`: only the DNS lookup; a lighter fallback.
- `prefetch`: low-priority fetch for a likely next page.
- `modulepreload`: preload an ES module and its dependencies.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
```

Senior point: preloading too much competes for bandwidth and slows the real critical resources.

### Q33. How do you serve responsive images?

`srcset` + `sizes` let the browser pick a resolution; `<picture>` lets you switch formats or crops (art direction).

```html
<picture>
  <source type="image/avif" srcset="hero.avif">
  <source type="image/webp" srcset="hero.webp">
  <img src="hero.jpg"
       srcset="hero-480.jpg 480w, hero-1200.jpg 1200w"
       sizes="(max-width: 600px) 100vw, 50vw"
       width="1200" height="600" alt="Team at work">
</picture>
```

### Q34. How do you optimise image loading?

Use modern formats (AVIF, WebP), always set `width` and `height` (or CSS `aspect-ratio`) to prevent layout shift, add `loading="lazy"` for below-the-fold images, `fetchpriority="high"` on the LCP (hero) image, and `decoding="async"`. Never lazy-load the hero image.

### Q35. JPEG vs PNG vs WebP vs AVIF vs SVG?

| Format | Compression | Best for |
| --- | --- | --- |
| JPEG | Lossy | Photos (legacy fallback) |
| PNG | Lossless, transparency | Screenshots, simple graphics |
| WebP | Lossy or lossless, transparency | General web images |
| AVIF | Better compression than WebP | Photos where support allows |
| SVG | Vector (code) | Icons, logos, illustrations |

### Q36. What are Core Web Vitals?

Google's user-experience metrics, also a ranking signal:

| Metric | Measures | Good |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | Loading speed of main content | ≤ 2.5 s |
| INP (Interaction to Next Paint) | Responsiveness to input (replaced FID in 2024) | ≤ 200 ms |
| CLS (Cumulative Layout Shift) | Visual stability | ≤ 0.1 |

Fixes: LCP → preload/prioritise the hero, faster server, critical CSS. INP → break up long JS tasks, less main-thread work. CLS → set image dimensions, reserve space for ads and embeds, use `font-display` carefully.

### Q37. How do you load web fonts efficiently?

Self-host WOFF2, subset to the characters you need, preload only the one or two critical fonts, and use `font-display: swap` (or `optional`). Use `size-adjust` / fallback metric overrides so the fallback font matches size and doesn't shift layout. Variable fonts can replace several files.

### Q38. What are the main HTML performance best practices?

Fewer and smaller requests (bundling, HTTP/2 or 3), minified and compressed files (Brotli/gzip), long cache headers with hashed file names, a CDN, critical CSS inlined and the rest loaded later, deferred JS, lazy-loaded images and iframes, and `content-visibility: auto` for long pages.

### Q39. What are the key on-page SEO practices?

A unique `<title>` and meta description per page, one `h1` and a logical heading order, semantic elements, descriptive `alt` text, clean URLs, a `canonical` link to avoid duplicate content, structured data (JSON-LD with schema.org), an XML sitemap and `robots.txt`, fast Core Web Vitals, and server-side rendering or static generation for content that must be indexed.

### Q40. What are the main HTML-level security practices?

Escape user content to prevent XSS, use a Content-Security-Policy header, add `rel="noopener noreferrer"` on external new-tab links, use `sandbox` on untrusted iframes, add Subresource Integrity (`integrity` attribute) on CDN scripts, and set `autocomplete` correctly on password fields.

## Section 4: CSS cascade, specificity, selectors and the box model

### Q41. What are the ways to add CSS, and which is best?

Inline (`style=""`), internal (`<style>` in the head), external (`<link>` to a `.css` file), `@import` inside CSS, and preprocessors/CSS-in-JS that compile to one of these. External files are best: cacheable, reusable, and they separate content from presentation. Avoid `@import` in production CSS because it loads files one after another.

### Q42. How does the cascade decide which rule wins?

In this order:

1. Origin and importance (user-agent → user → author; `!important` reverses the order).
2. Context (Shadow DOM encapsulation).
3. Inline `style` attribute.
4. Cascade layers (`@layer`).
5. Specificity.
6. Source order (later wins).

### Q43. How is specificity calculated?

As three numbers (A, B, C):

| Selector part | Adds to |
| --- | --- |
| ID (`#nav`) | A |
| Class, attribute, pseudo-class (`.btn`, `[type]`, `:hover`) | B |
| Element, pseudo-element (`div`, `::before`) | C |
| Universal `*`, combinators | Nothing |

Example: `#nav .item a:hover` = (1, 2, 1). Compare A first, then B, then C. Inline styles beat all selectors; `!important` beats inline.

### Q44. How do `:is()`, `:where()`, `:not()` and `:has()` affect specificity?

- `:is()` and `:not()` take the specificity of their most specific argument.
- `:where()` always has **zero** specificity, great for resettable defaults in libraries.
- `:has()` takes its most specific argument.

```css
:where(.card) h2 { margin: 0; }   /* easy to override */
li:not(.one) { font-style: italic; } /* every li except .one */
```

### Q45. What is `:has()` and why is it called the "parent selector"?

It selects an element based on what it contains or what follows it, which was impossible before.

```css
.card:has(img) { padding: 0; }               /* cards with an image */
form:has(input:invalid) button { opacity: .5; }
label:has(+ input:focus) { color: blue; }     /* previous sibling */
```

Senior point: it replaces many JS class toggles; avoid very broad usage like `body:has(...)` on huge DOMs for performance.

### Q46. What are cascade layers (`@layer`)?

A way to group CSS into ordered layers. A later layer always beats an earlier one, **regardless of specificity**. Unlayered styles beat all layers.

```css
@layer reset, base, components, utilities;

@layer components { .btn#primary { color: blue; } }
@layer utilities  { .text-red { color: red; } }  /* wins */
```

This solves specificity wars when combining resets, third-party libraries and your own code.

### Q47. What are the main selector types?

Element (`p`), class (`.btn`), ID (`#app`), universal (`*`), attribute (`[type="text"]`), descendant (`a b`, any depth), child (`a > b`, direct children only), adjacent sibling (`a + b`), general sibling (`a ~ b`), pseudo-classes and pseudo-elements.

### Q48. What attribute selector variations exist?

`[attr]` exists, `[attr="v"]` equals, `[attr*="v"]` contains, `[attr^="v"]` starts with, `[attr$="v"]` ends with, `[attr~="v"]` is one word in a space-separated list, `[attr|="v"]` equals or starts with `v-`. Add `  i ` before `]` for case-insensitive matching.

### Q49. Pseudo-class vs pseudo-element?

A pseudo-class (single colon) selects an element in a **state**: `:hover`, `:focus-visible`, `:nth-child(2n)`, `:checked`, `:empty`. A pseudo-element (double colon) styles a **part** of an element or adds generated content: `::before`, `::after`, `::first-line`, `::placeholder`, `::marker`, `::selection`, `::backdrop`.

### Q50. What are inheritance, `inherit`, `initial`, `unset` and `revert`?

Some properties inherit by default (`color`, `font`, `line-height`, `visibility`); most don't (`margin`, `border`, `background`).

- `inherit`: take the parent's value.
- `initial`: the property's spec default (e.g. `display: inline`).
- `unset`: `inherit` if the property inherits, otherwise `initial`.
- `revert`: go back to the browser's default style.
- `revert-layer`: go back to the previous cascade layer's value.

### Q51. What is the box model?

Every element is a box: content → padding → border → margin (inside to outside). Padding is space inside the border; margin is space outside, between elements.

### Q52. `box-sizing: content-box` vs `border-box`?

With `content-box` (default), `width` is only the content, so padding and border are added on top. With `border-box`, `width` includes padding and border, which is far easier to reason about.

```css
*, *::before, *::after { box-sizing: border-box; }
```

### Q53. What is margin collapsing?

Vertical margins of adjacent block elements combine into one margin equal to the larger value (20px + 30px → 30px). It also happens between a parent and its first or last child if nothing separates them. It does **not** happen in flex or grid containers, or with padding, borders, or a new block formatting context (`display: flow-root`).

### Q54. What is a Block Formatting Context (BFC)?

An isolated layout region where floats are contained and margins don't collapse with outside elements. Created by `display: flow-root`, `overflow` other than `visible`, floats, absolute positioning, `inline-block`, flex/grid items, and `contain: layout`. `display: flow-root` is the clean modern way to contain floats (replacing the old clearfix hack).

### Q55. Which CSS units should you use?

| Unit | Relative to | Use for |
| --- | --- | --- |
| `px` | Fixed (CSS pixel) | Borders, small details |
| `rem` | Root font size | Font sizes, spacing (respects user zoom settings) |
| `em` | Current element's font size | Padding that scales with text |
| `%` | Parent size | Fluid widths |
| `vw` / `vh` | Viewport | Full-screen sections |
| `dvh` / `svh` / `lvh` | Dynamic / small / large viewport | Mobile full-height (fixes the `100vh` address-bar bug) |
| `ch` | Width of "0" | Readable line length (`max-width: 65ch`) |
| `cqi` / `cqw` | Container size | Container-query-based sizing |
| `fr` | Free space in a grid | Grid tracks |

## Section 5: Layout: positioning, stacking context, flexbox and grid

### Q56. `display: block` vs `inline` vs `inline-block` vs `none`?

- `block`: new line, full width, accepts width/height and vertical margins.
- `inline`: flows with text, ignores width/height and vertical margins.
- `inline-block`: flows with text **and** accepts width/height.
- `none`: removed from layout and the accessibility tree (vs `visibility: hidden`, which keeps the space).

### Q57. What are the `position` values?

| Value | Positioned relative to | In normal flow? |
| --- | --- | --- |
| `static` (default) | Not positioned | Yes |
| `relative` | Its own normal position | Yes (space kept) |
| `absolute` | Nearest positioned ancestor (else the initial containing block) | No |
| `fixed` | Viewport (unless an ancestor has `transform`, `filter` or `contain`) | No |
| `sticky` | Acts relative until a scroll threshold, then sticks within its parent | Yes |

Common sticky-header pattern: `position: sticky; top: 0;`. Sticky fails if an ancestor has `overflow: hidden` or the parent is too short.

### Q58. How does `z-index` work, and what is a stacking context?

`z-index` only compares elements **within the same stacking context**. A stacking context is a group that is layered as one unit. It's created by: the root element, positioned elements with `z-index` other than `auto`, flex/grid children with `z-index`, `opacity` < 1, `transform`, `filter`, `will-change`, `isolation: isolate`, `position: fixed`/`sticky`, and `contain: paint`.

Classic bug: a modal with `z-index: 9999` still appears behind a header because its parent created a lower stacking context. Fix: render overlays at the top level (portal), use the top layer (`<dialog>`, popover), or use `isolation: isolate` to control contexts deliberately.

### Q59. What does `float` do, and how do you clear it?

It pushes an element left or right so text wraps around it (originally for images in text). Clear with `clear: both` on the next element, or contain floats in the parent with `display: flow-root`. Don't use floats for page layout anymore; use flexbox or grid.

### Q60. What is flexbox and its main properties?

A one-dimensional layout system (row **or** column).

Container: `display: flex`, `flex-direction`, `flex-wrap`, `justify-content` (main axis), `align-items` (cross axis), `align-content` (multiple lines), `gap`.

Item: `flex-grow`, `flex-shrink`, `flex-basis`, `flex` shorthand, `align-self`, `order`.

### Q61. What do `flex: 1`, `flex: auto` and `flex: none` mean?

| Shorthand | grow / shrink / basis | Behaviour |
| --- | --- | --- |
| `flex: 1` | 1 / 1 / 0% | Equal shares of space, ignoring content size |
| `flex: auto` | 1 / 1 / auto | Grows from its content size |
| `flex: none` | 0 / 0 / auto | Fixed at content size |
| `flex: 0 0 200px` | 0 / 0 / 200px | Exactly 200px |

### Q62. Why does a flex item overflow instead of shrinking?

Flex items have `min-width: auto` by default, so they won't shrink below their content size (long words, `pre`, tables). Fix with `min-width: 0` (or `overflow: hidden`) on the item. This is one of the most common real-world flexbox bugs.

### Q63. How do you center an element?

```css
/* Flexbox */
.parent { display: flex; justify-content: center; align-items: center; }

/* Grid (shortest) */
.parent { display: grid; place-items: center; }

/* Absolute */
.child { position: absolute; inset: 0; margin: auto; width: fit-content; height: fit-content; }

/* Horizontal only, block */
.child { margin-inline: auto; width: 600px; }
```

### Q64. What is CSS Grid and its main properties?

A two-dimensional layout system (rows **and** columns).

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 1rem;
  min-height: 100dvh;
}
.header { grid-area: header; }
```

Other key parts: `grid-column: 1 / -1` (span all), `span 2`, `minmax()`, `repeat()`, `grid-auto-flow: dense`, `justify-items` / `align-items`.

### Q65. `auto-fill` vs `auto-fit`?

Both create as many columns as fit, which gives responsive cards without media queries:

```css
.grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
```

`auto-fill` keeps empty column tracks when there are few items. `auto-fit` collapses empty tracks, so the existing items stretch to fill the row.

### Q66. What is subgrid?

`grid-template-columns: subgrid` (or rows) makes a nested grid use its parent's tracks. Example: cards in a grid where every card's title, body and button line up across cards even when content length differs.

### Q67. Flexbox vs Grid: when to use which?

Flexbox for one direction and content-driven sizing: navbars, button groups, centring, items that wrap. Grid for two-dimensional, layout-driven structures: page shells, dashboards, card galleries, anything needing alignment in both rows and columns. They are often combined: grid for the page, flex inside components.

### Q68. What are logical properties?

Direction-aware versions of physical properties, so layouts work for right-to-left (Arabic, Hebrew) and vertical writing modes automatically.

| Physical | Logical |
| --- | --- |
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-top` / `padding-bottom` | `padding-block` |
| `width` / `height` | `inline-size` / `block-size` |
| `top/right/bottom/left: 0` | `inset: 0` |
| `text-align: left` | `text-align: start` |

## Section 6: Responsive and modern CSS

### Q69. What does the viewport meta tag do?

`<meta name="viewport" content="width=device-width, initial-scale=1">` tells mobile browsers to use the device width instead of rendering a \~980px desktop page and zooming out. Never add `user-scalable=no` or `maximum-scale=1`: blocking zoom fails accessibility.

### Q70. Mobile-first vs desktop-first media queries?

Mobile-first writes base styles for small screens and adds `min-width` queries for larger ones. It usually means less CSS to override and faster mobile loading. Desktop-first uses `max-width` queries.

```css
.card { padding: 1rem; }
@media (min-width: 768px) { .card { padding: 2rem; } }
```

### Q71. What else can media queries check besides width?

`prefers-color-scheme` (dark mode), `prefers-reduced-motion`, `prefers-contrast`, `hover` / `pointer` (touch vs mouse), `orientation`, `resolution`, and `print`. The newer range syntax is easier to read: `@media (400px <= width <= 900px)`.

### Q72. What are container queries?

Styles that respond to the size of a **parent container**, not the viewport. A component can adapt wherever it's placed (sidebar vs main area).

```css
.card-wrap { container-type: inline-size; container-name: card; }

@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: 150px 1fr; }
}
```

Senior point: use media queries for page-level layout and container queries for reusable components. Style queries (`@container style(--theme: dark)`) also exist.

### Q73. What is fluid typography with `clamp()`?

`clamp(min, preferred, max)` gives a value that scales smoothly between limits, removing many breakpoints.

```css
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem); }
.container { width: min(100% - 2rem, 1200px); margin-inline: auto; }
```

Always mix a `rem` part into the preferred value so text still responds to user zoom.

### Q74. What is a responsive design checklist?

Viewport meta tag, relative units (`rem`, `%`, `fr`), fluid layouts with flexbox/grid, `img, video { max-width: 100%; height: auto; }`, responsive images (`srcset`), container queries for components, touch targets at least 44px, test on real devices, and respect user preferences (dark mode, reduced motion).

### Q75. What are CSS custom properties (variables)?

Values defined with `--name` and used with `var(--name, fallback)`. Unlike Sass variables, they are **live at runtime**: they inherit, cascade, can change in media queries, and can be updated by JS.

```css
:root { --brand: #0055ff; --space: 1rem; }
.btn { background: var(--brand); padding: var(--space); }
.dark { --brand: #66a3ff; }
```

```js
document.documentElement.style.setProperty("--brand", "red");
```

### Q76. What is `@property`?

It registers a custom property with a type, initial value and inheritance. Typed properties can be **animated** (e.g. animating a gradient angle), which plain custom properties can't.

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
```

### Q77. How do you implement dark mode?

Define colours as custom properties, switch them with `prefers-color-scheme` and/or a `data-theme` attribute for a user toggle, and set `color-scheme: light dark` so form controls and scrollbars adapt. The `light-dark()` function picks one of two colours based on the current scheme.

```css
:root { color-scheme: light dark; --bg: light-dark(#fff, #111); }
[data-theme="dark"] { color-scheme: dark; }
body { background: var(--bg); }
```

### Q78. What is native CSS nesting?

Browsers now support Sass-like nesting without a build step.

```css
.card {
  padding: 1rem;
  & h2 { margin: 0; }
  &:hover { box-shadow: 0 2px 8px #0002; }
  @media (min-width: 768px) { padding: 2rem; }
}
```

### Q79. Which other modern CSS features should a senior know?

- `aspect-ratio: 16 / 9` for media boxes.
- `gap` in flexbox.
- `color-mix()`, `oklch()` colours and relative colour syntax for design-system palettes.
- `@scope` to limit styles to part of the DOM.
- `text-wrap: balance` (headings) and `text-wrap: pretty` (paragraphs).
- `accent-color` to theme checkboxes and radios.
- `scroll-snap-type` for carousels without JS.
- `scrollbar-gutter: stable` to stop layout shift when scrollbars appear.
- Anchor positioning (`anchor-name`, `position-anchor`) for tooltips; check browser support first.

Senior point: check support on caniuse.com / Baseline and use `@supports` for progressive enhancement.

### Q80. What is `@supports`?

A feature query: apply CSS only if the browser supports a feature.

```css
@supports (container-type: inline-size) { /* modern layout */ }
@supports not selector(:has(a)) { /* fallback */ }
```

## Section 7: Rendering, animation and CSS performance

### Q81. Reflow vs repaint vs composite?

- **Reflow (layout)**: geometry changes (`width`, `height`, `top`, `margin`, font size, adding DOM nodes). Most expensive; can affect the whole page.
- **Repaint**: visual changes without geometry (`color`, `background`, `box-shadow`).
- **Composite only**: `transform` and `opacity` can be handled on the GPU without layout or paint. Cheapest.

### Q82. What is layout thrashing and how do you avoid it?

Forcing layout repeatedly by alternating DOM reads (`offsetHeight`, `getBoundingClientRect`) and writes in a loop. Fix: batch all reads first, then all writes, or schedule writes in `requestAnimationFrame`.

```js
// Bad: read/write interleaved → N reflows
items.forEach(el => { el.style.width = box.offsetWidth + "px"; });
// Good: read once, then write
const w = box.offsetWidth;
items.forEach(el => { el.style.width = w + "px"; });
```

### Q83. Transitions vs animations?

A `transition` animates between two states when a property changes (e.g. on hover). An `animation` with `@keyframes` can run multiple steps, loop, auto-start and be paused.

```css
.btn { transition: transform 200ms ease-out; }
.btn:hover { transform: scale(1.05); }

@keyframes spin { to { transform: rotate(360deg); } }
.loader { animation: spin 1s linear infinite; }
```

### Q84. How do you make animations smooth (60fps)?

Animate only `transform` and `opacity`, avoid animating `width`, `height`, `top` or `left`, use `will-change` sparingly and only just before an animation (it costs memory per layer), prefer CSS over JS animation for simple cases, and use the Web Animations API or `requestAnimationFrame` for JS-driven motion.

### Q85. How do you respect reduced motion?

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Some users get motion sickness from parallax and large animations; this is a WCAG requirement for non-essential motion.

### Q86. What are View Transitions and scroll-driven animations?

- View Transitions API: animated transitions between DOM states or pages (`document.startViewTransition()`, or `@view-transition { navigation: auto; }` for multi-page apps), styled with `::view-transition-*` pseudo-elements.
- Scroll-driven animations: link a CSS animation to scroll position with `animation-timeline: scroll()` or `view()`, e.g. a reading progress bar, with no JS.

### Q87. What do `contain` and `content-visibility` do?

`contain: layout paint` tells the browser that an element's insides don't affect the outside, so it can limit reflow and repaint work. `content-visibility: auto` skips rendering off-screen sections until they're near the viewport; pair it with `contain-intrinsic-size` to reserve space and avoid scrollbar jumps. Big wins on long pages.

### Q88. How do you optimise CSS delivery?

Inline critical above-the-fold CSS, load the rest without blocking, remove unused CSS (PurgeCSS, Tailwind's JIT, coverage tools), minify and compress, split CSS per route, avoid `@import` chains, and use long-term caching with hashed file names.

### Q89. Do selector types affect performance?

Browsers match selectors right to left, so the rightmost part (key selector) matters most: `.nav a` checks every `a`. In practice, selector cost is rarely the bottleneck today; large DOMs, frequent style recalculation and layout thrashing are. Measure with the DevTools Performance panel (Recalculate Style, Layout) before optimising.

### Q90. How do you debug CSS and rendering issues?

DevTools Elements panel (computed styles, box model, which rule wins), the flex/grid overlays, the Layers and Rendering panels (paint flashing, layout shift regions), the Performance panel for long tasks and layout, Lighthouse for Core Web Vitals, and `outline: 1px solid red` on `*` for quick layout debugging.

## Section 8: CSS architecture, tooling and Bootstrap

### Q91. What CSS methodologies do you know?

- **BEM** (Block\_\_Element--Modifier): `.card__title--large`. Flat, predictable specificity, clear naming.
- **OOCSS**: separate structure from skin, and container from content.
- **SMACSS**: categories: base, layout, module, state, theme.
- **ITCSS**: layers from generic to specific (settings → tools → generic → elements → objects → components → utilities). Maps well to `@layer`.
- **Utility-first** (Tailwind): small single-purpose classes in the markup.

### Q92. CSS Modules vs CSS-in-JS vs utility CSS?

| Approach | How | Pros | Cons |
| --- | --- | --- | --- |
| CSS Modules | Class names hashed per file at build time | Local scope, plain CSS, zero runtime | Theming via variables only |
| Runtime CSS-in-JS (styled-components, Emotion) | Styles generated in JS at runtime | Dynamic props, co-location | Runtime cost, SSR complexity, poor fit with React Server Components |
| Zero-runtime CSS-in-JS (vanilla-extract, Linaria, Panda) | Extracted to CSS at build | Type-safe, no runtime | Build tooling |
| Utility-first (Tailwind) | Classes in markup | Fast to build, tiny CSS output, consistent tokens | Long class lists, needs team discipline |

Senior point: the industry has moved away from runtime CSS-in-JS toward zero-runtime and utility approaches for performance and server rendering.

### Q93. What are CSS preprocessors, and are they still needed?

Sass/SCSS, Less and Stylus add variables, nesting, mixins, functions and loops, compiled to plain CSS. Native CSS now covers variables, nesting, `color-mix()` and layers, so many teams use less Sass. Sass is still useful for mixins, loops and large legacy codebases. PostCSS (with Autoprefixer) transforms modern CSS for older browsers.

### Q94. What are design tokens?

Named design decisions (colours, spacing, typography, radii, shadows) stored in a platform-neutral format (JSON) and turned into CSS variables, iOS and Android values with tools like Style Dictionary. They keep a design system consistent across platforms and themes.

### Q95. How do you design CSS for a large app or design system?

Tokens as CSS custom properties; components with scoped styles (Modules or BEM); `@layer` order for reset → base → components → utilities; low and flat specificity (no IDs, avoid `!important`); documentation in Storybook; visual regression tests (Chromatic, Percy, Playwright screenshots); Stylelint for rules; and dark-mode/theming designed from the start.

### Q96. What is Bootstrap and how is it used?

An open-source, mobile-first CSS framework with a responsive grid, ready-made components and utility classes. Include it via a CDN `<link>` or npm and customise it with Sass variables. Advantages: fast development, consistency, accessibility basics. Trade-offs: generic look, unused CSS unless trimmed.

### Q97. How does the Bootstrap grid work?

A 12-column flexbox grid: `.container` → `.row` → `.col-*`. Breakpoints: none (xs, <576px), `sm` (≥576px), `md` (≥768px), `lg` (≥992px), `xl` (≥1200px), `xxl` (≥1400px). In Bootstrap 5 the smallest class is just `.col-6` (the `-xs` suffix was removed in Bootstrap 4).

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">...</div>
  </div>
</div>
```

### Q98. `.container` vs `.container-fluid`, and the main components?

`.container` has a fixed max-width per breakpoint and is centred; `.container-fluid` is always 100% wide. Common components: navbar (with collapse toggler), modal, carousel, cards, buttons, forms, badges, alerts, pagination, spinners, progress bars, tooltips and popovers (need Popper).

### Q99. Bootstrap vs Tailwind?

Bootstrap gives ready-made components with a standard look; fast for admin tools and prototypes. Tailwind gives low-level utilities and no prebuilt look; better for custom designs and keeps CSS small by generating only used classes. Others: Foundation, Bulma, Materialize, and component libraries like MUI or shadcn/ui.

## Section 9: Tips, tricks and tricky interview questions

### Q100. What does `object-fit` do?

It controls how an image or video fills its box without distortion. `cover` fills and crops; `contain` fits fully with empty space; `object-position` picks the focus point.

```css
img { width: 100px; height: 100px; object-fit: cover; }
```

### Q101. How do you enable smooth scrolling, and what's the catch?

```css
html { scroll-behavior: smooth; }
:target { scroll-margin-top: 80px; } /* clear a sticky header */
```

Wrap it in `@media (prefers-reduced-motion: no-preference)` for accessibility.

### Q102. How do you hide empty elements?

```css
p:empty { display: none; }
```

`:empty` only matches elements with no children and no text; even a single space or newline counts as content (some browsers are changing this, but don't rely on it).

### Q103. How do you truncate text with an ellipsis?

```css
/* One line */
.one { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Multiple lines */
.multi { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
```

In a flex row, the text item also needs `min-width: 0` (see Q62).

### Q104. How do you make a sticky footer?

```css
body { min-height: 100dvh; display: grid; grid-template-rows: auto 1fr auto; }
```

Header, main and footer; `main` takes the remaining space so the footer stays at the bottom on short pages.

### Q105. How do you make a full-bleed section inside a centred container?

```css
.full-bleed { width: 100vw; margin-inline: calc(50% - 50vw); }
```

Or use a named-line grid layout so any child can span full width.

### Q106. `display: none` vs `visibility: hidden` vs `opacity: 0`?

|  | Takes space | Clickable | Screen readers | Animatable |
| --- | --- | --- | --- | --- |
| `display: none` | No | No | Hidden | No (except new `transition-behavior: allow-discrete`) |
| `visibility: hidden` | Yes | No | Hidden | Yes (discrete) |
| `opacity: 0` | Yes | Yes | Still read | Yes |

### Q107. Why is my `z-index: 9999` not working?

Either the element isn't positioned (and isn't a flex/grid item), or a parent creates a lower stacking context (`transform`, `opacity`, `filter`, etc.). The child can never escape its parent's context. See Q58.

### Q108. Why does `height: 100%` not work?

Percentage height needs a parent with an explicit height. The chain must go all the way up (`html`, `body`). Modern fixes: use `min-height: 100dvh`, or make the parent flex/grid and let the child stretch.

### Q109. Why is there a small gap under an image?

Images are inline by default and sit on the text baseline, leaving room for letter descenders. Fix: `img { display: block; }` or `vertical-align: middle`.

### Q110. Why is there a gap between `inline-block` elements?

The whitespace (newlines, spaces) between them in the HTML is rendered as a space character. Fix: use flexbox or grid with `gap` instead.

### Q111. Which wins: the class written first in HTML or last in CSS?

Order in the `class` attribute doesn't matter. With equal specificity, the rule that appears **later in the stylesheet** wins. `class="red blue"` and `class="blue red"` look identical.

### Q112. Can a child with `position: fixed` move with its parent?

Yes, if an ancestor has `transform`, `filter`, `perspective`, `contain: paint` or `will-change: transform`. That ancestor becomes the containing block, so the "fixed" element scrolls with it. Common bug inside animated containers.

### Q113. Why do percentage paddings use the width even for top/bottom?

In the spec, percentage padding and margin (top and bottom too) are calculated from the containing block's **width**. That's how the old "padding-top: 56.25%" 16:9 trick worked; use `aspect-ratio` now.

### Q114. How do you style a parent based on a checked checkbox, without JS?

```css
.option:has(input:checked) { border-color: var(--brand); }
```

Before `:has()`, you needed the sibling selector (`input:checked + label`) and a specific DOM order.

### Q115. What does `gap` do that margins don't?

`gap` adds space only **between** items in flex and grid, never on the outer edges, so you don't need `:last-child { margin: 0 }` hacks or negative margins on the container.

### Q116. What's your approach to reviewing frontend CSS in a large team?

Senior answer: check that tokens are used (no hard-coded colours or spacing), specificity stays flat, components don't leak styles, layouts work at all breakpoints and with long content or translations, focus states and contrast are intact, there are no layout shifts, and new code uses the agreed method (Modules, BEM or utilities) consistently. Automate what you can with Stylelint, visual regression and accessibility tests (axe).
