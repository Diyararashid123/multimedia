<script lang="ts">
    import Linebreak from "$lib/components/Linebreak.svelte";
    import Post from "$lib/components/post/Post.svelte";
    import { onMount } from "svelte";

  export let data;

</script>

{#if data.user}

  <div>
    {#each data.userLikes as post, i}

    <Post post={post} firstPost={i === 0} lastPost={i===data.userLikes.length - 1}/>
    <Linebreak/>
    {/each}
  </div>
{/if}
