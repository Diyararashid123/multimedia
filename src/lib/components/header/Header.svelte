<script lang="ts"> 
  import NotificationBell from "./NotificationBell.svelte";
  import type { NotificationType } from "$lib/helpers/types";
  import type {UserType} from "../../helpers/types"
  export let user: UserType | undefined | null;
  export let notifications: NotificationType[] | undefined
</script>

<header>

  <a href="/"><img src="/images/icons/logo.png" alt="Website Logo" /></a>
  <div class="user-info">
    
    {#if !user}
      <button><a href="/login">Login</a></button>
      <button><a href="/register">Register</a></button>
    {:else}
      <NotificationBell {notifications}/>
      {`Welcome ${user.username}`}
      <button><a href="/logout">Logout</a></button>
    {/if}

  </div>
</header>

<style>
  .user-info{
    justify-self: flex-end;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button{
    all: unset;
  }

  a{
    text-decoration: none;
    color: inherit;
  }
  a:hover{
    color: var(--action)
  }
  header {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    align-items: center;
    grid-column: span 3;
    margin: 0 4rem;
    height: 10vh;

  }

  img{
    width: 6rem;
    margin-left: 1rem;
  }

  @media(max-width:968px){
    header{
      display: none;
    }
  }
  </style>