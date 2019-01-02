const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ccs#1234',
    database: 'employee_db',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('db connection succeeded');
    else
        console.log('connection failed \n error' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('express server running at port 3000'));

//get all employees
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * from employee', (err, rows, field) => {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else
            console.log(err);
    })
});

//get an employee
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * from employee WHERE EmpId=?', [req.params.id], (err, rows, field) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//delete employee     
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query(' delete from employee WHERE EmpId=?', [req.params.id], (err, rows, field) => {
        if (!err)
            res.send('deleted successfully');
        else
            console.log(err);
    });
});

//insert an employee
app.post('/employees', (req, res) => {
    //retrieving json object into the variable
    let emp = req.body;
    //JSON format
    var sql = "SET @EmpId = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddorEdit(@EmpId,@Name,@EmpCode,@Salary);";   //stored procedure
    mysqlConnection.query(sql, [emp.EmpId, emp.Name, emp.EmpCode,emp.Salary], (err, rows, field) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.send('inserted employee id :' + element[0].EmpId);
            });
        else
            console.log(err);
    });
})

//update an employee
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpId = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddorEdit(@EmpId,@Name,@EmpCode,@Salary)"
    mysqlConnection.query(sql, [emp.EmpId, emp.Name,emp.EmpCode, emp.Salary], (err, rows, field) => {
        if (!err)
            res.send('updated successfully');
        else
            console.log(err);
    });

})
