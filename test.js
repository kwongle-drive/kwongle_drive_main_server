const argon2 = require('argon2');

async function hash(){
    try {
        const hash = await argon2.hash("password");
        console.log(hash)
        return hash;
      } catch (err) {
        //...
      }
}
async function hash2(result){
    try {
        if (await argon2.verify(result, "password")) {
          // password match
          console.log("password match")
        } else {
          // password did not match
          console.log("password does not match")
        }
      } catch (err) {
        // internal failure
      }
}
hash().then((result)=>{
    hash2(result + "1");
})

