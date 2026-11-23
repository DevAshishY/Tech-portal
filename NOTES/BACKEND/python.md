# DMS Backend — Learning Path (Frontend → Full-Stack)

A structured path to learn Python and every tool used in this repo, written for a
frontend (React/TypeScript) developer.

- **Pace:** ~1–1.5 hrs/day → ~12 weeks
- **Each phase:** 📘 Learn · 📂 In this repo · ✅ Checkpoint
- Tick the boxes as you go.

---

## Table of Contents

1. [The Stack at a Glance](#the-stack-at-a-glance)
2. [How a Request Flows](#how-a-request-flows)
3. [Phase 0 — Setup](#phase-0--setup-23-days)
4. [Phase 1 — Python Core](#phase-1--python-core-weeks-12)
5. [Phase 2 — Intermediate Python](#phase-2--intermediate-python-week-3)
6. [Phase 3 — HTTP & REST](#phase-3--http--rest-week-4)
7. [Phase 4 — FastAPI](#phase-4--fastapi-weeks-45)
8. [Phase 5 — Pydantic](#phase-5--pydantic-week-5)
9. [Phase 6 — SQL & MySQL](#phase-6--sql--mysql-weeks-67)
10. [Phase 7 — SQLAlchemy ORM](#phase-7--sqlalchemy-orm-week-8)
11. [Phase 8 — Alembic Migrations](#phase-8--alembic-migrations-week-8)
12. [Phase 9 — Auth & Security](#phase-9--auth--security-week-9)
13. [Phase 10 — Redis & Celery](#phase-10--redis--celery-weeks-910)
14. [Phase 11 — Testing (pytest)](#phase-11--testing-pytest-week-10)
15. [Phase 12 — Integrations & Utilities](#phase-12--integrations--utilities-week-11)
16. [Phase 13 — DevOps & Team Workflow](#phase-13--devops--team-workflow-week-12)
17. [Capstone](#capstone)
18. [Python ↔ JavaScript Cheat Sheet](#python--javascript-cheat-sheet)
19. [Resources](#resources)

---

## The Stack at a Glance

| Backend (this repo) | What it does | Frontend analogy |
|---|---|---|
| **Python 3.12** | Language | JavaScript / TypeScript |
| **Poetry** (`pyproject.toml`, `poetry.lock`) | Dependency manager | npm + `package.json` / lockfile |
| **FastAPI** | Web framework (URL → function) | Express / Next.js API routes |
| **Uvicorn / Gunicorn** | Server process | `node server.js` / `next start` |
| **Pydantic** (`schemas/`) | Validate & shape request/response data | TS interfaces + Zod |
| **SQLAlchemy** (`models/`) | ORM: Python classes ↔ DB tables | Prisma / TypeORM |
| **Alembic** (`alembic/versions/`) | DB migrations | Prisma migrate |
| **MySQL** | Main database (master + read replica) | — |
| **Redis** | Cache + Celery job queue | Shared server-side `localStorage` |
| **Celery** (`celery_task.py`) | Background jobs (emails, imports, PDFs) | Web worker on a server |
| **pytest** (`tests/`) | Tests | Jest / Vitest |
| **Docker** (`docker/local/`) | Runs MySQL + Redis locally | — |

**Database:** MySQL via the `pymysql` driver. The default local URL is
`mysql+pymysql://root:root@localhost:3306/DMS_backend` (see
`app/dependencies/config/config.py`). GET requests read from a replica (slave), and
writes go to the master. See `app/dependencies/config/database.py`.

---

## How a Request Flows

Learn this one path well; every module in `app/services/` follows the same pattern.

```
Frontend axios call
  → app/main.py                         registers routers + middleware (auth, CORS, rate-limit)
  → app/services/order/router.py        groups the order routes
  → app/services/order/routers/v0/order_product/get.py   ← endpoint function
       ├─ Depends(get_db)         → DB session     (app/dependencies/config/database.py)
       ├─ Depends(XPagination())  → reads `x-pagination` header
       ├─ Depends(XFilter())      → reads `x-filters` header
       ├─ queries models/order_products.py   (SQLAlchemy → MySQL table "OrderProducts")
       └─ returns schemas/order_products_schema.py  (Pydantic → JSON)
```

**Standard module layout** (`app/services/<module>/`):

| Folder / file | Purpose |
|---|---|
| `router.py` | Groups the module's routes |
| `routers/v0`, `routers/v1` | Endpoint functions (versioned) |
| `models/` | Database tables |
| `schemas/` | Request/response shapes |
| `helpers/` | Business logic |
| `celery_task.py` | Background jobs |
| `crons/` | Scheduled jobs |

---

## Phase 0 — Setup (2–3 days)

📘 **Learn**
- Install Python 3.12, Poetry, and Docker
- VS Code + **Python** and **Pylance** extensions
- Virtual environments (`.venv` ≈ project-local `node_modules`)

📂 **In this repo:** `README.md` (setup steps), `pyproject.toml`, `Makefile`,
`docker/local/docker-compose.yml`, `docker/local/example.env`

✅ **Checkpoint**
- [ ] `poetry install` succeeds
- [ ] App runs (`make run` or `poetry run uvicorn app.main:app --reload --port 8000`)
- [ ] `http://localhost:8000/docs` (Swagger) opens
- [ ] Local MySQL is connected in **DBeaver** / MySQL Workbench

---

## Phase 1 — Python Core (Weeks 1–2)

📘 **Learn**

| Topic | JS equivalent |
|---|---|
| `int`, `float`, `str`, `bool`, `None` | `null` → `None` |
| `list`, `dict`, `tuple`, `set` | array, object, frozen array, `Set` |
| `if` / `elif` / `for` / `while`, indentation | `{}` blocks |
| Functions, default args, `*args`, `**kwargs` | rest / spread |
| f-strings: `f"order {order_id}"` | template literals |
| List/dict comprehensions | `.map()` / `.filter()` |
| `try` / `except` / `finally`, `raise` | `try` / `catch`, `throw` |
| Modules, imports, `__init__.py` | ES modules, `index.js` |
| Truthiness, `is` vs `==` | `===` |

Resource: [Official Python tutorial](https://docs.python.org/3/tutorial/), chapters 3–9.

✅ **Checkpoint**
- [ ] Write a script that reads a JSON file of orders, filters them, groups them by
      customer, and prints the totals

---

## Phase 2 — Intermediate Python (Week 3)

📘 **Learn**
- **Classes**: `__init__`, `self`, inheritance, class vs instance attributes
- **Type hints**: `Optional`, `List`, `Dict`, `Union`, `Any`
- **Decorators** (`@`): how `@router.get`, `@celery.task`, `@check_permission` work
- **Context managers** (`with`)
- **Generators** (`yield`), which `get_db()` uses
- **`async` / `await`**, the event loop, and `def` vs `async def` in FastAPI
  (a sync `def` runs in a threadpool, while an `async def` must not block)
- Std-lib: `datetime`, `decimal.Decimal`, `enum`, `json`, `logging`

📂 **In this repo**
- `app/dependencies/timestampmixin.py`: inheritance / mixins
- `app/services/sso_login/decorator.py`: decorators
- `app/dependencies/config/database.py` → `get_db`: generator
- `app/utils/datetime_util.py`

✅ **Checkpoint**
- [ ] Explain what `@check_permission` does
- [ ] Write your own decorator that logs a function's execution time

---

## Phase 3 — HTTP & REST (Week 4)

📘 **Learn**
- HTTP methods and status codes (200, 201, 400, 401, 403, 404, 422, 500)
- Headers, query params, path params, request body
- REST design and API versioning (the reason for `v0` / `v1` / `v2` here)
- CORS from the server side (`CORSMiddleware` in `app/main.py`)
- JWT auth flow

✅ **Checkpoint**
- [ ] Explain, from the server's side, why the frontend gets a CORS error or a 422

---

## Phase 4 — FastAPI (Weeks 4–5)

📘 **Learn:** the [FastAPI Tutorial – User Guide](https://fastapi.tiangolo.com/tutorial/), all of it:
`APIRouter`, path/query/body params, **`Depends()`**, `HTTPException`,
`response_model`, middleware, lifespan (startup/shutdown), file uploads.

📂 **In this repo**
- `app/main.py`: router registration + middleware
- `app/services/order/router.py` → `routers/v0/order_product/get.py`
- `app/dependencies/pagination/`: backend of the `x-pagination` header
- `app/dependencies/x_filter/`: backend of the `x-filters` header
- `app/dependencies/config/middlewares.py` (AuthMiddleware), `rate_limit_middleware.py`
- `app/custom_response/`: the standard response envelope

✅ **Checkpoint**
- [ ] Build a toy FastAPI app (outside the repo) with CRUD for "notes"
- [ ] Trace one API the frontend uses, end to end, in this repo

---

## Phase 5 — Pydantic (Week 5)

📘 **Learn:** Pydantic v2: `BaseModel`, `Optional` defaults, `Field`,
`field_validator` / `model_validator`, `computed_field`,
`from_attributes=True` (ORM → schema), `model_dump()`.

📂 **In this repo**
- `app/services/order/schemas/order_products_schema.py`
- `app/dependencies/pydantic/`
- `app/utils/validations/`

✅ **Checkpoint**
- [ ] Add a field to a response schema and see it appear in `/docs`
- [ ] Explain why a given request returned 422

---

## Phase 6 — SQL & MySQL (Weeks 6–7)

> This is the biggest gap for frontend developers, so take your time here.

📘 **Learn**
- `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `INSERT`, `UPDATE`, `DELETE`
- `JOIN` (inner / left), `GROUP BY`, `HAVING`, subqueries
- Primary / foreign keys, normalization basics
- **Indexes** and `EXPLAIN`, to understand why queries are slow
- **Transactions**, row locks, deadlocks
- Soft deletes (the `isdeleted` columns used throughout this repo)
- Replication: master vs read replica

Practice: [SQLBolt](https://sqlbolt.com) → [PGExercises](https://pgexercises.com) → your local DB in DBeaver.

📂 **In this repo**
- Browse the `Orders`, `OrderProducts`, `Customers` tables
- Read the index comment in `app/services/order/models/order_products.py`
  (a real-world performance lesson)

✅ **Checkpoint**
- [ ] Write raw SQL: all products for an order, with the customer name
- [ ] Run `EXPLAIN` on it and interpret the result

---

## Phase 7 — SQLAlchemy ORM (Week 8)

📘 **Learn:** the [SQLAlchemy 2.0 Unified Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/):
`Column`, types, `ForeignKey`, `relationship`; sessions (`add`, `commit`,
`rollback`); `db.query(...).filter(...).first()/.all()` (the 1.x style, which is common here);
`and_` / `or_`; joins; `joinedload` (to avoid N+1); raw `text()` SQL.

📂 **In this repo**
- `app/dependencies/base.py`
- `app/services/order/models/*.py`
- `app/utils/utility.py` → `Query.get_filter_paginate`
- `app/dependencies/config/database.py`: master/slave sessions and session lifecycle

✅ **Checkpoint**
- [ ] Rewrite the Phase 6 query in SQLAlchemy
- [ ] Find an N+1 query pattern in an existing endpoint

---

## Phase 8 — Alembic Migrations (Week 8)

📘 **Learn:** `alembic revision --autogenerate -m "..."`, `alembic upgrade head`,
`alembic downgrade -1`, revision chains (`down_revision`), safe migrations on big tables.

📂 **In this repo:** `alembic.ini`, `alembic/env.py`, `alembic/versions/` (read 3 files)

✅ **Checkpoint**
- [ ] Locally: add a column → generate a migration → upgrade → downgrade

---

## Phase 9 — Auth & Security (Week 9)

📘 **Learn:** JWT (sign, verify, expiry), password hashing (argon2 / bcrypt),
permission checks, token revocation, OWASP basics (SQL injection, mass assignment,
secrets in env vars).

📂 **In this repo**
- `app/services/sso_login/`: login and permission decorators
- `app/revocation.py`
- `app/utils/security/`
- `app/services/user_management/helpers/user_helpers.py` → `fetch_accessible_customer_ids`

✅ **Checkpoint**
- [ ] Explain, step by step, what happens when a request arrives with an expired token

---

## Phase 10 — Redis & Celery (Weeks 9–10)

📘 **Learn**
- Redis: GET/SET, TTL, cache invalidation
- Celery: tasks, broker, workers, retries, scheduled jobs
- Flower (a Celery monitoring dashboard)
- Why slow work must not run inside a request

📂 **In this repo**
- `app/dependencies/_redis/`, `app/utils/cache_key_builders.py`
- `app/dependencies/celery/`
- `app/services/file_operations/celery_task.py`: `bind=True`, `max_retries`
- `app/services/order/crons/`, `app/services/cron_manager/`

✅ **Checkpoint**
- [ ] Trigger a Celery task locally and watch it in Flower

---

## Phase 11 — Testing (pytest) (Week 10)

📘 **Learn:** pytest, fixtures, `conftest.py`, `@pytest.mark.parametrize`,
`unittest.mock.patch`, factory_boy, httpx `AsyncClient` for API tests, coverage.

📂 **In this repo**
- `tests/conftest.py`: test DB + fixtures
- `tests/factories/`
- `tests/api/v0`, `tests/api/v1`
- `make test_only`, `make test_debug`

✅ **Checkpoint**
- [ ] Write tests for one endpoint: one success case and one 404 case

---

## Phase 12 — Integrations & Utilities (Week 11)

| Library | Used for | Where to look |
|---|---|---|
| `httpx` / `requests` | Calling other services (GSIT etc.) | `app/utils/internal_requests/` |
| `tenacity` | Retries | `grep -rn tenacity app` |
| `boto3` | AWS S3 files | `app/services/s3_resource/` |
| `pandas` / `openpyxl` | CSV / Excel import-export | `app/services/file_operations/` |
| `fastapi-mail` + Jinja | Emails | `app/templates/`, `app/services/communications/` |
| `borb`, `python-docx`, `python-barcode` | PDFs, docs, labels | `grep -rln "borb\|barcode" app` |
| Stripe | Payments | `app/services/integrations/` |
| Socket.IO | Real-time push | `app/dependencies/socketio/` |
| `loguru`, Slack logger, Prometheus | Logging & metrics | `app/dependencies/loggers/`, `app/main.py` |

✅ **Checkpoint**
- [ ] Follow one CSV import: upload → Celery task → DB

---

## Phase 13 — DevOps & Team Workflow (Week 12)

📘 **Learn:** Docker / docker-compose, `.env` config, Git branching and Bitbucket PRs,
CI (`bitbucket-pipelines.yml`), linting (`make lint`: flake8, isort, mypy),
Gunicorn/Uvicorn workers (`start.sh`), reading production logs, debugging 500s.

✅ **Checkpoint**
- [ ] Open a small PR that passes the pipeline and review

---

## Capstone

Pick one small ticket that touches **both frontend and backend** and do every layer yourself:

```
model → migration → schema → endpoint → test → frontend integration
```

- [ ] Capstone shipped 🎉

---

## Python ↔ JavaScript Cheat Sheet

```python
# Variables & types
name: str = "BJS"                 # const name: string = "BJS"
order_id: Optional[int] = None    # let orderId: number | null = null

# Collections
ids = [1, 2, 3]                   # const ids = [1, 2, 3]
order = {"id": 1, "qty": 2}       # const order = { id: 1, qty: 2 }
order["qty"]                      # order.qty
order.get("missing", 0)           # order.missing ?? 0

# map / filter
doubled = [x * 2 for x in ids]            # ids.map(x => x * 2)
evens = [x for x in ids if x % 2 == 0]    # ids.filter(x => x % 2 === 0)

# Functions
def total(qty: int, price: float = 0.0) -> float:
    return qty * price

# Lambda
square = lambda x: x * x          # const square = x => x * x

# Errors
try:
    risky()
except ValueError as e:           # catch (e)
    raise HTTPException(status_code=400, detail=str(e))

# Async
async def fetch_data():
    result = await client.get(url)

# Classes
class OrderSchema(BaseModel):     # interface OrderSchema { id: number; qty?: number }
    id: int
    qty: Optional[int] = None

# Decorator (wraps a function, like a HOC)
@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    return db.query(Orders).filter(Orders.id == order_id).first()
```

| JS | Python |
|---|---|
| `null` / `undefined` | `None` |
| `true` / `false` | `True` / `False` |
| `&&` / `\|\|` / `!` | `and` / `or` / `not` |
| `===` | `==` (value), `is` (identity, e.g. `is None`) |
| `arr.length` | `len(arr)` |
| `console.log()` | `print()` / `logger.info()` |
| `JSON.parse` / `JSON.stringify` | `json.loads` / `json.dumps` |
| `npm install x` | `poetry add x` |
| `package.json` | `pyproject.toml` |

---

## Resources

| Topic | Link |
|---|---|
| Python | https://docs.python.org/3/tutorial/ |
| FastAPI | https://fastapi.tiangolo.com/tutorial/ |
| Pydantic v2 | https://docs.pydantic.dev/latest/ |
| SQL practice | https://sqlbolt.com |
| SQLAlchemy 2.0 | https://docs.sqlalchemy.org/en/20/tutorial/ |
| Alembic | https://alembic.sqlalchemy.org/en/latest/tutorial.html |
| Celery | https://docs.celeryq.dev/en/stable/getting-started/ |
| pytest | https://docs.pytest.org/en/stable/getting-started.html |
| Redis | https://redis.io/docs/latest/develop/ |

### Weekly habits
1. Read one teammate's backend PR every week and understand every line.
2. Use `http://localhost:8000/docs` (Swagger) as your playground.
3. Keep a notes file of the JS → Python mappings you discover.
4. Ask Claude to explain a file "like I'm a React developer", or to quiz you at each checkpoint.
