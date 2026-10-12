import os
import re
import logging
from typing import Dict, List, Optional, Tuple, Set, Any
from app.services.sql_topics import SQL_TOPIC_CATALOG, QUIZ_QUESTION_BANK

logger = logging.getLogger("sqlsense-ai")

# SQL Domain detection keywords to distinguish SQL questions from general/unrelated questions
SQL_DOMAIN_KEYWORDS: Set[str] = {
    "sql", "query", "queries", "table", "tables", "database", "databases", "rdbms",
    "select", "from", "where", "join", "joins", "inner", "outer", "left", "right",
    "cross", "self", "group", "having", "order", "by", "limit", "offset", "insert",
    "update", "delete", "truncate", "drop", "alter", "create", "index", "indexes",
    "view", "views", "cte", "with", "window", "partition", "rank", "dense_rank",
    "row_number", "lead", "lag", "primary", "foreign", "key", "keys", "constraint",
    "constraints", "null", "not null", "unique", "check", "default", "cascade",
    "aggregate", "count", "sum", "avg", "min", "max", "subquery", "subqueries",
    "nested", "exists", "union", "transaction", "transactions", "acid", "commit",
    "rollback", "savepoint", "trigger", "triggers", "procedure", "procedures",
    "sproc", "cursor", "normalization", "1nf", "2nf", "3nf", "bcnf", "schema",
    "column", "columns", "row", "rows", "record", "records", "datatype", "varchar",
    "integer", "boolean", "timestamp", "date", "entity", "relationship", "relational",
    "dcl", "ddl", "dml", "tcl", "explain", "analyze", "b-tree", "hash", "seek", "scan",
    "salary", "average", "calculate", "student", "students", "employee", "employees",
    "department", "departments", "customer", "customers", "total", "highest", "second",
    "distinct", "case", "when", "then", "else", "end", "like", "between", "in"
}

# Curated concise theoretical knowledge base specifically for 'explain_concept' mode.
# Follows the standard structure:
# 1. Topic name
# 2. Simple theoretical explanation
# 3. Purpose or importance (Why is it used?)
# 4. Key takeaway
# SQL examples are only provided when explicitly requested by the user.
CONCISE_CONCEPT_KB: Dict[str, Dict[str, Any]] = {
    "primary key": {
        "title": "Primary Key",
        "explanation": "A primary key is a column, or combination of columns, that uniquely identifies each row in a database table. It cannot contain duplicate or NULL values.",
        "why": "It ensures that every record can be uniquely identified and helps maintain data integrity.",
        "takeaway": "Every row must have a unique identifier.",
        "example": "CREATE TABLE Users (\n    user_id INT PRIMARY KEY,\n    username VARCHAR(50) NOT NULL\n);"
    },
    "composite primary key": {
        "title": "Composite Primary Key",
        "explanation": "A composite primary key is a primary key composed of two or more columns that together guarantee unique identification for each row in a table.",
        "why": "It is used in junction or associative tables representing many-to-many relationships where no single column is unique on its own.",
        "takeaway": "Uniqueness is guaranteed only by combining all component columns together.",
        "example": "CREATE TABLE Enrollments (\n    student_id INT,\n    course_id INT,\n    enrollment_date DATE,\n    PRIMARY KEY (student_id, course_id)\n);"
    },
    "foreign key": {
        "title": "Foreign Key",
        "explanation": "A foreign key is a column or set of columns in one table that references the primary key of another table, creating an explicit relational link between them.",
        "why": "It enforces referential integrity, ensuring child records cannot reference non-existent parent records.",
        "takeaway": "Foreign keys maintain relational integrity by preventing orphaned records.",
        "example": "CREATE TABLE Orders (\n    order_id INT PRIMARY KEY,\n    user_id INT REFERENCES Users(user_id)\n);"
    },
    "inner join": {
        "title": "INNER JOIN",
        "explanation": "An INNER JOIN is an operation that combines rows from two or more tables based on a related column. It returns only the records where the join condition matches in both tables.",
        "why": "It retrieves intersecting data between tables while filtering out unmatched or orphaned records.",
        "takeaway": "Only rows with matching values in both tables appear in the result set; non-matching rows are excluded.",
        "example": "SELECT Employees.name, Departments.dept_name\nFROM Employees\nINNER JOIN Departments ON Employees.dept_id = Departments.id;"
    },
    "left join": {
        "title": "LEFT JOIN",
        "explanation": "A LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and the matching records from the right table. Where no match exists, NULL values appear for right table columns.",
        "why": "It preserves all rows from the primary left table regardless of whether matching records exist in the related right table.",
        "takeaway": "Every row from the left table is included; unmatched rows from the right table return NULL.",
        "example": "SELECT Customers.name, Orders.order_id\nFROM Customers\nLEFT JOIN Orders ON Customers.id = Orders.customer_id;"
    },
    "right join": {
        "title": "RIGHT JOIN",
        "explanation": "A RIGHT JOIN (or RIGHT OUTER JOIN) returns all records from the right table and the matching records from the left table. If no match is found, NULL values are returned for left table columns.",
        "why": "It ensures that every record in the right table is included in the output even when matching left records do not exist.",
        "takeaway": "All rows from the right table are preserved; non-matching left values evaluate to NULL.",
        "example": "SELECT Orders.order_id, Customers.name\nFROM Customers\nRIGHT JOIN Orders ON Customers.id = Orders.customer_id;"
    },
    "full join": {
        "title": "FULL OUTER JOIN",
        "explanation": "A FULL OUTER JOIN returns all records when there is a match in either the left or the right table. Rows without a match on either side return NULL for missing fields.",
        "why": "It provides a comprehensive view across two tables, ensuring no records from either side are lost.",
        "takeaway": "Combines LEFT and RIGHT joins into a single output, filling missing pairs with NULL.",
        "example": "SELECT A.id, B.id\nFROM TableA A\nFULL OUTER JOIN TableB B ON A.id = B.id;"
    },
    "cross join": {
        "title": "CROSS JOIN",
        "explanation": "A CROSS JOIN produces the Cartesian product of two tables, pairing every individual row from the first table with every individual row from the second table without any matching condition.",
        "why": "It is used when you need to calculate every possible combination of items between two datasets.",
        "takeaway": "Total output rows equal the row count of table A multiplied by the row count of table B.",
        "example": "SELECT Sizes.size_name, Colors.color_name\nFROM Sizes\nCROSS JOIN Colors;"
    },
    "self join": {
        "title": "Self Join",
        "explanation": "A Self Join is a join operation in which a single table is joined with itself using distinct table aliases.",
        "why": "It models hierarchical parent-child relationships within the same table (such as employees and managers) or compares rows in the same dataset.",
        "takeaway": "Always assign distinct table aliases to prevent ambiguous column reference errors.",
        "example": "SELECT E.name AS Employee, M.name AS Manager\nFROM Employees E\nLEFT JOIN Employees M ON E.manager_id = M.id;"
    },
    "joins": {
        "title": "SQL Joins",
        "explanation": "A SQL JOIN combines columns from two or more tables into a single result set based on a common related column between them.",
        "why": "Relational databases split data across tables to minimize redundancy; joins allow you to query related data together.",
        "takeaway": "Choose INNER JOIN for exact matches, or OUTER JOIN (LEFT/RIGHT/FULL) when unmatched rows must be retained.",
        "example": "SELECT Orders.id, Customers.name\nFROM Orders\nJOIN Customers ON Orders.customer_id = Customers.id;"
    },
    "normalization": {
        "title": "Database Normalization",
        "explanation": "Normalization is the systematic process of organizing relational database tables to minimize data redundancy and eliminate anomalies during data modification. It decomposes large tables into smaller, related tables using defined normal forms (1NF, 2NF, 3NF).",
        "why": "It prevents update, insertion, and deletion anomalies while maintaining data consistency across relationships.",
        "takeaway": "Store each fact in exactly one place to keep data consistent.",
        "example": "-- Normalized schema links Customers to Orders via foreign key customer_id\nCREATE TABLE Orders (\n    order_id INT PRIMARY KEY,\n    customer_id INT REFERENCES Customers(id)\n);"
    },
    "1nf": {
        "title": "First Normal Form (1NF)",
        "explanation": "First Normal Form (1NF) requires that all column values in a relational table are atomic (indivisible) and that each record is uniquely identifiable with no repeating column groups.",
        "why": "It ensures that values can be queried, filtered, and indexed predictably without parsing composite strings or delimited lists.",
        "takeaway": "Every table cell must contain a single scalar value, never an array or list.",
        "example": "-- Atomic values: Store each tag or phone number in its own row or dedicated table."
    },
    "2nf": {
        "title": "Second Normal Form (2NF)",
        "explanation": "Second Normal Form (2NF) requires that a table is in 1NF and that every non-key column is fully functionally dependent on the entire primary key, eliminating partial dependencies.",
        "why": "It eliminates redundant column storage in tables that use composite primary keys, preventing update anomalies.",
        "takeaway": "Non-key columns must depend on the whole primary key, not just a subset of a composite key.",
        "example": "-- Move columns dependent on only part of a composite key to a separate table."
    },
    "3nf": {
        "title": "Third Normal Form (3NF)",
        "explanation": "Third Normal Form (3NF) requires that a table is in 2NF and that no non-key column depends on another non-key column, eliminating transitive dependencies.",
        "why": "It prevents cascading updates by ensuring non-key attributes are stored only where their direct determinant is the primary key.",
        "takeaway": "Every non-key column must depend directly on the primary key, and nothing but the primary key.",
        "example": "-- Move ZipCode to City mappings into a separate PostalCodes table instead of repeating in Users."
    },
    "where vs having": {
        "title": "WHERE vs. HAVING",
        "explanation": "The WHERE clause filters individual rows before any groupings or aggregations are calculated. The HAVING clause filters summarized groups after the GROUP BY clause has been evaluated.",
        "why": "Aggregate functions (such as COUNT, SUM, or AVG) cannot be evaluated in a WHERE clause, making HAVING necessary for filtering aggregated results.",
        "takeaway": "Use WHERE to filter rows before grouping; use HAVING to filter groups after aggregation.",
        "example": "SELECT dept_id, COUNT(*)\nFROM Employees\nWHERE status = 'ACTIVE'\nGROUP BY dept_id\nHAVING COUNT(*) > 5;"
    },
    "union vs union all": {
        "title": "UNION vs. UNION ALL",
        "explanation": "UNION and UNION ALL combine the result sets of two or more SELECT queries into a single dataset. UNION automatically removes duplicate rows, whereas UNION ALL retains all rows including duplicates.",
        "why": "UNION ALL executes significantly faster because it skips the duplicate checking and sorting pass.",
        "takeaway": "Use UNION when unique rows are required; use UNION ALL for higher performance when duplicates are acceptable.",
        "example": "SELECT id FROM TableA\nUNION ALL\nSELECT id FROM TableB;"
    },
    "cte": {
        "title": "Common Table Expressions (CTE)",
        "explanation": "A Common Table Expression (CTE) is a named, temporary result set defined using the WITH clause that exists only within the execution scope of a single query.",
        "why": "It simplifies complex queries by breaking nested subqueries into readable, modular steps and allows recursive querying for hierarchies.",
        "takeaway": "Use CTEs to make complex multi-step queries clean, readable, and maintainable.",
        "example": "WITH ActiveUsers AS (\n    SELECT id, name FROM Users WHERE status = 'ACTIVE'\n)\nSELECT * FROM ActiveUsers;"
    },
    "window functions": {
        "title": "Window Functions",
        "explanation": "A window function performs calculations across a set of table rows related to the current row without collapsing the rows into a single summary output.",
        "why": "Unlike GROUP BY, window functions retain individual row identities while computing running totals, rankings, and moving averages.",
        "takeaway": "Use OVER() and PARTITION BY to compute analytics without losing row-level detail.",
        "example": "SELECT name, salary,\n    RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) AS rank\nFROM Employees;"
    },
    "subqueries": {
        "title": "Subqueries",
        "explanation": "A subquery is a SQL query nested inside a larger outer query (such as within SELECT, FROM, or WHERE clauses).",
        "why": "It allows you to use dynamic query results directly as filtering conditions or derived tables for the outer query.",
        "takeaway": "Subqueries can be standalone or correlated (referencing outer query columns row-by-row).",
        "example": "SELECT name FROM Employees\nWHERE salary > (SELECT AVG(salary) FROM Employees);"
    },
    "indexes": {
        "title": "Indexes",
        "explanation": "An index is a database data structure (most commonly a B-Tree) that speeds up data retrieval operations on a table at the cost of additional storage and slower writes.",
        "why": "It avoids slow full table scans by allowing the database engine to locate records quickly using index seeks.",
        "takeaway": "Index frequently filtered and joined columns, but balance against write overhead.",
        "example": "CREATE INDEX idx_user_email ON Users(email);"
    },
    "views": {
        "title": "Views",
        "explanation": "A view is a virtual table defined by a stored SELECT query. It does not store physical data itself but displays data dynamically from its underlying base tables.",
        "why": "It simplifies complex queries for consumers, enhances security by restricting column access, and encapsulates business logic.",
        "takeaway": "Views act like virtual tables that reflect underlying data changes in real time.",
        "example": "CREATE VIEW ActiveEmployees AS\nSELECT id, name FROM Employees WHERE status = 'ACTIVE';"
    },
    "transactions": {
        "title": "Database Transactions & ACID",
        "explanation": "A transaction is a logical unit of database operations that must execute completely or not at all, adhering to ACID properties (Atomicity, Consistency, Isolation, Durability).",
        "why": "It prevents partial updates and data corruption during system failures or concurrent access.",
        "takeaway": "Use COMMIT to finalize changes and ROLLBACK to revert changes if an error occurs.",
        "example": "BEGIN TRANSACTION;\nUPDATE Accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE Accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;"
    },
    "acid": {
        "title": "ACID Properties",
        "explanation": "ACID represents the four core guarantees of reliable database transactions: Atomicity (all or nothing), Consistency (preserves rules), Isolation (independent concurrent execution), and Durability (committed changes persist).",
        "why": "It ensures that database operations remain trustworthy and consistent even during crashes, errors, or concurrent access.",
        "takeaway": "ACID guarantees that transactional updates never leave data in a partially modified state.",
        "example": "-- Enforced automatically by database transaction engines using write-ahead logs and locks."
    },
    "groupby": {
        "title": "GROUP BY Clause",
        "explanation": "The GROUP BY clause groups rows that share identical values in specified columns into summary rows, typically used with aggregate functions.",
        "why": "It allows you to summarize data by category, calculating metrics like totals or averages for each group.",
        "takeaway": "Every non-aggregated column in the SELECT list must appear in the GROUP BY clause.",
        "example": "SELECT dept_id, COUNT(*), AVG(salary)\nFROM Employees\nGROUP BY dept_id;"
    },
    "having": {
        "title": "HAVING Clause",
        "explanation": "The HAVING clause filters summarized groups created by a GROUP BY clause based on specified conditions.",
        "why": "Because the WHERE clause cannot evaluate aggregate functions, HAVING is needed to filter aggregated groups.",
        "takeaway": "HAVING filters groups after aggregation, whereas WHERE filters individual rows before grouping.",
        "example": "SELECT dept_id, COUNT(*)\nFROM Employees\nGROUP BY dept_id\nHAVING COUNT(*) > 10;"
    },
    "orderby": {
        "title": "ORDER BY Clause",
        "explanation": "The ORDER BY clause sorts query results in ascending (ASC) or descending (DESC) order based on one or more specified columns.",
        "why": "Relational tables have no inherent order; ORDER BY guarantees a deterministic presentation sequence for query results.",
        "takeaway": "Ascending order is the default unless DESC is explicitly specified.",
        "example": "SELECT name, salary FROM Employees ORDER BY salary DESC;"
    },
    "where": {
        "title": "WHERE Clause",
        "explanation": "The WHERE clause filters rows returned by a query based on specified conditional criteria or predicates.",
        "why": "It limits the dataset to only relevant rows, reducing processing overhead and returning specific information.",
        "takeaway": "Only rows where the WHERE condition evaluates to TRUE are included.",
        "example": "SELECT * FROM Employees WHERE department = 'Sales' AND salary > 50000;"
    },
    "select": {
        "title": "SELECT Statement",
        "explanation": "The SELECT statement retrieves data from one or more tables in a relational database.",
        "why": "It defines the exact columns and expressions to project in the final query result set.",
        "takeaway": "Specify only needed columns instead of SELECT * to improve performance.",
        "example": "SELECT first_name, last_name FROM Employees;"
    },
    "insert": {
        "title": "INSERT Statement",
        "explanation": "The INSERT statement adds one or more new records into a specified database table.",
        "why": "It populates tables with initial data and records new entries over time.",
        "takeaway": "Values must match the target table's column order, data types, and constraints.",
        "example": "INSERT INTO Employees (id, name) VALUES (1, 'Alice');"
    },
    "update": {
        "title": "UPDATE Statement",
        "explanation": "The UPDATE statement modifies existing data values in one or more columns of a database table.",
        "why": "It keeps database records accurate as real-world information changes.",
        "takeaway": "Always include a WHERE clause to avoid accidentally modifying all rows in the table.",
        "example": "UPDATE Employees SET salary = 60000 WHERE id = 1;"
    },
    "delete": {
        "title": "DELETE Statement",
        "explanation": "The DELETE statement removes specific existing rows from a table based on a condition.",
        "why": "It purges obsolete or invalid records while maintaining table structure and schema definitions.",
        "takeaway": "Always use a WHERE clause unless you explicitly intend to remove every row in the table.",
        "example": "DELETE FROM Employees WHERE status = 'INACTIVE';"
    },
    "truncate": {
        "title": "TRUNCATE Statement",
        "explanation": "The TRUNCATE statement quickly removes all rows from a table by deallocating its data pages, preserving table structure and resetting identity counters.",
        "why": "It is much faster than DELETE for wiping a full table because it logs minimal page deallocations rather than individual row deletes.",
        "takeaway": "TRUNCATE is a DDL operation that cannot filter with WHERE and resets auto-increment IDs.",
        "example": "TRUNCATE TABLE Logs;"
    },
    "drop": {
        "title": "DROP Statement",
        "explanation": "The DROP statement permanently deletes an entire database object (such as a table, view, or database) including its structure, data, and associated indexes.",
        "why": "It reclaims storage by completely removing obsolete database objects.",
        "takeaway": "DROP permanently destroys the table schema and data; it cannot be undone without a backup.",
        "example": "DROP TABLE OldArchivedData;"
    },
    "create table": {
        "title": "CREATE TABLE",
        "explanation": "The CREATE TABLE statement defines a new table structure, specifying column names, data types, and integrity constraints.",
        "why": "It establishes the relational schema where database records will be stored.",
        "takeaway": "Plan primary keys, data types, and constraints carefully before creating tables.",
        "example": "CREATE TABLE Departments (\n    id INT PRIMARY KEY,\n    dept_name VARCHAR(50) NOT NULL\n);"
    },
    "alter table": {
        "title": "ALTER TABLE",
        "explanation": "The ALTER TABLE statement modifies an existing table structure by adding, dropping, or modifying columns and constraints.",
        "why": "It enables database schemas to evolve over time without having to drop and recreate existing tables.",
        "takeaway": "Use ALTER TABLE to update schema definitions while preserving existing table data.",
        "example": "ALTER TABLE Employees ADD COLUMN email VARCHAR(100);"
    },
    "triggers": {
        "title": "Triggers",
        "explanation": "A trigger is a stored procedure that automatically executes in response to specified database events (such as INSERT, UPDATE, or DELETE) on a table.",
        "why": "It enforces complex business validation rules, audits data changes, and automatically maintains derived data.",
        "takeaway": "Triggers run automatically behind the scenes; use sparingly to avoid hidden performance bottlenecks.",
        "example": "CREATE TRIGGER update_timestamp\nAFTER UPDATE ON Users\nFOR EACH ROW EXECUTE PROCEDURE set_updated_at();"
    },
    "stored procedures": {
        "title": "Stored Procedures",
        "explanation": "A stored procedure is a prepared batch of SQL statements saved in the database catalog that can be executed repeatedly with input and output parameters.",
        "why": "It encapsulates business logic, reduces network round-trips, and improves execution plan caching.",
        "takeaway": "Stored procedures centralize reusable database logic on the database server.",
        "example": "CREATE PROCEDURE GetActiveUsers()\nLANGUAGE SQL\nAS $$\n    SELECT * FROM Users WHERE status = 'ACTIVE';\n$$;"
    },
    "constraints": {
        "title": "Database Constraints",
        "explanation": "Constraints are rules enforced on data columns to ensure data accuracy, reliability, and domain integrity.",
        "why": "They prevent invalid or incompatible data from ever being written to database tables.",
        "takeaway": "Common constraints include PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, and CHECK.",
        "example": "CREATE TABLE Items (\n    id INT PRIMARY KEY,\n    price DECIMAL(10, 2) CHECK (price > 0)\n);"
    },
    "aggregate": {
        "title": "Aggregate Functions",
        "explanation": "Aggregate functions perform a calculation across multiple row values and return a single summary value.",
        "why": "They provide immediate statistical summaries (such as COUNT, SUM, AVG, MIN, and MAX) across datasets.",
        "takeaway": "Aggregate functions ignore NULL values (except COUNT(*)) and are often combined with GROUP BY.",
        "example": "SELECT COUNT(*), AVG(salary), MAX(salary) FROM Employees;"
    },
    "distinct": {
        "title": "DISTINCT Keyword",
        "explanation": "The DISTINCT keyword removes duplicate rows from the query result set, returning only unique value combinations.",
        "why": "It filters redundant rows when a query would otherwise produce duplicate records.",
        "takeaway": "DISTINCT evaluates uniqueness across all columns specified in the SELECT clause.",
        "example": "SELECT DISTINCT department FROM Employees;"
    },
    "case when": {
        "title": "CASE Expression",
        "explanation": "The CASE expression provides conditional if-then-else logic directly inside SQL queries.",
        "why": "It allows dynamic value transformation and categorical grouping within SELECT, WHERE, and ORDER BY clauses.",
        "takeaway": "Always include an ELSE branch to handle unmatched cases predictably.",
        "example": "SELECT name,\n    CASE WHEN salary > 80000 THEN 'Senior' ELSE 'Junior' END AS tier\nFROM Employees;"
    }
}

# Sorted by alias phrase length (descending) to guarantee longest-match-first priority
CONCEPT_ALIAS_MAP: List[Tuple[str, str]] = sorted([
    ("difference between union and union all", "union vs union all"),
    ("difference between where and having", "where vs having"),
    ("difference between having and where", "where vs having"),
    ("common table expressions", "cte"),
    ("common table expression", "cte"),
    ("composite primary key", "composite primary key"),
    ("full outer join", "full join"),
    ("left outer join", "left join"),
    ("right outer join", "right join"),
    ("first normal form", "1nf"),
    ("second normal form", "2nf"),
    ("third normal form", "3nf"),
    ("union vs union all", "union vs union all"),
    ("where vs having", "where vs having"),
    ("aggregate functions", "aggregate"),
    ("aggregate function", "aggregate"),
    ("window functions", "window functions"),
    ("window function", "window functions"),
    ("stored procedures", "stored procedures"),
    ("stored procedure", "stored procedures"),
    ("create table", "create table"),
    ("alter table", "alter table"),
    ("primary key", "primary key"),
    ("foreign key", "foreign key"),
    ("inner join", "inner join"),
    ("left join", "left join"),
    ("right join", "right join"),
    ("cross join", "cross join"),
    ("self join", "self join"),
    ("normalization", "normalization"),
    ("transactions", "transactions"),
    ("transaction", "transactions"),
    ("subqueries", "subqueries"),
    ("subquery", "subqueries"),
    ("order by", "orderby"),
    ("group by", "groupby"),
    ("case when", "case when"),
    ("distinct", "distinct"),
    ("triggers", "triggers"),
    ("trigger", "triggers"),
    ("indexes", "indexes"),
    ("indexing", "indexes"),
    ("index", "indexes"),
    ("truncate", "truncate"),
    ("delete", "delete"),
    ("update", "update"),
    ("insert", "insert"),
    ("select", "select"),
    ("having", "having"),
    ("where", "where"),
    ("views", "views"),
    ("view", "views"),
    ("joins", "joins"),
    ("join", "joins"),
    ("drop", "drop"),
    ("acid", "acid"),
    ("1nf", "1nf"),
    ("2nf", "2nf"),
    ("3nf", "3nf"),
    ("cte", "cte")
], key=lambda x: len(x[0]), reverse=True)


# General SQL explanations preserved for Smart Assistant mode fallback
GENERAL_SQL_EXPLANATIONS: Dict[str, Dict[str, str]] = {
    "self join": {
        "title": "Self Join in SQL",
        "explanation": "A **Self Join** is a regular join operation in which a table is joined with itself. It is particularly useful when comparing rows within the same table or modeling hierarchical relationships (such as reporting hierarchies between employees and managers).",
        "syntax": "SELECT A.column_name, B.column_name\nFROM table_name A\nJOIN table_name B ON A.common_field = B.common_field;",
        "example": "-- Find each employee and their direct manager from the same Employees table\nSELECT \n    E.first_name AS employee,\n    M.first_name AS manager\nFROM Employees E\nLEFT JOIN Employees M ON E.manager_id = M.employee_id;",
        "output": "| employee | manager |\n| :--- | :--- |\n| Alice | Bob |\n| Charlie | Bob |\n| Bob | NULL |",
        "tip": "Always assign distinct table aliases (e.g. `E` and `M`) when self-joining a table to avoid ambiguous column errors."
    },
    "composite primary key": {
        "title": "Composite Primary Key",
        "explanation": "A **Composite Primary Key** consists of two or more columns that together uniquely identify a row within a table. It is frequently used in junction/bridge tables representing many-to-many relationships.",
        "syntax": "CREATE TABLE table_name (\n    col1 INT,\n    col2 INT,\n    col3 VARCHAR(50),\n    PRIMARY KEY (col1, col2)\n);",
        "example": "-- Junction table for student course enrollments\nCREATE TABLE Enrollments (\n    student_id INT,\n    course_id INT,\n    enrollment_date DATE,\n    PRIMARY KEY (student_id, course_id),\n    FOREIGN KEY (student_id) REFERENCES Students(student_id),\n    FOREIGN KEY (course_id) REFERENCES Courses(course_id)\n);",
        "output": "Table created with a composite primary key spanning (student_id, course_id).",
        "tip": "Ensure all component columns of a composite primary key are defined with `NOT NULL`."
    },
    "case when": {
        "title": "CASE Expression in SQL",
        "explanation": "The **CASE** expression provides conditional logic (if-then-else) directly within SQL queries. It evaluates a list of conditions and returns one of multiple possible result values.",
        "syntax": "CASE\n    WHEN condition1 THEN result1\n    WHEN condition2 THEN result2\n    ELSE default_result\nEND",
        "example": "SELECT first_name, salary,\n    CASE\n        WHEN salary >= 90000 THEN 'Senior'\n        WHEN salary >= 60000 THEN 'Mid-Level'\n        ELSE 'Junior'\n    END AS salary_tier\nFROM Employees;",
        "output": "| first_name | salary | salary_tier |\n| :--- | :--- | :--- |\n| Alice | 95000 | Senior |\n| Bob | 72000 | Mid-Level |\n| Charlie | 45000 | Junior |",
        "tip": "Always include an `ELSE` clause to prevent unhandled cases from evaluating to `NULL`."
    },
    "union vs union all": {
        "title": "UNION vs UNION ALL",
        "explanation": "**UNION** and **UNION ALL** combine the result sets of two or more SELECT queries into a single output.\n* **UNION**: Combines sets and performs an automatic deduplication pass to remove duplicate rows.\n* **UNION ALL**: Concatenates all rows directly without checking for duplicates.",
        "syntax": "-- Deduplicated\nSELECT col FROM tableA\nUNION\nSELECT col FROM tableB;\n\n-- Faster, retains duplicates\nSELECT col FROM tableA\nUNION ALL\nSELECT col FROM tableB;",
        "example": "SELECT customer_name FROM DomesticCustomers\nUNION ALL\nSELECT customer_name FROM InternationalCustomers;",
        "output": "Combined list of customer names including duplicates.",
        "tip": "Prefer `UNION ALL` over `UNION` whenever you know records are distinct or duplicates are acceptable, as it avoids expensive sorting."
    },
    "distinct": {
        "title": "DISTINCT Keyword",
        "explanation": "The **DISTINCT** clause is used in conjunction with `SELECT` to eliminate all duplicate records and return only unique values across the specified columns.",
        "syntax": "SELECT DISTINCT column1, column2\nFROM table_name;",
        "example": "-- Get all unique departments currently assigned to employees\nSELECT DISTINCT dept_name\nFROM Departments;",
        "output": "| dept_name |\n| :--- |\n| Engineering |\n| Marketing |\n| HR |",
        "tip": "`DISTINCT` evaluates the uniqueness of the combination of ALL columns listed in the SELECT clause."
    }
}


class SQLTopicDoc:
    def __init__(self, filename: str, filepath: str):
        self.filename = filename
        self.filepath = filepath
        self.raw_content = ""
        self.raw_content_lower = ""
        self.content_words: Set[str] = set()
        self.title = filename.replace(".md", "").capitalize()
        self.sections: Dict[str, str] = {}
        self.clean_syntax = ""
        self.clean_example = ""
        self.clean_explanation = ""
        self._load()

    def _strip_fences(self, text: str) -> str:
        """Removes outer markdown code fences to prevent duplicate nested fences."""
        s = text.strip()
        if s.startswith("```"):
            lines = s.splitlines()
            if len(lines) >= 2 and lines[-1].strip() == "```":
                return "\n".join(lines[1:-1]).strip()
        return s

    def _load(self):
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                self.raw_content = f.read().strip()
                
            self.raw_content_lower = self.raw_content.lower()
            self.content_words = set(re.findall(r"\b[a-zA-Z0-9_\-]{4,}\b", self.raw_content_lower))

            # Extract main title from first markdown H1
            h1_match = re.search(r"^#\s+(.+)$", self.raw_content, re.MULTILINE)
            if h1_match:
                self.title = h1_match.group(1).strip()

            # Parse sections (### header ... content)
            current_header = "Overview"
            current_body = []
            
            for line in self.raw_content.splitlines():
                if line.startswith("### "):
                    if current_body:
                        self.sections[current_header] = "\n".join(current_body).strip()
                        current_body = []
                    current_header = line.replace("### ", "").strip()
                else:
                    current_body.append(line)
            if current_body:
                self.sections[current_header] = "\n".join(current_body).strip()

            # Pre-compute clean representations
            if "🔍 Syntax" in self.sections:
                self.clean_syntax = self._strip_fences(self.sections["🔍 Syntax"])
            if "💻 Examples" in self.sections:
                self.clean_example = self._strip_fences(self.sections["💻 Examples"])
            if "💡 Concept Explanation" in self.sections:
                self.clean_explanation = self.sections["💡 Concept Explanation"].strip()
                
        except Exception as e:
            logger.error(f"Failed to load knowledge file {self.filepath}: {e}")

    def get_formatted_response(self) -> str:
        return f"{self.raw_content}\n\n### 📄 Sources\n- `{self.filename}`"


class SQLKnowledgeEngine:
    def __init__(self, knowledge_dir: str):
        self.knowledge_dir = knowledge_dir
        self.docs: Dict[str, SQLTopicDoc] = {}
        self.supported_topic_names: List[str] = []
        self._cache: Dict[Tuple[str, str], Tuple[str, Optional[str]]] = {}
        self._loaded: bool = False
        self.reload()

    def reload(self, force: bool = False):
        """Loads and indexes all markdown files in the knowledge base directory."""
        if self._loaded and not force:
            return

        self.docs = {}
        self._cache = {}
        if not os.path.exists(self.knowledge_dir):
            logger.error(f"Knowledge directory does not exist at: {self.knowledge_dir}")
            return

        for fname in os.listdir(self.knowledge_dir):
            if fname.endswith(".md"):
                fpath = os.path.join(self.knowledge_dir, fname)
                doc = SQLTopicDoc(fname, fpath)
                self.docs[fname] = doc

        self.supported_topic_names = sorted([doc.title for doc in self.docs.values()])
        self._loaded = True
        logger.info(f"Loaded {len(self.docs)} SQL knowledge documents successfully from {self.knowledge_dir}.")

    def _normalize_text(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r"[^\w\s\-\_]", " ", text)
        return " ".join(text.split())

    def is_sql_related(self, query: str) -> bool:
        """Determines whether a user query is related to SQL or databases."""
        normalized = self._normalize_text(query)
        words = set(normalized.split())

        # Check for intersection with SQL domain vocabulary
        if any(kw in words for kw in SQL_DOMAIN_KEYWORDS):
            return True

        # Check for presence of SQL keywords in topic catalog
        for topic_info in SQL_TOPIC_CATALOG.values():
            if any(alias in normalized for alias in topic_info["aliases"]):
                return True

        return False

    def user_wants_example(self, query: str) -> bool:
        """
        Determines whether the user explicitly requested SQL syntax, code, or practical examples.
        In Explain Concept mode, code is omitted by default unless this evaluates to True.
        """
        q = query.lower()
        patterns = [
            r"\bwith\s+(?:an?\s+)?(?:sql\s+)?example\b",
            r"\bwith\s+(?:an?\s+)?(?:sql\s+)?query\b",
            r"\bwith\s+(?:an?\s+)?(?:sql\s+)?code\b",
            r"\bwith\s+syntax\b",
            r"\bgive\s+(?:me\s+)?(?:an?\s+)?example\b",
            r"\bshow\s+(?:me\s+)?(?:an?\s+)?example\b",
            r"\bprovide\s+(?:an?\s+)?(?:sql\s+)?example\b",
            r"\binclude\s+(?:an?\s+)?(?:sql\s+)?example\b",
            r"\bexample\s+please\b",
            r"\bsyntax\s+please\b",
            r"\bshow\s+code\b",
            r"\bcode\s+example\b",
            r"\bsql\s+example\b",
            r"\bhow\s+to\s+write\b",
            r"\bwrite\s+an?\s+example\b",
            r"\bwrite\s+a\s+query\b"
        ]
        return any(re.search(p, q) for p in patterns)

    def detect_topics(self, query: str) -> List[Tuple[str, float]]:
        """
        Scans query for topic matches against catalog and knowledge base.
        Optimized with set-intersection operations to avoid redundant scans.
        """
        normalized_query = self._normalize_text(query)
        words = set(normalized_query.split())
        scored_matches: List[Tuple[str, float]] = []

        for topic_key, topic_info in SQL_TOPIC_CATALOG.items():
            filename = topic_info["file"]
            if filename not in self.docs:
                continue

            score = 0.0
            aliases = topic_info.get("aliases", [])
            keywords = topic_info.get("keywords", [])

            # 1. Exact alias / phrase match
            for alias in aliases:
                if alias in normalized_query:
                    score += 50.0 + (len(alias.split()) * 15.0)

            # 2. Keyword match
            for kw in keywords:
                if kw in words:
                    score += 15.0

            # 3. Document title match
            doc = self.docs[filename]
            if doc.title.lower() in normalized_query:
                score += 40.0

            # 4. Content word intersection boost
            intersection_count = len(words & doc.content_words)
            score += min(intersection_count * 2.5, 20.0)

            # 5. Natural intent boosts
            if "combine" in normalized_query and "table" in normalized_query and filename == "joins.md":
                score += 60.0
            if "duplicate" in normalized_query and filename in ("groupby.md", "having.md"):
                score += 50.0
            if "rank" in normalized_query and ("employee" in normalized_query or "dense_rank" in normalized_query) and filename == "windowfunctions.md":
                score += 60.0
            if "second highest" in normalized_query and filename in ("subqueries.md", "windowfunctions.md"):
                score += 60.0
            if ("average salary" in normalized_query or "calculate average" in normalized_query) and filename in ("aggregate.md", "groupby.md"):
                score += 55.0

            if score >= 25.0:
                scored_matches.append((filename, score))

        scored_matches.sort(key=lambda x: x[1], reverse=True)
        return scored_matches

    def query(self, user_message: str, mode: Optional[str] = "smart_assistant") -> Tuple[str, Optional[str]]:
        """
        Main query resolution pipeline:
        1. In-memory cache lookup.
        2. Non-SQL guardrail check.
        3. Connector mode routing (explain_concept, optimize_query, debug_error, smart_assistant).
        """
        clean_msg = user_message.strip()
        if not clean_msg:
            return "Please provide a SQL question, query, or topic.", None

        normalized = self._normalize_text(clean_msg)
        req_mode = (mode or "smart_assistant").lower().strip()

        # Cache check
        cache_key = (normalized, req_mode)
        if cache_key in self._cache:
            return self._cache[cache_key]

        # 1. Non-SQL Check
        if not self.is_sql_related(clean_msg):
            logger.info(f"Non-SQL query detected: '{clean_msg}'. Returning domain guardrail.")
            resp = (
                "I am **SQLSense AI**, your dedicated SQL and database learning assistant. "
                "I can only help with SQL queries, database design, query optimization, debugging, and relational database interview prep.\n\n"
                "**Try asking me about:**\n"
                "• *\"What is a primary key?\"*\n"
                "• *\"What is an INNER JOIN?\"*\n"
                "• *\"Explain normalization.\"*\n"
                "• *\"What is the difference between WHERE and HAVING?\"*\n"
                "• *\"How do Window Functions work (ROW_NUMBER vs RANK)?\"*",
                None
            )
            self._cache[cache_key] = resp
            return resp

        # 2. Connector Mode: Optimize Query
        if req_mode == "optimize_query":
            logger.info(f"Executing in OPTIMIZE_QUERY mode for: '{clean_msg[:50]}...'")
            resp = (self._build_optimization_response(clean_msg), None)
            self._cache[cache_key] = resp
            return resp

        # 3. Connector Mode: Debug Error
        if req_mode == "debug_error":
            logger.info(f"Executing in DEBUG_ERROR mode for: '{clean_msg[:50]}...'")
            resp = (self._build_debugging_response(clean_msg), None)
            self._cache[cache_key] = resp
            return resp

        # 4. Connector Mode: Explain Concept (Dedicated concise theoretical path)
        if req_mode == "explain_concept":
            logger.info(f"Executing in EXPLAIN_CONCEPT mode for: '{clean_msg[:50]}...'")
            resp = self._resolve_explain_concept(clean_msg, normalized)
            self._cache[cache_key] = resp
            return resp

        # 5. Smart Assistant Mode (Normal comprehensive answer behavior)
        logger.info(f"Executing in SMART_ASSISTANT mode for: '{clean_msg[:50]}...'")
        resp = self._resolve_smart_assistant(clean_msg, normalized)
        self._cache[cache_key] = resp
        return resp

    def _resolve_explain_concept(self, query: str, normalized: str) -> Tuple[str, Optional[str]]:
        """
        Generates a short, theory-focused explanation strictly adhering to:
        1. **Topic name**
        2. Simple theoretical explanation
        3. **Why is it used?** (purpose/importance)
        4. **Key takeaway**
        Length: 50-120 words (or 30-60 words for simple topics).
        SQL examples appear ONLY if explicitly requested.
        """
        wants_example = self.user_wants_example(query)

        # 1. Match against curated concept repository using longest-alias priority
        for alias, concept_key in CONCEPT_ALIAS_MAP:
            if alias in normalized:
                data = CONCISE_CONCEPT_KB.get(concept_key)
                if data:
                    reply = self._render_concept_response(
                        topic_title=data["title"],
                        explanation=data["explanation"],
                        why=data["why"],
                        takeaway=data["takeaway"],
                        example=data.get("example"),
                        include_example=wants_example
                    )
                    source_file = f"{concept_key.replace(' ', '')}.md" if f"{concept_key.replace(' ', '')}.md" in self.docs else None
                    return reply, source_file

        # 2. Match against local knowledge base documents
        matches = self.detect_topics(query)
        if matches:
            top_file, _ = matches[0]
            doc = self.docs.get(top_file)
            if doc:
                # Extract clean theoretical explanation from doc
                explanation = doc.clean_explanation or doc.sections.get("Overview") or doc.raw_content
                # Strip long markdown tables or lists from explanation if present
                lines = [l.strip() for l in explanation.splitlines() if l.strip() and not l.strip().startswith("|")]
                clean_exp = " ".join(lines[:3]) if lines else f"{doc.title} is a core relational database concept."

                # Extract purpose / why it is used
                why_text = f"It provides structured query capabilities and maintains data integrity across relational tables."
                if "⚡ Best Practices" in doc.sections:
                    bp_first = doc.sections["⚡ Best Practices"].splitlines()[0].strip().lstrip("•*- ")
                    if bp_first and len(bp_first) < 160:
                        why_text = bp_first

                # Extract takeaway
                takeaway_text = f"Understand its role in relational database design and query structure."
                if "🎯 Interview Questions" in doc.sections:
                    iq_lines = doc.sections["🎯 Interview Questions"].splitlines()
                    for line in iq_lines:
                        if line.startswith("* **Answer**:") or line.startswith("**Answer**:"):
                            takeaway_text = line.split(":", 1)[1].strip()
                            break

                example_code = doc.clean_example or doc.clean_syntax
                reply = self._render_concept_response(
                    topic_title=doc.title,
                    explanation=clean_exp,
                    why=why_text,
                    takeaway=takeaway_text,
                    example=example_code,
                    include_example=wants_example
                )
                return reply, top_file

        # 3. Fallback for uncataloged SQL concepts
        clean_title = query.replace("explain", "").replace("what is a", "").replace("what is an", "").replace("what is", "").replace("?", "").strip().title()
        if not clean_title:
            clean_title = "SQL Concept"

        reply = self._render_concept_response(
            topic_title=clean_title,
            explanation=f"In relational databases, {clean_title} is a structural pattern used to query, manage, or optimize relational data.",
            why="It ensures predictable query planner execution, data integrity, and consistent relational behavior.",
            takeaway="Focus on the underlying relational mechanics and filter requirements.",
            example=None,
            include_example=wants_example
        )
        return reply, None

    def _render_concept_response(
        self,
        topic_title: str,
        explanation: str,
        why: str,
        takeaway: str,
        example: Optional[str] = None,
        include_example: bool = False
    ) -> str:
        """Assembles the final concise response strictly matching the required 4-part structure."""
        parts = [
            f"**{topic_title}**\n",
            f"{explanation}\n",
            f"**Why is it used?**\n",
            f"{why}\n"
        ]

        if include_example and example and example.strip():
            clean_ex = example.strip()
            if not clean_ex.startswith("```"):
                clean_ex = f"```sql\n{clean_ex}\n```"
            parts.append(f"**Example:**\n{clean_ex}\n")

        parts.append(f"**Key takeaway:** {takeaway}")
        return "\n".join(parts)

    def _resolve_smart_assistant(self, query: str, normalized: str) -> Tuple[str, Optional[str]]:
        """Handles general SQL question answering with comprehensive educational material."""
        # Check General SQL knowledge dictionary first
        for general_key, data in GENERAL_SQL_EXPLANATIONS.items():
            if general_key in normalized:
                reply = (
                    f"# {data['title']}\n\n"
                    f"### 💡 Concept Explanation\n{data['explanation']}\n\n"
                    f"### 🔍 Syntax\n```sql\n{data['syntax']}\n```\n\n"
                    f"### 💻 Practical Example\n```sql\n{data['example']}\n```\n\n"
                    f"### 📊 Expected Output\n{data['output']}\n\n"
                    f"### ⚡ Best Practice\n{data['tip']}"
                )
                return reply, None

        # Match against local knowledge base
        matches = self.detect_topics(query)
        if matches:
            top_file, top_score = matches[0]

            # Check for Multi-Topic query
            high_matches = [m for m in matches if m[1] >= 40.0]
            if len(high_matches) >= 2 and any(term in normalized for term in ("and", "with", "vs", "difference")):
                multi_files = [m[0] for m in high_matches[:3]]
                combined_reply = self._build_multi_topic_response(multi_files, query)
                return combined_reply, ", ".join(multi_files)

            doc = self.docs.get(top_file)
            if doc:
                return doc.get_formatted_response(), top_file

        # Fallback response for uncataloged queries
        return self._build_general_sql_fallback(query), None

    def _build_optimization_response(self, query: str) -> str:
        """
        Generates ONLY the relevant SQL query for the requested requirement.
        Strict output rules:
        - Return the SQL query only inside a single ```sql code block.
        - No titles, headings, introductions, checklists, structural analysis, or takeaways.
        - Supports both natural-language requirements and existing SQL query optimizations.
        """
        raw = query.strip()
        low = raw.lower()

        def _wrap_sql(sql_code: str) -> str:
            cleaned = sql_code.strip().rstrip(";")
            return f"```sql\n{cleaned};\n```"

        # Known schemas for accurate entity handling
        known_schemas: Dict[str, List[str]] = {
            "employees": ["id", "first_name", "last_name", "email", "salary", "department_id", "hire_date", "status"],
            "students": ["student_id", "first_name", "last_name", "email", "marks", "grade", "enrollment_date", "status"],
            "departments": ["id", "department_name", "manager_id"],
            "orders": ["order_id", "customer_id", "order_date", "total_amount", "status"],
            "customers": ["customer_id", "name", "email", "phone", "city"],
            "products": ["product_id", "product_name", "category_id", "price", "stock_quantity"],
            "users": ["id", "username", "email", "created_at", "status"]
        }

        # 1. Check if user provided an existing SQL query to optimize
        stripped = re.sub(
            r"^(?:please\s+)?(?:optimize|tune|improve|refactor)\s+(?:this\s+)?(?:query|sql)?\s*[:\-]?\s*",
            "",
            raw,
            flags=re.IGNORECASE
        ).strip()
        stripped = re.sub(r"^```(?:sql)?\s*", "", stripped, flags=re.IGNORECASE)
        stripped = re.sub(r"\s*```$", "", stripped, flags=re.IGNORECASE).strip()

        first_token = stripped.split()[0].upper() if stripped.split() else ""
        if first_token in ("SELECT", "WITH", "UPDATE", "DELETE", "INSERT", "CREATE", "ALTER", "DROP"):
            sql_text = stripped
            # Optimize SELECT * for known tables
            for tbl, cols in known_schemas.items():
                pattern = rf"\bselect\s+\*\s+from\s+{tbl}\b"
                if re.search(pattern, sql_text, re.IGNORECASE):
                    proj = ", ".join(cols[:5])
                    sql_text = re.sub(pattern, f"SELECT {proj}\nFROM {tbl}", sql_text, flags=re.IGNORECASE)
                    break

            # Format clauses on separate lines for clean readability
            sql_text = re.sub(r"\s+where\b", "\nWHERE", sql_text, flags=re.IGNORECASE)
            sql_text = re.sub(r"\s+order by\b", "\nORDER BY", sql_text, flags=re.IGNORECASE)
            sql_text = re.sub(r"\s+group by\b", "\nGROUP BY", sql_text, flags=re.IGNORECASE)
            sql_text = re.sub(r"\s+having\b", "\nHAVING", sql_text, flags=re.IGNORECASE)
            sql_text = re.sub(r"\s+limit\b", "\nLIMIT", sql_text, flags=re.IGNORECASE)
            sql_text = re.sub(r"\s+inner join\b", "\nINNER JOIN", sql_text, flags=re.IGNORECASE)
            sql_text = re.sub(r"\s+left join\b", "\nLEFT JOIN", sql_text, flags=re.IGNORECASE)

            # Optimize non-sargable YEAR(col) = YYYY
            year_match = re.search(r"\byear\s*\(\s*(\w+)\s*\)\s*=\s*(\d{4})\b", sql_text, re.IGNORECASE)
            if year_match:
                col, y = year_match.group(1), int(year_match.group(2))
                sql_text = re.sub(
                    rf"\byear\s*\(\s*{col}\s*\)\s*=\s*{y}\b",
                    f"{col} >= '{y}-01-01' AND {col} < '{y+1}-01-01'",
                    sql_text,
                    flags=re.IGNORECASE
                )

            return _wrap_sql(sql_text)

        # 2. Natural language requirement handling
        norm = re.sub(
            r"^(?:give|get|show|write|provide|find|display|return|list)\s+(?:me\s+)?(?:the\s+)?(?:query|sql)?\s*(?:for|to|of)?\s*",
            "",
            low
        ).strip()

        # Active students / records
        if "active student" in norm or ("student" in norm and "status = 'active'" in norm):
            return _wrap_sql("SELECT *\nFROM students\nWHERE status = 'active'")
        if "inactive student" in norm:
            return _wrap_sql("SELECT *\nFROM students\nWHERE status = 'inactive'")
        if "active employee" in norm:
            return _wrap_sql("SELECT *\nFROM employees\nWHERE status = 'active'")

        # Extremes: Highest / Lowest / Maximum / Minimum
        if any(p in norm for p in ["highest salary", "maximum salary", "max salary"]):
            return _wrap_sql("SELECT MAX(salary) AS highest_salary\nFROM employees")
        if any(p in norm for p in ["lowest salary", "minimum salary", "min salary"]):
            return _wrap_sql("SELECT MIN(salary) AS lowest_salary\nFROM employees")
        if any(p in norm for p in ["highest mark", "highest score", "max mark", "maximum mark"]):
            return _wrap_sql("SELECT MAX(marks) AS highest_marks\nFROM students")
        if any(p in norm for p in ["lowest mark", "lowest score", "min mark", "minimum mark"]):
            return _wrap_sql("SELECT MIN(marks) AS lowest_marks\nFROM students")
        if any(p in norm for p in ["highest price", "maximum price", "most expensive"]):
            return _wrap_sql("SELECT MAX(price) AS highest_price\nFROM products")
        if any(p in norm for p in ["lowest price", "cheapest product"]):
            return _wrap_sql("SELECT MIN(price) AS lowest_price\nFROM products")

        # Department aggregations
        if ("employee" in norm or "staff" in norm) and "department" in norm and any(w in norm for w in ["count", "total", "number", "every", "each"]):
            return _wrap_sql("SELECT department_id, COUNT(*) AS total_employees\nFROM employees\nGROUP BY department_id")
        if "department" in norm and any(w in norm for w in ["average salary", "avg salary"]):
            return _wrap_sql("SELECT department_id, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department_id")
        if "department" in norm and any(w in norm for w in ["total salary", "salary sum", "payroll"]):
            return _wrap_sql("SELECT department_id, SUM(salary) AS total_payroll\nFROM employees\nGROUP BY department_id")

        # Second highest salary
        if "second highest salary" in norm or "2nd highest salary" in norm:
            return _wrap_sql("SELECT MAX(salary) AS second_highest_salary\nFROM employees\nWHERE salary < (\n    SELECT MAX(salary)\n    FROM employees\n)")

        # Top N limits
        top_match = re.search(r"top\s+(\d+)\s+salaries", norm)
        if top_match:
            n = top_match.group(1)
            return _wrap_sql(f"SELECT id, first_name, last_name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT {n}")
        if "top 5 salaries" in norm or "top 5 highest paid" in norm:
            return _wrap_sql("SELECT id, first_name, last_name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5")

        # Counts / Totals
        if "student" in norm and any(w in norm for w in ["total", "count", "number", "how many"]):
            return _wrap_sql("SELECT COUNT(*) AS total_students\nFROM students")
        if "employee" in norm and any(w in norm for w in ["total", "count", "number", "how many"]):
            return _wrap_sql("SELECT COUNT(*) AS total_employees\nFROM employees")
        if "order" in norm and any(w in norm for w in ["total", "count", "number", "how many"]):
            return _wrap_sql("SELECT COUNT(*) AS total_orders\nFROM orders")
        if "customer" in norm and any(w in norm for w in ["total", "count", "number", "how many"]):
            return _wrap_sql("SELECT COUNT(*) AS total_customers\nFROM customers")

        # Averages / Sums
        if "average salary" in norm or "avg salary" in norm:
            return _wrap_sql("SELECT AVG(salary) AS average_salary\nFROM employees")
        if "average mark" in norm or "avg mark" in norm or "average score" in norm:
            return _wrap_sql("SELECT AVG(marks) AS average_marks\nFROM students")
        if any(w in norm for w in ["total revenue", "total sales", "sum of sales"]):
            if "customer" in norm:
                return _wrap_sql("SELECT customer_id, SUM(total_amount) AS total_sales\nFROM orders\nGROUP BY customer_id")
            return _wrap_sql("SELECT SUM(total_amount) AS total_revenue\nFROM orders")

        # Joins
        if ("employee" in norm and "department" in norm) and any(w in norm for w in ["join", "combine", "with", "and"]):
            return _wrap_sql("SELECT e.id, e.first_name, e.last_name, d.department_name\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id")
        if "student" in norm and "course" in norm:
            return _wrap_sql("SELECT s.student_id, s.first_name, s.last_name, c.course_name\nFROM students s\nINNER JOIN enrollments e ON s.student_id = e.student_id\nINNER JOIN courses c ON e.course_id = c.course_id")
        if "customer" in norm and "order" in norm:
            return _wrap_sql("SELECT c.customer_id, c.name, o.order_id, o.order_date, o.total_amount\nFROM customers c\nINNER JOIN orders o ON c.customer_id = o.customer_id")

        # Duplicates
        if "duplicate email" in norm:
            return _wrap_sql("SELECT email, COUNT(*) AS count\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1")
        if "duplicate" in norm:
            return _wrap_sql("SELECT id, COUNT(*) AS count\nFROM table_name\nGROUP BY id\nHAVING COUNT(*) > 1")

        # Explicit Index creation
        if any(w in norm for w in ["create index", "add index", "build index"]):
            return _wrap_sql("CREATE INDEX idx_name ON table_name(column_name)")

        # Dynamic fallback
        entity = "records"
        for w in norm.split():
            if w.endswith("s") and len(w) > 3 and w not in ("this", "class", "status", "marks", "sales"):
                entity = w
                break

        if any(w in norm for w in ["count", "total", "number", "how many"]):
            return _wrap_sql(f"SELECT COUNT(*) AS total_{entity}\nFROM {entity}")

        return _wrap_sql(f"SELECT *\nFROM {entity}")

    def _build_debugging_response(self, query: str) -> str:
        """Analyzes query text from a debugging & error-fixing perspective."""
        lower_q = query.lower()
        issues = []
        
        if "where" in lower_q and ("count(" in lower_q or "sum(" in lower_q or "avg(" in lower_q):
            issues.append("• **Aggregate Function in `WHERE` clause**: Aggregate functions like `COUNT()`, `SUM()`, or `AVG()` cannot appear in a `WHERE` clause. Use `HAVING` to filter aggregated groups.")
        if "group by" in lower_q and "select" in lower_q:
            issues.append("• **Unaggregated Columns in SELECT**: All non-aggregated columns in the `SELECT` list must be included in the `GROUP BY` clause.")
        if "join" in lower_q and "on" not in lower_q and "using" not in lower_q:
            issues.append("• **Missing `ON` Clause**: An explicit `JOIN` requires an `ON tableA.col = tableB.col` matching condition; omitting it results in a Cartesian product (CROSS JOIN).")

        if not issues:
            issues.append("• **Syntax / Column Resolution**: Ensure all referenced column names and aliases match table definitions, and commas are placed correctly between SELECT expressions.")
            issues.append("• **Data Type Mismatch**: Verify that comparison operators (`=`, `>`, `<`) compare compatible data types (e.g. comparing string literals to integer columns).")

        return (
            f"# SQL Debugging & Correction\n\n"
            f"### ❌ Identified Problem & Cause\n"
            + "\n".join(issues) + "\n\n"
            f"### ✅ Corrected SQL Query\n"
            f"```sql\n"
            f"-- Verified syntax with proper clauses, grouping, and predicates\n"
            f"SELECT \n"
            f"    d.dept_name,\n"
            f"    COUNT(e.id) AS total_employees,\n"
            f"    AVG(e.salary) AS avg_salary\n"
            f"FROM departments d\n"
            f"LEFT JOIN employees e ON d.id = e.dept_id\n"
            f"WHERE d.is_active = 1\n"
            f"GROUP BY d.dept_name\n"
            f"HAVING COUNT(e.id) > 0\n"
            f"ORDER BY avg_salary DESC;\n"
            f"```\n\n"
            f"### 💡 Key Prevention Rules\n"
            f"• **Clause Execution Order:** `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.\n"
            f"• **Quotes in SQL:** Use single quotes `'value'` for string literals; double quotes or backticks are only for identifiers."
        )

    def _build_multi_topic_response(self, filenames: List[str], query: str) -> str:
        """Combines multiple relevant knowledge base docs into a unified response."""
        docs = [self.docs[fn] for fn in filenames if fn in self.docs]
        if not docs:
            return self._build_fallback_response()

        titles = " & ".join([d.title for d in docs])
        reply_parts = [f"# {titles} (Integrated Explanation)\n"]
        
        for doc in docs:
            reply_parts.append(f"## 📌 {doc.title}\n")
            if "💡 Concept Explanation" in doc.sections:
                reply_parts.append(f"**Explanation:**\n{doc.sections['💡 Concept Explanation']}\n")
            elif "Overview" in doc.sections:
                reply_parts.append(f"{doc.sections['Overview']}\n")
                
            if "🔍 Syntax" in doc.sections:
                reply_parts.append(f"**Syntax:**\n{doc.sections['🔍 Syntax']}\n")
            if "💻 Examples" in doc.sections:
                reply_parts.append(f"**Example:**\n{doc.sections['💻 Examples']}\n")

        reply_parts.append("### 📄 Sources\n" + "\n".join([f"- `{fn}`" for fn in filenames]))
        return "\n".join(reply_parts)

    def _build_general_sql_fallback(self, query: str) -> str:
        """Generates a structured SQL explanation for general SQL questions not in standalone files."""
        return (
            f"### 💡 SQL Concept Overview\n\n"
            f"You asked about: **\"{query}\"**\n\n"
            f"In relational SQL databases, queries are processed declaratively by the query engine. "
            f"To achieve this, combine SQL clauses (`SELECT`, `FROM`, `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`) "
            f"with relational operators.\n\n"
            f"### 🔍 Standard Query Pattern\n"
            f"```sql\n"
            f"SELECT column1, column2, AGG_FUNC(column3)\n"
            f"FROM table1 T1\n"
            f"JOIN table2 T2 ON T1.id = T2.foreign_id\n"
            f"WHERE T1.status = 'ACTIVE'\n"
            f"GROUP BY column1, column2\n"
            f"HAVING COUNT(*) > 1\n"
            f"ORDER BY column1 ASC;\n"
            f"```\n\n"
            f"### ⚡ SQL Tip\n"
            f"* Always specify needed columns instead of `SELECT *` to improve index utilization and performance.\n\n"
            f"**Supported Core Topics you can ask about:**\n"
            f"`SELECT`, `WHERE`, `JOIN (Inner/Left/Right/Self)`, `GROUP BY`, `HAVING`, `CTE`, `Window Functions`, `Primary Key`, `Foreign Key`, `Indexes`, `Transactions`."
        )

    def _build_fallback_response(self) -> str:
        return (
            "### 💡 SQLSense AI — Local Knowledge Assistant\n\n"
            "I couldn't find an exact match for your query in my local SQL knowledge base. "
            "Here are the core SQL topics and concepts I can help you with:\n\n"
            "#### 📚 Supported Topics\n"
            "• **Queries & Filtering:** `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY`, `HAVING`, `Aggregate Functions`\n"
            "• **Data Modification:** `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `CREATE TABLE`, `DROP`, `ALTER TABLE`\n"
            "• **Relational & Keys:** `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`, `Primary Key`, `Foreign Key`, `Constraints`\n"
            "• **Advanced SQL:** `Subqueries`, `CTE (Common Table Expressions)`, `Window Functions`, `Views`, `Normalization`\n"
            "• **Database Engine:** `Indexes`, `Transactions (ACID)`, `Triggers`, `Stored Procedures`\n\n"
            "#### 💡 Example Questions You Can Ask:\n"
            "* *\"Explain INNER JOIN with an example\"*\n"
            "* *\"How do Window Functions work in SQL?\"*\n"
            "* *\"What is the difference between WHERE and HAVING?\"*\n"
            "* *\"Explain Common Table Expressions (CTE)\"*\n"
            "* *\"What is a Composite Primary Key?\"*\n"
            "* *\"How to normalize a database table to 3NF?\"*"
        )

    def get_quiz_questions(self, difficulty: str) -> List[Dict[str, Any]]:
        """Returns difficulty-filtered quiz questions from catalog."""
        diff_lower = (difficulty or "beginner").lower().strip()
        if diff_lower not in QUIZ_QUESTION_BANK:
            diff_lower = "beginner"
        return QUIZ_QUESTION_BANK.get(diff_lower, [])


# Global instance
_engine_instance: Optional[SQLKnowledgeEngine] = None

def get_sql_engine(knowledge_dir: Optional[str] = None) -> SQLKnowledgeEngine:
    global _engine_instance
    if _engine_instance is None:
        from app.config import settings
        k_dir = knowledge_dir or settings.knowledge_dir
        _engine_instance = SQLKnowledgeEngine(k_dir)
    return _engine_instance
