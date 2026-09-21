# Aggregate Functions

### 💡 Concept Explanation
Aggregate functions perform calculations on a set of values and return a single summarizing value. The most common functions are `COUNT()`, `SUM()`, `AVG()`, `MAX()`, and `MIN()`.

### 🔍 Syntax
```sql
SELECT SUM(column), AVG(column), COUNT(column)
FROM table_name;
```

### 💻 Examples
```sql
SELECT COUNT(*) AS total_staff, AVG(salary) AS avg_sal, MAX(salary) AS top_sal
FROM Employees;
```

### ⚠️ Common Mistakes
* **Null Handling**: Assuming aggregate functions include `NULL` values. Most aggregate functions (except `COUNT(*)`) ignore `NULL` entries.
* **Selecting aggregates with non-aggregated columns**: Forgetting to group when selecting regular columns alongside aggregate functions.

### 🎯 Interview Questions
* **Question**: What is the difference between COUNT(*) and COUNT(column_name)?
* **Answer**: `COUNT(*)` counts all rows including NULLs and duplicates. `COUNT(column_name)` counts only non-null values in that column.

### ⚡ Performance Tips
* Use `MIN` and `MAX` on indexed columns. Indexed queries resolve instantly by looking up boundary index records.

### 🛠️ Best Practices
* Wrap calculated aggregate items with database NULL converters (like `COALESCE` or `ISNULL`) to prevent returning empty values.