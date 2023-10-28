let usernameTag = document.querySelector("#nav-right");
fetch("/session-user")
	.then(data=>data.json())
	.then(async (user) => {
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
			await navbarDropedown();
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
		}else{
			usernameTag.innerHTML = `
				<a href="/login">Login</a>
			`;
		}
		
	}).catch((error) => {
	  	fetch("/cookie-user")
			.then(data=>data.json())
			.then(async (user) => {
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
								</a>
								<a href="/settings">
									<i class="fa fa-cog"></i>
									settings
								</a>
							</div>
						</div>
					`;
					await navbarDropedown();
					let accountLink = document.querySelector("#account-link");
					accountLink.innerHTML += `${user.firstName} ${user.lastname}`;
					accountLink.setAttribute("href", `/account/${user.id}`);
					if(user.role === "admin"){
						let navbar_user_dropedown_menu = document.getElementById('navbar-user-dropedown-menu');
						let dashboardLink = document.createElement("a");
						dashboardLink.setAttribute("href", "/dashboard");
						dashboardLink.innerText = "Dashboard";
						navbar_user_dropedown_menu.prepend(dashboardLink);
					}
				}else{
					usernameTag.innerHTML = `
						<a href="/login">Login</a>
					`;
				}
				
			});
	});




async function navbarDropedown(){
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
}
var url = window.location.pathname.slice(1).split("/");
var id = parseInt(url[1]);


fetch(`/audio/${id}`)
	.then(data => data.json())
	.then(async (audio) => {
		const contentContainer = $("#content");
		const audioPlayer = $("#audioPlayer");
		audioPlayer.attr("src", `/uploads/${audio.audio}`);
		$("#audioData").html(`
			${audio.singer} - ${audio.title}
		`);
		var audios = await getAudios();
		var sidebar = $("#sidebar");
		$.each(audios, function( index, audio ) {
			sidebar.append(`
				<div class="sidebarMusicCards">
					<div class="sidebarMusicPoster"></div>
					<a class="sidebarMusicLink" href='/listen/${audio.id}'>${audio.title}</a>
				</div>
			`);
			$(document).ready( async function(){
				$(".sidebarMusicPoster").width('40%');
				let sidebarMusicPosterWidth = $(".sidebarMusicPoster").width();

				let height = sidebarMusicPosterWidth - ((sidebarMusicPosterWidth * 40) / 100);
				$(".sidebarMusicPoster").height(height);
			});
			$( window ).on( "resize", async function() {
			  	$(".sidebarMusicPoster").width('40%');
				let sidebarMusicPosterWidth = $(".sidebarMusicPoster").width();

				let height = sidebarMusicPosterWidth - ((sidebarMusicPosterWidth * 40) / 100);
				$(".sidebarMusicPoster").height(height);
			});
			document.getElementsByClassName("sidebarMusicPoster")[index].style.backgroundImage = `url("/uploads/${audio.poster}")`;
			$(".sidebarMusicPoster").css("background-size", 'cover');
			$(".sidebarMusicPoster").css("background-position", 'center');
		});
		if($('#audioPlayer')){
			$('#audioPlayer').on('ended', async function() {
	   			await audioEnded();
			});
		}
		let sidebarMusicLinks = await getSidebarMusicLinks();
		$.each(sidebarMusicLinks, function( index, sidebarMusicLink ) {
			console.log(sidebarMusicLink);
			sidebarMusicLink.addEventListener("click", function(){
				localStorage.setItem("index", index+1);
			});
		});
		
	})






async function getAudios(){
	var audios = await fetch("/audios");
	audios = await audios.json();
	audios = audios.slice(0, 6);
	audios = audios.reverse();
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


