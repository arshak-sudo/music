document.querySelector("#loginForm").addEventListener("submit", async (event) => {
	event.preventDefault();
	const data = await serialize(document.querySelector("#loginForm"));
	console.log(data);
	fetch("/login", {
		method: "post",
		headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(data=>data.json())
	.then(status=>{
		if(status.error_code === 1){
			alert("At least 4 Characters, max. 16 Characters, A-Za-z0-9");
		}else if(status.error_code === 2){
			alert("Password::At least 4 Characters, max. 16 Characters, A-Za-z0-9");
		}else{
			window.location.href = "/";
		}
	});
});

async function serialize(form) {
	const formEntries = new FormData(form).entries();
	const json = Object.assign(...Array.from(formEntries, ([x,y]) => ({[x]:y})));
	json.rememberMe = document.querySelector("#rememberMe").checked;
	return json;
}

fetch("/cookie-user")
	.then(data=>data.json())
	.then(user => {
		console.log(user);
	});