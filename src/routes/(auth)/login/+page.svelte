<script lang="ts">
  import AuthForm from "$lib/components/auth/AuthForm.svelte";

</script>
<div class="container box-shadow">
    <div class="header">
        <h1 ><a href="/register">Sign up</a></h1>
        <h2 class="active">Log in</h2>
      
    </div>
        <AuthForm action="login"/>
        <div class="footer-links">
            <p><a href="/">Forgot Username</a></p>
            <p><a href="/">Reset Password</a></p>
        </div>
    </div>
    

<style>
.container {
    z-index: 1;
    min-height: 50%;
    border-radius: 0.5rem;
    justify-self: center;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid hsl(240, 3.7%, 15.9%);
    position: relative;
}

.container::before{
    content:"";
    position: absolute;
    top: 0;
    left: 0;
    bottom:0;
    right: 0;
    opacity: 0.1;
    background-color: black;
    z-index: -1;
}

.header {
    display: flex;
    justify-content: space-between;
    place-self: start;
    padding: 2rem;
    width: 100%;
}



.footer-links {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0rem 1rem;
    font-size: 1.5rem;
    margin-top: 1rem;
}

h1{
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: -0.025em;
}

h2{
    
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: -0.025em;
}

p {
    color: hsl(240, 5%, 64.9%);
}

a{
    color: inherit;
    text-decoration: inherit;
}


.active{
    position: relative;
}

.active::before{
    content:"";
    position: absolute;
    top: 0;
    left: 50%;
    bottom :-1rem;
    height: 5rem;
    transform: rotate(90deg); 
    width: 100%;
    background-color: var(--action);
    filter: drop-shadow(0px 0px 5px rgba(108, 92, 214, 0.50));
    width: 2px;
}

@media (min-width: 1024px){
    .container {
        font-size: 1rem;
        width: 60%;
    }

    .footer-links{
        font-size: 1rem;
        flex-direction: row;
        justify-content: center;
        margin-top: 0;
    }

}
</style>