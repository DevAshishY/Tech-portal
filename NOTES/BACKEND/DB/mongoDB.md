---

## Part A — MongoDB Basics

### MG-1. What is MongoDB?

A **NoSQL document database**. Data is stored as flexible JSON-like documents (BSON).

**Real-life:** a filing cabinet (database) → drawers (collections) → folders (documents). Each folder can hold different papers.

```text
Database → Collection → Document
```

```json
{
  "_id": "60d5ec49f1a2c82b88f34112",
  "name": "Ashish",
  "email": "ashish@example.com",
  "age": 25,
  "createdAt": "2026-09-03T12:00:00.000Z"
}
```

🎯 **Interview:** "MongoDB stores JSON-like documents with a flexible schema and scales horizontally with sharding."

### MG-2. MongoDB vs SQL?

| | MongoDB (NoSQL) | SQL (Relational) |
|---|---|---|
| Structure | Database → Collection → Document | Database → Table → Row |
| Schema | flexible | fixed |
| Relationships | embed or reference | foreign keys + JOINs |
| Format | BSON / JSON | rows and columns |
| Scaling | horizontal (sharding) | mostly vertical |
| Query language | MQL | SQL |
| Transactions | supported (multi-doc since 4.0) | core feature |

**Real-life:** SQL = an Excel sheet where every row has the same columns. MongoDB = a stack of forms where each form can have extra fields.

🎯 **When to choose:** MongoDB for flexible or fast-changing data (catalogues, content, logs). SQL for strongly related data needing complex joins (banking, accounting).

### MG-3. What is BSON? What is `ObjectId`?

**BSON = Binary JSON.** It adds extra types: `ObjectId`, `Date`, `Binary`, `Decimal128`, `Int32`, `Int64`.

**`ObjectId`** = a 12-byte unique ID MongoDB gives every document as `_id`. It contains a **timestamp**, so IDs roughly sort by creation time.

**Real-life:** a parcel tracking number that also tells you when it was posted.

```js
const id = new mongoose.Types.ObjectId();
id.getTimestamp(); // creation time
mongoose.isValidObjectId("abc"); // false → validate before findById
```

### MG-4. Native driver vs Mongoose?

| | Native `mongodb` driver | Mongoose |
|---|---|---|
| What | official low-level driver | ODM built on top of the driver |
| Schema | ❌ none | ✅ schemas, validation, defaults |
| Extras | — | middleware (hooks), populate, virtuals |
| Speed | slightly faster | small overhead |

**Real-life:** driver = driving a manual car. Mongoose = automatic with parking sensors.

🎯 "MERN apps usually use Mongoose for structure and validation; the native driver is fine for scripts or maximum control."

---

## Part B — Native MongoDB Driver

### MG-5. How do you connect and create a database/collection?

```js
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");

async function run() {
  await client.connect();
  const db = client.db("mydb");                 // created on first write
  await db.createCollection("customers");       // create
  await db.collection("customers").drop();      // drop
}
```

**Real-life:** MongoDB creates the drawer the first time you put a folder in it.

⚠️ A database or collection doesn't really exist until it has data.

### MG-6. How do you insert documents?

```js
await db.collection("customers").insertOne({ name: "Ashish", address: "Gurgaon" });

await db.collection("customers").insertMany([
  { name: "John", address: "Delhi" },
  { name: "Peter", address: "Noida" },
]);
```

### MG-7. How do you find and query?

```js
const one  = await db.collection("customers").findOne({});
const all  = await db.collection("customers").find({}).toArray();            // toArray() needed
const delhi = await db.collection("customers").find({ address: "Delhi" }).toArray();
const startsD = await db.collection("customers").find({ address: /^D/ }).toArray();
```

⚠️ Driver `find()` returns a **cursor**; call `.toArray()`. Mongoose `find()` returns the array directly.

**Real-life:** a cursor is a bookmark you move through; `toArray()` photocopies every page at once.

### MG-8. How do you sort, limit and update?

```js
await db.collection("customers").find().sort({ name: 1 }).toArray();  // 1 asc, -1 desc
await db.collection("customers").find().limit(5).toArray();

await db.collection("customers").updateOne({ name: "Ashish" }, { $set: { address: "Delhi" } });
await db.collection("customers").updateMany({ address: "Delhi" }, { $set: { status: "active" } });
```

⚠️ In the driver, updates **need** an operator like `$set`. Without it you get an error (or replace the doc with `replaceOne`).

### MG-9. How do you delete?

```js
await db.collection("customers").deleteOne({ name: "Peter" });
await db.collection("customers").deleteMany({ address: "Noida" });
```

⚠️ `deleteMany({})` deletes **everything**.

### MG-10. Driver vs Mongoose: method cheat sheet

| Operation | Native driver | Mongoose |
|---|---|---|
| Connect | `client.connect()` | `mongoose.connect()` |
| Insert one | `insertOne()` | `Model.create()` / `doc.save()` |
| Insert many | `insertMany()` | `Model.insertMany()` |
| Find one | `findOne()` | `findOne()` / `findById()` |
| Find all | `find().toArray()` | `Model.find()` |
| Update one | `updateOne(filter, { $set })` | `updateOne()` / `findByIdAndUpdate()` |
| Delete one | `deleteOne()` | `deleteOne()` / `findByIdAndDelete()` |
| Drop | `collection.drop()` | `Model.collection.drop()` |

---

## Part C — Mongoose: Schema, Model & CRUD

### MG-11. What is Mongoose, and how do you connect?

An **ODM (Object Data Modeling)** library: schemas, validation, hooks and relationships on top of MongoDB.

**Real-life:** a form with rules (required fields, formats) in front of a filing cabinet.

```bash
npm install mongoose
```

```js
// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // don't run the API without a DB
  }
};

module.exports = connectDB;
```

🎯 Connect **once** at startup and reuse the connection; never connect per request.

### MG-12. Schema vs Model?

- **Schema** = the **blueprint**: fields, types, defaults, validation.
- **Model** = the **tool** built from it: query and CRUD (`User.find()`).

**Real-life:** schema = a house plan. Model = the builder who builds and repairs houses using that plan.

```js
const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age:   { type: Number, min: [18, "Must be at least 18"] },
    role:  { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, required: true, select: false }, // hidden by default
  },
  { timestamps: true } // adds createdAt + updatedAt
);

const User = mongoose.model("User", userSchema);
module.exports = User;
```

### MG-13. How does Mongoose name collections?

Model name → **lowercase + plural**.

| Model | Collection |
|---|---|
| `User` | `users` |
| `Product` | `products` |
| `Category` | `categories` |

**Real-life:** one "User" form goes into the "users" drawer.

⚠️ Override if needed: `mongoose.model("User", userSchema, "app_users")`.

### MG-14. What validation rules does Mongoose have?

| Rule | Does |
|---|---|
| `required` | must be provided |
| `default` | value if missing |
| `enum` | allowed values only |
| `min` / `max` | number or date range |
| `minLength` / `maxLength` | string length |
| `match` | regex (e.g. email format) |
| `trim`, `lowercase`, `uppercase` | auto-format (setters, not validators) |
| `validate` | custom function |

**Real-life:** a bouncer with a checklist at the door.

```js
// Input: { name: "  Ashish ", email: " A@X.COM ", age: 15, role: "boss" }
// name  → "Ashish" (trimmed)     email → "a@x.com"
// age   → "Must be at least 18"  role  → "`boss` is not a valid enum value"
```

⚠️ **`unique` is NOT a validator.** It creates a unique **index**; duplicates fail with error code **`11000`**, so handle that in your error middleware.

⚠️ Update queries skip validation unless you pass `runValidators: true`.

### MG-15. How do you create documents?

```js
// Way 1
const user = await User.create({ name: "Ashish", email: "ashish@example.com", age: 25 });

// Way 2
const newUser = new User({ name: "Ashish", email: "ashish@example.com" });
await newUser.save();
```

**Real-life:** `create` = buy a ready-made item. `new + save` = assemble it, adjust it, then put it on the shelf.

🎯 `new + save` is useful when you change fields before saving or rely on `pre("save")` hooks.

### MG-16. `find()` vs `findOne()` vs `findById()`?

```js
const users = await User.find();                        // array (empty [] if none)
const admins = await User.find({ role: "admin" });
const user = await User.findOne({ email: "a@x.com" });  // first match or null
const byId = await User.findById(id);                   // by _id or null
```

| Method | Returns when nothing found |
|---|---|
| `find()` | `[]` |
| `findOne()` / `findById()` | `null` |

**Real-life:** `find` = "all students in class 5". `findOne` = "the first student named Ravi". `findById` = "roll number 42".

⚠️ Always check for `null` and return `404`. An invalid ID string throws a **`CastError`**; validate with `mongoose.isValidObjectId(id)`.

### MG-17. How do you update documents?

```js
const updated = await User.findByIdAndUpdate(
  id,
  { name: "Updated Name" },
  { returnDocument: "after", runValidators: true } // return the NEW doc + validate
);

await User.updateMany({ role: "user" }, { $set: { active: true } });
```

**Real-life:** editing a form and asking for a copy of the **edited** version, not the old one.

⚠️ By default it returns the **old** document. `{ new: true }` still works but is **deprecated in Mongoose 9**; use `returnDocument: "after"`.
⚠️ `findByIdAndUpdate` doesn't trigger `pre("save")` hooks.

### MG-18. How do you delete documents?

```js
await User.findByIdAndDelete(id);               // returns the deleted doc
await User.findOneAndDelete({ email: "a@x.com" });
await User.deleteOne({ email: "a@x.com" });     // returns { deletedCount }
await User.deleteMany({ role: "user" });
```

🎯 Many apps use **soft delete** (`isDeleted: true`) so data can be restored.

**Real-life:** soft delete = moving a file to the recycle bin instead of shredding it.

### MG-19. What does `.lean()` do?

Returns **plain JS objects** instead of full Mongoose documents. Faster and lighter.

**Real-life:** a photocopy instead of the original file with all its stamps and tools.

```js
const users = await User.find().lean(); // read-only, fast
```

⚠️ Lean results have no `.save()`, getters, virtuals or document methods.

🎯 Use `.lean()` for read-only API responses (lists, reports).

### MG-20. What are Mongoose middleware (hooks)?

Functions that run **before/after** operations, e.g. hash a password before saving.

**Real-life:** a security scanner every bag passes through before boarding.

```js
const bcrypt = require("bcrypt");

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;          // only when changed
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};
```

⚠️ Use a **normal `function`**, not an arrow function, so `this` is the document.
⚠️ `save` hooks don't run for `findByIdAndUpdate` / `updateOne`.

---

## Part D — Querying

### MG-21. What are the main query operators?

| Type | Operators |
|---|---|
| Comparison | `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin` |
| Logical | `$and`, `$or`, `$nor`, `$not` |
| Element | `$exists`, `$type` |
| Evaluation | `$regex` |

**Real-life:** filters on a shopping site: price between X and Y, brand is A **or** B.

```js
User.find({ age: { $gte: 18, $lte: 30 } });
User.find({ role: { $in: ["user", "admin"] } });
User.find({ $or: [{ role: "admin" }, { age: { $gt: 50 } }] });
User.find({ bio: { $exists: true } });
User.find({ name: { $regex: "^ash", $options: "i" } }); // case-insensitive
```

⚠️ Escape user input before putting it in `$regex`, and never pass `req.body` straight into a filter (**NoSQL injection**, e.g. `{ "$ne": null }`).

### MG-22. What are the update operators?

| Operator | Does | Example |
|---|---|---|
| `$set` | set a field | `{ $set: { name: "A" } }` |
| `$unset` | remove a field | `{ $unset: { bio: "" } }` |
| `$inc` | add / subtract | `{ $inc: { stock: -1 } }` |
| `$push` | add to array | `{ $push: { tags: "new" } }` |
| `$addToSet` | add if not already there | `{ $addToSet: { tags: "new" } }` |
| `$pull` | remove from array | `{ $pull: { tags: "old" } }` |

**Real-life:** `$inc` = a stock counter going down by one when an item sells.

🎯 `$inc` is **atomic**: two buyers at once can't both read "1 left" and oversell.

### MG-23. How do you paginate?

```js
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;

const [users, total] = await Promise.all([
  User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
  User.countDocuments(),
]);

res.json({ data: users, page, totalPages: Math.ceil(total / limit) });
```

**Real-life:** book pages: page 3 with 10 lines each = skip the first 20 lines.

⚠️ `skip` gets **slow on large collections** (it still walks skipped docs). For big or infinite lists use **cursor pagination**:

```js
User.find({ _id: { $lt: lastId } }).sort({ _id: -1 }).limit(10);
```

⚠️ Always `sort` when paginating, or the order isn't guaranteed.

### MG-24. How do you sort and select fields?

```js
User.find().sort({ createdAt: -1, name: 1 }); // newest first, then A→Z
User.find().select("name email");             // only these (+ _id)
User.find().select("-password");              // everything except password
User.findOne({ email }).select("+password");  // include a select:false field (login)
```

**Real-life:** `select` = asking a librarian for only the book title and author, not the whole book.

---

## Part E — Indexing & Performance

### MG-25. What is an index?

A data structure that lets MongoDB find documents **without scanning the whole collection**.

**Real-life:** the index at the back of a book. Without it, you read every page (full collection scan).

```js
userSchema.index({ email: 1 });                          // single field
userSchema.index({ role: 1, createdAt: -1 });            // compound
userSchema.index({ username: 1 }, { unique: true });     // unique
userSchema.index({ title: "text" });                     // text search
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL (auto-delete)
```

| ✅ Pros | ❌ Cons |
|---|---|
| much faster reads | slower writes |
| enforce uniqueness | uses memory and disk |

⚠️ **Compound index order matters** (ESR rule: **E**quality → **S**ort → **R**ange). `{ role: 1, createdAt: -1 }` helps queries on `role`, not ones on `createdAt` alone.

🎯 Index fields you filter and sort on often; don't index everything.

### MG-26. How do you check if a query uses an index?

```js
db.users.find({ email: "a@x.com" }).explain("executionStats");
// Mongoose:
await User.find({ email: "a@x.com" }).explain("executionStats");
```

| Look for | Meaning |
|---|---|
| `IXSCAN` | ✅ index used |
| `COLLSCAN` | ❌ full scan, add an index |
| `totalDocsExamined` vs `nReturned` | should be close |

**Real-life:** checking a delivery route to see if the driver used the motorway or every side street.

---

## Part F — Relationships

### MG-27. Embedding vs Referencing?

**Embedding:** related data **inside** the same document.

```js
const userSchema = new mongoose.Schema({
  name: String,
  address: { street: String, city: String, zipCode: String },
});
```

**Referencing:** store an `ObjectId` pointing to another collection.

```js
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalAmount: Number,
});
```

**Real-life:** embedding = your address written on your ID card. Referencing = your order slip just has your customer number.

| | Embedding | Referencing |
|---|---|---|
| Best for | one-to-few, read together | one-to-many, many-to-many |
| Reads | one query, fast | needs `populate` / `$lookup` |
| Updates | duplicated data harder to update | update in one place |
| Limit | doc max **16 MB** | no growth problem |

🎯 "Embed what you read together and that stays small; reference what grows without limit or is shared." Example: comments on a viral post → reference (unbounded array).

### MG-28. What is `populate()`?

Replaces an `ObjectId` with the **actual document** from another collection.

**Real-life:** turning a customer number on an order slip into the customer's full name and email.

```js
const orders = await Order.find().populate("user", "name email");
console.log(orders[0].user.name); // "Ashish"
```

```js
// nested populate
Order.find().populate({ path: "items.product", select: "title price" });
```

⚠️ `populate` runs **extra queries**. Populating many paths on big lists is slow; consider `$lookup` (MG-30) or embedding.

---

## Part G — Aggregation & Transactions

### MG-29. What is the aggregation pipeline?

Documents pass through **stages**, each transforming the result (filter, group, sort…).

**Real-life:** a factory assembly line: each station does one job before passing it on.

```js
const topCustomers = await Order.aggregate([
  { $match: { status: "completed" } },                        // filter
  { $group: { _id: "$user", totalSpent: { $sum: "$amount" }, orderCount: { $sum: 1 } } },
  { $sort: { totalSpent: -1 } },                              // biggest first
  { $limit: 5 },                                              // top 5
]);
```

| Stage | Purpose |
|---|---|
| `$match` | filter (like `find`) |
| `$group` | group + `$sum`, `$avg`, `$min`, `$max`, `$count` |
| `$project` | pick / rename / compute fields |
| `$sort`, `$skip`, `$limit` | order and paginate |
| `$lookup` | join another collection |
| `$unwind` | one document per array item |
| `$facet` | several pipelines at once (data + total count) |

⚠️ Put **`$match` early** so later stages process fewer documents and indexes can be used.
⚠️ In Mongoose, `aggregate` doesn't cast types: convert strings with `new mongoose.Types.ObjectId(id)` in `$match`.

### MG-30. How do you join collections with `$lookup`?

```js
const orders = await Order.aggregate([
  { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
  { $unwind: "$user" },                         // array → object
  { $project: { totalAmount: 1, "user.name": 1, "user.email": 1 } },
]);
```

**Real-life:** matching each order slip with the customer record in another drawer.

| `populate()` | `$lookup` |
|---|---|
| Mongoose feature, extra queries | database-side join, one pipeline |
| simple and readable | better for reports, filtering on joined data |

⚠️ `from` uses the **collection name** (`users`), not the model name (`User`).

### MG-31. What are transactions?

Several writes that **all succeed or all roll back** (atomic).

**Real-life:** a bank transfer: money leaves account A **and** arrives in B, or neither happens.

```js
const session = await mongoose.startSession();
try {
  await session.withTransaction(async () => {
    await User.findByIdAndUpdate(userId, { $inc: { balance: -100 } }, { session });
    await Order.create([{ user: userId, amount: 100 }], { session }); // array form with session
  });
} finally {
  await session.endSession();
}
```

`withTransaction` commits, aborts on error, and retries temporary errors for you.

⚠️ Transactions need a **replica set** (Atlas has one; a plain local `mongod` doesn't).
⚠️ Pass `{ session }` to **every** operation, or that write happens outside the transaction.
🎯 A single-document update is already atomic; use transactions only for multi-document changes.

---

## Part H — Tools

### MG-32. What are MongoDB Atlas and Compass?

| Tool | What | Real-life |
|---|---|---|
| **Atlas** | cloud-hosted MongoDB (DBaaS): backups, scaling, monitoring | renting a managed storage unit |
| **Compass** | official desktop GUI to browse, query, build aggregations | a window to look inside the cabinet |
| **mongosh** | command-line shell | talking to the cabinet by typing |

🎯 Atlas needs your IP in the **Network Access** allow-list, or the connection times out.

---

## Part I — Interview Revision

### MG-33. Quick interview answers

| Question | Answer |
|---|---|
| What is MongoDB? | NoSQL document database storing BSON |
| What is BSON? | Binary JSON with extra types (`ObjectId`, `Date`, `Decimal128`) |
| What is Mongoose? | ODM: schemas, validation, hooks, populate |
| Schema vs Model? | schema = structure; model = CRUD interface |
| Why `users` for `User`? | Mongoose lowercases and pluralises model names |
| `find` vs `findOne` vs `findById`? | array / first match or null / by `_id` or null |
| Return updated doc? | `{ returnDocument: "after" }` (`new: true` deprecated) |
| Is `unique` a validator? | no, it's an index; duplicates give error `11000` |
| What is `lean()`? | plain JS objects, faster, read-only |
| Embedding vs referencing? | nest small data read together / store `ObjectId` for growing or shared data |
| What is `populate()`? | replaces `ObjectId` with the referenced document |
| `populate` vs `$lookup`? | extra Mongoose queries vs database-side join |
| What is an index? | speeds reads, slows writes; check with `explain()` |
| `IXSCAN` vs `COLLSCAN`? | index used vs full scan |
| What is aggregation? | pipeline of stages (`$match`, `$group`, `$sort`…) |
| Why `$match` first? | fewer docs later, can use indexes |
| What is a transaction? | multi-document all-or-nothing writes; needs replica set |
| `skip` pagination problem? | slow on large data → cursor pagination |
| SQL vs MongoDB? | fixed tables + joins vs flexible documents + horizontal scaling |

### MG-34. Common MongoDB / Mongoose mistakes

| ❌ Don't | ✅ Do |
|---|---|
| connect on every request | connect once at startup |
| trust `unique` as validation | handle duplicate error `11000` |
| expect the updated doc by default | `returnDocument: "after"` |
| forget `runValidators: true` on updates | pass it |
| arrow functions in schema hooks/methods | normal `function` (needs `this`) |
| send `password` in responses | `select: false` / `.select("-password")` |
| pass `req.body` straight into queries | validate and whitelist (NoSQL injection) |
| unbounded embedded arrays | reference instead (16 MB limit) |
| `skip` on huge collections | cursor pagination |
| no indexes on filter/sort fields | add indexes, check `explain()` |
| `$match` at the end of a pipeline | `$match` early |
| forget `{ session }` in a transaction | pass it to every operation |
| skip `null` checks after `findById` | return `404` |
| full documents for read-only lists | `.lean()` |

> **Revision flow:** Basics → Schema/Model → CRUD → Operators → Indexes → Relationships → Aggregation → Transactions.
