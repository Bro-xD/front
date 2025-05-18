<script>
    import { Canvas } from "@threlte/core";
    import { Debug, World } from '@threlte/rapier'
    // @ts-ignore
    import Scene from "./scene.svelte";
</script>

<Canvas >
    <World framerate={"varying"} >
        <Debug/>
        <Scene />
    </World>
</Canvas>
