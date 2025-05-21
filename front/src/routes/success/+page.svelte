<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { cart, clearCart } from '$lib/stores/cart';
    // state variables, elles sont dans le code car c'est un composant statique donc menfou un peu
    let sessionData = null;
    let loading = true;
    let error = null;

    onMount(async () => { // équivalent ngOnInit / onload
        // clear le panier
        clearCart();
        // récupérer l'id de la session stripe
        const sessionId = $page.url.searchParams.get('session_id');
        
        if (sessionId) {
            try {
                const response = await fetch(`http://localhost:3000/api/stripe/session/${sessionId}`);
                if (!response.ok) throw new Error('Failed to load order details');
                const data = await response.json();
                sessionData = data;
            } catch (err) {
                error = 'Failed to load order details';
                console.error(err);
            }
        } else {
            error = 'No session ID found';
        }
        loading = false; // set loading à false pour afficher la page
    });
</script>

<div class="success-container">
    {#if loading} <!--  équivalent des If dans le html d'angular -->
        <div class="loading">
            <h2>Loading your order details...</h2>
        </div>
    {:else if error} <!--  équivalent des If dans le html d'angular -->
        <div class="error">
            <h2>{error}</h2>
            <a href="/" class="btn">Return to Home</a>
        </div>
    {:else if sessionData} <!--  équivalent des If dans le html d'angular -->
        <div class="success-content">
            <div class="success-header">
                <h1>Thank You for Your Order!</h1>
                <p class="success-message">Your payment was successful and your order has been confirmed.</p>
            </div>
            
            <div class="order-details">
                <h2>Order Details</h2>
                <div class="order-info">
                    <p><strong>Order ID:</strong> {sessionData.id}</p>
                    <p><strong>Total Amount:</strong> ${(sessionData.amount_total / 100).toFixed(2)}</p> <!-- tofixed car c'est des centimes et vu qu'on divise par 100 -->
                    <p><strong>Payment Status:</strong> {sessionData.payment_status}</p>
                </div>

                {#if sessionData.customer_details}
                    <div class="customer-info">
                        <h3>Customer Information</h3>
                        <p><strong>Email:</strong> {sessionData.customer_details.email}</p>
                        {#if sessionData.customer_details.name}
                            <p><strong>Name:</strong> {sessionData.customer_details.name}</p>
                        {/if}
                    </div>
                {/if}

                <div class="items-list">
                    <h3>Order Items</h3>
                    {#each sessionData.line_items as item}
                        <div class="item">
                            <p class="item-description">{item.description}</p>
                            <p class="item-quantity">Quantity: {item.quantity}</p>
                            <p class="item-price">${(item.amount_total / 100).toFixed(2)}</p>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="actions">
                <a href="/" class="btn primary">Continue Shopping</a>
                <a href="/products" class="btn secondary">View Products</a>
            </div>
        </div>
    {:else}
        <div class="error">
            <h2>No order details found</h2>
            <a href="/" class="btn">Return to Home</a>
        </div>
    {/if}
</div>

<style>
    .success-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        text-align: center;
    }

    .loading {
        color: #1d1d1f;
    }

    .success-content {
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .success-header {
        margin-bottom: 40px;
    }

    h1 {
        color: #1d1d1f;
        margin-bottom: 15px;
        font-size: 32px;
    }

    .success-message {
        color: #86868b;
        font-size: 18px;
        margin-bottom: 30px;
    }

    .order-details {
        background: #f5f5f7;
        padding: 30px;
        border-radius: 12px;
        margin: 20px 0;
        text-align: left;
    }

    .order-details h2 {
        color: #1d1d1f;
        margin-bottom: 20px;
        font-size: 24px;
    }

    .order-info {
        margin-bottom: 30px;
    }

    .order-info p {
        margin: 10px 0;
        color: #1d1d1f;
        font-size: 16px;
    }

    .customer-info {
        margin: 30px 0;
        padding-top: 20px;
        border-top: 1px solid #d2d2d7;
    }

    .customer-info h3 {
        color: #1d1d1f;
        margin-bottom: 15px;
        font-size: 20px;
    }

    .items-list {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #d2d2d7;
    }

    .items-list h3 {
        color: #1d1d1f;
        margin-bottom: 15px;
        font-size: 20px;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #d2d2d7;
    }

    .item:last-child {
        border-bottom: none;
    }

    .item-description {
        flex: 1;
        color: #1d1d1f;
    }

    .item-quantity {
        color: #86868b;
        margin: 0 20px;
    }

    .item-price {
        color: #1d1d1f;
        font-weight: 600;
    }

    .actions {
        margin-top: 40px;
        display: flex;
        gap: 20px;
        justify-content: center;
    }

    .btn {
        display: inline-block;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn.primary {
        background-color: #0071e3;
        color: white;
    }

    .btn.primary:hover {
        background-color: #0077ed;
    }

    .btn.secondary {
        background-color: #f5f5f7;
        color: #1d1d1f;
    }

    .btn.secondary:hover {
        background-color: #e5e5e7;
    }

    .error {
        color: #ff3b30;
        padding: 20px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error h2 {
        margin-bottom: 20px;
    }
</style>