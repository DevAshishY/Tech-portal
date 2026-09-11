# Node.js 

---

## 1. `process.argv`
```bash
node index.js hello1 hello2
```
```js
process.argv[0]   // node executable path
process.argv[1]   // file path
process.argv[2]   // hello1 (first CLI arg)
process.argv[3]   // hello2 (second CLI arg)
```

---

## 2. Environment Variables
```js
process.env.DB_NAME     // read env variable
```

---

## 3. How Node.js Works (Event Loop Order)
```
Sync Code
  → MICROTASK: process.nextTick(() => {})   // highest priority
  → MICROTASK: Promise
  → MACROTASK: setTimeout
  → MACROTASK: setImmediate
  → File I/O: Thread Pool → Poll
```

---

## 4. Sync vs Async — `fs` Module
```js
fs.readFileSync()   // blocks, line-by-line execution
fs.readFile()        // non-blocking, parallel code execution
```

---

## 5. Promise & Async/Await
```
=> DEEP topic — covers .then/.catch chains, Promise.all/allSettled, try/catch with await
```

---

## 6. Error Types
```js
JSON.parse('{bad}')     // SyntaxError — invalid syntax
null.property            // TypeError — wrong type usage
unknownVar                // ReferenceError — undefined variable
// ENOENT       → file not found
// ECONNREFUSED → connection refused
```

---

## 7. CJS vs ESM
```js
require() + module.exports    // CJS (CommonJS)
import + export                // ESM (ES Modules)
// use .mjs extension OR "type": "module" in package.json
```

---

## 8. FS (File System) Module
```js
fs.readFile('hello.txt', 'utf8', (err, data) => {})  // async read
fs.readFile()      // READ
fs.writeFile()     // WRITE (overwrite)
fs.appendFile()    // APPEND
fs.unlink()        // DELETE
fs.rename()        // RENAME
```
### File Flags
| Flag | Use | Memory Trick |
|---|---|---|
| `'r'` | read file | R = Read |
| `'w'` | write/create, overwrite | W = Write |
| `'a'` | add content at end | A = Append/Add |
| `'r+'` | read+write, file must exist | R+ = Read+Write |
| `'w+'` | read+write, create/overwrite | W+ = Write+Read |
| `'wx'` | create/write, fail if exists | W+X = exclusive |

---

## 9. HTTP Module
```js
http.createServer((req, res) => { res.end('hello'); }).listen(3000)  // create server
```

---

## 10. HTTPS Module
```js
// same as http, but with SSL/TLS — secure server
```

---

## 11. PATH Module
```js
path.basename('/src/app.js')        // 'app.js'
path.extname('/src/app.js')         // '.js'
path.dirname('/src/app.js')         // '/src'
path.join('src', 'app.js')          // 'src/app.js'
path.resolve('src', 'app.js')       // absolute path
path.parse('/src/app.js')           // { root, dir, base, ext, name }
path.format({dir:'/src',name:'app',ext:'.js'}) // '/src/app.js'
path.normalize('/src/../app.js')    // '/app.js'
path.relative('/src', '/src/app')   // 'app'
path.isAbsolute('/src/app.js')      // true
__dirname                            // current folder
__filename                           // current file full path
```

---

## 12. OS Module
```js
os.platform()   // OS name
os.arch()       // CPU architecture
os.hostname()   // computer name
os.totalmem()   // total RAM
os.freemem()    // free RAM
os.uptime()     // running time
os.cpus()       // CPU cores
os.homedir()    // home folder
os.tmpdir()     // temporary folder
os.EOL          // end-of-line char
```

---

## 13. Events Module
```js
const event = new EventEmitter()      // create emitter
event.on('login', fn)                  // listen → runs every time
event.addListener('login', fn)         // same as on()
event.once('login', fn)                // listen → runs only once
event.emit('login', 'Ashish')          // fire event + pass data
event.off('login', fn)                 // remove listener
event.removeListener('login', fn)      // same as off()
event.removeAllListeners('login')      // remove all listeners
event.listeners('login')               // get listeners array
event.listenerCount('login')           // count listeners
event.setMaxListeners(20)              // increase listener limit
```

---

## 14. Stream Module
```js
fs.createReadStream('input.txt')     // create readable stream
fs.createWriteStream('output.txt')   // create writable stream

// Readable Stream
.read()                    // read chunk manually
.on('data', chunk => {})   // receive chunk
.on('end', () => {})       // reading finished
.pause()                   // stop reading
.resume()                  // continue reading
.setEncoding('utf8')       // set encoding
.pipe(dest)                // send to another stream

// Writable Stream
.write(chunk)              // write data
.end()                     // finish writing
.destroy()                 // close stream
.on('finish', () => {})    // writing completed
.on('drain', () => {})     // ready to write again

// Transform Stream = Read → Modify → Write

// Connect Streams
pipe()      // connect + backpressure
pipeline()  // connect + error handling + cleanup
```

---

## 15. Crypto Module
```js
crypto.createHash('sha256').update('data').digest('hex')          // one-way hash
crypto.createHmac('sha256','secret').update('data').digest('hex') // hash + key
crypto.createCipheriv(algo, key, iv)                               // create encryptor
crypto.createDecipheriv(algo, key, iv)                             // create decryptor
crypto.createSign('sha256').update(data).sign(privateKey,'hex')    // sign data
crypto.createVerify('sha256').update(data).verify(pubKey,sig)      // verify signature
crypto.randomBytes(16)                                              // secure random bytes
crypto.randomBytes(32).toString('hex')                              // secure random token
crypto.randomInt(1,100)                                             // secure random integer
crypto.generateKeyPairSync('rsa',{modulusLength:2048})              // gen key pair
crypto.getHashes()                                                  // list hash algos
crypto.pbkdf2Sync(pw, salt, iter, keylen, 'sha256')                 // password hashing
```

---

## 16. URL Module
```js
const url = new URL('https://example.com/products?id=10')  // parse URL
url.href           // full URL
url.protocol       // 'https:'
url.host           // host+port
url.hostname       // host only
url.port            // port number
url.pathname        // '/products'
url.search           // '?id=10'
url.searchParams     // URLSearchParams object
url.hash              // fragment '#top'
url.username / url.password  // credentials
url.origin             // origin

url.searchParams.get('name')             // read value
url.searchParams.set('name', 'Ali')      // update value
url.searchParams.append('city', 'Delhi') // add param
url.searchParams.delete('age')           // remove param
url.searchParams.has('name')             // check exists
url.searchParams.toString()              // convert to string
```

---

## 17. Buffer
```js
Buffer.alloc(4)                          // safe, zero-filled buffer
Buffer.allocUnsafe(4)                    // fast, may hold old data ⚠️
Buffer.from('Hello')                     // from string (utf8 default)
Buffer.from([1,2,3])                     // from byte array
Buffer.from(existingBuf)                 // copy existing buffer
buf.write('Hi')                          // write string into buffer
buf[0]                                   // read byte at index
buf.length                               // fixed buffer size
buf.toString('utf8'/'hex'/'base64')      // buffer → string
buf.slice(0,4)                           // sub-buffer (shares memory!)
buf.copy(target)                         // copy bytes to another buffer
buf.equals(otherBuf)                     // true if same bytes
buf.includes('x') / buf.indexOf('x')     // search
buf.fill(0)                              // fill with value
Buffer.concat([a, b])                    // merge buffers
Buffer.compare(a, b)                     // -1/0/1, for sorting
Buffer.isBuffer(obj)                     // check if Buffer
```

---

## 18. Timers
```js
setTimeout(cb, 1000)      // run once after delay
setInterval(cb, 1000)     // run repeatedly every delay
setImmediate(cb)          // run at end of current loop iteration (Check phase)
process.nextTick(cb)      // run before next event loop phase (highest priority)
clearTimeout(id)          // cancel setTimeout
clearInterval(id)         // cancel setInterval
clearImmediate(id)        // cancel setImmediate
timerId.ref()              // keep process alive
timerId.unref()            // don't keep process alive
```

---

## 19. DNS Module
```js
dns.lookup(host, cb)          // hostname → IP (OS-based)
dns.resolve(host, type, cb)   // hostname → DNS records (bypasses OS)
dns.resolve4(host, cb)        // IPv4 addresses
dns.resolve6(host, cb)        // IPv6 addresses
dns.resolveMx(host, cb)       // mail exchange records
dns.resolveCname(host, cb)    // canonical name records
dns.resolveTxt(host, cb)      // TXT records
dns.resolveSrv(host, cb)      // SRV records
dns.resolveNs(host, cb)       // name server records
dns.reverse(ip, cb)           // IP → hostname
dns.getServers()              // list DNS servers
dns.setServers(['8.8.8.8'])   // set custom DNS servers
```

---

## 20. Assert Module
```js
assert.ok(value)                    // pass if truthy
assert(value)                       // same as assert.ok()
assert.strictEqual(a, b)            // pass if a === b
assert.notStrictEqual(a, b)         // pass if a !== b
assert.deepStrictEqual(a, b)        // deeply equal (strict)
assert.notDeepStrictEqual(a, b)     // NOT deeply equal
assert.throws(fn, err)              // fn throws expected error
assert.doesNotThrow(fn)             // fn doesn't throw
assert.rejects(asyncFn)             // async fn rejects
assert.doesNotReject(asyncFn)       // async fn resolves
assert.fail(msg)                    // force failure
assert.match(str, regex)            // string matches regex
assert.doesNotMatch(str, regex)     // string doesn't match
```

---

## 21. Util Module
```js
util.promisify(fn)              // callback fn → Promise ⭐ most used
util.callbackify(asyncFn)       // async fn → callback style
util.inspect(obj, opts)         // string repr for debugging
util.format('%s has %d', a, b)  // printf-like formatting
util.inherits(ctor, superCtor)  // prototype inheritance (use class extends instead)
util.debuglog('section')        // conditional logger (NODE_DEBUG env)
util.deprecate(fn, 'msg')       // mark function deprecated
util.isDeepStrictEqual(a, b)    // deep equality → boolean
util.types.isDate(v)            // check Date
util.types.isMap(v)             // check Map
util.types.isPromise(v)         // check Promise
```

---

## 22. Readline Module
```js
const readline = require('readline')            // callback API
const readline = require('readline/promises')   // promise API

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question(query, cb)   // show prompt → wait input → cb(answer)
rl.close()                // close interface (⚠️ needed to exit process)
rl.pause()                 // pause input stream
rl.resume()                // resume input stream
rl.write(data)              // write to output / simulate input
rl.setPrompt('str')          // set prompt string
```

---

## 23. Query String Module
```js
querystring.parse('name=Ashish&age=30')   // → { name:'Ashish', age:'30' }
```

---

## 24. NPM
```bash
npm outdated                 # check updates
npm update                   # update all
npm audit                    # security check
npm audit fix                # auto-fix
npm ls / yarn list            # dependency tree
npx depcheck                  # unused dependencies
# peerDependencies => plugin compatibility
```

---

## 25. HTTP Methods
| Method | Use | Idempotent? |
|---|---|---|
| GET | fetch resource | ✅ |
| POST | create resource | ❌ |
| PUT | replace resource | ✅ |
| PATCH | partial update | ❌ |
| DELETE | remove resource | ✅ |
| HEAD | GET without body | ✅ |
| OPTIONS | describe options | ✅ |

---

## 26. HTTP Status Codes
```
2xx → SUCCESS ✅
200 → OK / I did it
201 → Created / I created it
204 → No Content / done, nothing to return

4xx → CLIENT ERROR ❌
400 → Bad Request / your request is wrong
401 → Unauthorized / who are you? 🔐
403 → Forbidden / known but not allowed
404 → Not Found / can't find it 🔍

5xx → SERVER ERROR 💥
500 → Server Error / server problem
```

---

## 27. Default Ports (changeable)
```
HTTP  → 80
HTTPS → 443
```

---

## 28. HTTP/1.1 vs HTTP/2
```
HTTP/1.1: Request → HTML, Request → CSS, Request → JS, Request → Image
          (requests may wait on same connection)

HTTP/2:   One Connection → HTML, CSS, JS, Image (multiplexed, parallel)
```

---

## 29. Process Management
```js
process.pid                       // current process ID
process.argv                      // CLI args array
process.env                       // environment variables
process.cwd()                     // current working directory
process.chdir(dir)                // change working directory
process.exit(0)                   // exit (0=success, 1=error)
process.kill(pid, signal)         // send signal to process
process.uptime()                  // seconds since start
process.memoryUsage()             // memory usage stats
process.stdout / stdin / stderr   // I/O streams
```

---

## 30. ES6+ New Features
```js
let x = 1                          // block-scoped, reassignable
const y = 2                        // block-scoped, no reassign
// ❌ avoid var — function-scoped, hoisted

const add = (a, b) => a + b        // arrow fn, implicit return
const greet = name => `Hi ${name}` // single param, no parens
// ⚠️ arrow fn has no own `this`

const msg = `Hi ${name}, age ${age}`  // template literal

const { name, age } = person       // object destructure
const [a, b] = [1, 2]              // array destructure
const { x: renamed } = obj         // rename on destructure
const { x = 10 } = obj             // default value

const arr2 = [...arr1, 4, 5]       // spread — expand array
const obj2 = { ...obj1, extra: true } // spread — expand object
function sum(...nums) { }          // rest — collect remaining args

class Dog extends Animal { }       // class + inheritance

async function getData() {         // async/await
  try { const res = await fetch(url); return await res.json(); }
  catch (err) { console.error(err); }
}
```

---

## 31. TypeScript with Node.js
```bash
npm init -y
npm install typescript @types/node ts-node --save-dev
npx tsc --init                     # creates tsconfig.json
```
```ts
let name: string = 'Ashish'                // basic type
let anything: any = 'ok'                   // ❌ disables checking, avoid
type User = { name: string; age: number }  // type alias
let id: string | number = 42               // union type
type Config = { host: string; port?: number; readonly token: string } // optional + readonly

interface Person { id: number; name: string; email?: string }   // interface
interface Employee extends Person { role: string }               // extend interface

function identity<T>(arg: T): T { return arg }                   // generic
function getLength<T extends {length:number}>(a:T){return a.length} // generic w/ constraint

enum Direction { Up, Down, Left, Right }    // enum
Direction.Up                                // 0

@Log class MyService {}                     // decorator (needs experimentalDecorators:true)

Partial<User>            // all props optional
Required<User>           // all props required
Readonly<User>           // all props immutable
Pick<User,'name'|'age'>  // keep only these
Omit<User,'email'>       // remove these
Record<string, number>   // { [key:string]: number }
Awaited<Promise<string>> // → string

type Flags<T> = { [K in keyof T]: boolean }              // mapped type
type IsString<T> = T extends string ? 'yes':'no'         // conditional type
type ReturnType<T> = T extends (...a:any[])=>infer R ? R : never  // infer

typeof val === 'string'          // typeof guard
err instanceof Error             // instanceof guard
'name' in obj                    // in guard
function isString(v:any): v is string { return typeof v==='string' } // custom predicate

interface Config { host:string }
interface Config { port:number }   // merges → {host,port}  ⚠️ type aliases don't merge

declare module 'express' {         // extend 3rd-party module
  interface Request { userId?: string }
}
```

---

## 32. Linting & Formatting
```
ESLint                 → finds bugs, enforces rules
Prettier                → formatting, spacing, quotes
eslint-config-prettier  → disables ESLint rules conflicting with Prettier
```
```json
"lint":         "eslint .",                 // check for issues
"lint:fix":     "eslint . --fix",            // auto-fix ESLint issues
"format":       "prettier --write .",        // auto-format with Prettier
"format:check": "prettier --check ."         // check formatting without writing
```
