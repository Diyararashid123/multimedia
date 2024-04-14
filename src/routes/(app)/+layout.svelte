<script lang="ts">
    import "../../global.css"
    import Header from "$lib/components/header/Header.svelte";
    import Sidenav from "$lib/components/sidenav/Sidenav.svelte";
    import RecentMessages  from "$lib/components/RecentMessages.svelte";
    import Toast from "$lib/components/Toast.svelte";
  import { mainContainerStore } from "$lib/helpers/stores";


  export let data;
  let main: HTMLDivElement;

</script>

    <Header user={data.user} notifications={data.notifications}/>
    <main>
        <Sidenav user={data.user?.username}/>
        <div bind:this={main} class="main-container">
            <slot/>
        </div>
        <RecentMessages/>
        <Toast/>
        <button class="header" class:active={$mainContainerStore.active} on:click={()=>main.scrollTo({ top: 0, behavior: "smooth" })}>
            <i class="fa-solid fa-arrow-up "></i>
        </button>
    </main>




<style>

    main{
        display: grid;
        grid-template-columns: 0.25fr 0.5fr 0.4fr;
        grid-column-gap: 2rem;
        height: 90vh;
        margin: 0 2rem;
    }

    .main-container{
        position: relative;
        display: grid;
        grid-template-columns: repeat(1, 100%);
        gap:1rem;
        overflow-y: scroll;
        scrollbar-width: none;
        height: 100%;
    }        
    .header{
        all: unset;
        cursor: pointer;
        position: fixed;
        bottom: 5%;
        right: 5%;
        padding: 0.5rem;
        background-color: var(--action);
        border-radius: 8px;
        z-index: 999;
        text-align: center;
        opacity: 0;
        width: fit-content;
        transition: opacity 0.5s ease;
        font-size: 2rem;
    }

    .active{
        visibility: visible; /* Show the element */
        opacity: 1; /* Make it opaque */
        transform: translateY(0); /* Move it to its original position */
        animation: slide-up 0.5s forwards; /* Apply the slide-up animation */
    }

    @keyframes slide-up {
        0% {
            transform: translateY(20px); /* Start a bit lower */
        }
        50% {
            transform: translateY(-10px); /* Slide down a bit */
        }
        100% {
            transform: translateY(0); /* End at the original position */
        }
    }


    @media(max-width: 1440px){
        main{
            margin: 0 10rem;
        }
    }
    @media(max-width: 1024px){
        main{
            margin: 0 3rem;
        }
    }
</style>