import { Client } from "colyseus.js";
import { gameState } from "$lib/stores/state.svelte";

let client = null;
let room = null;

export async function connectToRefugeRoom(refugeUserId, currentUserId) {
    if (!client) {

        client = new Client("ws://192.168.1.115:3000");
    }

    try {
        room = await client.joinOrCreate("refuge-room", {
            userId: refugeUserId, // ID du propriétaire du refuge
            currentUserId, // ID de l'utilisateur actuel
        });

        // Mettre à jour globalRoom avec la room
        gameState.globalRoom = room;

        console.log(`✅ Connecté à la Refuge Room pour userId: ${refugeUserId}`);

        // Définir localPlayerId
        gameState.localPlayerId = room.sessionId;

        // Synchroniser les joueurs
        let _index = 0;
        room.state.players.forEach((player, sessionId) => {
            gameState.players.push(player);
            gameState.playersSessionIndex[sessionId] = _index++;
        });

        room.state.players.onAdd((player, sessionId) => {
            console.log(`🆕 Joueur ajouté : ${sessionId}`);
            gameState.playersSessionIndex[sessionId] = gameState.players.length;
            gameState.players.push(player);

            // Mettre à jour la position du joueur local si c'est le client actuel
            if (sessionId === room.sessionId) {
                gameState.player.position.x = player.x;
                gameState.player.position.y = player.y;
                gameState.player.position.z = player.z;
            }
        });

        room.state.players.onRemove((player, sessionId) => {
            const index = gameState.playersSessionIndex[sessionId];
            delete gameState.playersSessionIndex[sessionId];
            gameState.players.splice(index, 1);
        });

        // Synchroniser le refuge
        gameState.refuge = room.state.refuge;

        room.state.refuge.onChange(() => {
            gameState.refuge = room.state.refuge;
        });

        // Synchroniser les éléments
        room.state.elements.forEach((element) => {
            gameState.elements.push(element);
        });

        room.state.elements.onAdd((element) => {
            gameState.elements.push(element);
        });

        room.state.elements.onRemove((element, index) => {
            gameState.elements.splice(index, 1);
        });

        room.onMessage("element-added", (element) => {
            gameState.elements.push(element);
        });

        room.onMessage("update-element", (data) => {
            console.log("🔄 Élément mis à jour :", data);
        });

        room.onMessage("error", (message) => {
            console.error("❌ Erreur :", message);
        });

        room.onError((code, message) => {
            console.error(`❌ Erreur de connexion à la room : ${message}`);
        });

        return room;
    } catch (error) {
        console.error("❌ Erreur de connexion :", error);
        throw error;
    }
}

export function sendAddElement(data) {
    if (room) {
        room.send("add-element", data);
    }
}