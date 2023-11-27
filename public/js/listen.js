let usernameTag = document.querySelector("#nav-right");
$(document).ready(async function(){
	var url = window.location.pathname.slice(1).split("/");
	var id = parseInt(url[1]);

	let session_user = await sessionUser();

	let audios = await getAudios();

	await navbarDropedown(session_user);
	await setSidebarMusicLinks(audios);

	let audio = await getAudio(id);
	let likesCount = await getLikesCount(id);
	if(! await isLiked(id)){
		$("#likeForm").html("");
		$("#likeForm").html(`
			<span id="like">
				<i class="fa fa-thumbs-up"></i>
				<sub>${likesCount}</sub>
			</span>
		`);
	}else{
		$("#likeForm").html("");
		$("#likeForm").html(`
			<span id="unlike">
				<i class="fa fa-thumbs-up" style="color: green;"></i>
				<sub>${likesCount}</sub>
			</span>
		`);
	}
	
	// await getLikesCount(id);
	// console.log(session_user);
	// $("#like").click(async function(){
	// 	alert(11);
	// 	await like(id,1);
	// 	await isLiked(id);
	// });
	// $("#unlike").click(async function(){
	// 	await unlike(id,1);
	// 	await isLiked(id);
	// });
	 //  	$("#like").click(async function(){
		// 	await like(id,1);
		// });
		// $("#unlike").click(async function(){
		// 	await unlike(id,1);
		// });

		$("#likeForm").click(async function(){
			if(! await isLiked(id)){
				await like(id,1);
			}else{
				await unlike(id,1);
			}
		});
});


async function drowAvatar(user_id){
	let avatar = await fetch(`/avatar/${user_id}`);
	avatar = await avatar.json();
	console.log(avatar);
	const navbarAvatar = document.getElementById("navbar-avatar");
	navbarAvatar.style.backgroundImage = `url('/avatars/${avatar.image}')`;
	navbarAvatar.style.backgroundSize = "cover";
	navbarAvatar.style.backgroundPosition = "center";
}
async function sessionUser(){
	let user = await fetch("/session-user");
	user = await user.json();
	return user;
}

async function navbarDropedown(user){
	
	if(user){
		usernameTag.innerHTML = `
			<div id="navbar-avatar"></div>
			<div id="navbar-user-dropedown">
				<i class="fa fa-caret-down" id="navbar-user-dropedown-icon"></i>
				<div id="navbar-user-dropedown-menu">
					<a href="" id="account-link">
						<i class="fa fa-user"></i>
					</a>
					<a href="/logout">
						<i class="fa fa-sign-out"></i>
						logout
					</a><br>
					<a href="/settings">
						<i class="fa fa-cog"></i>
						settings
					</a>
				</div>
			</div>
		`;
		await drowAvatar(user.id);
		let accountLink = document.querySelector("#account-link");
		accountLink.innerHTML += `${user.firstName}`;
		accountLink.setAttribute("href", `/account/${user.id}`);
		if(user.role === "admin"){
			let navbar_user_dropedown_menu = document.getElementById('navbar-user-dropedown-menu');
			let dashboardLink = document.createElement("a");
			dashboardLink.setAttribute("href", "/dashboard");
			dashboardLink.innerText = "Dashboard";
			navbar_user_dropedown_menu.prepend(dashboardLink);
		}

		let navbar_user_dropedown_menu_state = false;

		document.getElementById('navbar-user-dropedown-icon').addEventListener('click', () => {
		if(navbar_user_dropedown_menu_state === false){
			navbar_user_dropedown_menu_state = true;
			document.getElementById('navbar-user-dropedown-menu').style.display = 'block';
		}else{
			navbar_user_dropedown_menu_state = false;
			document.getElementById('navbar-user-dropedown-menu').style.display = 'none';
		}
	});
	}else{
		usernameTag.innerHTML = `
			<a href="/login">Login</a>
		`;
	}
}


async function setSidebarMusicLinks(audios){
	var sidebar = $("#sidebar");
	$.each(audios, async function( index, audio ) {
		sidebar.append(`
			<div class="sidebarMusicCards">
				<div class="sidebarMusicPoster"></div>
				<a class="sidebarMusicLink" href='/listen/${audio.id}'>${audio.title}</a>
			</div>
		`);
		await drowSidebarMusicLinks(index, audio);
		let sidebarMusicLinks = await getSidebarMusicLinks();
		$.each(sidebarMusicLinks, function( index, sidebarMusicLink ) {
			sidebarMusicLink.addEventListener("click", function(){
				localStorage.setItem("index", index+1);
			});
		});
	});
}

async function drowSidebarMusicLinks(index, audio){
	$(".sidebarMusicPoster").width('40%');
	let sidebarMusicPosterWidth = $(".sidebarMusicPoster").width();

	let height = sidebarMusicPosterWidth - ((sidebarMusicPosterWidth * 40) / 100);
	$(".sidebarMusicPoster").height(height);
	$( window ).on( "resize", async function() {
	  	$(".sidebarMusicPoster").width('40%');
		let sidebarMusicPosterWidth = $(".sidebarMusicPoster").width();

		let height = sidebarMusicPosterWidth - ((sidebarMusicPosterWidth * 40) / 100);
		$(".sidebarMusicPoster").height(height);
	});
	document.getElementsByClassName("sidebarMusicPoster")[index].style.backgroundImage = `url("/uploads/${audio.poster}")`;
	$(".sidebarMusicPoster").css("background-size", 'cover');
	$(".sidebarMusicPoster").css("background-position", 'center');
}


async function getAudio(audio_id){
	let audio = await fetch(`/audio/${audio_id}`);
	audio = await audio.json();
	const contentContainer = $("#content");
	const audioPlayer = $("#audioPlayer");
	audioPlayer.attr("src", `/uploads/${audio.audio}`);
	$("#audioData").html(`
		${audio.singer} - ${audio.title}
	`);
	var audios = await getAudios();
	
	
	if($('#audioPlayer')){
		$('#audioPlayer').on('ended', async function() {
   			await audioEnded();
		});
	}
	return audio;
}
async function isLiked(id){
	let isLiked = await fetch(`/is-liked/${id}`);
	isLiked = await isLiked.json();
		
	let likesCount = await getLikesCount(id);
	// console.log(likesCount);
	// if(!isLiked){
	// 	$("#likeForm").html("");
	// 	$("#likeForm").html(`
	// 		<span id="like">
	// 			<i class="fa fa-thumbs-up"></i>
	// 			<sub>${likesCount}</sub>
	// 		</span>
	// 	`);
	// }else{
	// 	$("#likeForm").html("");
	// 	$("#likeForm").html(`
	// 		<span id="unlike">
	// 			<i class="fa fa-thumbs-up" style="color: green;"></i>
	// 			<sub>${likesCount}</sub>
	// 		</span>
	// 	`);
	// }
				
}
async function getLikesCount(audio_id){
	let count = await fetch(`/likes-count/${audio_id}`);
	count = await count.json();
	return count;
}

async function like(audio_id, user_id){
	let like = await fetch(`/like`, {
		method: "POST",
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({
	    	audio_id: audio_id,
	    	user_id: user_id
	    }),
	});
	like = await like.json();
	let likesCount = await getLikesCount(audio_id);
	$("#likeForm").html("");
		$("#likeForm").html(`
			<span id="unlike">
				<i class="fa fa-thumbs-up" style="color: green;"></i>
				<sub>${likesCount}</sub>
			</span>
		`);
	return like;
}

async function unlike(audio_id, user_id){
	let unlike = await fetch(`/unlike`, {
		method: "POST",
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({
	    	audio_id: audio_id,
	    	user_id: user_id
	    }),
	});
	unlike = await unlike.json();
	let likesCount = await getLikesCount(audio_id);
	$("#likeForm").html("");
		$("#likeForm").html(`
			<span id="like">
				<i class="fa fa-thumbs-up"></i>
				<sub>${likesCount}</sub>
			</span>
		`);
	return unlike;
}


async function getAudios(){
	var audios = await fetch("/audios");
	audios = await audios.json();
	audios = audios.reverse();
	audios = audios.slice(0, 7);
	return audios;
}

async function getSidebarMusicLinks(){
	return $('.sidebarMusicLink');
}


async function audioEnded(){
	let index;
	let sidebarMusicLinks = await getSidebarMusicLinks();

	console.log(localStorage.getItem("index"));
	if(localStorage.getItem("index") === null){
		index = 0;
		localStorage.setItem("index", 1);
		sidebarMusicLinks[index+1].click();
	}else{
		index = localStorage.getItem("index");
		if(index < sidebarMusicLinks.length){
			sidebarMusicLinks[index].click();
		}else{
			index = 0;
			sidebarMusicLinks[index].click();
		}
		index++;
		localStorage.setItem("index", index);

	}
	console.log(localStorage.getItem("index"));
}


