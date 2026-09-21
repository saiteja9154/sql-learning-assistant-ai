# Views

### 💡 Concept Explanation
A View is a virtual table representing the result of a saved SQL query. Views do not store physical rows (unless they are indexed views); instead, they run their underlying SELECT query each time they are referenced.

### 🔍 Syntax
```sql
CREATE VIEW view_name AS
SELECT columns
FROM table
WHERE condition;
```

### 💻 Examples
```sql
CREATE VIEW ActiveStaff AS
SELECT emp_id, first_name, last_name, dept_id
FROM Employees
WHERE status = 'Active';
```

### ⚠️ Common Mistakes
* **Layering Views**: Creating views that query other views, which degrades performance due to complex query expansions.
* **Read-only assumptions**: Attempting complex inserts through multi-table joined views.

### 🎯 Interview Questions
* **Question**: What is an Indexed View?
* **Answer**: A view whose results are calculated and stored on disk. It updates automatically when base tables change.

### ⚡ Performance Tips
* Avoid views containing complex sorting algorithms. Sort results when calling the view, not inside the view itself.

### 🛠️ Best Practices
* Use views to simplify query structures and restrict access to sensitive table columns.