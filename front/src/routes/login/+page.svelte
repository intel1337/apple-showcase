<script>
    import { goto } from '$app/navigation';
    import { auth } from '$lib/stores/auth';
    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin() {
        loading = true;
        error = "";
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Save token dans localstorage
                localStorage.setItem('token', data.token);
                auth.login(data.token);
                goto('/');
            } else {
                error = data.error;
            }
        } catch (err) {
            error = "Something went wrong";
        } finally {
            loading = false;
        }
    }
</script>

<div class="login-container">
    <div class="login-box">
        <h1>Sign In</h1>
        
        {#if error}
            <div class="error-message">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleLogin}>
            <div class="input-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email} 
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password} 
                    placeholder="Enter your password"
                    required
                />
            </div>

            <button type="submit" class="login-button" disabled={loading}>
                Login</button>
        </form>

        <div class="signup-link">
            Don't have an account? <a href="/register">Sign up</a>
        </div>
        <div class="signup-link">
            <a href="/admin">Admin ?</a>
        </div>

    </div>
</div>

<style>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f5f5f7;
    }

    .login-box {
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }

    h1 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 24px;
        color: #1d1d1f;
    }

    .input-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        color: #1d1d1f;
        font-size: 14px;
    }

    input {
        width: 100%;
        padding: 12px;
        border: 1px solid #d2d2d7;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.3s;
    }

    input:focus {
        outline: none;
        border-color: #0071e3;
    }

    .login-button {
        width: 100%;
        padding: 12px;
        background-color: #0071e3;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .login-button:hover {
        background-color: #0077ed;
    }

    .login-button:disabled {
        background-color: #999;
        cursor: not-allowed;
    }

    .error-message {
        background-color: #ff3b30;
        color: white;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
    }

    .signup-link {
        text-align: center;
        margin-top: 20px;
        color: #1d1d1f;
    }

    .signup-link a {
        color: #0071e3;
        text-decoration: none;
    }

    .signup-link a:hover {
        text-decoration: underline;
    }
</style> 