# Common Table Expressions (CTE)

### 💡 Concept Explanation
A Common Table Expression (CTE) is a temporary result set defined within the execution scope of a single query. It is constructed using the `WITH` keyword, making complex query operations and nested joins much more readable.

### 🔍 Syntax
```sql
WITH cte_name AS (
    SELECT columns
    FROM table
    WHERE condition
)
SELECT columns
FROM cte_name;
```

### 💻 Examples
```sql
WITH HighPaidEng AS (
    SELECT emp_id, first_name, salary
    FROM Employees
    WHERE dept_id = 101 AND salary > 80000
)
SELECT *
FROM HighPaidEng
ORDER BY salary DESC;
```

### ⚠️ Common Mistakes
* **Scope restriction**: Attempting to reference a CTE outside the query that immediately follows its definition.
* **Missing recursive anchor**: Writing recursive CTEs without clear anchor members or exit conditions.

### 🎯 Interview Questions
* **Question**: What is the difference between a CTE and a Temporary Table?
* **Answer**: A CTE is query-scoped and exists only in memory during execution. Temporary tables (`#temp`) are session-scoped and stored in tempdb storage.

### ⚡ Performance Tips
* Most database query optimizers treat CTEs as inline views. Avoid using multiple layered CTE structures, which can confuse compiler optimization paths.

### 🛠️ Best Practices
* Use CTEs to document and structure complex logic, replacing multi-level nested joins.