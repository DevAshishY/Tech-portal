# Express.js Notes

A practical, interview-friendly reference for Express.js backend development.

---

## 1. What is Express?

Minimal, flexible **web framework** for Node.js — routing, middleware, REST APIs, error handling.

```bash
npm install express
```

```js
const express = require('express');
const app = express();

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Route syntax: `app.METHOD(PATH, HANDLER)`

```js
app.get('/users', (req, res) => {
  res.status(200).json({ message: 'Users fetched' });
});
```

---

## 2. npm & package.json

```bash
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt cookie-parser multer
npm install --save-dev nodemon
```

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev":   "nodemon src/index.js"
  }
}
```

---

## 3. `app.get()` vs `app.use()`

```js
// app.get() — handles ONE specific GET route
app.get('/users', getUsers);

// app.use() — registers middleware OR mounts a router (ALL methods)
app.use(express.json());
app.use('/api/users', userRouter);
```

> **Rule:** `app.get()` → route handler | `app.use()` → middleware / router mounting

---

## 4. Request & Response Objects

### `req` — incoming request

```js
req.params          // route params    → /users/:id
req.query           // query string    → ?page=2&limit=10
req.body            // request body    → POST/PATCH JSON
req.headers         // HTTP headers
req.cookies         // parsed cookies
req.file / req.files  // uploaded files (Multer)
```

### `res` — outgoing response

```js
res.json({ data })           // JSON response ← most common for APIs
res.send('Hello')            // string / buffer / object
res.status(201).json({})     // set status + JSON
res.sendFile(path)           // send a file
res.cookie('name', value)    // set a cookie
res.redirect('/new-url')     // redirect
res.render('view', data)     // render template engine
```

### `next` — pass to next middleware

```js
app.use((req, res, next) => {
  console.log('Middleware hit');
  next();  // ← MUST call or request hangs forever
});
```

---

## 5. HTTP Methods

| Method | Purpose |
|---|---|
| GET | Read / fetch data |
| POST | Create data |
| PUT | Replace entire resource |
| PATCH | Partially update resource |
| DELETE | Delete data |
| HEAD | Headers only, no body |
| OPTIONS | Supported methods (used in CORS preflight) |
| TRACE | Diagnostic — disabled in production |

```js
app.get('/users', getUsers);
app.post('/users', createUser);
app.patch('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
```

> ⭐ **Interview:** `401` = not authenticated | `403` = authenticated but no permission

---

## 6. Express Middleware

Middleware functions run **between** the incoming request arriving and the final response being sent.

```js
// Basic Middleware Structure
(req, res, next) => {
  // logic here
  next(); // Pass control to the next middleware
}
```

Can: execute code, modify `req`/`res` objects, end request-response cycle, call next middleware.

> ⚠️ **Order matters** — middleware executes strictly in registration order (`app.use()`).

```js
app.use(express.json());           // 1. parse body
app.use(authMiddleware);           // 2. auth check
app.use('/api/users', userRouter); // 3. routes
```

### 5 Types of Express Middleware (W3Schools Reference)

| Middleware Type | Description & Syntax | Example / Use Case |
|---|---|---|
| **1. Application-Level** | Bound to `app` instance using `app.use()` or `app.METHOD()` | Global logging, auth checks (`app.use(logger)`) |
| **2. Router-Level** | Bound to `express.Router()` instance using `router.use()` | Sub-router auth, modular routing (`router.use(auth)`) |
| **3. Built-in** | Provided out-of-the-box by Express | `express.json()`, `express.static()`, `express.urlencoded()` |
| **4. Third-Party** | Installed via npm, imported, and passed to `app.use()` | `cors()`, `morgan()`, `helmet()`, `cookieParser()` |
| **5. Error-Handling** | Must have **4 arguments**: `(err, req, res, next)` | Catching & formatting API errors (placed **last**) |

#### Code Examples for Types of Middleware

```js
// 1. Application-Level
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 2. Router-Level
const router = express.Router();
router.use((req, res, next) => {
  if (!req.headers['x-api-key']) return res.status(400).send('API Key Missing');
  next();
});

// 3. Built-in
app.use(express.json());
app.use(express.static('public'));

// 4. Third-Party
const cors = require('cors');
const morgan = require('morgan');
app.use(cors());
app.use(morgan('dev'));

// 5. Error-Handling (Must be registered LAST)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});
```

---

## 7. Built-in Middleware

```js
app.use(express.json());                        // parse JSON body → req.body
app.use(express.urlencoded({ extended: true })); // parse HTML form data
app.use(express.static('dist'));                // serve static files
```

---

## 8. Express Router

```js
// routes/user.routes.js
const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
module.exports = router;

// app.js
app.use('/api/users', userRouter);
// → GET /api/users, POST /api/users, PATCH /api/users/:id ...
```

---

## 9. Environment Variables — dotenv

```bash
npm install dotenv
```

**.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=my-secret
```

```js
require('dotenv').config();   // load at top of entry file

process.env.PORT
process.env.MONGO_URI
process.env.JWT_SECRET
```

> ⚠️ Never commit `.env` to Git. Add to `.gitignore`.

---

## 10. .gitignore

```gitignore
node_modules/
.env
dist/
build/
*.log
.DS_Store
```

---

## 11. Nodemon

```bash
npm install --save-dev nodemon
```
```json
{ "scripts": { "dev": "nodemon src/index.js" } }
```

Auto-restarts the server whenever files change.

---

## 12. CORS

**Cross-Origin Resource Sharing** — browser policy controlling cross-origin requests.

```bash
npm install cors
```

```js
// Allow all (dev only)
app.use(cors());

// Whitelist specific origins (production)
app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  credentials: true   // needed if sending cookies
}));
```

> CORS is enforced by **browsers** — Postman bypasses it.

Vite dev proxy (avoids CORS during development):
```js
server: {
  proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } }
}
```

---

## 13. Cookies & cookie-parser

```bash
npm install cookie-parser
```

```js
app.use(cookieParser());

// Read
req.cookies.refreshToken

// Set
res.cookie('refreshToken', token, {
  httpOnly: true,    // not accessible by JS
  secure: true,      // HTTPS only
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in ms
});

// Clear
res.clearCookie('refreshToken');
```

---

## 14. HTTP Status Codes

### 2xx — Success
| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |

### 3xx — Redirect
| Code | Meaning |
|---|---|
| 301 | Moved Permanently |
| 304 | Not Modified |

### 4xx — Client Error
| Code | Meaning |
|---|---|
| 400 | Bad Request |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Content |
| 429 | Too Many Requests |

### 5xx — Server Error
| Code | Meaning |
|---|---|
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

---

## 15. JWT Authentication

```bash
npm install jsonwebtoken
```

```js
// Sign (create token)
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Verify
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// decoded → { userId: '...', role: 'user', iat: ..., exp: ... }
```

| | Access Token | Refresh Token |
|---|---|---|
| Life | Short (5–30 min) | Long (days/weeks) |
| Purpose | Access APIs | Get new access token |
| Storage | Memory / header | Secure httpOnly cookie |

---

## 16. Password Hashing — bcrypt

```bash
npm install bcrypt
```

```js
const hash    = await bcrypt.hash(password, 10);          // hash on register
const isValid = await bcrypt.compare(password, hash);     // verify on login
```

> ❌ Never store plaintext passwords. `bcryptjs` = pure JS version, same API.

---

## 17. Auth Middleware

```js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Protect a route
app.get('/api/profile', authMiddleware, getProfile);
```

---

## 18. Authentication vs Authorization

| | Authentication | Authorization |
|---|---|---|
| Question | Who are you? | What can you do? |
| Mechanism | JWT verify | Role check |
| Status on fail | `401` | `403` |

```js
if (req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Forbidden' });
}
```

---

## 19. File Upload — Multer

```bash
npm install multer
```

```js
const upload = multer({ dest: 'uploads/' });

// Single file
app.post('/upload', upload.single('video'), (req, res) => {
  console.log(req.file);
  res.json({ message: 'Uploaded' });
});

// Multiple files
app.post('/upload', upload.array('files', 5), ...);
```

**Postman:** `Body → form-data → Key: video → Type: File`

**Cloud upload pattern:**
```text
Client → Multer (temp) → Cloud Storage (S3/Cloudinary) → URL → MongoDB
```

---

## 20. Error Handling

```js
// Async route — forward errors to global handler
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);  // ← passes to error middleware
  }
});

// Global error middleware — MUST have 4 params, MUST be LAST
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```

---

## 21. Input Validation

```js
// ❌ Never trust req.body directly
await User.create(req.body);

// ✅ Always validate first
const schema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
});
const data = schema.parse(req.body);  // throws on invalid
```

---

## 22. Axios vs Fetch

```js
// Axios
const { data } = await axios.get('/api/users');

// Fetch
const res  = await fetch('/api/users');
const data = await res.json();
```

| | Axios | Fetch |
|---|---|---|
| JSON auto-parse | ✅ | ❌ (need `.json()`) |
| Interceptors | ✅ | ❌ |
| Throws on 4xx/5xx | ✅ | ❌ (only network errors) |
| Bundle | External | Built-in |

---

## 23. REST API Design

```text
GET    /api/users         ← list all
POST   /api/users         ← create
GET    /api/users/:id     ← get one
PATCH  /api/users/:id     ← partial update
DELETE /api/users/:id     ← delete
```

Use HTTP verbs to express the action — avoid `POST /deleteUser`.

---

## 24. API Response Format

```json
{ "success": true,  "message": "User fetched", "data": { "id": "123", "name": "Ashish" } }
{ "success": false, "message": "Not found",    "error": { "code": "USER_NOT_FOUND" } }
```

---

## 25. Request Params / Query / Body

```js
// Route param  → GET /users/:id
req.params.id

// Query string → GET /users?page=2&limit=10
req.query.page
req.query.limit

// Body         → POST/PATCH { "name": "Ashish" }
req.body.name
```

---

## 26. Request Lifecycle

```text
Request
  → CORS Middleware
  → JSON Parser (express.json)
  → Logger
  → Auth Middleware
  → Router
  → Controller
  → Service / Business Logic
  → Database (Mongoose)
  → Response
```

---

## 27. Folder Structure

```text
src/
├── config/         db.js
├── controllers/    user.controller.js
├── middleware/     auth.middleware.js, error.middleware.js, upload.middleware.js
├── models/         user.model.js
├── routes/         user.routes.js
├── services/       user.service.js
├── utils/          jwt.js, response.js
├── app.js
└── server.js
```

---

## 28. Controller vs Service Pattern

```js
// Controller — HTTP layer only
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
};

// Service — business logic (no req/res)
const createUser = async (data) => {
  // validate, hash password, save to DB, send welcome email...
};
```

---

## 29. Security Checklist

- ✅ Hash passwords (`bcrypt`)
- ✅ Never commit `.env`
- ✅ Use HTTPS in production
- ✅ Validate & sanitize all inputs
- ✅ Use auth + authz middleware
- ✅ Secure cookies (`httpOnly`, `secure`, `sameSite`)
- ✅ Whitelist CORS origins
- ✅ Rate limiting (`express-rate-limit`)
- ✅ Security headers (`helmet`)
- ✅ Limit upload file size/type
- ✅ Never expose stack traces in production
- ✅ Keep dependencies updated

---

## 30. HTTP Headers

```js
req.headers['authorization']    // Bearer <token>
req.headers['content-type']     // application/json
req.headers['user-agent']       // client info (can be spoofed)
req.headers['origin']           // CORS source
```

---

## 31. CORS Debugging

```js
// Frontend — include credentials
axios.get('/api/profile', { withCredentials: true });
fetch('/api/profile', { credentials: 'include' });

// Backend — allow with credentials
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
```

**CORS preflight:** Browser sends `OPTIONS` before `POST`/`PATCH` with custom headers.

---

# REST API Notes (Node.js & Express)

A concise, interview-friendly reference for RESTful API architecture and implementation.

---

## 1. What is a REST API?

**REST = Representational State Transfer**

A REST API is an architectural style for designing networked applications. It allows a client (e.g., React frontend) to communicate with a server (Node.js/Express) using standard HTTP requests to create, read, update, and delete resources.

---

## 2. Core REST Principles

1. **Statelessness:** Every request contains all necessary data (headers, tokens, payload). Server stores no client context between requests.
2. **Resource-Based:** Everything (Users, Products, Orders) is a resource identified by a unique URL (e.g., `/api/users`).
3. **Uniform Interface:** Consistent use of URLs (nouns) and HTTP methods (verbs).
4. **Client-Server Separation:** Frontend and backend evolve independently.
5. **Cacheable:** Responses explicitly mark themselves as cacheable or non-cacheable.

---

## 3. CRUD to HTTP Methods Mapping

| CRUD Action | HTTP Verb | Endpoint Example | Description | Status Code |
|---|---|---|---|---|
| **Create** | `POST` | `/api/users` | Creates a new user | `201 Created` |
| **Read (All)** | `GET` | `/api/users` | Fetches list of users | `200 OK` |
| **Read (One)** | `GET` | `/api/users/:id` | Fetches single user by ID | `200 OK` |
| **Update (Full)**| `PUT` | `/api/users/:id` | Replaces whole user record | `200 OK` |
| **Update (Partial)**| `PATCH` | `/api/users/:id` | Updates specific fields | `200 OK` |
| **Delete** | `DELETE` | `/api/users/:id` | Removes a user | `200 OK` / `204 No Content` |

---

## 4. RESTful URL Naming Rules

### ✅ Good Naming Rules (Nouns)
- Use **plural nouns** for resources: `/api/users`, `/api/products`
- Use **nested URLs** for logical relations: `/api/users/:id/orders`
- Use **query params** for filtering/sorting/pagination: `/api/users?page=2&limit=10&sort=-createdAt`

### ❌ Bad Naming Patterns (Verbs)
- `GET /api/getUsers` *(Verb in URL)*
- `POST /api/createUser` *(Verb in URL)*
- `POST /api/deleteUser/123` *(Action in URL)*

---

## 5. Complete Express REST API Example

```js
const express = require('express');
const app = express();

// Parse JSON request body
app.use(express.json());

// In-memory mock database
let users = [
  { id: 1, name: 'Ashish', email: 'ashish@example.com' },
  { id: 2, name: 'John', email: 'john@example.com' }
];

// 1. GET /api/users - Read All
app.get('/api/users', (req, res) => {
  res.status(200).json({ success: true, count: users.length, data: users });
});

// 2. GET /api/users/:id - Read One
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
});

// 3. POST /api/users - Create
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// 4. PATCH /api/users/:id - Partial Update
app.patch('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;

  res.status(200).json({ success: true, data: user });
});

// 5. DELETE /api/users/:id - Delete
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });

  users.splice(index, 1);
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

app.listen(5000, () => console.log('REST API Server running on port 5000'));
```

---

## 6. Standard HTTP Response Format

Always return consistent JSON structure:

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "id": 1,
    "name": "Ashish"
  }
}
```

### Error Response (`400`, `401`, `404`, `500`)
```json
{
  "success": false,
  "message": "Invalid email address provided",
  "error": {
    "code": "INVALID_INPUT"
  }
}
```

---

## 7. Key REST API Best Practices

- Always use `express.json()` to parse payload.
- Return appropriate **HTTP Status Codes** (`200`, `201`, `400`, `401`, `403`, `404`, `500`).
- Always use **JSON** responses (`res.json()`).
- Implement proper **Pagination**, **Filtering**, and **Sorting**.
- Version your API (e.g., `/api/v1/users`).
- Handle errors centrally with custom error middleware.

---

---

## 8. API Authentication Methods

API Authentication ensures that only authorized users or applications can access protected routes.

| Method | Header Format / Strategy | Best Used For | Pros & Cons |
|---|---|---|---|
| **API Keys** | `x-api-key: secret_key_123` | Server-to-Server, Third-party integrations | ✅ Simple to implement<br>❌ Hard to revoke per user, insecure in public frontends |
| **HTTP Basic Auth** | `Authorization: Basic base64(user:pass)` | Internal tools, simple microservices | ✅ Built-in browser support<br>❌ Sends credentials on every request, must use HTTPS |
| **JWT (Bearer Token)** | `Authorization: Bearer <token>` | Modern Single Page Apps (React), Mobile Apps | ✅ Stateless, scalable, contains user payload<br>❌ Cannot easily revoke before expiration unless blacklisted |
| **OAuth 2.0 / OIDC** | Access Token + Authorization Server | Social Login (Google, GitHub), Enterprise SSO | ✅ Standardized, delegated access<br>❌ Complex setup |

### Express Middleware Example: API Key & JWT Authentication

```js
// 1. API Key Middleware (e.g. for service-to-service requests)
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid or missing API key' });
  }
  next();
};

// 2. JWT Bearer Token Middleware
const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach payload to request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Usage
app.get('/api/v1/protected-data', jwtAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});
```

---

## 9. REST API Quick Interview Cheat Sheet

| Question | Quick Answer |
|---|---|
| What is REST? | An architectural style for designing APIs based on statelessness, HTTP verbs, and resource URLs. |
| What does Stateless mean? | Server stores no client session state; every request must carry all required data (e.g., JWT). |
| `PUT` vs `PATCH`? | `PUT` replaces the whole entity; `PATCH` updates specific fields only. |
| `POST` vs `PUT`? | `POST` creates a new resource; `PUT` updates or replaces an existing one. |
| Why use Plural Nouns for URLs? | Represents a collection of resources (e.g., `/users` vs `/getUser`). |
| What status code is returned for Creation? | `201 Created`. |
| What status code is returned for Validation Failures? | `400 Bad Request` or `422 Unprocessable Content`. |
| API Key vs JWT? | API Keys authenticate an *application/client*; JWT authenticates a *user/session* statelessly. |
| What header is used for JWT? | `Authorization: Bearer <token>` |


## 32. Interview Q&A

| Question | Answer |
|---|---|
| What is Express? | Lightweight Node.js web framework for building APIs |
| What is middleware? | Function with `(req, res, next)` that runs in the request pipeline |
| `app.use()` vs `app.get()`? | `use` = all methods / middleware; `get` = GET route only |
| `401` vs `403`? | `401` = not logged in; `403` = logged in, no permission |
| What is `next()`? | Passes control to the next middleware / error handler |
| Access vs refresh token? | Access = short-lived API token; Refresh = long-lived, issues new access token |
| Why hash passwords? | Plaintext is dangerous if DB is exposed — hashing makes it unreadable |
| What is CORS? | Browser policy for cross-origin requests |
| What does Multer do? | Handles `multipart/form-data` file uploads |
| What is `helmet`? | Express middleware that sets security HTTP headers |
