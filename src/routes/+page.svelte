

<script>
    import Firsta from "./Firsta.svelte";
    import Header from "./Header.svelte";
    //ici pas de chargement de Jeu

</script>
<svelte:head>
    <title> Test Colyseus et Threlte </title>
</svelte:head>

<div class="flex justify-center items-center relative style--bg">
    <Header/>
    <Firsta/>
</div>

<style is:global>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');
	html{
		@apply text-gray-700;
		scroll-behavior: smooth;
	}
	.style--bg{
		background:
			linear-gradient(-90deg, rgba(0,0,0,.05) 1px, transparent 1px),
			linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), 
			linear-gradient(-90deg, rgba(0, 0, 0, .04) 1px, transparent 1px),
			linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px),
			linear-gradient(transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px),
			linear-gradient(-90deg, #aaa 1px, transparent 1px),
			linear-gradient(-90deg, transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px),
			linear-gradient(#aaa 1px, transparent 1px),
			#f2f2f2;
		background-size:
			4px 4px,
			4px 4px,
			80px 80px,
			80px 80px,
			80px 80px,
			80px 80px,
			80px 80px,
			80px 80px;
		background-position: -40px -40px;
	}
	*{
		font-family: 'Roboto Mono', monospace;
	}

	.border-gradient {
		border: 10px solid;
		border-image-slice: 1;
		border-width: 2px;
	}
	.border-gradient-purple {
		border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
	}

	.gradient-text {
		/* Fallback: Set a background color. */
		background-color: red;
		/* Create the gradient. */
		background-image: linear-gradient(45deg, rgb(22, 22, 22), #e65531);
		
		/* Set the background size and repeat properties. */
		background-size: 100%;
		background-repeat: repeat;

		/* Use the text as a mask for the background. */
		/* This will show the gradient as a text color rather than element bg. */
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent; 
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
	}
	.gradient-text-1 {
		/* Fallback: Set a background color. */
		background-color: #CA4246;
		font-weight: bold;
		
		/* Create the gradient. */
		background-image: linear-gradient(
				45deg,
				#CA4246 16.666%, 
				#E16541 16.666%, 
				#E16541 33.333%, 
				#F18F43 33.333%, 
				#F18F43 50%, 
				#8B9862 50%, 
				#8B9862 66.666%, 
				#476098 66.666%, 
				#476098 83.333%, 
				#A7489B 83.333%);
		
		/* Set the background size and repeat properties. */
		background-size: 100%;
		background-repeat: repeat;

		/* Use the text as a mask for the background. */
		/* This will show the gradient as a text color rather than element bg. */
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent; 
		
		/* Animate the text when loading the element. */
			/* This animates it on page load and when hovering out. */
			/* animation: rainbow-text-simple-animation-rev 0.75s ease forwards; */

	}

	.underline-text-a{
		position: relative;
	}

	.underline-text-a::after{
		content: '';
		width: 100%;
		height: 20px;
		bottom: 0;
		left: 0;
		z-index: -1;
		transform: translateY(-2px);
		background-color: rgb(255, 81, 0); 
		position: absolute;
	}

	.underline-text{
		position: relative;
		cursor: default;
	}

	.underline-text::after{
		content: '';
		width: 100%;
		height: 32px;
		bottom: 0;
		left: 0;
		z-index: -1;
		transform: translateY(-8px);
		/* background-color: rgb(255, 81, 0);  */
		position: absolute;
		opacity: 0.3;

		/* background-color: #CA4246; */
		
		/* Create the gradient. */
		background-image: linear-gradient(
				45deg,
				#CA4246 16.666%, 
				#E16541 16.666%, 
				#E16541 33.333%, 
				#F18F43 33.333%, 
				#F18F43 50%, 
				#8B9862 50%, 
				#8B9862 66.666%, 
				#476098 66.666%, 
				#476098 83.333%, 
				#A7489B 83.333%);
		
		/* Set the background size and repeat properties. */
		background-size: 100%;
		background-repeat: repeat;
		transition: 0.16s ease-in-out;
		filter: blur(10px);
		
	}
	/* .underline-text:hover::after{
		opacity: 1;
	} */
</style>
