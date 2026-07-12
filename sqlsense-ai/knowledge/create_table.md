# Create Table

### 💡 Concept Explanation
The `CREATE TABLE` statement is used to build a new table in a database. It defines the table name, the names of columns, their data types, and any constraints (such as `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, or `DEFAULT` values).

### 🔍 Syntax
```sql
CREATE TABLE table_name (
    column_name_1 data_type [constraint],
    column_name_2 data_type [constraint],
    ...
    [table_constraints]
);
```

### 💻 Examples
```sql
CREATE TABLE Employees (
    emp_id INT PRIMARY KEY IDENTITY(1,1),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2) DEFAULT 0.00
);
```

### ⚠️ Common Mistakes
* **Missing constraints**: Forgetting `NOT NULL` on fields that require valid data, leading to corrupt or missing rows.
* **Incorrect Identity/Serial Syntax**: Using system-specific serial increment indicators incorrectly.

### 🎯 Interview Questions
* **Question**: What is the difference between column constraints and table constraints?
* **Answer**: Column constraints apply to a single column (e.g., `NOT NULL`). Table constraints apply to multiple columns (e.g., composite primary keys).

### ⚡ Performance Tips
* Place columns that are frequently indexed or referenced near the front of the column definitions to speed up scanning.

### 🛠️ Best Practices
* Always declare foreign keys at table creation time to maintain relational integrity from the start.