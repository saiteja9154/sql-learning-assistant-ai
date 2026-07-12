# Delete

### 💡 Concept Explanation
The `DELETE` statement is used to remove existing records from a table. You select which rows to delete using a `WHERE` clause.

### 🔍 Syntax
```sql
DELETE FROM table_name
WHERE condition;
```

### 💻 Examples
```sql
DELETE FROM Employees
WHERE hire_date < '2020-01-01';
```

### ⚠️ Common Mistakes
* **Missing WHERE clause**: Omitting the `WHERE` clause deletes **all records** in the table.
* **Violating foreign key constraints**: Deleting a parent row that still has active child references.

### 🎯 Interview Questions
* **Question**: What is the difference between DELETE and TRUNCATE?
* **Answer**: `DELETE` is a DML command that deletes rows one-by-one and can be rolled back. `TRUNCATE` is a DDL command that deallocates data pages, is faster, and deletes all rows.

### ⚡ Performance Tips
* Deleting massive numbers of rows in a single batch can lock tables. Delete records in smaller, indexed batches.

### 🛠️ Best Practices
* Wrap updates/deletes in transactions and run them within `BEGIN TRAN` so they can be inspected before final commit.