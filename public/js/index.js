localStorage.removeItem("index");

async function drowAvatar(user_id){
	let avatar = await fetch(`/avatar/${user_id}`);
	avatar = await avatar.json();
	console.log(avatar);
	const navbarAvatar = document.getElementById("navbar-avatar");
	navbarAvatar.style.backgroundImage = `url('/avatars/${avatar.image}')`;
	navbarAvatar.style.backgroundSize = "cover";
	navbarAvatar.style.backgroundPosition = "center";
}

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
					await drowAvatar(user.id);
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

$(document).ready(async () => {
	var audios = await getAudios();
	const contentContainer = $("#content");
	$.each(audios, function( index, audio ) {
		var audioCard = document.createElement("div");
		audioCard.classList.add("audioCard");
		var audioCardPoster = document.createElement("div");
		audioCardPoster.classList.add("audioCardPoster");
		audioCardPoster.style.backgroundImage = `url('/uploads/${audio.poster}')`;
		audioCardPoster.style.backgroundSize = "cover";
		audioCardPoster.style.backgroundPosition = "center";
		var p = document.createElement("p");
		var audioLink = document.createElement("a");
		audioLink.classList.add("audioLink");
		audioLink.addEventListener("click", () => {
			localStorage.setItem("index", index + 1);
		});

		audioLink.setAttribute("href", `/listen/${audio.id}`);
		audioLink.innerText = `${audio.singer} - ${audio.title}`;

		p.append(audioLink);

		audioCard.append(p);
		audioCard.prepend(audioCardPoster);

	  	contentContainer.append(audioCard);

	  	$(document).ready(function(){
	  		$(".audioCard").width('30%');
			$(".audioCard").height('20vh');
			let audioCardWidth = $(".audioCard").width();

			let height = audioCardWidth - ((audioCardWidth * 25) / 100);
			$(".audioCard").height(height);
	  	});
	  	$( window ).on( "resize", function() {
		  	$(".audioCard").width('30%');
			$(".audioCard").height('20vh');
			let audioCardWidth = $(".audioCard").width();

			let height = audioCardWidth - ((audioCardWidth * 25) / 100);
			$(".audioCard").height(height);
		} );
  		
	});
	
});

async function getAudios(){
	var audios = await fetch("/audios");
	audios = await audios.json();
	audios = audios.reverse();
	audios = audios.slice(0, 6);
	return audios;
}

async function getAudioLinks(){
	return $('.audioLink');
}
