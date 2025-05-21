<!-- Imports -->
<script>
	import "../app.css"; //  équivalent globals.css
	import appleLogo from "$lib/images/apple-logo.png"; //  équivalent assets et le $lib c'est la manière de faire les imports en svelte
	import Navbar from '$lib/components/Navbar.svelte'; //  équivalent components
	import { page } from '$app/stores';
	import PageTransition from '$lib/components/PageTransition.svelte';
</script> 
<!-- Layout global comme sur next-->

<Navbar /> <!--   Composant tah React meme syntaxe -->

<PageTransition>
	<slot />
</PageTransition>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #ffffff;
	}

	nav {
		backdrop-filter: blur(5px);
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		background-color: rgba(255, 255, 255, 0.8);
	}

	.nav-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 44px;
	}

	.logo {
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	.logo-img {
		height: 30px;
		width: auto;
	}

	.nav-links {
		display: flex;
		gap: 30px;
	}

	.nav-links a {
		color: var(--apple-dark);
		text-decoration: none;
		font-size: 14px;
		opacity: 0.8;
		transition: all 0.3s ease;
		padding: 8px 12px;
		border-radius: 20px;
	}

	.nav-links a:hover {
		opacity: 1;
		background-color: rgba(0, 0, 0, 0.05);
	}

	main {
		padding-top: 44px;
		min-height: 100vh;
		position: relative;
	}
</style>


	