<script>
// @ts-nocheck

    //ce sera ici la génération des mondes et le contrôle des variables
    import { T, useTask,useThrelte,} from "@threlte/core";
    import { interactivity, OrbitControls, Edges,transitions,MeshLineGeometry, GLTF,
        MeshLineMaterial,Outlines,HTML,RoundedBoxGeometry ,Float, Stars,Text3DGeometry,Billboard } from "@threlte/extras";
    import { Spring } from "svelte/motion";
    import {scale} from "$lib/transitions/scale"

    import { DEG2RAD } from 'three/src/math/MathUtils.js'
    import {Vector3,BoxGeometry, Quaternion, Raycaster, Vector2, Plane,MeshToonMaterial } from 'three'
    import { fade } from 'svelte/transition';
    import { onMount,onDestroy } from 'svelte';
    import { spring } from 'svelte/motion'; // Pour une rotation fluide
    import {gameState} from "$lib/stores/state.svelte"
    import { AutoColliders, RigidBody } from "@threlte/rapier";

    import Character from "$lib/models/character-female-a.svelte"

    import { Root,Text,Container } from "threlte-uikit"
    import { userInfo } from "$lib/stores/userInfo";

    let user = $userInfo ? JSON.parse($userInfo) : null;

    interactivity()

    
    //Gestion du player
    // Variables pour le mouvement du joueur
    let playerPosition = $state([0, 0.25 + 0.1, 0]); // Position initiale du joueur
    let playerRotation = $state(0); // Rotation du joueur
    let currentRotation = spring(0, { stiffness: 0.1, damping: 0.5 }); // Rotation actuelle (interpolée)

    let lastMoveDirection = $state(new Vector3(0,0,0))

    let {initpos,pinfo} = $props();

    let playerRigidBody = $state();

    let playerGroup = $state()
    let headRef = $state()

    let player_pv = spring(0,{ stiffness: 0.1, damping: 0.5 })
    let player_pv_max = $state(0);

    let scaleFactor = $state(1)
    let referenceDistance = $state(1)

    // Variables pour les touches pressées
    let keys = $state({
        z: false,
        s: false,
        q: false,
        d: false
    });


    function getHeadGlobalPos(){
        let headPosTmp = new Vector3()
        headRef.getWorldPosition(headPosTmp)

        return headPosTmp
    }

    // Écouteurs d'événements clavier
    function handleKeyDown(event) {
        if (event.key === 'z') keys.z = true;
        if (event.key === 's') keys.s = true;
        if (event.key === 'q') keys.q = true;
        if (event.key === 'd') keys.d = true;
    }

    function handleKeyUp(event) {
        if (event.key === 'z') keys.z = false;
        if (event.key === 's') keys.s = false;
        if (event.key === 'q') keys.q = false;
        if (event.key === 'd') keys.d = false;
    }

    // Vitesse de déplacement
    const speed = 5;
    let onAttack = $state(false)

    let isMoving = $state(false)

    // Fonction pour normaliser un angle entre 0 et 2π
    const normalizeAngle = (angle) => {
        angle = angle % (2 * Math.PI);
        return angle < 0 ? angle + 2 * Math.PI : angle;
    };

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    onMount(()=>{
        console.log("player mounted",pinfo)
    })


    useTask((delta)=>{
        if(gameState.globalRoom){

            //Mise à jour de la taille des healthbar des autres joueurs s'ils sont trop loin
            if(gameState.camera){
                const cameraWorldPos = new Vector3()
                gameState.camera.getWorldPosition(cameraWorldPos)
                const distance = cameraWorldPos.distanceTo(new Vector3(pinfo.x, pinfo.y, pinfo.z)); // Distance joueur-caméra

                if(user?.user.id == pinfo.userId){
                    gameState.localPlayerDistanceToCamera = distance
                }
                // console.log(distance)
                scaleFactor =  distance / gameState.localPlayerDistanceToCamera
            }

            //mise à jours des barres de vie pour tout le monde
            player_pv.set(pinfo?.pv)
            player_pv_max = pinfo?.pv_max


            if(user?.user.id == pinfo.userId){
                updatePlayerPositionAndRotation(delta)
            }else{
                //update pour les positions des autres joueurs
                let timeFactor = 0.2

                //ici on met à jour la position
                let oldt = playerRigidBody.translation()
                playerRigidBody.setTranslation(new Vector3(
                    lerp(oldt.x,pinfo.x,timeFactor),
                    lerp(oldt.y,pinfo.y,timeFactor),
                    lerp(oldt.z,pinfo.z,timeFactor)))

                    if(oldt == playerRigidBody.translation()){
                        isMoving = false
                    }else{
                        isMoving = true
                    }
                
                //en général ici application des vélocités
                let velocity = new Vector3(pinfo?.vx,pinfo?.vy,pinfo?.vz)
                // Appliquer la vélocité avec Rapier
                playerRigidBody.setLinvel(velocity, true);

                //update de la rotation
                currentRotation.set(pinfo?.rotation)
                let quaternion = new Quaternion(); 
                quaternion.setFromAxisAngle(new Vector3(0, 1, 0), $currentRotation);
                playerRigidBody.setRotation(quaternion, true);
            }
        }
    })

    function updatePlayerPositionAndRotation(delta){
        if(gameState.cameraPivot && playerRigidBody){
            // Récupérer la rotation de l'objet parent de la caméra
            const cameraParent = gameState.cameraPivot;
            const direction = new Vector3(0, 0, 1); // Direction initiale (avant)
            direction.applyQuaternion(cameraParent.quaternion); // Appliquer la rotation du parent
            direction.y = 0; // Garder le mouvement horizontal

            // Calculer la direction en fonction de la touche pressée
            let moveDirection = new Vector3(0, 0, 0);

            if (keys.z) {
                moveDirection.sub(direction); // Avancer (inversé)
            }
            if (keys.s) {
                moveDirection.add(direction); // Reculer (inversé)
            }
            if (keys.q) {
                const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0));
                moveDirection.add(right); // Gauche (inversé)
            }
            if (keys.d) {
                const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0));
                moveDirection.sub(right); // Droite (inversé)
            }

            // Normaliser la direction pour éviter des vitesses excessives
            if (moveDirection.length() > 0) {
                moveDirection.normalize();
            }


            // Déplacer le joueur
            // playerPosition[0] += moveDirection.x * speed * delta;
            // playerPosition[2] += moveDirection.z * speed * delta;
            let currentVel = playerRigidBody.linvel()
            let velocity = new Vector3(
                moveDirection.x * speed,
                currentVel.y, // Garder la vitesse verticale
                moveDirection.z * speed
            );

            // Appliquer la vélocité avec Rapier
            playerRigidBody.setLinvel(velocity, true);

            // Mettre à jour la rotation du joueur
            if (moveDirection.length() > 0.001) {
                isMoving = true
                playerRotation = Math.atan2(moveDirection.x, moveDirection.z)
                // Calcul de la différence d'angle
                let angleDiff = playerRotation - $currentRotation;

                // Ramener l'angle dans l'intervalle [-π, π]
                // angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
                angleDiff = mod(angleDiff + Math.PI,2 * Math.PI) - Math.PI

                // Appliquer l'angle minimal à la rotation actuelle (interpolation avec spring)
                currentRotation.set($currentRotation + angleDiff);
            }else{
                isMoving = false
            }

            // Convertir en Quaternion pour Rapier
            let quaternion = new Quaternion(); 
            quaternion.setFromAxisAngle(new Vector3(0, 1, 0), $currentRotation);
            playerRigidBody.setRotation(quaternion, true);

            // setInterval(() => {
                
            // }, 100);
            if(gameState.globalRoom){
                gameState.globalRoom.send('playerMove',{
                    x:playerRigidBody.translation().x,
                    y:playerRigidBody.translation().y,
                    z:playerRigidBody.translation().z,
                    vx:velocity.x,
                    vy:velocity.y,
                    vz:velocity.z,
                    rotation:$currentRotation
                })
            }
            gameState.player.position = playerRigidBody.translation()
            
        }
    }

    //tirer un projectile
    function fireProjectile(){
        const shootAngle = playerRotation //$currentRotation; // ou playerRotation, selon ta logique

        // Calcul du vecteur direction (en considérant que l'axe Z pointe vers l'avant)
        const shootDirection = new Vector3(
            Math.sin(shootAngle),
            0,
            Math.cos(shootAngle)
            ).normalize();
        
        const spawnPosition = getHeadGlobalPos()

        if(gameState.globalRoom){
            gameState.globalRoom.send("fireProjectile",{
                spawnPosition: getHeadGlobalPos().toArray(),
                velocity: shootDirection.toArray()
            })

            
        }
    }

    // Fonction pour gérer le clic gauche de la souris
    function handleMouseDown(event) {
        // Vérifie que c'est le clic gauche (button 0)
        if (event.button !== 0 || !gameState.camera || !gameState.globalRoom || 
            user?.user.id != pinfo.userId
        ) return;

        onAttack = true
        fireProjectile()

    }

    function handleMouseUp(){
        if(gameState.globalRoom && user?.user.id == pinfo.userId && onAttack){
            onAttack = false
        }
    }
</script>

<svelte:window on:mouseup={handleMouseUp} on:keydown={handleKeyDown} on:keyup={handleKeyUp} on:mousedown={handleMouseDown} />

<T.Group bind:ref={playerGroup} oncreate={()=>{
    playerPosition = initpos
}}
position={playerPosition}
rotation={[0,$currentRotation,0]}
>

    <RigidBody ccd={true} oncreate={(body)=>{
        playerRigidBody = body
        playerRigidBody.setTranslation(new Vector3(pinfo.x,pinfo.y,pinfo.z))
    }} mass={1} type="dynamic" userData={{type:"player",id:pinfo.userId}} >
        <Character url={pinfo.avatarConfig} animation={isMoving ? "walk" : "idle"}/>

        <T.Group scale={[scaleFactor,scaleFactor,scaleFactor]}  position={[0,1.5,0]}>
            <Billboard  >
                <Root  padding={5} display={"flex"} 
                flexDirection={"column"} backgroundOpacity={0} borderRadius={5} backgroundColor="transparent">
                    <!-- Pseudo du joueur -->
                    <Text  text={pinfo.username} fontWeight={"bold"} fontSize={20} color="white" />
                
                    <!-- Barre de vie -->
                    <Container  marginTop={5}  padding={3} borderRadius={100} backgroundColor={"#f7fff6"}>
                        <Container
                            width={150}
                            height={20}
                            backgroundColor="#0c1b33"
                            borderRadius={100}
                        >
                        <Container
                            
                            width={($player_pv / player_pv_max) * 150}
                            height={20}
                            backgroundColor={user?.user.id == pinfo.userId?"#20bf55":"#8b5fbf"}
                            alignX="left"
                            borderRadius={100}
                            />
                        </Container>
                    </Container>
                    <Text text={`Texte`} fontWeight={"extra-bold"} fontSize={15} color="white" />
                </Root>
            </Billboard>
        </T.Group>
    </RigidBody>
</T.Group>