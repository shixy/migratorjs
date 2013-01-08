var vm = require('vm');
var readFile = require('./readOnlineFile');
var token = require('./token');

//TODO  异常处理

/**
 * 初始化客户端javascript
 * @param req
 * @param res
 */
function init(req,res){
    var url = req.body.url;
    var code = req.body.code;
    if(code){
        initScript(res,code);
    }else if(url){
        readFile.read(url,function(js){
            initScript(res,js);
        });
    }

}
function initScript(res,scriptStr){
    var migratorScript = vm.createScript(scriptStr,'migrator.vm');
    var tokenId = token.add(migratorScript);
    res.send(200,tokenId);
}
/**
 * 执行已经迁移的函数
 * @param req
 * @param res
 */
function exec(req,res){
    var functionName = req.body.funcName;
    var args = req.body.args||{};
    var ctx = refreshCtx(req.body.ctx);
    var tokenId = req.body.tokenId;
    var curToken = token.get(tokenId);
    var result;
    if(curToken){
        var migratorScript = curToken.script;
        token.refresh(tokenId);
        migratorScript.runInNewContext(ctx);
        result = ctx[functionName].apply(ctx,args);
    }else{
        result = '没有初始化javascript';
    }
    if(typeof result != 'string'){
        result = JSON.stringify(result);
    }

    res.send(result);
}
/**
 * 将ctx中的function字符串转换为函数
 * @param ctx
 */
function refreshCtx(ctx){
    if(!ctx)return {};
    for(var o in ctx){
        if(typeof ctx[o] == 'string' && ctx[o].indexOf('__func__') == 0){
            ctx[o] = eval('('+ctx[o].slice(8)+')');
        }
    }
    return ctx;
}
exports.init = init;
exports.exec = exec;
