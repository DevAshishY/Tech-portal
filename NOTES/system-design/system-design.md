
##  System Design

System design is the process of defining the elements of a system, as well as their interactions and relationships, in order to satisfy a set of specified requirements.

It involves taking a problem statement, breaking it down into smaller components and designing each component to work together effectively to achieve the overall goal of the system. This process typically includes analyzing the current system (if any) and determining any deficiencies, creating a detailed plan for the new system, and testing the design to ensure that it meets the requirements. It is an iterative process that may involve multiple rounds of design, testing, and refinement.

In software engineering, system design is a phase in the software development process that focuses on the high-level design of a software system, including the architecture and components.

## How To: System Design? 

**Understand the problem:** Gather information about the problem you are trying to solve and the requirements of the system. Identify the users and their needs, as well as any constraints or limitations of the system.
**Identify the scope of the system:** Define the boundaries of the system, including what the system will do and what it will not do.
**Research and analyze existing systems:** Look at similar systems that have been built in the past and identify what worked well and what didn't. Use this information to inform your design decisions.
**Create a high-level design:** Outline the main components of the system and how they will interact with each other. This can include a rough diagram of the system's architecture, or a flowchart outlining the process the system will follow.
**Refine the design:** As you work on the details of the design, iterate and refine it until you have a complete and detailed design that meets all the requirements.
**Document the design:** Create detailed documentation of your design for future reference and maintenance.
Continuously monitor and improve the system: The system design is not a one-time process, it needs to be continuously monitored and improved to meet the changing requirements.



## Performance vs Scalability

If you have a performance problem, your system is slow for a single user.

If you have a scalability problem, your system is fast for a single user but slow under heavy load.


## Latency vs Throughput

Latency is the time delay between a user's action and a system's response, usually measured in milliseconds.

Throughput refers to the number of requests that a system can handle at the same time.

z









































## Best resource 
https://roadmap.sh/system-design?fl=0


# Frontend System Design & HLD Notes

---

## System Design Resources

- https://app.excalidraw.com/l/8lwXEYCWFUz/5BWKjqfiBK6
- https://github.com/jscafe-dev/frontend-system-design-yatra
- https://www.youtube.com/watch?v=M2RpzmyKfvQ&list=PLe3J6mZBq1xVDr297Yg0p1SHbdj_Oceld&index=1
- https://www.youtube.com/watch?v=zAEy0jchvH8&list=PLe3J6mZBq1xVDr297Yg0p1SHbdj_Oceld&index=2

---

---

# Networking

---

## 1. Functioning Of Browser & Networking

- https://blog.logrocket.com/how-browser-rendering-works-behind-scenes/
- https://engineering.teknasyon.com/what-is-the-dom-how-does-html-rendering-happen-in-browsers-cbeb12bdfea6
- https://betterprogramming.pub/how-does-the-browser-render-a-webpage-75cdb53ba49d
- https://blog.bytebytego.com/p/ep80-explaining-8-popular-network
- https://www.semrush.com/blog/http-status-codes/

---

## 2. REST API

- https://www.hypertest.co/api-testing/what-is-a-rest-api-examples-uses-and-challenges
- https://runjs.app/blog/how-to-start-a-node-server

---

## 3. GraphQL

- https://www.wallarm.com/what/what-is-graphql-definition-with-example
- https://kinsta.com/blog/graphql-vs-rest/
- https://studio.apollographql.com/public/countries/variant/current/home
- https://saranshk.medium.com/resolving-nested-queries-in-graphql-a60f2f2ee1b7

---

## 4. tRPC

- https://www.wearecapicua.com/blog/trpc-vs-grpc
- https://dev.to/wizdomtek/typescript-express-building-robust-apis-with-nodejs-1fln

---

## 5. gRPC

- https://daily.dev/blog/build-a-grpc-service-in-nodejs
- https://blog.postman.com/what-is-protobuf/

---

## 6. Polling

- https://medium.com/@roopa.kushtagi/exploring-data-fetching-patterns-short-polling-long-polling-and-websockets-52d408b45d30
- https://dev.to/obnsk/long-polling-comparative-and-sample-coded-expression-4anp

---

## 7. WebSocket

- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- https://en.wikipedia.org/wiki/WebSocket
- https://www.blackslate.io/articles/real-time-communication-with-nodejs-express-websockets

---

## 8. WebHook

- https://webhookrelay.com/blog/2018/07/13/how-to-create-webhook/

---

---

# Performance

> Excalidraw: https://app.excalidraw.com/l/8lwXEYCWFUz/5BWKjqfiBK6

---

## 1. Code Splitting

- https://www.patterns.dev/vanilla/bundle-splitting/
- https://javascriptpatterns.vercel.app/patterns/performance-patterns/introduction
- https://dev.to/franklin030601/code-splitting-in-react-js-4o2g

---

## 2. Compression

- https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
- https://www.digitalocean.com/community/tutorials/how-to-improve-website-performance-using-gzip-and-nginx-on-ubuntu-20-04
- https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9
- https://dev.to/uguremirmustafa/how-to-compress-react-files-and-serve-with-iis-on-windows-server-3bj9

---

## 3. Import on Interaction

- https://www.patterns.dev/vanilla/import-on-interaction

---

## 4. Import on Visibility

- https://www.patterns.dev/vanilla/import-on-visibility
- https://javascriptpatterns.vercel.app/patterns/performance-patterns/import-on-visibility

---

## 5. Prefetch

- https://www.patterns.dev/vanilla/import-on-interaction
- https://javascriptpatterns.vercel.app/patterns/performance-patterns/browser-hints
- https://www.patterns.dev/vanilla/prefetch

---

## 6. Preload

- https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules
- https://javascriptpatterns.vercel.app/patterns/performance-patterns/browser-hints
- https://www.patterns.dev/vanilla/preload
- https://www.npmjs.com/package/preload-webpack-plugin/v/1.0.0
- https://github.com/vuejs/preload-webpack-plugin

---

## 7. Tree Shaking

- https://blog.saeloun.com/2022/11/24/tree-shaking-in-webpack-5/
- https://webpack.js.org/guides/tree-shaking/#add-a-utility

---

## 8. Virtual Lists

- https://www.patterns.dev/vanilla/virtual-lists

---

## 9. Web Vitals & LCP

- https://web.dev/articles/vitals
- https://web.dev/articles/lcp
- https://www.smashingmagazine.com/2023/01/optimizing-image-element-lcp/
- https://www.twicpics.com/blog/how-to-find-the-lcp-element-a-complete-guide

---

## 10. INP (Interaction to Next Paint)

- https://web.dev/articles/inp
- https://www.remoterocketship.com/advice/how-i-debugged-and-fixed-inp
- https://medium.com/redbus-in/what-is-interaction-to-next-paint-inp-9c35cd7b6539

---

## 11. CLS (Cumulative Layout Shift)

- https://web.dev/articles/cls
- https://web.dev/articles/optimize-cls

---

## 12. Logging — WinstonJS

**WinstonJS** is a popular logging library for Node.js. Supports multiple transports (console, file, HTTP), custom log levels, and structured JSON logging.

- https://github.com/winstonjs/winston

---

## 13. Load Testing & Stress Testing

Tools to check if your API/infra can handle expected traffic.

| Tool | Type | Notes |
|---|---|---|
| **JMeter** | GUI-based | Java-based, good for complex scenarios |
| **k6** | Script-based | JS scripting, modern, developer-friendly |

**Load Testing** — can the system handle expected traffic?
**Stress Testing** — at what point does the system break?

---

## 14. A11y (Accessibility)

Ensuring web apps are usable by everyone, including users with disabilities. Key areas:

- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ARIA attributes (`aria-label`, `role`)
- Keyboard navigation (`tabIndex`, focus management)
- Color contrast ratios
- Screen reader compatibility
- Tools: **axe DevTools**, **Lighthouse**, **WAVE**

---

## 15. Core Web Vitals & Lighthouse

| Metric | What It Measures | Good Score |
|---|---|---|
| **LCP** | Largest Contentful Paint — loading speed | < 2.5s |
| **INP** | Interaction to Next Paint — responsiveness | < 200ms |
| **CLS** | Cumulative Layout Shift — visual stability | < 0.1 |

**Lighthouse** — Chrome DevTools audit tool that scores Performance, Accessibility, SEO, and Best Practices.

---

## 16. Image Optimization

| Technique | How |
|---|---|
| **HTML5 `<picture>`** | Serve different formats (WebP, AVIF) per browser |
| **`srcset`** | Serve different sizes based on viewport width |
| **Lazy Loading** | `loading="lazy"` — load images only when visible |
| **Format** | Use WebP/AVIF instead of PNG/JPEG |
| **Compression** | Tools like Squoosh, Sharp, imagemin |

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" loading="lazy" alt="description" />
</picture>
```

---

## 17. Build Optimization

| Tool | Description |
|---|---|
| **Webpack** | Most popular bundler, highly configurable |
| **Vite** | Fast dev server using ESM, Rollup for production |
| **esbuild** | Ultra-fast Go-based bundler/minifier |

**Key techniques:**
- **Tree Shaking** — remove unused code from the bundle
- **Bundle Caching** — use content hashes in filenames for long-term caching
- **Code Splitting** — load only what's needed per route
- **Minification** — compress JS/CSS for smaller payloads

---

---

# Testing

---

## 1. Types of Testing

| Type | Scope | Purpose |
|---|---|---|
| **Unit Testing** | Single function/component | Test individual pieces in isolation |
| **Integration Testing** | Multiple modules together | Test how modules interact |
| **End-to-End (E2E)** | Full user flow | Test the entire app from UI to backend |

```
Unit → Integration → E2E
(fast, many)    →    (slow, few)
```

---

## 2. Unit Testing

Test a single function or component in isolation. Mock external dependencies.

**Tools:** Jest, Vitest, React Testing Library

```ts
// Example: Jest
describe('add', () => {
  it('should return sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

---

## 3. Integration Testing

Test how multiple units work together (e.g., component + API call + Redux store).

```tsx
// Example: React Testing Library
render(<LoginForm />);
fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
fireEvent.click(screen.getByText('Submit'));
expect(await screen.findByText('Welcome')).toBeInTheDocument();
```

---

## 4. End-to-End (E2E) Testing

Simulates real user behavior in a real browser.

**Tools:** Cypress, Playwright

---

## 5. Testing Tools Comparison

| Tool | Type | Language | Browser | Speed | Best For |
|---|---|---|---|---|---|
| **Jest** | Unit / Integration | JS/TS | No (JSDOM) | Fast | React component & logic testing |
| **Cypress** | E2E | JS/TS | Yes (Chromium) | Medium | Visual E2E, single browser testing |
| **Playwright** | E2E | JS/TS/Python | Yes (Multi) | Fast | Cross-browser E2E, CI pipelines |

---

---

# Clean Code

---

## 1. ESLint

Static analysis tool that finds and fixes code problems.

```bash
npm install -D eslint
npx eslint --init
```

```json
// .eslintrc.json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
```

---

## 2. Prettier

Opinionated code formatter — formats code automatically.

```bash
npm install -D prettier
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 3. Husky

Git hooks manager — run scripts before commit/push.

```bash
npm install -D husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## 4. Commitlint

Enforce commit message conventions (e.g., Conventional Commits).

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

**Valid formats:**

```
feat: add login page
fix: resolve cart total bug
docs: update README
chore: upgrade dependencies
```

---

## 5. Full Clean Code Pipeline

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

```
Developer commits → Husky runs pre-commit hook → lint-staged runs ESLint + Prettier → Commitlint checks message → ✅ Commit passes
```

---

---

# Security

---

## 1. Web Attacks

### XSS (Cross-Site Scripting)

Attacker injects malicious scripts into web pages viewed by other users.

| Type | How |
|---|---|
| **Stored XSS** | Script saved in DB, served to all users |
| **Reflected XSS** | Script in URL params, reflected in response |
| **DOM-based XSS** | Script manipulates DOM directly |

**Prevention:**
- Escape/sanitize user input
- Use `Content-Security-Policy` headers
- React auto-escapes JSX (avoid `dangerouslySetInnerHTML`)

---

### CSRF (Cross-Site Request Forgery)

Attacker tricks authenticated user into making unwanted requests.

**Prevention:**
- Use CSRF tokens
- `SameSite` cookie attribute
- Check `Origin` / `Referer` headers

---

## 2. Secure Token & Authentication

| Technology | Purpose |
|---|---|
| **JWT** | Stateless auth token (Header.Payload.Signature) |
| **HTTPS** | Encrypted communication (TLS/SSL) |
| **OAuth2** | Third-party auth (Google, GitHub login) |
| **Helmet** | Express middleware — sets secure HTTP headers |
| **bcrypt** | Hash passwords before storing in DB |
| **scryptjs** | Alternative password hashing algorithm |

**JWT flow:**

```
1. User logs in → server creates JWT → sends to client
2. Client stores JWT (localStorage / httpOnly cookie)
3. Client sends JWT in Authorization header on every request
4. Server verifies JWT signature → grants access
```

---

## 3. NPM Token Configuration

```bash
# Set NPM auth token
npm config set //registry.npmjs.org/:_authToken=YOUR_NEW_TOKEN

# Or edit directly
code ~/.npmrc
```

```
// .npmrc
//registry.npmjs.org/:_authToken=YOUR_TOKEN
```

---

---

# Real-Time Communication

---

## 1. WebSocket vs SSE

| Feature | WebSocket | SSE (Server-Sent Events) |
|---|---|---|
| **Direction** | Bi-directional (client ↔ server) | One-way (server → client) |
| **Protocol** | `ws://` / `wss://` | HTTP |
| **Reconnection** | Manual | Auto-reconnect built-in |
| **Data format** | Text + Binary | Text only |
| **Use case** | Chat, gaming, live collaboration | Notifications, live feeds, stock prices |

---

## 2. Polling vs Push

| | Short Polling | Long Polling | Push (WebSocket/SSE) |
|---|---|---|---|
| **How** | Client requests every N seconds | Client waits, server responds when data ready | Server pushes instantly |
| **Latency** | High (depends on interval) | Medium | Low (real-time) |
| **Server load** | High (many empty requests) | Medium | Low |
| **Complexity** | Simple | Medium | Higher |

---

## 3. Socket.io (Node.js)

Real-time bidirectional communication library built on WebSocket with fallbacks.

**Server:**

```js
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('message', (data) => {
    io.emit('message', data);          // Broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
```

**Client:**

```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.emit('message', { text: 'Hello!' });

socket.on('message', (data) => {
  console.log('Received:', data);
});
```

---

## 4. Redis (Pub/Sub)

Redis Pub/Sub enables real-time messaging between services. Used to **scale WebSocket** across multiple servers.

```
Server A (Socket.io) ←→ Redis Pub/Sub ←→ Server B (Socket.io)
```

**Publisher:**

```js
const redis = require('redis');
const publisher = redis.createClient();

publisher.publish('chat', JSON.stringify({ user: 'John', text: 'Hello' }));
```

**Subscriber:**

```js
const subscriber = redis.createClient();

subscriber.subscribe('chat');
subscriber.on('message', (channel, message) => {
  console.log(`${channel}: ${JSON.parse(message).text}`);
});
```

**Why Redis for chat?**
- Scale WebSocket across multiple Node.js instances
- Message persistence (with Redis Streams)
- Fast in-memory performance

---

# HLD (High Level Design)

---

## Step 1 — Fundamentals

---

### 1.1 Serverless vs Serverful

AWS Lambda is **serverless** — AWS EC2 is **serverful**.

| | Serverless (Lambda) | Serverful (EC2) |
|---|---|---|
| **Manage server?** | No | Yes |
| **Scaling** | Auto | Manual / Auto-scaling groups |
| **Pay for** | Per request | Running time |
| **Use case** | Event-driven, APIs | Long-running apps, full control |

---

### 1.2 Horizontal vs Vertical Scaling

**Vertical Scaling** — upgrade one server (more RAM, CPU, storage).
> Like going from a small laptop → powerful gaming PC.

**Horizontal Scaling** — add more servers + use a load balancer.
> Like using multiple trucks instead of one big truck.

```
1. Start with 1 server → 1,000 users → works fine.
2. Users grow → upgrade server (Vertical Scaling).
3. Hit the limit → add more servers + Load Balancer (Horizontal Scaling).
```

| | Vertical | Horizontal |
|---|---|---|
| **What** | Bigger server | More servers |
| **Limit** | Hardware max | Nearly unlimited |
| **Downtime** | Yes (to upgrade) | No (add behind LB) |
| **Cost** | Expensive at scale | Cost-effective |

---

### 1.3 What Are Threads?

Answer

---

### 1.4 What Are Pages?

Answer

---

### 1.5 How Does the Internet Work?

Answer

---

## Step 2 — Database

---

### 2.1 SQL vs NoSQL

| | SQL | NoSQL |
|---|---|---|
| **Structure** | Tables (rows/columns) | Documents, key-value, graph |
| **Schema** | Fixed schema | Flexible schema |
| **Scaling** | Vertical | Horizontal |
| **Examples** | PostgreSQL, MySQL | MongoDB, Redis, DynamoDB |
| **Best for** | Structured data, relations | Unstructured, fast reads |

---

### 2.2 In-Memory Databases

Databases that store data in RAM for ultra-fast reads/writes. Data is volatile unless persisted to disk.

**Examples:** Redis, Memcached

**Use cases:** Caching, session storage, real-time leaderboards, rate limiting.

---

### 2.3 Data Replication & Migration

**Replication** — copying data across multiple servers for redundancy and availability.
- **Master-Slave** — writes go to master, reads from slaves.
- **Master-Master** — both servers accept writes.

**Migration** — moving data from one database/schema to another (e.g., MySQL → PostgreSQL, or schema updates).

---

### 2.4 Data Partitioning

Splitting a large database into smaller, more manageable pieces.

- **Horizontal Partitioning** — split rows across tables (e.g., users A–M in table 1, N–Z in table 2).
- **Vertical Partitioning** — split columns across tables (e.g., user profile vs user activity).

---

### 2.5 Sharding

A type of horizontal partitioning where data is distributed across multiple database servers (shards).

Each shard holds a subset of the data. A **shard key** determines which shard stores which data.

**Example:** User ID % 4 → routes to shard 0, 1, 2, or 3.

| Pros | Cons |
|---|---|
| Scales horizontally | Complex queries across shards |
| Better performance | Rebalancing is hard |
| Fault isolation | Shard key selection is critical |














## others topic 

```
HTTP/HTTPS
REST
WebSockets
DNS
CDN
Reverse proxy
Load balancer
API Gateway
Authentication
Authorization
JWT
OAuth
Caching
Database indexing
SQL vs NoSQL
Horizontal vs vertical scaling
https://roadmap.sh/system-design?fl=0
Backend architecture

Node.js architecture
Express/NestJS
Middleware
Controllers
Services
Repositories
Validation
Error handling
Authentication
Authorization
Rate limiting
Logging
Monitoring
API versioning

Distributed systems
Redis
Message queues
Kafka basics
RabbitMQ basics
Event-driven architecture
Pub/sub
Microservices
Database replication
Sharding
CAP theorem
Eventual consistency
Idempotency
Distributed locks

"Architecture interviews
Finally learn how to design:"
WhatsApp
YouTube
Netflix
Uber
Amazon
URL shortener
Notification system
File upload system
Chat application
E-commerce
Food delivery
Order management system




FRONTNED 
Browser
Rendering
Caching
State
API
Backend
Database

"Performance
"
Code splitting
Lazy loading
Memoization
Virtualization
Bundle optimization
Tree shaking
CDN
Browser caching
HTTP caching
SSR
CSR
SSG
Streaming
component boundaries
state boundaries
API boundaries
caching strategy
error handling
authorization
performance strategy
```
