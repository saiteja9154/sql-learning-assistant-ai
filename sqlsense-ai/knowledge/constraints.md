# Constraints

### 💡 Concept Explanation
Constraints are rules enforced on data columns in a table. They prevent invalid or corrupt data from being inserted, ensuring database reliability and consistency.
Common constraints include:
* `NOT NULL`: Column cannot contain NULL values.
* `UNIQUE`: Values must be unique.
* `PRIMARY KEY`: Uniquely identifies rows.
* `FOREIGN KEY`: Enforces links between tables.
* `CHECK`: Verifies columns satisfy logical rules.
* `DEFAULT`: Sets default values.

### 🔍 Syntax
```sql
CREATE TABLE table_name (
    col INT NOT NULL UNIQUE,
    age INT CHECK (age >= 18),
    status VARCHAR(20) DEFAULT 'Active'
);
```

### 💻 Examples
```sql
CREATE TABLE Products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) CHECK (price > 0),
    stock_status INT DEFAULT 0
);
```

### ⚠️ Common Mistakes
* **Overconstraining**: Creating rigid CHECK constraints that block valid future business logic changes.
* **Mismatched constraints**: Declaring foreign key columns with data types different from primary keys.

### 🎯 Interview Questions
* **Question**: Can you have multiple UNIQUE constraints in a table?
* **Answer**: Yes. You can only have one primary key constraint, but you can define multiple unique constraints.

### ⚡ Performance Tips
* Optimize CHECK statements. Keep conditions simple to avoid evaluation lag on massive batch updates.

### 🛠️ Best Practices
* Name your constraints explicitly (e.g., `constraint_name`) so they are easy to refer to during ALTER statements.