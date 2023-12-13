INSERT INTO departments (name)
VALUES 
('Sales'),
('Engineering'),
('Legal'),
('Finance'),
('Research and Development');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Sales Lead', 100000.00, 1),
('Salesperson', 80000.00, 1),
('Lead Engineer', 150000.00, 2),
('Software Engineer', 120000.00, 2),
('Legal Team Lead', 120000.00, 3),
('Laywer', 100000.00, 3),
('Account Manager', 100000.00, 4),
('Accountant', 80000.00, 4),
('R&D Team Lead', 120000.00, 5),
('R&D role', 80000.00, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Alec', 'Manko', 1, NULL),
('Bradley', 'Cooper', 2, 1),
('Charles', 'Xavier', 3, NULL),
('Dominick', 'Toretto', 4, 3),
('Erik', 'Thohir', 5, NULL),
('Frank', 'Ocean', 6, 5),
('Gary', 'May', 7, NULL),
('Harry', 'Potter', 8, 7),
('Isiah', 'Thomas', 9, NULL),
('Jack', 'Grealish', 10, 9);

