<script>
    import { goto } from '$app/navigation';
    // équivalents hooks react 
    let name = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let error = "";
    let loading = false;

    async function handleRegister() {
        loading = true;
        error = "";
        if (password !== confirmPassword) {
            error = "Passwords don't match";
            loading = false;
            return;
        }
        try { // logique  request
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                goto('/'); // redirige vers la page d'accueil le routing c'est comme next
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

<div class="register-container">
    <div class="register-box">
        <h1>Create Account</h1>
        
        {#if error} <!--  if error est pas "" display erreur -->
            <div class="error-message">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleRegister}> <!--  équivalent de onSubmit  d'angular  c'est un event handler-->
            <div class="input-group">
                <label for="name">Full Name</label>
                <input 
                    type="text" 
                    id="name" 
                    bind:value={name}
                    placeholder="Enter your full name"
                    required
                /> <!--  le bind c'est comme la fonction des usestate dans react on bind aussi l'input a tel valeur -->
            </div>

            <div class="input-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email} 
                    placeholder="Enter your email"
                    required
                /> <!--  pareil un bind -->
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password} 
                    placeholder="Create a password"
                    required
                />
            </div>

            <div class="input-group">
                <label for="confirmPassword">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    bind:value={confirmPassword} 
                    placeholder="Confirm your password"
                    required
                />
            </div>

            <button type="submit" class="register-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'} 
                <!--  hook pour display un texte en fonction du state -->
            </button>
        </form>

        <div class="login-link">
            Already have an account? <a href="/login">Sign in</a>
        </div>
    </div>
</div>

<style>
    .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f5f5f7;
    }

    .register-box {
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
        color: black;
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

    .register-button {
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

    .register-button:hover {
        background-color: #0077ed;
    }

    .register-button:disabled {
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

    .login-link {
        text-align: center;
        margin-top: 20px;
        color: #1d1d1f;
    }

    .login-link a {
        color: #0071e3;
        text-decoration: none;
    }

    .login-link a:hover {
        text-decoration: underline;
    }
</style>
