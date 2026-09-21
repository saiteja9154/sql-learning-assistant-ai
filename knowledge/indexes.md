# Indexes

### 💡 Concept Explanation
Indexes are disk structures associated with tables that accelerate query lookup speeds.
* **Clustered Index**: Determines the physical storage order of rows. A table can only have one clustered index (usually on the primary key).
* **Non-Clustered Index**: Creates separate lookup structures pointing to the table pages.

### 🔍 Syntax
```sql
CREATE [UNIQUE] INDEX index_name
ON table_name (column1, column2, ...);
```

### 💻 Examples
```sql
CREATE INDEX idx_emp_salary
ON Employees (salary);
```

### ⚠️ Common Mistakes
* **Over-indexing**: Indexing every column in a table, which slows down `INSERT`, `UPDATE`, and `DELETE` operations.
* **Index scan triggers**: Querying columns with functions (e.g. `WHERE YEAR(date) = 2025`), which prevents the query planner from using the index.

### 🎯 Interview Questions
* **Question**: What is the difference between Clustered and Non-Clustered indexes?
* **Answer**: A clustered index stores the table data itself in sorted order. A non-clustered index stores references to the actual data locations.

### ⚡ Performance Tips
* Index columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses to improve lookup speeds.

### 🛠️ Best Practices
* Monitor index usage metrics and rebuild fragmented index structures periodically.