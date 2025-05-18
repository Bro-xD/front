<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { userInfo } from '$lib/stores/userInfo';

    let user = $userInfo ? JSON.parse($userInfo) : null;

    

    onMount(() => {
        if (!user) {
            goto('/login', { replaceState: true });
        }else{
            const currentUserId = user.user.id;
            goto(`/profil/${currentUserId}`, { replaceState: true });
        }
    });
</script>