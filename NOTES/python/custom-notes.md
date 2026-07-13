##  What is venv (Virtual Environment)?

```
Think of your computer as a house. Python packages are like furniture.

Without venv → every project shares the same furniture → they conflict.
With venv → each project gets its own room with its own furniture.
```

## 2. 📦 Why use Poetry?

```
Poetry = npm/yarn but for Python. It manages:

npm (JS)	Poetry (Python)	Purpose
package.json	pyproject.toml	List of dependencies
package-lock.json	poetry.lock	Exact locked versions
npm install	poetry install	Install everything
node_modules/	venv folder	Where packages live
Without Poetry → you manually track versions → dependency hell.
With Poetry → one poetry install gives everyone the same exact environment.

```


## 3. 🗄️ FastAPI
```
FastAPI is the web framework — it handles HTTP requests/responses.

Browser sends: GET /v1/orders/123
       ↓
FastAPI router receives it
       ↓
Calls your Python function
       ↓
Returns JSON response

It's like Django/Express but much faster and built for async Python. It auto-generates Swagger docs at /docs

```

## 4. 🔗 SQLAlchemy (async)

```
SQLAlchemy is the ORM — it lets you talk to MySQL using Python objects instead of raw SQL.

python
# Without ORM (raw SQL)
cursor.execute("SELECT * FROM orders WHERE id = 123")
# With SQLAlchemy ORM
order = await db.get(Order, 123)  # same thing, but Pythonic
The async part means the server doesn't freeze while waiting for DB responses — it handles other requests in parallel.

```

## 5. 🐬 MySQL

The relational database — stores all your data (orders, customers, finance, etc.) in tables. SQLAlchemy talks to MySQL under the hood.

## 6. ⚡ Redis
```
Redis = super fast in-memory key-value store. Used here for:

Caching → store frequent query results so DB isn't hit every time
Celery broker → a "message queue" where Celery picks up background tasks
Think of it like a whiteboard — super fast to read/write, but doesn't persist forever.

```

## 7. 🌿 Celery

```
Celery runs tasks in the background — things that are too slow to do while the user waits.

User clicks "Export CSV"
       ↓
FastAPI says "OK, I'll do it in background" (responds instantly)
       ↓
Celery worker picks up the job from Redis queue
       ↓
Generates CSV, emails it to user
Without Celery → user waits 30 seconds staring at a spinner.
With Celery → user gets an instant response, email arrives later.
```

## 8. 📋 Alembic — alembic upgrade head

```
Alembic is a database migration tool. When you change your Python models (add a column, create a table), Alembic generates SQL scripts to update the real database.

alembic upgrade head
         ↓
"Apply ALL pending migration scripts to the DB"
         ↓
HEAD = latest migration version
Same concept as git but for your database schema. Without it, your code and DB get out of sync.
```

## poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

<img width="657" height="344" alt="image" src="https://github.com/user-attachments/assets/58bfcf9a-66d1-4d3a-9e0f-97dfee932b8b" />


## Flower = a web dashboard to monitor Celery.
```
Open http://localhost:5001 and you can see:

Which tasks are running / failed / succeeded
How many workers are active
Task history and timing

```
<img width="702" height="178" alt="image" src="https://github.com/user-attachments/assets/7c936ed3-3870-4e51-a1cf-142288f84817" />

