# 🐍 Python for dms-backend: The Complete Learning Path

Written for a **complete Python beginner** who knows JavaScript/React, with one goal:
**work confidently in `dms-backend`** (FastAPI + SQLAlchemy + MySQL + Redis + Celery).

## How to use this file
- **Topics** are numbered **T1, T2, T3…** and **quiz questions** **Q1, Q2, Q3…** across the whole file.
  Just tell Claude: *"teach T16"*, *"explain Q23"* or *"quiz me on Day 3"*.
- Every topic has: 🧠 what it is · 🏠 a real-life example · 💻 code · 🟨 JS/Node comparison · 🟩 **MERN** (how you'd do it in Mongo/Express/React/Node) · ⚠️ gotchas · 🏢 where it is in dms-backend.
  🟩 Every topic T1–T143 has a MERN block, so you learn each idea once and see it in **both** stacks.
- Every day ends with a **quiz**. Answers are hidden in a ▶ *Answers* box; guess first, then open it.
- Mark quiz questions: ✅ = I got it myself · 📖 = I needed an explanation (revise these!)
- Practice code goes in [`example/`](example/) (`day2.py`, `day3.py`…).
- After **all days + quizzes** are done → we build the **🏗️ Final Project** (at the end of this file).

dms-backend lives at `~/Documents/BJS/PROJECTS/backend/dms-backend`.

## 🟩 MERN ↔ Python stack map (learn both side by side)
| Job | MERN (what you know) | Python / dms-backend |
|---|---|---|
| Language | JavaScript / TypeScript | Python 3.12 |
| Runtime | Node.js (`node app.js`) | CPython (`python3 app.py`) |
| Package manager | npm / yarn · `package.json` | pip / **Poetry** · `pyproject.toml` |
| Dev server | `nodemon` | `uvicorn --reload` |
| Web framework | **Express** | **FastAPI** |
| Route | `router.get("/orders/:id", handler)` | `@router.get("/orders/{order_id}")` |
| Middleware / shared setup | `app.use(...)`, `req.user` | middleware + **`Depends(...)`** |
| Input validation | Joi / zod / express-validator | **Pydantic** |
| Database | **MongoDB** (documents) | **MySQL** (tables) |
| Data modelling / ORM | **Mongoose** schema + model | **SQLAlchemy** model |
| Schema changes | (Mongo has no fixed schema) · migrate-mongo | **Alembic** migrations |
| Auth | `jsonwebtoken` + `bcrypt` | `pyjwt` + `passlib[argon2]` |
| Permissions | custom middleware `checkRole("admin")` | `@check_permission("dms.order.view.read")` |
| Cache | Redis (`ioredis`) | Redis (`redis-py`) |
| Background jobs | BullMQ / Agenda / node-cron | **Celery** + Celery beat |
| HTTP client | axios / fetch | `requests` / `httpx` |
| Tests | Jest + Supertest | **pytest** + httpx `AsyncClient` |
| Lint / format | ESLint / Prettier | flake8 / isort / mypy |
| Frontend | **React** | (same React frontend calls the FastAPI API) |

💡 Data from Mongo arrives as **JS objects/arrays**; data from MySQL via SQLAlchemy arrives as **Python objects / lists**, and leaves the API as the **same JSON** your React app already understands.

---

## 🗺️ Index
| Day | Topic | Topics | Quiz | Status |
|---|---|---|---|---|
| **Part A: Python Core** |||||
| 1 | Basics: variables, types, f-strings, if, truthiness | T1–T15 | Q1–Q17 | ✅ |
| 2 | Collections: list, dict, tuple, set | T16–T21 | Q18–Q27 | ⏳ |
| 3 | Loops + comprehensions | T22–T28 | Q28–Q37 | ⏳ |
| 4 | Functions | T29–T34 | Q38–Q47 | ⏳ |
| 5 | Errors & exceptions | T35–T39 | Q48–Q55 | ⏳ |
| 6 | Modules, imports, pip, venv, Poetry | T40–T44 | Q56–Q63 | ⏳ |
| 7 | Files + JSON + Week-1 test | T45–T47 | Q64–Q70 | ⏳ |
| **Part B: Intermediate Python** |||||
| 8 | Classes & OOP | T48–T54 | Q71–Q80 | ⏳ |
| 9 | Type hints | T55–T59 | Q81–Q88 | ⏳ |
| 10 | Decorators | T60–T64 | Q89–Q96 | ⏳ |
| 11 | Iterators, generators, `with` | T65–T69 | Q97–Q103 | ⏳ |
| 12 | async/await + datetime, Decimal, enum, logging | T70–T76 | Q104–Q113 | ⏳ |
| **Part C: Backend in dms-backend** |||||
| 13 | HTTP & REST + run dms-backend locally | T77–T80 | Q114–Q121 | ⏳ |
| 14 | FastAPI: routes, path & query params, routers | T81–T85 | Q122–Q129 | ⏳ |
| 15 | FastAPI: body, `Depends`, request/response | T86–T90 | Q130–Q137 | ⏳ |
| 16 | Pydantic schemas | T91–T96 | Q138–Q145 | ⏳ |
| 17 | SQL basics (MySQL) | T97–T100 | Q146–Q153 | ⏳ |
| 18 | SQL: joins, group by, indexes, transactions | T101–T104 | Q154–Q161 | ⏳ |
| 19 | SQLAlchemy: models & sessions | T105–T109 | Q162–Q169 | ⏳ |
| 20 | SQLAlchemy: queries & writes | T110–T114 | Q170–Q177 | ⏳ |
| 21 | Alembic migrations | T115–T118 | Q178–Q184 | ⏳ |
| 22 | Auth: hashing, JWT, permissions | T119–T123 | Q185–Q192 | ⏳ |
| 23 | Redis + Celery | T124–T128 | Q193–Q200 | ⏳ |
| 24 | Testing with pytest | T129–T133 | Q201–Q208 | ⏳ |
| **Part D: Real-world** |||||
| 25 | Integrations: HTTP clients, retries, S3, Kafka, config | T134–T138 | Q209–Q216 | ⏳ |
| 26 | Team workflow: git, pre-commit, Docker, CI | T139–T143 | Q217–Q224 | ⏳ |
| 🏗️ | **Final Project**: build a feature in dms-backend | — | — | ⏳ |

---
---

# 📅 Day 1: The building blocks

### T1. What is Python?
🧠 Python is a programming language, and `python3` is the program that **runs** Python code, the same way `node` runs JavaScript.
- **Interpreted:** it reads and runs your file line by line, from top to bottom. No compile step.
- **Used for:** backends (dms-backend uses FastAPI), automation scripts, data work and AI.
- File extension: `.py`

🏠 Python is the cook and your `.py` file is the recipe. The cook follows it one line at a time, top to bottom.

🟩 **MERN way:** JavaScript runs in the browser (React) **and** on the server (Node). Python runs only on the server. In MERN, the same language is used front and back; with dms-backend, React (JS) talks to a Python API over HTTP/JSON.

### T2. Installing and running
| Node.js | Python |
|---|---|
| `node -v` | `python3 --version` |
| `node` (REPL) | `python3` (REPL, `>>>` prompt) |
| `node app.js` | `python3 app.py` |
| `npm install x` | `pip install x` / `poetry add x` |
| `package.json` | `pyproject.toml` |
| `node_modules/` | virtual env (`.venv/`) |
| `nvm` (switch versions) | `pyenv` (switch versions) |

📌 **`python3`, not `python`, on Ubuntu:** older Linux systems used `python` for **Python 2**, which is outdated and incompatible with Python 3. To avoid breaking old scripts, Ubuntu names the modern one `python3` (and `pip3`).
Inside an active virtual env (or with `poetry run`), plain `python` works and points to the env's Python 3.
_Node comparison:_ Node never split like this. There's just `node`, and you switch versions with `nvm`.

```bash
python3 --version     # Python 3.12.3
which python3         # /usr/bin/python3, where it's installed
python3               # opens the REPL; try 2 + 3, then exit() to leave
python3 day1.py       # runs your file
```
💡 **REPL** = "Read, Eval, Print, Loop": type a line and see the result immediately, like the Chrome DevTools console.

🟩 **MERN way**
```bash
node -v                # check version
node app.js            # run a file
npm init -y            # creates package.json      (Python: poetry init → pyproject.toml)
npm install express    # adds to node_modules       (Python: poetry add fastapi)
npx nodemon app.js     # auto-restart               (Python: uvicorn --reload)
```

### T3. Comments
```python
# single-line comment                 (JS: // comment)

"""
multi-line string, used as a
multi-line comment or a "docstring"   (JS: /* ... */)
"""
```

🟩 **MERN way:** `// one line` · `/* many lines */` · JSDoc `/** Returns the fee */` above a function (Python: docstring inside the function).

### T4. `print()`: showing output
🧠 Python's `console.log()`.
```python
print("Hello")                    # Hello
print("Job", 5001, "assigned")    # Job 5001 assigned  ← commas add a space and convert types for you
print("a", "b", sep="-")          # a-b                ← sep = what goes BETWEEN the values (default " ")
print("Loading", end="...")       # Loading...         ← end = what goes at the END (default: new line)
print()                           # an empty line
```
🟨 `console.log("Job", 5001)` is the same, but JS has no `sep`/`end` (use `.join()`).
💡 `sep=" | "` is a **keyword argument** (a value passed by name). It's the same idea as `status_code=200` in FastAPI.

🟩 **MERN way**
```js
console.log("Job", 5001, "assigned");     // Job 5001 assigned
console.log(["a", "b"].join("-"));        // a-b       (Python: sep="-")
process.stdout.write("Loading...");       // no newline (Python: end="...")
```

### T5. Variables
🧠 A variable is a **name that points to a value**.
🏠 A labelled box on a warehouse shelf: the label is the name, the item inside is the value, and you can swap the item at any time.
```python
job_id = 5001
driver_name = "Ravi"
driver_name = "Amit"          # reassign
```
| JavaScript | Python |
|---|---|
| `let x = 5;` / `const x = 5;` | `x = 5` |
| `const` stops reassignment | ❌ no `const`; everything can be reassigned |
| `MAX_QTY` | `MAX_QTY = 10`: ALL_CAPS = "treat as a constant" (convention only) |
| `camelCase` | `snake_case` |

**Naming rules** (breaking these = error):
| Rule | ✅ OK | ❌ Error |
|---|---|---|
| Letters, digits, `_` only | `order_id` | `order-id` (read as minus!) |
| Can't start with a digit | `driver_2` | `2nd_driver` → `SyntaxError: invalid decimal literal` |
| No spaces | `job_id` | `job id` |
| Not a keyword | `class_name` | `class`, `if`, `for`, `None` |
| Case-sensitive | `name` ≠ `Name` | (a common bug) |
🟨 JS allows `$` in names; Python doesn't.

**dms-backend naming style:**
| What | Style | Example |
|---|---|---|
| variables, functions | `snake_case` | `order_id`, `get_db()` |
| classes | `PascalCase` | `EscalationReasons` |
| constants | `UPPER_CASE` | `CLIENT_ID` |
| internal/private | starts with `_` | `_TOOLBOX_SCAN_FIELDS` |

**Handy tricks:**
```python
x, y = 10, 20          # several at once (matched by position)
x, y = y, x            # swap: the right side is worked out FIRST, then assigned
a = b = 0
x, y = 1, 2, 3         # ❌ ValueError: too many values to unpack
```
⚠️ **Dynamic typing:** a variable can change type (`job = 5001`, then `job = "five"`).

🟩 **MERN way**
```js
const jobId = 5001;          // const = can't reassign (Python has no const)
let driverName = "Ravi";     // let = can reassign
driverName = "Amit";
let [x, y] = [10, 20];       // destructuring    (Python: x, y = 10, 20)
[x, y] = [y, x];             // swap             (Python: x, y = y, x)
```
Naming: JS `camelCase` (`driverName`), Python `snake_case` (`driver_name`). Mongo documents in MERN usually use camelCase keys; MySQL columns in dms-backend use snake_case.

### T6. Data types
🏠 A delivery job: customer name (text), item count (whole number), weight (decimal), paid? (yes/no), driver (nothing yet).
```python
customer = "Ravi"     # str    text, "double" or 'single' quotes
items = 3             # int    whole number
weight = 12.5         # float  decimal number
paid = True           # bool   True / False (capital!)
driver = None         # None   "no value"
type(items)           # <class 'int'>
```
| JS | Python |
|---|---|
| `string` | `str` |
| `number` (one type) | `int` **and** `float` |
| `true` / `false` | `True` / `False` |
| `null` **and** `undefined` | just `None` |
| `typeof x` | `type(x)` |

**Maths:**
```python
10 / 2     # 5.0  ← / ALWAYS gives a float
10 // 3    # 3    ← whole-number division
10 % 3     # 1    ← remainder
2 ** 3     # 8    ← power
"5" * 2    # "55" ← text * int = REPEAT
```
🏢 If you need a whole number (page, qty, id), use `//` or `int()`, not `/`.

🟩 **MERN way**
```js
typeof "Ravi"   // "string"
typeof 3        // "number"  ← int AND float are both "number"
typeof 12.5     // "number"
typeof true     // "boolean"
typeof null     // "object"  😅 (a famous JS quirk)
10 / 2          // 5          (Python: 5.0)
Math.floor(10 / 3)  // 3      (Python: 10 // 3)
```
Mongoose types: `String`, `Number`, `Boolean`, `Date`, `null`; SQLAlchemy: `String`, `Integer`, `Float/Numeric`, `Boolean`, `DateTime`, `None`.

### T7. Type conversion
```python
int("5")        # 5
float("12.5")   # 12.5
str(5001)       # "5001"
int("3.5")      # ❌ ValueError
int("abc")      # ❌ ValueError
"5" + 1         # ❌ TypeError   (JS gives "51")
```
⚠️ Python **never** silently converts types. That means fewer hidden bugs.

🟩 **MERN way**
```js
Number("5")       // 5        (Python: int("5"))
parseInt("5px")   // 5        (Python: int("5px") → ValueError!)
String(5001)      // "5001"   (Python: str(5001))
"5" + 1           // "51"     ← JS converts silently; Python raises TypeError
"5" * 2           // 10       ← JS converts; Python repeats: "55"
```

### T8. `input()`: reading from the keyboard
🧠 It **always returns a `str`**, whatever is typed. The argument is just the **prompt text** (`input(123)` shows "123"; it's not the value).
```python
qty = int(input("Qty: "))     # convert straight away
```
🟨 Same as browser `prompt()`, which also returns a string.
🏢 dms-backend doesn't use `input()`. Data comes from API requests, and FastAPI converts it using type hints (`page: int`).

🟩 **MERN way**
```js
// Browser / React
const qty = Number(prompt("Qty:"));        // prompt returns a string too
// Node CLI
const readline = require("readline");
// Express: user input comes from the request, always strings in req.query / req.params
const page = Number(req.query.page);       // you convert by hand   (FastAPI: page: int converts for you)
```

### T9. f-strings
🏠 A fill-in-the-blanks SMS: "Hi {name}, your job {id} is out for delivery."
```python
name, job_id, price = "Ravi", 5001, 49.5
f"Hi {name}, job {job_id}"     # Hi Ravi, job 5001
f"Total: {price * 2}"          # maths inside {}
f"Price: {price:.2f}"          # 49.50 ← 2 decimal places
"Hi {name}"                    # ⚠️ no f → prints "Hi {name}" literally
```
🟨 JS: `` `Hi ${name}` ``. Python uses `f"..."` + `{}` with no `$`.
🏢 `logger.info(f"Order {order_id} assigned to driver {driver_id}")`

🟩 **MERN way**
```js
const name = "Ravi", jobId = 5001, price = 49.5;
`Hi ${name}, job ${jobId}`;        // template literal (backticks + ${})
`Price: ${price.toFixed(2)}`;      // 49.50            (Python: {price:.2f})
// React JSX:
<p>Hi {name}, job {jobId}</p>
```

### T10. Indentation = Python's `{ }`
```python
if paid:
    print("Dispatch")     # inside (4 spaces)
print("Done")             # outside
```
⚠️ A line ending with `:` → the next line **must** be indented, otherwise `IndentationError`.

🟩 **MERN way:** JS uses `{ }` for blocks; indentation is just style (Prettier formats it). Python uses indentation as the rules.
```js
if (paid) {
  console.log("Dispatch");
}
```

### T11. `if` / `elif` / `else`
```python
if total > 1000:
    fee = 0
elif total > 500:         # JS: else if
    fee = 50
else:
    fee = 100
```
- Every condition line ends with **`:`** · no `( )` needed · `==` / `!=` instead of `===` / `!==`
- In a chain, **only the first True branch runs**.
- Two separate rules that can **both** apply → use two separate `if`s, not `elif`.

🟩 **MERN way**
```js
let fee;
if (total > 1000) fee = 0;
else if (total > 500) fee = 50;      // Python: elif
else fee = 100;
const label = total > 1000 ? "free" : "paid";   // ternary (Python: "free" if total > 1000 else "paid")
```

### T12. `and` / `or` / `not`
```python
if paid and driver and not cancelled:
    print("Dispatch")
```
| JS | Python |
|---|---|
| `&&` `\|\|` `!` | `and` `or` `not` |

🟩 **MERN way**
```js
if (paid && driver && !cancelled) { ... }      // && || !
// Mongo query with AND / OR:
Order.find({ paid: true, status: { $ne: "cancelled" } });            // AND
Order.find({ $or: [{ status: "D" }, { status: "P" }] });             // OR
```
(SQLAlchemy: `and_`, `or_`; see T111.)

### T13. Truthiness
**Falsy:** `False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `set()` · everything else is truthy (`[0]`, `" "`, `"0"`, `"False"` are all **truthy**).
```python
if not orders:
    print("No orders today")
```
⚠️ `[]` and `{}` are **falsy** in Python but **truthy** in JS.
⚠️ When `0` is a valid value (discount = 0), use `if x is None:`, not `if not x:`.
🏢 `if not order: raise HTTPException(404, "Order not found")`

🟩 **MERN way**
```js
if (orders.length === 0) console.log("No orders");   // [] is TRUTHY in JS, so check .length
if (!order) return res.status(404).json({ error: "Order not found" });   // Express
// React conditional rendering:
{orders.length > 0 && <OrderList orders={orders} />}     // not {orders && ...} — that renders for []
```

### T14. `is None` vs `==`
🧠 `==` = same **value** · `is` = the **same object** in memory.
```python
a = [1, 2]; b = [1, 2]; c = a
a == b    # True   same contents
a is b    # False  different lists
a is c    # True   one list, two names
```
Always write `x is None` / `x is not None`:
1. There's only one `None` object.
2. `==` can be customised by a class and can lie; `is` can't.
3. flake8 (used in dms-backend) flags `== None` as **E711**.

⚠️ Use `is` only with `None`/`True`/`False`, never with numbers or strings.
🏢 **The exception, SQLAlchemy filters:** `.filter(Model.column.is_(None))`, which becomes SQL `IS NULL`.

🟩 **MERN way**
```js
if (driver === null) {...}          // null only
if (driver == null) {...}           // null OR undefined (the one OK use of ==)
[1,2] === [1,2]                     // false: different objects (like Python `is`)
// Mongo: find docs where a field is null or missing
Order.find({ driverId: null });     // SQLAlchemy: .filter(Orders.driver_id.is_(None))
```

### T15. Reading errors (tracebacks)
Read **from the bottom up**: the last line says **what** went wrong, and the line above it says **where**.
```
  File "day1.py", line 3, in <module>
    print("Job " + 5001)
TypeError: can only concatenate str (not "int") to str
```
| Error | Usually means |
|---|---|
| `NameError` | a typo / not created yet (Python 3.12 suggests: *Did you mean…?*) |
| `TypeError` | mixing types |
| `IndentationError` | wrong spacing |
| `SyntaxError` | a missing `:`, quote or bracket |
| `ValueError` | `int("abc")` |

🟩 **MERN way:** Node also prints a stack trace, but the **error message is on the top line** and the call stack is below it (Python: message at the bottom).
```
TypeError: Cannot read properties of undefined (reading 'name')
    at getOrder (/app/routes/orders.js:12:20)     ← where
```
| Node error | Python cousin |
|---|---|
| `ReferenceError: x is not defined` | `NameError` |
| `TypeError: Cannot read properties of undefined` | `AttributeError: 'NoneType' object has no attribute` |
| `SyntaxError` | `SyntaxError` |

### ⚡ Day 1 in one breath
`python3 file.py` · no `let`/`const`/`;`/`{}` · `snake_case` · `True/False/None` · `/` gives a float · no silent type mixing · `input()` returns a str · `f"{x}"` · indent after `:` · `elif` · `and/or/not` · `[]` is falsy · `is None` · read errors bottom-up.

## 📝 Quiz: Day 1 (Q1–Q17)
| # | Question | Answer | Why |
|---|---|---|---|
| Q1 ✅ | `print(type(10 / 2))` | `<class 'float'>` | `/` always gives a float |
| Q2 ✅ | `print(7 // 2, 7 % 2)` | `3 1` | whole-number division, remainder |
| Q3 📖 | `print("Job", 5001, "done", sep=" \| ")` | `Job \| 5001 \| done` | `sep` goes between the values |
| Q4 📖 | `name="Ravi"; print("Hi {name}")` | `Hi {name}` | no `f` |
| Q5 📖 | `x,y=1,2; x,y=y,x; print(x,y)` | `2 1` | right side first, then assign |
| Q6 📖 | `x=0` → `if x: yes else no` | `no` | `0` is falsy |
| Q7 📖 | `bool("False"), bool(""), bool([]), bool(" ")` | `True False False True` | non-empty text is truthy |
| Q8 📖 | `a=[1]; b=[1]; print(a==b, a is b)` | `True False` | same value, different objects |
| Q9 📖 | `driver = null` valid? | ❌ | `NameError`: use `None` |
| Q10 📖 | `2nd_driver` valid name? | ❌ | can't start with a digit |
| Q11 📖 | `Name` same as `name`? | ❌ | case-sensitive |
| Q12 📖 | `input()` gives an int for numbers? | ❌ | always a str |
| Q13 📖 | `[]` acts as True? | ❌ | empty = falsy |
| Q14 📖 | bug: `"Job " + job_id` (int) | TypeError | `f"Job {job_id}"` |
| Q15 📖 | bug: `paid = true` / `if paid` | 2 bugs | `True` + the missing `:` |
| Q16 📖 | bug: `qty = input(); qty * 49.5` | TypeError | `int(input())` |
| Q17 🟡 | write: driver / two-man job / weight | see below | |

```python
weight, is_fragile, driver = 18.5, True, None
if driver is None:
    print("Assign a driver first")
elif weight > 20 or is_fragile:
    print("Two-man job")
else:
    print("One-man job")
print(f"Weight: {weight:.2f} kg")     # always runs (not indented)
```
My mistakes: the typo `'wo-man job'` and a forgotten final print. **Read the whole requirement before finishing.**

---
---

# 📅 Day 2: Collections (list, dict, tuple, set)
🏢 **Why it matters:** API data is almost always **lists of dicts**. JSON `[{"id": 101}]` becomes a Python list of dicts.

| Python | JS | Real life |
|---|---|---|
| `list` `[ ]` | Array | today's delivery run, in order |
| `dict` `{ }` | Object | one order form: field → value |
| `tuple` `( )` | a frozen array | a postcode that must not change |
| `set` `{ }` | `Set` | the unique cities on today's run |

### T16. `list`: create, index, slice
🧠 An **ordered** collection you **can change**.
🏠 Today's delivery run: stops in order.
```python
stops = ["sofa", "bed", "table"]
stops[0]        # "sofa"   ← index starts at 0
stops[-1]       # "table"  ← negative = from the end (JS: .at(-1))
stops[0:2]      # ["sofa", "bed"]  ← slice [start:stop], stop NOT included
stops[1:]       # ["bed", "table"]
stops[::-1]     # reversed copy
len(stops)      # 3  ← a function, not .length
stops[10]       # ❌ IndexError: list index out of range  (JS gives undefined)
```
🟨 A list can hold mixed types like a JS array, but in practice keep one type per list.

🟩 **MERN way**
```js
// Node / plain JS
const stops = ["sofa", "bed", "table"];
stops[0];            // "sofa"
stops.at(-1);        // "table"   (stops[-1] is undefined in JS!)
stops.slice(0, 2);   // ["sofa", "bed"]
stops.length;        // 3
[...stops].reverse();// reversed copy (.reverse() alone changes the original)
stops[10];           // undefined  (Python: IndexError)

// Express + Mongoose: a query result is an array
const orders = await Order.find({ status: "D" });     // Python: db.query(Orders).filter(...).all()
const first = orders[0];                              // Python: orders[0]
res.json(orders);                                     // Python/FastAPI: return orders

// React: rendering a list
{stops.map((s, i) => <li key={i}>{s}</li>)}          // the API's Python list arrives here as a JS array
```
| Task | Python | JS / MERN |
|---|---|---|
| last item | `stops[-1]` | `stops.at(-1)` |
| slice | `stops[0:2]` | `stops.slice(0, 2)` |
| length | `len(stops)` | `stops.length` |
| reversed copy | `stops[::-1]` | `[...stops].reverse()` |
| bad index | ❌ `IndexError` | `undefined` (silent) |
| DB rows | `db.query(Orders).all()` → list | `Order.find()` → array |

### T17. List methods + the copy trap
```python
stops.append("chair")       # add to the end              JS: push
stops.insert(0, "lamp")     # add at a position            JS: splice(0,0,x)
stops.extend(["a", "b"])    # add many                     JS: push(...arr)
stops.pop()                 # remove + return the last     JS: pop
stops.pop(0)                # remove + return index 0      JS: shift
stops.remove("bed")         # remove by VALUE (first match; ValueError if missing)
"bed" in stops              # True/False                   JS: includes
stops.index("sofa")         # position                     JS: indexOf (but ValueError if missing)
stops.sort()                # sorts IN PLACE, returns None ⚠️
sorted(stops)               # returns a NEW sorted list
stops + ["x"]               # join two lists → new list    JS: [...a, ...b]
```
⚠️ `stops = stops.sort()` → `stops` becomes `None`! `.sort()` changes the list and returns nothing.
⚠️ **The copy trap:**
```python
a = [1, 2]
b = a            # NOT a copy: same list
b.append(3)      # a is now [1, 2, 3] too!
c = a.copy()     # ✅ real copy (also: a[:] or list(a))   JS: [...a]
```

🟩 **MERN way**
```js
stops.push("chair");           // append
stops.unshift("lamp");         // insert at start (insert(0, x))
stops.push(...["a", "b"]);     // extend
stops.pop(); stops.shift();    // pop() / pop(0)
stops.splice(stops.indexOf("bed"), 1);   // remove("bed")
stops.includes("bed");         // "bed" in stops
[...stops].sort();             // sorted(stops) — .sort() alone mutates
const c = [...a];              // a.copy()
// Mongoose array update:
await Order.updateOne({ _id }, { $push: { items: "chair" } });
```

### T18. `dict`: key → value
🧠 Like a JS object. Keys are usually strings.
🏠 One order form: each field has a value.
```python
order = {"id": 101, "customer": "Ravi", "qty": 2}
order["customer"]                   # "Ravi"
order["driver"]                     # ❌ KeyError: 'driver'
order.get("driver")                 # None (safe)
order.get("driver", "unassigned")   # default   JS: order.driver ?? "unassigned"
order["driver"] = "Amit"            # add or update
del order["qty"]                    # delete
order.pop("qty", None)              # delete safely + return the value
"qty" in order                      # checks KEYS
order.update({"qty": 3, "paid": True})   # merge   JS: Object.assign / {...a, ...b}
{**order, "qty": 5}                 # spread copy JS: {...order, qty: 5}
order.keys(), order.values(), order.items()   # JS: Object.keys/values/entries
```
| JS | Python |
|---|---|
| `order.customer` | `order["customer"]` ⚠️ **no dot access** on dicts |
| missing key → `undefined` | missing key → **KeyError** (use `.get`) |
| `{id: 1}` | `{"id": 1}` (keys need quotes) |
🏢 `app/main.py`: `sample.labels.get("handler", "unknown")`

🟩 **MERN way**
```js
const order = { id: 101, customer: "Ravi", qty: 2 };
order.customer;                    // dot access (Python dicts need ["customer"])
order.driver ?? "unassigned";      // order.get("driver", "unassigned")
order.driver = "Amit";             // add/update
delete order.qty;                  // del order["qty"]
"qty" in order;                    // same!
const updated = { ...order, qty: 5 };   // {**order, "qty": 5}
Object.entries(order);             // order.items()
// A Mongo document IS a JS object:  await Order.findById(id) → { _id, customer, qty }
```

### T19. `tuple`: fixed list
🧠 Ordered, **can't change** (immutable).
🏠 A postcode / GPS point: set once, never edited.
```python
depot = ("Leeds", "LS1 4AP")
depot[0]           # "Leeds"
depot[0] = "York"  # ❌ TypeError: 'tuple' object does not support item assignment
city, postcode = depot     # unpacking
single = ("x",)    # ⚠️ a 1-item tuple NEEDS the comma; ("x") is just a string
```
Use a **tuple** for fixed records, function returns with several values, and dict keys. Use a **list** when the contents change.
🏢 `get_permission()` in `sso_login/decorator.py` returns a tuple: `return user, permissions`.

🟩 **MERN way:** JS has no tuple. Use an array (`const depot = ["Leeds", "LS1 4AP"]`) plus destructuring `const [city, postcode] = depot`, and `Object.freeze(depot)` if it must not change. Returning several values: `return [user, permissions]` (Python: `return user, permissions`).

### T20. `set`: unique items
🧠 **No duplicates**, **no order**, super-fast `in` checks.
🏠 Cities on today's run: London appears 5 times, but you list it once.
```python
cities = {"London", "Leeds", "London"}   # {'London', 'Leeds'}
cities.add("York")
cities.discard("Paris")     # remove, no error if missing
unique = set(["a", "a", "b"])   # remove duplicates from a list
a, b = {1, 2, 3}, {2, 3, 4}
a & b    # {2, 3}       in both          (intersection)
a | b    # {1, 2, 3, 4} in either        (union)
a - b    # {1}          in a, not b      (difference)
```
⚠️ `{}` is an empty **dict**. An empty set is `set()`.
⚠️ Sets have no index: `cities[0]` → TypeError.
🏢 `warehouse_loading_scan.py`: `_TOOLBOX_SCAN_FIELDS = {"is_received", "picked", ...}`, used for `if field in _TOOLBOX_SCAN_FIELDS`.

🟩 **MERN way**
```js
const cities = new Set(["London", "Leeds", "London"]);   // {London, Leeds}
cities.add("York"); cities.has("Leeds"); cities.size;     // in / len
const unique = [...new Set(list)];                        // list(set(list))
const both = [...a].filter(x => b.has(x));                // a & b (no built-in operator)
// Mongo: distinct values
await Order.distinct("city");                             // SQL: SELECT DISTINCT city
```

### T21. Nesting: a list of dicts (the real API shape)
```python
orders = [
    {"id": 101, "customer": "Ravi", "city": "London", "items": ["sofa", "bed"]},
    {"id": 102, "customer": "Sara", "city": "Leeds",  "items": ["table"]},
]
orders[1]["customer"]        # "Sara"
orders[0]["items"][-1]       # "bed"
orders.append({"id": 103, "customer": "Amit", "city": "York", "items": []})
len(orders)                  # 3
```
🟨 Same as JS `orders[1].customer`, but with `["key"]`.
🏢 When FastAPI receives a JSON body or you build a response, this is exactly the shape you work with.

🟩 **MERN way**
```js
const orders = [{ id: 101, customer: "Ravi", items: ["sofa", "bed"] }];
orders[0].items.at(-1);             // "bed"
// In Mongo, nesting is natural: an order DOCUMENT can embed its items array.
// In MySQL (dms-backend), items live in a separate table (OrderProducts) linked by order_id.
```

## 📝 Quiz: Day 2 (Q18–Q27)
**Q18.** `stops = ["a","b","c","d"]`: what is `stops[1:3]`? And `stops[-2]`?
**Q19.** What does this print?
```python
a = [1, 2]
b = a
b.append(3)
print(a)
```
**Q20.** `order = {"id": 1}`: what's the difference between `order["driver"]` and `order.get("driver")`?
**Q21.** What's wrong? `stops = stops.sort()`
**Q22.** Create an empty set. (Careful!)
**Q23.** `print(len({"London", "Leeds", "London"}))`
**Q24.** True or False: you can change `depot[0]` if `depot = ("Leeds", "LS1")`.
**Q25.** `("x")`: what type is it? And `("x",)`?
**Q26.** Using `orders` from T21, write the code to print `"bed"`.
**Q27.** Write: given `order = {"id": 101, "qty": 2}`, print the driver or `"Not assigned"`, then set `qty` to 3 and add `"paid": True` in **one** line.

<details><summary>▶ Answers</summary>

- **Q18.** `["b", "c"]` (stop index 3 not included) · `"c"`
- **Q19.** `[1, 2, 3]`: `b` is the same list, not a copy
- **Q20.** `["driver"]` raises **KeyError**; `.get("driver")` returns `None`
- **Q21.** `.sort()` returns `None`, so `stops` becomes `None`. Use `stops.sort()` alone, or `stops = sorted(stops)`
- **Q22.** `set()` (`{}` is an empty dict)
- **Q23.** `2`
- **Q24.** False: tuples are immutable (TypeError)
- **Q25.** `str` · `tuple`
- **Q26.** `print(orders[0]["items"][-1])` (or `[1]`)
- **Q27.**
```python
print(order.get("driver", "Not assigned"))
order.update({"qty": 3, "paid": True})
```
</details>

---
---

# 📅 Day 3: Loops + comprehensions

### T22. `for` loop + `range()`
🧠 `for x in collection:` visits each item in turn. There's no `i++` counter loop.
🏠 A driver visiting each stop on the run.
```python
for stop in ["sofa", "bed", "table"]:
    print("Deliver", stop)

for i in range(3):        # 0, 1, 2           JS: for (let i=0; i<3; i++)
for i in range(1, 6):     # 1..5 (stop not included)
for i in range(0, 10, 2): # 0, 2, 4, 6, 8 (step 2)
for ch in "SW1A":         # strings are loopable too
```
🟨 Python's `for…in` = JS's `for…of` (values). ⚠️ JS's `for…in` gives **keys**; Python's gives **values**.

🟩 **MERN way**
```js
for (const stop of stops) console.log("Deliver", stop);   // for…of = Python for…in
for (let i = 0; i < 3; i++) {}                             // range(3)
stops.forEach(stop => console.log(stop));
```

### T23. `enumerate()` and `zip()`
```python
for i, stop in enumerate(stops):          # index + value   JS: stops.forEach((stop, i) => ...)
    print(i, stop)
for i, stop in enumerate(stops, start=1): # start counting at 1

ids = [101, 102]; names = ["Ravi", "Sara"]
for order_id, name in zip(ids, names):     # walk two lists together
    print(order_id, name)
```
⚠️ `zip` stops at the **shorter** list.

🟩 **MERN way**
```js
stops.forEach((stop, i) => console.log(i, stop));          // enumerate
for (const [i, stop] of stops.entries()) {}                // enumerate
ids.map((id, i) => [id, names[i]]);                        // zip (no built-in)
```

### T24. `while`, `break`, `continue`, `else`
```python
attempts = 0
while attempts < 3:            # repeat while True
    attempts += 1              # ⚠️ no ++ in Python; use += 1

for order in orders:
    if order["status"] == "cancelled":
        continue               # skip this one, go to the next
    if order["id"] == 999:
        break                  # stop the loop completely
```
💡 `for ... else:` the `else` runs only if the loop **didn't** `break` ("searched and not found").
⚠️ Forgetting `attempts += 1` → an infinite loop (Ctrl+C to stop).

🟩 **MERN way**
```js
let attempts = 0;
while (attempts < 3) { attempts++; }      // ++ exists in JS
for (const o of orders) {
  if (o.status === "cancelled") continue;
  if (o.id === 999) break;
}
```

### T25. Looping over dicts
```python
order = {"id": 101, "customer": "Ravi"}
for key in order:                 # keys
for value in order.values():      # values
for key, value in order.items():  # both ← most common
    print(f"{key}: {value}")
```
⚠️ Don't add or remove keys of a dict **while** looping over it (RuntimeError). Loop over `list(order.items())` instead.
🏢 `gsit/models/order_create_logs.py`: `for k, v in u.items():`

🟩 **MERN way**
```js
for (const key in order) {}                          // keys   (careful: for…in)
for (const [key, value] of Object.entries(order)) {  // order.items()
  console.log(`${key}: ${value}`);
}
```

### T26. List comprehensions
🧠 Build a new list in **one line**: `[expression for item in collection if condition]`.
🏠 "From today's orders, give me the IDs of the London ones."
```python
ids = [o["id"] for o in orders]                          # JS: orders.map(o => o.id)
london = [o for o in orders if o["city"] == "London"]    # JS: orders.filter(...)
london_ids = [o["id"] for o in orders if o["city"] == "London"]   # filter + map
squares = [n * n for n in range(5)]                      # [0, 1, 4, 9, 16]
labels = ["big" if q > 5 else "small" for q in qtys]     # if/else goes BEFORE the for
```
⚠️ Keep them short. If it needs two lines to read, use a normal loop.

🟩 **MERN way**
```js
const ids = orders.map(o => o.id);
const london = orders.filter(o => o.city === "London");
const londonIds = orders.filter(o => o.city === "London").map(o => o.id);
// Mongo can do the filter in the DB instead:
await Order.find({ city: "London" }).select("_id");
```

### T27. dict & set comprehensions
```python
by_id = {o["id"]: o for o in orders}           # lookup table   JS: Object.fromEntries(...)
by_id[102]["customer"]                         # fast lookup by id
cities = {o["city"] for o in orders}           # unique values (a set)
prices = {"sofa": 500, "bed": 300}
with_vat = {k: v * 1.2 for k, v in prices.items()}
```
🏢 Building `{id: row}` lookups to avoid repeated DB queries is very common in dms-backend.

🟩 **MERN way**
```js
const byId = Object.fromEntries(orders.map(o => [o.id, o]));   // {o.id: o for o in orders}
const cities = new Set(orders.map(o => o.city));               // {o.city for o in orders}
```

### T28. Useful built-ins for collections
```python
sum([2, 3, 5])                       # 10
min(qtys), max(qtys)
sum(o["qty"] for o in orders)        # total qty (no [] needed inside sum)
sorted(orders, key=lambda o: o["qty"], reverse=True)   # sort dicts by a field
max(orders, key=lambda o: o["qty"])  # the order with the biggest qty
any(o["urgent"] for o in orders)     # at least one True   JS: .some()
all(o["paid"] for o in orders)       # every one True      JS: .every()
```
(`lambda` = a tiny inline function: T33.)

🟩 **MERN way**
```js
orders.reduce((sum, o) => sum + o.qty, 0);          // sum(o["qty"] for o in orders)
Math.max(...qtys);                                  // max(qtys)
[...orders].sort((a, b) => b.qty - a.qty);          // sorted(..., key=..., reverse=True)
orders.some(o => o.urgent); orders.every(o => o.paid);   // any / all
// Mongo aggregation does sums in the DB:
await Order.aggregate([{ $group: { _id: null, total: { $sum: "$qty" } } }]);
```

## 📝 Quiz: Day 3 (Q28–Q37)
**Q28.** What numbers does `range(2, 8, 2)` give?
**Q29.** What does this print?
```python
for i, s in enumerate(["a", "b"], start=1):
    print(i, s)
```
**Q30.** Python has no `i++`. What do you write instead?
**Q31.** Difference between `break` and `continue`?
**Q32.** Rewrite with a comprehension:
```python
result = []
for o in orders:
    if o["qty"] > 2:
        result.append(o["id"])
```
**Q33.** `{o["city"] for o in orders}`: what type is the result, and why use it?
**Q34.** In JS, `for (const k in ["a","b"])` gives `"0","1"`. What does Python's `for k in ["a","b"]` give?
**Q35.** Write one line that builds `{101: "Ravi", 102: "Sara"}` from `orders`.
**Q36.** How do you sort `orders` by `qty`, biggest first?
**Q37.** Write: loop over `orders`, skip cancelled ones, print `"#101 Ravi - 2 items"` for the rest, and finally print the total qty of the non-cancelled orders.

<details><summary>▶ Answers</summary>

- **Q28.** `2, 4, 6` (8 not included)
- **Q29.** `1 a` then `2 b`
- **Q30.** `i += 1`
- **Q31.** `break` exits the whole loop; `continue` skips to the next item
- **Q32.** `result = [o["id"] for o in orders if o["qty"] > 2]`
- **Q33.** a `set`: the unique cities (duplicates removed)
- **Q34.** the **values** `"a"`, `"b"`
- **Q35.** `{o["id"]: o["customer"] for o in orders}`
- **Q36.** `sorted(orders, key=lambda o: o["qty"], reverse=True)`
- **Q37.**
```python
total = 0
for o in orders:
    if o["status"] == "cancelled":
        continue
    print(f"#{o['id']} {o['customer']} - {o['qty']} items")
    total += o["qty"]
print("Total:", total)
```
💡 Inside an f-string with `"…"`, use single quotes for keys: `o['id']`.
</details>

---
---

# 📅 Day 4: Functions
🏢 **Why it matters:** every API endpoint in dms-backend is a function.

### T29. `def` and `return`
```python
def delivery_fee(total):          # JS: function deliveryFee(total) {
    if total > 1000:
        return 0
    return 100

fee = delivery_fee(650)           # 100
```
- A function with no `return` returns **`None`** (JS returns `undefined`).
- `return a, b` returns a **tuple** → `x, y = func()`.
- The body is indented; `def` ends with `:`.
🏠 A function is a machine at the depot: put an order in, get a label out.

🟩 **MERN way**
```js
function deliveryFee(total) {
  if (total > 1000) return 0;
  return 100;
}
const deliveryFee2 = (total) => (total > 1000 ? 0 : 100);   // arrow function
// no return → undefined (Python: None)
```

### T30. Parameters: defaults & keyword arguments
```python
def make_label(customer, qty=1, express=False):
    return f"{customer} x{qty}{' EXPRESS' if express else ''}"

make_label("Ravi")                        # positional + defaults
make_label("Ravi", 3)
make_label("Ravi", express=True)          # keyword argument: skip qty
make_label(qty=2, customer="Sara")        # any order when using names
```
⚠️ Parameters with defaults must come **after** those without.
⚠️ **Mutable default trap:**
```python
def add_stop(stop, stops=[]):     # ❌ the SAME list is reused on every call!
def add_stop(stop, stops=None):   # ✅
    if stops is None:
        stops = []
```
🏢 `def retrieve_order(request: Request, order_id: int, db: Session = Depends(get_db), ...)`: defaults everywhere.

🟩 **MERN way:** JS has defaults but **no keyword arguments**, so people pass an options object:
```js
function makeLabel(customer, { qty = 1, express = false } = {}) { ... }
makeLabel("Ravi", { express: true });      // Python: make_label("Ravi", express=True)
```

### T31. `*args` and `**kwargs`
```python
def total(*prices):                # any number of positional args → a TUPLE
    return sum(prices)
total(10, 20, 30)                  # 60      JS: function total(...prices)

def log_event(event, **details):   # any number of keyword args → a DICT
    print(event, details)
log_event("delivered", order_id=101, driver="Amit")
# delivered {'order_id': 101, 'driver': 'Amit'}

nums = [1, 2]; opts = {"qty": 3}
total(*nums)                       # unpack a list into args    JS: f(...nums)
make_label("Ravi", **opts)         # unpack a dict into keyword args
```
🏢 Decorators in dms-backend use `def wrapper(*args, **kwargs):` to pass **anything** through (Day 10).

🟩 **MERN way**
```js
function total(...prices) { return prices.reduce((a, b) => a + b, 0); }   // *args
function logEvent(event, details = {}) {}                                  // **kwargs ≈ options object
total(...nums);                                                            // f(*nums)
// Express middleware passes everything through: (req, res, next) => next()
```

### T32. Scope
```python
COMPANY = "BJS"            # global (module level)
def f():
    x = 1                  # local: only exists inside f
    print(COMPANY)         # reading a global is fine
```
⚠️ Assigning to a global inside a function creates a **new local** unless you write `global COMPANY` (avoid this; pass values in and return them instead).
🟨 Python has **no block scope**: a variable made inside `if`/`for` is visible after it, in the same function.

🟩 **MERN way:** JS `let`/`const` are **block-scoped** (`if (x) { let y }` → y not visible outside); Python has **function scope** only. Module-level variables in Node are private to the file unless exported.

### T33. `lambda`
```python
square = lambda x: x * x                         # JS: const square = x => x * x
sorted(orders, key=lambda o: o["qty"])
```
Only **one expression**, with no statements. For anything bigger, use `def`.
🏢 `default=lambda: datetime.now(timezone.utc)` in `timestampmixin.py`: a function called each time a row is created.

🟩 **MERN way:** arrow functions are much more powerful than Python lambdas: they can have full bodies `x => { ...; return y; }`. Python `lambda` = one expression only.

### T34. Docstrings & clean functions
```python
def delivery_fee(total: float) -> int:
    """Return the delivery fee in pounds for an order total."""
    ...
```
- The first string inside a function = its **docstring** (shown by `help()` and editors).
- One function = one job. Name it with a verb: `get_order`, `calculate_fee`.
🏢 `retrieve_order` in `order/routers/v0/get.py` has a long docstring with Parameters/Returns/Raises.

🟩 **MERN way**
```js
/**
 * Return the delivery fee for an order total.
 * @param {number} total
 * @returns {number}
 */
function deliveryFee(total) {}
```

## 📝 Quiz: Day 4 (Q38–Q47)
**Q38.** What does a function return if it has no `return`?
**Q39.** What does `make_label("Ravi", express=True)` mean? Which parameter got the default?
**Q40.** Is this valid? `def f(a=1, b):`
**Q41.** Inside `def f(*args)`, what type is `args`? And `kwargs` inside `def f(**kwargs)`?
**Q42.** What's the bug?
```python
def add_item(item, cart=[]):
    cart.append(item)
    return cart
```
**Q43.** `def pair(): return 1, 2`. How do you get both values into `a` and `b`?
**Q44.** Convert to a lambda: `def double(x): return x * 2`
**Q45.** What does `f(*[1, 2, 3])` do?
**Q46.** In JS, `if (true) { let x = 1 }` → `x` is not visible outside. In Python, after `if True: x = 1`, is `x` visible?
**Q47.** Write `calculate_total(qty, unit_price, coupon=None, express=False)` that returns the total: 10% off if there's a coupon, plus 150 if express.

<details><summary>▶ Answers</summary>

- **Q38.** `None`
- **Q39.** keyword argument `express=True`; `qty` used its default `1`
- **Q40.** ❌ SyntaxError: defaults must come after non-defaults
- **Q41.** `tuple` · `dict`
- **Q42.** mutable default: the same list is shared between calls. Use `cart=None` and create a list inside.
- **Q43.** `a, b = pair()`
- **Q44.** `double = lambda x: x * 2`
- **Q45.** unpacks the list: same as `f(1, 2, 3)`
- **Q46.** ✅ yes: no block scope in Python
- **Q47.**
```python
def calculate_total(qty, unit_price, coupon=None, express=False):
    total = qty * unit_price
    if coupon:
        total *= 0.9
    if express:
        total += 150
    return total
```
</details>

---
---

# 📅 Day 5: Errors & exceptions
🏢 **Why it matters:** every dms-backend route uses `try/except` and returns 404/400 errors.

### T35. What an exception is
🧠 An error that **stops** the program unless you **catch** it.
🏠 A parcel is damaged: either someone handles it (catch), or the whole line stops (crash).
Common ones: `ValueError`, `TypeError`, `KeyError`, `IndexError`, `ZeroDivisionError`, `FileNotFoundError`, `AttributeError` (`None.upper()`).

🟩 **MERN way:** JS has fewer built-in error types (`Error`, `TypeError`, `RangeError`, `SyntaxError`). Reading a missing key or index gives `undefined`, not an error. Python raises `KeyError`/`IndexError` instead.

### T36. `try` / `except` / `else` / `finally`
```python
try:
    qty = int(user_input)
except ValueError:                       # catch a SPECIFIC error
    qty = 1
except (KeyError, TypeError) as e:       # several types; e = the error object
    print("Problem:", e)
else:
    print("ran only if NO error")
finally:
    print("ALWAYS runs (cleanup)")       # JS: finally
```
🟨 JS: `try {} catch (e) {}` catches **everything**. Python catches **by type**.
⚠️ Avoid a bare `except:` or a broad `except Exception:` that hides bugs. If you must, **log** it.
⚠️ Order matters: put specific exceptions before general ones.

🟩 **MERN way**
```js
try {
  const qty = Number(input);
  if (Number.isNaN(qty)) throw new Error("bad qty");
} catch (e) {                 // catches EVERYTHING — check type by hand:
  if (e instanceof TypeError) {}
} finally {
  cleanup();
}
// Express async route: wrap in try/catch or use express-async-errors
```

### T37. `raise`
```python
def set_qty(qty):
    if qty <= 0:
        raise ValueError("qty must be positive")     # JS: throw new Error(...)
    return qty

try:
    ...
except ValueError:
    raise                         # re-raise the same error after logging it
```

🟩 **MERN way:** `throw new Error("qty must be positive")` · re-throw: `catch (e) { log(e); throw e; }`.

### T38. Custom exceptions
```python
class OrderNotFound(Exception):
    pass

raise OrderNotFound(f"Order {order_id} not found")
```
🧠 A class that **inherits** from `Exception` (classes: Day 8). Callers can catch exactly this case.

🟩 **MERN way**
```js
class OrderNotFound extends Error {
  constructor(msg) { super(msg); this.name = "OrderNotFound"; this.status = 404; }
}
throw new OrderNotFound(`Order ${id} not found`);
```

### T39. Errors in FastAPI
```python
from fastapi import HTTPException, status

if not order:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
```
- FastAPI turns `HTTPException` into a JSON response: `{"detail": "Order not found"}` with status 404.
- An uncaught exception → **500 Internal Server Error**.
🏢 `retrieve_order` (`order/routers/v0/get.py`) sets `response.status_code = 404` and returns `CustomResponseSchema(code=404, error="Order Not Found")`. That's the team's **custom response style**; follow whichever pattern the file you're editing already uses.

🟩 **MERN way**
```js
// Express
router.get("/orders/:id", async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ detail: "Order not found" });   // FastAPI: raise HTTPException(404)
  res.json(order);
});
// central error handler (≈ FastAPI exception handlers)
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
```

## 📝 Quiz: Day 5 (Q48–Q55)
**Q48.** Which exception does `int("abc")` raise? And `{"a": 1}["b"]`?
**Q49.** When does the `finally` block run?
**Q50.** When does the `else` block of a `try` run?
**Q51.** What's the JS `throw new Error("x")` in Python?
**Q52.** Why is `except:` (bare) bad?
**Q53.** What HTTP status does FastAPI return for an uncaught exception?
**Q54.** Fix it so that bad input prints `"Invalid qty"` instead of crashing: `qty = int(input("Qty: "))`
**Q55.** Write `get_order(orders, order_id)` that returns the matching dict or raises `ValueError(f"Order {order_id} not found")`.

<details><summary>▶ Answers</summary>

- **Q48.** `ValueError` · `KeyError`
- **Q49.** always: error or not
- **Q50.** only when the `try` block raised **no** error
- **Q51.** `raise Exception("x")` (better: a specific type like `ValueError`)
- **Q52.** it catches everything, even typos and Ctrl+C, and hides real bugs
- **Q53.** 500
- **Q54.**
```python
try:
    qty = int(input("Qty: "))
except ValueError:
    print("Invalid qty")
```
- **Q55.**
```python
def get_order(orders, order_id):
    for o in orders:
        if o["id"] == order_id:
            return o
    raise ValueError(f"Order {order_id} not found")
```
</details>

---
---

# 📅 Day 6: Modules, imports, pip, venv, Poetry

### T40. Importing
```python
import json                          # whole module → json.dumps(...)
from datetime import datetime        # one name     → datetime.now()
from typing import List, Optional    # several names
import pandas as pd                  # alias
```
| JS (ES modules) | Python |
|---|---|
| `import fs from "fs"` | `import os` |
| `import { a, b } from "./x"` | `from x import a, b` |
| `import * as pd from "pandas"` | `import pandas as pd` |
| `export` | nothing needed: every top-level name is importable |
⚠️ Avoid `from x import *` (you can't tell where names came from).

🟩 **MERN way**
```js
import express from "express";            // import json
import { readFile } from "fs/promises";   // from x import a
import * as path from "path";             // import pandas as pd
export function fee() {}                  // Python: no export needed
// CommonJS (older Node): const express = require("express"); module.exports = {...}
```

### T41. Packages, `__init__.py`, absolute imports
🧠 **module** = one `.py` file · **package** = a folder with an `__init__.py` file (like `index.js`).
🏢 dms-backend uses **absolute imports from `app`**:
```python
from app.dependencies.config.database import get_db
from app.services.order.models.escalation_reasons import EscalationReasons
```
`app/services/order/routers/v0/get.py` maps to the import path `app.services.order.routers.v0.get` (dots instead of slashes, no `.py`).
⚠️ A circular import (A imports B, B imports A) causes `ImportError`. Move shared code into a third module.

🟩 **MERN way:** a folder with `index.js` ≈ a package with `__init__.py`. Typical MERN layout: `routes/`, `controllers/`, `models/`, `middleware/`. dms-backend: `app/services/<module>/{routers, models, schemas, helpers}`.

### T42. `if __name__ == "__main__":`
```python
def main():
    print("running")

if __name__ == "__main__":     # True only when this file is RUN directly
    main()                     # False when it's IMPORTED by another file
```
🟨 Like Node's `if (require.main === module)`.
🏢 Seeder: `python app/dependencies/seeder/seed.py` (with `PYTHONPATH` set so `app.` imports work).

🟩 **MERN way:** CommonJS: `if (require.main === module) main();` · ES modules: compare `import.meta.url` with the file in `process.argv[1]`. In practice, MERN projects keep the "start" code in a separate `server.js` / `index.js`, and that's what `npm start` runs.

### T43. pip & virtual environments
🧠 **pip** installs packages. A **virtual env (venv)** is a private folder of packages for **one project**, so projects don't clash.
```bash
python3 -m venv .venv          # create      (like a local node_modules)
source .venv/bin/activate      # activate    (the prompt shows (.venv))
pip install requests           # install into the venv only
pip freeze > requirements.txt  # list installed packages
deactivate
```
⚠️ Never `sudo pip install`: it breaks the system Python.

🟩 **MERN way:** Node doesn't need a venv, because `node_modules/` is already per-project. `npm install` = `pip install` inside an active venv. Global installs: `npm i -g` (avoid, like `sudo pip`).

### T44. Poetry (what dms-backend uses)
| npm | Poetry |
|---|---|
| `package.json` | `pyproject.toml` |
| `package-lock.json` | `poetry.lock` |
| `npm install` | `poetry install` |
| `npm install x` | `poetry add x` |
| `npm run dev` | `poetry run uvicorn app.main:app --reload` |
| `npx x` | `poetry run x` |
```bash
cd ~/Documents/BJS/PROJECTS/backend/dms-backend
poetry env use python3.12
poetry install
poetry env info          # where the venv is
poetry run python -c "import fastapi; print(fastapi.__version__)"
```
🏢 `pyproject.toml` lists fastapi, sqlalchemy, alembic, celery, redis, pydantic and more. Python `^3.12`.

🟩 **MERN way**
```bash
npm install            # poetry install
npm install express    # poetry add fastapi
npm run dev            # poetry run uvicorn app.main:app --reload
npx jest               # poetry run pytest
```

## 📝 Quiz: Day 6 (Q56–Q63)
**Q56.** What makes a folder a Python package?
**Q57.** Write the import for `get_db` from `app/dependencies/config/database.py`.
**Q58.** What is `__name__` when a file is imported rather than run?
**Q59.** Why use a virtual environment?
**Q60.** Poetry's equivalent of `package-lock.json`?
**Q61.** How do you run uvicorn with the project's venv using Poetry?
**Q62.** Difference between `import json` and `from json import dumps`?
**Q63.** What's wrong with `sudo pip install fastapi`?

<details><summary>▶ Answers</summary>

- **Q56.** an `__init__.py` file inside it
- **Q57.** `from app.dependencies.config.database import get_db`
- **Q58.** the module's import name (e.g. `"app.utils.x"`), not `"__main__"`
- **Q59.** each project gets its own package versions, with no clashes and no system breakage
- **Q60.** `poetry.lock`
- **Q61.** `poetry run uvicorn app.main:app --reload`
- **Q62.** the first gives you `json.dumps(...)`; the second gives you `dumps(...)` directly
- **Q63.** it installs into the system Python, which can break the OS. Use a venv/Poetry
</details>

---
---

# 📅 Day 7: Files + JSON + Week-1 test

### T45. Reading & writing files with `with`
```python
with open("orders.txt", "w") as f:        # w = write (overwrite) · a = append · r = read (default)
    f.write("101,Ravi\n")

with open("orders.txt") as f:
    for line in f:                        # line by line (memory-friendly)
        print(line.strip())               # strip() removes the trailing \n
```
🧠 `with` **closes the file automatically**, even after an error (more on `with`: T68).
🟨 Node: `fs.readFileSync` / `fs.writeFileSync`.
⚠️ `"w"` erases the file first! Add `encoding="utf-8"` for non-English text.

🟩 **MERN way**
```js
import { readFile, writeFile, appendFile } from "fs/promises";
await writeFile("orders.txt", "101,Ravi\n");       // "w"
await appendFile("orders.txt", "102,Sara\n");      // "a"
const text = await readFile("orders.txt", "utf8"); // "r"
// Node streams handle big files line by line (like `for line in f`)
```

### T46. JSON
```python
import json
text = '{"id": 101, "driver": null, "paid": true}'
data = json.loads(text)        # str → dict   {'id': 101, 'driver': None, 'paid': True}
back = json.dumps(data)        # dict → str   JS: JSON.stringify
json.dumps(data, indent=2)     # pretty

with open("orders.json") as f:
    orders = json.load(f)      # file → Python      (no s = file)
with open("out.json", "w") as f:
    json.dump(orders, f, indent=2)
```
| JSON | Python |
|---|---|
| object `{}` | `dict` |
| array `[]` | `list` |
| `null` / `true` / `false` | `None` / `True` / `False` |
⚠️ `json.dumps` fails on `datetime` and `Decimal` → convert them first (`str(x)`), or use `default=str`.
🏢 `department.py`: `redis_client.set(key, json.dumps(...))` and `json.loads(redis_client.get(key))`.

🟩 **MERN way**
```js
const data = JSON.parse(text);           // json.loads
const back = JSON.stringify(data, null, 2);   // json.dumps(data, indent=2)
// Express: express.json() parses request bodies; res.json() sends JSON (FastAPI does both for you)
// Dates: JSON.stringify(new Date()) works (ISO string) — Python's json.dumps(datetime) fails
```

### T47. `pathlib`
```python
from pathlib import Path
p = Path("data") / "orders.json"      # join paths with /
p.exists(); p.read_text(); p.write_text("hi"); p.suffix   # ".json"
Path(__file__).parent                 # the folder of the current file
```
🏢 `escalation_reasons.py` imports `Path` and `get_project_root()` to locate seed JSON files.

🟩 **MERN way:** `import path from "path"; path.join("data", "orders.json"); path.extname(f)` · current folder: `__dirname` (CommonJS) or `import.meta.dirname` (ESM). Python: `Path("data") / "orders.json"`, `Path(__file__).parent`.

## 📝 Quiz: Day 7 (Q64–Q70)
**Q64.** Why use `with open(...)` instead of `f = open(...)`?
**Q65.** Difference between `json.loads` and `json.load`?
**Q66.** What does JSON `null` become in Python?
**Q67.** What does mode `"w"` do to an existing file?
**Q68.** `json.dumps({"at": datetime.now()})` fails. Why, and what's the fix?
**Q69.** How do you build the path `data/orders.json` with pathlib?
**Q70.** ⭐ **Week-1 test** (Days 1–7). Write `example/week1.py`:
1. Load `orders.json` (create it: a list of 5 orders with `id`, `customer`, `city`, `qty`, `status`).
2. Skip cancelled orders.
3. Group by city: `{"London": 6, "Leeds": 1}` (total qty per city).
4. Write a function `fee(qty)` (qty > 5 → 0, else 50) and print each city with its total and fee.
5. Handle a missing file with `try/except FileNotFoundError`.
6. Save the summary to `summary.json`.

<details><summary>▶ Answers</summary>

- **Q64.** the file always gets closed, even if an error happens
- **Q65.** `loads` reads from a **string**; `load` reads from a **file**
- **Q66.** `None`
- **Q67.** empties it first (overwrites)
- **Q68.** a datetime isn't JSON-serialisable → `json.dumps(data, default=str)` or `.isoformat()`
- **Q69.** `Path("data") / "orders.json"`
- **Q70.** a reviewed solution goes here after you write it ✍️
</details>

---
---

# 📅 Day 8: Classes & OOP
🏢 **Why it matters:** every database table in dms-backend is a class (`class EscalationReasons(TimestampMixin, Module)`), and so is every schema.

### T48. `class`, `__init__`, `self`
🧠 A **class** is a blueprint; an **object (instance)** is one thing built from it.
🏠 "Order form" is the class; order #101 filled in for Ravi is an instance.
```python
class Order:
    def __init__(self, order_id, customer, qty=1):   # constructor   JS: constructor(...)
        self.order_id = order_id                       # self = this object   JS: this
        self.customer = customer
        self.qty = qty

o = Order(101, "Ravi", 2)      # no `new` keyword!
o.customer                     # "Ravi"  ← dot access on objects (unlike dicts)
```
| JS | Python |
|---|---|
| `constructor(a)` | `def __init__(self, a)` |
| `this.a` | `self.a` |
| `new Order(1)` | `Order(1)` |
⚠️ `self` must be the **first parameter** of every method, written explicitly. Forgetting it → `TypeError: takes 0 positional arguments but 1 was given`.

🟩 **MERN way**
```js
class Order {
  constructor(orderId, customer, qty = 1) {   // __init__
    this.orderId = orderId;                   // self.order_id
    this.customer = customer;
    this.qty = qty;
  }
}
const o = new Order(101, "Ravi", 2);          // needs `new` (Python doesn't)
```
In MERN you rarely write classes for data: a **Mongoose model** is your class (`new Order({...})`). In dms-backend, a **SQLAlchemy model** class plays that role.

### T49. Methods
```python
class Order:
    def __init__(self, qty, unit_price):
        self.qty = qty
        self.unit_price = unit_price

    def total(self):                      # method = a function inside a class
        return self.qty * self.unit_price

    def add_items(self, n):
        self.qty += n                     # changes this object

o = Order(2, 50); o.add_items(1); o.total()   # 150
```

🟩 **MERN way**
```js
class Order {
  constructor(qty, unitPrice) { this.qty = qty; this.unitPrice = unitPrice; }
  total() { return this.qty * this.unitPrice; }     // no `self` parameter needed
}
// Mongoose: instance methods
orderSchema.methods.total = function () { return this.qty * this.unitPrice; };
```

### T50. Class vs instance attributes
```python
class Order:
    __tablename__ = "Orders"      # CLASS attribute: shared by all orders
    def __init__(self, qty):
        self.qty = qty            # INSTANCE attribute: one per order
```
⚠️ Never use a mutable class attribute (`items = []`) for per-object data: it's shared by every instance.
🏢 SQLAlchemy models use class attributes: `id = Column(Integer, primary_key=True)` (T107).

🟩 **MERN way:** `static tableName = "Orders";` (class field shared by all) vs `this.qty` (per instance). Mongoose: `orderSchema.statics.findByCity = function (c) {...}` for class-level helpers.

### T51. Inheritance & `super()`
```python
class Job:
    def __init__(self, job_id):
        self.job_id = job_id
    def describe(self):
        return f"Job {self.job_id}"

class Delivery(Job):                      # Delivery IS A Job   JS: class Delivery extends Job
    def __init__(self, job_id, address):
        super().__init__(job_id)          # run the parent's __init__
        self.address = address
    def describe(self):                   # override
        return super().describe() + f" to {self.address}"
```
`isinstance(d, Job)` → True.

🟩 **MERN way**
```js
class Delivery extends Job {                  // class Delivery(Job)
  constructor(jobId, address) {
    super(jobId);                             // super().__init__(job_id)
    this.address = address;
  }
  describe() { return `${super.describe()} to ${this.address}`; }
}
```

### T52. Multiple inheritance & mixins
🧠 Python lets a class inherit from **several** parents. A **mixin** is a small class that only adds some reusable fields or methods.
🏢 `app/dependencies/timestampmixin.py`:
```python
class ClientMixin:
    __abstract__ = True
    client_id = Column(Integer, index=True)

class TimestampMixin(Base, BaseMixin, ClientMixin):
    __abstract__ = True                 # no table of its own
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc)...)
    created_by = Column(String(length=500))
    updated_at = ...; updated_by = ...

class EscalationReasons(TimestampMixin, Module):   # gets all those columns for free
```
🟨 JS classes can only `extend` one parent; mixins in JS are done by hand.

🟩 **MERN way:** JS has single inheritance only. Sharing fields like Python mixins is done with **Mongoose plugins** or schema options:
```js
const orderSchema = new Schema({ ... }, { timestamps: true });   // adds createdAt / updatedAt
// ≈ dms-backend TimestampMixin (created_at, updated_at, created_by, ...)
schema.plugin(softDeletePlugin);                                   // ≈ a soft-delete mixin
```

### T53. Dunder (magic) methods
```python
class Order:
    def __init__(self, oid): self.oid = oid
    def __repr__(self):  return f"Order({self.oid})"   # how it looks when printed/debugged
    def __eq__(self, other): return self.oid == other.oid   # what == means
    def __len__(self): ...                              # what len() means
```
"Dunder" = **d**ouble **under**score. They're what makes `print(o)`, `==` and `len(o)` work.

🟩 **MERN way:** JS has a few equivalents: `toString()` (≈ `__str__`), `toJSON()` (controls `JSON.stringify`/`res.json`), `[Symbol.iterator]` (≈ `__iter__`). There's **no** operator overloading (`==` can't be customised).

### T54. `@staticmethod`, `@classmethod`, `@property`
```python
class Order:
    VAT = 0.2
    def __init__(self, net): self.net = net

    @property
    def gross(self):                 # called like an attribute: o.gross (no ())
        return self.net * (1 + self.VAT)

    @classmethod
    def from_dict(cls, d):           # cls = the class → an alternative constructor
        return cls(d["net"])

    @staticmethod
    def is_valid_postcode(pc):       # no self/cls: just a function grouped in the class
        return len(pc) >= 5
```
🏢 `EscalationReasons.last_perform_seeder_date()` is a `@staticmethod`; `gsit/models/microservice_keys.py` uses `@classmethod`.

🟩 **MERN way**
```js
class Order {
  static VAT = 0.2;
  get gross() { return this.net * (1 + Order.VAT); }   // @property → o.gross
  static fromObject(d) { return new Order(d.net); }     // @classmethod
  static isValidPostcode(pc) { return pc.length >= 5; } // @staticmethod
}
// Mongoose: virtuals ≈ @property
orderSchema.virtual("gross").get(function () { return this.net * 1.2; });
```

## 📝 Quiz: Day 8 (Q71–Q80)
**Q71.** What's Python's version of `this`? And of `constructor`?
**Q72.** How do you create an object: `new Order(1)` or `Order(1)`?
**Q73.** What error do you get if you forget `self` in `def total():`?
**Q74.** Class attribute vs instance attribute: which one is shared by all objects?
**Q75.** What does `super().__init__(job_id)` do?
**Q76.** What is a mixin? Name the one used by most dms-backend models.
**Q77.** How do you call a `@property` called `gross`?
**Q78.** Which method controls what `print(obj)` shows?
**Q79.** What's the difference between `@classmethod` and `@staticmethod`?
**Q80.** Write a `Driver` class: `name`, `van`, `jobs` (empty list per driver); `assign(job_id)` adds a job; `@property is_busy` is True when there are 3+ jobs; `__repr__` gives `Driver(Amit, 2 jobs)`.

<details><summary>▶ Answers</summary>

- **Q71.** `self` · `__init__`
- **Q72.** `Order(1)`: no `new`
- **Q73.** `TypeError: total() takes 0 positional arguments but 1 was given`
- **Q74.** the class attribute
- **Q75.** runs the parent class's `__init__` so it sets up its own attributes
- **Q76.** a small class that adds reusable fields/methods · `TimestampMixin`
- **Q77.** `o.gross` (no brackets)
- **Q78.** `__repr__` (or `__str__`)
- **Q79.** classmethod gets the class (`cls`), so it's used for alternative constructors; staticmethod gets nothing
- **Q80.**
```python
class Driver:
    def __init__(self, name, van):
        self.name = name
        self.van = van
        self.jobs = []
    def assign(self, job_id):
        self.jobs.append(job_id)
    @property
    def is_busy(self):
        return len(self.jobs) >= 3
    def __repr__(self):
        return f"Driver({self.name}, {len(self.jobs)} jobs)"
```
</details>

---
---

# 📅 Day 9: Type hints
🏢 **Why it matters:** FastAPI **reads your type hints** to validate requests and build the docs.

### T55. Basic type hints
```python
order_id: int = 101
customer: str = "Ravi"
def fee(total: float, express: bool = False) -> int:   # -> = return type
    ...
```
🧠 Hints **don't change how Python runs** (no runtime error if you pass the wrong type). They help your editor, mypy (`make lint`) and **FastAPI/Pydantic**, which **do** enforce them.
🟨 Very close to TypeScript: `function fee(total: number): number`.

🟩 **MERN way:** this is **TypeScript**:
```ts
let orderId: number = 101;
function fee(total: number, express: boolean = false): number { ... }
```
Like Python, TS types disappear at runtime. The difference: FastAPI/Pydantic **do** use Python hints at runtime for validation.

### T56. `Optional`, `Union`, `|`
```python
from typing import Optional, Union
driver: Optional[str] = None     # str OR None       TS: string | null
qty: Union[int, float]           # int OR float      TS: number
driver: str | None = None        # modern syntax (Python 3.10+), same meaning
```
⚠️ `Optional[str]` means **"can be None"**. It does NOT make a parameter optional; the default value `= None` does that.

🟩 **MERN way:** `let driver: string | null = null;` · `qty: number` (no int/float split) · optional property: `driver?: string`.

### T57. Collection types
```python
from typing import List, Dict, Tuple, Set
ids: List[int] = [1, 2]             # or list[int] (modern)
order: Dict[str, int] = {"qty": 2}  # or dict[str, int]
point: Tuple[float, float]          # exactly 2 floats
tags: Set[str]
```
🏢 `customer_ids: Optional[List[int]] = Depends(fetch_accessible_customer_ids)` in `retrieve_order`.

🟩 **MERN way:** `ids: number[]` · `order: Record<string, number>` · `point: [number, number]` (tuple type) · `tags: Set<string>`.

### T58. `Any`, `Callable`, type aliases
```python
from typing import Any, Callable
data: Any                           # anything (TS: any). Use rarely
handler: Callable[[int], str]       # a function taking an int, returning a str
OrderDict = Dict[str, Any]          # alias: a short name for a long type
```
🏢 `def check_permission(...) -> Callable:` returns a decorator function (Day 10).

🟩 **MERN way:** `any` · `(n: number) => string` (Callable) · `type OrderDict = Record<string, unknown>` (alias).

### T59. How FastAPI uses hints
```python
@router.get("/{order_id}")
def retrieve_order(order_id: int, page: int = 1, search: Optional[str] = None):
```
- `/orders/abc` → FastAPI sees `int`, fails validation → **422** response automatically.
- `?page=2` → the text `"2"` is converted to the int `2` for you.
- Hints also generate the **Swagger docs** at `/docs`.

🟩 **MERN way:** TS types alone **don't validate requests**. In Express you add a validator:
```js
import { z } from "zod";
const Params = z.object({ orderId: z.coerce.number().int() });
const { orderId } = Params.parse(req.params);   // throws → you send 400/422 yourself
```
FastAPI does that automatically from `order_id: int`.

## 📝 Quiz: Day 9 (Q81–Q88)
**Q81.** Does `x: int = "hello"` crash when run with plain Python?
**Q82.** What does `-> int` mean in `def fee(...) -> int:`?
**Q83.** Write the hint for "a string or None" in two ways.
**Q84.** True or False: `Optional[str]` alone makes the parameter optional.
**Q85.** Hint for a list of order IDs? For a dict of name → qty?
**Q86.** What does FastAPI return if `order_id: int` receives `"abc"`?
**Q87.** What is `Callable[[int], str]`?
**Q88.** Add type hints: `def calculate_total(qty, unit_price, coupon=None, express=False):`

<details><summary>▶ Answers</summary>

- **Q81.** No: hints aren't enforced by Python itself
- **Q82.** the function returns an int
- **Q83.** `Optional[str]` · `str | None`
- **Q84.** False: the default `= None` makes it optional
- **Q85.** `List[int]` (or `list[int]`) · `Dict[str, int]`
- **Q86.** 422 Unprocessable Entity (validation error)
- **Q87.** a function that takes one int and returns a str
- **Q88.** `def calculate_total(qty: int, unit_price: float, coupon: Optional[str] = None, express: bool = False) -> float:`
</details>

---
---

# 📅 Day 10: Decorators
🏢 **Why it matters:** `@router.get(...)`, `@check_permission(...)`, `@staticmethod` and `@celery.task` are all decorators.

### T60. Functions are values
```python
def shout(text): return text.upper()
yell = shout              # no () → the function itself, not a call
yell("hi")                # "HI"
def apply(fn, value): return fn(value)
apply(shout, "go")        # pass a function as an argument
```
🟨 Same as JS: functions are first-class.

🟩 **MERN way:** identical idea: `const yell = shout; arr.map(shout);`. Express handlers are functions passed as values: `router.get("/x", handler)`.

### T61. Closures (a function inside a function)
```python
def make_fee(amount):
    def fee(order):              # inner function remembers `amount`
        return amount
    return fee                   # return the function, not a call

express_fee = make_fee(150)
express_fee({"id": 1})           # 150
```

🟩 **MERN way**
```js
const makeFee = (amount) => (order) => amount;   // closure
const expressFee = makeFee(150);
// React hooks are full of closures: useCallback(() => setQty(qty + 1), [qty])
```

### T62. Writing a decorator
🧠 A decorator is a function that **takes a function and returns a new function** that wraps it with extra behaviour.
🏠 Gift-wrapping a parcel: the parcel (your function) is unchanged, but there's an extra layer around it (logging, timing, permission check).
```python
import time
def timer(fn):
    def wrapper(*args, **kwargs):        # accept ANY arguments
        start = time.time()
        result = fn(*args, **kwargs)     # call the original
        print(f"{fn.__name__} took {time.time() - start:.3f}s")
        return result                    # don't forget to return!
    return wrapper

@timer                    # same as: load_orders = timer(load_orders)
def load_orders():
    ...
```
🟨 Like a React **Higher-Order Component**: `withAuth(Component)`.

🟩 **MERN way:** JS has no `@decorator` for plain functions (TS has experimental class decorators). You **wrap** by hand: a Higher-Order Function, or Express **middleware**:
```js
const timer = (fn) => async (...args) => {
  const start = Date.now();
  const result = await fn(...args);
  console.log(`${fn.name} took ${Date.now() - start}ms`);
  return result;
};
const loadOrdersTimed = timer(loadOrders);        // ≈ @timer
// React: withAuth(Component) is the same pattern (HOC)
```

### T63. `functools.wraps`
```python
import functools
def timer(fn):
    @functools.wraps(fn)          # keeps fn's name, docstring and signature
    def wrapper(*args, **kwargs):
        ...
```
⚠️ Without `@wraps`, FastAPI sees `wrapper` instead of your function's parameters, which breaks routes. dms-backend always uses it.

🟩 **MERN way:** no direct equivalent; wrapped functions lose their `.name` unless you copy it (`Object.defineProperty(wrapper, "name", { value: fn.name })`). Express doesn't inspect handler signatures, so it doesn't matter there. FastAPI does, which is why `@wraps` matters.

### T64. Decorators with arguments (`check_permission`)
🧠 Three layers: **arguments → decorator → wrapper**.
🏢 Simplified from `app/services/sso_login/decorator.py`:
```python
def check_permission(primary_permission, fallback_permissions=None):   # 1. takes the arguments
    def decorator(func):                                               # 2. takes the function
        @functools.wraps(func)
        def wrapper(*args, **kwargs):                                  # 3. runs on each call
            request = args[0] if args else kwargs.get("request")
            all_permissions = [primary_permission] + (fallback_permissions or [])
            # ... if the user has none of them → 403 response
            return func(*args, **kwargs)
        return wrapper
    return decorator

@router.get("/{order_id}")
@check_permission("dms.order.view.read", ["dms.portal.order.view.read"])
def retrieve_order(request: Request, order_id: int, ...):
```
⚠️ **Order matters:** decorators apply from the bottom up. `@router.get` must be on top, so the route registers the **permission-checked** function.
⚠️ The route **must accept `request: Request`**, otherwise `check_permission` returns 400 "Request object is missing".

🟩 **MERN way:** permission checks are **middleware factories** (a function returning middleware), the same 3-layer idea:
```js
const checkPermission = (perm, fallbacks = []) => (req, res, next) => {
  const all = [perm, ...fallbacks];
  if (!all.some(p => req.user.permissions.includes(p)))
    return res.status(403).json({ error: "Forbidden" });
  next();
};
router.get("/orders/:id", checkPermission("dms.order.view.read"), getOrder);
// ≈ @check_permission("dms.order.view.read") in dms-backend
```

## 📝 Quiz: Day 10 (Q89–Q96)
**Q89.** `yell = shout` vs `yell = shout()`: what's the difference?
**Q90.** In one sentence: what is a decorator?
**Q91.** `@timer` above `def f()` is the same as which line of code?
**Q92.** Why does `wrapper` use `*args, **kwargs`?
**Q93.** What goes wrong if `wrapper` forgets `return fn(*args, **kwargs)` and only calls it?
**Q94.** Why use `@functools.wraps(fn)`?
**Q95.** How many nested functions does a decorator **with arguments** need?
**Q96.** Write a `@log_call` decorator that prints `Calling <name> with <args>` before running the function, and returns its result.

<details><summary>▶ Answers</summary>

- **Q89.** the first assigns the function itself; the second calls it and stores the result
- **Q90.** a function that takes a function and returns a wrapped version with extra behaviour
- **Q91.** `f = timer(f)`
- **Q92.** to accept and pass on any arguments, whatever the original function needs
- **Q93.** the decorated function always returns `None`
- **Q94.** keeps the original name/docstring/signature (FastAPI needs the signature)
- **Q95.** three: args → decorator → wrapper
- **Q96.**
```python
import functools
def log_call(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        print(f"Calling {fn.__name__} with {args} {kwargs}")
        return fn(*args, **kwargs)
    return wrapper
```
</details>

---
---

# 📅 Day 11: Iterators, generators, `with`

### T65. Iterables & iterators
🧠 An **iterable** is anything a `for` loop can walk over (list, dict, str, file, range). `iter()` gives an **iterator**, and `next()` takes the next item until `StopIteration`.
```python
it = iter([1, 2])
next(it)   # 1
next(it)   # 2
next(it)   # ❌ StopIteration
```
🟨 JS: `arr[Symbol.iterator]()` and `.next()`.

🟩 **MERN way:** `const it = arr[Symbol.iterator](); it.next() // {value: 1, done: false}`. JS signals the end with `done: true`; Python raises `StopIteration`.

### T66. Generators (`yield`)
🧠 A function with `yield` produces values **one at a time, lazily**. It pauses at each `yield` and continues on the next `next()`.
🏠 A conveyor belt: one parcel at a time, not the whole warehouse at once.
```python
def order_ids(start, end):
    for i in range(start, end):
        yield i                      # hand out one value, pause here

for oid in order_ids(100, 103):      # 100, 101, 102
    print(oid)

big = (o["qty"] for o in orders)     # generator expression: ( ) instead of [ ]
total = sum(big)                     # memory-friendly for millions of rows
```
🟨 JS: `function*` and `yield`.

🟩 **MERN way**
```js
function* orderIds(start, end) {
  for (let i = start; i < end; i++) yield i;
}
for (const id of orderIds(100, 103)) {}
// Mongoose cursor: stream huge collections one doc at a time
for await (const doc of Order.find().cursor()) {}
```

### T67. `get_db()`: the real generator in dms-backend
🏢 `app/dependencies/config/database.py` (simplified idea):
```python
def get_db():
    db = SessionLocal()          # 1. open a DB session
    try:
        yield db                 # 2. hand it to the route; PAUSE while the route runs
    finally:
        db.close()               # 3. after the response, ALWAYS close it

def retrieve_order(order_id: int, db: Session = Depends(get_db)):
    ...                          # FastAPI runs get_db up to the yield, gives you db, then finishes it after
```
The real version also reuses an "ambient" session that middleware may already have set up, but the idea is the same: **setup → yield → cleanup**.

🟩 **MERN way:** Mongoose keeps **one shared connection pool** (`mongoose.connect(...)` at startup), so routes don't open/close sessions. For transactions:
```js
const session = await mongoose.startSession();
try { session.startTransaction(); /* ... */ await session.commitTransaction(); }
finally { session.endSession(); }        // ≈ get_db: setup → use → always clean up
```

### T68. Context managers: `with`
🧠 `with` guarantees **setup before** and **cleanup after**, even if an error happens.
```python
with open("a.txt") as f:      # opens → you use f → closes automatically
    data = f.read()
```
Common uses: files, DB sessions/transactions, locks, temporary settings.
🟨 Like JS `try { ... } finally { cleanup() }`, packaged into one keyword.

🟩 **MERN way:** JS has no `with`; you use `try/finally` by hand (newer JS adds `using` declarations for auto-cleanup).
```js
const fh = await fs.open("a.txt");
try { await fh.readFile("utf8"); } finally { await fh.close(); }
```

### T69. Writing one with `@contextmanager`
```python
from contextlib import contextmanager
@contextmanager
def timer(label):
    start = time.time()
    yield                                  # the with-block runs here
    print(f"{label}: {time.time() - start:.2f}s")

with timer("load orders"):
    load_orders()
```
🏢 `app/main.py` uses `@asynccontextmanager async def lifespan(app)`: start Redis/DB/cache → `yield` (the app runs) → shut down.

🟩 **MERN way:** the "setup → app runs → shutdown" lifespan in Node:
```js
await mongoose.connect(MONGO_URL);                   // startup
const server = app.listen(8000);
process.on("SIGTERM", async () => { server.close(); await mongoose.disconnect(); });   // shutdown
```

## 📝 Quiz: Day 11 (Q97–Q103)
**Q97.** What happens when `next()` runs out of items?
**Q98.** What's the difference between `return` and `yield`?
**Q99.** `[x for x in rows]` vs `(x for x in rows)`: what's the difference?
**Q100.** In `get_db()`, what runs before `yield` and what runs after?
**Q101.** Why does `get_db` use `try/finally` around the `yield`?
**Q102.** What does `with` guarantee?
**Q103.** Write a generator `batches(items, size)` that yields lists of `size` items (e.g. 2 → `[1,2]`, `[3,4]`, `[5]`).

<details><summary>▶ Answers</summary>

- **Q97.** `StopIteration` is raised (a `for` loop handles it for you)
- **Q98.** `return` ends the function once; `yield` gives a value and pauses, so it can continue
- **Q99.** the list builds everything in memory now; the generator produces items lazily, one by one
- **Q100.** before: open a session; after (when the request finishes): close it
- **Q101.** so the session is closed even if the route raised an error
- **Q102.** cleanup always runs (file closed, session closed) even on errors
- **Q103.**
```python
def batches(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]
```
</details>

---
---

# 📅 Day 12: async/await + datetime, Decimal, enum, logging

### T70. `async` / `await`
🧠 Lets the program **work on something else while waiting** (for a DB, an HTTP call or Redis) instead of blocking.
🏠 A dispatcher calls a driver and, while it rings, handles another job instead of staring at the phone.
```python
import asyncio
async def fetch_driver(did):          # async def → a "coroutine"
    await asyncio.sleep(1)            # await = wait without blocking others
    return {"id": did}

asyncio.run(fetch_driver(1))          # run from normal code
```
🟨 Almost identical to JS `async/await`, but calling `fetch_driver(1)` **without** `await` doesn't run it (in JS it starts a Promise).

🟩 **MERN way:** Node is **async by default**: every DB/HTTP call returns a Promise.
```js
async function fetchDriver(id) {
  await new Promise(r => setTimeout(r, 1000));
  return { id };
}
fetchDriver(1);   // starts immediately (returns a Promise)  ← Python: does NOT start without await
```

### T71. Running things in parallel: `asyncio.gather`
```python
results = await asyncio.gather(fetch_driver(1), fetch_driver(2))   # JS: Promise.all
```
🏢 `app/resources.py`: `await asyncio.gather(connect_redis(), start_database(), dms_cache())`

🟩 **MERN way:** `const results = await Promise.all([fetchDriver(1), fetchDriver(2)]);` (≈ `asyncio.gather`). Also `Promise.allSettled` for "don't fail if one fails" (≈ `gather(..., return_exceptions=True)`).

### T72. `def` vs `async def` in FastAPI ⚠️ important
| You write | FastAPI runs it | Rule |
|---|---|---|
| `def route()` | in a **thread pool** | blocking calls (normal SQLAlchemy, `requests`) are OK |
| `async def route()` | on the **event loop** | must **only** `await` non-blocking things |
⚠️ A blocking call (`time.sleep`, sync DB query, `requests.get`) inside `async def` **freezes the whole server** for everyone.
🏢 Most dms-backend routes are plain `def` with a sync `Session`. That's why `check_permission` and `check_permission_async` exist side by side.

🟩 **MERN way:** Node has **one event loop and no thread pool for your code**, so everything in Express must be non-blocking (`await` the DB). A CPU-heavy loop freezes the whole server, the same danger as blocking inside `async def`. FastAPI's sync `def` routes avoid that by using threads.

### T73. `datetime` & time zones
```python
from datetime import datetime, date, timedelta, timezone
now = datetime.now(timezone.utc)                 # ✅ timezone-aware UTC
tomorrow = now + timedelta(days=1)
now.strftime("%Y-%m-%d %H:%M")                    # datetime → text
datetime.strptime("2026-11-24", "%Y-%m-%d")       # text → datetime
now.isoformat()                                   # "2026-11-24T09:41:00+00:00"
```
⚠️ Store **UTC** in the database, and convert to UK time only for display.
🏢 `TimestampMixin`: `datetime.now(timezone.utc).replace(microsecond=0)`

🟩 **MERN way**
```js
const now = new Date();                    // JS Dates are UTC internally
now.toISOString();                         // "2026-11-24T09:41:00.000Z"  (≈ isoformat)
// libraries: date-fns / dayjs for formatting & adding days (≈ timedelta)
// Mongoose: { timestamps: true } stores UTC createdAt/updatedAt
```

### T74. `Decimal` for money
```python
0.1 + 0.2                          # 0.30000000000000004 ❌ float rounding
from decimal import Decimal
Decimal("0.1") + Decimal("0.2")    # Decimal('0.3') ✅
```
⚠️ Create Decimals **from strings**, not floats (`Decimal(0.1)` copies the float error).

🟩 **MERN way:** `0.1 + 0.2` has the same float problem in JS. Options: store **pence as integers** (`1250` = £12.50), use `decimal.js`/`big.js`, or Mongo's `Decimal128` type.

### T75. `enum`
```python
from enum import Enum
class PDAStatusEnum(str, Enum):      # 🏢 app/services/assets/schemas/asset_schema.py
    ACTIVE = "Active"
    FAULT = "Fault"

PDAStatusEnum.ACTIVE.value            # "Active"
PDAStatusEnum("Fault")                # PDAStatusEnum.FAULT
```
🧠 A fixed set of allowed values, so there are no typo'd status strings. Inheriting from `str` makes it JSON-friendly, and FastAPI validates against it (anything else → 422).
🟨 TS: `enum` / `"Active" | "Fault"`.

🟩 **MERN way**
```ts
// TypeScript
enum PDAStatus { ACTIVE = "Active", FAULT = "Fault" }
// Mongoose schema-level enum validation
status: { type: String, enum: ["Active", "Standby", "Fault"] }
```

### T76. Logging
```python
import logging
logger = logging.getLogger(__name__)
logger.info("Order %s created", order_id)
logger.warning("Driver missing for %s", order_id)
logger.exception("Failed")          # inside except: logs the full traceback
```
Levels: `DEBUG < INFO < WARNING < ERROR < CRITICAL`.
⚠️ Use the logger, not `print()`, in backend code.
🏢 `app/dependencies/logger.py` sets up the root logger; dms-backend also has `loguru` and a Slack logger (`config/slack_logger.py`).

🟩 **MERN way:** `console.log` in dev; in production **winston** / **pino** (levels `debug/info/warn/error`, JSON logs) and **morgan** for HTTP request logs. Python: `logging` / loguru.

## 📝 Quiz: Day 12 (Q104–Q113)
**Q104.** What's the Python equivalent of `Promise.all`?
**Q105.** What happens if you call an `async def` function without `await`?
**Q106.** Why is `time.sleep(5)` inside an `async def` route dangerous?
**Q107.** dms-backend routes are mostly `def` or `async def`? Why is that OK?
**Q108.** How do you get the current UTC time?
**Q109.** Why use `Decimal` for money? How should you create one?
**Q110.** What does `PDAStatusEnum.ACTIVE.value` return?
**Q111.** Which logger call records the full traceback inside `except`?
**Q112.** `datetime → "2026-11-24"`: which method? And the reverse?
**Q113.** Write an `async def` that "fetches" 3 drivers in parallel using `asyncio.sleep(1)` each, and finishes in about 1 second, not 3.

<details><summary>▶ Answers</summary>

- **Q104.** `asyncio.gather(...)`
- **Q105.** nothing runs; you get a coroutine object (plus a "never awaited" warning)
- **Q106.** it blocks the event loop, so every request on the server freezes
- **Q107.** `def`, and FastAPI runs them in a thread pool, so sync SQLAlchemy calls are fine
- **Q108.** `datetime.now(timezone.utc)`
- **Q109.** floats have rounding errors · `Decimal("12.50")` from a string
- **Q110.** `"Active"`
- **Q111.** `logger.exception(...)`
- **Q112.** `.strftime("%Y-%m-%d")` · `datetime.strptime(text, "%Y-%m-%d")`
- **Q113.**
```python
import asyncio
async def fetch(i):
    await asyncio.sleep(1)
    return i
async def main():
    print(await asyncio.gather(fetch(1), fetch(2), fetch(3)))
asyncio.run(main())
```
</details>

---
---

# 📅 Day 13: HTTP & REST + run dms-backend locally

### T77. HTTP methods & status codes
| Method | Meaning | DMS example |
|---|---|---|
| `GET` | read | `GET /orders/101` |
| `POST` | create / an action | `POST /orders/create` |
| `PUT` / `PATCH` | update (all / part) | `PUT /product/update` |
| `DELETE` | remove | `DELETE /product/delete` |

| Code | Meaning | When |
|---|---|---|
| 200 | OK | successful read/update |
| 201 | Created | after a POST creates something |
| 400 | Bad Request | invalid business input |
| 401 | Unauthorized | not logged in / bad token |
| 403 | Forbidden | logged in but **no permission** |
| 404 | Not Found | order doesn't exist |
| 422 | Unprocessable Entity | FastAPI/Pydantic validation failed |
| 500 | Server Error | an uncaught exception (a bug) |
🟨 You already use these from React with axios. Now you're on the **other side**.

🟩 **MERN way:** the same HTTP rules. Express sets the status by hand: `res.status(201).json(created)`, `res.status(404).json({...})`. FastAPI: `status_code=201` on the route, or `raise HTTPException(404)`. Express has no automatic 422; your validator sends 400/422.

### T78. Parts of a request
```
POST /orders/101/notes?notify=true        ← path + path param (101) + query param (notify)
Authorization: Bearer eyJhbGci...         ← headers (auth token, content type)
Content-Type: application/json

{"note": "Leave at door"}                 ← body (JSON)
```
🏠 A parcel: the **address** is the path, **delivery instructions** are the query params, the **label on the box** is the headers, and the **contents** are the body.

🟩 **MERN way**
```js
// POST /orders/101/notes?notify=true
req.params.id            // "101"   path param  (a STRING; FastAPI converts to int)
req.query.notify         // "true"  query param (a string)
req.headers.authorization
req.body                 // { note: "..." }  needs app.use(express.json())
// React side: axios.post(`/orders/101/notes?notify=true`, { note }, { headers: { Authorization } })
```

### T79. REST design
- URLs are **nouns**, methods are **verbs**: `GET /orders`, not `GET /getOrders`.
- Plural collections: `/orders`, `/orders/{id}`.
- Filters, pagination and search go in **query params**: `/orders?page=2&status=D`.
- 🏢 dms-backend is pragmatic: it also has action-style URLs (`/product/create`, `/getStaticData/all/`) and versions (`v0`, `v1`). Follow the style of the module you're working in.

🟩 **MERN way:** the same REST conventions: `router.get("/orders")`, `router.get("/orders/:id")`, `router.post("/orders")`, `router.put("/orders/:id")`, `router.delete("/orders/:id")`.

### T80. Run dms-backend locally
```bash
cd ~/Documents/BJS/PROJECTS/backend/dms-backend
poetry env use python3.12          # 1. create/select the venv
poetry install                     # 2. install the dependencies
# 3. config: env vars for MySQL + Redis (ask the team for the right values)
cp docker/local/example.env docker/local/.env
export $(grep -v '^#' docker/local/.env | xargs -d '\n')
# 4. run
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- `app.main:app` = **module** `app/main.py` : **variable** `app`.
- `--reload` = restart on file changes (like `nodemon`).
- Open **http://localhost:8000/docs** for the Swagger UI, where you can try every endpoint.
- Migrations: `alembic upgrade head` (Day 21).
⚠️ Startup errors are usually: MySQL/Redis not running, or a missing env var. Read the traceback bottom-up (T15).

🟩 **MERN way**
```bash
npm install
cp .env.example .env          # MONGO_URL, JWT_SECRET...
npm run dev                   # nodemon server.js → http://localhost:5000
# API docs: add swagger-ui-express by hand (FastAPI gives /docs for free)
```

## 📝 Quiz: Day 13 (Q114–Q121)
**Q114.** Which status code for "logged in but not allowed"? And for "not logged in"?
**Q115.** Which status code does FastAPI return when the body fails validation?
**Q116.** In `/orders/101?include=products`, which part is the path param and which is the query param?
**Q117.** Where does the auth token usually go?
**Q118.** Is `GET /getAllOrders` good REST? What's better?
**Q119.** What does `app.main:app` mean in the uvicorn command?
**Q120.** What does `--reload` do?
**Q121.** Which URL opens the interactive API docs?

<details><summary>▶ Answers</summary>

- **Q114.** 403 · 401
- **Q115.** 422
- **Q116.** `101` = path param · `include=products` = query param
- **Q117.** the `Authorization: Bearer <token>` header
- **Q118.** no: `GET /orders`
- **Q119.** the module `app/main.py`, and the variable `app` inside it
- **Q120.** restarts the server when code changes
- **Q121.** `http://localhost:8000/docs`
</details>

---
---

# 📅 Day 14: FastAPI routes, params & routers

### T81. The app & the first route
```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}        # dict → JSON automatically
```
🟨 Express: `app.get("/health", (req, res) => res.json({status: "ok"}))`. In FastAPI you just **return** the data.
🏢 `app/main.py`: `app = ModFastAPI(title="DMS-backend", ..., lifespan=lifespan)` (a customised FastAPI subclass).

🟩 **MERN way**
```js
import express from "express";
const app = express();
app.use(express.json());
app.get("/health", (req, res) => res.json({ status: "ok" }));   // FastAPI: just `return {...}`
app.listen(8000);
```

### T82. Path parameters
```python
@router.get("/{order_id}")
def retrieve_order(order_id: int):     # the name must match {order_id}; int → auto-converted + validated
    ...
```
`/orders/abc` → **422** automatically.
⚠️ Route order matters: define `/orders/static` **before** `/orders/{order_id}`, otherwise "static" is treated as an id.

🟩 **MERN way**
```js
router.get("/orders/:orderId", (req, res) => {
  const orderId = Number(req.params.orderId);            // convert by hand
  if (Number.isNaN(orderId)) return res.status(422).json({ error: "orderId must be a number" });
});
```
Route order matters in Express too: `/orders/static` before `/orders/:orderId`.

### T83. Query parameters
🧠 Any function parameter that **isn't** in the path is a **query param**.
```python
from fastapi import Query
@router.get("/")
def get_all_orders(page: int = 1, status: Optional[str] = None,
                   limit: int = Query(20, le=100)):     # with validation: max 100
    ...
# GET /orders/?page=2&status=D
```
- A default value → optional; no default → **required**.
🏢 dms-backend wraps pagination and filters into reusable dependencies: `pagination = Depends(XPagination())`, `x_filters = Depends(XFilter())`.

🟩 **MERN way**
```js
// GET /orders?page=2&status=D
const page = Number(req.query.page ?? 1);
const limit = Math.min(Number(req.query.limit ?? 20), 100);
const orders = await Order.find(req.query.status ? { status: req.query.status } : {})
  .skip((page - 1) * limit).limit(limit);
```

### T84. Swagger docs `/docs`
FastAPI builds the docs from your **paths + type hints + schemas + docstrings**.
`tags=["Orders"]` groups the endpoints. Use "Try it out" to call your API without Postman.

🟩 **MERN way:** you write the OpenAPI spec yourself (swagger-jsdoc comments + swagger-ui-express). FastAPI generates it from your code.

### T85. `APIRouter` and `include_router`
🧠 Split routes into files/modules, then plug them into the app.
🏢 How dms-backend wires the orders routes:
```python
# app/services/order/routers/v0/__init__.py
router = APIRouter(prefix='/orders', tags=["Orders"])

# app/services/order/routers/v0/get.py
from app.services.order.routers.v0 import router
@router.get("/{order_id}")            # full URL: /orders/{order_id}
def retrieve_order(...): ...

# app/services/order/router.py → imports all the route modules (that registers them)
# app/main.py
routers = [ ... ]
for router in routers:
    app.include_router(router, dependencies=[Depends(Revocations)])   # every route also checks revoked tokens
```
🟨 Express: `const router = express.Router(); app.use("/orders", router)`.
⚠️ A new route file must be **imported** somewhere (e.g. in `router.py`), otherwise its routes never register.

🟩 **MERN way**
```js
// routes/orders.js
const router = express.Router();
router.get("/:id", getOrder);
export default router;
// server.js
app.use("/orders", authMiddleware, ordersRouter);   // ≈ include_router(router, dependencies=[...])
```

## 📝 Quiz: Day 14 (Q122–Q129)
**Q122.** How does a FastAPI route send JSON back?
**Q123.** What does FastAPI do with `/orders/abc` if the route has `order_id: int`?
**Q124.** In `def f(order_id: int, page: int = 1)` with path `/{order_id}`, what kind of parameter is `page`?
**Q125.** How do you make a query param required?
**Q126.** Why must `/orders/static` be defined before `/orders/{order_id}`?
**Q127.** With `APIRouter(prefix="/orders")` and `@router.get("/{order_id}")`, what's the full URL?
**Q128.** You created a new route file but the endpoint is missing from `/docs`. What did you probably forget?
**Q129.** Write a router with `GET /drivers/{driver_id}` (int) that returns `{"id": driver_id, "active": active}`, where `active` is an optional bool query param defaulting to True.

<details><summary>▶ Answers</summary>

- **Q122.** just `return` a dict/list/model; FastAPI converts it to JSON
- **Q123.** returns 422 (validation error)
- **Q124.** an optional query param
- **Q125.** don't give it a default value
- **Q126.** routes match top-down; otherwise "static" is captured as `{order_id}` (and fails as an int)
- **Q127.** `/orders/{order_id}`
- **Q128.** importing the module (e.g. in the service's `router.py`), or adding the router to `main.py`'s list
- **Q129.**
```python
from fastapi import APIRouter
router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/{driver_id}")
def get_driver(driver_id: int, active: bool = True):
    return {"id": driver_id, "active": active}
```
</details>

---
---

# 📅 Day 15: Request body, `Depends`, request/response

### T86. Request body
🧠 A parameter typed as a **Pydantic model** is read from the **JSON body**.
```python
from pydantic import BaseModel
class NoteCreate(BaseModel):
    note: str
    notify: bool = False

@router.post("/{order_id}/notes", status_code=201)
def create_note(order_id: int, payload: NoteCreate):   # path param + body
    return {"order_id": order_id, "note": payload.note}
```
FastAPI decides where each value comes from: **path** (`{}` in the URL) · **body** (a Pydantic model) · **query** (everything else).

🟩 **MERN way**
```js
app.use(express.json());
router.post("/:orderId/notes", async (req, res) => {
  const { note, notify = false } = req.body;      // no automatic validation!
  if (typeof note !== "string") return res.status(422).json({ error: "note required" });
  res.status(201).json({ orderId: req.params.orderId, note });
});
```

### T87. Dependency injection: `Depends`
🧠 "Before running this route, run **that** function and give me its result."
🏠 Before a driver leaves, the depot hands them a van and a scanner. The driver doesn't fetch them.
```python
def get_db(): ...                       # T67
def fetch_dms_user(request: Request): ...

@router.get("/{order_id}")
def retrieve_order(
    request: Request,
    order_id: int,
    db: Session = Depends(get_db),                            # a DB session
    dms_user: DMSUserSchema = Depends(fetch_dms_user),        # the logged-in user
    customer_ids: Optional[List[int]] = Depends(fetch_accessible_customer_ids),
): ...
```
🟨 Like React's `useContext` / Express middleware that attaches `req.user`, but per-parameter and typed.
- Dependencies can depend on other dependencies.
- In tests you can **swap** them (`app.dependency_overrides[get_db] = fake_db`), see Day 24.

🟩 **MERN way:** Express uses **middleware that attaches things to `req`**:
```js
const loadUser = async (req, res, next) => { req.user = await User.findById(tokenUserId); next(); };
router.get("/orders/:id", loadUser, async (req, res) => { req.user ... });
// ≈ dms_user: DMSUserSchema = Depends(fetch_dms_user)
// DB: Mongoose is global, so no db param;  FastAPI passes db = Depends(get_db) explicitly
```

### T88. `Request` and `Response` objects
```python
from fastapi import Request, Response
def route(request: Request, response: Response = None):
    request.headers.get("Authorization")
    request.state.permissions            # data that middleware/decorators attached
    response.status_code = 404           # change the status without raising
```
🏢 `retrieve_order` sets `response.status_code = status.HTTP_404_NOT_FOUND` and returns `CustomResponseSchema(...)`.

🟩 **MERN way:** `req.headers.authorization`, `res.locals` / `req.user` (≈ `request.state`), `res.status(404).json(...)` (≈ `response.status_code = 404`).

### T89. `response_model` & status codes
```python
@router.get("/{order_id}", response_model=CustomOrderDetailResponseSchema)
```
- `response_model` **filters and validates the output**: only the schema's fields are returned (no leaking of internal columns).
- `status.HTTP_404_NOT_FOUND` constants are clearer than bare numbers.
🏢 Most DMS routes return `CustomResponseSchema(message=..., code=..., data=..., error=...)`, a **standard envelope** that the React frontend relies on.

🟩 **MERN way:** no `response_model`; you shape the output yourself:
```js
res.json({ id: o._id, customer: o.customer });          // pick fields by hand
orderSchema.set("toJSON", { transform: (doc, ret) => { delete ret.__v; return ret; } });
// team envelope: res.json({ message, code, data, error })  ≈ CustomResponseSchema
```

### T90. Middleware
🧠 Code that runs **around every request** (before and after the route).
🏢 `app/main.py` adds `AuthMiddleware`, `DBSession`, `RateLimitMiddleware` and CORS.
🟨 Express: `app.use((req, res, next) => ...)`.
⚠️ Middleware order matters: the last added runs first (outermost).

🟩 **MERN way**
```js
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));          // request logging
app.use(authMiddleware);
app.use(rateLimit({ windowMs: 60_000, max: 100 }));     // ≈ RateLimitMiddleware
```

## 📝 Quiz: Day 15 (Q130–Q137)
**Q130.** How does FastAPI know a parameter should come from the JSON body?
**Q131.** In one sentence, what does `Depends(get_db)` do?
**Q132.** Why is dependency injection useful for testing?
**Q133.** How do you return a 404 without raising an exception?
**Q134.** What does `response_model` do to the output?
**Q135.** What's `CustomResponseSchema` used for in dms-backend?
**Q136.** Name two middlewares in dms-backend's `main.py`.
**Q137.** Write a `POST /drivers/` route that takes a body `{name: str, van: str | None}` and returns it with status 201.

<details><summary>▶ Answers</summary>

- **Q130.** its type is a Pydantic `BaseModel`
- **Q131.** runs `get_db` first and passes its result (a DB session) into the route
- **Q132.** you can override a dependency with a fake (e.g. a test DB)
- **Q133.** take `response: Response` and set `response.status_code = 404`
- **Q134.** filters and validates the output to the schema's fields
- **Q135.** a standard response envelope (message, code, data, error) for the frontend
- **Q136.** `AuthMiddleware`, `DBSession`, `RateLimitMiddleware`, CORS
- **Q137.**
```python
class DriverCreate(BaseModel):
    name: str
    van: str | None = None

@router.post("/", status_code=201)
def create_driver(payload: DriverCreate):
    return payload
```
</details>

---
---

# 📅 Day 16: Pydantic schemas
🏢 dms-backend uses **Pydantic v2** (2.12). Schemas live in `app/services/<module>/schemas/`.

### T91. `BaseModel`
```python
from pydantic import BaseModel
class EscalationReasonsSchema(BaseModel):      # 🏢 order/schemas/escalation_reasons_schema.py
    id: int
    order_reason_id: int
    escalation_type_id: int

s = EscalationReasonsSchema(id=1, order_reason_id=2, escalation_type_id=3)
s.id                          # 1
s.model_dump()                # → dict       (v1: .dict())
s.model_dump_json()           # → JSON str
```
🟨 Like a **TypeScript interface + runtime validation** (zod / yup) in one.

🟩 **MERN way:** a Pydantic model ≈ a **zod schema** (validation) and a **TypeScript type** in one:
```ts
const EscalationReason = z.object({ id: z.number().int(), orderReasonId: z.number().int() });
type EscalationReason = z.infer<typeof EscalationReason>;
EscalationReason.parse(data);       // ≈ EscalationReasonsSchema(**data)
```
⚠️ Don't confuse it with a **Mongoose schema**, which describes the *database document* (≈ SQLAlchemy model).

### T92. Validation & conversion
```python
EscalationReasonsSchema(id="5", order_reason_id=2, escalation_type_id=3)   # "5" → 5 ✅ (converted)
EscalationReasonsSchema(id="abc", ...)    # ❌ ValidationError → in FastAPI: 422 with details
```
The 422 body tells the frontend exactly which field failed and why.

🟩 **MERN way:** `z.coerce.number()` converts `"5"` → 5; `schema.safeParse(x)` returns `{ success, error }`, and `error.issues` ≈ Pydantic's 422 detail list.

### T93. Optional fields, defaults, `Field`
```python
from typing import Optional
from pydantic import BaseModel, Field
class OrderCreate(BaseModel):
    customer_id: int                               # required
    note: Optional[str] = None                     # optional
    qty: int = Field(1, ge=1, le=50)               # default 1, must be 1..50
    postcode: str = Field(..., min_length=5)       # ... = required
```
⚠️ `Optional[str]` without `= None` is still **required** (it just may be null).

🟩 **MERN way**
```ts
z.object({
  customerId: z.number(),
  note: z.string().nullable().optional(),
  qty: z.number().int().min(1).max(50).default(1),
  postcode: z.string().min(5),
});
// Mongoose: qty: { type: Number, min: 1, max: 50, default: 1, required: true }
```

### T94. Nested models & lists
```python
class ProductIn(BaseModel):
    name: str
    qty: int
class OrderIn(BaseModel):
    customer_id: int
    products: list[ProductIn]          # validates every item
```

🟩 **MERN way:** `products: z.array(z.object({ name: z.string(), qty: z.number() }))`. In Mongoose: `products: [productSchema]` (an embedded sub-document array).

### T95. From ORM objects: `from_attributes`
🧠 Lets a schema read from a **SQLAlchemy object** (attributes) instead of a dict.
```python
class EscalationReasonsSchema(BaseModel):
    ...
    class Config:
        orm_mode = True            # Pydantic v1 name (old)
        from_attributes = True     # Pydantic v2 name ✅

EscalationReasonsSchema.model_validate(db_row)     # ORM row → schema
```
🏢 dms-backend has both names in old files. In **new** code use v2: `model_config = ConfigDict(from_attributes=True)`.

🟩 **MERN way:** Mongoose documents → plain objects with `doc.toObject()` / `.lean()` before sending (≈ `model_validate(db_row)` with `from_attributes`).

### T96. Create vs Update vs Response schemas
| Schema | Purpose | Typical fields |
|---|---|---|
| `XCreate` | POST body | required fields, no `id` |
| `XUpdate` | PUT/PATCH body | everything `Optional` |
| `XResponse` | output | `id`, timestamps, safe fields only |
⚠️ Never return passwords, tokens or internal flags. The response schema is your filter.
🏢 Validators: `@model_validator` (v2) for cross-field rules; see `assets/schemas/asset_schema.py`.

🟩 **MERN way:** the same idea with zod: `CreateOrder`, `UpdateOrder = CreateOrder.partial()` (all optional), and a response picker. Mongoose `select: false` on a field (e.g. `password`) keeps it out of query results.

## 📝 Quiz: Day 16 (Q138–Q145)
**Q138.** What's the TypeScript/JS equivalent of a Pydantic model?
**Q139.** What happens with `id="5"` for an `int` field? And with `id="abc"`?
**Q140.** v1 `.dict()` is called what in v2?
**Q141.** Is `note: Optional[str]` (no default) required?
**Q142.** How do you say "qty between 1 and 50, default 1"?
**Q143.** What does `from_attributes=True` allow?
**Q144.** Why have separate Create and Response schemas?
**Q145.** Write `DriverCreate` (name 2–50 chars, van optional, max_jobs int default 10, ≥1) and `DriverResponse` (id + name + van).

<details><summary>▶ Answers</summary>

- **Q138.** a TS interface plus a runtime validator (zod/yup)
- **Q139.** converted to `5` · ValidationError (422 in FastAPI)
- **Q140.** `.model_dump()`
- **Q141.** yes: required, but it may be `None`
- **Q142.** `qty: int = Field(1, ge=1, le=50)`
- **Q143.** building the schema from an object's attributes (a SQLAlchemy row)
- **Q144.** input and output need different fields; the response hides internal/sensitive data
- **Q145.**
```python
class DriverCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    van: Optional[str] = None
    max_jobs: int = Field(10, ge=1)

class DriverResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    van: Optional[str] = None
```
</details>

---
---

# 📅 Day 17: SQL basics (MySQL)
🏢 dms-backend uses **MySQL**. Table names are PascalCase: `Orders`, `EscalationReasons`.

### T97. Tables, rows, columns, keys
🏠 A table is a spreadsheet: **columns** = fields, **rows** = records.
- **Primary key** (`id`): unique per row.
- **Foreign key** (`customer_id` → `Customers.id`): a link to another table.
- **NULL** = no value (Python `None`).

🟩 **MERN way: MongoDB vs MySQL**
| MongoDB (MERN) | MySQL (dms-backend) |
|---|---|
| database | database |
| **collection** `orders` | **table** `Orders` |
| **document** `{...}` | **row** |
| field | column |
| `_id` (ObjectId) | `id` (int, auto-increment) |
| reference `customerId: ObjectId` | foreign key `customer_id` |
| flexible schema | fixed schema (migrations) |

### T98. `SELECT`
```sql
SELECT id, customer_id, status
FROM Orders
WHERE status = 'D' AND client_id = 1
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;               -- page 3 of 20

SELECT * FROM Orders WHERE id IN (101, 102);
SELECT * FROM Orders WHERE postcode LIKE 'SW1%';   -- starts with SW1
SELECT * FROM Orders WHERE created_at BETWEEN '2026-11-01' AND '2026-11-30';
```
🟨 It's like `.filter().sort().slice()`, but run by the database.

🟩 **MERN way**
```js
await Order.find({ status: "D", clientId: 1 })        // WHERE
  .select("customerId status")                         // SELECT columns
  .sort({ createdAt: -1 })                             // ORDER BY ... DESC
  .skip(40).limit(20);                                 // OFFSET / LIMIT
Order.find({ _id: { $in: ids } });                     // IN
Order.find({ postcode: /^SW1/ });                      // LIKE 'SW1%'
Order.find({ createdAt: { $gte: start, $lte: end } }); // BETWEEN
```

### T99. `INSERT`, `UPDATE`, `DELETE`
```sql
INSERT INTO Notes (order_id, note) VALUES (101, 'Leave at door');
UPDATE Orders SET status = 'C' WHERE id = 101;
DELETE FROM Notes WHERE id = 5;
```
⚠️ **UPDATE/DELETE without WHERE changes EVERY row.** Always write the `WHERE` first.
🏢 dms-backend usually **soft-deletes**: `UPDATE ... SET is_deleted = 1, deleted_at = NOW()` instead of `DELETE` (T109).

🟩 **MERN way**
```js
await Note.create({ orderId: 101, note: "Leave at door" });          // INSERT
await Order.updateOne({ _id: 101 }, { $set: { status: "C" } });      // UPDATE ... WHERE
await Note.deleteOne({ _id: 5 });                                    // DELETE ... WHERE
await Order.updateMany({}, { $set: { status: "C" } });               // ⚠️ updates EVERYTHING (like no WHERE)
```

### T100. NULL handling
```sql
WHERE driver_id IS NULL           -- ✅
WHERE driver_id = NULL            -- ❌ always false!
COALESCE(note, 'no note')         -- default for NULL    (Python: x or "no note")
```
🏢 Same idea as T14: in SQLAlchemy `Model.col.is_(None)` becomes `IS NULL`.

🟩 **MERN way:** `Order.find({ driverId: null })` matches null **or a missing field**; `{ driverId: { $exists: false } }` = missing only. Default for null: `$ifNull` in aggregation (≈ `COALESCE`).

## 📝 Quiz: Day 17 (Q146–Q153)
**Q146.** What is a primary key? A foreign key?
**Q147.** Write SQL: the 10 newest orders with status `'D'`.
**Q148.** What's dangerous about `UPDATE Orders SET status='C';`?
**Q149.** Why doesn't `WHERE driver_id = NULL` work?
**Q150.** Find postcodes starting with `LS`.
**Q151.** What is "soft delete"?
**Q152.** Page 2 with 25 per page: `LIMIT ? OFFSET ?`
**Q153.** Write SQL: count orders per status. (Preview of Day 18: try it!)

<details><summary>▶ Answers</summary>

- **Q146.** PK = the unique id of each row · FK = a column pointing to another table's PK
- **Q147.** `SELECT * FROM Orders WHERE status='D' ORDER BY created_at DESC LIMIT 10;`
- **Q148.** no WHERE → every order is changed
- **Q149.** NULL isn't equal to anything; use `IS NULL`
- **Q150.** `WHERE postcode LIKE 'LS%'`
- **Q151.** mark a row deleted (`is_deleted=1`, `deleted_at`) instead of removing it
- **Q152.** `LIMIT 25 OFFSET 25`
- **Q153.** `SELECT status, COUNT(*) FROM Orders GROUP BY status;`
</details>

---
---

# 📅 Day 18: Joins, GROUP BY, indexes, transactions

### T101. JOINs
```sql
SELECT o.id, c.name
FROM Orders o
JOIN Customers c ON c.id = o.customer_id;        -- INNER: only orders WITH a customer

SELECT o.id, d.name
FROM Orders o
LEFT JOIN Drivers d ON d.id = o.driver_id;       -- LEFT: ALL orders, d.name NULL if no driver
```
🏠 INNER = only parcels that have a matching label · LEFT = all parcels, with a blank label where there's none.

🟩 **MERN way**
```js
// Mongoose populate ≈ LEFT JOIN by reference
await Order.find().populate("driverId", "name");
// aggregation $lookup ≈ JOIN
await Order.aggregate([{ $lookup: { from: "customers", localField: "customerId",
                                    foreignField: "_id", as: "customer" } }]);
```
Or **embed** related data in the document, which avoids the join entirely (a Mongo design choice).

### T102. `GROUP BY`, aggregates, `HAVING`
```sql
SELECT customer_id, COUNT(*) AS orders, SUM(qty) AS items
FROM Orders
WHERE status <> 'C'
GROUP BY customer_id
HAVING COUNT(*) > 5              -- filter AFTER grouping (WHERE filters before)
ORDER BY orders DESC;
```
Aggregates: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.
🟨 Like `reduce` grouping in JS (T27 + T28 in Python).

🟩 **MERN way**
```js
await Order.aggregate([
  { $match: { status: { $ne: "C" } } },                                      // WHERE
  { $group: { _id: "$customerId", orders: { $sum: 1 }, items: { $sum: "$qty" } } },  // GROUP BY
  { $match: { orders: { $gt: 5 } } },                                        // HAVING
  { $sort: { orders: -1 } },
]);
```

### T103. Indexes
🧠 An index is like a book's index: it makes `WHERE`/`JOIN`/`ORDER BY` on that column fast.
- Index the columns you filter/join on (`customer_id`, `status`, `created_at`).
- Too many indexes slow down writes.
🏢 `TimestampMixin` adds `index=True` on `created_at`, `client_id`, etc. `EXPLAIN SELECT ...` shows whether an index is used.

🟩 **MERN way:** `orderSchema.index({ customerId: 1, createdAt: -1 });` · `Order.find(q).explain()` (≈ `EXPLAIN`). The same trade-off: faster reads, slower writes.

### T104. Transactions
🧠 Several changes that **all succeed or all fail** together.
```sql
START TRANSACTION;
UPDATE Stock SET qty = qty - 1 WHERE product_id = 7;
INSERT INTO OrderProducts (order_id, product_id) VALUES (101, 7);
COMMIT;        -- or ROLLBACK; to undo both
```
🏠 A bank transfer: money leaves one account **and** arrives in the other, or neither happens.
🏢 SQLAlchemy: `db.commit()` / `db.rollback()` (T112). Row locks: a recent dms-backend commit "Fail fast on master Orders row-lock waits", which is why long transactions are dangerous.

🟩 **MERN way:** MongoDB transactions need a replica set:
```js
const s = await mongoose.startSession();
await s.withTransaction(async () => {
  await Stock.updateOne({ productId: 7 }, { $inc: { qty: -1 } }, { session: s });
  await OrderProduct.create([{ orderId: 101, productId: 7 }], { session: s });
});   // commit, or rollback on error
```

## 📝 Quiz: Day 18 (Q154–Q161)
**Q154.** INNER JOIN vs LEFT JOIN?
**Q155.** WHERE vs HAVING?
**Q156.** Write SQL: total qty per city, only for cities with more than 100 items.
**Q157.** What does an index speed up? What does it slow down?
**Q158.** How do you check whether a query uses an index?
**Q159.** What is a transaction?
**Q160.** What does ROLLBACK do?
**Q161.** Write SQL: all orders with the driver's name, including orders with no driver.

<details><summary>▶ Answers</summary>

- **Q154.** INNER = only matching rows · LEFT = all left rows, NULLs where there's no match
- **Q155.** WHERE filters rows before grouping; HAVING filters groups after
- **Q156.** `SELECT city, SUM(qty) FROM Orders GROUP BY city HAVING SUM(qty) > 100;`
- **Q157.** speeds up reads (WHERE/JOIN/ORDER BY) · slows down writes
- **Q158.** `EXPLAIN SELECT ...`
- **Q159.** a group of changes that all succeed or all fail
- **Q160.** undoes everything since the transaction started
- **Q161.** `SELECT o.*, d.name FROM Orders o LEFT JOIN Drivers d ON d.id = o.driver_id;`
</details>

---
---

# 📅 Day 19: SQLAlchemy models & sessions
🏢 dms-backend uses **SQLAlchemy 2.0** with the classic `db.query(...)` style. Models live in `app/services/<module>/models/`.

### T105. What an ORM is
🧠 **O**bject **R**elational **M**apper: work with **Python classes/objects** instead of writing SQL strings.
| SQL | SQLAlchemy |
|---|---|
| table `Orders` | class `Orders` |
| a row | an `Orders` object |
| a column | a class attribute: `Orders.status` |
🟨 Like Prisma / TypeORM / Sequelize in Node.

🟩 **MERN way:** **Mongoose** is MERN's ODM (Object *Document* Mapper) ≈ SQLAlchemy ORM. `Order.find()` ≈ `db.query(Orders)`.

### T106. Engine & Session
🧠 **Engine** = the connection pool to MySQL (one per app) · **Session** = one unit of work: queries + changes, then commit.
🏠 The engine is the depot's phone line; a session is one phone call where you place and confirm orders.
🏢 `app/dependencies/config/database.py` creates the engines (`get_db_url(role)` uses separate read/write roles, see `db_router.py`); routes get a session through `db: Session = Depends(get_db)`.
⚠️ Never create sessions by hand in routes. Always use `get_db`.

🟩 **MERN way:** `mongoose.connect(MONGO_URL)` once at startup = the engine/pool. There's no per-request session object; you call models directly (`Order.find()`). In FastAPI you get `db: Session` per request.

### T107. Defining a model
🏢 Real model, `app/services/order/models/escalation_reasons.py`:
```python
class EscalationReasons(TimestampMixin, Module):
    __tablename__ = "EscalationReasons"
    id = Column(Integer, primary_key=True, autoincrement=True)
    order_reason_id = Column(Integer, ForeignKey("OrderReasons.id"))
    escalation_type_id = Column(Integer, ForeignKey("EscalationTypes.id"))
    failure_reason_id = Column(Integer, nullable=True)
    is_deleted = Column(Boolean, default=False, server_default=text("0"), nullable=False)
    deleted_at = Column(DateTime, nullable=True)
```
| Column type | Python | MySQL |
|---|---|---|
| `Integer` | int | INT |
| `String(50)` | str | VARCHAR(50) |
| `Boolean` | bool | TINYINT(1) |
| `DateTime` | datetime | DATETIME |
| `Numeric(10, 2)` | Decimal | DECIMAL |
Options: `primary_key`, `nullable`, `default` (Python side), `server_default` (DB side), `index`, `unique`.

🟩 **MERN way**
```js
const escalationReasonSchema = new Schema({
  orderReasonId: { type: Schema.Types.ObjectId, ref: "OrderReason" },   // ≈ ForeignKey
  failureReasonId: { type: Number, default: null },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });                                                 // ≈ TimestampMixin
export const EscalationReason = model("EscalationReason", escalationReasonSchema);  // __tablename__
```

### T108. `ForeignKey` & `relationship`
```python
order_reason_id = Column(Integer, ForeignKey("OrderReasons.id"))   # the DB link
order_reason = relationship("OrderReasons")                         # Python access
reason.order_reason.name        # follow the link like an attribute
```
⚠️ Accessing a relationship in a loop runs **one query per row** (the N+1 problem, T114).

🟩 **MERN way:** `ref: "OrderReason"` + `.populate("orderReasonId")` ≈ `ForeignKey` + `relationship()`. Populating inside a loop has the same N+1 risk.

### T109. Common model patterns in dms-backend
- **`TimestampMixin`** → `created_at/by`, `updated_at/by`, `client_id` on every table.
- **Soft delete** → `is_deleted`, `deleted_at`, `deleted_by`. Filter `is_deleted == False` in queries!
- **`client_id`** → multi-tenant: always filter by the user's organisation (`order_queryset(db, client_id=dms_user.organisation_id)`).
- **Seeders** → `last_perform_seeder_date()` + JSON files for fixed lookup data.

🟩 **MERN way:** `{ timestamps: true }` (≈ TimestampMixin) · soft delete with an `isDeleted` field or the `mongoose-delete` plugin · multi-tenant: add `clientId` to every query, often via a query middleware `schema.pre("find", function () { this.where({ clientId }) })`.

## 📝 Quiz: Day 19 (Q162–Q169)
**Q162.** What does ORM stand for, and what's the JS equivalent?
**Q163.** Engine vs Session?
**Q164.** How does a route get a session in dms-backend?
**Q165.** `default=` vs `server_default=`?
**Q166.** What does `relationship("OrderReasons")` give you?
**Q167.** Which columns does `TimestampMixin` add?
**Q168.** Why must most queries filter by `client_id` and `is_deleted`?
**Q169.** Write a model `DriverNotes` (table `DriverNotes`): id PK, driver_id FK → `Drivers.id`, note String(500) not null, is_deleted default False, using `TimestampMixin`.

<details><summary>▶ Answers</summary>

- **Q162.** Object Relational Mapper · Prisma/TypeORM/Sequelize
- **Q163.** engine = the connection pool for the whole app; session = one unit of work (queries + commit)
- **Q164.** `db: Session = Depends(get_db)`
- **Q165.** `default` is set by Python when inserting; `server_default` is set by MySQL itself
- **Q166.** access to the related object as an attribute (`row.order_reason`)
- **Q167.** created_at/by, updated_at/by, sync_*_at, client_id
- **Q168.** so users only see their own organisation's data and deleted rows are hidden
- **Q169.**
```python
class DriverNotes(TimestampMixin):
    __tablename__ = "DriverNotes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    driver_id = Column(Integer, ForeignKey("Drivers.id"), index=True)
    note = Column(String(500), nullable=False)
    is_deleted = Column(Boolean, default=False, server_default=text("0"), nullable=False)
```
</details>

---
---

# 📅 Day 20: SQLAlchemy queries & writes

### T110. Reading: `query`, `filter`, `first`, `all`
```python
order = db.query(Orders).filter(Orders.id == order_id).first()    # one row or None
orders = db.query(Orders).filter(Orders.status == "D").all()       # list
count = db.query(Orders).filter(...).count()
db.query(Orders).get(101)            # by PK (legacy) → prefer db.get(Orders, 101)
db.query(Orders.id, Orders.status)   # only some columns
.order_by(Orders.created_at.desc()).offset(20).limit(20)
```
⚠️ In `.filter()` use `==` (not `=`). It builds SQL; it doesn't compare in Python.
🏢 `retrieve_order`: `order_queryset(db=db, client_id=...).filter(Orders.id == order_id).first()`

🟩 **MERN way**
```js
await Order.findOne({ _id: id });             // .first()  → null if none
await Order.find({ status: "D" });            // .all()    → [] if none
await Order.countDocuments({...});            // .count()
await Order.findById(101);                    // db.get(Orders, 101)
```

### T111. Filter operators
```python
from sqlalchemy import and_, or_
.filter(Orders.status != "C")
.filter(Orders.id.in_([101, 102]))                  # IN
.filter(Orders.postcode.like("SW1%"))               # LIKE
.filter(Orders.driver_id.is_(None))                 # IS NULL   (T14!)
.filter(Orders.driver_id.isnot(None))               # IS NOT NULL
.filter(Orders.created_at.between(start, end))
.filter(or_(Orders.status == "D", Orders.status == "P"))
.filter(Orders.client_id == cid, Orders.is_deleted == False)   # commas = AND
```
⚠️ Python's `and`/`or`/`not`/`in` **don't work** inside filters; use `and_`, `or_`, `~`, `.in_()`.
⚠️ `Orders.is_deleted == False` triggers flake8 E712; `.is_(False)` is the cleaner alternative.

🟩 **MERN way**
```js
{ status: { $ne: "C" } }                       // !=
{ _id: { $in: [101, 102] } }                   // .in_()
{ postcode: /^SW1/ }                           // .like("SW1%")
{ driverId: null }                             // .is_(None)
{ driverId: { $ne: null } }                    // .isnot(None)
{ $or: [{ status: "D" }, { status: "P" }] }    // or_()
{ clientId: cid, isDeleted: false }            // commas = AND (same!)
```

### T112. Writing: add, commit, refresh, rollback
```python
note = Notes(order_id=101, note="Leave at door", created_by=user.email)
db.add(note)          # stage
db.commit()           # save to MySQL (transaction committed)
db.refresh(note)      # reload (gets the new id, server defaults)
note.id

try:
    ...
    db.commit()
except Exception:
    db.rollback()     # undo on error
    raise
```
🏢 dms-backend's `DBSession` middleware and "ambient session" also manage commit/rollback around requests. Check how the module you're editing does it before adding your own commits.

🟩 **MERN way:** `const note = await Note.create({...})` saves immediately and returns the doc with `_id`. There's no separate `add`/`commit` step unless you use a transaction session (T104).

### T113. Update & delete
```python
order.status = "C"                    # change attributes…
db.commit()                           # …then commit

db.query(Orders).filter(Orders.id.in_(ids)).update({"status": "C"}, synchronize_session=False)   # bulk
# soft delete (preferred in DMS)
row.is_deleted = True; row.deleted_at = datetime.now(timezone.utc); row.deleted_by = user.email
db.commit()
```

🟩 **MERN way**
```js
order.status = "C"; await order.save();                                   // ≈ attribute + commit
await Order.updateMany({ _id: { $in: ids } }, { $set: { status: "C" } }); // bulk update
await Order.updateOne({ _id }, { $set: { isDeleted: true, deletedAt: new Date() } });   // soft delete
```

### T114. Joins, eager loading & N+1
```python
db.query(Orders, Customers.name).join(Customers, Customers.id == Orders.customer_id).all()

# N+1 problem ❌
for r in reasons:            # 1 query
    print(r.order_reason.name)   # +1 query PER row → 1001 queries for 1000 rows
# Fix ✅: load related rows in the same query
from sqlalchemy.orm import joinedload
db.query(EscalationReasons).options(joinedload(EscalationReasons.order_reason)).all()
```
💡 Print the SQL: `print(query.statement.compile(compile_kwargs={"literal_binds": True}))`, or turn on echo.

🟩 **MERN way:** `.populate()` in one query instead of `findById` inside a loop · `.lean()` for fast read-only plain objects · `mongoose.set("debug", true)` prints the queries (≈ SQLAlchemy echo).

## 📝 Quiz: Day 20 (Q170–Q177)
**Q170.** `.first()` vs `.all()`: what does each return when nothing matches?
**Q171.** Why does `.filter(Orders.id = 5)` fail?
**Q172.** How do you write `WHERE driver_id IS NULL`?
**Q173.** How do you write `status = 'D' OR status = 'P'`?
**Q174.** After `db.add(x)`, is the row in MySQL yet?
**Q175.** Why call `db.refresh(x)` after commit?
**Q176.** What is the N+1 problem, and one fix?
**Q177.** Write: get all non-deleted orders for `client_id=cid` with no driver, newest first, page 2 of 20.

<details><summary>▶ Answers</summary>

- **Q170.** `.first()` → `None` · `.all()` → `[]`
- **Q171.** `=` is assignment (SyntaxError); use `==`
- **Q172.** `.filter(Orders.driver_id.is_(None))`
- **Q173.** `.filter(or_(Orders.status == "D", Orders.status == "P"))` or `.filter(Orders.status.in_(["D", "P"]))`
- **Q174.** no, not until `db.commit()` (or a flush)
- **Q175.** to load DB-generated values (id, server defaults)
- **Q176.** one extra query per row when accessing relationships in a loop · `joinedload`/`selectinload`, or a join
- **Q177.**
```python
(db.query(Orders)
   .filter(Orders.client_id == cid, Orders.is_deleted.is_(False), Orders.driver_id.is_(None))
   .order_by(Orders.created_at.desc())
   .offset(20).limit(20)
   .all())
```
</details>

---
---

# 📅 Day 21: Alembic migrations

### T115. What a migration is
🧠 A **versioned script** that changes the database structure (add a table/column/index), so every environment (your laptop, staging, production) ends up with the same schema.
🏠 Building plans with numbered revisions: each one says exactly what to add or remove.
🟨 Like Prisma Migrate / Knex migrations.

🟩 **MERN way:** MongoDB has no fixed schema, so adding a field usually needs **no migration**; Mongoose just starts writing it. **Data** migrations (backfilling or renaming fields) still use tools like `migrate-mongo`. In SQL (MySQL), **every** structure change needs a migration.

### T116. Creating one
```bash
poetry run alembic revision --autogenerate -m "add DriverNotes table"
```
- Alembic compares your **models** with the **database** and writes `alembic/versions/<id>_add_drivernotes_table.py`.
- ⚠️ **Always read the generated file.** Autogenerate can miss renames (it sees drop + add) and may pick up unrelated diffs.
```python
def upgrade():
    op.create_table("DriverNotes", sa.Column("id", sa.Integer(), primary_key=True), ...)
def downgrade():
    op.drop_table("DriverNotes")
```

🟩 **MERN way:** `npx migrate-mongo create add-driver-notes` → you write `up(db)` / `down(db)` by hand (no autogenerate). For SQL databases in Node: Prisma `npx prisma migrate dev` (with autogenerate) or Knex/Sequelize migrations.

### T117. Applying & undoing
```bash
alembic upgrade head        # apply everything up to the latest
alembic downgrade -1        # undo the last one
alembic current             # which revision the DB is on
alembic history             # list
```
`down_revision` chains the files. Two people creating migrations from the same parent → "multiple heads" → `alembic merge heads`.

🟩 **MERN way:** `npx migrate-mongo up` / `down` / `status` ≈ `alembic upgrade head` / `downgrade -1` / `current`.

### T118. Team rules
- One migration per change; a clear `-m` message.
- Never edit a migration that's already been run on staging/production. Make a new one.
- Adding a NOT NULL column to a big table → give it a `server_default`, or the migration fails/locks.
- Big tables (`Orders`): adding an index can lock; coordinate with the team.
🏢 Migrations live in `alembic/versions/`; config is in `alembic.ini` and `alembic/env.py`.

🟩 **MERN way:** the same team rules apply to any migration tool: never edit an applied migration, keep them small, and be careful with big collections/tables. Adding an index on a big Mongo collection can also be slow.

## 📝 Quiz: Day 21 (Q178–Q184)
**Q178.** Why do we need migrations instead of editing tables by hand?
**Q179.** Which command creates a migration from model changes?
**Q180.** Which command applies all migrations?
**Q181.** What should you always do after `--autogenerate`?
**Q182.** What does `downgrade()` do?
**Q183.** What is "multiple heads", and how do you fix it?
**Q184.** Why add a `server_default` when adding a NOT NULL column to an existing table?

<details><summary>▶ Answers</summary>

- **Q178.** every environment gets the same, versioned, repeatable schema changes
- **Q179.** `alembic revision --autogenerate -m "..."`
- **Q180.** `alembic upgrade head`
- **Q181.** read and fix the generated file
- **Q182.** reverses `upgrade()`
- **Q183.** two migrations share a parent · `alembic merge heads`
- **Q184.** existing rows need a value, otherwise the migration fails
</details>

---
---

# 📅 Day 22: Auth: hashing, JWT, permissions

### T119. Authentication vs authorization
- **Authentication** = *who are you?* (login, token) → failure = **401**
- **Authorization** = *what may you do?* (permissions) → failure = **403**
🏠 Authentication is showing your ID at the depot gate; authorization is whether that ID lets you into the warehouse.

🟩 **MERN way:** the same concepts: an auth middleware sends 401 when the token is missing or invalid; a role/permission middleware sends 403.

### T120. Password hashing
🧠 Never store passwords. Store a **one-way hash**; on login, hash the input and compare.
```python
from passlib.hash import argon2
hashed = argon2.hash("secret")
argon2.verify("secret", hashed)    # True
```
🏢 `passlib[argon2]` is in `pyproject.toml`.

🟩 **MERN way**
```js
import bcrypt from "bcrypt";                       // or argon2 (npm i argon2)
const hash = await bcrypt.hash("secret", 10);
await bcrypt.compare("secret", hash);              // true
// Mongoose pre-save hook: userSchema.pre("save", async function () { this.password = await bcrypt.hash(...) })
```

### T121. JWT
🧠 A signed token: `header.payload.signature`. The server can **verify** it without a DB lookup.
```python
import jwt
token = jwt.encode({"sub": "user-1", "exp": expiry}, SECRET, algorithm="HS256")
data = jwt.decode(token, SECRET, algorithms=["HS256"])     # raises if expired/tampered
```
- Sent as `Authorization: Bearer <token>`.
- The payload is **readable by anyone** (base64), so never put secrets in it.
🏢 `sso_login/decorator.py` has `jwt_required` / `jwt_required_async`; `Revocations` (on every router, T85) checks revoked tokens; `AuthMiddleware` runs on every request.

🟩 **MERN way**
```js
import jwt from "jsonwebtoken";
const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: "1h" });
const data = jwt.verify(token, SECRET);           // throws TokenExpiredError
// auth middleware:
const auth = (req, res, next) => {
  try { req.user = jwt.verify(req.headers.authorization?.split(" ")[1], SECRET); next(); }
  catch { res.status(401).json({ error: "Unauthorized" }); }
};
```

### T122. Permissions in dms-backend
🏢 Permission strings like `"dms.order.view.read"`:
```python
@router.get("/{order_id}")
@check_permission("dms.order.view.read", ["dms.portal.order.view.read"])   # primary + fallbacks
def retrieve_order(request: Request, ...):
```
- `has_permissions(request, perm)` checks the user's permissions (`get_permission(user_id)` → `(user, permissions)`).
- `request.state.permissions` is stored for the permission-logging middleware.
- Plus **data-level** access: `fetch_accessible_customer_ids` and the `client_id` filter, so users only see their own customers' orders.

🟩 **MERN way:** `router.get("/orders/:id", auth, checkPermission("dms.order.view.read"), getOrder)` (see T64), plus a tenant filter `Order.find({ clientId: req.user.clientId })` ≈ dms-backend's `client_id` filter.

### T123. Security checklist for every new endpoint
- [ ] `@check_permission(...)` with the right permission string
- [ ] filter by `client_id` / accessible customers
- [ ] the response schema hides internal fields
- [ ] validate the input with Pydantic
- [ ] never log tokens or passwords
- [ ] use SQLAlchemy params, never f-strings in SQL (**SQL injection**)

🟩 **MERN way: same checklist, MERN tools:** auth + permission middleware · filter by `clientId` · `select: false` / a `toJSON` transform to hide fields · validate with zod/Joi · never log tokens · **NoSQL injection**: sanitise `req.body` (e.g. `{"$gt": ""}` tricks) with `express-mongo-sanitize`.

## 📝 Quiz: Day 22 (Q185–Q192)
**Q185.** Authentication vs authorization, and their status codes?
**Q186.** Why hash passwords instead of encrypting/storing them?
**Q187.** Can anyone read a JWT's payload?
**Q188.** What happens in `jwt.decode` with an expired token?
**Q189.** What's the permission string for viewing an order?
**Q190.** Besides permissions, how does dms-backend stop users seeing other clients' orders?
**Q191.** Why is `f"SELECT * FROM Orders WHERE id = {order_id}"` dangerous?
**Q192.** What does `request.state.permissions` hold, and who sets it?

<details><summary>▶ Answers</summary>

- **Q185.** who you are (401) · what you may do (403)
- **Q186.** a hash is one-way, so a database leak doesn't reveal the passwords
- **Q187.** yes (base64); only the signature protects it from changes
- **Q188.** it raises an exception (`ExpiredSignatureError`)
- **Q189.** `dms.order.view.read`
- **Q190.** filtering by `client_id` / accessible customer ids
- **Q191.** SQL injection: user input becomes SQL
- **Q192.** the list of permissions for this route; set by `check_permission`
</details>

---
---

# 📅 Day 23: Redis + Celery

### T124. Redis as a cache
🧠 A super-fast **in-memory key → value store**. Used to avoid slow repeated work (DB queries, API calls).
🏠 A whiteboard by the dispatch desk: quick to read, wiped from time to time.
🏢 Real pattern, `file_operations/routers/department/department.py`:
```python
key = f"{config.ENV}.perimeter:department"
data = redis_client.get(key)
if not data:                                   # cache MISS → fetch + store
    status_code, department = InternalRequest(...).send_request()
    redis_client.set(key, json.dumps((status_code, department)))
    redis_client.expire(key, 60 * 10)          # 10 minutes
else:                                          # cache HIT
    status_code, department = json.loads(data)
```

🟩 **MERN way**
```js
import Redis from "ioredis";
const redis = new Redis(REDIS_URL);
let data = await redis.get(key);
if (!data) {
  const departments = await fetchDepartments();
  await redis.set(key, JSON.stringify(departments), "EX", 600);    // 10 min
  data = departments;
} else data = JSON.parse(data);
```

### T125. TTL & cache invalidation
- **TTL** (time to live) = automatic expiry: `expire(key, seconds)` or `set(key, value, ex=600)`.
- When the source data changes, **delete or refresh** the key, otherwise users see stale data.
- Redis stores **strings/bytes** → `json.dumps` in, `json.loads` out (T46).
🏢 The `warm_order_static_cache` beat task refreshes `OrderStaticData_*` keys every 30 minutes.

🟩 **MERN way:** `redis.set(k, v, "EX", 300)` / `redis.expire(k, 300)` / `redis.del(k)` on update, the same TTL and invalidation rules. Redis is identical; only the client library differs.

### T126. Celery tasks
🧠 Run slow work **in the background** (emails, exports, integrations) so the API responds immediately.
🏠 The counter takes your order and gives you a ticket; the kitchen cooks it in the back.
```python
@celery.task
def send_delivery_sms(order_id): ...

send_delivery_sms.delay(101)                         # queue it, return immediately
call_cross_service.apply_async(args=[...], queue="x")   # with options
```
🏢 `celery = Celery("dms.celery")` in `config/celery_worker.py`; `offload_webhook_dispatcher.delay()` in `warehouse/.../event_ingest.py`.
Run a worker: `celery -A app.dependencies.config.celery_worker.celery worker --loglevel=info`

🟩 **MERN way: BullMQ** (Redis-backed queues) ≈ Celery:
```js
const smsQueue = new Queue("sms", { connection });
await smsQueue.add("send", { orderId: 101 });            // ≈ send_delivery_sms.delay(101)
new Worker("sms", async (job) => sendSms(job.data.orderId), { connection });   // ≈ celery worker
```

### T127. Celery beat (scheduled tasks)
🏢 `celery.conf.beat_schedule` in `celery_worker.py`:
```python
"warm_order_static_cache_task": {
    "task": "warm_order_static_cache",
    "schedule": crontab(minute="*/30"),     # every 30 min
},
```
`crontab(minute=0, hour="1-7")` = every hour between 01:00 and 07:00.
🟨 Like `node-cron` + a job queue (BullMQ).

🟩 **MERN way:** `node-cron` → `cron.schedule("*/30 * * * *", warmCache)`, or BullMQ repeatable jobs `{ repeat: { pattern: "*/30 * * * *" } }` ≈ Celery beat `crontab(minute="*/30")`.

### T128. When to go async (Celery) vs inline
| Inline in the route | Celery task |
|---|---|
| fast (< ~1s) | slow / heavy |
| the user needs the result now | the user can be told "processing…" |
| must be in the same transaction | retries on failure are useful |
⚠️ Task arguments must be JSON-serialisable: pass **ids**, not ORM objects.

🟩 **MERN way:** the same decision. Pass **ids** in the job data (`{ orderId }`), not Mongoose documents.

## 📝 Quiz: Day 23 (Q193–Q200)
**Q193.** What is Redis used for in dms-backend?
**Q194.** Cache "hit" vs "miss"?
**Q195.** What does TTL mean? How long is the department cache?
**Q196.** Why `json.dumps` before `redis_client.set`?
**Q197.** What's the difference between calling `task(101)` and `task.delay(101)`?
**Q198.** Why pass `order_id` instead of the `order` object to a task?
**Q199.** What does `crontab(minute="*/15")` mean?
**Q200.** Write the cache pattern for `get_depots()`: key `"depots"`, a 5-minute TTL, fetching from `load_depots_from_db()` on a miss.

<details><summary>▶ Answers</summary>

- **Q193.** caching (static data, external API results) and as the Celery broker/backend
- **Q194.** hit = found in the cache · miss = not there, so fetch and store
- **Q195.** time to live (auto-expiry) · 10 minutes (`60 * 10`)
- **Q196.** Redis stores strings/bytes, not Python objects
- **Q197.** a direct call runs it now in this process; `.delay` queues it for a worker
- **Q198.** task args must be serialisable; the task loads fresh data itself
- **Q199.** every 15 minutes
- **Q200.**
```python
def get_depots():
    data = redis_client.get("depots")
    if data:
        return json.loads(data)
    depots = load_depots_from_db()
    redis_client.set("depots", json.dumps(depots), ex=300)
    return depots
```
</details>

---
---

# 📅 Day 24: Testing with pytest
🏢 dms-backend tests live in `tests/` (`api/v0`, `api/v1`, `routers`, `services`, `factories`); fixtures are in `tests/conftest.py`.

### T129. Test functions & `assert`
```python
# tests/test_fee.py      ← file and function names start with test_
def test_free_delivery_over_1000():
    assert delivery_fee(1500) == 0

def test_invalid_qty_raises():
    with pytest.raises(ValueError):
        set_qty(0)
```
🟨 Jest: `test("...", () => expect(fee(1500)).toBe(0))`. pytest just uses plain `assert`.

🟩 **MERN way: Jest**
```js
test("free delivery over 1000", () => {
  expect(deliveryFee(1500)).toBe(0);           // assert delivery_fee(1500) == 0
});
test("invalid qty throws", () => {
  expect(() => setQty(0)).toThrow();           // pytest.raises(ValueError)
});
```

### T130. Fixtures & `conftest.py`
🧠 A **fixture** = reusable setup, injected by **parameter name** (just like `Depends`!).
```python
@pytest.fixture
def sample_order():
    return {"id": 101, "qty": 2}

def test_qty(sample_order):          # pytest passes the fixture in
    assert sample_order["qty"] == 2
```
- `conftest.py` fixtures are shared by every test in the folder.
- `scope="session"` = created once per run · `"function"` = fresh for each test.
- `yield` in a fixture = setup → test → cleanup (T67 again!).

🟩 **MERN way:** Jest uses `beforeEach` / `afterEach` / `beforeAll` instead of injected fixtures; shared setup goes in `jest.setup.js` (≈ `conftest.py`).

### T131. Testing API endpoints
🏢 `tests/conftest.py` builds an async client fixture:
```python
_app.dependency_overrides[get_db] = lambda: db_session      # use the TEST database
async with AsyncClient(transport=ASGITransport(app=_app), base_url="http://test") as client:
    yield client
```
A test then looks like:
```python
async def test_get_order_not_found(client, auth_headers):
    res = await client.get("/orders/999999", headers=auth_headers)
    assert res.status_code == 404
```

🟩 **MERN way: Supertest**
```js
import request from "supertest";
test("404 for missing order", async () => {
  const res = await request(app).get("/orders/999999").set("Authorization", token);
  expect(res.status).toBe(404);
});
// test DB: mongodb-memory-server (≈ dms-backend overriding get_db with a test session)
```

### T132. Factories & mocking
- **Factories** (`tests/factories/`, `pytest-factoryboy`) create test rows quickly: `OrderFactory(status="D")`.
- **Mocking** replaces external calls (SMS, S3, other services):
```python
from unittest.mock import patch
with patch("app.services.x.send_sms") as fake:
    ...
    fake.assert_called_once()
```

🟩 **MERN way:** factories with `@faker-js/faker` or `fishery`; mocking with `jest.mock("../services/sms")` and `expect(sendSms).toHaveBeenCalledTimes(1)` (≈ `patch` + `assert_called_once`).

### T133. Running tests
```bash
poetry run pytest                       # all
poetry run pytest tests/api/v1 -k order # a folder + a name filter
poetry run pytest -x -vv                # stop at the first failure, verbose
make test_only                          # Docker services + coverage report
```
⚠️ The `conftest.py` note says tests only work if the service containers are running (see the Makefile).

🟩 **MERN way:** `npx jest` · `npx jest orders` (≈ `-k order`) · `npx jest --bail --verbose` (≈ `-x -vv`) · `npx jest --coverage`.

## 📝 Quiz: Day 24 (Q201–Q208)
**Q201.** How does pytest find tests?
**Q202.** How do you test that a function raises `ValueError`?
**Q203.** How does a test receive a fixture?
**Q204.** What does `scope="session"` mean for a fixture?
**Q205.** How does dms-backend make the API use a test database?
**Q206.** Why mock external services in tests?
**Q207.** Which command runs only the tests with "order" in their name?
**Q208.** Write tests for `calculate_total` (Q47): no coupon, with a coupon, express.

<details><summary>▶ Answers</summary>

- **Q201.** files `test_*.py`, functions `test_*`
- **Q202.** `with pytest.raises(ValueError):`
- **Q203.** by naming it as a parameter
- **Q204.** created once for the whole test run
- **Q205.** `app.dependency_overrides[get_db] = lambda: db_session`
- **Q206.** tests stay fast and reliable, and don't send real SMS/emails
- **Q207.** `pytest -k order`
- **Q208.**
```python
def test_no_coupon():
    assert calculate_total(2, 100) == 200
def test_coupon():
    assert calculate_total(2, 100, coupon="X") == 180
def test_express():
    assert calculate_total(1, 100, express=True) == 250
```
</details>

---
---

# 📅 Day 25: Integrations: HTTP clients, retries, S3, Kafka, config

### T134. Calling other APIs: `requests` / `httpx`
```python
import requests
res = requests.get(url, params={"page": 1}, headers=h, timeout=10)
res.raise_for_status()           # raises on 4xx/5xx
data = res.json()

import httpx                     # sync AND async
async with httpx.AsyncClient(timeout=10) as client:
    res = await client.post(url, json=payload)
```
🟨 `requests` ≈ axios (sync) · `httpx.AsyncClient` ≈ axios with await.
⚠️ **Always set a timeout.** Without one, a slow partner API can hang your worker for ever.
⚠️ `requests` is blocking, so don't use it inside `async def` routes (T72).
🏢 `InternalRequest(...).send_request()` is the team's wrapper for calling other internal services (Perimeter, etc.).

🟩 **MERN way**
```js
const res = await axios.get(url, { params: { page: 1 }, headers: h, timeout: 10_000 });
res.data;                         // already parsed JSON (≈ res.json())
// axios throws on 4xx/5xx by default (≈ raise_for_status)
const r = await fetch(url, { signal: AbortSignal.timeout(10_000) });   // built-in fetch + timeout
```

### T135. Retries with `tenacity`
```python
from tenacity import retry, stop_after_delay, wait_exponential
@retry(stop=stop_after_delay(3), wait=wait_exponential(multiplier=0.2))   # 🏢 app/resources.py
def connect():
    ...
```
Retry **temporary** failures (timeouts, 503), not 400/404.

🟩 **MERN way:** `axios-retry` (`axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay })`) or `p-retry` ≈ tenacity.

### T136. AWS S3 with `boto3`
```python
import boto3
s3 = boto3.client("s3")
s3.upload_file("pod.pdf", "bucket-name", "pods/101.pdf")
url = s3.generate_presigned_url("get_object", Params={"Bucket": b, "Key": k}, ExpiresIn=3600)
```
🏢 Used for PODs, manifests and exports (e.g. `order_create/.../s3_manifest_source.py`, the `s3_resource` service).

🟩 **MERN way**
```js
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
await s3.send(new PutObjectCommand({ Bucket, Key: "pods/101.pdf", Body: file }));
const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key }), { expiresIn: 3600 });
```

### T137. Kafka (overview)
🧠 An **event stream**: services publish events ("order delivered") and others consume them later. That decouples services.
🏠 A depot noticeboard: anyone posts an update, and every team reads it when it's ready.
🏢 `aiokafka` is in the test dependencies; GSIT/integration events flow between services. Learn the details when you get a ticket that touches it.

🟩 **MERN way:** `kafkajs`, using `producer.send({ topic: "order-delivered", messages: [...] })` and `consumer.run({ eachMessage })`. The same concepts: topics, producers, consumers.

### T138. Config & environment variables
```python
import os
REGION = os.getenv("REGION", "USA")                               # 🏢 config/config.py
GSIT_API_TIMEOUT = int(os.getenv("GSIT_API_TIMEOUT", 120))         # env vars are ALWAYS strings → convert
```
- Secrets live in `.env` files / CI variables, **never in code or git**.
- `config.ENV` / `Environment.PRODUCTION` switch behaviour per environment.
🟨 Node: `process.env.REGION ?? "USA"` + dotenv.

🟩 **MERN way**
```js
import "dotenv/config";
const REGION = process.env.REGION ?? "USA";
const TIMEOUT = Number(process.env.GSIT_API_TIMEOUT ?? 120);   // env vars are strings in Node too
```

## 📝 Quiz: Day 25 (Q209–Q216)
**Q209.** Why always pass `timeout=` to HTTP calls?
**Q210.** What does `res.raise_for_status()` do?
**Q211.** Which HTTP client should you use inside an `async def` route?
**Q212.** Which errors are worth retrying, and which aren't?
**Q213.** What is a presigned S3 URL?
**Q214.** In one sentence, what is Kafka used for?
**Q215.** Why `int(os.getenv("X", 120))`?
**Q216.** Where must secrets never go?

<details><summary>▶ Answers</summary>

- **Q209.** so a slow API can't hang your process for ever
- **Q210.** raises an exception for 4xx/5xx responses
- **Q211.** `httpx.AsyncClient` (non-blocking)
- **Q212.** retry: timeouts/503/connection errors · don't retry: 400/401/403/404
- **Q213.** a temporary link to download (or upload) a private file
- **Q214.** publishing and consuming events between services, decoupled
- **Q215.** env vars are strings, so convert to an int
- **Q216.** code or git; use env vars / a secret store
</details>

---
---

# 📅 Day 26: Team workflow: git, pre-commit, Docker, CI

### T139. Git workflow
```bash
git checkout development && git pull
git checkout -b ay-BJS-12345-short-description     # 🏢 your branch style: initials-ticket-desc
# ...work...
git add -p && git commit -m "Add DriverNotes model and create endpoint"
git push -u origin ay-BJS-12345-short-description
# open a PR in Bitbucket → review → merge
```
🏢 Commit messages in the repo are plain-English imperatives: *"Fail fast on master Orders row-lock waits…"*, *"Allow null order_product_id on POST /qc/create/"*.

🟩 **MERN way:** git is identical, whatever the stack: the same branches, PRs and commit messages.

### T140. pre-commit, flake8, isort, mypy
🏢 `.pre-commit-config.yaml` runs `make lint` before each commit, which runs:
- `isort -c`: import order
- `flake8`: style/bugs (max line length **90**; E711 `== None`, E712 `== False`…)
- `mypy --ignore-missing-imports`: type hints (Day 9)
```bash
poetry run pre-commit install     # once
make lint                         # run manually
make format_code                  # isort fixes imports
```

🟩 **MERN way:** **husky** + **lint-staged** run **ESLint** + **Prettier** (+ `tsc --noEmit`) before each commit ≈ pre-commit running flake8 + isort + mypy.

### T141. Docker & docker-compose
🧠 **Docker** packages the app + its dependencies into an image; **compose** runs several containers (app, MySQL, Redis) together.
```bash
./start.sh                                        # 🏢 copies env + docker-compose up --build -d
docker compose -f docker/local/docker-compose.yml ps
docker compose logs -f
```
🟨 Same as for a Node app: `Dockerfile` + `docker-compose.yml`.

🟩 **MERN way**
```yaml
# docker-compose.yml (MERN)
services:
  api:   { build: ., ports: ["5000:5000"], env_file: .env }
  mongo: { image: mongo:7, ports: ["27017:27017"] }
  redis: { image: redis:7 }
```
dms-backend's compose has the same shape, with MySQL instead of Mongo.

### T142. CI: Bitbucket Pipelines
🏢 `bitbucket-pipelines.yml` steps: **Sonar Scan** (code quality) → **Build** → **Build Image Push**/tags.
- A red pipeline = fix it before merging.
- Read the failing step's log bottom-up, just like a traceback.

🟩 **MERN way:** GitHub Actions / Bitbucket Pipelines running `npm ci && npm run lint && npm test && docker build`. The same idea: lint → test → build → push.

### T143. PR checklist before you ask for a review
- [ ] Branch is up to date with `development`
- [ ] `make lint` is clean
- [ ] Tests added/updated, and `pytest` passes
- [ ] Migration included and reviewed (if models changed)
- [ ] `@check_permission` + `client_id` filtering on new endpoints (T123)
- [ ] No secrets, no debug `print()`s
- [ ] The PR description explains the **why** and how to test it

🟩 **MERN way:** the same checklist with MERN tools: `npm run lint` clean · Jest/Supertest passing · migration script (if needed) · auth + permission middleware · no secrets in `.env.example` · a clear PR description.

## 📝 Quiz: Day 26 (Q217–Q224)
**Q217.** What's the branch naming style used in your dms-backend branches?
**Q218.** What runs automatically before each commit?
**Q219.** What's the max line length flake8 allows in dms-backend?
**Q220.** What does `isort` check?
**Q221.** What does `./start.sh` do?
**Q222.** Name the Bitbucket pipeline steps.
**Q223.** The pipeline is red. What do you do first?
**Q224.** List 5 things to check before opening a PR.

<details><summary>▶ Answers</summary>

- **Q217.** `ay-BJS-<ticket>-<description>`
- **Q218.** pre-commit → `make lint` (isort, flake8, mypy)
- **Q219.** 90
- **Q220.** import ordering
- **Q221.** copies the local env file and starts docker-compose (build, detached)
- **Q222.** Sonar Scan, Build (no push), Build Image Push, tag builds
- **Q223.** open the failing step's log and read it bottom-up
- **Q224.** any 5 from T143
</details>

---
---

# 📚 Resources & weekly habits

| Topic | Link | Use with |
|---|---|---|
| Python | https://docs.python.org/3/tutorial/ | Days 1–12 |
| FastAPI | https://fastapi.tiangolo.com/tutorial/ | Days 14–15 |
| Pydantic v2 | https://docs.pydantic.dev/latest/ | Day 16 |
| SQL practice | https://sqlbolt.com | Days 17–18 |
| SQLAlchemy 2.0 | https://docs.sqlalchemy.org/en/20/tutorial/ | Days 19–20 |
| Alembic | https://alembic.sqlalchemy.org/en/latest/tutorial.html | Day 21 |
| Celery | https://docs.celeryq.dev/en/stable/getting-started/ | Day 23 |
| Redis | https://redis.io/docs/latest/develop/ | Day 23 |
| pytest | https://docs.pytest.org/en/stable/getting-started.html | Day 24 |

**Weekly habits**
1. Read one teammate's dms-backend PR every week and understand every line.
2. Use `http://localhost:8000/docs` (Swagger) as your playground.
3. Add any new JS → Python mapping you discover to this file.
4. Ask Claude to explain a dms-backend file "like I'm a React developer", or to quiz you by Q-number.

---
---

# 🏗️ Final Project: build a real feature in dms-backend
**Unlocks after Days 1–26 are ✅.** You write the code; Claude guides and reviews.

**Feature: Driver Notes**, so dispatchers can add notes to a driver ("prefers mornings", "van has a tail-lift").

| Step | What you build | Uses |
|---|---|---|
| 1 | Branch `ay-BJS-xxxx-driver-notes` | T139 |
| 2 | Model `DriverNotes` with `TimestampMixin` + soft delete | T107–T109 |
| 3 | Alembic migration, reviewed + `upgrade head` | T115–T118 |
| 4 | Schemas: `DriverNoteCreate`, `DriverNoteUpdate`, `DriverNoteResponse` | T91–T96 |
| 5 | Routes: `POST /drivers/{id}/notes`, `GET /drivers/{id}/notes` (paginated), `PUT /notes/{id}`, `DELETE /notes/{id}` (soft) | T81–T90 |
| 6 | `@check_permission` + `client_id` filtering | T122–T123 |
| 7 | Cache the GET list in Redis (5 min) + invalidate on changes | T124–T125 |
| 8 | Celery task: notify the depot manager when a note is marked urgent | T126 |
| 9 | Tests: create, list, 404, permission denied | T129–T133 |
| 10 | `make lint` clean → PR with a description | T140–T143 |

🎯 **Done when:** the PR checklist (T143) is fully ticked and the tests pass.
