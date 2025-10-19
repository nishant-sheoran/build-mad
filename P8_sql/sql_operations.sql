-- =====================================================
-- SQL Operations Demonstration
-- Customer and Employee Tables
-- =====================================================

-- =====================================================
-- DDL COMMANDS (Data Definition Language)
-- =====================================================

-- 1. CREATE - Creating Tables
-- =====================================================

-- Create Customer Table
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    city VARCHAR(50),
    registration_date DATE,
    customer_type VARCHAR(20) DEFAULT 'Regular'
);

-- Create Employee Table
CREATE TABLE Employee (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    hire_date DATE,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES Employee(employee_id)
);

-- Create a sample table for demonstration
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

-- =====================================================
-- 2. ALTER - Modifying Table Structure
-- =====================================================

-- Add a new column to Customer table
ALTER TABLE Customer ADD COLUMN age INT;

-- Modify existing column
ALTER TABLE Customer MODIFY COLUMN phone VARCHAR(20);

-- Add a new column to Employee table
ALTER TABLE Employee ADD COLUMN job_title VARCHAR(50);

-- Add a constraint
ALTER TABLE Customer ADD CONSTRAINT chk_age CHECK (age >= 18 AND age <= 100);

-- Drop a column
ALTER TABLE Customer DROP COLUMN customer_type;

-- Rename a column
ALTER TABLE Employee CHANGE COLUMN department dept VARCHAR(50);

-- =====================================================
-- 3. DROP - Removing Tables
-- =====================================================

-- Drop the Orders table (we'll recreate it later)
DROP TABLE Orders;

-- =====================================================
-- 4. TRUNCATE - Removing All Data from Table
-- =====================================================

-- Create a temporary table for demonstration
CREATE TABLE temp_table (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

-- Insert some data
INSERT INTO temp_table VALUES (1, 'Test1'), (2, 'Test2'), (3, 'Test3');

-- Truncate the table (removes all data but keeps structure)
TRUNCATE TABLE temp_table;

-- Drop the temporary table
DROP TABLE temp_table;

-- =====================================================
-- DML COMMANDS (Data Manipulation Language)
-- =====================================================

-- =====================================================
-- 1. INSERT - Adding Data
-- =====================================================

-- Insert data into Customer table
INSERT INTO Customer (customer_id, first_name, last_name, email, phone, city, registration_date, age) VALUES
(1, 'John', 'Doe', 'john.doe@email.com', '555-0101', 'New York', '2023-01-15', 25),
(2, 'Jane', 'Smith', 'jane.smith@email.com', '555-0102', 'Los Angeles', '2023-02-20', 30),
(3, 'Mike', 'Johnson', 'mike.johnson@email.com', '555-0103', 'Chicago', '2023-03-10', 35),
(4, 'Sarah', 'Williams', 'sarah.williams@email.com', '555-0104', 'Houston', '2023-04-05', 28),
(5, 'David', 'Brown', 'david.brown@email.com', '555-0105', 'Phoenix', '2023-05-12', 42);

-- Insert data into Employee table
INSERT INTO Employee (employee_id, first_name, last_name, email, phone, dept, salary, hire_date, manager_id, job_title) VALUES
(101, 'Alice', 'Manager', 'alice.manager@company.com', '555-1001', 'Management', 75000.00, '2022-01-15', NULL, 'Department Manager'),
(102, 'Bob', 'Developer', 'bob.developer@company.com', '555-1002', 'IT', 65000.00, '2022-03-20', 101, 'Software Developer'),
(103, 'Carol', 'Analyst', 'carol.analyst@company.com', '555-1003', 'Finance', 60000.00, '2022-05-10', 101, 'Financial Analyst'),
(104, 'Dave', 'Designer', 'dave.designer@company.com', '555-1004', 'Marketing', 55000.00, '2022-07-15', 101, 'Graphic Designer'),
(105, 'Eve', 'Support', 'eve.support@company.com', '555-1005', 'Customer Service', 50000.00, '2022-09-01', 101, 'Support Specialist');

-- =====================================================
-- 2. SELECT - Retrieving Data
-- =====================================================

-- Basic SELECT
SELECT * FROM Customer;

-- SELECT with specific columns
SELECT customer_id, first_name, last_name, email FROM Customer;

-- SELECT with WHERE clause
SELECT * FROM Customer WHERE age > 30;

-- SELECT with ORDER BY
SELECT * FROM Employee ORDER BY salary DESC;

-- SELECT with GROUP BY
SELECT dept, COUNT(*) as employee_count, AVG(salary) as avg_salary 
FROM Employee 
GROUP BY dept;

-- SELECT with HAVING
SELECT dept, COUNT(*) as employee_count 
FROM Employee 
GROUP BY dept 
HAVING COUNT(*) > 1;

-- SELECT with LIMIT
SELECT * FROM Customer LIMIT 3;

-- SELECT with DISTINCT
SELECT DISTINCT city FROM Customer;

-- =====================================================
-- 3. UPDATE - Modifying Data
-- =====================================================

-- Update single record
UPDATE Customer SET age = 26 WHERE customer_id = 1;

-- Update multiple records
UPDATE Employee SET salary = salary * 1.1 WHERE dept = 'IT';

-- Update with subquery
UPDATE Customer SET city = 'San Francisco' 
WHERE customer_id IN (SELECT customer_id FROM Customer WHERE age > 35);

-- =====================================================
-- 4. DELETE - Removing Data
-- =====================================================

-- Delete specific record
DELETE FROM Customer WHERE customer_id = 5;

-- Delete with condition
DELETE FROM Employee WHERE salary < 55000;

-- Delete all records (be careful!)
-- DELETE FROM Customer; -- This would delete all customers

-- =====================================================
-- DCL COMMANDS (Data Control Language)
-- =====================================================

-- =====================================================
-- 1. GRANT - Giving Privileges
-- =====================================================

-- Grant SELECT privilege on Customer table to a user
GRANT SELECT ON Customer TO 'user1'@'localhost';

-- Grant multiple privileges
GRANT SELECT, INSERT, UPDATE ON Employee TO 'user2'@'localhost';

-- Grant all privileges
GRANT ALL PRIVILEGES ON Customer TO 'admin'@'localhost';

-- Grant privileges on all tables in database
GRANT SELECT ON *.* TO 'readonly_user'@'localhost';

-- =====================================================
-- 2. REVOKE - Removing Privileges
-- =====================================================

-- Revoke SELECT privilege
REVOKE SELECT ON Customer FROM 'user1'@'localhost';

-- Revoke multiple privileges
REVOKE INSERT, UPDATE ON Employee FROM 'user2'@'localhost';

-- Revoke all privileges
REVOKE ALL PRIVILEGES ON Customer FROM 'admin'@'localhost';

-- =====================================================
-- TCL COMMANDS (Transaction Control Language)
-- =====================================================

-- =====================================================
-- 1. COMMIT - Saving Changes
-- =====================================================

-- Start a transaction
START TRANSACTION;

-- Make some changes
INSERT INTO Customer (customer_id, first_name, last_name, email, phone, city, registration_date, age) 
VALUES (6, 'Tom', 'Wilson', 'tom.wilson@email.com', '555-0106', 'Seattle', '2023-06-01', 33);

UPDATE Employee SET salary = salary + 1000 WHERE employee_id = 102;

-- Commit the transaction
COMMIT;

-- =====================================================
-- 2. SAVEPOINT - Creating Checkpoints
-- =====================================================

-- Start a transaction
START TRANSACTION;

-- Make some changes
INSERT INTO Customer (customer_id, first_name, last_name, email, phone, city, registration_date, age) 
VALUES (7, 'Lisa', 'Garcia', 'lisa.garcia@email.com', '555-0107', 'Miami', '2023-07-01', 29);

-- Create a savepoint
SAVEPOINT sp1;

-- Make more changes
UPDATE Customer SET age = age + 1 WHERE customer_id = 7;
INSERT INTO Customer (customer_id, first_name, last_name, email, phone, city, registration_date, age) 
VALUES (8, 'Mark', 'Davis', 'mark.davis@email.com', '555-0108', 'Denver', '2023-08-01', 31);

-- Create another savepoint
SAVEPOINT sp2;

-- =====================================================
-- 3. ROLLBACK - Undoing Changes
-- =====================================================

-- Rollback to a specific savepoint
ROLLBACK TO sp1;

-- Rollback entire transaction
ROLLBACK;

-- =====================================================
-- JOINS - Combining Data from Multiple Tables
-- =====================================================

-- Recreate Orders table for join examples
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

-- Insert sample orders
INSERT INTO Orders VALUES
(1001, 1, 102, '2023-01-20', 150.00),
(1002, 2, 103, '2023-02-25', 275.50),
(1003, 3, 104, '2023-03-15', 89.99),
(1004, 4, 105, '2023-04-10', 320.75),
(1005, 1, 102, '2023-05-05', 195.25);

-- =====================================================
-- 1. INNER JOIN
-- =====================================================

-- Inner join between Customer and Orders
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.total_amount
FROM Customer c
INNER JOIN Orders o ON c.customer_id = o.customer_id;

-- Inner join between all three tables
SELECT c.first_name, c.last_name, e.first_name as emp_first, e.last_name as emp_last, o.order_date, o.total_amount
FROM Customer c
INNER JOIN Orders o ON c.customer_id = o.customer_id
INNER JOIN Employee e ON o.employee_id = e.employee_id;

-- =====================================================
-- 2. LEFT JOIN (LEFT OUTER JOIN)
-- =====================================================

-- Left join to show all customers and their orders (if any)
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.total_amount
FROM Customer c
LEFT JOIN Orders o ON c.customer_id = o.customer_id;

-- Left join to show all employees and their orders (if any)
SELECT e.employee_id, e.first_name, e.last_name, o.order_id, o.total_amount
FROM Employee e
LEFT JOIN Orders o ON e.employee_id = o.employee_id;

-- =====================================================
-- 3. RIGHT JOIN (RIGHT OUTER JOIN)
-- =====================================================

-- Right join to show all orders and their customers
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.total_amount
FROM Customer c
RIGHT JOIN Orders o ON c.customer_id = o.customer_id;

-- Right join to show all orders and their employees
SELECT e.employee_id, e.first_name, e.last_name, o.order_id, o.total_amount
FROM Employee e
RIGHT JOIN Orders o ON e.employee_id = o.employee_id;

-- =====================================================
-- 4. FULL OUTER JOIN
-- =====================================================

-- Full outer join (Note: MySQL doesn't support FULL OUTER JOIN directly)
-- We can simulate it using UNION of LEFT and RIGHT joins
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.total_amount
FROM Customer c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
UNION
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.total_amount
FROM Customer c
RIGHT JOIN Orders o ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;

-- =====================================================
-- 5. CROSS JOIN (Cartesian Product)
-- =====================================================

-- Cross join between Customer and Employee (shows all combinations)
SELECT c.first_name as customer_name, e.first_name as employee_name
FROM Customer c
CROSS JOIN Employee e
LIMIT 10; -- Limit to avoid too many results

-- =====================================================
-- SET OPERATIONS
-- =====================================================

-- Create a second customer table for set operations
CREATE TABLE Customer2 (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    city VARCHAR(50),
    registration_date DATE,
    age INT
);

-- Insert some overlapping and new data
INSERT INTO Customer2 VALUES
(1, 'John', 'Doe', 'john.doe@email.com', '555-0101', 'New York', '2023-01-15', 25),
(2, 'Jane', 'Smith', 'jane.smith@email.com', '555-0102', 'Los Angeles', '2023-02-20', 30),
(6, 'Tom', 'Wilson', 'tom.wilson@email.com', '555-0106', 'Seattle', '2023-06-01', 33),
(9, 'Anna', 'Taylor', 'anna.taylor@email.com', '555-0109', 'Boston', '2023-09-01', 27),
(10, 'Chris', 'Anderson', 'chris.anderson@email.com', '555-0110', 'Portland', '2023-10-01', 34);

-- =====================================================
-- 1. UNION - Combines results, removes duplicates
-- =====================================================

-- Union of customer names from both tables
SELECT first_name, last_name FROM Customer
UNION
SELECT first_name, last_name FROM Customer2
ORDER BY first_name;

-- =====================================================
-- 2. UNION ALL - Combines results, keeps duplicates
-- =====================================================

-- Union all of customer names from both tables
SELECT first_name, last_name FROM Customer
UNION ALL
SELECT first_name, last_name FROM Customer2
ORDER BY first_name;

-- =====================================================
-- 3. INTERSECT - Shows common records (MySQL doesn't support INTERSECT directly)
-- =====================================================

-- Simulate INTERSECT using INNER JOIN
SELECT DISTINCT c1.first_name, c1.last_name
FROM Customer c1
INNER JOIN Customer2 c2 ON c1.first_name = c2.first_name AND c1.last_name = c2.last_name;

-- Alternative way to simulate INTERSECT
SELECT first_name, last_name FROM Customer
WHERE (first_name, last_name) IN (SELECT first_name, last_name FROM Customer2);

-- =====================================================
-- 4. MINUS/EXCEPT - Shows records in first table but not in second
-- =====================================================

-- Simulate MINUS using LEFT JOIN
SELECT c1.first_name, c1.last_name
FROM Customer c1
LEFT JOIN Customer2 c2 ON c1.first_name = c2.first_name AND c1.last_name = c2.last_name
WHERE c2.first_name IS NULL;

-- Alternative way to simulate MINUS
SELECT first_name, last_name FROM Customer
WHERE (first_name, last_name) NOT IN (SELECT first_name, last_name FROM Customer2);

-- =====================================================
-- ADVANCED QUERIES
-- =====================================================

-- Subquery example
SELECT first_name, last_name, salary
FROM Employee
WHERE salary > (SELECT AVG(salary) FROM Employee);

-- EXISTS example
SELECT first_name, last_name
FROM Customer
WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.customer_id = Customer.customer_id);

-- CASE statement example
SELECT first_name, last_name, age,
    CASE 
        WHEN age < 25 THEN 'Young'
        WHEN age BETWEEN 25 AND 35 THEN 'Adult'
        WHEN age > 35 THEN 'Senior'
        ELSE 'Unknown'
    END as age_group
FROM Customer;

-- Window function example (if supported)
SELECT first_name, last_name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as salary_rank
FROM Employee;

-- =====================================================
-- CLEANUP
-- =====================================================

-- Drop the additional table
DROP TABLE Customer2;

-- =====================================================
-- END OF SQL OPERATIONS DEMONSTRATION
-- =====================================================
