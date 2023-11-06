var fs = require('fs');

var file = __dirname + "/tables/user.json";
var bcrypt = require('bcrypt');

var userCreate = async function(firstName, lastName, username, password, role, gender, date, remember_me){
	
	var id = await getTableLastId() +1 || 1;
	var data = await getTableData();
	
	fs.writeFile(file, JSON.stringify([
			...data,
			{
				id: id,
				firstName: firstName,
				lastname: lastName,
				username: username,
				password: password,
				role: role,
				gender: gender,
				date: date,
				remember_me: remember_me
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

async function usernameIsUniq(username){
	var data = await getTableData();
	var isUniq = true;
	data.forEach((user)=>{
		
		if(user.username === username){
			isUniq = false;
		}
		
	})
	return isUniq;
}

async function userIsset(username, password){
	let users = await getTableData();
	let status = {};
	for(let i = 0; i<= users.length - 1; i++){
		if(users[i].username == username && await bcrypt.compare(password, users[i].password)){
			status.userIsset = true;
			status.user = users[i];
			return status;
		}else{
			status.userIsset = false;
		}
	}
	return status;
}

module.exports.userCreate = userCreate;
module.exports.usernameIsUniq = usernameIsUniq;
module.exports.getTableData = getTableData;
module.exports.userIsset = userIsset;