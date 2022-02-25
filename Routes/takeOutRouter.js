const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const takeOutService = require('../Service/takeOutService.js')
const CustomError = require('../errors/CustomError');

/**
 * addTakeOutRequest
 * EndPoint: [POST] /takeout
 * Description: 유저의 테이크 아웃 요청을 큐에 등록합니다.
 */
router.post('',verifyTokenAndAuthorization, async (req, res, next) => {
    try {
        const { userId, capacity } = req.body;
        const {success, message} = await takeOutService.addTakeOutRequest(userId, capacity)
        res.status(201).json({
            success,
            message
        });
    } catch (err){
        console.error(err);
        next(new CustomError("TAKEOUT", 500, "Takeout 큐에 작업을 추가하지 못했습니다"));
    }
})

/**
 * getTakeOutRequest
 * EndPoint: [GET] /takeout?userId={userId}
 * Description: 특정 유저의 테이크 아웃 요청 리스트를 반환합니다.
 */
router.get('', verifyTokenAndAuthorization, async (req,res)=>{
    const { userId }  = req.query;
    try{
        const takeoutList = await takeOutService.getTakeOutRequest(userId);
        console.log(takeoutList[0].created_at.toString())
        res.status(200).json({
            success:true,
            takeoutList
        })
    }catch (err){
        console.error(err);
        next(err);
    }
})

/**
 * getTakeOutRequestDownladLinks
 * EndPoint: [GET] /takeout/{takeoutId}?userId={userId}
 * Description:  처리된 테이크 아웃의 다운로드 링크를 반환합니다
 */
 router.get('/:takeoutId', verifyTokenAndAuthorization, async (req,res,next)=>{
    try{
        const { takeoutId }  = req.params;
        const { userId } = req.query;
        const takeoutDownloadLinkList = await takeOutService.getTakeOutRequestDownladLinks(parseInt(takeoutId),parseInt(userId));
        console.log(takeoutDownloadLinkList)
        res.status(200).json({
            success:true,
            takeoutDownloadLinkList
        })
    }catch (err){
        next(err);
    }
})

module.exports = router;