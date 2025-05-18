<script lang="ts">
    export let logoSrc: string = "logo--end.svg"; // Remplace par ton logo
</script>

<header class="w-full px-6 py-4 bg-white shadow-md flex items-center justify-between fixed top-0 left-0 z-50">
    <!-- Lien de connexion -->
    <div class="flex items-center gap-2">
        <a href="/login" class="text-sm uppercase font-semibold text-gray-700 hover:text-blue-600 transition">
            Connexion
        </a>
    </div>

    <!-- Logo à droite -->
    <div class="flex items-center">
        <img src={logoSrc} alt="Logo" class="h-10 w-auto object-contain"/>
    </div>
</header>