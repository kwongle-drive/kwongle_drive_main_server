const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const CustomError = require('../errors/CustomError');

const authService = require('../Service/authService');

router.post('/login', async (req, res, next) => {
    let user = {
        email : req.body.email,
        password: req.body.password
    };
    try{
        const {success, message, accessToken, userId} = await authService.login(user);
        res.status(200).json({
            success,
            message,
            accessToken,
            userId
        })
    }catch(err){
        console.error(err);
        next(err);
    }
    
});


router.post('/signup', async (req, res, next) => {
    try {
        const user = {
            email: req.body.email,
            password: (await argon2.hash(req.body.password)).toString()
        }
        const {success, message, status} = await authService.signUp(user);
        res.status(status).json({success,message});
    } catch (err) {
        console.error(err);
        const error = new CustomError('AUTH', 401, "유저 생성에 실패하였습니다.");
        next(error);
        return;
    }
});


module.exports = router;