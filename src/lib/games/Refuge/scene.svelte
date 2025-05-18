<script>
// @ts-nocheck

    //ce sera ici la génération des mondes et le contrôle des variables
    import { T, useTask,useThrelte,} from "@threlte/core";
    import { interactivity, OrbitControls, Edges,transitions,MeshLineGeometry, 
        MeshLineMaterial,Outlines,HTML,RoundedBoxGeometry ,Float, Stars,Text3DGeometry,Billboard,Text } from "@threlte/extras";
    import { Spring } from "svelte/motion";
    import {scale} from "$lib/transitions/scale"

    import { AutoColliders, RigidBody } from '@threlte/rapier'
    

    import { DEG2RAD } from 'three/src/math/MathUtils.js'
    import {Vector3,BoxGeometry,MathUtils } from 'three'
    import { fade } from 'svelte/transition';
    import { onMount,onDestroy } from 'svelte';
    import { spring } from 'svelte/motion'; // Pour une rotation fluide

    import { RoundedPlaneGeometry } from './RoundedPlaneGeometry'


    import Camera from './camera.svelte';
    import { gameState } from "$lib/stores/state.svelte"

    import Player from "./player.svelte"

    let url = $state("/login")

    interactivity()
    transitions()
</script>



<Stars/>

<T.Color attach="background" args={["#222222"]} />
<Camera target={gameState.player.position} />

<T.DirectionalLight intensity={5} castShadow position={[0, 10, 10]} />
<T.AmbientLight color="#fff" intensity={0.9} />

<T.AxesHelper args={[5]} renderOrder={1} />

<!-- Création du sol -->
<AutoColliders shape={"cuboid"}>
    <T.Mesh receiveShadow >
        <T.BoxGeometry args={[15,0.1,15]} />
        <T.MeshStandardMaterial color="white" />
        <!-- <Outlines color="black" /> -->
        <Edges color="black"   />
    </T.Mesh>
</AutoColliders>

{#each gameState.players as player, index (player.id)}
    <Player pinfo={player} initpos={[0,3,0]} />
{/each}