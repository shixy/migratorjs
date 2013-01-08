 
 var migrator_js_test = function(){
	this.a = 1;
	this.b = 2;
 }
 migrator_js_test.prototype.get_a = function(){
	return this.a;
 }
 migrator_js_test.prototype.mig_test = function(c){	
	return c+this.b+this.get_a();
 }
 
 
 
 $(function(){
	var cfg = {
		funcPath : 'migrator_js_test.prototype.mig_test',//需要迁移的方法在全局变量中的完整访问路径
		thisAttrs : ['b','get_a']//迁移方法在上下文中所依赖的一些变量(可以为函数如 ‘get_a’)
	}
	Migrator.migrateToServer(cfg);
 })
