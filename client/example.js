 
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
		funcPath : 'migrator_js_test.prototype.mig_test',//��ҪǨ�Ƶķ�����ȫ�ֱ����е���������·��
		thisAttrs : ['b','get_a']//Ǩ�Ʒ���������������������һЩ����(����Ϊ������ ��get_a��)
	}
	Migrator.migrateToServer(cfg);
 })
