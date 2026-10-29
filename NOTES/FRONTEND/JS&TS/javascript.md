<!--
JS-1 - call apply bind
 -->

### call

runs the function right now, and the first argument becomes this, the rest are normal arguments.

```
function abc(name,lastname){
  console.log(this.age, name,lastname)
}

const myage = {age:30}

abc.call(myage,'ashish','yadav')
```

### APPLY

apply runs the function right now, the first argument becomes this, and the rest go in an array.

js
fn.apply(thisObj, [arg1, arg2]);

### bind

bind doesn’t run the function; it returns a new function where this is fixed to the first argument, to run later.

```
function abc(name, last){
 return this.age
}

const myage = {age:30}

const newFun = abc.bind(myage)

console.log(newFun())
```

## NOTE

=> Modern JS replaced bind with arrow functions, apply with spread (...), and call with class/super()
=> you can use call, apply, and bind on an arrow function, and it will run and receive arguments. But they can’t change its this. The first argument is simply ignored.

## JS-2 ARROW AND NORMAL FUNCTION

=> When we call a method using an object, we use a normal function because it can access the object through this. If we use an arrow function, this will be undefined because an arrow function doesn’t have its own this

=> bind, call, apply can’t change this in an arrow function. They work on normal functions.

=> an arrow function no this

=> an arrow function no arguments if need paas (...args)
=>, an arrow function no new. an arrow can’t create objects, so use a normal function (or a class) normal function can create object

```
function Person(name) {
  this.name = name;
}

const p1 = new Person("Bob");

```

## JS-3 arguments

is a hidden list of all values passed to a function.

```
function show() {
  console.log(arguments);
}

show(10, 20, 30); // [10, 20, 30]
```

### 4. IIFE (Immediately Invoked Function Expression)

```js
(function () {
  const secret = "hidden from global scope";
  console.log(secret);
})();

// Common pre-ES6 module pattern to avoid polluting global scope
```

### JS-5. Pure function

```js
// Pure — same input always gives same output, no side effects
const add = (a, b) => a + b;
```

### JS-6. impure function

// Impure — depends on / mutates external state
let total = 0;
function addToTotal(n) {
total += n;
return total;
}

### JS-7 Declaration function

— hoisted, can be called before definition

greet(); // "Hello!" (works, even though greet is defined below)

function greet() {
console.log("Hello!");
}

### JS-8 expressions function

sayHi(); // ❌ TypeError: sayHi is not a function
var sayHi = function () { console.log("Hi"); };

### JS-8 Fixing arrow-function `this` in an object

```js
const user = {
  email: "my@email.com",
  updateEmail: (email) => {
    this.email = email;
  }, // 'this' is NOT user here
};
user.updateEmail("new@email.com");
console.log(user.email); // still 'my@email.com'

// Fix: use a regular function so 'this' binds to the calling object
const user2 = {
  email: "my@email.com",
  updateEmail(email) {
    this.email = email;
  }, // shorthand method syntax
};
user2.updateEmail("new@email.com");
console.log(user2.email); // 'new@email.com'
```

### JS-9 Currying

```js
function sum(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
console.log(sum(1)(2)(3)); // 6
```

### JS-10. Memoization

Memoization means remembering a function’s answer so you don’t calculate it again for the same input

```js
const cache = {};
function double(n) {
  if (cache[n] !== undefined) return cache[n]; // already saved → reuse
  cache[n] = n * 2; // first time → calculate and save
  return cache[n];
}

console.log(double(5)); // 10 (calculated)
console.log(double(5)); // 10 (from cache)
```

## Part 2 — Scope, Closures & Hoisting

### JS-11 Lexical Scope

a function uses variables from where it is written, not where it is called.

```js
const fruit = "Apple";

function showFruit() {
  console.log(fruit);
}

function test() {
  const fruit = "Mango";
  showFruit();
}

test(); // "Apple"
```

Short description: showFruit was written next to fruit = "Apple", so it prints "Apple". The "Mango" inside test is ignored, because showFruit was only called there, not written there.

### JS-12 Closure

A function "remembers" its outer scope's variables even after the outer function has returned.

```js
function counter() {
  let count = 0;
  return function () {
    // Inner function used outer varibale
    return ++count;
  };
}
const increment = counter();
console.log(increment(), increment(), increment()); // 1 2 3
```

### JS-13 var vs let vs const, and why avoid `var`

```js
console.log(a); // undefined (hoisted, initialized as undefined)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;
```

- `var`: function-scoped, hoisted & auto-initialized to `undefined`, can be redeclared → leaks out of blocks (`if`, `for`) causing bugs.
- `let`/`const`: block-scoped, hoisted but **not** initialized (Temporal Dead Zone), cannot redeclare.
- `const`: same as `let` but cannot be reassigned (object/array _contents_ can still be mutated).

### JS-14 TDZ (Temporal Dead Zone)

```js
{
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 5;
}
```

The variable exists (hoisted) but is inaccessible until its declaration line runs.

### JS-15 var leaking out of a block

```js
let fruit = "apple";
if (true) {
  var fruit = "orange"; // var ignores block scope, overwrites outer 'fruit'
  console.log(fruit); // 'orange'
}
console.log(fruit); // 'orange'
```

### JS-16 Block scoping with `let`

```js
let a = "Hello";
function x() {
  let b = "World";
  console.log(a, b); // Hello World
  if (b === "World") {
    let c = "hello";
    console.log(a, b, c); // Hello World hello
  }
  console.log(a, b, c); // ReferenceError: c is not defined (out of block scope)
}
x();
```

### JS-17 "use strict"

Opts into a stricter parsing/execution mode: disallows implicit globals, silent failures become errors, `this` is `undefined` in plain function calls instead of the global object.

```js
"use strict";
x = 10; // ReferenceError: x is not defined
```

### JS-18 Differet between == and ===

Trick: override `==`/`===` behavior via a getter with an internal counter (works because `===` on an object triggers `valueOf`/`Symbol.toPrimitive`, not on primitives — but with a plain number it never works for `===`; the classic trick uses `==` with `valueOf`):

```js
l5 == "5"; // true   (string "5" becomes number 5)
5 === "5"; // false  (number vs string)

0 == false; // true   (false becomes 0)
0 === false; // false  (number vs boolean)

null == undefined; // true
null === undefined; // false

5 === 5; // true   (same value, same type)
```

## Part 3 — Objects & Prototypes

### JS-19 Prototype

If an object doesn't have a property, it **borrows it from its parent**. That parent is its **prototype**.

```js
let father = { car: "BMW" };
let son = Object.create(father); // son's parent = father

console.log(son.car); // BMW (borrowed from father)
```

### JS-20 Prototype chain

JavaScript keeps looking **up through the parents** until it finds the property or reaches `null`.

```
son  →  father  →  Object.prototype  →  null
```

### JS-21 `prototype` vs `__proto__` (school example)

- **`prototype`** is the **library**. It belongs to the **function** and holds the things to share.
- **`__proto__`** is the **library card**. It belongs to the **object** and points to the library.

```js
function School() {}
School.prototype.book = "Math Book"; // put a book in the library

const student = new School();

console.log(student.book); // Math Book
console.log(student.__proto__ === School.prototype); // true
```

|             | Belongs to | Meaning                        |
| ----------- | ---------- | ------------------------------ |
| `prototype` | Function   | Shared things (the library)    |
| `__proto__` | Object     | Link to `prototype` (the card) |

### JS-22. Shallow vs Deep Copy

Shallow: copies the top level only. Nested objects are shared.
Deep: copies everything. Nothing is shared.

```js
const original = { nested: { b: 2 } };

const shallow = { ...original };
const deep = structuredClone(original); // JSON.parse(JSON.stringify(obj)) we have this option also

shallow.nested.b = 99;
console.log(original.nested.b); // 99 (changed by the shallow copy)

deep.nested.b = 5;
console.log(original.nested.b); // 99 (not changed by the deep copy)
```

### JS-23. Ways to Create an Object

```js
const a = { x: 1 }; // literal
const b = new Object({ x: 1 }); // constructor
const c = Object.create({ x: 1 }); // prototype-based
class Foo {
  constructor(x) {
    this.x = x;
  }
}
const d = new Foo(1); // ES6 class
function factory(x) {
  return { x };
}
const e = factory(1); // factory function
const f = Object.assign({}, { x: 1 }); // merge/copy
```

## Classes, Getters & Setters

### JS-24. What is a class?

A **blueprint** for creating objects with the same shape and behaviour.

**Real-life:** a bank account form. Every customer fills the same form, but each gets their own account.

| Part          | Does                                      | Real-life                   |
| ------------- | ----------------------------------------- | --------------------------- |
| `constructor` | runs when you create an object (`new`)    | filling the form            |
| `#field`      | **private**, only usable inside the class | your PIN, hidden            |
| `get`         | read a value like a property              | checking your balance       |
| `set`         | change a value with a check               | deposit (rejects negatives) |
| `static`      | belongs to the class, not each object     | the bank's name             |

```js
class BankAccount {
  #balance = 0; // private field

  constructor(owner) {
    this.owner = owner;
  }

  get balance() {
    // getter
    return `$${this.#balance}`;
  }

  set balance(amount) {
    // setter
    if (amount < 0) throw new Error("Invalid amount");
    this.#balance = amount;
  }

  static bankName() {
    // static method
    return "JS Bank";
  }
}

const acc = new BankAccount("Ash");
acc.balance = 100; // calls setter
console.log(acc.balance); // '$100' (calls getter)
console.log(BankAccount.bankName()); // 'JS Bank'
```

> **In one line:** a class is a blueprint; `new` makes objects from it.

### JS-25. What are the common class gotchas?

```js
acc.balance = -5; // ❌ Error: Invalid amount (setter blocks it)
acc.#balance; // ❌ SyntaxError: private field, can't access outside
acc.bankName(); // ❌ TypeError: static belongs to the class
BankAccount.bankName(); // ✅ 'JS Bank'
console.log(acc); // BankAccount { owner: 'Ash' } (private field is hidden)
```

- Getters and setters are used **without `()`**: `acc.balance`, not `acc.balance()`.
- `#private` is truly private. `_balance` is only a naming habit; anyone can still change it.

> **In one line:** `get` / `set` = controlled access, `#` = hidden data, `static` = class-level.

---

## OOP Concepts

### JS-26. What is OOP?

Code built around **objects** (data + actions).

**Real-life:** class = cake mould, object = each cake made from it.

```js
class Phone {
  call(n) {
    return `Calling ${n}`;
  }
}
new Phone().call("Mom"); // 'Calling Mom'
```

### JS-27. What is Encapsulation?

Hide data. **Real-life:** ATM PIN, only you know it.

```js
class ATM {
  #pin = 1234;
  check(p) {
    return p === this.#pin;
  }
}
```

### JS-28. What is Abstraction?

Hide complex steps. **Real-life:** press car brake, don't need to know how it works.

```js
class Car {
  #engine() {}
  start() {
    this.#engine();
    return "🚗";
  }
}
```

### JS-29. What is Inheritance?

Child reuses parent. **Real-life:** a child gets their parent's surname.

```js
class Animal {
  eat() {
    return "eating";
  }
}
class Dog extends Animal {}
new Dog().eat(); // 'eating'
```

### JS-30. What is Polymorphism?

Same action, different result. **Real-life:** "speak": dog barks, cat meows.

```js
class Cat extends Animal {
  speak() {
    return "Meow";
  }
}
class Pup extends Animal {
  speak() {
    return "Woof";
  }
}
```

Done by **overriding** (child redefines parent method). **Overloading** doesn't exist in JS.

> **In one line:** hide data, hide complexity, reuse, same name with different behaviour.

---

## Polyfills

### JS-31. What is a polyfill?

Your own version of a built-in feature.

**Real-life:** an adapter for an old car with no USB port.

### JS-32. Write a `call` polyfill

Run now with a chosen `this`. **Real-life:** phone a friend now.

```js
Function.prototype.myCall = function (ctx = {}, ...args) {
  const k = Symbol();
  ctx[k] = this;
  const r = ctx[k](...args);
  delete ctx[k];
  return r;
};
```

### JS-33. Write a `bind` polyfill

Run later. **Real-life:** save a friend's number to call later.

```js
Function.prototype.myBind = function (ctx, ...bound) {
  return (...args) => this.apply(ctx, [...bound, ...args]);
};
```

### JS-34. Write a `map` polyfill

Change each item. **Real-life:** paint every wall a new colour.

```js
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) out.push(cb(this[i], i, this));
  return out;
};
```

### JS-35. Write a `forEach` polyfill

Visit each item. **Real-life:** a teacher calling every student's name.

```js
Array.prototype.myForEach = function (cb) {
  for (let i = 0; i < this.length; i++) cb(this[i], i, this);
};
```

### JS-36. Write a `reduce` polyfill

Combine into one. **Real-life:** adding up a shopping bill.

```js
Array.prototype.myReduce = function (cb, init) {
  let acc = init,
    i = 0;
  if (arguments.length < 2) {
    acc = this[0];
    i = 1;
  }
  for (; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};
```

### JS-37. Write a `flat` polyfill

Unnest arrays. **Real-life:** opening boxes inside boxes.

```js
Array.prototype.myFlat = function (d = 1) {
  return d > 0
    ? this.reduce(
        (a, v) => a.concat(Array.isArray(v) ? v.myFlat(d - 1) : v),
        [],
      )
    : this.slice();
};
```

### JS-38. Write a `deepEqual` function

Compare content. **Real-life:** two lunch boxes with the same food inside.

```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ka = Object.keys(a);
  return (
    ka.length === Object.keys(b).length &&
    ka.every((k) => deepEqual(a[k], b[k]))
  );
}
```

## Async JavaScript

### JS-39. What is Sync vs Async?

- **Sync:** one task at a time; each waits for the previous one.
- **Async:** start a slow task, keep doing other work, handle the result later.

**Real-life:** sync = waiting at the washing machine until it finishes. Async = start the machine, cook dinner, come back when it beeps.

```js
console.log("Start washing");
setTimeout(() => console.log("Washing done ✅"), 2000);
console.log("Cooking dinner");
```

**Output:**

```
Start washing
Cooking dinner
Washing done ✅
```

### JS-40. What are callbacks and callback hell?

**Callback:** a function passed to another function, to run later. **Real-life:** "call me when the pizza is ready."

**Callback hell:** callbacks inside callbacks inside callbacks. **Real-life:** "call me when you reach the shop, then call me when you buy milk, then call me when you're home…"

```js
getUser(1, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments); // pyramid of doom 😵
    });
  });
});
```

Hard to read and handle errors. **Fix:** Promises or async/await.

### JS-41. What is a Promise and chaining?

A Promise = a value that will come **later** (success or failure). **Real-life:** a food order receipt.

**Chaining** = steps one after another, each using the previous result. **Real-life:** order food → it arrives → eat.

```js
fetchUser()
  .then((user) => fetchPosts(user.id))
  .then((posts) => console.log(posts))
  .catch((err) => console.error(err)); // one catch for all steps
```

### JS-42. What are `all`, `race`, `any`, `allSettled`?

**Real-life:** inviting friends to a party.

```js
const p1 = new Promise((res) => setTimeout(() => res("one"), 100));
const p2 = new Promise((res) => setTimeout(() => res("two"), 200));
const p3 = Promise.reject("fail");

Promise.all([p1, p2]).then(console.log); // ['one', 'two']
Promise.race([p1, p2]).then(console.log); // 'one'
Promise.any([p3, p1]).then(console.log); // 'one'
Promise.allSettled([p1, p3]).then(console.log);
// [{ status: 'fulfilled', value: 'one' }, { status: 'rejected', reason: 'fail' }]
```

| Method       | Real-life                       | Fails when            |
| ------------ | ------------------------------- | --------------------- |
| `all`        | everyone must come              | any one fails         |
| `race`       | first reply decides (yes or no) | first to finish fails |
| `any`        | first friend who says yes       | all fail              |
| `allSettled` | wait for every reply            | never                 |

### JS-43. What is async/await with try/catch?

A cleaner way to write Promises, like normal step-by-step code. **Real-life:** a to-do list: get user, then get posts. If something goes wrong, handle it.

```js
async function loadData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (err) {
    console.error("Failed:", err); // runs on error
  } finally {
    console.log("Done"); // always runs
  }
}
```

### JS-44. What is the Event Loop? Microtask vs Macrotask?

The event loop decides **what runs next**.

**Real-life:** a doctor's clinic.

1. **Call stack** = the patient being seen now (sync code).
2. **Microtasks** = emergency patients. All of them go first (Promise `.then`, `await`, `queueMicrotask`).
3. **Macrotasks** = normal appointments, one at a time (`setTimeout`, `setInterval`, I/O).

**Order:** sync → **all** microtasks → **one** macrotask → all microtasks again → …

### JS-45. What's the output? (Event loop)

**Example 1**

```js
setTimeout(() => console.log(1), 0);
console.log(2);
new Promise((res) => res()).then(() => console.log(3));
console.log(4);
```

**Output:** `2, 4, 3, 1`

Sync (2, 4) → microtask (3) → macrotask (1).

**Example 2**

```js
setTimeout(() => console.log(1), 0);
console.log(2);
new Promise((res) => {
  setTimeout(() => res(), 0);
}).then(() => console.log(3));
console.log(4);
```

**Output:** `2, 4, 1, 3`

The promise resolves only **inside its own setTimeout**, which runs after the first one. So 1 prints before 3.

### JS-46. `process.nextTick()` vs `setImmediate()` (Node.js)

- `nextTick` = runs **right after** the current code, before Promises. Highest priority.
- `setImmediate` = runs in a **later** turn of the event loop (check phase).

**Real-life:** nextTick = "one more thing before you leave." setImmediate = "do it on your next round."

```js
console.log("start");
setImmediate(() => console.log("setImmediate"));
process.nextTick(() => console.log("nextTick"));
console.log("end");
```

**Output:** `start, end, nextTick, setImmediate`

### JS-47. How do you cancel (abort) a fetch request?

Use `AbortController`. **Real-life:** cancelling a food order before it arrives.

```js
const controller = new AbortController();

fetch("/api/data", { signal: controller.signal })
  .then((res) => res.json())
  .then(console.log)
  .catch((err) => {
    if (err.name === "AbortError") console.log("Fetch aborted");
  });

setTimeout(() => controller.abort(), 3000); // cancel after 3s
```

Use it for timeouts, or when a user leaves the page before the data loads.

|           | fetch               | axios     | ajax (XHR)   |
| --------- | ------------------- | --------- | ------------ |
| Type      | built-in            | library   | old built-in |
| JSON      | `res.json()` needed | automatic | manual parse |
| 404 / 500 | doesn't reject      | rejects   | manual check |

### JS-48. Why does `setTimeout` in a `var` loop print wrong values?

**Real-life:** 4 people share **one** notepad (`var`). By the time they read it, it says "4". With `let`, each person gets **their own** notepad.

```js
const arr = [10, 12, 15, 21];

for (var i = 0; i < arr.length; i++) {
  setTimeout(() => console.log(i, arr[i]), 100);
}
// 4 undefined (printed 4 times)
```

`var` = one shared `i`. When the timers run, the loop has finished and `i` is `4`.

**Fix 1: use `let`** (new `i` for each loop)

```js
for (let i = 0; i < arr.length; i++) {
  setTimeout(() => console.log(i, arr[i]), 100);
}
// 0 10, 1 12, 2 15, 3 21
```

**Fix 2: IIFE** (captures `i` each time)

```js
for (var i = 0; i < arr.length; i++) {
  ((j) => setTimeout(() => console.log(j, arr[j]), 100))(i);
}
```

### JS-49. What is Debounce?

Run the function only **after the user stops** for a while. **Real-life:** a lift door waits until people **stop** coming in, then closes.

**Use:** search box (search only after typing stops).

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer); // reset the wait
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((text) => console.log("Search:", text), 500);
search("a");
search("ap");
search("app");
// after 500ms → Search: app (only once)
```

### JS-50. What is Throttle?

Run the function **at most once** every X ms. **Real-life:** a water tap that gives one cup every 5 seconds, no matter how many times you press.

**Use:** scroll and resize events.

```js
function throttle(fn, limit) {
  let waiting = false;
  return (...args) => {
    if (waiting) return; // ignore calls during wait
    fn(...args);
    waiting = true;
    setTimeout(() => (waiting = false), limit);
  };
}

const onScroll = throttle(() => console.log("Scrolled"), 1000);
onScroll();
onScroll();
onScroll();
// Scrolled (only once in 1 second)
```

|           | Debounce             | Throttle        |
| --------- | -------------------- | --------------- |
| Runs      | after calls **stop** | once every X ms |
| Real-life | lift door            | water tap       |
| Use       | search box           | scroll, resize  |

## DOM & Events

### JS-51. What is Event Bubbling?

A click on a child **goes up** to its parents: child → parent → document. This is the default.

**Real-life:** a bubble in water rises from the bottom to the top.

```js
parent.addEventListener("click", () => console.log("parent"));
child.addEventListener("click", () => console.log("child"));
```

**Click the button → Output:**

```
child
parent
```

### JS-52. What is Event Capturing?

The opposite: the event **goes down** from the top first. Turn it on with `{ capture: true }`.

**Real-life:** a letter goes country → city → street → your house.

```js
parent.addEventListener("click", () => console.log("parent (capture)"), {
  capture: true,
});
child.addEventListener("click", () => console.log("child"));
```

**Click the button → Output:**

```
parent (capture)
child
```

### JS-53. What is `stopPropagation()`?

Stops the event from **going further** up (or down).

**Real-life:** a complaint solved at the front desk, so it never reaches the manager.

```js
child.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("child");
});
parent.addEventListener("click", () => console.log("parent"));
```

**Click the button → Output:** `child` (parent never runs)

### JS-54. What is Event Delegation?

Put **one** listener on the parent to handle clicks on **all** children, even ones added later. It works because of bubbling.

**Real-life:** one teacher handles all students' questions, instead of one teacher per student.

```html
<ul id="list">
  <li>Apple</li>
  <li>Mango</li>
</ul>
```

```js
list.addEventListener("click", (e) => {
  if (e.target.matches("li")) console.log("Clicked:", e.target.textContent);
});

list.innerHTML += "<li>Banana</li>"; // new item works too, no new listener
```

**Click "Banana" → Output:** `Clicked: Banana`

**Why use it:** fewer listeners = less memory, and new items work automatically.

### JS-55. `preventDefault` vs `return false` vs `javascript:void(0)`?

`preventDefault()` stops the browser's **default action** (link opening, form submitting). The event still bubbles.

**Real-life:** you press the doorbell, but someone switched off the bell. You still pressed it; it just didn't ring.

```js
document.querySelector("a").addEventListener("click", (e) => {
  e.preventDefault(); // link won't open
  console.log("Link clicked, but not opened");
});
```

| Way                                    | Stops default action?       | Stops bubbling? |
| -------------------------------------- | --------------------------- | --------------- |
| `e.preventDefault()`                   | ✅                          | ❌              |
| `e.stopPropagation()`                  | ❌                          | ✅              |
| `return false` in **jQuery**           | ✅                          | ✅              |
| `return false` in **inline** `onclick` | ✅                          | ❌              |
| `return false` in `addEventListener`   | ❌ (does nothing)           | ❌              |
| `href="javascript:void(0)"`            | link does nothing (old way) | —               |

> Use `preventDefault()` today; avoid `javascript:void(0)`.

### JS-56. `addEventListener` vs `onclick`?

**Real-life:** `onclick` = one parking spot; a new car pushes the old one out. `addEventListener` = a car park; many cars fit.

```js
btn.onclick = () => console.log("first");
btn.onclick = () => console.log("second"); // replaces first
// Click → second

btn.addEventListener("click", () => console.log("A"));
btn.addEventListener("click", () => console.log("B"));
// Click → A, B (both run)
```

|                | `onclick`            | `addEventListener`     |
| -------------- | -------------------- | ---------------------- |
| Many handlers  | ❌ only the last one | ✅ all run             |
| Capture option | ❌                   | ✅ `{ capture: true }` |
| Remove         | `btn.onclick = null` | `removeEventListener`  |

### JS-57. How do you select DOM elements?

**Real-life:** finding people in a school: by roll number (`id`), by class, or by description ("first student wearing red").

```js
document.getElementById("child"); // one element by id
document.getElementsByClassName("item"); // all by class (live)
document.querySelector(".item"); // first match (CSS selector)
document.querySelectorAll(".item"); // all matches (static)
```

**Live vs static:**

- **Live** (`getElementsByClassName`) = updates by itself when the page changes. Like a live cricket score.
- **Static** (`querySelectorAll`) = a snapshot from that moment. Like a photo of the scoreboard.

```js
const live = document.getElementsByClassName("item");
const snap = document.querySelectorAll(".item");
// add a new .item to the page...
live.length; // +1 (updated)
snap.length; // same as before
```

### JS-58. `innerHTML` vs `textContent`, and `cloneNode`?

**Real-life:** `innerHTML` = a printer that follows formatting commands. `textContent` = a printer that prints exactly what you type.

```js
el.innerHTML = "<b>Hi</b>"; // shows bold: Hi
el.textContent = "<b>Hi</b>"; // shows the text: <b>Hi</b>
```

⚠️ Never put **user input** into `innerHTML`. Someone can inject a script (XSS attack). Use `textContent` for user text.

**`cloneNode`:** copy an element. **Real-life:** photocopying a page.

```js
const copy1 = el.cloneNode(true); // deep: copies children too
const copy2 = el.cloneNode(false); // shallow: only the element itself
```

Event listeners added with `addEventListener` are **not** copied.

### JS-59. localStorage vs sessionStorage vs Cookies?

**Real-life:**

- **localStorage** = a locker at home. Stays until you empty it.
- **sessionStorage** = a hotel locker. Emptied when you check out (close the tab).
- **Cookies** = an ID card you show at the gate **every time** you enter (sent to the server on every request).

|                 | localStorage         | sessionStorage   | Cookies          |
| --------------- | -------------------- | ---------------- | ---------------- |
| Size            | ~5MB                 | ~5MB             | ~4KB             |
| Lasts           | until cleared        | until tab closes | until expiry     |
| Sent to server? | ❌                   | ❌               | ✅ every request |
| Shared          | all tabs (same site) | one tab only     | per domain/path  |

```js
localStorage.setItem("theme", "dark");
localStorage.getItem("theme"); // 'dark'
localStorage.removeItem("theme");

sessionStorage.setItem("step", "2"); // gone when the tab closes

document.cookie = "user=ash; max-age=3600; path=/"; // expires in 1 hour
```

- Storage saves **strings only**. For objects use `JSON.stringify` / `JSON.parse`.
- Keep login tokens in **HttpOnly** cookies (JavaScript can't read them), not in localStorage.

### JS-60. JWT vs Session ID?

**Real-life:**

- **JWT** = a movie ticket. All the info is printed on it, so the gate just checks it's real. But you can't cancel it once it's given.
- **Session ID** = a coat-check token. Just a number; the counter looks up your coat in their records. Easy to cancel.

```
JWT: header.payload.signature
eyJhbGciOi... . eyJ1c2VySWQiOjF9 . SflKxwRJSM...
```

|                       | JWT                 | Session ID            |
| --------------------- | ------------------- | --------------------- |
| Data stored           | inside the token    | on the server         |
| Server memory         | none (stateless)    | needed (DB / Redis)   |
| Logout / revoke early | hard                | easy (delete session) |
| Good for              | APIs, microservices | classic websites      |

The JWT payload is only **encoded**, not encrypted. Anyone can read it, so never put passwords in it.

### JS-61. Authentication vs Authorization?

- **Authentication** = **who are you?** (login, password, OTP)
- **Authorization** = **what can you do?** (roles, permissions). Always checked **after** authentication.

**Real-life:** at an office, showing your ID card at the gate = authentication. Your card opening only **your floor** = authorization.

|            | Authentication     | Authorization    |
| ---------- | ------------------ | ---------------- |
| Question   | Who are you?       | What can you do? |
| Fails with | `401 Unauthorized` | `403 Forbidden`  |

### JS-62. What is CORS?

Browsers **block** requests to a different origin (domain, port or protocol) unless that server allows it.

**Real-life:** a building guard lets in a visitor only if the person they're visiting has put them on the guest list.

```
Frontend: https://myapp.com  →  API: https://api.other.com  ❌ blocked by default
```

The **server** must send headers allowing it:

```
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST
```

```js
// Node.js server example
res.setHeader("Access-Control-Allow-Origin", "https://myapp.com");
```

- CORS is fixed on the **server**, not the frontend.
- For some requests, the browser first sends an **OPTIONS** "preflight" request to ask permission.

### JS-63. What are the basic security rules (XSS, eval)?

**XSS (Cross-Site Scripting):** an attacker sneaks a script into your page through user input.

**Real-life:** someone writes "give me all the money" in the visitor book, and the guard reads it out as an order.

```js
const userInput = "<img src=x onerror=\"alert('hacked')\">";

el.innerHTML = userInput; // ❌ BAD: the script runs
el.textContent = userInput; // ✅ GOOD: shown as plain text
```

**`eval()`:** runs any string as code. **Real-life:** signing a blank cheque.

```js
eval(userInput); // ❌ BAD: runs whatever the user typed
JSON.parse(text); // ✅ use this to read data instead
```

**Quick rules:**

- Never trust user input; use `textContent`, not `innerHTML`.
- Never use `eval()` or `new Function()` with user input.
- Store tokens in **HttpOnly + Secure** cookies.
- Use HTTPS everywhere.

## Types, Coercion & Comparisons

### JS-64. `null` vs `undefined`?

- `undefined` = declared but **no value given yet** (JS sets it).
- `null` = **empty on purpose** (you set it).

**Real-life:** `undefined` = an empty chair nobody has been assigned to. `null` = a chair with a "Reserved: nobody" sign.

```js
let x; // undefined
let y = null; // null

x == y; // true  (both "empty")
x === y; // false (different types)
typeof x; // 'undefined'
typeof y; // 'object' (old JS bug)
```

### JS-65. `==` vs `===`?

- `==` = compares **value only**; converts types first.
- `===` = compares **value + type**; no conversion.

**Real-life:** `==` = "both are 1 kg?" (1 kg rice == 1 kg sugar ✅). `===` = "same weight **and** same thing?" ❌

```js
1 == "1"; // true
1 === "1"; // false
0 == false; // true
0 === false; // false
[] == []; // false (two different arrays)
({}) == {}; // false (two different objects)
```

Objects and arrays compare **references** (same box?), not content.

> Always use `===`.

### JS-66. `isNaN` vs `Number.isNaN`?

- `isNaN` **converts** first, then checks.
- `Number.isNaN` checks **only** the real `NaN` value. Stricter.

**Real-life:** `isNaN` = "is this not a number after I try to convert it?" `Number.isNaN` = "is this exactly the NaN value?"

```js
isNaN("Hello"); // true  ("Hello" → NaN)
Number.isNaN("Hello"); // false (it's a string, not NaN)
Number.isNaN(NaN); // true
```

### JS-67. What are the data types?

**Real-life:** primitive = writing a number on paper and giving a **copy**. Reference = giving someone your **house key**: you both open the same house.

| Primitive (by value)                                                   | Reference (by reference)      |
| ---------------------------------------------------------------------- | ----------------------------- |
| `number`, `bigint`, `string`, `boolean`, `null`, `undefined`, `symbol` | `object`, `array`, `function` |
| immutable                                                              | mutable                       |
| copy = new value                                                       | copy = same object            |

```js
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 (copy)

let o1 = { n: 5 };
let o2 = o1;
o2.n = 10;
console.log(o1.n); // 10 (same object)
```

### JS-68. What are common coercion gotchas?

**Real-life:** JS is a shopkeeper who "guesses" what you mean. Sometimes the guess is wrong.

```js
0.1 + 0.2; // 0.30000000000000004
0.1 + 0.2 === 0.3; // false (tiny float error)

2 + "2" - "2"; // 20  ("22" - "2")
typeof typeof 1; // 'string' (typeof 'number')
3 > 2 > 1; // false (true > 1 → 1 > 1)

let n = 10;
n = n + "1"; // '101' (+ with a string = join)
n = n - "1"; // 100   (- always does maths)
```

- `+` with a string → **joins** text.
- `-`, `*`, `/` → always **maths**.
- Compare decimals safely: `Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON` → `true`

### JS-69. Is JavaScript compiled or interpreted?

**Both (JIT = Just-In-Time).** The engine (like V8) first **interprets** the code, then **compiles** frequently used parts into fast machine code while running.

**Real-life:** a translator who translates live, but writes down phrases you repeat a lot so they can say them faster next time.

---

## Performance & Web Metrics

### JS-70. What is CLS (Cumulative Layout Shift)?

A Core Web Vital measuring how much the page **jumps around** while loading.

**Real-life:** you go to tap "Cancel", an ad loads above it, the button moves, and you tap "Buy" instead.

**Common causes:** images without size, ads, fonts swapping in late.

```html
<img src="photo.jpg" width="400" height="300" />
<!-- reserve space -->
```

**Fix:** set image `width`/`height`, reserve space for ads, use `font-display` carefully.

### JS-71. Why does the browser freeze during a long loop?

JS is **single-threaded**. A long loop blocks everything: clicks, scrolling, painting.

**Real-life:** one cashier stuck on a customer with 1000 items; the whole queue waits.

```js
for (let i = 0; i < 1e10; i++) {} // ❌ page freezes
```

**Fixes:**

- **Chunks:** do small parts with `setTimeout` / `requestIdleCallback`. (Cashier serves others between baskets.)
- **Web Worker:** run it on a separate thread. (Open a second counter.)
- **Pagination / virtualization:** process or show less data at once.

### JS-72. What is a Service Worker?

A background script between your page and the network. Enables **offline mode, caching and push notifications** (PWA).

**Real-life:** a personal assistant who keeps copies of your files, so you can work even when the office internet is down.

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

Runs separately from the page, has no DOM access, and needs HTTPS.

### JS-73. SSR vs CSR?

**Real-life:** SSR = a restaurant serves a **ready meal**. CSR = you get **ingredients** and cook at your table.

|                  | CSR (Client-Side) | SSR (Server-Side)    |
| ---------------- | ----------------- | -------------------- |
| Server sends     | empty HTML + JS   | full HTML            |
| First load       | slower            | faster               |
| SEO              | weaker            | better               |
| Later navigation | fast (SPA feel)   | new page from server |
| Server load      | low               | higher               |
| Example          | React (Vite) app  | Next.js              |

---

## Modules, HTTP & APIs

### JS-74. How do ES modules work (export / import)?

Split code into files and share it.

**Real-life:** a kitchen with labelled jars. **Named export** = many labelled jars. **Default export** = the one main jar.

```js
// math.js
export const add = (a, b) => a + b; // named
export default function multiply(a, b) {
  // default (only one)
  return a * b;
}

// main.js
import multiply, { add } from "./math.js";
add(2, 3); // 5
multiply(2, 3); // 6
```

|                   | Named                  | Default  |
| ----------------- | ---------------------- | -------- |
| How many per file | many                   | one      |
| Import            | `{ add }` (exact name) | any name |

### JS-75. Destructuring, Spread & Rest (quick recap)?

**Real-life:** destructuring = unpacking a bag into named pockets. Spread = pouring two bags into one. Rest = collecting leftovers into one bag.

```js
const { name, age } = { name: "Alice", age: 30 }; // object
const [first, , third] = [1, 2, 3]; // skip 2nd → 1, 3

const merged = { ...obj1, ...obj2 }; // spread (later wins)

function sum(...nums) {
  // rest
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6
```

### JS-76. HTTP methods and status codes?

**Real-life:** a library. GET = read a book, POST = add a book, PUT = replace it, PATCH = fix one page, DELETE = remove it.

| Method | Use                    |
| ------ | ---------------------- |
| GET    | read data              |
| POST   | create data            |
| PUT    | replace whole resource |
| PATCH  | update part of it      |
| DELETE | remove it              |

| Code | Meaning         | Examples                                                        |
| ---- | --------------- | --------------------------------------------------------------- |
| 1xx  | info            | 101 Switching Protocols                                         |
| 2xx  | success ✅      | 200 OK, 201 Created, 204 No Content                             |
| 3xx  | redirect ↪️     | 301 Moved, 304 Not Modified                                     |
| 4xx  | client error ❌ | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx  | server error 💥 | 500 Internal Error, 503 Unavailable                             |

### JS-77. GraphQL vs REST?

**Real-life:** REST = a **fixed thali**: you get every item, even ones you don't want, and need another plate for more. GraphQL = **à la carte**: order exactly what you want, in one order.

|               | REST                      | GraphQL                     |
| ------------- | ------------------------- | --------------------------- |
| Endpoints     | many (`/users`, `/posts`) | one (`/graphql`)            |
| Data returned | fixed by server           | exactly what client asks    |
| Problem       | over- / under-fetching    | more complex setup, caching |

```graphql
query {
  user(id: 1) {
    name
  } # only the name, nothing extra
}
```

### JS-78. `slice` vs `substring`?

Both cut part of a string. **Real-life:** cutting a piece of ribbon; `slice` can also measure from the **end**.

```js
"hello".slice(1, 3); // 'el'
"hello".substring(1, 3); // 'el'

"hello".slice(-3); // 'llo'   (counts from end)
"hello".substring(-3); // 'hello' (negative → 0)

"hello".slice(3, 1); // ''      (no swap)
"hello".substring(3, 1); // 'el'    (swaps to 1, 3)
```

|                | `slice`         | `substring`  |
| -------------- | --------------- | ------------ |
| Negative index | counts from end | treated as 0 |
| start > end    | empty string    | swaps them   |

### JS-79. `JSON.parse` vs `response.json()`?

- `JSON.parse` = turns a JSON **string** into an object. **Sync**.
- `res.json()` = reads a fetch **response body** and parses it. **Async**, returns a Promise.

**Real-life:** `JSON.parse` = reading a letter already in your hand. `res.json()` = waiting for the parcel to arrive, then opening and reading it.

```js
JSON.parse('{"a":1}'); // { a: 1 }

const res = await fetch("/api/data");
const data = await res.json(); // needs await
```
