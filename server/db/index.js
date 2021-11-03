const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'homer',
    host: 'localhost',
    port: '3306'
})


//create a custom db object for making queries
let homerDB = {};

//getting all users
homerDB.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * from user_login_account`, (error, results) => {
            if(error){
                return reject(error)
            }
            return resolve(results)
        }); 
    });
};


//getting one user
homerDB.getOneUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * from user_login_account WHERE id = ?`, [id],  (error, results) => {
            if(error){
                return reject(error)
            }
            return resolve(results)
        }); 
    });
}


module.exports = homerDB;