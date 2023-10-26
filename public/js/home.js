let usernameTag = document.querySelector("#username");

fetch("/session-user")
	.then(data=>data.json())
	.then(user => {
		if(user){
			usernameTag.setAttribute("href", `/account/${user.id}`);
			usernameTag.innerHTML = `
				<i class="fa fa-user"></i>&nbsp;
				${user.firstName} ${user.lastname}
			`;
		}
		
	}).catch((error) => {
	  	fetch("/cookie-user")
			.then(data=>data.json())
			.then(user => {
				console.log(user);
				usernameTag.setAttribute("href", `/account/${user.id}`);
				usernameTag.innerHTML = `
					<i class="fa fa-user"></i>&nbsp;
					${user.firstName} ${user.lastname}
				`;
			});
	});
document.addEventListener("DOMContentLoaded", (event) => {
	document.getElementById('open-post-file-input').addEventListener('click', () => {
		document.getElementById('post-file-input').click();
	})
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
	
	
});
