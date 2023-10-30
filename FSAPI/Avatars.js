var fs = require('fs');
var file = __dirname + "/tables/avatars.json";

var avatarCreate = async function(user_id, image, role){
	
	var id = await getTableLastId() +1 || 1;
	var data = await getTableData();

	var avatar = await getTableDataByUserId(user_id);

	if(avatar){
		data = data.map((a) => {
			if(a.id == avatar.id){
				a.role = "image";
			}
			return a;
		});
	}
	
	fs.writeFile(file, JSON.stringify([
			...data,
			{
				id: id,
				user_id: user_id,
				image: image,
				role: role,
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
async function getTableDataByUserId(user_id){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	data = JSON.parse(data);
	var result = data.filter(function(a){ return a.user_id == user_id && a.role == "avatar" })[0];
	return result;
}

module.exports.avatarCreate = avatarCreate;
module.exports.getTableData = getTableData;
module.exports.getTableDataByUserId = getTableDataByUserId;
