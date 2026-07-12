# Stored Procedures

### 💡 Concept Explanation
A Stored Procedure is a group of SQL statements compiled and saved in the database. Procedures support input/output variables, logical controls, and transactions, and compile queries for faster execution.

### 🔍 Syntax
```sql
CREATE PROCEDURE proc_name
    @parameter1 datatype,
    @parameter2 datatype
AS
BEGIN
    -- SQL commands
END;
```

### 💻 Examples
```sql
CREATE PROCEDURE GetEmployeeSalary
    @EmpId INT
AS
BEGIN
    SELECT first_name, salary
    FROM Employees
    WHERE emp_id = @EmpId;
END;
```

### ⚠️ Common Mistakes
* **Using SPs for basic queries**: Creating complex procedures for simple tasks where views or standard queries would work.
* **Ignoring compilation logs**: Overlooking warnings during procedure compilation.

### 🎯 Interview Questions
* **Question**: What is the difference between a Stored Procedure and a User-Defined Function?
* **Answer**: Stored procedures cannot be run inline in SELECT queries but support output parameters and transactions. Functions can run inline but cannot modify database states.

### ⚡ Performance Tips
* Use local variables inside stored procedures to prevent parameter sniffing, which can degrade execution speeds.

### 🛠️ Best Practices
* Secure database access by granting users permissions to run procedures rather than directly querying base tables.