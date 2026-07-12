# Having

### 💡 Concept Explanation
The `HAVING` clause is used to filter result groups created by the `GROUP BY` clause. It functions similarly to the `WHERE` clause, but operates on aggregate data rather than individual records.

### 🔍 Syntax
```sql
SELECT column, aggregate_function(column)
FROM table_name
GROUP BY column
HAVING aggregate_condition;
```

### 💻 Examples
```sql
SELECT dept_id, SUM(salary) AS total_payroll
FROM Employees
GROUP BY dept_id
HAVING SUM(salary) > 500000;
```

### ⚠️ Common Mistakes
* **HAVING without GROUP BY**: Using HAVING without a GROUP BY statement (unless referencing global aggregates).
* **Filtering raw columns**: Filtering column rows that do not represent aggregate metrics in HAVING instead of using WHERE.

### 🎯 Interview Questions
* **Question**: Can WHERE and HAVING be used in the same query?
* **Answer**: Yes. `WHERE` filters input rows first, `GROUP BY` aggregates them, and `HAVING` filters the aggregate groups.

### ⚡ Performance Tips
* Never write conditions in `HAVING` that do not require aggregates. Put row-level checks in `WHERE` to speed up query execution.

### 🛠️ Best Practices
* Keep HAVING clauses clean, containing aggregate conditions only.