<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let userData = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                goto('/login');
                return;
            }

            const response = await fetch('http://localhost:3000/profile', {
                headers: {
                    'Authorization': `Bearer ${token}` // on envoie le token dans le header 
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    goto('/login'); // si on est pas connecté on redirige vers la page de login un peu comme Next.redirect() just ca a le nom d'une instruction assembleur
                    return;
                }
                throw new Error('Failed to load profile');
            }

            userData = await response.json();
        } catch (err) {
            error = 'Failed to load profile data';
            console.error(err);
        } finally {
            loading = false;
        }
    });
</script>

<div class="profile-container">
    {#if loading}
        <div class="loading">
            <h2>Loading your profile...</h2>
        </div>
    {:else if error}
        <div class="error">
            <h2>{error}</h2>
            <a href="/" class="btn">Return to Home</a>
        </div>
    {:else if userData}
        <div class="profile-content">
            <div class="profile-header">
                <h1>My Profile</h1>
            </div>

            <div class="profile-section">
                <h2>Personal Information</h2>
                <div class="info-card">
                    <div class="info-item">
                        <label>Name</label>
                        <p>{userData.name}</p>
                    </div>
                    <div class="info-item">
                        <label>Email</label>
                        <p>{userData.email}</p>
                    </div>
                    <div class="info-item">
                        <label>Member Since</label>
                        <p>{new Date(userData.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <!-- Pas codé mais order history -->
            <div class="profile-section">
                <h2>Past Orders</h2>
                <div class="orders-placeholder">
                    <p>Your order history will appear here</p>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .profile-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .loading {
        text-align: center;
        color: #1d1d1f;
        padding: 40px;
    }

    .error {
        background-color: #ff3b30;
        color: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        margin: 20px 0;
    }

    .profile-content {
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .profile-header {
        background-color: #f5f5f7;
        padding: 30px;
        text-align: center;
    }

    h1 {
        color: #1d1d1f;
        margin: 0;
        font-size: 32px;
    }

    .profile-section {
        padding: 30px;
        border-bottom: 1px solid #d2d2d7;
    }

    .profile-section:last-child {
        border-bottom: none;
    }

    h2 {
        color: #1d1d1f;
        margin-bottom: 20px;
        font-size: 24px;
    }

    .info-card {
        background: #f5f5f7;
        border-radius: 12px;
        padding: 20px;
    }

    .info-item {
        margin-bottom: 15px;
    }

    .info-item:last-child {
        margin-bottom: 0;
    }

    label {
        display: block;
        color: #86868b;
        font-size: 14px;
        margin-bottom: 5px;
    }

    p {
        color: #1d1d1f;
        margin: 0;
        font-size: 16px;
    }

    .orders-placeholder {
        background: #f5f5f7;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        color: #86868b;
    }

    .btn {
        display: inline-block;
        padding: 12px 24px;
        background-color: #0071e3;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        transition: background-color 0.3s;
    }

    .btn:hover {
        background-color: #0077ed;
    }
</style> 