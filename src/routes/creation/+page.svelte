<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { userInfo } from '$lib/stores/userInfo';
    

    let user = $userInfo ? JSON.parse($userInfo) : null;

    onMount(() => {
        if (!user) {
            goto('/login', { replaceState: true });
        }else{
            const refugeId = $page.params.id ?? user.user.id;
            goto(`/creation/${refugeId}`, { replaceState: true });
        }
    });
</script>

<svelte:head>
    <title> Création </title>
</svelte:head>