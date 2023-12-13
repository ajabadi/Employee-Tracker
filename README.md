# SQL Challenge:Employee-Tracker

This week's assignment involves creating a command-line application to manage a company's employee database. This application is a Content Management System (CMS) built using Node.js, Inquirer, and MySQL. It allows business owners to view and manage the departments, roles, and employees in their company for better organization and planning.

## User Story 

As A business owner, I want to be able to view and manage the departments, roles, and employees in my company. So that I can organize and plan my business

Usage: 

- View all departments, roles, and employees.
- Add a department, role, or employee.
- Update an employee role.

## Database

1. department: 'id' (INT PRIMARY KEY), 'name' (VARCHAR(30)).
2. role: 'id' (INT PRIMARY KEY), 'title' (VARCHAR(30)), 'salary' (DECIMAL), 'department_id' (INT).
3. employee: 'id' (INT PRIMARY KEY), 'first_name' (VARCHAR(30)), 'last_name' (VARCHAR(30)), 'role_id' (INT), 'manager_id' (INT).

## Features

- View formatted tables of departments, roles, and employees.
- Add new departments, roles, and employees to the database.
- Update the role of existing employees.


### Additional Information 

A [walkthrough video](https://watch.screencastify.com/v/45XWU93qagWxYap5I2x1) to demostrate the functionality of the application will be provided, showcasing the user flow and response handling.

### Sample Employee Tracker 
<img width="1008" alt="Screen Shot 2023-12-12 at 21 29 06" src="https://github.com/ajabadi/Employee-Tracker/assets/145517793/7fc72875-3a15-4230-b08f-6e3673cad842">
