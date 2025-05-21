<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let products = [];
    let loading = true;
    let error = null;
    let showAddProduct = false;
    let showUpdateProduct = false;
    let selectedProduct = null;
    let isAuthorized = false;
    let userData = null;

    // data
    let newProduct = {
        name: '',
        description: '',
        price: '',
        image: ''
    };
// verifie auth avant de laisser la page a l'utiisateur
    onMount(async () => {
        await checkAuth();
    });

    async function checkAuth() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                error = 'Authentication required';
                loading = false;
                return;
            }

            const response = await fetch('http://localhost:3000/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 403) {
                error = 'Access denied: Admin privileges required';
                loading = false;
                return;
            }

            if (!response.ok) {
                throw new Error('Authentication failed');
            }
            userData = await response.json();
            isAuthorized = true;
            await fetchProducts();
        } catch (err) {
            if (err.message === 'Authentication failed') {
                error = 'Authentication failed';
            } else {
                error = 'An error occurred while checking authorization';
            }
            console.error(err);
            loading = false;
        }
    }

    async function fetchProducts() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/all-products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            products = await response.json();
        } catch (err) {
            error = 'Failed to load products';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function handleAddProduct() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/create-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) throw new Error('Failed to create product');
            
            await fetchProducts();
            showAddProduct = false;
            newProduct = { name: '', description: '', price: '', image: '' };
        } catch (err) {
            error = 'Failed to create product';
            console.error(err);
        }
    }

    async function handleUpdateProduct() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/update-product/${selectedProduct.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(selectedProduct)
            });

            if (!response.ok) throw new Error('Failed to update product');
            
            await fetchProducts();
            showUpdateProduct = false;
            selectedProduct = null;
        } catch (err) {
            error = 'Failed to update product';
            console.error(err);
        }
    }

    async function handleDeleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')){
            return;
        } 

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/delete-product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete product');
            
            await fetchProducts();
        } catch (err) {
            error = 'Failed to delete product';
            console.error(err);
        }
    }

    function openEditModal(product) {
        selectedProduct = { ...product };
        showUpdateProduct = true;
    }
</script>

<div class="admin-container">
    {#if error}
        <div class="error-message">
            {error}
            {#if error === 'Authentication required' || error === 'Authentication failed'}
                <button class="btn" on:click={() => goto('/login')}>Go to Login</button>
            {:else if error === 'Access denied: Admin privileges required'}
                <button class="btn" on:click={() => goto('/')}>Return to Home</button>
            {/if}
        </div>
    {:else if loading}
        <div class="loading">Loading...</div>
    {:else if isAuthorized}
        <div class="admin-header">
            <h1>Admin Dashboard</h1>
            {#if userData}
                <div class="user-info">
                    <p>Welcome, {userData.name}</p>
                    <p class="role">Admin</p>
                </div>
            {/if}
        </div>
        
        <div class="actions">
            <button class="btn" on:click={() => showAddProduct = true}>
                Add New Product
            </button>
        </div>
        <div class="products-grid">
            {#each products as product}
                <div class="product-card">
                    {#if product.image}
                        <img src={product.image} alt={product.name} class="product-image" />
                    {/if}
                    <div class="product-info">
                        <h3>{product.name}</h3>
                        <p class="price">${product.price}</p>
                        <p class="description">{product.description}</p>
                    </div>
                    <div class="product-actions">
                        <button class="btn edit" on:click={() => openEditModal(product)}>
                            Edit
                        </button>
                        <button class="btn delete" on:click={() => handleDeleteProduct(product.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if showAddProduct}
    <div class="modal">
        <div class="modal-content">
            <h2>Add New Product</h2>
            <form on:submit|preventDefault={handleAddProduct}>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" bind:value={newProduct.name} required />
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" bind:value={newProduct.description} required></textarea>
                </div>
                <div class="form-group">
                    <label for="price">Price</label>
                    <input type="number" id="price" bind:value={newProduct.price} step="0.01" required />
                </div>
                <div class="form-group">
                    <label for="image">Image URL</label>
                    <input type="url" id="image" bind:value={newProduct.image} />
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn">Add Product</button>
                    <button type="button" class="btn cancel" on:click={() => showAddProduct = false}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

{#if showUpdateProduct}
    <div class="modal">
        <div class="modal-content">
            <h2>Edit Product</h2>
            <form on:submit|preventDefault={handleUpdateProduct}>
                <div class="form-group">
                    <label for="edit-name">Name</label>
                    <input type="text" id="edit-name" bind:value={selectedProduct.name} required />
                </div>
                <div class="form-group">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description" bind:value={selectedProduct.description} required></textarea>
                </div>
                <div class="form-group">
                    <label for="edit-price">Price</label>
                    <input type="number" id="edit-price" bind:value={selectedProduct.price} step="0.01" required />
                </div>
                <div class="form-group">
                    <label for="edit-image">Image URL</label>
                    <input type="url" id="edit-image" bind:value={selectedProduct.image} />
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn">Update Product</button>
                    <button type="button" class="btn cancel" on:click={() => showUpdateProduct = false}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    h1 {
        color: #1d1d1f;
        margin-bottom: 30px;
        text-align: center;
    }

    .actions {
        margin-bottom: 30px;
        text-align: right;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }

    .product-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .product-info {
        margin-bottom: 15px;
    }

    .product-info h3 {
        color: #1d1d1f;
        margin-bottom: 10px;
    }

    .price {
        color: #0071e3;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .description {
        color: #86868b;
        font-size: 0.9em;
        margin-bottom: 15px;
    }

    .product-actions {
        display: flex;
        gap: 10px;
    }

    .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.3s;
    }

    .btn.edit {
        background-color: #0071e3;
        color: white;
    }

    .btn.delete {
        background-color: #ff3b30;
        color: white;
    }

    .btn:hover {
        opacity: 0.9;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #1d1d1f;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #d2d2d7;
        border-radius: 8px;
        font-size: 1em;
    }

    .form-group textarea {
        height: 100px;
        resize: vertical;
    }

    .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .btn.cancel {
        background-color: #86868b;
        color: white;
    }

    .error-message {
        background-color: #ff3b30;
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin: 20px auto;
        text-align: center;
        max-width: 500px;
    }

    .error-message .btn {
        margin-top: 15px;
        background-color: white;
        color: #ff3b30;
    }

    .error-message .btn:hover {
        background-color: #f5f5f7;
    }

    .loading {
        text-align: center;
        color: #1d1d1f;
        padding: 20px;
    }

    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .user-info {
        text-align: right;
    }

    .user-info p {
        margin: 0;
        color: #1d1d1f;
    }

    .user-info .role {
        color: #0071e3;
        font-weight: 500;
        margin-top: 5px;
    }
</style> 