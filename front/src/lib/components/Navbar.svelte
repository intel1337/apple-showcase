<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { cart } from '$lib/stores/cart';
    import { auth } from '$lib/stores/auth';
    import appleLogo from "$lib/images/apple-logo.png";

    function handleLogout() {
        auth.logout();
        goto('/login');
    }

    $: totalQuantity = $cart.reduce((sum, item) => sum + (item.quantity || 1), 0); 
</script>

<nav>
    <div class="container">
        <div class="nav-content">
            <a href="/" class="logo">
                <img src={appleLogo} alt="Apple logo" class="logo-img" />
            </a>
            <div class="nav-links">
                <a href="/products" class="nav-link">
                    <span class="material-icons">devices</span>
                    Products
                </a>
                <a href="/cart" class="nav-link">
                    <span class="material-icons">shopping_cart</span>
                    Cart {#if totalQuantity > 0}
                        <span class:red={totalQuantity > 0}>({totalQuantity})</span>
                    {/if}
                </a>
                {#if $auth}
                    <a href="/profile" class="nav-link">
                        <span class="material-icons">account_circle</span>
                        My Profile
                    </a>
                    <button class="nav-link logout" on:click={handleLogout}>
                        <span class="material-icons">logout</span>
                        Logout
                    </button>
                {:else}
                    <a href="/login" class="nav-link">
                        <span class="material-icons">login</span>
                        Login
                    </a>
                    <a href="/register" class="nav-link">
                        <span class="material-icons">person_add</span>
                        Register
                    </a>
                {/if}
                <a href="/about" class="nav-link">
                    <span class="material-icons">info</span>
                    About
                </a>
            </div>
        </div>
    </div>
</nav>

<style>
    nav {
        backdrop-filter: blur(5px);
        position: sticky;
        top: 0;
        z-index: 100;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
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
        align-items: center;
    }

    .nav-link {
        color: var(--apple-dark);
        text-decoration: none;
        font-size: 14px;
        opacity: 0.8;
        transition: all 0.3s ease;
        padding: 8px 12px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .nav-link:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
    }

    .material-icons {
        font-size: 20px;
        opacity: 0.8;
    }

    .logout {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px 12px;
        font-size: 14px;
        color: var(--apple-dark);
        opacity: 0.8;
        transition: all 0.3s ease;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .logout:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
    }

    .red {
        color: #ff3b30;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        .nav-link span:not(.red):not(.material-icons) {
            display: none;
        }
        .material-icons {
            font-size: 24px;
        }
    }
</style> 