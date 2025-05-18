<script>
    import { T, useTask, useThrelte, Canvas } from "@threlte/core";
    import { OrbitControls, GLTF } from '@threlte/extras';
    import { Vector3 } from 'three';
    import api from '$lib/api';
    import { userInfo } from '$lib/stores/userInfo';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let step = $state(0);

    const avatars = [
        '/avatars/character-female-a.glb',
        '/avatars/character-female-b.glb',
        '/avatars/character-male-a.glb',
        '/avatars/character-male-b.glb'
    ];

    let refugeName = $state("");
    let vibe = $state('drama');
    let story = $state('');

    let currentIndex = $state(0);
    let currentAvatar = $state(avatars[currentIndex]);

    let username = $state('');
    let password = $state('');

    let loginUsername = $state('');
    let loginPassword = $state('');

    async function login() {
        try {
            const response = await api.post('api/login', {
                json: { username: loginUsername, password: loginPassword }
            }).json();

            if (response.success) {
                // stocker info utilisateur
                userInfo.set(JSON.stringify(response.user));
                // rediriger vers profil
                goto('/profil', { replaceState: true });
            } else {
                alert('Nom d’utilisateur ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Erreur lors de la connexion');
        }
    }

    // fonction pour passer à l'inscription si pas encore inscrit
    function goToRegister() {
        step = 1; 
    }

    function next() {
        currentIndex = (currentIndex + 1) % avatars.length;
        currentAvatar = avatars[currentIndex];
    }

    function prev() {
        currentIndex = (currentIndex - 1 + avatars.length) % avatars.length;
        currentAvatar = avatars[currentIndex];
    }

    async function createRefuge() {
        const data = {
            username,
            password,
            avatar: currentAvatar,
            refugeName,
            vibe,
            story,
        };

        try {
            const response = await api.post('api/create/refuge', {
                json: data
            }).json(); // si le serveur renvoie du JSON

            console.log('Refuge créé !', response);
            // éventuellement : router vers une autre page
            userInfo.set(JSON.stringify(response));
            goto('/profil', { replaceState: true });
        } catch (error) {
            console.error('Erreur lors de la création du refuge :', error);
        }
    }

    const buttonTexts = {
        1: { next: "Suivant", prev: "" },
        2: { next: "Suivant", prev: "Précédent" },
        3: { next: "Créer le refuge", prev: "Précédent" }
    };

    let canContinue = $derived.by(() => {
        if (step === 1) return username.trim() !== '' && password.trim() !== '';
        if (step === 2) return true;
        if (step === 3) return refugeName.trim() !== '' && vibe !== '' && story.trim() !== '';
        return false;
    });

    onMount(() => {
        /*if (userInfo) {
            goto('/profil', { replaceState: true });
        }*/
    });
</script>


<svelte:head>
    <title> Inscription </title>
</svelte:head>



<div class="w-screen h-screen overflow-auto flex justify-center items-center pb-2">
    <div class="flex flex-col gap-5 w-[500px] max-w-[500px] max-h-[500px] ">
        <!-- Step 1 : username et mot de passe -->
        <div class="flex flex-col gap-5">
            {#if step > 0}
                <span class="text-underline text-xl font-bold border-b border-gray-400 w-max " >Etape {step}</span>
            {/if}
            {#if step == 0}
                <span class="text-underline text-xl font-bold border-b border-gray-400 w-max " >CONNEXION</span>
                <p class="text-gray-600 text-xl">Chaisissez votre nom de réfugié et votre cle de refuge</p>
            {/if}
            {#if step == 1}
                <p class="text-gray-600 text-xl">Choisis un nom de réfugié et une cle de refuge</p>
            {/if}
            {#if step == 2}
                <p class="text-gray-600 text-xl">Choisis le profils qui te correspond le mieux (ou pas)</p>
                <p class="text-xs">(Clique gauche pour tourner autour, clique droit pour deplacer la vue, scroll pour zoomer/dézoomer)</p>
            {/if}
            {#if step == 3}
                <p class="text-gray-600 text-xl">Créer votre refuge</p>
            {/if}
        </div>

        {#if step === 0}
            <div>
                <div class="flex flex-col gap-5 w-full">
                    <div class="flex flex-col gap-2">
                        <label for="username">Votre nom de Réfugié</label>
                        <input class="toon-input" type="text" placeholder="Nom de Réfugié" bind:value={loginUsername} />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">La cle de votre refuge</label>
                        <input class="toon-input" type="password" placeholder="Cle de refuge" bind:value={loginPassword} />
                    </div>
                </div>
                <div class="flex justify-between mt-4">
                    <button  class="toon-button" onclick={login} disabled={!loginUsername || !loginPassword}>Se connecter</button>
                    <button class="toon-button" onclick={goToRegister}>Créer un nouveau compte</button>
                </div>
            </div>
        {/if}
        <!-- pas de form -->
        {#if step == 1}
            <div class="flex flex-col gap-5 w-full">
                <div class="flex flex-col gap-2">
                    <label for="username">Votre nom de Réfugié</label>
                    <input class="toon-input" type="text" placeholder="Nom de Réfugié" bind:value={username} />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="password">La cle de votre refuge</label>
                    <input class="toon-input" type="password" placeholder="Cle de refuge" bind:value={password} />
                </div>
            </div>
        {/if}

        <!-- Step 2 : avatar -->
        {#if step == 2}
        <div class="flex flex-col gap-5">
            <div class="w-full h-[300px] flex justify-center border border-gray-400 rounded items-center relative">
                <Canvas class=" bg-gray-800 rounded-xl border shadow-md">
                    <!-- Lumière -->
                    <T.AmbientLight intensity={0.6} />
                    <T.DirectionalLight position={[2, 2, 5]} intensity={1} />
                    <T.PerspectiveCamera fov={25} makeDefault position={[0, 1.5, 3]}>
                        <OrbitControls target={[0, 0.9, 0]} autoRotate autoRotateSpeed={5} />
                    </T.PerspectiveCamera>
                    <GLTF url={currentAvatar} scale={1} position={[0, 0.5, 0]} />
                </Canvas>

                <!-- BOUTON PRÉCÉDENT -->
                <button
                    class="toon-button absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:text-gray-500  shadow-md p-2 rounded-full text-gray-400"
                    onclick={prev}
                >
                    <!-- Icône flèche gauche -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <!-- BOUTON SUIVANT -->
                <button
                    class="toon-button absolute right-4 top-1/2 -translate-y-1/2 bg-white/80  hover:text-gray-500  shadow-md p-2 rounded-full text-gray-400"
                    onclick={next}
                >
                    <!-- Icône flèche droite -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
        {/if}

        <!-- step 3 : Creation du refuge -->
        {#if step == 3}
        <div class="flex flex-col gap-5 w-full">
            <div class="flex flex-col gap-2">
                <label for="refugeName">Nom de votre refuge</label>
                <input class="toon-input" type="text" placeholder="Nom de refuge" bind:value={refugeName} />
            </div>

            <div class="flex flex-col gap-2">
                <label for="vibe">Ton état d'esprit en entrant dans le refuge</label>
                <div class="relative w-max">
                    <select class="toon-input appearance-none" bind:value={vibe}>
                        <option disabled selected value="">Choisis un thème</option>
                        <option value="drama">🎭 Dramatique</option>
                        <option value="humor">😂 Humoristique</option>
                        <option value="melancholy">😔 Mélancolique</option>
                        <option value="cringe">😬 Cringe</option>
                        <option value="zen">🧘 Zen</option>
                    </select>
                    <div class="absolute right-3 top-3 text-gray-500 pointer-events-none">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label for="story" class="font-medium">Un fragment de toi à partager ?</label>
                <textarea
                    id="story"
                    class="toon-input min-h-[100px]"
                    placeholder="Tu peux écrire ce que tu ressens, ce que tu fuis, ou ce que tu espères..."
                    bind:value={story}
                ></textarea>
            </div>
        </div>
        {/if}

        {#if step > 0}
            <div class="flex">
                {#if step > 1}
                    <button class="toon-button" onclick={() => step--}> {buttonTexts[step]?.prev}</button>
                {/if}
                <span class="flex-grow"></span>
                <button class="toon-button"
                    disabled={!canContinue} 
                    onclick={() => {
                            if (step === 3) {
                                createRefuge();
                            } else {
                                step++;
                        }
                }}>{buttonTexts[step].next}</button>
            </div>
        {/if}

    </div>
</div>



<style >
@reference "tailwindcss/theme";

/*  */
.toon-button {
    @apply cursor-pointer;
    @apply p-2  px-5 rounded-lg;

    @apply ring-2 ring-purple-500 ring-offset-0;
    transition: all 0.2s ease-out;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.152) 10%, transparent 10%);
    background-size: 10px 10px;
}

.toon-button:hover,.toon-button:focus{
    @apply ring-offset-4 bg-purple-50;
}

.toon-button span{
    @apply font-semibold text-purple-700;
    text-shadow: 0 0 1px white;
}



.toon-input{
    @apply ring-2 ring-gray-400 ring-offset-0;
    @apply p-2 px-3 rounded-lg outline-none font-semibold;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.152) 10%, transparent 10%);
    background-size: 10px 10px;
}

.toon-input:focus{
    transition: all 0.2s ease-out;
    @apply ring-1 bg-purple-50 ring-purple-400 ring-offset-4;
}

.text-underline{
    @apply relative z-50;
}
.text-underline:after {
    width: 100%;
    height: 30%;
    @apply bg-purple-500;
    transform: translateY(-30%);
    opacity: 0.5;
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    /* top: 0; */
    z-index: -10;
}

.toon-button:disabled {
     @apply ring-1 ring-purple-100 ring-offset-4 text-gray-300;
}

label{
    @apply font-normal;
}
select{
    @apply w-[240px] ;
}

</style>