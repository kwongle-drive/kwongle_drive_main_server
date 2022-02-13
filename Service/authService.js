const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const CustomError = require('../errors/CustomError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async function(userReq){
    try {
        user = await prisma.user.findUnique({
            where: {
                email: userReq.email
            },
            select: {
                id: true,
                email: true,
                password: true
            }
        })
    } catch(err){
        console.error(err);
        throw new CustomError('AUTH', 501, "Internal Server Error");
    }


    //user does not exist
    if (user == null) {
        throw new CustomError('AUTH', 401, "존재하지 않는 회원입니다.");
    }

    // check password 
    if (!await argon2.verify(user.password, userReq.password)) {
        throw new CustomError('AUTH', 401, "패스워드가 일치하지 않습니다.");
    }

    // success checking password 
    const accessToken = jwt.sign({
        email: user.email,
        id: user.id
    }, process.env.JWT_SEC, { expiresIn: "2d" });
    return {
        success: true,
        message: "로그인이 되었습니다.",
        accessToken,
        userId: user.id
    }
}

exports.signUp = async function(userReq) {
    const { email, password } = userReq;
    try{
        const savedUser = await prisma.user.create({
            data: {
                email,
                password,
            }
        });
        
        return {
            success: true,
            message: "유저가 성공적으로 생성되었습니다",
            status: 201
        };
    }catch(err){
        throw new CustomError('AUTH', 401, "유저 생성에 실패하였습니다.");
    }
    
}
