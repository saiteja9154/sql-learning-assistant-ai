# Transactions

### 💡 Concept Explanation
A Transaction is a single unit of work consisting of one or more SQL queries. Transactions adhere to ACID principles:
* **Atomicity**: All queries execute successfully, or none do.
* **Consistency**: The database transitions only between valid states.
* **Isolation**: Concurrent transactions do not interfere with each other.
* **Durability**: Committed data remains stored, even during system crashes.

### 🔍 Syntax
```sql
BEGIN TRANSACTION;
-- SQL commands
COMMIT; -- Save changes
ROLLBACK; -- Undo changes
```

### 💻 Examples
```sql
BEGIN TRANSACTION;
  UPDATE Accounts SET balance = balance - 100 WHERE acct_id = 1;
  UPDATE Accounts SET balance = balance + 100 WHERE acct_id = 2;
COMMIT;
```

### ⚠️ Common Mistakes
* **Leaving transactions open**: Forgetting to commit or rollback, which locks tables and blocks other queries.
* **Missing Error Handling**: Not wrapping transactions in try-catch blocks to trigger automatic rollback on failure.

### 🎯 Interview Questions
* **Question**: What are the ACID properties in database transactions?
* **Answer**: Atomicity, Consistency, Isolation, and Durability.

### ⚡ Performance Tips
* Keep transaction blocks as short as possible to minimize table locking durations.

### 🛠️ Best Practices
* Always implement try-catch error handling to trigger rollbacks when database queries fail.