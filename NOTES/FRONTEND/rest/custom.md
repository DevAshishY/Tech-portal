# REST API Interview Questions

Oct 14, 2026 · @ashish yadav

Every topic from your notes as a question with a short answer and example.

## Section 1: API fundamentals

### Q1. What is an API?

A set of rules that lets one piece of software talk to another. Example: a weather app calls a weather API to get today's forecast.

### Q2. What is a REST API?

An architectural style that uses HTTP methods on resources. URLs are nouns, not verbs. Example: `GET /restaurants`, `POST /orders`.

### Q3. What is the difference between REST and RESTful?

REST is the style. A RESTful API is one that actually follows its principles: stateless, cacheable, correct use of HTTP methods and a uniform interface.

### Q4. What does stateless mean?

The server remembers nothing about previous requests. Each request carries everything it needs on its own, such as the auth token.

### Q5. What are the REST constraints?

Client-Server, Stateless, Cacheable, Uniform Interface and Layered System. Example: React frontend → Node API → database, each layer independent.

### Q6. What is CRUD and how does it map to HTTP?

Create, Read, Update, Delete → POST, GET, PUT, DELETE.

### Q7. What is an endpoint?

A specific URL that exposes a resource. Example: `GET /api/accounts/{id}`.

### Q8. What is idempotency?

Sending the same request many times gives the same result with no extra side effects. Payment APIs use an idempotency key so a retried request is not charged twice.

### Q9. Which HTTP methods are idempotent?

| Method | Purpose | Idempotent? |
| --- | --- | --- |
| GET | Retrieve | Yes |
| POST | Create | No (creates a new resource every call) |
| PUT | Replace / update | Yes |
| PATCH | Partial update | Not guaranteed (usually no) |
| DELETE | Remove | Yes |

### Q10. PUT vs PATCH?

PUT replaces the whole resource and is idempotent. PATCH changes only some fields and is not guaranteed to be idempotent.

## Section 2: Request and response

### Q11. What is the difference between a request and a response?

The request is what the client sends: method, URL, headers and body. The response is what the server returns: a status code, headers and body.

### Q12. What is a payload?

The actual data in the request or response body, usually JSON.

### Q13. What are headers?

Metadata about the request or response, not the data itself. Used for auth, content type, caching and client info.

### Q14. What do Content-Type, Accept and Authorization mean?

| Header | Meaning |
| --- | --- |
| `Content-Type` | Format of the data being **sent**, e.g. `application/json`, or `multipart/form-data` for uploads. A wrong value can break the request |
| `Accept` | Format the client **wants back**, e.g. `application/json` vs `text/html` |
| `Authorization` | Credentials: `Bearer <token>` or `Basic base64(user:pass)` |

### Q15. Path parameter vs query parameter?

|  | Path param | Query param |
| --- | --- | --- |
| Purpose | Identify a specific resource | Filter, sort, search, paginate |
| Mandatory | Yes | No |
| Position | In the URL path | After `?` |
| Example | `/users/25` | `/users?role=admin&page=2` |

Combined: `GET /api/users/10?active=true`.

### Q16. What are the common HTTP status codes?

| Code | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized (not logged in / bad credentials) |
| 403 | Forbidden (logged in, but no permission) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |

### Q17. 401 vs 403?

401 means the server doesn't know who you are (missing or invalid credentials). 403 means it knows who you are, but you are not allowed to do this. Example: an intern trying to view payroll gets 403.

## Section 3: Authentication and security

### Q18. Authentication vs authorization?

Authentication = "who are you?" (login). Authorization = "what are you allowed to do?" (permissions after login). Example: an HR manager can view payroll; an intern gets 403.

### Q19. What are the common API auth methods?

| Method | How | Typical use |
| --- | --- | --- |
| API Key | `?api_key=abc123` or a header | Public APIs (maps, weather) |
| JWT | `Authorization: Bearer <token>` | Login-based apps, stateless auth |
| OAuth | "Login with Google" | Third-party access without sharing a password |
| Basic Auth | `Authorization: Basic base64(user:pass)` | Internal or legacy systems |

### Q20. What is a JWT and why use it?

A compact, URL-safe token. It is stateless, so the server needs no session storage, which scales well in microservices.

### Q21. What is the structure of a JWT?

`Header.Payload.Signature`. Header = algorithm and type. Payload = claims (userId, role, exp). Signature = integrity check so nobody can tamper with it.

### Q22. How does JWT authentication work?

1. User logs in.
2. Server validates the credentials.
3. Server issues a JWT.
4. Client stores it (localStorage or cookie).
5. Client sends it on every request.
6. Server verifies the signature each time.

### Q23. What is a bearer token?

An access token sent in the `Authorization` header. Whoever "bears" it gets access, so it must be protected.

### Q24. What is a refresh token?

A long-lived token (e.g. 7 days) used to get a new short-lived access token (e.g. 15 minutes) without logging in again.

### Q25. What is OAuth?

A way for a third-party app to get limited access to your data without seeing your password. The provider (e.g. Google) issues an access token instead.

### Q26. What is CORS?

A server response header (`Access-Control-Allow-Origin`) that tells the browser which origins may call the API. It is a browser security feature, not backend business logic.

### Q27. What is the same-origin policy?

The browser blocks a page from reading data from a different origin (protocol + domain + port) unless CORS allows it.

### Q28. What is rate limiting?

A cap on requests per client per time window (e.g. 100 per minute) to stop abuse and DDoS. Over the limit, the API returns `429`.

### Q29. How do you secure an API?

HTTPS (TLS), authentication (JWT, OAuth, keys), role-based authorization, input validation, rate limiting, and a firewall/WAF. Example (banking app): HTTPS encrypts transactions, JWT validates the user, rate limiting blocks brute force, and validation blocks SQL injection.

### Q30. How do you prevent SQL injection?

Validate input, use prepared statements or an ORM, and escape inputs. Never concatenate user input into a query: `"...WHERE id=" + userInput` is the classic bad example.

### Q31. How do you handle file uploads in an API?

Send the file with `Content-Type: multipart/form-data`. Example: a profile picture upload.

## Section 4: Data shaping

### Q32. What is pagination?

Splitting large results into pages. Example: `GET /posts?page=2&limit=20`.

### Q33. Offset-based vs cursor-based pagination?

Offset (`page`, `limit`) is simple but slow and can skip or repeat items when data changes. Cursor-based ("give me items after this ID") is better for large or fast-changing datasets.

### Q34. How do you filter results?

With query parameters. Example: `GET /orders?status=delivered&payment=completed`.

### Q35. How do you sort results?

With query parameters. Example: `GET /products?sort=price&order=asc`.

### Q36. What is API versioning and why is it needed?

Keeping multiple versions alive, like `/api/v1/users` and `/api/v2/users`, so changing a response shape doesn't break old clients.

### Q37. What is HATEOAS?

The response includes links to related actions, so the client discovers next steps from the API itself.

```json
"links": {
  "track": "/orders/123/track",
  "cancel": "/orders/123/cancel"
}
```

### Q38. How do you keep an API backward compatible?

Never remove existing fields, add new fields as optional, create a new version for breaking changes, and publish a deprecation policy.

## Section 5: Architecture and scalability

### Q39. What is an API Gateway?

A single entry point in front of many backend services. It handles auth, rate limiting, routing and logging. Flow: Client → Gateway → microservice.

### Q40. What are microservices?

An app split into small independent services, each with its own API. Example (e-commerce): User, Order, Payment and Inventory services.

### Q41. What is caching and why use it?

Storing frequently requested data temporarily to cut latency and server load. Example: a weather app's first call is slow; repeat calls are fast.

### Q42. What is load balancing?

Spreading incoming requests across multiple servers so no single server is overloaded. Example: Netflix traffic.

### Q43. Throttling vs rate limiting?

Rate limiting is a fixed cap per client. Throttling temporarily slows or limits requests when overall server load is high. Example: Amazon during a flash sale.

### Q44. What is a retry mechanism?

Automatically retrying a failed request, e.g. after a network blip while placing an order. Combine it with idempotency keys so retries don't create duplicates.

### Q45. What is a circuit breaker?

It stops calling a failing downstream service for a while and returns a fallback instead, so one broken service doesn't bring down the whole system.

### Q46. How do you prevent duplicate requests?

Idempotency keys, request hashing and unique transaction IDs. Example: stopping a double payment when a user double-clicks "Pay".

### Q47. What is an event-driven API?

Communication triggered by events (order placed, user registered) instead of direct request/response. Common in microservices.

### Q48. What is a webhook, and how is it different from a normal API call?

With a normal API the client *pulls* data. With a webhook the server *pushes* data to your URL when an event happens. Example: Stripe sends a webhook on payment success, failure or refund, and your server updates the order status.

### Q49. What is a message queue?

A store of messages for async processing. It improves scalability, avoids blocking and absorbs traffic spikes. Example: Amazon order processing. Tools: RabbitMQ, Kafka, AWS SQS, Redis Queue.

### Q50. Synchronous vs asynchronous APIs?

| Sync | Async |
| --- | --- |
| Client waits | Client continues |
| Blocking | Non-blocking |
| Slower for heavy tasks | Better for scalability |
| Ex: fetch user profile | Ex: send email, generate report |

### Q51. How do you handle concurrency?

Async processing, thread pools, queues, locks and optimistic concurrency control. Example: two users trying to book the same train seat.

### Q52. What is blue-green deployment?

Run the old (blue) and new (green) versions side by side, then switch traffic to green after testing. Result: zero downtime and easy rollback.

### Q53. What is a canary release?

Roll out the new version to a small percentage of users first, to catch bugs before everyone gets it.

## Section 6: API design and error handling

### Q54. How do you design a good REST API?

Use nouns not verbs, the correct HTTP methods, versioning, proper status codes, consistent naming, pagination and filtering, and security.

- Good: `GET /users`, `POST /users`, `GET /users/{id}`
- Bad: `/getUsers`, `/createUser`

### Q55. How do you handle errors in an API?

Return the right status code with a clear message, log the error on the server, and never leak internal stack traces.

```json
{ "error": "Invalid credentials", "code": 401 }
```

### Q56. What is centralized error handling?

Handling all errors in one place, such as a middleware or global handler. Benefits: cleaner code, consistent responses and easier debugging. Examples: Express error middleware, Spring Boot global exception handler.

### Q57. What is middleware?

Code that runs between the request and the response: auth, logging, validation, rate limiting. Flow: `Request → Middleware → Controller → Response`.

### Q58. What is an API timeout?

The maximum time a client waits before giving up. Example: a payment API times out after 30 seconds.

### Q59. How do you handle large responses?

Pagination, streaming, gzip compression, caching and lazy loading. Example: downloading a bank's full transaction history.

### Q60. What is API schema validation?

Checking that an incoming request matches the expected shape before processing it, to stop invalid data and crashes. Tools: Joi, Zod, JSON Schema, OpenAPI validation.

### Q61. What is the API-first approach?

Designing the API contract before building the frontend or backend. Benefits: better collaboration, parallel development and a clear contract.

## Section 7: Docs, testing and monitoring

### Q62. Why is API documentation important?

It explains endpoints, request and response shapes, and errors, so integrations go faster with less confusion. Good examples: Stripe and Google Maps docs.

### Q63. What is Swagger / OpenAPI?

A standard format to describe REST APIs. It gives interactive docs (Swagger UI), lets you test requests without Postman, and can generate client SDKs. Used by Stripe, GitHub and PayPal.

### Q64. What is API testing?

Checking an API's functionality, performance, security and reliability, e.g. for a payment API. Tools: Postman, Swagger/OpenAPI, SoapUI.

### Q65. How do you automate API testing?

Tools: Postman/Newman, Jest, Mocha, RestAssured. Test types: unit, integration and load tests.

### Q66. What is contract testing?

Making sure the provider and consumer agree on the same data contract. Example: the frontend expects an `email` field, so the backend must not silently drop it.

### Q67. What is API mocking?

Simulating API responses without a real backend, so the frontend can be built before the backend is ready. Example with json-server:

```bash
npm install -f json-server
json-server --watch db.json
```

This spins up a fake REST API from a `db.json` file.

### Q68. What is an API sandbox?

A safe test environment that mirrors production. Examples: PayPal Sandbox, Stripe Test Mode.

### Q69. What is a schema registry?

A central store of API and event schemas that keeps data structures consistent across microservices and event-driven systems.

### Q70. What do you monitor in an API?

Response time, error rate, traffic volume and availability. Tools: New Relic, Datadog, Prometheus, Grafana, ELK stack.

### Q71. What is distributed tracing?

Following one request across many services, e.g. `Client → Gateway → Auth → Order → Payment`. It is key for debugging microservices.

### Q72. What should an API log?

Timestamp, endpoint, status code, response time, user ID and errors. Used for debugging, auditing and monitoring.

### Q73. What is API abuse and how do you prevent it?

Abuse includes brute force, scraping, DDoS and excessive requests. Prevent it with rate limiting, CAPTCHA and authentication.

## Section 8: REST vs other styles, real-world flow and resources

### Q74. REST vs SOAP?

| Feature | REST | SOAP |
| --- | --- | --- |
| Type | Architectural style over HTTP | Strict XML messaging protocol |
| Format | Usually JSON | XML only |
| Speed | Fast, lightweight | Slower, heavier |
| Complexity | Simple | Complex |
| Usage | Modern web and mobile apps | Legacy / enterprise systems (banking) |

### Q75. What is SOAP?

Simple Object Access Protocol: XML-based messaging, still common in banking and enterprise legacy systems.

### Q76. What is WSDL?

A file that describes a SOAP service's operations, structure and endpoints. Analogy: WSDL is the contract, the API is the implementation.

### Q77. What is GraphQL and what problem does it solve?

A query language where the client asks for exactly the fields it needs, in one request. It fixes REST's over-fetching (too much data) and under-fetching (needing many calls).

```graphql
{ user(id: 1) { name email } }
```

### Q78. Walk me through a login API.

1. Client calls `POST /login`.
2. Server validates the input.
3. Server authenticates the user.
4. Server generates a JWT and returns it.
5. Client stores the token and sends it on future requests.
6. Around all of this: secure storage, error handling, logging and rate limiting.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900,
  "user": { "id": 101, "name": "Mounika" }
}
```

### Q79. Where can I learn more?

- [Postman Academy](https://academy.postman.com/) for API basics and testing.
- [Extracting markdown blocks from LLM responses in Python](https://medium.com/@chigwel/extract-markdown-blocks-in-python-from-any-large-language-models-response-using-mdextractor-e6bdf3957370)
