<script lang="ts">
    import "../../global.css"
    export let data;
    let inputElement: HTMLInputElement;

    const handleSubmit = async () =>{
        const token = inputElement.value
        if(token){
            const req = await fetch("/api/authorize-browser",{method:"POST",body:JSON.stringify({token}),headers:{"Content-Type":"application/json"}})
            const res = await req.json()
            if(res.success){
                location.reload()
            }
        }
    }
</script>

{#if data.authorized}
<div class="auth-container">
    <div class="slot-container">
        <slot/>
    </div>
    <div class="auth-bg-container">
        <img class="auth-bg" src="/images/auth-bg-3.jpg" alt="man holding phone">
    </div>
    
</div>

{:else}

    <input type="text" placeholder="Enter Token" bind:this={inputElement}>
    <button on:click={handleSubmit} type="submit">Submit Token</button>

{/if}


<style>
    .auth-container{
        display: flex;
        font-size: 2rem;
        height: 100vh;
        width: 100vw;
        background-color: var(--secondary);
        overflow: hidden;
    }

    .slot-container{
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .slot-container::before{
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom:0;
        right: 0;
        opacity: 0.1;
        background-image: url("/images/auth-bg-3.jpg");
        background-size: cover;
        background-position: center;
    }

    .auth-bg-container{
        display: none;
    }

    .auth-bg{
        height: 100%;
        width: 100%;
        object-fit: fill;
        opacity: 0.4;
    }

    @media (min-width: 1024px){
        .slot-container::before{
            display: none;
        }
        .auth-bg-container{
            display: block;
            flex-basis: 50%;
        }
        .slot-container{
            flex-basis: 50%;
        }
    }
</style>