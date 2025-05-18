<script>
    //ce sera ici la génération des mondes et le contrôle des variables
    import { T, useTask,useThrelte,} from "@threlte/core";
	import { interactivity, OrbitControls, Edges,transitions,MeshLineGeometry, 
		MeshLineMaterial,Outlines,HTML,RoundedBoxGeometry ,Float, Stars,Text3DGeometry,Billboard,Text } from "@threlte/extras";
	import { Spring } from "svelte/motion";
	import {scale} from "$lib/transitions/scale"

	import { DEG2RAD } from 'three/src/math/MathUtils.js'
	import {Vector3,BoxGeometry, Quaternion, Raycaster, Vector2, Plane } from 'three'
	import { fade } from 'svelte/transition';
	import { onMount,onDestroy } from 'svelte';
    import { spring } from 'svelte/motion'; // Pour une rotation fluide
    import {gameState} from "$lib/stores/state.svelte"
    import { AutoColliders, RigidBody,Collider } from "@threlte/rapier";

    const {pinfo} = $props()
    interactivity()

    let bodyRef = $state()
    let collisionProcessed = $state(false)

    useTask((delta)=>{
        if(bodyRef){
            let vel = new Vector3(pinfo.vx * pinfo.speed,
                pinfo.vy * pinfo.speed ,
                pinfo.vz * pinfo.speed
            )
            bodyRef.setLinvel(vel,true)
        }
    })

    function onSensorEnter(event){
        if(collisionProcessed) return
        collisionProcessed = true
        const d = event.targetRigidBody.userData
        if(d.type == "player" && d.id  == pinfo.sender) return

        if(d.type == "player" && gameState.globalRoom){
            gameState.globalRoom.send('hit',{
                projectileId:pinfo.id,
                targetId:d.id,
                shooterId:pinfo.sender
            })
        }

    }

    function onSensorExit(){
        collisionProcessed = false
    }

</script>

<T.Group>
    <RigidBody ccd={true} onsensorexit={onSensorExit} onsensorenter={onSensorEnter} position={new Vector3(pinfo.x, pinfo.y, pinfo.z)} oncreate={(body)=>{
        bodyRef = body
        bodyRef.setTranslation(new Vector3(pinfo.x,pinfo.y,pinfo.z))
    
    }} type={"kinematicVelocity"} userData={{type:"projectile",id:pinfo.id,sender:pinfo.sender}} 
    >
        <Collider args={[0.2]} sensor={true} shape={"ball"}>
            <T.Mesh >
                <T.SphereGeometry  args={[0.1,16,16]} />
                <T.MeshStandardMaterial color="red" />
                <Outlines color="black" />
            </T.Mesh>
        </Collider>
    </RigidBody>
</T.Group>

