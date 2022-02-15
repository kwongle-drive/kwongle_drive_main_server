const argon2 = require('argon2');
const fs = require('fs').promises;
const path = require('path');
// async function hash(){
//     try {
//         const hash = await argon2.hash("password");
//         console.log(hash)
//         return hash;
//       } catch (err) {
//         //...
//       }
// }
// async function hash2(result){
//     try {
//         if (await argon2.verify(result, "password")) {
//           // password match
//           console.log("password match")
//         } else {
//           // password did not match
//           console.log("password does not match")
//         }
//       } catch (err) {
//         // internal failure
//       }
// }
// hash().then((result)=>{
//     hash2(result + "1");
// })


// const files = fs.readdirSync('./');
// fs.readdir('./', (err, files)=>{
//   for(let i = 0 ; i < files.length; i++){
//     let target = path.join(__dirname, files[i]);
//     fs.stat(target, (err, stats)=>{
//       const {name, ext} = path.parse(target);
//       stats.filename = name;
//       stats.extension = ext;
//       stats.path = target; // 실제 구현시 path에 조인 걸어
//       stats.type = stats.isDirectory() ? "directory" : "file";
//       const {filename, type, extension, contentType ,atime,ctime,mtime,birthtime} = stats;
//       console.log( {filename, type, extension, contentType, path: stats.path ,atime,ctime,mtime,birthtime} )
//     })
//   }
// })


//file rename test
// fs.rename('./drives/7/test','./drives/7/newtest',()=>{
//     console.log("Heelo");
// })

// const a = path.basename('./drives/7/test.txt');
// console.log(a);


//remove file or directory 
fs.rm('./drives/7/newDirectory',{force:true, recursive: true}).then(()=>{
    console.log("delete completed")
}).catch((err)=>{
    console.log(err);
})

const pathEncode = require('./pathEncode');
console.log(pathEncode.pathEncode("한글"))