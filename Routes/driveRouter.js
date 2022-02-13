const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const CustomError = require('../errors/CustomError');
const {verifyToken,verifyTokenAndAuthorization} = require('./verifyToken');
const driveService = require('../Service/driveService');

/**************************************
 * 1. 유저 드라이브 생성하기
 * 2. Path내 파일 및 폴더 구조 가져오기
 * 3. 디렉토리 정보 가져오기           
 * 4. 파일 정보 가져오기               
 **************************************/

//유저 드라이브 생성하기
router.post('/',verifyTokenAndAuthorization,async (req,res,next)=>{
    const {userId, capacity} = req.body;
    try{
        const { success, message } = await driveService.createDrive(userId,capacity);
        res.status(201).json({success,message});
    }catch(err){
        console.error(err)
        next(err)
    }
})


//Path내 파일 및 폴더 구조 가져오기 query parameter : { userId : 1} 최상위 디렉토리
router.get('/directory/',verifyTokenAndAuthorization, async (req, res, next)=>{
    try{
        const {success, message, rootPath, files } = await driveService.getPathInfo(req.query.userId,"");
        res.status(200).json({success, message, rootPath, files });
    }catch(err){
        next(err);
    }
})


//Path내 파일 및 폴더 구조 가져오기 query parameter : { userId : 1}
router.get('/directory/:path',verifyTokenAndAuthorization, async (req, res, next)=>{
    try{
        const {success, message, rootPath, files } = await driveService.getPathInfo(req.query.userId,req.params.path);
        res.status(200).json({success, message, rootPath, files });
    }catch(err){
        next(err);
    }
})



module.exports = router;
