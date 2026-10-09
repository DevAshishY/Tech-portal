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


# Claude API – Part 1: Accessing Claude with the API

Short notes for memorization.

> **Memory trick:** "**K**ind **M**onkeys **M**ake **M**agic" = **K**ey, **M**odel, **M**essages, **M**ax tokens

---

## 1. Accessing the API
The flow is App → **Your Server** → Claude → Server → App.
Never call Claude directly from the browser or a mobile app.

## 2. API Key
The key is your secret password. Keep it **on your server**, in an environment variable.
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

## 3. Making a Request
Every request needs four things: **key, model, messages, max_tokens**.
```python
import anthropic
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hi"}]
)
print(response.content[0].text)
```

## 4. Multi-Turn Conversations
Claude has **no memory** between requests, so send the full history every time.
```python
messages = [
    {"role": "user", "content": "What is pizza?"},
    {"role": "assistant", "content": "Pizza is..."},
    {"role": "user", "content": "Popular toppings?"}
]
```

## 5. System Prompts
A system prompt sets Claude's **role and rules** for the whole chat.
```python
system="You are a math tutor. Give hints, not answers."
```

## 6. Temperature
| Value | Result | Use for |
|-------|--------|---------|
| ~0.0 | Predictable | Facts, Q&A |
| ~1.0 | Creative, varied | Stories, brainstorming |

## 7. Response Streaming
Streaming shows text **as it's generated**, so users don't wait on a spinner.
```python
with client.messages.stream(model="claude-sonnet-5-5", max_tokens=1000,
                            messages=messages) as stream:
    for text in stream.text_stream:
        print(text, end="")
```

## 8. Structured Data (Clean JSON)
Use a **prefill** to start the answer and a **stop sequence** to end it.
```python
messages=[
    {"role": "user", "content": "Give user data as JSON"},
    {"role": "assistant", "content": "```json"}   # prefill = start
],
stop_sequences=["```"]                             # stop = end
```

---

## Quick Recap
- **Tokens** are the small text chunks Claude reads and writes.
- **Key** stays on the server only.
- **No memory**, so send the full history.
- **System prompt** sets the role.
- **Low temperature** gives consistency.
- **Streaming** makes the app feel fast.
- **Prefill + stop sequence** gives clean JSON.
