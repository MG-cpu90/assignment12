// Variables
const mysql = require("mysql");
const inquirer = require("inquirer");

// init function = init();
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",

    // Your Database name
    database: "employeeDB"
});

// Start server
connection.connect(function(err) {
    console.log(connection.config.database);
    if (err) throw err;
    runCLI();
});
// Run command line interface 
function runCLI() {
    inquirer
    // Prompt the user asking them what they want to do
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add departments, roles, or employees",
                "View dapartments, roles, or employees",
                "Update employee roles",
                "Exit"
            ]
        })
        // Depending on their answer, initiate a particular function
        .then(function(answer) {
            switch (answer.action) {
                case "Add departments, roles, or employees":
                    add();
                    break;

                case "View dapartments, roles, or employees":
                    view();
                    break;

                case "Update employee roles":
                    updateRoles();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

// Function for adding departments, roles, or employees
function add() {

    // Prompt the user asking them what they want to add
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to add?",
            choices: [
                "Add Departments",
                "Add Roles",
                "Add Employees",
                "Exit"
            ]
        })
        // Depending on their answer, initiate a particular "ADD" function
        .then(function(answer) {
            switch (answer.action) {
                case "Add Departments":
                    addDepartments();
                    break;

                case "Add Roles":
                    addRoles();
                    break;

                case "Add Employees":
                    addEmployees();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}

// Function for viewing departments, roles, or employees
function view() {

    // Prompt the user asking them what they want to view
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to view?",
            choices: [
                "View Departments",
                "View Roles",
                "View Employees",
                "Exit"
            ]
        })
        // Depending on their answer, initiate a particular "VIEW" function
        .then(function(answer) {
            switch (answer.action) {
                case "View Departments":
                    viewDepartments();
                    break;

                case "View Roles":
                    viewRoles();
                    break;

                case "View Employees":
                    viewEmployees();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

// Function for adding a new department
function addDepartments() {
    console.log("Adding a new department...\n");

    inquirer
        .prompt([{
            type: "input",
            message: "What is the name of the department that you would like to add?",
            name: "newDepartmentName"
        }])
        .then(function(response) {
            console.log(response.newDepartmentName);
            let query = "INSERT INTO department SET ?";
            connection.query(query, {
                    name: response.newDepartmentName,
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " department added: " + response.newDepartmentName + "!");
                    runCLI();
                })
        })
}

// Function for adding a new role
function addRoles() {
    console.log("Adding a new role...\n");
    // Get a list of all departments and populate an array of objects with this information
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
        let choiceArray = [];

        const choiceObj = {
            name: "",
            id: ""
        };

        for (let i = 0; i < results.length; i++) {

            choiceObj.name = results[i].name;
            choiceObj.id = results[i].id;

            choiceObjString = JSON.stringify(choiceObj);

            choiceArray.push(choiceObjString);
        }

        // Once the array is created, prompt the user with some questions regarding the role they want to add
        inquirer
            .prompt([{
                    type: "input",
                    message: "What is the title of the role that you would like to add?",
                    name: "newRoleTitle"
                },
                {
                    type: "input",
                    message: "What is the salary of the role that you would like to add?",
                    name: "newRoleSalary"
                },
                {
                    type: "rawlist",
                    message: "To which department should the role be added?",
                    name: "newEmployeeRole",
                    choices: choiceArray
                },
            ])
            // Add a new role based on their answers
            .then(function(response) {
                console.log(response);

                let query = "INSERT INTO role SET ?";
                connection.query(query, {
                        title: response.newRoleTitle,
                        salary: response.newRoleSalary,
                        department_id: parseInt(JSON.parse(response.newEmployeeRole).id)
                    },

                    function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " role added!\n");
                        runCLI();
                    })
            })
    })
}

// Function for adding a new employee
function addEmployees() {
    console.log("Adding a new employee...\n");
    // Get a list of all roles and populate an array of objects with this information
    connection.query("SELECT * FROM role", function(err, results) {
        if (err) throw err;
        var choiceArray = [];

        const choiceObj = {
            title: "",
            id: ""
        };

        for (var i = 0; i < results.length; i++) {

            choiceObj.title = results[i].title;
            choiceObj.id = results[i].id;

            choiceObjString = JSON.stringify(choiceObj);

            choiceArray.push(choiceObjString);
        }
        // Once you have the array of roles created, prompt the user for questions on which employee they would like to add  
        inquirer
            .prompt([{
                    type: "rawlist",
                    message: "What is the role of the employee that you would like to add?",
                    name: "newEmployeeRole",
                    choices: choiceArray
                },
                {
                    type: "input",
                    message: "What is the first name of the employee that you would like to add?",
                    name: "newEmployeeFirstName"
                },
                {
                    type: "input",
                    message: "What is the last name of the employee that you would like to add?",
                    name: "newEmployeeLastName"
                }
            ])
            // Add an employee based on their answers
            .then(function(response) {
                var query = "INSERT INTO employee SET ?";
                connection.query(query, {
                        first_name: response.newEmployeeFirstName,
                        last_name: response.newEmployeeLastName,
                        role_id: parseInt(JSON.parse(response.newEmployeeRole).id)
                    },
                    function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " employee added!\n");
                        runCLI();
                    })
            })
    })
}

// Function for viewing all departments
function viewDepartments() {

    var query = "SELECT * FROM department";

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runCLI();
    });
}

// Function for viewing all employees
function viewEmployees() {

    var query =
        `SELECT first_name, last_name, role.title 
    FROM employee
    INNER JOIN role ON role.id=employee.role_id`;

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runCLI();
    });
}

// Function for viewing all roles
function viewRoles() {

    var query =
        `SELECT role.id, role.title, role.salary, role.department_id, department.name FROM role
  INNER JOIN department ON department.id=role.department_id`;

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runCLI();
    });
}

// Function for updating employee roles
function updateRoles() {
    console.log("Updating employee roles...\n");
    // Get a list of all employees and populate an array of objects with this information
    connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;
        var choiceArray = [];

        const choiceObj = {
            name: "",
            id: "",
            role_id: ""
        };

        for (var i = 0; i < results.length; i++) {

            choiceObj.name = results[i].first_name + " " + results[i].last_name;
            choiceObj.id = results[i].id;
            choiceObj.role_id = results[i].role_id;

            choiceObjString = JSON.stringify(choiceObj);

            choiceArray.push(choiceObjString);
        }
        // Once you have the array of employees created, prompt the user for questions on the employee whose role they would like to update
        inquirer
            .prompt([{
                type: "rawlist",
                message: "Which is the employee whose role you would like to update?",
                name: "listEmployees",
                choices: choiceArray
            }])
            // Once you have chosen the employee whose role you want to update, prompt the user for their new role id
            .then(function(answer) {
                console.log(answer);
                inquirer
                    .prompt([{
                        type: "input",
                        message: "What is the role of the employee that you would like to update (insert a new role id)?",
                        name: "newRoleID"
                    }])
                    // Update the employee's role
                    .then(function(response) {

                        var query = "UPDATE employee SET ? WHERE ?";

                        connection.query(query, [{
                                    role_id: response.newRoleID
                                },
                                {
                                    id: parseInt(JSON.parse(answer.listEmployees).id)
                                }
                            ],
                            function(err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " employee role updated!\n");
                                runCLI();
                            });
                    })
            })
    })
}