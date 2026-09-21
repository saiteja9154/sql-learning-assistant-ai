# Database Normalization

### 💡 Concept Explanation
Normalization is the process of structuring relational database tables to minimize redundancy and prevent update anomalies.
* **1NF**: Data values must be atomic (no arrays/lists), and columns must be unique.
* **2NF**: Must be in 1NF, and all non-key columns must depend on the entire primary key (no partial dependencies).
* **3NF**: Must be in 2NF, and no non-key columns can depend on other non-key columns (no transitive dependencies).

### 🔍 Syntax
No direct SQL syntax exist. Enforced through table schema structures:
```sql
-- Unnormalized table containing array columns is split into multiple joined child tables.
```

### 💻 Examples
```sql
-- Normalized schema: split CustomerOrders into Customers and Orders tables.
CREATE TABLE Customers (
    cust_id INT PRIMARY KEY,
    cust_name VARCHAR(100)
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    cust_id INT,
    order_date DATE,
    FOREIGN KEY (cust_id) REFERENCES Customers(cust_id)
);
```

### ⚠️ Common Mistakes
* **Over-normalization**: Splitting tables too much, which leads to slow queries from too many joins.
* **Mismatched primary keys**: Forgetting foreign key links between normalized tables.

### 🎯 Interview Questions
* **Question**: What is transitive dependency?
* **Answer**: When a non-key column depends on another non-key column, violating 3NF guidelines.

### ⚡ Performance Tips
* For highly active reporting platforms (OLAP), selectively de-normalize tables to reduce expensive joins.

### 🛠️ Best Practices
* Design tables to 3NF as a default, and de-normalize only when profiling highlights performance issues.