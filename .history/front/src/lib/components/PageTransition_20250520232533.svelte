<script>
    import { fly, fade } from 'svelte/transition';
    import { page } from '$app/stores';
</script>

<div 
    in:fly={{ y: 20, duration: 400, delay: 200 }}
    out:fade={{ duration: 200 }}
    class="page-transition"
>
    <slot />
</div>

<style>
    .page-transition {
        position: relative;
        width: 100%;
        min-height: 100vh;
        display: block;
    }
</style> 