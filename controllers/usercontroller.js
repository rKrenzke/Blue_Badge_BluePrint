const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/create', function(request, response){

    User.create({
        email: request.body.user.email,
        password: bcrypt.hashSync(request.body.user.password, 13)
    })
        .then(
            function createSuccess(user){
                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                response.json({
                    user: user,
                    message: "User successfully created!",
                    sessionToken: token
                });
            }
        )
        .catch(err => response.status(500).json({error: err}))
});

router.post('/login', function(request, response){
    User.findOne({
        where: {
            email: request.body.user.email
        }
    })
        .then(
            function loginSuccess(user){
                if(user){
                    bcrypt.compare(request.body.user.password, user.password, function(err, matches){
                        if(matches){
                            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                        
                            response.status(200).json({
                             user: user,
                             message: "Login Successful!",
                             sessionToken: token
                        })
                        } else{
                            response.status(502).send({error: "Login Failed"});
                        }
                    
                    });
                } else {
                    response.status(500).json({error: "User does not exist."})
                }
            }
        )
        .catch(err => response.status(500).json({error: err}))
})

module.exports = router;