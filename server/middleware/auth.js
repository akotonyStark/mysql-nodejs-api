const jwt = require('jsonwebtoken')
const dbUserContext = require('../db/user')

const auth = async(req, res, next) => {

    try{
        const user_payload = req.body   
            
        //FIND USER BY CREDENTIALS
        const response = await dbUserContext.findByCredentials(user_payload)
        const user =  response[0]
        //console.log('User:', user)
        const header = req.headers['authorization']
        console.log("header", header)

        if(!user){
            return res.status(404).send({Error: 'Invalid user credentials'})
        }
        
        else if(typeof header != 'undefined'){
            const bearer = header.split(' ')
            const token = bearer[1]
            //console.log("Token: ", token)
            user.token = token

            console.log('Auth User:', user)
            await dbUserContext.login(user).then(results => {
                return res.send(results)
            }).catch(error => {
                return res.status(401).send({"Error:": error})
            })
            //res.send(user)
            next()
        }
        else{
            res.sendStatus(403)
        }
    }catch(e){
        console.log(e)
    }
}


module.exports = auth
