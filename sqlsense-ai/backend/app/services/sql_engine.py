import os
import re
import logging
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger("sqlsense-ai")

# Pre-defined intent keywords and synonym mapping for intelligent SQL topic detection
TOPIC_KEYWORDS: Dict[str, Dict[str, any]] = {
    "joins.md": {
        "title": "Joins",
        "phrases": [
            "inner join", "left join", "right join", "full join", "full outer join",
            "cross join", "self join", "join", "joins", "joining tables",
            "combine tables", "combine two tables", "merge tables", "relate tables",
            "connecting tables", "match rows between tables"
        ],
        "keywords": ["join", "joins", "on", "inner", "left", "right", "cross", "cartesian"]
    },
    "windowfunctions.md": {
        "title": "Window Functions",
        "phrases": [
            "window function", "window functions", "over clause", "partition by",
            "row_number", "rank", "dense_rank", "lead", "lag", "running total",
            "moving average", "ranking employees", "rank employees", "ranking rows",
            "cumulative sum", "analytic functions"
        ],
        "keywords": ["window", "over", "partition", "row_number", "dense_rank", "lead", "lag", "ranking"]
    },
    "cte.md": {
        "title": "Common Table Expressions (CTE)",
        "phrases": [
            "cte", "common table expression", "common table expressions",
            "with clause", "with as", "recursive cte", "temporary result set",
            "readable subquery", "named temporary query"
        ],
        "keywords": ["cte", "with", "recursive"]
    },
    "subqueries.md": {
        "title": "Subqueries",
        "phrases": [
            "subquery", "subqueries", "nested query", "nested queries",
            "inner query", "correlated subquery", "scalar subquery",
            "query inside query", "sub-query"
        ],
        "keywords": ["subquery", "subqueries", "nested", "correlated", "exists"]
    },
    "groupby.md": {
        "title": "Group By",
        "phrases": [
            "group by", "grouping", "group rows", "group data",
            "totals for each department", "calculate totals for each",
            "count by department", "group by department", "summary by category"
        ],
        "keywords": ["group", "groupby", "grouping"]
    },
    "having.md": {
        "title": "Having Clause",
        "phrases": [
            "having", "having clause", "filter aggregate", "filter aggregated",
            "filter groups", "where vs having", "difference between where and having"
        ],
        "keywords": ["having"]
    },
    "aggregate.md": {
        "title": "Aggregate Functions",
        "phrases": [
            "aggregate function", "aggregate functions", "count", "sum", "avg",
            "min", "max", "calculate average", "calculate total", "summarize data",
            "average salary", "total sum"
        ],
        "keywords": ["aggregate", "count", "sum", "avg", "min", "max"]
    },
    "orderby.md": {
        "title": "Order By",
        "phrases": [
            "order by", "sorting", "sort rows", "sort columns", "sort data",
            "ascending", "descending", "asc", "desc", "alphabetical order"
        ],
        "keywords": ["order", "orderby", "sort", "sorting", "asc", "desc"]
    },
    "select.md": {
        "title": "SELECT Statement",
        "phrases": [
            "select", "select statement", "retrieve data", "fetch rows",
            "query data", "query columns", "projection", "read data", "select all"
        ],
        "keywords": ["select", "projection", "retrieve"]
    },
    "where.md": {
        "title": "WHERE Clause",
        "phrases": [
            "where", "where clause", "filtering rows", "filter data",
            "filter records", "conditional filtering", "predicate",
            "comparison operators"
        ],
        "keywords": ["where", "filter", "filtering", "condition"]
    },
    "primarykey.md": {
        "title": "Primary Key",
        "phrases": [
            "primary key", "primary keys", "pk", "composite primary key",
            "composite key", "unique identifier", "auto increment", "identity key"
        ],
        "keywords": ["primary", "primarykey", "pk"]
    },
    "foreignkey.md": {
        "title": "Foreign Key",
        "phrases": [
            "foreign key", "foreign keys", "fk", "referential integrity",
            "parent table", "child table", "cascade delete", "references"
        ],
        "keywords": ["foreign", "foreignkey", "fk", "referential"]
    },
    "constraints.md": {
        "title": "Constraints",
        "phrases": [
            "constraint", "constraints", "not null", "unique constraint",
            "check constraint", "default constraint", "table constraint"
        ],
        "keywords": ["constraint", "constraints", "null", "unique", "check", "default"]
    },
    "normalization.md": {
        "title": "Normalization",
        "phrases": [
            "normalization", "normal forms", "normal form", "1nf", "2nf", "3nf",
            "bcnf", "denormalization", "data redundancy", "update anomaly",
            "insertion anomaly", "deletion anomaly", "database design"
        ],
        "keywords": ["normalization", "normalize", "1nf", "2nf", "3nf", "bcnf", "redundancy"]
    },
    "indexes.md": {
        "title": "Indexes",
        "phrases": [
            "index", "indexes", "indexing", "b-tree index", "clustered index",
            "non clustered index", "non-clustered index", "speed up query",
            "query optimization", "index performance"
        ],
        "keywords": ["index", "indexes", "indexing", "clustered", "btree"]
    },
    "transactions.md": {
        "title": "Transactions & ACID",
        "phrases": [
            "transaction", "transactions", "acid", "acid properties",
            "commit", "rollback", "savepoint", "atomicity", "consistency",
            "isolation", "durability", "tcl"
        ],
        "keywords": ["transaction", "transactions", "acid", "commit", "rollback", "savepoint"]
    },
    "triggers.md": {
        "title": "Triggers",
        "phrases": [
            "trigger", "triggers", "before insert", "after insert",
            "before update", "after update", "before delete", "after delete",
            "automated database action", "event listener"
        ],
        "keywords": ["trigger", "triggers"]
    },
    "storedprocedures.md": {
        "title": "Stored Procedures",
        "phrases": [
            "stored procedure", "stored procedures", "sproc", "stored proc",
            "procedure", "procedures", "call procedure", "routine",
            "parameterized procedure"
        ],
        "keywords": ["procedure", "procedures", "sproc"]
    },
    "views.md": {
        "title": "Views",
        "phrases": [
            "view", "views", "virtual table", "materialized view",
            "create view", "drop view"
        ],
        "keywords": ["view", "views"]
    },
    "create_table.md": {
        "title": "CREATE TABLE",
        "phrases": [
            "create table", "creating table", "define table", "table definition",
            "ddl", "data definition", "data types"
        ],
        "keywords": ["create", "table", "datatype", "varchar", "integer"]
    },
    "insert.md": {
        "title": "INSERT",
        "phrases": [
            "insert", "insert into", "add row", "add records", "inserting rows",
            "new record", "dml"
        ],
        "keywords": ["insert", "values"]
    },
    "update.md": {
        "title": "UPDATE",
        "phrases": [
            "update", "update table", "modify row", "change value", "set column",
            "updating records"
        ],
        "keywords": ["update", "set"]
    },
    "delete.md": {
        "title": "DELETE",
        "phrases": [
            "delete", "delete from", "remove rows", "deleting records",
            "delete row"
        ],
        "keywords": ["delete"]
    },
    "truncate.md": {
        "title": "TRUNCATE",
        "phrases": [
            "truncate", "truncate table", "empty table",
            "delete vs truncate", "difference between truncate and delete"
        ],
        "keywords": ["truncate"]
    },
    "drop.md": {
        "title": "DROP",
        "phrases": [
            "drop table", "drop database", "drop view", "remove table permanently",
            "delete table permanently"
        ],
        "keywords": ["drop"]
    },
    "tables.md": {
        "title": "Table Operations & ALTER TABLE",
        "phrases": [
            "alter table", "add column", "modify column", "drop column",
            "rename table", "rename column", "table operations"
        ],
        "keywords": ["alter", "modify", "rename", "add column"]
    },
    "database.md": {
        "title": "Database Fundamentals",
        "phrases": [
            "create database", "drop database", "use database",
            "database basics", "rdbms", "relational database management system",
            "database schema"
        ],
        "keywords": ["database", "rdbms", "schema"]
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
            elif self.filename in TOPIC_KEYWORDS:
                self.title = TOPIC_KEYWORDS[self.filename]["title"]

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

    def get_formatted_response(self, user_query: str) -> str:
        """
        Formats the knowledge base content cleanly into the expected SQLSense AI markdown template.
        """
        return (
            f"{self.raw_content}\n\n"
            f"### 📄 Sources\n"
            f"- `{self.filename}`"
        )


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

    def detect_topic(self, query: str) -> Optional[Tuple[str, float]]:
        """
        Determines the most relevant SQL knowledge file for a user question
        using exact phrase detection, keyword scoring, and intent heuristics.
        """
        normalized_query = self._normalize_text(query)
        words = set(normalized_query.split())
        
        best_filename = None
        best_score = 0.0

        for filename, doc in self.docs.items():
            score = 0.0
            info = TOPIC_KEYWORDS.get(filename, {})
            phrases = info.get("phrases", [])
            keywords = info.get("keywords", [])
            title_lower = doc.title.lower()

            # 1. Exact match with topic title or filename base
            base_name = filename.replace(".md", "").replace("_", " ")
            if base_name in normalized_query:
                score += 50.0

            # 2. Key phrase matching
            for phrase in phrases:
                if phrase in normalized_query:
                    # Longer phrase matches get higher weight
                    score += 40.0 + len(phrase.split()) * 10.0

            # 3. Keyword matching
            for kw in keywords:
                if kw in words:
                    score += 15.0

            # 4. Token overlap with raw document content (capped)
            content_lower = doc.raw_content.lower()
            overlap_count = sum(1 for w in words if len(w) > 3 and w in content_lower)
            score += min(overlap_count * 2.0, 20.0)

            # 5. Intent-specific boost
            # e.g., "combine tables" specifically targets joins
            if "combine" in normalized_query and "table" in normalized_query and filename == "joins.md":
                score += 60.0
            if "totals for each" in normalized_query and filename in ("groupby.md", "aggregate.md"):
                score += 60.0
            if "rank" in normalized_query and "employee" in normalized_query and filename == "windowfunctions.md":
                score += 60.0
            if ("difference between" in normalized_query or "vs" in normalized_query):
                if "truncate" in normalized_query and "delete" in normalized_query:
                    if filename == "truncate.md":
                        score += 70.0
                if "where" in normalized_query and "having" in normalized_query:
                    if filename == "having.md":
                        score += 70.0
                if "primary" in normalized_query and "foreign" in normalized_query:
                    if filename == "primarykey.md":
                        score += 70.0

            if score > best_score:
                best_score = score
                best_filename = filename

        # Threshold check: requires a minimum confidence score
        if best_score >= 20.0 and best_filename:
            return best_filename, best_score

        return None

    def query(self, user_message: str) -> Tuple[str, Optional[str]]:
        """
        Main query handler. Resolves user message against local knowledge base
        and returns (reply_text, source_filename).
        """
        clean_msg = user_message.strip()
        if not clean_msg:
            return "Please provide a SQL question or topic.", None

        detection = self.detect_topic(clean_msg)
        if detection:
            matched_file, score = detection
            doc = self.docs.get(matched_file)
            if doc:
                logger.info(f"Query matched '{matched_file}' with score {score:.1f}")
                return doc.get_formatted_response(clean_msg), matched_file

        logger.info(f"No specific SQL topic matched query: '{clean_msg}'. Returning helpful fallback.")
        return self._build_fallback_response(), None

    def _build_fallback_response(self) -> str:
        """
        Generates a friendly fallback response displaying supported topics and sample questions.
        """
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


# Global instance
_engine_instance: Optional[SQLKnowledgeEngine] = None

def get_sql_engine(knowledge_dir: Optional[str] = None) -> SQLKnowledgeEngine:
    global _engine_instance
    if _engine_instance is None:
        from app.config import settings
        k_dir = knowledge_dir or settings.knowledge_dir
        _engine_instance = SQLKnowledgeEngine(k_dir)
    return _engine_instance
