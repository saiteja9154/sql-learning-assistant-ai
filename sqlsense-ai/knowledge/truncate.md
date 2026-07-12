# Truncate

### 💡 Concept Explanation
The `TRUNCATE TABLE` statement removes all rows from a table. Unlike `DELETE`, it does not scan the table or log individual row deletions, making it much faster. It resets identity counters to seed values.

### 🔍 Syntax
```sql
TRUNCATE TABLE table_name;
```

### 💻 Examples
```sql
TRUNCATE TABLE Logs;
```

### ⚠️ Common Mistakes
* **Trigger assumption**: Expecting `DELETE` triggers to fire. `TRUNCATE` does not fire triggers.
* **ForeignKey blockage**: Attempting to truncate tables that are referenced by active Foreign Keys.

### 🎯 Interview Questions
* **Question**: Can you rollback a TRUNCATE command?
* **Answer**: Yes, if `TRUNCATE` is run within an active transaction block (e.g. `BEGIN TRANSACTION`), it can be rolled back.

### ⚡ Performance Tips
* Use `TRUNCATE` instead of `DELETE FROM Table` when clearing large staging tables. It releases database storage instantly.

### 🛠️ Best Practices
* Use only on temp or staging tables. Never run truncate queries on tables with master records.