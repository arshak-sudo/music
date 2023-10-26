var fs = require('fs');
var file = __dirname + "/tables/audios.json";

var audioCreate = async function(title, singer, poster, audio, genre){
	
	var id = await getTableLastId() +1 || 1;
	var data = await getTableData();
	
	fs.writeFile(file, JSON.stringify([
			...data,
			{
				id: id,
				title: title,
				singer: singer,
				poster: poster,
				audio: audio,
				genre: genre,
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
async function getTableData(){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	data = JSON.parse(data);
	return data;
}
async function getTableDataById(id){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	data = JSON.parse(data);
	var result = data.filter(function(a){ return a.id == id })[0];
	return result;
}

module.exports.audioCreate = audioCreate;
module.exports.getTableData = getTableData;
module.exports.getTableDataById = getTableDataById;
