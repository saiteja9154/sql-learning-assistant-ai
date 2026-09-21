# Foreign Key

### 💡 Concept Explanation
A Foreign Key links columns in a child table to a Primary Key (or Unique key) in a parent table. It enforces referential integrity, preventing orphans by ensuring that parent keys exist before child records can point to them.

### 🔍 Syntax
```sql
CREATE TABLE child_table (
    id INT,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES parent_table(primary_key_column)
);
```

### 💻 Examples
```sql
CREATE TABLE Employees (
    emp_id INT PRIMARY KEY,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
    ON DELETE SET NULL
);
```

### ⚠️ Common Mistakes
* **Mismatched types**: The foreign key data type must exactly match the parent primary key type.
* **Orphan creation**: Deleting parent records without configuring delete rules like `ON DELETE CASCADE` or `ON DELETE SET NULL`.

### 🎯 Interview Questions
* **Question**: What is referential integrity?
* **Answer**: A relational database rule ensuring relationships between tables remain consistent. Foreign keys enforce this logic.

### ⚡ Performance Tips
* Always create an index on foreign key columns. Databases scan foreign key columns during deletes and updates to ensure integrity.

### 🛠️ Best Practices
* Configure cascades carefully. Avoid using `ON DELETE CASCADE` on critical transactional tables.