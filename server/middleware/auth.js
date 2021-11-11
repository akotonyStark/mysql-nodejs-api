const jwt = require('jsonwebtoken')
const db = require('../db')

const auth = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer', '')
        console.log("Token: " , token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'homer_secret')

        let user = await db.getOneUser(req.par);
        if(!user){
            return res.status(401).send({Message: 'Unauthorized access'})
        }

        console.log(token)
        req.token = token
        req.user = user
        next()

    }catch(e){
        res.status(401).send({Message: 'Unauthorized access'})
    }
} 


module.exports = auth