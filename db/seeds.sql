USE employee_db;

INSERT INTO department (name) VALUES
('Tech'),
('Engineering'),
('Psychology'),
('Customer Service'),
('Finance');

INSERT INTO role (title, salary, department_id) VALUES
('Front End Developer', 100000, 1),
('Lead Engineer', 80000, 2),
('Clinical Psychologist', 200000, 3),
('Customer Service Representative', 60000, 4),
('Accountant', 80000, 5);

INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES
('Jessica', 'Simpson', 1, 1),
('Jack', 'Rabbit', 1, 2),
('Janessa', 'Sarai', 2, 3),
('Donald', 'Duck', 2, 4),
('Alicia', 'Keys', 3, 5),
('Maureen', 'Love', 4, 6),
('John', 'Stokes', 5, 7),
('Brandon', 'Johnson', 6, 8),

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

