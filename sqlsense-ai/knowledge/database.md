# Database

### 💡 Concept Explanation
A database is an organized, structured collection of data stored and accessed electronically. In Relational Database Management Systems (RDBMS), data is stored in tables consisting of rows and columns. Relational databases maintain schema definitions, constraints, and index definitions, allowing queries to be run efficiently using SQL (Structured Query Language).

### 🔍 Syntax
```sql
CREATE DATABASE database_name;
DROP DATABASE database_name;
USE database_name;
```

### 💻 Examples
```sql
CREATE DATABASE CorporateSales;
USE CorporateSales;
```

### ⚠️ Common Mistakes
* **No active database selection**: Attempting to query tables before running `USE database_name;` or specifying the database context.
* **Accidental drop**: Running `DROP DATABASE` without backing up data, causing permanent loss.

### 🎯 Interview Questions
* **Question**: What is the difference between DBMS and RDBMS?
* **Answer**: DBMS stores data as files, while RDBMS stores data in tabular form with relationships, primary/foreign keys, and enforces ACID properties.

### ⚡ Performance Tips
* Maintain separate databases or schemas for transactional processing (OLTP) and analytical queries (OLAP) to minimize resource contention.

### 🛠️ Best Practices
* Use descriptive, lowercase names separated by underscores for database names. Avoid special characters.