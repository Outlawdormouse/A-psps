<script>
	import { authHandlers, authStore } from '../stores/authStore';
	import { onMount } from 'svelte';

	let register = false;
	let email = '';
	let password = '';
	let confirmPassword = '';

	onMount(async () => {
		await sleep(500);
		console.log("questo è onmount", $authStore.currentUser);
		if ($authStore.currentUser) {
			window.location.href = '/privatedashboard';
			
		}
	});

	function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms ?? 200));
  }

	async function controllo() {
		console.log("questo è onmount", $authStore.currentUser);
		
	}

	async function handleSubmit() {
		if (!email || !password || (register && !confirmPassword)) {
			return;
		}
		console.log('register', register);
		console.log(password, confirmPassword);
		if (register && password === confirmPassword) {
			try {
				await authHandlers.signup(email, password);
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				await authHandlers.login(email, password);
			} catch (err) {
				console.log(err);
			}
		}
		if ($authStore.currentUser) {
			window.location.href = '/privatedashboard';
			
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
<button on:click={controllo}>controllo</button>

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
	
	input[type='email'], input[type='password'] { 
			padding: 10px; 
			border-radius: 5px; 
			border: none; 
			background-color: #f6f6f6; 
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
