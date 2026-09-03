# CSS Tips & Tricks

---

### 1. `:not()` Pseudo Class

Select all elements that do NOT match a selector.

```css
li:not(.one) {
  font-style: italic;
}
```

---

### 2. `object-fit` Property for Image Control

Control how an image fills its container without distortion.

```css
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
```

---

### 3. Smooth Scrolling

Enable smooth scroll behavior for anchor links.

```css
html {
  scroll-behavior: smooth;
}
```

---

### 4. `:empty` for Empty Elements

Hide elements that have no content.

```css
p:empty {
  display: none;
}
```

---

### 5. Data Attributes

`data-*` attributes let you store custom, extra information directly on an HTML element without extra DOM properties or classes.

```html
<div id="user" data-id="42" data-role="admin">Happy</div>
```

Access them in JS via the `dataset` property (camelCase from the `data-` suffix), or target them in CSS with the `[data-x]` attribute selector.

```js
const el = document.getElementById("user");
el.dataset.id;   // "42"
el.dataset.role; // "admin"
```

```css
[data-role="admin"] { color: red; }
```

---

## Quick Reference Cheat-Sheet (merged from Top-100-HTML-CSS-Bootstrap notes)

### HTML Basics & Document Structure

| Topic | Key Point |
|---|---|
| HTML vs HTML5 | HTML5 = latest version; adds semantic tags (`header`,`nav`,`section`,`article`,`aside`,`footer`), new input types, `audio`/`video`, mobile support, simpler `<!DOCTYPE html>` |
| HTML vs XHTML | XHTML follows strict XML rules (all tags closed/nested, case-sensitive); HTML is lenient, not case-sensitive, more widely supported |
| `<!DOCTYPE html>` | Declares HTML version to the browser; omitting it still renders but risks quirks-mode/SEO/debugging issues |
| `<head>` vs `<body>` | head = metadata (`title`,`meta`,`link`,`style`,`script`); body = visible content. Put JS at end of body (or use `defer`) so DOM loads first |
| `<title>` | Sets browser tab text; used for SEO, bookmarks, and social-share titles |
| Meta tags (5 types) | `charset`, `viewport`, `description`, `keywords`, `author` |
| Root/Parent/Child | `<html>` is root; parent contains children; child/nested = same thing, contained inside a parent |
| Empty (void) elements | No closing tag needed: `img`, `input`, `br`, `hr`, `meta`, `link`, `area`, `base`, `col`, `embed` |
| Uppercase tags | Allowed (HTML not case-sensitive) but not recommended |

### HTML Elements, Semantics & Attributes

| Topic | Key Point |
|---|---|
| Element vs Tag | Tag = opening/closing marker (`<p>`,`</p>`); Element = tag + content + closing tag |
| `<div>` vs `<span>` | div = block-level generic container (grouping/layout); span = inline generic container (styling text) |
| Block vs Inline | Block starts new line, accepts width/height (`div`,`p`,`h1`,`ul`,`table`,`form`); inline flows with text, no width/height (`span`,`a`,`strong`,`em`,`img`,`input`,`br`) |
| Semantic elements | Tags that convey meaning: `header`,`nav`,`main`,`section`,`article`,`aside`,`footer`,`figure`,`details`,`summary`,`mark`,`time`,`progress`,`meter`. `div`/`span` are NOT semantic |
| `<section>` vs `<article>` | section = generic grouping of related content; article = self-contained independent content (blog post, news item) that could stand alone |
| `header/main/section/footer/address` | header = intro/nav content; main = primary page content; section = grouped content; footer = closing/related info; address = contact info |
| Heading tags (h1-h6) | Define document outline/hierarchy; important for readability, SEO, and consistent styling |
| HTML attributes | Provide extra info on elements; global/common (`class`,`id`,`style`,`data-*`) apply to all elements, specific ones (`href`,`src`,`alt`,`type`,`value`,`disabled`) apply to certain elements only |
| `id` vs `class` vs `style` | id = unique identifier (one element); class = reusable group styling (many elements); style = inline styling on one element |
| Duplicate IDs | Technically renders but is invalid HTML — can break CSS/JS targeting |
| Multiple classes | Space-separated in `class="a b"`; on conflicting rules, the class defined LAST in the stylesheet wins |
| HTML entities | Special codes for reserved/special characters: `&amp;` `&lt;` `&gt;` `&copy;` `&nbsp;` `&quot;` `&apos;` |

### HTML Links, Lists, Tables & Media

| Topic | Key Point |
|---|---|
| 5 link types | Anchor `<a href>`, External resource `<link>` (stylesheet), Image link (`<a><img></a>`), Bookmark/named anchor (`href="#id"`), Email (`href="mailto:x@y.com"`) |
| Absolute vs Relative URL | Absolute = full address, links to other sites; Relative = path from current file, links within same site |
| `<nav>` | Wraps a block of navigation links; improves structure & SEO |
| Fragment identifier | `#section-id` in a URL jumps to the element with that `id` on the same page |
| `<base>` | Sets a base URL in `<head>` that all relative URLs on the page resolve against |
| `target="_blank"` | Opens link in a new tab; other values: `_self` (default), `_parent`, `_top` |
| Lists | Ordered `<ol><li>` (numbered), Unordered `<ul><li>` (bulleted), Description `<dl><dt><dd>` (term+definition); lists can be nested |
| Table elements | `<table>` container, `<tr>` row, `<th>` header cell, `<td>` data cell; good for structured data, NOT responsive by default |
| `colspan` | Merges cells horizontally; applies only to `th`/`td` (`rowspan` merges vertically) |
| Table border | Set common style once via `table, th, td { border: ...; }` instead of repeating on every element |
| `<img>` | `src` = file path, `alt` = fallback/SEO text describing the image (important for accessibility & SEO) |
| JPEG vs PNG | JPEG = lossy compression, smaller size, lower quality; PNG = lossless compression, larger size, higher quality (supports transparency) |
| `<video>`/`<audio>` | Use `<source>` (multiple formats for browser fallback) + `controls`; `autoplay` starts on load, `loop` restarts at end |

### HTML Forms

| Topic | Key Point |
|---|---|
| `<form>` | Container for form controls; `action` = submit URL, `method` = HTTP verb (GET/POST) |
| `<label for="id">` | Associates a label with an input's `id` for accessibility/click-to-focus |
| `<input>` types | text, password (masks input), file (upload), submit (sends form), reset (clears form) |
| `required` | Makes an input mandatory; browser blocks submit with a validation message if empty |
| `<textarea rows cols>` | Multi-line text input; `rows` = visible lines, `cols` = characters per line |
| Radio vs checkbox | Radio = pick exactly one from a group; checkbox = pick multiple; group them by sharing the same `name` |
| `<select><option>` | Dropdown menu; more space-efficient than radios/checkboxes for long option lists |

### HTML Best Practices, SEO, Performance & Deployment

| Topic | Key Point |
|---|---|
| Best practices | Proper DOCTYPE, meta tags, semantic elements, meaningful id/class names, lowercase tags, `alt` on images, correct heading order, external CSS, indentation, always set `<title>` |
| HTML5 boilerplate | `<!DOCTYPE html>` + `lang` attr + charset + viewport meta + title + external CSS link + body + script before `</body>` |
| Performance tips | Minimize HTTP requests, use external CSS/JS (cacheable), minify code, compress images, leverage browser caching, load critical resources first, `async`/`defer` scripts, lazy-load images |
| SEO best practices | Semantic tags, optimized `<title>`, meta description, proper heading hierarchy, `alt` text on images |
| Deployment steps | Choose hosting provider → buy domain → prepare files (HTML/CSS/JS/images) → upload via FTP/panel/Git → configure SSL (HTTPS) |
| Emerging trends | Web Components (custom reusable elements), PWAs (app-like web apps), SPAs (single dynamic page), WebGL/VR, WebXR/AR |

### CSS Basics & Implementation

| Topic | Key Point |
|---|---|
| CSS | Cascading Style Sheets — stylesheet language controlling presentation of HTML |
| 5 ways to add CSS | Inline (`style=""` on one element), Internal (`<style>` in head), External (separate `.css` file + `<link>` — most recommended), `@import` (pulls another CSS file into a CSS file, but hurts performance), CSS Preprocessors |
| External stylesheet advantages | Separates content/presentation, reusable classes, keeps code organized, adapts across pages/devices, improves site speed via caching |
| CSS preprocessors | Scripting languages adding variables/loops/nesting to CSS; compiled to plain CSS. 3 types: SCSS/SASS (`.scss`), LESS (`.less`), Stylus (`.styl`) |

### CSS Selectors

| Topic | Key Point |
|---|---|
| Selector types | ID (`#id`), Element (`tag`), Class (`.class`), Universal (`*`), Descendant (`a b`), Child (`a > b`), Attribute (`[attr]`) |
| ID vs Element vs Class | ID targets one unique element; Element targets every element of that type; Class targets multiple elements sharing that class |
| Universal selector (`*`) | Applies style to every element on the page regardless of type |
| Descendant selector (`a b`) | Targets `b` anywhere inside `a`, at any nesting depth |
| Child selector (`a > b`) | Targets only direct/immediate children `b` of `a` — descendant selector also matches deeper nested elements, child selector does not |
| Attribute selectors (5 types) | `[attr]` exists, `[attr="val"]` equals, `[attr*="val"]` contains, `[attr^="val"]` starts with, `[attr$="val"]` ends with |
| Pseudo-class vs pseudo-element | Pseudo-class (`:hover`, `:not()`) targets a special STATE of an element; pseudo-element (`::before`, `::after`) targets a specific PART of an element |

### CSS Layout & Positioning

| Topic | Key Point |
|---|---|
| Box model | Content → Padding → Border → Margin (innermost to outermost) |
| Padding vs Margin | Padding = space inside the border (around content); Margin = space outside the border (between elements) |
| `display: block` vs `inline` | block = full width, starts new line, accepts width/height; inline = only as wide as content, no new line, no width/height |
| `inline` vs `inline-block` | inline-block behaves like inline (flows with text) but DOES accept width/height, unlike plain inline |
| `z-index` | Controls stacking order of positioned elements; higher value renders on top; equal values → later element in HTML source wins |
| `float` | Aligns an element left/right within its container, letting other content wrap/flow around it |
| `position: relative` | Positioned relative to its own normal position |
| `position: absolute` | Positioned relative to nearest positioned (non-static) ancestor |
| `position: fixed` | Positioned relative to the viewport; stays fixed even when page scrolls (used for sticky headers) |

### CSS Responsive Design

| Topic | Key Point |
|---|---|
| `meta viewport` | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — makes page render at device width instead of desktop-zoomed-out |
| Media queries | `@media (max-width: 768px) { ... }` — apply different CSS rules based on screen size |
| `display: flex` | Turns container into a flexbox; `justify-content` controls spacing/alignment of children along the main axis |
| CSS Grid | `display: grid` + `grid-template-columns` — 2D row/column-based layout system |
| Sticky header | `position: fixed` on the header element keeps it visible while the page scrolls |
| Responsive design checklist | Use relative units (%, em/rem) not px, media queries, flexible layout (flex/grid), `img { max-width: 100%; }`, viewport meta tag |
| Responsive frameworks | Bootstrap, Foundation, Bulma, Semantic UI, Materialize, Tailwind CSS |

### Bootstrap

| Topic | Key Point |
|---|---|
| Bootstrap | Open-source, mobile-first front-end CSS framework for responsive design |
| Advantages | Rapid development (pre-built components), responsive by default, cross-browser consistency, large community/docs, built-in accessibility |
| Including Bootstrap | Via CDN `<link>` in `<head>`, or download files and host locally |
| Grid system | 12-column layout; wrap in `.container` > `.row` > `.col-*` |
| `col-xs/sm/md/lg/xl` | Breakpoints from smallest to largest screens: xs=phones, sm=tablets, md=laptops, lg=large desktops, xl=large/TV screens |
| Common components | Buttons, Navbar, Forms, Carousel, Cards, Progress bars, Pagination, Spinners, Badges, Modals |
| Modal | `.modal` — a lightweight popup dialog box triggered by a button, overlaying the page content |
| Navbar | `.navbar` — pre-styled responsive navigation bar, often paired with a collapsible toggler for mobile |
| Carousel | `.carousel` — rotating image/content slideshow with indicators and prev/next controls |
| `.container` vs `.container-fluid` | `.container` = fixed max-width, centered with side padding; `.container-fluid` = always 100% viewport width |
