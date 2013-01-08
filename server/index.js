var express = require('express');
var handler = require('./requestHandlers');
var app = express();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);//要放在bodyParser之后，处理post
});

app.post('/init',function(req,res){
    handler.init(req,res);
});
app.post('/exec',function(req,res){
    handler.exec(req,res);
})
app.listen(8888);