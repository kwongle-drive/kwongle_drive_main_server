const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const CustomError = require('../errors/CustomError');
const { PrismaClient } = require('@prisma/client');
const {verifyToken,verifyTokenAndAuthorization} = require('./verifyToken');
const prisma = new PrismaClient();

//유저 드라이브 생성하기
router.post('/',verifyTokenAndAuthorization,async (req,res,next)=>{
    const {userId, capacity} = req.body;
    
    try{
        await createNewDrivePath(userId);
        await prisma.drive.create({
            data:{
                userId,
                totalCapacity:capacity,
                path: userId.toString()
            }
        });
        res.status(201).json({
            "success": true,
            "message": "드라이브가 성공적으로 생성되었습니다.",
        });
    }catch(err){
        console.error(err);
        err = new CustomError("DRIVE", 500,"이미 드라이브가 생성되어있습니다.");
        next(err)
    }
   
})


const createNewDrivePath = async (userId)=>{
    userId = userId.toString()
    const newDir = path.join(process.env.DRIVE_PATH, userId);
    await fs.mkdir(newDir,(err)=>{
        if(err) {
            throw err;
        }
    });
    return path;
}

module.exports = router;
