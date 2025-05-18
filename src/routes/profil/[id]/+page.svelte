<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { userInfo } from '$lib/stores/userInfo';

    import ReactionBar from './ReactionBar.svelte';

    import { T, useTask, useThrelte, Canvas } from "@threlte/core";
    import { OrbitControls, GLTF } from '@threlte/extras';

    import Granim from 'granim'; // Importation de Granim.js


    let user = $userInfo ? JSON.parse($userInfo) : null;
    let userId = $page.params.id ?? user.user.id;

    let refuge = $state(user?.refuge || null);

    onMount(() => {
        if (!user) {
            goto('/login', { replaceState: true });
        }else{
            const currentUserId = userId;
            goto(`/profil/${currentUserId}`, { replaceState: true });
        }

        // Initialiser Granim.js
        const granimInstance = new Granim({
            element: '#granim-canvas',
            direction: 'top-bottom', // Direction du gradient
            opacity: [1, 1],
            isPausedWhenNotInView: true,
            image : {
                source: '/images/desert.jpg',
                blendingMode: 'hard-light',
            },
            states: {
                'default-state': {
                gradients: [
                    [refuge?.primaryColor || '#834D9B', refuge?.secondaryColor || '#D04ED6'],
                    ['#1CD8D2', '#93EDC7'],
                ],
                transitionSpeed: 2000, // Vitesse de transition
                },
            },
        });

        // Nettoyer l'instance lors de la destruction du composant
        return () => {
            granimInstance.destroy();
        };
    });
</script>

{#if user}
    <div class="flex gap-5 style--bg">
        <div class="refuge-container w-[900px] mx-auto border-x border-gray-400 p-5 relative text-gray-600">

            <!-- Photo de couverture -->
            <div class="w-full h-[300px] relative"> 
                <canvas id="granim-canvas" style="position: absolute; width: 100%; height: 100%;" class="rounded-lg" ></canvas>
                <div class="c--refuge flex m-4 gap-4 ">
                    <div class="refuge--name text-4xl font-extrabold text-white">{refuge?.title}</div>
                    <button class="btn-refuge  ">Mon réfuge</button>
                </div>
            </div>
            <!-- Profil 3D -->
            
            <div class="w-[100px] h-[100px] flex justify-center -mt-16 ml-20">
                <div class="card--profil shadow-md">
                    <div class="card--profil2">
                        <Canvas class="">
                            <!-- Lumière -->
                            <T.AmbientLight intensity={0.6} />
                            <T.DirectionalLight position={[2, 2, 5]} intensity={1} />
                            <T.PerspectiveCamera fov={25} makeDefault position={[0, 1.5, 3]}>
                                <OrbitControls target={[0, 0.9, 0]} autoRotate autoRotateSpeed={5} />
                            </T.PerspectiveCamera>
                            <GLTF url={user?.user?.avatarConfig || '/avatars/character-female-a.glb'} scale={1} position={[0, 0.5, 0]} />
                        </Canvas>
                    </div>
                </div>
            </div>
    
            <div class="flex flex-col gap-5 mt-5">
                <div class="text-center">
                    <span class="animated-gradient-text"> "{user.refuge?.story}" </span>
                </div>
            </div>
    
            <div class="refuge">
                <ReactionBar />
            </div>
        </div>
    </div>
{/if}

<style>

    .style--bg{
		background:
			linear-gradient(-90deg, rgba(0,0,0,.05) 1px, transparent 1px),
			linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), 
			linear-gradient(-90deg, rgba(0, 0, 0, .04) 1px, transparent 1px),
			linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px),
			linear-gradient(transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px),
			linear-gradient(-90deg, #aaa 1px, transparent 1px),
			linear-gradient(-90deg, transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px),
			linear-gradient(#aaa 1px, transparent 1px),
			#f2f2f2;
		background-size:
			4px 4px,
			4px 4px,
			80px 80px,
			80px 80px,
			80px 80px,
			80px 80px,
			80px 80px,
			80px 80px;
		background-position: -40px -40px;
	}
    .refuge-container {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        background-color: white;
    }

    .refuge-container div {
        position: relative;
        z-index: 1;
    }

    /* carrd profil */
    .card--profil {
        width: 100%;
        height: 100%;
        background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
        border-radius: 20px;
        transition: all .3s;
    }

    .card--profil2 {
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 20px;
        transition: all .2s;
    }

    .card--profil2:hover {
        transform: scale(0.98);
        border-radius: 20px;
    }

    .card--profil:hover {
        box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.30);
    }

    .animated-gradient-text {
      font-size: 60px;
      font-weight: bold;
      background: linear-gradient(270deg, #ff0080, #00b7ff);
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 6s ease infinite;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
/*  */

    /* btn refuge */
    .btn-refuge {
        --clr-font-main: hsla(0 0% 20% / 100);
        --btn-bg-1: hsla(194 100% 69% / 1);
        --btn-bg-2: hsla(217 100% 56% / 1);
        --btn-bg-color: hsla(360 100% 100% / 1);
        --radii: 0.5em;
        cursor: pointer;
        padding: 0.9em 1.4em;
        min-width: 120px;
        min-height: 24px;
        font-size: var(--size, 1rem);
        font-weight: 500;
        transition: 0.8s;
        background-size: 280% auto;
        background-image: linear-gradient(
            325deg,
            var(--btn-bg-2) 0%,
            var(--btn-bg-1) 55%,
            var(--btn-bg-2) 90%
        );
        border: none;
        border-radius: var(--radii);
        color: var(--btn-bg-color);
        box-shadow:
            0px 0px 20px rgba(71, 184, 255, 0.5),
            0px 5px 5px -1px rgba(58, 125, 233, 0.25),
            inset 4px 4px 8px rgba(175, 230, 255, 0.5),
            inset -4px -4px 8px rgba(19, 95, 216, 0.35);
    }

    .btn-refuge:hover {
        background-position: right top;
    }

    .btn-refuge:is(:focus, :focus-visible, :active) {
        outline: none;
        box-shadow:
            0 0 0 3px var(--btn-bg-color),
            0 0 0 6px var(--btn-bg-2);
    }

    @media (prefers-reduced-motion: reduce) {
        .btn-refuge {
            transition: linear;
        }
    }

    .c--refuge{
        position: absolute!important;
        bottom: 0;
        right: 0;
        margin: 1rem;
    }

</style>