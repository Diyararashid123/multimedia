<script lang="ts">
  export let data;
  import SearchResult from "$lib/components/search/SearchResult.svelte";
  import Post from "$lib/components/post/Post.svelte";
</script>

<SearchResult/>
<div class="posts-container">
  {#each data.allPosts as post, i}
    <Post {post} firstPost = {i === 0} lastPost={i === data.allPosts.length - 1} />
  {/each}
</div>

<style>
  .posts-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
