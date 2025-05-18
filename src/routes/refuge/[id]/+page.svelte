<script>
    import Refuge from '$lib/games/Refuge/root.svelte'
    import { page } from '$app/stores';
    import { userInfo } from '$lib/stores/userInfo';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    import { connectToRefugeRoom } from '$lib/colyseus';

    let user = $userInfo ? JSON.parse($userInfo) : null;

    onMount(()=>{

        if(!user){
            goto('/login', { replaceState: true });
        }else{
            let refugeId = $page.params.id ?? user.user.id;
            connectToRefugeRoom(refugeId, user.user.id);
        }
    })
</script>

<svelte:head>
    <title> Refuge </title>
</svelte:head>

<div class="w-screen h-screen flex justify-center items-center relative">
    <Refuge />
</div>
