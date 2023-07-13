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
           } else if (answer.action === 'View all roles' ) {
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
                name: 'department_id',
                choices: departmentName
            }
        ])
            .then((answers) => {
                connection.query('INSERT INTO role SET ?',
                    {
                        title: answers.role_name,
                        salary: answers.role_salary,
                        department_id: answers.department_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Role added');
                        viewAllRoles();
                    }
                );
             
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


