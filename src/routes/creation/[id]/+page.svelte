<script runes>
    import { onMount } from 'svelte';
    import interact from 'interactjs';
    import { page } from '$app/stores';
    import api from '$lib/api';
    import { userInfo } from '$lib/stores/userInfo';

  // … tes états runes existants …
async function saveDesign() {
    if (!isOwner) return;
    console.log(userId);
    const payload = {
        userId:    userId,
        elements,
        background: selectedBackground,
        soundUrl:      currentTrack
    };
    try {
        const response = await api
            .post('api/design', { json: payload })
            .json();
        console.log('Design saved:', response);
        } catch (e) {
        console.error('Save failed:', e);
    }
}


  let zIndexCounter = 1;
  // État local réactif pour tes éléments
  let elements = $state([]);

  // Visibilité de la bibliothèque
  let showLibrary = $state(false);

  // État local pour la musique sélectionnée
  let currentTrack = $state('');
  let showMusicLibrary = $state(false);

  let showTextPanel     = $state(false);

  let isPlaying    = $state(false);

  let isOwner = $state(false);

  let audioEl;

  // quand currentTrack change, on lance la lecture
  // Quand currentTrack change, on lance la lecture en boucle
  $effect(() => {
    if (!audioEl) return;
    if (currentTrack) {
      audioEl.loop = true;
      audioEl.play();
      isPlaying = true;
    } else {
      audioEl.pause();
      isPlaying = false;
    }
  });

   // --- toggler play/pause ---
  function togglePlay() {
    if (!audioEl) return;
    if (isPlaying) {
      audioEl.pause();
      isPlaying = false;
    } else {
      audioEl.play();
      isPlaying = true;
    }
  }

  // --- remove track completely ---
  function removeTrack() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    currentTrack = '';
    isPlaying    = false;
    saveDesign();
  }
  // Ouvre un seul panneau à la fois
  function togglePanel(panel) {
    showLibrary      = (panel === 'images');
    showMusicLibrary = (panel === 'music');
    showTextPanel    = (panel === 'text');
    showBgPanel         = (panel === 'back');
    // reset text editor when opening:
    if (panel === 'text' && selectedElementId) {
      // load data from that element
      const el = elements.find(e => e.id === selectedElementId);
      textContent      = el.content;
      selectedFont     = el.font;
      selectedColor    = el.color;
      selectedFontSize = el.fontSize;
    } else {
      selectedElementId = null;
      textContent      = 'Votre texte ici';
      selectedFont     = fonts[0];
      selectedColor    = '#000000';
      selectedFontSize = 24;
    }
  }

  // Texte
  // text editor state
  let selectedElementId  = $state(null);
  let textContent        = $state('Votre texte ici');
  let selectedFont       = $state('Arial');
  let selectedColor      = $state('#000000');
  let selectedFontSize   = $state(24);
  const fonts            = ['Arial','Georgia','Courier New','Tahoma'];
  const colors        = [];

  

  // 2) Liste des images statiques disponibles
  const library = [
    { label: 'Désert', value: '/images/desert.jpg' },
    { label: 'Forêt',  value: '/images/forest.jpg' },
    { label: 'Île',    value: '/images/island.jpg' },
    { label: 'Chambre',value: '/images/room.jpg' },
    { label: 'Désert', value: '/emoji/anger.png' },
    { label: 'Forêt',  value: '/emoji/astonished.png' },
    { label: 'Île',    value: '/emoji/bomb.png' },
    { label: 'Chambre',value: '/emoji/box.png' },
    { label: 'Désert', value: '/emoji/cool.png' },
    { label: 'Forêt',  value: '/emoji/disgusted.png' },
    { label: 'Île',    value: '/emoji/happy.png' },
    { label: 'Chambre',value: '/emoji/none.png' },
    { label: 'Désert', value: '/emoji/sad.png' },
    { label: 'Forêt',  value: '/emoji/smile.png' },
    { label: 'Île',    value: '/emoji/very-sad.png' },
  ];

  // Bibliothèque de musiques par émotion
  const musicLibrary = [
    { label: 'Triste',   src: '/song/happy_pro_max.mp3' },
    { label: 'Joyeux',   src: '/song/happy.mp3' },
    { label: 'Chauffé',  src: '/song/anger.mp3' },
    { label: 'Libre',    src: '/song/free.mp3' }
  ];

  let selectedBackground = $state('none');

  // → liste d’options de fonds (couleurs ou SVG dégradés)
  const backgrounds = [
    { label: 'Blanc',      value: 'none' },
    { label: 'Gris clair', value: '#f0f0f0' },
    { label: 'Dégradé bleu', 
      value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' 
    },
    { label: 'Dégradé rose', 
      value: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' 
    },
    { label: 'SVG motif', 
      value: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\'><circle cx=\'20\' cy=\'20\' r=\'10\' fill=\'%23eee\'/><circle cx=\'20\' cy=\'20\' r=\'2\' fill=\'%23ccc\'/></svg>")'
    }
  ];

  // → ouvrir le panneau background
  let showBgPanel = $state(false);
  

    function saveTextBlock() {
        if (selectedElementId) {
            // update existing
            const idx = elements.findIndex(e => e.id === selectedElementId);
            elements[idx] = {
                ...elements[idx],
                content: textContent,
                font:    selectedFont,
                color:   selectedColor,
                fontSize:selectedFontSize
            };
        } else {
            // new block
            const id = Date.now().toString() + Math.random().toString(36).slice(2,9);
            elements.push({
                id, type: 'text',
                content:    textContent,
                font:       selectedFont,
                color:      selectedColor,
                fontSize:   selectedFontSize,
                x: 20, y:20, width:200, height:50,
                zIndex: ++zIndexCounter
            });
        }
        showTextPanel = false;
        saveDesign();
    }

  // --- click existing text to edit ---
  function editTextBlock(id) {
    selectedElementId = id;
    togglePanel('text');
  }



  // Sélectionne un morceau et ferme la bibliothèque
  function selectTrack(src) {
    currentTrack = src;
    showMusicLibrary = false;
  }
  
  // --- persist & restore ---
  onMount(
    async () => {
        // Récupérer l'utilisateur
        let user = $userInfo ? JSON.parse($userInfo) : null;
        let userId = $page.params.id ?? user.user.id;

        if(userId){
            isOwner = true
        }

        getRefuge(userId);
    }
  );

  async function getRefuge(userId){
    const refuge = await api.get(`api/design/${userId}`).json();

        elements = refuge.elements || [];
        selectedBackground = refuge.background || 'none';
        currentTrack = refuge.soundUrl || '';

        zIndexCounter = Math.max(zIndexCounter, ...elements.map(e => e.zIndex || 0));

        // Vérifier si l'utilisateur est le créateur
        if (refuge.userId === userId) {
            isOwner = true;
        } else {
            isOwner = false;
        }
  };

  $effect(() => {
    localStorage.setItem('myElements', JSON.stringify(elements));
  });

  // Ajoute l’image cliquée à la zone de travail
    function addFromLibrary(src) {
        const id  = Date.now().toString() + Math.random().toString(36).slice(2,9);
        elements.push({
            id,
            type: 'image',
            src,
            x: 10,
            y: 10,
            width: 150,
            height: 150,
            zIndex: ++zIndexCounter
         });
        showLibrary = false;
    }

function bringToFront(id) {
    const idx = elements.findIndex(el => el.id === id);
    elements[idx].zIndex = ++zIndexCounter;
    saveDesign();
}

function sendToBack(id) {
    const minZ = Math.min(...elements.map(el => el.zIndex || 0));
    const idx = elements.findIndex(el => el.id === id);

    // Si minZ est déjà 0, on garde 0, sinon on descend encore plus bas
    const SAFE_MIN_Z = -1000;
    elements[idx].zIndex = Math.max(SAFE_MIN_Z, minZ - 1);
    saveDesign();
}

    function deleteElement(id) {
        elements = elements.filter(el => el.id !== id);
        console.log(elements);
        saveDesign();
    }

  // Action Svelte pour drag + resize (identique à avant)
  function draggableResizable(node, el) {
    interact(node)
      .draggable({
        inertia: true,
        modifiers: [ interact.modifiers.restrictRect({ restriction: node.parentElement, endOnly: true }) ],
        listeners: {
          move(evt) {
            const prevX = parseFloat(node.dataset.x) || el.x;
            const prevY = parseFloat(node.dataset.y) || el.y;
            const x = prevX + evt.dx;
            const y = prevY + evt.dy;
            node.style.transform = `translate(${x}px, ${y}px)`;
            node.dataset.x = x; node.dataset.y = y;
          },
          end(evt) {
            const finalX = parseFloat(node.dataset.x) || el.x;
            const finalY = parseFloat(node.dataset.y) || el.y;
            const idx = elements.findIndex(o => o.id===el.id);
            elements[idx].x = finalX; elements[idx].y = finalY;
            console.log(elements);
            saveDesign();
          }
        }
      })
      .resizable({
        edges: { left:true, right:true, bottom:true, top:true },
        inertia: true,
        modifiers: [ interact.modifiers.restrictSize({ min:{width:50,height:50}, max:{width:1900,height:1200} }) ],
        listeners: {
          move(evt) {
            let x = parseFloat(node.dataset.x) || el.x;
            let y = parseFloat(node.dataset.y) || el.y;
            const w = evt.rect.width, h = evt.rect.height;
            x += evt.deltaRect.left; y += evt.deltaRect.top;
            node.style.width=`${w}px`; node.style.height=`${h}px`;
            node.style.transform=`translate(${x}px, ${y}px)`;
            node.dataset.x=x; node.dataset.y=y;
          },
          end(evt) {
            const finalX = parseFloat(node.dataset.x)||el.x;
            const finalY = parseFloat(node.dataset.y)||el.y;
            const finalW = parseFloat(node.style.width)||el.width;
            const finalH = parseFloat(node.style.height)||el.height;
            const idx = elements.findIndex(o => o.id===el.id);
            elements[idx]={...elements[idx], x:finalX, y:finalY, width:finalW, height:finalH};
            console.log(elements);
            saveDesign();
          }
        }
      });

    return { destroy() { interact(node).unset(); } };
  }

//   // save à chaque mutation
//   $effect(() => {
//     localStorage.setItem('selectedBackground', selectedBackground);
//   });
//   $effect(() => {
//     localStorage.setItem('currentTrack', currentTrack);
//   });

</script>

<svelte:head>
  <title>Création</title>
</svelte:head>

<div class="content--creation">

    {#if isOwner}
        <div class="toolbox">
            <button on:click={() => togglePanel('text')} title="Texte">
                <!-- Icone texte SVG -->
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
            <button on:click={() => togglePanel('images')} title="Images">
                <!-- Icone image SVG -->
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
            <button on:click={() => togglePanel('music')} title="Musique">
                <!-- Icone musique SVG -->
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 19C9 20.1046 7.65685 21 6 21C4.34315 21 3 20.1046 3 19C3 17.8954 4.34315 17 6 17C7.65685 17 9 17.8954 9 19ZM9 19V5L21 3V17M21 17C21 18.1046 19.6569 19 18 19C16.3431 19 15 18.1046 15 17C15 15.8954 16.3431 15 18 15C19.6569 15 21 15.8954 21 17ZM9 9L21 7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
            <!-- bouton pour ouvrir le sélecteur -->
            <button class="btn-panel" on:click={() => togglePanel('back')}>
            🎨
            </button>
        </div>
    {/if}

    {#if showBgPanel}
        <div class="bg-panel">
            <button class="close-panel" on:click={() => showBgPanel = !showBgPanel}>×</button>
            {#each backgrounds as bg}
            <div 
                class="bg-thumb {selectedBackground === bg.value ? 'active' : ''}"
                style="background: {bg.value};"
                on:click={() => {
                    selectedBackground = bg.value;
                    console.log(selectedBackground);
                    
                    showBgPanel = false;
                }}
            >
            </div>
            {/each}
        </div>
    {/if}

    {#if showLibrary}
        <div class="library">
            <button class="close-panel" on:click={() => showLibrary = !showLibrary}>×</button>
        {#each library as img}
            <div class="thumb" on:click={() => addFromLibrary(img.value)}>
                <img src={img.value} alt={img.label} />
            </div>
        {/each}
        </div>
  {/if}

    {#if showMusicLibrary}
    <div class="music-library">
        <button class="close-panel" on:click={() =>showMusicLibrary = !showMusicLibrary}>×</button>
        {#each musicLibrary as track}
        <div class="music-thumb" 
            class:active={currentTrack === track.src}
            on:click={() => selectTrack(track.src)}>
            <span>{track.label}</span>
        </div>
        {/each}
    </div>
    {/if}

    {#if currentTrack}
        <div class="player">
            <button class="close-panel" on:click={() => currentTrack = ''}>×</button>
            <span class="track-name">
            🎵 {musicLibrary.find(t => t.src === currentTrack).label}
            </span>

            <button class="btn-toggle" on:click={togglePlay}>
            {#if isPlaying}
                <!-- Pause SVG -->
                <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            {:else}
                <!-- Play SVG -->
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            {/if}
            </button>

            <button class="btn-remove" on:click={removeTrack}>
            <!-- Close SVG -->
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <audio bind:this={audioEl} src={currentTrack} hidden></audio>
        </div>
    {/if}

    {#if showTextPanel}
        <div class="text-panel" 
        >
    <header class="panel-header">
        <svg viewBox="0 0 24 24" class="panel-icon"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>
        <h3>{ selectedElementId ? 'Modifier le texte' : 'Ajouter du texte' }</h3>
        <button class="close-panel" on:click={() => showTextPanel = false}>×</button>
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </header>
    <textarea bind:value={textContent} rows="3" class="text-input" />

    <div class="controls-inline">
        <label>
        <svg viewBox="0 0 24 24" class="ctrl-icon"><path d="M4 18h16v-2H4v2zM4 13h16v-2H4v2zM4 6v2h16V6H4z"/></svg>
        Police
        <select bind:value={selectedFont}>
            {#each fonts as f}<option value={f}>{f}</option>{/each}
        </select>
        </label>

        <label>
        <svg viewBox="0 0 24 24" class="ctrl-icon"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.18A8.18 8.18 0 1112 3.82a8.18 8.18 0 010 16.36z"/></svg>
        Couleur
        <input type="color" bind:value={selectedColor} />
        </label>

        <label>
        <svg viewBox="0 0 24 24" class="ctrl-icon"><path d="M7 4h10v2H7V4zm0 6h7v2H7v-2zm0 6h5v2H7v-2z"/></svg>
        Taille
        <input type="number" min="10" max="100" bind:value={selectedFontSize} />
        <span>px</span>
        </label>

        <button class="btn-add" on:click={saveTextBlock}>
        <svg viewBox="0 0 24 24"><path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        { selectedElementId ? 'Enregistrer' : 'Ajouter' }
        </button>
    </div>

  <div
    class="preview"
    style="font-family:{selectedFont}; color:{selectedColor}; font-size:{selectedFontSize}px;"
  >{textContent}</div>
</div>
    {/if}

  <div class="workspace" style="background: {selectedBackground};
         transition: background 0.3s ease;">
    {#each elements as el (el.id)}
        <div
            use:draggableResizable={el}
            class="draggable"
            style="
                position:absolute;
                width:{el.width}px;
                height:{el.height}px;
                transform:translate({el.x}px, {el.y}px);
                z-index:{el.zIndex || 1};
            "
             on:dblclick={() => el.type==='text' && editTextBlock(el.id)}
             tabindex="0"
             role="button"
            data-x={el.x}
            data-y={el.y}
        >
            {#if isOwner}
            <!-- ❌ Bouton supprimer -->
                <button class="close-btn" on:click={() => deleteElement(el.id)}>×</button>

                <div class="z-controls">
                    <button on:click={() => bringToFront(el.id)}>🔼</button>
                    <button on:click={() => sendToBack(el.id)}>🔽</button>
                </div>
            {/if}

            {#if el.type==='image'}
                <img src={el.src} class="fit-image" alt="élément" draggable="false"/>
            {:else}
                <div
                    class="text-block"
                    style="font-family:{el.font}; color:{el.color}; font-size:{el.fontSize || 24}px;"
                >{el.content}</div>

            {/if}
        </div>
    {/each}
  </div>
</div>

<style>
  .btn-library {
    background: #4a90e2;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: background 0.2s;
  }
  .btn-library:hover {
    background: #357ab8;
  }

  .library {
    width: max-content;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  }
  .thumb {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    
    cursor: pointer;
  }
  .thumb img {
    width: 100%;
    height:60px;
    border-radius: 4px;
    object-fit: cover;
    transition: transform 0.2s;
  }
  .thumb img:hover {
    transform: scale(1.05);
  }
  .thumb span {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #555;
    text-align: center;
  }

  .workspace {
    z-index: -99999999;
    position: absolute;
    width: 100%;
    height: 100vh;
    border: 2px dashed #ccc;
    background: #f9f9f9;
    overflow: hidden;
  }

  .draggable {
  position: absolute;
  touch-action: none;
  cursor: grab;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.close-btn {
  position: absolute;
  top: 0px;
  right: 2px;
  color: red;
  font-weight: 700;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.draggable:hover .close-btn {
  opacity: 1;
}

.fit-image {
  display: block;           /* pour virer l’espace inline par défaut */
  width: 100%;              /* remplit le conteneur */
  height: 100%;             /* remplit le conteneur */
  object-fit: contain;      /* ou “cover” si tu veux qu’elle remplisse en rognant */
  pointer-events: none;     /* le drag se fait sur le div et non l’image */
}
.draggable:active {
  cursor: grabbing;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

  .draggable:hover {
    border: 2px dashed rgba(0,0,0,0.2);
  }
  .draggable:active {
    cursor: grabbing;
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }

  .music-library {
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 2rem;
  }
  .music-thumb {
    cursor: pointer;
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border-radius: 4px;
    transition: background 0.2s;
  }
  .music-thumb.active {
    border: rgb(0, 166, 255) 2px solid;
  }
  .music-thumb:hover {
    background: #e0e0e0;
  }
  .player {
    margin-top: 1rem;
  }
  
  .player {
  position: absolute;
  right: 0; top: 1rem;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  gap: 0.5rem;
  font-family: sans-serif;
}
.track-name {
  font-size: 0.9rem;
  color: #333;
  margin-right: auto;
}
.btn-toggle,
.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-toggle svg,
.btn-remove svg {
  width: 20px; height: 20px;
  fill: #555;
  transition: fill 0.2s;
}
.btn-toggle:hover svg,
.btn-remove:hover svg {
  fill: #000;
}
  
  .toolbox {
    position: fixed;
    top: 5rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 999;
}

.toolbox button {
    background: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 0.5rem;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
}

.toolbox button:hover {
    background: #f0f0f0;
}

.library,
.text-panel,
.music-library,
.bg-panel {
    max-width: 520px;
    word-break: break-word;
    position: fixed;
    top: 5rem;
    left: 6rem;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 2rem;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    width: max-content;
}

.toolbox svg {
    width: 20px;
}

.text-panel {
  width: 360px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  overflow: hidden;
  font-family: sans-serif;
  z-index: 1000;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ececec;
}
.panel-header svg {
    width: 2px;
}

.panel-header h3 {
  flex: 1;
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.panel-icon,
.ctrl-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  fill: #666;
}

.close-panel {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.close-panel svg {
  width: 20px;
  height: 20px;
  fill: #999;
  transition: fill 0.2s;
}

.close-panel:hover svg {
  fill: #333;
}

.text-input {
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.controls-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1rem;
  margin-bottom: 0.75rem;
}

.controls-inline label {
  display: flex;
  align-items: center;
  background: #fafafa;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #444;
}

.controls-inline select,
.controls-inline input[type="color"],
.controls-inline input[type="number"] {
  margin-left: 0.4rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

.controls-inline input[type="number"] {
  width: 3rem;
  text-align: right;
}

.btn-add {
  display: flex;
  align-items: center;
  margin-left: auto;
  background: #4a90e2;
  color: #fff;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add svg {
  width: 18px;
  height: 18px;
  margin-right: 0.4rem;
  fill: currentColor;
}

.btn-add:hover {
  background: #357ab8;
}

.preview {
  padding: 1rem;
  border-top: 1px solid #ececec;
  background: #fbfbfb;
  font-size: 0.95rem;
  color: #222;
}

.text-block{
    word-break: break-all;
}

.close-panel{
    position: absolute;
    padding: 4px;
    top: 4px;
    right: 8px;
    font-weight: 700!important;
    opacity: 0.4;
    transition: .2s linear;
}

.close-panel:hover{
    opacity: .7;
}

.btn-panel {
    background: #4a90e2;
    color: #fff;
    border: none;
    padding: .5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }
  .bg-thumb {
    margin-bottom: 0.2rem;
    width: 60px; height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.236);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
  }
  .bg-thumb span {
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: .7rem;
    color: #333;
  }
  .bg-thumb.active {
    border-color: #4a90e2;
  }
</style>
