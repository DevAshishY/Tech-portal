# Express.js
*(Skips topics already in your Node.js notes: basic HTTP methods table, basic env var access, basic status codes 200/201/204/400/401/403/404/500 — only NEW info added here)*

---

## 1. What is Express?
```js
// Minimal, flexible web framework for Node.js — routing, middleware, REST APIs, error handling
npm install express
```
```js
const express = require('express')
const app = express()
app.listen(3000, () => console.log('Server running'))

// Route syntax: app.METHOD(PATH, HANDLER)
app.get('/users', (req, res) => res.status(200).json({ message: 'Users fetched' }))
```

---

## 2. npm Install Bundle (Common Stack)
```bash
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt cookie-parser multer
npm install --save-dev nodemon
```
```json
"scripts": { "start": "node src/index.js", "dev": "nodemon src/index.js" }
```

---

## 3. `app.get()` vs `app.use()`
```js
app.get('/users', getUsers)     // handles ONE specific GET route
app.use(express.json())          // registers middleware
app.use('/api/users', userRouter) // mounts router — ALL methods
// Rule: app.get() → route handler | app.use() → middleware / router mounting
```

---

## 4. Request Object — Extra Fields
```js
req.params           // route params → /users/:id
req.query             // query string → ?page=2&limit=10
req.body                // request body (POST/PATCH JSON)
req.headers               // HTTP headers
req.cookies                 // parsed cookies
req.file / req.files          // uploaded files (Multer)
```

---

## 5. Response Object — Extra Methods
```js
res.json({ data })              // JSON response ⭐ most common for APIs
res.status(201).json({})         // chain status + JSON
res.sendFile(path)                 // send a file
res.cookie('name', value)            // set a cookie
res.redirect('/new-url')               // redirect
res.render('view', data)                 // render template engine view
```

---

## 6. `next()` — Middleware Control
```js
app.use((req, res, next) => {
  console.log('Middleware hit')
  next()   // ⚠️ MUST call or request hangs forever
})
```

---

## 7. 5 Types of Express Middleware
| Type | Bound via | Example |
|---|---|---|
| Application-Level | `app.use()` / `app.METHOD()` | global logging, auth |
| Router-Level | `router.use()` | sub-router auth |
| Built-in | provided by Express | `express.json()`, `express.static()`, `express.urlencoded()` |
| Third-Party | npm install + `app.use()` | `cors()`, `morgan()`, `helmet()`, `cookieParser()` |
| Error-Handling | `(err, req, res, next)` — 4 args | catch & format API errors, placed **last** |

```js
// Application-Level
app.use((req, res, next) => { console.log(req.method, req.url); next() })

// Router-Level
router.use((req, res, next) => {
  if (!req.headers['x-api-key']) return res.status(400).send('API Key Missing')
  next()
})

// Built-in
app.use(express.json())
app.use(express.static('public'))

// Third-Party
app.use(cors())
app.use(morgan('dev'))

// Error-Handling (register LAST)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, error: err.message })
})
```

---

## 8. Built-in Middleware
```js
app.use(express.json())                         // parse JSON body → req.body
app.use(express.urlencoded({ extended: true }))  // parse HTML form data
app.use(express.static('dist'))                  // serve static files
```

---

## 9. Express Router
```js
// routes/user.routes.js
const router = express.Router()
router.get('/', getUsers)
router.post('/', createUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)
module.exports = router

// app.js
app.use('/api/users', userRouter)
// → GET /api/users, POST /api/users, PATCH /api/users/:id ...
```

---

## 10. dotenv (.env config)
```bash
npm install dotenv
```
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=my-secret
```
```js
require('dotenv').config()   // load at top of entry file
```
> ⚠️ Never commit `.env` to Git — add to `.gitignore`.

---

## 11. .gitignore
```gitignore
node_modules/
.env
dist/
build/
*.log
.DS_Store
```

---

## 12. Nodemon
```bash
npm install --save-dev nodemon
```
```json
{ "scripts": { "dev": "nodemon src/index.js" } }
```
```
// Auto-restarts server whenever files change
```

---

## 13. CORS (Cross-Origin Resource Sharing)
```bash
npm install cors
```
```js
app.use(cors())    // allow all (dev only)

app.use(cors({     // whitelist origins (production)
  origin: ['https://app.example.com', 'https://admin.example.com'],
  credentials: true   // needed if sending cookies
}))
```
> CORS is enforced by **browsers** — Postman bypasses it.
```js
// Vite dev proxy (avoids CORS during development)
server: { proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } } }
```
```js
// CORS debugging
axios.get('/api/profile', { withCredentials: true })     // frontend
fetch('/api/profile', { credentials: 'include' })          // frontend
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))  // backend
// Browser sends OPTIONS preflight before POST/PATCH with custom headers
```

---

## 14. Cookies — cookie-parser
```bash
npm install cookie-parser
```
```js
app.use(cookieParser())

req.cookies.refreshToken     // read

res.cookie('refreshToken', token, {   // set
  httpOnly: true,     // not accessible by JS
  secure: true,        // HTTPS only
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days in ms
})

res.clearCookie('refreshToken')     // clear
```

---

## 15. Extra HTTP Status Codes (beyond basics)
| Code | Meaning |
|---|---|
| 301 | Moved Permanently |
| 304 | Not Modified |
| 409 | Conflict |
| 422 | Unprocessable Content |
| 429 | Too Many Requests |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

---

## 16. JWT Authentication
```bash
npm install jsonwebtoken
```
```js
const token = jwt.sign(                          // create token
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
)

const decoded = jwt.verify(token, process.env.JWT_SECRET)  // verify
// decoded → { userId, role, iat, exp }
```
| | Access Token | Refresh Token |
|---|---|---|
| Life | short (5–30 min) | long (days/weeks) |
| Purpose | access APIs | get new access token |
| Storage | memory / header | secure httpOnly cookie |

---

## 17. Password Hashing — bcrypt
```bash
npm install bcrypt
```
```js
const hash    = await bcrypt.hash(password, 10)          // hash on register
const isValid = await bcrypt.compare(password, hash)     // verify on login
```
> ❌ Never store plaintext passwords. `bcryptjs` = pure JS version, same API.

---

## 18. Auth Middleware Pattern
```js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Authentication required' })
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

app.get('/api/profile', authMiddleware, getProfile)   // protect a route
```

---

## 19. Authentication vs Authorization
| | Authentication | Authorization |
|---|---|---|
| Question | Who are you? | What can you do? |
| Mechanism | JWT verify | Role check |
| Fail status | `401` | `403` |
```js
if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
```

---

## 20. File Upload — Multer
```bash
npm install multer
```
```js
const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('video'), (req, res) => {   // single file
  console.log(req.file); res.json({ message: 'Uploaded' })
})

app.post('/upload', upload.array('files', 5), ...)   // multiple files
```
> Postman: `Body → form-data → Key: video → Type: File`
```
// Cloud upload pattern
Client → Multer (temp) → Cloud Storage (S3/Cloudinary) → URL → MongoDB
```

---

## 21. Error Handling Flow
```js
app.get('/users', async (req, res, next) => {
  try { res.json(await User.find()) }
  catch (err) { next(err) }        // forward to error middleware
})

app.use((err, req, res, next) => {   // MUST have 4 params, MUST be LAST
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' })
})
```

---

## 22. Input Validation
```js
// ❌ Never trust req.body directly
await User.create(req.body)

// ✅ Always validate first (e.g. with zod)
const schema = z.object({ name: z.string().min(2), email: z.string().email() })
const data = schema.parse(req.body)   // throws on invalid
```

---

## 23. Axios vs Fetch
```js
const { data } = await axios.get('/api/users')          // axios
const res = await fetch('/api/users'); const data = await res.json()  // fetch
```
| | Axios | Fetch |
|---|---|---|
| JSON auto-parse | ✅ | ❌ (need `.json()`) |
| Interceptors | ✅ | ❌ |
| Throws on 4xx/5xx | ✅ | ❌ (network errors only) |
| Bundle | external | built-in |

---

## 24. REST API Core Principles
```
1. Statelessness    → every request carries all needed data (no server-side session)
2. Resource-Based   → everything is a resource with a unique URL (/api/users)
3. Uniform Interface → consistent URLs (nouns) + HTTP methods (verbs)
4. Client-Server Separation → frontend/backend evolve independently
5. Cacheable        → responses mark themselves cacheable or not
```

---

## 25. CRUD → HTTP Mapping (with status codes)
| CRUD | Verb | Endpoint | Status |
|---|---|---|---|
| Create | POST | `/api/users` | 201 Created |
| Read All | GET | `/api/users` | 200 OK |
| Read One | GET | `/api/users/:id` | 200 OK |
| Update (Full) | PUT | `/api/users/:id` | 200 OK |
| Update (Partial) | PATCH | `/api/users/:id` | 200 OK |
| Delete | DELETE | `/api/users/:id` | 200 / 204 |

---

## 26. RESTful URL Naming Rules
```
✅ GOOD (nouns)
/api/users                          → plural noun for resources
/api/users/:id/orders               → nested URL for relations
/api/users?page=2&limit=10&sort=-createdAt  → query params for filter/sort/pagination

❌ BAD (verbs)
GET /api/getUsers
POST /api/createUser
POST /api/deleteUser/123
```

---

## 27. Complete REST API Example (Express)
```js
app.use(express.json())
let users = [{ id: 1, name: 'Ashish', email: 'a@x.com' }]

app.get('/api/users', (req, res) => res.status(200).json({ success: true, count: users.length, data: users }))

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === +req.params.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  res.status(200).json({ success: true, data: user })
})

app.post('/api/users', (req, res) => {
  const { name, email } = req.body
  if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' })
  const newUser = { id: users.length + 1, name, email }
  users.push(newUser)
  res.status(201).json({ success: true, data: newUser })
})

app.patch('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === +req.params.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  if (req.body.name) user.name = req.body.name
  if (req.body.email) user.email = req.body.email
  res.status(200).json({ success: true, data: user })
})

app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === +req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' })
  users.splice(index, 1)
  res.status(200).json({ success: true, message: 'User deleted successfully' })
})
```

---

## 28. Standard API Response Format
```json
// Success
{ "success": true, "message": "Resource fetched successfully", "data": { "id": 1, "name": "Ashish" } }

// Error
{ "success": false, "message": "Invalid email address provided", "error": { "code": "INVALID_INPUT" } }
```

---

## 29. REST API Best Practices
```
- Always use express.json() to parse payload
- Return appropriate HTTP status codes
- Always respond in JSON (res.json())
- Implement pagination, filtering, sorting
- Version your API (/api/v1/users)
- Handle errors centrally with error middleware
```

---

## 30. Request Params / Query / Body (Quick Recap)
```js
req.params.id       // route param → GET /users/:id
req.query.page       // query string → GET /users?page=2&limit=10
req.query.limit
req.body.name          // body → POST/PATCH { "name": "Ashish" }
```

---

## 31. Request Lifecycle
```
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

## 32. Folder Structure (Production Pattern)
```
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

## 33. Controller vs Service Pattern
```js
// Controller — HTTP layer only
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (err) { next(err) }
}

// Service — business logic (no req/res)
const createUser = async (data) => {
  // validate, hash password, save to DB, send welcome email...
}
```

---

## 34. Security Checklist
```
✅ Hash passwords (bcrypt)
✅ Never commit .env
✅ Use HTTPS in production
✅ Validate & sanitize all inputs
✅ Use auth + authz middleware
✅ Secure cookies (httpOnly, secure, sameSite)
✅ Whitelist CORS origins
✅ Rate limiting (express-rate-limit)
✅ Security headers (helmet)
✅ Limit upload file size/type
✅ Never expose stack traces in production
✅ Keep dependencies updated
```

---

## 35. HTTP Headers (Common)
```js
req.headers['authorization']    // Bearer <token>
req.headers['content-type']     // application/json
req.headers['user-agent']       // client info (can be spoofed)
req.headers['origin']           // CORS source
```

---

## 36. API Authentication Methods
| Method | Header | Best For | Pros/Cons |
|---|---|---|---|
| API Keys | `x-api-key: secret` | server-to-server | ✅ simple ❌ hard to revoke |
| HTTP Basic Auth | `Authorization: Basic base64(user:pass)` | internal tools | ✅ built-in ❌ sends creds every request |
| JWT (Bearer) | `Authorization: Bearer <token>` | SPAs, mobile apps | ✅ stateless ❌ hard to revoke early |
| OAuth 2.0 / OIDC | access token + auth server | social login, SSO | ✅ standardized ❌ complex setup |

```js
// API Key Middleware
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.API_KEY) return res.status(401).json({ success:false, message:'Invalid or missing API key' })
  next()
}

// JWT Bearer Middleware
const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success:false, message:'Authorization header missing/invalid' })
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch { res.status(401).json({ success:false, message:'Token invalid or expired' }) }
}
```

---

## 37. Interview Cheat Sheet
| Question | Quick Answer |
|---|---|
| What is REST? | Architectural style based on statelessness, HTTP verbs, resource URLs |
| What is Stateless? | Server stores no client session — every request carries all needed data (e.g. JWT) |
| PUT vs PATCH? | PUT replaces whole entity; PATCH updates specific fields |
| POST vs PUT? | POST creates new; PUT updates/replaces existing |
| Why plural nouns in URLs? | Represents a collection (`/users` not `/getUser`) |
| Status for creation? | `201 Created` |
| Status for validation failure? | `400 Bad Request` or `422 Unprocessable Content` |
| API Key vs JWT? | API Key authenticates app/client; JWT authenticates user/session statelessly |
| JWT header? | `Authorization: Bearer <token>` |
| What is Express? | Lightweight Node.js web framework for building APIs |
| What is middleware? | Function `(req, res, next)` that runs in the request pipeline |
| `app.use()` vs `app.get()`? | `use` = all methods/middleware; `get` = GET route only |
| `401` vs `403`? | 401 = not logged in; 403 = logged in, no permission |
| What is `next()`? | Passes control to next middleware / error handler |
| Access vs refresh token? | Access = short-lived API token; Refresh = long-lived, issues new access token |
| Why hash passwords? | Plaintext is dangerous if DB exposed — hashing makes it unreadable |
| What is CORS? | Browser policy controlling cross-origin requests |
| What does Multer do? | Handles `multipart/form-data` file uploads |
| What is helmet? | Middleware that sets security HTTP headers |
