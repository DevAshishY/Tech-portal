##  Run a JavaScript file
node app.js

##  Run with additional arguments
node app.js arg1 arg2

## Run in watch mode (restarts on file changes)
node --watch app.js 

## Command Line Arguments

```
// args.js
console.log('All arguments:', process.argv);
console.log('First argument:', process.argv[2]);
console.log('Second argument:', process.argv[3]);

// Example usage:
// node args.js hello world
// Output:
// All arguments: ['/path/to/node', '/path/to/args.js', 'hello', 'world']
// First argument: hello
// Second argument: world
```

## Access and set environment variables:

```
// env.js
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Custom variable:', process.env.MY_VARIABLE);
console.log('Database URL:', process.env.DATABASE_URL || 'Not set');

// Example usage with environment variables:
// NODE_ENV=production MY_VARIABLE=test node env.js
```

## Set Environment Variables

NODE_ENV=production  node env.js


## V8's Role in Node.js 
```
V8 provides the core JavaScript execution environment that Node.js is built upon.

It allows Node.js to:

    Execute JavaScript code outside the browser
    Access operating system functionality (file system, networking, etc.)
    Use the same JavaScript engine that powers Chrome for consistency

```

## Node Js 

**Key Characteristics:** Non-blocking I/O, event-driven, single-threaded with event loop, asynchronous execution

```
1. Client Request Phase

    Clients send requests to the Node.js server
    Each request is added to the Event Queue

2. Event Loop Phase

    The Event Loop continuously checks the Event Queue
    Picks up requests one by one in a loop

3. Request Processing

    Simple (non-blocking) tasks are handled immediately by the main thread
    Complex/blocking tasks are offloaded to the Thread Pool

4. Response Phase

    When blocking tasks complete, their callbacks are placed in the Callback Queue
    Event Loop processes callbacks and sends responses

```

## Blocking vs Non-blocking Code

```
// Blocking code example
console.log('Start of blocking code');
const data = fs.readFileSync('myfile.txt', 'utf8'); // Blocks here
console.log('Blocking operation completed');

// Non-blocking code example
console.log('Start of non-blocking code');
fs.readFile('myfile.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('Non-blocking operation completed');
});
console.log('This runs before the file is read');
```

Key Difference: The first example blocks the entire process until the file is read, while the second example allows other operations to continue while the file is being read.


## What is the Event Loop
The event loop is what makes Node.js non-blocking and efficient.

It handles asynchronous operations by delegating tasks to the system and processing their results through callbacks, allowing Node.js to manage thousands of concurrent connections with a single thread.

## How the Event Loop Works

```
Node.js follows these steps to handle operations:

    Execute the main script (synchronous code)
    Process any microtasks (Promises, process.nextTick)
    Execute timers (setTimeout, setInterval)
    Run I/O callbacks (file system, network operations)
    Process setImmediate callbacks
    Handle close events (like socket.on('close'))


```

### Why is the Event Loop Important?
```
The event loop enables Node.js to handle thousands of concurrent connections with a single thread, making it perfect for:

    Real-time applications
    APIs and microservices
    Data streaming
    Chat applications

```

### event loop phase 

```


The event loop processes different types of callbacks in this order:

    Timers: setTimeout, setInterval
    I/O Callbacks: Completed I/O operations
    Poll: Retrieve new I/O events
    Check: setImmediate callbacks
    Close: Cleanup callbacks (like socket.on('close'))

```

**Note: Between each phase, Node.js runs microtasks (Promises) and process.nextTick callbacks.**


### Asynchronous Programming in Node.js

```
Node.js uses an event loop for non-blocking I/O
Modern async code uses async/await with Promises
Always handle errors in async operations
Use Promise.all for parallel operations
Avoid callback hell with proper async patterns
```
### Promise States

```

    Pending: Initial state, operation not completed
    Fulfilled: Operation completed successfully
    Rejected: Operation failed

Once a promise is settled (either fulfilled or rejected), its state cannot change.
```

### Standard JavaScript Errors
```
// SyntaxError
JSON.parse('{invalid json}');

// TypeError
null.someProperty;

// ReferenceError
unknownVariable;

```
### System Errors

```
// ENOENT: No such file or directory
const fs = require('fs');
fs.readFile('nonexistent.txt', (err) => {
  console.error(err.code); // 'ENOENT'
});

// ECONNREFUSED: Connection refused
const http = require('http');
const req = http.get('http://nonexistent-site.com', (res) => {});
req.on('error', (err) => {
  console.error(err.code); // 'ECONNREFUSED' or 'ENOTFOUND'
});

```

### Node.js supports two module systems: CommonJS (traditional) and ES Modules (ECMAScript modules).

### Core Built-in Modules

Node.js provides several built-in modules that are compiled into the binary.



    fs - File system operations
    http - HTTP server and client
    path - File path utilities
    os - Operating system utilities
    events - Event handling
    util - Utility functions
    stream - Stream handling
    crypto - Cryptographic functions
    url - URL parsing
    querystring - URL query string handling

## Enabling ES Modules

1. Using the .mjs File Extension

The simplest way is to use the .mjs extension for your files.

Node.js will automatically treat these files as ES Modules.
2. Setting "type": "module" in package.json

To use ES Modules with regular .js files, add the following to your package.json:

```
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module"
}
```

## Export Syntax

### Named Exports

```
// Multiple named exports
export function sayHello() {
  console.log('Hello');
}

export function sayGoodbye() {
  console.log('Goodbye');
}

// Alternative: export list at the end
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

export { add, subtract };
```

## Default Export

```
// Only one default export per module
export default function() {
  console.log('I am the default export');
}

// Or with a named function/class/object
function mainFunction() {
  return 'Main functionality';
}

export default mainFunction;
```


### Mixed Exports
```
// Combining default and named exports
export const VERSION = '1.0.0';

function main() {
  console.log('Main function');
}

export { main as default }; // Alternative way to set default 
```

### Import Syntax    

```
// Import specific named exports
import { sayHello, sayGoodbye } from './greetings.mjs';
sayHello(); // Hello

// Rename imports to avoid naming conflicts
import { add as sum, subtract as minus } from './math.mjs';
console.log(sum(5, 3)); // 8

// Import all named exports as an object
import * as math from './math.mjs';
console.log(math.add(7, 4)); // 11 
```


