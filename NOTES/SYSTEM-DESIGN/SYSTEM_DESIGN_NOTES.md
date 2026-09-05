# ALL System Design Notes — Merged

Generated: 2026-09-05

Sources
- `NOTES/SYSTEM-DESIGN/system-design.md`
- Image: `NOTES/SYSTEM-DESIGN/Frontend System Design Yatra1.png`

---

## 1 — Merged System Design Notes (condensed)

System design is the process of defining system elements and their interactions to meet requirements. Typical steps:
- Understand the problem and constraints
- Define scope and boundaries
- Research existing systems and tradeoffs
- Create a high-level architecture and component interactions
- Iterate, test, and document

Key concepts
- Performance vs Scalability: performance = single-user speed; scalability = behaviour under load.
- Latency vs Throughput: latency = response time; throughput = concurrent request capacity.
- Availability & Consistency: availability keeps system working; consistency keeps data synchronized. Patterns: strong, weak, eventual consistency.

Networking & API patterns
- REST, GraphQL, gRPC, tRPC, WebSockets, Polling, Webhooks — choose by use-case (real-time vs request/response, typed contracts, bandwidth).

Performance & Optimization
- Code splitting, compression, import-on-interaction/visibility, prefetch/preload, tree shaking, virtual lists.
- Web Vitals: LCP, INP, CLS — optimize images, resource loading, and layout stability.

Testing & Observability
- Unit / Integration / E2E testing strategy.
- Load & stress testing (k6, JMeter).
- Logging (WinstonJS), metrics, tracing.

Image & Build Optimization
- Use `picture` + `srcset` + WebP/AVIF, lazy loading, responsive sizes, compression, and CDN delivery.

Accessibility
- Semantic HTML, ARIA, keyboard navigation, color contrast, use axe/Lighthouse.

Resources
- Roadmap: https://roadmap.sh/system-design
- Frontend resources & Excalidraw: https://app.excalidraw.com/l/8lwXEYCWFUz/5BWKjqfiBK6

---

## 2 — Image Review

- File: `NOTES/SYSTEM-DESIGN/Frontend System Design Yatra1.png`
- Inspection result: file appears empty (0 bytes) in the workspace. This indicates the image is missing or a broken/placeholder file in the repo.

Recommendations
- Replace the file with a real exported image (prefer WebP/AVIF). If using PNG/JPEG, re-export with compression.
- Add a concise `alt` text and descriptive caption for accessibility.
- Use responsive delivery: generate several sizes and serve via `srcset` or `picture`.
- Use `loading="lazy"` and a low-quality placeholder (LQIP) or blurred placeholder for faster LCP.
- Host large images on a CDN and set proper cache headers (long max-age with content hashing).

Quick commands (local) to generate modern formats and sizes using `sharp` (Node):

```bash
# install sharp if needed
npm install --save-dev sharp

# example: generate webp and resized variants
node -e "require('sharp')('Frontend\x20System\x20Design\x20Yatra1.png').resize(1600).webp({quality:80}).toFile('yatra-1600.webp')"
node -e "require('sharp')('Frontend\x20System\x20Design\x20Yatra1.png').resize(800).webp({quality:80}).toFile('yatra-800.webp')"
```

HTML example to serve responsively

```html
<picture>
  <source srcset="yatra-1600.webp" type="image/webp">
  <img src="yatra-800.webp" alt="Frontend System Design overview diagram" loading="lazy" width="800" />
</picture>
```

---

## 3 — Next steps (I can do these)
- Replace the empty PNG with the original image (upload) and I will generate WebP/AVIF variants and add `srcset` examples.
- Expand the merged notes into a checklist-based HLD template (components, data flow, scaling plan). Want me to create that?
