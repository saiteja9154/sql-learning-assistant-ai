# Primary Key

### 💡 Concept Explanation
A Primary Key uniquely identifies each record in a database table. It must contain unique values and cannot contain `NULL` values. A table can only have one primary key, which can consist of a single column or multiple columns (composite primary key).

### 🔍 Syntax
```sql
-- Single Column Primary Key
CREATE TABLE table_name (
    id INT PRIMARY KEY,
    ...
);

-- Composite Primary Key
CREATE TABLE table_name (
    col1 INT,
    col2 INT,
    PRIMARY KEY (col1, col2)
);
```

### 💻 Examples
```sql
CREATE TABLE OrderItems (
    order_id INT,
    item_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, item_id)
);
```

### ⚠️ Common Mistakes
* **Using mutable values**: Selecting columns that change (like email addresses) as primary keys. Use invariant columns (like integers or UUIDs) instead.
* **Forgetting composite declaration**: Declaring two individual columns as PRIMARY KEY instead of defining a single table-level composite key.

### 🎯 Interview Questions
* **Question**: What is a Composite Primary Key?
* **Answer**: A primary key made of two or more columns to ensure uniqueness across their combined values.

### ⚡ Performance Tips
* Use small data types (e.g., `INT` or `BIGINT`) for primary keys. They fit better in memory, accelerating index lookup operations.

### 🛠️ Best Practices
* Use auto-incrementing serial integers or unique identifiers (UUIDs) as surrogate keys.