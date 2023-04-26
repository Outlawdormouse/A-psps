<script>
	import { authHandlers, authStore } from '../stores/authStore';
	import { onMount } from 'svelte';
	import { getDatabase, ref, set } from 'firebase/database'
	import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
	
	
	const storage = getStorage();

	let register = false;
	let email = '';
	let password = '';
	let confirmPassword = '';
	let animalRace = '';
	let animalName = '';
	let animalAge = '';
	let animalGender = '';
	let animalDescribtion = '';
	let animalImage = null;
	let nickname = '';
	let urlImage = '';

// controlla se l'utente è loggato e in caso lo reindirizza alla pagina privata
	onMount(async () => {
		await sleep(500);
		console.log("questo è onmount", $authStore.currentUser);
		pageChange();
	});

	function sleep(ms) {
    	return new Promise((resolve) => setTimeout(resolve, ms ?? 200));
  	}

	function pageChange() {
		if ($authStore.currentUser) {
			window.location.href = '/privatedashboard';
			
		}
	}

	async function controllo() {
		console.log("questo è onmount", $authStore.currentUser);
		
	}

	async function handleSubmit() {
		// controllo se i campi sono vuoti
		if (!email || !password || (register && !confirmPassword || register && !animalRace || register && !animalName || register && !animalAge || register && !animalGender || register && !animalDescribtion || register && !animalImage || register && !nickname)) {
			return;
		}
		// controllo se la password è uguale alla conferma password per la registrazione
		if (register && password === confirmPassword) {
			try {
				await authHandlers.signup(email, password);
				// se la registrazione va a buon fine carico l'immagine sullo storage e prendo l'url
				await tryToUploadImage();
			} catch (err) {
				console.log(err);
			}
		} else {
			// altrimenti faccio il login
			console.log('login')
			try {
				await authHandlers.login(email, password);
				pageChange();
			} catch (err) {
				console.log(err);
			}
		}
	}
	// funzione per registrare l'utente
	async function writeUserData(userId, name, email, aRace, aName, aAge, aGender, aDescribtion, imageUrl) {
		const db = getDatabase();
		set(ref(db, 'users/' + userId), {
			username: name,
			email: email,
			animal: aRace,
			animal_name: aName,
			animal_age: aAge,
			animal_gender: aGender,
			animal_describtion: aDescribtion,
			animal_image: imageUrl
		});
}

async function uploadImageToStorage(path, imageName) {
	const storageRef = refStorage(storage, imageName);
	const uploadTask = uploadBytesResumable(storageRef, path);
	console.log(path);
	console.log(uploadTask);
	uploadTask.on(
		'state_changed',
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		},
		(error) => {
			switch (error.code) {
				case 'storage/unauthorized':
					console.log('User doesn\'t have permission to access the object');
					break;
				case 'storage/canceled':
					console.log('User canceled the upload');
					break;
				case 'storage/unknown':
					console.log('Unknown error occurred, inspect error.serverResponse');
					break;
			}
		},
		() => {
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log('File available at', downloadURL);
				urlImage = downloadURL;
				// scrivo i dati dell'utente nel database
				writeUserData($authStore.currentUser.uid, nickname, email, animalRace, animalName, animalAge, animalGender, animalDescribtion, urlImage);
				register = !register;
			});
		}
	);
}

function getImageUrl(imageName) {
	const storageRef = refStorage(storage, imageName);
	getDownloadURL(storageRef).then((url) => {
		console.log("questo è l'url")
		console.log(url);
		animalImage = url;
	});
}

async function tryToUploadImage() {
	if (animalImage && nickname) {
		let imageName = nickname;
		await uploadImageToStorage(animalImage[0], imageName);
	}
}

</script>

<div class="container">
	<h1>{register ? 'Register' : 'Log in'}</h1>
	<form>
		<label>
			<input bind:value={email} type="email" placeholder="Email"/>
		</label>
		<label>
			<input bind:value={password} type="password" placeholder="Password" />
		</label>
		{#if register}
			<label>
				<input bind:value={confirmPassword} type="password" placeholder="Confirm Password" />
			</label>
			<label>
				<input bind:value={nickname} type="text" placeholder="Nickname" />
			</label>
			<label> 
				<input bind:value={animalRace} type="text" placeholder="which animal?">
			</label>
			<label>
				<input bind:value={animalName} type="text" placeholder="Animal Name">
			</label>
			<label>
				<input bind:value={animalAge} type="text" placeholder="Animal Age">
			</label>
			<label>
				<input bind:value={animalGender} type="text" placeholder="Animal gender">
			</label>
			<label>
				<input bind:value={animalDescribtion} type="text" placeholder="Animal describtion">
			</label>
			<label>
				<input type="file" name="image" accept="image/png" bind:files={animalImage}/>
			</label>
		{/if}
		<button on:click={handleSubmit}>Submit</button>
	</form>
	{#if register}
		<div
			on:click={() => {
				register = false;
			}}
			on:keydown={() => {}}
			class="register"
		>
			Already have an account?
			<p>Log in</p>
		</div>
	{:else}
		<div
			on:click={() => {
				register = true;
			}}
			on:keydown={() => {}}
			class = "register"
		>
			Don't have an account? <p>Sign Up</p>
		</div>
		<div
			on:click={() => {
				authHandlers.resetPassword(email)
			}}
			on:keydown={() => {}}
			class="forgot-password"
		>
			Forgot Password?
		</div>
	{/if}
</div>
<!-- <button on:click={controllo}>controll</button> -->

<style> 
	.container { 
			display: flex; 
			flex-direction: column; 
			align-items: center; 
			justify-content: center; 
			flex: 1; 
			background-color: #f2f2f2; 
			padding: 20px; 
			border-radius: 10px; 
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
		} 
		
	.container form { 
			display: flex; 
			flex-direction: column; 
			align-items: center; 
			width: 100%; 
		} 
	
	.container h1 { 
			text-align: center; 
			margin-bottom: 20px; 
		} 
	
	label { 
			display: flex; 
			flex-direction: column; 
			margin-bottom: 15px; 
			width: 100%; 
		} 
	
	input[type='email'], input[type='password'], input[type='text'] { 
			padding: 10px; 
			border-radius: 5px; 
			border: none; 
			background-color: #f6f6f6; 
		} 
	input[type="file"] {
		background-color: #f2f2f2;
		padding: 10px;
		border-radius: 5px;
	}
	
	button { 
			background-color: #007bff; 
			color: white; 
			padding: 10px 20px; 
			border-radius: 5px; 
			border: none;
			cursor: pointer; 
			margin-top: 20px; 
		} 
	
	button:hover { 
			background-color: #0069d9; 
		} 
	
	.register { 
			display: flex; 
			align-items: center; 
			margin-top: 20px; 
		} 
	
	.register p { 
			margin-left: 5px; 
			cursor: pointer; 
			color: #007bff; 
		} 
	
	.forgot-password { 
			margin-top: 10px; 
			cursor: pointer; 
			color: #007bff; 
			text-align: center; 
		} 
		
	.forgot-password:hover { 
			text-decoration: underline; 
		}

</style>
