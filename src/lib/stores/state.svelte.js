export const gameState = $state({
    cameraPivot:null,
    camera:null,
    player:{
        position:{x:0,y:0,z:0}
    },
    localPlayerId:null,
    players:[],
    playersSessionIndex:{},
    localPlayerDistanceToCamera:0,

    projectiles:new Map(),

    globalRoom:null
});