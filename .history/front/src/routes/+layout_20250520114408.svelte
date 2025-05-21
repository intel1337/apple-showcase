<script>
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			visit <a href="http://localhost:5173/about"> our site</a> to learn about SvelteKit
		</p>
	</footer>
</div>

<style>

</style>


	