var base62x = require('base62x');
 

exports.pathEncode = (path)=>{
    return base62x.encode(path);
}

exports.pathDecode = (encoded) =>{
    // var decodedBuffer = base62x.decode(encoded);
    return base62x.decodeString(encoded);
}

