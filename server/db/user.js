const jwt = require('jsonwebtoken')
const pool = require('./index')

//create a custom db object for making queries
let homerDB = {};

pool.getConnection((error, conn) => {
    if(error){
        console.log(error)
    }
    else{
        console.log('Conncected as id: ', conn.threadId)
    }
})

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

homerDB.addUser = (user) => {
   
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO user_login_account VALUES ('${user.id}', '${user.username}', '${user.email}', '${user.password}')`,  (error, results) => {
            if(error){
                return reject(error)
            }
            return resolve(results)
        }); 
    });
}


homerDB.updateUser = (user) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE user_login_account 
                    SET email = '${user.email}',
                    username = '${user.username}',
                    password = '${user.password}'
                    WHERE id = ?`, user.id,  (error, results) => {
            if(error){
                return reject(error.sqlMessage)
            }
            return resolve(results)
        }); 
    });
}


//deleting one user
homerDB.deleteOneUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM user_login_account WHERE id = ?`, [id],  (error, results) => {
            if(error){
                return reject(error)
            }
            return resolve(results)
        }); 
    });
}

//signing up user
homerDB.signup = (user) => {
    //generate token
    const token = jwt.sign({_id: user.id,  _username: user.username}, 'homer_secret', {expiresIn: '1 day'})
    user.tokens = token 
    //console.log(token)

    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO user_login_account VALUES ('${user.id}', '${user.username}', '${user.email}', '${user.password}', '${user.tokens}')`,  (error, results) => {
            if(error){
                return reject(error)
            }
            return resolve(results)
        }); 
    });
}

//logging in user
homerDB.login = (user) => {
    
    //verify that token
    const decodedToken = jwt.verify(user.token, 'homer_secret')
    console.log("Decoded Token:", decodedToken)

    return new Promise((resolve, reject) => {
        pool.query(`SELECT * from user_login_account WHERE id = ? AND username = ? AND password = ?`, [decodedToken._id, user.username, user.password],  (error, results) => {
            if(error){
                return reject(error)
            }
            return resolve(results)
        }); 
    });
}


module.exports = homerDB;