const path = require('path');
const fs = require('fs').promises;
const { pathDecode, pathEncode } = require('../pathEncode');
const CustomError = require('../errors/CustomError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const contentTypeMap = {
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    mp4: "video",
    mp3: "audio",
    txt: "txt"
}

//유저 드라이브 생성하기
exports.createDrive = async function (userId, capacity) {
    try {
        await createNewDrivePath(userId);
        await prisma.drive.create({
            data: {
                userId,
                totalCapacity: capacity,
                path: userId.toString()
            }
        });

        return {
            success: true,
            message: "드라이브가 성공적으로 생성되었습니다.",
        };
    } catch (err) {
        throw new CustomError("DRIVE", 500, "유저 드라이브 생성 오류");
    }
}

//Path내 파일 및 폴더 구조 정보 가져오기
exports.getPathInfo = async function (userId, targetPath) {
    //유저 드라이브 경로 불러오기
    try{
        userId = parseInt(userId);
        let userPath = await prisma.drive.findFirst({
            where: {
                userId
            },
            select: {
                path: true
            }
        });
        const fullPath = path.join(process.env.DRIVE_PATH, userPath.path, targetPath);
        const files = await  getFilesInfoInPath(fullPath, targetPath);
        return {
            success: true,
            message: "",
            rootPath: targetPath,
            files
        };
    }catch(err){
        console.error(err);
        throw new CustomError("DRIVE", 500, "getPathInfo에러, 디렉토리 구조를 불러오지 못하였습니다.");
    }
}

//Path내 파일 및 폴더 구조 정보 가져오기 with encryted Path
exports.getPathInfoEncrypted = async function (userId, encodedPath) {
    //유저 드라이브 경로 불러오기
    try{
        const targetPath = pathDecode(encodedPath);;
        console.log(targetPath)
        userId = parseInt(userId);
        let userPath = await prisma.drive.findFirst({
            where: {
                userId
            },
            select: {
                path: true
            }
        });
        const fullPath = path.join(process.env.DRIVE_PATH, userPath.path, targetPath);
        const files = await  getFilesInfoInPath(fullPath, targetPath);
        return {
            success: true,
            message: "",
            rootPath: targetPath,
            files
        };
    }catch(err){
        console.error(err);
        throw new CustomError("DRIVE", 500, "getPathInfo에러, 디렉토리 구조를 불러오지 못하였습니다.");
    }
}

const getFilesInfoInPath = async (fullPath, targetPath) => {
    let info = [];
    const files = await fs.readdir(fullPath);
    for (let i = 0; i < files.length; i++) {
        let target = path.join(fullPath, files[i]);
        let stat = await fs.stat(target);
        const { name, ext } = path.parse(target);
        stat.filename = files[i];
        stat.extension = ext.split('.')[1];
        stat.path = path.join(targetPath, files[i]); 
        stat.type = stat.isDirectory() ? "directory" : "file";
        const { filename, type, extension, atime, ctime, mtime, birthtime, size} = stat;
        const contentType = contentTypeMap[extension] ? contentTypeMap[extension] : null;
        info.push({ filename, type, extension, path : stat.path ,contentType, atime, ctime, mtime, birthtime, size })
    }
    return info;
}

const createNewDrivePath = async (userId) => {
    userId = userId.toString()
    const newDir = path.join(process.env.DRIVE_PATH, userId);
    await fs.mkdir(newDir, (err) => {
        if (err) {
            throw err;
        }
    });
    return path;
}
