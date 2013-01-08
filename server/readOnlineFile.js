var http = require('http');
/**
 * 根据URL加载js文件到sandbox
 * @param url
 * @param callback
 */
function read(url,callback){
    var jsContent = '';
    http.get(url, function(res) {
        res.on('data',function(chunk){
            jsContent += chunk;
        }).on('end',function(){
            callback(jsContent);
        });
    })
}
exports.read = read;