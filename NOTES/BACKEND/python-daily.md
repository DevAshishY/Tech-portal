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

