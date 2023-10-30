let usernameTag = document.querySelector("#nav-right");
var url = window.location.pathname.slice(1).split("/");
let user_id = parseInt(url[1]);

async function drowAvatar(){
	console.log(user_id);
	let avatar = await fetch(`/avatar/${user_id}`);
	avatar = await avatar.json();
	console.log(avatar);
	const navbarAvatar = document.getElementById("navbar-avatar");
	navbarAvatar.style.backgroundImage = `url('/avatars/${avatar.image}')`;
	navbarAvatar.style.backgroundSize = "cover";
	navbarAvatar.style.backgroundPosition = "center";
}
fetch("/session-user")
	.then(data=>data.json())
	.then(async (user) => {
		if(user){
			if(user_id !== user.id){
				$("#add_new-avatar").hide();
			}
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
			await drowAvatar()
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
					if(user_id !== user.id){
						$("#add_new-avatar").hide();
					}
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
					await drowAvatar()
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