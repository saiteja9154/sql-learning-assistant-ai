# Subqueries

### 💡 Concept Explanation
A subquery is a query nested inside another SQL query (inside SELECT, FROM, or WHERE clauses).
* **Scalar Subquery**: Returns a single value.
* **Multi-row Subquery**: Returns a column list of values.
* **Correlated Subquery**: References columns of the outer parent query, executing once for every row processed by the outer query.

### 🔍 Syntax
```sql
SELECT columns
FROM table
WHERE col IN (SELECT col FROM other_table WHERE condition);
```

### 💻 Examples
```sql
-- Find employees earning more than the department average
SELECT emp_id, first_name, salary
FROM Employees E
WHERE salary > (
    SELECT AVG(salary) 
    FROM Employees 
    WHERE dept_id = E.dept_id
);
```

### ⚠️ Common Mistakes
* **Correlated subqueries on massive tables**: Correlated queries execute row-by-row, which can slow performance.
* **Multi-row subquery with =**: Using single value comparison operators (like `=`) when subqueries return multiple values. Use `IN` instead.

### 🎯 Interview Questions
* **Question**: What is a correlated subquery?
* **Answer**: A nested query that references columns of the outer query. It executes repeatedly, once for each row processed by the outer query.

### ⚡ Performance Tips
* Use `EXISTS` instead of `IN` for subquery filters. `EXISTS` stops evaluation once a match is found, whereas `IN` checks all values.

### 🛠️ Best Practices
* Rewrite complex nested subqueries as Common Table Expressions (CTEs) to make the code easier to read.