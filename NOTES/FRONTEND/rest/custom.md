# REST API Notes

Condensed from "API Interview Questions (100)" (restapi.pdf) + tooling notes. Grouped by topic, not by original Q number.

## Tools & Resources

```
npm install -f json-server
json-server --watch db.json
```
Spins up a fake REST API from a `db.json` file — good for API mocking (frontend can build against endpoints before backend is ready).

- More on APIs: https://academy.postman.com/
- Extracting markdown blocks from LLM responses (Python): https://medium.com/@chigwel/extract-markdown-blocks-in-python-from-any-large-language-models-response-using-mdextractor-e6bdf3957370

## API Fundamentals

- **API** — rules/protocol for software to talk to software. Ex: weather app calling a weather API.
- **REST API** — architectural style using HTTP methods on resources (URLs = nouns, not verbs). Ex: `GET /restaurants`, `POST /orders`.
- **RESTful API** — an API that actually follows REST principles (statelessness, cacheable, proper method use, uniform interface).
- **Statelessness** — server keeps no memory of previous requests; each request carries all info needed (e.g. token) on its own.
- **REST constraints** — Client-Server, Stateless, Cacheable, Uniform Interface, Layered System. Ex: React → Node API → DB, each layer independent.
- **CRUD** — Create/Read/Update/Delete → POST/GET/PUT/DELETE.
- **Endpoint** — a specific URL that exposes a resource, e.g. `GET /api/accounts/{id}`.
- **Idempotency** — repeating the same request produces the same result (no extra side effects). Payments use an idempotency-key so a retried request isn't double-charged.

| Method | Purpose | Idempotent? |
|---|---|---|
| GET | Retrieve | Yes |
| POST | Create | No (creates a new resource every call) |
| PUT | Replace/update | Yes |
| PATCH | Partial update | No (usually) |
| DELETE | Remove | Yes |

## Request & Response

- **Request vs Response** — request = what client sends (method, URL, headers, body); response = status code + body the server returns.
- **Payload** — the actual data in the request/response body (JSON usually).
- **Headers** — metadata about the request/response, not the data itself. Used for auth, content type, caching, client info.

| Header | Meaning |
|---|---|
| `Content-Type` | Format of the data being **sent** (e.g. `application/json`, `multipart/form-data` for uploads). Wrong/missing value can break the request. |
| `Accept` | Format the client **wants back** (`application/json` vs `text/html`). |
| `Authorization` | Credentials — `Bearer <token>`, `Basic base64(user:pass)`. |

Query vs Path parameters:

| | Path param | Query param |
|---|---|---|
| Purpose | Identify a specific resource | Filter/sort/search/paginate |
| Mandatory | Yes | No |
| Position | In the URL path | After `?` |
| Example | `/users/25` | `/users?role=admin&page=2` |

Combined: `GET /api/users/10?active=true`

Status codes:

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |

## Authentication & Security

- **Authentication vs Authorization** — Authentication = "who are you" (login). Authorization = "what are you allowed to do" (permissions after login). Ex: HR Manager can view payroll, Intern gets 403.

Auth methods:

| Method | How | Typical use |
|---|---|---|
| API Key | `?api_key=abc123` | Public APIs (maps, weather) |
| JWT | `Authorization: Bearer <token>` | Login-based apps, stateless auth |
| OAuth | "Login with Google" | Third-party access without sharing password |
| Basic Auth | `Authorization: Basic base64(user:pass)` | Internal/legacy systems |

- **JWT** — compact, URL-safe token; stateless so no server-side session storage needed (scales well in microservices).
  - Structure: `Header.Payload.Signature` — header = algorithm/type, payload = claims (userId, role, exp), signature = integrity check.
  - Flow: login → server validates → issues JWT → client stores it (localStorage/cookie) → sent on every request → server verifies.
- **Bearer token** — an access token sent in headers; whoever "bears" it can access the resource, so it must be protected.
- **Refresh token** — long-lived token (e.g. 7 days) used to get a new short-lived access token (e.g. 15 min) without re-login.
- **OAuth** — lets a third-party app get limited access to your data without ever seeing your password (provider issues an access token instead).
- **CORS** — server-side header (`Access-Control-Allow-Origin`) telling browsers which origins may call it. Browser-side security feature, not backend logic.
- **Same-origin policy** — browser blocks a page from reading data from a different origin (protocol+domain+port) unless CORS allows it.
- **Rate limiting** — caps requests per client per time window (e.g. 100/min) to stop abuse/DDoS; over the limit → `429`.
- **API security checklist** — HTTPS (TLS), auth (JWT/OAuth/keys), role-based authorization, input validation, rate limiting, firewall/WAF. Ex (banking app): HTTPS encrypts transactions, JWT validates user, rate limiting blocks brute force, validation blocks SQL injection.
- **SQL injection prevention** — input validation, prepared statements, ORM, escaping inputs. Never string-concat user input into a query (`"...WHERE id=" + userInput` is the textbook bad example).
- **File upload** — use `Content-Type: multipart/form-data`. Ex: profile picture upload.

## Data Shaping

- **Pagination** — split large results into pages. `GET /posts?page=2&limit=20`. Alt approaches: offset-based, cursor-based (better for large/changing datasets).
- **Filtering** — `GET /orders?status=delivered&payment=completed`.
- **Sorting** — `GET /products?sort=price&order=asc`.
- **Versioning** — keep multiple API versions (`/api/v1/users` vs `/api/v2/users`) so changing a response shape doesn't break old clients.
- **HATEOAS** — response includes links to related actions, so client discovers next steps from the API itself:
```json
"links": {
  "track": "/orders/123/track",
  "cancel": "/orders/123/cancel"
}
```
- **API schema evolution / backward compatibility** — don't remove existing fields, add new fields as optional, version when breaking, publish a deprecation policy.

## Architecture & Scalability

- **API Gateway** — single entry point in front of multiple backend services; handles auth, rate limiting, routing, logging. Flow: Client → Gateway → microservice.
- **Microservices** — app split into small independent services each with its own API (e.g. User/Order/Payment/Inventory services in e-commerce).
- **Caching** — store frequently-requested data temporarily to cut latency/server load (e.g. weather app: first call slow, repeat calls fast).
- **Load balancing** — spreads incoming requests across multiple servers (e.g. Netflix traffic).
- **API throttling** — temporarily slows/limits requests when server load is high (e.g. Amazon during a flash sale), vs rate limiting which is a per-client cap.
- **Retry mechanism** — auto-retries a failed request (e.g. network blip while placing an order); combine with idempotency keys to avoid duplicates.
- **Circuit breaker** — stops calling a failing downstream service for a while (fallback instead), so one broken service doesn't collapse the whole system.
- **Duplicate request prevention** — idempotency keys, request hashing, unique transaction IDs (e.g. prevent double-payment on double-click "Pay").
- **Event-driven API** — communication triggered by events (order placed, user registered) instead of direct request/response; common in microservices.
- **Webhook** — server pushes data to another system when an event happens (opposite of an API, where the client pulls). Ex: Stripe sends a webhook on payment success/failure/refund, your server updates order status.
- **Message queue** — stores messages for async processing; improves scalability, prevents blocking, absorbs traffic spikes (e.g. Amazon order processing). Tools: RabbitMQ, Kafka, AWS SQS, Redis Queue.

| Sync | Async |
|---|---|
| Client waits | Client continues |
| Blocking | Non-blocking |
| Slower for heavy tasks | Better for scalability |
| Ex: fetch user profile | Ex: send email, generate report |

- **Concurrency handling** — async processing, thread pools, queues, locks, optimistic concurrency control (e.g. two users booking the same train seat).
- **Blue-green deployment** — run old (blue) and new (green) versions side by side, switch traffic to green after testing → zero downtime.
- **Canary release** — roll new version out to a small % of users first, to catch bugs before full rollout.

## API Design & Error Handling

- **Designing a REST API** — use nouns not verbs, correct HTTP methods, versioning, proper status codes, consistent naming, pagination/filtering, security.
  - Good: `GET /users`, `POST /users`, `GET /users/{id}`. Bad: `/getUsers`, `/createUser`.
- **Error handling** — return proper status codes + clear messages, log errors server-side, never leak internal stack traces.
```json
{ "error": "Invalid credentials", "code": 401 }
```
- **Centralized error handling** — all errors handled in one place (middleware/global handler) → cleaner code, consistent responses, easier debugging (e.g. Express error middleware, Spring Boot global exception handler).
- **Middleware** — code that runs between request and response (auth, logging, validation, rate limiting). Flow: `Request → Middleware → Controller → Response`.
- **API timeout** — max time a client waits before giving up (e.g. payment API times out after 30s).
- **Handling large responses** — pagination, streaming, gzip compression, caching, lazy loading (e.g. downloading a bank's transaction history).
- **API schema validation** — verifies incoming requests match the expected shape before processing; prevents invalid data/crashes. Tools: Joi, Zod, JSON Schema, OpenAPI validation.
- **API-first approach** — design the API contract before building frontend/backend → better collaboration, parallel development, clear contracts.

## Docs, Testing & Monitoring

- **API documentation** — explains endpoints, request/response shapes, errors (e.g. Stripe, Google Maps docs) → less integration confusion.
- **Swagger / OpenAPI spec** — standard format to describe REST APIs; enables interactive docs (Swagger UI), request testing without Postman, and client SDK generation. Used by Stripe, GitHub, PayPal.
- **API testing** — verifying functionality, performance, security, reliability (e.g. a payment API). Tools: Postman, Swagger/OpenAPI, SoapUI.
- **Automated API testing** — Postman/Newman, Jest, Mocha, RestAssured; test types: unit, integration, load.
- **Contract testing** — ensures provider and consumer agree on the same data contract (e.g. frontend expects an `email` field — backend must not silently drop it).
- **API mocking** — simulate responses without a real backend, so frontend can build before backend is ready (this is exactly what `json-server` above is for).
- **API sandbox** — a safe test environment mirroring production (e.g. PayPal Sandbox, Stripe Test Mode).
- **Schema registry** — central repository of API/event schemas, keeps data structures consistent across microservices/event-driven systems.
- **API monitoring** — tracks response time, error rate, traffic volume, availability. Tools: New Relic, Datadog, Prometheus, Grafana, ELK stack.
- **Distributed tracing** — follows one request across multiple services (`Client → Gateway → Auth → Order → Payment`) — key for debugging microservices.
- **Logging** — capture timestamp, endpoint, status code, response time, user ID, errors — for debugging, auditing, monitoring.
- **API abuse & prevention** — brute force, scraping, DDoS, excessive requests → mitigated with rate limiting, CAPTCHA, authentication.

## REST vs Other Styles

| Feature | REST | SOAP |
|---|---|---|
| Protocol | HTTP | XML-based |
| Format | JSON | XML |
| Speed | Fast | Slower |
| Complexity | Simple | Complex |
| Usage | Modern web apps | Legacy/enterprise (banking) systems |

- **SOAP** — Simple Object Access Protocol, XML messaging, still common in banking/enterprise legacy systems.
- **WSDL** — describes a SOAP service's structure/operations/endpoints. Analogy: WSDL = contract, API = implementation.
- **GraphQL** — query language where the client asks for exactly the fields it needs (fixes REST's over-fetching/under-fetching).
```graphql
{ user(id: 1) { name email } }
```
  REST issue: over/under-fetching → GraphQL solution: precise, single-request data fetching.

## Real-World Flow: Login API

`POST /login` → validate input → authenticate user → generate JWT → return token → client stores + resends on future requests → secure storage, error handling, logging, rate limiting all wired in.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900,
  "user": { "id": 101, "name": "Mounika" }
}
```
