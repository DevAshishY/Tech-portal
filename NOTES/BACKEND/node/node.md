# ⚡ Node.js Quick Notes

---

## 1. Running Node.js

```bash
node app.js              # Run file
node app.js arg1 arg2    # With arguments
node --watch app.js      # Watch mode (auto-restart)
NODE_ENV=production node app.js  # With env variable
```

- `process.argv[2]` → first custom argument
- `process.env.VAR_NAME` → read env variables

---

## 2. What is Node.js?

- **Runtime** built on **V8** (Chrome's JS engine)
- Runs JS **outside the browser**
- **Single-threaded**, **non-blocking**, **event-driven**
- Great for: REST APIs, real-time apps, microservices, chat apps

### Flow:
> Request → Event Queue → Event Loop → (simple: main thread) OR (complex: Thread Pool) → Callback Queue → Response


```
const fs = require('fs');

console.log('1 sync: start');

setTimeout(() => console.log('timer (macrotask)'), 0);
setImmediate(() => console.log('immediate (check phase)'));
fs.readFile(__filename, () => console.log('file I/O (thread pool -> poll)'));

Promise.resolve().then(() => console.log('4 microtask: promise'));
process.nextTick(() => console.log('3 microtask: nextTick'));

console.log('2 sync: end');
```

```op:
1 sync: start
2 sync: end
3 microtask: nextTick
4 microtask: promise
timer (macrotask)
immediate (check phase)
file I/O (thread pool -> poll)

````
---

## 3. Blocking vs Non-blocking

| | Blocking | Non-blocking |
|---|---|---|
| Example | `fs.readFileSync()` | `fs.readFile()` |
| Behaviour | Pauses everything | Others keep running |

**Rule:** Always prefer non-blocking (async) code.

---

## 4. Event Loop

Processes in this order:
1. **Sync code** (main script)
2. **Microtasks** — `Promise`, `process.nextTick`
3. **Timers** — `setTimeout`, `setInterval`
4. **I/O Callbacks** — file system, network
5. **`setImmediate`**
6. **Close events** — `socket.on('close')`

> Between each phase → microtasks run again.

---

## 5. Promises

```
Pending → Fulfilled ✅
         → Rejected ❌
```

- Use `async/await` for cleaner code
- Use `Promise.all()` for parallel operations
- Always handle errors in async code

---

## 6. Errors

| Type | Example |
|---|---|
| `SyntaxError` | `JSON.parse('{bad}')` |
| `TypeError` | `null.property` |
| `ReferenceError` | `unknownVar` |
| `ENOENT` | File not found |
| `ECONNREFUSED` | Connection refused |

---

## 7. Modules

### CommonJS (CJS)
```js
const fs = require('fs');        // import
module.exports = myFunc;          // export
```

### ES Modules (ESM)
```js
import { fn } from './file.mjs'; // import
export function fn() {}          // named export
export default fn;               // default export
import * as all from './file';   // import all
```

**Enable ESM:** use `.mjs` extension OR add `"type": "module"` in `package.json`.

---

## 8. Built-in Modules

| Module | Purpose |
|---|---|
| `fs` | File system |
| `http` | HTTP server/client |
| `https` | HTTPS (HTTP + SSL/TLS) |
| `path` | File path utilities |
| `os` | OS info |
| `events` | Event handling |
| `stream` | Stream data |
| `crypto` | Encryption |
| `url` | URL parsing |
| `querystring` | Query string parsing |

---

## 9. Dependency Management (npm)

### Key Files
```
package.json       → what we need
package-lock.json  → exact versions installed
node_modules/      → actual packages
```

### SemVer
```
MAJOR.MINOR.PATCH  →  2.8.1
^2.8.1 → any 2.x.x
~2.8.1 → any 2.8.x
2.8.1  → exact
```

### Dependency Types
| Type | Use |
|---|---|
| `dependencies` | Required at runtime |
| `devDependencies` | Dev/test only |
| `peerDependencies` | Plugin compatibility |
| `optionalDependencies` | Optional |

### Common Commands
```bash
npm install express          # install
npm install express@4.18.2   # specific version
npm install -D jest          # dev dependency
npm uninstall express        # remove
npm outdated                 # check updates
npm update                   # update all
npm audit                    # security check
npm audit fix                # auto-fix
npm ls                       # dependency tree
```

---

## 10. HTTP Server

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => console.log('Server on port 3000'));
```

- `req.url` → request path
- `req.method` → GET/POST etc.
- `req.headers` → request headers
- `res.writeHead(status, headers)` → set response headers
- `res.end(data)` → send response

### HTTP Methods (Best Practices)
| Method | Use | Idempotent? |
|---|---|---|
| GET | Fetch resource | ✅ |
| POST | Create resource | ❌ |
| PUT | Replace resource | ✅ |
| PATCH | Partial update | ❌ |
| DELETE | Remove resource | ✅ |
| HEAD | GET without body | ✅ |
| OPTIONS | Describe options | ✅ |

### Status Codes
| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

### Default Ports
- HTTP → **80**
- HTTPS → **443**

---

## 11. URL Parsing

```js
const url = require('url');
const parsed = url.parse(req.url, true);
parsed.pathname  // path without query
parsed.query     // query as object
```

| Method | Use |
|---|---|
| `url.parse()` | String → object |
| `url.format()` | Object → string |
| `new URL()` | Modern WHATWG API (recommended) |
| `querystring.parse()` | Query string → object |
| `querystring.stringify()` | Object → query string |

---

## 12. HTTPS

- HTTP + **TLS/SSL** encryption
- Requires **SSL certificate**
- Encrypts data, authenticates server, ensures integrity

### Certificate Types
- **Self-signed** → dev/testing only
- **DV** → domain validation
- **OV** → org validation
- **EV** → highest trust (shows company name)
- **Wildcard** → all subdomains (`*.example.com`)
- **SAN/Multi-domain** → multiple domains

---

## 13. HTTP/2

> HTTP/1.1 → text-based | HTTP/2 → binary, faster

| Feature | Benefit |
|---|---|
| Multiplexing | Multiple requests on 1 connection |
| Header Compression | Less overhead (HPACK) |
| Server Push | Send resources before client asks |
| Stream Prioritization | Load important things first |

---

## 14. Streaming

Use streams for large files → **memory efficient**.

```js
fs.createReadStream(filePath).pipe(res);  // stream file to response
```

**Benefits:**
- Low memory usage (chunks, not all at once)
- Faster first byte
- Auto backpressure for slow clients

**Use cases:** file upload/download, video streaming, log processing, proxying

---

## 15. File System (`fs`)

### Read
```js
fs.readFile('file.txt', 'utf8', (err, data) => {});  // async
fs.readFileSync('file.txt', 'utf8');                   // sync (blocking)
```

### Write / Create
```js
fs.writeFile()     // create/overwrite
fs.appendFile()    // append to file
// streams for large files
```

### File Flags
| Flag | Meaning |
|---|---|
| `'w'` | Write (create/truncate) |
| `'a'` | Append (create if not exists) |
| `'r+'` | Read+Write (must exist) |
| `'wx'` | Write (fail if exists) |
| `'w+'` | Read+Write (create/truncate) |

### Delete
```js
fs.unlink('file.txt', cb)             // delete file
Promise.all([...].map(f => fs.promises.unlink(f)))  // delete many
fs.rmdir() / fs.rm()                  // delete directory
```

### Rename / Move
```js
fs.rename('old.txt', 'new.txt', cb)  // rename or move
```

---

## 16. Path Module

| Method | What it does |
|---|---|
| `path.basename(p)` | Last part of path (filename) |
| `path.extname(p)` | File extension (`.txt`) |
| `path.dirname(p)` | Directory of path |
| `path.join(a, b)` | Join paths safely |
| `path.resolve(a, b)` | Absolute path (right to left) |
| `path.parse(p)` | Path → object (root, dir, base, ext, name) |
| `path.format(obj)` | Object → path string |
| `path.normalize(p)` | Clean up `..` and `.` |
| `path.relative(a, b)` | Relative path from a to b |
| `path.isAbsolute(p)` | `true` if absolute path |

### Special Variables (CJS only)
```js
__dirname   // directory of current file
__filename  // full path of current file
```

---

## 17. OS Module

```js
const os = require('os');  // CommonJS
import os from 'node:os'; // ESM
```

### Methods

| Method | Returns |
|---|---|
| `os.arch()` | CPU architecture — `'x64'`, `'arm64'` |
| `os.platform()` | OS platform — `'win32'`, `'linux'`, `'darwin'` |
| `os.type()` | OS name — `'Linux'`, `'Darwin'`, `'Windows_NT'` |
| `os.release()` | OS release version |
| `os.version()` | OS version string |
| `os.hostname()` | Machine hostname |
| `os.homedir()` | Current user's home directory |
| `os.tmpdir()` | Temp files directory |
| `os.uptime()` | System uptime in **seconds** |
| `os.totalmem()` | Total RAM in **bytes** |
| `os.freemem()` | Free RAM in **bytes** |
| `os.cpus()` | Array of CPU core info objects |
| `os.loadavg()` | `[1min, 5min, 15min]` load averages |
| `os.networkInterfaces()` | Network interface details |
| `os.userInfo()` | Current user info (username, uid, etc.) |
| `os.endianness()` | `'BE'` (big-endian) or `'LE'` (little-endian) |
| `os.getPriority([pid])` | Process scheduling priority |
| `os.availableParallelism()` | Recommended parallel tasks count |

### Properties

| Property | Value |
|---|---|
| `os.EOL` | Line ending — `\n` (POSIX) / `\r\n` (Windows) |
| `os.constants` | Object with error codes & process signals |
| `os.devNull` | Null device path — `/dev/null` or `\\.\nul` |

### Quick Example
```js
const os = require('os');

console.log(os.platform());   // linux
console.log(os.arch());       // x64
console.log(os.hostname());   // my-machine
console.log(os.totalmem());   // 8589934592 (bytes)
console.log(os.freemem());    // 2147483648 (bytes)
console.log(os.uptime());     // 3600 (seconds)
console.log(os.cpus().length); // 8 (cores)
console.log(os.homedir());    // /home/username
console.log(os.tmpdir());     // /tmp
console.log(os.EOL);          // '\n' on Linux
```

> 💡 **Memory tip:** `totalmem` & `freemem` return **bytes** → divide by `1024**3` to get GB.

---

## 18. URL Module

Two APIs exist — always use **WHATWG** (modern), avoid **Legacy** (deprecated).

```js
const { URL } = require('url'); // or just use new URL() — it's global in Node.js
```

---

### ✅ WHATWG URL API (Modern — Use This)

```js
const myURL = new URL('https://user:pass@example.com:8080/path?q=test#hash');
```

#### URL Properties (getters & setters)

| Property | Example value | Description |
|---|---|---|
| `.href` | `'https://example.com/path'` | Full URL string |
| `.protocol` | `'https:'` | Protocol (includes `:`) |
| `.host` | `'example.com:8080'` | Host + port |
| `.hostname` | `'example.com'` | Host without port |
| `.port` | `'8080'` | Port number |
| `.pathname` | `'/path'` | Path only |
| `.search` | `'?q=test'` | Query string (with `?`) |
| `.searchParams` | `URLSearchParams` | Query params object |
| `.hash` | `'#hash'` | Fragment |
| `.username` | `'user'` | Username |
| `.password` | `'pass'` | Password |
| `.origin` | `'https://example.com:8080'` | Read-only origin |

#### URLSearchParams — Query Manipulation

```js
const url = new URL('https://example.com?name=John&age=25');

url.searchParams.get('name');        // 'John'
url.searchParams.set('name', 'Ali'); // update
url.searchParams.append('city', 'London'); // add new
url.searchParams.delete('age');      // remove
url.searchParams.has('name');        // true
url.searchParams.toString();         // 'name=Ali&city=London'

// Loop through all params
for (const [key, val] of url.searchParams) {
  console.log(key, val);
}
```

#### Resolving Relative URLs

```js
const base = 'https://example.com/home/';
const resolved = new URL('about', base);
console.log(resolved.href); // 'https://example.com/home/about'
```

#### Convert back to string

```js
myURL.toString();  // full URL string
myURL.href;        // same thing
```

---

### ❌ Legacy URL API (Deprecated — Avoid)

| Old Method | Status | Use Instead |
|---|---|---|
| `url.parse(str)` | ⚠️ Deprecated | `new URL(str)` |
| `url.format(obj)` | ⚠️ Deprecated | `urlObj.toString()` |
| `url.resolve(from, to)` | ⚠️ Deprecated | `new URL(path, base).href` |

> ⚠️ Legacy API has security issues with malformed URLs and doesn't match browser behaviour. May be removed in future Node.js versions.

---

### Quick Example

```js
const myURL = new URL('https://example.com:3000/products?sort=asc&page=2#top');

console.log(myURL.hostname);              // example.com
console.log(myURL.port);                  // 3000
console.log(myURL.pathname);             // /products
console.log(myURL.searchParams.get('sort')); // asc
console.log(myURL.hash);                 // #top

// Modify and read back
myURL.searchParams.set('page', '3');
console.log(myURL.href); // updated URL with page=3
```

---

## 19. Events Module (EventEmitter)

Node.js is **event-driven** — the `events` module lets you create, listen to, and emit custom events.

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();
```

---

### Core Methods

| Method | Description |
|---|---|
| `.on(event, listener)` | Add a listener (runs **every time** event fires) |
| `.addListener(event, listener)` | Same as `.on()` |
| `.once(event, listener)` | Add listener that runs **only once**, then auto-removed |
| `.emit(event, ...args)` | Fire the event, pass args to all listeners |
| `.off(event, listener)` | Remove a specific listener |
| `.removeListener(event, listener)` | Same as `.off()` |
| `.removeAllListeners([event])` | Remove all listeners (or all for a specific event) |
| `.listeners(event)` | Returns array of listeners for the event |
| `.listenerCount(event)` | Returns number of listeners for the event |
| `.setMaxListeners(n)` | Change the default max listeners limit (default: 10) |

---

### Quick Example

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Register listener
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// One-time listener
emitter.once('connect', () => {
  console.log('Connected! (fires once only)');
});

// Fire events
emitter.emit('greet', 'Ashish'); // Hello, Ashish!
emitter.emit('connect');         // Connected!
emitter.emit('connect');         // (nothing — already removed)

// Count & remove
console.log(emitter.listenerCount('greet')); // 1
emitter.off('greet', listener);
```

---

### Extending EventEmitter (Real-world Pattern)

```js
const EventEmitter = require('events');

class MyServer extends EventEmitter {
  start() {
    console.log('Server started');
    this.emit('ready', { port: 3000 });
  }
}

const server = new MyServer();
server.on('ready', (info) => console.log(`Listening on port ${info.port}`));
server.start();
// Server started
// Listening on port 3000
```

---

### Error Handling ⚠️

> **Always add an `'error'` listener** — if an error event fires with no listener, Node.js will **throw and crash**.

```js
emitter.on('error', (err) => {
  console.error('Caught error:', err.message);
});

emitter.emit('error', new Error('Something broke'));
```

---

### Key Points

- `emit()` is **synchronous** — all listeners run before the next line
- `this` inside a listener = the emitter instance (use regular function, not arrow, if you need `this`)
- Node.js warns if > **10 listeners** on a single event → use `setMaxListeners(n)` to increase
- Built-in Node.js modules (`fs`, `http`, `stream`) extend `EventEmitter` internally

---

## 20. Streams Module

Process data **chunk by chunk** — no need to load everything into memory.

```js
const fs = require('fs');
const { pipeline } = require('stream');
```

---

### 4 Stream Types

| Type | Direction | Example |
|---|---|---|
| **Readable** | Read only | `fs.createReadStream`, HTTP `req` |
| **Writable** | Write only | `fs.createWriteStream`, HTTP `res`, `process.stdout` |
| **Duplex** | Read + Write | TCP sockets, WebSockets |
| **Transform** | Read + Write + Modify | `zlib` compression, `crypto`, uppercase text |

> All streams extend `EventEmitter`.

---

### Readable Stream

```js
const fs = require('fs');
const readable = fs.createReadStream('file.txt', { encoding: 'utf8' });

readable.on('data', (chunk) => console.log('Chunk:', chunk));
readable.on('end', () => console.log('Done reading'));
readable.on('error', (err) => console.error(err));
```

**Readable methods:**

| Method | Use |
|---|---|
| `.read()` | Manually read a chunk |
| `.pause()` | Stop emitting `data` events |
| `.resume()` | Resume emitting `data` events |
| `.setEncoding('utf8')` | Set string encoding |
| `.pipe(dest)` | Connect to a writable stream |

---

### Writable Stream

```js
const writable = fs.createWriteStream('output.txt');

writable.write('Hello ');
writable.write('World\n');
writable.end(); // signal no more data

writable.on('finish', () => console.log('Done writing'));
writable.on('error', (err) => console.error(err));
```

**Writable methods:**

| Method | Use |
|---|---|
| `.write(chunk)` | Write a chunk (returns `false` if buffer full) |
| `.end([chunk])` | Signal end of writing |
| `.destroy()` | Force close the stream |

---

### `.pipe()` — Connect Streams

```js
// Read file and write to another (memory-efficient)
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// Chain multiple pipes
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())       // transform: compress
  .pipe(fs.createWriteStream('output.txt.gz'));
```

- `.pipe()` handles **backpressure** automatically
- Returns the destination stream (enables chaining)

---

### `stream.pipeline()` — Safer than `.pipe()`

```js
const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('output.gz'),
  (err) => {
    if (err) console.error('Pipeline failed:', err);
    else console.log('Pipeline done');
  }
);
```

> ✅ Use `pipeline()` over `.pipe()` — it properly handles errors and cleanup.

---

### Transform Stream

```js
const { Transform } = require('stream');

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin.pipe(upperCase).pipe(process.stdout);
```

---

### Stream Events Summary

| Event | Stream Type | When |
|---|---|---|
| `data` | Readable | Chunk available |
| `end` | Readable | No more data |
| `readable` | Readable | Data ready to read |
| `finish` | Writable | All data flushed after `.end()` |
| `drain` | Writable | Ready for more data (backpressure cleared) |
| `error` | All | Error occurred |
| `close` | All | Stream/resource closed |

---

### Key Points

- **Why streams?** Low memory, faster first byte, handles backpressure
- **Backpressure:** When writable is slower than readable — `.pipe()` auto-pauses the source
- `process.stdin` = Readable, `process.stdout` = Writable (both are streams)
- Use `async/await` with `stream/promises` in modern Node.js

---

## 21. Buffer

A **Buffer** is a fixed-size chunk of raw binary data stored **outside the V8 heap**. Used for binary files, network packets, streams, and encoding conversions.

> `Buffer` is **global** — no `require()` needed.

---

### Creating Buffers

| Method | Use |
|---|---|
| `Buffer.alloc(size)` | Safe — creates zero-filled buffer of `size` bytes |
| `Buffer.allocUnsafe(size)` | Faster but may contain old/sensitive data ⚠️ |
| `Buffer.from(string, encoding)` | Create from a string (default encoding: `'utf8'`) |
| `Buffer.from(array)` | Create from array of bytes |
| `Buffer.from(buffer)` | Copy an existing buffer |

```js
const buf1 = Buffer.alloc(4);              // <Buffer 00 00 00 00>
const buf2 = Buffer.from('Hello');         // <Buffer 48 65 6c 6c 6f>
const buf3 = Buffer.from('SGVsbG8=', 'base64'); // from base64
```

> ❌ Never use `new Buffer()` — deprecated and unsafe.

---

### Reading & Writing

```js
const buf = Buffer.alloc(4);
buf.write('Hi');              // write string into buffer
console.log(buf[0]);          // 72  (byte value of 'H')
console.log(buf.length);      // 4   (fixed size)
```

---

### Converting to String

```js
const buf = Buffer.from('Hello World');
buf.toString();           // 'Hello World'  (default utf8)
buf.toString('hex');      // '48656c6c6f...'
buf.toString('base64');   // 'SGVsbG8gV29ybGQ='
buf.toString('ascii');    // 'Hello World'
```

**Supported encodings:** `utf8`, `ascii`, `base64`, `hex`, `latin1`, `utf16le`

---

### Key Methods

| Method | Description |
|---|---|
| `buf.toString(enc)` | Convert buffer → string |
| `buf.slice(start, end)` | View part of buffer (**shares same memory**) |
| `buf.copy(target)` | Copy bytes into another buffer |
| `buf.equals(otherBuf)` | `true` if both buffers have same bytes |
| `buf.includes(value)` | `true` if buffer contains value |
| `buf.indexOf(value)` | Find position of value in buffer |
| `buf.fill(value)` | Fill entire buffer with a value |
| `Buffer.concat([b1, b2])` | Merge multiple buffers into one |
| `Buffer.compare(b1, b2)` | Returns `0` (equal), `-1`, or `1` (for sorting) |
| `Buffer.isBuffer(obj)` | `true` if obj is a Buffer |

---

### Quick Examples

```js
// Concat
const a = Buffer.from('Hello ');
const b = Buffer.from('World');
const combined = Buffer.concat([a, b]);
console.log(combined.toString()); // 'Hello World'

// Slice (same memory!)
const original = Buffer.from('Node.js');
const sliced = original.slice(0, 4);
console.log(sliced.toString()); // 'Node'
sliced[0] = 88; // modifies original too! (X = 88)

// Compare (for sorting)
Buffer.compare(Buffer.from('a'), Buffer.from('b')); // -1
Buffer.compare(Buffer.from('b'), Buffer.from('a')); // 1
Buffer.compare(Buffer.from('a'), Buffer.from('a')); // 0
```

---

### Key Points

- Buffers are **fixed size** — cannot be resized after creation
- `buf.slice()` shares memory — use `Buffer.from(buf.slice())` to get an independent copy
- Buffers work seamlessly with **streams** and **fs** operations
- Use `Buffer.alloc()` not `Buffer.allocUnsafe()` unless performance is critical

---

## 22. Crypto Module

Built-in module wrapping **OpenSSL** — for hashing, encryption, signing, and random data.

```js
const crypto = require('crypto');
```

---

### Overview

| Feature | Method | Use |
|---|---|---|
| **Hashing** | `createHash()` | One-way fingerprint of data |
| **HMAC** | `createHmac()` | Hash + secret key (verify integrity) |
| **Encrypt** | `createCipheriv()` | Symmetric encryption |
| **Decrypt** | `createDecipheriv()` | Symmetric decryption |
| **Sign** | `createSign()` | Asymmetric digital signature |
| **Verify** | `createVerify()` | Verify signature with public key |
| **Random** | `randomBytes()` | Cryptographically strong random data |

---

### 1. Hashing

```js
const hash = crypto.createHash('sha256');
hash.update('Hello World');
console.log(hash.digest('hex')); // fixed-length hex string

// One-liner
const result = crypto.createHash('sha256').update('data').digest('hex');
```

- Common algorithms: `sha256`, `sha512`, `md5` *(avoid md5/sha1 for security)*
- Encodings: `hex`, `base64`, `binary`
- Check all: `crypto.getHashes()`

---

### 2. HMAC (Hash + Secret Key)

```js
const hmac = crypto.createHmac('sha256', 'my-secret-key');
hmac.update('Hello World');
console.log(hmac.digest('hex'));

// One-liner
crypto.createHmac('sha256', 'secret').update('data').digest('hex');
```

> Use HMAC when you need to **verify both integrity and authenticity** (e.g., JWT signing, API auth).

---

### 3. Symmetric Encryption (AES)

```js
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);  // 32 bytes for AES-256
const iv  = crypto.randomBytes(16);  // Always random IV

// Encrypt
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Hello', 'utf8', 'hex');
encrypted += cipher.final('hex');

// Decrypt
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log(decrypted); // 'Hello'
```

> ⚠️ Always use a **random IV** for each encryption. Never reuse IV+key pairs.

---

### 4. Digital Signatures (Asymmetric)

```js
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

// Sign
const sign = crypto.createSign('sha256');
sign.update('My data');
const signature = sign.sign(privateKey, 'hex');

// Verify
const verify = crypto.createVerify('sha256');
verify.update('My data');
console.log(verify.verify(publicKey, signature, 'hex')); // true
```

---

### 5. Random Data

```js
// Random bytes (async — preferred)
crypto.randomBytes(16, (err, buf) => {
  console.log(buf.toString('hex')); // 32 hex chars
});

// Sync
const token = crypto.randomBytes(32).toString('hex'); // secure token

// Random integer
const n = crypto.randomInt(1, 100); // 1–99
```

---

### Hash vs HMAC vs Encrypt

| | Hash | HMAC | Encrypt |
|---|---|---|---|
| Reversible? | ❌ No | ❌ No | ✅ Yes |
| Needs key? | ❌ No | ✅ Yes | ✅ Yes |
| Use for | Checksums, passwords* | API auth, JWT | Storing/sending data |

> *For passwords use `crypto.pbkdf2()` or `bcrypt` — not plain `sha256`.

---

### Best Practices

- ✅ Use `sha256` or `sha512` for hashing
- ✅ Use `aes-256-cbc` or `aes-256-gcm` for encryption
- ✅ Always use a **random IV** — never hardcode it
- ✅ Use `randomBytes()` for tokens, salts, IVs
- ✅ Use `pbkdf2()` or `scrypt()` for password hashing
- ❌ Avoid `md5` and `sha1` for security-sensitive use
- ❌ Never reuse the same IV with the same key

---

## 23. Timers

Node.js timers are **global** — no `require()` needed. They schedule callbacks asynchronously using the event loop.

---

### Timer Functions

| Function | Description |
|---|---|
| `setTimeout(cb, delay)` | Run `cb` **once** after `delay` ms |
| `setInterval(cb, delay)` | Run `cb` **repeatedly** every `delay` ms |
| `setImmediate(cb)` | Run `cb` at the **end of current event loop iteration** (Check phase) |
| `process.nextTick(cb)` | Run `cb` **before** the next event loop phase (microtask, highest priority) |

---

### Clearing / Cancelling Timers

| Function | Cancels |
|---|---|
| `clearTimeout(id)` | Cancels a `setTimeout` |
| `clearInterval(id)` | Cancels a `setInterval` |
| `clearImmediate(id)` | Cancels a `setImmediate` |

```js
const t = setTimeout(() => console.log('runs'), 1000);
clearTimeout(t); // cancelled — never runs
```

---

### Examples

```js
// setTimeout — one time after delay
setTimeout(() => console.log('After 2s'), 2000);

// setInterval — repeat every second, stop after 3
let count = 0;
const id = setInterval(() => {
  count++;
  console.log(`Tick ${count}`);
  if (count === 3) clearInterval(id);
}, 1000);

// setImmediate — after current I/O events
setImmediate(() => console.log('Immediate'));

// process.nextTick — before everything else
process.nextTick(() => console.log('Next tick'));
```

---

### Execution Order (Priority)

```
Sync code
  ↓
process.nextTick()     ← highest priority (microtask queue)
  ↓
Promise callbacks      ← also microtasks
  ↓
setTimeout / setInterval  ← Timers phase
  ↓
setImmediate           ← Check phase
```

```js
console.log('1 - sync');
setTimeout(() => console.log('4 - setTimeout'), 0);
setImmediate(() => console.log('5 - setImmediate'));
process.nextTick(() => console.log('2 - nextTick'));
Promise.resolve().then(() => console.log('3 - promise'));

// Output: 1 → 2 → 3 → 4 → 5
```

---

### Key Comparisons

| | `setTimeout(fn, 0)` | `setImmediate(fn)` | `process.nextTick(fn)` |
|---|---|---|---|
| Event loop phase | Timers | Check | Before next phase (microtask) |
| Priority | Low | Low | **Highest** |
| Use case | Defer after delay | After I/O events | Before event loop continues |

---

### Key Points

- `delay` in `setTimeout` / `setInterval` is a **minimum** — not guaranteed (event loop may be busy)
- `setTimeout(fn, 0)` ≠ immediate — still waits for the Timers phase
- `process.nextTick()` can **starve the event loop** if called recursively — use carefully
- `setImmediate` is preferred over `setTimeout(fn, 0)` inside I/O callbacks for consistency
- All timer IDs support `.ref()` and `.unref()` to control whether they keep the process alive

---

## 24. DNS Module

Used to resolve domain names, perform reverse lookups, and query DNS records.

```js
const dns = require('dns');
// Modern Promises API
const dns = require('dns/promises');
```

---

### Core Methods

| Method | Description |
|---|---|
| `dns.lookup(hostname, cb)` | Resolve hostname → IP using **OS** (`/etc/hosts` aware) |
| `dns.resolve(hostname, type, cb)` | Resolve hostname → DNS records (bypasses OS) |
| `dns.resolve4(hostname, cb)` | Resolve → IPv4 addresses (`A` records) |
| `dns.resolve6(hostname, cb)` | Resolve → IPv6 addresses (`AAAA` records) |
| `dns.resolveMx(hostname, cb)` | Resolve → Mail exchange records |
| `dns.resolveCname(hostname, cb)` | Resolve → Canonical name records |
| `dns.resolveTxt(hostname, cb)` | Resolve → TXT records |
| `dns.resolveSrv(hostname, cb)` | Resolve → SRV records |
| `dns.resolveNs(hostname, cb)` | Resolve → Name server records |
| `dns.reverse(ip, cb)` | Reverse lookup: IP → hostname(s) |
| `dns.getServers()` | Returns current DNS servers list |
| `dns.setServers(list)` | Set custom DNS servers |

---

### `lookup` vs `resolve`

| | `dns.lookup()` | `dns.resolve*()` |
|---|---|---|
| Uses OS? | ✅ Yes (`/etc/hosts`) | ❌ No (direct DNS query) |
| Network? | May not use network | Always uses network |
| Use for | Standard domain resolution | Specific DNS record queries |

---

### Examples

```js
const dns = require('dns');

// lookup — uses OS (reads /etc/hosts too)
dns.lookup('example.com', (err, address, family) => {
  console.log(`IP: ${address}, IPv${family}`); // IP: 93.184.216.34, IPv4
});

// resolve4 — direct DNS, IPv4 only
dns.resolve4('google.com', (err, addresses) => {
  console.log(addresses); // ['142.250.x.x', ...]
});

// MX records (mail servers)
dns.resolveMx('gmail.com', (err, records) => {
  records.forEach(r => console.log(r.exchange, r.priority));
});

// Reverse lookup: IP → hostname
dns.reverse('8.8.8.8', (err, hostnames) => {
  console.log(hostnames); // ['dns.google']
});

// Get/Set DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log(dns.getServers()); // ['8.8.8.8', '1.1.1.1']
```

---

### Promises API (Modern)

```js
const dns = require('dns/promises');

// async/await style
async function resolve() {
  const address = await dns.lookup('example.com');
  console.log(address); // { address: '93.184.216.34', family: 4 }

  const mxRecords = await dns.resolveMx('gmail.com');
  console.log(mxRecords);
}
```

---

### DNS Record Types (`rrtype`)

| Type | Records |
|---|---|
| `A` | IPv4 addresses |
| `AAAA` | IPv6 addresses |
| `MX` | Mail exchange servers |
| `TXT` | Text records (SPF, verification) |
| `CNAME` | Canonical name (alias) |
| `NS` | Name servers |
| `SRV` | Service records |
| `PTR` | Pointer (reverse lookup) |

---

## 25. Assert Module

Used for **testing and validation** — throws `AssertionError` when a condition fails.

```js
// ✅ Always use strict mode
const assert = require('assert/strict');

// Legacy (avoid — uses == loose equality)
const assert = require('assert');
```

---

### All Key Methods

| Method | Description |
|---|---|
| `assert.ok(value)` | Passes if `value` is **truthy** |
| `assert(value)` | Same as `assert.ok()` |
| `assert.strictEqual(a, b)` | Passes if `a === b` (strict equality) |
| `assert.notStrictEqual(a, b)` | Passes if `a !== b` |
| `assert.deepStrictEqual(a, b)` | Passes if objects/arrays are **deeply equal** (strict) |
| `assert.notDeepStrictEqual(a, b)` | Passes if objects are NOT deeply equal |
| `assert.throws(fn, error)` | Passes if `fn` **throws** the expected error |
| `assert.doesNotThrow(fn)` | Passes if `fn` does **not** throw |
| `assert.rejects(asyncFn)` | Passes if async function **rejects** |
| `assert.doesNotReject(asyncFn)` | Passes if async function **resolves** |
| `assert.fail(message)` | Always throws — force a test failure |
| `assert.match(str, regex)` | Passes if string matches regex |
| `assert.doesNotMatch(str, regex)` | Passes if string does NOT match regex |

---

### Strict vs Legacy

| | Legacy `require('assert')` | Strict `require('assert/strict')` ✅ |
|---|---|---|
| `equal` | `==` (loose) ⚠️ | `===` (strict) |
| `deepEqual` | loose deep compare ⚠️ | strict deep compare |
| Error messages | Basic | Shows visual diff |
| Recommendation | ❌ Avoid | ✅ Always use |

> `1 == '1'` is `true` in legacy — that's why strict mode exists!

---

### Examples

```js
const assert = require('assert/strict');

// ok — truthy check
assert.ok(1 > 0);              // ✅ passes
assert.ok(false);              // ❌ throws AssertionError

// strictEqual — primitives
assert.strictEqual(1, 1);     // ✅
assert.strictEqual(1, '1');   // ❌ throws (different types)

// deepStrictEqual — objects & arrays
assert.deepStrictEqual({ a: 1 }, { a: 1 }); // ✅
assert.deepStrictEqual([1, 2], [1, 2]);      // ✅
assert.deepStrictEqual({ a: 1 }, { a: '1' }); // ❌ throws

// throws — error checking
assert.throws(() => {
  throw new Error('Oops');
}, /Oops/); // ✅ matches error message

// rejects — async errors
await assert.rejects(async () => {
  throw new Error('async fail');
}, /async fail/); // ✅

// Custom message on failure
assert.strictEqual(1, 2, 'Numbers must be equal'); // ❌ shows custom message
```

---

### Key Points

- All assertions throw `AssertionError` on failure (with a diff in strict mode)
- Use in unit tests or to validate function inputs at runtime
- `assert.ok()` is good for quick guards: `assert.ok(user, 'User must exist')`
- Prefer `deepStrictEqual` over `deepEqual` — always use the `strict` versions

---

## 26. Util Module

A collection of utility functions for debugging, type checking, and bridging old callback APIs to promises.

```js
const util = require('util');
```

---

### Key Methods

| Method | Description |
|---|---|
| `util.promisify(fn)` | Convert callback-style fn → returns a Promise |
| `util.callbackify(fn)` | Convert async fn → error-first callback style |
| `util.inspect(obj, opts)` | Returns string representation (for debugging) |
| `util.format(fmt, ...args)` | `printf`-like string formatting |
| `util.inherits(ctor, super)` | Prototype inheritance (use `class extends` instead) |
| `util.debuglog(section)` | Conditional debug logger (via `NODE_DEBUG` env) |
| `util.deprecate(fn, msg)` | Mark a function as deprecated |
| `util.isDeepStrictEqual(a, b)` | Deep strict equality check (returns boolean) |
| `util.types.isDate(v)` | Check if value is a `Date` |
| `util.types.isMap(v)` | Check if value is a `Map` |
| `util.types.isPromise(v)` | Check if value is a `Promise` |

---

### 1. `util.promisify` — Most Used ⭐

Convert old callback-style functions to `async/await`:

```js
const util = require('util');
const fs = require('fs');

// Old way: fs.readFile uses callbacks
// New way: wrap it with promisify
const readFile = util.promisify(fs.readFile);

// Now use with async/await
async function main() {
  const data = await readFile('file.txt', 'utf8');
  console.log(data);
}
```

> Works with any function that follows the `(err, result) => {}` pattern.

---

### 2. `util.callbackify` — Reverse of promisify

Convert a Promise/async function back to callback style:

```js
async function greet(name) {
  return `Hello, ${name}!`;
}

const greetCb = util.callbackify(greet);

greetCb('Ashish', (err, result) => {
  console.log(result); // Hello, Ashish!
});
```

---

### 3. `util.inspect` — Debugging Objects

```js
const obj = { name: 'Node', nested: { a: [1, 2, 3] } };

console.log(util.inspect(obj));
// { name: 'Node', nested: { a: [ 1, 2, 3 ] } }

// Options
util.inspect(obj, {
  depth: null,     // no depth limit
  colors: true,    // colored output in terminal
  compact: false,  // pretty print
});
```

---

### 4. `util.format` — String Formatting

```js
util.format('%s has %d items', 'List', 5);    // 'List has 5 items'
util.format('%j', { a: 1 });                   // '{"a":1}'
util.format('100%%');                          // '100%'
util.format('Hello', 'World');                 // 'Hello World' (no placeholder = append)
```

| Placeholder | Type |
|---|---|
| `%s` | String |
| `%d` | Number |
| `%i` | Integer |
| `%f` | Float |
| `%j` | JSON |
| `%o` | Object (with non-enumerable props) |
| `%%` | Literal `%` |

---

### 5. Other Useful Utilities

```js
// Debug logger — only prints if NODE_DEBUG=myapp
const debug = util.debuglog('myapp');
debug('Server started on port %d', 3000);
// Run with: NODE_DEBUG=myapp node app.js

// Deprecate a function
const oldFn = util.deprecate(() => {}, 'oldFn() is deprecated, use newFn()');
oldFn(); // prints DeprecationWarning

// Deep strict equality (returns boolean, unlike assert)
util.isDeepStrictEqual({ a: 1 }, { a: 1 }); // true
util.isDeepStrictEqual({ a: 1 }, { a: '1' }); // false

// Type checks
util.types.isDate(new Date());    // true
util.types.isPromise(Promise.resolve()); // true
util.types.isMap(new Map());      // true
```

---

### Key Points

- `util.promisify` is the **most commonly used** util method — bridges old Node.js APIs to modern async/await
- `util.inspect` is used internally by `console.log` — customize it for better debug output
- Prefer `class extends` over `util.inherits` in modern code
- `util.types.*` checks are more reliable than `instanceof` across VM contexts

---

## 27. Readline Module

Read input from the user **line by line** via the terminal (stdin).

```js
const readline = require('readline');
// Modern Promises API
const readline = require('readline/promises');
```

---

### Setup — `createInterface`

```js
const rl = readline.createInterface({
  input: process.stdin,   // required — readable stream
  output: process.stdout, // optional — writable stream
});
```

---

### Methods

| Method | Description |
|---|---|
| `rl.question(query, cb)` | Show prompt → wait for input → call `cb(answer)` |
| `rl.close()` | Close the interface (process can exit) |
| `rl.pause()` | Pause input stream |
| `rl.resume()` | Resume input stream |
| `rl.write(data)` | Write to output (or simulate input) |
| `rl.setPrompt(str)` | Set prompt string for `rl.prompt()` |

---

### Events

| Event | Fires when |
|---|---|
| `'line'` | User presses Enter — callback gets the line as string |
| `'close'` | Interface closed (`rl.close()`, Ctrl+D, or stream ends) |
| `'pause'` | Input stream is paused |
| `'resume'` | Input stream is resumed |
| `'SIGINT'` | User presses Ctrl+C |

---

### Examples

```js
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask a single question
rl.question('What is your name? ', (answer) => {
  console.log(`Hello, ${answer}!`);
  rl.close(); // ⚠️ Always close or process hangs
});

// Read multiple lines
rl.on('line', (line) => {
  console.log(`Got: ${line}`);
});

rl.on('close', () => {
  console.log('Done reading input');
  process.exit(0);
});
```

---

### Modern Promises API (async/await)

```js
const readline = require('readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const name = await rl.question('What is your name? ');
  const age  = await rl.question('What is your age? ');
  console.log(`Hello ${name}, you are ${age} years old.`);
  rl.close();
}

main();
```

---

### Reading a File Line by Line

```js
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('file.txt'),
});

rl.on('line', (line) => {
  console.log(line); // process each line
});

rl.on('close', () => console.log('File read complete'));
```

---

### Key Points

- ⚠️ **Always call `rl.close()`** — the process won't exit until the interface is closed
- `line` event fires on `\n`, `\r`, or `\r\n`
- Use `readline/promises` with `async/await` for cleaner sequential prompts
- Works with any Readable stream — not just `stdin` (e.g., file streams)

---

## 28. ES6 Features (Cheat Sheet)

> All supported natively in modern Node.js — no config needed.

### Variables
```js
let x = 1;        // block-scoped, reassignable
const y = 2;      // block-scoped, no reassign (but object props can change)
// ❌ avoid var — function-scoped, hoisted
```

### Arrow Functions
```js
const add = (a, b) => a + b;       // implicit return
const greet = name => `Hi ${name}`; // single param, no parens needed
// ⚠️ No own `this` — inherits from surrounding scope
```

### Template Literals
```js
const msg = `Hello ${name}, you are ${age} years old`;  // backticks
const multiLine = `Line 1
Line 2`;
```

### Destructuring
```js
const { name, age } = person;           // object
const [first, second] = [1, 2, 3];      // array
const { a: renamed } = obj;             // rename on destructure
const { x = 10 } = obj;                 // default value
```

### Spread & Rest
```js
// Spread — expand
const arr2 = [...arr1, 4, 5];
const obj2 = { ...obj1, extra: true };

// Rest — collect remaining
function sum(...nums) { return nums.reduce((a, b) => a + b); }
```

### Classes
```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}
class Dog extends Animal {
  speak() { return `${this.name} barks`; }
}
```

### Promises & Async/Await
```js
// Promise
fetch(url).then(res => res.json()).catch(err => console.error(err));

// async/await (cleaner)
async function getData() {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) { console.error(err); }
}
```

### Other ES6 Features

| Feature | Example |
|---|---|
| Default params | `function fn(x = 10) {}` |
| Short object | `const obj = { name, age }` (same as `{ name: name }`) |
| Computed keys | `{ [varName]: value }` |
| `for...of` | `for (const item of arr) {}` |
| `Map` / `Set` | `new Map()`, `new Set()` |
| Optional chaining | `user?.address?.city` |
| Nullish coalescing | `value ?? 'default'` |
| `Promise.all()` | Run all promises in parallel |
| `Promise.allSettled()` | Wait for all, regardless of success/fail |

---

## 🧠 Quick Memory Tricks

| Topic | Remember |
|---|---|
| Event loop order | **S**ync → **M**icro → **T**imers → **I/O** → **I**mmediate → **C**lose → (**SMTIIC**) |
| SemVer | `^` = major locked, `~` = minor locked |
| `package.json` flow | `package.json` → `lock file` → `node_modules` |
| Blocking vs Non-blocking | `Sync` = blocking, no `Sync` = non-blocking |
| HTTP ports | HTTP=80, HTTPS=443 |
| Promise states | Pending → Fulfilled / Rejected |
| OS memory methods | `totalmem` / `freemem` → bytes, divide by 1024³ for GB |
| URL API | WHATWG (`new URL()`) = modern ✅ / Legacy (`url.parse`) = deprecated ❌ |
| Events | `.on()` = every time / `.once()` = one time / always handle `'error'` event |
| Streams | R/W/Duplex/Transform — use `pipeline()` over `pipe()` for safety |
| Buffer | Global, fixed-size binary data — use `alloc()` not `new Buffer()` / `slice()` shares memory |
| Crypto | Hash=one-way / HMAC=hash+key / Encrypt=reversible / always random IV |
| Timers | Priority: `nextTick` > Promise > `setTimeout` > `setImmediate` |
| DNS | `lookup` = OS-aware / `resolve*` = direct DNS / `reverse` = IP → hostname |
| Assert | Always use `assert/strict` — `strictEqual` for primitives, `deepStrictEqual` for objects |
| Util | `promisify` = callback→Promise / `callbackify` = Promise→callback / `inspect` = debug |
| Readline | Always call `rl.close()` / use `readline/promises` for async/await style |
| ES6 | `const`/`let` over `var` / arrow fn has no `this` / `??` = nullish / `?.` = optional chain |
| Process | `process` = global / `exit(0)` = success / `exit(1)` = error / `spawn` streams, `exec` buffers |

---

## 29. Process Management

### `process` Object (Global — no require needed)

| Property / Method | Description |
|---|---|
| `process.pid` | Current process ID |
| `process.argv` | Array of CLI args (`[node, file, ...args]`) |
| `process.env` | Environment variables object |
| `process.cwd()` | Current working directory |
| `process.chdir(dir)` | Change working directory |
| `process.exit(code)` | Exit process (`0` = success, `1` = error) |
| `process.kill(pid, signal)` | Send signal to a process |
| `process.uptime()` | Seconds since process started |
| `process.memoryUsage()` | Memory usage (heap, rss, etc.) |
| `process.stdout` | Writable stream → terminal output |
| `process.stdin` | Readable stream → terminal input |
| `process.stderr` | Writable stream → error output |

### Signals (Graceful Shutdown)

```js
// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});

// Handle kill command (e.g. from PM2 / Kubernetes)
process.on('SIGTERM', () => {
  // close DB connections, finish tasks
  process.exit(0);
});

// Uncaught errors — last resort
process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  process.exit(1);
});
```

### `child_process` Module

```js
const { spawn, exec, fork, execFile } = require('child_process');
```

| Method | Use | Output |
|---|---|---|
| `spawn(cmd, args)` | Long-running / large data | **Streams** (memory efficient) |
| `exec(cmd, cb)` | Short shell commands | **Buffered** string (can crash if huge) |
| `fork(file)` | Spawn another Node.js script | IPC channel (send/receive messages) |
| `execFile(file, args)` | Run executable directly (no shell) | Buffered, more secure than `exec` |

```js
// spawn — streams output
const { spawn } = require('child_process');
const ls = spawn('ls', ['-la']);
ls.stdout.on('data', data => console.log(data.toString()));
ls.on('close', code => console.log('Exit:', code));

// exec — simple shell command
const { exec } = require('child_process');
exec('echo Hello', (err, stdout) => console.log(stdout)); // Hello

// fork — Node-to-Node communication
const child = fork('worker.js');
child.send({ task: 'compute' });
child.on('message', msg => console.log('Result:', msg));
```

### Key Points

- `process.exit(0)` = success, `process.exit(1)` = failure
- `spawn` = streams (use for large output), `exec` = buffers (use for small output)
- `fork` creates a full V8 instance — expensive, use sparingly
- Always handle `SIGTERM` for graceful shutdown in production (PM2, Docker, K8s send this)

---

## 30. TypeScript with Node.js

### Setup

```bash
npm init -y
npm install typescript @types/node ts-node --save-dev
npx tsc --init          # creates tsconfig.json
```

```json
// package.json scripts
"scripts": {
  "dev":   "ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### `tsconfig.json` Key Options

| Option | Recommended | Purpose |
|---|---|---|
| `target` | `"ES2022"` | JS version to compile to |
| `module` | `"CommonJS"` | Module system |
| `outDir` | `"./dist"` | Where compiled JS goes |
| `strict` | `true` | Enable all strict type checks |
| `esModuleInterop` | `true` | Cleaner default imports |
| `include` | `["src"]` | Source files to compile |

### Core Concepts

```ts
// Types
let name: string = 'Ashish';
let age: number = 25;
let active: boolean = true;
let anything: any = 'ok';     // disables type checking — avoid

// Type alias
type User = { name: string; age: number };
const user: User = { name: 'Ashish', age: 25 };

// Union types
let id: string | number = 42;

// Optional & readonly
type Config = { host: string; port?: number; readonly token: string };
```

### Interface

```ts
interface Person {
  id: number;
  name: string;
  email?: string;     // optional
}

// Extend
interface Employee extends Person {
  role: string;
}
```

> `type` vs `interface`: both work — use `interface` for objects/classes, `type` for unions/primitives.

### Generics

```ts
function identity<T>(arg: T): T { return arg; }

identity<string>('Hello');  // 'Hello'
identity<number>(42);       // 42

// Generic with constraint
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

### Enums

```ts
enum Direction { Up, Down, Left, Right }
console.log(Direction.Up);   // 0
console.log(Direction[0]);   // 'Up'
```

### Decorators *(enable `experimentalDecorators: true` in tsconfig)*

```ts
function Log(target: any) {
  console.log('Class:', target.name);
}

@Log
class MyService {}  // logs: 'Class: MyService'
```

### Key Points

- TypeScript compiles to JavaScript — Node.js runs the compiled JS, not `.ts` files directly
- Use `ts-node` in dev, compile with `tsc` for production
- `strict: true` catches most bugs early — always enable
- `@types/node` gives type definitions for all built-in Node.js modules
- `any` = escape hatch — use sparingly, defeats the purpose of TypeScript

---

## 31. TypeScript Advanced (Short)

### Utility Types

```ts
type User = { name: string; age: number; email: string };

Partial<User>       // all props optional
Required<User>      // all props required
Readonly<User>      // all props immutable
Pick<User, 'name' | 'age'>   // keep only these
Omit<User, 'email'>           // remove these
Record<string, number>        // { [key: string]: number }
Awaited<Promise<string>>      // → string
```

### Mapped Types

```ts
// Make all values boolean
type Flags<T> = { [K in keyof T]: boolean };

// Make all optional
type Optional<T> = { [K in keyof T]?: T[K] };
```

### Conditional Types

```ts
// T extends U ? Yes : No
type IsString<T> = T extends string ? 'yes' : 'no';
// IsString<string> → 'yes', IsString<number> → 'no'

// Extract return type of any function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

### Type Guards (Narrowing)

```ts
// typeof guard
function print(val: string | number) {
  if (typeof val === 'string') console.log(val.toUpperCase());
  else console.log(val.toFixed(2));
}

// instanceof guard
if (err instanceof Error) console.log(err.message);

// in guard
if ('name' in obj) console.log(obj.name);

// Custom type guard (type predicate)
function isString(val: any): val is string {
  return typeof val === 'string';
}
```

### Declaration Merging & Module Augmentation

```ts
// Interfaces with same name merge automatically
interface Config { host: string; }
interface Config { port: number; }
// Result: { host: string; port: number }
// ⚠️ type aliases do NOT merge

// Extend a 3rd-party module (e.g. Express)
import 'express';
declare module 'express' {
  interface Request {
    userId?: string;  // now available on all req objects
  }
}
```

### Quick Reference Table

| Feature | Use when |
|---|---|
| `Partial<T>` | Making all fields optional (e.g. update payloads) |
| `Pick<T, K>` | Selecting only needed fields |
| `Omit<T, K>` | Excluding sensitive fields (e.g. password) |
| `Record<K, V>` | Typed key-value maps |
| Conditional types | Type-level logic / extracting types |
| Type guards | Narrowing union types safely |
| Module augmentation | Adding types to 3rd-party libs (Express, etc.) |

---

## 32. Linting & Formatting

| Tool | Purpose |
|---|---|
| **ESLint** | Code **quality** — finds bugs, enforces rules |
| **Prettier** | Code **style** — formatting, spacing, quotes |
| **eslint-config-prettier** | Disables ESLint rules that conflict with Prettier |

### Setup

```bash
npm install --save-dev eslint prettier eslint-config-prettier
```

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### `eslint.config.js` (flat config — modern)

```js
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,              // ← always last
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    }
  }
];
```

### npm Scripts

```json
"scripts": {
  "lint":        "eslint .",
  "lint:fix":    "eslint . --fix",
  "format":      "prettier --write .",
  "format:check":"prettier --check ."
}
```

### VS Code — Auto-fix on Save (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Key Points

- **Prettier** = formatting only (never argue about style again)
- **ESLint** = logic & best practice rules
- Always put `eslint-config-prettier` **last** in config — it turns off conflicting rules
- `--fix` auto-fixes most ESLint issues; `--write` auto-formats with Prettier
- Install VS Code extensions: **ESLint** + **Prettier** for the best DX
