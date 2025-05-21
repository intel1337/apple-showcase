<script>
  import { cart, removeFromCart, updateQuantity, clearCart } from '$lib/stores/cart';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  $: console.log('Current cart:', $cart); // declaration reactive (useeffect ou signal dans angular avec le $)
  
  let loading = false;
  let error = '';

  async function handleCheckout() {
    loading = true;
    error = '';

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        goto('/login');
        return;
      }
      // map pour stripe
      const products = $cart.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description
          },
          unit_amount: Math.round(item.price * 100)  // centime pour stripe
        },
        quantity: item.quantity
      }));

      if (products.length === 0) {
        error = 'Cart is empty';
        return;
      }
      // request stripe vers le backend
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products })
      });

      const data = await response.json();
      
      if (response.ok) {
        window.location.href = data.url; // Utilise window.location.href pour les URLs externes
      } else {
        error = data.error;
      }
    } catch (err) {
      error = 'Something went wrong';
    } finally {
      loading = false;
    }
  }

  function calculateTotal() {
    return $cart.reduce((total, item) => total + (item.price * item.quantity), 0); // calcul total du panier
  }
</script>

<div class="container">
  <h1 class="text-center mb-4">Your Cart</h1>
  
  {#if error}
    <!--  si erreur display erreur -->
    <div class="error-message">
      {error}
    </div>
  {:else}
    <!--  si panier vide display empty-cart -->
    {#if $cart.length === 0}
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <a href="/products" id="continue-shopping" class="btn">Continue Shopping</a>
      </div>
    {:else}

      <div class="cart-items">
        {#each $cart as item}
          <div class="card cart-item">
            {#if item.image}
              <img src={item.image} alt={item.name} class="cart-item-image" />
            {/if}
            <div class="cart-item-details">
              <h3>{item.name}</h3>
              <p class="price">${item.price}</p>
              <div class="quantity-controls">
                <button class="btn-quantity" on:click={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>-</button> <!--  + ou - button-->
                <span class="quantity">{item.quantity || 1}</span>
                <button class="btn-quantity" on:click={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
              </div>
            </div>
            <button class="btn remove" on:click={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        {/each}
      </div>
      
      <div class="sommaire">
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
        <button class="btn" on:click={handleCheckout} disabled={loading}>
          {loading ? 'Processing...' : 'Proceed to Checkout'} <!--  state de l'app -->
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  #continue-shopping {
    margin-top: 20px;
  }
  .empty-cart {
    text-align: center;
    padding: 40px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .empty-cart p {
    margin-bottom: 40px;
  }

  .cart-items {
    display: grid;
    gap: 20px;
    margin-bottom: 40px;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .cart-item-image {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 8px;
    background-color: white;
    padding: 10px;
  }

  .cart-item-details {
    flex: 1;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-quantity {
    background-color: black;
    color: white;
    text-align: center;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    transition: 0.6s;
    margin-top:2px;
  }
  .btn-quantity:hover {
    background-color: var(--apple-blue);
    color: white;
  }

  .quantity {
    font-size: 16px;
    min-width: 30px;
    text-align: center;
  }

  .sommaire {
    text-align: right;
    padding: 20px;
    background-color: var(--apple-gray);
    border-radius: 18px;
  }

  .remove {
    background-color: #9b9b9b;
    color: white;
    transition: 0.6s;
  }

  .remove:hover {
    background-color: #ff453a;
  }

  .error-message {
    background-color: #ff3b30;
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
  }
</style> 