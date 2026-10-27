### NODE-1. `process.argv`

process.argv is an array of command-line arguments passed when running a Node.js script.

```bash
node index.js hello1 hello2
```

```js
process.argv[0]; // node executable path
process.argv[1]; // file path
process.argv[2]; // hello1 (first CLI arg)
process.argv[3]; // hello2 (second CLI arg)
```

---

### NODE-2. Environment Variables

```js
process.env.DB_NAME; // read env variable
```

---

### NODE-3. How Node.js Works (Event Loop Order)

```
Sync Code
  → process.nextTick       (own queue, highest priority)
  → Promise                (microtask)
  → Event loop phases:
      1. Timers   → setTimeout, setInterval
      2. Poll     → I/O callbacks (fs, network; file work runs in the thread pool)
      3. Check    → setImmediate
      4. Close    → close events
  (nextTick + Promises run again after every callback)
```

### NODE-4. Sync vs Async — `fs` Module

```js
fs.readFileSync(); // blocks, line-by-line execution
fs.readFile(); // non-blocking, parallel code execution
```

### NODE-5 Top-level await in Promises

> **Node tip:** top-level `await` works only in ES modules (`.mjs` files or `"type": "module"` in package.json). In CommonJS, put `await` inside an `async` function.

### NODE-6. What is a Promise?

An object for a value that will arrive later. It has 3 states: **pending**, **fulfilled** (success) or **rejected** (failure).

**Real-life:** you order a pizza. Waiting = pending, pizza arrives = fulfilled, order cancelled = rejected.

```js
const order = new Promise((resolve, reject) => {
  setTimeout(() => resolve("🍕 Pizza delivered"), 1000);
});

console.log(order); // Promise { <pending> }
```

Once fulfilled or rejected, a Promise can't change again.

> **In one line:** a placeholder for a future success or failure.

### NODE-7 `.then`, `.catch`, `.finally`

**Real-life:** pizza comes → eat (`.then`). Cancelled → make noodles (`.catch`). Either way → wash hands (`.finally`).

```js
order
  .then((res) => console.log(res))
  .catch((err) => console.log(err))
  .finally(() => console.log("Wash hands"));
```

**Output:**

```
🍕 Pizza delivered
Wash hands
```

> **In one line:** `.then` = success, `.catch` = failure, `.finally` = always.

### NODE-8. Promise chaining

Each `.then` returns a new Promise, passing its result to the next.

**Real-life:** making tea. Boil water, add tea, add milk. One step after another.

```js
Promise.resolve("water")
  .then((x) => x + " + tea")
  .then((x) => x + " + milk")
  .then((x) => console.log("Serve:", x))
  .catch((err) => console.log("Failed:", err));
```

**Output:**

```
Serve: water + tea + milk
```

If any step fails, it jumps straight to `.catch`.

> **In one line:** steps run in order, each using the previous result.

### NODE-9. async/await

A cleaner way to write Promise code, like normal step-by-step code.

**Real-life:** a to-do list: wait for food, eat, wash plate.

```js
async function greet() {
  return "Hello";
}

greet().then(console.log); // Hello
```

`async` functions always return a Promise. `await` pauses only that function; the rest of the app keeps running.

> **In one line:** Promise code that reads like sync code.

### NODE-10. Error handling with await

Use `try/catch`.

**Real-life:** try the ATM. No cash? Pay by card instead.

```js
async function getMoney() {
  try {
    await Promise.reject("ATM out of cash");
  } catch (err) {
    console.log("Error:", err);
  } finally {
    console.log("Leaving ATM");
  }
}

getMoney();
```

**Output:**

```
Error: ATM out of cash
Leaving ATM
```

> **In one line:** wrap `await` in `try/catch`, or a failure stops the function.

### NODE-11. `Promise.all`

Runs Promises in parallel and waits for **all** to succeed. If one fails, the whole thing fails.

**Real-life:** mom needs milk, bread **and** eggs for breakfast. If even one is missing, no breakfast.

```js
const results = await Promise.all([getUser(), getOrders(), getProfile()]);
// ["User", "Orders", "Profile"], or the first error
```

> **In one line:** all results together, or fails at the first error.

### NODE-12. `Promise.allSettled`

Waits for **every** Promise and reports each result. It never rejects.

**Real-life:** you ask 3 friends "coming to the party?" and wait for every reply, yes or no.

```js
const results = await Promise.allSettled([
  Promise.resolve("Users"),
  Promise.reject("Stats failed"),
]);
console.log(results);
```

**Output:**

```js
[
  { status: "fulfilled", value: "Users" },
  { status: "rejected", reason: "Stats failed" },
];
```

> **In one line:** get every result, success or failure.

### NODE-13. `Promise.race` vs `Promise.any`

**Real-life:** you call 2 friends for help.

- **race:** whoever picks up first, even if they say "no".
- **any:** the first one who says "yes".

```js
const appA = new Promise((_, rej) => setTimeout(() => rej("A: no cabs"), 500));
const appB = new Promise((res) => setTimeout(() => res("B: cab found"), 1000));

Promise.race([appA, appB]).catch((e) => console.log("race:", e));
Promise.any([appA, appB]).then((r) => console.log("any:", r));
```

**Output:**

```
race: A: no cabs
any: B: cab found
```

Common use of `race` in Node: an API **timeout**.

```js
const timeout = new Promise((_, rej) => setTimeout(() => rej("Timeout"), 3000));
await Promise.race([fetch("https://api.example.com/data"), timeout]);
```

> **In one line:** `race` = first to finish, `any` = first success.

### NODE-14. Comparison

**Real-life:** inviting 3 friends.

| Method       | Like...                   | Fails when            |
| ------------ | ------------------------- | --------------------- |
| `all`        | Everyone must come        | Any one fails         |
| `allSettled` | Wait for everyone's reply | Never                 |
| `race`       | First reply decides       | First to finish fails |
| `any`        | First friend who says yes | All fail              |

### NODE-15. Sequential vs parallel await

**Real-life:** eggs then toast = 10 min. Both at once = 5 min.

```js
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// Sequential: ~4s
await wait(2000);
await wait(2000);

// Parallel: ~2s
await Promise.all([wait(2000), wait(2000)]);
```

- **Sequential:** when step 2 needs step 1's result (get user → get that user's orders).
- **Parallel:** when tasks are independent.

> **In one line:** run independent tasks with `Promise.all` to save time.

### NODE-16. What's the output?

**Real-life:** finish your homework (sync), then answer mom's call (Promise), then check messages (setTimeout).

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

**Output:**

```
1
4
3
2
```

> **In one line:** sync code → Promises (microtasks) → setTimeout (macrotasks).

### NODE-17. Callback vs Promise vs async/await

**Real-life:** giving directions. Callback = "call me at every turn" (messy). Promise = a written list. async/await = the same list, read out normally.

```js
// Callback: nested ("callback hell")
getUser((user) => getOrders(user, (orders) => console.log(orders)));

// Promise: flat chain
getUser().then(getOrders).then(console.log).catch(console.log);

// Async/await: cleanest
try {
  const orders = await getOrders(await getUser());
  console.log(orders);
} catch (err) {
  console.log(err);
}
```

|             | Readability      | Errors                  |
| ----------- | ---------------- | ----------------------- |
| Callback    | Nested, messy    | Check in every callback |
| Promise     | Flat chain       | One `.catch`            |
| async/await | Like normal code | `try/catch`             |

> **In one line:** all do the same job, but async/await is easiest to read and maintain.

### NODE-18. Common Errors

Two groups:

- **JavaScript errors** (`SyntaxError`, `TypeError`, `ReferenceError`): mistakes in your **code**.
- **System errors** (`ENOENT`, `ECONNREFUSED`): problems **outside** your code (files, network). Check `err.code`.

### NODE-19. `SyntaxError`: invalid format

**Real-life:** a letter with jumbled words. You can't read it.

```js
JSON.parse("{bad}");
// SyntaxError: Expected property name or '}' in JSON at position 1
```

Valid JSON needs quotes: `'{"name": "bad"}'`.

> **In one line:** wrap `JSON.parse` in `try/catch`.

### NODE-20 `TypeError`: wrong type used

**Real-life:** trying to open a box that isn't there.

```js
const user = null;
user.name;
// TypeError: Cannot read properties of null (reading 'name')
```

Safe way: `user?.name`.

> **In one line:** you used a value the wrong way (like reading from `null`).

### NODE-21 `ReferenceError`: variable doesn't exist

**Real-life:** calling a friend whose number isn't saved.

```js
console.log(unknownVar);
// ReferenceError: unknownVar is not defined
```

Usually a typo or a missing `const` / `let` / `require`.

> **In one line:** you used a name that was never declared.

### NODE-22 `ENOENT`: file not found

**E**rror **NO** **ENT**ry. **Real-life:** looking in an empty cupboard.

```js
const fs = require("fs");

try {
  fs.readFileSync("missing.txt");
} catch (err) {
  console.log(err.code); // ENOENT
}
```

> **In one line:** wrong path or file name.

### NODE-23 `ECONNREFUSED`: connection refused

**Real-life:** knocking on a shop door, but the shop is closed.

```js
try {
  await fetch("http://localhost:5000");
} catch (err) {
  console.log(err.cause.code); // ECONNREFUSED
}
```

With `fetch`, the real reason is in `err.cause.code`.

> **In one line:** the server or database isn't running, or the port is wrong.

### NODE-24 Handling Error in one place

```js
try {
  // your code
} catch (err) {
  if (err instanceof SyntaxError) console.log("Bad format");
  else if (err.code === "ENOENT") console.log("File not found");
  else if (err.cause?.code === "ECONNREFUSED") console.log("Server is down");
  else throw err; // unknown error, don't hide it
}
```

### NODE-25 What are CJS and ESM?

Two ways to share code between files in Node.

- **CJS (CommonJS):** old Node way → `require()` + `module.exports`
- **ESM (ES Modules):** modern standard → `import` + `export`

**Real-life:** CJS = shouting "pass me the sugar!" whenever you need it. ESM = writing a shopping list at the top before you start cooking.

```js
// CJS
module.exports = { add }; // math.js
const { add } = require("./math"); // app.js

// ESM
export function add(a, b) {} // math.mjs
import { add } from "./math.mjs"; // app.mjs
```

**Turn on ESM:** use the `.mjs` extension, OR add this to package.json:

```json
{ "type": "module" }
```

### NODE-26. What is `fs`?

A built-in Node module to work with files: read, write, add, delete and rename. No install needed.

**Real-life:** a notebook. You can read it, rewrite a page, add a line, tear out a page, or rename its cover.

```js
const fs = require("fs");
```

> **In one line:** `fs` lets Node work with files on your computer.

### NODE-27. What are its main methods?

| Method       | Does                   | Real-life                      |
| ------------ | ---------------------- | ------------------------------ |
| `readFile`   | read                   | read the page                  |
| `writeFile`  | write (**overwrites**) | erase the page and write again |
| `appendFile` | add to the end         | add a new line at the bottom   |
| `unlink`     | delete                 | tear out the page              |
| `rename`     | rename / move          | change the cover name          |

```js
const fs = require("fs");

fs.writeFile("hello.txt", "Hello", (err) => {
  if (err) return console.log(err.message);

  fs.appendFile("hello.txt", " World", (err) => {
    if (err) return console.log(err.message);

    fs.readFile("hello.txt", "utf8", (err, data) => {
      if (err) return console.log(err.message);
      console.log(data); // Hello World
    });
  });
});

fs.rename("old.txt", "new.txt", (err) => {}); // rename
fs.unlink("new.txt", (err) => {}); // delete
```

- Without `"utf8"`, `readFile` gives a **Buffer** (raw bytes), not text.
- Always check `err` first. A missing file gives `ENOENT`.

> **In one line:** read, write, append, delete and rename files.

### NODE-28. FS (File System)File Flags

| Flag   | Use                          | Memory Trick    |
| ------ | ---------------------------- | --------------- |
| `'r'`  | read file                    | R = Read        |
| `'w'`  | write/create, overwrite      | W = Write       |
| `'a'`  | add content at end           | A = Append/Add  |
| `'r+'` | read+write, file must exist  | R+ = Read+Write |
| `'w+'` | read+write, create/overwrite | W+ = Write+Read |
| `'wx'` | create/write, fail if exists | W+X = exclusive |

---

### NODE-29. What is the HTTP module?

A built-in Node module to create a web server.

**Real-life:** a shop counter. A customer asks (`req`), you give an answer (`res`), and the shop opens at a door number (`port`).

```js
const http = require("http");

http
  .createServer((req, res) => {
    res.end("hello");
  })
  .listen(3000, () => console.log("Server on http://localhost:3000"));
```

Open `http://localhost:3000` in the browser → `hello`

- `req` = request (what the user asked for: `req.url`, `req.method`)
- `res` = response (what you send back: `res.end()`)
- `listen(3000)` = start the server on port 3000

> **In one line:** `http.createServer` + `listen` = a basic web server.

### NODE-30. What is the HTTPS module?

Same as `http`, but **secure** (SSL/TLS). Data is encrypted.

**Real-life:** HTTP = a postcard anyone can read. HTTPS = a sealed envelope.

```js
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("key.pem"), // private key
  cert: fs.readFileSync("cert.pem"), // certificate
};

https
  .createServer(options, (req, res) => {
    res.end("secure hello");
  })
  .listen(443);
```

- Needs a **key** and a **certificate**.
- Default port: HTTP = `80`, HTTPS = `443`.

> **In one line:** HTTPS = HTTP + encryption (needs key and certificate).

### NODE-31. What is the `path` module?

A built-in Node module to work with file and folder paths safely.

**Real-life:** a home address. `path` helps you read it (city, street, house number) or build a new one correctly.

```js
const path = require("path");
```

Why use it? Windows uses `\` and Mac/Linux use `/`. `path` handles this for you.

> **In one line:** `path` = read, build and fix file paths on any OS.

### NODE-32. What are path main methods?

| Method       | Example                                                 | Result                           |
| ------------ | ------------------------------------------------------- | -------------------------------- |
| `basename`   | `path.basename("/src/app.js")`                          | `'app.js'` (file name)           |
| `extname`    | `path.extname("/src/app.js")`                           | `'.js'` (extension)              |
| `dirname`    | `path.dirname("/src/app.js")`                           | `'/src'` (folder)                |
| `join`       | `path.join("src", "app.js")`                            | `'src/app.js'` (combine)         |
| `resolve`    | `path.resolve("src", "app.js")`                         | full absolute path               |
| `parse`      | `path.parse("/src/app.js")`                             | `{ root, dir, base, ext, name }` |
| `format`     | `path.format({ dir: "/src", name: "app", ext: ".js" })` | `'/src/app.js'`                  |
| `normalize`  | `path.normalize("/src/../app.js")`                      | `'/app.js'` (clean up)           |
| `relative`   | `path.relative("/src", "/src/app")`                     | `'app'` (route from A to B)      |
| `isAbsolute` | `path.isAbsolute("/src/app.js")`                        | `true`                           |

**Special variables (CJS only):**

```js
__dirname; // current folder
__filename; // current file full path
```

In ESM, use `import.meta.dirname` and `import.meta.filename` (Node 20.11+).

**Common real use:**

```js
const filePath = path.join(__dirname, "data", "users.json");
fs.readFileSync(filePath, "utf8");
```

This works no matter which folder you run the script from.

> **In one line:** use `path.join(__dirname, ...)` instead of writing paths by hand.

### NODE-33. What is the `os` module?

A built-in Node module that gives information about the computer your app runs on.

**Real-life:** checking your phone's "About" page: model, storage, battery time.

```js
const os = require("os");
```

> **In one line:** `os` = details about the computer (system, memory, CPU).

### NODE-34. What are its main methods?

| Method          | Gives                  | Example result                         |
| --------------- | ---------------------- | -------------------------------------- |
| `os.platform()` | OS name                | `'linux'`, `'win32'`, `'darwin'` (Mac) |
| `os.arch()`     | CPU architecture       | `'x64'`, `'arm64'`                     |
| `os.hostname()` | computer name          | `'my-laptop'`                          |
| `os.totalmem()` | total RAM (bytes)      | `17179869184`                          |
| `os.freemem()`  | free RAM (bytes)       | `4294967296`                           |
| `os.uptime()`   | running time (seconds) | `3600`                                 |
| `os.cpus()`     | CPU cores (array)      | `os.cpus().length` → `8`               |
| `os.homedir()`  | home folder            | `'/home/asha'`                         |
| `os.tmpdir()`   | temporary folder       | `'/tmp'`                               |
| `os.EOL`        | end-of-line char       | `'\n'` (Mac/Linux), `'\r\n'` (Windows) |

**Common real use: a quick system check**

```js
const toGB = (bytes) => (bytes / 1024 ** 3).toFixed(1);

console.log(`OS: ${os.platform()}`);
console.log(`CPU cores: ${os.cpus().length}`);
console.log(`RAM: ${toGB(os.freemem())} GB free of ${toGB(os.totalmem())} GB`);
```

**Output:**

```
OS: linux
CPU cores: 8
RAM: 4.0 GB free of 16.0 GB
```

Memory is in **bytes** and uptime is in **seconds**, so convert them before showing.

> **In one line:** use `os` to check the system, for example memory and CPU, before running heavy tasks.

### NODE-35. What is the Events module?

A built-in Node module to **create, listen to and fire** your own events.

**Real-life:** a doorbell. Someone presses it (`emit`), and everyone listening hears it and reacts (`on`).

```js
const EventEmitter = require("events");
const event = new EventEmitter();

event.on("login", (name) => console.log(`Welcome, ${name}`));
event.once("login", () => console.log("First login bonus!"));

event.emit("login", "Ashish");
event.emit("login", "Ashish");
```

**Output:**

```
Welcome, Ashish
First login bonus!
Welcome, Ashish
```

`on` runs every time; `once` runs only the first time.

> **In one line:** `on` = listen, `emit` = fire.

### NODE-36. What are Events main methods?

| Method                             | Does                    |
| ---------------------------------- | ----------------------- |
| `new EventEmitter()`               | create emitter          |
| `on(name, fn)` / `addListener`     | listen, runs every time |
| `once(name, fn)`                   | listen, runs only once  |
| `emit(name, data)`                 | fire event + pass data  |
| `off(name, fn)` / `removeListener` | remove a listener       |
| `removeAllListeners(name)`         | remove all listeners    |
| `listeners(name)`                  | get listeners array     |
| `listenerCount(name)`              | count listeners         |
| `setMaxListeners(20)`              | increase listener limit |

- To remove a listener with `off`, pass the **same named function**, not a new arrow function.
- The default limit is **10 listeners** per event. More than that gives a warning (a sign of a possible memory leak).

```js
function greet(name) {
  console.log(`Hi ${name}`);
}

event.on("login", greet);
event.off("login", greet); // works, same function
```

> **In one line:** add with `on` / `once`, fire with `emit`, remove with `off`.

### 37. What is the Events module?

A built-in Node module to **create, listen to and fire** your own events.

**Real-life:** a doorbell. Someone presses it (`emit`), and everyone listening hears it and reacts (`on`).

```js
const EventEmitter = require("events");
const event = new EventEmitter();

event.on("login", (name) => console.log(`Welcome, ${name}`));
event.once("login", () => console.log("First login bonus!"));

event.emit("login", "Ashish");
event.emit("login", "Ashish");
```

**Output:**

```
Welcome, Ashish
First login bonus!
Welcome, Ashish
```

`on` runs every time; `once` runs only the first time.

> **In one line:** `on` = listen, `emit` = fire.

### 38. What are its main methods?

| Method                             | Does                    |
| ---------------------------------- | ----------------------- |
| `new EventEmitter()`               | create emitter          |
| `on(name, fn)` / `addListener`     | listen, runs every time |
| `once(name, fn)`                   | listen, runs only once  |
| `emit(name, data)`                 | fire event + pass data  |
| `off(name, fn)` / `removeListener` | remove a listener       |
| `removeAllListeners(name)`         | remove all listeners    |
| `listeners(name)`                  | get listeners array     |
| `listenerCount(name)`              | count listeners         |
| `setMaxListeners(20)`              | increase listener limit |

- To remove a listener with `off`, pass the **same named function**, not a new arrow function.
- The default limit is **10 listeners** per event. More than that gives a warning (a sign of a possible memory leak).

```js
function greet(name) {
  console.log(`Hi ${name}`);
}

event.on("login", greet);
event.off("login", greet); // works, same function
```

> **In one line:** add with `on` / `once`, fire with `emit`, remove with `off`.

### 39. What is a stream?

A way to handle data **piece by piece (chunks)** instead of loading it all at once.

**Real-life:** watching a YouTube video while it loads, instead of downloading the whole movie first.

```js
const fs = require("fs");

const reader = fs.createReadStream("input.txt", "utf8");

reader.on("data", (chunk) => console.log("Got chunk:", chunk.length));
reader.on("end", () => console.log("Done reading"));
```

**4 types:**

| Type      | Does                  | Example                |
| --------- | --------------------- | ---------------------- |
| Readable  | read data             | `fs.createReadStream`  |
| Writable  | write data            | `fs.createWriteStream` |
| Duplex    | read + write          | network socket         |
| Transform | read → modify → write | compress, uppercase    |

Why use it? Big files (videos, logs) don't fill up your memory.

> **In one line:** streams process big data in small chunks, saving memory.

### 40. What are its main methods?

**Readable stream**

| Method                   | Does                       |
| ------------------------ | -------------------------- |
| `.on("data", fn)`        | receive each chunk         |
| `.on("end", fn)`         | reading finished           |
| `.read()`                | read a chunk manually      |
| `.pause()` / `.resume()` | stop / continue reading    |
| `.setEncoding("utf8")`   | get text instead of Buffer |
| `.pipe(dest)`            | send to another stream     |

**Writable stream**

| Method              | Does                 |
| ------------------- | -------------------- |
| `.write(chunk)`     | write data           |
| `.end()`            | finish writing       |
| `.destroy()`        | close stream         |
| `.on("finish", fn)` | writing completed    |
| `.on("drain", fn)`  | ready to write again |

**Connecting streams: `pipe` vs `pipeline`**

- `pipe()` = connect + backpressure (doesn't overflow the writer)
- `pipeline()` = connect + **error handling + cleanup** (better choice)

**Real use: copy a file in UPPERCASE**

```js
const fs = require("fs");
const { pipeline, Transform } = require("stream");

const upper = new Transform({
  transform(chunk, enc, cb) {
    cb(null, chunk.toString().toUpperCase());
  },
});

pipeline(
  fs.createReadStream("input.txt"),
  upper,
  fs.createWriteStream("output.txt"),
  (err) => {
    if (err) console.log("Failed:", err.message);
    else console.log("Done");
  },
);
```

**Output:** `output.txt` has the same text in UPPERCASE, and the console prints `Done`.

> **In one line:** read → (transform) → write, connected with `pipeline()`.

### 41. What is the Crypto module?

A built-in Node module for security: hashing, encryption, signatures and secure random values.

**Real-life:**

- **Hash** = a fingerprint. Easy to make from a person, impossible to rebuild the person from it.
- **Encryption** = a locked box. Only someone with the key can open it.
- **Signature** = a signed letter. It proves who sent it and that nobody changed it.

```js
const crypto = require("crypto");

crypto.createHash("sha256").update("data").digest("hex");
// '3a6eb0790f39ac87c94f3856b2dd2c5d110e6811602261a9a923d3bb23adc8b7'
```

Same input → same hash, always. But you can't turn the hash back into `"data"`.

> **In one line:** hash = one-way, encryption = two-way (with a key).

### 42. What are its main methods?

| Method                                                           | Does                                              |
| ---------------------------------------------------------------- | ------------------------------------------------- |
| `createHash("sha256").update(data).digest("hex")`                | one-way hash                                      |
| `createHmac("sha256", "secret").update(data).digest("hex")`      | hash + secret key                                 |
| `createCipheriv(algo, key, iv)`                                  | create encryptor                                  |
| `createDecipheriv(algo, key, iv)`                                | create decryptor                                  |
| `createSign("sha256").update(data).sign(privateKey, "hex")`      | sign data                                         |
| `createVerify("sha256").update(data).verify(pubKey, sig, "hex")` | verify signature                                  |
| `randomBytes(16)`                                                | secure random bytes                               |
| `randomBytes(32).toString("hex")`                                | secure random token                               |
| `randomInt(1, 100)`                                              | secure random integer (1 to 99, max not included) |
| `generateKeyPairSync("rsa", { modulusLength: 2048 })`            | create public + private keys                      |
| `getHashes()`                                                    | list hash algorithms                              |
| `pbkdf2Sync(pw, salt, iter, keylen, "sha256")`                   | password hashing                                  |

**Real use: encrypt and decrypt**

```js
const key = crypto.randomBytes(32); // secret key (keep safe)
const iv = crypto.randomBytes(16); // random start value

const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
const encrypted = cipher.update("hello", "utf8", "hex") + cipher.final("hex");

const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
const decrypted =
  decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

console.log(decrypted); // hello
```

**Where each is used:**

| Need                           | Use                                                          |
| ------------------------------ | ------------------------------------------------------------ |
| Store passwords                | `pbkdf2` (or `scrypt`) with a salt, **never** plain `sha256` |
| Reset tokens, session IDs      | `randomBytes(32).toString("hex")`                            |
| Verify webhooks / API requests | `createHmac`                                                 |
| Protect private data           | `createCipheriv`                                             |
| Prove who sent data            | `createSign` / `createVerify`                                |

> **In one line:** use `crypto` for passwords, tokens and encryption; never use `Math.random()` for security.

### 43. What is the URL module?

A built-in way to **break a web address into parts** and read them easily. `URL` is global, so no `require` is needed.

**Real-life:** a home address. You can pick out the city, street and house number separately.

```js
const url = new URL("https://example.com:8080/products?id=10&name=Asha#top");
```

| Property                        | Gives                  | Result                                                    |
| ------------------------------- | ---------------------- | --------------------------------------------------------- |
| `url.href`                      | full URL               | `'https://example.com:8080/products?id=10&name=Asha#top'` |
| `url.protocol`                  | protocol               | `'https:'`                                                |
| `url.host`                      | host + port            | `'example.com:8080'`                                      |
| `url.hostname`                  | host only              | `'example.com'`                                           |
| `url.port`                      | port                   | `'8080'`                                                  |
| `url.pathname`                  | path                   | `'/products'`                                             |
| `url.search`                    | query string           | `'?id=10&name=Asha'`                                      |
| `url.hash`                      | fragment               | `'#top'`                                                  |
| `url.origin`                    | protocol + host + port | `'https://example.com:8080'`                              |
| `url.username` / `url.password` | credentials            | `''` if not in URL                                        |
| `url.searchParams`              | query helper           | `URLSearchParams` object                                  |

All values are **strings**, even `port`.

> **In one line:** `new URL()` splits a web address into easy-to-read parts.

### 44. How do you work with query params (`searchParams`)?

**Real-life:** a food order form. You can read, change, add or remove a choice.

| Method                    | Does                           |
| ------------------------- | ------------------------------ |
| `get("name")`             | read value (`null` if missing) |
| `set("name", "Ali")`      | update value                   |
| `append("city", "Delhi")` | add param                      |
| `delete("id")`            | remove param                   |
| `has("name")`             | check if exists                |
| `toString()`              | convert to string              |

```js
const params = url.searchParams;

params.get("name"); // 'Asha'
params.set("name", "Ali");
params.append("city", "Delhi");
params.delete("id");

console.log(params.has("name")); // true
console.log(params.toString()); // name=Ali&city=Delhi
console.log(url.href);
// https://example.com:8080/products?name=Ali&city=Delhi#top
```

Changing `searchParams` also updates `url.href` automatically.

**Real use: read query params in an HTTP server**

```js
http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id"); // /products?id=10 → '10'
    res.end(`Product ${id}`);
  })
  .listen(3000);
```

`req.url` is only the path (`/products?id=10`), so pass a base URL as the 2nd argument.

> **In one line:** use `searchParams` to read and edit query params safely.

### 45. What is a Buffer?

A fixed-size box of **raw bytes** (binary data). Used for files, images, network data and streams. `Buffer` is global, so no `require` is needed.

**Real-life:** an egg tray with a fixed number of slots. Each slot holds one byte (0 to 255), and the tray can't grow.

```js
const buf = Buffer.from("Hello");

console.log(buf); // <Buffer 48 65 6c 6c 6f>
console.log(buf.length); // 5
console.log(buf[0]); // 72 (byte for 'H')
console.log(buf.toString()); // Hello
console.log(buf.toString("hex")); // 48656c6c6f
console.log(buf.toString("base64")); // SGVsbG8=
```

`length` counts **bytes**, not letters: `Buffer.from("नमस्ते").length` is `18`, but the string has 6 characters.

> **In one line:** a Buffer = fixed-size raw bytes; `toString()` turns it back into text.

### 46. What are its main methods?

**Create**

| Method                     | Does                                       |
| -------------------------- | ------------------------------------------ |
| `Buffer.alloc(4)`          | safe, zero-filled → `<Buffer 00 00 00 00>` |
| `Buffer.allocUnsafe(4)`    | fast, may hold old data ⚠️                 |
| `Buffer.from("Hello")`     | from string (utf8 default)                 |
| `Buffer.from([1, 2, 3])`   | from byte array                            |
| `Buffer.from(existingBuf)` | copy existing buffer                       |

**Read / write**

| Method                                    | Does                     |
| ----------------------------------------- | ------------------------ |
| `buf.write("Hi")`                         | write string into buffer |
| `buf[0]`                                  | read byte at index       |
| `buf.length`                              | size in bytes (fixed)    |
| `buf.toString("utf8" / "hex" / "base64")` | buffer → string          |
| `buf.fill(0)`                             | fill with value          |

**Copy / compare / search**

| Method                                   | Does                                |
| ---------------------------------------- | ----------------------------------- |
| `buf.subarray(0, 4)`                     | part of buffer (**shares memory!**) |
| `buf.copy(target)`                       | copy bytes to another buffer        |
| `buf.equals(other)`                      | `true` if same bytes                |
| `buf.includes("x")` / `buf.indexOf("x")` | search                              |
| `Buffer.concat([a, b])`                  | merge buffers                       |
| `Buffer.compare(a, b)`                   | `-1` / `0` / `1`, for sorting       |
| `Buffer.isBuffer(obj)`                   | check if Buffer                     |

`buf.slice()` does the same as `subarray()` but is deprecated, so use `subarray()`.

**Shares memory: changing the part changes the original**

```js
const buf = Buffer.from("Hello");
const part = buf.subarray(0, 4);

part[0] = 74; // 'J'
console.log(buf.toString()); // Jello
```

Need a separate copy? Use `Buffer.from(buf.subarray(0, 4))`.

**Real use: Base64 encode / decode**

```js
const encoded = Buffer.from("Hello").toString("base64"); // 'SGVsbG8='
const decoded = Buffer.from(encoded, "base64").toString(); // 'Hello'
```

> **In one line:** use `Buffer.alloc` to create, `toString` to read, `subarray` carefully (it shares memory).

### 47. What are timers and their main methods?

Functions to run code **later** or **again and again**. All are global, so no `require` is needed.

**Real-life:**

- `setTimeout` = an alarm that rings **once**.
- `setInterval` = an alarm that rings **every day**.
- `clear...` = turning the alarm off.

| Method                  | Does                                              |
| ----------------------- | ------------------------------------------------- |
| `setTimeout(cb, 1000)`  | run once after delay                              |
| `setInterval(cb, 1000)` | run repeatedly every delay                        |
| `setImmediate(cb)`      | run at end of current loop (Check phase)          |
| `process.nextTick(cb)`  | run before anything else async (highest priority) |
| `clearTimeout(id)`      | cancel `setTimeout`                               |
| `clearInterval(id)`     | cancel `setInterval`                              |
| `clearImmediate(id)`    | cancel `setImmediate`                             |
| `timer.ref()`           | keep the process alive (default)                  |
| `timer.unref()`         | let the process exit even if the timer is running |

```js
let count = 0;
const id = setInterval(() => {
  count++;
  console.log("Tick", count);
  if (count === 3) clearInterval(id);
}, 1000);
```

**Output (1 per second):**

```
Tick 1
Tick 2
Tick 3
```

The delay is the **minimum** wait, not exact. If Node is busy, it runs later.

> **In one line:** `setTimeout` = once, `setInterval` = repeat, `clear...` = stop.

### 48. In what order do they run?

**Real-life:** a to-do list. First finish what you're doing (sync), then urgent notes (`nextTick`), then important notes (Promise), then scheduled tasks (`setTimeout`, `setImmediate`).

```js
console.log("1. sync");
setTimeout(() => console.log("4. setTimeout"), 0);
setImmediate(() => console.log("5. setImmediate"));
Promise.resolve().then(() => console.log("3. Promise"));
process.nextTick(() => console.log("2. nextTick"));
```

**Output:**

```
1. sync
2. nextTick
3. Promise
4. setTimeout
5. setImmediate
```

**Order:** sync → `nextTick` → Promise → `setTimeout` → `setImmediate`

- `setTimeout(0)` vs `setImmediate` in the main file: the order **can change** between runs.
- Inside an I/O callback (like `fs.readFile`): `setImmediate` always runs **first**.

> **In one line:** `nextTick` is the most urgent; `setImmediate` runs after I/O.

### 49. What is the DNS module?

A built-in Node module to turn a **website name into an IP address** (and the other way round).

**Real-life:** a phone contact list. You search "Mom" (domain name) and get her number (IP address).

```js
const dns = require("dns");

dns.lookup("example.com", (err, address, family) => {
  if (err) return console.log(err.code);
  console.log(address, `IPv${family}`); // e.g. 93.184.215.14 IPv4
});
```

**`lookup` vs `resolve`:**

|                     | `lookup`                        | `resolve`             |
| ------------------- | ------------------------------- | --------------------- |
| Uses                | your OS (like the browser does) | DNS servers directly  |
| Checks `hosts` file | ✅                              | ❌                    |
| Gives               | one IP                          | all records of a type |

> **In one line:** `dns` = name → IP; use `lookup` for normal use, `resolve` for DNS records.

### 50. What are its main methods?

| Method                    | Gives                    |
| ------------------------- | ------------------------ |
| `lookup(host, cb)`        | hostname → IP (OS-based) |
| `resolve(host, type, cb)` | DNS records of any type  |
| `resolve4(host, cb)`      | IPv4 addresses           |
| `resolve6(host, cb)`      | IPv6 addresses           |
| `resolveMx(host, cb)`     | mail servers (MX)        |
| `resolveCname(host, cb)`  | alias names (CNAME)      |
| `resolveTxt(host, cb)`    | text records (TXT)       |
| `resolveSrv(host, cb)`    | service records (SRV)    |
| `resolveNs(host, cb)`     | name servers (NS)        |
| `reverse(ip, cb)`         | IP → hostname            |
| `getServers()`            | list DNS servers in use  |
| `setServers(["8.8.8.8"])` | set custom DNS servers   |

**Promise version (cleaner):**

```js
const dns = require("dns/promises");

const ips = await dns.resolve4("example.com");
const mail = await dns.resolveMx("gmail.com");

console.log(ips); // e.g. ['93.184.215.14']
console.log(mail); // e.g. [{ exchange: 'gmail-smtp-in.l.google.com', priority: 5 }, ...]
```

**Real use:** check if an email's domain can receive mail before sign-up.

```js
async function canReceiveMail(email) {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false; // ENOTFOUND / ENODATA
  }
}
```

> **In one line:** `resolve4` = IPs, `resolveMx` = mail servers, `reverse` = IP → name.

---

### 51. What is the Assert module?

A built-in module to **check that your code gives the right result**. If a check fails, it throws an `AssertionError`.

**Real-life:** a teacher checking answers. Right answer → move on. Wrong answer → red mark.

```js
const assert = require("assert");

assert.strictEqual(2 + 2, 4); // passes, nothing happens
assert.strictEqual(1, "1"); // ❌ AssertionError: Expected values to be strictly equal
```

> **In one line:** `assert` = quick checks; silent if right, error if wrong.

### 52. What are its main methods?

| Method                               | Passes if                            |
| ------------------------------------ | ------------------------------------ |
| `assert(value)` / `assert.ok(value)` | value is truthy                      |
| `strictEqual(a, b)`                  | `a === b`                            |
| `notStrictEqual(a, b)`               | `a !== b`                            |
| `deepStrictEqual(a, b)`              | objects/arrays have the same content |
| `notDeepStrictEqual(a, b)`           | content is different                 |
| `throws(fn, err)`                    | `fn` throws the expected error       |
| `doesNotThrow(fn)`                   | `fn` doesn't throw                   |
| `rejects(asyncFn)`                   | async fn rejects (use `await`)       |
| `doesNotReject(asyncFn)`             | async fn resolves (use `await`)      |
| `match(str, regex)`                  | string matches regex                 |
| `doesNotMatch(str, regex)`           | string doesn't match                 |
| `fail(msg)`                          | always fails                         |

```js
assert.deepStrictEqual({ a: [1] }, { a: [1] }); // ✅ same content
assert.throws(() => JSON.parse("{bad}"), SyntaxError); // ✅ throws SyntaxError
assert.match("asha@mail.com", /@/); // ✅ has @
await assert.rejects(Promise.reject(new Error("x"))); // ✅ rejects
```

`strictEqual` on objects compares **references**, so use `deepStrictEqual` for content.

> **In one line:** `strictEqual` for values, `deepStrictEqual` for objects, `throws` / `rejects` for errors.

---

### 53. What is the Util module?

A built-in toolbox of **helper functions** for common jobs.

**Real-life:** a toolbox with an adapter. `promisify` is like a plug adapter that makes an old charger (callback) fit a new socket (Promise).

```js
const util = require("util");
const fs = require("fs");

const readFile = util.promisify(fs.readFile); // ⭐ most used
const text = await readFile("hello.txt", "utf8");
console.log(text); // Hello
```

> **In one line:** `util` = helpers; `promisify` turns callback functions into Promises.

### 54. What are its main methods?

| Method                                          | Does                                          |
| ----------------------------------------------- | --------------------------------------------- |
| `promisify(fn)`                                 | callback fn → Promise ⭐                      |
| `callbackify(asyncFn)`                          | async fn → callback style                     |
| `inspect(obj, opts)`                            | object → readable string (debugging)          |
| `format("%s has %d", a, b)`                     | printf-like formatting                        |
| `isDeepStrictEqual(a, b)`                       | deep equality → `true` / `false`              |
| `types.isDate(v)` / `isMap(v)` / `isPromise(v)` | check type                                    |
| `deprecate(fn, "msg")`                          | warn when an old function is used             |
| `debuglog("section")`                           | logs only when `NODE_DEBUG=section` is set    |
| `inherits(ctor, superCtor)`                     | old inheritance (use `class extends` instead) |

```js
util.format("%s has %d apples", "Asha", 3); // 'Asha has 3 apples'
util.isDeepStrictEqual([1, 2], [1, 2]); // true

const obj = { a: { b: { c: { d: 1 } } } };
console.log(obj); // { a: { b: { c: [Object] } } }
console.log(util.inspect(obj, { depth: null })); // shows everything
```

> **In one line:** `promisify` for old callbacks, `inspect` for deep objects, `format` for strings.

---

### 55. What is the Readline module?

A built-in module to **read user input from the terminal**, line by line.

**Real-life:** a shop assistant asks "What's your name?", waits for your answer, then replies.

```js
const readline = require("readline/promises"); // promise API (cleaner)

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const name = await rl.question("Your name? ");
  console.log(`Hi ${name}!`);
  rl.close(); // ⚠️ needed, or the program never exits
}

main();
```

**Output:**

```
Your name? Asha
Hi Asha!
```

For the callback API, use `require("readline")` and `rl.question(query, (answer) => {})`.

> **In one line:** `createInterface` + `question` = ask and wait for input; always `close()`.

### 56. What are its main methods?

| Method                               | Does                             |
| ------------------------------------ | -------------------------------- |
| `createInterface({ input, output })` | create reader                    |
| `rl.question(query, cb)`             | show prompt → wait → get answer  |
| `rl.close()`                         | close (⚠️ needed to exit)        |
| `rl.pause()` / `rl.resume()`         | pause / resume input             |
| `rl.setPrompt("> ")` + `rl.prompt()` | set and show a prompt            |
| `rl.write(data)`                     | write to output / simulate input |
| `rl.on("line", fn)`                  | runs for every line entered      |

> **In one line:** `question` for one answer, `on("line")` for many.

---

### 57. What is the Query String module?

Converts a query string to an object and back.

**Real-life:** turning a written order ("name=Ashish&age=30") into a filled form, and back.

```js
const querystring = require("querystring");

querystring.parse("name=Ashish&age=30"); // { name: 'Ashish', age: '30' }
querystring.stringify({ name: "Ashish", age: 30 }); // 'name=Ashish&age=30'
```

- Values are always **strings** (`age: '30'`).
- It's a **legacy** module. For new code, use `URLSearchParams`:

```js
Object.fromEntries(new URLSearchParams("name=Ashish&age=30"));
// { name: 'Ashish', age: '30' }
```

> **In one line:** `parse` = string → object, `stringify` = object → string; prefer `URLSearchParams`.

---

### 58. Which npm commands keep a project healthy?

**Real-life:** a car service. Check what's old, update parts, check safety, remove parts you don't use.

```bash
npm outdated        # check updates
npm update          # update all (within allowed versions)
npm audit           # security check
npm audit fix       # auto-fix security issues
npm ls              # dependency tree (yarn: yarn list)
npx depcheck        # find unused dependencies
```

`npm update` only updates within the range in package.json (`^1.2.0` → latest `1.x`), not to a new major version.

> **In one line:** `outdated` → `update` → `audit` → `depcheck` keeps dependencies fresh and safe.

### 59. What are peerDependencies?

Packages your plugin **needs**, but that the **main project** must install.

**Real-life:** a phone case made for iPhone 15. The case doesn't come with a phone; you must already have the right one.

```json
{
  "name": "my-react-plugin",
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
```

> **In one line:** peerDependencies = "works with this version, but you install it".

---

### 60. What are the HTTP methods?

**Real-life:** a library. Look at a book (GET), add a new book (POST), replace a book (PUT), fix one page (PATCH), remove a book (DELETE).

| Method  | Use                                     | Idempotent?         |
| ------- | --------------------------------------- | ------------------- |
| GET     | fetch resource                          | ✅                  |
| POST    | create resource                         | ❌                  |
| PUT     | replace resource                        | ✅                  |
| PATCH   | partial update                          | ❌ (not guaranteed) |
| DELETE  | remove resource                         | ✅                  |
| HEAD    | GET without body                        | ✅                  |
| OPTIONS | describe allowed methods (used in CORS) | ✅                  |

**Idempotent** = doing it many times gives the same result as doing it once.

- Pressing "delete user 5" 3 times → user 5 is still just deleted ✅
- Pressing "create order" 3 times → 3 orders ❌

> **In one line:** GET reads, POST creates, PUT replaces, PATCH updates, DELETE removes.

---

### 61. What do the status codes mean?

**Real-life:** replies from a shopkeeper.

```
2xx → SUCCESS ✅
200 → OK / I did it
201 → Created / I created it
204 → No Content / done, nothing to return

3xx → REDIRECT ↪️
301 → Moved Permanently / go to the new address
304 → Not Modified / use your saved copy

4xx → CLIENT ERROR ❌ (your mistake)
400 → Bad Request / your request is wrong
401 → Unauthorized / who are you? 🔐 (not logged in)
403 → Forbidden / I know you, but not allowed
404 → Not Found / can't find it 🔍

5xx → SERVER ERROR 💥 (our mistake)
500 → Server Error / server problem
```

```js
res.writeHead(404, { "Content-Type": "text/plain" });
res.end("Not Found");
```

> **In one line:** 2xx = success, 3xx = go elsewhere, 4xx = client's fault, 5xx = server's fault.

---

### 62. What are the default ports?

**Real-life:** door numbers of a building. If you don't say which door, people use the main one.

```
HTTP  → 80
HTTPS → 443
```

`https://example.com` = `https://example.com:443`. Ports can be changed (for example, `3000` in development).

> **In one line:** HTTP = 80, HTTPS = 443, unless you choose another port.

---

### 63. What's the difference HTTP/1.1 vs HTTP/2?

**Real-life:** HTTP/1.1 = a single-lane road, cars wait one behind another. HTTP/2 = a multi-lane highway, all cars move together.

```
HTTP/1.1: Request → HTML, Request → CSS, Request → JS, Request → Image
          (requests may wait on the same connection)

HTTP/2:   One Connection → HTML, CSS, JS, Image (multiplexed, parallel)
```

|                         | HTTP/1.1                | HTTP/2                      |
| ----------------------- | ----------------------- | --------------------------- |
| Requests per connection | one at a time           | many at once (multiplexing) |
| Format                  | text                    | binary                      |
| Headers                 | sent in full every time | compressed                  |
| Speed                   | slower for many files   | faster                      |

> **In one line:** HTTP/2 sends many files at once over one connection, so pages load faster.

---

### 64. What is the `process` object?

A global object with info and controls for the **running Node app**.

**Real-life:** a car dashboard. It shows speed and fuel, and lets you turn the engine off.

```js
console.log(process.pid); // e.g. 12345
console.log(process.cwd()); // e.g. /home/asha/project
console.log(process.env.NODE_ENV); // e.g. production
```

> **In one line:** `process` = info and controls for your running app.

### 65. What are its main properties and methods?

| Property / Method                     | Does                                  |
| ------------------------------------- | ------------------------------------- |
| `process.pid`                         | current process ID                    |
| `process.argv`                        | CLI args array                        |
| `process.env`                         | environment variables                 |
| `process.cwd()`                       | current working directory             |
| `process.chdir(dir)`                  | change working directory              |
| `process.exit(0)`                     | exit (`0` = success, `1` = error)     |
| `process.kill(pid, signal)`           | send a signal to a process            |
| `process.uptime()`                    | seconds since start                   |
| `process.memoryUsage()`               | memory stats (`rss`, `heapUsed`, ...) |
| `process.stdout` / `stdin` / `stderr` | I/O streams                           |

**Real use: graceful shutdown**

```js
process.on("SIGINT", () => {
  // Ctrl + C
  console.log("Closing server...");
  server.close(() => process.exit(0));
});
```

`process.env` values are always **strings**: `process.env.PORT` is `'3000'`, not `3000`.

> **In one line:** `env` for config, `exit` to stop, `on("SIGINT")` to shut down cleanly.

---

### 66. What are the main ES6+ features?

Modern JavaScript features that make code shorter and cleaner.

**Real-life:** upgrading from a basic phone to a smartphone. Same calls, but faster and easier.

**Variables**

```js
let x = 1; // block-scoped, can reassign
const y = 2; // block-scoped, can't reassign
// ❌ avoid var: function-scoped, hoisted
```

**Arrow functions + template literals**

```js
const add = (a, b) => a + b; // implicit return
const greet = (name) => `Hi ${name}`; // single param, parens optional
// ⚠️ arrow functions have no own `this`
```

**Destructuring** (take values out easily)

```js
const { name, age } = person; // object
const [a, b] = [1, 2]; // array
const { x: renamed } = obj; // rename
const { z = 10 } = obj; // default value
```

**Spread & rest** (`...`)

```js
const arr2 = [...arr1, 4, 5]; // spread: expand array
const obj2 = { ...obj1, extra: true }; // spread: copy object
function sum(...nums) {} // rest: collect args into an array
```

**Class + async/await**

```js
class Dog extends Animal {}

async function getData(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
```

> **In one line:** `let`/`const`, arrows, templates, destructuring, spread/rest, classes and async/await.

### 67. Spread vs rest: what's the difference?

Same `...` symbol, opposite jobs.

**Real-life:** spread = unpacking a bag onto the table. Rest = packing leftover items into one bag.

```js
const nums = [1, 2, 3];
console.log(Math.max(...nums)); // spread → 3

function sum(...all) {
  // rest → [1, 2, 3]
  return all.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6
```

> **In one line:** spread **opens** an array/object, rest **collects** values into one.

---

### 68. What is TypeScript and how do you set it up?

JavaScript **with types**. It catches mistakes **before** you run the code.

**Real-life:** a form with labelled boxes ("Age: numbers only"). You can't write your name in the age box.

```bash
npm init -y
npm install typescript @types/node ts-node --save-dev
npx tsc --init        # creates tsconfig.json
npx tsc               # compile .ts → .js
npx ts-node app.ts    # run .ts directly
```

```ts
let name: string = "Ashish";
name = 42; // ❌ Error: Type 'number' is not assignable to type 'string'
```

Newer Node versions (23.6+) can also run simple `.ts` files directly: `node app.ts`.

> **In one line:** TypeScript = JavaScript + types, so errors show up while you write code.

### 69. What are the main TypeScript features?

**Basic types**

```ts
let name: string = "Ashish"; // basic type
let id: string | number = 42; // union: either type
let anything: any = "ok"; // ❌ turns off checking, avoid
type User = { name: string; age: number }; // type alias
type Config = { host: string; port?: number; readonly token: string };
// port? = optional, readonly = can't change
```

**Interface** (shape of an object)

```ts
interface Person {
  id: number;
  name: string;
  email?: string;
}
interface Employee extends Person {
  role: string;
}

// Same-name interfaces merge → { host, port }
interface Server {
  host: string;
}
interface Server {
  port: number;
}
// ⚠️ type aliases don't merge
```

**Generics** (reusable with any type)

```ts
function identity<T>(arg: T): T {
  return arg;
}
identity<string>("hi"); // 'hi'

function getLength<T extends { length: number }>(a: T) {
  return a.length;
}
getLength("hello"); // 5
```

**Enum**

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
Direction.Up; // 0
```

**Utility types**

| Type                          | Does                        |
| ----------------------------- | --------------------------- |
| `Partial<User>`               | all props optional          |
| `Required<User>`              | all props required          |
| `Readonly<User>`              | all props can't change      |
| `Pick<User, "name" \| "age">` | keep only these             |
| `Omit<User, "email">`         | remove these                |
| `Record<string, number>`      | `{ [key: string]: number }` |
| `Awaited<Promise<string>>`    | `string`                    |
| `ReturnType<typeof fn>`       | type the function returns   |

**Advanced types**

```ts
type Flags<T> = { [K in keyof T]: boolean }; // mapped type
type IsString<T> = T extends string ? "yes" : "no"; // conditional type
type MyReturn<T> = T extends (...a: any[]) => infer R ? R : never; // infer
```

**Type guards** (narrow the type)

```ts
typeof val === "string"; // typeof guard
err instanceof Error; // instanceof guard
"name" in obj; // in guard

function isString(v: unknown): v is string {
  // custom guard
  return typeof v === "string";
}
```

**Extend a 3rd-party type** (for example, add `userId` to Express)

```ts
declare module "express" {
  interface Request {
    userId?: string;
  }
}
```

**Decorators**

```ts
@Log
class MyService {}
```

TS 5+ supports standard decorators. Older-style decorators (used by NestJS, TypeORM) need `"experimentalDecorators": true`.

> **In one line:** types + interfaces for shape, generics for reuse, utility types for quick changes.

---

### 70. What are ESLint and Prettier?

**Real-life:** writing an essay. ESLint = a teacher marking **mistakes**. Prettier = a tool that makes the **handwriting neat**.

| Tool                       | Job                                             |
| -------------------------- | ----------------------------------------------- |
| **ESLint**                 | finds bugs, enforces code rules                 |
| **Prettier**               | formatting: spacing, quotes, line length        |
| **eslint-config-prettier** | turns off ESLint rules that clash with Prettier |

```bash
npm install --save-dev eslint prettier eslint-config-prettier
```

ESLint 9+ uses an `eslint.config.js` file (flat config).

> **In one line:** ESLint = correct code, Prettier = clean-looking code.

### 71. Which scripts should you add?

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

| Script                 | Does                                                  |
| ---------------------- | ----------------------------------------------------- |
| `npm run lint`         | check for issues                                      |
| `npm run lint:fix`     | auto-fix ESLint issues                                |
| `npm run format`       | auto-format all files                                 |
| `npm run format:check` | check formatting without changing files (good for CI) |

`package.json` doesn't allow comments, so keep notes outside the file.

> **In one line:** use `lint` + `format:check` in CI; `lint:fix` + `format` while coding.
