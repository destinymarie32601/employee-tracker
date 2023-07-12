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

function start() {
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

    
}

