# Group By

### 💡 Concept Explanation
The `GROUP BY` statement groups rows that have the same values into summary rows. It is used with aggregate functions (like `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`) to calculate metrics for each group category.

### 🔍 Syntax
```sql
SELECT column, aggregate_function(column)
FROM table_name
WHERE condition
GROUP BY column;
```

### 💻 Examples
```sql
SELECT dept_id, COUNT(emp_id) AS total_employees, AVG(salary) AS average_salary
FROM Employees
GROUP BY dept_id;
```

### ⚠️ Common Mistakes
* **Selecting non-aggregated columns**: Including columns in the `SELECT` list that are not in the `GROUP BY` clause (except inside aggregate functions).
* **Using WHERE instead of HAVING**: Attempting to filter aggregate summaries (like `SUM(salary)`) using a `WHERE` clause.

### 🎯 Interview Questions
* **Question**: Can you use GROUP BY without any aggregate functions?
* **Answer**: Yes. Doing so behaves similarly to the `DISTINCT` keyword, group-collapsing duplicate rows.

### ⚡ Performance Tips
* Filter table sizes first using a `WHERE` clause *before* applying `GROUP BY` to reduce group hashing operations.

### 🛠️ Best Practices
* Always provide clear column aliases to grouped calculated results.