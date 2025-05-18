<script>
// @ts-nocheck
    import { T, useTask,useThrelte} from "@threlte/core";
    import { DEG2RAD } from 'three/src/math/MathUtils.js'

    import { gameState } from "$lib/stores/state.svelte"

    import { onMount, onDestroy } from "svelte";

    let {target={x:0,y:0,z:0}} = $props()


    let zoom = $state(0); // Distance initiale
    const zoomMin = 10; // Zoom maximal (proche)
    const zoomMax = 50; // Zoom minimal (loin)
    const zoomSpeed = 2; // Vitesse du zoom

    let targetZoom = 10; // Valeur cible pour un effet smooth

    function handleWheel(event) {
        targetZoom -= event.deltaY * 0.01 * zoomSpeed;
        targetZoom = Math.max(zoomMin, Math.min(zoomMax, targetZoom)); // Clamp entre min et max
    }

    // Mise à jour fluide du zoom avec interpolation
    useTask(() => {
        zoom += (targetZoom - zoom) * 0.1; // Interpolation linéaire (effet smooth)
    });

</script>

<svelte:window onwheel={handleWheel} />

<!-- Style de camera topdown -->
<T.Group bind:ref={gameState.cameraPivot}  position={[target.x,target.y,target.z]} rotation={[0, 45*DEG2RAD, 0]}>
    <T.Group rotation={[-45 * DEG2RAD, 0, 0]}>
        <T.PerspectiveCamera bind:ref={gameState.camera} makeDefault  position={[0, 0, zoom]} />
    </T.Group>
</T.Group>