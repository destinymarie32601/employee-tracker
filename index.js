const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table'); //import necessary modules

//create a mysql connection 
const connection = mysql.createConnection({
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
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role' ]
        }
    ])

    .then((answer) => {
        if(answer.action === 'View all departments') {
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
    connection.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        start();
    });
}
//view all roles

function viewAllRoles () {
    connection.query('SELECT * FROM role', function (err,results) {
        console.table(results);
        start();
    });
}
//view all employees
function viewAllEmployees () {
    connection.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id', function (err,results) {
        console.table(results);
        start();
    });
}
//add department
function addDepartment() {
    inquirer.prompt([
        {
            type:'input',
            message:'What is the department name?',
            name: 'department_name',
        }
    ])
    .then((answer) => {
        connection.query('INSERT INTO department(name) VALUES(?)', answer.department_name, function (err,results) {
            console.table(results);
            start();
        })
    })
}




