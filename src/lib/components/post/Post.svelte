<script lang="ts">
  import type { PostWithProfile } from "$lib/helpers/types";
  import { SvelteComponent, createEventDispatcher, onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import PostLikeBtn from "./postLikeBtn.svelte";
  import PostSettings from "./PostSettings.svelte";
  import type { groupsTable } from "$lib/server/schema";
  import { mainContainerStore } from "$lib/helpers/stores";
  import Linebreak from "../Linebreak.svelte";

  export let post: PostWithProfile;
  let days: number;
  let groups: typeof groupsTable.$inferSelect[]
  let postContainer: HTMLDivElement;
  let currentView: 'image' | 'video' ='image';
  export let lastPost: boolean = false;
  let lineBreak:SvelteComponent;
  let categories: any[] = [];


  $: {
    if (post.post.pictureUrl && !post.post.videoUrl) {
      currentView = 'image';
    } else if (!post.post.pictureUrl && post.post.videoUrl) {
      currentView = 'video';
    } else {
      currentView = 'image'; 
    }
  }

 

  // helps us with intersection observer to know when the first post has dissapeared
  export let firstPost: boolean = false;
  let observer: IntersectionObserver | null = null;

  const actionWhenInViewPort= (e:HTMLElement) =>{
    if(!firstPost) return

    observer = new IntersectionObserver(entries =>{
      scrollToPost(entries[0].isIntersecting)
    })
    observer.observe(e)
  }

  const scrollToPost = (intersecting: boolean) =>{
      if(intersecting) mainContainerStore.set({active: false})
      else mainContainerStore.set({active: true})
  }

  const deletePost = () =>{
    postContainer.remove()
    lineBreak.$destroy()
    if(window.location.pathname.includes("post")) goto("/")
  }

  const navigateToPost = () => goto(`/post/${post.post.id}`);

  onMount(async() => {

    const response = await fetch(`/api/postCategory?postId=${post.post.id}`);
        const data = await response.json();
        categories = data.data;
    



    const req = await fetch("/api/groups")
    const res = await req.json()
    if(!res.error)  groups = res

    const originalTime = post.post.timestamp!.getTime();
    const currTime = new Date().getTime();
    const diffHours = (currTime - originalTime) / 3600000;

    days = Math.floor(diffHours / 24);

  });

  // navigating between pages causes the observer to trigger because the post attached to it is no longer in the viewport
  onDestroy(() => {
    if(observer){
      observer.disconnect()
      observer = null;
    }
  });

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div use:actionWhenInViewPort on:click|self={navigateToPost} class="post-container" bind:this={postContainer}>
  <div on:click|self={navigateToPost} class="post-header">
    <div class="post-author">
      <a href={`/users/${post.author.username}`}>
        <img
          class="profile-image"
          src={post.author.profilePictureUrl}
          alt="Profile icon"
        />
        {#if post.author.firstName || post.author.lastName}
          <div>
            <p class="author-name">
              {`${
                post.author.firstName
                  ? post.author.firstName.concat(
                      " ",
                      post.author.lastName || ""
                    )
                  : "" + post.author.lastName
                    ? post.author.lastName
                    : ""
              }`}
            </p>
            <p class="author-secondary">{"@" + post.author.username}</p>
          </div>
        {:else}
          <p class="author">{post.author.username}</p>
        {/if}
      </a>

      <p class="timestamp">{`.${days}d`}</p>
    </div>

    <PostSettings on:delete={deletePost} postId={post.post.id} {groups}/>
  </div>

  <div class="post-content">
    {#if currentView === 'image' && post.post.pictureUrl}
      <div class="image-container">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={post.post.pictureUrl} alt="Post image" class="profile-pic" />
      </div>
    {/if}
    {#if currentView === 'video' && post.post.videoUrl}
      <div class="video-container">
        <video src={post.post.videoUrl} controls>
          <track kind="captions" />
        </video>
      </div>
    {/if}
  </div>
  
  <div class="p">
    <p>{post.post.content}</p>
  </div>

  <div class="icons-container">
    <button>
      <PostLikeBtn postId={post.post.id} likecount={post.post.likeCount} />
    </button>

    <button>
      <img src="/images/icons/comment.png" alt="Reply Icon" />
      <p>{post.post.commentCount}</p>
    </button>

      <div class="views"> 
      <i class="fa-regular fa-eye fa-flip-vertical fa-lg"></i>
      <p>{post.post.viewCount}</p>
  </div>
    
  </div>


  
  <div class="view-toggle">
    <!-- This will appear only when we have a video/picture  to show and donst work if we have single video and picture-->
    {#if post.post.pictureUrl && post.post.videoUrl}
      <button
        on:click={() => currentView = 'image'}
        class:active={currentView === 'image'}
        title="Show Image"
        aria-label="Show Image">
      </button>
      <button
        on:click={() => currentView = 'video'}
        class:active={currentView === 'video'}
        title="Show Video"
        aria-label="Show Video">
      </button>
    {/if}
    
  </div>
  <div class="categories">
    {#each categories as item}
      <p class="category-btn">
        {item.name}
      </p>
    {/each}
  </div>
</div>
{#if !lastPost}
  <Linebreak bind:this={lineBreak}/>
{/if}

<style>
  .post-container {
    display: grid;
    gap: 0.75rem;
    cursor: pointer;
    margin: auto;
    padding: 0rem 0.35rem ;
    border-radius: 16px;
    min-width: 100%;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .post-container:hover {
    transform: translateY(-5px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1);
  }
  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .post-author,
  .post-author > a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .author {
    font-size: 1.2rem;
  }

  .author-name {
    font-size: 1.2rem;
  }

  .author-secondary {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .timestamp {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .views{
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .post-content {
    color: var(--text-primary);
    line-height: 22px;
  }

  .icons-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: fit-content;
  }

  .icons-container > button {
    display: flex;
    align-items: center;
    color: inherit;
    gap: 0.5rem;
    min-width: fit-content;
  }

  button {
    padding: 0.45rem;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
  }

  .icons-container > button > img {
    width: 100%;
  }

  .profile-image {
    border-radius: 50%;
    object-fit: cover;
    width: 3rem;
    height: 3rem;
  }


  .image-container,.video-container {
    display: flex;
    justify-content: center;
    justify-items: center;
    width: 100%;
    margin-top: 1rem;
  }

  .image-container img,.video-container video{
    height: 35rem; 
    width: 90%;
    max-width: 80%; 
    min-width: 80%;
    object-fit: cover; 
    border-radius: 8px; 
  }

  .view-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;

}

.view-toggle button {
  background-color: transparent; 
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.view-toggle button:hover, .view-toggle button:focus {
  background-color: var(--action); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.view-toggle button.active {
  background-color: var(--action); 
}

  video {
    width: 90%;
    height: auto;
    border-radius: 8px;
  }

  .p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

.categories{
  display: flex;
  gap: 0.6rem;
  
}

  .category-btn {
    all: unset;
    border: 1px solid var(--action);
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.8rem;
    background-color: var(--secondary);
    cursor: pointer;
    padding: 0.8rem;
    max-width: fit-content;
    justify-content: space-between;
}


</style>
