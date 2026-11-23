
# System Design Interview Notes

> Question-wise system design notes for senior frontend / full-stack interviews.
> Each question: **short answer → real-life example → diagram/code → ⚠️ trade-off → 🎯 interview tip.**
> Covers **backend building blocks**, **classic designs**, and **frontend system design** (the round most senior frontend interviews include).

## Table of Contents

| Part | Topic | Questions |
|---|---|---|
| A | Fundamentals & How to Answer | SD-1 to SD-12 |
| B | Networking, Scaling & Load Balancing | SD-13 to SD-20 |
| C | Caching | SD-21 to SD-26 |
| D | Databases & Data | SD-27 to SD-38 |
| E | Async, Messaging & Reliability | SD-39 to SD-49 |
| F | Architecture, Security & Observability | SD-50 to SD-57 |
| G | Classic Backend Designs | SD-58 to SD-67 |
| H | Frontend System Design Concepts | SD-68 to SD-85 |
| I | Frontend Design Problems | SD-86 to SD-95 |
| J | Cheat Sheet & Numbers | SD-96 to SD-97 |

---

## Part A — Fundamentals & How to Answer

### SD-1. What is system design?

Planning the **components** of a system, how they **communicate**, and how they handle **scale, failures and change**.

**Real-life:** designing a restaurant: kitchen, counters, seating, staff, supply chain, and a plan for the Saturday-night rush.

🎯 There's no single right answer; interviewers grade your **reasoning and trade-offs**.

### SD-2. How do you structure a system design interview answer? ⭐

| Step | Time | What you do |
|---|---|---|
| 1. **Requirements** | 5 min | functional + non-functional, ask questions |
| 2. **Estimates** | 3 min | users, QPS, storage, bandwidth |
| 3. **API / interface** | 5 min | key endpoints or component APIs |
| 4. **High-level design** | 10 min | boxes and arrows |
| 5. **Deep dive** | 15 min | 1–2 hard parts (data model, scaling, real-time) |
| 6. **Trade-offs & wrap-up** | 5 min | bottlenecks, failures, monitoring, what's next |

**Real-life:** an architect asks about the family before drawing the house.

🎯 **Think out loud**, state assumptions, and check in with the interviewer.

### SD-3. Functional vs non-functional requirements?

| Functional (what it does) | Non-functional (how well) |
|---|---|
| post a tweet, follow users, see feed | latency < 200 ms, 99.99% uptime |
| upload a file, share a link | scale to 100M users, durability |
| | security, cost, consistency, accessibility |

**Real-life:** a car must drive (functional) and be safe, fast and fuel-efficient (non-functional).

### SD-4. How do you do back-of-the-envelope estimates?

Useful shortcuts:

- 1 day ≈ **86,400 s ≈ 10⁵ s**
- **1M requests/day ≈ 12 RPS**; peak ≈ 2–3× average
- 1 KB × 1M = 1 GB; 1 KB × 1B = 1 TB

**Example: a URL shortener, 100M new links/month**

```text
Writes: 100M / (30 × 10⁵ s) ≈ 40 writes/s
Reads (100:1):                ≈ 4,000 reads/s
Storage: 100M × 500 B × 12 × 5 years ≈ 3 TB
```

**Real-life:** estimating how many plates a wedding needs before buying them.

🎯 Round aggressively; the goal is **order of magnitude**, not precision.

### SD-5. Latency numbers every engineer should know?

| Operation | Approx. time |
|---|---|
| L1 cache reference | 0.5 ns |
| Main memory reference | 100 ns |
| Read 1 MB from memory | ~0.25 ms |
| SSD random read | ~0.1 ms |
| Read 1 MB from SSD | ~1 ms |
| Round trip within a data center | ~0.5 ms |
| Disk (HDD) seek | ~10 ms |
| Round trip across continents | ~150 ms |

**Real-life:** memory is your desk drawer, SSD is the next room, another continent is a flight away.

🎯 Lesson: **avoid network round trips and disk seeks**; cache in memory; batch requests.

### SD-6. Performance vs scalability?

- **Performance problem:** slow for **one** user.
- **Scalability problem:** fast for one, slow under **load**.

**Real-life:** a slow chef (performance) vs a great chef overwhelmed on a busy night (scalability).

### SD-7. Latency vs throughput?

- **Latency:** time for **one** request (ms).
- **Throughput:** requests handled **per second**.

**Real-life:** latency = how long one car takes on the motorway; throughput = cars passing per hour.

🎯 Aim for maximum throughput with **acceptable latency** (often measured as p95/p99).

### SD-8. What do "nines" of availability mean?

| Availability | Downtime / year | Downtime / month |
|---|---|---|
| 99% | 3.65 days | 7.3 h |
| 99.9% | 8.76 h | 43.8 min |
| 99.99% | 52.6 min | 4.4 min |
| 99.999% | 5.26 min | 26 s |

**Real-life:** a shop that's "open 99.9% of the time" is still closed for a working day each year.

⚠️ Components in **series** multiply: two 99.9% services in a chain ≈ 99.8%. In **parallel** (redundancy) availability goes up.

### SD-9. SLA vs SLO vs SLI?

| Term | Meaning | Example |
|---|---|---|
| **SLI** (indicator) | what you measure | p99 latency, error rate |
| **SLO** (objective) | your internal target | p99 < 300 ms, 99.95% success |
| **SLA** (agreement) | promise to customers, with penalties | 99.9% uptime or refunds |

**Real-life:** SLI = your speedometer; SLO = "I aim to drive at 60"; SLA = the speeding ticket if you break the law.

🎯 **Error budget** = 100% − SLO; spend it on releases, freeze when it's used up.

### SD-10. What is the CAP theorem? ⭐

During a **network partition (P)**, a distributed system must choose:

- **C**onsistency: everyone sees the latest data (or gets an error).
- **A**vailability: every request gets a response (maybe stale).

**Real-life:** two bank branches lose their phone line. Either stop withdrawals (C) or allow them and fix balances later (A).

| Choose | Examples |
|---|---|
| CP | banking, inventory, leader election (ZooKeeper, etcd) |
| AP | social feeds, likes, DNS, shopping carts (Cassandra, DynamoDB default) |

⚠️ Partitions **will** happen, so the real choice is C vs A **when they do**.

### SD-11. What is PACELC?

Extends CAP: if **P**artition → choose **A** or **C**; **E**lse (normal operation) → choose **L**atency or **C**onsistency.

**Real-life:** even when the phone line works, do you wait for both branches to confirm (consistent, slower) or answer immediately (fast, maybe stale)?

### SD-12. Consistency models?

| Model | Meaning | Example |
|---|---|---|
| **Strong** | reads always see the latest write | bank balance |
| **Eventual** | replicas converge "soon" | like counts, DNS |
| **Read-your-writes** | you see your own changes immediately | editing your profile |
| **Causal** | related events seen in order | comment replies after the comment |

**Real-life:** eventual = news spreading through a village; everyone hears it, just not at the same moment.

---

## Part B — Networking, Scaling & Load Balancing

### SD-13. What happens when you type a URL? ⭐

1. **DNS** resolves the domain to an IP (browser → OS → resolver caches).
2. **TCP** handshake (+ **TLS** handshake for HTTPS); HTTP/3 uses QUIC over UDP.
3. HTTP request → **CDN / load balancer** → server.
4. Server returns HTML.
5. Browser parses HTML → DOM, CSS → CSSOM, runs JS → render tree → layout → paint → composite.

**Real-life:** looking up a friend's address (DNS), driving there (TCP/TLS), knocking (request), and being handed a parcel (response) you then unpack (render).

### SD-14. What is DNS?

The internet's **phone book**: domain → IP. Cached at many levels with a **TTL**.

| Record | Purpose |
|---|---|
| A / AAAA | domain → IPv4 / IPv6 |
| CNAME | alias to another domain |
| MX | mail server |
| TXT | verification, SPF |

⚠️ Long TTLs make failover slow; short TTLs add lookups.

### SD-15. What is a CDN?

Servers worldwide that **cache content close to users** (images, JS, CSS, video, even HTML/API responses at the edge).

**Real-life:** a chain of local warehouses so parcels don't ship from one central depot.

| Push CDN | Pull CDN |
|---|---|
| you upload content in advance | CDN fetches from origin on first request |
| rarely changing, large files | most websites |

🎯 Use **hashed file names** (`app.3f9a.js`) + long cache headers; invalidate by changing the name.

### SD-16. Vertical vs horizontal scaling?

| Vertical (scale up) | Horizontal (scale out) |
|---|---|
| bigger machine | more machines |
| simple, no code change | needs load balancing, stateless services |
| hard ceiling, single point of failure | near-unlimited, fault tolerant |

**Real-life:** a bigger bus vs more buses.

🎯 Start vertical; go horizontal when needed. Keep app servers **stateless** (sessions in Redis/JWT) so any server can handle any request.

### SD-17. What is a load balancer?

Spreads traffic across servers, removes unhealthy ones (**health checks**).

**Real-life:** a supermarket manager sending customers to the shortest checkout queue.

| Algorithm | How |
|---|---|
| Round robin | next server in turn |
| Weighted round robin | bigger servers get more |
| Least connections | server with fewest active requests |
| IP hash / sticky sessions | same client → same server |

| L4 (transport) | L7 (application) |
|---|---|
| routes by IP/port | routes by URL, headers, cookies |
| faster, simpler | smarter (`/api` → API servers, `/images` → image servers) |

⚠️ The load balancer itself must be redundant (active-passive pair).

### SD-18. Reverse proxy vs load balancer vs API gateway?

| Component | Job |
|---|---|
| **Reverse proxy** (Nginx) | sits in front of servers: TLS termination, compression, caching, hides servers |
| **Load balancer** | distributes traffic across many servers |
| **API gateway** | single entry for microservices: auth, rate limiting, routing, request transformation |

**Real-life:** receptionist (reverse proxy), queue manager (load balancer), and a concierge who also checks IDs and sends you to the right department (API gateway).

### SD-19. Polling vs long polling vs SSE vs WebSockets?

| Method | How | Use |
|---|---|---|
| **Short polling** | client asks every N seconds | simple, low-frequency updates |
| **Long polling** | server holds the request until data arrives | fallback for real-time |
| **SSE** | server streams one-way over HTTP | notifications, live scores, **LLM streaming** |
| **WebSockets** | full two-way persistent connection | chat, multiplayer, collaboration |

**Real-life:** polling = asking "are we there yet?" every minute; long polling = asking once and waiting for the answer; SSE = a radio broadcast; WebSocket = a phone call.

⚠️ WebSockets need sticky connections or a pub/sub layer (Redis) so messages reach users on other servers.

### SD-20. HTTP/1.1 vs HTTP/2 vs HTTP/3?

| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | QUIC (UDP) |
| Requests per connection | one at a time | many (multiplexing) | many, no head-of-line blocking |
| Headers | text | compressed (HPACK) | compressed (QPACK) |

🎯 HTTP/2+ makes heavy bundling/domain sharding less important; HTTP/3 helps on lossy mobile networks.

---

## Part C — Caching

### SD-21. What is caching and where can it happen?

Storing frequently used data in a **faster** place to cut latency and load.

```text
Browser cache → CDN → Reverse proxy → App cache (Redis/Memcached) → DB cache → Database
```

**Real-life:** keeping milk in your fridge instead of going to the shop every time.

🎯 Best for **read-heavy**, rarely changing data.

### SD-22. Caching strategies?

| Strategy | How | Trade-off |
|---|---|---|
| **Cache-aside** (lazy) | app checks cache → miss → read DB → fill cache | most common; first read slow, can be stale |
| **Read-through** | cache loads from DB itself | simpler app code |
| **Write-through** | write to cache **and** DB together | consistent, slower writes |
| **Write-back** (write-behind) | write to cache, DB later | fast writes, **risk of data loss** |
| **Write-around** | write to DB only | avoids caching data never read |

```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);                    // hit
  const user = await db.users.findById(id);                 // miss
  await redis.set(`user:${id}`, JSON.stringify(user), "EX", 300); // TTL 5 min
  return user;
}
```

**Real-life:** cache-aside = checking your notebook first, and writing down the answer after looking it up.

### SD-23. Cache eviction policies?

| Policy | Removes |
|---|---|
| **LRU** | least recently used ✅ most common |
| **LFU** | least frequently used |
| **FIFO** | oldest added |
| **TTL** | after a time limit |

**Real-life:** LRU = a small desk where the book you haven't touched longest goes back to the shelf.

### SD-24. Why is cache invalidation hard?

When data changes, cached copies become **stale**.

**Options:** short TTLs, delete/update the key on write, versioned keys (`user:42:v7`), event-driven invalidation (publish "user updated").

**Real-life:** a printed menu that still shows yesterday's prices.

🎯 *"There are only two hard things in computer science: cache invalidation and naming things."*

### SD-25. What is a cache stampede (thundering herd)?

A popular key expires and **thousands** of requests hit the DB at once.

**Fixes:** request coalescing (one request refreshes, others wait), locks, early/background refresh, random TTL jitter, stale-while-revalidate.

**Real-life:** a shop opening its doors at a sale; everyone rushes the same shelf.

### SD-26. HTTP caching headers?

| Header | Meaning |
|---|---|
| `Cache-Control: max-age=31536000, immutable` | cache for a year (hashed assets) |
| `Cache-Control: no-cache` | store, but revalidate each time |
| `Cache-Control: no-store` | never store (sensitive data) |
| `ETag` / `If-None-Match` | unchanged → `304 Not Modified` |
| `stale-while-revalidate` | serve stale while fetching fresh in the background |

🎯 HTML: short or `no-cache`; hashed JS/CSS/images: long + `immutable`.

---

## Part D — Databases & Data

### SD-27. SQL vs NoSQL?

| SQL (relational) | NoSQL |
|---|---|
| tables, fixed schema, JOINs | documents, key-value, wide-column, graph |
| **ACID** transactions | often **BASE**, flexible schema |
| complex queries, relationships | huge scale, simple access patterns |
| PostgreSQL, MySQL | MongoDB, DynamoDB, Cassandra, Redis, Neo4j |

**Real-life:** SQL = a spreadsheet with strict columns; NoSQL = folders of flexible forms.

🎯 "Start with **Postgres** unless you have a clear reason (scale, schema flexibility, access pattern)."

### SD-28. Types of NoSQL?

| Type | Example | Use |
|---|---|---|
| Key-value | Redis, DynamoDB | cache, sessions, counters |
| Document | MongoDB | user profiles, catalogues |
| Wide-column | Cassandra, HBase | time series, huge write volume |
| Graph | Neo4j | social graphs, recommendations |
| Search | Elasticsearch, OpenSearch | full-text search, logs |
| Vector | pgvector, Pinecone | AI semantic search |

### SD-29. ACID vs BASE?

| ACID | BASE |
|---|---|
| **A**tomic, **C**onsistent, **I**solated, **D**urable | **B**asically **A**vailable, **S**oft state, **E**ventually consistent |
| correctness first | availability and scale first |

**Real-life:** ACID = a bank transfer (all or nothing). BASE = a social like counter that catches up.

### SD-30. What is indexing?

A data structure (usually a **B-tree**) that finds rows without scanning the whole table.

**Real-life:** the index at the back of a book.

| ✅ | ❌ |
|---|---|
| fast reads, sorts, joins | slower writes, more storage |

🎯 Index columns used in `WHERE`, `JOIN`, `ORDER BY`; check with `EXPLAIN`. Composite index order matters.

### SD-31. What is replication?

Copies of data on several servers.

| Type | How | Trade-off |
|---|---|---|
| **Leader-follower** (primary-replica) | writes to leader, reads from followers | read scaling; **replication lag** |
| **Multi-leader** | several nodes accept writes | write conflicts |
| **Leaderless** (quorum) | write/read to N nodes (W + R > N) | Cassandra, Dynamo-style |

**Real-life:** a head office (leader) and branch offices (followers) that receive copies of every update.

⚠️ Replication lag can break **read-your-writes** → read from the leader right after a write.

### SD-32. What is sharding (partitioning)?

Splitting data across databases by a **shard key**.

| Strategy | Example | Risk |
|---|---|---|
| Range | users A–M, N–Z | hot spots |
| Hash | `hash(userId) % N` | resharding is hard |
| Directory / lookup | table maps key → shard | lookup service |
| Geo | EU users in EU | |

**Real-life:** splitting a phone book into volumes A–F, G–M, N–Z.

⚠️ Cross-shard JOINs and transactions are hard; a **hot key** (celebrity user) can overload one shard.

### SD-33. What is consistent hashing?

Servers and keys placed on a **ring**; a key goes to the next server clockwise. Adding/removing a server moves only **~1/N** of keys (not all). **Virtual nodes** spread load evenly.

**Real-life:** seats around a round table: if one person leaves, only their neighbours' plates move.

🎯 Used in distributed caches, Cassandra, DynamoDB, CDNs.

### SD-34. Normalisation vs denormalisation?

| Normalised | Denormalised |
|---|---|
| no duplicate data, more JOINs | duplicated data, fewer JOINs |
| easy, consistent writes | fast reads, harder updates |

**Real-life:** keeping one master address list vs writing the address on every order slip.

🎯 Read-heavy systems (feeds) often denormalise.

### SD-35. How do you do transactions across services?

- **2PC (two-phase commit):** coordinator asks all to prepare, then commit. Strong but blocking, slow.
- **Saga:** a chain of local transactions, each with a **compensating action** on failure.

```text
Order created → Payment charged → Inventory reserved ✗ fails
              → refund payment → cancel order (compensations)
```

**Real-life:** booking a holiday: if the hotel fails, cancel the flight you already booked.

### SD-36. How do you generate unique IDs at scale?

| Method | ✅ | ❌ |
|---|---|---|
| DB auto-increment | simple, ordered | single point, guessable |
| UUID v4 | no coordination | 128-bit, random order (bad index locality) |
| UUID v7 / ULID | time-ordered, no coordination | larger than 64-bit |
| **Snowflake** (64-bit: timestamp + machine + sequence) | sortable, compact, distributed | needs machine IDs, clock care |

**Real-life:** ticket numbers stamped with the date, the counter number and a sequence.

### SD-37. What is a Bloom filter?

A tiny probabilistic structure: "**definitely not** present" or "**probably** present".

**Real-life:** a bouncer with a rough list: if you're not on it, you're definitely out; if you are, he double-checks.

🎯 Uses: avoid DB lookups for missing keys, "username taken?", crawler URL dedup.

### SD-38. Blob/object storage?

Store files (images, videos, backups) in **S3 / GCS / Azure Blob**, keep only the **URL/metadata** in the DB; serve through a CDN.

🎯 Clients upload directly with **pre-signed URLs** (server never handles the bytes).

---

## Part E — Async, Messaging & Reliability

### SD-39. What is a message queue?

Producers put messages on a queue; consumers process them **asynchronously**.

**Real-life:** a restaurant order rail: waiters pin orders, cooks take them when free.

✅ Decoupling, absorbs spikes, retries. Tools: **RabbitMQ, AWS SQS, BullMQ (Redis)**.

### SD-40. Queue vs pub/sub vs event streaming (Kafka)?

| | Queue | Pub/sub | Event log (Kafka) |
|---|---|---|---|
| Delivery | one consumer per message | all subscribers | consumers read at their own offset |
| Retention | deleted after processing | usually not kept | kept for days, **replayable** |
| Use | background jobs | notifications, fan-out | event sourcing, analytics, high throughput |

**Real-life:** queue = a single to-do ticket; pub/sub = a group announcement; Kafka = a newspaper archive anyone can read from any date.

### SD-41. Delivery guarantees?

| Guarantee | Risk |
|---|---|
| At-most-once | may lose messages |
| **At-least-once** (common) | **duplicates** → consumers must be idempotent |
| Exactly-once | hard and costly; usually "effectively once" via idempotency |

### SD-42. What is idempotency? ⭐

Doing the same operation many times has the **same effect** as once.

```http
POST /payments
Idempotency-Key: 7f3c-91ab
```

Server stores the key + result; a retry with the same key returns the stored result instead of charging again.

**Real-life:** pressing a lift button five times still calls one lift.

🎯 Essential for payments, retries and at-least-once queues.

### SD-43. Rate limiting algorithms?

| Algorithm | How | Note |
|---|---|---|
| **Token bucket** ✅ | tokens refill at a rate; each request uses one | allows bursts |
| Leaky bucket | requests leave at a constant rate | smooths traffic |
| Fixed window | N requests per minute window | burst at window edges |
| Sliding window log/counter | rolling window | accurate, more memory |

```js
class TokenBucket {
  constructor(capacity, refillPerSec) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillPerSec = refillPerSec;
    this.last = Date.now();
  }
  allow() {
    const now = Date.now();
    this.tokens = Math.min(this.capacity, this.tokens + ((now - this.last) / 1000) * this.refillPerSec);
    this.last = now;
    if (this.tokens >= 1) { this.tokens -= 1; return true; }
    return false; // → 429 Too Many Requests
  }
}
```

**Real-life:** a turnstile that lets a burst of people through, then one every few seconds.

🎯 In distributed systems, keep counters in **Redis** so all servers share the limit.

### SD-44. Retries, backoff and jitter?

Retry **transient** failures (timeouts, 503) with **exponential backoff + random jitter**, and a max retry count.

```text
wait = random(0, base × 2^attempt)   →  ~100ms, 200ms, 400ms, 800ms…
```

**Real-life:** if a friend doesn't answer, wait longer before each call, and don't all call at the same second.

⚠️ Only retry **idempotent** operations (or use idempotency keys).

### SD-45. Circuit breaker?

Stop calling a failing dependency for a while; fail fast with a fallback.

```text
Closed (normal) → too many failures → Open (fail fast) → cooldown → Half-open (test) → Closed
```

**Real-life:** a home fuse that trips to protect the whole house.

### SD-46. Timeouts and bulkheads?

- **Timeouts** on every network call (no infinite waits).
- **Bulkheads:** separate thread/connection pools per dependency so one slow service can't exhaust everything.

**Real-life:** a ship's watertight compartments: one leak doesn't sink the ship.

### SD-47. What is back pressure?

Signalling producers to **slow down** when consumers can't keep up (bounded queues, 429s, pausing streams).

**Real-life:** a kitchen telling waiters "stop taking orders for 5 minutes".

### SD-48. Event-driven architecture?

Services emit **events** ("OrderPlaced"); others react, without direct calls.

✅ Loose coupling, easy to add consumers. ❌ Harder debugging, eventual consistency.

**Real-life:** a fire alarm: everyone reacts, nobody calls each person.

### SD-49. CQRS and event sourcing?

- **CQRS:** separate **write** model from **read** model (optimised views).
- **Event sourcing:** store every change as an **event**; current state = replay of events.

**Real-life:** event sourcing = a bank statement (every transaction) rather than just the balance.

⚠️ Powerful but complex; use only when audit history or very different read/write needs justify it.

---

## Part F — Architecture, Security & Observability

### SD-50. Monolith vs microservices?

| Monolith | Microservices |
|---|---|
| one deployable | many small services |
| simple dev, testing, transactions | independent deploys and scaling |
| harder to scale teams | network calls, distributed data, ops overhead |

**Real-life:** one big restaurant kitchen vs a food court of independent stalls.

🎯 Start with a **modular monolith**; split when team size or scaling needs demand it.

### SD-51. Service discovery?

How services find each other's addresses as instances come and go: DNS, Consul, Kubernetes Services.

### SD-52. What is a BFF (Backend for Frontend)?

A backend layer **per client type** (web, mobile) that aggregates and shapes data for that UI.

**Real-life:** a personal shopper who collects exactly what you need from many shops.

🎯 Next.js Route Handlers / Server Components often act as a BFF.

### SD-53. Authentication & authorisation at scale?

- **AuthN:** sessions (cookie + server store) or **JWT** (stateless); **OAuth 2.0 / OIDC** for SSO and social login.
- **AuthZ:** RBAC (roles) or ABAC (attributes); enforce on the **server**.
- Short-lived access tokens + refresh tokens (HttpOnly cookie).

### SD-54. Security basics?

- HTTPS/TLS everywhere; HSTS.
- Input validation, parameterised queries.
- XSS (escape, CSP), CSRF (SameSite cookies, tokens).
- Secrets in a vault, least privilege, rate limiting, WAF, DDoS protection.
- Encrypt sensitive data at rest; audit logs.

### SD-55. Observability: logs, metrics, traces?

| Pillar | Answers | Tools |
|---|---|---|
| **Logs** | what happened? | ELK, Loki |
| **Metrics** | how much / how fast? | Prometheus + Grafana, Datadog |
| **Traces** | where did time go across services? | OpenTelemetry, Jaeger |

**Golden signals:** latency, traffic, errors, saturation.

**Real-life:** logs = diary, metrics = dashboard, traces = parcel tracking.

### SD-56. Deployment strategies?

| Strategy | How |
|---|---|
| Rolling | replace instances gradually |
| Blue-green | switch all traffic to the new copy; instant rollback |
| Canary | small % of users first |
| Feature flags | deploy dark, enable per user/segment |

### SD-57. Disaster recovery: RPO vs RTO?

- **RPO:** how much data you can afford to lose (time since last backup).
- **RTO:** how long until you're back up.

**Real-life:** RPO = how many pages of your essay are lost; RTO = how long until you can write again.

🎯 Multi-region replication, tested backups, runbooks.

---

## Part G — Classic Backend Designs

> For each: requirements → key components → the **one hard part** to deep-dive.

### SD-58. Design a URL shortener (bit.ly)?

**Requirements:** shorten URL, redirect fast, custom alias, expiry, analytics. Read-heavy (100:1).

```text
Client → LB → API → Cache (Redis) → DB (key → long URL)
                     ↘ Analytics queue → analytics store
```

- **Key generation:** base62 of a unique ID (Snowflake/counter ranges per server) → 7 chars = 62⁷ ≈ 3.5 trillion.
- **Redirect:** `301` (cached by browser, fewer hits) vs `302` (every click reaches you → analytics).
- Cache hot links; DB is key-value (DynamoDB/Cassandra) or Postgres.

**Real-life:** a coat-check ticket for a very long coat.

### SD-59. Design a rate limiter?

- Where: API gateway or middleware.
- Algorithm: **token bucket** (SD-43), counters in **Redis** (atomic `INCR` / Lua script).
- Key by user ID, API key or IP; different limits per plan.
- Return `429` + `Retry-After`; headers like `X-RateLimit-Remaining`.

### SD-60. Design a chat app (WhatsApp / Slack)?

```text
Clients ⇄ WebSocket gateway servers ⇄ Pub/Sub (Redis/Kafka) ⇄ Chat service → Messages DB (Cassandra)
                                                            → Push notifications (offline users)
```

- **WebSockets** for real-time; presence via heartbeats.
- Message IDs sortable (Snowflake) for ordering per conversation.
- Delivery states: sent ✓, delivered ✓✓, read.
- Offline users → store + push notification; sync on reconnect.
- Group chats → fan-out to members' connections.

**Deep-dive:** "how does a message reach a user connected to a different server?" → pub/sub by user/channel.

### SD-61. Design a news feed (Twitter / Instagram)?

| Fan-out on write (push) | Fan-out on read (pull) |
|---|---|
| on post, write to every follower's feed cache | build the feed when a user opens it |
| fast reads | slow reads, simple writes |
| bad for celebrities (millions of writes) | |

🎯 **Hybrid:** push for normal users, pull for celebrities, merge at read time. Cursor pagination, ranking service, media via CDN.

**Real-life:** push = delivering newspapers to every house; pull = everyone picks one up at the shop.

### SD-62. Design a notification system?

```text
Services → Notification API → Queue → Workers per channel (push/APNs/FCM, email, SMS, in-app)
                                    → User preferences + templates + rate limits
                                    → Delivery log, retries, dead-letter queue
```

- Idempotency to avoid duplicates; quiet hours; priority queues.

### SD-63. Design file storage (Dropbox / Google Drive)?

- Split files into **chunks** (e.g. 4 MB), hash each chunk → upload only **changed** chunks (dedup).
- Metadata DB (files, versions, chunk lists) + object storage (S3) for chunks.
- Sync service notifies other devices (long polling/WebSocket).
- Conflict handling: keep both versions ("conflicted copy").

**Real-life:** only re-sending the pages of a book that changed, not the whole book.

### SD-64. Design video streaming (YouTube / Netflix)?

- Upload → object storage → **transcoding** pipeline (multiple resolutions/codecs) → CDN.
- **Adaptive bitrate streaming** (HLS/DASH): video split into small segments; the player switches quality based on bandwidth.
- Metadata DB, recommendations, view counts (approximate, eventually consistent).

**Real-life:** a water tap that adjusts flow to the pipe's size.

### SD-65. Design search autocomplete (typeahead)?

- **Trie** of popular queries with top-K suggestions per prefix, precomputed offline from logs.
- Serve from memory/cache; shard by prefix.
- Client: **debounce**, cache prefixes, cancel stale requests (SD-86).

### SD-66. Design a payment system?

- **Idempotency keys** everywhere; double-entry **ledger** (append-only).
- Payment service ↔ external PSP (Stripe) with **webhooks** for async results; reconcile daily.
- Strong consistency (SQL, transactions); exactly-once effect; audit logs; PCI compliance (don't store card numbers; use tokens).

**Real-life:** a bank's accounting book where every entry has a matching opposite entry.

### SD-67. Design a ride-sharing service (Uber), briefly?

- Drivers send location every few seconds → **geo index** (geohash / quadtree / H3) in memory.
- Match rider → nearest available drivers; dispatch with timeouts.
- WebSockets for live tracking; surge pricing service; trips DB; payments.

---

## Part H — Frontend System Design Concepts

### SD-68. How do you approach a frontend system design round? (RADIO) ⭐

| Step | Covers |
|---|---|
| **R**equirements | features, users, devices, scale, offline, a11y, i18n, SEO |
| **A**rchitecture | components, rendering (CSR/SSR/SSG/RSC), routing, BFF |
| **D**ata model | entities, client vs server state, normalisation, caching |
| **I**nterface (API) | endpoints, pagination, real-time, error format; component props |
| **O**ptimisations | performance, a11y, security, testing, monitoring |

**Real-life:** RADIO = an architect's checklist: brief → floor plan → furniture list → doors/wiring → finishing touches.

🎯 Draw a **component tree** and a **data flow** diagram early.

### SD-69. Which rendering strategy?

| Strategy | Best for |
|---|---|
| **CSR** (SPA) | dashboards behind login |
| **SSR** | SEO + personalised pages |
| **SSG / ISR** | blogs, docs, marketing |
| **Streaming SSR / RSC** | data-heavy pages, less client JS |
| **Islands** (Astro) | mostly static with small interactive parts |

**Real-life:** CSR = ingredients delivered, you cook; SSR = a cooked meal per order; SSG = pre-packed meals.

### SD-70. How do you design state management?

| State | Tool |
|---|---|
| server/cache state | TanStack Query, SWR, RTK Query |
| URL state | search params (filters, page, tab) |
| local UI state | `useState` |
| global client state | Zustand / Redux Toolkit / Context |
| form state | React Hook Form |

🎯 "Most 'global state' is really server state; use a query cache, not Redux."

### SD-71. Normalising client data?

Store entities by ID (`{ users: { byId, allIds } }`) so updates happen in one place.

**Real-life:** one contact card per person, referenced from every group chat, instead of copies everywhere.

### SD-72. API design for the frontend?

- REST vs GraphQL (exact fields, one round trip) vs tRPC (TypeScript end-to-end).
- **BFF** to aggregate several services.
- **Cursor** pagination for feeds; consistent error format; versioning.
- Batch requests; avoid waterfalls (parallel fetching).

### SD-73. Pagination vs infinite scroll vs "load more"?

| Pagination | Infinite scroll | Load more |
|---|---|---|
| jump to page N, footer reachable | engaging feeds | user controls loading |
| SEO-friendly | hard to reach footer, needs virtualisation | balanced |

🎯 Infinite scroll: `IntersectionObserver` + **virtualised list** + keep scroll position on back navigation.

### SD-74. Real-time on the frontend?

WebSocket / SSE clients with **reconnect + exponential backoff**, heartbeats, message dedupe by ID, merge into the query cache, and fall back to polling.

### SD-75. Offline support / PWA?

- **Service worker** caches the app shell and assets (Workbox).
- Store data in **IndexedDB**; queue writes and sync when online (Background Sync).
- Show offline state; resolve conflicts on sync.

**Real-life:** writing emails on a plane; they send when you land.

### SD-76. Frontend caching layers?

HTTP cache → service worker cache → in-memory query cache (TanStack Query) → `localStorage`/IndexedDB → CDN.

⚠️ Decide **staleness** per data type (stock prices vs user profile).

### SD-77. Frontend performance strategy?

- **Measure:** Core Web Vitals (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1), RUM + Lighthouse.
- **Load less:** code splitting, tree shaking, lazy loading, smaller deps, performance budgets in CI.
- **Load smarter:** preload critical assets, prefetch next routes, CDN, HTTP/2+, Brotli.
- **Render less:** virtualisation, memoisation, transitions, web workers.
- **Images:** AVIF/WebP, `srcset`, dimensions set, lazy load below the fold, priority for hero.

### SD-78. Accessibility in system design?

Semantic HTML, keyboard support, focus management, ARIA patterns, contrast, reduced motion, screen-reader testing, automated checks (axe) in CI.

🎯 Mention it **unprompted**; senior candidates treat it as a requirement, not an extra.

### SD-79. Internationalisation (i18n)?

ICU messages, plurals, `Intl` for dates/numbers/currency, RTL with logical CSS properties, lazy-loaded locale bundles, locale in URL for SEO, text expansion (~30–40%).

### SD-80. Frontend security?

- **XSS:** escape output, avoid `innerHTML`/`dangerouslySetInnerHTML`, sanitise (DOMPurify), **CSP**.
- **CSRF:** SameSite cookies, CSRF tokens.
- Tokens in **HttpOnly** cookies; no secrets in the bundle.
- Subresource Integrity for CDN scripts; dependency audits.
- Clickjacking: `frame-ancestors` / `X-Frame-Options`.

### SD-81. Micro-frontends?

Split a large frontend into independently deployed apps (Module Federation, single-spa, iframes).

✅ Team autonomy, independent deploys. ❌ Duplicate dependencies, inconsistent UX, complexity.

**Real-life:** a food court: independent stalls, but customers want one consistent experience.

🎯 Prefer a **modular monolith** unless the organisation truly needs independent deployments.

### SD-82. Design systems & component libraries?

Tokens → accessible headless primitives → styled components → Storybook docs → visual regression tests → versioned package.

### SD-83. Monitoring the frontend?

Error tracking (Sentry) with source maps, RUM web-vitals, analytics events, session replay (with PII masking), alerts on error spikes after releases.

### SD-84. Feature flags & A/B testing?

Flags let you ship code dark, roll out by percentage, and kill bad features instantly; A/B tests compare variants with metrics.

⚠️ Avoid flicker (evaluate flags on the server/edge); clean up old flags.

### SD-85. Frontend CI/CD?

Lint → type-check → unit tests → build → bundle-size check → E2E on preview deploy → canary → production, with rollbacks and source maps uploaded.

---

## Part I — Frontend Design Problems

> Answer with RADIO (SD-68). Below: the **key points** interviewers look for.

### SD-86. Design an autocomplete / typeahead component?

- **Debounce** input (~300 ms); **cancel** stale requests (`AbortController`) or ignore out-of-order responses.
- Cache results per query (LRU in memory).
- Keyboard: ↑/↓, Enter, Esc; ARIA **combobox** pattern; highlight matches.
- Empty, loading, error, no-results states; min query length.

```js
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

let controller;
const search = debounce(async (q) => {
  controller?.abort();                    // cancel previous request
  controller = new AbortController();
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
  render(await res.json());
}, 300);
```

**Real-life:** a shop assistant who waits until you finish your sentence before fetching items.

### SD-87. Design a news feed UI?

- Cursor pagination + infinite scroll (`IntersectionObserver`).
- **Virtualised list** for thousands of posts; images lazy-loaded with fixed aspect ratios (no CLS).
- Optimistic likes/comments; real-time "new posts" banner instead of jumping content.
- Normalised cache (posts, users); restore scroll on back navigation.

### SD-88. Design a chat UI?

- WebSocket with reconnect/backoff; message states (sending, sent, failed + retry).
- Optimistic send with a temporary ID → replaced by server ID.
- Reverse infinite scroll for history; keep scroll anchored when loading older messages.
- Virtualisation, unread counts, typing indicators (throttled), offline queue.

### SD-89. Design a large data table / grid?

- Server-side pagination, sorting, filtering (state in URL).
- **Row + column virtualisation**; sticky headers; resizable columns.
- Keyboard navigation (grid ARIA pattern), selection, bulk actions.
- Export via background job for huge datasets.

### SD-90. Design a file uploader?

- Drag-and-drop + file input; validate type/size client- **and** server-side.
- Upload directly to storage with **pre-signed URLs**.
- Large files: **chunked/resumable** uploads, parallel chunks, retries per chunk, progress bar.
- Cancel/pause; previews via object URLs (revoke after use).

**Real-life:** moving house in several van trips; if one trip fails, you redo only that trip.

### SD-91. Design a collaborative editor (Google Docs)?

- Real-time sync over WebSocket.
- Conflict resolution: **OT** (Operational Transformation) or **CRDTs** (Yjs, Automerge).
- Presence (cursors, avatars), offline edits merged later, version history, permissions.

**Real-life:** several people editing the same paper with magic ink that merges everyone's changes.

### SD-92. Design an e-commerce product page?

- **SSR/SSG + ISR** for SEO; personalised parts (price, cart) streamed or client-fetched.
- Optimised images/gallery; structured data (JSON-LD); fast LCP.
- Cart: optimistic updates; inventory checked server-side at checkout.
- A/B tests, analytics, a11y, i18n/currency.

### SD-93. Design a notifications / toast system?

- Global store/queue; max visible toasts; auto-dismiss with pause on hover/focus.
- `aria-live="polite"` (or `assertive` for errors); keyboard-dismissable.
- Portal rendering; deduplicate repeated messages.

### SD-94. Design an image carousel?

- Lazy-load off-screen slides, preload the next one.
- Swipe + keyboard + buttons; pause autoplay on hover/focus; respect reduced motion.
- CSS scroll-snap for performance; ARIA carousel pattern; fixed dimensions (no CLS).

### SD-95. Design a dashboard with live widgets?

- Each widget fetches independently (Suspense boundaries / query keys); error boundary per widget.
- Polling or WebSocket per data type; pause updates when the tab is hidden (`visibilitychange`).
- Charts in web workers or canvas for big data; layout persisted per user.

---

## Part J — Cheat Sheet & Numbers

### SD-96. One-line answers

| Topic | One line |
|---|---|
| Interview structure | requirements → estimates → API → high-level → deep dive → trade-offs |
| CAP | during a partition: consistency or availability |
| Scale out | stateless servers + load balancer |
| Cache strategy | cache-aside + TTL; watch invalidation and stampedes |
| SQL vs NoSQL | relationships + ACID vs scale + flexible schema |
| Read scaling | replicas + cache |
| Write scaling | sharding (consistent hashing) |
| Unique IDs | Snowflake / UUID v7 |
| Async work | queues; at-least-once + idempotent consumers |
| Fan-out | queue = one consumer; pub/sub = many; Kafka = replayable log |
| Payments | idempotency keys + ledger + strong consistency |
| Rate limiting | token bucket in Redis, 429 + Retry-After |
| Resilience | timeouts, retries with backoff + jitter, circuit breakers, bulkheads |
| Real-time | WebSocket (two-way), SSE (one-way), polling (simple) |
| Feed | hybrid fan-out (push normal users, pull celebrities) |
| Files | chunked uploads to object storage via pre-signed URLs, CDN |
| Video | transcoding + adaptive bitrate (HLS/DASH) + CDN |
| Monolith vs micro | start modular monolith |
| Frontend framework | RADIO |
| Frontend perf | measure CWV, load less, render less, virtualise |
| Collaboration | CRDT / OT over WebSocket |

### SD-97. Numbers to remember

| Fact | Value |
|---|---|
| Seconds per day | ~86,400 ≈ 10⁵ |
| 1M requests/day | ≈ 12 RPS |
| Memory vs SSD vs network (cross-continent) | ~100 ns vs ~100 µs vs ~150 ms |
| 99.9% / 99.99% uptime | ~8.8 h / ~53 min downtime per year |
| Base62, 7 chars | ≈ 3.5 trillion combinations |
| Good LCP / INP / CLS | ≤ 2.5 s / ≤ 200 ms / ≤ 0.1 |
| Snowflake ID | 64 bits: 41 timestamp, 10 machine, 12 sequence |

> **Practice:** pick one design per day, set a 45-minute timer, and talk through RADIO (frontend) or the 6-step structure (backend) out loud.
