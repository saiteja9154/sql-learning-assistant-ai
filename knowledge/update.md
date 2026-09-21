# Update

### 💡 Concept Explanation
The `UPDATE` statement modifies existing records in a table. It is used to change specific columns based on conditions defined in a `WHERE` clause.

### 🔍 Syntax
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

### 💻 Examples
```sql
UPDATE Employees
SET salary = salary * 1.10
WHERE dept_id = 101;
```

### ⚠️ Common Mistakes
* **Forgetting the WHERE clause**: Omitting `WHERE` applies the update to **every single row** in the table, corrupting data.
* **Mismatch types**: Attempting to update integer fields with string text.

### 🎯 Interview Questions
* **Question**: What happens if you omit the WHERE clause in an UPDATE statement?
* **Answer**: Every row in the table is updated with the new values.

### ⚡ Performance Tips
* Update only modified columns. Avoid updating un-updated columns, which triggers index recalculations.

### 🛠️ Best Practices
* Before running updates on production databases, write the query as a `SELECT` first to verify the target rows match.