<script lang="ts">
  import AuthForm from "$lib/components/auth/AuthForm.svelte";
</script>
<div class="container box-shadow">
  <div class="header">
		<h1 class="active">Sign up</h1>
		<h2><a href="/login">Log in</a></h2>
</div>


<AuthForm action="register"/>


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
}
	</style>