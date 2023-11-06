var fs = require('fs');
var file = __dirname + "/tables/likes.json";

var like = async function(audio_id, user_id){
	
	var id = await getTableLastId() +1 || 1;
	var data = await getTableData();
	
	fs.writeFile(file, JSON.stringify([
			...data,
			{
				id: id,
				audio_id: audio_id,
				user_id: user_id,
			}
		], null, 2), function(){
		
	});
	return id;
}

async function getTableLastId(){
	var lastId = 0;
	var data = await getTableData();
	if (data.length !== 0) {
		lastId = data[data.length-1].id;
	}
	return lastId;
}
async function getTableData(audio_id){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	data = JSON.parse(data);
	data = data.filter(function(a){ return a.audio_id == audio_id});
	// console.log(data);
	return data;
}
async function isLiked(audio_id, user_id){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	data = JSON.parse(data);
	var result = data.filter(function(a){ return (a.audio_id == audio_id && a.user_id == user_id) })[0];
	// console.log(result);	
	return result;
}

module.exports.like = like;
module.exports.getTableData = getTableData;
module.exports.isLiked = isLiked;
