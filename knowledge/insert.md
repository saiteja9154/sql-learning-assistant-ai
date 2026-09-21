# Insert

### 💡 Concept Explanation
The `INSERT INTO` statement is used to add new rows of data to a table. You can specify both column names and the values to insert, or insert values directly if you supply values for all columns in the exact order they were defined.

### 🔍 Syntax
```sql
INSERT INTO table_name (column1, column2, ...) 
VALUES (value1, value2, ...);
```

### 💻 Examples
```sql
INSERT INTO Departments (dept_id, dept_name) 
VALUES (101, 'Engineering');
```

### ⚠️ Common Mistakes
* **Column mismatch**: Providing more values than columns, or mismatching the data types.
* **Ignoring NOT NULL**: Omitting fields that require values when no default is defined.

### 🎯 Interview Questions
* **Question**: How do you insert multiple rows in a single SQL statement?
* **Answer**: You specify multiple comma-separated value tuples, like: `INSERT INTO Table (col) VALUES (val1), (val2), (val3);`.

### ⚡ Performance Tips
* For bulk insertions, bundle statements inside a single transaction rather than running individual inserts, which avoids database index commit overhead.

### 🛠️ Best Practices
* Always list target column names explicitly instead of relying on default table column ordering.