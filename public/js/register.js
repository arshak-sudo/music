document.querySelector("#rgisterForm").addEventListener("submit", async (event) => {
	event.preventDefault();
	const data = await serialize(document.querySelector("#rgisterForm"));
	console.log(data);
	fetch("/register", {
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
			alert("At least 3 Characters, max. 55 Characters");
		}else if(status.error_code === 2){
			alert("At least 3 Characters, max. 55 Characters");
		}else if(status.error_code === 3){
			alert("At least 4 Characters, max. 16 Characters, A-Za-z0-9");
		}else if(status.error_code === 4){
			alert("Username already exists");
		}else if(status.error_code === 5){
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