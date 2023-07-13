DROP DATABASE IF EXISTS employee_db;
--drop database if exists--
CREATE DATABASE employee_db;
--create database--
USE employee_db;
--use database--
CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
---create department table--

--create table for the role--
CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) 
    REFERENCES department (id)
);
--create employee table---
CREATE TABLE employee (
    id INT NOT NULL  AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id)
     REFERENCES role(id),
    FOREIGN KEY (manager_id)
     REFERENCES employee (id)
);