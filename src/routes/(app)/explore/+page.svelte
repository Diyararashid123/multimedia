<script lang="ts">
  export let data;

  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import Post from "$lib/components/post/Post.svelte";
  import Search from "$lib/components/search/Search.svelte";


  let startIndex = 0;
  const usersToShow = 3; 


  $: disableLeft = startIndex <= 0;


  $: disableRight = startIndex + usersToShow >= data.recommendedUsers.length;

  function moveRight() {
    if (!disableRight) startIndex += 1;
  }

  function moveLeft() {
    if (!disableLeft) startIndex -= 1;
  }

  $: visibleUsers = data.recommendedUsers.slice(startIndex, startIndex + usersToShow).map(r => r.user);
</script>

<Search />
<div class="container">
  <button 
    class="navigation-button left" 
    on:click={moveLeft}
    disabled={disableLeft}
  >&lt;</button>

  <div class="grid">
    {#each visibleUsers as user (user.username)}
    <a href={`/users/${user.username}`} class="user-link">
    <div class="user" style="background-image: url({user.profileBackgroundUrl});"> 
        <div class="info">
          <img src={user.profilePictureUrl} alt="{user.username}'s profile picture" /> 
          <p>{user.username}</p>
          <p class="bio">{user.bio && user.bio.length > 25 ? user.bio.slice(0, 25) + '...' : (user.bio ? user.bio : '')}</p>
        </div>
    
    </a>
    {/each}
  </div>

  <button 
    class="navigation-button right" 
    on:click={moveRight}
    disabled={disableRight}
  >&gt;</button>
</div>

{#if data.recommendedUsers.length === 0}
  <p>No users found.</p>
{/if}

{#await data.streamed.allPosts}
<LoadingSpinner/>
{:then allPosts}

<div class="posts-container">
  {#each allPosts as post, i}
      {#if post}
      <Post {post} firstPost={i === 0} lastPost={i === allPosts.length - 1} />
      {/if}
  {/each}
</div>

{/await}

<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem; 
  width: 100%;
}

.grid {
  display: grid;
  gap: 0.3rem;
  grid-auto-flow: column;
  grid-auto-columns: minmax(10rem, 1fr); 
  overflow-x: hidden; 
  padding: 0.3rem 0;
  grid-template-rows: min-content;
}

.user {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.3rem;
  border-radius: 0.75rem; 
  background-size: cover;
  background-position: center;
  height: 120px; 
  position: relative;
  overflow: hidden;
}

.user:hover,
.user:focus {
  transform: translateY(-5px);
  box-shadow:
    0 8px 10px -5px rgba(0, 0, 0, 0.1),
    0 3px 5px -2px rgba(0, 0, 0, 0.1); 
}

.info {
  display: flex;
  flex-direction: column; 
  align-items: flex-start; 
  justify-content: center; 
  background: rgba(5, 5, 5, 0.8);
  border-radius: 0.75rem; 
  padding: 0.5rem; 
  gap: 5px; 
}

img {
  width: 1.8rem; 
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  align-self: center; 
}

p {
  color: white;
  margin: 0;
  font-size: 0.6rem; 
}

.bio {
  color: rgba(255, 255, 255, 0.7); 
  font-size: 0.7rem;
  max-width: 100%; 
  word-wrap: break-word; 
}

.navigation-button {
  cursor: pointer; 
  padding: 0.25rem 0.5rem;
}

.posts-container {
  display: grid;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  width: 90%;
}

a{
  text-decoration: none;
}

</style>
