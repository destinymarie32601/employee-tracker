const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table'); //import necessary modules

//create a mysql connection 
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '861#01Dd',
        database: 'employeetracker_db'
    });

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
    start();
});



function start() { //prompt for user
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add an employee',
                    'Add a role',
                    'Update an employee role'
                ],
            },
        ])

        .then((answer) => {
            if (answer.action === 'View all departments') {
                viewAllDepartments()
            } else if (answer.action === 'View all roles') {
                viewAllRoles()
            } else if (answer.action === 'View all employees') {
                viewAllEmployees()
            } else if (answer.action === 'Add a department') {
                addDepartment()
            } else if (answer.action === 'Add a role') {
                addRole()
            } else if (answer.action === 'Add an employee') {
                addEmployee()
            } else if (answer.action === 'Update an employee role') {
                updateEmployee()
            } else {
                console.log('Done');
                connection.end();
            }

        });
}
//show all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        console.table(departments);
        start();
    });
}
//view all roles

function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
        console.table(roles);
        start();
    });
}
//view all employees
function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
     From employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
    connection.query(query, (err, employees) => {
        if (err) throw err;
        console.table(employees);
        start();
    });
}
//add department
function addDepartment() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the department name?',
            validate: (input) => {
                if (input.trim() === '') {
                    return 'Enter the department name';
                }
                return true;
            },
        },
    ])
        .then((answers) => {
            connection.query('INSERT INTO department(name) VALUES(?)',
                [answers.name],
                (err) => {
                    if (err) throw err;
                    console.log('Department added successfully');
                    start();
                }
            );
        });
}
//add a new role
function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        const departmentChoice = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What role would you like to add?',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a role title';
                    }
                    return true;
                },
            },
            {
                name: 'salary',
                type: 'number',
                message: 'What is the salary of the role?',
                validate: (input) => {
                    if (isNaN(input) || input <= 0) {
                        return 'Please enter valid salary';
                    }
                    return true;
                },
            },
            {
                name: 'departmentId',
                type: 'list',
                message: 'What department does the role belong to?',
                choices: departmentChoice,
            },
        ])
            .then((answers) => {
                connection.query('INSERT INTO role (title,salary, department_id) VALUES (?, ?, ?)',
                    [answers.title, answers.salary, answers.departmentId],
                    (err) => {
                        if (err) throw err;
                        console.log('Role added');
                        start();
                    }
                );

            });
    });
};
//add new employee
function addEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
        const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the empoyees first name?',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Enter employees first name';
                    }
                    return true;
                },
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the empoyees last name?',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Enter employees last name';
                    }
                    return true;
                },
            },
            {
                name: 'roleId',
                type: 'list',
                message: 'Select employees role:',
                choices: roleChoices,
            },
            {
                name: 'managerId',
                type: 'input',
                message: 'Enter the manager ID (optional)',
                validate: (input) => {
                    if (input.trim() === '') {
                        return true;
                    }
                    if (isNaN(input)) {
                        return 'Please enter valid manager ID';
                    }
                    return true;
                },
            },

        ])
            .then((answers) => {
                const employee = {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.roleId,
                    manager_id: answers.managerId ? answers.managerId : null,
                };
                connection.query('INSERT INTO employee SET ?',
                    employee,
                    (err) => {
                        if (err) throw err;
                        console.log('New employee added successfully');
                        start();

                    }
                );

            });
    });
}
//update employee
function updateEmployee() {
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;
            const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
            }));

            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'What is the name of the employee?',
                    choices: employeeChoices,
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'What is the updated role?',
                    choices: roleChoices,
                },
            ])
                .then((answers) => {
                    connection.query('UPDATE employee SET role_id = ? WHERE id = ?',
                        [answers.roleId, answers.employeeId],
                        (err) => {
                            if (err) throw err;
                            console.log('Employee role updated');
                            start();
                        }
                    );
                });
        });
    });
}
