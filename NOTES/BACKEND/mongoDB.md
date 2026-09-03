
# MongoDB & Mongoose Notes

A practical, interview-friendly reference for MongoDB and Mongoose in MERN stack development.

---

## 1. What is MongoDB?

MongoDB is a **NoSQL document database**. Data is stored in flexible, JSON-like **BSON** (Binary JSON) documents.

```text
Database → Collection → Document
```

### Example Document

```json
{
  "_id": "60d5ec49f1a2c82b88f34112",
  "name": "Ashish",
  "email": "ashish@example.com",
  "age": 25,
  "createdAt": "2026-09-03T12:00:00.000Z"
}
```

---

## 2. MongoDB vs SQL Database

| Feature | MongoDB (NoSQL) | SQL (Relational) |
|---|---|---|
| Structure | Database → Collection → Document | Database → Table → Row |
| Schema | Dynamic / Flexible | Fixed / Rigorous Schema |
| Relationships | Embedded docs or Referencing | Foreign keys & JOINs |
| Format | BSON / JSON | Tables (Rows & Columns) |
| Scalability | Horizontal (Sharding) | Vertical (Scaling up hardware) |
| Query Language | MQL (MongoDB Query Language) | SQL |

---

## 3. What is BSON?

**BSON = Binary JSON**

MongoDB stores data internally as BSON. It extends JSON by adding extra data types:

- `ObjectId` (12-byte unique identifier)
- `Date`
- `Binary data`
- `Decimal128` / `Int32` / `Int64`

---

## 4. What is Mongoose?

Mongoose is an **ODM (Object Data Modeling)** library for MongoDB and Node.js. It manages relationships, provides schema validation, and translates between objects in code and representations of those objects in MongoDB.

```bash
npm install mongoose
```

### Connecting to MongoDB

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 5. Mongoose Schema & Model

### Schema
Defines the structure of documents, default values, and validation rules.

### Model
A wrapper around the Schema that provides an interface to query and perform CRUD operations on the database.

```js
const mongoose = require('mongoose');

// 1. Define Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    age: {
      type: Number,
      min: [18, 'Must be at least 18']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true // Auto adds createdAt and updatedAt fields
  }
);

// 2. Create Model
const User = mongoose.model('User', userSchema);

module.exports = User;
```

> ⚠️ **Collection Naming:** Mongoose automatically converts model names to **lowercase, pluralized** collection names.
> - Model: `User` → Collection: `users`
> - Model: `Product` → Collection: `products`

---

## 6. Mongoose Schema Validation

Common validation rules:

| Rule | Description |
|---|---|
| `required` | Field must be provided |
| `unique` | Ensures unique values (creates a unique index) |
| `default` | Sets a default value if not specified |
| `enum` | Array of allowed values (Strings) |
| `min` / `max` | Minimum / maximum numbers or dates |
| `minLength` / `maxLength` | Minimum / maximum string length |
| `trim` | Trims whitespace from strings |
| `lowercase` / `uppercase` | Automatically formats case |

---

## 7. CRUD Operations with Mongoose

### Create

```js
// Method 1: User.create()
const user = await User.create({
  name: 'Ashish',
  email: 'ashish@example.com',
  age: 25
});

// Method 2: new User() + save()
const newUser = new User({ name: 'Ashish', email: 'ashish@example.com' });
await newUser.save();
```

### Read

```js
// Find all
const users = await User.find();

// Find with conditions
const activeUsers = await User.find({ role: 'user' });

// Find one by ID
const user = await User.findById('60d5ec49f1a2c82b88f34112');

// Find one by condition
const user = await User.findOne({ email: 'ashish@example.com' });
```

### Update

```js
// Find by ID and update (returns updated doc with { new: true })
const updatedUser = await User.findByIdAndUpdate(
  id,
  { name: 'Updated Name' },
  { new: true, runValidators: true }
);

// Update many
await User.updateMany({ role: 'user' }, { active: true });
```

### Delete

```js
// Delete by ID
await User.findByIdAndDelete(id);

// Delete one
await User.findOneAndDelete({ email: 'ashish@example.com' });

// Delete many
await User.deleteMany({ role: 'user' });
```

---

## 8. MongoDB Query Operators

### Comparison Operators

```js
// $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
User.find({ age: { $gte: 18, $lte: 30 } });
User.find({ role: { $in: ['user', 'admin'] } });
```

### Logical Operators

```js
// $and, $or, $nor, $not
User.find({
  $or: [{ role: 'admin' }, { age: { $gt: 50 } }]
});
```

### Element & Evaluation Operators

```js
// $exists, $regex
User.find({ bio: { $exists: true } });
User.find({ name: { $regex: '^ash', $options: 'i' } }); // case-insensitive regex
```

---

## 9. Indexing

Indexes improve query performance by reducing the amount of data MongoDB needs to scan.

```js
// Single field index (ascending: 1, descending: -1)
userSchema.index({ email: 1 });

// Compound index
userSchema.index({ role: 1, createdAt: -1 });

// Unique index
userSchema.index({ username: 1 }, { unique: true });
```

### Explaining Queries (Performance Analysis)

```js
db.users.find({ email: 'ashish@example.com' }).explain('executionStats');
```

> ⚠️ **Trade-off:** Indexes speed up **read** operations but slow down **write** (insert/update/delete) operations and consume memory.

---

## 10. Pagination & Sorting

### Pagination (`skip` & `limit`)

```js
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;

const users = await User.find()
  .skip(skip)
  .limit(limit);
```

### Sorting (`sort`)

```js
// Sort by createdAt descending (-1), then name ascending (1)
const users = await User.find().sort({ createdAt: -1, name: 1 });
```

### Projection (`select`)

```js
// Include only name & email (and default _id)
const users = await User.find().select('name email');

// Exclude password field
const users = await User.find().select('-password');
```

---

## 11. Relationships: Embedding vs Referencing

### 1. Embedding (Denormalization)
Stores related data inside the same document.

```js
const userSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    zipCode: String
  }
});
```
- **Best for:** One-to-Few relationships, data queried together, read-heavy workloads.

### 2. Referencing (Normalization)
Stores `ObjectId` references to documents in another collection.

```js
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  totalAmount: Number
});
```
- **Best for:** One-to-Many or Many-to-Many relationships, data updated independently, large data sets.

---

## 12. Population (`populate`)

Population replaces specified paths/references in a document with actual documents from another collection.

```js
// Fetch orders and populate user details
const orders = await Order.find().populate('user', 'name email');

// Resulting order object has the full user object attached
console.log(orders[0].user.name);
```

---

## 13. MongoDB Aggregation Framework

Aggregation processes documents through a pipeline of stages to compute results (grouping, filtering, transforming).

```js
const stats = await Order.aggregate([
  // Stage 1: Filter completed orders
  { $match: { status: 'completed' } },
  
  // Stage 2: Group by user and calculate total spent & order count
  {
    $group: {
      _id: '$user',
      totalSpent: { $sum: '$amount' },
      orderCount: { $sum: 1 }
    }
  },
  
  // Stage 3: Sort by totalSpent descending
  { $sort: { totalSpent: -1 } },
  
  // Stage 4: Limit top 5 users
  { $limit: 5 }
]);
```

### Common Aggregation Stages

| Stage | Purpose |
|---|---|
| `$match` | Filters documents (like `find`) |
| `$group` | Groups documents by a specified key |
| `$project` | Reshapes documents (adds, removes, renames fields) |
| `$sort` | Sorts documents |
| `$limit` | Limits number of documents |
| `$skip` | Skips specified number of documents |
| `$lookup` | Left outer join to another collection |
| `$unwind` | Deconstructs an array field to output a document for each element |

---

## 14. Transactions

Transactions allow multiple database write operations to execute atomically (all succeed or all rollback).

```js
const session = await mongoose.startSession();

try {
  session.startTransaction();

  // Operation 1: Deduct user balance
  await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: -100 } },
    { session }
  );

  // Operation 2: Create Order
  await Order.create(
    [{ user: userId, amount: 100 }],
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

## 15. MongoDB Compass & Atlas

- **MongoDB Atlas:** Cloud-hosted DBaaS (Database-as-a-Service) for MongoDB.
- **MongoDB Compass:** Official GUI for inspecting, querying, and analyzing MongoDB databases locally or on Atlas.

---

## 16. MongoDB Interview Q&A

| Question | Answer |
|---|---|
| What is MongoDB? | A NoSQL, document-oriented database that stores data in BSON format. |
| What is Mongoose? | An ODM library for MongoDB and Node.js for schema validation and data modeling. |
| Difference between Schema & Model? | Schema defines document structure; Model provides the API for CRUD operations. |
| Why does Mongoose pluralize collection names? | It automatically converts model names (e.g., `User`) to lowercased plural collections (`users`). |
| `find()` vs `findOne()` vs `findById()`? | `find()` returns an array; `findOne()` returns first matching object; `findById()` searches by `_id`. |
| What is BSON? | Binary JSON — extends JSON with extra types like `ObjectId`, `Date`, and `Binary`. |
| Embedding vs Referencing? | Embedding nests subdocuments in one doc; Referencing stores `ObjectId` links across collections. |
| What is `populate()`? | Replaces an `ObjectId` field in a document with the referenced document's data. |
| What is an Index? | Data structure that optimizes query execution speed by avoiding full collection scans. |
| What is Aggregation? | A data processing pipeline (`$match`, `$group`, `$sort`, etc.) for calculating aggregated results. |
