# SQL Operations Demonstration

A comprehensive SQL script that demonstrates all major SQL operations using Customer and Employee tables.

## 📋 Overview

This project contains a complete SQL script that showcases:

- **DDL Commands** (Data Definition Language)
- **DML Commands** (Data Manipulation Language) 
- **DCL Commands** (Data Control Language)
- **TCL Commands** (Transaction Control Language)
- **JOIN Operations** (All types of joins)
- **SET Operations** (UNION, INTERSECT, MINUS)

## 🗃️ Database Schema

### Customer Table
```sql
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    city VARCHAR(50),
    registration_date DATE,
    age INT
);
```

### Employee Table
```sql
CREATE TABLE Employee (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    dept VARCHAR(50),
    salary DECIMAL(10,2),
    hire_date DATE,
    manager_id INT,
    job_title VARCHAR(50),
    FOREIGN KEY (manager_id) REFERENCES Employee(employee_id)
);
```

### Orders Table
```sql
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);
```

## 🛠️ SQL Commands Demonstrated

### DDL Commands (Data Definition Language)

#### 1. CREATE
- Create tables with primary keys, foreign keys, and constraints
- Create indexes and views

#### 2. ALTER
- Add new columns
- Modify existing columns
- Add constraints
- Drop columns
- Rename columns

#### 3. DROP
- Drop tables completely
- Remove database objects

#### 4. TRUNCATE
- Remove all data from tables while keeping structure

### DML Commands (Data Manipulation Language)

#### 1. SELECT
- Basic SELECT statements
- WHERE clauses
- ORDER BY
- GROUP BY and HAVING
- LIMIT and DISTINCT
- Subqueries

#### 2. INSERT
- Single record insertion
- Multiple record insertion
- Insert with specific columns

#### 3. UPDATE
- Update single records
- Update multiple records
- Update with subqueries

#### 4. DELETE
- Delete specific records
- Delete with conditions
- Delete all records

### DCL Commands (Data Control Language)

#### 1. GRANT
- Grant SELECT privileges
- Grant multiple privileges
- Grant ALL privileges
- Grant privileges on all tables

#### 2. REVOKE
- Revoke specific privileges
- Revoke multiple privileges
- Revoke ALL privileges

### TCL Commands (Transaction Control Language)

#### 1. COMMIT
- Save transaction changes
- Make changes permanent

#### 2. SAVEPOINT
- Create transaction checkpoints
- Multiple savepoints in one transaction

#### 3. ROLLBACK
- Rollback to specific savepoints
- Rollback entire transactions

## 🔗 JOIN Operations

### 1. INNER JOIN
```sql
SELECT c.customer_id, c.first_name, o.order_id, o.total_amount
FROM Customer c
INNER JOIN Orders o ON c.customer_id = o.customer_id;
```

### 2. LEFT JOIN (LEFT OUTER JOIN)
```sql
SELECT c.customer_id, c.first_name, o.order_id, o.total_amount
FROM Customer c
LEFT JOIN Orders o ON c.customer_id = o.customer_id;
```

### 3. RIGHT JOIN (RIGHT OUTER JOIN)
```sql
SELECT c.customer_id, c.first_name, o.order_id, o.total_amount
FROM Customer c
RIGHT JOIN Orders o ON c.customer_id = o.customer_id;
```

### 4. FULL OUTER JOIN
```sql
-- Simulated using UNION of LEFT and RIGHT joins
SELECT c.customer_id, c.first_name, o.order_id, o.total_amount
FROM Customer c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
UNION
SELECT c.customer_id, c.first_name, o.order_id, o.total_amount
FROM Customer c
RIGHT JOIN Orders o ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;
```

### 5. CROSS JOIN
```sql
SELECT c.first_name as customer_name, e.first_name as employee_name
FROM Customer c
CROSS JOIN Employee e;
```

## 🔄 SET Operations

### 1. UNION
```sql
SELECT first_name, last_name FROM Customer
UNION
SELECT first_name, last_name FROM Customer2
ORDER BY first_name;
```

### 2. UNION ALL
```sql
SELECT first_name, last_name FROM Customer
UNION ALL
SELECT first_name, last_name FROM Customer2
ORDER BY first_name;
```

### 3. INTERSECT (Simulated)
```sql
-- Using INNER JOIN
SELECT DISTINCT c1.first_name, c1.last_name
FROM Customer c1
INNER JOIN Customer2 c2 ON c1.first_name = c2.first_name AND c1.last_name = c2.last_name;

-- Using IN clause
SELECT first_name, last_name FROM Customer
WHERE (first_name, last_name) IN (SELECT first_name, last_name FROM Customer2);
```

### 4. MINUS/EXCEPT (Simulated)
```sql
-- Using LEFT JOIN
SELECT c1.first_name, c1.last_name
FROM Customer c1
LEFT JOIN Customer2 c2 ON c1.first_name = c2.first_name AND c1.last_name = c2.last_name
WHERE c2.first_name IS NULL;

-- Using NOT IN
SELECT first_name, last_name FROM Customer
WHERE (first_name, last_name) NOT IN (SELECT first_name, last_name FROM Customer2);
```

## 📊 Sample Data

### Customer Data
- John Doe (New York, Age: 25)
- Jane Smith (Los Angeles, Age: 30)
- Mike Johnson (Chicago, Age: 35)
- Sarah Williams (Houston, Age: 28)
- David Brown (Phoenix, Age: 42)

### Employee Data
- Alice Manager (Management, $75,000)
- Bob Developer (IT, $65,000)
- Carol Analyst (Finance, $60,000)
- Dave Designer (Marketing, $55,000)
- Eve Support (Customer Service, $50,000)

### Orders Data
- Order 1001: John Doe, Bob Developer, $150.00
- Order 1002: Jane Smith, Carol Analyst, $275.50
- Order 1003: Mike Johnson, Dave Designer, $89.99
- Order 1004: Sarah Williams, Eve Support, $320.75
- Order 1005: John Doe, Bob Developer, $195.25

## 🚀 How to Use

1. **Set up your database environment** (MySQL, PostgreSQL, SQL Server, etc.)

2. **Run the SQL script:**
   ```bash
   mysql -u username -p database_name < sql_operations.sql
   ```

3. **Or copy and paste sections** into your SQL client

4. **Execute commands step by step** to see the results

## 📝 Notes

- **MySQL Compatibility**: Script is written for MySQL but can be adapted for other databases
- **FULL OUTER JOIN**: MySQL doesn't support FULL OUTER JOIN directly, so it's simulated using UNION
- **INTERSECT/MINUS**: These are simulated using JOINs and subqueries for MySQL compatibility
- **Transaction Safety**: Always use transactions when modifying data in production

## 🎯 Learning Objectives

This script helps you understand:

1. **Database Design**: Creating tables with proper relationships
2. **Data Manipulation**: CRUD operations and data modification
3. **Data Control**: User privileges and security
4. **Transaction Management**: ACID properties and transaction control
5. **Data Retrieval**: Complex queries and joins
6. **Set Operations**: Combining and comparing datasets

## 🔧 Advanced Features

- **Subqueries**: Nested queries for complex data retrieval
- **Window Functions**: ROW_NUMBER() for ranking
- **CASE Statements**: Conditional logic in queries
- **EXISTS**: Efficient existence checking
- **Constraints**: Primary keys, foreign keys, and check constraints

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [SQL Tutorial](https://www.w3schools.com/sql/)
- [Database Design Best Practices](https://www.guru99.com/database-design.html)
