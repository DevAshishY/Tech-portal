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

## 🧠 Quick Memory Tricks

| Topic | Remember |
|---|---|
| Event loop order | **S**ync → **M**icro → **T**imers → **I/O** → **I**mmediate → **C**lose → (**SMTIIC**) |
| SemVer | `^` = major locked, `~` = minor locked |
| `package.json` flow | `package.json` → `lock file` → `node_modules` |
| Blocking vs Non-blocking | `Sync` = blocking, no `Sync` = non-blocking |
| HTTP ports | HTTP=80, HTTPS=443 |
| Promise states | Pending → Fulfilled / Rejected |
