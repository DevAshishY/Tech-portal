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

# Node.js Dependency Management

Dependency management = **install, update, remove, version, and secure packages**.

## 📦 Important Files

```text
package.json       → Dependencies list
package-lock.json  → Exact installed versions
node_modules/      → Actual packages
```

## 🔢 SemVer

```text
MAJOR.MINOR.PATCH
  2    .8    .1
```

* **MAJOR** → Breaking changes
* **MINOR** → New features
* **PATCH** → Bug fixes

### Version Symbols

```text
^2.8.1 → 2.x.x
~2.8.1 → 2.8.x
2.8.1  → Exact version
>=2.8.1 → 2.8.1 or higher
```

## 📂 Dependency Types

```text
dependencies          → Required to run
devDependencies       → Development/testing
peerDependencies      → Package compatibility
optionalDependencies  → Optional package
```

```bash
npm install express        # Install
npm install express@4.18.2 # Specific version
npm install -D jest        # Dev dependency
npm uninstall express     # Remove

npm outdated              # Check updates
npm update                # Update
npm audit                 # Security check
npm audit fix             # Fix vulnerabilities
npm ls                    # Dependency tree
```

## 🔒 Lock File

**package.json** = What we need

**package-lock.json** = Exact versions

**node_modules** = What is installed

> **Remember: package.json → lock file → node_modules**


## Creating an HTTP Server

```
// Import the HTTP module
const http = require('http');

// Create a server object
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response body as 'Hello, World!'
  res.end('Hello, World!\n');
});

// Define the port to listen on
const PORT = 3000;

// Start the server and listen on the specified port
server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


Understanding the Code

    http.createServer() - Creates a new HTTP server instance
    The callback function is executed for each request with two parameters:
        req - The request object (http.IncomingMessage)
        res - The response object (http.ServerResponse)
    res.writeHead() - Sets the response status code and headers
    res.end() - Sends the response and ends the connection
    server.listen() - Starts the server on the specified port

```

### res.writeHead()

The res.writeHead() method is used to set the status code and response headers.

```
const http = require('http');

const server = http.createServer((req, res) => {
  // Set status code and multiple headers
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'X-Powered-By': 'Node.js',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Set-Cookie': 'sessionid=abc123; HttpOnly'
  });

  res.end('<h1>Hello, World!</h1>');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### Common Response Headers

```
Content-Type: Specifies the media type of the content (e.g., text/html, application/json)
Content-Length: The length of the response body in bytes
Location: Used in redirects (with 3xx status codes)
Set-Cookie: Sets HTTP cookies on the client
Cache-Control: Directives for caching mechanisms
Access-Control-Allow-Origin: For CORS support
```

### Reading Request Headers
You can access request headers using the req.headers object:

// Get specific headers (case-insensitive)
  const userAgent = req.headers['user-agent'];
  const acceptLanguage = req.headers['accept-language'];

## Accessing the Request URL

```
const server = http.createServer((req, res) => {
  // Get the URL and HTTP method
  const { url, method } = req;
```

## Parsing URLs with the URL Module 

Parsing URLs with the URL Module

The url module provides utilities for URL resolution and parsing.

It can parse a URL string into a URL object with properties for each part of the URL.

```
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);

  // Get different parts of the URL
  const pathname = parsedUrl.pathname; // The path without query string
  const query = parsedUrl.query; // The query string as an object

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    pathname,
    query,
    fullUrl: req.url
  }, null, 2));
});

server.listen(3000);
```

## Query Strings
For more advanced query string handling, you can use the querystring module:
```
 const queryObj = {
    name: 'John Doe',
    age: 30,
    interests: ['programming', 'music']
  };
  const queryStr = querystring.stringify(queryObj);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    path: parsedUrl.pathname,
    params,
    exampleQueryString: queryStr
  }, null, 2));
```

### Common URL Parsing Methods

```
url.parse(urlString, [parseQueryString], [slashesDenoteHost]): Parse a URL string into an object
url.format(urlObject): Format a URL object into a URL string
url.resolve(from, to): Resolve a target URL relative to a base URL
new URL(input, [base]): The WHATWG URL API (recommended for new code)
querystring.parse(str, [sep], [eq], [options]): Parse a query string into an object
querystring.stringify(obj, [sep], [eq], [options]): Stringify an object into a query string
```

### Best Practices for HTTP Methods

```
GET: Retrieve a resource or collection of resources (should be idempotent)
POST: Create a new resource (not idempotent)
PUT: Update an existing resource or create it if it doesn't exist (idempotent)
PATCH: Partially update a resource
DELETE: Remove a resource (idempotent)
HEAD: Same as GET but without the response body
OPTIONS: Describe the communication options for the target resource
```

### Error Handling 
```
200 OK - Successful GET/PUT/PATCH
201 Created - Successful resource creation
204 No Content - Successful DELETE
400 Bad Request - Invalid request data
401 Unauthorized - Authentication required
403 Forbidden - Not enough permissions
404 Not Found - Resource doesn't exist
500 Internal Server Error - Server-side error
```

### Streaming Responses & Benefits of Streaming

Node.js streams are powerful for handling large amounts of data efficiently. The HTTP module works well with streams for both reading request bodies and writing responses.

```
Benefits of Streaming

    Memory Efficiency: Processes data in chunks instead of loading everything into memory
    Faster Time to First Byte: Starts sending data as soon as it's available
    Backpressure Handling: Automatically handles slow clients by pausing the read stream

Common Use Cases for Streaming

    File uploads/downloads
    Real-time data processing
    Proxying requests
    Video/audio streaming
    Log processing

```

```
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Get the file path from the URL
  const filePath = path.join(__dirname, req.url);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }

    // Get file stats
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.statusCode = 500;
        res.end('Server error');
        return;
      }

      // Set appropriate headers
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Create read stream and pipe to response
      const stream = fs.createReadStream(filePath);

      // Handle errors
      stream.on('error', (err) => {
        console.error('Error reading file:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Error reading file');
        }
      });

      // Pipe the file to the response
      stream.pipe(res);
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`File server running at http://localhost:${PORT}/`);
});
```

### https module 
The HTTPS module is a core Node.js module that provides an implementation of the HTTPS protocol, which is essentially HTTP over TLS/SSL.

### Why Use HTTPS?

```
HTTPS is crucial for modern web applications because it:

    Encrypts Data: Protects sensitive information like passwords, credit card numbers, and personal data from eavesdropping
    Authenticates Servers: Verifies that clients are communicating with the intended server
    Ensures Data Integrity: Prevents data from being modified or corrupted during transfer
    Builds Trust: Visual indicators (like the padlock icon) increase user confidence
    Improves SEO: Search engines prioritize HTTPS websites in search results
    Enables Modern Features: Many web APIs (like Geolocation, Service Workers) require HTTPS

```
### How HTTPS Works
```
Client initiates a secure connection to the server
Server presents its SSL/TLS certificate to the client
Client verifies the certificate with a trusted Certificate Authority (CA)
Encrypted session is established using asymmetric encryption
Symmetric encryption is used for the actual data transfer
```
### HTTPS vs HTTP API
The main difference in usage is that HTTPS requires SSL/TLS certificates, while HTTP does not.

### SSL/TLS Certificates

```
Types of Certificates

    Self-Signed Certificates: For development and testing (not trusted by browsers)
    Domain Validated (DV): Basic validation, just verifies domain ownership
    Organization Validated (OV): Validates organization details
    Extended Validation (EV): Highest level of validation, shows company name in browser
    Wildcard Certificates: Secures all subdomains of a domain
    Multi-Domain (SAN) Certificates: Secures multiple domains with one certificate

```
### HTTP/2 with Node.js

HTTP/2 is a major revision of the HTTP protocol that provides significant performance improvements over HTTP/1.1. When combined with HTTPS, it offers both security and performance benefits for modern web applications.

### Benefits of HTTP/2

```
Key Features of HTTP/2:

    Multiplexing: Multiple requests/responses can be sent in parallel over a single connection, eliminating head-of-line blocking
    Header Compression: Reduces overhead by compressing HTTP headers (HPACK algorithm)
    Server Push: Server can proactively send resources to the client before they're requested
    Binary Protocol: More efficient to parse than HTTP/1.1's text-based format
    Stream Prioritization: More important resources can be loaded first
    Connection Multiplexing: Multiple streams can share a single TCP connection

```
### Default Port 
HTTP : 80

HTTPS: 443

## Node.js File System Module
## Common Use Cases

```
File Operations

    Read and write files
    Create and delete files
    Append to files
    Rename and move files
    Change file permissions

Directory Operations

    Create and remove directories
    List directory contents
    Watch for file changes
    Get file/directory stats
    Check file existence

    Advanced Features

    File streams
    File descriptors
    Symbolic links
    File watching
    Working with file permissions

Performance Tip: For large files, consider using streams (fs.createReadStream and fs.createWriteStream) to avoid high memory usage.
```

## Reading Files 
The most common method is fs.readFile().

```
const fs = require('fs');

// Read file asynchronously with callback
fs.readFile('myfile.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});

// For binary data (like images), omit the encoding
fs.readFile('image.png', (err, data) => {
  if (err) throw err;
  // data is a Buffer containing the file content
  console.log('Image size:', data.length, 'bytes');
}); 
```

### Morden approch for reading file 

Using fs.promises or util.promisify for cleaner async/await syntax:

### Creates a new file 
1- fs.writeFile()

2- fs.appendFile()

3- Using File Handles fileHandle.write('First line\n');-

4. Using Streams for Large Files

### File Flags: When opening files, you can specify different modes:
```
    'w' - Open for writing (file is created or truncated)
    'wx' - Like 'w' but fails if the path exists
    'w+' - Open for reading and writing (file is created or truncated)
    'a' - Open for appending (file is created if it doesn't exist)
    'ax' - Like 'a' but fails if the path exists
    'r+' - Open for reading and writing (file must exist)
```

### Deleting Files and Directories

1. Deleting a Single File 

fs.unlink() to delete a file:

2- Deleting Multiple Files 

To delete multiple files, you can use Promise.all() with fs.unlink():

3- Deleting Directories

To delete directories, you have several options depending on your needs:

4. Emptying a Directory Without Deleting It

To remove all files and subdirectories within a directory but keep the directory itself:


### Renaming and Moving Files 

1. Basic File Renaming 

2. Moving Files Between Directories

3. Batch Renaming Files

4. Atomic Rename Operations


### Node.js Path Module 

## path.basename
const filename = path.basename("/user/hello.text"); //  last portion of a path
console.log(filename);

## __dirname & __filename
In Node.js, __dirname and __filename are special variables available in CommonJS modules that provide the directory name and file name of the current module.

## path.extname()
Returns the extension of a path, from the last occurrence of the . character to the end of the string.

## path.join()
