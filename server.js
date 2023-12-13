const inquirer = require("inquirer");
const mysql = require("mysql2");
const cfonts = require('cfonts');

// create a MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ilovecats",
    database: "employee-tracker",
});

// connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log();
    // start the application
    start();
});

// Function to start the application of CFONT 
cfonts.say('Employee Tracker', {
	font: 'block',              // define the font face
	align: 'left',              // define text alignment
	colors: ['blue'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 0.5,           // define letter spacing
	lineHeight: 1,              // define the line height
	gradient: false,            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment cfonts is being executed in
});

// Function to Start Thomas SQL Employee Tracker Application
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Add Manager",
                "Update Employee Role",
                "View Employees by Manager",
                "View Employees by Department",
                "Delete Departments | Roles | Employees",
                "View total utilized budget of a Department",
                "Quit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Manager":
                    addManager();
                    break;
                case "Update Eployee Role":
                    updateEmployeeRole();
                    break;
                case "View Employees by Manager":
                    viewEmployeesByManager();
                    break;
                case "View Employees by Department":
                    viewEmployeesByDepartment();
                    break;
                case "Delete Departments | Roles | Employees":
                    deleteDepartmentsRolesEmployees();
                    break;
                case "View total utilized budget of a Department":
                    viewTotalUtilizedBudgetOfDepartment();
                    break;
                case "Quit":
                    connection.end();
                    console.log("Goodbye!");
                    break;
            }
        });
}

// function to view all departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;

        // Calculate maximum lengths for each column for alignment
        const maxLengths = {
            id: Math.max(...res.map(r => r.id.toString().length), 'ID'.length),
            name: Math.max(...res.map(r => r.name.length), 'Name'.length)
        };

        // Adding a newline for spacing before the table
        console.log('\n');

        // Printing column headers with padding for alignment
        console.log(
            `${padString('ID', maxLengths.id)}| ${padString('Name', maxLengths.name)}`
        );

        // Printing the line below the column title
        console.log('-'.repeat(maxLengths.id + maxLengths.name + 5)); // Adjusted for the added pipe character

        // Printing each row with padding for alignment
        res.forEach((row) => {
            console.log(
                `${padString(row.id.toString(), maxLengths.id)}| ` +
                `${padString(row.name, maxLengths.name)}`
            );
        });

        // Adding a newline for spacing after the table
        console.log('\n');

        // Restart the application
        start();
    });
}

// Helper function to pad strings for alignment
function padString(str, length, padEnd = true) {
    if (padEnd) {
        return str.padEnd(length);
    } else {
        return str.padStart(length);
    }
}

// function to view all roles
function viewAllRoles() {
    const query = "SELECT roles.title, roles.id, departments.name AS department_name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id";
    connection.query(query, (err, res) => {
        if (err) throw err;

        // Define maximum lengths for each column for alignment
        const maxLengths = {
            id: Math.max(...res.map(r => r.id.toString().length), 'ID'.length),
            title: Math.max(...res.map(r => r.title.length), 'Title'.length),
            department_name: Math.max(...res.map(r => r.department_name.length), 'Department Name'.length),
            salary: 'Salary'.length
        };

        // Adding a newline for spacing before the table
        console.log('\n');

        // Printing column headers with padding for alignment
        console.log(
            `${padString('ID', maxLengths.id, false)}\t` +
            `${padString('Title', maxLengths.title)}\t` +
            `${padString('Department Name', maxLengths.department_name)}\t` +
            `${padString('Salary', maxLengths.salary, false)}`
        );
        console.log('-'.repeat(maxLengths.id + maxLengths.title + maxLengths.department_name + maxLengths.salary + 25)); // 8 for tabs/spaces

        // Printing each row with padding for alignment
        res.forEach(row => {
            console.log(
                `${padString(row.id.toString(), maxLengths.id, false)}\t` +
                `${padString(row.title, maxLengths.title)}\t` +
                `${padString(row.department_name, maxLengths.department_name)}\t` +
                `${padString(row.salary.toString(), maxLengths.salary, false)}`
            );
        });

        // Adding a newline for spacing after the table
        console.log('\n');

        // Restart the application
        start();
    });
}

function viewAllEmployees() {
    const query = `
        SELECT 
            e.id AS ID,
            e.first_name AS First_Name,
            e.last_name AS Last_Name,
            r.title AS Role,
            d.name AS Department,
            m.first_name AS Manager_First_Name,
            m.last_name AS Manager_Last_Name
        FROM employee e
        LEFT JOIN roles r ON e.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `;

    connection.query(query, (err, res) => {
        if (err) throw err;

        // Calculate maximum lengths for each column for alignment
        const maxLengths = {
            ID: Math.max(...res.map(r => r.ID.toString().length), 'ID'.length),
            First_Name: Math.max(...res.map(r => r.First_Name.length), 'First Name'.length),
            Last_Name: Math.max(...res.map(r => r.Last_Name.length), 'Last Name'.length),
            Role: Math.max(...res.map(r => r.Role.length), 'Role'.length),
            Department: Math.max(...res.map(r => r.Department.length), 'Department'.length),
            Manager_First_Name: Math.max(...res.map(r => r.Manager_First_Name ? r.Manager_First_Name.length : 0), 'Manager First Name'.length),
            Manager_Last_Name: Math.max(...res.map(r => r.Manager_Last_Name ? r.Manager_Last_Name.length : 0), 'Manager Last Name'.length),
        };

        // Adding a newline for spacing before the table
        console.log('\n');

        // Printing column headers with padding for alignment
        console.log(
            `${padString('ID', maxLengths.ID)}| ` +
            `${padString('First Name', maxLengths.First_Name)}| ` +
            `${padString('Last Name', maxLengths.Last_Name)}| ` +
            `${padString('Role', maxLengths.Role)}| ` +
            `${padString('Department', maxLengths.Department)}| ` +
            `${padString('Manager First Name', maxLengths.Manager_First_Name)}| ` +
            `${padString('Manager Last Name', maxLengths.Manager_Last_Name)}`
        );

        // Printing the line below the column title
        console.log('-'.repeat(maxLengths.ID + maxLengths.First_Name + maxLengths.Last_Name + maxLengths.Role + maxLengths.Department + maxLengths.Manager_First_Name + maxLengths.Manager_Last_Name + 13));

        // Printing each row with padding for alignment
        res.forEach((row) => {
            console.log(
                `${padString(row.ID.toString(), maxLengths.ID)}| ` +
                `${padString(row.First_Name, maxLengths.First_Name)}| ` +
                `${padString(row.Last_Name, maxLengths.Last_Name)}| ` +
                `${padString(row.Role, maxLengths.Role)}| ` +
                `${padString(row.Department, maxLengths.Department)}| ` +
                `${padString(row.Manager_First_Name || 'NULL', maxLengths.Manager_First_Name)}| ` +
                `${padString(row.Manager_Last_Name || 'NULL', maxLengths.Manager_Last_Name)}`
            );
        });

        // Adding a newline for spacing after the table
        console.log('\n');

        // Restart the application
        start();
    });
}


// function to add a department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Enter the name of the new department:",
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO departments (name) VALUES ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database!`);
                // restart the application
                start();
                console.log(answer.name);
            });
        });
}

function addRole() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the new role:",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Select the department for the new role:",
                    choices: res.map(department => department.name),
                },
            ])
            .then((answers) => {
                const department = res.find(dept => dept.name === answers.department);
                const query = "INSERT INTO roles SET ?";
                connection.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department.id,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`);
                        // restart the application
                        start();
                    }
                );
            });
    });
}


// Function to add an employee
function addEmployee() {
    // Retrieve list of roles from the database
    connection.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        // Retrieve list of employees from the database to use as managers
        connection.query(
            'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const managers = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));

                // Prompt the user for employee information
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "Enter the employee's first name:",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Enter the employee's last name:",
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Select the employee role:",
                            choices: roles,
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Select the employee manager:",
                            choices: [
                                { name: "None", value: null },
                                ...managers,
                            ],
                        },
                    ])
                    .then((answers) => {
                        // Insert the employee into the database
                        const sql =
                            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        const values = [
                            answers.firstName,
                            answers.lastName,
                            answers.roleId,
                            answers.managerId,
                        ];
                        connection.query(sql, values, (error) => {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            console.log("Employee added successfully");
                            start();
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        );
    });
}
// Function to add a Manager
function addManager() {
    const queryDepartments = "SELECT * FROM departments";
    const queryEmployees = "SELECT * FROM employee";

    connection.query(queryDepartments, (err, resDepartments) => {
        if (err) {
            console.error("Error querying departments:", err);
            return start();
        }

        if (!resDepartments || resDepartments.length === 0) {
            console.error("No departments found.");
            return start();
        }

        connection.query(queryEmployees, (err, resEmployees) => {
            if (err) {
                console.error("Error querying employees:", err);
                return start();
            }

            if (!resEmployees || resEmployees.length === 0) {
                console.error("No employees found.");
                return start();
            }

            inquirer.prompt([
                {
                    type: "list",
                    name: "department",
                    message: "Select the department:",
                    choices: resDepartments.map(department => department.name),
                },
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to add a manager to:",
                    choices: resEmployees.map(employee => `${employee.first_name} ${employee.last_name}`),
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Select the employee's manager:",
                    choices: resEmployees.map(employee => `${employee.first_name} ${employee.last_name}`),
                },
            ]).then((answers) => {
                const department = resDepartments.find(department => department.name === answers.department);
                const employee = resEmployees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employee);
                const manager = resEmployees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.manager);

                if (!employee || !manager) {
                    console.log("Invalid employee or manager selected.");
                    return start();
                }

                const query = "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                connection.query(query, [manager.id, employee.id, department.id], (err, res) => {
                    if (err) {
                        console.error("Error updating employee's manager:", err);
                        return start();
                    }
                    console.log(`Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.name}!`);
                    start();
                });
            });
        });
    });
}



// function to update an employee role
function updateEmployeeRole() {
    const queryEmployees =
        "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
    const queryRoles = "SELECT * FROM roles";
    connection.query(queryEmployees, (err, resEmployees) => {
        if (err) throw err;
        connection.query(queryRoles, (err, resRoles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role:",
                        choices: resRoles.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const role = resRoles.find(
                        (role) => role.title === answers.role
                    );
                    const query =
                        "UPDATE employee SET role_id = ? WHERE id = ?";
                    connection.query(
                        query,
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                            );
                            // restart the application
                            start();
                        }
                    );
                });
        });
    });
}

function viewEmployeesByManager() {
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name AS department_name, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM 
        employee e
        INNER JOIN roles r ON e.role_id = r.id
        INNER JOIN departments d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY 
        manager_name, 
        e.last_name, 
        e.first_name
    `;

    connection.query(query, (err, res) => {
        if (err) throw err;

        // Group employees by manager
        const employeesByManager = res.reduce((acc, cur) => {
            const managerName = cur.manager_name || "Manager"; // Replace null with "Manager"
            if (acc[managerName]) {
                acc[managerName].push(cur);
            } else {
                acc[managerName] = [cur];
            }
            return acc;
        }, {});

        // Display employees by manager
        console.log("Employees by manager:");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employees = employeesByManager[managerName];
            employees.forEach((employee) => {
                console.log(
                    `  ${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.department_name}`
                );
            });
        }

        // Restart the application
        start();
    });
}

// Function to view Employees by Department
function viewEmployeesByDepartment() {
    const query =
        "SELECT d.name AS department_name, e.first_name, e.last_name FROM employee e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id ORDER BY d.name ASC";

    connection.query(query, (err, res) => {
        if (err) throw err;

        // Creating an object to hold the data without an index
        const formattedResult = res.reduce((acc, item, index) => {
            acc[`Employee ${index + 1}`] = {
                Department: item.department_name, 
                FirstName: item.first_name, 
                LastName: item.last_name
            };
            return acc;
        }, {});

        console.log("\nEmployees by department:");
        console.table(formattedResult);
        // Restart the application
        start();
    });
}


// Function to DELETE Departments Roles Employees
function deleteDepartmentsRolesEmployees() {
    inquirer
        .prompt({
            type: "list",
            name: "data",
            message: "What would you like to delete?",
            choices: ["Employee", "Role", "Department"],
        })
        .then((answer) => {
            switch (answer.data) {
                case "Employee":
                    deleteEmployee();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Department":
                    deleteDepartment();
                    break;
                default:
                    console.log(`Invalid data: ${answer.data}`);
                    start();
                    break;
            }
        });
}
// Function to DELETE Employees
function deleteEmployee() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" }); // add a "back" option
        inquirer
            .prompt({
                type: "list",
                name: "id",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "back") {
                    // check if user selected "back"
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM employee WHERE id = ?";
                connection.query(query, [answer.id], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted employee with ID ${answer.id} from the database!`
                        
                    );
                    // restart the application
                    start();
                });
            });
    });
}
// Function to DELETE ROLE
function deleteRole() {
    // retrieve all available roles from the database
    const query = "SELECT * FROM roles";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // map through the retrieved roles to create an array of choices
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        // add a "Go Back" option to the list of choices
        choices.push({ name: "Go Back", value: null });
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Select the role you want to delete:",
                choices: choices,
            })
            .then((answer) => {
                // check if the user chose the "Go Back" option
                if (answer.roleId === null) {
                    // go back to the deleteDepartmentsRolesEmployees function
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM roles WHERE id = ?";
                connection.query(query, [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted role with ID ${answer.roleId} from the database!`
                    );
                    start();
                });
            });
    });
}
// Fuction to DELETE Department
function deleteDepartment() {
    // get the list of departments
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        // prompt the user to select a department
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "Which department do you want to delete?",
                choices: [
                    ...departmentChoices,
                    { name: "Go Back", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.departmentId === "back") {
                    // go back to the previous menu
                    deleteDepartmentsRolesEmployees();
                } else {
                    const query = "DELETE FROM departments WHERE id = ?";
                    connection.query(
                        query,
                        [answer.departmentId],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Deleted department with ID ${answer.departmentId} from the database!`
                            );
                            // restart the application
                            start();
                        }
                    );
                }
            });
    });
}
// Function to view Total Utilized Budget of Department
function viewTotalUtilizedBudgetOfDepartment() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        // prompt the user to select a department
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "Which department do you want to calculate the total salary for?",
                choices: departmentChoices,
            })
            .then((answer) => {
                // calculate the total salary for the selected department
                const salaryQuery =
                    `SELECT 
                        d.name AS department,
                        SUM(r.salary) AS total_salary
                     FROM 
                        departments d
                        INNER JOIN roles r ON d.id = r.department_id
                        INNER JOIN employee e ON r.id = e.role_id
                     WHERE 
                        d.id = ?
                     GROUP BY 
                        d.id;`;
                connection.query(salaryQuery, [answer.departmentId], (err, res) => {
                    if (err) throw err;
                    const totalSalary = res[0].total_salary;
                    console.log(`The total salary for employees in this department is $${totalSalary}`);
                    // restart the application
                    start();
                });
            });
    });
}

