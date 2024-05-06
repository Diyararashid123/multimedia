<script lang="ts">
  import { slide } from "svelte/transition";
  import type { UserType } from "../../helpers/types";
  import MobileSideBarBtn from "../sidenav/MobileSideBarBtn.svelte";
  export let user: UserType | undefined | null;

  let sidebar:HTMLDivElement;
  let activeSidebar: boolean = false;

  const toggleSidebar = () =>{
    activeSidebar = !activeSidebar
  }
</script>

<header>
  <div>
    <button on:click={toggleSidebar}><i class="fa-solid fa-bars"></i></button>
  </div>
  <a href="/"><img src="/images/icons/logo.png" class="website-logo" alt="Website Logo" /></a>
</header>

{#if activeSidebar}

<button style="all:unset;" on:click={toggleSidebar}><div class="backdrop" ></div></button>

<div in:slide={{duration: 500, axis: 'y', }} out:slide={{duration: 300, axis: 'y'}} bind:this={sidebar} class="sidebar box-shadow">
    <button on:click={toggleSidebar} class="sidebar-icon"><i class="fa-solid fa-circle-xmark"></i></button>

    <div class="user-info" class:logged-in={user}>
        {#if !user}
            <button><a href="/login">Login</a></button>
            <button><a href="/register">Register</a></button>
        {:else}
            <div style="display: flex; align-items:center">
                <img src={user.profilePictureUrl} alt="User Profile"/>
                {`Welcome ${user.username}`}
            </div>

            <button><a href="/logout">Logout</a></button>
        {/if}
    </div>

    <ul>
        <a href="/" on:click={toggleSidebar}>
            <li class="icon-container">
                <MobileSideBarBtn imgRoute={"home.png"} name={"Home"} />
            </li>
        </a>

        <a href="/explore" on:click={toggleSidebar}>
            <li class="icon-container">
                <MobileSideBarBtn imgRoute={"search.png"} name={"Explore"} />
            </li>
        </a>

        <a href="/groups" on:click={toggleSidebar}>
            <li class="icon-container">
                <MobileSideBarBtn imgRoute={"inbox.png"} name={"Groups"} />
            </li>
        </a>

        <a href={user ? `/users/${user.username}` : "/login"} on:click={toggleSidebar}>
            <li class="icon-container">
                <MobileSideBarBtn username={user?.username} imgRoute={"profile.png"} name={"Profile"} />
            </li>
        </a>

        <a href="/notifications" on:click={toggleSidebar}>
            <li class="icon-container">
                <MobileSideBarBtn imgRoute={"notification-bell.png"} name={"Notifications"} />
            </li>
        </a>

        <a href="/settings/profilesetting" on:click={toggleSidebar}>
            <li class="icon-container">
                <MobileSideBarBtn imgRoute={"settings.png"} name={"Settings"} />
            </li>
        </a>

    </ul>
</div>

{/if}

<style>

  a {
    text-decoration: none;
    color: inherit;
  }
  a:hover {
    color: var(--action);
  }

  header {
    display: none;
    position: relative;
    justify-content: space-between;
    gap: 3rem;
    align-items: center;
    grid-column: span 3;
    margin: 0 4rem;
    height: 10vh;
  }

  img {
    width: 4rem;
    margin-left: 1rem;
  }
  
  .website-logo{
    width: 6rem;
  }

  .user-info{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.5rem;
    margin-top: 2rem;
  }

  .logged-in{
    justify-content: space-between;
  }

  .sidebar{
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    min-width: fit-content;
    width: 55vw;
    height: 100vh;
    background-color: var(--background);
    z-index: 999;
    padding: 1rem;
  }

  .sidebar > ul{
    list-style: none;
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .sidebar > ul > a > li{
    display: flex;
  }

    .sidebar-icon{
        all: unset;
        font-size: 3rem;
    }

    .backdrop{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.5);
        z-index: 999;
    }

    .user-info > button{
        font-size: 1rem;
    }

  

  @media (max-width: 968px) {
    header {
      display: flex;
    }
    .sidebar{
        display: block;
    }
  }

  @media(max-width: 584px){
    .user-info{
        flex-direction: column;
    }
  }
</style>
