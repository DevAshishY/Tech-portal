## Part A — API Fundamentals

### API-1. What is an API?

A set of rules that lets one piece of software talk to another.

**Real-life:** a waiter. You (client) don't go into the kitchen (server); you give your order to the waiter (API), who brings back food (response).

**Example:** a weather app calls a weather API for today's forecast.

### API-2. What is a REST API?

An architectural style that uses **HTTP methods on resources**. URLs are **nouns**, methods are the **verbs**.

**Real-life:** a library: books have shelf numbers (URLs); you borrow, return or donate (methods).

```text
GET  /restaurants   → list restaurants
POST /orders        → create an order
```

### API-3. REST vs RESTful?

- **REST** = the style (the rules).
- **RESTful** = an API that actually follows them: stateless, cacheable, correct HTTP methods, uniform interface.

**Real-life:** "healthy diet" is the idea; a "healthy person" actually follows it.

🎯 Many "REST" APIs aren't fully RESTful (e.g. `POST /getUser`).

### API-4. What does stateless mean?

The server **remembers nothing** between requests. Each request carries everything it needs (e.g. the auth token).

**Real-life:** a toll booth: you show your pass every time; the booth doesn't remember you from yesterday.

🎯 Stateless = any server can handle any request → easy horizontal scaling.

### API-5. What are the REST constraints?

| Constraint | Meaning |
|---|---|
| Client-Server | frontend and backend separate |
| Stateless | no session on the server |
| Cacheable | responses say if they can be cached |
| Uniform Interface | consistent URLs + HTTP methods |
| Layered System | client doesn't know about proxies, gateways, DB behind |
| Code on Demand (optional) | server can send executable code |

**Example:** React frontend → Node API → database; each layer independent.

**Real-life:** a restaurant chain: same menu format everywhere (uniform), you don't see the supplier behind the kitchen (layered).

### API-6. What is CRUD and how does it map to HTTP?

| CRUD | Method | Example | Status |
|---|---|---|---|
| Create | POST | `POST /users` | 201 |
| Read | GET | `GET /users/5` | 200 |
| Update (full) | PUT | `PUT /users/5` | 200 |
| Update (part) | PATCH | `PATCH /users/5` | 200 |
| Delete | DELETE | `DELETE /users/5` | 200 / 204 |

**Real-life:** a phone contacts app: add, view, edit, delete a contact.

### API-7. What is an endpoint?

A specific URL + method that exposes a resource.

```text
GET /api/accounts/{id}
```

**Real-life:** a specific counter in a bank: "Deposits", "Loans".

### API-8. What is idempotency?

Sending the **same request many times** gives the **same result**, with no extra side effects.

**Real-life:** pressing a lift button 5 times still calls the lift **once**.

🎯 Payment APIs use an **`Idempotency-Key`** header so a retried request isn't charged twice.

### API-9. Which HTTP methods are idempotent?

| Method | Purpose | Idempotent? | Safe (no changes)? |
|---|---|---|---|
| GET | read | ✅ | ✅ |
| POST | create | ❌ (new resource each call) | ❌ |
| PUT | replace | ✅ | ❌ |
| PATCH | partial update | not guaranteed | ❌ |
| DELETE | remove | ✅ | ❌ |
| HEAD / OPTIONS | metadata | ✅ | ✅ |

⚠️ DELETE is idempotent even though the second call may return `404`: the **server state** is the same.

### API-10. PUT vs PATCH?

| PUT | PATCH |
|---|---|
| replaces the **whole** resource | changes **some** fields |
| missing fields may be cleared | other fields untouched |
| idempotent | not guaranteed |

**Real-life:** PUT = replacing the whole form. PATCH = correcting one field with white-out.

```http
PUT   /users/5   { "name": "Asha", "email": "a@x.com", "city": "Pune" }
PATCH /users/5   { "city": "Delhi" }
```

---

## Part B — Request & Response

### API-11. Request vs response?

| Request (client → server) | Response (server → client) |
|---|---|
| method, URL, headers, body | status code, headers, body |

**Real-life:** a letter you post vs the reply you receive.

```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer eyJ...

{ "productId": 7, "qty": 2 }
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "id": 123, "status": "placed" }
```

### API-12. What is a payload?

The **actual data** in the request or response body, usually JSON.

**Real-life:** the goods inside a parcel; the address label is the headers.

### API-13. What are headers?

**Metadata** about the request/response: auth, content type, caching, client info.

**Real-life:** the label on a parcel: sender, contents, "fragile".

### API-14. Content-Type vs Accept vs Authorization?

| Header | Meaning | Example |
|---|---|---|
| `Content-Type` | format I'm **sending** | `application/json`, `multipart/form-data` |
| `Accept` | format I **want back** | `application/json` |
| `Authorization` | credentials | `Bearer <token>`, `Basic base64(user:pass)` |

**Real-life:** Content-Type = "this parcel contains glass"; Accept = "please reply in English".

⚠️ Wrong `Content-Type` → server can't parse the body (e.g. Express `req.body` is empty).

### API-15. Path param vs query param?

| | Path param | Query param |
|---|---|---|
| Purpose | identify **which** resource | filter, sort, search, paginate |
| Required | yes | no |
| Position | in the path | after `?` |
| Example | `/users/25` | `/users?role=admin&page=2` |

Combined: `GET /api/users/10?active=true`

**Real-life:** path = which house (house number). Query = what you want from it ("only the kitchen, please").

### API-16. Common HTTP status codes?

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 301 / 304 | Moved Permanently / Not Modified (use cache) |
| 400 | Bad Request |
| 401 | Unauthorized (not logged in / bad credentials) |
| 403 | Forbidden (logged in, no permission) |
| 404 | Not Found |
| 409 | Conflict (e.g. email already exists) |
| 422 | Unprocessable Content (validation failed) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

**Real-life:** 2xx = "done", 3xx = "go elsewhere", 4xx = "your mistake", 5xx = "our mistake".

### API-17. 401 vs 403?

- **401:** server **doesn't know who you are** (missing/invalid credentials).
- **403:** server **knows you**, but you're **not allowed**.

**Real-life:** 401 = no ID card at the office gate. 403 = an intern with an ID card trying to enter the payroll room.

---

## Part C — Authentication & Security

### API-18. Authentication vs authorization?

| Authentication | Authorization |
|---|---|
| **who are you?** (login) | **what can you do?** (permissions) |
| fails with 401 | fails with 403 |
| always first | after authentication |

**Real-life:** hotel reception checks your ID (authN); your key card opens only your room (authZ).

### API-19. Common API auth methods?

| Method | How | Typical use |
|---|---|---|
| API Key | `x-api-key: abc123` header | public/partner APIs (maps, weather) |
| JWT | `Authorization: Bearer <token>` | login-based apps, stateless |
| OAuth 2.0 / OIDC | "Login with Google" | third-party access, SSO |
| Basic Auth | `Authorization: Basic base64(user:pass)` | internal / legacy |

**Real-life:** API key = a shared door code. JWT = a visitor badge. OAuth = a valet key that only drives the car, can't open the boot. Basic = saying your password at every door.

⚠️ Avoid API keys in the **query string** (`?api_key=`); they leak into logs and browser history. Use a header.
⚠️ Basic Auth sends a password every request; only over HTTPS.

### API-20. What is a JWT and why use it?

A compact, signed, URL-safe token. **Stateless**: no session storage on the server, scales well across microservices.

**Real-life:** a cinema ticket with your seat printed on it; any usher can check it without calling the box office.

⚠️ Hard to **revoke early**; keep access tokens short-lived.

### API-21. Structure of a JWT?

```text
Header.Payload.Signature
eyJhbGciOi... . eyJ1c2VySWQiOjF9 . SflKxwRJ...
```

| Part | Contains |
|---|---|
| Header | algorithm + type |
| Payload | claims: `userId`, `role`, `exp` |
| Signature | proves nobody tampered with it |

⚠️ The payload is **encoded, not encrypted**. Anyone can read it; never put passwords in it.

### API-22. How does JWT auth work?

1. User logs in.
2. Server validates credentials.
3. Server issues a JWT.
4. Client stores it.
5. Client sends `Authorization: Bearer <token>` on every request.
6. Server **verifies the signature** each time.

⚠️ Storage: `localStorage` is readable by any XSS script. Safer: **short-lived access token in memory + refresh token in an HttpOnly cookie**.

### API-23. What is a bearer token?

An access token sent in the `Authorization` header. **Whoever bears it gets access**.

**Real-life:** a cash note: whoever holds it can spend it.

🎯 Always over HTTPS; short expiry.

### API-24. What is a refresh token?

A **long-lived** token (e.g. 7 days) used to get a new **short-lived** access token (e.g. 15 min) without logging in again.

**Real-life:** a gym membership card (refresh) that gets you a new day pass (access) at the desk.

🎯 Store in an HttpOnly cookie; **rotate** it on each use and revoke on logout.

### API-25. What is OAuth?

Lets a third-party app get **limited** access to your data **without your password**. The provider (Google) issues an access token.

**Real-life:** a valet key: the valet can park the car but can't open the glovebox.

🎯 OAuth = authorization. **OpenID Connect (OIDC)** adds login/identity on top.

### API-26. What is CORS?

A server response header (`Access-Control-Allow-Origin`) telling the **browser** which origins may call the API.

**Real-life:** a guest list at the door; the guard (browser) checks it.

```http
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST
```

⚠️ A **browser** feature. Postman and servers ignore it, so CORS is **not** security against attackers.
🎯 Non-simple requests (PUT, custom headers) trigger an **OPTIONS preflight** first.

### API-27. What is the same-origin policy?

The browser blocks a page from reading data from a different **origin** (protocol + domain + port) unless CORS allows it.

```text
https://app.com  →  https://api.app.com   ❌ different origin (subdomain)
http://localhost:3000 → http://localhost:5000  ❌ different port
```

**Real-life:** you can only open post addressed to your own house.

### API-28. What is rate limiting?

A cap on requests per client per time window (e.g. 100/min). Over the limit → **`429`**.

**Real-life:** an ATM allowing only 3 PIN attempts.

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

🎯 Stops brute force, scraping and abuse. Express: `express-rate-limit`.

### API-29. How do you secure an API?

- **HTTPS** (TLS) everywhere.
- **Authentication** (JWT, OAuth, keys) + **role-based authorization**.
- **Input validation** (Zod/Joi).
- **Rate limiting**, WAF/firewall.
- Security headers (`helmet`), CORS allow-list.
- No secrets or stack traces in responses; patched dependencies.

**Real-life (banking app):** HTTPS encrypts transactions, JWT checks the user, rate limiting blocks brute force, validation blocks injection.

### API-30. How do you prevent SQL injection?

Never build queries by **concatenating** user input. Use **parameterised queries** or an ORM, and validate input.

```js
// ❌ "1 OR 1=1" returns every user
db.query("SELECT * FROM users WHERE id = " + userInput);

// ✅ parameterised
db.query("SELECT * FROM users WHERE id = $1", [userInput]);
```

**Real-life:** a form with fixed boxes; you can't write a new instruction for the clerk in the "name" box.

🎯 MongoDB has **NoSQL injection** too (`{ "$ne": null }` in a login body); validate types.

### API-31. How do you handle file uploads?

Send with `Content-Type: multipart/form-data`.

**Real-life:** a parcel counter, not a letter box.

```js
app.post("/avatar", upload.single("avatar"), (req, res) => res.json({ file: req.file.filename }));
```

⚠️ Limit size and type, scan files, store in S3/Cloudinary, save only the URL in the DB.

---

## Part D — Data Shaping

### API-32. What is pagination?

Splitting large results into pages.

```text
GET /posts?page=2&limit=20
```

**Real-life:** a book split into pages instead of one endless scroll.

### API-33. Offset vs cursor pagination?

| Offset (`page`, `limit`) | Cursor (`after=<id>`) |
|---|---|
| simple, jump to any page | "next" only |
| slow on big data | fast (uses an index) |
| can skip/repeat items when data changes | stable |

```text
GET /posts?limit=20&after=abc123
```

**Real-life:** offset = "page 50" in a book that keeps getting new pages added at the front. Cursor = a bookmark.

🎯 Cursor for feeds and infinite scroll.

### API-34. How do you filter results?

With query params.

```text
GET /orders?status=delivered&payment=completed
```

### API-35. How do you sort results?

```text
GET /products?sort=price&order=asc
GET /products?sort=-createdAt          // "-" = descending (common convention)
```

⚠️ Allow-list sortable fields; don't pass user input straight to the database.

### API-36. What is API versioning?

Keeping several versions alive so changes don't break old clients.

```text
/api/v1/users       ← most common (URL)
Accept: application/vnd.app.v2+json   ← header versioning
```

**Real-life:** a new phone model doesn't stop old phones working.

### API-37. What is HATEOAS?

The response includes **links** to next actions; the client discovers them from the API.

```json
{
  "id": 123,
  "status": "placed",
  "links": { "track": "/orders/123/track", "cancel": "/orders/123/cancel" }
}
```

**Real-life:** a web page with buttons for what you can do next.

🎯 Rarely fully used in practice, but it's the top level of REST maturity (Richardson model).

### API-38. How do you keep an API backward compatible?

- Never remove or rename existing fields.
- Add new fields as **optional**.
- New version for breaking changes.
- Publish a **deprecation** policy (e.g. `Deprecation` / `Sunset` headers, migration window).

**Real-life:** adding a new lane to a road without closing the old ones.

---

## Part E — Architecture & Scalability

### API-39. What is an API Gateway?

A single entry point in front of many services: auth, rate limiting, routing, logging.

```text
Client → API Gateway → User / Order / Payment services
```

**Real-life:** a hotel reception: guests talk to one desk, which contacts housekeeping, kitchen or maintenance.

Tools: Kong, AWS API Gateway, NGINX.

### API-40. What are microservices?

An app split into small **independent** services, each with its own API (and often its own DB).

**Example (e-commerce):** User, Order, Payment, Inventory services.

**Real-life:** a food court: each stall runs independently; one closing doesn't shut the court.

| ✅ Pros | ❌ Cons |
|---|---|
| independent deploys and scaling | network calls, harder debugging |
| team ownership | distributed data, consistency |

🎯 Start with a modular monolith; split when teams and scale demand it.

### API-41. What is caching?

Storing frequent data temporarily to cut latency and load.

**Real-life:** keeping milk in your fridge instead of going to the shop every time.

| Layer | Tool |
|---|---|
| Browser / CDN | `Cache-Control`, `ETag` |
| Server | Redis, in-memory |
| DB | query cache |

```http
Cache-Control: public, max-age=300
ETag: "abc123"        → next request: If-None-Match → 304 Not Modified
```

⚠️ The hard part is **invalidation**: when data changes, clear the cache.

### API-42. What is load balancing?

Spreading requests across servers so none is overloaded.

**Real-life:** opening more checkout counters and sending each customer to the shortest queue.

Strategies: round-robin, least connections, IP hash. Tools: NGINX, AWS ELB.

🎯 Works best with **stateless** APIs.

### API-43. Throttling vs rate limiting?

| Rate limiting | Throttling |
|---|---|
| fixed cap per client | slows/queues requests when **overall** load is high |
| rejects with 429 | delays or reduces |

**Real-life:** rate limiting = "3 tickets per person". Throttling = slowing the queue during a flash sale.

### API-44. What is a retry mechanism?

Automatically retrying a failed request (network blip, 503).

**Real-life:** redialling a busy number, but waiting a bit longer each time.

🎯 Use **exponential backoff + jitter**, retry only safe/idempotent requests, and use **idempotency keys** for POST.

### API-45. What is a circuit breaker?

Stops calling a failing service for a while and returns a fallback, so one failure doesn't cascade.

**Real-life:** a home circuit breaker trips to stop one faulty appliance burning the house.

```text
Closed (normal) → too many failures → Open (fail fast) → wait → Half-open (test) → Closed
```

### API-46. How do you prevent duplicate requests?

Idempotency keys, unique transaction IDs, request hashing, DB unique constraints, and disabling the button on the frontend.

**Real-life:** a shop gives each order a unique receipt number; a second scan of the same receipt is ignored.

```http
POST /payments
Idempotency-Key: 7f3c-91ab
```

### API-47. What is an event-driven API?

Services react to **events** (order placed, user registered) instead of calling each other directly.

**Real-life:** a fire alarm: everyone reacts to the alarm; nobody phones each person individually.

### API-48. Webhook vs normal API?

| Normal API | Webhook |
|---|---|
| client **pulls** | server **pushes** to your URL |
| you ask "anything new?" | "I'll call you when it happens" |

**Example:** Stripe sends a webhook on payment success; your server updates the order.

**Real-life:** polling = checking the door every minute. Webhook = a doorbell.

⚠️ **Verify the signature**, make handlers idempotent (webhooks can repeat), and respond `200` quickly.

### API-49. What is a message queue?

Stores messages for **async** processing; absorbs spikes and avoids blocking.

**Real-life:** a restaurant order rail: waiters pin orders, cooks take them one by one.

Tools: RabbitMQ, Kafka, AWS SQS, BullMQ (Redis).

### API-50. Sync vs async APIs?

| Sync | Async |
|---|---|
| client waits | client continues |
| blocking | non-blocking |
| quick tasks (get profile) | heavy tasks (send email, generate report) |

**Real-life:** sync = waiting at the counter for a coffee. Async = getting a buzzer that rings when it's ready.

🎯 Async pattern: return **`202 Accepted`** + a job ID, client polls or gets a webhook.

### API-51. How do you handle concurrency?

Locks, **optimistic concurrency** (version field), transactions, queues, atomic updates.

**Real-life:** two people booking the **same train seat**; only one can win.

```js
// optimistic: only update if version unchanged
await Seat.updateOne({ _id: id, version: 3 }, { $set: { bookedBy: userId }, $inc: { version: 1 } });
// matchedCount 0 → someone else booked first → 409 Conflict
```

### API-52. What is blue-green deployment?

Run old (blue) and new (green) side by side, switch traffic to green after testing.

**Real-life:** setting up a new stage behind the curtain, then swapping it in one go.

✅ Zero downtime, instant rollback. ❌ Double infrastructure.

### API-53. What is a canary release?

Release to a **small %** of users first, watch metrics, then roll out to everyone.

**Real-life:** miners used canaries to detect gas early; a few users detect bugs early.

---

## Part F — API Design & Error Handling

### API-54. How do you design a good REST API?

- Nouns, not verbs; plural resources.
- Correct HTTP methods and status codes.
- Versioning (`/api/v1`).
- Consistent naming (camelCase or snake_case, pick one).
- Pagination, filtering, sorting.
- Security and consistent error format.

```text
✅ GET /users   POST /users   GET /users/{id}   GET /users/{id}/orders
❌ /getUsers    /createUser   /deleteUser/5
```

**Real-life:** clear street signs: every road named the same way.

### API-55. How do you handle errors?

Correct status code + clear message + server-side logging. **Never leak stack traces.**

```json
{
  "success": false,
  "error": { "code": "INVALID_CREDENTIALS", "message": "Email or password is wrong" }
}
```

**Real-life:** a helpful shop sign "Closed for stock-taking, back at 2 pm", not a list of broken machines.

🎯 Use a stable **error code** clients can check; messages can change. Standard format: RFC 9457 Problem Details.

### API-56. What is centralised error handling?

All errors handled in **one place** (middleware / global handler): consistent responses, cleaner controllers.

**Real-life:** one complaints desk for the whole store.

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.expose ? err.message : "Server error" });
});
```

Examples: Express error middleware, Spring Boot `@ControllerAdvice`.

### API-57. What is middleware?

Code between request and response: auth, logging, validation, rate limiting.

```text
Request → Middleware (auth, log, validate) → Controller → Response
```

**Real-life:** airport checks between check-in and the plane.

### API-58. What is an API timeout?

The maximum time a client waits before giving up (e.g. a payment API times out after 30 s).

**Real-life:** hanging up if nobody answers after 30 rings.

🎯 Set timeouts **on every outbound call**; without them one slow service ties up all your workers.

### API-59. How do you handle large responses?

Pagination, streaming, gzip/brotli compression, caching, field selection, lazy loading, or async export (email a download link).

**Example:** a bank's full transaction history → generate a file in the background, send a link.

**Real-life:** delivering furniture in several trips instead of one overloaded van.

### API-60. What is schema validation?

Checking incoming data matches the expected shape **before** processing.

```js
const schema = z.object({ email: z.string().email(), age: z.number().min(18) });
const result = schema.safeParse(req.body);
if (!result.success) return res.status(400).json({ errors: result.error.issues });
```

**Real-life:** a bank checking your form before opening an account.

Tools: Zod, Joi, JSON Schema, OpenAPI validators.

### API-61. What is API-first?

Design the API **contract** (OpenAPI) **before** building frontend or backend.

**Real-life:** agreeing on the house blueprint before the builders and decorators start.

✅ Parallel development (frontend uses mocks), clear contract, fewer surprises.

---

## Part G — Docs, Testing & Monitoring

### API-62. Why is documentation important?

Explains endpoints, request/response shapes and errors → faster integrations, fewer questions.

**Real-life:** a furniture manual; without it, nobody assembles it correctly.

🎯 Good examples: Stripe and Google Maps docs.

### API-63. What is Swagger / OpenAPI?

**OpenAPI** = standard format to describe REST APIs. **Swagger UI** = interactive docs to try requests in the browser. It can also generate client SDKs and server stubs.

```yaml
paths:
  /users/{id}:
    get:
      responses:
        "200": { description: User found }
        "404": { description: Not found }
```

**Real-life:** a restaurant menu with photos and prices, where you can also place a test order.

### API-64. What is API testing?

Checking functionality, performance, security and reliability.

Tools: Postman, Swagger UI, Insomnia, SoapUI.

**Real-life:** test-driving a car before selling it.

### API-65. How do you automate API tests?

```js
// Jest + Supertest
test("GET /users returns 200", async () => {
  const res = await request(app).get("/api/users");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
});
```

| Type | Checks |
|---|---|
| Unit | one function |
| Integration | API + DB together |
| Load | performance (k6, JMeter, Artillery) |

Tools: Postman/Newman, Jest/Vitest + Supertest, Mocha, RestAssured.

### API-66. What is contract testing?

Ensures provider and consumer agree on the **same data contract**.

**Example:** frontend expects `email`; contract tests fail if the backend drops it.

**Real-life:** both sides sign the same agreement; any change must be re-signed.

Tool: Pact.

### API-67. What is API mocking?

Fake API responses so the frontend works before the backend is ready.

```bash
npx json-server db.json   # fake REST API from db.json on port 3000
```

**Real-life:** a mannequin used to design clothes before the model arrives.

Other tools: MSW (in the browser/tests), Postman mock servers.

### API-68. What is an API sandbox?

A safe test environment that mirrors production. Examples: PayPal Sandbox, Stripe Test Mode.

**Real-life:** a driving simulator: real controls, no real crashes.

### API-69. What is a schema registry?

A central store of API/event schemas that keeps data structures consistent across services and versions.

**Real-life:** a central dictionary everyone uses so words mean the same thing.

🎯 Common with Kafka (Confluent Schema Registry); it rejects incompatible schema changes.

### API-70. What do you monitor?

**Latency** (p95/p99, not just average), **error rate**, **traffic**, **availability**, saturation (CPU/memory).

Tools: Datadog, New Relic, Prometheus + Grafana, ELK.

**Real-life:** a car dashboard: speed, fuel, warning lights.

🎯 Averages hide slow users; watch **p95/p99**.

### API-71. What is distributed tracing?

Following **one request** across many services with a shared trace ID.

```text
Client → Gateway → Auth → Order → Payment   (one trace ID)
```

**Real-life:** a parcel tracking number showing every depot it passed through.

Tools: OpenTelemetry, Jaeger, Zipkin.

### API-72. What should an API log?

Timestamp, method + endpoint, status code, response time, user ID, request/trace ID, errors.

⚠️ **Never log** passwords, tokens, card numbers or personal data.

**Real-life:** a ship's logbook: what happened and when, not the passengers' bank details.

### API-73. What is API abuse and how do you prevent it?

Brute force, scraping, DDoS, excessive requests.

**Prevent:** rate limiting, authentication, CAPTCHA, bot detection, WAF, account lockouts, monitoring for unusual patterns.

**Real-life:** a shop with security guards, a cap on items per customer and CCTV.

---

## Part H — REST vs Others & Real-World Flow

### API-74. REST vs SOAP?

| | REST | SOAP |
|---|---|---|
| Type | architectural style | strict protocol |
| Format | usually JSON | XML only |
| Speed | light, fast | heavier |
| Contract | OpenAPI (optional) | WSDL (required) |
| Usage | modern web/mobile | legacy enterprise, banking |

**Real-life:** REST = a casual text message. SOAP = a formal stamped legal letter.

### API-75. What is SOAP?

**Simple Object Access Protocol**: XML-based messaging with strict rules and built-in standards (WS-Security). Still common in banking and enterprise systems.

### API-76. What is WSDL?

An XML file describing a SOAP service's operations, message formats and endpoints.

**Real-life:** WSDL = the contract; the SOAP service = the work done under it.

### API-77. What is GraphQL?

A query language where the client asks for **exactly the fields** it needs in **one request**.

```graphql
{ user(id: 1) { name email } }
```

| REST | GraphQL |
|---|---|
| many endpoints | one endpoint |
| over/under-fetching | exact data |
| easy HTTP caching | caching harder |

**Real-life:** REST = a fixed thali. GraphQL = ordering à la carte.

🎯 Also know **gRPC**: binary, fast, great for service-to-service calls.

### API-78. Walk me through a login API. ⭐

1. Client: `POST /api/v1/auth/login` with email + password over **HTTPS**.
2. Server **validates** input (Zod).
3. Finds user, compares password with **bcrypt**.
4. Wrong → `401` with a generic message ("Invalid email or password").
5. Right → issues a short-lived **access token** (+ refresh token in an HttpOnly cookie).
6. Client sends `Authorization: Bearer <token>` on future requests.
7. Around it all: **rate limiting** (brute force), logging (no passwords), error handling.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900,
  "user": { "id": 101, "name": "Mounika" }
}
```

**Real-life:** hotel check-in: show ID → reception checks the booking → you get a key card that expires at checkout.

🎯 Mention **generic error messages** (don't reveal whether the email exists).

---

## Part I — Revision

### API-79. Quick revision + where to learn more

| Topic | One line |
|---|---|
| REST | resources (nouns) + HTTP methods (verbs), stateless |
| Idempotent | GET, PUT, DELETE ✅; POST ❌; PATCH not guaranteed |
| PUT vs PATCH | replace whole vs update part |
| Path vs query | which resource vs filter/sort/page |
| 401 vs 403 | not logged in vs not allowed |
| AuthN vs AuthZ | who are you vs what can you do |
| JWT | `header.payload.signature`; payload readable, not encrypted |
| Access vs refresh | short-lived API pass vs long-lived renewal |
| CORS | browser rule; server sends allowed origins |
| Rate limit | cap per client → 429 |
| Pagination | offset (simple) vs cursor (scalable) |
| Versioning | `/api/v1`; never break old clients |
| Gateway | single entry: auth, routing, rate limit |
| Circuit breaker | stop calling a failing service, fallback |
| Retries | backoff + jitter + idempotency keys |
| Webhook | server pushes events to you |
| Queue | async processing, absorbs spikes |
| Errors | right status + stable error code, no stack traces |
| Docs | OpenAPI / Swagger |
| Monitoring | latency p95/p99, errors, traffic, tracing |
| REST vs SOAP vs GraphQL | JSON style vs XML protocol vs exact-field queries |

**Learn more:**

- [Postman Academy](https://academy.postman.com/): API basics and testing.
- [MDN: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP): methods, headers, status codes, CORS.
