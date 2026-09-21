# Triggers

### 💡 Concept Explanation
A Trigger is a database object that automatically runs in response to specific events (like `INSERT`, `UPDATE`, or `DELETE`) on a table. Triggers are typically used to log changes, enforce complex business logic, or audit table modifications.

### 🔍 Syntax
```sql
CREATE TRIGGER trigger_name
ON table_name
[AFTER|INSTEAD OF] [INSERT|UPDATE|DELETE]
AS
BEGIN
    -- Trigger logic
END;
```

### 💻 Examples
```sql
CREATE TRIGGER LogSalaryChange
ON Employees
AFTER UPDATE
AS
BEGIN
    IF UPDATE(salary)
    BEGIN
        INSERT INTO AuditLogs(emp_id, old_salary, new_salary, change_date)
        SELECT d.emp_id, d.salary, i.salary, GETDATE()
        FROM deleted d
        INNER JOIN inserted i ON d.emp_id = i.emp_id;
    END;
END;
```

### ⚠️ Common Mistakes
* **Row-by-row assumptions**: Assuming triggers execute once per row. Triggers execute once per SQL statement, even if that statement updates a million rows.
* **Recursive triggers**: Writing trigger actions that modify the same table, triggering a loop that crashes the query.

### 🎯 Interview Questions
* **Question**: What are the "inserted" and "deleted" tables in triggers?
* **Answer**: They are temporary memory-resident tables. `inserted` holds new values, and `deleted` holds original values before the query ran.

### ⚡ Performance Tips
* Keep trigger operations simple and fast. Slow triggers delay table modifications, causing queries to back up.

### 🛠️ Best Practices
* Use triggers only when database constraints cannot enforce the required logic.