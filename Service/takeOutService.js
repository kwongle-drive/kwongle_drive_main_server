const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');
const priamTimezoneDiff =9;
exports.addTakeOutRequest = async function(userId, capacity){
    let expired_at = new Date();
    expired_at.setDate(expired_at.getDate + priamTimezoneDiff + 7); // expired at 기간 ~7일 
    await prisma.takeout_queue.create({
        data:{
            userId,
            capacity,
            expired_at
        }
    })
    return {
        success: true,
        message: "takout 요청이 큐에 추가되었습니다"
    }
}