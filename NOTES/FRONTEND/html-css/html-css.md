### HC-1. What changed from HTML to HTML5?

HTML5 added **semantic tags** (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`), new input types (`email`, `date`, `range`), native `audio`/`video`, `canvas` and inline SVG, Web Storage, and the short `<!DOCTYPE html>`.

**Real-life:** moving from a plain notebook to one with labelled sections and built-in tools.

🎯 HTML is now a **WHATWG Living Standard**; there's no "HTML6", it just keeps evolving.

### HC-2. HTML vs XHTML?

| HTML | XHTML |
|---|---|
| forgiving, defined error recovery | strict XML rules |
| `<br>` fine | `<br />`, every tag closed, lowercase, quoted attributes |

**Real-life:** HTML = a friendly teacher who understands messy handwriting. XHTML = an exam that fails you for one missing full stop.

### HC-3. What does `<!DOCTYPE html>` do? What is quirks mode?

Tells the browser to use **standards mode**. Without it → **quirks mode**, which copies old browser bugs (different box model, table sizing).

**Real-life:** telling a translator "use modern English", not "Shakespeare".

⚠️ It must be the **first line** of the file.

### HC-4. `<head>` vs `<body>`?

- `<head>`: **metadata**: `title`, `meta`, `link`, `style`, `script`, `base`.
- `<body>`: **visible** content.

**Real-life:** head = the label and instructions on a box; body = what's inside.

🎯 Put scripts in `head` with `defer` (or at the end of `body`).

### HC-5. Minimal production-ready boilerplate?

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

- `lang` → screen-reader pronunciation and translation.
- `charset` must be in the **first 1024 bytes**.

### HC-6. Which meta tags matter most?

| Meta | Why |
|---|---|
| `charset` | correct characters |
| `viewport` | mobile layout |
| `description` | search snippet |
| `robots` | indexing rules |
| Open Graph / Twitter (`og:title`, `og:image`) | social share previews |
| `theme-color` | browser UI colour |
| `Content-Security-Policy` | security (better as an HTTP header) |

⚠️ `keywords` meta is **ignored** by major search engines.

**Real-life:** the information on a book's back cover and spine.

### HC-7. Tag vs element vs attribute? Attribute vs property?

- **Tag:** the marker `<p>`, `</p>`.
- **Element:** start tag + content + end tag.
- **Attribute:** extra info on the start tag (`href`, `id`, `data-*`).

**Real-life:** tag = bread slices, element = the whole sandwich, attribute = the label "veg".

🎯 **Attribute vs property:** `input.value` (property) changes as the user types; the `value` **attribute** keeps the initial value.

```js
input.getAttribute("value"); // initial value
input.value;                 // current value
```

### HC-8. What are void elements?

No content, no closing tag: `img`, `input`, `br`, `hr`, `meta`, `link`, `area`, `base`, `col`, `embed`, `source`, `track`, `wbr`.

**Real-life:** a stamp: one action, nothing goes inside.

⚠️ The slash in `<br />` is **optional** in HTML.

### HC-9. Block vs inline elements?

- **Block:** new line, full width (`div`, `p`, `h1`, `ul`, `section`).
- **Inline:** flows inside text (`span`, `a`, `strong`, `em`).

**Real-life:** block = paragraphs in a book. Inline = highlighted words inside a sentence.

🎯 "Block" and "inline" are really CSS `display` values; the spec now groups HTML by **content categories** (flow, phrasing, interactive).

### HC-10. `id` vs `class` vs `style`? Duplicate IDs?

| | Use |
|---|---|
| `id` | **unique**: anchors, `label for`, ARIA references |
| `class` | reusable: styling, JS hooks |
| `style` | inline CSS, very high priority |

**Real-life:** `id` = your passport number. `class` = "student", shared by many.

⚠️ Duplicate IDs render but are **invalid**: `getElementById` returns only the first; labels and ARIA links break.

### HC-11. What are `data-*` attributes?

Custom attributes storing small extra info, readable via `dataset` and CSS.

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

**Real-life:** a sticky note on a box.

⚠️ For small UI state or test hooks (`data-testid`), not as a database. Values are always **strings**.

### HC-12. What are HTML entities?

Codes for reserved characters: `&amp;` (&), `&lt;` (<), `&gt;` (>), `&quot;`, `&apos;`, `&nbsp;`, `&copy;`.

**Real-life:** writing "quote" instead of an actual quote mark so the message isn't misunderstood.

🎯 Escaping `<` and `&` in user content is part of preventing **XSS**.

### HC-13. Types of links and key `<a>` attributes?

| Link | Example |
|---|---|
| page | `href="/about"` |
| fragment | `href="#pricing"` (jumps to `id="pricing"`) |
| email / phone | `mailto:`, `tel:` |
| download | `download` attribute |

```html
<a href="https://other.com" target="_blank" rel="noopener noreferrer">Docs</a>
```

**Real-life:** signposts: to another town, another street, or a phone number.

🎯 Browsers now imply `noopener` for `_blank`, but `rel="noopener noreferrer"` is still good practice (blocks `window.opener`, hides referrer).

### HC-14. Absolute vs relative URL? `<base>`?

- **Absolute:** full address `https://site.com/a`.
- **Relative:** from the current page `../img/a.png`.
- `<base href>` changes the starting point for **every** relative URL.

**Real-life:** absolute = full postal address. Relative = "two doors down".

⚠️ `<base>` easily breaks links, anchors and assets; use carefully.

### HC-15. Lists and tables to know?

- **Lists:** `ol` (numbered), `ul` (bullets), `dl`/`dt`/`dd` (term + description).
- **Tables:** `table`, `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `colspan`/`rowspan`, `scope="col"`.

```html
<table>
  <caption>Monthly sales</caption>
  <thead><tr><th scope="col">Month</th><th scope="col">Sales</th></tr></thead>
  <tbody><tr><td>Jan</td><td>120</td></tr></tbody>
</table>
```

⚠️ Tables are for **tabular data**, never page layout.

---

## Part B — Semantic HTML, Forms & Accessibility

### HC-16. What is semantic HTML and why does it matter?

Using elements for their **meaning**: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`, `time`, `mark`, `details`/`summary`. `div`/`span` mean nothing.

**Real-life:** labelled rooms in a building (Kitchen, Bedroom) vs every door saying "Room".

**Why:** screen-reader landmarks, better SEO, readable code.

### HC-17. `section` vs `article` vs `div`?

| | Use |
|---|---|
| `article` | self-contained, makes sense alone (blog post, product card, comment) |
| `section` | groups related content, usually with a heading |
| `div` | no meaning, styling/layout only |

**Real-life:** article = a newspaper story you could cut out. Section = the "Sports" page. Div = a plain box.

### HC-18. How should headings be structured?

One `h1` per page, then `h2`–`h6` **in order**, no skipped levels.

**Real-life:** a book's table of contents: chapter → section → subsection.

⚠️ Never pick a heading for its **size**; style with CSS. Screen-reader users navigate by headings.

### HC-19. What are landmarks?

Regions assistive tech can jump to:

| Element | Landmark |
|---|---|
| `header` | banner |
| `nav` | navigation |
| `main` | main (only one) |
| `aside` | complementary |
| `footer` | contentinfo |
| `form` (named), `search` | form, search |

**Real-life:** a shopping-mall map: "You are here", food court, exits.

### HC-20. What is ARIA? What's the first rule of ARIA?

ARIA adds roles, states and properties (`role="dialog"`, `aria-expanded`, `aria-label`) for custom widgets.

**First rule:** **don't use ARIA if a native element does the job.**

```html
<button>Save</button>                 <!-- focus, keyboard, role: free -->
<div role="button" tabindex="0">Save</div>  <!-- must add Enter/Space handling yourself -->
```

**Real-life:** using a real door instead of painting a door on the wall and adding a doorbell.

🎯 "No ARIA is better than bad ARIA."

### HC-21. `aria-label` vs `aria-labelledby` vs `aria-describedby`?

| Attribute | Gives |
|---|---|
| `aria-label` | name as text, on the element (icon buttons) |
| `aria-labelledby` | name from another element (by id) |
| `aria-describedby` | extra description (help or error text) |

```html
<button aria-label="Close dialog">×</button>
<input id="email" aria-describedby="email-err">
<p id="email-err">Enter a valid email</p>
```

**Real-life:** label = a name badge. Describedby = a note underneath with extra details.

### HC-22. How do you make a page keyboard accessible?

- Native interactive elements.
- Logical DOM order.
- Never remove focus outlines without a replacement (`:focus-visible`).
- "Skip to main content" link.
- Trap focus in modals, return it on close.
- Only `tabindex="0"` or `-1`; never positive values.

**Real-life:** a building usable without a lift button panel: every room reachable by stairs (Tab).

### HC-23. WCAG levels and key rules?

Levels **A, AA, AAA**; most companies and laws target **AA** (WCAG 2.1 / 2.2).

| Rule | Value |
|---|---|
| Text contrast | ≥ **4.5:1** (3:1 for large text) |
| Keyboard | everything usable |
| Images | meaningful `alt`; `alt=""` for decorative |
| Focus | visible |
| Flashing | ≤ 3 times per second |
| Target size (2.2) | ≥ **24×24 px** |

**Real-life:** building codes for ramps, handrails and signage.

### HC-24. Hide visually but keep for screen readers?

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

| Method | Visible | Screen reader |
|---|---|---|
| `.sr-only` | ❌ | ✅ |
| `display: none` / `hidden` attr | ❌ | ❌ |
| `visibility: hidden` | ❌ | ❌ |
| `aria-hidden="true"` | ✅ | ❌ |

**Real-life:** a whisper only the person with a hearing aid can hear.

### HC-25. How do you build an accessible form?

- Every input has `<label for>`.
- Radio groups in `fieldset` + `legend`.
- Correct `type` (`email`, `tel`) for mobile keyboards.
- `autocomplete` (`email`, `current-password`).
- Errors as text, linked with `aria-describedby`, plus `aria-invalid="true"`.
- Never use `placeholder` as the label.

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" aria-invalid="true" aria-describedby="email-err">
<p id="email-err">Enter a valid email</p>
```

**Real-life:** a paper form with printed labels next to every box, and clear notes where you went wrong.

### HC-26. Native form validation features?

- **Attributes:** `required`, `min`, `max`, `minlength`, `maxlength`, `pattern`, `type="email"`.
- **CSS:** `:valid`, `:invalid`, `:user-invalid` (only after interaction).
- **JS:** `checkValidity()`, `setCustomValidity()`.

```css
input:user-invalid { border-color: red; }
```

⚠️ Client validation is **UX only**; always validate on the server.

**Real-life:** a receptionist checks your form, but the office still verifies it.

### HC-27. Radio vs checkbox vs select?

| Control | Choice |
|---|---|
| radio | exactly **one** (same `name`) |
| checkbox | **any** number |
| `select` | one (or `multiple`) from a long list, saves space |
| `datalist` | suggestions on a text input |

**Real-life:** radio = choosing one meal; checkbox = choosing toppings.

### HC-28. `<dialog>`, `<details>` and the Popover API?

- `<dialog>` + `showModal()` → native modal: focus trapping, Esc to close, `::backdrop`, **top layer**.
- `<details>`/`<summary>` → accordion with no JS.
- `popover` + `popovertarget` → menus/tooltips in the top layer with light-dismiss.

```html
<button popovertarget="menu">Menu</button>
<div id="menu" popover>Profile · Logout</div>

<details><summary>Shipping info</summary>Delivered in 3 days.</details>
```

**Real-life:** built-in kitchen appliances vs building your own oven.

🎯 They replace lots of custom JS and get accessibility mostly right by default.

### HC-29. What are Web Components?

Browser-native reusable components:

1. **Custom Elements** (`customElements.define`)
2. **Shadow DOM** (encapsulated DOM + styles)
3. **`<template>` / `<slot>`**

```js
class HelloCard extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" }).innerHTML = `<p>Hello <slot></slot></p>`;
  }
}
customElements.define("hello-card", HelloCard);
```

**Real-life:** LEGO bricks that fit any set (React, Vue, Angular or none).

⚠️ Styling from outside needs CSS custom properties or `::part()`; SSR needs **Declarative Shadow DOM**.

---

## Part C — Loading, Performance, Images & SEO

### HC-30. What is the Critical Rendering Path?

```text
HTML → DOM
CSS  → CSSOM
DOM + CSSOM → Render tree → Layout → Paint → Composite
```

**Real-life:** building a house: plan (DOM) + paint scheme (CSSOM) → measure rooms (layout) → paint (paint) → assemble floors (composite).

⚠️ CSS is **render-blocking**; synchronous scripts are **parser-blocking**. Both delay first paint.

### HC-31. `script` vs `async` vs `defer` vs `type="module"`?

| Type | Download | Runs | Order kept |
|---|---|---|---|
| `<script>` | blocks parsing | immediately | ✅ |
| `async` | parallel | as soon as downloaded | ❌ |
| `defer` | parallel | after parsing, before `DOMContentLoaded` | ✅ |
| `type="module"` | parallel | deferred by default | ✅ |

**Real-life:** `defer` = guests arrive while you cook and sit down in order once dinner's ready. `async` = guests eat whenever they arrive.

🎯 `defer` for app code; `async` for independent scripts like analytics.

### HC-32. What are resource hints?

| Hint | Does |
|---|---|
| `preload` | fetch a **critical** resource early (needs `as`) |
| `preconnect` | open DNS + TCP + TLS early |
| `dns-prefetch` | DNS only (lighter) |
| `prefetch` | low-priority fetch for a likely **next** page |
| `modulepreload` | preload an ES module + deps |

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
```

**Real-life:** calling a restaurant ahead so the table is ready when you arrive.

⚠️ Preloading too much competes for bandwidth and **slows** the real critical resources.

### HC-33. How do you serve responsive images?

- `srcset` + `sizes` → browser picks the **resolution**.
- `<picture>` → switch **format** or **crop** (art direction).

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

**Real-life:** a clothes shop offering S/M/L sizes; the browser picks the one that fits.

### HC-34. How do you optimise image loading?

- Modern formats (AVIF, WebP).
- Always `width` + `height` (or `aspect-ratio`) → no layout shift.
- `loading="lazy"` below the fold.
- `fetchpriority="high"` on the LCP/hero image.
- `decoding="async"`.

⚠️ **Never lazy-load the hero image**; it delays LCP.

### HC-35. JPEG vs PNG vs WebP vs AVIF vs SVG?

| Format | Compression | Best for |
|---|---|---|
| JPEG | lossy | photos (legacy fallback) |
| PNG | lossless, transparency | screenshots, simple graphics |
| WebP | lossy/lossless, transparency | general web images |
| AVIF | better than WebP | photos where supported |
| SVG | vector (code) | icons, logos, illustrations |

**Real-life:** SVG = a recipe (redraw at any size); JPEG = a photo of the dish.

### HC-36. What are Core Web Vitals?

| Metric | Measures | Good |
|---|---|---|
| **LCP** | loading of main content | ≤ 2.5 s |
| **INP** | responsiveness (replaced FID in 2024) | ≤ 200 ms |
| **CLS** | visual stability | ≤ 0.1 |

**Fixes:**

- **LCP:** preload/prioritise hero, faster server, critical CSS.
- **INP:** break up long JS tasks, less main-thread work.
- **CLS:** image dimensions, reserve space for ads/embeds, careful `font-display`.

**Real-life:** LCP = how fast the food arrives, INP = how fast the waiter responds, CLS = whether the table wobbles.

### HC-37. How do you load web fonts efficiently?

- Self-host **WOFF2**, subset to needed characters.
- Preload only 1–2 critical fonts.
- `font-display: swap` (or `optional`).
- `size-adjust` / metric overrides so the fallback matches → no shift.
- Variable fonts can replace several files.

```css
@font-face {
  font-family: "Inter";
  src: url("/inter.woff2") format("woff2");
  font-display: swap;
}
```

**Real-life:** wearing your own clothes until the tailored suit arrives, cut to the same size so nobody notices the swap.

### HC-38. Main HTML performance best practices?

- Fewer, smaller requests; HTTP/2 or HTTP/3.
- Minify + compress (Brotli/gzip).
- Long cache headers + hashed file names; CDN.
- Inline critical CSS, load the rest later.
- `defer` JS; lazy-load images and iframes.
- `content-visibility: auto` for long pages.

### HC-39. Key on-page SEO practices?

- Unique `<title>` + meta description per page.
- One `h1`, logical headings, semantic elements.
- Descriptive `alt` text, clean URLs.
- `canonical` link to avoid duplicates.
- Structured data (JSON-LD, schema.org).
- XML sitemap + `robots.txt`.
- Good Core Web Vitals.
- SSR/SSG for content that must be indexed.

```html
<link rel="canonical" href="https://site.com/shoes">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Running Shoe"}</script>
```

**Real-life:** a well-labelled shop window so passers-by (search engines) know what you sell.

### HC-40. HTML-level security practices?

- Escape user content (XSS).
- **Content-Security-Policy** header.
- `rel="noopener noreferrer"` on external new-tab links.
- `sandbox` on untrusted iframes.
- **Subresource Integrity** on CDN scripts.
- Correct `autocomplete` on password fields.

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-..." crossorigin="anonymous"></script>
<iframe src="https://widget.example.com" sandbox="allow-scripts"></iframe>
```

**Real-life:** SRI = checking a parcel's seal before opening it.

---

## Part D — Cascade, Specificity, Selectors & Box Model

### HC-41. Ways to add CSS, and which is best?

| Way | Example |
|---|---|
| Inline | `style="color:red"` |
| Internal | `<style>` in `head` |
| External ✅ | `<link rel="stylesheet" href="app.css">` |
| `@import` | inside CSS |
| Preprocessor / CSS-in-JS | compiles to one of the above |

**Real-life:** external CSS = one shared uniform guide for all staff, instead of instructions pinned on each person.

⚠️ Avoid `@import` in production CSS: files load **one after another**.

### HC-42. How does the cascade decide which rule wins?

1. **Origin + importance** (user-agent → user → author; `!important` reverses it).
2. **Context** (Shadow DOM).
3. **Inline `style`**.
4. **Cascade layers** (`@layer`).
5. **Specificity**.
6. **Source order** (later wins).

**Real-life:** a court system: higher courts (origin, importance) beat lower ones; only if equal do you compare evidence (specificity), then who spoke last (order).

### HC-43. How is specificity calculated?

As **(A, B, C)**:

| Selector part | Adds to |
|---|---|
| ID (`#nav`) | A |
| class, attribute, pseudo-class (`.btn`, `[type]`, `:hover`) | B |
| element, pseudo-element (`div`, `::before`) | C |
| `*`, combinators | nothing |

```text
#nav .item a:hover  →  (1, 2, 1)
```

Compare A, then B, then C. Inline beats selectors; `!important` beats inline.

**Real-life:** army ranks: one general (ID) outranks any number of captains (classes).

⚠️ 11 classes never beat 1 ID; it isn't a base-10 number.

### HC-44. `:is()`, `:where()`, `:not()`, `:has()` and specificity?

| Selector | Specificity |
|---|---|
| `:is()`, `:not()`, `:has()` | their **most specific** argument |
| `:where()` | **always 0** |

```css
:where(.card) h2 { margin: 0; }       /* (0,0,1): easy to override */
li:not(.one) { font-style: italic; }  /* every li except .one */
```

🎯 Libraries use `:where()` for defaults that users override without fighting specificity.

### HC-45. What is `:has()` (the "parent selector")?

Selects an element based on **what it contains** or **what follows it**.

```css
.card:has(img) { padding: 0; }                   /* cards with an image */
form:has(input:invalid) button { opacity: .5; }  /* disable look on invalid form */
label:has(+ input:focus) { color: blue; }        /* previous sibling */
```

**Real-life:** "highlight every box that has a red ball inside".

⚠️ Avoid very broad usage like `body:has(...)` on huge DOMs (performance).
🎯 Replaces many JS class toggles.

### HC-46. What are cascade layers (`@layer`)?

Ordered groups of CSS. A **later layer beats an earlier one regardless of specificity**. Unlayered styles beat all layers.

```css
@layer reset, base, components, utilities;

@layer components { .btn#primary { color: blue; } }
@layer utilities  { .text-red { color: red; } }   /* wins, despite lower specificity */
```

**Real-life:** floors in a building: anything on a higher floor sits above everything below, however tall it is.

🎯 Ends specificity wars between resets, third-party libraries and your code.

### HC-47. Main selector types?

| Selector | Example |
|---|---|
| element / class / ID / universal | `p`, `.btn`, `#app`, `*` |
| attribute | `[type="text"]` |
| descendant (any depth) | `a b` |
| child (direct) | `a > b` |
| adjacent sibling | `a + b` |
| general sibling | `a ~ b` |
| pseudo-class / pseudo-element | `:hover`, `::before` |

**Real-life:** descendant = anyone in the family tree; child = direct children only.

### HC-48. Attribute selector variations?

| Selector | Matches |
|---|---|
| `[attr]` | exists |
| `[attr="v"]` | equals |
| `[attr*="v"]` | contains |
| `[attr^="v"]` | starts with |
| `[attr$="v"]` | ends with |
| `[attr~="v"]` | one word in a space list |
| `[attr\|="v"]` | equals or starts with `v-` |
| `[attr="v" i]` | case-insensitive |

```css
a[href^="https"] { color: green; }
a[href$=".pdf"]::after { content: " (PDF)"; }
```

### HC-49. Pseudo-class vs pseudo-element?

| Pseudo-class `:` | Pseudo-element `::` |
|---|---|
| element in a **state** | a **part** or generated content |
| `:hover`, `:focus-visible`, `:nth-child(2n)`, `:checked`, `:empty` | `::before`, `::after`, `::first-line`, `::placeholder`, `::marker`, `::selection`, `::backdrop` |

**Real-life:** pseudo-class = "a person who is smiling". Pseudo-element = "a person's hat".

### HC-50. Inheritance and `inherit` / `initial` / `unset` / `revert`?

Inherited by default: `color`, `font`, `line-height`, `visibility`. Not inherited: `margin`, `border`, `background`.

| Keyword | Means |
|---|---|
| `inherit` | parent's value |
| `initial` | spec default (e.g. `display: inline`) |
| `unset` | inherit if inherited property, else initial |
| `revert` | browser's default style |
| `revert-layer` | previous cascade layer's value |

**Real-life:** children inherit their family's language (color), not their parents' house (margin).

⚠️ `display: initial` is `inline`, not `block`, even on a `div`; use `revert` for the browser default.

### HC-51. What is the box model?

```text
margin → border → padding → content
```

- **Padding:** space **inside** the border.
- **Margin:** space **outside**, between elements.

**Real-life:** a framed photo: photo (content), mount (padding), frame (border), gap on the wall (margin).

### HC-52. `content-box` vs `border-box`?

| `content-box` (default) | `border-box` |
|---|---|
| `width` = content only | `width` includes padding + border |
| 200px + 20px padding = **240px** | stays **200px** |

```css
*, *::before, *::after { box-sizing: border-box; }
```

**Real-life:** border-box = a suitcase with fixed outside dimensions; padding eats into the inside space.

### HC-53. What is margin collapsing?

Vertical margins of adjacent blocks **combine** into the larger one (20px + 30px → **30px**). Also between a parent and its first/last child when nothing separates them.

**Doesn't happen** in flex/grid, with padding/border between, or in a new BFC (`display: flow-root`).

**Real-life:** two people each wanting "2 metres personal space" stand 2 metres apart, not 4.

### HC-54. What is a Block Formatting Context (BFC)?

An isolated layout region: floats are contained and margins don't collapse with outside.

Created by: `display: flow-root`, `overflow` ≠ `visible`, floats, absolute positioning, `inline-block`, flex/grid items, `contain: layout`.

```css
.parent { display: flow-root; } /* modern clearfix */
```

**Real-life:** a room with its own walls; furniture inside doesn't spill into the hallway.

### HC-55. Which CSS units should you use?

| Unit | Relative to | Use for |
|---|---|---|
| `px` | fixed | borders, small details |
| `rem` | root font size | font sizes, spacing (respects zoom) |
| `em` | element's font size | padding that scales with text |
| `%` | parent | fluid widths |
| `vw` / `vh` | viewport | full-screen sections |
| `dvh` / `svh` / `lvh` | dynamic/small/large viewport | mobile full height (fixes `100vh` bug) |
| `ch` | width of "0" | line length (`max-width: 65ch`) |
| `cqi` / `cqw` | container | container-query sizing |
| `fr` | free grid space | grid tracks |

**Real-life:** `rem` = measuring in "standard steps", which grow if the user turns up the zoom.

⚠️ Nested `em` **compounds** (1.2em inside 1.2em = 1.44×).

---

## Part E — Layout: Position, Stacking, Flexbox & Grid

### HC-56. `display: block` vs `inline` vs `inline-block` vs `none`?

| Value | Behaviour |
|---|---|
| `block` | new line, full width, accepts width/height |
| `inline` | flows with text, **ignores** width/height and vertical margins |
| `inline-block` | flows with text **and** accepts width/height |
| `none` | removed from layout and accessibility tree |

**Real-life:** inline-block = a sticker placed in a line of text that keeps its own size.

### HC-57. `position` values?

| Value | Relative to | In flow? |
|---|---|---|
| `static` | not positioned | ✅ |
| `relative` | its own normal spot | ✅ (space kept) |
| `absolute` | nearest positioned ancestor | ❌ |
| `fixed` | viewport* | ❌ |
| `sticky` | relative until a scroll point, then sticks in parent | ✅ |

\* unless an ancestor has `transform`, `filter` or `contain` (HC-112).

```css
header { position: sticky; top: 0; }
```

**Real-life:** absolute = a sticky note on a specific page. Fixed = a note on your screen frame. Sticky = a bookmark that stays at the top while you read that chapter.

⚠️ Sticky fails if an ancestor has `overflow: hidden` or the parent is too short.

### HC-58. How does `z-index` work? What is a stacking context?

`z-index` compares elements **only within the same stacking context** (a group layered as one unit).

Created by: root, positioned + `z-index` ≠ auto, flex/grid child with `z-index`, `opacity < 1`, `transform`, `filter`, `will-change`, `isolation: isolate`, `position: fixed/sticky`, `contain: paint`.

**Real-life:** papers in folders. A paper with "9999" inside a bottom folder still sits under every paper in the top folder.

⚠️ Classic bug: modal `z-index: 9999` behind a header because its parent made a lower context.
🎯 Fix: render overlays at the top level (portal), use the **top layer** (`<dialog>`, popover), or `isolation: isolate` deliberately.

### HC-59. What does `float` do? How to clear?

Pushes an element left/right so text wraps around it (images in articles).

```css
.next { clear: both; }
.parent { display: flow-root; } /* contain floats */
```

**Real-life:** a photo in a magazine with text flowing around it.

⚠️ Don't use floats for page layout; use flexbox/grid.

### HC-60. What is flexbox?

**One-dimensional** layout (row **or** column).

| Container | Item |
|---|---|
| `display: flex`, `flex-direction`, `flex-wrap` | `flex-grow`, `flex-shrink`, `flex-basis` |
| `justify-content` (main axis) | `flex` shorthand |
| `align-items` (cross axis) | `align-self` |
| `align-content`, `gap` | `order` |

**Real-life:** books on one shelf: spread them out, push to one end, or centre them.

⚠️ `order` changes visual order only, not tab/reading order (accessibility).

### HC-61. `flex: 1` vs `flex: auto` vs `flex: none`?

| Shorthand | grow / shrink / basis | Behaviour |
|---|---|---|
| `flex: 1` | 1 / 1 / 0% | equal shares, ignores content size |
| `flex: auto` | 1 / 1 / auto | grows from content size |
| `flex: none` | 0 / 0 / auto | fixed at content size |
| `flex: 0 0 200px` | 0 / 0 / 200px | exactly 200px |

**Real-life:** `flex: 1` = splitting a pizza equally; `flex: auto` = everyone keeps what they brought, then shares the extra.

### HC-62. Why does a flex item overflow instead of shrinking? ⭐

Flex items default to `min-width: auto`, so they won't shrink below their **content** (long words, `pre`, tables).

```css
.item { min-width: 0; } /* or overflow: hidden */
```

**Real-life:** a passenger with a huge suitcase who refuses to fit a smaller seat.

🎯 One of the most common real-world flexbox bugs (also needed for text ellipsis, HC-103).

### HC-63. How do you centre an element?

```css
/* Flexbox */
.parent { display: flex; justify-content: center; align-items: center; }

/* Grid (shortest) */
.parent { display: grid; place-items: center; }

/* Absolute */
.child { position: absolute; inset: 0; margin: auto; width: fit-content; height: fit-content; }

/* Horizontal only */
.child { margin-inline: auto; width: 600px; }
```

### HC-64. What is CSS Grid?

**Two-dimensional** layout (rows **and** columns).

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

Also: `grid-column: 1 / -1` (span all), `span 2`, `minmax()`, `repeat()`, `grid-auto-flow: dense`.

**Real-life:** a spreadsheet or a chessboard: place items in rows and columns at once.

### HC-65. `auto-fill` vs `auto-fit`?

```css
.grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
```

| `auto-fill` | `auto-fit` |
|---|---|
| keeps empty tracks | collapses empty tracks |
| few items stay narrow | few items **stretch** to fill |

**Real-life:** auto-fill = setting chairs for absent guests. auto-fit = removing empty chairs so guests spread out.

🎯 Responsive cards **without media queries**.

### HC-66. What is subgrid?

A nested grid uses its **parent's tracks**.

```css
.cards { display: grid; grid-template-columns: repeat(3, 1fr); }
.card  { display: grid; grid-row: span 3; grid-template-rows: subgrid; }
```

**Real-life:** every card's title, body and button line up across the row, even with different text lengths.

### HC-67. Flexbox vs Grid?

| Flexbox | Grid |
|---|---|
| one direction | two directions |
| content-driven | layout-driven |
| navbars, button groups, centring | page shells, dashboards, galleries |

**Real-life:** flexbox = a row of books on a shelf. Grid = a whole bookcase.

🎯 Combine them: grid for the page, flex inside components.

### HC-68. What are logical properties?

Direction-aware properties that work in RTL (Arabic, Hebrew) and vertical writing modes.

| Physical | Logical |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-top` / `padding-bottom` | `padding-block` |
| `width` / `height` | `inline-size` / `block-size` |
| `top/right/bottom/left: 0` | `inset: 0` |
| `text-align: left` | `text-align: start` |

**Real-life:** saying "at the start of the line" instead of "on the left", which works for any language direction.

---

## Part F — Responsive & Modern CSS

### HC-69. What does the viewport meta tag do?

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Tells mobile browsers to use the **device width** instead of rendering a ~980px desktop page and zooming out.

**Real-life:** printing on the right paper size instead of shrinking an A3 poster onto a postcard.

⚠️ Never add `user-scalable=no` or `maximum-scale=1`; blocking zoom fails accessibility.

### HC-70. Mobile-first vs desktop-first?

| Mobile-first | Desktop-first |
|---|---|
| base styles for small screens | base styles for large screens |
| `min-width` queries | `max-width` queries |
| less overriding, faster mobile | more overrides on mobile |

```css
.card { padding: 1rem; }
@media (min-width: 768px) { .card { padding: 2rem; } }
```

**Real-life:** packing a small backpack first, then adding extras when you have a bigger bag.

### HC-71. What else can media queries check?

`prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`, `hover` / `pointer` (touch vs mouse), `orientation`, `resolution`, `print`.

```css
@media (hover: none) { .tooltip { display: none; } }
@media (400px <= width <= 900px) { /* range syntax */ }
@media print { nav { display: none; } }
```

### HC-72. What are container queries?

Style a component based on its **parent container's** size, not the viewport.

```css
.card-wrap { container-type: inline-size; container-name: card; }

@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: 150px 1fr; }
}
```

**Real-life:** furniture that rearranges itself depending on the **room** it's in, not the size of the house.

🎯 Media queries for page layout; container queries for reusable components. Style queries also exist: `@container style(--theme: dark)`.

### HC-73. Fluid typography with `clamp()`?

`clamp(min, preferred, max)` scales smoothly between limits.

```css
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem); }
.container { width: min(100% - 2rem, 1200px); margin-inline: auto; }
```

**Real-life:** a thermostat: follows the outside temperature but never below 18° or above 24°.

⚠️ Always mix a `rem` part into the preferred value so text responds to user zoom.

### HC-74. Responsive design checklist?

- Viewport meta tag.
- Relative units (`rem`, `%`, `fr`).
- Flexbox/grid fluid layouts.
- `img, video { max-width: 100%; height: auto; }`
- Responsive images (`srcset`).
- Container queries for components.
- Touch targets ≥ 44px.
- Test on real devices.
- Respect dark mode and reduced motion.

### HC-75. What are CSS custom properties?

`--name` defined, `var(--name, fallback)` used. Unlike Sass variables, they're **live at runtime**: inherit, cascade, change in media queries, update via JS.

```css
:root { --brand: #0055ff; --space: 1rem; }
.btn { background: var(--brand); padding: var(--space); }
.dark { --brand: #66a3ff; }
```

```js
document.documentElement.style.setProperty("--brand", "red");
```

**Real-life:** a thermostat setting all rooms read from; change it once and every room updates.

| Sass `$var` | CSS `--var` |
|---|---|
| compile time | runtime |
| can't change in the browser | JS and media queries can change it |

### HC-76. What is `@property`?

Registers a custom property with a **type**, initial value and inheritance, so it can be **animated**.

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.ring {
  background: conic-gradient(from var(--angle), red, blue);
  animation: spin 3s linear infinite;
}
@keyframes spin { to { --angle: 360deg; } }
```

**Real-life:** telling the browser "this is an angle, not just text", so it knows how to move smoothly between values.

### HC-77. How do you implement dark mode?

- Colours as custom properties.
- Switch with `prefers-color-scheme` and/or `data-theme` for a toggle.
- `color-scheme: light dark` so form controls and scrollbars adapt.
- `light-dark()` picks a colour per scheme.

```css
:root { color-scheme: light dark; --bg: light-dark(#fff, #111); }
[data-theme="dark"] { color-scheme: dark; }
body { background: var(--bg); }
```

**Real-life:** a room with two lighting presets; one switch changes every lamp.

🎯 Save the user's choice and apply it **before first paint** (inline script in `head`) to avoid a flash.

### HC-78. Native CSS nesting?

```css
.card {
  padding: 1rem;
  & h2 { margin: 0; }
  &:hover { box-shadow: 0 2px 8px #0002; }
  @media (min-width: 768px) { padding: 2rem; }
}
```

Sass-like nesting, no build step.

⚠️ Deep nesting increases specificity and couples styles to markup; keep it shallow (1–2 levels).

### HC-79. Other modern CSS features a senior should know?

| Feature | Use |
|---|---|
| `aspect-ratio: 16 / 9` | media boxes |
| `gap` in flexbox | spacing without margins |
| `color-mix()`, `oklch()`, relative colours | design-system palettes |
| `@scope` | limit styles to part of the DOM |
| `text-wrap: balance` / `pretty` | nicer headings / paragraphs |
| `accent-color` | theme checkboxes and radios |
| `scroll-snap-type` | carousels without JS |
| `scrollbar-gutter: stable` | no layout shift when a scrollbar appears |
| anchor positioning | tooltips tied to an element (check support) |

🎯 Check **Baseline** / caniuse.com and use `@supports` for progressive enhancement.

### HC-80. What is `@supports`?

A **feature query**: apply CSS only if supported.

```css
@supports (container-type: inline-size) { /* modern layout */ }
@supports not selector(:has(a)) { /* fallback */ }
```

**Real-life:** "if the venue has a projector, show slides; otherwise use handouts".

---

## Part G — Rendering, Animation & CSS Performance

### HC-81. Reflow vs repaint vs composite?

| Step | Triggered by | Cost |
|---|---|---|
| **Reflow (layout)** | `width`, `height`, `top`, `margin`, font size, DOM changes | 💰💰💰 |
| **Repaint** | `color`, `background`, `box-shadow` | 💰💰 |
| **Composite only** | `transform`, `opacity` | 💰 (GPU) |

**Real-life:** reflow = rearranging all the furniture. Repaint = repainting a wall. Composite = sliding a picture along its rail.

### HC-82. What is layout thrashing?

Forcing layout repeatedly by **alternating** DOM reads and writes.

```js
// ❌ read/write interleaved → many reflows
items.forEach((el) => { el.style.width = box.offsetWidth + "px"; });

// ✅ read once, then write
const w = box.offsetWidth;
items.forEach((el) => { el.style.width = w + "px"; });
```

**Real-life:** measuring the room, moving one chair, measuring again, moving another… instead of measuring once.

🎯 Batch reads, then writes; schedule writes with `requestAnimationFrame`.

### HC-83. Transitions vs animations?

| Transition | Animation (`@keyframes`) |
|---|---|
| between **two** states on change | many steps |
| needs a trigger (hover, class) | can auto-start, loop, pause |

```css
.btn { transition: transform 200ms ease-out; }
.btn:hover { transform: scale(1.05); }

@keyframes spin { to { transform: rotate(360deg); } }
.loader { animation: spin 1s linear infinite; }
```

**Real-life:** transition = a door swinging open when pushed. Animation = a ceiling fan running on its own.

### HC-84. How do you make animations smooth (60fps)?

- Animate only **`transform` and `opacity`**.
- Avoid animating `width`, `height`, `top`, `left`.
- `will-change` sparingly, just before animating (each layer costs memory).
- CSS for simple cases; Web Animations API or `requestAnimationFrame` for JS.

```css
/* ❌ */ .box { transition: left 300ms; }
/* ✅ */ .box { transition: transform 300ms; }
```

### HC-85. How do you respect reduced motion?

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

**Real-life:** offering a calm lift instead of a rollercoaster to people who get motion sick.

🎯 A WCAG requirement for non-essential motion (parallax, large animations).

### HC-86. View Transitions and scroll-driven animations?

- **View Transitions:** animated transitions between DOM states or pages.

```js
document.startViewTransition(() => updateDOM());
```

```css
@view-transition { navigation: auto; } /* multi-page apps */
::view-transition-old(root) { animation-duration: 300ms; }
```

- **Scroll-driven animations:** link animation to scroll position, no JS.

```css
.progress {
  animation: grow linear;
  animation-timeline: scroll();
}
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```

**Real-life:** a reading-progress bar that fills as you scroll.

### HC-87. `contain` and `content-visibility`?

- `contain: layout paint` → the element's insides don't affect the outside; limits reflow/repaint.
- `content-visibility: auto` → skips rendering off-screen sections until near the viewport.

```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px; /* reserve space, avoid scrollbar jumps */
}
```

**Real-life:** only furnishing the rooms people are about to enter.

🎯 Big wins on long pages (feeds, docs).

### HC-88. How do you optimise CSS delivery?

- Inline critical above-the-fold CSS.
- Load the rest without blocking.
- Remove unused CSS (PurgeCSS, Tailwind JIT, coverage tools).
- Minify + compress; split per route.
- No `@import` chains.
- Long-term caching with hashed names.

### HC-89. Do selector types affect performance?

Browsers match **right to left**: the rightmost (key) selector matters most (`.nav a` checks every `a`).

🎯 In practice selector cost is **rarely** the bottleneck. Large DOMs, frequent style recalculation and layout thrashing are. **Measure first** (DevTools Performance: Recalculate Style, Layout).

### HC-90. How do you debug CSS and rendering?

- **Elements panel:** computed styles, box model, which rule wins.
- **Flex/grid overlays.**
- **Rendering panel:** paint flashing, layout-shift regions.
- **Layers panel.**
- **Performance panel:** long tasks, layout.
- **Lighthouse** for Core Web Vitals.
- Quick hack: `* { outline: 1px solid red; }`.

**Real-life:** X-ray glasses for your page.

---

## Part H — CSS Architecture, Tooling & Bootstrap

### HC-91. CSS methodologies?

| Method | Idea |
|---|---|
| **BEM** | `.card__title--large` (Block__Element--Modifier); flat specificity |
| **OOCSS** | separate structure from skin, container from content |
| **SMACSS** | base, layout, module, state, theme |
| **ITCSS** | layers generic → specific (maps to `@layer`) |
| **Utility-first** | small single-purpose classes (Tailwind) |

```html
<div class="card card--featured">
  <h2 class="card__title">Title</h2>
</div>
```

**Real-life:** BEM = a filing system with strict naming so anyone can find a document.

### HC-92. CSS Modules vs CSS-in-JS vs utility CSS?

| Approach | Pros | Cons |
|---|---|---|
| **CSS Modules** | local scope, plain CSS, zero runtime | theming via variables only |
| **Runtime CSS-in-JS** (styled-components, Emotion) | dynamic props, co-location | runtime cost, SSR complexity, poor fit with Server Components |
| **Zero-runtime CSS-in-JS** (vanilla-extract, Linaria, Panda) | type-safe, no runtime | build tooling |
| **Utility-first** (Tailwind) | fast, tiny CSS, consistent tokens | long class lists, needs discipline |

🎯 The industry moved away from runtime CSS-in-JS toward **zero-runtime** and **utility** approaches (performance, SSR).

### HC-93. Are preprocessors still needed?

Sass/SCSS, Less, Stylus add variables, nesting, mixins, functions, loops.

Native CSS now has variables, nesting, `color-mix()` and layers, so many teams use **less Sass**. Sass still helps with mixins, loops and legacy code. **PostCSS + Autoprefixer** transforms modern CSS for older browsers.

**Real-life:** you used to need a calculator app; now the phone has one built in, but some still prefer a scientific calculator.

### HC-94. What are design tokens?

Named design decisions (colours, spacing, typography, radii, shadows) in a platform-neutral format (JSON), converted to CSS variables, iOS and Android values (e.g. **Style Dictionary**).

```json
{ "color": { "brand": { "value": "#0055ff" } }, "space": { "md": { "value": "16px" } } }
```

```css
:root { --color-brand: #0055ff; --space-md: 16px; }
```

**Real-life:** a brand guidebook every team (web, iOS, Android) follows.

### HC-95. How do you design CSS for a large app / design system?

- Tokens as CSS custom properties.
- Scoped component styles (Modules or BEM).
- `@layer` order: reset → base → components → utilities.
- Low, flat specificity (no IDs, avoid `!important`).
- Storybook docs.
- Visual regression (Chromatic, Percy, Playwright screenshots).
- Stylelint rules.
- Theming and dark mode from day one.

**Real-life:** city planning: zoning rules, standard materials and inspections, not each builder doing their own thing.

### HC-96. What is Bootstrap?

An open-source, **mobile-first** CSS framework: responsive grid, ready components, utility classes. Add via CDN `<link>` or npm; customise with Sass variables.

| ✅ Pros | ❌ Cons |
|---|---|
| fast development, consistency | generic look |
| accessibility basics | unused CSS unless trimmed |

**Real-life:** a ready-made furnished show flat.

### HC-97. How does the Bootstrap grid work?

**12-column flexbox grid:** `.container` → `.row` → `.col-*`.

| Breakpoint | Class infix | Width |
|---|---|---|
| xs | (none) | < 576px |
| sm | `sm` | ≥ 576px |
| md | `md` | ≥ 768px |
| lg | `lg` | ≥ 992px |
| xl | `xl` | ≥ 1200px |
| xxl | `xxl` | ≥ 1400px |

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">...</div>
  </div>
</div>
```

**Real-life:** a page split into 12 equal strips; each column takes some strips per screen size.

⚠️ There's no `-xs` suffix (removed in Bootstrap 4); the smallest is just `.col-6`.

### HC-98. `.container` vs `.container-fluid`? Main components?

| `.container` | `.container-fluid` |
|---|---|
| fixed max-width per breakpoint, centred | always 100% wide |

**Components:** navbar (collapse toggler), modal, carousel, cards, buttons, forms, badges, alerts, pagination, spinners, progress bars, tooltips/popovers (need Popper).

### HC-99. Bootstrap vs Tailwind?

| Bootstrap | Tailwind |
|---|---|
| ready components, standard look | low-level utilities, no prebuilt look |
| fast for admin tools, prototypes | custom designs |
| ships more CSS | generates only used classes |

**Real-life:** Bootstrap = ready-made furniture. Tailwind = a box of quality parts to build your own design.

Others: Foundation, Bulma, MUI, shadcn/ui.

---

## Part I — Tips, Tricks & Tricky Questions

### HC-100. What does `object-fit` do?

Controls how an image/video fills its box **without distortion**.

```css
img { width: 100px; height: 100px; object-fit: cover; object-position: top; }
```

| Value | Effect |
|---|---|
| `cover` | fills, crops extra |
| `contain` | fits fully, empty space |

**Real-life:** `cover` = a photo filling a frame (edges trimmed). `contain` = the whole photo with a mount around it.

### HC-101. Smooth scrolling, and the catch?

```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
:target { scroll-margin-top: 80px; } /* clear a sticky header */
```

⚠️ Without `scroll-margin-top`, anchored headings hide under sticky headers.

### HC-102. How do you hide empty elements?

```css
p:empty { display: none; }
```

⚠️ `:empty` only matches elements with **no children and no text**. Whitespace has traditionally counted as content; the spec is changing this, but don't rely on it.

### HC-103. How do you truncate text with an ellipsis?

```css
/* one line */
.one { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* multiple lines */
.multi { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
```

⚠️ In a flex row, the text item also needs `min-width: 0` (HC-62).

**Real-life:** "Read more…" on a news card.

### HC-104. How do you make a sticky footer?

```css
body { min-height: 100dvh; display: grid; grid-template-rows: auto 1fr auto; }
```

`main` takes the remaining space, so the footer stays at the bottom on short pages.

**Real-life:** a table runner that always reaches the end of the table, however few plates there are.

### HC-105. Full-bleed section inside a centred container?

```css
.full-bleed { width: 100vw; margin-inline: calc(50% - 50vw); }
```

⚠️ `100vw` includes the vertical scrollbar → can cause a horizontal scrollbar. A named-line grid layout is more robust:

```css
.page { display: grid; grid-template-columns: [full-start] 1fr [content-start] min(65ch, 100% - 2rem) [content-end] 1fr [full-end]; }
.page > * { grid-column: content; }
.page > .full-bleed { grid-column: full; }
```

### HC-106. `display: none` vs `visibility: hidden` vs `opacity: 0`? ⭐

| | Takes space | Clickable | Screen readers | Animatable |
|---|---|---|---|---|
| `display: none` | ❌ | ❌ | hidden | ❌ (except `transition-behavior: allow-discrete`) |
| `visibility: hidden` | ✅ | ❌ | hidden | ✅ (discrete) |
| `opacity: 0` | ✅ | ✅ | **still read** | ✅ |

**Real-life:** `display: none` = person left the room. `visibility: hidden` = invisible but their chair is taken. `opacity: 0` = invisible but you can still bump into them.

### HC-107. Why is `z-index: 9999` not working?

1. The element isn't positioned (and isn't a flex/grid item), **or**
2. A parent created a **lower stacking context** (`transform`, `opacity`, `filter`…).

A child can never escape its parent's context (HC-58).

### HC-108. Why doesn't `height: 100%` work?

Percentage height needs a parent with an **explicit height**, all the way up (`html`, `body`).

```css
/* modern fixes */
.page { min-height: 100dvh; }
.parent { display: flex; } /* children stretch */
```

**Real-life:** "fill 100% of the glass" means nothing if nobody knows how big the glass is.

### HC-109. Why is there a gap under an image?

Images are **inline** and sit on the text **baseline**, leaving room for letter descenders (g, y, p).

```css
img { display: block; } /* or vertical-align: middle */
```

### HC-110. Why is there a gap between `inline-block` elements?

The whitespace (spaces, newlines) between them in HTML renders as a space character.

**Fix:** use flexbox or grid with `gap`.

### HC-111. Which wins: class order in HTML or CSS order?

**CSS order.** With equal specificity, the rule **later in the stylesheet** wins. `class="red blue"` and `class="blue red"` look the same.

**Real-life:** the last instruction in the rulebook counts, not the order names were written on the form.

### HC-112. Can `position: fixed` move with its parent?

**Yes**, if an ancestor has `transform`, `filter`, `perspective`, `contain: paint` or `will-change: transform`. That ancestor becomes the containing block.

**Real-life:** a sign "fixed to the wall", but the wall is on a moving train.

⚠️ Common bug inside animated containers; render overlays at the top level.

### HC-113. Why do percentage paddings use width even for top/bottom?

By spec, percentage padding and margin (**all sides**) use the containing block's **width**. That's how the old `padding-top: 56.25%` 16:9 trick worked.

🎯 Use `aspect-ratio: 16 / 9` now.

### HC-114. Style a parent based on a checked checkbox, no JS?

```css
.option:has(input:checked) { border-color: var(--brand); }
```

Before `:has()`: `input:checked + label` with a strict DOM order.

**Real-life:** a whole card lighting up when you tick the box inside it.

### HC-115. What does `gap` do that margins don't?

Adds space only **between** flex/grid items, never on the outer edges.

```css
.list { display: flex; gap: 1rem; } /* no :last-child { margin: 0 } hacks */
```

**Real-life:** spacing between fence posts, not before the first or after the last.

### HC-116. How do you review CSS in a large team? (Senior)

Check that:

- Tokens are used (no hard-coded colours/spacing).
- Specificity stays flat; no leaking styles.
- Layouts work at all breakpoints, with long content and translations.
- Focus states and contrast are intact.
- No layout shifts.
- The agreed method (Modules, BEM or utilities) is used consistently.

**Automate:** Stylelint, visual regression, axe accessibility tests.

**Real-life:** a building inspector with a checklist, plus automatic smoke detectors.

---

## Part J — Cheat Sheet

### HC-117. One-line answers

| Topic | One line |
|---|---|
| DOCTYPE | standards mode; without it → quirks mode |
| Semantic HTML | meaning over `div`s → a11y, SEO, readability |
| ARIA rule #1 | native element first |
| WCAG AA | contrast 4.5:1, keyboard, alt text, visible focus |
| `async` vs `defer` | any order, ASAP vs in order after parsing |
| Resource hints | preload (now), preconnect (connection), prefetch (next page) |
| Core Web Vitals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 |
| Hero image | `fetchpriority="high"`, never lazy |
| Cascade | origin/importance → context → inline → layers → specificity → order |
| Specificity | (IDs, classes/attrs/pseudo-classes, elements) |
| `:where()` | zero specificity |
| `@layer` | later layer wins regardless of specificity |
| `:has()` | parent / previous-sibling selector |
| `border-box` | width includes padding + border |
| Margin collapse | vertical, block only, larger wins |
| BFC | `display: flow-root` contains floats |
| Stacking context | `z-index` only compares inside the same context |
| Flex overflow bug | `min-width: 0` |
| Flex vs grid | 1D content-driven vs 2D layout-driven |
| `auto-fit` vs `auto-fill` | collapse vs keep empty tracks |
| Container queries | respond to parent, not viewport |
| `clamp()` | fluid values with min/max |
| Custom properties | live at runtime, cascade, JS-updatable |
| Cheap animation | only `transform` + `opacity` |
| Layout thrashing | batch reads, then writes |
| `content-visibility` | skip off-screen rendering |
| Runtime CSS-in-JS | declining → zero-runtime / utilities |
| Bootstrap grid | 12 columns, `container > row > col` |
| `display/visibility/opacity` | removed / invisible + space / invisible + clickable |
