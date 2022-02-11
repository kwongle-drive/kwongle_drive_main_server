const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        },
        select:{
            id: true,
            email: true,
            password: true
        }
    });

    //user does not exist
    if (user == null) {
        res.status(401).json({
            success: false,
            message: "존재하지 않는 회원입니다"
        });
        return;
    }

    // check password 
    if(!await argon2.verify( user.password, req.body.password)){
        res.status(401).json({
            success: false,
            message: "비밀번호가 틀렸습니다"
        });
        return;
    }
    
    // success checking password 
    const accessToken = jwt.sign({
        email: user.email,
        id: user.id
    },process.env.JWT_SEC,{expiresIn: "2d"});
    // res.status(200).json
    res.status(200).json({
        success:true,
        message: "로그인이 되었습니다.",
        accessToken,
        user_id : user.id
    })
});

router.post('/signup', async (req, res) => {
    const { email, password } = {
        email: req.body.email,
        password: await (await argon2.hash(req.body.password)).toString()
    }
    try {
        const savedUser = await prisma.user.create({
            data: {
                email,
                password
            }
        });
        console.log(savedUser);
        const response = {
            success: true,
            message: "유저가 성공적으로 생성되었습니다",
        }
        res.status(201).json(response);
    } catch (err) {
        const response = {
            success: false,
            message: "유저 저장에 실패하였습니다 !",
            error: err
        }
        res.status(500).json(response);
    }
});



module.exports = router;