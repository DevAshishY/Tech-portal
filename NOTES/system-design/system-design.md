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
