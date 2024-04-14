<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import LoadingSpinner from "../LoadingSpinner.svelte";

  export let postId: string;
  export let likecount: number;
  let initalLoading: boolean = true;

  type response = {
        username: string;
        profilePictureUrl: string;
    }[];

  let liked = false;
  let likeDialog:HTMLDialogElement

  let promise: Promise<response>;

  async function toggleLike() {
    // pre-firing the like to make it feel instant for smooth user experience
    if(liked) likecount -= 1;
    else likecount += 1;
    liked = !liked;

    const response = await fetch(`/api/likes/PostLikes`, {
      method: !liked ? "DELETE": "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: postId }),
    });

    const data = await response.json();
    if(data.redirect) goto("/login")
    if (data.error) {
      // if the request fails undo the pre-firing
      if(liked) likecount -= 1;
      else likecount += 1;
      liked = !liked;
    }
  }

  async function fetchUsers() {
        const data = await fetch(`/api/post-likes/?post=${postId}`);
        const res = await data.json();
        if (res.error) {
        return Promise.reject(res.message);
        }
        return res.data;
    }

  onMount(async()=>{

    const req = await fetch(`/api/likes/PostLikes?id=${postId}`)
    const res = await req.json()
    liked = res.liked;
    initalLoading = false;
    })

</script>

{#if !initalLoading}
  <button class:liked={liked} class="main-btn">

    <button on:click={toggleLike}
      ><img
      class:like ={liked}
        src={!liked ? "/images/icons/like.png" : "/images/icons/likeFilled.png"}
        alt="Like Icon"
      /></button
    >    
      <button on:click={()=> {likeDialog.showModal(); promise = fetchUsers()}}>
          {likecount}
      </button>

  </button>
{/if}


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog  bind:this={likeDialog} on:click|self={()=>likeDialog.close()}>
  {#await promise}
    <LoadingSpinner/>
  {:then likes}
    {#if likes}
      {#if likes.length === 0}
        <p>no users found</p>
      {:else}
        <div class="users-container">
          {#each likes as user}
            <a href={`/users/${user.username}`} class="user">
              <img src={user.profilePictureUrl} alt="Profile Icon" />
              <p>{user.username}</p>
            </a>
          {/each}
        </div>
      {/if}
    {/if}
  {:catch error}
    <p>{error}</p>
  {/await}
</dialog>

<style>
  button {
    all: unset;
  }

  img.like {
    width: 1.6rem; 
    height: auto; 
  }
  img:not(.like) {
    width: 1.6rem; 
    height: auto; 
  }

  .main-btn{
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  dialog::backdrop{
    backdrop-filter: blur(5px);
  }

  dialog[open]{
    display: grid;
  }

  dialog{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); 
    background-color: var(--background);
    color: var(--text-primary);
    padding: 1rem;
    min-width: 50%;
    max-height: 50%;
    overflow: auto;
    border-radius: 1rem;
    border: 1px solid transparent;
    box-shadow: -2px -2px 6px -4px rgba(0, 0, 0, 0.5), 2px 2px 6px 4px rgba(0, 0, 0, 0.5);
  }

  .users-container {
      display: grid;
      gap: 1rem;
    }
    .user > img {
        border-radius: 50%;
        object-fit: cover;
        width: 5rem;
        height: 5rem;
    }
    .user {
        text-decoration: none;
        color: var(--text);
        font-size: 1.25rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(5, 5, 5, 0.8);
    }
</style>
