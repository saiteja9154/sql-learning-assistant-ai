# Tables

### 💡 Concept Explanation
Tables are the core structures of relational databases. They contain all the data stored in the database. A table is organized into vertical columns (fields/attributes) and horizontal rows (records/tuples). Each column has a defined data type (e.g., INT, VARCHAR, DATE) that limits the kind of data it can hold.

### 🔍 Syntax
```sql
CREATE TABLE table_name (
    column1 datatype constraints,
    column2 datatype constraints,
    ...
);
```

### 💻 Examples
```sql
CREATE TABLE Departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL
);
```

### ⚠️ Common Mistakes
* **Lack of Primary Key**: Creating tables without defining a primary key, leading to duplicate records and slower search lookups.
* **Improper Data Types**: Allocating too much space (e.g., using `VARCHAR(8000)` for short flags), which wastes memory.

### 🎯 Interview Questions
* **Question**: What is a table in a database?
* **Answer**: A table is a collection of related data entries consisting of columns and rows that store organized structured information.

### ⚡ Performance Tips
* Keep row width minimal. Use appropriate numeric scale types (e.g. `TINYINT` for numbers 0-255) rather than standard `INT` or `BIGINT` to reduce storage.

### 🛠️ Best Practices
* Use plural or singular naming consistently (e.g., `Employees` or `Employee`), and always name columns logically.