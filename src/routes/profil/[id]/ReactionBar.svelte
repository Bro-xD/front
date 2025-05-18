<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { userInfo } from '$lib/stores/userInfo';

    let selectedEmoji ;
    let emojiCounts = {};
    let refugeId = $page.params.id;
    let user = $userInfo ? JSON.parse($userInfo) : null;

    const emojis = [
        { key: 'happy', src: '/emojis/happy.gif' },
        { key: 'cool', src: '/emojis/cool.gif' },
        { key: 'angel', src: '/emojis/angel.gif' },
        { key: 'confeti', src: '/emojis/confeti.gif' },
        { key: 'anger', src: '/emojis/end.gif' },
    ];

    async function fetchReactions() {
        const res = await fetch(`/api/reaction/${refugeId}`);
        const data = await res.json();
        emojiCounts = {};
        data.forEach(({ emoji, count }) => {
            emojiCounts[emoji] = parseInt(count);
        });
    }

    async function react(emoji) {
        selectedEmoji = emoji;
        await fetch('/api/reaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emoji, userId: user.user.id, refugeId })
        });
        await fetchReactions();
    }

    onMount(() => {
        fetchReactions();
    });
</script>

<style>
    .emoji-button {
        cursor: pointer;
        transition: transform 0.2s;
    }

    .emoji-button:hover {
        transform: scale(1.3);
    }

    .emoji-selected {
        border: 3px solid #4f46e5;
        border-radius: 9999px;
        padding: 4px;
        background-color: rgba(79, 70, 229, 0.1);
    }
</style>

<div class="flex gap-4 mt-5 justify-center">
    {#each emojis as emoji}
        <div
            class="emoji-button {selectedEmoji === emoji.key ? 'emoji-selected' : ''}"
            on:click={() => react(emoji.key)}
        >
            <img src={emoji.src} alt={emoji.key} width="50" height="50" />
            <div class="text-center text-xs text-gray-700">{emojiCounts[emoji.key] || 0}</div>
        </div>
    {/each}
</div>
