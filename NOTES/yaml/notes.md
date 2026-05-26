# 📄 YAML — Basic Notes

> **YAML Ain't Markup Language**  
> A human-readable data serialization format used in config files, CI/CD pipelines, Docker, Kubernetes, and more.

---

## 📋 Table of Contents

- [What is YAML?](#what-is-yaml)
- [File Extensions](#file-extensions)
- [Basic Rules](#basic-rules)
- [Comments](#comments)
- [Data Types](#data-types)
- [Strings](#strings)
- [Numbers](#numbers)
- [Booleans](#booleans)
- [Null](#null)
- [Lists / Arrays](#lists--arrays)
- [Dictionaries / Objects](#dictionaries--objects)
- [Nested Structures](#nested-structures)
- [Multiline Strings](#multiline-strings)
- [Anchors & Aliases](#anchors--aliases)
- [Multiple Documents](#multiple-documents)
- [Real World Examples](#real-world-examples)
- [Quick Cheat Sheet](#quick-cheat-sheet)

---

## What is YAML?

- Human-friendly config format
- Superset of JSON — all valid JSON is valid YAML
- Used in: Docker, Kubernetes, GitHub Actions, Ansible, CI/CD
- **Indentation-based** — uses spaces (NOT tabs)

---

## File Extensions

```
config.yaml   ✅ preferred
config.yml    ✅ also valid
```

---

## Basic Rules

- Use **spaces** only — never tabs
- **Indentation** defines structure (usually 2 spaces)
- **Case-sensitive** (`Name` ≠ `name`)
- Colon + space (`: `) separates key and value
- No closing brackets or braces needed

---

## Comments

```yaml
# This is a single-line comment

name: Ali  # inline comment

# YAML does NOT support multi-line block comments
# Use multiple # lines instead
```

---

## Data Types

YAML auto-detects the type based on the value.

```yaml
name: Ali          # string
age: 25            # integer
price: 99.99       # float
is_active: true    # boolean
nothing: null      # null
```

---

## Strings

```yaml
# No quotes needed for simple strings
name: Ali Ahmed

# Use quotes when string has special characters
message: "Hello: World"
path: 'C:\Users\Ali'

# Quotes needed for strings that look like other types
version: "1.0"        # without quotes → float
active: "true"        # without quotes → boolean
empty: ""             # empty string
```

---

## Numbers

```yaml
integer: 42
negative: -10
float: 3.14
scientific: 1.5e10
octal: 0o17          # octal
hex: 0xFF            # hexadecimal
```

---

## Booleans

```yaml
# All are valid booleans in YAML 1.1
is_active: true
is_deleted: false
flag1: yes           # true
flag2: no            # false
flag3: on            # true
flag4: off           # false

# ⚠️ YAML 1.2 only recognizes: true / false
```

---

## Null

```yaml
middle_name: null
nickname: ~           # also null
empty_key:            # also null (no value)
```

---

## Lists / Arrays

```yaml
# Block style (recommended)
fruits:
  - apple
  - banana
  - mango

# Inline / flow style
fruits: [apple, banana, mango]

# List of numbers
scores:
  - 95
  - 87
  - 72

# List of mixed types
mixed:
  - Ali
  - 25
  - true
  - null
```

---

## Dictionaries / Objects

```yaml
# Block style
person:
  name: Ali
  age: 25
  city: Karachi

# Inline / flow style
person: { name: Ali, age: 25, city: Karachi }
```

---

## Nested Structures

```yaml
# Object inside object
company:
  name: BJS Distribution
  address:
    street: Main Road
    city: Karachi
    country: Pakistan

# List of objects
employees:
  - name: Ali
    role: Developer
    age: 25
  - name: Sara
    role: Designer
    age: 28

# Object with list
config:
  ports:
    - 8080
    - 443
  tags:
    - web
    - api
```

---

## Multiline Strings

### Literal Block (`|`) — preserves newlines

```yaml
description: |
  This is line one.
  This is line two.
  This is line three.
# Output:
# "This is line one.\nThis is line two.\nThis is line three.\n"
```

### Folded Block (`>`) — folds newlines into spaces

```yaml
description: >
  This is a long sentence
  that continues on the next line
  but will be joined with spaces.
# Output:
# "This is a long sentence that continues on the next line but will be joined with spaces.\n"
```

### Chomping Indicators

```yaml
keep_trailing: |+
  text with trailing newlines preserved

strip_trailing: |-
  text with trailing newlines stripped
```

---

## Anchors & Aliases

Reuse values with `&` (anchor) and `*` (alias) — avoids repetition.

```yaml
# Define anchor
defaults: &defaults
  timeout: 30
  retries: 3
  env: production

# Reuse with alias
service_a:
  <<: *defaults       # merge all defaults
  name: service-a

service_b:
  <<: *defaults       # merge all defaults
  name: service-b
  timeout: 60         # override one value

# Result for service_b:
# timeout: 60, retries: 3, env: production, name: service-b
```

---

## Multiple Documents

Use `---` to separate multiple YAML documents in one file.

```yaml
---
name: Document One
version: 1.0

---
name: Document Two
version: 2.0
```

Use `...` to explicitly end a document.

```yaml
---
name: Ali
age: 25
...
```

---

## Real World Examples

### Docker Compose

```yaml
version: "3.8"

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    environment:
      - NODE_ENV=production

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

---

### GitHub Actions

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

---

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:1.0.0
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
```

---

## Quick Cheat Sheet

```yaml
# ── TYPES ──────────────────────────────
string:  Hello World
integer: 42
float:   3.14
boolean: true
null:    null

# ── LIST ───────────────────────────────
items:
  - one
  - two
  - three
inline: [one, two, three]

# ── OBJECT ─────────────────────────────
person:
  name: Ali
  age: 25
inline: { name: Ali, age: 25 }

# ── NESTED ─────────────────────────────
config:
  db:
    host: localhost
    port: 5432
  cache:
    - redis
    - memcache

# ── MULTILINE ──────────────────────────
literal: |
  Line one
  Line two

folded: >
  This is one
  long sentence

# ── ANCHOR & ALIAS ─────────────────────
base: &base
  env: prod
  timeout: 30

service:
  <<: *base
  name: api

# ── COMMENT ────────────────────────────
# This is a comment
```

---

## ⚠️ Common Mistakes

| Mistake | Wrong | Correct |
|---|---|---|
| Using tabs | `→key: value` | `  key: value` (spaces) |
| Missing space after `:` | `name:Ali` | `name: Ali` |
| Inconsistent indentation | mixing 2 and 4 spaces | always use 2 spaces |
| Unquoted special chars | `url: http://x.com` | `url: "http://x.com"` |
| Boolean as string | `active: "true"` | `active: true` |

---

> 📖 Official Spec: [yaml.org](https://yaml.org)  
> 🧪 Online Validator: [yamllint.com](https://www.yamllint.com)