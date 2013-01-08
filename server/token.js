var crypto = require('crypto');
var tokens = {};
var count = 0;
var TOKEN_TIMEOUT = 30*60*1000;//30分钟

function generateId(len){
    len = len || 24;
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')
        .slice(0, len);
}
function get(tokenId){
    return tokens[tokenId];
}

function add(script){
    var tokenId = generateId();
    tokens[tokenId] = {
        script:script,
        timeStamp:new Date()
    }
    count++;
    return tokenId;
}
//刷新令牌使用时间
function refresh(tokenId){
    tokens[tokenId].timeStamp = new Date();
}

function destroy(tokenId){
    delete tokens[tokenId];
    count--;
}

function getCount(){
    return count;
}

//检查令牌是否过期
setInterval(function(){
    var now = new Date();
    for(var id in tokens){
        var token = tokens[id];
        if(now -token.timeStamp > TOKEN_TIMEOUT){
            destroy(id);
        }
    }
},1000);

exports.add = add;
exports.destroy = destroy;
exports.refresh = refresh;
exports.get = get;
exports.count = getCount;