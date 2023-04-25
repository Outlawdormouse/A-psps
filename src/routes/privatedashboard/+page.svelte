<script>
	import AuthReset from '../../components/AuthReset.svelte';
	import { auth } from '../../lib/firebase/firebase.client';
	import { authHandlers, authStore } from '../../stores/authStore';
	import { getDatabase, onValue, ref } from 'firebase/database';
	import { Slidy } from 'svelte-slidy';

	const db = getDatabase();
	const usersRef = ref(db, 'users/');
	let email;
	let accounts = []; // json con tutti gli account per inserirli nelle cards
	let scrollX = 0; // posizione orizzontale dello scorrimento
	
	authStore.subscribe((curr) => {
		console.log('CURR', curr);
		email = curr?.currentUser?.email;
	});

	onValue(usersRef, (snapshot) => {
		const data = snapshot.val();
		console.log(data);
		//for per riscrivere gli elementi nella forma: { id: 1, name: 'What is Slidy?', animalDescription: 'SLIDY – simple configurable carousel component on SvelteJS', src: 'https://picsum.photos/900/900.webp?random=1' },
		for (const [key, value] of Object.entries(data)) {
			accounts.push({ id: key, animal: value.animal, animalDescription: value.animal_describtion, animalAge: value.animal_age, animalName: value.animal_name, src: value.animal_image, mail: value.email, name: value.username, gender: value.animal_gender });
		}
		console.log(accounts);
	});

	const slidy_cards = {
		slides: accounts,
		wrap: {
			id: 'slidy_cards',
			width: '100vw',
			height: '100vh',
			padding: '50px 0 50px',
			align: 'middle',
			alignmargin: 0,
		},
		slide: {
			gap: 50,
			width: '80vw',
			height: '100vh',
			backimg: false,
			imgsrckey: 'src',
			objectfit: 'contain',
		},
		controls: {
			dots: true,
			dotsnum: true,
			dotsarrow: true,
			dotspure: true,
			arrows: false,
			keys: true,
			drag: true,
			wheel: true,
		},
		options: {
			axis: 'x',
			loop: true,
			duration: 350,
		}
	}
</script>

<svelte:window bind:scrollX />

{#if $authStore.currentUser}
	<div class="container">
		<div class="navbar">
			<nav>
				<ul>
					<li><img src = "logo.png" alt="logo" class="logo"/></li>
					<li><a href="prenotazioni.php">Prenotazioni</a></li>
					<li><a href="inserimento.php">Account</a></li>
					<button on:click={authHandlers.logout}>Logout</button>
				</ul>
			</nav>
		</div>
		<Slidy {...slidy_cards} let:item >
			
			<div class="slide">
				<img alt="{item.name}" src="{item.src}"/>
				<article>
					<h2>{item.animalName}</h2>
					<p>
						{item.animalName} è un {item.animal}
					</p>
					<p>
						{item.animalDescription}
					</p>
				</article>
			</div>
		</Slidy>
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
    width: 65px;
    height: auto;
    margin-left: 10px;
}

nav ul {
	list-style: none;
	margin: 0;
	padding: 0;
    display: flex;
    justify-content: space-between; 
    align-items: center; 
}

nav li {
	display: inline-block;
	margin-left: 20px; 
}

nav a {
	color: #333;
	text-decoration: none;
}

nav button {
	color: #333;
	text-decoration: none;
	background-color: transparent;
	border: none; 
	cursor: pointer;
	margin-left: 15px; 
}
@media screen and (min-width: 500px) {
		:global(#slidy_cards .slidy-ul li) {width: 70vw;}
	}	
	@media screen and (min-width: 600px) {
		:global(#slidy_cards .slidy-ul li) {width: 50vw;}
	}
	@media screen and (min-width: 700px) {
		:global(#slidy_cards .slidy-ul li) {width: 33vw;}
	}
	:global(#slidy_cards .slidy-ul li img) {
			transform: scale(1);
			transition: transform 350ms, box-shadow 350ms;
	}
	:global(#slidy_cards .slidy-ul li) {overflow: visible}
	:global(#slidy_cards .slidy-ul li.active img) {
			transform: scale(1.15);
			box-shadow: 0 14px 25px rgba(0, 0, 0, 0.36);
	}
	:global(body) { margin: 0; padding: 0}
	.slide {
		position: relative;
		display: flex;
		flex-flow: column;
		text-align: center;
		align-content: center;
		justify-content: center;
		height: 100%;
		border-radius: 1rem;
	}
	.slide img {
		max-height: 200px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		vertical-align: middle;
		object-fit: cover;
		position: relative;
		z-index: 1;
		border-radius: 1rem;
		box-shadow: 0 14px 25px rgba(0, 0, 0, 0.16);
	}
	.slide article {
		padding: 1rem;
	}
	h1 {text-align: center;}
	h1 span {color: red}
</style>
