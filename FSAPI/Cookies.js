var fs = require('fs');

const set = async function(cookieName, data){
	var file = __dirname + "/cookies/" + cookieName + ".json";
	fs.writeFile(file, JSON.stringify(data, null, 2), function(){
		
	});
}

const get = async function(cookieName){
	var file = __dirname + "/cookies/" + cookieName + ".json";
    var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	if(data){
		data = JSON.parse(data);
	}else{
		data = null;
	}
	return data;		
}

const remove = async function(cookieName){
	var file = __dirname + "/cookies/" + cookieName + ".json";
	fs.writeFile(file, JSON.stringify(null), function(){
		return 1;
	});
	return 0;
}

module.exports.set = set;
module.exports.get = get;
module.exports.remove = remove;
