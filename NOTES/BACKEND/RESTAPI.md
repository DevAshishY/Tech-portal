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
