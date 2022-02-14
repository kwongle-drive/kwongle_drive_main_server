const router = require('express').Router();
const {verifyToken,verifyTokenAndAuthorization} = require('./verifyToken');
const driveService = require('../Service/driveService');

/**************************************
 * 1. 유저 드라이브 생성하기
 * 2. Path내 파일 및 폴더 구조 가져오기          
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
router.get('/directory/*',verifyTokenAndAuthorization, async (req, res, next)=>{
    try{
        //나중에 path를 클라이언트에서 암호화해서 보내면 서버에서 같은 키로 복호화하여 path를 꺼낸다. 일단 임시로 아래처럼 해놈
        const requestPath = req.originalUrl.split('?')[0].substring(17);
        const {success, message, rootPath, files } = await driveService.getPathInfo(req.query.userId,requestPath);
        res.status(200).json({success, message, rootPath, files });
    }catch(err){
        next(err);
    }
})



module.exports = router;
