# Drop

### 💡 Concept Explanation
The `DROP TABLE` statement completely removes a table definition, its data, indexes, triggers, and permissions from the database. It is a DDL command that cannot be undone easily.

### 🔍 Syntax
```sql
DROP TABLE table_name;
```

### 💻 Examples
```sql
DROP TABLE TempStaging;
```

### ⚠️ Common Mistakes
* **Accidental Drop**: Dropping incorrect tables due to spelling mistakes.
* **Referential Constraints**: Dropping tables referenced by active Foreign Keys.

### 🎯 Interview Questions
* **Question**: What is the difference between DROP and TRUNCATE?
* **Answer**: `DROP` removes both data and the schema definition. `TRUNCATE` removes only data, leaving the table structures intact.

### ⚡ Performance Tips
* Dropping large tables lock system schemas. Drop foreign keys and clean up indexes before running drop table commands.

### 🛠️ Best Practices
* Use `DROP TABLE IF EXISTS table_name` to prevent errors in automation scripts.