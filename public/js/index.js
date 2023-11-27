window.onbeforeunload = function (event) {
    var message = 'Important: Please click on \'Save\' button to leave this page.';
    if (typeof event == 'undefined') {
        event = window.event;
    }
    fetch("/delete-session");
};

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
	const contentContainer = $("#content");
	const categories = await getCategories();
	$.each(categories, function( index, product ) {
		var productCard = document.createElement("div");
		productCard.classList.add("productCard");
		var productCardPoster = document.createElement("div");
		productCardPoster.classList.add("productCardPoster");
		productCardPoster.style.backgroundImage = `url('/img/product_images/${product.poster}')`;
		productCardPoster.style.backgroundSize = "cover";
		productCardPoster.style.backgroundPosition = "center";
		var p = document.createElement("p");
		var productLink = document.createElement("a");
		productLink.classList.add("productLink");
		
		productLink.setAttribute("href", `/products/${product.name}`);
		productLink.innerText = `${product.name}`;

		p.append(productLink);

		productCard.append(p);
		productCard.prepend(productCardPoster);

	  	contentContainer.append(productCard);

	  	

	  	$(document).ready(function(){
	  		$(".productCard").width('30%');
			$(".productCard").height('20vh');
			let productCardWidth = $(".productCard").width();

			let height = productCardWidth - ((productCardWidth * 25) / 100);
			$(".productCard").height(height);
			if(screen.width < 361){
			$("#content").css("display", "block");
			$(".productCard").width('100%');
			$("#main").width('100%');
			$("#main").css("padding", "0");
		    $("#content").width('80%');
			$("#content").css("margin", "auto");

			let productCardWidth = $(".productCard").width();

			let height = productCardWidth - ((productCardWidth * 25) / 100);
			$(".productCard").height(height);
		}
	  	});
	  	$( window ).on( "resize", function() {
		  	$(".productCard").width('30%');
			$(".productCard").height('20vh');
			let productCardWidth = $(".productCard").width();

			let height = productCardWidth - ((productCardWidth * 25) / 100);
			$(".productCard").height(height);

			var x = window.matchMedia("(max-width: 360px)")
			mediaQuery(x) // Call listener function at run time
			x.addListener(mediaQuery) // Attach listener function on state changes
		} );

		function mediaQuery(x) {
			if (x.matches) { // If media query matches
				$("#content").css("display", "block");
				$(".productCard").width('100%');
				$("#main").width('100%');
				$("#main").css("padding", "0");
			    $("#content").width('80%');
				$("#content").css("margin", "auto");

				let productCardWidth = $(".productCard").width();

				let height = productCardWidth - ((productCardWidth * 25) / 100);
				$(".productCard").height(height);
			} else {
			    $("#content").css("display", "flex");
				// $(".productCard").width('100%');
				// $("#main").width('100%');
				$("#main h5").css("padding", "10px 20px 0 20px");
			 //    $("#content").width('80%');
				// $("#content").css("margin", "auto");

				let productCardWidth = $(".productCard").width();

				let height = productCardWidth - ((productCardWidth * 25) / 100);
				$(".productCard").height(height);
			}
		}



	});
	
});

async function getCategories(){
	var categories = await fetch("/categories");
	categories = await categories.json();
	return categories;
}

async function getProductLink(){
	return $('.productLink');
}
