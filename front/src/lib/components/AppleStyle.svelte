<script>
    export let title = '';
    export let subtitle = '';
    export let backgroundColor = 'white';
    export let textColor = '#1d1d1f';
</script>

<div class="apple-section" style="background-color: {backgroundColor}; color: {textColor};">
    <div class="container">
        <h1 class="title">{title}</h1>
        {#if subtitle}
            <p class="subtitle">{subtitle}</p>
        {/if}
        <slot></slot>
    </div>
</div>

<style>
    .apple-section {
        padding: 80px 0;
        text-align: center;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .title {
        font-size: 48px;
        font-weight: 600;
        margin-bottom: 10px;
        letter-spacing: -0.003em;
    }

    .subtitle {
        font-size: 24px;
        font-weight: 400;
        margin-bottom: 40px;
        color: #86868b;
    }

    @media (max-width: 768px) {
        .title {
            font-size: 32px;
        }

        .subtitle {
            font-size: 19px;
        }
    }
</style> 