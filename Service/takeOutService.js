const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');
const priamTimezoneDiff = 9;
const CustomError = require('../errors/CustomError');

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

exports.getTakeOutRequest = async function(userId){
    try{
        const takeoutList = await prisma.takeout_queue.findMany({
            where:{
                userId
            },select:{
                id: true,
                capacity:true,
                finish: true,
                expired_at: true,
                created_at: true,
            }
        });
 
        return takeoutList;
       
    }catch(err){
        throw new CustomError("TAKEOUT", 500, "유저의 테이크 아웃요청들을 가져오지 못했습니다");
    }
}


exports.getTakeOutRequestDownladLinks = async function(takeoutId, userId){
    try{
        console.log("takoutid",takeoutId,"userId",userId)
        const results = await prisma.takeout_result_path.findMany({
            where:{
                takeoutId
            },
            select:{
                path:true,
                size:true,
            }
        })
        const takeoutDownloadLinkList = []
        results.forEach(r => {
            let elem = {
                index : parseInt(r.path.split('-')[3].split('.zip')[0]),
                link: process.env.WEB_API_URL + `/takeout/download/${userId}/${r.path}`,
                size: r.size
            }
            takeoutDownloadLinkList.push(elem);
        }) 
        return takeoutDownloadLinkList;
       
    }catch(err){
        console.log(err);
        throw new CustomError("TAKEOUT", 500, "해당 테이크 아웃 zip파일의 다운로드 링크들을 가져오지 못했습니다");
    }
}

