const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { constants } = require('buffer');
const CustomError = require('./errors/CustomError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const destination = async function (req, file, cb) {
    console.log(file)
    const userRootPath = await prisma.drive.findFirst({
        where:{
            userId: parseInt(req.query.userId),
        },
        select:{
            path: true
        }
    })
    req.dest = path.join(process.env.DRIVE_PATH, userRootPath.path,req.body.path);
    fs.access(req.dest, constants.F_OK, function (error) {
        if (error) { //directory does not exist
            throw new CustomError("FILE", 400, "존재하지 않는 폴더입니다.")
        } else {
            return cb(null, req.dest);
        }
    });
}

const filename = function (req, file, cb) {
    const { username } = req.body;
    const dest = path.join(req.dest,file.originalname);
    console.log(dest)
    fs.access(dest, constants.F_OK, (error) => {
        if (error) {
            return cb(null, file.originalname);
        }
        const filename = newFileNameForDup(file.originalname);
        cb(null, filename);
    })
}

const storage = multer.diskStorage({
    destination,
    filename
});


//중복 발생시 unique한 파일명을 반환합니다.
function newFileNameForDup(fullFilename) {
    const split = fullFilename.split('.');
    let filename = split[0];
    let ext = split[split.length - 1];
    if (split.length > 1) {
        for (let i = 1; i < split.length - 1; i++)
            filename += split[i];
    }
    return filename + "-" + Date.now().toString() + `.${ext}`;
}

module.exports = multer({
    storage: storage
});
