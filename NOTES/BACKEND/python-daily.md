# 🧠 Daily Recall: read in 2 minutes

> Read this **every morning** before starting new topics. If a line feels unclear, open that T-number in `short-notes.md`.

---

## 🔁 MERN ↔ Python
| Job | MERN | Python |
|---|---|---|
| Package manager | npm / yarn · `package.json` | pip / Poetry · `pyproject.toml` |
| Dev server | `nodemon` | `uvicorn --reload` |
| Route | `router.get("/orders/:id", handler)` | `@router.get("/orders/{order_id}")` |
| Input validation | Joi / zod / express-validator | Pydantic |
| Database | MongoDB (documents) | MySQL (tables) |
| Data modelling / ORM | Mongoose schema + model | SQLAlchemy model |
| Schema changes | (Mongo has no fixed schema) · migrate-mongo | Alembic migrations |
| Auth | `jsonwebtoken` + `bcrypt` | `pyjwt` + `passlib[argon2]` |
| Permissions | custom middleware `checkRole("admin")` | `@check_permission("dms.order.view.read")` |
| Cache | Redis (`ioredis`) | Redis (`redis-py`) |
| Background jobs | BullMQ / Agenda / node-cron | Celery + Celery beat |
| HTTP client | `axios` / `fetch` | `requests` / `httpx` |
| Tests | Jest + Supertest | pytest + httpx `AsyncClient` |
| Lint / format | ESLint / Prettier | flake8 / isort / mypy |

💡 Mongo gives **JS objects/arrays**; MySQL via SQLAlchemy gives **Python objects/lists**. Both leave the API as the **same JSON** React already understands.

---

## 📌 Day 1
- `python3 app.py` = `node app.js`
- version → `python3 --version` (node: `node -v`)
- just `python3` → REPL, `>>>`
- `poetry add x` / `pip install x` = `npm install x`
- `pyproject.toml` = `package.json`, `.venv/` = `node_modules/`
- `pyenv` = `nvm`
- `print("a", "b", sep="-")` → a-b
- snake_case → `order_id`, `get_db()`
- str, int/float, True/False, None (no undefined!), `type(x)`
- `/` always float (10/2 = 5.0), `//` whole, `%` remainder, `**` power
- `"5" * 2` → "55" (JS gives 10)
- `"5" + 1` → TypeError (JS gives "51")
- `int("3.5")` → ValueError
- `input()` always gives str → wrap in `int()`
- f-string: `f"Hi {name}"`, don't forget the f
- no `{ }` → 4 spaces. `:` at the end → indent next line
- `elif`, not else if
- `and or not`, not `&& || !`
- falsy: 0, "", [], {}, None, False
- `[]` / `{}` falsy here, truthy in JS ⚠️
- errors → read the LAST line. Name = typo, Type = mixing types, Value = bad value, Syntax = missing `:` or bracket

---


## 📌 Day 2

### List `[ ]` (= JS array)
| Python | JS | Note |
|---|---|---|
| `x = ["a", "b"]` | `const x = ["a", "b"]` | ordered, can change |
| `x[0]` | `x[0]` | same, starts at 0 |
| `x[-1]` | `x.at(-1)` | last item (JS `x[-1]` → undefined) |
| `x[1:3]` | `x.slice(1, 3)` | index 1 and 2 (end 3 NOT included) |
| `x[1:]` / `x[:2]` | `x.slice(1)` / `x.slice(0, 2)` | to the end / from the start |
| `x[::-1]` | `[...x].reverse()` | reversed copy |
| `len(x)` | `x.length` | function, not property |
| `x[10]` | `x[10]` | Python → IndexError, JS → undefined |

### List methods (= JS array methods)
| Python | JS | Note |
|---|---|---|
| `x.append(v)` | `x.push(v)` | add to end |
| `x.insert(0, v)` | `x.unshift(v)` | add at position |
| `x.extend([a, b])` | `x.push(...arr)` | add many |
| `x.remove(v)` | `x.splice(x.indexOf(v), 1)` | remove by VALUE, missing → ValueError |
| `x.pop()` | `x.pop()` | remove last + return it |
| `x.pop(0)` | `x.shift()` | remove first |
| `v in x` | `x.includes(v)` | True / False |
| `x.index(v)` | `x.indexOf(v)` | missing → ValueError (JS: -1) |
| `a + b` | `[...a, ...b]` | join → new list |
| `x.sort()` | `x.sort()` | changes x, returns None ⚠️ never `x = x.sort()` |
| `sorted(x)` | `[...x].sort()` | NEW sorted list, x untouched |
| `b = a` | `b = a` | same list, NOT a copy (same in JS) |
| `b = a.copy()` | `b = [...a]` | real copy |

### Dict `{key: value}` (= JS object)
| Python | JS | Note |
|---|---|---|
| `{"id": 1}` | `{ id: 1 }` | Python keys need quotes |
| `d["id"]` | `d.id` / `d["id"]` | no dot access in Python (`d.id` → AttributeError) |
| `d["x"]` missing | `d.x` | Python → KeyError, JS → undefined |
| `d.get("x")` | `d.x` | safe → None |
| `d.get("x", "def")` | `d.x ?? "def"` | safe + default |
| `d["x"] = 1` | `d.x = 1` | add or change |
| `del d["x"]` | `delete d.x` | delete (missing → KeyError) |
| `d.pop("x", None)` | `delete d.x` | safe delete + return value |
| `"x" in d` | `"x" in d` | same! checks KEYS |
| `d.update({"x": 5})` | `Object.assign(d, {x: 5})` | change many |
| `{**d, "x": 5}` | `{...d, x: 5}` | copy + change (`**` = `...`) |
| `d.keys()` / `d.values()` / `d.items()` | `Object.keys(d)` / `values` / `entries` | |

### Tuple `( )` (= locked JS array)
| Python | JS | Note |
|---|---|---|
| `t = ("Leeds", "LS1")` | `Object.freeze(["Leeds", "LS1"])` | JS has no tuple |
| `t[0]` / `len(t)` | `t[0]` / `t.length` | reading works like a list |
| `t[0] = "York"` | (frozen: silently ignored) | Python → TypeError |
| `t.append(x)` | frozen `t.push(x)` → TypeError | no append → AttributeError |
| `city, pc = t` | `const [city, pc] = t` | unpacking |
| `return a, b` | `return [a, b]` | Python returns a tuple |
| `("x",)` → tuple | `["x"]` | the COMMA makes a tuple |
| `("x")` → str | `("x")` → string | brackets alone do nothing |
| data changes → list · fixed → tuple | changes → array · fixed → `Object.freeze` | when to use which |

### Set `{ }` (= JS Set)
| Python | JS | Note |
|---|---|---|
| `{"a", "a", "b"}` | `new Set(["a", "a", "b"])` | duplicates removed → {"a", "b"} |
| `set()` | `new Set()` | empty set |
| `{}` | `{}` | ⚠️ empty DICT, not a set |
| `s.add(v)` | `s.add(v)` | add |
| `s.discard(v)` | `s.delete(v)` | remove, no error if missing |
| `v in s` | `s.has(v)` | very fast check |
| `len(s)` | `s.size` | |
| `list(set(x))` | `[...new Set(x)]` | remove duplicates from a list |
| `a & b` | `[...a].filter(v => b.has(v))` | in BOTH |
| `a \| b` | `new Set([...a, ...b])` | in EITHER |
| `a - b` | `[...a].filter(v => !b.has(v))` | only in a |
| `s[0]` | `s[0]` → undefined | Python → TypeError (no index, no order) |

### Nesting: list of dicts (= JS array of objects, real API data)
| Python | JS | Note |
|---|---|---|
| `orders = [{"id": 1, "items": ["sofa"]}]` | `const orders = [{ id: 1, items: ["sofa"] }]` | JSON from API = list of dicts |
| `orders[0]["id"]` | `orders[0].id` | index first, then key |
| `orders[0]["items"][-1]` | `orders[0].items.at(-1)` | go one level at a time |
| `orders.append({...})` | `orders.push({...})` | add a new order |
| `len(orders)` | `orders.length` | how many orders |

### Extra
| Python | JS | Note |
|---|---|---|
| no `;` needed | `;` optional | `a; b` works but write one statement per line |
