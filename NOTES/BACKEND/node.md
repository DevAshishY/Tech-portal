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
