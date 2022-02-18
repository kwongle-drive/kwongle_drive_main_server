const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const CustomError = require('../errors/CustomError');
const upload = require('../multerConfig');
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const { constants } = require('buffer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { pathDecode, pathEncode } = require('../pathEncode');

//파일 업로드
router.post('/upload', verifyTokenAndAuthorization, async (req, res, next) => {
    upload.array('filesToUpload')(req, res, (err) => {
        if (err) {
            console.log(err)
            next(err);
        }
        res.status(201).json({
            success: true,
            message: "업로드가 성공적으로 완료되었습니다."
        })
    });
})

//파일 다운로드
// router.get('/*', verifyTokenAndAuthorization, async (req, res, next) => {
//     //임시로 경로를 substring으로 파싱
//     const requestPath = req.originalUrl.split('?')[0].substring(5);
//     try {
//         //유저 드라이브 경로 가져오기
//         const userPath = getUserPath(req.user.id);
//         const targetPath = path.join(process.env.DRIVE_PATH, userPath, requestPath);

//         //존재하는 경로인지 확인
//         fs.access(targetPath, constants.F_OK, function (error) {
//             if (error) { //directory does not exist
//                 next(new CustomError("FILE", 404, "해당 파일(경로)이 존재하지 않습니다."))
//             } else {
//                 res.setHeader('Content-Disposition', `attachement; filename=${requestPath}`);
//                 res.sendFile(targetPath);
//             }
//         });
//     } catch (err) {
//         next(new CustomError("FILE", 404, "해당 파일(경로)이 존재하지 않습니다."))
//     }
// })

//파일 다운로드 with encoded path
router.get('/:encodedPath', verifyTokenAndAuthorization, async (req, res, next) => {
    //임시로 경로를 substring으로 파싱
    const requestPath = pathDecode(req.params.encodedPath);
    try {
        //유저 드라이브 경로 가져오기
        const userPath = getUserPath(req.user.id);
        const targetPath = path.join(process.env.DRIVE_PATH, userPath, requestPath);

        //존재하는 경로인지 확인
        fs.access(targetPath, constants.F_OK, function (error) {
            if (error) { //directory does not exist
                next(new CustomError("FILE", 404, "해당 파일(경로)이 존재하지 않습니다."))
            } else {
                res.setHeader('Content-Disposition', `attachement; filename=${requestPath}`);
                res.sendFile(targetPath);
            }
        });
    } catch (err) {
        next(new CustomError("FILE", 404, "해당 파일(경로)이 존재하지 않습니다."))
    }
})

//디렉토리 생성
router.post("/directory", verifyTokenAndAuthorization, async (req, res, next) => {
    try {
        //유저 드라이브 경로 가져오기
        const userPath = await getUserPath(req.body.userId);
        const targetPath = path.join(process.env.DRIVE_PATH, userPath, req.body.path, req.body.dirName);

        //존재하는 경로인지 확인
        fs.access(targetPath, constants.F_OK, async function (error) {
            if (error) { //directory does not exist
                fs.mkdir(targetPath, () => {
                    res.status(201).json({
                        success: true,
                        message: "디렉토리가 성공적으로 생성되었습니다.",
                    });
                });
            } else {
                next(new CustomError("FILE", 400, "해당 경로에 이미 같은 이름의 디렉토리가 존재합니다"))
            }
        });
    } catch (err) {
        next(new CustomError("FILE", 500, "디렉토리 생성에 실패하였습니다."))
    }
})

// 파일 / 디렉토리 삭제
router.delete('/:encodedPath', verifyTokenAndAuthorization ,async (req, res, next) => {
    try {
        const targetPath = pathDecode(req.params.encodedPath);
        const userPath = await getUserPath(req.user.id);
        const fullPath = path.join(process.env.DRIVE_PATH, userPath, targetPath);
        await fsPromise.rm(fullPath, { recursive: true, force: true });
        res.status(200).json({
            success: true,
            message: "디렉토리가 성공적으로 삭제되었습니다.",
        });
    } catch (err){
        console.error(err);
        next(new CustomError("FILE", 500, "파일 삭제에 실패하였습니다."))
    }

})


//파일 / 폴더명 변경
router.patch('/', async (req, res, next) => {
    try {
        //유저 드라이브 경로 가져오기
        const userPath = await getUserPath(req.body.userId);
        const targetPath = path.join(process.env.DRIVE_PATH, userPath, req.body.path);
        const newPath = getNewPathForRename(req.body.newFilename, targetPath);
        fs.access(newPath, constants.F_OK, function (error) {
            if (error) { //directory does not exist
                fs.rename(targetPath, newPath, (err) => {
                    if (err) {
                        return next(new CustomError("FILE", 400, "파일/폴더명 변경에 실패하였습니다. (No such file or directory)"))
                    }
                    res.status(200).json(
                        {
                            success: true,
                            message: "해당 파일 / 폴더 명이 변경되었습니다.",
                        }
                    )
                })
            } else {
                next(new CustomError("FILE", 400, "해당 경로에 이미 같은 이름의 디렉토리가 존재합니다"))
            }
        });

    } catch (err) {
        next(new CustomError("FILE", 500, "파일/폴더명 변경에 실패하였습니다."))
    }

})


function getNewPathForRename(newFileName, targetPath) {
    const newPath = path.join(path.dirname(targetPath), newFileName);
    return newPath;
}


async function getUserPath(userId) {
    const drive = await prisma.drive.findFirst({
        where: {
            userId: userId
        },
        select: {
            path: true
        }
    })
    return drive.path;
}

module.exports = router;