<script lang="ts">
    import "../../global.css"
    import Header from "$lib/components/header/Header.svelte";
    import Sidenav from "$lib/components/sidenav/Sidenav.svelte";
    import RecentMessages  from "$lib/components/RecentMessages.svelte";
    import Toast from "$lib/components/Toast.svelte";
  import { mainContainerStore, AiChatStore, postOptionsStore, notificationsBellStore } from "$lib/helpers/stores";
  import MobileHeader from "$lib/components/header/MobileHeader.svelte";
  import AiChat from "$lib/components/AiChat.svelte";


  export let data;
  let main: HTMLDivElement;

  // turn off all the active elements when the main container is clicked (such as chatbox, notifications bell, post options, etc.)
  const toggleElements = () =>{
    AiChatStore.set({active: false})
    postOptionsStore.set({activePost: null})
    notificationsBellStore.set({active: false})
  }

</script>

    <Header user={data.user} notifications={data.notifications}/>
    <MobileHeader user={data.user} />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <main on:click|self={toggleElements}>
        <Sidenav user={data.user?.username}/>
        <div bind:this={main} class="main-container">
            <slot/>
        </div>
        <!-- svelte-ignore missing-declaration -->
        <RecentMessages/>
        <Toast/>
        <button class="header" class:active={$mainContainerStore.active} on:click={()=>main.scrollTo({ top: 0, behavior: "smooth" })}>
            <i class="fa-solid fa-arrow-up "></i>
        </button>
        <!--might add something else here later so just wrapping it in something from now-->
        <button on:click={()=>AiChatStore.set({active: !$AiChatStore.active})} class="bot-icon">
            <i class="fa-brands fa-android"></i>
        </button>
        <AiChat/>
    </main>




<style>

    main{
        display: grid;
        grid-template-columns: 0.25fr 1fr 0.4fr;
        grid-column-gap: 2rem;
        height: 90vh;
    }

    .main-container{
        position: relative;
        overflow-y: scroll;
        scrollbar-width: none;
        height: 100%;
    }        
    .header{
        all: unset;
        cursor: pointer;
        position: fixed;
        bottom: 5%;
        left: 2%;
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

    .bot-icon{
        all:unset;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 2%;
        right: 1%;
        font-size: 2rem;
        color: var(--action);
        cursor: pointer;
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
            justify-content: center;
        }
    }
    @media(max-width: 1024px){
        main{
            margin: 0 3rem;
        }
    }

    @media(max-width:968px){
        main{
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>