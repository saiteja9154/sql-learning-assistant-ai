# Order By

### 💡 Concept Explanation
The `ORDER BY` clause sorts the result set of a query in ascending (`ASC`) or descending (`DESC`) order based on one or more columns. By default, it sorts in ascending order.

### 🔍 Syntax
```sql
SELECT columns
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC];
```

### 💻 Examples
```sql
SELECT emp_id, last_name, salary
FROM Employees
ORDER BY salary DESC, last_name ASC;
```

### ⚠️ Common Mistakes
* **Sorting by unselected columns in GROUP BY**: Attempting to sort by fields that are not aggregates or groups in grouped queries.
* **Large sorts without indexing**: Sorting columns containing wide string types on huge datasets without index coverage.

### 🎯 Interview Questions
* **Question**: In what order does ORDER BY execute in SQL?
* **Answer**: `ORDER BY` is executed **last** in the query execution flow.

### ⚡ Performance Tips
* Avoid sorting on columns with wide variable text. If sorting is frequent, create an index with sorting orders predefined.

### 🛠️ Best Practices
* Specify the sort order (`ASC` or `DESC`) explicitly to make query structures readable.