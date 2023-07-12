DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);