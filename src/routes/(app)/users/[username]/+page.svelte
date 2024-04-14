<script lang="ts">

    import Post from "$lib/components/post/Post.svelte";

  export let data;

</script>

{#if data.user && data.userPosts}

  <div>
    {#each data.userPosts as post, i}

    <Post post={post} firstPost={i === 0} lastPost={i===data.userPosts.length - 1}/>
   
    {/each}
  </div>
{/if}
