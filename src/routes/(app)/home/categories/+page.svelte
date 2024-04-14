<script lang="ts">
  import Categories from "$lib/components/Categories.svelte";
  export let data;
    import Post from "$lib/components/post/Post.svelte";
 
</script>
   {#if data.groups}
        <Categories groups={data.groups}/>
    {/if}   

{#if data.categoriesPost}
<div class="posts-container">
    {#each data.categoriesPost as row, i}
        <Post post={row} firstPost={i === 0} lastPost={i===data.categoriesPost.length - 1}/>
    {/each}
</div>
{/if}
