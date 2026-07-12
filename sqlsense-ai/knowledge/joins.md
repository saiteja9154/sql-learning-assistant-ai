# Joins

### 💡 Concept Explanation
Joins combine columns from two or more tables based on a related column between them.
* **INNER JOIN**: Returns rows with matching keys in both tables.
* **LEFT JOIN**: Returns all rows from the left table, and matching records from the right table. Fill right side with NULL if no match.
* **RIGHT JOIN**: Returns all rows from the right table, and matching records from the left table.
* **FULL OUTER JOIN**: Returns rows when there is a match in either left or right table.
* **CROSS JOIN**: Returns the Cartesian product of the two tables.

### 🔍 Syntax
```sql
SELECT columns
FROM table1
[INNER|LEFT|RIGHT|FULL] JOIN table2
ON table1.common_column = table2.common_column;
```

### 💻 Examples
```sql
SELECT E.first_name, D.dept_name
FROM Employees E
INNER JOIN Departments D ON E.dept_id = D.dept_id;
```

### ⚠️ Common Mistakes
* **Missing join conditions**: Forgetting the `ON` clause, leading to huge Cartesian products (Cross Join).
* **Ambiguous columns**: Selecting columns with the same name from joined tables without prefixing them with table aliases.

### 🎯 Interview Questions
* **Question**: What is a Self Join?
* **Answer**: A Self Join is a regular join where a table is joined with itself. It requires distinct table alias aliases (e.g., matching employees to managers in the same table).

### ⚡ Performance Tips
* Always index foreign key fields to speed up join comparisons.

### 🛠️ Best Practices
* Use simple, readable table aliases (e.g., `E` for `Employees`, `D` for `Departments`) in all JOIN queries.