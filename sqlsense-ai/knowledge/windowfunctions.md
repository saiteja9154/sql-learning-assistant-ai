# Window Functions

### 💡 Concept Explanation
Window functions perform calculations across a set of table rows that are related to the current row. Unlike aggregate functions, they do not collapse rows; instead, they retain individual row structures while computing running totals, rankings, or moving averages. They use the `OVER` clause.

### 🔍 Syntax
```sql
SELECT column, window_function() OVER (
    [PARTITION BY partition_column]
    [ORDER BY sort_column]
)
FROM table_name;
```

### 💻 Examples
```sql
-- Rank employees by salary inside each department
SELECT first_name, dept_id, salary,
       DENSE_RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) AS sal_rank
FROM Employees;
```

### ⚠️ Common Mistakes
* **Where clause filtering**: Attempting to filter window function metrics inside `WHERE` (e.g. `WHERE RANK() OVER(...) = 1`). Wrap the query in a CTE to filter.
* **Confusing RANK and DENSE_RANK**: `RANK` skips numbers on ties, whereas `DENSE_RANK` leaves no gaps.

### 🎯 Interview Questions
* **Question**: What is the difference between ROW_NUMBER, RANK, and DENSE_RANK?
* **Answer**: `ROW_NUMBER` assigns unique sequential numbers. `RANK` handles duplicates with gaps. `DENSE_RANK` handles duplicates with no ranking gaps.

### ⚡ Performance Tips
* Window functions require sorting operations. Ensure columns in the `ORDER BY` clause of the window function have supporting indexes.

### 🛠️ Best Practices
* Use `PARTITION BY` to define local data groups, keeping calculations focused.