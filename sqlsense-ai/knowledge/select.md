# Select

### 💡 Concept Explanation
The `SELECT` statement is the primary query mechanism in SQL. It retrieves records from one or more tables. You can select specific columns, apply arithmetic functions, use aliasing, and filter matching rows.

### 🔍 Syntax
```sql
SELECT column1, column2, ...
FROM table_name;
```

### 💻 Examples
```sql
SELECT emp_id, first_name, salary
FROM Employees;
```

### ⚠️ Common Mistakes
* **Using SELECT ***: Selecting all columns (`SELECT *`) pulls unnecessary columns, increasing network traffic and disk I/O.
* **Missing Alias**: Writing queries without naming calculated columns.

### 🎯 Interview Questions
* **Question**: Why is using SELECT * considered bad practice?
* **Answer**: It degrades query performance, retrieves unnecessary columns, and can break application code if table schemas change.

### ⚡ Performance Tips
* Always specify explicit columns instead of using `SELECT *` to minimize column fetching overhead.

### 🛠️ Best Practices
* Use uppercase SQL syntax keywords (`SELECT`, `FROM`) and indent code blocks logically for readability.