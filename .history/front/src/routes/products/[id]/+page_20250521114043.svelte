<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { cart } from '$lib/stores/cart';
    import App from '$lib/components/AppleProduct.svelte';

    let product = null;
    let loading = true;
    let error = null;
    let quantity = 1;

    onMount(async () => {
        try {
            const response = await fetch(`http://localhost:3000/product/${$page.params.id}`);
            if (!response.ok) throw new Error('Product not found');
            product = await response.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

    function addToCart() {
        if (product) {
            cart.update(items => {
                const existingItem = items.find(item => item.id === product.id);
                if (existingItem) {
                    return items.map(item => 
                        item.id === product.id 
                            ? {...item, quantity: (item.quantity || 1) + quantity}
                            : item
                    );
                }
                return [...items, {...product, quantity}];
            });
        }
    }
</script>

{#if loading}
    <div class="loading">Loading...</div>
{:else if error}
    <div class="error">{error}</div>
{:else if product}
    <AppleStyle 
        title={product.name}
        subtitle={product.description}
        backgroundColor="#fbfbfd"
    >
        <div class="product-detail">
            <div class="product-image-container">
                {#if product.image}
                    <img src={product.image} alt={product.name} class="product-image" />
                {/if}
            </div>
            
            <div class="product-info">
                <div class="price">${product.price}</div>
                
                <div class="quantity-selector">
                    <button class="btn-quantity" on:click={() => quantity = Math.max(1, quantity - 1)}>-</button>
                    <span class="quantity">{quantity}</span>
                    <button class="btn-quantity" on:click={() => quantity++}>+</button>
                </div>

                <button class="add-to-cart" on:click={addToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    </AppleStyle>
{/if}

<style>
    .product-detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-top: 40px;
    }

    .product-image-container {
        position: relative;
        padding-top: 100%;
    }

    .product-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 20px;
        background-color: white;
        padding: 20px;
    }

    .product-info {
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
    }

    .price {
        font-size: 32px;
        font-weight: 600;
        color: #1d1d1f;
    }

    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .btn-quantity {
        background-color: #1d1d1f;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.3s ease;
    }

    .btn-quantity:hover {
        background-color: #0071e3;
    }

    .quantity {
        font-size: 20px;
        min-width: 40px;
        text-align: center;
    }

    .add-to-cart {
        background-color: #0071e3;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 980px;
        font-size: 17px;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .add-to-cart:hover {
        background-color: #0077ed;
    }

    .loading, .error {
        text-align: center;
        padding: 40px;
        font-size: 20px;
    }

    .error {
        color: #ff3b30;
    }

    @media (max-width: 768px) {
        .product-detail {
            grid-template-columns: 1fr;
        }
    }
</style> 