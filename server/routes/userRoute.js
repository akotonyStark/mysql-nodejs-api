const express = require('express')
const dbUserContext = require('../db/user')
const jwt = require('jsonwebtoken')
const { sendWelcomeEmail, sendCancellationEmail } = require('../middleware/email')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.json({test: 'Welcome to homer api'})
});

router.get('/getUsers', async (req, res, next) => {
    //res.json({test: 'test'})
    try{
        let results = await dbUserContext.getAllUsers();
        if(results.length < 1){
            return res.status(204).send({Message: 'No users found'})
        }
        res.json(results)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});


//get one user
router.get('/getUser/:id', async (req, res, next) => {
    
    try{
        let results = await dbUserContext.getOneUser(req.params.id);
        if(results.length === 0){
            res.status(404).send({Message: 'User not found'})
        }
        res.json(results)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});


//add one user
router.post('/addUser', async (req, res, next) => {
  
    try{
        const user = req.body
        await dbUserContext.addUser(user);
        res.status(201).send(user)
        sendWelcomeEmail(user.email, user.username)
    }catch(e){
        console.log(e)
        if(e.code === 'ER_DUP_ENTRY'){
            return res.status(409).send({Error: "User already exists"})
        }
        res.status(400).send(e.sqlMessage)
    }
});


//update userinfor
router.patch('/updateUserInfo', async (req, res) => {
   
        const keys = Object.keys(req.body)
        const allowedPropertyUpdates = ['id', 'username', 'email', 'password', 'token']

        const isValidOperation = keys.every((key) => {
            return allowedPropertyUpdates.includes(key)
        })

       if(!isValidOperation){
           return res.status(400).send({error: 'Invalid data provided'})
       }

        try{
            
            //validation can be put on the request body
            console.log(req.body)
            await dbUserContext.updateUser(req.body);
            res.status(200).send({Message: 'Record updated successfully'});
        
        }catch(e){
            console.log(e)
            res.status(400).send(e)
        }
})

//delete user
router.delete('/removeUserById/:id', async (req, res, next) => {
    
    try{
        let apiResponseBody = await dbUserContext.deleteOneUser(req.params.id);
        if(apiResponseBody.affectedRows === 0){
           return res.status(404).send({Message: 'User not found'})
           //return res.status(204).send() ---technically this should be the right now
        }        
        res.status(200).send({Message: 'User has successfully been removed'})
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});

//user signUp
router.post('/signUp/profile', async (req, res, next) => {
  
    try{
        const user = req.body
        await dbUserContext.signup(user);
        res.status(201).send(user)
        sendWelcomeEmail(user.email, user.username)
    }catch(e){
        console.log(e)
        if(e.code === 'ER_DUP_ENTRY'){
            return res.status(409).send({Error: "User already exists"})
        }
        res.status(400).send(e.sqlMessage)
    }
});

//logging in user
router.get('/login/profile', async (req, res, next) => {
    
    try{        
        const user = req.body           

        //generate auth token to simulate header token
        //const token = jwt.sign({_id: user.id.toString(), _username: user.username}, 'homer_secret', {expiresIn: '1 day'})
        const token = jwt.sign({_email: user.email}, 'homer_secret', {expiresIn: '1 day'})
       
        //const token = req.header('Authorization').replace('Bearer', '')
        //console.log("Token: ", token)
        user.token = token

        let results = await dbUserContext.login(user);
        if(results.length === 0){
            res.status(404).send({Message: 'Invalid User Credentials'})
        }
        res.json(results)
    }catch(e){
        if(e.message === 'invalid signature' || e.message === 'invalid token'){
            return res.status(401).send({Error: 'Unauthorized access'})
        }
        else if(e.message === 'jwt expired'){
            return res.status(401).send({Error: 'Token expired'})
        }
       
        console.log("Error:", e.message)
        res.sendStatus(500).send()
    }
});


module.exports = router
