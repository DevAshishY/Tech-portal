# MERN Backend Notes — Node.js, Express.js & MongoDB

A practical, interview-friendly reference for the backend side of MERN development.

---

## 1. MERN Stack Overview

**MERN** stands for:

- **MongoDB** — NoSQL database
- **Express.js** — Backend/web framework for Node.js
- **React.js** — Frontend library
- **Node.js** — JavaScript runtime

Typical request flow:

```text
React Frontend
      |
      | HTTP Request
      v
Express.js API
      |
      | Middleware
      v
Controller / Service
      |
      | Mongoose
      v
MongoDB
      |
      v
JSON Response
      |
      v
React Frontend
```

---

# 2. Node.js Basics

## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.

It allows JavaScript to run outside the browser, especially for:

- REST APIs
- Web servers
- Real-time applications
- CLI tools
- Backend services
- File processing

Node.js uses an **event-driven, non-blocking I/O model**.

### Important Node.js concepts

- Event loop
- Call stack
- Callback queue
- Promises
- `async/await`
- Modules
- `process`
- Environment variables
- Streams
- Buffers
- File system
- HTTP server

---

## Node.js vs Browser JavaScript

| Feature | Browser JS | Node.js |
|---|---|---|
| Runs in | Browser | Server/runtime |
| DOM | Yes | No |
| `window` | Yes | No |
| File system | Restricted | Yes |
| HTTP server | No | Yes |
| `process` | No | Yes |
| npm | No | Yes |

---

# 3. npm

**npm** is the package manager commonly used with Node.js.

Initialize a project:

```bash
npm init
```

or:

```bash
npm init -y
```

Install a package:

```bash
npm install express
```

Install a development dependency:

```bash
npm install --save-dev nodemon
```

Short form:

```bash
npm i -D nodemon
```

### Dependency vs devDependency

`dependencies` are required when the application runs in production.

Examples:

```text
express
mongoose
jsonwebtoken
bcrypt
cors
cookie-parser
multer
dotenv
```

`devDependencies` are primarily used during development/building.

Examples:

```text
nodemon
prettier
eslint
typescript
```

---

# 4. package.json

Example:

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

Run:

```bash
npm start
```

Development:

```bash
npm run dev
```

---

# 5. Express.js

## What is Express?

Express.js is a minimal and flexible web application framework for Node.js.

It provides features for:

- Routing
- Middleware
- HTTP APIs
- Request/response handling
- Error handling
- Serving static files

Install:

```bash
npm install express
```

Basic server:

```js
const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

# 6. Express Request and Response

Typical route:

```js
app.get("/users", (req, res) => {
  res.status(200).json({
    message: "Users fetched successfully"
  });
});
```

Important objects:

### `req`

Contains information about the incoming request.

Examples:

```js
req.params
req.query
req.body
req.headers
req.cookies
req.file
req.files
```

### `res`

Used to send the response.

Examples:

```js
res.json()
res.send()
res.status()
res.sendFile()
res.cookie()
res.redirect()
```

### `next`

Used by middleware to pass control to the next middleware/handler.

```js
app.use((req, res, next) => {
  console.log("Middleware executed");
  next();
});
```

---

# 7. HTTP Methods

Common HTTP methods:

| Method | Purpose |
|---|---|
| GET | Read/fetch data |
| POST | Create data |
| PUT | Replace/update a resource |
| PATCH | Partially update a resource |
| DELETE | Delete data |
| HEAD | Get headers without response body |
| OPTIONS | Get supported communication/options |
| TRACE | Diagnostic request |

Example:

```js
app.get("/users", getUsers);
app.post("/users", createUser);
app.patch("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);
```

A REST API can use the same endpoint with different HTTP methods:

```text
GET    /users
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

This is normal REST design.

---

# 8. `app.get()` vs `app.use()`

## `app.get()`

Handles a specific GET request.

```js
app.get("/users", (req, res) => {
  res.json([]);
});
```

## `app.use()`

Registers middleware or mounts a router.

```js
app.use(express.json());

app.use("/api/users", userRouter);
```

Think:

```text
app.get() -> handles a route/method

app.use() -> middleware/router mounting
```

---

# 9. Express Middleware

Middleware is a function that runs between the request and the final response.

Basic structure:

```js
(req, res, next) => {
  // logic
  next();
}
```

Example:

```js
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

Middleware can:

- Validate requests
- Authenticate users
- Log requests
- Parse JSON
- Handle CORS
- Upload files
- Handle errors
- Modify `req` or `res`

### Middleware order matters

```js
app.use(express.json());
app.use(authMiddleware);
app.use("/api/users", userRouter);
```

Middleware generally executes in the order it is registered.

---

# 10. Built-in Express Middleware

## JSON body parser

```js
app.use(express.json());
```

Allows Express to read JSON request bodies.

Example request:

```json
{
  "name": "Ashish",
  "email": "ashish@example.com"
}
```

Access:

```js
req.body.name
```

## URL encoded data

```js
app.use(express.urlencoded({ extended: true }));
```

## Static files

```js
app.use(express.static("dist"));
```

This can serve files from the `dist` directory.

---

# 11. Express Router

Instead of putting every API in `app.js`, use routers.

### `user.routes.js`

```js
const express = require("express");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
```

### `app.js`

```js
app.use("/api/users", userRouter);
```

Final endpoints:

```text
GET  /api/users
POST /api/users
```

---

# 12. Environment Variables — dotenv

`dotenv` loads variables from a `.env` file into `process.env`.

Install:

```bash
npm install dotenv
```

`.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=my-secret
```

Load:

```js
require("dotenv").config();
```

Use:

```js
process.env.PORT
process.env.MONGO_URI
process.env.JWT_SECRET
```

Never commit secrets to Git.

---

# 13. `.gitignore`

`.gitignore` tells Git which files/folders should not be committed.

Typical Node.js `.gitignore`:

```gitignore
node_modules/
.env
dist/
build/
coverage/
*.log
.DS_Store
```

Do not push:

- `node_modules`
- `.env`
- Secrets
- Private keys
- Build output when it is generated by CI/deployment

---

# 14. Prettier

Prettier is a code formatter.

Install:

```bash
npm install --save-dev prettier
```

Example:

```bash
npx prettier --write .
```

Prettier helps keep code formatting consistent across a team.

---

# 15. Nodemon

Nodemon automatically restarts the Node.js server when files change.

Install:

```bash
npm install --save-dev nodemon
```

`package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/index.js"
  }
}
```

Run:

```bash
npm run dev
```

---

# 16. CORS

## What is CORS?

CORS means **Cross-Origin Resource Sharing**.

It controls whether a browser is allowed to make requests from one origin to another.

Example:

```text
Frontend:
https://app.example.com

Backend:
https://api.example.com
```

These are different origins.

---

## Backend CORS

Install:

```bash
npm install cors
```

Basic:

```js
const cors = require("cors");

app.use(cors());
```

For production, whitelist trusted origins:

```js
app.use(
  cors({
    origin: [
      "https://app.example.com",
      "https://admin.example.com"
    ],
    credentials: true
  })
);
```

### Important

CORS is primarily enforced by browsers.

A frontend proxy can also avoid browser cross-origin problems during development.

Example Vite proxy:

```js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true
    }
  }
}
```

A frontend proxy is not a replacement for proper production CORS configuration.

---

# 17. Cookies and cookie-parser

Install:

```bash
npm install cookie-parser
```

Use:

```js
const cookieParser = require("cookie-parser");

app.use(cookieParser());
```

Read a cookie:

```js
req.cookies.token
```

Set a cookie:

```js
res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict"
});
```

Cookie options depend on your deployment architecture.

---

# 18. HTTP Status Codes

## 2xx — Success

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 202 | Accepted |
| 204 | No Content |

## 3xx — Redirection

| Code | Meaning |
|---|---|
| 301 | Moved Permanently |
| 302 | Found |
| 304 | Not Modified |

## 4xx — Client Error

| Code | Meaning |
|---|---|
| 400 | Bad Request |
| 401 | Unauthorized / authentication required |
| 403 | Forbidden |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 409 | Conflict |
| 422 | Unprocessable Content |
| 429 | Too Many Requests |

## 5xx — Server Error

| Code | Meaning |
|---|---|
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### Important interview difference

```text
401 -> user is not authenticated / token is missing or invalid

403 -> user is authenticated but does not have permission
```

---

# 19. MongoDB

MongoDB is a **NoSQL document database**.

Data is stored as BSON documents.

Basic structure:

```text
Database
  |
  +-- Collection
        |
        +-- Document
        +-- Document
```

Example document:

```json
{
  "_id": "123",
  "name": "Ashish",
  "age": 30
}
```

---

# 20. BSON

BSON means **Binary JSON**.

MongoDB internally stores documents using BSON.

BSON supports types beyond normal JSON, such as:

- ObjectId
- Date
- Binary data
- Decimal128
- Int32/Int64

Example:

```js
{
  _id: new ObjectId(),
  createdAt: new Date()
}
```

---

# 21. MongoDB vs SQL Database

| MongoDB | SQL |
|---|---|
| NoSQL | Relational |
| Database → Collection | Database → Table |
| Collection → Document | Table → Row |
| Field | Column |
| Flexible document schema | Usually structured schema |
| Embedded documents common | Joins/relations common |
| BSON | Rows/columns |
| MongoDB query language | SQL |

MongoDB is not automatically "better" than SQL. Choose based on application requirements.

---

# 22. Mongoose

Mongoose is an ODM (**Object Data Modeling**) library for MongoDB and Node.js.

Install:

```bash
npm install mongoose
```

Connect:

```js
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
```

---

# 23. Mongoose Schema

A schema defines the structure and validation rules for documents handled by Mongoose.

```js
const productSchema = new mongoose.Schema({
  title: String,
  price: Number
});
```

---

# 24. Mongoose Model and Collection Name

```js
const Product = mongoose.model("Product", productSchema);
```

By default, Mongoose pluralizes the model name.

```text
Model:
Product

Collection:
products
```

Example:

```js
const User = mongoose.model("User", userSchema);
```

Default collection:

```text
users
```

You can explicitly specify the collection:

```js
const productSchema = new mongoose.Schema(
  {
    title: String,
    price: Number
  },
  {
    collection: "my_products"
  }
);
```

---

# 25. Mongoose Schema Validation

Example:

```js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  age: {
    type: Number,
    min: 18
  }
});
```

Common validation options:

```text
required
unique
min
max
enum
match
minLength
maxLength
default
```

Important: `unique: true` is primarily an index/uniqueness mechanism, not a normal Mongoose validator.

---

# 26. CRUD Operations

## Create

```js
const user = await User.create({
  name: "Ashish",
  email: "ashish@example.com"
});
```

## Read

```js
const users = await User.find();
```

One document:

```js
const user = await User.findById(id);
```

Or:

```js
const user = await User.findOne({
  email: "ashish@example.com"
});
```

## Update

```js
await User.findByIdAndUpdate(
  id,
  { name: "New Name" },
  { new: true, runValidators: true }
);
```

## Delete

```js
await User.findByIdAndDelete(id);
```

---

# 27. MongoDB Query Operators

Common operators:

```text
$eq
$ne
$gt
$gte
$lt
$lte
$in
$nin
$and
$or
$exists
$regex
```

Example:

```js
User.find({
  age: { $gte: 18 }
});
```

Multiple conditions:

```js
User.find({
  age: { $gte: 18 },
  isActive: true
});
```

---

# 28. MongoDB Indexing

An index improves query performance for frequently searched fields.

Example:

```js
userSchema.index({ email: 1 });
```

Compound index:

```js
userSchema.index({
  status: 1,
  createdAt: -1
});
```

### Important

Indexes improve reads but have costs:

- Additional storage
- Extra write/update work
- Memory usage

Do not create indexes blindly.

Use query analysis such as:

```js
db.users.find({ email: "test@example.com" }).explain("executionStats")
```

---

# 29. Pagination

Never return thousands or millions of documents in one API response.

Basic pagination:

```js
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;

const skip = (page - 1) * limit;

const users = await User.find()
  .skip(skip)
  .limit(limit);
```

Example:

```text
GET /api/users?page=2&limit=10
```

For very large datasets, **cursor-based pagination** can be more efficient than large `skip` values.

---

# 30. Sorting

```js
const users = await User.find()
  .sort({ createdAt: -1 });
```

Common:

```text
1  -> ascending
-1 -> descending
```

---

# 31. Projection

Return only required fields:

```js
const users = await User.find()
  .select("name email");
```

Exclude:

```js
.select("-password")
```

Never return password hashes unnecessarily.

---

# 32. Population

Used to resolve referenced documents.

Schema:

```js
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
```

Query:

```js
Order.find().populate("user");
```

This is useful for references, but avoid excessive population when it creates expensive queries.

---

# 33. MongoDB Relationships

Example:

```text
User
  |
  +-- Orders
```

Reference:

```js
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
```

MongoDB also supports embedded documents.

Choose between:

- Embedding
- Referencing

based on access patterns, document size, update patterns, and data relationships.

---

# 34. MongoDB Aggregation

Aggregation processes documents through a pipeline.

Example:

```js
Order.aggregate([
  {
    $match: {
      status: "completed"
    }
  },
  {
    $group: {
      _id: "$user",
      totalOrders: { $sum: 1 }
    }
  }
]);
```

Common stages:

```text
$match
$group
$project
$sort
$limit
$skip
$lookup
$unwind
$count
$facet
```

Think of aggregation as:

```text
Documents
   |
$match
   |
$group
   |
$sort
   |
$project
   |
Result
```

---

# 35. Transactions

Transactions allow multiple database operations to succeed or fail together.

Useful when consistency across multiple writes is important.

Mongoose example:

```js
const session = await mongoose.startSession();

try {
  session.startTransaction();

  await User.updateOne(
    { _id: userId },
    { $inc: { balance: -100 } },
    { session }
  );

  await Order.create(
    [{
      user: userId,
      amount: 100
    }],
    { session }
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}
```

---

# 36. JWT Authentication

JWT means **JSON Web Token**.

Typical authentication flow:

```text
Login
  |
  v
Validate email/password
  |
  v
Generate access token
  |
  v
Generate refresh token
  |
  v
Client stores/sends token
  |
  v
Protected API
  |
  v
JWT verification
```

Install:

```bash
npm install jsonwebtoken
```

Create token:

```js
const token = jwt.sign(
  {
    userId: user._id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "15m"
  }
);
```

Verify:

```js
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);
```

---

# 37. Access Token vs Refresh Token

## Access Token

Usually:

- Short-lived
- Used to access protected APIs
- Example: 5–30 minutes

## Refresh Token

Usually:

- Longer-lived
- Used to obtain a new access token
- Should be protected carefully

Example:

```text
Access token  -> short life
Refresh token -> long life
```

Do not make access tokens unnecessarily long-lived.

A common design is to keep refresh tokens in secure, `HttpOnly` cookies.

---

# 38. Password Hashing — bcrypt

Passwords should never be stored as plain text.

Install:

```bash
npm install bcrypt
```

Hash:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

Compare:

```js
const isValid = await bcrypt.compare(
  password,
  hashedPassword
);
```

### bcrypt vs bcryptjs

Both implement bcrypt password hashing.

- `bcrypt` generally uses native bindings.
- `bcryptjs` is a JavaScript implementation and can be easier to install in some environments.

The important security principle is the same: **hash passwords; never store plaintext passwords.**

---

# 39. Authentication Middleware

Example:

```js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
```

Use:

```js
app.get(
  "/api/profile",
  authMiddleware,
  getProfile
);
```

---

# 40. File Upload — Multer

Multer is middleware for handling `multipart/form-data`, commonly used for file uploads.

Install:

```bash
npm install multer
```

Example:

```js
const multer = require("multer");

const upload = multer({
  dest: "uploads/"
});
```

Route:

```js
app.post(
  "/upload",
  upload.single("video"),
  (req, res) => {
    console.log(req.file);

    res.json({
      message: "File uploaded"
    });
  }
);
```

For multiple files:

```js
upload.array("files", 5)
```

---

# 41. Upload Video to Cloud Storage

Do not normally store large video files directly inside MongoDB documents.

Common architecture:

```text
Client
  |
  | multipart/form-data
  v
Express + Multer
  |
  v
Cloud Storage
  |
  v
Cloud URL
  |
  v
MongoDB stores URL + metadata
```

Cloudinary is one option for media storage/processing.

MongoDB can store:

```js
{
  videoUrl: "https://...",
  publicId: "...",
  size: 123456,
  uploadedAt: Date
}
```

The large binary file itself can remain in object/media storage.

---

# 42. Sending File Through Postman

In Postman:

```text
POST
Body
  -> form-data
```

Add:

```text
Key: video
Type: File
Value: select your video
```

The key must match:

```js
upload.single("video")
```

For example:

```text
Postman key: video
Multer key: video
```

---

# 43. URL vs URI vs URN

### URL

Uniform Resource Locator.

Identifies a resource and tells you where/how to access it.

Example:

```text
https://example.com/users/123
```

### URI

Uniform Resource Identifier.

A broader identifier concept.

A URL is a type of URI.

### URN

Uniform Resource Name.

Identifies a resource by name rather than location.

Example:

```text
urn:isbn:9780131103627
```

Simple way to remember:

```text
URI -> identifies
URL -> identifies + location/access method
URN -> identifies by persistent name
```

---

# 44. HTTP Headers

Headers contain metadata about a request or response.

Examples:

```text
Authorization
Content-Type
Accept
User-Agent
Cookie
Cache-Control
Origin
Referer
```

Read a header:

```js
req.headers["user-agent"]
```

---

# 45. User-Agent

The `User-Agent` request header commonly contains information about the client, such as browser/engine and operating system details.

Example:

```js
console.log(req.headers["user-agent"]);
```

Do not treat User-Agent as a strong security identity mechanism because it can be spoofed.

---

# 46. HEAD Method

`HEAD` is similar to `GET`, but the server returns headers without the response body.

Useful for checking:

- Resource existence
- Content type
- Content length
- Cache metadata
- Last modified information

Example:

```http
HEAD /api/users/123
```

---

# 47. OPTIONS Method

`OPTIONS` asks what communication options are available for a resource.

Example:

```http
OPTIONS /api/users
```

It is also important in CORS because browsers can send a **preflight request** before certain cross-origin requests.

Common preflight:

```text
OPTIONS /api/users
```

---

# 48. TRACE Method

`TRACE` is an HTTP diagnostic method.

It can be used to test how a request travels through intermediaries such as proxies.

It is commonly disabled in production because of security considerations.

---

# 49. Axios

Install:

```bash
npm install axios
```

GET:

```js
import axios from "axios";

const response = await axios.get(
  "/api/users"
);

console.log(response.data);
```

POST:

```js
const response = await axios.post(
  "/api/users",
  {
    name: "Ashish",
    email: "ashish@example.com"
  }
);
```

PATCH:

```js
await axios.patch(
  `/api/users/${id}`,
  {
    name: "New Name"
  }
);
```

DELETE:

```js
await axios.delete(
  `/api/users/${id}`
);
```

---

# 50. Fetch API

Fetch is built into modern browsers and modern Node.js versions.

GET:

```js
const response = await fetch("/api/users");

const data = await response.json();
```

POST:

```js
const response = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Ashish"
  })
});

const data = await response.json();
```

### Axios vs Fetch

| Axios | Fetch |
|---|---|
| External package | Built-in in modern environments |
| Automatic JSON response handling | Call `response.json()` |
| Convenient interceptors | Can use wrappers/service functions |
| Convenient defaults | More low-level |
| Widely used in React projects | Native web API |

---

# 51. Error Handling in Express

Express error middleware has four parameters:

```js
(err, req, res, next)
```

Example:

```js
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error"
  });
});
```

Important: error middleware should generally be registered after the routes/middleware it is intended to handle.

---

# 52. Async Error Handling

Example:

```js
app.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    next(error);
  }
});
```

A centralized error handler keeps API responses consistent.

---

# 53. Common Node.js Errors

Important error types/concepts:

```text
SyntaxError
TypeError
ReferenceError
RangeError
Error
```

Example:

```js
try {
  // risky operation
} catch (error) {
  console.error(error.message);
}
```

For async operations:

```js
try {
  const user = await User.findById(id);
} catch (error) {
  next(error);
}
```

Never expose internal stack traces or secrets to clients in production.

---

# 54. REST API Design

Good REST-style design:

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Avoid action-heavy URLs where a resource-oriented design is sufficient:

```text
POST /api/deleteUser
```

Prefer:

```text
DELETE /api/users/:id
```

Use HTTP methods to express the operation.

---

# 55. API Response Format

A consistent response format is useful.

Example:

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "123",
    "name": "Ashish"
  }
}
```

Error:

```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "USER_NOT_FOUND"
  }
}
```

The exact format should be standardized across the project.

---

# 56. Query Params, Params and Body

## Route Params

```text
GET /users/123
```

Access:

```js
req.params.id
```

## Query Params

```text
GET /users?page=2&limit=10
```

Access:

```js
req.query.page
req.query.limit
```

## Body

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Ashish"
}
```

Access:

```js
req.body.name
```

---

# 57. Request Lifecycle

Example:

```text
Request
  |
  v
CORS Middleware
  |
  v
JSON Parser
  |
  v
Logger
  |
  v
Authentication
  |
  v
Router
  |
  v
Controller
  |
  v
Service
  |
  v
Mongoose
  |
  v
MongoDB
  |
  v
Response
```

This is a useful mental model for debugging Express applications.

---

# 58. Recommended Backend Folder Structure

A scalable Express application can look like:

```text
src/
├── config/
│   └── db.js
│
├── controllers/
│   ├── user.controller.js
│   └── order.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── upload.middleware.js
│
├── models/
│   ├── user.model.js
│   └── order.model.js
│
├── routes/
│   ├── user.routes.js
│   └── order.routes.js
│
├── services/
│   ├── user.service.js
│   └── order.service.js
│
├── utils/
│   ├── jwt.js
│   └── response.js
│
├── app.js
└── server.js
```

Simple projects can use fewer layers. Do not create unnecessary abstraction just for the sake of structure.

---

# 59. Controller vs Service

### Controller

Handles HTTP concerns:

```text
req
res
status codes
request validation
```

### Service

Handles business logic:

```text
create order
calculate price
process payment
update inventory
```

Example:

```js
// controller
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
```

---

# 60. Security Basics

For a production MERN backend:

- Never store plaintext passwords.
- Never commit `.env`.
- Use HTTPS.
- Validate request input.
- Sanitize data where appropriate.
- Use authentication middleware.
- Implement authorization.
- Use secure cookies where appropriate.
- Configure CORS correctly.
- Add rate limiting.
- Set security headers.
- Limit upload file size/type.
- Do not expose stack traces in production.
- Keep dependencies updated.
- Do not trust client-side validation alone.

Useful packages may include:

```text
helmet
express-rate-limit
cors
jsonwebtoken
bcrypt
zod / joi / express-validator
```

---

# 61. Authentication vs Authorization

## Authentication

Answers:

> Who are you?

Example:

```text
JWT verification
```

## Authorization

Answers:

> What are you allowed to do?

Example:

```text
Admin -> delete users
User  -> update own profile
```

Example:

```js
if (req.user.role !== "admin") {
  return res.status(403).json({
    message: "Forbidden"
  });
}
```

---

# 62. Input Validation

Never assume `req.body` is valid.

Bad:

```js
const user = await User.create(req.body);
```

Better:

```text
Request
  |
  v
Validate
  |
  v
Sanitize/normalize
  |
  v
Business logic
  |
  v
Database
```

Example with a validation library:

```js
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});
```

---

# 63. Rate Limiting

Rate limiting helps protect APIs from excessive requests.

Example concept:

```text
100 requests / 15 minutes / IP
```

Useful for:

- Login
- OTP
- Password reset
- Public APIs
- Expensive endpoints

---

# 64. HTTP Content Types

Common:

```text
application/json
multipart/form-data
application/x-www-form-urlencoded
text/plain
```

JSON API:

```http
Content-Type: application/json
```

File upload:

```http
Content-Type: multipart/form-data
```

---

# 65. File Storage Options

Possible approaches:

### MongoDB GridFS

Useful when storing large files inside MongoDB's ecosystem.

### Object storage

Examples:

```text
Amazon S3
Google Cloud Storage
Azure Blob Storage
```

### Media platforms

Example:

```text
Cloudinary
```

Common production architecture:

```text
File -> Object/Media Storage
Metadata + URL -> MongoDB
```

---

# 66. MongoDB Compass

MongoDB Compass is a graphical user interface for MongoDB.

It can be used to:

- Connect to MongoDB
- View databases
- View collections
- Inspect documents
- Run queries
- Create indexes
- Analyze schemas
- Run aggregation pipelines

---

# 67. MongoDB Atlas

MongoDB Atlas is MongoDB's managed cloud database service.

Typical architecture:

```text
React
  |
Express / Node.js
  |
Internet
  |
MongoDB Atlas
```

Do not expose database credentials in frontend code.

---

# 68. Moon Modeler

Moon Modeler is a database/schema design and visualization tool.

It can help with:

- MongoDB schema design
- Data modeling
- Relationships
- Visual database documentation

It is a design/modeling tool, while MongoDB itself is the database.

---

# 69. MongoDB Schema Design

MongoDB does not require every document to have exactly the same structure.

But a production application should still have deliberate data modeling.

Questions to ask:

1. How will the data be queried?
2. Which fields are frequently searched?
3. Should data be embedded or referenced?
4. How large can the document become?
5. How frequently is the data updated?
6. Which indexes are required?
7. Do we need transactions?

---

# 70. Embedding vs Referencing

## Embedding

```js
{
  name: "Ashish",
  address: {
    city: "Gurgaon",
    country: "India"
  }
}
```

Good when the embedded data:

- Belongs closely to the parent
- Is read together
- Has bounded size

## Referencing

```js
{
  user: ObjectId("...")
}
```

Good when:

- Data is shared
- Data is large
- Independent updates are common
- Relationship needs to be managed separately

---

# 71. API Debugging

When an API fails, check in this order:

```text
1. URL
2. HTTP method
3. Request headers
4. Request body
5. Authentication
6. CORS
7. Middleware
8. Route
9. Controller
10. Service/business logic
11. Database query
12. Database connection
13. Response
```

Use:

- Postman
- Browser DevTools
- Server logs
- MongoDB Compass
- MongoDB query profiler/explain
- Network tab

---

# 72. Postman Basics

For JSON API:

```text
Method: POST

Body
 -> raw
 -> JSON
```

Example:

```json
{
  "name": "Ashish",
  "email": "ashish@example.com"
}
```

Header:

```text
Content-Type: application/json
```

For authentication:

```text
Authorization: Bearer <access_token>
```

For file upload:

```text
Body
 -> form-data
 -> Type: File
```

---

# 73. CORS Debugging

If frontend shows a CORS error:

Check:

```text
Frontend origin
Backend allowed origin
HTTP method
Request headers
Credentials
OPTIONS/preflight request
```

Backend example:

```js
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
```

If cookies are involved, frontend requests may also need credentials:

```js
axios.get("/api/profile", {
  withCredentials: true
});
```

For fetch:

```js
fetch("/api/profile", {
  credentials: "include"
});
```

---

# 74. Common Interview Questions

## Express

### What is Express?

A lightweight web framework for Node.js used to build APIs and web applications.

### What is middleware?

A function that runs during the request-response lifecycle and can modify the request/response or pass control using `next()`.

### Difference between `app.use()` and `app.get()`?

```text
app.use() -> middleware/router mounting
app.get() -> GET route handler
```

### What are `req`, `res`, and `next`?

```text
req  -> request
res  -> response
next -> next middleware
```

---

# 75. MongoDB Interview Questions

### What is MongoDB?

A NoSQL document database that stores BSON documents in collections.

### What is Mongoose?

An ODM library for Node.js and MongoDB.

### What is a schema?

A Mongoose schema defines structure, types, defaults, validation and other model behavior.

### What is a model?

A Mongoose model is compiled from a schema and provides an interface for interacting with a MongoDB collection.

### Why does `Product` become `products`?

Mongoose normally pluralizes the model name when determining the default collection name.

### What is an index?

A data structure that helps MongoDB find documents efficiently for supported queries.

### What is aggregation?

A pipeline for transforming, filtering, grouping and analyzing MongoDB documents.

---

# 76. Authentication Interview Questions

### Access token vs refresh token?

```text
Access token  -> short-lived, API access
Refresh token -> longer-lived, obtain new access token
```

### Why hash passwords?

Plaintext passwords are dangerous. Hashing makes stored credentials much harder to use directly if the database is exposed.

### Authentication vs authorization?

```text
Authentication -> Who are you?
Authorization  -> What can you access?
```

---

# 77. HTTP Interview Questions

### Common methods?

```text
GET
POST
PUT
PATCH
DELETE
HEAD
OPTIONS
TRACE
```

### What is HEAD?

Gets response headers without the response body.

### What is OPTIONS?

Describes supported communication/options and is commonly involved in CORS preflight requests.

### What is TRACE?

A diagnostic HTTP method used to inspect how a request is received through intermediaries.

---

# 78. Useful REST API Example

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id

GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id

POST   /api/uploads
```

---

# 79. Example MERN Backend Flow

## Register

```text
React
  |
POST /api/auth/register
  |
Express
  |
Validation
  |
bcrypt.hash()
  |
MongoDB
  |
201 Created
```

## Login

```text
React
  |
POST /api/auth/login
  |
Express
  |
Find User
  |
bcrypt.compare()
  |
Generate JWT
  |
Send tokens
```

## Protected API

```text
React
  |
GET /api/profile
  |
Authorization
  |
JWT Middleware
  |
Controller
  |
MongoDB
  |
JSON Response
```

---

# 80. Production Checklist

- [ ] Use environment variables for secrets
- [ ] Add `.env` to `.gitignore`
- [ ] Never commit `node_modules`
- [ ] Use HTTPS
- [ ] Configure CORS whitelist
- [ ] Validate input
- [ ] Hash passwords
- [ ] Implement authentication
- [ ] Implement authorization
- [ ] Use short-lived access tokens
- [ ] Protect refresh tokens
- [ ] Add rate limiting
- [ ] Add security headers
- [ ] Restrict file uploads
- [ ] Add database indexes based on real query patterns
- [ ] Add pagination
- [ ] Centralize error handling
- [ ] Add logging/monitoring
- [ ] Keep dependencies updated
- [ ] Use least-privilege database credentials
- [ ] Do not expose sensitive information in API responses

---

# 81. Quick MERN Backend Cheat Sheet

```text
Node.js
  -> JavaScript runtime

Express
  -> Node.js web/API framework

npm
  -> Package manager

dotenv
  -> Loads .env into process.env

nodemon
  -> Restarts server during development

Prettier
  -> Code formatter

CORS
  -> Browser cross-origin access control

Middleware
  -> Runs during request/response lifecycle

Mongoose
  -> MongoDB ODM

MongoDB
  -> NoSQL document database

BSON
  -> Binary JSON document format

JWT
  -> Token-based authentication

bcrypt
  -> Password hashing

Multer
  -> multipart/form-data/file upload middleware

Cookie-parser
  -> Parses cookies

Axios
  -> HTTP client

Fetch
  -> HTTP API available in modern browsers/Node.js

Aggregation
  -> MongoDB data processing pipeline

Index
  -> Improves supported query performance

Pagination
  -> Returns data in manageable pages

Authentication
  -> Who are you?

Authorization
  -> What are you allowed to do?
```

---

# 82. Recommended Learning Order

For a MERN developer, learn backend in this order:

```text
1. JavaScript fundamentals
2. Async JavaScript
3. Promises and async/await
4. Node.js fundamentals
5. npm/package.json
6. HTTP fundamentals
7. Express
8. Routing
9. Middleware
10. REST API design
11. MongoDB basics
12. Mongoose
13. CRUD
14. Validation
15. Indexing
16. Aggregation
17. Pagination
18. Authentication
19. JWT
20. bcrypt
21. Cookies
22. CORS
23. File uploads
24. Error handling
25. Security
26. Testing
27. Logging
28. Deployment
```

---

# 83. Final Interview Revision

Before a MERN backend interview, be able to explain these without looking at notes:

```text
What is Node.js?
What is Express?
What is middleware?
What are req, res and next?
app.use() vs app.get()
What is REST?
GET vs POST vs PUT vs PATCH vs DELETE
HEAD vs OPTIONS
What is CORS?
How does CORS preflight work?
What is JWT?
Access token vs refresh token
Authentication vs authorization
How do you hash passwords?
bcrypt vs bcryptjs
What is MongoDB?
MongoDB vs SQL
What is BSON?
What is Mongoose?
Schema vs Model
Why does Mongoose pluralize collection names?
How do you perform CRUD?
What is populate?
Embedding vs referencing
What is an index?
What is aggregation?
What is pagination?
What is a transaction?
How do you upload files with Multer?
How do you upload a video to cloud storage?
How do you handle Express errors?
How do you secure a MERN API?
How do you debug CORS?
How do you structure an Express project?
```

---

## One-line Mental Model

```text
Node.js
= Runtime

Express
= API/Web framework

Middleware
= Request processing layer

Mongoose
= MongoDB ODM

MongoDB
= Database

JWT
= Authentication mechanism

bcrypt
= Password hashing

Multer
= File upload middleware

CORS
= Browser cross-origin policy

Aggregation
= MongoDB data processing

Index
= Faster supported queries

React
= Frontend

MERN
= MongoDB + Express + React + Node.js
```
