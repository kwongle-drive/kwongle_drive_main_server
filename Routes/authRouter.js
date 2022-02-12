const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const CustomError = require('../errors/CustomError');

const { PrismaClient } = require('@prisma/client');
const { nextTick } = require('process');
const prisma = new PrismaClient();

router.post('/login', async (req, res, next) => {
    let user;
    try {
        user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            },
            select: {
                id: true,
                email: true,
                password: true
            }
        })
    } catch(err){
        console.error(err);
        const error = new CustomError('AUTH', 501, "Internal Server Error");
        return next(error);
    }


    //user does not exist
    if (user == null) {
        const error = new CustomError('AUTH', 401, "존재하지 않는 회원입니다.");
        return next(error);
    }

    // check password 
    if (!await argon2.verify(user.password, req.body.password)) {
        const error = new CustomError('AUTH', 401, "패스워드가 일치하지 않습니다.");
        return next(error);
    }

    // success checking password 
    const accessToken = jwt.sign({
        email: user.email,
        id: user.id
    }, process.env.JWT_SEC, { expiresIn: "2d" });

    res.status(200).json({
        success: true,
        message: "로그인이 되었습니다.",
        accessToken,
        user_id: user.id
    })
});



router.post('/signup', async (req, res, next) => {
    const { email, password } = {
        email: req.body.email,
        password: (await argon2.hash(req.body.password)).toString()
    }

    try {
        const savedUser = await prisma.user.create({
            data: {
                email,
                password,
            }
        });
        const response = {
            success: true,
            message: "유저가 성공적으로 생성되었습니다"
        }
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        const error = new CustomError('AUTH', 401, "유저 생성에 실패하였습니다.");
        next(error);
        return;
    }
});


module.exports = router;