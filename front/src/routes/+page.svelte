<script>
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart';

	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import appleLogo from '$lib/images/apple.svg';
	
	let products = [];
	
	// ANIMATION SCROLL VENANT PAS DE MOI
	onMount(async () => { // equivalent onload // ngOntInit un truc comme ca
		const response = await fetch('http://localhost:3000/all-products');
		products = await response.json();

		// Add scroll animation
		const hero = document.querySelector('.hero');
		window.addEventListener('scroll', () => {
			const scrolled = window.scrollY;
			if (hero) {
				hero.style.transform = `translateY(${scrolled * 0.5}px)`;
				hero.style.opacity = 1 - (scrolled * 0.003);
			}
		});
	});

	function addToCart(product) {
		cart.update(items => {
			const existingItem = items.find(item => item.id === product.id);
			if (existingItem) {
				return items.map(item => 
					item.id === product.id 
						? {...item, quantity: (item.quantity || 1) + 1}
						: item
				);
			}
			return [...items, {...product, quantity: 1}];
		});
	}
</script>
<!-- METADATA -->
<svelte:head> 
	<title>Apple</title>
	<meta name="description" content="Apple template shop" />
</svelte:head>

<!-- Composant hero -->
<a href="/products" class="links">
	<section class="hero">
		<div class="container">
			<h1>Welcome to Apple.</h1>
		</div>
		<div class="logo-container">
			<button class="btn">Discover</button>
		</div>
	</section>
</a>

<section class="featured">
	<div class="container">
		<h2>Featured Products</h2>
		<div class="products-grid">
			{#each products.slice(0, 3) as product} <!--  Each = Boucles (conditionel dans l'html comme sur angular)-->
				<div class="card">
					<img src={product.image} alt={product.name} />
					<h3>{product.name}</h3> <!--  crochets avec des waves pour les variables etc = {{}} -->
					<p>{product.description}</p>
					<p class="price">${product.price}</p>
					<button class="btn" on:click={() => addToCart(product)}>Add to Cart</button>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Css tout dégeu  */
	a {
		text-decoration: none;
		color: inherit;
	}	

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.hero {
		background-image: url($lib/images/background.png);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		padding: 100px 0;
		text-align: center;
		width: 100%;
		height: 100vh;
		transition: transform 0.1s ease-out, opacity 0.1s ease-out;
		will-change: transform, opacity;
	}

	.hero h1 {
		font-size: 48px;
		margin-bottom: 20px;
		color: rgb(245, 245, 245);
		margin-bottom: 50%;
	}

	.hero p {
		margin-top: 30%;
		font-size: 24px;
		color: rgb(255, 255, 255);
		margin-bottom: 30px;
	}

	.featured {
		padding: 40px 0;
	}

	h2 {
		text-align: center;
		margin-bottom: 40px;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30px;
	}

	.card {
		padding: 20px;
		border-radius: 12px;
		background: white;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
	}

	.card img {
		width: 100%;
		height: 200px;
		object-fit: contain;
		border-radius: 8px;
		margin-bottom: 20px;
		background-color: white;
		padding: 20px;
	}

	.price {
		font-size: 24px;
		font-weight: bold;
		margin: 20px 0;
	}

	.btn {
		width: 100%;
		padding: 10px;
		border: none;
		border-radius: 15px;
		background: var(--apple-blue);
		color: white;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.btn:hover {
		background: black;
		color: white;
	}

	#discover {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s ease;
		position: relative;
	}

	#discover:hover {
		transform: scale(1.1);
	}

	.logo-img{
		filter: invert(1);
		width: 30px;
		height: 30px;
		object-fit: contain;
		position: relative;
		margin-left: 10px;
	}

	.logo-container{
		border-radius: 25px;
		background-color: var(--apple-blue);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 15%;
		transition: transform 0.3s ease;

	}
	.logo-container:hover{
		transform: scale(1.05);
		cursor: pointer;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		background-color: black;

	}
</style>
