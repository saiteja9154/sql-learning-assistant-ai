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
    "department", "departments", "customer", "customers", "total", "highest", "second"
}

# Generic SQL topic knowledge generator for queries not explicitly in a standalone markdown file
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
        self.title = filename.replace(".md", "").capitalize()
        self.sections: Dict[str, str] = {}
        self._load()

    def _load(self):
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                self.raw_content = f.read().strip()
                
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
                
        except Exception as e:
            logger.error(f"Failed to load knowledge file {self.filepath}: {e}")

    def get_formatted_response(self) -> str:
        return f"{self.raw_content}\n\n### 📄 Sources\n- `{self.filename}`"


class SQLKnowledgeEngine:
    def __init__(self, knowledge_dir: str):
        self.knowledge_dir = knowledge_dir
        self.docs: Dict[str, SQLTopicDoc] = {}
        self.supported_topic_names: List[str] = []
        self.reload()

    def reload(self):
        """Loads and indexes all markdown files in the knowledge base directory."""
        self.docs = {}
        if not os.path.exists(self.knowledge_dir):
            logger.error(f"Knowledge directory does not exist at: {self.knowledge_dir}")
            return

        for fname in os.listdir(self.knowledge_dir):
            if fname.endswith(".md"):
                fpath = os.path.join(self.knowledge_dir, fname)
                doc = SQLTopicDoc(fname, fpath)
                self.docs[fname] = doc

        self.supported_topic_names = sorted([doc.title for doc in self.docs.values()])
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

    def detect_topics(self, query: str) -> List[Tuple[str, float]]:
        """
        Scans query for topic matches against catalog and knowledge base.
        Returns a sorted list of (filename, score) tuples.
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

            # 4. Content overlap boost
            content_lower = doc.raw_content.lower()
            overlap = sum(1 for w in words if len(w) > 3 and w in content_lower)
            score += min(overlap * 2.0, 20.0)

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

    def query(self, user_message: str) -> Tuple[str, Optional[str]]:
        """
        Main query resolution pipeline:
        1. Non-SQL guardrail check.
        2. Multi-topic or single-topic local knowledge match.
        3. General SQL knowledge generator for uncataloged SQL topics.
        4. Helpful topic catalog fallback.
        """
        clean_msg = user_message.strip()
        if not clean_msg:
            return "Please provide a SQL question or topic.", None

        normalized = self._normalize_text(clean_msg)

        # 1. Non-SQL Check
        if not self.is_sql_related(clean_msg):
            logger.info(f"Non-SQL query detected: '{clean_msg}'. Returning domain guardrail.")
            return (
                "I am **SQLSense AI**, your dedicated SQL and database learning assistant. "
                "I can only help with SQL queries, database design, syntax explanations, and relational database interview prep.\n\n"
                "**Try asking me about:**\n"
                "• *\"What is a JOIN and how do I combine two tables?\"*\n"
                "• *\"What is the difference between WHERE and HAVING?\"*\n"
                "• *\"How do Window Functions work (ROW_NUMBER vs RANK)?\"*\n"
                "• *\"Explain Common Table Expressions (CTE)\"*\n"
                "• *\"How to find the second highest salary?\"*",
                None
            )

        # 2. Check General SQL knowledge dictionary first for specific concepts (like self join, case when, composite primary key)
        for general_key, data in GENERAL_SQL_EXPLANATIONS.items():
            if general_key in normalized:
                logger.info(f"Matched general SQL topic '{general_key}'.")
                reply = (
                    f"# {data['title']}\n\n"
                    f"### 💡 Concept Explanation\n{data['explanation']}\n\n"
                    f"### 🔍 Syntax\n```sql\n{data['syntax']}\n```\n\n"
                    f"### 💻 Practical Example\n```sql\n{data['example']}\n```\n\n"
                    f"### 📊 Expected Output\n{data['output']}\n\n"
                    f"### ⚡ Best Practice\n{data['tip']}"
                )
                return reply, None

        # 3. Match against local knowledge base
        matches = self.detect_topics(clean_msg)

        if matches:
            top_file, top_score = matches[0]

            # Check if this is a Multi-Topic query (e.g. "Explain GROUP BY with HAVING and aggregate functions")
            # If 2 or more topics have strong scores (>40) and are distinct
            high_matches = [m for m in matches if m[1] >= 40.0]
            if len(high_matches) >= 2 and any(term in normalized for term in ("and", "with", "vs", "difference")):
                multi_files = [m[0] for m in high_matches[:3]]
                logger.info(f"Multi-topic query matched {len(multi_files)} files: {multi_files}")
                combined_reply = self._build_multi_topic_response(multi_files, clean_msg)
                return combined_reply, ", ".join(multi_files)

            # Single topic match
            doc = self.docs.get(top_file)
            if doc:
                logger.info(f"Single topic matched '{top_file}' with score {top_score:.1f}")
                return doc.get_formatted_response(), top_file

        # 4. Unknown SQL Topic (SQL related, but not in knowledge files)
        logger.info(f"Unknown SQL concept query: '{clean_msg}'. Generating structured response.")
        return self._build_general_sql_fallback(clean_msg), None

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
