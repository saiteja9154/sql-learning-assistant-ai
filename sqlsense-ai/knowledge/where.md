# Where

### 💡 Concept Explanation
The `WHERE` clause filters rows returned by a query. It extracts only records that satisfy a specific condition, utilizing operators like `=`, `>`, `<`, `<>`, `LIKE`, `IN`, `BETWEEN`, and logic gates `AND` / `OR`.

### 🔍 Syntax
```sql
SELECT columns
FROM table_name
WHERE condition;
```

### 💻 Examples
```sql
SELECT first_name, salary
FROM Employees
WHERE salary > 75000 AND dept_id = 101;
```

### ⚠️ Common Mistakes
* **Comparing NULL with =**: Writing `WHERE val = NULL`. Use `WHERE val IS NULL` instead.
* **Operator Precedence**: Combining `AND` and `OR` conditions without brackets, causing logic mismatches.

### 🎯 Interview Questions
* **Question**: What is the difference between WHERE and HAVING?
* **Answer**: `WHERE` filters individual rows *before* aggregation. `HAVING` filters group summaries *after* aggregation.

### ⚡ Performance Tips
* Ensure columns used in `WHERE` clauses are properly indexed, especially in large tables.

### 🛠️ Best Practices
* Write clean conditional predicates and put the most restrictive search filter first.