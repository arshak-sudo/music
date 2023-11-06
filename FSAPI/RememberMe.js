var fs = require('fs');

var file = __dirname + "/cookies/remember_me.json";

var rememberCreate = async function(remember_me){
	fs.writeFile(file, remember_me, function(){
		
	});
}

async function get(){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	return data;
}


module.exports.rememberCreate = rememberCreate;
module.exports.get = get;
