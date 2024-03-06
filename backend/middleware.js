const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('./config')
 function authMidlleware(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({mssg:"missing auth header"});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userID = decoded.userID;
        next();
    }catch(err){
        res.status(403).json({mssg:"invalid authentication "})
    }

}

module.exports={
    authMidlleware
}