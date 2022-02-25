const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');
const priamTimezoneDiff = 9;
exports.addTakeOutRequest = async function(userId, capacity){
    await prisma.takeout_queue.create({
        data:{
            userId,
            capacity,
        }
    })
    return {
        success: true,
        message: "takout 요청이 큐에 추가되었습니다"
    }
}