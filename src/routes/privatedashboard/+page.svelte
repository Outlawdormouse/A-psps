<script>
	import AuthReset from '../../components/AuthReset.svelte';
	import { auth } from '../../lib/firebase/firebase.client';
	import { authHandlers, authStore } from '../../stores/authStore';
	import { getDatabase, onValue, ref } from 'firebase/database';
	import { Slidy } from 'svelte-slidy';

	const db = getDatabase();
	const usersRef = ref(db, 'users/');
	let currID;
	let accounts = []; // json con tutti gli account per inserirli nelle cards
	let scrollX = 0; // posizione orizzontale dello scorrimento
	let loading = false;
	let currentUser = [];

	
	authStore.subscribe((curr) => {
		console.log('CURR', curr);
		currID = curr?.currentUser?.uid;
	});

	onValue(usersRef, (snapshot) => {
		const data = snapshot.val();
		console.log(data);
		//for per riscrivere gli elementi nella forma: { id: 1, name: 'What is Slidy?', animalDescription: 'SLIDY – simple configurable carousel component on SvelteJS', src: 'https://picsum.photos/900/900.webp?random=1' },
		for (const [key, value] of Object.entries(data)) {
			if(key != currID){
				accounts.push({ id: key, animal: value.animal, animalDescription: value.animal_describtion, animalAge: value.animal_age, animalName: value.animal_name, src: value.animal_image, mail: value.email, name: value.username, gender: value.animal_gender });
			}else{
				currentUser.push({id: key, animal: value.animal, animalDescription: value.animal_describtion, animalAge: value.animal_age, animalName: value.animal_name, src: value.animal_image, mail: value.email, name: value.username, gender: value.animal_gender})
				console.log("current", currentUser);
			}
		}
		console.log(accounts);
		loading = true;
		
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

	function privatePage(){
		window.location.href = '/privatePage';
	}

</script>

<svelte:window bind:scrollX />

{#if $authStore.currentUser && loading}
	<div class="container">
		<div>
			<nav class = "navbar">
				<ul>
					<li><img src = "logo.png" alt="logo" class="logo"/></li>
					<button on:click={privatePage}>Account</button>
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
					<button on:click={()=>{window.location.href = '/anotherAccountPage/' + item.id}} class="changePage">visualizza</button>
				</article>
			</div>
		</Slidy>
	</div>
{:else}
	<div>Loading....</div>
{/if}

<style>

	.changePage{ 
			background-color: #ff0000; 
			color: white; 
			padding: 10px 20px; 
			border-radius: 5px; 
			border: none;
			cursor: pointer; 
			margin-top: 20px; 
		} 
	
	.changePage:hover { 
			background-color: rgb(218, 3, 3); 
		} 
	
	.container {
        width: 100%;
        height: 100%;
    }

    .navbar {
        display: flex;
        height: 50px;
        background-color: #f8f9fa;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }

    .navbar ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin: 0 auto;
        padding: 0 20px;
    }

    .navbar li:first-child {
        margin-right: auto;
    }

    .navbar li:last-child {
        margin-left: auto;
    }

    .logo {
        width: 65px;
        height: auto;
        margin-right: 10px;
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
	@media screen and (min-width: 300px) {
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
		padding: 2rem;
	}
	.slide img {
		max-height: 300px;
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
