const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table'); //import necessary modules

//create a mysql connection 
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '861#01Dd',
        database: 'employee_db'
    },
    console.log(`You are connected to the company database.`)
);

start();

function start() { //prompt for user
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'menu',
                choices: [
                    'View all Departments',
                    'View all Roles',
                    'View all Employees',
                    'Add a Department',
                    'Add an Employee',
                    'Add a Role',
                    'Update an Employee Role']
            }
        ])

        .then((answers) => {
            console.log(answers.menu);
            switch (answers.menu) {
                case 'View all Departments':
                    viewAllDepartments();
                    break;

                case 'View all Roles':
                    viewAllRoles();
                    break;

                case 'View all Employees':
                    viewAllEmployees();
                    break;

                case 'Add a Department':
                    addDepartment();
                    break;

                case 'Add an Employee':
                    addEmployee();
                    break;

                case 'Add a Role':
                    addRole();
                    break;

                case 'Update an Employee Role':
                    updateEmployee();
                    break;
            }

        })
        .catch((err) => {
            console.log(err);
        });
}
//show all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        start();
    });
}
//view all roles

function viewAllRoles() {
    connection.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        start();
    });
}
//view all employees
function viewAllEmployees() {
    connection.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
        console.table(results);
        start();
    });
}
//add department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department name?',
            name: 'department_name',
        }
    ])
        .then((answers) => {
            connection.query('INSERT INTO department(name) VALUES(?)', answers.department_name, function (err, results) {
                console.table(results);
                start();
            })
        })
}
//add a new role
function addRole() {
    connection.query('SELECT * FROM department', (err, results) => {
        let departmentName = results.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });

        inquirer.prompt([
            {
                type: 'input',
                message: 'What role would you like to add?',
                name: 'role_name',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'role_salary',
            },
            {
                type: 'list',
                message: 'What department does the role belong to?',
                name: 'department_name',
                choices: departmentName
            }
        ])
            .then((answers) => {
                connection.query('INSERT INTO role SET ?',
                    {
                        title: answers.role_name,
                        salary: answers.role_salary,
                        department_id: answers.department_name
                    },
                    function (err) {
                        if (err) throw err;
                    }
                );
                viewAllRoles()
            });
    });
};
//add new employee
function addEmployee() {
    connection.query('SELECT * FROM role', (err, results) => {
        let roleName = results.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });

        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the empoyees first name?',
                name: 'first_name',
            },
            {
                type: 'input',
                message: 'What is the empoyees last name?',
                name: 'last_name',
            },
            {
                type: 'input',
                message: 'What is the empoyees manager id?',
                name: 'manager_id',
            },
            {
                type: 'list',
                message: 'What is the employees role?',
                name: 'role',
                choices: roleName
            }

        ])
            .then((answers) => {
                connection.query('INSERT INTO employee SET ?',
                    {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: answers.role,
                        manager_id: answers.manager_id
                    },
                    function (err) {
                        if (err) throw err;
                    }
                );
                viewAllEmployees()
            });
    });
};
//update employee
function updateEmployee() {
    connection.query('SELECT * FROM employee', (err, results) => {
        let employeeName = results.map((employee) => {
            return {
                name: employee.first_name,
                value: employee.id,
            };
        });

        connection.query('SELECT * FROM role', (err, results) => {
            let roleName = results.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                };
            });

            inquirer.prompt([
                {
                    type: 'list',
                    message: 'What is the name of the employee?',
                    name: 'name',
                    choices: employeeName
                },
                {
                    type: 'list',
                    message: 'What is the updated role?',
                    name: 'newRole',
                    choices: roleName
                }
            ])
                .then((answers) => {
                    connection.query('UPDATE employee SET ? WHERE ?',
                        [
                            {
                                role_id: answers.newRole
                            },
                            {
                                id: answers.name
                            },
                        ],
                        function (err) {
                            if (err) throw err;
                        }

                    );
                    viewAllEmployees()
                });
        });
    });
};


