
## Basics

### EX-1. What is Express?

A **small, flexible web framework** for Node.js. It makes building servers and REST APIs easy: routing, middleware and error handling.

**Real-life:** the `http` module = building a shop from bricks. Express = a ready-made shop where you only set up the counters.

```bash
npm install express
```

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

app.listen(3000, () => console.log("Server running"));
```

Open `http://localhost:3000` → `Hello`

| | `http` module | Express |
|---|---|---|
| Routing | manual `if (req.url === ...)` | `app.get("/users", ...)` |
| JSON response | `JSON.stringify` + headers | `res.json()` |
| Middleware | ❌ | ✅ |

> **In one line:** Express = Node's `http` module made simple.

### EX-2. What is the route syntax?

```js
app.METHOD(PATH, HANDLER);
```

- **METHOD** = `get`, `post`, `put`, `patch`, `delete`
- **PATH** = the URL, like `/users`
- **HANDLER** = the function that runs: `(req, res) => {}`

**Real-life:** a restaurant menu. Order type (METHOD) + dish name (PATH) → the chef who cooks it (HANDLER).

```js
app.get("/users", (req, res) => {
  res.status(200).json({ message: "Users fetched" });
});
```

**Request `GET /users` → Output:**

```
200 { "message": "Users fetched" }
```

- `req` = what the user sent.
- `res.status(200)` = set the status code.
- `res.json()` = send JSON back.
- A path with no route gives `404` automatically.

> **In one line:** method + path + handler = one route.

### EX-3. What is the common install bundle?

**Real-life:** a starter kit for a new kitchen: stove, knives, plates.

```bash
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt cookie-parser multer
npm install --save-dev nodemon
```

| Package | Job |
|---|---|
| `express` | the server |
| `cors` | allow other websites to call your API |
| `dotenv` | load secrets from `.env` |
| `jsonwebtoken` | login tokens (JWT) |
| `bcrypt` | hash passwords |
| `cookie-parser` | read cookies |
| `multer` | file uploads |
| `nodemon` (dev) | auto-restart on save |

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

### EX-4. `app.get()` vs `app.use()`?

- `app.get()` = handles **one** route with **one** method (GET).
- `app.use()` = adds **middleware** or mounts a **router**, for **all** methods.

**Real-life:** `app.get` = one specific counter ("tickets"). `app.use` = the security gate everyone passes through.

```js
app.get("/users", getUsers);        // only GET /users
app.use(express.json());            // runs for every request
app.use("/api/users", userRouter);  // all methods under /api/users
```

> **In one line:** `get` = one route, `use` = middleware / router.

---

## Request & Response

### EX-5. What's inside the request object (`req`)?

**Real-life:** an order slip: table number, special notes, the dish, who ordered.

```js
req.params;  // /users/:id        → { id: "5" }
req.query;   // ?page=2&limit=10  → { page: "2", limit: "10" }
req.body;    // POST/PATCH JSON   → { name: "Ashish" } (needs express.json())
req.headers; // HTTP headers
req.cookies; // cookies (needs cookie-parser)
req.file;    // one uploaded file (Multer)
req.files;   // many uploaded files (Multer)
```

`params` and `query` values are always **strings**.

### EX-6. What are the main response methods (`res`)?

**Real-life:** ways a waiter can answer: serve food, give a bill, say "go to the other counter".

```js
res.json({ data });          // send JSON ⭐ most used
res.status(201).json({});    // status + JSON
res.send("Hello");           // send text / HTML
res.sendFile(path);          // send a file (absolute path)
res.cookie("name", value);   // set a cookie
res.redirect("/new-url");    // redirect
res.render("view", data);    // render a template (EJS, Pug)
```

Send only **one** response per request, or you get `Cannot set headers after they are sent`. Use `return res...` to stop.

### EX-7. What is `next()`?

Passes the request to the **next** middleware or route.

**Real-life:** airport checks: security → passport → boarding gate. Each check says "next!"

```js
app.use((req, res, next) => {
  console.log("Middleware hit");
  next(); // ⚠️ forget this and the request hangs forever
});
```

- `next()` = go to the next step.
- `next(err)` = jump straight to the error handler.

---

## Middleware & Router

### EX-8. What are the 5 types of middleware?

Middleware = a function `(req, res, next)` that runs **between** the request and the response.

**Real-life:** checkpoints on a road trip.

| Type | Added with | Example |
|---|---|---|
| Application-level | `app.use()` | logging for all routes |
| Router-level | `router.use()` | API key check for one router |
| Built-in | comes with Express | `express.json()`, `express.static()` |
| Third-party | npm + `app.use()` | `cors()`, `morgan()`, `helmet()` |
| Error-handling | `(err, req, res, next)` 4 args | format errors, added **last** |

```js
// Application-level
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Router-level
router.use((req, res, next) => {
  if (!req.headers["x-api-key"]) return res.status(400).send("API Key Missing");
  next();
});

// Built-in
app.use(express.json());

// Third-party
app.use(cors());

// Error-handling (LAST)
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, error: err.message });
});
```

**Order matters:** middleware runs top to bottom.

### EX-9. What built-in middleware does Express have?

**Real-life:** tools that come free with a new phone.

```js
app.use(express.json());                         // JSON body → req.body
app.use(express.urlencoded({ extended: true })); // HTML form data → req.body
app.use(express.static("public"));               // serve files (images, CSS, HTML)
```

Without `express.json()`, `req.body` is `undefined`.

### EX-10. What is Express Router?

Groups related routes into their own file.

**Real-life:** a mall. Each shop (router) handles its own customers; the mall (app) just points to it.

```js
// routes/user.routes.js
const router = express.Router();
router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
module.exports = router;

// app.js
app.use("/api/users", userRouter);
```

**Result:** `GET /api/users`, `POST /api/users`, `PATCH /api/users/5`, `DELETE /api/users/5`

---

## Project Setup

### EX-11. What is dotenv?

Loads secrets from a `.env` file into `process.env`.

**Real-life:** keeping your house key in a locker, not taped to the front door.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=my-secret
```

```js
require("dotenv").config(); // first line of your entry file
console.log(process.env.PORT); // '5000' (always a string)
```

⚠️ Never commit `.env` to Git. Newer Node (20.6+) can also do `node --env-file=.env app.js`.

### EX-12. What goes in `.gitignore`?

Files Git should **never** upload.

**Real-life:** things you don't pack in your suitcase: rubbish and your passwords diary.

```gitignore
node_modules/
.env
dist/
build/
*.log
.DS_Store
```

### EX-13. What is Nodemon?

**Auto-restarts** the server when you save a file.

**Real-life:** a TV that refreshes the channel by itself when the show updates.

```bash
npm install --save-dev nodemon
npm run dev
```

```json
"scripts": { "dev": "nodemon src/index.js" }
```

Newer Node (18.11+) also has `node --watch src/index.js`.

---

## CORS, Cookies & Status Codes

### EX-14. How do you set up CORS in Express?

**Real-life:** a guest list at a party. Only listed websites can call your API.

```bash
npm install cors
```

```js
app.use(cors()); // allow everyone (dev only)

app.use(cors({
  origin: ["https://app.example.com", "https://admin.example.com"], // guest list
  credentials: true, // needed for cookies
}));
```

- CORS is enforced by **browsers** only. Postman ignores it.
- Before POST/PATCH with custom headers, the browser sends an **OPTIONS** "preflight".

**Sending cookies across origins** (both sides needed):

```js
fetch("/api/profile", { credentials: "include" });           // frontend
axios.get("/api/profile", { withCredentials: true });         // frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // backend
```

**Vite dev proxy** (no CORS during development):

```js
// vite.config.js
server: { proxy: { "/api": { target: "http://localhost:5000", changeOrigin: true } } }
```

### EX-15. How do you use cookies (cookie-parser)?

**Real-life:** a club wristband. You get it once, then show it every time you come back.

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// set
res.cookie("refreshToken", token, {
  httpOnly: true,                  // JS can't read it
  secure: true,                    // HTTPS only
  sameSite: "strict",              // not sent from other sites
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (ms)
});

req.cookies.refreshToken;          // read
res.clearCookie("refreshToken");   // delete
```

### EX-16. Which extra status codes should you know?

**Real-life:** more replies from a shopkeeper.

| Code | Meaning | Real-life |
|---|---|---|
| 301 | Moved Permanently | shop moved to a new address |
| 304 | Not Modified | your saved copy is still fine |
| 409 | Conflict | that username is already taken |
| 422 | Unprocessable Content | form filled, but email is invalid |
| 429 | Too Many Requests | slow down, too many orders |
| 502 | Bad Gateway | the supplier gave a broken answer |
| 503 | Service Unavailable | shop closed for maintenance |
| 504 | Gateway Timeout | the supplier took too long |

---

## Auth & Security

### EX-17. How does JWT work in Express?

**Real-life:** a cinema ticket with your seat and expiry time printed on it, plus a stamp that proves it's real.

```js
const jwt = require("jsonwebtoken");

const token = jwt.sign(                    // create
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);

const decoded = jwt.verify(token, process.env.JWT_SECRET); // check
// { userId, role, iat, exp }  (throws if invalid or expired)
```

| | Access Token | Refresh Token |
|---|---|---|
| Life | short (5–30 min) | long (days/weeks) |
| Job | call APIs | get a new access token |
| Stored in | memory / `Authorization` header | httpOnly cookie |

**Real-life:** access token = a day pass. Refresh token = a membership card that gets you a new day pass.

### EX-18. How do you hash passwords (bcrypt)?

**Real-life:** a meat grinder. You can turn meat into mince, but never mince back into meat.

```js
const bcrypt = require("bcrypt");

const hash = await bcrypt.hash(password, 10);         // register: save the hash
const isValid = await bcrypt.compare(password, hash); // login: true / false
```

- `10` = salt rounds (higher = slower = safer).
- ❌ Never store plain passwords. `bcryptjs` = pure JS version, same API.

### EX-19. How do you write an auth middleware?

**Real-life:** a bouncer checking your wristband before letting you into the VIP room.

```js
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ message: "Authentication required" });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

app.get("/api/profile", auth, getProfile); // protected route
```

### EX-20. Authentication vs Authorization?

**Real-life:** hotel. Showing your ID at reception = authentication. Your key card opening only **your** room = authorization.

| | Authentication | Authorization |
|---|---|---|
| Question | Who are you? | What can you do? |
| How | verify JWT | check role |
| Fails with | `401` | `403` |

```js
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
};

app.delete("/api/users/:id", auth, adminOnly, deleteUser);
```

### EX-21. How do you upload files (Multer)?

**Real-life:** a post office counter that accepts parcels (files), not just letters (JSON).

```js
const multer = require("multer");
const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

app.post("/upload", upload.single("video"), (req, res) => {   // one file
  res.json({ message: "Uploaded", file: req.file.filename });
});

app.post("/uploads", upload.array("files", 5), (req, res) => { // up to 5 files
  res.json({ count: req.files.length });
});
```

- Postman: `Body → form-data → Key: video → Type: File`
- Cloud flow: `Client → Multer (temp) → S3 / Cloudinary → URL → MongoDB`

---

## Errors, Validation & Fetching

### EX-22. How does error handling work?

**Real-life:** every department sends problems to **one** complaints desk.

```js
app.get("/users", async (req, res, next) => {
  try {
    res.json(await User.find());
  } catch (err) {
    next(err); // send to the error handler
  }
});

// Error handler: 4 params, registered LAST
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
```

In **Express 5**, errors thrown inside `async` routes go to the error handler automatically, so `try/catch` + `next(err)` is optional.

### EX-23. Why validate input?

**Real-life:** a bank checks your form before opening an account. It doesn't trust whatever you wrote.

```js
// ❌ never trust req.body directly
await User.create(req.body); // someone can send { role: "admin" }

// ✅ validate first (zod)
const { z } = require("zod");
const schema = z.object({ name: z.string().min(2), email: z.string().email() });

const result = schema.safeParse(req.body);
if (!result.success) return res.status(400).json({ errors: result.error.issues });
await User.create(result.data); // only clean fields
```

`parse()` throws on bad data; `safeParse()` returns `{ success, data / error }`.

### EX-24. Axios vs Fetch?

**Real-life:** fetch = a basic bike (free, you do more work). Axios = a scooter (extra install, does more for you).

```js
const { data } = await axios.get("/api/users"); // axios: JSON ready

const res = await fetch("/api/users");          // fetch: 2 steps
const users = await res.json();
```

| | Axios | Fetch |
|---|---|---|
| Auto JSON | ✅ | ❌ `res.json()` |
| Throws on 4xx/5xx | ✅ | ❌ check `res.ok` |
| Interceptors | ✅ | ❌ |
| Install | npm package | built-in |

---

## REST API Design

### EX-25. What are the REST principles?

**Real-life:** a library with clear rules.

| Principle | Meaning | Real-life |
|---|---|---|
| Stateless | each request carries everything needed | show your library card every visit |
| Resource-based | everything has its own URL | each book has its own shelf number |
| Uniform interface | nouns in URL, verbs = HTTP methods | same rules for every book |
| Client-server | frontend and backend are separate | readers and librarians do different jobs |
| Cacheable | responses say if they can be saved | "you can photocopy this page" |

### EX-26. How does CRUD map to HTTP?

**Real-life:** a contacts app: add, view, edit, delete.

| CRUD | Method | Endpoint | Status |
|---|---|---|---|
| Create | POST | `/api/users` | 201 |
| Read all | GET | `/api/users` | 200 |
| Read one | GET | `/api/users/:id` | 200 |
| Update (full) | PUT | `/api/users/:id` | 200 |
| Update (part) | PATCH | `/api/users/:id` | 200 |
| Delete | DELETE | `/api/users/:id` | 200 / 204 |

### EX-27. What are the RESTful URL rules?

Use **nouns** in URLs; the HTTP method is the verb.

**Real-life:** a street address says **where**, not **what to do there**.

```
✅ GOOD
GET    /api/users                   → plural nouns
GET    /api/users/5/orders          → nested for relations
GET    /api/users?page=2&limit=10&sort=-createdAt  → filter, sort, paginate

❌ BAD
GET    /api/getUsers
POST   /api/createUser
POST   /api/deleteUser/5
```

### EX-28. Show a complete REST API example

**Real-life:** a small notebook of users: list, view, add, edit, remove.

```js
const express = require("express");
const app = express();
app.use(express.json());

let users = [{ id: 1, name: "Ashish", email: "a@x.com" }];
let nextId = 2;

// Read all
app.get("/api/users", (req, res) => {
  res.status(200).json({ success: true, count: users.length, data: users });
});

// Read one
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, data: user });
});

// Create
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ success: false, message: "Name and email required" });
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// Update (partial)
app.patch("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  res.status(200).json({ success: true, data: user });
});

// Delete
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "User not found" });
  users.splice(index, 1);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

app.listen(3000);
```

`req.params.id` is a string, so convert with `Number()`. A `nextId` counter avoids duplicate IDs after a delete (`users.length + 1` can repeat).

### EX-29. What is a standard API response format?

**Real-life:** every bill from a shop has the same layout, so you always know where the total is.

```json
// Success
{ "success": true, "message": "User fetched", "data": { "id": 1, "name": "Ashish" } }

// Error
{ "success": false, "message": "Invalid email", "error": { "code": "INVALID_INPUT" } }
```

### EX-30. What are REST API best practices?

**Real-life:** good shop habits that keep customers happy.

- Use `express.json()` to read bodies.
- Return the **right** status codes.
- Always reply in JSON (`res.json()`).
- Add pagination, filtering and sorting (`?page=2&limit=10`).
- Version your API: `/api/v1/users`.
- Handle errors in **one** error middleware.

### EX-31. `params` vs `query` vs `body`?

**Real-life:** ordering a pizza. `params` = which pizza (`/pizza/5`). `query` = extras (`?size=large`). `body` = the delivery form you fill in.

| | Example URL / data | Read with | Used for |
|---|---|---|---|
| params | `GET /users/5` | `req.params.id` | which item |
| query | `GET /users?page=2&limit=10` | `req.query.page` | filter, sort, page |
| body | `POST { "name": "Ashish" }` | `req.body.name` | data to save |

---

## Architecture

### EX-32. What is the request lifecycle?

**Real-life:** a parcel going through a sorting centre: scanned, checked, sorted, delivered.

```
Request
  → CORS
  → express.json()
  → Logger
  → Auth middleware
  → Router
  → Controller
  → Service (business logic)
  → Database (Mongoose)
  → Response
```

### EX-33. What is a good folder structure?

**Real-life:** a kitchen with separate drawers for spoons, knives and plates.

```
src/
├── config/       db.js
├── controllers/  user.controller.js
├── middleware/   auth.middleware.js, error.middleware.js
├── models/       user.model.js
├── routes/       user.routes.js
├── services/     user.service.js
├── utils/        jwt.js, response.js
├── app.js        (express setup, middleware, routes)
└── server.js     (app.listen)
```

### EX-34. Controller vs Service?

- **Controller** = HTTP only: reads `req`, sends `res`.
- **Service** = business logic: no `req` / `res`.

**Real-life:** controller = waiter (takes the order, brings the food). Service = chef (actually cooks).

```js
// controllers/user.controller.js
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// services/user.service.js
const createUser = async (data) => {
  // validate, hash password, save to DB, send welcome email
};
```

**Why:** services can be reused (from cron jobs, tests) and tested without HTTP.

---

## Security, Headers & API Auth

### EX-35. What is the security checklist?

**Real-life:** locking up a house: doors, windows, alarm, safe.

- ✅ Hash passwords (bcrypt)
- ✅ Never commit `.env`
- ✅ HTTPS in production
- ✅ Validate all inputs (zod)
- ✅ Auth + role middleware
- ✅ Secure cookies (`httpOnly`, `secure`, `sameSite`)
- ✅ Whitelist CORS origins
- ✅ Rate limiting (`express-rate-limit`)
- ✅ Security headers (`helmet`)
- ✅ Limit upload size and type
- ✅ Hide stack traces in production
- ✅ Keep packages updated (`npm audit`)

```js
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests / 15 min
```

### EX-36. Which HTTP headers are common?

**Real-life:** the labels on a parcel: sender, contents, delivery note.

```js
req.headers["authorization"]; // "Bearer <token>"
req.headers["content-type"];  // "application/json"
req.headers["user-agent"];    // browser / app info (can be faked)
req.headers["origin"];        // which site sent it (used by CORS)
```

Express makes header names **lowercase**.

### EX-37. What are the API authentication methods?

**Real-life:** ways into a building: a shared door code (API key), saying your name and password each time (Basic), a visitor badge (JWT), or entry through a trusted partner like Google (OAuth).

| Method | Header | Best for | Pros / cons |
|---|---|---|---|
| API Key | `x-api-key: secret` | server-to-server | ✅ simple ❌ hard to rotate |
| Basic Auth | `Authorization: Basic base64(user:pass)` | internal tools | ✅ built-in ❌ sends password every time |
| JWT (Bearer) | `Authorization: Bearer <token>` | SPAs, mobile apps | ✅ stateless ❌ hard to revoke early |
| OAuth 2.0 / OIDC | token from auth server | Google login, SSO | ✅ standard ❌ complex setup |

```js
// API key middleware
const apiKeyAuth = (req, res, next) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).json({ success: false, message: "Invalid or missing API key" });
  next();
};

// JWT Bearer middleware
const jwtAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "Missing token" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};
```

---

## Interview Cheat Sheet

### EX-38. Quick interview answers

| Question | Quick answer |
|---|---|
| What is Express? | lightweight Node.js framework for APIs |
| What is middleware? | `(req, res, next)` function in the request pipeline |
| What is `next()`? | passes control to the next middleware / error handler |
| `app.use()` vs `app.get()`? | `use` = middleware/router, all methods; `get` = one GET route |
| What is REST? | style using stateless requests, HTTP verbs and resource URLs |
| What is stateless? | server keeps no session; each request carries all data (e.g. JWT) |
| PUT vs PATCH? | PUT replaces all; PATCH updates some fields |
| POST vs PUT? | POST creates new; PUT replaces existing |
| Why plural nouns? | URL is a collection: `/users`, not `/getUser` |
| Status for create? | `201 Created` |
| Status for bad input? | `400` or `422` |
| `401` vs `403`? | 401 = not logged in; 403 = logged in, not allowed |
| API Key vs JWT? | key = identifies the app; JWT = identifies the user |
| JWT header? | `Authorization: Bearer <token>` |
| Access vs refresh token? | access = short-lived; refresh = long-lived, gets new access |
| Why hash passwords? | a leaked DB shouldn't reveal real passwords |
| What is CORS? | browser rule for cross-origin requests |
| What does Multer do? | handles `multipart/form-data` file uploads |
| What is helmet? | middleware that sets security headers |
