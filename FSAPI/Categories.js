var fs = require('fs');
var file = __dirname + "/tables/categories.json";

async function get(){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	if(data !== null){
		data = JSON.parse(data);
		return data;
	}
	return data;
}

module.exports.get = get;














// var like = async function(audio_id, user_id){
	
// 	var id = await getTableLastId() +1 || 1;
// 	var data = await getTableData();
// 	// console.log(data);
// 	if (data.length > 0) {
// 		fs.writeFile(file, JSON.stringify([
// 				...data,
// 				{
// 					id: id,
// 					audio_id: audio_id,
// 					user_id: user_id,
// 				}
// 			], null, 2), function(){
			
// 		});
// 	}else{
// 		fs.writeFile(file, JSON.stringify([
// 				{
// 					id: id,
// 					audio_id: audio_id,
// 					user_id: user_id,
// 				}
// 			], null, 2), function(){
			
// 		});
// 	}
	
// 	return id;
// }

// var unlike = async function(audio_id, user_id){
	
// 	var data = await getTableData();
// 	// console.log(data[0]);
// 	if (data.length > 0) {
// 		data = data.filter(function(a){ return a.audio_id != audio_id && a.user_id != user_id});
// 		// console.log(data);
// 		if (data.length > 0) {
// 			fs.writeFile(file, JSON.stringify([
// 					...data
// 				], null, 2), function(){
				
// 			});
// 		}else{
// 			fs.writeFile(file, JSON.stringify([
// 				], null, 2), function(){
				
// 			});
// 		}
// 	}else{
// 		return false;
// 	}
	
// 	return true;
// }


// async function getTableLastId(){
// 	var lastId = 0;
// 	var data = await getTableData();
// 	if(data){
// 		if (data.length !== 0) {
// 			lastId = data[data.length-1].id;
// 		}
// 		return lastId;
// 	}
// 	return 0;
// }


// async function getLikesCount(audio_id){
// 	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
// 	if(data !== null){
// 		data = JSON.parse(data);
// 		var result = data.filter(function(a){ return (a.audio_id == audio_id) });
// 		return data;
// 	}
// 	return data;
// }

// async function isLiked(audio_id, user_id){
// 	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
// 	if(data){
// 		data = JSON.parse(data);
// 		var result = data.filter(function(a){ return (a.audio_id == audio_id && a.user_id == user_id) })[0];
// 		// console.log(result);	
// 		if(result){
// 			return true;
// 		}
// 	}
// 	return false;
// }

// module.exports.like = like;
// module.exports.unlike = unlike;
// module.exports.isLiked = isLiked;
// module.exports.getLikesCount = getLikesCount;
