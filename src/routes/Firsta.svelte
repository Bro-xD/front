
<div class="portal relative">
    <div class="titra-portal text-center text-2xl uppercase">
      C'est la fin… ou le début de votre vraie aventure ?
    </div>

    <div class="content-portal">
      <div class="portal-enter">
        <div class="back imagex"></div>
        <div class="arbre imagex"></div>
        <div class="terre-p imagex"></div>
        <div class="terre-r imagex"></div>
        <div class="terre-l imagex"></div>
        <div class="perso imagex"></div>
      </div>
      <a class="button absolute bottom-4  w-max" href="/login">
        <div class="dots_border"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="sparkle"
        >
          <path
            class="path"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke="black"
            fill="black"
            d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
          ></path>
          <path
            class="path"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke="black"
            fill="black"
            d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
          ></path>
          <path
            class="path"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke="black"
            fill="black"
            d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
          ></path>
        </svg>
        <span class="text_button" > Laisser une trace</span>
    </a>
    </div>

</div>

<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  onMount(() => {
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
    gsap.from('.perso', {
      scale: 1,
      y: 100,
    });

    gsap.to('.perso', {
      scale: 1.4,
      y: 0,
      duration: 0.4,
      scrollTrigger: {
        trigger: '.content-portal',
        start: 'top center',
        end: 'bottom center',
        scrub: 1.9,
        markers: false
      },
    });

    gsap.from('.terre-l , .terre-r  ', {
      scale: 1,
      y: 20,
    });

    gsap.to('.terre-l , .terre-r ', {
      scale: 1.2,
      duration: 0.8,
      y: 0,
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.content-portal',
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1.9,
        markers: false
      },
    });

    gsap.from('.arbre', {
      scale: 1,
      x: 20,
      y: 50,
    });

    gsap.to('.arbre', {
      scale: 1.1,
      duration: 0.9,
      y: 50,
      x: -20,
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.content-portal',
        start: 'top center',
        end: 'bottom center',
        scrub: 1.9,
        markers: false,
      },
    });
  });
</script>


<style >
    .portal{
        transform: translateY(0);
        display: grid;
        overflow: hidden;
        position: relative;
        margin-top: 4rem;
        width: 110%;
    }
    
    
    .content-portal{
        z-index: 66;
        display: grid;
        justify-items: center;
        
        
        overflow: hidden;
    }
    .titra-portal{
        
        border-radius: 1rem;
        display: grid;
        background-color: rgb(255, 255, 255);
    
        padding: 36px;
        position: relative;
        display: grid;
        justify-content: center;
        align-items: center;
        justify-items: center;
        justify-self: center;
    }
    .titra-portal::before{
        z-index: -1;
       
        position: absolute;
        background-color: rgba(235, 95, 1, 0.308);
        content:"";
        height: 4px;
        width: 100vw;
    }
    
    .portal-enter{
        display: grid;
        position: relative;
        aspect-ratio: 16/9;
        width: 100%;
        justify-content: center;
    }
    
    .imagex{
        position: absolute;
        width: max-content;
        height: max-content;
        transform-origin: center;
    }
    
    .perso{
        width: 100%;
        height: 100%;
        background: url(img/perso.png);
        
        background-repeat: no-repeat;
        background-position: bottom center;
    
    }
    .terre-l{
        
        width: 100%;
        height: 100%;
        background: url(img/terre-l.png);
        background-color: rgba(250, 235, 215, 0);
        background-repeat: no-repeat;
        background-position: bottom left;
       
    
    }
    .terre-r{
        
        width: 100%;
        height: 100%;
        background: url(img/terre-r.png);
        background-color: rgba(250, 235, 215, 0);
        background-repeat: no-repeat;
        background-position: bottom right;
       
    
    }
    
    .arbre{
        
        width: 100%;
        height: 100%;
        background: url(img/arbre.png);
        background-color: rgba(250, 235, 215, 0);
        background-repeat: no-repeat;
        background-position: 20% 80%;
       
    
    }
    .back{
        
        width: 100%;
        height: 100%;
        background: url(img/bak.png);
        background-color: rgba(250, 235, 215, 0);
        background-repeat: no-repeat;
        background-position: bottom center;
    }
    
    /*****responsive portal ***/
    
    @media screen and (max-width: 1330px) {
        .portal-enter{
            
            width: 100%!important;
            justify-content: center;
         
        }
    
      }
    @media screen and (max-width: 960px) {
        .portal-enter{
            
            
            aspect-ratio: 4/3;
        }
    
    
      }
    @media screen and (max-width: 850px) {
        .portal-enter{
            
            
            aspect-ratio: 3/3;
        }
    
    
      }
    @media screen and (max-width: 660px) {
        .portal-enter{
            
            
            aspect-ratio: 1/1;
        }
    
        .terre-l,.arbre,.imagex,.terre-r{
            background-size: contain;
        }
    
        .perso{
            background-size: 40%;
        }
    
      }
    
    /*****Fin responsive portal****/
    

    /* From Uiverse.io by MuhammadHasann */ 
.button {
  --black-700: hsla(0 0% 12% / 1);
  --border_radius: 9999px;
  --transtion: 0.3s ease-in-out;
  --offset: 2px;

  cursor: pointer;
  position: relative;

  display: flex;
  align-items: center;
  gap: 0.5rem;

  transform-origin: center;

  padding: 1rem 2rem;
  background-color: transparent;

  border: none;
  border-radius: var(--border_radius);
  transform: scale(calc(1 + (var(--active, 0) * 0.1)));

  transition: transform var(--transtion);
}

.button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
  height: 100%;
  background-color: var(--black-700);

  border-radius: var(--border_radius);
  box-shadow: inset 0 0.5px hsl(0, 0%, 100%), inset 0 -1px 2px 0 hsl(0, 0%, 0%),
    0px 4px 10px -4px hsla(0 0% 0% / calc(1 - var(--active, 0))),
    0 0 0 calc(var(--active, 0) * 0.375rem) hsl(260 97% 50% / 0.75);

  transition: all var(--transtion);
  z-index: 0;
}

.button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
  height: 100%;
  background-color: hsla(260 97% 61% / 0.75);
  background-image: radial-gradient(
      at 51% 89%,
      hsla(266, 45%, 74%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 100% 100%, hsla(266, 36%, 60%, 1) 0px, transparent 50%),
    radial-gradient(at 22% 91%, hsla(266, 36%, 60%, 1) 0px, transparent 50%);
  background-position: top;

  opacity: var(--active, 0);
  border-radius: var(--border_radius);
  transition: opacity var(--transtion);
  z-index: 2;
}

.button:is(:hover, :focus-visible) {
  --active: 1;
}
.button:active {
  transform: scale(1);
}

.button .dots_border {
  --size_border: calc(100% + 2px);

  overflow: hidden;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: var(--size_border);
  height: var(--size_border);
  background-color: transparent;

  border-radius: var(--border_radius);
  z-index: -10;
}

.button .dots_border::before {
  content: "";
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: left;
  transform: rotate(0deg);

  width: 100%;
  height: 2rem;
  background-color: white;

  mask: linear-gradient(transparent 0%, white 120%);
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.button .sparkle {
  position: relative;
  z-index: 10;

  width: 1.75rem;
}

.button .sparkle .path {
  fill: currentColor;
  stroke: currentColor;

  transform-origin: center;

  color: hsl(0, 0%, 100%);
}

.button:is(:hover, :focus) .sparkle .path {
  animation: path 1.5s linear 0.5s infinite;
}

.button .sparkle .path:nth-child(1) {
  --scale_path_1: 1.2;
}
.button .sparkle .path:nth-child(2) {
  --scale_path_2: 1.2;
}
.button .sparkle .path:nth-child(3) {
  --scale_path_3: 1.2;
}

@keyframes path {
  0%,
  34%,
  71%,
  100% {
    transform: scale(1);
  }
  17% {
    transform: scale(var(--scale_path_1, 1));
  }
  49% {
    transform: scale(var(--scale_path_2, 1));
  }
  83% {
    transform: scale(var(--scale_path_3, 1));
  }
}

.button .text_button {
  position: relative;
  z-index: 10;

  background-image: linear-gradient(
    90deg,
    hsla(0 0% 100% / 1) 0%,
    hsla(0 0% 100% / var(--active, 0)) 120%
  );
  background-clip: text;

  font-size: 1rem;
  color: transparent;
}

      </style>



