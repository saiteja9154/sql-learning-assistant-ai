"""
SQL Topic Catalog & Metadata Definitions for SQLSense AI.
Contains structured mapping for topics, natural language question patterns,
difficulty tiers, synonyms, and comprehensive quiz question banks.
"""

from typing import Dict, List, Any

# 1. CENTRALIZED TOPIC CATALOG
SQL_TOPIC_CATALOG: Dict[str, Dict[str, Any]] = {
    # ==================== BEGINNER TOPICS ====================
    "select": {
        "title": "SELECT Statement",
        "file": "select.md",
        "difficulty": "beginner",
        "category": "Query Basics",
        "aliases": [
            "select", "select statement", "retrieve data", "fetch rows", "get all rows",
            "how do i get all students", "how to read data", "query data", "get columns",
            "projection", "select all", "fetch all records", "read table"
        ],
        "keywords": ["select", "from", "columns", "retrieve", "fetch", "query", "projection"],
        "summary": "Retrieves columns and rows from one or more database tables."
    },
    "where": {
        "title": "WHERE Clause",
        "file": "where.md",
        "difficulty": "beginner",
        "category": "Filtering",
        "aliases": [
            "where", "where clause", "filter rows", "filtering records", "how can i filter records",
            "conditional filtering", "comparison operators", "filter data", "how to filter",
            "matching conditions", "equal to", "greater than", "less than"
        ],
        "keywords": ["where", "filter", "condition", "predicate", "like", "between", "in"],
        "summary": "Filters rows returned by a query based on specified conditional predicates."
    },
    "orderby": {
        "title": "ORDER BY Clause",
        "file": "orderby.md",
        "difficulty": "beginner",
        "category": "Sorting",
        "aliases": [
            "order by", "sorting", "sort rows", "sort columns", "sort data",
            "ascending", "descending", "asc", "desc", "alphabetical order",
            "sort by salary", "how to sort results"
        ],
        "keywords": ["order", "orderby", "sort", "sorting", "asc", "desc"],
        "summary": "Sorts query result sets in ascending (ASC) or descending (DESC) order."
    },
    "insert": {
        "title": "INSERT Statement",
        "file": "insert.md",
        "difficulty": "beginner",
        "category": "Data Modification",
        "aliases": [
            "insert", "insert into", "add row", "add data", "create record",
            "how to add new student", "inserting records", "insert values"
        ],
        "keywords": ["insert", "values", "into", "add"],
        "summary": "Inserts new rows of data into an existing database table."
    },
    "update": {
        "title": "UPDATE Statement",
        "file": "update.md",
        "difficulty": "beginner",
        "category": "Data Modification",
        "aliases": [
            "update", "update table", "modify row", "change value", "set column",
            "how to update salary", "modifying records", "update record"
        ],
        "keywords": ["update", "set", "modify", "change"],
        "summary": "Modifies existing column values in a database table based on filter criteria."
    },
    "delete": {
        "title": "DELETE Statement",
        "file": "delete.md",
        "difficulty": "beginner",
        "category": "Data Modification",
        "aliases": [
            "delete", "delete from", "remove row", "delete records", "how to delete a user",
            "remove record", "deleting data"
        ],
        "keywords": ["delete", "remove", "from"],
        "summary": "Removes specific rows from a database table matching given filter conditions."
    },
    "truncate": {
        "title": "TRUNCATE Statement",
        "file": "truncate.md",
        "difficulty": "beginner",
        "category": "Data Modification",
        "aliases": [
            "truncate", "truncate table", "empty table", "delete vs truncate",
            "difference between truncate and delete", "wipe table data"
        ],
        "keywords": ["truncate", "empty", "wipe", "reset"],
        "summary": "Quickly empties all rows from a table while preserving the table structure and resetting identity seeds."
    },
    "create_table": {
        "title": "CREATE TABLE",
        "file": "create_table.md",
        "difficulty": "beginner",
        "category": "Schema Definition",
        "aliases": [
            "create table", "creating table", "define table", "table schema",
            "how to create table", "data types", "varchar", "integer", "ddl"
        ],
        "keywords": ["create", "table", "schema", "datatype", "varchar", "int", "boolean"],
        "summary": "Defines a new relational table structure including columns and data types."
    },
    "drop": {
        "title": "DROP Statement",
        "file": "drop.md",
        "difficulty": "beginner",
        "category": "Schema Definition",
        "aliases": [
            "drop", "drop table", "drop database", "remove table permanently",
            "delete table structure"
        ],
        "keywords": ["drop", "cascade"],
        "summary": "Permanently deletes database objects such as tables, views, or databases."
    },
    "tables": {
        "title": "ALTER TABLE Operations",
        "file": "tables.md",
        "difficulty": "beginner",
        "category": "Schema Definition",
        "aliases": [
            "alter table", "add column", "modify column", "drop column",
            "rename table", "rename column", "table alterations"
        ],
        "keywords": ["alter", "rename", "add", "modify", "drop column"],
        "summary": "Modifies the structural definition of an existing table by adding, deleting, or altering columns."
    },
    "database": {
        "title": "Database Fundamentals",
        "file": "database.md",
        "difficulty": "beginner",
        "category": "Core Concepts",
        "aliases": [
            "what is sql", "database basics", "rdbms", "relational database",
            "create database", "use database", "schema", "tables overview"
        ],
        "keywords": ["database", "rdbms", "sql", "relational", "schema"],
        "summary": "Fundamental concepts of relational database management systems and Structured Query Language."
    },
    "primarykey": {
        "title": "Primary Key",
        "file": "primarykey.md",
        "difficulty": "beginner",
        "category": "Constraints & Keys",
        "aliases": [
            "primary key", "primary keys", "pk", "composite primary key",
            "unique identifier", "auto increment", "identity key", "what is a primary key"
        ],
        "keywords": ["primary", "primarykey", "pk", "unique", "identifier"],
        "summary": "A column or combination of columns that uniquely identifies each row in a table."
    },
    "foreignkey": {
        "title": "Foreign Key",
        "file": "foreignkey.md",
        "difficulty": "beginner",
        "category": "Constraints & Keys",
        "aliases": [
            "foreign key", "foreign keys", "fk", "referential integrity",
            "parent table", "child table", "cascade delete", "references constraint"
        ],
        "keywords": ["foreign", "foreignkey", "fk", "references", "cascade"],
        "summary": "A field in one table that uniquely identifies a row of another table to maintain referential integrity."
    },
    "constraints": {
        "title": "Constraints",
        "file": "constraints.md",
        "difficulty": "beginner",
        "category": "Constraints & Keys",
        "aliases": [
            "constraints", "constraint", "not null", "unique constraint",
            "check constraint", "default constraint", "table integrity"
        ],
        "keywords": ["constraint", "constraints", "null", "unique", "check", "default"],
        "summary": "Rules enforced on data columns to ensure data accuracy, uniqueness, and integrity."
    },
    "aggregate": {
        "title": "Aggregate Functions",
        "file": "aggregate.md",
        "difficulty": "beginner",
        "category": "Aggregation",
        "aliases": [
            "aggregate", "aggregate functions", "count", "sum", "avg", "min", "max",
            "calculate average", "calculate average salary", "calculate total",
            "how to find max value", "summarize data", "count rows"
        ],
        "keywords": ["aggregate", "count", "sum", "avg", "min", "max", "average"],
        "summary": "Functions (COUNT, SUM, AVG, MIN, MAX) that calculate a single summary result from multiple row values."
    },

    # ==================== INTERMEDIATE TOPICS ====================
    "joins": {
        "title": "SQL Joins",
        "file": "joins.md",
        "difficulty": "intermediate",
        "category": "Multi-Table Queries",
        "aliases": [
            "join", "joins", "inner join", "left join", "right join", "full join",
            "full outer join", "cross join", "self join", "combine two tables",
            "how do i connect students and departments", "how can i combine two tables",
            "merge tables", "relating tables", "what is a join", "difference between left join and inner join"
        ],
        "keywords": ["join", "joins", "inner", "left", "right", "full", "cross", "self", "on"],
        "summary": "Combines rows from two or more tables based on a related column between them."
    },
    "groupby": {
        "title": "GROUP BY Clause",
        "file": "groupby.md",
        "difficulty": "intermediate",
        "category": "Aggregation",
        "aliases": [
            "group by", "grouping", "group rows", "group data",
            "how can i group employees by department", "totals for each department",
            "calculate totals for each", "count by category", "group by department",
            "find duplicate records", "how do i find duplicate records"
        ],
        "keywords": ["group", "groupby", "grouping", "department"],
        "summary": "Groups rows that have the same values into summary rows, typically used with aggregate functions."
    },
    "having": {
        "title": "HAVING Clause",
        "file": "having.md",
        "difficulty": "intermediate",
        "category": "Aggregation",
        "aliases": [
            "having", "having clause", "filter aggregate", "filter aggregated",
            "filter groups", "where vs having", "difference between where and having",
            "filter after group by"
        ],
        "keywords": ["having", "filter groups"],
        "summary": "Filters aggregated data groups created by GROUP BY (since WHERE cannot be used with aggregate functions)."
    },
    "subqueries": {
        "title": "Subqueries",
        "file": "subqueries.md",
        "difficulty": "intermediate",
        "category": "Advanced Querying",
        "aliases": [
            "subquery", "subqueries", "nested query", "nested queries",
            "inner query", "correlated subquery", "scalar subquery",
            "query inside query", "how can i find the second highest salary"
        ],
        "keywords": ["subquery", "subqueries", "nested", "correlated", "exists", "in (select"],
        "summary": "A SQL query nested inside a larger query (such as SELECT, FROM, or WHERE clause)."
    },
    "views": {
        "title": "Views",
        "file": "views.md",
        "difficulty": "intermediate",
        "category": "Database Objects",
        "aliases": [
            "view", "views", "virtual table", "materialized view",
            "create view", "drop view", "saved query"
        ],
        "keywords": ["view", "views", "virtual"],
        "summary": "A virtual table based on the result-set of a predefined SQL query."
    },
    "indexes": {
        "title": "Indexes & Performance",
        "file": "indexes.md",
        "difficulty": "intermediate",
        "category": "Performance",
        "aliases": [
            "index", "indexes", "indexing", "b-tree index", "clustered index",
            "non clustered index", "non-clustered index", "speed up query",
            "query optimization", "index performance"
        ],
        "keywords": ["index", "indexes", "indexing", "clustered", "btree", "performance"],
        "summary": "Data structures that improve the speed of data retrieval operations on a table at the cost of additional storage."
    },
    "normalization": {
        "title": "Normalization",
        "file": "normalization.md",
        "difficulty": "intermediate",
        "category": "Database Design",
        "aliases": [
            "normalization", "normal forms", "normal form", "1nf", "2nf", "3nf",
            "bcnf", "denormalization", "data redundancy", "update anomaly",
            "insertion anomaly", "deletion anomaly", "what is normalization"
        ],
        "keywords": ["normalization", "normalize", "1nf", "2nf", "3nf", "bcnf", "redundancy", "anomaly"],
        "summary": "The systematic process of structuring a database to reduce data redundancy and improve data integrity."
    },

    # ==================== ADVANCED TOPICS ====================
    "cte": {
        "title": "Common Table Expressions (CTE)",
        "file": "cte.md",
        "difficulty": "advanced",
        "category": "Advanced SQL",
        "aliases": [
            "cte", "common table expression", "common table expressions",
            "with clause", "with as", "recursive cte", "temporary result set",
            "readable subquery", "hierarchical query", "explain cte"
        ],
        "keywords": ["cte", "with", "recursive", "expression"],
        "summary": "A temporary named result set defined within the execution scope of a single SELECT, INSERT, UPDATE, or DELETE."
    },
    "windowfunctions": {
        "title": "Window Functions",
        "file": "windowfunctions.md",
        "difficulty": "advanced",
        "category": "Advanced SQL",
        "aliases": [
            "window function", "window functions", "over clause", "partition by",
            "row_number", "rank", "dense_rank", "lead", "lag", "running total",
            "moving average", "ranking employees", "how do i rank employees",
            "what is the difference between rank and dense_rank", "rank vs dense_rank"
        ],
        "keywords": ["window", "over", "partition", "row_number", "dense_rank", "rank", "lead", "lag"],
        "summary": "Calculates values across a set of table rows related to the current row without collapsing rows into a single summary."
    },
    "transactions": {
        "title": "Transactions & ACID",
        "file": "transactions.md",
        "difficulty": "advanced",
        "category": "Database Engine",
        "aliases": [
            "transaction", "transactions", "acid", "acid properties",
            "commit", "rollback", "savepoint", "atomicity", "consistency",
            "isolation", "durability", "tcl", "concurrency"
        ],
        "keywords": ["transaction", "transactions", "acid", "commit", "rollback", "savepoint", "isolation"],
        "summary": "A sequence of database operations executed as a single logical unit of work adhering to ACID guarantees."
    },
    "triggers": {
        "title": "Database Triggers",
        "file": "triggers.md",
        "difficulty": "advanced",
        "category": "Programmability",
        "aliases": [
            "trigger", "triggers", "before insert", "after insert",
            "before update", "after update", "before delete", "after delete",
            "database triggers", "audit log trigger"
        ],
        "keywords": ["trigger", "triggers", "before", "after", "event"],
        "summary": "Stored procedures that automatically execute (fire) when specified database events occur."
    },
    "storedprocedures": {
        "title": "Stored Procedures",
        "file": "storedprocedures.md",
        "difficulty": "advanced",
        "category": "Programmability",
        "aliases": [
            "stored procedure", "stored procedures", "sproc", "stored proc",
            "procedure", "procedures", "call procedure", "routine",
            "parameterized procedure"
        ],
        "keywords": ["procedure", "procedures", "sproc", "routine", "parameters"],
        "summary": "A prepared SQL code block that can be saved and reused repeatedly with input and output parameters."
    }
}


# 2. CURATED DIFFICULTY-TIERED QUIZ QUESTION BANK
QUIZ_QUESTION_BANK = {
    "beginner": [
        {
            "id": "b1",
            "topic": "SELECT",
            "difficulty": "beginner",
            "question": "Which SQL keyword is used to retrieve distinct (unique) values from a table column?",
            "options": ["UNIQUE", "DISTINCT", "DIFFERENT", "FILTER"],
            "correctIndex": 1,
            "explanation": "The DISTINCT keyword is placed immediately after SELECT to eliminate duplicate rows from the returned result set."
        },
        {
            "id": "b2",
            "topic": "WHERE",
            "difficulty": "beginner",
            "question": "Which operator is used to search for a specified pattern in a column using wildcards?",
            "options": ["IN", "LIKE", "BETWEEN", "CONTAINS"],
            "correctIndex": 1,
            "explanation": "The LIKE operator is used in a WHERE clause with wildcards such as '%' (matches multiple characters) and '_' (matches single character)."
        },
        {
            "id": "b3",
            "topic": "ORDER BY",
            "difficulty": "beginner",
            "question": "What is the default sorting order when using the ORDER BY clause without specifying ASC or DESC?",
            "options": ["Descending (DESC)", "Ascending (ASC)", "Random", "By primary key insertion order"],
            "correctIndex": 1,
            "explanation": "By default, ORDER BY sorts result sets in ascending order (ASC) if no order direction is explicitly given."
        },
        {
            "id": "b4",
            "topic": "DELETE vs TRUNCATE",
            "difficulty": "beginner",
            "question": "Which command removes ALL rows from a table, cannot have a WHERE clause, and resets identity counters?",
            "options": ["DELETE", "TRUNCATE", "DROP", "REMOVE"],
            "correctIndex": 1,
            "explanation": "TRUNCATE TABLE removes all rows at once without logging individual row deletions, resets identity seeds, and does not accept a WHERE clause."
        },
        {
            "id": "b5",
            "topic": "Primary Key",
            "difficulty": "beginner",
            "question": "Which statement regarding PRIMARY KEY constraints is TRUE?",
            "options": [
                "A primary key column can accept a single NULL value.",
                "A primary key column must contain UNIQUE values and CANNOT be NULL.",
                "A table can have multiple primary keys defined separately.",
                "Primary keys are only allowed on numerical data types."
            ],
            "correctIndex": 1,
            "explanation": "A primary key uniquely identifies each record in a database table. It implicitly enforces both UNIQUE and NOT NULL constraints."
        },
        {
            "id": "b6",
            "topic": "Aggregate Functions",
            "difficulty": "beginner",
            "question": "What does the COUNT(*) function return?",
            "options": [
                "Only rows that do not contain any NULL values.",
                "The total number of rows matching the query criteria, including NULLs.",
                "The sum of all integer columns in the table.",
                "The count of unique column names in the schema."
            ],
            "correctIndex": 1,
            "explanation": "COUNT(*) counts all rows returned by the query regardless of whether individual columns contain NULL values."
        }
    ],

    "intermediate": [
        {
            "id": "i1",
            "topic": "Joins",
            "difficulty": "intermediate",
            "question": "What is the result of a LEFT JOIN if a row in the left table has no matching record in the right table?",
            "options": [
                "The row is omitted from the final output.",
                "The row is included, with NULL values for all columns from the right table.",
                "The query fails with a foreign key violation error.",
                "The right table columns default to empty strings or 0."
            ],
            "correctIndex": 1,
            "explanation": "A LEFT JOIN returns all rows from the left table. For rows with no match in the right table, all columns from the right table are populated with NULL."
        },
        {
            "id": "i2",
            "topic": "GROUP BY & HAVING",
            "difficulty": "intermediate",
            "question": "What is the primary difference between the WHERE clause and the HAVING clause?",
            "options": [
                "WHERE filters grouped data, while HAVING filters individual rows before grouping.",
                "WHERE filters rows before aggregation, while HAVING filters groups after aggregation.",
                "WHERE is used only with SELECT, while HAVING is used with UPDATE.",
                "There is no difference; they are interchangeable."
            ],
            "correctIndex": 1,
            "explanation": "WHERE filters individual records before any grouping/aggregation occurs. HAVING filters groups produced by GROUP BY."
        },
        {
            "id": "i3",
            "topic": "Subqueries",
            "difficulty": "intermediate",
            "question": "What distinguishes a 'Correlated Subquery' from a standard nested subquery?",
            "options": [
                "It executes only once for the entire query execution.",
                "It references columns from the outer query and re-evaluates for every candidate row.",
                "It can only be used inside the FROM clause.",
                "It is always faster than a JOIN operation."
            ],
            "correctIndex": 1,
            "explanation": "A correlated subquery references values from the outer query table, meaning it must be evaluated row-by-row for each row processed by the outer query."
        },
        {
            "id": "i4",
            "topic": "Normalization",
            "difficulty": "intermediate",
            "question": "Which Normal Form (NF) is satisfied when a table is in 1NF and all non-key columns are fully functionally dependent on the entire primary key (no partial dependencies)?",
            "options": [
                "Second Normal Form (2NF)",
                "Third Normal Form (3NF)",
                "Boyce-Codd Normal Form (BCNF)",
                "Fourth Normal Form (4NF)"
            ],
            "correctIndex": 0,
            "explanation": "Second Normal Form (2NF) eliminates partial functional dependencies, ensuring every non-key attribute depends on the full composite primary key."
        },
        {
            "id": "i5",
            "topic": "Indexes",
            "difficulty": "intermediate",
            "question": "Why can a relational database table have only ONE Clustered Index?",
            "options": [
                "Database engines enforce an artificial limit to save RAM.",
                "A clustered index defines the actual physical storage order of data rows on disk.",
                "Clustered indexes only work on VARCHAR columns.",
                "Multiple clustered indexes cause deadlock in single-threaded queries."
            ],
            "correctIndex": 1,
            "explanation": "Because a clustered index determines the physical sequence in which data pages and rows are stored on disk, data can only be physically sorted in one way."
        },
        {
            "id": "i6",
            "topic": "UNION vs UNION ALL",
            "difficulty": "intermediate",
            "question": "Why is UNION ALL typically faster in execution than UNION?",
            "options": [
                "UNION ALL uses an in-memory cache while UNION writes to disk.",
                "UNION ALL returns all rows immediately without performing a duplicate sorting/deduplication step.",
                "UNION ALL skips type checking across result columns.",
                "UNION requires a foreign key relation between both queries."
            ],
            "correctIndex": 1,
            "explanation": "UNION runs an implicit DISTINCT sort to eliminate duplicate rows, which is CPU and memory intensive. UNION ALL returns rows without deduplication."
        }
    ],

    "advanced": [
        {
            "id": "a1",
            "topic": "Window Functions",
            "difficulty": "advanced",
            "question": "What is the difference between RANK() and DENSE_RANK() when encountering tied values?",
            "options": [
                "RANK() leaves no gaps in subsequent rank numbers; DENSE_RANK() skips ranks.",
                "RANK() assigns gaps in ranking sequence after ties; DENSE_RANK() produces consecutive rank numbers without gaps.",
                "RANK() requires an ORDER BY clause; DENSE_RANK() operates only with PARTITION BY.",
                "DENSE_RANK() only works with integer score columns."
            ],
            "correctIndex": 1,
            "explanation": "When ties occur (e.g. 1, 2, 2), RANK() skips the next number resulting in (1, 2, 2, 4), while DENSE_RANK() assigns consecutive numbers (1, 2, 2, 3)."
        },
        {
            "id": "a2",
            "topic": "CTE",
            "difficulty": "advanced",
            "question": "What is the mandatory structure of a Recursive Common Table Expression (Recursive CTE)?",
            "options": [
                "Two SELECT queries joined by an INNER JOIN.",
                "An Anchor Member query combined with a Recursive Member query via UNION ALL.",
                "A WHILE loop statement wrapped around a temporary table.",
                "A stored procedure that calls itself recursively."
            ],
            "correctIndex": 1,
            "explanation": "A recursive CTE consists of an Anchor Member (base case) and a Recursive Member (recursive step referencing the CTE name), unified using UNION ALL with a termination condition."
        },
        {
            "id": "a3",
            "topic": "Window Functions",
            "difficulty": "advanced",
            "question": "Which window function allows you to access data from the preceding row without joining the table to itself?",
            "options": ["LEAD()", "LAG()", "PREV()", "ROW_NUMBER()"],
            "correctIndex": 1,
            "explanation": "LAG() accesses data from a previous row at a specified offset within the partition. LEAD() accesses data from subsequent rows."
        },
        {
            "id": "a4",
            "topic": "Transactions",
            "difficulty": "advanced",
            "question": "Which ACID property guarantees that once a transaction has committed, its changes survive even in the event of a system crash or power outage?",
            "options": ["Atomicity", "Consistency", "Isolation", "Durability"],
            "correctIndex": 3,
            "explanation": "Durability guarantees that committed transactions are permanently recorded in non-volatile storage (via transaction write-ahead logs) and survive system crashes."
        },
        {
            "id": "a5",
            "topic": "Triggers & Procedures",
            "difficulty": "advanced",
            "question": "Inside an AFTER UPDATE trigger in SQL, which pseudo-tables are available to inspect pre-update and post-update row values?",
            "options": [
                "OLD and NEW (or DELETED and INSERTED)",
                "BEFORE and AFTER",
                "PREVIOUS and CURRENT",
                "TEMP_SOURCE and TEMP_TARGET"
            ],
            "correctIndex": 0,
            "explanation": "In standard SQL (and engines like PostgreSQL/MySQL/SQL Server), triggers use OLD/DELETED to read values before the update and NEW/INSERTED for the updated values."
        },
        {
            "id": "a6",
            "topic": "Performance & Execution",
            "difficulty": "advanced",
            "question": "What is an 'Index Scan' vs an 'Index Seek' in query execution plans?",
            "options": [
                "An Index Scan navigates directly to specific rows using B-Tree keys, while an Index Seek traverses all leaf pages.",
                "An Index Seek uses the B-Tree structure to jump directly to qualifying rows; an Index Scan traverses all pages of the index.",
                "Index Seek is only possible on tables with fewer than 1000 rows.",
                "There is no difference; they are synonyms used by different database engines."
            ],
            "correctIndex": 1,
            "explanation": "An Index Seek leverages the B-Tree index hierarchy to pinpoint specific target rows efficiently (O(log N)), whereas an Index Scan reads through the entire index."
        }
    ]
}
