DROP DATABASE IF EXISTS employee-tracker;
CREATE DATABASE employee-tracker;
USE employee-tracker;

CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255),
salary DECIMAL(10,2),
department_id INT,
FOREIGN KEY (department_id)
REFERENCES departments(id)
ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    INDEX(role_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX(manager_id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
