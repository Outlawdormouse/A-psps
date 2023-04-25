<script>
    import { authHandlers, authStore } from '../../stores/authStore';
	import { getDatabase, onValue, ref } from 'firebase/database';

    const db = getDatabase();
    const usersRef = ref(db, 'users/');
    let loading = false;
    let currentUser = [];
    let currID = '';

    authStore.subscribe((curr) => {
		console.log('CURR', curr);
		currID = curr?.currentUser?.uid;
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
                    <li><img src = "logo.png" alt="logo" class="logo"/></li>
                    <button on:click={home}>home</button>
                    <button on:click={authHandlers.logout}>Logout</button>
                </ul>
            </nav>
        </div>
        <div class="user-info">
            <h1>My Profile</h1>
            <div class="user-details">
                <div class="avatar"><img src="{currentUser[0].src}" alt="{currentUser.animal_name}"/></div>
                <div class="details">
                    <p><strong>Name:</strong> {currentUser[0].name}</p>
                    <p><strong>Email:</strong> {currentUser[0].mail}</p>
                    <p><strong>Animal Name:</strong> {currentUser[0].animalName}</p>
                    <p><strong>Animal Age:</strong> {currentUser[0].animalAge}</p>
                    <p><strong>Animal Gender:</strong> {currentUser[0].gender}</p>
                    <p><strong>Animal Description:</strong> {currentUser[0].animalDescription}</p>
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
        max-width: 1200px;
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

    .user-info {
        margin-top: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }
    nav button {
	color: #333;
	text-decoration: none;
	background-color: transparent;
	border: none; 
	cursor: pointer;
	margin-left: 15px; 
}
</style>