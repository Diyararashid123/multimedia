<script lang="ts">
    export let action:string;
</script>

<div class="form-container">
    <form method="post" class="form" action={action === "login" ? "/login" : "/register"}>

        <input required type="text" name="username" placeholder="Username"/>
        <input required type="password" name="password" placeholder="Password"/>

        {#if action === "register"}
            <input required type="password" name="password" placeholder="Repeat Password"/>
        {/if}
        <button type="submit">{action === "login" ? "Login" : "Register"}</button>
        
    </form>
</div>

<style>

.form-container {
    display: grid;
    flex: 1;
}

.form {
    align-self: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 0.5rem;
}


input {
    padding: 1.5rem;
    border-radius: 1rem;
    height: auto;
    box-shadow: -2px -2px 6px -4px rgba(226, 224, 224, 0.5) inset, 2px 2px 6px 4px rgba(0, 0, 0, 0.5) inset;
    background-color: transparent;
    border: none;
    color: inherit;
    font: inherit;
    resize: none;
    transition: border-radius 0.5s;
    font-size: 1.5rem;
}

button {
    background-color: var(--action);
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 0.5rem;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 80%;
    text-align: center;
}



@media (min-width: 1024px){

    .form{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        width: 100%;
    }

    input{
        width: 80%;
        justify-self: center;
        font-size: medium;
    }

    .form > button{
        justify-self: center;
        width: 40%;
        background: transparent;
        border: 1px solid var(--action); 
    }
}
</style>