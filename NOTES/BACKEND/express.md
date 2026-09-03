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

Runs **between** request arriving and final response being sent.

```js
// Structure
(req, res, next) => {
  // do something
  next();
}
```

Can: validate, authenticate, log, parse body, handle CORS, upload files, handle errors.

> ⚠️ **Order matters** — middleware executes in registration order.

```js
app.use(express.json());           // 1. parse body
app.use(authMiddleware);           // 2. auth check
app.use('/api/users', userRouter); // 3. routes
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
