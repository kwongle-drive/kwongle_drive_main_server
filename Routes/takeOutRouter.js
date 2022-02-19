const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const takeOutService = require('../Service/takeOutService.js')
const CustomError = require('../errors/CustomError');

// take out queue 에 작업 추가
router.post('', async (req, res, next) => {
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


module.exports = router;