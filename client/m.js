Migrator = {
    tokenId : '',
    initURL : 'http://localhost:8888/init',
    execURL : 'http://localhost:8888/exec',
    migrateToServer : function(cfg){
        var func = eval(cfg.funcPath);
        var funcPath = cfg.funcPath;
        var thisAttrs = cfg.thisAttrs;
        if (typeof func != 'function') {
            console.log('func is not a function: ' + JSON.stringify(func));
            return null;
        }
        if (func.__server_flag__) return func;
        var funcName = this.getFuncName(funcPath);
        var functionString = func.toString();

        $.ajax({
            url:this.initURL,
            type:'post',
            async:false,
            data:{
                code : 'var '+funcName+'='+ functionString
            },
            success:function (tokenId) {
                Migrator.tokenId = tokenId;
                console.log('moved function'+ funcPath+'to sever success!');
            }
        });
        var tf = (function(){
            var ctx = {};
            for(var i in thisAttrs){
                var attr = thisAttrs[i];
                if(typeof this[attr] == 'function'){
                    ctx[attr] = '__func__'+this[attr].toString();
                }else{
                    ctx[attr] = this[attr];
                }
            }
            var result;
            var execParams = {
                tokenId : Migrator.tokenId,
                funcName : funcName,
                args :Migrator.getArguments(arguments),
                ctx :ctx
            }
            $.ajax({
                url:Migrator.execURL,
                type:'post',
                async: false,
                contentType : 'application/json',
                //dataType:'json',
                data : JSON.stringify(execParams),
                // data : execParams,
                success : function(data){
                    result = data;
                    console.log('excute successed from cloud server! the result is '+data);
                }
            })
            return result;
        });
        tf.__server_flag__ = true;
        eval('('+funcPath+'=tf)')
    },
    getArguments:function (args) {
        var argArray = [];
        for (var i = 0; i < args.length; i++)
            argArray.push(args[i]);
        return argArray;
    },
    getFuncName : function(funcPath){
       var path = funcPath.split('.');
        return path[path.length-1];
    }
}