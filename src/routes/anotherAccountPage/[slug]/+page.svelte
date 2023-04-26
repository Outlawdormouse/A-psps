<script>
    import { page } from '$app/stores';
    import { authHandlers, authStore } from '../../../stores/authStore';
	import { getDatabase, onValue, ref } from 'firebase/database';

    const db = getDatabase();
    const usersRef = ref(db, 'users/');
    let loading = false;
    let currentUser = [];
    let currID = '';

    authStore.subscribe((curr) => {
		console.log('CURR', curr);
		currID = $page.params.slug;
	});

    onValue(usersRef, (snapshot) => {
		const data = snapshot.val();
		console.log(data);
		//for per riscrivere gli elementi nella forma: { id: 1, name: 'What is Slidy?', animalDescription: 'SLIDY – simple configurable carousel component on SvelteJS', src: 'https://picsum.photos/900/900.webp?random=1' },
		for (const [key, value] of Object.entries(data)) {
			if(key == currID){
				currentUser.push({ id: key, animal: value.animal, animalDescription: value.animal_describtion, animalAge: value.animal_age, animalName: value.animal_name, src: value.animal_image, mail: value.email, name: value.username, gender: value.animal_gender });
			}
		}
        console.log(currentUser[0])
		loading = true;
		
	});

    function home(){
        window.location.href = '/privatedashboard';
    }

</script>

{#if $authStore.currentUser && loading}
    <div class = "container">
        <div>
            <nav class = "navbar">
                <ul>
                    <li><img src = "../logo.png" alt="logo" class="logo"/></li>
                    <button on:click={home}>Home</button>
                    <button on:click={authHandlers.logout}>Logout</button>
                </ul>
            </nav>
        </div>
        <div class="user-data">
            <h1>Hi i'm {currentUser[0].animalName}!</h1>
            <div class="card">
                <img src="{currentUser[0].src}" alt="{currentUser[0].animalName}" />
                <div class="card-text">
                    <h2>{currentUser[0].animalName}</h2>
                    <p>Animal: {currentUser[0].animal}</p>
                    <p>Description: {currentUser[0].animalDescription}</p>
                    <p>Age: {currentUser[0].animalAge}</p>
                    <p>Gender: {currentUser[0].gender}</p>
                    <p>Owner: {currentUser[0].name}</p>
                    <p>Email: {currentUser[0].mail}</p>
                </div>
            </div>
        </div>
    </div>
{:else}
	<div>Loading....</div>
{/if}

<style>

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

.user-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}

.card {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 50px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.card img {
    width: 50%;
    height: auto;
    object-fit: cover;
    object-position: center;
}

.card-text {
    width: 50%;
    padding: 20px;
}

.card-text h2 {
    font-size: 28px;
    margin-top: 0;
}

.card-text p {
    font-size: 16px;
    margin: 10px 0;
}


</style>
