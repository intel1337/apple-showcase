<script>
  import { onMount } from 'svelte';
  import { cart } from '$lib/stores/cart';
  import { goto } from '$app/navigation';
  import AppleStyle from '$lib/components/AppleStyle.svelte';
  
  let products = [];
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/all-products');
      if (!response.ok) throw new Error('Failed to fetch products');
      products = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  function viewProduct(id) {
    goto(`/products/${id}`);
  }

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

<AppleStyle 
  title="Our Products"
  subtitle="Discover our latest collection"
  backgroundColor="#fbfbfd"
>
  {#if loading}
    <div class="loading">Loading...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <div class="products-grid">
      {#each products as product}
        <div class="product-card">
          {#if product.image}
            <img 
              src={product.image} 
              alt={product.name} 
              class="product-image"
              on:click={() => viewProduct(product.id)}
            />
          {/if}
          <div class="product-info">
            <h3 on:click={() => viewProduct(product.id)}>{product.name}</h3>
            <p class="price">${product.price}</p>
            <button class="btn" on:click={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</AppleStyle>

<style>
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
  }

  .product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .product-card:hover {
    transform: translateY(-5px);
  }

  .product-image {
    width: 100%;
    height: 300px;
    object-fit: contain;
    cursor: pointer;
    transition: opacity 0.3s ease;
    background-color: white;
    padding: 20px;
  }

  .product-image:hover {
    opacity: 0.9;
  }

  .product-info {
    padding: 20px;
    text-align: center;
  }

  .product-info h3 {
    margin: 0 0 10px 0;
    font-size: 20px;
    color: #1d1d1f;
    cursor: pointer;
  }

  .price {
    font-size: 24px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 10px 0;
  }

  .btn {
    background-color: #0071e3;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 980px;
    font-size: 17px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }

  .btn:hover {
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
</style> 