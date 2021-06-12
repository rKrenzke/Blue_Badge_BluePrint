const jwt = require('jsonwebtoken'); //import JWT package so we can use it in this file
const User = require('../db').import('../models/user');

const validateSession = (request, response, next) => {
    const token = request.headers.authorization;

    if(!token){
        return response.status(403).send({auth: false, message: "No Token Provided"})
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {

            if(!err && decodeToken){
                User.findOne({
                    where: {
                        id: decodeToken.id
                    }
                })
                .then(user => {

                    if(!user) throw err;
                    request.user = user;
                    return next();
                })
                .catch(err => next(err));
            } else{
                request.errors = err;
                return response.status(500).send("Not Authorized");
            }
        });
    }
};

module.exports = validateSession;