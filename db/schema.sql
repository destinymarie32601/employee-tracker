DROP DATABASE IF EXISTS employeetracker_db;
/*drop database if exists*/
CREATE DATABASE employeetracker_db;
/*create database*/
USE employeetracker_db;
/*use database*/
CREATE TABLE department(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    name VARCHAR(30)
);
/*create department table*/

/*create table for the role*/
CREATE TABLE role(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES department (id)
);
/*create employee table*/
CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);