# JavaScript Interview Guide — Complete Reference

A reorganized, filled-in version of your notes: every theory topic has a short explanation **+ a runnable example**, and every coding question has a working solution with complexity noted where relevant. Part 11 covers the Aazam Sheet Top 50 coding questions.

## Contents

- [Part 1 — Functions & `this`](#part-1--functions--this)
- [Part 2 — Scope, Closures & Hoisting](#part-2--scope-closures--hoisting)
- [Part 3 — Objects & Prototypes](#part-3--objects--prototypes)
- [Part 4 — Async JavaScript](#part-4--async-javascript)
- [Part 5 — DOM & Events](#part-5--dom--events)
- [Part 6 — Storage, Auth & Security](#part-6--storage-auth--security)
- [Part 7 — Types, Coercion & Comparisons](#part-7--types-coercion--comparisons)
- [Part 8 — Performance & Web Metrics](#part-8--performance--web-metrics)
- [Part 9 — Modules, HTTP & APIs](#part-9--modules-http--apis)
- [Part 10 — Coding Practice (with solutions)](#part-10--coding-practice-with-solutions)
- [Part 11 — Top 50 Coding Questions (Aazam Sheet)](#part-11--top-50-coding-questions-aazam-sheet)
- [Quick Reference Cheat-Sheet](#quick-reference-cheat-sheet)

---

## Part 1 — Functions & `this`

### 1. call / apply / bind
All three set the `this` context of a function manually.

```js
const user = { name: 'Ashish' };
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

greet.call(user, 'Hello', '!');          // args passed individually
greet.apply(user, ['Hello', '!']);       // args passed as an array
const bound = greet.bind(user, 'Hello'); // returns a new function, doesn't call it
bound('!');
```
- `call`/`apply` invoke immediately. `bind` returns a new function for later use (common in React class components, event handlers, partial application).

### 2. Normal vs Arrow Functions
| | Normal function | Arrow function |
|---|---|---|
| `this` | dynamic — depends on how it's *called* | lexical — inherited from enclosing scope, fixed forever |
| `arguments` object | yes | no (use rest params) |
| Can be a constructor (`new`) | yes | no |

```js
const obj = {
  name: 'Bob',
  normal: function () { console.log(this.name); },   // 'Bob'
  arrow: () => { console.log(this.name); },           // undefined (this = outer scope)
};
obj.normal();
obj.arrow();
```

### 3. Fixing arrow-function `this` in an object
```js
const user = {
  email: 'my@email.com',
  updateEmail: (email) => { this.email = email; }, // 'this' is NOT user here
};
user.updateEmail('new@email.com');
console.log(user.email); // still 'my@email.com'

// Fix: use a regular function so 'this' binds to the calling object
const user2 = {
  email: 'my@email.com',
  updateEmail(email) { this.email = email; }, // shorthand method syntax
};
user2.updateEmail('new@email.com');
console.log(user2.email); // 'new@email.com'
```

### 4. Pure vs Impure, Declaration vs Expression
```js
// Pure — same input always gives same output, no side effects
const add = (a, b) => a + b;

// Impure — depends on / mutates external state
let total = 0;
function addToTotal(n) { total += n; return total; }

// Declaration — hoisted, can be called before definition
function foo() {}

// Expression — not hoisted, bound to a variable
const bar = function () {};
```

### 5. IIFE (Immediately Invoked Function Expression)
```js
(function () {
  const secret = 'hidden from global scope';
  console.log(secret);
})();

// Common pre-ES6 module pattern to avoid polluting global scope
```

### 6. Currying
```js
function sum(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
console.log(sum(1)(2)(3)); // 6

// Generic curry helper that works for any arity
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...next) => curried(...args, ...next);
  };
}
const add3 = curry((a, b, c) => a + b + c);
console.log(add3(1)(2)(3), add3(1, 2)(3), add3(1, 2, 3)); // 6 6 6
```

### 7. Memoization
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const slowSquare = n => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(5); // computed
fastSquare(5); // returned from cache instantly
```

---

## Part 2 — Scope, Closures & Hoisting

### 8. Lexical Scope
A function can access variables defined in the scope where it was *written*, not where it's called from.

### 9. Closure
A function "remembers" its outer scope's variables even after the outer function has returned.

```js
function counter() {
  let count = 0;
  return function () { return ++count; };
}
const increment = counter();
console.log(increment(), increment(), increment()); // 1 2 3
```

### 10. var vs let vs const, and why avoid `var`
```js
console.log(a); // undefined (hoisted, initialized as undefined)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;
```
- `var`: function-scoped, hoisted & auto-initialized to `undefined`, can be redeclared → leaks out of blocks (`if`, `for`) causing bugs.
- `let`/`const`: block-scoped, hoisted but **not** initialized (Temporal Dead Zone), cannot redeclare.
- `const`: same as `let` but cannot be reassigned (object/array *contents* can still be mutated).

### 11. TDZ (Temporal Dead Zone)
```js
{
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 5;
}
```
The variable exists (hoisted) but is inaccessible until its declaration line runs.

### 12. var leaking out of a block
```js
let fruit = 'apple';
if (true) {
  var fruit = 'orange'; // var ignores block scope, overwrites outer 'fruit'
  console.log(fruit);   // 'orange'
}
console.log(fruit);     // 'orange'
```

### 13. Block scoping with `let`
```js
let a = 'Hello';
function x() {
  let b = 'World';
  console.log(a, b);          // Hello World
  if (b === 'World') {
    let c = 'hello';
    console.log(a, b, c);     // Hello World hello
  }
  console.log(a, b, c);       // ReferenceError: c is not defined (out of block scope)
}
x();
```

### 14. "use strict"
Opts into a stricter parsing/execution mode: disallows implicit globals, silent failures become errors, `this` is `undefined` in plain function calls instead of the global object.
```js
'use strict';
x = 10; // ReferenceError: x is not defined
```

### 15. Make `i === 1 && i === 2 && i === 3` print "yes"
Trick: override `==`/`===` behavior via a getter with an internal counter (works because `===` on an object triggers `valueOf`/`Symbol.toPrimitive`, not on primitives — but with a plain number it never works for `===`; the classic trick uses `==` with `valueOf`):
```js
let i = {
  val: 1,
  valueOf() { return this.val++; }
};
if (i == 1 && i == 2 && i == 3) console.log('yes'); // works with == (loose)
// Note: === can NEVER be tricked this way for primitives — it compares
// value+type directly with no coercion, so a true `i===1 && i===2 && i===3`
// with `===` is only possible if `i` is reassigned between checks
// (impossible in a single expression) — this is often the "gotcha" answer itself.
```

---

## Part 3 — Objects & Prototypes

### 16. Prototype, Prototype Chain, `__proto__` vs `prototype`
- Every **function** has a `.prototype` object — used as the `__proto__` of instances created via `new`.
- Every **object** has an internal `[[Prototype]]`, exposed via `__proto__`, that JS walks up when a property isn't found directly on the object (the "prototype chain").

```js
let obj1 = { key1: 'value1' };
let obj2 = Object.create(obj1); // obj2's __proto__ = obj1
obj2.key3 = 'value3';

console.log(obj2.key3);      // 'value3' (own property)
console.log(obj2.key1);      // 'value1' (inherited via prototype chain)
console.log(obj2.__proto__ === obj1); // true

function Person(name) { this.name = name; }
Person.prototype.greet = function () { return `Hi, ${this.name}`; };
const p = new Person('Ash');
console.log(p.greet());          // 'Hi, Ash'
console.log(p.__proto__ === Person.prototype); // true
```

### 17. Shallow vs Deep Copy
```js
const original = { a: 1, nested: { b: 2 } };

// Shallow — top level only, nested objects still shared
const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b); // 99 (!) — same reference

// Deep — fully independent copy
const deep1 = structuredClone(original);       // modern, handles most types
const deep2 = JSON.parse(JSON.stringify(original)); // classic, loses functions/undefined/Dates
deep1.nested.b = 5;
console.log(original.nested.b); // still 99, unaffected
```

### 18. Ways to Create an Object
```js
const a = { x: 1 };                       // literal
const b = new Object({ x: 1 });           // constructor
const c = Object.create({ x: 1 });        // prototype-based
class Foo { constructor(x) { this.x = x; } }
const d = new Foo(1);                     // ES6 class
function factory(x) { return { x }; }
const e = factory(1);                     // factory function
const f = Object.assign({}, { x: 1 });    // merge/copy
```

### 19. Classes, Getters & Setters
```js
class BankAccount {
  #balance = 0; // private field

  constructor(owner) { this.owner = owner; }

  get balance() { return `$${this.#balance}`; }     // getter
  set balance(amount) {                              // setter
    if (amount < 0) throw new Error('Invalid amount');
    this.#balance = amount;
  }

  static bankName() { return 'JS Bank'; } // static method
}
const acc = new BankAccount('Ash');
acc.balance = 100;      // calls setter
console.log(acc.balance); // '$100' — calls getter
```

### 20. OOP Concepts
```js
// Method Overriding (polymorphism via inheritance)
class Animal { speak() { return 'Some sound'; } }
class Dog extends Animal { speak() { return 'Woof'; } } // overrides parent
console.log(new Dog().speak()); // 'Woof'

// JS has NO true method overloading (same name, diff signature) —
// simulate with default params / checking arguments.length
function area(a, b) { return b ? a * b : a * a; }
```

### 21. Polyfills
```js
// bind polyfill
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  return function (...args) {
    return fn.apply(context, [...boundArgs, ...args]);
  };
};

// call polyfill
Function.prototype.myCall = function (context = {}, ...args) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

// map polyfill
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) result.push(callback(this[i], i, this));
  return result;
};

// forEach polyfill
Array.prototype.myForEach = function (callback) {
  for (let i = 0; i < this.length; i++) callback(this[i], i, this);
};

// reduce polyfill
Array.prototype.myReduce = function (callback, initial) {
  let acc = initial;
  let start = 0;
  if (acc === undefined) { acc = this[0]; start = 1; }
  for (let i = start; i < this.length; i++) acc = callback(acc, this[i], i, this);
  return acc;
};

// flat polyfill (single level, extend recursively for depth)
Array.prototype.myFlat = function (depth = 1) {
  return depth > 0
    ? this.reduce((acc, val) => acc.concat(Array.isArray(val) ? val.myFlat(depth - 1) : val), [])
    : this.slice();
};

// deep-equal / compare two objects
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
}
```

---

## Part 4 — Async JavaScript

### 22. Sync vs Async, Callbacks & Callback Hell
```js
// Callback hell — nested, hard to read/maintain
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments); // pyramid of doom
    });
  });
});
```

### 23. Promises & Chaining, all / race / any / allSettled
```js
const p1 = new Promise((resolve) => setTimeout(() => resolve('one'), 100));
const p2 = new Promise((resolve) => setTimeout(() => resolve('two'), 200));
const p3 = Promise.reject('fail');

Promise.all([p1, p2]).then(console.log);          // ['one','two'] — waits for all, rejects if ANY fails
Promise.race([p1, p2]).then(console.log);         // 'one' — first to settle (resolve or reject)
Promise.any([p3, p1]).then(console.log);          // 'one' — first to FULFILL, ignores rejections
Promise.allSettled([p1, p3]).then(console.log);   // [{status:'fulfilled',value:'one'}, {status:'rejected',reason:'fail'}]

// Chaining
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
```

### 24. async/await + try/catch
```js
async function loadData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    console.log('Done attempting fetch');
  }
}
```

### 25. Event Loop, Microtask vs Macrotask Queue
- Call stack runs synchronous code first.
- **Microtasks** (Promise `.then`, `queueMicrotask`, `async/await` continuations) run right after the current stack empties, **before** the next macrotask, and the microtask queue is fully drained each cycle.
- **Macrotasks** (`setTimeout`, `setInterval`, I/O, UI rendering) run one at a time, once the microtask queue is empty.

### 26. Event loop order
```js
// Example 1
setTimeout(() => console.log(1), 0);
console.log(2);
new Promise((res) => res()).then(() => console.log(3));
console.log(4);
// Output: 2, 4, 3, 1
// (sync code first → microtask (Promise) → macrotask (setTimeout))

// Example 2
setTimeout(() => console.log(1), 0);
console.log(2);
new Promise((res) => { setTimeout(() => res(), 0); }).then(() => console.log(3));
console.log(4);
// Output: 2, 4, 1, 3
// (the promise only resolves AFTER its own setTimeout fires, so its .then
//  is queued as a microtask only after the first setTimeout's callback runs)
```

### 27. process.nextTick() vs setImmediate() (Node.js)
- `process.nextTick()` — runs at the very end of the current operation, **before** the event loop continues (higher priority than Promises even).
- `setImmediate()` — runs in the "check" phase of the event loop, after I/O callbacks.
```js
console.log('start');
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
console.log('end');
// Output: start, end, nextTick, setImmediate
```

### 28. fetch / axios / ajax, Abort a fetch request
```js
const controller = new AbortController();
const signal = controller.signal;

fetch('/api/data', { signal })
  .then(res => res.json())
  .then(console.log)
  .catch(err => {
    if (err.name === 'AbortError') console.log('Fetch aborted');
  });

// Cancel it (e.g. on component unmount, or a timeout)
setTimeout(() => controller.abort(), 3000);
```

### 29. `setTimeout` inside a `var` loop — classic closure bug
```js
const arr = [10, 12, 15, 21];
for (var i = 0; i < arr.length; i++) {
  setTimeout(function () {
    console.log('Index: ' + i + ', element: ' + arr[i]);
  }, 100);
}
// var is function-scoped, so ALL callbacks share the same 'i'.
// By the time they run, the loop has finished and i === 4.
// Output (4x): "Index: 4, element: undefined"

// FIX 1 — use let (block-scoped, new binding each iteration)
for (let i = 0; i < arr.length; i++) {
  setTimeout(() => console.log('Index: ' + i + ', element: ' + arr[i]), 100);
}

// FIX 2 — IIFE to capture i per iteration
for (var i = 0; i < arr.length; i++) {
  (function (i) {
    setTimeout(() => console.log('Index: ' + i + ', element: ' + arr[i]), 100);
  })(i);
}
```

### 30. Debounce & Throttle
```js
// Debounce — waits for a pause in calls before executing (e.g. search input)
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle — executes at most once per interval (e.g. scroll/resize handler)
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

---

## Part 5 — DOM & Events

### 31. Event Bubbling, Capturing, Delegation, stopPropagation
```html
<div id="parent"><button id="child">Click me</button></div>
```
```js
// Bubbling (default): child → parent → document
document.getElementById('parent').addEventListener('click', () => console.log('parent'));
document.getElementById('child').addEventListener('click', (e) => {
  console.log('child');
  // e.stopPropagation(); // would stop it from reaching 'parent'
});

// Capturing: pass { capture: true } — fires top-down instead
parent.addEventListener('click', () => console.log('capture phase'), { capture: true });

// Event Delegation — one listener on the parent handles all (even future) children
document.getElementById('parent').addEventListener('click', (e) => {
  if (e.target.matches('button')) console.log('Button clicked:', e.target.textContent);
});
```

### 32. preventDefault, `return false`, `javascript:void(0)`
```js
document.querySelector('a').addEventListener('click', function (e) {
  e.preventDefault(); // stops the link navigation, but event still bubbles
});
// `return false` in a jQuery/inline handler = preventDefault() + stopPropagation() combined
// `javascript:void(0)` in href="" just evaluates to undefined so the link does nothing
```

### 33. addEventListener vs onclick
```js
el.onclick = () => console.log('first');
el.onclick = () => console.log('second'); // overwrites the first — only 'second' runs

el.addEventListener('click', () => console.log('A')); // both run
el.addEventListener('click', () => console.log('B'));
```

### 34. DOM selection & manipulation (from cheat-sheet)
```js
document.getElementById('id');                 // single element
document.getElementsByClassName('cls');         // live HTMLCollection
document.querySelector('.cls');                 // first match, CSS selector
document.querySelectorAll('.cls');               // static NodeList, all matches

el.innerHTML = '<b>bold</b>'; // parses HTML — XSS risk with user input
el.textContent = '<b>bold</b>'; // sets literal text — safe

const clone = el.cloneNode(true); // deep clone including children
```

---

## Part 6 — Storage, Auth & Security

### 35. localStorage vs sessionStorage vs Cookies
| | localStorage | sessionStorage | Cookies |
|---|---|---|---|
| Capacity | ~5MB | ~5MB | ~4KB |
| Lifetime | until cleared manually | until tab closes | set expiry |
| Sent to server? | no | no | yes, on every request |
| Scope | all tabs, same origin | one tab only | per domain/path |

```js
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme')); // 'dark'
localStorage.removeItem('theme');

document.cookie = 'user=ash; max-age=3600; path=/';
```

### 36. JWT vs Session ID
- **JWT**: `header.payload.signature` — self-contained, stateless, no server-side storage needed, but can't be revoked early without extra tracking.
- **Session ID**: opaque token mapped to server-stored session data — easy to revoke, but requires server memory/DB lookups.

### 37. Authentication vs Authorization
- **Authentication** = *who are you* (login, password, MFA).
- **Authorization** = *what can you do* (roles, permissions — checked after authentication).

### 38. CORS
Browsers block cross-origin requests by default. Server must respond with headers like:
```
Access-Control-Allow-Origin: https://yourapp.com
Access-Control-Allow-Methods: GET, POST
```

### 39. Security notes
```js
// XSS — never inject raw user input into innerHTML
el.innerHTML = userInput; // BAD
el.textContent = userInput; // GOOD

// Avoid eval() — executes arbitrary strings as code
eval(userInput); // BAD, huge security risk
```

---

## Part 7 — Types, Coercion & Comparisons

### 40. null vs undefined, isNaN, `==` vs `===`, Data Types
```js
let x;              // undefined — declared, not assigned
let y = null;        // null — explicitly "no value"
console.log(x == y); // true (loose, both "nullish")
console.log(x === y);// false (different types)

isNaN('Hello');       // true — coerces to NaN first
Number.isNaN('Hello'); // false — no coercion, stricter check

0 == false;   // true  (coerced)
0 === false;  // false (different types)
1 == '1';     // true
1 === '1';    // false
[] == [];     // false (different object references)
{} == {};     // false (different object references)
```
**Types:** `number`, `bigint`, `string`, `boolean`, `null`, `undefined`, `symbol` (primitives, immutable, compared by value) and `object`/`array`/`function` (reference types, mutable, compared by reference).

### 41. Coercion Gotchas
```js
0.1 + 0.2 === 0.3;   // false — floating point precision error
console.log(0.1 + 0.2); // 0.30000000000000004

console.log(2 + '2' - '2');   // '22' - '2' → 20 (string concat then numeric subtraction)
console.log(typeof typeof 1); // 'string' (typeof 1 → 'number', typeof 'number' → 'string')
console.log(3 > 2 > 1);       // false ((3>2) → true → 1, then 1 > 1 → false)

let n = 10;
n = n + '1'; // '101' (string concatenation)
n = n - '1'; // 100   (numeric subtraction, '101' - 1)
```

### 42. Compiled or Interpreted?
JavaScript is generally described as **interpreted / JIT-compiled** — V8 (and other engines) parse and interpret code, then compile "hot" code paths to optimized machine code on the fly.

---

## Part 8 — Performance & Web Metrics

### 43. Cumulative Layout Shift (CLS)
A Core Web Vital measuring unexpected layout shifts (e.g. custom font swapping in after a fallback font, images without reserved dimensions). Fix by setting `width`/`height` on images and using `font-display: optional/swap` carefully.

### 44. Browser freezing during a long `for` loop
JS is single-threaded — a long synchronous loop blocks rendering and user input.
**Fixes:** break work into chunks with `setTimeout`/`requestIdleCallback`, use a **Web Worker** to run it off the main thread, or virtualize/paginate the data being processed.

### 45. Service Worker
A background script that intercepts network requests, enabling offline caching, push notifications, and PWA functionality — runs independently of the page.
```js
navigator.serviceWorker.register('/sw.js');
```

### 46. SSR vs CSR
- **CSR** (Client-Side Rendering): browser downloads a near-empty HTML + JS bundle, JS renders the page — slower first paint, better subsequent navigation (SPA feel).
- **SSR** (Server-Side Rendering): server sends fully-rendered HTML — faster first paint & better SEO, but more server load per request.

---

## Part 9 — Modules, HTTP & APIs

### 47. Modular JS & ES6 Features
```js
// math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) { return a * b; }

// main.js
import multiply, { add } from './math.js';

// Destructuring
const { name, age } = { name: 'Alice', age: 30 };
const [first, , third] = [1, 2, 3];

// Spread / Rest
const merged = { ...obj1, ...obj2 };
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
```

### 48. HTTP Methods & Status Codes
| Method | Use |
|---|---|
| GET | Read data |
| POST | Create data |
| PUT | Replace a resource entirely |
| PATCH | Partially update a resource |
| DELETE | Remove a resource |

| Code range | Meaning |
|---|---|
| 1xx | Informational |
| 2xx | Success (200 OK, 201 Created, 204 No Content) |
| 3xx | Redirection (301 Moved, 304 Not Modified) |
| 4xx | Client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found) |
| 5xx | Server error (500 Internal Server Error, 503 Unavailable) |

### 49. GraphQL vs REST
- **REST**: multiple fixed endpoints, can over/under-fetch data.
- **GraphQL**: single endpoint, client specifies exactly the fields it needs, strongly typed schema.

### 50. slice vs substring, JSON.parse vs response.json()
```js
'hello'.slice(1, 3);      // 'el' — supports negative indices
'hello'.substring(1, 3);  // 'el' — negative treated as 0, swaps if start > end

JSON.parse('{"a":1}');    // synchronously parses a JSON STRING into an object
fetch(url).then(res => res.json()); // ASYNC helper that reads the Response body stream
                                     // and JSON.parse()s it — returns a Promise
```

### 51. Date handling
```js
const d = new Date();
d.toISOString();     // '2026-09-16T10:00:00.000Z'
d.getTime();          // ms since epoch
new Date('2026-09-16').toLocaleDateString('en-US'); // '9/16/2026'
```

### 52. Web Components, Set
```js
class MyBadge extends HTMLElement {
  connectedCallback() { this.innerHTML = `<span>Custom!</span>`; }
}
customElements.define('my-badge', MyBadge);

const set = new Set([1, 2, 2, 3]);
console.log([...set]); // [1, 2, 3] — unique values only
```

### 53. Error Types
`SyntaxError`, `ReferenceError`, `TypeError`, `RangeError`, `URIError`, `EvalError`, `InternalError`.

### 54. defer, async, script placement
```html
<script src="a.js" defer></script> <!-- downloads in parallel, runs after HTML parsed, in order -->
<script src="b.js" async></script> <!-- downloads in parallel, runs ASAP (order not guaranteed) -->
<!-- script at bottom of <body> with no attribute: blocks nothing before it, but blocks
     rendering while it downloads+executes at that point -->
```

---

## Part 10 — Coding Practice (with solutions)

### 55. Cart Total
```js
const cart = [
  { product: 'milk', quantity: 10, price: 10.2 },
  { product: 'bread', quantity: 5, price: 3.5 },
];
const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
console.log(total); // 119.5
```

### 56. Object reference & reduce
```js
let a = { x: 1 }, b = a;
b.x = 2;
console.log(a.x); // 2 — objects are copied by reference

[1, 2, 3, 4].reduce((res, cur) => res + cur, 0); // 10
```

### 57. Destructuring
```js
const employee = { name: 'Alice', age: 30, position: 'Developer' };
const { name, age } = employee;
const [c1, c2] = ['red', 'blue', 'green'];
console.log(name, age, c1, c2); // Alice 30 red blue
```

### 58. Sort array of objects by property
```js
const users = [{ name: 'B', age: 30 }, { name: 'A', age: 25 }];
users.sort((a, b) => a.age - b.age); // ascending by age
```

### 59. Longest Common Subsequence
```js
function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}
console.log(lcs('abcde', 'ace')); // 3
// Time: O(m*n), Space: O(m*n)
```

### 60. First non-repeating character
```js
function firstNonRepeating(str) {
  const counts = {};
  for (const ch of str) counts[ch] = (counts[ch] || 0) + 1;
  return [...str].find(ch => counts[ch] === 1) ?? null;
}
console.log(firstNonRepeating('swiss')); // 'w'
```

### 61. Valid Parentheses
```js
// Single type
function isValidSimple(s) {
  let balance = 0;
  for (const ch of s) {
    if (ch === '(') balance++;
    else if (ch === ')') balance--;
    if (balance < 0) return false;
  }
  return balance === 0;
}

// Multiple types
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}
console.log(isValid('{[()]}')); // true
console.log(isValid('{[(])}')); // false
```

### 62. Rotate matrix 90° clockwise
```js
function rotate(matrix) {
  matrix.reverse(); // reverse rows
  for (let i = 0; i < matrix.length; i++)
    for (let j = i + 1; j < matrix.length; j++)
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]; // transpose
  return matrix;
}
console.log(rotate([[1,2,3],[4,5,6],[7,8,9]]));
// [[7,4,1],[8,5,2],[9,6,3]]
```

### 63. Flatten a nested object
```js
function flattenObject(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}
console.log(flattenObject({ a: 1, b: { c: 2, d: { e: 3 } } }));
// { a: 1, 'b.c': 2, 'b.d.e': 3 }
```

### 64. Even before odd / negative before positive (stable)
```js
function evensFirst(arr) {
  return [...arr.filter(n => n % 2 === 0), ...arr.filter(n => n % 2 !== 0)];
}
function negativesFirst(arr) {
  return [...arr.filter(n => n < 0), ...arr.filter(n => n >= 0)];
}
console.log(evensFirst([1, 2, 3, 4, 5])); // [2, 4, 1, 3, 5]
```

### 65. Remove duplicates / remove all occurrences in-place (sorted array)
```js
// Remove duplicates from sorted array in-place, return new length
function removeDuplicates(nums) {
  if (!nums.length) return 0;
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) nums[++i] = nums[j];
  }
  return i + 1;
}

// Remove all occurrences of `val` in-place, return new length
function removeElement(nums, val) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) nums[k++] = nums[i];
  }
  return k;
}
```

### 66. All subsets (power set)
```js
function subsets(nums) {
  const result = [[]];
  for (const num of nums) {
    const len = result.length;
    for (let i = 0; i < len; i++) result.push([...result[i], num]);
  }
  return result;
}
console.log(subsets([1, 2])); // [[], [1], [2], [1,2]]
```

### 67. Kadane's Algorithm — max subarray sum
```js
function maxSubArray(nums) {
  let maxSoFar = nums[0], maxHere = nums[0];
  for (let i = 1; i < nums.length; i++) {
    maxHere = Math.max(nums[i], maxHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxHere);
  }
  return maxSoFar;
}
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6 -> [4,-1,2,1]
// Time: O(n)
```

### 68. Merge overlapping intervals
```js
function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else result.push(intervals[i]);
  }
  return result;
}
console.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]]
```

### 69. Square root without built-ins (binary search)
```js
function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1, hi = x, ans = 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (mid * mid <= x) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans; // integer sqrt; extend with decimals for precision
}
```

### 70. Kth smallest element
```js
function kthSmallest(arr, k) {
  return [...arr].sort((a, b) => a - b)[k - 1]; // O(n log n); use a min-heap for O(n log k)
}
```

### 71. Longest substring without repeats / with at most K distinct chars
```js
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let start = 0, max = 0;
  for (let end = 0; end < s.length; end++) {
    if (seen.has(s[end]) && seen.get(s[end]) >= start) start = seen.get(s[end]) + 1;
    seen.set(s[end], end);
    max = Math.max(max, end - start + 1);
  }
  return max;
}
console.log(lengthOfLongestSubstring('abcabcbb')); // 3

function longestKDistinct(s, k) {
  const counts = new Map();
  let start = 0, max = 0;
  for (let end = 0; end < s.length; end++) {
    counts.set(s[end], (counts.get(s[end]) || 0) + 1);
    while (counts.size > k) {
      counts.set(s[start], counts.get(s[start]) - 1);
      if (counts.get(s[start]) === 0) counts.delete(s[start]);
      start++;
    }
    max = Math.max(max, end - start + 1);
  }
  return max;
}
```

### 72. Trailing zeros in factorial
```js
function trailingZeros(n) {
  let count = 0;
  for (let i = 5; Math.floor(n / i) >= 1; i *= 5) count += Math.floor(n / i);
  return count; // counts factors of 5 (5s are the limiting factor vs 2s)
}
console.log(trailingZeros(100)); // 24
```

### 73. Longest palindromic substring / subsequence
```js
// Substring — expand around center, O(n²)
function longestPalindrome(s) {
  let start = 0, maxLen = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return s.substring(start, start + maxLen);
}

// Subsequence — DP, O(n²)
function longestPalinSubsequence(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      dp[i][j] = s[i] === s[j] ? dp[i + 1][j - 1] + 2 : Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}
```

### 74. Max sum of non-adjacent elements
```js
function maxNonAdjacentSum(arr) {
  let incl = 0, excl = 0;
  for (const num of arr) {
    const newIncl = excl + num;
    excl = Math.max(incl, excl);
    incl = newIncl;
  }
  return Math.max(incl, excl);
}
console.log(maxNonAdjacentSum([3, 2, 7, 10])); // 13 (3+10)
```

### 75. Maximum product of three numbers
```js
function maxProduct3(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  return Math.max(
    nums[n - 1] * nums[n - 2] * nums[n - 3],   // three largest
    nums[0] * nums[1] * nums[n - 1]             // two smallest (could be negative) * largest
  );
}
```

### 76. Design a Carousel (concept)
Core pieces: an array of slides, an active index in state, `next()`/`prev()` that wrap with modulo (`(index + 1) % slides.length`), optional `setInterval` for autoplay (paused on hover), and CSS `transform: translateX()` transitions driven by the active index.

### 77. Filter & merge with uniqueness
```js
const people = [{ name: 'A', age: 60 }, { name: 'B', age: 30 }];
const under50 = people.filter(p => p.age < 50);

function mergeUnique(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}
console.log(mergeUnique([1, 2, 3], [2, 3, 4])); // [1, 2, 3, 4]
```

### 78. Common utility functions
```js
// Longest word in a sentence
const longestWord = s => s.split(' ').reduce((a, b) => (b.length > a.length ? b : a));

// Remove duplicates from an array
const uniqueArr = arr => [...new Set(arr)];

// Largest number in array
const maxNum = arr => Math.max(...arr);

// Sort ascending (non-mutating)
const sortAsc = arr => [...arr].sort((a, b) => a - b);

// Remove a specific element from array
const removeVal = (arr, val) => arr.filter(v => v !== val);

// Longest common prefix
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}
```
> Reverse string, palindrome, anagram, vowels, prime, factorial, fibonacci, strip spaces, sum/average, is-sorted, merge sorted, second largest and intersection now live in Part 11.

---

## Part 11 — Top 50 Coding Questions (Aazam Sheet)

Classic beginner-to-intermediate problems, in the same order as the sheet. Each has a JS solution; practice links are in [coding-questions/README.md](coding-questions/README.md).

### 79. Check Even or Odd
```js
const isEven = n => n % 2 === 0;
console.log(isEven(4), isEven(7)); // true false

// Bitwise alternative — last bit is 0 for even numbers
const isEvenBit = n => (n & 1) === 0;
```

### 80. Check Prime Number
```js
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
console.log(isPrime(7), isPrime(12)); // true false
// Time: O(√n) — a factor larger than √n must pair with one smaller than √n
```

### 81. Factorial of a Number
```js
// Iterative
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Recursive
const factorialRec = n => (n <= 1 ? 1 : n * factorialRec(n - 1));

console.log(factorial(5), factorialRec(5)); // 120 120
```

### 82. Fibonacci Series (First N Terms)
```js
function fibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return seq.slice(0, n);
}
console.log(fibonacci(7)); // [0, 1, 1, 2, 3, 5, 8]
```

### 83. Reverse a Number
```js
function reverseNumber(n) {
  let rev = 0, num = Math.abs(n);
  while (num > 0) {
    rev = rev * 10 + (num % 10); // append last digit
    num = Math.floor(num / 10);  // drop last digit
  }
  return n < 0 ? -rev : rev;
}
console.log(reverseNumber(1234), reverseNumber(-560)); // 4321 -65
```

### 84. Check Palindrome Number
```js
// Uses reverseNumber from the previous question
const isPalindromeNumber = n => n >= 0 && n === reverseNumber(n);
console.log(isPalindromeNumber(121), isPalindromeNumber(123)); // true false
```

### 85. Armstrong Number
A number equal to the sum of its digits, each raised to the power of the digit count (e.g. 153 = 1³ + 5³ + 3³).
```js
function isArmstrong(n) {
  const digits = String(n).split('').map(Number);
  const power = digits.length;
  return digits.reduce((sum, d) => sum + d ** power, 0) === n;
}
console.log(isArmstrong(153), isArmstrong(123)); // true false
```

### 86. Sum of Digits
```js
function sumOfDigits(n) {
  let sum = 0, num = Math.abs(n);
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  return sum;
}
console.log(sumOfDigits(1234)); // 10
```

### 87. Largest of Three Numbers
```js
function largestOfThree(a, b, c) {
  if (a >= b && a >= c) return a;
  if (b >= a && b >= c) return b;
  return c;
}
console.log(largestOfThree(3, 9, 5)); // 9
console.log(Math.max(3, 9, 5));       // 9 — built-in shortcut
```

### 88. GCD of Two Numbers
```js
// Euclid's algorithm: gcd(a, b) = gcd(b, a % b)
function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}
console.log(gcd(48, 18)); // 6
```

### 89. LCM of Two Numbers
```js
// Uses gcd from the previous question
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
console.log(lcm(4, 6)); // 12
```

### 90. Check Leap Year
```js
// Divisible by 4, except centuries — unless also divisible by 400
const isLeapYear = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
console.log(isLeapYear(2024), isLeapYear(1900), isLeapYear(2000)); // true false true
```

### 91. Count Vowels and Consonants
```js
function countVowelsConsonants(str) {
  let vowels = 0, consonants = 0;
  for (const ch of str.toLowerCase()) {
    if ('aeiou'.includes(ch)) vowels++;
    else if (ch >= 'a' && ch <= 'z') consonants++; // ignore digits, spaces, symbols
  }
  return { vowels, consonants };
}
console.log(countVowelsConsonants('Hello World')); // { vowels: 3, consonants: 7 }

// Regex one-liner for vowels only
const countVowels = s => (s.match(/[aeiou]/gi) || []).length;
```

### 92. Reverse a String
```js
// Manual loop
function reverseString(str) {
  let rev = '';
  for (let i = str.length - 1; i >= 0; i--) rev += str[i];
  return rev;
}

// Built-ins
const reverseBuiltIn = s => s.split('').reverse().join('');
const reverseReduce = s => [...s].reduce((rev, ch) => ch + rev, '');

console.log(reverseString('hello')); // 'olleh'
```

### 93. Check Anagram
```js
// Sort-based — O(n log n)
const isAnagram = (a, b) => a.split('').sort().join('') === b.split('').sort().join('');

// Frequency count — O(n)
function isAnagramFast(a, b) {
  if (a.length !== b.length) return false;
  const count = {};
  for (const ch of a) count[ch] = (count[ch] || 0) + 1;
  for (const ch of b) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}
console.log(isAnagramFast('listen', 'silent'), isAnagramFast('rat', 'car')); // true false
```

### 94. Remove Duplicates from String
```js
// Keeps the first occurrence of each character
const removeDuplicateChars = str => [...new Set(str)].join('');

// Manual version
function removeDuplicateCharsLoop(str) {
  const seen = new Set();
  let result = '';
  for (const ch of str) {
    if (!seen.has(ch)) { seen.add(ch); result += ch; }
  }
  return result;
}
console.log(removeDuplicateChars('programming')); // 'progamin'
```

### 95. Find Second Largest in Array
```js
// Single pass — O(n)
function secondLargest(arr) {
  let first = -Infinity, second = -Infinity;
  for (const n of arr) {
    if (n > first) { second = first; first = n; }
    else if (n > second && n !== first) second = n;
  }
  return second === -Infinity ? null : second;
}
console.log(secondLargest([12, 35, 1, 10, 34, 1])); // 34

// One-liner — O(n log n)
const secondLargestSort = arr => [...new Set(arr)].sort((a, b) => b - a)[1];
```

### 96. Linear Search
```js
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;
  return -1;
}
console.log(linearSearch([5, 3, 8, 1], 8)); // 2
// Time: O(n)
```

### 97. Binary Search (Sorted Array)
```js
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
console.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3
// Time: O(log n) — halves the search space each step
```

### 98. Bubble Sort
```js
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted — early exit
  }
  return a;
}
console.log(bubbleSort([5, 1, 4, 2, 8])); // [1, 2, 4, 5, 8]
// Time: O(n²) worst, O(n) best (already sorted)
```

### 99. Selection Sort
```js
function selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[minIdx]) minIdx = j;
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
}
console.log(selectionSort([64, 25, 12, 22, 11])); // [11, 12, 22, 25, 64]
// Time: O(n²) always
```

### 100. Insertion Sort
```js
function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j]; // shift bigger elements right
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}
console.log(insertionSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
// Time: O(n²) worst, O(n) best — good for small or nearly sorted arrays
```

### 101. Matrix Addition
```js
const addMatrices = (A, B) => A.map((row, i) => row.map((val, j) => val + B[i][j]));
console.log(addMatrices([[1, 2], [3, 4]], [[5, 6], [7, 8]])); // [[6, 8], [10, 12]]
```

### 102. Transpose of Matrix
```js
// Rows become columns — works for non-square matrices too
const transpose = m => m[0].map((_, j) => m.map(row => row[j]));
console.log(transpose([[1, 2, 3], [4, 5, 6]])); // [[1, 4], [2, 5], [3, 6]]
```

### 103. Count Frequency of Element in Array
```js
function frequency(arr) {
  const freq = {};
  for (const item of arr) freq[item] = (freq[item] || 0) + 1;
  return freq;
}
console.log(frequency([1, 2, 2, 3, 3, 3])); // { '1': 1, '2': 2, '3': 3 }

// Count of one specific element
const countOf = (arr, x) => arr.filter(v => v === x).length;
```

### 104. Check if Array is Sorted
```js
const isSorted = arr => arr.every((v, i) => i === 0 || arr[i - 1] <= v);
console.log(isSorted([1, 2, 2, 5]), isSorted([3, 1, 2])); // true false
```

### 105. Merge Two Arrays
```js
const merged = [...[1, 2], ...[3, 4]];   // [1, 2, 3, 4]
const merged2 = [1, 2].concat([3, 4]);   // same, no spread

// Merge two SORTED arrays into one sorted array — two pointers, O(n + m)
function mergeSorted(a, b) {
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) result.push(a[i] <= b[j] ? a[i++] : b[j++]);
  return result.concat(a.slice(i), b.slice(j));
}
console.log(mergeSorted([1, 4, 7], [2, 3, 8])); // [1, 2, 3, 4, 7, 8]
```

### 106. Find Missing Number (1 to N)
```js
// Array holds 1..N with exactly one number missing
function findMissing(arr) {
  const n = arr.length + 1;
  const expected = (n * (n + 1)) / 2; // sum of 1..N
  const actual = arr.reduce((s, x) => s + x, 0);
  return expected - actual;
}
console.log(findMissing([1, 2, 4, 5, 6])); // 3
// Time: O(n), Space: O(1)
```

### 107. Count Words in a String
```js
const countWords = str => (str.trim() ? str.trim().split(/\s+/).length : 0);
console.log(countWords('  Hello   world from JS ')); // 4
console.log(countWords('   '));                      // 0
```

### 108. Remove All Spaces from String
```js
const stripSpaces = s => s.replace(/\s+/g, '');
const stripSpaces2 = s => s.split(' ').join(''); // only plain spaces, not tabs/newlines
console.log(stripSpaces('a b  c\td')); // 'abcd'
```

### 109. Find Duplicate Elements in Array
```js
function findDuplicates(arr) {
  const seen = new Set(), dupes = new Set();
  for (const n of arr) seen.has(n) ? dupes.add(n) : seen.add(n);
  return [...dupes];
}
console.log(findDuplicates([1, 2, 3, 2, 4, 1, 1])); // [2, 1]
// Time: O(n)
```

### 110. Move All Zeros to End
```js
// In place, keeps order of non-zero elements
function moveZeros(nums) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) [nums[k++], nums[i]] = [nums[i], nums[k]];
  }
  return nums;
}
console.log(moveZeros([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
```

### 111. Rotate Array Right by 1 Position
```js
function rotateRight(arr) {
  if (arr.length < 2) return arr;
  const last = arr[arr.length - 1];
  for (let i = arr.length - 1; i > 0; i--) arr[i] = arr[i - 1];
  arr[0] = last;
  return arr;
}
console.log(rotateRight([1, 2, 3, 4, 5])); // [5, 1, 2, 3, 4]

// Built-in shortcut
const arr = [1, 2, 3];
arr.unshift(arr.pop()); // [3, 1, 2]
```

### 112. Check Palindrome String
```js
// Ignores case, spaces and punctuation (LeetCode "Valid Palindrome")
function isPalindrome(s) {
  const c = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = c.length - 1;
  while (l < r) if (c[l++] !== c[r--]) return false;
  return true;
}
console.log(isPalindrome('A man, a plan, a canal: Panama')); // true
console.log(isPalindrome('race a car'));                     // false
```

### 113. Count Number of Digits
```js
function countDigits(n) {
  let num = Math.abs(n), count = 0;
  do { count++; num = Math.floor(num / 10); } while (num > 0); // do-while so 0 counts as 1 digit
  return count;
}
console.log(countDigits(12345), countDigits(0)); // 5 1
```

### 114. Sum of Elements in Array
```js
const sumArr = arr => arr.reduce((a, b) => a + b, 0);
const avgArr = arr => sumArr(arr) / arr.length;
console.log(sumArr([1, 2, 3, 4]), avgArr([1, 2, 3, 4])); // 10 2.5
```

### 115. Find Minimum Element in Array
```js
function findMin(arr) {
  let min = arr[0];
  for (const n of arr) if (n < min) min = n;
  return min;
}
console.log(findMin([7, 2, 9, -3, 5])); // -3
console.log(Math.min(...[7, 2, 9, -3, 5])); // -3 — built-in (avoid for very large arrays)
```

### 116. Pattern Printing (Right Triangle)
```js
function rightTriangle(n) {
  for (let i = 1; i <= n; i++) console.log('* '.repeat(i).trim());
}
rightTriangle(4);
// *
// * *
// * * *
// * * * *
```

### 117. Power of a Number
```js
// Fast exponentiation — O(log n), handles negative powers (LeetCode "Pow(x, n)")
function myPow(x, n) {
  if (n < 0) { x = 1 / x; n = -n; }
  let result = 1;
  while (n > 0) {
    if (n % 2 === 1) result *= x;
    x *= x;
    n = Math.floor(n / 2);
  }
  return result;
}
console.log(myPow(2, 10), myPow(2, -2)); // 1024 0.25
console.log(2 ** 10, Math.pow(2, 10));   // built-ins
```

### 118. Decimal to Binary
```js
function decimalToBinary(n) {
  if (n === 0) return '0';
  let bin = '';
  while (n > 0) {
    bin = (n % 2) + bin;
    n = Math.floor(n / 2);
  }
  return bin;
}
console.log(decimalToBinary(10), (10).toString(2)); // '1010' '1010'
```

### 119. Binary to Decimal
```js
function binaryToDecimal(bin) {
  let dec = 0;
  for (const bit of bin) dec = dec * 2 + Number(bit);
  return dec;
}
console.log(binaryToDecimal('1010'), parseInt('1010', 2)); // 10 10
```

### 120. Check Perfect Number
A number equal to the sum of its proper divisors (e.g. 28 = 1 + 2 + 4 + 7 + 14).
```js
function isPerfect(n) {
  if (n < 2) return false;
  let sum = 1;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i; // add the paired divisor
    }
  }
  return sum === n;
}
console.log(isPerfect(28), isPerfect(12)); // true false
```

### 121. Strong Number
A number equal to the sum of the factorials of its digits (e.g. 145 = 1! + 4! + 5!).
```js
function isStrong(n) {
  const fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880]; // 0!..9!
  let sum = 0, num = n;
  while (num > 0) {
    sum += fact[num % 10];
    num = Math.floor(num / 10);
  }
  return sum === n;
}
console.log(isStrong(145), isStrong(123)); // true false
```

### 122. Count Even and Odd Numbers in Array
```js
function countEvenOdd(arr) {
  let even = 0, odd = 0;
  for (const n of arr) n % 2 === 0 ? even++ : odd++;
  return { even, odd };
}
console.log(countEvenOdd([1, 2, 3, 4, 5])); // { even: 2, odd: 3 }
```

### 123. Find Intersection of Two Arrays
```js
// Simple — O(n * m)
const intersection = (a, b) => a.filter(x => b.includes(x));

// Set-based, unique results — O(n + m)
function intersectionFast(a, b) {
  const setB = new Set(b);
  return [...new Set(a.filter(x => setB.has(x)))];
}
console.log(intersectionFast([1, 2, 2, 3, 4], [2, 2, 4, 6])); // [2, 4]
```

### 124. Check Substring
```js
// Built-ins
'hello world'.includes('world'); // true
'hello world'.indexOf('world');  // 6

// Manual — index of first occurrence (LeetCode "Find the Index of the First Occurrence in a String")
function strStr(haystack, needle) {
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (haystack.slice(i, i + needle.length) === needle) return i;
  }
  return -1;
}
console.log(strStr('sadbutsad', 'sad'), strStr('leetcode', 'leeto')); // 0 -1
```

### 125. Remove Specific Character from String
```js
const removeChar = (str, ch) => str.split(ch).join('');
const removeChar2 = (str, ch) => str.replaceAll(ch, '');
console.log(removeChar('banana', 'a')); // 'bnn'
```

### 126. Sum of Prime Numbers up to N
```js
// Sieve of Eratosthenes — O(n log log n)
function sumPrimes(n) {
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = false;
  }
  return isPrime.reduce((sum, p, i) => (p ? sum + i : sum), 0);
}
console.log(sumPrimes(10)); // 17 (2 + 3 + 5 + 7)
```

### 127. Reverse Words in a Sentence
```js
// Built-in one-liner
const reverseWordsBuiltIn = s => s.trim().split(/\s+/).reverse().join(' ');

// Without split/reverse
function reverseWords(sentence) {
  let word = '', result = '';
  for (let i = 0; i <= sentence.length; i++) {
    if (sentence[i] === ' ' || i === sentence.length) {
      result = (result ? word + ' ' + result : word);
      word = '';
    } else {
      word += sentence[i];
    }
  }
  return result;
}
console.log(reverseWords('the sky is blue')); // 'blue is sky the'
```

### 128. Two Sum Problem
```js
function twoSum(nums, target) {
  const map = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([10, 20, 30, 40], 50)); // [1, 2] -> 20 + 30
// Time: O(n), Space: O(n) — one pass with a hash map (vs O(n²) brute force)
```

---

## Quick Reference Cheat-Sheet

### Variables & Types
| Topic | Key Point |
|---|---|
| var / let / const | var: function-scoped, hoisted as `undefined`, redeclarable · let: block-scoped, no redeclare · const: block-scoped, no reassign |
| Primitive types | number, string, boolean, null, undefined, symbol, bigint — stored by value, immutable |
| Non-primitive types | object, array, function — stored by reference, mutable |
| typeof | `typeof null === "object"` is a long-standing JS quirk |
| Short-circuit eval | `&&`/`\|\|` stop as soon as the result is known |
| Spread `...` | expands an iterable into elements |
| Rest `...` | collects remaining args into an array |

### Arrays
| Method | Key Point |
|---|---|
| find vs filter | find → first match · filter → all matches |
| push vs concat | push mutates · concat returns new array |
| pop vs shift | pop removes last · shift removes first (both mutate) |
| slice vs splice | slice → copy, no mutation · splice → mutates in place |
| map vs forEach | map returns new array · forEach returns undefined |
| Array-like objects | index + length but no array methods (`arguments`, NodeList) → `Array.from()` |

### Loops
| Loop | Use |
|---|---|
| do-while | runs body at least once |
| for...of | iterates values |
| for...in | iterates keys/properties |

### Objects
| Concept | Key Point |
|---|---|
| Check property | `'key' in obj`, `obj.hasOwnProperty('key')` |
| Clone (shallow) | `{...obj}` / `Object.assign({}, obj)` |
| Clone (deep) | `structuredClone(obj)` or `JSON.parse(JSON.stringify(obj))` |
| Map vs Object | Map: any key type, keeps insertion order · Object: string/symbol keys |

### Security & Performance
| Topic | Key Point |
|---|---|
| XSS | sanitize input, avoid raw `innerHTML` from user data |
| SQL Injection | use parameterized queries |
| eval() | avoid — security risk |
| Perf tips | bundle/minify, async ops, minimize DOM writes, remove unused listeners, lazy-load |

---

*Compiled and expanded reference — every "Answer" placeholder from the original notes now has a working example.*
