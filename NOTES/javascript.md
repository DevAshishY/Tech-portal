# JavaScript Interview Questions

---

## Theory Questions

---

### 1. call, apply, bind

call is a function that helps change the context of the invoking function.
apply is similar to the call function. Difference is that in apply you can pass an array as an argument list.
bind is a function that helps create another function that you can execute later with the new context of this that is provided.

https://codesandbox.io/p/sandbox/call-apply-bind-mj45zd

---

### 2. Event Flow (Bubbling, Capturing) & Propagation

**Event Bubbling** — when an event is triggered on a DOM element, it first fires on that element, then on its parent, and so on, propagating up the DOM tree.

**Event Capturing** — opposite of event bubbling, where the event is captured at the topmost parent element and then propagates down to the target element.

**stopPropagation** — stops the event from propagating further.

https://codesandbox.io/p/sandbox/bubbling-capturning-stop-64wl3y

---

### 3. Event Delegation

Event delegation is a technique where you attach an event listener to a parent element to handle events for its child elements.

https://codesandbox.io/p/sandbox/event-delegation-2jnn98

---

### 4. event.preventDefault, return false, javascript:void(0)

event.preventDefault() method is used to prevent the default behavior of an event and the link click will be prevented.

https://github.com/DevAshishY/coding/blob/main/javascript/preventDefault_returnFalse/demo.html

---

### 5. Shallow & Deep Copy

**Shallow copy** creates a new object or array, but only the top-level values are copied by reference. If any copied values are themselves objects or arrays, they will still be referenced to the original objects or arrays.

**Deep copy** creates a completely new object or array, where all the nested values are also copied by value. All the properties of the original object or array are duplicated, and no references are retained.

https://github.com/DevAshishY/coding/blob/main/javascript/shallow_deep/demo.html
https://codesandbox.io/p/sandbox/shallow-deep-copy-4krx2p

---

### 6. Lexical Scope

Ability for a function scope to access variables from the parent scope. We call the child function to be lexically bound.

---

### 7. Closure

Closures allow functions to remember the variables from the scope where they were created, even if the function is executed in a different scope.

https://codesandbox.io/p/sandbox/lexical-closure-j4fgj2

---

### 8. Currying

Currying is a functional programming technique that involves breaking down a function that takes multiple arguments into a series of functions that take one argument each. This creates a chain of functions, where each function returns another function until the final result is achieved.

- Helps you avoid passing the same variable again and again.
- Helps to create a higher-order function.

https://codesandbox.io/p/sandbox/curring-pzm7vg

---

### 9. Normal Function vs Arrow (Lambda) Function

`this` keyword refers to the current context of the object.

**Normal function** — the normal function gives the arguments. `this` refers to the calling object.

**Arrow function** — `this` is not present itself. It takes from one level up or surrounding scope and we cannot change it. Arrow function does not give the arguments object.

https://github.com/DevAshishY/coding/blob/main/javascript/arrow_function/demo.html
https://codesandbox.io/p/sandbox/arrow-function-x6dc5d

---

### 10. Synchronous vs Asynchronous

**Synchronous** — code executes line by line.
**Asynchronous** — code runs in the background without blocking the execution of other code.

---

### 11. Callback & Callback Hell

https://codesandbox.io/p/sandbox/callback-callbackhell-qmtt4r

---

### 12. Promises & Chaining (all, race, any)

https://github.com/DevAshishY/coding/blob/main/javascript/promise/demo.html

---

### 13. async/await and try-catch

https://github.com/DevAshishY/coding/blob/main/javascript/asyc_try_catch/demo.html

---

### 14. Difference between process.nextTick() and setImmediate()

https://github.com/DevAshishY/coding/blob/main/javascript/setimmediate-timout-processNext/demo.js

---

### 15. HTTP Methods (CRUD)

Answer

---

### 16. fetch, axios, ajax

**fetch** — API is used to make network requests, typically to fetch resources from a server. It returns a promise that resolves to the Response object representing the response to the request.

**axios** — Promise-based HTTP client with interceptors, auto JSON parsing, and request cancellation.

**Ajax** — without reloading the page we can communicate with the server.

---

### 17. How to Handle Abort in Fetch

Answer

---

### 18. Memoization

Memoization is a technique used in programming to optimize the execution time of functions by caching their results. It involves storing the results of expensive function calls and reusing those results when the same inputs occur again.

---

### 19. Debouncing & Throttling

Answer

---

### 20. Prototype Inheritance

When we create any object in JavaScript, we find a special property inside the created object called `prototype`. Prototype is an object that gives some methods and properties. We can enable all the other objects to inherit these methods and properties. We can set proto using dunder proto (`__proto__`).

https://codesandbox.io/p/sandbox/prototypes-pfy2nz

---

### 21. Prototype Chaining

```js
// use case
let obj1 = { key1: 'value1', key2: 'value2' }
let obj2 = { key3: 'value3' }
console.log(obj2.key3);
console.log(obj2.key1); // undefined

// solve
let obj1 = { key1: 'value1', key2: 'value2' }
let obj2 = Object.create(obj1)
obj2.key3 = 'value3'
console.log(obj2);
console.log(obj2.key1);      // 'value1'
console.log(obj2.__proto__);  // obj1
```

---

### 22. Difference between `__proto__` vs `prototype`

`[[Prototype]]` and `__proto__` are the same. But `prototype` is different.
Only functions create a `prototype` property. Objects can see the prototype chain via `__proto__`.

---

### 23. Local Storage, Session Storage & Cookies

**Local Storage** — `localStorage.setItem(key,value)`, `getItem(key)`, `removeItem(key)`, `clear()`. Capacity: 5MB. Not session-based, must be deleted via JS or manually. Client-only.

**Session Storage** — `sessionStorage.setItem(key,value)`, `getItem(key)`, `removeItem(key)`, `clear()`. Capacity: 5MB. Session-based, works per window or tab.

**Cookies** — Capacity: 4KB. Expire based on settings, work per tab and window. Both clients and servers can read and write cookies.

https://codesandbox.io/p/sandbox/localstorage-in-js-vzkxgg

---

### 24. let, var, const & Hoisting

Answer

---

### 25. TDZ (Temporal Dead Zone)

TDZ is a specific period in the execution of JS code where variables declared with `let` and `const` exist but cannot be accessed or assigned any value. During this phase, accessing or using the variable will result in a `ReferenceError`.

---

### 26. "use strict"

Treat this code as a newer version.

```js
"use strict";
x = 10;
console.log(x); // ReferenceError: x is not defined
```

---

### 27. Why Not Use `var`

Prefer not to use `var` because of issues in block scope and functional scope.

---

### 28. defer and async

**defer** — tells the browser to download the script while parsing the HTML but execute it only after the HTML parsing is complete.

**async** — tells the browser to download the script in the background without blocking HTML parsing, and it will execute the script as soon as it's downloaded.

---

### 29. Issue When JS File is Called at Bottom of HTML

It is synchronous in nature — all HTML is parsed first, then the JS file is loaded and executed.

---

### 30. How JS Works & Event Loop

**Event loop** is a bridge between the call stack and the callback queue (task queue). It monitors the call stack until it finishes executing functions present inside it. If the call stack gets empty, it transfers the next function waiting in the callback queue into the call stack.

---

### 31. Task Queue in JavaScript

**Microtask Queue** — Promise callbacks, async functions, `queueMicrotask()`.

**Macrotask Queue** — `setTimeout()`, `setInterval()`, `setImmediate()`.

---

### 32. setTimeout vs setInterval

**setTimeout** — code runs only one time.
**setInterval** — code runs at a specific time gap repeatedly.

---

### 33. SSR & CSR

Answer

---

### 34. Classes

Answer

---

### 35. Setter & Getter

Answer

---

### 36. OOP Concepts

- **Polymorphism** — one name, different forms.
- **Method Overriding** — child class has the same method as parent class.
- **Method Overloading** — multiple methods with the same name in the same class.
- **Polyfills** — map, forEach, call, apply, bind, arrayFlat, deep-copy, reduce, compare two objects.

---

### 37. JWT & Session ID

**JWT** — JSON Web Token is a compact, URL-safe means of representing claims to be transferred between two parties. It's digitally signed, making it secure. JWTs are self-contained — they contain all the necessary information about the user and do not need to be stored in a database.

**Structure:** Header · Payload · Signature (separated by dots)
- **Header** — metadata about the type of token and signing algorithm.
- **Payload** — claims about the entity (user) and additional data.
- **Signature** — ensures the integrity of the token.

**Session ID** — a unique identifier assigned to a user's session. Stored in a cookie or URL, requires server-side storage and management.

---

### 38. Authentication & Authorization

**Authentication** — the process of verifying the identity of a user or system. Common methods: passwords, biometrics, MFA.

**Authorization** — the process of determining whether an authenticated user has the necessary permissions to access specific resources or perform certain actions. Based on the user's role or assigned permissions.

---

### 39. CORS (Cross-Origin Resource Sharing)

Browsers have built-in security measures to prevent a website in one origin from making requests directly to another origin without permission. To fix CORS errors, configure your server to include specific headers in its responses allowing cross-origin requests.

---

### 40. JavaScript — Compiled or Interpreted?

As per MDN documentation: "JavaScript (JS) is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions." It is interpreted.

---

### 41. HTTP Status Codes

Answer

---

### 42. Enum in JS

Used to define a set of constant values.

---

### 43. Array Methods

- `reduce`
- `forEach`
- `map`

---

### 44. Modular JavaScript

Answer

---

### 45. Polyfills

bind

---

### 46. Browser Not Responding During Long For Loop

Answer

---

### 47. Service Worker

Answer

---

### 48. Different Ways to Create an Object in JavaScript

- Object Literals
- Constructor Function
- `Object.create()`
- Class Syntax (ES6)
- Factory Functions
- `Object.setPrototypeOf()`
- `Object.assign()`

---

### 49. ES6 Features

- Destructuring
- Arrow functions

---

### 50. Functions in JavaScript

JavaScript function is the combo of object & function. We can add a property to the function. Functions provide useful properties like `call`, `apply`, `bind`.

When a function is created, it gives a free space (like object) called `prototype`. Only functions provide a `prototype` property — objects do not.

---

### 51. Pure, Impure, Function Expression & Declaration

**Pure function** — does not modify the state of the application. Only depends on its input parameters.

**Impure function** — can modify the state of the application. Can be dependent on other parts of the code.

**Function expression** — assigned to a variable.

**Function declaration** — defined with the `function` keyword.

---

### 52. IIFE (Immediately Invoked Function Expression)

Encapsulating code and variables within a private scope. Prevents pollution of the global JS scope.

---

### 53. GraphQL vs REST

Both GraphQL and REST are used to build Web APIs but there are a lot of differences between the two technologies.

---

### 54. Difference between `null` and `undefined`

- `null` is an explicitly assigned value that represents the absence of any value.
- `undefined` is a variable that has been declared but has not been assigned a value.

---

### 55. Web Components

Web Components are a set of web platform APIs that allow you to create reusable custom elements with their own encapsulated HTML, CSS, and JavaScript.

---

### 56. Set in JavaScript

Answer

---

### 57. isNaN

`isNaN()` method returns true if a value is NaN. It converts the value to a number before testing it.

```js
console.log(isNaN(123));        // false
console.log(isNaN(0));          // false
console.log(isNaN('123'));      // false
console.log(isNaN('Hello'));    // true
console.log(isNaN('2005/12/12')); // true
```

---

### 58. Difference between `==` and `===`

```js
0 == false        // true
0 === false       // false
1 == "1"          // true
1 === "1"         // false
null == undefined // true
null === undefined // false
'0' == false      // true
'0' === false     // false
[] == [] or [] === [] // false
{} == {} or {} === {} // false
```

---

### 59. addEventListener vs onclick

**addEventListener** — can add multiple events to a particular element. Can take a third argument to control event propagation. Can only be added within `<script>` elements or external JS files.

**onclick** — can add only a single event to an element. Gets overwritten. Event propagation cannot be controlled. Can be added as an HTML attribute.

---

### 60. Error Types in JS

Syntax Error, Reference Error, Type Error, Evaluation Error, RangeError, URI Error, Internal Error.

---

### 61. Data Types

- `number` — 2 to power 53
- `bigint`
- `string`
- `boolean` — true/false
- `null` — standalone value
- `undefined`
- `symbol` — unique
- `object`

---

### 62. Cumulative Layout Shift (CLS)

A metric used by Google to evaluate the performance and user experience of a website. With fonts, layout shift happens when the browser initially renders text in a fallback font and then swaps it out for a custom font once loaded. This swap can cause the text size, spacing, or layout to change, shifting elements around it.

---

### 63. slice vs substring

Answer

---

### 64. JSON.parse() vs json()

Answer

---

### 65. Date Conversion

Answer

---

---

## Practical / Coding Questions

---

### P1. Debouncing & Throttling — Implement

Answer

---

### P2. Two Sum

```js
let arr = [10, 20, 30, 40]
// target element: 50 — give me indices that add to the target like [1, 2]
// and what is the complexity?
```

---

### P3. Cart Total Price

```js
let cart = [
  { product: 'milk', quantity: 10, price: 10.2 },
  { product: 'bread', quantity: 5, price: 3.5 }
]
// calculate total price
```

---

### P4. Floating Point & Octal

```js
0.1 + 0.2 === 0.3  // false — floating point conversion
console.log(0015)   // octal representation — 8^1 * 1 + 8^0 * 5 = 13
```

---

### P5. Guess the Output — Type Coercion

```js
console.log(2 + '2' - '2');       // 20
console.log(typeof typeof 1);     // "string"
console.log(3 > 2 > 1);           // false
let a = [1, 2, 3];
let b = [1, 2, 3];
console.log(a == b, a === b);     // false false
```

---

### P6. setTimeout with var in Loop

```js
const arr = [10, 12, 15, 21];
for (var i = 0; i < arr.length; i++) {
  setTimeout(function () {
    console.log('Index: ' + i + ', element: ' + arr[i]);
  }, 3000);
}
// Output: Index: 4, element: undefined (4 times)
```

---

### P7. Object Reference

```js
let a = { x: 1 };
let b = a;
b.x = 2;
console.log(a.x); // 2
```

---

### P8. Array Reduce

```js
const array = [1, 2, 3, 4];
let data = array.reduce((result, current) => {
  return result + current;
}, 0);
console.log(data); // 10
```

---

### P9. Destructuring

```js
const employee = { name: 'Alice', age: 30, position: 'Developer' };
const colors = ['red', 'blue', 'green'];
// output: Alice, 30, red, blue
```

---

### P10. Reverse Words in a Sentence (without split/reverse)

Answer

---

### P11. Sort Array of Objects by Property

Answer

---

### P12. Longest Common Subsequence

Answer

---

### P13. First Non-Repeating Character in a String

Answer

---

### P14. Valid Parentheses Sequence (single type)

Answer

---

### P15. Valid Parentheses Sequence (multiple types: (), [], {})

Answer

---

### P16. Rotate Matrix 90° Clockwise

Answer

---

### P17. Flatten a Nested Object to Key-Value Pairs

Answer

---

### P18. Find Missing Number in Consecutive Array

Answer

---

### P19. Even Numbers Before Odd Numbers

Answer

---

### P20. Remove Duplicates from Sorted Array (in-place)

Answer

---

### P21. Generate All Subsets of a Set

Answer

---

### P22. Largest Sum of Contiguous Subarray (Kadane's Algorithm)

Answer

---

### P23. Merge Overlapping Intervals

Answer

---

### P24. Square Root Without Built-in Functions

Answer

---

### P25. Kth Smallest Element in Unsorted Array

Answer

---

### P26. Longest Substring Without Repeating Characters

Answer

---

### P27. Negative Numbers Before Positive (maintain order)

Answer

---

### P28. Trailing Zeros in Factorial

Answer

---

### P29. Longest Palindromic Substring

Answer

---

### P30. Maximum Sum of Non-Adjacent Elements

Answer

---

### P31. Remove All Occurrences of Value from Sorted Array (in-place)

Answer

---

### P32. Longest Palindromic Subsequence

Answer

---

### P33. Maximum Product of Three Numbers

Answer

---

### P34. Longest Substring with At Most K Distinct Characters

Answer

---

### P35. `if (i===1 && i===2 && i===3)` — Make it Print "yes"

Answer

---

### P36. Currying — `sum(1)(2)`

Answer

---

### P37. Design a Carousel

Answer

---

### P38. Filter Names Where Age < 50

Answer

---

### P39. Merge Two Arrays with Only Unique Values

Answer

---

### P40. Guess the Output — String + Number Coercion

```js
let n = 10;
n = n + "1";
n = n - "1";
console.log(n);  // 100
```

---

### P41. Guess the Output — Arrow Function `this`

```js
// Problem
const user = {
  email: "my@email.com",
  updateEmail: (email) => {
    this.email = email;
  },
};
user.updateEmail("new@email.com");
console.log(user.email); // "my@email.com"

// Solution — use regular function
const user2 = {
  email: "my@email.com",
  updateEmail: function (email) {
    this.email = email;
  },
};
user2.updateEmail("new@email.com");
console.log(user2.email); // "new@email.com"
```

---

### P42. Guess the Output — Event Loop Order

```js
// Example 1
setTimeout(() => console.log(1), 0);
console.log(2);
new Promise((res) => { res(); }).then(() => console.log(3));
console.log(4);
// Output: 2, 4, 3, 1

// Example 2
setTimeout(() => console.log(1), 0);
console.log(2);
new Promise((res) => { setTimeout(() => res(), 0); }).then(() => console.log(3));
console.log(4);
// Output: 2, 4, 1, 3
```

---

### P43. Guess the Output — var Hoisting in Block

```js
let fruit = 'apple';
let hungry = true;
if (hungry) {
  var fruit = 'orange';
  console.log(fruit); // 'orange'
}
console.log(fruit);     // 'orange'
```

---

### P44. Guess the Output — Block Scoping with let

```js
let a = 'Hello';
function x() {
  let b = 'World';
  console.log(a + ' ' + b, "1");    // "Hello World 1"
  if (b === 'World') {
    let c = 'hello';
    console.log(a + ' ' + b + ' ' + c, "2"); // "Hello World hello 2"
  }
  console.log(a + ' ' + b + ' ' + c, "3");   // ReferenceError: c is not defined
}
x();
```

---

### P45. Reverse a String

Answer

---

### P46. Longest Word in a Sentence

Answer

---

### P47. Check Palindrome String

Answer

---

### P48. Remove Duplicate Elements from Array

Answer

---

### P49. Check if Two Strings are Anagrams

Answer

---

### P50. Count Vowels in a String

Answer

---

### P51. Find Largest Number in Array

Answer

---

### P52. Check if Number is Prime

Answer

---

### P53. Calculate Factorial

Answer

---

### P54. Remove All Whitespace from a String

Answer

---

### P55. Sum of All Elements in Array

Answer

---

### P56. Average of Array of Numbers

Answer

---

### P57. Sort Array in Ascending Order

Answer

---

### P58. Check if Array is Sorted in Ascending Order

Answer

---

### P59. Merge Two Arrays into Single Sorted Array

Answer

---

### P60. Remove Specific Element from Array

Answer

---

### P61. Find Second Largest Element in Array

Answer

---

### P62. Reverse Order of Words in a Sentence

Answer

---

### P63. Longest Common Prefix Among Array of Strings

Answer

---

### P64. Intersection of Two Arrays

Answer

---

### P65. Fibonacci Sequence up to N

Answer
