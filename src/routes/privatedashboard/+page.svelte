<script>
	import AuthReset from '../../components/AuthReset.svelte';
	import { auth } from '../../lib/firebase/firebase.client';
	import { authHandlers, authStore } from '../../stores/authStore';

	let email;
	let accounts = []; // array di oggetti con proprietà image e details
	let scrollX = 0; // posizione orizzontale dello scorrimento
	authStore.subscribe((curr) => {
		console.log('CURR', curr);
		email = curr?.currentUser?.email;
	});
</script>

<svelte:window bind:scrollX />

{#if $authStore.currentUser}
	<div class="container">
		<div class="navbar">
			<nav>
				<ul>
					<li><img src="logo.png" alt="logo" class="logo" /></li>
					<li><a href="prenotazioni.php">Prenotazioni</a></li>
					<li><a href="inserimento.php">Account</a></li>
					<button on:click={authHandlers.logout}>Logout</button>
				</ul>
			</nav>
		</div>
		<h1>CURRENT USER: {email}</h1>
	</div>
{:else}
	<div>Loading....</div>
{/if}

<style>
	
div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    text-align: center;
}

.container {
    width: 100%;
    height: 100%;
}

.navbar {
    display: flex;
    align-items: center;
    height: 50px;
    background-color: #eee;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.logo {
    width: 100px;
    height: auto;
    margin-left: 10px;
}

nav ul {
	list-style: none;
	margin: 0;
	padding: 0;
    display: flex;
    justify-content: space-between; /* aggiunto per distribuire gli elementi */
    align-items: center; /* aggiunto per centrare gli elementi */
}

nav li {
	display: inline-block;
	margin-left: 20px; /* modificato per avere solo il margine a sinistra */
}

nav a {
	color: #333; /* modificato per avere un colore più scuro */
	text-decoration: none;
}

nav button {
	color: #333; /* modificato per avere un colore più scuro */
	text-decoration: none;
	background-color: transparent; /* aggiunto per rimuovere lo sfondo */
	border: none; /* aggiunto per rimuovere il bordo */
	cursor: pointer; /* aggiunto per avere l'effetto del puntatore */
	margin-left: 15px; /* aggiunto per avere un margine a destra */
}
</style>
