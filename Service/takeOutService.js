const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');
exports.addTakeOutRequest = async function(userId, capacity){
    await prisma.takeout_queue.create({
        data:{
            userId,
            capacity,
            expired_at: new Date()
        }
    })
    return {
        success: true,
        message: "takout 요청이 큐에 추가되었습니다"
    }
}