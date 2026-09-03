# MySQL Notes (SQL Fundamentals & Node.js Integration)

A comprehensive, interview-friendly cheat sheet for MySQL fundamentals, SQL queries, database administration, and Node.js (`mysql2`) integration.

---

## 1. Fundamentals: DBMS & MySQL Workbench

- **DBMS (Database Management System):** Software interacting with users, apps, and DB to store, retrieve, and manage data.
- **MySQL Workbench:** Official GUI tool for DB architects and developers to manage models, run SQL queries, and administer servers.
- **Database Analogy:**
  - **Folder Analogy:** Database = Folder | Table = File | Row = Content inside file.
  - **Excel Analogy:** Database = Workbook | Table = Sheet | Row = Single row in sheet.

---

## 2. Installation & User Setup (Ubuntu/Linux)

```bash
sudo apt update && sudo apt install mysql-server
sudo mysql_secure_installation

# Log into MySQL CLI
sudo mysql
```

```sql
-- Create User & Grant Privileges
CREATE USER 'harry'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'harry'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```
```bash
# Test Login
mysql -u harry -p
```

---

## 3. Data Types & Constraints Quick Reference

### Data Types

| Data Type | Description | Example / Usage |
|---|---|---|
| `INT` | Whole numbers | `id INT` |
| `VARCHAR(N)` | Variable-length text up to N chars | `name VARCHAR(100)` |
| `ENUM` | Restricted list of predefined string values | `gender ENUM('Male', 'Female', 'Other')` |
| `DATE` | Date formatted as `YYYY-MM-DD` | `dob DATE` |
| `TIMESTAMP` | Date and time (auto-set on insert) | `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` |
| `BOOLEAN` | True (`1`) or False (`0`) flag | `is_active BOOLEAN DEFAULT TRUE` |
| `DECIMAL(P, D)` | Exact decimal (P = total digits, D = decimals) | `salary DECIMAL(10, 2)` |

### Constraints

| Constraint | Purpose | Example |
|---|---|---|
| `PRIMARY KEY` | Uniquely identifies each row (Unique + NOT NULL) | `id INT AUTO_INCREMENT PRIMARY KEY` |
| `AUTO_INCREMENT` | Auto-generates next integer for new rows | `id INT AUTO_INCREMENT` |
| `NOT NULL` | Prevents NULL values in column | `name VARCHAR(100) NOT NULL` |
| `UNIQUE` | Enforces all values in column are unique | `email VARCHAR(100) UNIQUE` |
| `DEFAULT` | Sets default value if none provided | `is_active BOOLEAN DEFAULT TRUE` |
| `CHECK` | Enforces custom logical condition | `CHECK (date_of_birth > '2000-01-01')` |
| `FOREIGN KEY` | Links column to Primary Key in parent table | `FOREIGN KEY (user_id) REFERENCES users(id)` |

---

## 4. DDL: Managing Databases & Tables

```sql
-- Database Management
CREATE DATABASE IF NOT EXISTS startersql;
USE startersql;
DROP DATABASE startersql;

-- Create Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  gender ENUM('Male', 'Female', 'Other'),
  date_of_birth DATE,
  salary DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alter Table Operations
RENAME TABLE users TO customers;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users DROP COLUMN is_active;
ALTER TABLE users MODIFY COLUMN name VARCHAR(150);
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) FIRST;
ALTER TABLE users MODIFY COLUMN gender ENUM('Male', 'Female', 'Other') AFTER name;
ALTER TABLE users CHANGE COLUMN city location VARCHAR(150); -- Rename & change type
```

---

## 5. DML: Insert, Update, Delete & Truncate

```sql
-- INSERT (Best Practice: Specify Column Names)
INSERT INTO users (name, email, gender, date_of_birth, salary) 
VALUES ('Alice', 'alice@example.com', 'Female', '1995-05-14', 65000);

-- Bulk Insert
INSERT INTO users (name, email, gender, date_of_birth, salary) VALUES
('Bob', 'bob@example.com', 'Male', '1990-11-23', 55000),
('Charlie', 'charlie@example.com', 'Other', '1988-02-17', 72000);

-- UPDATE (Always use WHERE!)
UPDATE users SET name = 'Alicia' WHERE id = 1;
UPDATE users SET salary = salary + 10000 WHERE salary < 60000;

-- DELETE vs TRUNCATE vs DROP
DELETE FROM users WHERE id = 3;     -- Deletes specific row(s), logs deleted rows
DELETE FROM users;                  -- Deletes all rows, preserves table structure
TRUNCATE TABLE users;               -- Wipes all rows fast, resets AUTO_INCREMENT
DROP TABLE users;                   -- Permanently deletes table structure + data
```

---

## 6. DQL: Querying with SELECT, Filters & Operators

```sql
-- Basic Select & DISTINCT
SELECT * FROM users;
SELECT DISTINCT gender FROM users;

-- Filtering (WHERE)
SELECT * FROM users WHERE gender = 'Male';
SELECT * FROM users WHERE date_of_birth IS NOT NULL;
SELECT * FROM users WHERE salary BETWEEN 50000 AND 70000;
SELECT * FROM users WHERE gender IN ('Male', 'Other');

-- Wildcards (LIKE)
SELECT * FROM users WHERE name LIKE 'A%';   -- Starts with A
SELECT * FROM users WHERE name LIKE '%a';   -- Ends with a
SELECT * FROM users WHERE name LIKE '%li%'; -- Contains 'li'
SELECT * FROM users WHERE name LIKE '_a%';  -- 2nd letter is 'a'

-- Sorting & Pagination
SELECT * FROM users ORDER BY date_of_birth ASC;
SELECT * FROM users ORDER BY salary DESC LIMIT 5;
SELECT * FROM users ORDER BY id LIMIT 5 OFFSET 10; -- Skip 10, take 5
```

---

## 7. Aggregation, GROUP BY & HAVING

```sql
-- Aggregate Functions
SELECT COUNT(*) FROM users;
SELECT MIN(salary) AS min_sal, MAX(salary) AS max_sal FROM users;
SELECT SUM(salary) AS total_payroll, AVG(salary) AS avg_sal FROM users;

-- GROUP BY & HAVING
SELECT gender, AVG(salary) AS avg_salary
FROM users
GROUP BY gender
HAVING AVG(salary) > 75000; -- HAVING filters AFTER aggregation (WHERE filters BEFORE)

-- ROLLUP (Subtotals + Grand Total)
SELECT gender, COUNT(*) AS total_users
FROM users
GROUP BY gender WITH ROLLUP;
```

---

## 8. Built-in SQL Functions

| Category | Function | Usage Example |
|---|---|---|
| **String** | `LENGTH()`, `LOWER()`, `UPPER()`, `CONCAT()` | `SELECT CONCAT(name, ' <', email, '>') FROM users;` |
| **Date** | `NOW()`, `YEAR()`, `MONTH()`, `DAY()` | `SELECT YEAR(date_of_birth) FROM users;` |
| **Date Math** | `DATEDIFF()`, `TIMESTAMPDIFF()` | `SELECT TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age;` |
| **Math** | `ROUND()`, `FLOOR()`, `CEIL()`, `MOD()` | `SELECT ROUND(salary), MOD(id, 2) FROM users;` |
| **Control** | `IF(condition, true_val, false_val)` | `SELECT IF(gender='Female', 'Yes', 'No') FROM users;` |

---

## 9. Relationships, Foreign Keys & JOINs

```sql
-- Create Foreign Key with ON DELETE CASCADE
CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  street VARCHAR(255),
  city VARCHAR(100),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Foreign Key ON DELETE Options:
-- 1. CASCADE: Deletes child rows when parent is deleted.
-- 2. SET NULL: Sets foreign key column to NULL in child.
-- 3. RESTRICT (Default): Prevents deletion of parent if child exists.
```

### JOIN Types

```sql
-- 1. INNER JOIN (Matching rows in BOTH tables)
SELECT users.name, addresses.city
FROM users
INNER JOIN addresses ON users.id = addresses.user_id;

-- 2. LEFT JOIN (All rows from LEFT table + matching from RIGHT)
SELECT users.name, addresses.city
FROM users
LEFT JOIN addresses ON users.id = addresses.user_id;

-- 3. RIGHT JOIN (All rows from RIGHT table + matching from LEFT)
SELECT users.name, addresses.city
FROM users
RIGHT JOIN addresses ON users.id = addresses.user_id;

-- 4. Self JOIN (Joining a table with itself e.g., Referrals)
SELECT u.name AS user_name, r.name AS referred_by
FROM users u
LEFT JOIN users r ON u.referred_by_id = r.id;
```

---

## 10. Advanced Concepts: Views, Subqueries, UNION, Transactions & Triggers

### Views (Virtual Saved Queries)
```sql
CREATE VIEW high_salary_users AS
SELECT id, name, salary FROM users WHERE salary > 70000;

SELECT * FROM high_salary_users; -- Always reflects live data from base table
DROP VIEW high_salary_users;
```

### Subqueries
```sql
-- Scalar Subquery in WHERE
SELECT name, salary FROM users 
WHERE salary > (SELECT AVG(salary) FROM users);

-- Subquery with IN
SELECT name FROM users 
WHERE referred_by_id IN (SELECT id FROM users WHERE salary > 75000);
```

### UNION vs UNION ALL
```sql
SELECT name FROM users UNION SELECT name FROM admin_users;     -- Unique names only
SELECT name FROM users UNION ALL SELECT name FROM admin_users; -- Includes duplicates
```

### Transactions & AutoCommit
```sql
SET autocommit = 0; -- Disable AutoCommit

UPDATE users SET salary = 80000 WHERE id = 5;

-- Choose outcome:
COMMIT;    -- Save changes permanently
-- OR
ROLLBACK;  -- Undo changes to previous commit

SET autocommit = 1; -- Re-enable AutoCommit
```

### Stored Procedures & Triggers
```sql
-- Stored Procedure
DELIMITER $$
CREATE PROCEDURE AddUser(IN p_name VARCHAR(100), IN p_email VARCHAR(100))
BEGIN
  INSERT INTO users (name, email) VALUES (p_name, p_email);
END$$
DELIMITER ;

CALL AddUser('Kiran', 'kiran@example.com');

-- Trigger (Auto-log inserts)
DELIMITER $$
CREATE TRIGGER after_user_insert
AFTER INSERT ON users FOR EACH ROW
BEGIN
  INSERT INTO user_log (user_id, name) VALUES (NEW.id, NEW.name);
END$$
DELIMITER ;
```

---

## 11. Node.js Integration (`mysql2/promise`)

```js
const mysql = require('mysql2/promise');

// Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'harry',
  password: 'password',
  database: 'startersql',
  waitForConnections: true,
  connectionLimit: 10
});

// Execute Prepared Statements (Prevents SQL Injection)
const [rows] = await pool.query('SELECT * FROM users WHERE gender = ? AND salary > ?', ['Female', 60000]);
const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com']);
console.log('New User ID:', result.insertId);
```

---

## 12. Quick Interview Q&A Cheat Sheet

| Question | Quick Answer |
|---|---|
| `PRIMARY KEY` vs `UNIQUE`? | `PRIMARY KEY` = 1 per table, no NULLs allowed. `UNIQUE` = multiple allowed per table, permits NULL values. |
| `WHERE` vs `HAVING`? | `WHERE` filters rows BEFORE grouping; `HAVING` filters aggregated groups AFTER `GROUP BY`. |
| `DELETE` vs `TRUNCATE`? | `DELETE` removes specific rows & logs them. `TRUNCATE` drops & recreates table, resetting auto-increment. |
| `UNION` vs `UNION ALL`? | `UNION` removes duplicate rows; `UNION ALL` retains all duplicates. |
| How to prevent SQL Injection in Node.js? | Use `?` placeholders with prepared statements via `mysql2` pool queries (`pool.query(sql, [val1, val2])`). |
| What is a View? | A virtual table storing a `SELECT` query definition. It displays live, up-to-date base table data. |
| What is a Foreign Key constraint? | A column linking child table rows to a parent table's Primary Key, enforcing referential integrity. |
